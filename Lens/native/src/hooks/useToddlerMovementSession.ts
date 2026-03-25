import { useCallback, useEffect, useRef, useState } from 'react'
import {
  ACTIVITIES_WITH_CELEBRATION,
  DEFAULT_ACTIVITY_ORDER,
  toddlerActivities,
  toddlerActivitiesById,
} from '../core/activities/toddlerActivities'
import { getNextActivityId, getActivityOrderIndex } from '../core/activity-engine/getNextActivityId'
import type { ToddlerAvatarRuntimeSnapshot } from '../core/avatar/toddlerAvatar'
import type { AvatarAdapterTrace } from '../core/avatar/avatarRuntimeDiagnostics'
import type { ActivityId, SessionPlaybackState } from '../core/models/toddlerActivity'
import { getNarrationTextAtElapsed } from '../core/narration/getActiveNarrationLine'
import { clamp } from '../core/utils/clamp'
import { toddlerGuideAsset } from '../assets/rive/toddlerGuideAsset'
import { createPlaceholderNarrationService } from '../services/narration/createPlaceholderNarrationService'
import { ToddlerGuideRiveAdapter } from '../services/rive/ToddlerGuideRiveAdapter'

const SUBTITLE_TICK_MS = 100
const CELEBRATION_SETTLE_MS = 1400

export function useToddlerMovementSession() {
  const firstActivityId = DEFAULT_ACTIVITY_ORDER[0]
  const firstActivity = toddlerActivitiesById[firstActivityId]

  const adapterRef = useRef<ToddlerGuideRiveAdapter | null>(null)
  const narrationRef = useRef<ReturnType<typeof createPlaceholderNarrationService> | null>(null)
  const runTokenRef = useRef(0)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const celebrationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const preferredCalmModeRef = useRef(true)

  if (!adapterRef.current) {
    adapterRef.current = new ToddlerGuideRiveAdapter()
  }

  if (!narrationRef.current) {
    narrationRef.current = createPlaceholderNarrationService()
  }

  const [currentActivityId, setCurrentActivityId] = useState<ActivityId>(firstActivityId)
  const [avatarSnapshot, setAvatarSnapshot] = useState<ToddlerAvatarRuntimeSnapshot>(
    adapterRef.current.getSnapshot(),
  )
  const [adapterTrace, setAdapterTrace] = useState<AvatarAdapterTrace>(adapterRef.current.getTrace())
  const [calmModePreference, setCalmModePreference] = useState(true)
  const [narrationSpeaking, setNarrationSpeaking] = useState(false)
  const [playbackState, setPlaybackState] = useState<SessionPlaybackState>({
    currentActivityId: firstActivityId,
    isPlaying: false,
    startedAt: null,
    elapsedMs: 0,
    subtitle: firstActivity.subtitleLines[0]?.text ?? '',
    calmMode: false,
  })

  const currentActivity = toddlerActivitiesById[currentActivityId]
  const currentOrderIndex = getActivityOrderIndex(currentActivityId)
  const canGoNext = currentOrderIndex < toddlerActivities.length - 1

  const syncAvatarState = () => {
    setAvatarSnapshot(adapterRef.current!.getSnapshot())
    setAdapterTrace(adapterRef.current!.getTrace())
  }

  const clearTimers = () => {
    if (progressIntervalRef.current) {
      clearInterval(progressIntervalRef.current)
      progressIntervalRef.current = null
    }

    if (completionTimeoutRef.current) {
      clearTimeout(completionTimeoutRef.current)
      completionTimeoutRef.current = null
    }

    if (celebrationTimeoutRef.current) {
      clearTimeout(celebrationTimeoutRef.current)
      celebrationTimeoutRef.current = null
    }
  }

  const stopPlaybackInternals = (suppressStateUpdate = false) => {
    runTokenRef.current += 1
    clearTimers()
    narrationRef.current!.stop()

    if (!suppressStateUpdate) {
      setNarrationSpeaking(false)
    }
  }

  const applyCalmMode = (activityId: ActivityId, enabled: boolean) => {
    const effectiveCalmMode = enabled && toddlerActivitiesById[activityId].calmCompatible

    adapterRef.current!.setCalmMode(effectiveCalmMode)
    syncAvatarState()

    setPlaybackState((previous) => ({
      ...previous,
      calmMode: effectiveCalmMode,
    }))

    return effectiveCalmMode
  }

  const finishActivity = (activityId: ActivityId) => {
    const activity = toddlerActivitiesById[activityId]
    const effectiveCalmMode = preferredCalmModeRef.current && activity.calmCompatible

    stopPlaybackInternals()
    adapterRef.current!.stop()
    syncAvatarState()

    setPlaybackState({
      currentActivityId: activityId,
      isPlaying: false,
      startedAt: null,
      elapsedMs: activity.durationMs,
      subtitle: activity.subtitleLines[activity.subtitleLines.length - 1]?.text ?? '',
      calmMode: effectiveCalmMode,
    })

    if (!ACTIVITIES_WITH_CELEBRATION.includes(activityId)) {
      return
    }

    adapterRef.current!.celebrate()
    syncAvatarState()

    celebrationTimeoutRef.current = setTimeout(() => {
      adapterRef.current!.stop()
      adapterRef.current!.setCalmMode(effectiveCalmMode)
      syncAvatarState()
    }, CELEBRATION_SETTLE_MS)
  }

  const start = (activityId: ActivityId) => {
    const activity = toddlerActivitiesById[activityId]
    const startedAt = Date.now()

    stopPlaybackInternals()
    setCurrentActivityId(activityId)

    const effectiveCalmMode = applyCalmMode(activityId, preferredCalmModeRef.current)

    adapterRef.current!.play(activity.id)
    syncAvatarState()

    setPlaybackState({
      currentActivityId: activityId,
      isPlaying: true,
      startedAt,
      elapsedMs: 0,
      subtitle: getNarrationTextAtElapsed(activity.subtitleLines, 0),
      calmMode: effectiveCalmMode,
    })

    const runToken = runTokenRef.current

    void narrationRef.current!.speak(activity.voiceLines).finally(() => {
      if (runToken !== runTokenRef.current) {
        return
      }

      setNarrationSpeaking(narrationRef.current!.isSpeaking())
    })

    setNarrationSpeaking(narrationRef.current!.isSpeaking())

    progressIntervalRef.current = setInterval(() => {
      if (runToken !== runTokenRef.current) {
        return
      }

      const elapsedMs = clamp(Date.now() - startedAt, 0, activity.durationMs)

      setPlaybackState((previous) => ({
        ...previous,
        elapsedMs,
        subtitle: getNarrationTextAtElapsed(activity.subtitleLines, elapsedMs),
      }))
    }, SUBTITLE_TICK_MS)

    completionTimeoutRef.current = setTimeout(() => {
      if (runToken !== runTokenRef.current) {
        return
      }

      finishActivity(activityId)
    }, activity.durationMs)
  }

  const pause = () => {
    stopPlaybackInternals()
    adapterRef.current!.stop()
    syncAvatarState()

    setPlaybackState((previous) => ({
      ...previous,
      isPlaying: false,
      startedAt: null,
    }))
  }

  const replay = () => {
    start(currentActivityId)
  }

  const next = () => {
    const nextActivityId = getNextActivityId(currentActivityId)

    if (!nextActivityId) {
      return
    }

    start(nextActivityId)
  }

  const setCalmMode = (enabled: boolean) => {
    preferredCalmModeRef.current = enabled
    setCalmModePreference(enabled)
    applyCalmMode(currentActivityId, enabled)
  }

  const celebrate = () => {
    const effectiveCalmMode = preferredCalmModeRef.current && toddlerActivitiesById[currentActivityId].calmCompatible

    stopPlaybackInternals()
    adapterRef.current!.stop()
    adapterRef.current!.celebrate()
    syncAvatarState()

    setPlaybackState((previous) => ({
      ...previous,
      isPlaying: false,
      startedAt: null,
    }))

    celebrationTimeoutRef.current = setTimeout(() => {
      adapterRef.current!.stop()
      adapterRef.current!.setCalmMode(effectiveCalmMode)
      syncAvatarState()
    }, CELEBRATION_SETTLE_MS)
  }

  const attachAvatarBridge = useCallback((bridge: Parameters<ToddlerGuideRiveAdapter['attachBridge']>[0]) => {
    adapterRef.current!.attachBridge(bridge)
    setAvatarSnapshot(adapterRef.current!.getSnapshot())
    setAdapterTrace(adapterRef.current!.getTrace())
  }, [])

  useEffect(() => {
    applyCalmMode(firstActivityId, preferredCalmModeRef.current)
    adapterRef.current!.stop()
    syncAvatarState()

    return () => {
      stopPlaybackInternals(true)
      adapterRef.current!.stop()
    }
  }, [])

  return {
    activities: toddlerActivities,
    avatarBindings: {
      asset: toddlerGuideAsset,
      attachBridge: attachAvatarBridge,
      snapshot: avatarSnapshot,
      trace: adapterTrace,
    },
    calmModePreference,
    canGoNext,
    currentActivity,
    currentOrderIndex,
    narrationSpeaking,
    playbackState,
    actions: {
      celebrate,
      next,
      pause,
      play: () => start(currentActivityId),
      replay,
      setCalmMode,
      start,
      stop: pause,
    },
  }
}
