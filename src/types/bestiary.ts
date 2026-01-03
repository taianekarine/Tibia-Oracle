export type BestiarySource = "hunt" | "manual";

export type BestiaryMonster = {
  id: string;
  name: string;
  type: string;
  image: string;
  charms: number;
  totalKilled: number;
  completed: boolean;
  killComplete: number;
  manualKilled: number; 
  source: BestiarySource;
};

export type BestiaryByType = Record<string, BestiaryMonster[]>;

export type BestiaryFilters = {
  search: string;
  type: string | null;
  charms: number | null;
  completed: boolean | null;
};

