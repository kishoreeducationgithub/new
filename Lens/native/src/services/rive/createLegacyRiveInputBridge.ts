import type { RiveInputBridge } from './ToddlerGuideRiveAdapter'
import { formatLegacyRiveError, type LegacyRiveRef } from './legacyRiveRuntime'

const BRIDGE_STEP_DELAY_MS = 16

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withBridgeMessage(prefix: string, error: unknown) {
  return `${prefix} ${formatLegacyRiveError(error)}`
}

export function createLegacyRiveInputBridge({
  onBridgeError,
  riveRef,
  stateMachineName,
}: {
  onBridgeError: (message: string) => void
  riveRef: LegacyRiveRef
  stateMachineName: string
}): RiveInputBridge {
  let queue = Promise.resolve()

  const wakeStateMachine = () => {
    riveRef.play(stateMachineName, undefined, undefined, true)
  }

  const enqueue = (description: string, operation: () => void) => {
    queue = queue
      .catch(() => undefined)
      .then(async () => {
        try {
          operation()
          wakeStateMachine()
        } catch (error) {
          onBridgeError(withBridgeMessage(description, error))
        }

        await wait(BRIDGE_STEP_DELAY_MS)
      })
  }

  return {
    fireTrigger(name) {
      enqueue(`Unable to fire trigger "${name}".`, () => {
        riveRef.fireState(stateMachineName, name)
      })
    },
    setBooleanInput(name, value) {
      enqueue(`Unable to set boolean input "${name}".`, () => {
        riveRef.setInputState(stateMachineName, name, value)
      })
    },
    setNumberInput(name, value) {
      enqueue(`Unable to set number input "${name}".`, () => {
        riveRef.setInputState(stateMachineName, name, value)
      })
    },
  }
}
