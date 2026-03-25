import { DEFAULT_ACTIVITY_ORDER } from '../activities/toddlerActivities'
import type { ActivityId } from '../models/toddlerActivity'

export function getNextActivityId(currentActivityId: ActivityId): ActivityId | null {
  const currentIndex = DEFAULT_ACTIVITY_ORDER.indexOf(currentActivityId)

  if (currentIndex < 0 || currentIndex >= DEFAULT_ACTIVITY_ORDER.length - 1) {
    return null
  }

  return DEFAULT_ACTIVITY_ORDER[currentIndex + 1]
}

export function getActivityOrderIndex(currentActivityId: ActivityId): number {
  return DEFAULT_ACTIVITY_ORDER.indexOf(currentActivityId)
}
