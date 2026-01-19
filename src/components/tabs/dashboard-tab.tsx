"use client";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

import { OverviewTab } from "@/components/tabs/overview-tab";
import { BalanceTab } from "@/components/tabs/balance-tab";
import { BestiaryTab } from "@/components/tabs/bestiary-tab"

type DashboardTabsProps = {
  mode: "global" | "character";
  characterName?: string;
  activeTab: string;
  onTabChange: (tab: string) => void;
};

export function DashboardTabs({
  mode,
  characterName,
  activeTab,
  onTabChange,
}: DashboardTabsProps) {
  return (
    <Tabs
      value={activeTab}
      onValueChange={onTabChange}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">
          Overview
        </TabsTrigger>

        <TabsTrigger value="balance">
          Balance
        </TabsTrigger>

        <TabsTrigger value="bestiary">
          Bestiário
        </TabsTrigger>
      </TabsList>

      <TabsContent value="overview">
        <OverviewTab
          mode={mode}
          characterName={characterName}
        />
      </TabsContent>

      <TabsContent value="balance">
        <BalanceTab
          mode={mode}
          characterName={characterName}
        />
      </TabsContent>

      <TabsContent value="bestiary">
        <BestiaryTab
          mode={mode}
          characterName={characterName}
        />
      </TabsContent>
    </Tabs>
  );
}
