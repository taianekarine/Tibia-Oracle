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
  sessionLengthSeconds: number

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

export interface RawHunt {
  "Session start": string
  "Session end": string
  "Session length": string
  Balance: string | number
  Loot: string | number
  Supplies: string | number
  Damage: string | number
  "Damage/h": string | number
  Healing: string | number
  "Healing/h": string | number
  "Raw XP Gain": string | number
  "Raw XP/h": string | number
  "XP Gain": string | number
  "XP/h": string | number
  "Killed Monsters": Array<{ Name: string; Count: number }>
  "Looted Items": Array<{ Name: string; Count: number }>
}
