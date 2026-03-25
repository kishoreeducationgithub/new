export type ActivityId = 'wave' | 'clap' | 'handsUp' | 'jump' | 'sway' | 'breathe'

export type AvatarAction = 'idle' | ActivityId | 'celebrate'

export type NarrationLine = {
  id: string
  text: string
  startMs: number
  endMs: number
}

export type ActivityDefinition = {
  id: ActivityId
  label: string
  subtitleLines: NarrationLine[]
  voiceLines: NarrationLine[]
  durationMs: number
  riveIndex: number
  loop: boolean
  calmCompatible: boolean
}

export type SessionPlaybackState = {
  currentActivityId: ActivityId
  isPlaying: boolean
  startedAt: number | null
  elapsedMs: number
  subtitle: string
  calmMode: boolean
}
