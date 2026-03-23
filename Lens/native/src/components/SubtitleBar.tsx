import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

type SubtitleBarProps = {
  line: string
  voiceLabel: string
}

export function SubtitleBar({ line, voiceLabel }: SubtitleBarProps) {
  return (
    <View style={styles.container}>
      <View style={styles.topline}>
        <Text style={styles.label}>Narration + Subtitles</Text>
        <Text style={styles.voice}>{voiceLabel}</Text>
      </View>
      <Text style={styles.line}>{line}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 251, 242, 0.94)',
    borderRadius: 24,
    padding: 18,
  },
  topline: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  label: {
    color: '#53746f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  voice: {
    color: '#48636e',
    fontSize: 14,
    fontWeight: '700',
  },
  line: {
    marginTop: 14,
    color: '#24424b',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 32,
  },
})
