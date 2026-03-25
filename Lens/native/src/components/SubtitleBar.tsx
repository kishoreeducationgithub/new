import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { toddlerTheme } from '../theme/toddlerTheme'

type SubtitleBarProps = {
  text: string
  supportLabel?: string
}

export function SubtitleBar({ text, supportLabel }: SubtitleBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.label}>Subtitles</Text>
        {supportLabel ? <Text style={styles.voice}>{supportLabel}</Text> : null}
      </View>
      <Text style={styles.line}>{text || 'Subtitles will appear here when a movement begins.'}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: toddlerTheme.colors.surface,
    borderColor: toddlerTheme.colors.border,
    borderRadius: toddlerTheme.radii.lg,
    borderWidth: 1,
    padding: toddlerTheme.spacing.lg,
  },
  topline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: toddlerTheme.spacing.sm,
  },
  label: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  voice: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 13,
    fontWeight: '700',
  },
  line: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
    marginTop: toddlerTheme.spacing.sm,
  },
})
