"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Props = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  characterName: string;
  monsterName: string;
  initialManualKills?: number;
  onSuccess: () => void;
};

export function BestiaryManualModal({
  open,
  onOpenChange,
  characterName,
  monsterName,
  initialManualKills,
  onSuccess,
}: Props) {
  const [manualKills, setManualKills] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setManualKills(
      initialManualKills !== undefined
        ? String(initialManualKills)
        : ""
    );
  }, [initialManualKills]);

  async function handleSave() {
    setLoading(true);

    await fetch("/api/bestiary/manual", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterName,
        monsterName,
        manualKills: Number(manualKills),
      }),
    });

    setLoading(false);
    onOpenChange(false);
    onSuccess();
  }

  async function handleRemove() {
    setLoading(true);

    await fetch("/api/bestiary/manual", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        characterName,
        monsterName,
      }),
    });

    setLoading(false);
    onOpenChange(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Bestiário Manual – {monsterName}
          </DialogTitle>
        </DialogHeader>

        <Input
          type="number"
          min={0}
          placeholder="Quantidade morta"
          value={manualKills}
          onChange={(e) => setManualKills(e.target.value)}
        />

        <DialogFooter className="flex justify-between">
          {initialManualKills !== undefined && (
            <Button
              variant="destructive"
              onClick={handleRemove}
              disabled={loading}
            >
              Remover Bestiário
            </Button>
          )}

          <Button
            onClick={handleSave}
            disabled={loading}
          >
            {initialManualKills !== undefined
              ? "Atualizar Bestiário"
              : "Adicionar Bestiário"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
