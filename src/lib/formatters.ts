export function formatProfit(value: number): string {
  const abs = Math.abs(value)

  if (abs >= 1_000_000) {
    return `${Math.round(value / 1_000_000)}kk`
  }

  if (abs >= 1_000) {
    return `${Math.round(value / 1_000)}k`
  }

  return `${value}`
}

export function formatTibiaValue(value: number): string {
  if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}kk`
  if (value >= 1_000) return `${Math.floor(value / 1_000)}k`
  return value.toString()
}

