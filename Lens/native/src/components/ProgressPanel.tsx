import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'

type ProgressPanelProps = {
  activities: Array<{
    id: string
    label: string
    steps: Array<{ id: string; phaseLabel: string; line: string }>
  }>
  activityIndex: number
  stepIndex: number
  sessionProgress: number
  currentActivity: {
    label: string
    steps: Array<{ id: string; phaseLabel: string; line: string }>
  }
  onSelectActivity: (index: number) => void
}

export function ProgressPanel({
  activities,
  activityIndex,
  stepIndex,
  sessionProgress,
  currentActivity,
  onSelectActivity,
}: ProgressPanelProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Progress</Text>
      <Text style={styles.meta}>{Math.round(sessionProgress * 100)}% completed</Text>
      <View style={styles.track}>
        <View style={[styles.fill, { width: `${Math.round(sessionProgress * 100)}%` }]} />
      </View>

      <Text style={styles.sectionLabel}>Current Steps</Text>
      {currentActivity.steps.map((step, index) => (
        <View key={step.id} style={[styles.stepRow, index === stepIndex && styles.stepRowActive]}>
          <Text style={styles.stepPhase}>{step.phaseLabel}</Text>
          <Text style={styles.stepLine}>{step.line}</Text>
        </View>
      ))}

      <Text style={styles.sectionLabel}>Activities</Text>
      {activities.map((activity, index) => (
        <Pressable
          key={activity.id}
          onPress={() => onSelectActivity(index)}
          style={[styles.activityButton, index === activityIndex && styles.activityButtonActive]}
        >
          <Text style={styles.activityText}>{activity.label}</Text>
          <Text style={styles.activityMeta}>{activity.steps.length} cues</Text>
        </Pressable>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'rgba(255, 251, 242, 0.94)',
    borderRadius: 24,
    padding: 18,
    gap: 10,
  },
  title: {
    color: '#223c43',
    fontSize: 22,
    fontWeight: '700',
  },
  meta: {
    color: '#58707a',
    fontSize: 15,
  },
  track: {
    height: 12,
    borderRadius: 999,
    backgroundColor: '#dde8ec',
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#74bf83',
  },
  sectionLabel: {
    marginTop: 8,
    color: '#53746f',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.8,
    textTransform: 'uppercase',
  },
  stepRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: '#f7faf4',
  },
  stepRowActive: {
    backgroundColor: '#dff0e3',
  },
  stepPhase: {
    color: '#35515d',
    fontSize: 14,
    fontWeight: '700',
  },
  stepLine: {
    color: '#4b6873',
    fontSize: 14,
    flexShrink: 1,
    textAlign: 'right',
  },
  activityButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#eef4fb',
  },
  activityButtonActive: {
    backgroundColor: '#d8ebd8',
  },
  activityText: {
    color: '#35515d',
    fontSize: 16,
    fontWeight: '700',
  },
  activityMeta: {
    color: '#56707a',
    fontSize: 14,
  },
})
