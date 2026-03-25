import type { ActivityDefinition, ActivityId } from '../models/toddlerActivity'

export const DEFAULT_ACTIVITY_ORDER: ActivityId[] = [
  'wave',
  'clap',
  'handsUp',
  'sway',
  'breathe',
  'jump',
]

export const ACTIVITIES_WITH_CELEBRATION: ActivityId[] = ['jump']

export const toddlerActivitiesById: Record<ActivityId, ActivityDefinition> = {
  wave: {
    id: 'wave',
    label: 'Wave Hello',
    durationMs: 1500,
    riveIndex: 1,
    loop: true,
    calmCompatible: false,
    subtitleLines: [
      { id: 'wave-subtitle-1', text: 'Wave hello.', startMs: 0, endMs: 700 },
      { id: 'wave-subtitle-2', text: 'Nice and slow.', startMs: 700, endMs: 1500 },
    ],
    voiceLines: [
      { id: 'wave-voice-1', text: 'Wave hello to the guide.', startMs: 0, endMs: 800 },
      { id: 'wave-voice-2', text: 'Keep it nice and slow.', startMs: 800, endMs: 1500 },
    ],
  },
  clap: {
    id: 'clap',
    label: 'Slow Clap',
    durationMs: 1600,
    riveIndex: 2,
    loop: true,
    calmCompatible: false,
    subtitleLines: [
      { id: 'clap-subtitle-1', text: 'Hands come in.', startMs: 0, endMs: 800 },
      { id: 'clap-subtitle-2', text: 'Clap gently.', startMs: 800, endMs: 1600 },
    ],
    voiceLines: [
      { id: 'clap-voice-1', text: 'Bring your hands together.', startMs: 0, endMs: 850 },
      { id: 'clap-voice-2', text: 'Clap softly in the middle.', startMs: 850, endMs: 1600 },
    ],
  },
  handsUp: {
    id: 'handsUp',
    label: 'Hands Up',
    durationMs: 2100,
    riveIndex: 3,
    loop: true,
    calmCompatible: false,
    subtitleLines: [
      { id: 'handsup-subtitle-1', text: 'Hands go up.', startMs: 0, endMs: 700 },
      { id: 'handsup-subtitle-2', text: 'Reach to the sky.', startMs: 700, endMs: 1500 },
      { id: 'handsup-subtitle-3', text: 'Float back down.', startMs: 1500, endMs: 2100 },
    ],
    voiceLines: [
      { id: 'handsup-voice-1', text: 'Lift both hands up high.', startMs: 0, endMs: 800 },
      { id: 'handsup-voice-2', text: 'Reach to the sky.', startMs: 800, endMs: 1500 },
      { id: 'handsup-voice-3', text: 'Now float back down.', startMs: 1500, endMs: 2100 },
    ],
  },
  jump: {
    id: 'jump',
    label: 'Tiny Jump',
    durationMs: 2100,
    riveIndex: 4,
    loop: true,
    calmCompatible: false,
    subtitleLines: [
      { id: 'jump-subtitle-1', text: 'Little squat.', startMs: 0, endMs: 700 },
      { id: 'jump-subtitle-2', text: 'Tiny jump.', startMs: 700, endMs: 1400 },
      { id: 'jump-subtitle-3', text: 'Soft landing.', startMs: 1400, endMs: 2100 },
    ],
    voiceLines: [
      { id: 'jump-voice-1', text: 'Bend a little.', startMs: 0, endMs: 750 },
      { id: 'jump-voice-2', text: 'Make one tiny jump.', startMs: 750, endMs: 1450 },
      { id: 'jump-voice-3', text: 'Land softly on your feet.', startMs: 1450, endMs: 2100 },
    ],
  },
  sway: {
    id: 'sway',
    label: 'Gentle Sway',
    durationMs: 3000,
    riveIndex: 5,
    loop: true,
    calmCompatible: true,
    subtitleLines: [
      { id: 'sway-subtitle-1', text: 'Sway left.', startMs: 0, endMs: 1000 },
      { id: 'sway-subtitle-2', text: 'Sway right.', startMs: 1000, endMs: 2000 },
      { id: 'sway-subtitle-3', text: 'Back to center.', startMs: 2000, endMs: 3000 },
    ],
    voiceLines: [
      { id: 'sway-voice-1', text: 'Lean a little to the left.', startMs: 0, endMs: 1000 },
      { id: 'sway-voice-2', text: 'Now sway to the right.', startMs: 1000, endMs: 2100 },
      { id: 'sway-voice-3', text: 'Come back to the middle.', startMs: 2100, endMs: 3000 },
    ],
  },
  breathe: {
    id: 'breathe',
    label: 'Slow Breathe',
    durationMs: 2400,
    riveIndex: 6,
    loop: true,
    calmCompatible: true,
    subtitleLines: [
      { id: 'breathe-subtitle-1', text: 'Breathe in.', startMs: 0, endMs: 900 },
      { id: 'breathe-subtitle-2', text: 'Hold softly.', startMs: 900, endMs: 1500 },
      { id: 'breathe-subtitle-3', text: 'Breathe out.', startMs: 1500, endMs: 2400 },
    ],
    voiceLines: [
      { id: 'breathe-voice-1', text: 'Take a slow breath in.', startMs: 0, endMs: 900 },
      { id: 'breathe-voice-2', text: 'Hold it softly.', startMs: 900, endMs: 1500 },
      { id: 'breathe-voice-3', text: 'Now breathe out and relax.', startMs: 1500, endMs: 2400 },
    ],
  },
}

export const toddlerActivities = DEFAULT_ACTIVITY_ORDER.map((activityId) => toddlerActivitiesById[activityId])
