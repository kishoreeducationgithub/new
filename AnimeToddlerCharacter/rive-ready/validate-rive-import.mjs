import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const scriptDir = path.dirname(fileURLToPath(import.meta.url))
const defaultSvgPath = path.resolve(scriptDir, 'toddler-guide-import.svg')
const svgPath = process.argv[2] ? path.resolve(process.argv[2]) : defaultSvgPath

const requiredLayers = [
  'head_base',
  'eyes',
  'mouth',
  'torso',
  'upper_arm_L',
  'lower_arm_L',
  'hand_L',
  'upper_arm_R',
  'lower_arm_R',
  'hand_R',
  'upper_leg_L',
  'lower_leg_L',
  'foot_L',
  'upper_leg_R',
  'lower_leg_R',
  'foot_R',
]

if (!fs.existsSync(svgPath)) {
  console.error(`SVG file not found: ${svgPath}`)
  process.exit(1)
}

const svg = fs.readFileSync(svgPath, 'utf8')
const ids = [...svg.matchAll(/<g\b[^>]*\bid="([^"]+)"/g)].map((match) => match[1])
const missingLayers = requiredLayers.filter((name) => !ids.includes(name))
const unexpectedGradients = /<(linearGradient|radialGradient)\b/i.test(svg)
const unexpectedFilters = /<filter\b/i.test(svg)
const unexpectedBackgroundRect = /<rect\b[^>]*\bwidth="640"[^>]*\bheight="900"/i.test(svg)

console.log(`Validating: ${svgPath}`)
console.log(`Found layer ids: ${ids.join(', ')}`)

if (missingLayers.length > 0) {
  console.error(`Missing required layers: ${missingLayers.join(', ')}`)
  process.exit(1)
}

if (unexpectedGradients) {
  console.warn('Warning: gradients found. Flat fills are recommended for predictable Rive imports.')
}

if (unexpectedFilters) {
  console.warn('Warning: filters found. Rive may not preserve all SVG filter behavior.')
}

if (unexpectedBackgroundRect) {
  console.warn('Warning: full-canvas background rect found. Transparent background is recommended.')
}

console.log('Import validation passed.')
