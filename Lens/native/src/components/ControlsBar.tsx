import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type ControlsBarProps = {
  canGoNext: boolean
  canGoPrevious: boolean
  isMuted: boolean
  isPlaying: boolean
  onMute: () => void
  onNext: () => void
  onPause: () => void
  onPlay: () => void
  onPrevious: () => void
  onReplay: () => void
}

function ActionButton({
  label,
  onPress,
  variant,
  disabled,
}: {
  label: string
  onPress: () => void
  variant?: 'default' | 'primary' | 'accent'
  disabled?: boolean
}) {
  return (
    <Pressable
      disabled={disabled}
      onPress={onPress}
      style={[
        styles.button,
        variant === 'primary' && styles.buttonPrimary,
        variant === 'accent' && styles.buttonAccent,
        disabled && styles.buttonDisabled,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          variant === 'primary' && styles.buttonTextPrimary,
          variant === 'accent' && styles.buttonTextAccent,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

export function ControlsBar({
  canGoNext,
  canGoPrevious,
  isMuted,
  isPlaying,
  onMute,
  onNext,
  onPause,
  onPlay,
  onPrevious,
  onReplay,
}: ControlsBarProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controls</Text>
      <View style={styles.row}>
        <ActionButton label="Play" onPress={onPlay} variant="primary" disabled={isPlaying} />
        <ActionButton label="Pause" onPress={onPause} disabled={!isPlaying} />
        <ActionButton label="Replay" onPress={onReplay} variant="accent" />
      </View>
      <View style={styles.row}>
        <ActionButton label="Previous Activity" onPress={onPrevious} disabled={!canGoPrevious} />
        <ActionButton label="Next Activity" onPress={onNext} disabled={!canGoNext} />
      </View>
      <View style={styles.row}>
        <ActionButton label={isMuted ? 'Unmute Voice' : 'Mute Voice'} onPress={onMute} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 251, 242, 0.94)',
    borderRadius: 24,
    padding: 18,
    gap: 12,
  },
  title: {
    color: '#223c43',
    fontSize: 22,
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  button: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 999,
    backgroundColor: '#edf3f5',
  },
  buttonPrimary: {
    backgroundColor: '#74bf83',
  },
  buttonAccent: {
    backgroundColor: '#ffe09a',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#365360',
    fontSize: 15,
    fontWeight: '800',
  },
  buttonTextPrimary: {
    color: '#f7fff7',
  },
  buttonTextAccent: {
    color: '#684d12',
  },
})
