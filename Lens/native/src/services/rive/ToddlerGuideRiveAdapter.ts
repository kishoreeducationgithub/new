import { toddlerGuideRiveContract } from '../../../../shared/toddlerGuideRiveContract.js'
import { toddlerActivitiesById } from '../../core/activities/toddlerActivities'
import {
  createIdleAvatarSnapshot,
  toAvatarAction,
  type PlayableAvatarAction,
  type ToddlerAvatarRuntimeSnapshot,
} from '../../core/avatar/toddlerAvatar'
import { createAvatarAdapterTrace, type AvatarAdapterTrace } from '../../core/avatar/avatarRuntimeDiagnostics'

export type RiveInputBridge = {
  fireTrigger: (name: string) => void
  setBooleanInput: (name: string, value: boolean) => void
  setNumberInput: (name: string, value: number) => void
}

export class ToddlerGuideRiveAdapter {
  private bridge: RiveInputBridge | null = null

  private snapshot: ToddlerAvatarRuntimeSnapshot = createIdleAvatarSnapshot()

  private trace: AvatarAdapterTrace = createAvatarAdapterTrace()

  private updateTrace(nextTrace: Partial<AvatarAdapterTrace>) {
    this.trace = {
      ...this.trace,
      ...nextTrace,
      lastUpdatedAt: new Date().toISOString(),
    }
  }

  attachBridge(nextBridge: RiveInputBridge | null) {
    this.bridge = nextBridge

    this.updateTrace({
      bridgeAttached: Boolean(nextBridge),
      calmMode: this.snapshot.calmMode,
      lastActivityIndex: this.snapshot.activityIndex,
      lastCommand: nextBridge ? 'attachBridge' : 'detachBridge',
      lastIsPlaying: this.snapshot.isPlaying,
    })

    if (!nextBridge) {
      return
    }

    nextBridge.setNumberInput(toddlerGuideRiveContract.inputs.activityIndex, this.snapshot.activityIndex)
    nextBridge.setBooleanInput(toddlerGuideRiveContract.inputs.isPlaying, this.snapshot.isPlaying)
    nextBridge.setBooleanInput(toddlerGuideRiveContract.inputs.calmMode, this.snapshot.calmMode)
  }

  play(action: PlayableAvatarAction): void {
    const activity = toddlerActivitiesById[action]

    this.snapshot = {
      ...this.snapshot,
      action: toAvatarAction(activity.id),
      activityIndex: activity.riveIndex,
      isPlaying: true,
    }

    this.updateTrace({
      calmMode: this.snapshot.calmMode,
      lastActivityIndex: activity.riveIndex,
      lastCommand: `play:${activity.id}`,
      lastIsPlaying: true,
    })

    this.bridge?.setNumberInput(toddlerGuideRiveContract.inputs.activityIndex, activity.riveIndex)
    this.bridge?.setBooleanInput(toddlerGuideRiveContract.inputs.isPlaying, true)
  }

  stop(): void {
    this.snapshot = {
      ...this.snapshot,
      action: 'idle',
      activityIndex: 0,
      isPlaying: false,
    }

    this.updateTrace({
      calmMode: this.snapshot.calmMode,
      lastActivityIndex: 0,
      lastCommand: 'stop',
      lastIsPlaying: false,
    })

    this.bridge?.setBooleanInput(toddlerGuideRiveContract.inputs.isPlaying, false)
    this.bridge?.setNumberInput(toddlerGuideRiveContract.inputs.activityIndex, 0)
  }

  celebrate(): void {
    const celebrateAt = new Date().toISOString()

    this.snapshot = {
      ...this.snapshot,
      action: 'celebrate',
      celebrateCount: this.snapshot.celebrateCount + 1,
      isPlaying: false,
      activityIndex: 0,
    }

    this.updateTrace({
      calmMode: this.snapshot.calmMode,
      lastActivityIndex: 0,
      lastCelebrateAt: celebrateAt,
      lastCommand: 'celebrate',
      lastIsPlaying: false,
    })

    this.bridge?.fireTrigger(toddlerGuideRiveContract.inputs.celebrate)
  }

  setCalmMode(enabled: boolean): void {
    this.snapshot = {
      ...this.snapshot,
      calmMode: enabled,
    }

    this.updateTrace({
      calmMode: enabled,
      lastActivityIndex: this.snapshot.activityIndex,
      lastCommand: `setCalmMode:${enabled ? 'on' : 'off'}`,
      lastIsPlaying: this.snapshot.isPlaying,
    })

    this.bridge?.setBooleanInput(toddlerGuideRiveContract.inputs.calmMode, enabled)
  }

  getSnapshot(): ToddlerAvatarRuntimeSnapshot {
    return this.snapshot
  }

  getTrace(): AvatarAdapterTrace {
    return this.trace
  }
}
