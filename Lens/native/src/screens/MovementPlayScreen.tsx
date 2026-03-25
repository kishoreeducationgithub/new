import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, View } from 'react-native'
import { AvatarDebugPanel } from '../components/AvatarDebugPanel'
import { AvatarStage } from '../components/AvatarStage'
import { ParentControls } from '../components/ParentControls'
import { SubtitleBar } from '../components/SubtitleBar'
import { createAvatarRuntimeDiagnostics } from '../core/avatar/avatarRuntimeDiagnostics'
import { useToddlerMovementSession } from '../hooks/useToddlerMovementSession'
import { toddlerTheme } from '../theme/toddlerTheme'

function InfoPill({ label, tone = 'neutral' }: { label: string; tone?: 'neutral' | 'calm' | 'brand' }) {
  return (
    <View
      style={[
        styles.infoPill,
        tone === 'brand' && styles.infoPillBrand,
        tone === 'calm' && styles.infoPillCalm,
      ]}
    >
      <Text
        style={[
          styles.infoPillText,
          tone === 'brand' && styles.infoPillTextBrand,
          tone === 'calm' && styles.infoPillTextCalm,
        ]}
      >
        {label}
      </Text>
    </View>
  )
}

export function MovementPlayScreen() {
  const session = useToddlerMovementSession()
  const asset = session.avatarBindings.asset
  const [runtimeDiagnostics, setRuntimeDiagnostics] = useState(() =>
    createAvatarRuntimeDiagnostics({
      artboard: asset.artboard,
      inputNames: asset.inputNames,
      stateMachine: asset.stateMachine,
    }),
  )
  const supportLabel = session.narrationSpeaking
    ? 'Narration is guiding this movement.'
    : 'Subtitles stay available even without audio.'

  return (
    <ScrollView contentContainerStyle={styles.content}>
      <View style={styles.header}>
        <Text style={styles.eyebrow}>Toddler Movement Guide</Text>
        <Text style={styles.title}>Move With The Guide</Text>
        <Text style={styles.subtitle}>
          Calm, easy-to-follow actions powered by one activity engine and one Rive state machine.
        </Text>
      </View>

      <AvatarStage
        activityLabel={session.currentActivity.label}
        attachBridge={session.avatarBindings.attachBridge}
        asset={asset}
        onDiagnosticsChange={setRuntimeDiagnostics}
        snapshot={session.avatarBindings.snapshot}
      />

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Now Practicing</Text>
        <Text style={styles.infoTitle}>{session.currentActivity.label}</Text>
        <View style={styles.pillRow}>
          <InfoPill label={`Move ${session.currentOrderIndex + 1} of ${session.activities.length}`} tone="brand" />
          <InfoPill label={session.playbackState.isPlaying ? 'Playing now' : 'Waiting in idle'} />
          {session.playbackState.calmMode ? <InfoPill label="Calm mode active" tone="calm" /> : null}
        </View>
      </View>

      <SubtitleBar supportLabel={supportLabel} text={session.playbackState.subtitle} />

      <ParentControls
        canGoNext={session.canGoNext}
        isPlaying={session.playbackState.isPlaying}
        onNext={session.actions.next}
        onPause={session.actions.pause}
        onPlay={session.actions.play}
        onReplay={session.actions.replay}
      />

      <AvatarDebugPanel
        artboard={asset.artboard}
        calmModePreference={session.calmModePreference}
        diagnostics={runtimeDiagnostics}
        inputValues={{
          activityIndex: session.avatarBindings.snapshot.activityIndex,
          celebrateCount: session.avatarBindings.snapshot.celebrateCount,
          calmMode: session.avatarBindings.snapshot.calmMode,
          isPlaying: session.avatarBindings.snapshot.isPlaying,
        }}
        onCelebrate={session.actions.celebrate}
        onSetCalmMode={session.actions.setCalmMode}
        onStartBreathe={() => session.actions.start('breathe')}
        onStartWave={() => session.actions.start('wave')}
        onStop={session.actions.stop}
        stateMachine={asset.stateMachine}
        trace={session.avatarBindings.trace}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  content: {
    gap: toddlerTheme.spacing.lg,
    padding: toddlerTheme.spacing.lg,
  },
  header: {
    gap: toddlerTheme.spacing.xs,
  },
  eyebrow: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  title: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 40,
    fontWeight: '800',
  },
  subtitle: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 18,
    lineHeight: 26,
    maxWidth: 760,
  },
  infoCard: {
    backgroundColor: toddlerTheme.colors.surface,
    borderColor: toddlerTheme.colors.border,
    borderRadius: toddlerTheme.radii.lg,
    borderWidth: 1,
    gap: toddlerTheme.spacing.sm,
    padding: toddlerTheme.spacing.lg,
  },
  infoLabel: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  infoTitle: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 26,
    fontWeight: '800',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: toddlerTheme.spacing.sm,
  },
  infoPill: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  infoPillBrand: {
    backgroundColor: toddlerTheme.colors.brand,
  },
  infoPillCalm: {
    backgroundColor: toddlerTheme.colors.calm,
  },
  infoPillText: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
  },
  infoPillTextBrand: {
    color: toddlerTheme.colors.white,
  },
  infoPillTextCalm: {
    color: toddlerTheme.colors.textPrimary,
  },
})
