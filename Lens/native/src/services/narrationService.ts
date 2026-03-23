type SpeakOptions = {
  calm?: boolean
}

export type NarrationService = {
  cancel: () => void
  getStatusLabel: () => string
  setMuted: (nextMuted: boolean) => void
  speak: (text: string, options?: SpeakOptions) => Promise<void>
}

export function createNarrationService(): NarrationService {
  let isMuted = false

  return {
    async speak(text: string) {
      if (isMuted || !text) {
        return
      }

      await Promise.resolve()
    },
    cancel() {},
    setMuted(nextMuted: boolean) {
      isMuted = nextMuted
    },
    getStatusLabel() {
      return isMuted ? 'Voice muted, subtitles on' : 'Native narration placeholder, subtitles on'
    },
  }
}
