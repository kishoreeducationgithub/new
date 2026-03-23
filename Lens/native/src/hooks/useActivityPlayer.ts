import { startTransition, useEffect, useMemo, useRef, useState } from 'react'
import {
  getActivityProgress,
  getActivityStartPosition,
  getNextPosition,
  getPreviousActivityPosition,
  getRiveStateSnapshot,
  getSessionProgress,
  getTotalStepCount,
} from '../../../shared/activityPlayerCore.js'
import { movementPlayActivities } from '../data/activities'
import { createNarrationService } from '../services/narrationService'

export function useActivityPlayer() {
  const narrationServiceRef = useRef(createNarrationService())
  const narrationService = narrationServiceRef.current

  const [activityIndex, setActivityIndex] = useState(0)
  const [stepIndex, setStepIndex] = useState(0)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [replayToken, setReplayToken] = useState(0)

  const currentActivity = movementPlayActivities[activityIndex]
  const currentStep = currentActivity.steps[stepIndex]

  const totalSteps = useMemo(() => getTotalStepCount(movementPlayActivities), [])
  const sessionProgress = useMemo(
    () => getSessionProgress(movementPlayActivities, activityIndex, stepIndex),
    [activityIndex, stepIndex],
  )
  const activityProgress = useMemo(
    () => getActivityProgress(currentActivity, stepIndex),
    [currentActivity, stepIndex],
  )
  const riveState = useMemo(
    () =>
      getRiveStateSnapshot({
        activities: movementPlayActivities,
        activityIndex,
        stepIndex,
        isPlaying,
        prefersReducedMotion: false,
      }),
    [activityIndex, stepIndex, isPlaying],
  )

  useEffect(() => {
    narrationService.setMuted(isMuted)

    if (!isPlaying) {
      narrationService.cancel()
      return undefined
    }

    narrationService.speak(currentStep.line, {
      calm: currentActivity.tone === 'calm',
    })

    const timeoutId = setTimeout(() => {
      const nextPosition = getNextPosition(movementPlayActivities, activityIndex, stepIndex)

      if (!nextPosition) {
        setIsPlaying(false)
        return
      }

      startTransition(() => {
        setActivityIndex(nextPosition.activityIndex)
        setStepIndex(nextPosition.stepIndex)
      })
    }, currentStep.durationMs)

    return () => clearTimeout(timeoutId)
  }, [activityIndex, currentActivity, currentStep, isMuted, isPlaying, narrationService, replayToken, stepIndex])

  function moveToPosition(nextPosition: { activityIndex: number; stepIndex: number }) {
    startTransition(() => {
      setActivityIndex(nextPosition.activityIndex)
      setStepIndex(nextPosition.stepIndex)
      setIsPlaying(true)
      setReplayToken((token) => token + 1)
    })
  }

  return {
    activities: movementPlayActivities,
    activityIndex,
    activityProgress,
    currentActivity,
    currentStep,
    isMuted,
    isPlaying,
    riveState,
    sessionProgress,
    stepIndex,
    totalSteps,
    voiceLabel: narrationService.getStatusLabel(),
    actions: {
      goToActivity(index: number) {
        moveToPosition(getActivityStartPosition(index))
      },
      goToNextActivity() {
        if (activityIndex >= movementPlayActivities.length - 1) {
          setIsPlaying(false)
          return
        }

        moveToPosition(getActivityStartPosition(activityIndex + 1))
      },
      goToPreviousActivity() {
        const previousPosition = getPreviousActivityPosition(activityIndex)

        if (previousPosition) {
          moveToPosition(previousPosition)
        }
      },
      pause() {
        setIsPlaying(false)
      },
      play() {
        setIsPlaying(true)
        setReplayToken((token) => token + 1)
      },
      replayActivity() {
        moveToPosition(getActivityStartPosition(activityIndex))
      },
      toggleMute() {
        const nextMuted = !isMuted
        setIsMuted(nextMuted)
        narrationService.setMuted(nextMuted)
      },
    },
  }
}
