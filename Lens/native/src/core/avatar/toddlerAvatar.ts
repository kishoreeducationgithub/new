import type { ActivityId, AvatarAction } from '../models/toddlerActivity'

export const IDLE_ACTIVITY_INDEX = 0

export type PlayableAvatarAction = Exclude<AvatarAction, 'idle' | 'celebrate'>

export type ToddlerAvatarRuntimeSnapshot = {
  action: AvatarAction
  activityIndex: number
  isPlaying: boolean
  calmMode: boolean
  celebrateCount: number
}

export function toAvatarAction(activityId: ActivityId): PlayableAvatarAction {
  return activityId
}

export function createIdleAvatarSnapshot(): ToddlerAvatarRuntimeSnapshot {
  return {
    action: 'idle',
    activityIndex: IDLE_ACTIVITY_INDEX,
    isPlaying: false,
    calmMode: false,
    celebrateCount: 0,
  }
}
