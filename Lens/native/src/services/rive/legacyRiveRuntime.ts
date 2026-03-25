import type { ComponentType } from 'react'

type LegacyRiveError = {
  code?: number | string
  message?: string
  name?: string
}

export type LegacyRiveRef = {
  fireState: (stateMachineName: string, inputName: string) => void
  pause: () => void
  play: (
    animationName?: string,
    loop?: unknown,
    direction?: unknown,
    isStateMachine?: boolean,
  ) => void
  reset: () => void
  setInputState: (stateMachineName: string, inputName: string, value: boolean | number) => void
  stop: () => void
}

type LegacyRiveComponentProps = {
  artboardName?: string
  autoplay?: boolean
  onError?: (error: LegacyRiveError) => void
  onPause?: (animationName: string, isStateMachine: boolean) => void
  onPlay?: (animationName: string, isStateMachine: boolean) => void
  onStateChanged?: (stateMachineName: string, stateName: string) => void
  resourceName?: string
  stateMachineName?: string
  style?: unknown
}

type LegacyRiveModule = {
  default?: ComponentType<LegacyRiveComponentProps>
}

export type LegacyRiveRuntimeResolution =
  | {
      available: true
      RiveComponent: ComponentType<LegacyRiveComponentProps>
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

export function resolveLegacyRiveRuntime(): LegacyRiveRuntimeResolution {
  try {
    const legacyModule = require('rive-react-native') as LegacyRiveModule
    const RiveComponent = legacyModule.default ?? legacyModule

    if (!RiveComponent) {
      return {
        available: false,
        reason: 'rive-react-native is installed, but the Rive component was not exported correctly.',
      }
    }

    return {
      available: true,
      RiveComponent,
    }
  } catch (error) {
    return {
      available: false,
      reason: `Install the official legacy React Native runtime package \`rive-react-native\` to enable the live avatar. ${toReadableError(error)}`,
    }
  }
}

export function formatLegacyRiveError(error: unknown): string {
  if (!error || typeof error !== 'object') {
    return toReadableError(error)
  }

  const maybeError = error as LegacyRiveError

  if (maybeError.code && maybeError.message) {
    return `${String(maybeError.code)}: ${maybeError.message}`
  }

  return maybeError.message ?? toReadableError(error)
}
