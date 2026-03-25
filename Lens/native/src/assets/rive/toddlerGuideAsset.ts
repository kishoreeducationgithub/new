import { toddlerGuideRiveContract } from '../../../../shared/toddlerGuideRiveContract.js'

export const toddlerGuideAsset = {
  assetPath: toddlerGuideRiveContract.nativeAssetPath,
  artboard: toddlerGuideRiveContract.artboard,
  inputNames: Object.values(toddlerGuideRiveContract.inputs),
  resourceName: 'toddlerGuide',
  stateMachine: toddlerGuideRiveContract.stateMachine,
} as const
