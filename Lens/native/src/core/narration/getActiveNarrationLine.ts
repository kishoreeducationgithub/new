import type { NarrationLine } from '../models/toddlerActivity'

export function getActiveNarrationLine(
  lines: NarrationLine[],
  elapsedMs: number,
): NarrationLine | undefined {
  return lines.find((line) => elapsedMs >= line.startMs && elapsedMs < line.endMs)
}

export function getNarrationTextAtElapsed(lines: NarrationLine[], elapsedMs: number): string {
  const activeLine = getActiveNarrationLine(lines, elapsedMs)

  if (activeLine) {
    return activeLine.text
  }

  for (let index = lines.length - 1; index >= 0; index -= 1) {
    if (elapsedMs >= lines[index].startMs) {
      return lines[index].text
    }
  }

  return ''
}
