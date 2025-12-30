export interface NormalizedHunt {
  sessionStart: Date
  sessionEnd: Date
  sessionLength: string
  balance: number
  loot: number
  supplies: number
  xpGain: number
  rawXpGain: number
  killedMonsters: {
    name: string
    count: number
  }[]
  lootedItems: {
    name: string
    count: number
  }[]
}
