export type AvatarDiagnosticCategory = 'asset' | 'runtime' | 'binding' | 'playback'

export type AvatarRuntimeFailureKind =
  | 'none'
  | 'package'
  | 'file'
  | 'artboard'
  | 'stateMachine'
  | 'input'
  | 'runtime'
  | 'android-runtime'

export type AvatarInputName = 'activityIndex' | 'isPlaying' | 'celebrate' | 'calmMode'

export type AvatarInputValidationStatus = 'pending' | 'valid' | 'invalid'

export type AndroidRiveRuntimeStatus = {
  error: string | null
  isInitialized: boolean
  source: 'native-module' | 'not-android' | 'package' | 'unavailable'
  summary: string
}

export type AvatarDiagnosticGroups = Record<AvatarDiagnosticCategory, string[]>

export type AvatarInputValidationMap = Record<AvatarInputName, AvatarInputValidationStatus>

export type AvatarAdapterTrace = {
  bridgeAttached: boolean
  calmMode: boolean
  lastActivityIndex: number
  lastCelebrateAt: string | null
  lastCommand: string
  lastIsPlaying: boolean
  lastUpdatedAt: string | null
}

export type AvatarRuntimeDiagnostics = {
  androidRuntimeStatus: AndroidRiveRuntimeStatus
  artboardResolved: boolean
  bindingFailed: boolean
  errorsByCategory: AvatarDiagnosticGroups
  expectedArtboard: string
  expectedInputNames: string[]
  expectedStateMachine: string
  fileLoaded: boolean
  fileLoading: boolean
  fileMissingLikely: boolean
  inputValidation: AvatarInputValidationMap
  latestError: string | null
  latestErrorKind: AvatarRuntimeFailureKind
  packageAvailable: boolean
  runtimeReady: boolean
  stateMachineResolved: boolean
}

export function createAvatarAdapterTrace(): AvatarAdapterTrace {
  return {
    bridgeAttached: false,
    calmMode: false,
    lastActivityIndex: 0,
    lastCelebrateAt: null,
    lastCommand: 'idle',
    lastIsPlaying: false,
    lastUpdatedAt: null,
  }
}

export function createAvatarDiagnosticGroups(): AvatarDiagnosticGroups {
  return {
    asset: [],
    binding: [],
    playback: [],
    runtime: [],
  }
}

export function createAvatarInputValidation(): AvatarInputValidationMap {
  return {
    activityIndex: 'pending',
    calmMode: 'pending',
    celebrate: 'pending',
    isPlaying: 'pending',
  }
}

export function classifyFailureCategory(kind: AvatarRuntimeFailureKind): AvatarDiagnosticCategory {
  switch (kind) {
    case 'file':
      return 'asset'
    case 'input':
      return 'binding'
    case 'artboard':
    case 'stateMachine':
    case 'runtime':
    case 'android-runtime':
    case 'package':
      return 'runtime'
    default:
      return 'playback'
  }
}

export function createAvatarRuntimeDiagnostics({
  artboard,
  inputNames,
  stateMachine,
}: {
  artboard: string
  inputNames: string[]
  stateMachine: string
}): AvatarRuntimeDiagnostics {
  return {
    androidRuntimeStatus: {
      error: null,
      isInitialized: true,
      source: 'unavailable',
      summary: 'Runtime status not checked yet.',
    },
    artboardResolved: false,
    bindingFailed: false,
    errorsByCategory: createAvatarDiagnosticGroups(),
    expectedArtboard: artboard,
    expectedInputNames: inputNames,
    expectedStateMachine: stateMachine,
    fileLoaded: false,
    fileLoading: false,
    fileMissingLikely: false,
    inputValidation: createAvatarInputValidation(),
    latestError: null,
    latestErrorKind: 'none',
    packageAvailable: false,
    runtimeReady: false,
    stateMachineResolved: false,
  }
}
