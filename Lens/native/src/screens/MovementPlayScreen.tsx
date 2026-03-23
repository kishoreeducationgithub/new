import React from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { ControlsBar } from '../components/ControlsBar'
import { ProgressPanel } from '../components/ProgressPanel'
import { RiveStage } from '../components/RiveStage'
import { SubtitleBar } from '../components/SubtitleBar'
import { movementPlaySession } from '../data/activities'
import { useActivityPlayer } from '../hooks/useActivityPlayer'

export function MovementPlayScreen() {
  const player = useActivityPlayer()

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>School Wellbeing Product</Text>
        <Text style={styles.title}>{movementPlaySession.title}</Text>
        <Text style={styles.subtitle}>{movementPlaySession.subtitle}</Text>
      </View>

      <View style={styles.layout}>
        <View style={styles.mainColumn}>
          <RiveStage
            activityLabel={player.currentActivity.label}
            boardText={player.currentStep.boardText}
            helperText={player.currentStep.helperText}
            riveState={player.riveState}
          />
          <SubtitleBar line={player.currentStep.line} voiceLabel={player.voiceLabel} />
        </View>

        <View style={styles.sideColumn}>
          <ProgressPanel
            activities={player.activities}
            activityIndex={player.activityIndex}
            stepIndex={player.stepIndex}
            sessionProgress={player.sessionProgress}
            currentActivity={player.currentActivity}
            onSelectActivity={player.actions.goToActivity}
          />
          <ControlsBar
            canGoNext={player.activityIndex < player.activities.length - 1}
            canGoPrevious={player.activityIndex > 0}
            isMuted={player.isMuted}
            isPlaying={player.isPlaying}
            onMute={player.actions.toggleMute}
            onNext={player.actions.goToNextActivity}
            onPause={player.actions.pause}
            onPlay={player.actions.play}
            onPrevious={player.actions.goToPreviousActivity}
            onReplay={player.actions.replayActivity}
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    padding: 18,
    gap: 18,
  },
  header: {
    gap: 8,
  },
  eyebrow: {
    color: '#53746f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#223c43',
    fontSize: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: '#516973',
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 840,
  },
  layout: {
    gap: 16,
  },
  mainColumn: {
    gap: 16,
  },
  sideColumn: {
    gap: 16,
  },
})
