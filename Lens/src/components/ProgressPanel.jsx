export function ProgressPanel({
  activities,
  activityIndex,
  currentActivity,
  stepIndex,
  sessionProgress,
  onSelectActivity,
}) {
  const sessionPercent = `${Math.round(sessionProgress * 100)}%`

  const getStepName = (stepId) => {
    if (stepId === 'demo') return 'Watch'
    if (stepId === 'do') return 'Move'
    if (stepId === 'hold') return 'Hold'
    if (stepId === 'relax') return 'Rest'
    if (stepId === 'repeat') return 'Again'
    if (stepId === 'greet') return 'Hello'
    return 'Ready'
  }

  return (
    <section className="progress-panel" aria-labelledby="progress-panel-title">
      <div className="progress-panel__header">
        <div>
          <h3 id="progress-panel-title">Today&apos;s Moves</h3>
          <p className="progress-panel__meta">
            Move {activityIndex + 1} of {activities.length}
          </p>
        </div>
      </div>

      <div className="progress-panel__meter">
        <div className="progress-panel__meter-track" aria-hidden="true">
          <div className="progress-panel__meter-fill" style={{ width: sessionPercent }} />
        </div>
        <div className="progress-panel__meter-copy">
          <span>{currentActivity.label}</span>
          <span>
            Step {stepIndex + 1}/{currentActivity.steps.length}
          </span>
        </div>
      </div>

      <div className="progress-panel__steps">
        <p className="subtitle-bar__label">This Move</p>
        <ul>
          {currentActivity.steps.map((step, index) => {
            const isActive = index === stepIndex
            const isComplete = index < stepIndex
            const className = isActive
              ? 'progress-panel__step is-active'
              : isComplete
                ? 'progress-panel__step is-complete'
                : 'progress-panel__step'

            return (
              <li key={step.id} className={className}>
                <span>{getStepName(step.id)}</span>
              </li>
            )
          })}
        </ul>
      </div>

      <div className="progress-panel__activities">
        <p className="subtitle-bar__label">More Moves</p>
        <ul>
          {activities.map((activity, index) => (
            <li key={activity.id}>
              <button
                type="button"
                className={
                  index === activityIndex
                    ? 'progress-panel__activity-button is-active'
                    : 'progress-panel__activity-button'
                }
                onClick={() => onSelectActivity(index)}
              >
                <span>{activity.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
