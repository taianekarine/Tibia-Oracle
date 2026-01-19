export interface DashboardTabsProps {
  mode: "global" | "character";
  characterName?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export type DashboardContextType = {
  activeCharacter: string | null;
  setActiveCharacter: (name: string, syncUrl?: boolean) => void;
  resetCharacter: () => void;
  isReady: boolean;
};