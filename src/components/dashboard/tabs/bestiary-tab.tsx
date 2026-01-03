"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BestiaryByType,
  BestiaryFilters,
  BestiaryMonster,
} from "@/types/bestiary";
import { BestiaryFiltersComponent } from "./bestiary/bestiary-filters";
import { BestiaryGroup } from "./bestiary/bestiary-group";
import { BestiaryManualModal } from "@/components/dashboard/tabs/bestiary/bestiary-manual-modal";

type BestiaryTabProps = {
  mode: "global" | "character";
  characterName?: string;
};

export function BestiaryTab({
  mode,
  characterName,
}: BestiaryTabProps) {
  const [data, setData] = useState<BestiaryByType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [selectedMonster, setSelectedMonster] =
    useState<BestiaryMonster | null>(null);

  const [filters, setFilters] = useState<BestiaryFilters>({
    search: "",
    type: null,
    charms: null,
    completed: null,
  });

  const load = useCallback(async () => {
    if (mode !== "character" || !characterName) {
      setData({});
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log("[BESTIARY][UI] Buscando bestiário", {
        characterName,
      });

      const res = await fetch(
        `/api/bestiary/${encodeURIComponent(characterName)}`,
        { cache: "no-store" }
      );

      if (!res.ok) {
        throw new Error("Erro ao carregar bestiário");
      }

      const json: BestiaryByType = await res.json();
      setData(json);
    } catch (err) {
      console.error("[BESTIARY][UI][ERROR]", err);
      setError("Falha ao carregar o bestiário");
    } finally {
      setLoading(false);
    }
  }, [mode, characterName]);

  useEffect(() => {
    load();
  }, [load]);

  const filteredData = useMemo<BestiaryByType>(() => {
    if (!data) return {};

    const result: BestiaryByType = {};

    for (const [type, monsters] of Object.entries(data)) {
      const filtered = monsters.filter((monster) => {
        if (filters.search) {
          const raw = filters.search.trim().toLowerCase();
          const isNumeric = /^\d+$/.test(raw);

          if (isNumeric) {
            if (monster.charms !== Number(raw)) return false;
          } else {
            if (
              !monster.name.toLowerCase().includes(raw) &&
              !monster.type.toLowerCase().includes(raw)
            ) {
              return false;
            }
          }
        }

        if (filters.type && monster.type !== filters.type)
          return false;
        if (
          filters.charms !== null &&
          monster.charms !== filters.charms
        )
          return false;
        if (
          filters.completed !== null &&
          monster.completed !== filters.completed
        )
          return false;

        return true;
      });

      if (filtered.length > 0) {
        result[type] = filtered;
      }
    }

    return result;
  }, [data, filters]);

  if (mode !== "character") {
    return (
      <div className="text-sm text-muted-foreground">
        Bestiário global será implementado depois.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Carregando bestiário…
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-sm text-destructive">
        {error}
      </div>
    );
  }

  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="text-sm text-muted-foreground">
        Nenhuma criatura encontrada.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <BestiaryFiltersComponent
          filters={filters}
          onChange={setFilters}
        />
      </div>

      {Object.entries(filteredData).map(
        ([type, monsters]) => (
          <BestiaryGroup
            key={type}
            type={type}
            monsters={monsters}
            onManualKill={(monster) => {
              setSelectedMonster(monster);
              setOpen(true);
            }}
          />
        )
      )}

      {selectedMonster && (
        <BestiaryManualModal
          open={open}
          onOpenChange={setOpen}
          characterName={characterName!}
          monsterName={selectedMonster.name}
          initialManualKills={
            "manualKilled" in selectedMonster
              ? (selectedMonster as any).manualKilled
              : undefined
          }
          onSuccess={load}
        />
      )}
    </div>
  );
}
