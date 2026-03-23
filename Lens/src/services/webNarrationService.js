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
    }, 1200)
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
  let speakRequestId = 0
  let hasSpokenAtLeastOnce = false

  const speechSupported =
    typeof window !== 'undefined' &&
    'speechSynthesis' in window &&
    typeof window.SpeechSynthesisUtterance !== 'undefined'

  function applyUtteranceVoice(utterance, voice) {
    if (voice) {
      utterance.voice = voice
      utterance.lang = voice.lang
    } else {
      utterance.lang = 'en-US'
    }
  }

  function createUtterance(text, { calm = false } = {}, voice = null) {
    const utterance = new window.SpeechSynthesisUtterance(text)
    applyUtteranceVoice(utterance, voice)
    utterance.rate = calm ? 0.86 : 0.92
    utterance.pitch = 1.08
    utterance.volume = 1
    return utterance
  }

  function prime() {
    if (!speechSupported) {
      return
    }

    loadAvailableVoices()

    try {
      window.speechSynthesis.resume()
    } catch {
      // Some browsers throw if speech has not started yet.
    }
  }

  function waitForSpeechStart(utterance, requestId) {
    return new Promise((resolve) => {
      let settled = false

      const finish = (didStart) => {
        if (settled) {
          return
        }

        settled = true
        resolve(didStart && requestId === speakRequestId)
      }

      utterance.onstart = () => {
        hasSpokenAtLeastOnce = true
        finish(true)
      }

      utterance.onerror = () => {
        finish(false)
      }

      window.setTimeout(() => {
        finish(false)
      }, 900)
    })
  }

  async function speak(text, { calm = false } = {}) {
    if (!speechSupported || isMuted || !text) {
      return false
    }

    const synth = window.speechSynthesis
    const requestId = ++speakRequestId

    try {
      synth.cancel()
      synth.resume()
    } catch {
      // Resume can fail harmlessly before any speech has started.
    }

    const voices = await loadAvailableVoices()

    if (requestId !== speakRequestId || isMuted) {
      return false
    }

    const selectedVoice = selectWarmFemaleVoice(voices)
    const utterance = createUtterance(text, { calm }, selectedVoice)

    lastVoiceLabel = selectedVoice ? `${selectedVoice.name} voice` : 'Browser narration'
    synth.speak(utterance)

    const didStart = await waitForSpeechStart(utterance, requestId)

    if (didStart || requestId !== speakRequestId || isMuted) {
      return didStart
    }

    try {
      synth.cancel()
      synth.resume()
    } catch {
      // Safe fallback if resume is not available yet.
    }

    const fallbackUtterance = createUtterance(text, { calm })
    lastVoiceLabel = 'Browser narration'
    synth.speak(fallbackUtterance)

    return waitForSpeechStart(fallbackUtterance, requestId)
  }

  function cancel() {
    if (speechSupported) {
      speakRequestId += 1
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
    hasSpokenAtLeastOnce: () => hasSpokenAtLeastOnce,
    getStatusLabel,
    getSupported: () => speechSupported,
    prime,
    setMuted,
    speak,
  }
}
