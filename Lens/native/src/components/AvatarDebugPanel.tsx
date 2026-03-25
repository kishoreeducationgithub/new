import React from 'react'
import { Pressable, StyleSheet, Text, View } from 'react-native'
import type {
  AvatarAdapterTrace,
  AvatarDiagnosticCategory,
  AvatarRuntimeDiagnostics,
} from '../core/avatar/avatarRuntimeDiagnostics'
import { toddlerTheme } from '../theme/toddlerTheme'

type AvatarDebugPanelProps = {
  artboard: string
  calmModePreference: boolean
  diagnostics: AvatarRuntimeDiagnostics
  inputValues: {
    activityIndex: number
    celebrateCount: number
    calmMode: boolean
    isPlaying: boolean
  }
  onCelebrate: () => void
  onSetCalmMode: (enabled: boolean) => void
  onStartBreathe: () => void
  onStartWave: () => void
  onStop: () => void
  stateMachine: string
  trace: AvatarAdapterTrace
}

type ValidationStatus = 'check' | 'fail' | 'pass' | 'pending'

function DebugButton({
  label,
  onPress,
  tone = 'neutral',
}: {
  label: string
  onPress: () => void
  tone?: 'neutral' | 'accent' | 'brand'
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        tone === 'brand' && styles.buttonBrand,
        tone === 'accent' && styles.buttonAccent,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          tone === 'brand' && styles.buttonTextBrand,
          tone === 'accent' && styles.buttonTextAccent,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  )
}

function ValidationRow({
  label,
  note,
  status,
}: {
  label: string
  note: string
  status: ValidationStatus
}) {
  return (
    <View style={styles.validationRow}>
      <View
        style={[
          styles.validationBadge,
          status === 'pass' && styles.validationBadgePass,
          status === 'fail' && styles.validationBadgeFail,
          status === 'check' && styles.validationBadgeCheck,
        ]}
      >
        <Text
          style={[
            styles.validationBadgeText,
            status === 'pass' && styles.validationBadgeTextPass,
            status === 'fail' && styles.validationBadgeTextFail,
            status === 'check' && styles.validationBadgeTextCheck,
          ]}
        >
          {status.toUpperCase()}
        </Text>
      </View>
      <View style={styles.validationCopy}>
        <Text style={styles.validationLabel}>{label}</Text>
        <Text style={styles.validationNote}>{note}</Text>
      </View>
    </View>
  )
}

function ErrorGroup({
  category,
  messages,
}: {
  category: AvatarDiagnosticCategory
  messages: string[]
}) {
  return (
    <View style={styles.errorGroup}>
      <Text style={styles.errorGroupTitle}>{category}</Text>
      {messages.length ? (
        messages.map((message) => (
          <Text key={`${category}-${message}`} style={styles.errorLine}>
            {message}
          </Text>
        ))
      ) : (
        <Text style={styles.errorLineMuted}>No issues recorded.</Text>
      )}
    </View>
  )
}

export function AvatarDebugPanel({
  artboard,
  calmModePreference,
  diagnostics,
  inputValues,
  onCelebrate,
  onSetCalmMode,
  onStartBreathe,
  onStartWave,
  onStop,
  stateMachine,
  trace,
}: AvatarDebugPanelProps) {
  const validationRows: Array<{ label: string; note: string; status: ValidationStatus }> = [
    {
      label: '1. Load stage',
      note: diagnostics.runtimeReady
        ? 'File, artboard, and state machine resolved.'
        : diagnostics.latestError
          ? diagnostics.latestError
          : 'Wait for the live Rive stage to finish loading.',
      status: diagnostics.runtimeReady ? 'pass' : diagnostics.latestError ? 'fail' : 'pending',
    },
    {
      label: '2. Verify idle visible',
      note: 'Avatar should be calm and idle on first render or after Stop.',
      status:
        diagnostics.runtimeReady && inputValues.activityIndex === 0 && !inputValues.isPlaying ? 'check' : 'pending',
    },
    {
      label: '3. Press wave',
      note: 'Confirm wave motion begins visibly on device.',
      status: trace.lastCommand === 'play:wave' ? 'check' : 'pending',
    },
    {
      label: '4. Press stop',
      note: 'Confirm the avatar returns to idle without snapping.',
      status:
        trace.lastCommand === 'stop' && inputValues.activityIndex === 0 && !inputValues.isPlaying
          ? 'check'
          : 'pending',
    },
    {
      label: '5. Press breathe',
      note: 'Confirm a calm breathing loop starts and stays gentle.',
      status: trace.lastCommand === 'play:breathe' ? 'check' : 'pending',
    },
    {
      label: '6. Fire celebrate',
      note: 'Confirm the one-shot celebrate plays, then returns toward idle.',
      status: trace.lastCommand === 'celebrate' ? 'check' : 'pending',
    },
  ]

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Native Validation Debug</Text>
      <Text style={styles.caption}>
        Debug-first checks for the live toddler avatar before any broader UI polishing.
      </Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Runtime Card</Text>
        <View style={styles.statusBlock}>
          <Text style={styles.statusLine}>artboard: {artboard}</Text>
          <Text style={styles.statusLine}>stateMachine: {stateMachine}</Text>
          <Text style={styles.statusLine}>packageAvailable: {String(diagnostics.packageAvailable)}</Text>
          <Text style={styles.statusLine}>fileLoaded: {String(diagnostics.fileLoaded)}</Text>
          <Text style={styles.statusLine}>fileLoading: {String(diagnostics.fileLoading)}</Text>
          <Text style={styles.statusLine}>fileMissingLikely: {String(diagnostics.fileMissingLikely)}</Text>
          <Text style={styles.statusLine}>runtimeReady: {String(diagnostics.runtimeReady)}</Text>
          <Text style={styles.statusLine}>artboardResolved: {String(diagnostics.artboardResolved)}</Text>
          <Text style={styles.statusLine}>stateMachineResolved: {String(diagnostics.stateMachineResolved)}</Text>
          <Text style={styles.statusLine}>androidRuntime: {diagnostics.androidRuntimeStatus.summary}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Input Validation</Text>
        <View style={styles.statusBlock}>
          <Text style={styles.statusLine}>activityIndex: {diagnostics.inputValidation.activityIndex}</Text>
          <Text style={styles.statusLine}>isPlaying: {diagnostics.inputValidation.isPlaying}</Text>
          <Text style={styles.statusLine}>celebrate: {diagnostics.inputValidation.celebrate}</Text>
          <Text style={styles.statusLine}>calmMode: {diagnostics.inputValidation.calmMode}</Text>
          <Text style={styles.statusLine}>current activityIndex value: {inputValues.activityIndex}</Text>
          <Text style={styles.statusLine}>current isPlaying value: {String(inputValues.isPlaying)}</Text>
          <Text style={styles.statusLine}>current calmMode value: {String(inputValues.calmMode)}</Text>
          <Text style={styles.statusLine}>current celebrateCount: {inputValues.celebrateCount}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Adapter Trace</Text>
        <View style={styles.statusBlock}>
          <Text style={styles.statusLine}>bridgeAttached: {String(trace.bridgeAttached)}</Text>
          <Text style={styles.statusLine}>lastCommand: {trace.lastCommand}</Text>
          <Text style={styles.statusLine}>lastActivityIndex: {trace.lastActivityIndex}</Text>
          <Text style={styles.statusLine}>lastIsPlaying: {String(trace.lastIsPlaying)}</Text>
          <Text style={styles.statusLine}>lastCelebrateAt: {trace.lastCelebrateAt ?? 'never'}</Text>
          <Text style={styles.statusLine}>calmMode current: {String(trace.calmMode)}</Text>
          <Text style={styles.statusLine}>lastUpdatedAt: {trace.lastUpdatedAt ?? 'not yet'}</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Debug Controls</Text>
        <View style={styles.row}>
          <DebugButton label="Idle" onPress={onStop} tone="brand" />
          <DebugButton label="Wave" onPress={onStartWave} />
          <DebugButton label="Breathe" onPress={onStartBreathe} />
          <DebugButton label="Celebrate" onPress={onCelebrate} tone="accent" />
          <DebugButton label="Stop" onPress={onStop} />
          <DebugButton
            label={calmModePreference ? 'CalmMode On' : 'CalmMode Off'}
            onPress={() => onSetCalmMode(!calmModePreference)}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Error Categories</Text>
        <ErrorGroup category="asset" messages={diagnostics.errorsByCategory.asset} />
        <ErrorGroup category="runtime" messages={diagnostics.errorsByCategory.runtime} />
        <ErrorGroup category="binding" messages={diagnostics.errorsByCategory.binding} />
        <ErrorGroup category="playback" messages={diagnostics.errorsByCategory.playback} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Manual Validation Flow</Text>
        {validationRows.map((row) => (
          <ValidationRow key={row.label} label={row.label} note={row.note} status={row.status} />
        ))}
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
    gap: toddlerTheme.spacing.md,
    padding: toddlerTheme.spacing.lg,
  },
  title: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  caption: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  section: {
    gap: toddlerTheme.spacing.sm,
  },
  sectionTitle: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 15,
    fontWeight: '800',
  },
  row: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: toddlerTheme.spacing.sm,
  },
  statusBlock: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.md,
    gap: 6,
    padding: toddlerTheme.spacing.md,
  },
  statusLine: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 13,
    lineHeight: 18,
  },
  button: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.pill,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  buttonBrand: {
    backgroundColor: toddlerTheme.colors.brand,
  },
  buttonAccent: {
    backgroundColor: toddlerTheme.colors.accent,
  },
  buttonText: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  buttonTextBrand: {
    color: toddlerTheme.colors.white,
  },
  buttonTextAccent: {
    color: toddlerTheme.colors.accentText,
  },
  errorGroup: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.md,
    gap: 6,
    padding: toddlerTheme.spacing.md,
  },
  errorGroupTitle: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 13,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  errorLine: {
    color: '#8a3b10',
    fontSize: 13,
    lineHeight: 18,
  },
  errorLineMuted: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
  validationRow: {
    alignItems: 'flex-start',
    backgroundColor: toddlerTheme.colors.surfaceMuted,
    borderRadius: toddlerTheme.radii.md,
    flexDirection: 'row',
    gap: toddlerTheme.spacing.sm,
    padding: toddlerTheme.spacing.md,
  },
  validationBadge: {
    backgroundColor: toddlerTheme.colors.white,
    borderRadius: toddlerTheme.radii.pill,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  validationBadgePass: {
    backgroundColor: toddlerTheme.colors.brand,
  },
  validationBadgeFail: {
    backgroundColor: '#f9c4ad',
  },
  validationBadgeCheck: {
    backgroundColor: toddlerTheme.colors.accent,
  },
  validationBadgeText: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 11,
    fontWeight: '800',
  },
  validationBadgeTextPass: {
    color: toddlerTheme.colors.white,
  },
  validationBadgeTextFail: {
    color: '#7e2d0b',
  },
  validationBadgeTextCheck: {
    color: toddlerTheme.colors.accentText,
  },
  validationCopy: {
    flex: 1,
    gap: 4,
  },
  validationLabel: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 14,
    fontWeight: '800',
  },
  validationNote: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 13,
    lineHeight: 18,
  },
})
