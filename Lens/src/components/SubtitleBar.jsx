function getHelperText(stepId) {
  if (stepId === 'greet') {
    return 'Wave hello.'
  }

  if (stepId === 'ready') {
    return 'Stand tall and get ready.'
  }

  if (stepId === 'demo') {
    return 'Watch first.'
  }

  if (stepId === 'do') {
    return 'Now you try.'
  }

  if (stepId === 'hold') {
    return 'Stay still for a moment.'
  }

  if (stepId === 'relax') {
    return 'Come back easy.'
  }

  return 'Great job. Keep going.'
}

export function SubtitleBar({ currentStep, isMuted }) {
  return (
    <section className="subtitle-bar" aria-labelledby="subtitle-bar-title">
      <p id="subtitle-bar-title" className="subtitle-bar__label">
        {isMuted ? 'Read and Move' : 'Listen and Move'}
      </p>
      <p className="subtitle-bar__line">{currentStep.line}</p>
      <p className="subtitle-bar__helper">{getHelperText(currentStep.id)}</p>
    </section>
  )
}
