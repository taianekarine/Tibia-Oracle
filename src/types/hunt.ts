export interface HuntMonster {
  name: string
  count: number
}

export interface HuntLootItem {
  name: string
  count: number
}

export interface NormalizedHunt {
  sessionStart: Date
  sessionEnd: Date
  sessionLength: string

  balance: number
  loot: number
  supplies: number

  damage: number
  damagePerHour: number
  healing: number
  healingPerHour: number

  rawXpGain: number
  rawXpPerHour: number
  xpGain: number
  xpPerHour: number

  killedMonsters: HuntMonster[]
  lootedItems: HuntLootItem[]
}
