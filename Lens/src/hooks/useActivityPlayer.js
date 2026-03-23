import { startTransition, useEffect, useEffectEvent, useMemo, useState } from 'react'
import {
  getActivityProgress,
  getActivityStartPosition,
  getNextPosition,
  getPreviousActivityPosition,
  getRiveStateSnapshot,
  getSessionProgress,
  getTotalStepCount,
} from '../../shared/activityPlayerCore.js'
import { movementPlayActivities } from '../data/activities.js'
import { createWebNarrationService } from '../services/webNarrationService.js'

const PLAYBACK_SLOWDOWN = 1.35

export function useActivityPlayer({ activities = movementPlayActivities, prefersReducedMotion = false } = {}) {
  const [narrationService] = useState(() => createWebNarrationService())

  const [activityIndex, setActivityIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [replayToken, setReplayToken] = useState(0)
  const [voiceAvailable, setVoiceAvailable] = useState(() => narrationService.getSupported())
  const [voiceLabel, setVoiceLabel] = useState(() => narrationService.getStatusLabel())

  const currentActivity = activities[activityIndex]
  const currentStep = currentActivity.steps[stepIndex]

  const totalSteps = useMemo(() => getTotalStepCount(activities), [activities])
  const sessionProgress = useMemo(
    () => getSessionProgress(activities, activityIndex, stepIndex),
    [activities, activityIndex, stepIndex],
  )
  const activityProgress = useMemo(
    () => getActivityProgress(currentActivity, stepIndex),
    [currentActivity, stepIndex],
  )
  const riveState = useMemo(
    () =>
      getRiveStateSnapshot({
        activities,
        activityIndex,
        stepIndex,
        isPlaying,
        prefersReducedMotion,
      }),
    [activities, activityIndex, stepIndex, isPlaying, prefersReducedMotion],
  )

  const speakCurrentStep = useEffectEvent(() => {
    narrationService.setMuted(isMuted)
    narrationService.speak(currentStep.line, {
      calm: currentActivity.tone === 'calm' || prefersReducedMotion,
    })
    setVoiceAvailable(narrationService.getSupported())
    setVoiceLabel(narrationService.getStatusLabel())
  })

  const advanceStep = useEffectEvent(() => {
    const nextPosition = getNextPosition(activities, activityIndex, stepIndex)

    if (!nextPosition) {
      setIsPlaying(false)
      narrationService.cancel()
      return
    }

    startTransition(() => {
      setActivityIndex(nextPosition.activityIndex)
      setStepIndex(nextPosition.stepIndex)
    })
  })

  useEffect(() => {
    narrationService.prime()
  }, [narrationService])

  const retrySpeechAfterActivation = useEffectEvent(() => {
    if (isMuted || !isPlaying || narrationService.hasSpokenAtLeastOnce()) {
      return
    }

    narrationService.prime()
    speakCurrentStep()
  })

  useEffect(() => {
    const handleUserActivation = () => {
      retrySpeechAfterActivation()
    }

    window.addEventListener('pointerdown', handleUserActivation, { passive: true })
    window.addEventListener('keydown', handleUserActivation)

    return () => {
      window.removeEventListener('pointerdown', handleUserActivation)
      window.removeEventListener('keydown', handleUserActivation)
    }
  }, [])

  useEffect(() => {
    narrationService.setMuted(isMuted)

    if (!isPlaying) {
      narrationService.cancel()
      return undefined
    }

    speakCurrentStep()

    const baseTimeoutMs = prefersReducedMotion
      ? Math.max(currentStep.durationMs, 2300)
      : currentStep.durationMs
    const timeoutMs = Math.round(baseTimeoutMs * PLAYBACK_SLOWDOWN)

    const timeoutId = window.setTimeout(() => {
      advanceStep()
    }, timeoutMs)

    return () => {
      window.clearTimeout(timeoutId)
    }
  }, [
    activityIndex,
    currentActivity,
    currentStep,
    isMuted,
    isPlaying,
    narrationService,
    prefersReducedMotion,
    replayToken,
    stepIndex,
  ])

  useEffect(() => {
    return () => {
      narrationService.cancel()
    }
  }, [narrationService])

  function moveToPosition(nextPosition) {
    startTransition(() => {
      setActivityIndex(nextPosition.activityIndex)
      setStepIndex(nextPosition.stepIndex)
      setIsPlaying(true)
      setReplayToken((token) => token + 1)
    })
  }

  function play() {
    setIsPlaying(true)
    setReplayToken((token) => token + 1)
  }

  function pause() {
    setIsPlaying(false)
  }

  function replayActivity() {
    moveToPosition(getActivityStartPosition(activityIndex))
  }

  function goToActivity(index) {
    moveToPosition(getActivityStartPosition(index))
  }

  function goToNextActivity() {
    if (activityIndex >= activities.length - 1) {
      setIsPlaying(false)
      return
    }

    moveToPosition(getActivityStartPosition(activityIndex + 1))
  }

  function goToPreviousActivity() {
    const previousPosition = getPreviousActivityPosition(activityIndex)

    if (!previousPosition) {
      return
    }

    moveToPosition(previousPosition)
  }

  function toggleMute() {
    const nextMuted = !isMuted
    setIsMuted(nextMuted)
    narrationService.setMuted(nextMuted)
    setVoiceLabel(narrationService.getStatusLabel())
  }

  return {
    activities,
    activityIndex,
    activityProgress,
    currentActivity,
    currentStep,
    isMuted,
    isPlaying,
    isSessionComplete:
      !isPlaying && activityIndex === activities.length - 1 && stepIndex === currentActivity.steps.length - 1,
    riveState,
    sessionProgress,
    stepIndex,
    totalSteps,
    voiceLabel,
    voiceAvailable,
    actions: {
      goToActivity,
      goToNextActivity,
      goToPreviousActivity,
      pause,
      play,
      replayActivity,
      toggleMute,
    },
  }
}
