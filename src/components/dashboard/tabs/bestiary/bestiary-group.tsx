import { BestiaryMonster } from "@/types/bestiary";
import { BestiaryCard } from "./bestiary-card";

type Props = {
  type: string;
  monsters: BestiaryMonster[];
  onManualKill: (monster: BestiaryMonster) => void;
};

export function BestiaryGroup({ type, monsters, onManualKill }: Props) {
  return (
    <section className="space-y-2">
      <h2 className="text-lg font-semibold">{type}</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {monsters.map((monster) => (
          <BestiaryCard
            key={monster.name}
            monster={monster}
            onManualKill={() => onManualKill(monster)}
          />
        ))}
      </div>
    </section>
  );
}
