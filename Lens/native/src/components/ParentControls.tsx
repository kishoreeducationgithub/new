import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import { toddlerTheme } from '../theme/toddlerTheme'

type ParentControlsProps = {
  canGoNext: boolean
  isPlaying: boolean
  onNext: () => void
  onPause: () => void
  onPlay: () => void
  onReplay: () => void
}

function ControlButton({
  disabled,
  label,
  onPress,
  tone = 'neutral',
}: {
  disabled?: boolean
  label: string
  onPress: () => void
  tone?: 'neutral' | 'primary' | 'accent'
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        tone === 'primary' && styles.buttonPrimary,
        tone === 'accent' && styles.buttonAccent,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          tone === 'primary' && styles.buttonTextPrimary,
          tone === 'accent' && styles.buttonTextAccent,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export function ParentControls({
  canGoNext,
  isPlaying,
  onNext,
  onPause,
  onPlay,
  onReplay,
}: ParentControlsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parent Controls</Text>
      <View style={styles.row}>
        <ControlButton disabled={isPlaying} label="Play" onPress={onPlay} tone="primary" />
        <ControlButton disabled={!isPlaying} label="Pause" onPress={onPause} />
        <ControlButton label="Replay" onPress={onReplay} tone="accent" />
        <ControlButton disabled={!canGoNext} label="Next" onPress={onNext} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: toddlerTheme.colors.surface,
    borderColor: toddlerTheme.colors.border,
    borderRadius: toddlerTheme.radii.lg,
    borderWidth: 1,
    gap: toddlerTheme.spacing.sm,
    padding: toddlerTheme.spacing.lg,
  },
  title: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: toddlerTheme.spacing.sm,
  },
  button: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.pill,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonPrimary: {
    backgroundColor: toddlerTheme.colors.brand,
  },
  buttonAccent: {
    backgroundColor: toddlerTheme.colors.accent,
  },
  buttonDisabled: {
    opacity: 0.45,
  },
  buttonText: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  buttonTextPrimary: {
    color: toddlerTheme.colors.white,
  },
  buttonTextAccent: {
    color: toddlerTheme.colors.accentText,
  },
})
