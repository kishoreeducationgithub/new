import { useEffect, useEffectEvent, useState } from 'react'
import { ActivityStage } from './ActivityStage.jsx'
import { ProgressPanel } from './ProgressPanel.jsx'
import { movementPlaySession } from '../data/activities.js'
import { useActivityPlayer } from '../hooks/useActivityPlayer.js'

export function MovementPlayScreen() {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  )
  const player = useActivityPlayer({ prefersReducedMotion })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')

    const handleChange = (event) => {
      setPrefersReducedMotion(event.matches)
    }

    mediaQuery.addEventListener('change', handleChange)
    return () => mediaQuery.removeEventListener('change', handleChange)
  }, [])

  const handleKeyDown = useEffectEvent((event) => {
    const activeTagName = document.activeElement?.tagName

    if (activeTagName === 'INPUT' || activeTagName === 'TEXTAREA' || activeTagName === 'SELECT') {
      return
    }

    if (event.code === 'Space') {
      event.preventDefault()
      if (player.isPlaying) {
        player.actions.pause()
      } else {
        player.actions.play()
      }
    }

    if (event.code === 'KeyR') {
      event.preventDefault()
      player.actions.replayActivity()
    }

    if (event.code === 'ArrowRight') {
      event.preventDefault()
      player.actions.goToNextActivity()
    }

    if (event.code === 'ArrowLeft') {
      event.preventDefault()
      player.actions.goToPreviousActivity()
    }

    if (event.code === 'KeyM') {
      event.preventDefault()
      player.actions.toggleMute()
    }
  })

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [])

  return (
    <main className="movement-app">
      <div className="movement-shell">
        <header className="movement-shell__hero">
          <div className="movement-shell__intro">
            <p className="movement-shell__eyebrow">Kids Classroom Activity</p>
            <h1 className="movement-shell__title">{movementPlaySession.title}</h1>
            <p className="movement-shell__subtitle">{movementPlaySession.subtitle}</p>
          </div>
        </header>

        <div className="movement-layout">
          <div className="movement-layout__main">
            <ActivityStage
              currentActivity={player.currentActivity}
              currentStep={player.currentStep}
              stepIndex={player.stepIndex}
              isMuted={player.isMuted}
              prefersReducedMotion={prefersReducedMotion}
            />
          </div>

          <aside className="movement-layout__side">
            <ProgressPanel
              activities={player.activities}
              activityIndex={player.activityIndex}
              currentActivity={player.currentActivity}
              stepIndex={player.stepIndex}
              sessionProgress={player.sessionProgress}
              onSelectActivity={player.actions.goToActivity}
            />
          </aside>
        </div>
      </div>
    </main>
  )
}
