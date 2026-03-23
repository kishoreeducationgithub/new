import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { riveContract } from '../../../shared/riveContract.js'

type RiveStageProps = {
  activityLabel: string
  boardText: string
  helperText: string
  riveState: {
    activityIndex: number
    stepIndex: number
    isPlaying: boolean
    calmMode: boolean
    celebrate: boolean
  }
}

export function RiveStage({ activityLabel, boardText, helperText, riveState }: RiveStageProps) {
  return (
    <View style={styles.container}>
      <View style={styles.board}>
        <Text style={styles.boardLabel}>School Board</Text>
        <Text style={styles.boardTitle}>{activityLabel}</Text>
        <Text style={styles.boardText}>{boardText}</Text>
      </View>

      <View style={styles.stageSurface}>
        <Text style={styles.placeholderTitle}>Rive React Native Placeholder Stage</Text>
        <Text style={styles.placeholderText}>{helperText}</Text>
        <Text style={styles.contractText}>
          Asset: {riveContract.nativeAssetPath} | Artboard: {riveContract.artboard} | State machine:{' '}
          {riveContract.stateMachine}
        </Text>
        <Text style={styles.contractText}>
          activityIndex {riveState.activityIndex} · stepIndex {riveState.stepIndex} · isPlaying{' '}
          {String(riveState.isPlaying)} · calmMode {String(riveState.calmMode)} · celebrate{' '}
          {String(riveState.celebrate)}
        </Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#e6f1d9',
    borderRadius: 28,
    padding: 16,
    gap: 14,
  },
  board: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: '#29593f',
  },
  boardLabel: {
    color: '#fff0bc',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  boardTitle: {
    marginTop: 10,
    color: '#f7fce8',
    fontSize: 34,
    fontWeight: '800',
  },
  boardText: {
    marginTop: 8,
    color: '#edf7dc',
    fontSize: 18,
  },
  stageSurface: {
    minHeight: 360,
    borderRadius: 22,
    padding: 18,
    backgroundColor: '#f9f4e4',
    justifyContent: 'center',
    gap: 10,
  },
  placeholderTitle: {
    color: '#284048',
    fontSize: 24,
    fontWeight: '800',
  },
  placeholderText: {
    color: '#536d77',
    fontSize: 18,
    lineHeight: 26,
  },
  contractText: {
    color: '#5d717c',
    fontSize: 14,
    lineHeight: 20,
  },
})
