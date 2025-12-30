export interface TibiaCharacter {
  name: string
  world?: string
  vocation?: string
  level?: number
  experience?: number
  residence?: string
  sex?: string
  account_status?: string
  achievement_points?: number
  guild?: {
    name?: string
  }
}
