"use client";

import { Button } from "@/components/ui/button";
import { BestiaryMonster } from "@/types/bestiary";

type Props = {
  monster: BestiaryMonster;
  onManualKill: () => void;
};

export function BestiaryCard({ monster, onManualKill }: Props) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      {/* Linha 1 */}
      <div className="flex items-center gap-3">
        <img
          src={monster.image}
          alt={monster.name}
          className="w-10 h-10 object-contain"
        />

        <div className="flex-1 font-medium">
          {monster.name}
        </div>

        <Button
          size="sm"
          variant="outline"
          onClick={onManualKill}
        >
          Kill Manual
        </Button>
      </div>

      {/* Linha 2 */}
      <div className="text-sm">
        {monster.totalKilled} / {monster.killComplete}
        {monster.manualKilled > 0 && (
          <span className="text-muted-foreground">
            {" "} (+{monster.manualKilled} manual)
          </span>
        )}
      </div>

      {/* Linha 3 */}
      <div className="text-sm">
        Charms: {monster.charms}
      </div>

      {/* Linha 4 */}
      <div className="text-sm font-medium">
        {monster.completed ? (
          <span className="text-green-600">
            Completo
          </span>
        ) : (
          <span className="text-red-600">
            Incompleto
          </span>
        )}
      </div>
    </div>
  );
}
