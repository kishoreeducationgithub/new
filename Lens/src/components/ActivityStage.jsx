import { RiveScene } from './RiveScene.jsx'
import { SubtitleBar } from './SubtitleBar.jsx'

export function ActivityStage({ currentActivity, currentStep, stepIndex, isMuted, prefersReducedMotion }) {
  return (
    <section className="activity-stage" aria-labelledby="movement-stage-title">
      <div className="activity-stage__header">
        <div className="activity-stage__title-group">
          <h2 id="movement-stage-title">{currentActivity.label}</h2>
          <p>{currentStep.helperText}</p>
        </div>

        <div className="activity-stage__step-chip" aria-label="Current step">
          <span>Step {stepIndex + 1}</span>
          <span>
            {stepIndex + 1}/{currentActivity.steps.length}
          </span>
        </div>
      </div>

      <div className="activity-stage__scene-card">
        <RiveScene
          currentActivity={currentActivity}
          currentStep={currentStep}
          prefersReducedMotion={prefersReducedMotion}
        />
        <div className="activity-stage__suggestion">
          <SubtitleBar currentStep={currentStep} isMuted={isMuted} />
        </div>
      </div>
    </section>
  )
}
