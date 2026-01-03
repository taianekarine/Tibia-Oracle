"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { OverviewTab } from "@/components/dashboard/tabs/overview-tab";
import { BalanceTab } from "@/components/dashboard/tabs/balance-tab";
import { BestiaryTab } from "@/components/dashboard/tabs/bestiary-tab";

interface DashboardTabsProps {
  mode: "global" | "character";
  characterName?: string;
}

export function DashboardTabs({
  mode,
  characterName,
}: DashboardTabsProps) {
  console.log("[DASHBOARD][TABS]", { mode, characterName });

  return (
    <Tabs defaultValue="overview" className="w-full">
      <TabsList>
        <TabsTrigger value="overview">Overview</TabsTrigger>
        <TabsTrigger value="balance">Balance</TabsTrigger>
        <TabsTrigger value="bestiary">Bestiário</TabsTrigger>
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
