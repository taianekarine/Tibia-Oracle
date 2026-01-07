"use client";

import { useEffect, useState } from "react";
import {
  BalanceGlobalResponse,
  BalanceCharacterResponse,
} from "@/types/balance";
import { BalanceHeader } from "./balance-header";
import { BalanceCharacterCard } from "./balance-character-card";
import { BalanceCharts } from "./balance-charts";

type Props = {
  mode: "global" | "character";
  characterName?: string;
};

export function BalanceTab({
  mode,
  characterName,
}: Props) {
  const [data, setData] = useState<
    BalanceGlobalResponse | BalanceCharacterResponse | null
  >(null);

  useEffect(() => {
    const url =
      mode === "character" && characterName
        ? `/api/balance?character=${encodeURIComponent(
            characterName
          )}`
        : "/api/balance";

    fetch(url, { cache: "no-store" })
      .then((r) => r.json())
      .then(setData);
  }, [mode, characterName]);

  if (!data) return null;

  return (
    <div className="space-y-10">
      <BalanceHeader total={data.totalProfit} />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        {/* LEFT – CARDS */}
        <div className="space-y-4">
          {/* GLOBAL MODE */}
          {mode === "global" &&
            "characters" in data &&
            data.characters.map((c) => (
              <BalanceCharacterCard
                key={c.characterName}
                name={c.characterName}
                level={c.level}
                vocation={c.vocation}
                supplies={c.totalSupplies}
                loot={c.totalLoot}
                balance={c.totalProfit}
              />
            ))}

          {/* CHARACTER MODE */}
          {mode === "character" &&
            "characterName" in data && (
              <BalanceCharacterCard
                name={data.characterName}
                level={data.level}
                vocation={data.vocation}
                supplies={data.totalSupplies}
                loot={data.totalLoot}
                balance={data.totalProfit}
              />
            )}
        </div>

        {/* RIGHT – CHARTS */}
        <BalanceCharts
          sixMonths={data.lastSixMonths}
          sevenDays={data.lastSevenDays}
          showSupplies={mode === "character"}
        />
      </div>
    </div>
  );
}
