"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { BestiaryMonster } from "@/types/bestiary";

type Props = {
  monster: BestiaryMonster;
  onManualKill: () => void;
};

const CHARM_ICON =
  "https://tibiadraptor.com/images/icons/Major_Charm_Points_Icon.png";

function calculateProgress(monster: BestiaryMonster) {
  const totalKills = monster.totalKilled + monster.manualKilled;
  const required = monster.killComplete;

  if (!required || required <= 0) return 0;

  const percent = (totalKills / required) * 100;
  return Math.min(Math.round(percent), 100);
}

export function BestiaryCard({ monster, onManualKill }: Props) {
  const progress = calculateProgress(monster);

  return (
    <div className="border rounded-lg p-4 space-y-3 flex">
      <Image
        src={monster.image}
        alt={monster.name}
        width={60}
        height={50}
        className="object-contain"
      />

      <div className="flex flex-col gap-3 w-full p-1">
        <div className="flex items-center gap-3">
          <div className="flex-1 font-medium">
            {monster.name}
          </div>

          <Button size="sm" variant="outline" onClick={onManualKill}>
            Kill Manual
          </Button>
        </div>

        <div className="text-sm flex justify-between p-0.5 mt-2.5">
          <div className="flex items-center gap-1">
            <Image
              src={CHARM_ICON}
              alt="Charm points"
              width={10}
              height={10}
              className="object-contain"
            />
            {monster.charms}
          </div>

          {monster.totalKilled} / {monster.killComplete}
        </div>

        <div className="space-y-1">
          <Progress value={progress} />
          <div className="text-xs text-muted-foreground">
            {progress}%
          </div>
        </div>

        <div className="text-sm font-medium p-0.5">
          {monster.completed ? (
            <span className="text-green-600">Completo</span>
          ) : (
            <span className="text-red-600">Incompleto</span>
          )}
        </div>
      </div>
    </div>
  );
}
