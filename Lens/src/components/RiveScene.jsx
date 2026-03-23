import { ToddlerAvatar } from './ToddlerAvatar.jsx'
import { avatarCharacters } from '../data/avatarCharacters.js'

function getFallbackPose(activityId, stepId) {
  if (activityId === 'intro') {
    return stepId === 'ready' ? 'ready' : 'wave'
  }

  if (activityId === 'armsUp') {
    return stepId === 'demo' ? 'observe-arms-up' : stepId === 'relax' ? 'ready' : 'arms-up'
  }

  if (activityId === 'leftStretch') {
    return stepId === 'relax' || stepId === 'repeat' ? 'ready' : 'lean-left'
  }

  if (activityId === 'rightStretch') {
    return stepId === 'relax' || stepId === 'repeat' ? 'ready' : 'lean-right'
  }

  if (activityId === 'jump') {
    return stepId === 'demo' ? 'ready' : stepId === 'relax' ? 'ready' : 'jump'
  }

  if (activityId === 'breathing') {
    if (stepId === 'do' || stepId === 'hold') {
      return 'breathe-in'
    }

    return stepId === 'relax' || stepId === 'repeat' ? 'breathe-out' : 'ready'
  }

  if (activityId === 'celebrate') {
    return 'celebrate'
  }

  return 'ready'
}

export function RiveScene({ currentActivity, currentStep, prefersReducedMotion }) {
  const pose = getFallbackPose(currentActivity.id, currentStep.id)

  return (
    <div
      className="rive-scene"
      aria-label="School classroom movement scene"
      data-activity-id={currentActivity.id}
      data-step-id={currentStep.id}
    >
      <div className="rive-scene__ambient rive-scene__ambient--left" />
      <div className="rive-scene__ambient rive-scene__ambient--right" />
      {!prefersReducedMotion ? (
        <>
          <div className="rive-scene__dust rive-scene__dust--one" />
          <div className="rive-scene__dust rive-scene__dust--two" />
          <div className="rive-scene__dust rive-scene__dust--three" />
        </>
      ) : null}
      <div className="rive-scene__window-light" />

      <div className="rive-scene__board" aria-live="polite">
        <p className="rive-scene__board-label">Let&apos;s Move!</p>
        <div className="rive-scene__board-copy" key={`${currentActivity.id}-${currentStep.id}`}>
          <h3>{currentActivity.label}</h3>
          <p>{currentStep.boardText}</p>
        </div>
        <div className="rive-scene__board-icons" aria-hidden="true">
          <span className={`rive-scene__board-icon rive-scene__board-icon--${currentActivity.icon}`} />
        </div>
      </div>

      <div className="rive-scene__classroom-furniture" aria-hidden="true">
        <div className="rive-scene__desk rive-scene__desk--left" />
        <div className="rive-scene__desk rive-scene__desk--right" />
        <div className="rive-scene__floor-line" />
      </div>

      <div className="rive-scene__children" aria-hidden="true">
        {avatarCharacters.map((avatar) => (
          <ToddlerAvatar key={avatar.id} avatar={avatar} pose={pose} />
        ))}
      </div>
    </div>
  )
}
