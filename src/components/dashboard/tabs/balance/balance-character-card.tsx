type BalanceCharacterCardProps = {
  name: string;
  level: number;
  vocation: string;
  supplies: number;
  loot: number;
  balance: number;
};

export function BalanceCharacterCard({
  name,
  level,
  vocation,
  supplies,
  loot,
  balance,
}: BalanceCharacterCardProps) {
  return (
    <div className="border rounded-lg p-4 space-y-2">
      <div className="font-semibold">{name}</div>

      <div className="text-sm text-muted-foreground">
        Lv {level} • {vocation}
      </div>

      <div className="text-sm">
        Supplies:{" "}
        <span className="font-medium">
          {supplies.toLocaleString()}
        </span>
      </div>

      <div className="text-sm">
        Loot:{" "}
        <span className="font-medium">
          {loot.toLocaleString()}
        </span>
      </div>

      <div className="text-sm">
        Balance:{" "}
        <span className="font-medium">
          {balance.toLocaleString()}
        </span>
      </div>
    </div>
  );
}
