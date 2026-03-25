import { NativeModules, Platform } from 'react-native'
import type { AndroidRiveRuntimeStatus } from '../../core/avatar/avatarRuntimeDiagnostics'
import type { ResolvedNewRiveRuntime } from './newRiveRuntime'

type NativeRuntimeStatusModule = {
  getStatus?: () => Promise<{ error?: string | null; isInitialized?: boolean }> | { error?: string | null; isInitialized?: boolean }
}

function normalizeRuntimeStatus({
  error,
  isInitialized,
  source,
}: {
  error?: string | null
  isInitialized?: boolean
  source: AndroidRiveRuntimeStatus['source']
}): AndroidRiveRuntimeStatus {
  return {
    error: error ?? null,
    isInitialized: Boolean(isInitialized),
    source,
    summary: error ? `Initialization failed: ${error}` : isInitialized ? 'Rive runtime initialized.' : 'Rive runtime not initialized.',
  }
}

export async function getAndroidRiveRuntimeStatus(
  runtime: ResolvedNewRiveRuntime,
): Promise<AndroidRiveRuntimeStatus> {
  if (Platform.OS !== 'android') {
    return {
      error: null,
      isInitialized: true,
      source: 'not-android',
      summary: 'Android runtime status only applies on Android.',
    }
  }

  if (runtime.available && typeof runtime.module.RiveRuntime?.getStatus === 'function') {
    try {
      return normalizeRuntimeStatus({
        ...runtime.module.RiveRuntime.getStatus(),
        source: 'package',
      })
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown RiveRuntime.getStatus() failure.',
        isInitialized: false,
        source: 'package',
        summary: 'Package runtime status probe failed.',
      }
    }
  }

  const nativeRuntimeModule = NativeModules.ToddlerGuideRiveRuntimeStatus as NativeRuntimeStatusModule | undefined

  if (nativeRuntimeModule?.getStatus) {
    try {
      return normalizeRuntimeStatus({
        ...(await nativeRuntimeModule.getStatus()),
        source: 'native-module',
      })
    } catch (error) {
      return {
        error: error instanceof Error ? error.message : 'Unknown native runtime status failure.',
        isInitialized: false,
        source: 'native-module',
        summary: 'Native-module runtime status probe failed.',
      }
    }
  }

  return {
    error: 'RiveRuntime.getStatus() is not exposed in this build.',
    isInitialized: false,
    source: 'unavailable',
    summary: 'Android runtime status unavailable.',
  }
}
