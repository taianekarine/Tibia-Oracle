"use client";

import { useEffect, useState } from "react";
import { getAuthToken } from "@/lib/auth-token";
import { BalanceHeader } from "../balance/balance-header";
import { BalanceCharacterCard } from "../balance/balance-character-card";
import { BalanceCharts } from "../balance/balance-charts";

type Props = {
  mode: "global" | "character";
  characterName?: string;
};

export function BalanceTab({
  mode,
  characterName,
}: Props) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(
    null
  );

  useEffect(() => {
    const token = getAuthToken();

    if (!token) {
      setError("Usuário não autenticado");
      setLoading(false);
      return;
    }

    const url =
      mode === "character" && characterName
        ? `/api/balance?character=${encodeURIComponent(
            characterName
          )}`
        : "/api/balance";

    fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(
            `Erro ao carregar balance (${res.status})`
          );
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
        setError(null);
      })
      .catch((err) => {
        console.error("[BALANCE][UI]", err);
        setError("Falha ao carregar balance");
      })
      .finally(() => setLoading(false));
  }, [mode, characterName]);

  if (loading)
    return (
      <div className="text-sm text-muted-foreground">
        Carregando balance…
      </div>
    );

  if (error)
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );

  if (!data) return null;

  return (
    <div className="space-y-10">
      <BalanceHeader total={data.totalProfit} />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-10">
        <div className="space-y-4">
          {mode === "global" &&
            data.characters?.map((c: any) => (
              <BalanceCharacterCard
                key={c.characterName}
                name={c.characterName}
                level={c.level}
                vocation={c.vocation}
                loot={c.totalLoot}
                supplies={c.totalSupplies}
                balance={c.totalProfit}
              />
            ))}

          {mode === "character" && (
            <BalanceCharacterCard
              name={data.characterName}
              level={data.level}
              vocation={data.vocation}
              loot={data.totalLoot}
              supplies={data.totalSupplies}
              balance={data.totalProfit}
            />
          )}
        </div>

        <BalanceCharts
          sixMonths={data.lastSixMonths}
          sevenDays={data.lastSevenDays}
          showSupplies={mode === "character"}
        />
      </div>
    </div>
  );
}
