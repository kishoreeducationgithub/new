# Toddler Guide Rive Handoff

This folder packages the toddler avatar for Rive authoring.

## What is included

- `toddler-guide-import.svg`
  A transparent SVG with the exact layer split required for Rive import.
- `toddler-guide-rig-spec.json`
  Pivots, bone hierarchy, bindings, animation notes, and state-machine definition.
- `validate-rive-import.mjs`
  Local validation script for Step 1 before opening the file in Rive.
- `toddler_avatar.svg`
  Older merged art reference only. Do not import this file for rigging.

## Status

The SVG is prepared for Rive import and the runtime contract is defined, but an actual `.riv` binary cannot be generated in this workspace because there is no local Rive editor or CLI installed.

## Suggested Rive workflow

1. Run `node validate-rive-import.mjs`.
2. Import `toddler-guide-import.svg` into a new `ToddlerGuide` artboard in Rive.
3. Before authoring the new motions, manually verify arm chains, torso rotation/expansion, lower-body support, head alignment, and cheerful one-shot poses all behave cleanly.
4. Follow `toddler-guide-rig-spec.json` for pivots, bones, binding, animations, and the `ToddlerGuideMachine` state machine.
5. Author these animations in the `.riv`: `idle`, `wave`, `clap`, `handsUp`, `jump`, `sway`, `breathe`, and one-shot `celebrate`.
6. Use the state machine trigger map inside `ToddlerGuideMachine`.
   `activityIndex == 1` -> `wave`
   `activityIndex == 2` -> `clap`
   `activityIndex == 3` -> `handsUp`
   `activityIndex == 4` -> `jump`
   `activityIndex == 5` -> `sway`
   `activityIndex == 6` -> `breathe`
   fire `celebrate` trigger -> one-shot `celebrate`, then auto-return to `idle`
   `isPlaying == false` -> `idle`
7. Export the finished asset as `toddler-guide.riv`.
8. Drop the exported `.riv` file into the web and native placeholder locations referenced by the shared contract.

## Integration note

The `activityIndex` mapping in this Rive handoff is standalone:

- `1` triggers `wave`
- `2` triggers `clap`
- `3` triggers `handsUp`
- `4` triggers `jump`
- `5` triggers `sway`
- `6` triggers `breathe`
- `celebrate` trigger plays the one-shot success cue

If you connect this directly to another activity system, verify the source activity ordering first so the wrong motion is not triggered.
