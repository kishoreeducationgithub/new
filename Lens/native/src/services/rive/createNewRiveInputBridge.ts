import type { RiveInputBridge } from './ToddlerGuideRiveAdapter'
import { formatNewRuntimeError, type NewRiveViewRef } from './newRiveRuntime'

const BRIDGE_STEP_DELAY_MS = 16

export type NewRiveBindingEvent = {
  inputName: string
  inputType: 'boolean' | 'number' | 'trigger'
  message?: string
  outcome: 'error' | 'success'
}

function wait(ms: number) {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, ms)
  })
}

function withBridgeMessage(prefix: string, error: unknown) {
  return `${prefix} ${formatNewRuntimeError(error)}`
}

export function createNewRiveInputBridge({
  onBindingEvent,
  onBridgeError,
  riveViewRef,
}: {
  onBindingEvent?: (event: NewRiveBindingEvent) => void
  onBridgeError: (message: string) => void
  riveViewRef: NewRiveViewRef
}): RiveInputBridge {
  let queue = Promise.resolve()

  const ensureReady = async () => {
    const ready = await riveViewRef.awaitViewReady()

    if (!ready) {
      throw new Error('RiveView did not become ready.')
    }
  }

  const enqueue = (
    description: string,
    inputName: string,
    inputType: NewRiveBindingEvent['inputType'],
    operation: () => void,
  ) => {
    queue = queue
      .catch(() => undefined)
      .then(async () => {
        try {
          await ensureReady()
          operation()
          riveViewRef.playIfNeeded()
          onBindingEvent?.({
            inputName,
            inputType,
            outcome: 'success',
          })
        } catch (error) {
          const message = withBridgeMessage(description, error)
          onBridgeError(message)
          onBindingEvent?.({
            inputName,
            inputType,
            message,
            outcome: 'error',
          })
        }

        await wait(BRIDGE_STEP_DELAY_MS)
      })
  }

  return {
    fireTrigger(name) {
      enqueue(`Unable to fire trigger "${name}".`, name, 'trigger', () => {
        riveViewRef.triggerInput(name)
      })
    },
    setBooleanInput(name, value) {
      enqueue(`Unable to set boolean input "${name}".`, name, 'boolean', () => {
        riveViewRef.setBooleanInputValue(name, value)
      })
    },
    setNumberInput(name, value) {
      enqueue(`Unable to set number input "${name}".`, name, 'number', () => {
        riveViewRef.setNumberInputValue(name, value)
      })
    },
  }
}
