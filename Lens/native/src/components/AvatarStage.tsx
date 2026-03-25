import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native'
import {
  classifyFailureCategory,
  createAvatarDiagnosticGroups,
  createAvatarInputValidation,
  createAvatarRuntimeDiagnostics,
  type AndroidRiveRuntimeStatus,
  type AvatarDiagnosticCategory,
  type AvatarDiagnosticGroups,
  type AvatarInputName,
  type AvatarInputValidationMap,
  type AvatarRuntimeDiagnostics,
  type AvatarRuntimeFailureKind,
} from '../core/avatar/avatarRuntimeDiagnostics'
import type { ToddlerAvatarRuntimeSnapshot } from '../core/avatar/toddlerAvatar'
import {
  createNewRiveInputBridge,
  type NewRiveBindingEvent,
} from '../services/rive/createNewRiveInputBridge'
import { getAndroidRiveRuntimeStatus } from '../services/rive/getAndroidRiveRuntimeStatus'
import {
  classifyNewRuntimeError,
  formatNewRuntimeError,
  resolveNewRiveRuntime,
  type ResolvedNewRiveRuntime,
} from '../services/rive/newRiveRuntime'
import type { RiveInputBridge } from '../services/rive/ToddlerGuideRiveAdapter'
import { toddlerTheme } from '../theme/toddlerTheme'

type AvatarStageProps = {
  activityLabel: string
  attachBridge: (bridge: RiveInputBridge | null) => void
  asset: {
    artboard: string
    assetPath: string
    inputNames: string[]
    resourceName: string
    stateMachine: string
  }
  onDiagnosticsChange: (diagnostics: AvatarRuntimeDiagnostics) => void
  snapshot: ToddlerAvatarRuntimeSnapshot
}

type FileStatus = {
  error: string | null
  loaded: boolean
  loading: boolean
  missingLikely: boolean
}

function appendUniqueMessage(existing: string[], nextMessage: string) {
  if (existing.includes(nextMessage)) {
    return existing
  }

  return [...existing, nextMessage].slice(-4)
}

function defaultAndroidStatus(): AndroidRiveRuntimeStatus {
  return {
    error: null,
    isInitialized: true,
    source: 'unavailable',
    summary: 'Runtime status not checked yet.',
  }
}

function toInputName(name: string): AvatarInputName | null {
  if (name === 'activityIndex' || name === 'isPlaying' || name === 'celebrate' || name === 'calmMode') {
    return name
  }

  return null
}

function isLikelyMissingLocalAsset(message: string | null) {
  if (!message) {
    return false
  }

  return /cannot find module|could not be found|file not found|unable to resolve module/i.test(message)
}

function resolveLocalAssetSource(assetResourceName: string) {
  try {
    return {
      loadError: null as string | null,
      source: require('../../assets/rive/toddlerGuide.riv'),
    }
  } catch (error) {
    return {
      loadError: formatNewRuntimeError(error),
      source: assetResourceName,
    }
  }
}

function LiveRiveViewport({
  asset,
  onBindingEvent,
  onBridgeReady,
  onFileStatusChange,
  onRuntimeReadyChange,
  onViewError,
  onViewReady,
  runtime,
}: {
  asset: AvatarStageProps['asset']
  onBindingEvent: (event: NewRiveBindingEvent) => void
  onBridgeReady: (bridge: RiveInputBridge | null) => void
  onFileStatusChange: (status: FileStatus) => void
  onRuntimeReadyChange: (ready: boolean) => void
  onViewError: (message: string, kind: AvatarRuntimeFailureKind, category?: AvatarDiagnosticCategory) => void
  onViewReady: () => void
  runtime: Extract<ResolvedNewRiveRuntime, { available: true }>['module']
}) {
  const localAssetSource = useMemo(() => resolveLocalAssetSource(asset.resourceName), [asset.resourceName])
  const { riveFile, isLoading, error } = runtime.useRiveFile(localAssetSource.source)
  const { riveViewRef, setHybridRef } = runtime.useRive()

  useEffect(() => {
    const runtimeFileError = error ? formatNewRuntimeError(error) : null
    const combinedFileError = localAssetSource.loadError ?? runtimeFileError

    onFileStatusChange({
      error: combinedFileError,
      loaded: Boolean(riveFile) && !combinedFileError,
      loading: Boolean(isLoading) && !combinedFileError,
      missingLikely: isLikelyMissingLocalAsset(combinedFileError),
    })
  }, [error, isLoading, localAssetSource.loadError, onFileStatusChange, riveFile])

  useEffect(() => {
    let isMounted = true

    if (!riveViewRef || !riveFile || isLoading || error || localAssetSource.loadError) {
      onBridgeReady(null)
      onRuntimeReadyChange(false)
      return
    }

    onBridgeReady(
      createNewRiveInputBridge({
        onBindingEvent,
        onBridgeError: (message) => {
          onViewError(message, 'input', 'binding')
        },
        riveViewRef,
      }),
    )

    void riveViewRef
      .awaitViewReady()
      .then((ready) => {
        if (!isMounted) {
          return
        }

        onRuntimeReadyChange(ready)

        if (!ready) {
          onViewError('RiveView did not become ready after file load.', 'runtime', 'playback')
          return
        }

        onViewReady()
      })
      .catch((viewError) => {
        if (!isMounted) {
          return
        }

        onRuntimeReadyChange(false)
        onViewError(formatNewRuntimeError(viewError), 'runtime', 'playback')
      })

    return () => {
      isMounted = false
      onBridgeReady(null)
      onRuntimeReadyChange(false)
    }
  }, [
    error,
    isLoading,
    localAssetSource.loadError,
    onBindingEvent,
    onBridgeReady,
    onRuntimeReadyChange,
    onViewError,
    onViewReady,
    riveFile,
    riveViewRef,
  ])

  if (localAssetSource.loadError) {
    return (
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>Local .riv asset missing</Text>
        <Text style={styles.placeholderText}>{localAssetSource.loadError}</Text>
        <Text style={styles.placeholderHint}>Expected local file: {asset.assetPath}</Text>
      </View>
    )
  }

  if (isLoading) {
    return (
      <View style={styles.loadingCard}>
        <ActivityIndicator size="large" color={toddlerTheme.colors.brandStrong} />
        <Text style={styles.loadingText}>Loading toddlerGuide.riv...</Text>
      </View>
    )
  }

  if (error || !riveFile) {
    return (
      <View style={styles.placeholderCard}>
        <Text style={styles.placeholderTitle}>Rive file failed to load</Text>
        <Text style={styles.placeholderText}>
          {formatNewRuntimeError(error ?? 'The local Rive file could not be created.')}
        </Text>
        <Text style={styles.placeholderHint}>Expected local file: {asset.assetPath}</Text>
      </View>
    )
  }

  return (
    <View style={styles.riveFrame}>
      <runtime.RiveView
        artboardName={asset.artboard}
        autoPlay={true}
        file={riveFile}
        fit={runtime.Fit.Contain}
        hybridRef={setHybridRef}
        onError={(riveError) => {
          const message = formatNewRuntimeError(riveError)
          const kind = classifyNewRuntimeError(riveError?.type)

          console.error('[ToddlerGuide][RiveView]', message, riveError)
          onViewError(message, kind)
        }}
        stateMachineName={asset.stateMachine}
        style={styles.riveView}
      />
    </View>
  )
}

export function AvatarStage({
  activityLabel,
  attachBridge,
  asset,
  onDiagnosticsChange,
  snapshot,
}: AvatarStageProps) {
  const runtime = useMemo(() => resolveNewRiveRuntime(), [])
  const [androidRuntimeStatus, setAndroidRuntimeStatus] = useState<AndroidRiveRuntimeStatus>(defaultAndroidStatus())
  const [artboardResolved, setArtboardResolved] = useState(false)
  const [errorsByCategory, setErrorsByCategory] = useState<AvatarDiagnosticGroups>(createAvatarDiagnosticGroups())
  const [fileStatus, setFileStatus] = useState<FileStatus>({
    error: null,
    loaded: false,
    loading: false,
    missingLikely: false,
  })
  const [inputValidation, setInputValidation] = useState<AvatarInputValidationMap>(createAvatarInputValidation())
  const [latestError, setLatestError] = useState<string | null>(runtime.available ? null : runtime.reason)
  const [latestErrorKind, setLatestErrorKind] = useState<AvatarRuntimeFailureKind>(
    runtime.available ? 'none' : 'package',
  )
  const [runtimeReady, setRuntimeReady] = useState(false)
  const [stateMachineResolved, setStateMachineResolved] = useState(false)

  const actionLabel =
    snapshot.action === 'idle'
      ? 'Idle'
      : snapshot.action === 'celebrate'
        ? 'Celebrate'
        : activityLabel

  const stageStatus = !runtime.available
    ? 'Package missing'
    : fileStatus.loading
      ? 'Loading file'
      : fileStatus.error
        ? 'Asset issue'
        : latestError
          ? 'Validation issue'
          : runtimeReady
            ? 'Live'
            : 'Waiting'

  const pushCategoryError = useCallback((category: AvatarDiagnosticCategory, message: string) => {
    setErrorsByCategory((previous) => ({
      ...previous,
      [category]: appendUniqueMessage(previous[category], message),
    }))
  }, [])

  const recordError = useCallback(
    (
      message: string,
      kind: AvatarRuntimeFailureKind,
      category: AvatarDiagnosticCategory = classifyFailureCategory(kind),
    ) => {
      setLatestError(message)
      setLatestErrorKind(kind)
      pushCategoryError(category, message)
    },
    [pushCategoryError],
  )

  const handleBindingEvent = useCallback(
    (event: NewRiveBindingEvent) => {
      const inputName = toInputName(event.inputName)

      if (!inputName) {
        return
      }

      setInputValidation((previous) => ({
        ...previous,
        [inputName]: event.outcome === 'success' ? 'valid' : 'invalid',
      }))

      if (event.outcome === 'error' && event.message) {
        recordError(event.message, 'input', 'binding')
      }
    },
    [recordError],
  )

  const handleBridgeReady = useCallback(
    (bridge: RiveInputBridge | null) => {
      attachBridge(bridge)
    },
    [attachBridge],
  )

  const handleViewReady = useCallback(() => {
    setArtboardResolved(true)
    setStateMachineResolved(true)
  }, [])

  useEffect(() => {
    if (!runtime.available) {
      recordError(runtime.reason, 'package', 'runtime')
    }
  }, [recordError, runtime])

  useEffect(() => {
    let isMounted = true

    void getAndroidRiveRuntimeStatus(runtime).then((status) => {
      if (!isMounted) {
        return
      }

      setAndroidRuntimeStatus(status)

      if (!status.isInitialized) {
        recordError(status.error ?? status.summary, 'android-runtime', 'runtime')
      }
    })

    return () => {
      isMounted = false
      attachBridge(null)
    }
  }, [attachBridge, recordError, runtime])

  useEffect(() => {
    if (!runtime.available) {
      attachBridge(null)
      setRuntimeReady(false)
      return
    }

    if (fileStatus.error) {
      recordError(fileStatus.error, 'file', 'asset')
    } else if (fileStatus.loaded && latestErrorKind === 'file') {
      setLatestError(null)
      setLatestErrorKind('none')
    }
  }, [attachBridge, fileStatus.error, fileStatus.loaded, latestErrorKind, recordError, runtime.available])

  useEffect(() => {
    if (!runtimeReady) {
      return
    }

    if (snapshot.isPlaying && snapshot.activityIndex === 0) {
      pushCategoryError('playback', 'Playback is active while activityIndex is idle. Confirm state-machine logic.')
    }
  }, [pushCategoryError, runtimeReady, snapshot.activityIndex, snapshot.isPlaying])

  useEffect(() => {
    const diagnostics = createAvatarRuntimeDiagnostics({
      artboard: asset.artboard,
      inputNames: asset.inputNames,
      stateMachine: asset.stateMachine,
    })

    onDiagnosticsChange({
      ...diagnostics,
      androidRuntimeStatus,
      artboardResolved,
      bindingFailed: errorsByCategory.binding.length > 0,
      errorsByCategory,
      fileLoaded: fileStatus.loaded,
      fileLoading: fileStatus.loading,
      fileMissingLikely: fileStatus.missingLikely,
      inputValidation,
      latestError,
      latestErrorKind,
      packageAvailable: runtime.available,
      runtimeReady,
      stateMachineResolved,
    })
  }, [
    androidRuntimeStatus,
    artboardResolved,
    asset.artboard,
    asset.inputNames,
    asset.stateMachine,
    errorsByCategory,
    fileStatus.loaded,
    fileStatus.loading,
    fileStatus.missingLikely,
    inputValidation,
    latestError,
    latestErrorKind,
    onDiagnosticsChange,
    runtime.available,
    runtimeReady,
    stateMachineResolved,
  ])

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.eyebrow}>Avatar Stage</Text>
        <View style={[styles.statusPill, runtimeReady ? styles.statusPillActive : styles.statusPillIdle]}>
          <Text style={[styles.statusText, runtimeReady ? styles.statusTextActive : styles.statusTextIdle]}>
            {stageStatus}
          </Text>
        </View>
      </View>

      <Text style={styles.title}>{activityLabel}</Text>

      <View style={styles.stageSurface}>
        {runtime.available ? (
          <LiveRiveViewport
            asset={asset}
            onBindingEvent={handleBindingEvent}
            onBridgeReady={handleBridgeReady}
            onFileStatusChange={setFileStatus}
            onRuntimeReadyChange={setRuntimeReady}
            onViewError={recordError}
            onViewReady={handleViewReady}
            runtime={runtime.module}
          />
        ) : (
          <View style={styles.placeholderCard}>
            <Text style={styles.placeholderTitle}>New Rive runtime unavailable</Text>
            <Text style={styles.placeholderText}>{runtime.reason}</Text>
          </View>
        )}

        <View style={styles.summaryCard}>
          <Text style={styles.avatarLabel}>Toddler Guide</Text>
          <Text style={styles.avatarAction}>{actionLabel}</Text>
          <Text style={styles.helper}>
            Expecting {asset.resourceName}.riv | {asset.artboard} | {asset.stateMachine}
          </Text>
        </View>

        <Text style={styles.meta}>Motion slot {snapshot.activityIndex}</Text>
        <Text style={styles.meta}>Calm setting {snapshot.calmMode ? 'on' : 'off'}</Text>
        <Text style={styles.meta}>Celebrate pulses {snapshot.celebrateCount}</Text>
        <Text style={styles.meta}>{androidRuntimeStatus.summary}</Text>
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
  headerRow: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eyebrow: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1.6,
    textTransform: 'uppercase',
  },
  statusPill: {
    borderRadius: toddlerTheme.radii.pill,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  statusPillActive: {
    backgroundColor: toddlerTheme.colors.brand,
  },
  statusPillIdle: {
    backgroundColor: toddlerTheme.colors.surfaceMuted,
  },
  statusText: {
    fontSize: 13,
    fontWeight: '800',
  },
  statusTextActive: {
    color: toddlerTheme.colors.white,
  },
  statusTextIdle: {
    color: toddlerTheme.colors.textSecondary,
  },
  title: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 28,
    fontWeight: '800',
  },
  stageSurface: {
    alignItems: 'center',
    backgroundColor: toddlerTheme.colors.stage,
    borderRadius: toddlerTheme.radii.lg,
    gap: toddlerTheme.spacing.sm,
    justifyContent: 'center',
    minHeight: 360,
    padding: toddlerTheme.spacing.xl,
  },
  riveFrame: {
    backgroundColor: toddlerTheme.colors.white,
    borderRadius: toddlerTheme.radii.lg,
    height: 300,
    overflow: 'hidden',
    width: '100%',
  },
  riveView: {
    flex: 1,
    width: '100%',
  },
  loadingCard: {
    alignItems: 'center',
    backgroundColor: toddlerTheme.colors.white,
    borderRadius: toddlerTheme.radii.lg,
    gap: toddlerTheme.spacing.sm,
    padding: toddlerTheme.spacing.xl,
    width: '100%',
  },
  loadingText: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 15,
  },
  placeholderCard: {
    backgroundColor: toddlerTheme.colors.white,
    borderRadius: toddlerTheme.radii.lg,
    gap: toddlerTheme.spacing.xs,
    padding: toddlerTheme.spacing.lg,
    width: '100%',
  },
  placeholderTitle: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  placeholderText: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
  },
  placeholderHint: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
  },
  summaryCard: {
    alignItems: 'center',
    backgroundColor: toddlerTheme.colors.stageAccent,
    borderRadius: toddlerTheme.radii.lg,
    gap: toddlerTheme.spacing.xs,
    padding: toddlerTheme.spacing.lg,
    width: '100%',
  },
  avatarLabel: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 16,
    fontWeight: '700',
  },
  avatarAction: {
    color: toddlerTheme.colors.textPrimary,
    fontSize: 32,
    fontWeight: '800',
    textTransform: 'capitalize',
  },
  helper: {
    color: toddlerTheme.colors.textSecondary,
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  meta: {
    color: toddlerTheme.colors.textMuted,
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
  },
})
