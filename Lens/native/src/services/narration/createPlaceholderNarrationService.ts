import type { NarrationLine } from '../../core/models/toddlerActivity'

export type NarrationService = {
  isSpeaking: () => boolean
  speak: (lines: NarrationLine[]) => Promise<void>
  stop: () => void
}

export function createPlaceholderNarrationService(): NarrationService {
  let speaking = false
  let activeToken = 0
  let completionTimeout: ReturnType<typeof setTimeout> | null = null
  let pendingResolve: (() => void) | null = null

  const clearActiveTimeout = () => {
    if (completionTimeout) {
      clearTimeout(completionTimeout)
      completionTimeout = null
    }
  }

  const stop = () => {
    activeToken += 1
    speaking = false
    clearActiveTimeout()
    pendingResolve?.()
    pendingResolve = null
  }

  return {
    isSpeaking: () => speaking,
    async speak(lines) {
      stop()

      if (!lines.length) {
        return
      }

      const token = activeToken
      const totalDurationMs = Math.max(...lines.map((line) => line.endMs), 0)

      speaking = true

      await new Promise<void>((resolve) => {
        pendingResolve = resolve
        completionTimeout = setTimeout(() => {
          if (token !== activeToken) {
            pendingResolve = null
            resolve()
            return
          }

          speaking = false
          completionTimeout = null
          pendingResolve = null
          resolve()
        }, totalDurationMs)
      })
    },
    stop,
  }
}
