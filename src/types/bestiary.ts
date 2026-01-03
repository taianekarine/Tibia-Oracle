export type BestiarySource = "hunt" | "manual";

export type BestiaryMonster = {
  name: string;
  type: string;
  charms: number;
  killComplete: number;
  image: string;
  totalKilled: number;
  completed: boolean;
  source: BestiarySource;
};

export type BestiaryByType = Record<string, BestiaryMonster[]>;

export type BestiaryFilters = {
  search: string;
  type: string | null;
  charms: number | null;
  completed: boolean | null;
};
