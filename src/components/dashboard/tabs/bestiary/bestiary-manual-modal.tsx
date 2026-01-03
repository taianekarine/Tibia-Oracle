"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type BestiaryManualModalProps = {
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
}: BestiaryManualModalProps) {
  const [manualKills, setManualKills] = useState<string>(() => {
    return initialManualKills !== undefined
      ? String(initialManualKills)
      : "";
  });

  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!open) return;

    setManualKills(
      initialManualKills !== undefined
        ? String(initialManualKills)
        : ""
    );
  }, [open, initialManualKills]);

  async function handleSave(): Promise<void> {
    setLoading(true);

    try {
      await fetch("/api/bestiary/manual", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName,
          monsterName,
          manualKills: Number(manualKills),
        }),
      });

      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(): Promise<void> {
    const removeAmount = Number(manualKills);

    if (!removeAmount || removeAmount <= 0) return;

    setLoading(true);

    try {
      await fetch("/api/bestiary/manual", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          characterName,
          monsterName,
          manualKills: removeAmount,
        }),
      });

      onSuccess();
      onOpenChange(false);
    } finally {
      setLoading(false);
    }
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
          placeholder="Quantidade"
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
              Remover quantidade
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
