import type { ComponentType } from 'react'
import type { AvatarRuntimeFailureKind } from '../../core/avatar/avatarRuntimeDiagnostics'

export const NEW_RIVE_ERROR_TYPES = {
  FileNotFound: 1,
  IncorrectArtboardName: 3,
  IncorrectStateMachineInputName: 8,
  IncorrectStateMachineName: 4,
  MalformedFile: 2,
  Unknown: 0,
  ViewModelInstanceNotFound: 6,
} as const

type NewRiveError = {
  message?: string
  type?: number
}

export type NewRiveViewRef = {
  awaitViewReady: () => Promise<boolean>
  getBooleanInputValue?: (name: string, path?: string) => boolean
  getNumberInputValue?: (name: string, path?: string) => number
  pause?: () => Promise<void>
  play?: () => Promise<void>
  playIfNeeded: () => void
  reset?: () => Promise<void>
  setBooleanInputValue: (name: string, value: boolean, path?: string) => void
  setNumberInputValue: (name: string, value: number, path?: string) => void
  triggerInput: (name: string, path?: string) => void
}

type UseRiveResult = {
  riveViewRef: NewRiveViewRef | null
  setHybridRef: (ref: unknown) => void
}

type UseRiveFileResult = {
  error?: NewRiveError | null
  isLoading?: boolean
  riveFile?: unknown | null
}

type RiveRuntimeStatus = {
  error?: string | null
  isInitialized: boolean
}

type NewRiveModule = {
  Fit: {
    Contain?: unknown
    Layout?: unknown
  }
  RiveRuntime?: {
    getStatus?: () => RiveRuntimeStatus
  }
  RiveView: ComponentType<{
    artboardName?: string
    autoPlay?: boolean
    file: unknown
    fit?: unknown
    hybridRef?: (ref: unknown) => void
    onError: (error: NewRiveError) => void
    stateMachineName?: string
    style?: unknown
  }>
  useRive: () => UseRiveResult
  useRiveFile: (source: unknown) => UseRiveFileResult
}

export type ResolvedNewRiveRuntime =
  | {
      available: true
      module: NewRiveModule
    }
  | {
      available: false
      reason: string
    }

function toReadableError(error: unknown): string {
  if (!error) {
    return 'Unknown Rive runtime error.'
  }

  if (typeof error === 'string') {
    return error
  }

  if (typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message
  }

  return 'Unknown Rive runtime error.'
}

export function formatNewRuntimeError(error: unknown): string {
  return toReadableError(error)
}

export function classifyNewRuntimeError(errorType?: number): AvatarRuntimeFailureKind {
  switch (errorType) {
    case NEW_RIVE_ERROR_TYPES.FileNotFound:
    case NEW_RIVE_ERROR_TYPES.MalformedFile:
      return 'file'
    case NEW_RIVE_ERROR_TYPES.IncorrectArtboardName:
      return 'artboard'
    case NEW_RIVE_ERROR_TYPES.IncorrectStateMachineName:
      return 'stateMachine'
    case NEW_RIVE_ERROR_TYPES.IncorrectStateMachineInputName:
      return 'input'
    default:
      return 'runtime'
  }
}

export function resolveNewRiveRuntime(): ResolvedNewRiveRuntime {
  try {
    const module = require('@rive-app/react-native') as NewRiveModule

    if (!module?.RiveView || !module?.useRive || !module?.useRiveFile) {
      return {
        available: false,
        reason: 'The @rive-app/react-native package is installed, but its new-runtime exports are incomplete.',
      }
    }

    return {
      available: true,
      module,
    }
  } catch (error) {
    return {
      available: false,
      reason: `Install @rive-app/react-native and react-native-nitro-modules to enable the live avatar. ${toReadableError(error)}`,
    }
  }
}
