export function getTotalStepCount(activities) {
  return activities.reduce((count, activity) => count + activity.steps.length, 0)
}

export function getCompletedStepCount(activities, activityIndex, stepIndex) {
  let completedSteps = 0

  for (let index = 0; index < activityIndex; index += 1) {
    completedSteps += activities[index].steps.length
  }

  return completedSteps + stepIndex + 1
}

export function getActivityProgress(activity, stepIndex) {
  return (stepIndex + 1) / activity.steps.length
}

export function getSessionProgress(activities, activityIndex, stepIndex) {
  return getCompletedStepCount(activities, activityIndex, stepIndex) / getTotalStepCount(activities)
}

export function getNextPosition(activities, activityIndex, stepIndex) {
  const currentActivity = activities[activityIndex]

  if (stepIndex < currentActivity.steps.length - 1) {
    return { activityIndex, stepIndex: stepIndex + 1 }
  }

  if (activityIndex < activities.length - 1) {
    return { activityIndex: activityIndex + 1, stepIndex: 0 }
  }

  return null
}

export function getPreviousActivityPosition(activityIndex) {
  if (activityIndex <= 0) {
    return null
  }

  return { activityIndex: activityIndex - 1, stepIndex: 0 }
}

export function getActivityStartPosition(activityIndex) {
  return { activityIndex, stepIndex: 0 }
}

export function getRiveStateSnapshot({
  activities,
  activityIndex,
  stepIndex,
  isPlaying,
  prefersReducedMotion,
}) {
  const currentActivity = activities[activityIndex]
  const currentStep = currentActivity.steps[stepIndex]
  const calmMode =
    prefersReducedMotion ||
    currentActivity.tone === 'calm' ||
    currentActivity.id === 'intro' ||
    currentActivity.id === 'breathing'

  return {
    activityIndex,
    stepIndex,
    currentActivityId: currentActivity.id,
    currentStepId: currentStep.id,
    isPlaying,
    leaderActive: currentActivity.id !== 'intro',
    followersActive: currentActivity.id !== 'intro',
    calmMode,
    celebrate: currentActivity.id === 'celebrate' && currentStep.id === 'repeat',
  }
}

export function formatPercent(value) {
  return `${Math.round(value * 100)}%`
}
