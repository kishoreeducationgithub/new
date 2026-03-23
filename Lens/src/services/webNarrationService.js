const FEMALE_VOICE_HINTS = [
  'zira',
  'aria',
  'jenny',
  'samantha',
  'ava',
  'susan',
  'victoria',
  'moira',
  'serena',
  'libby',
  'allison',
  'hazel',
  'emma',
  'olivia',
  'neha',
  'priya',
  'heera',
  'female',
]

function loadAvailableVoices() {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return Promise.resolve([])
  }

  const currentVoices = window.speechSynthesis.getVoices()
  if (currentVoices.length > 0) {
    return Promise.resolve(currentVoices)
  }

  return new Promise((resolve) => {
    const handleVoicesChanged = () => {
      resolve(window.speechSynthesis.getVoices())
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
    }

    window.speechSynthesis.addEventListener('voiceschanged', handleVoicesChanged)
    window.setTimeout(() => {
      window.speechSynthesis.removeEventListener('voiceschanged', handleVoicesChanged)
      resolve(window.speechSynthesis.getVoices())
    }, 500)
  })
}

function selectWarmFemaleVoice(voices) {
  const englishVoices = voices.filter((voice) => voice.lang.toLowerCase().startsWith('en'))

  for (const hint of FEMALE_VOICE_HINTS) {
    const match = englishVoices.find((voice) => voice.name.toLowerCase().includes(hint))
    if (match) {
      return match
    }
  }

  return englishVoices[0] ?? voices[0] ?? null
}

export function createWebNarrationService() {
  let isMuted = false
  let lastVoiceLabel = 'Subtitles only'

  const speechSupported = typeof window !== 'undefined' && 'speechSynthesis' in window

  async function speak(text, { calm = false } = {}) {
    if (!speechSupported || isMuted || !text) {
      return
    }

    window.speechSynthesis.cancel()

    const voices = await loadAvailableVoices()
    const selectedVoice = selectWarmFemaleVoice(voices)

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.voice = selectedVoice
    utterance.rate = calm ? 0.88 : 0.94
    utterance.pitch = 1.08
    utterance.volume = 1

    lastVoiceLabel = selectedVoice ? `${selectedVoice.name} voice` : 'Browser narration'
    window.speechSynthesis.speak(utterance)
  }

  function cancel() {
    if (speechSupported) {
      window.speechSynthesis.cancel()
    }
  }

  function setMuted(nextMuted) {
    isMuted = nextMuted
    if (isMuted) {
      cancel()
    }
  }

  function getStatusLabel() {
    if (isMuted) {
      return 'Voice muted, subtitles on'
    }

    if (!speechSupported) {
      return 'Speech synthesis unavailable, subtitles on'
    }

    return `Warm female browser voice, ${lastVoiceLabel}`
  }

  return {
    cancel,
    getStatusLabel,
    getSupported: () => speechSupported,
    setMuted,
    speak,
  }
}
