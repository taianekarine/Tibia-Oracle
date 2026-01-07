type BalanceHeaderProps = {
  total: number;
};

export function BalanceHeader({ total }: BalanceHeaderProps) {
  return (
    <div className="text-center space-y-1">
      <div className="text-2xl font-semibold">
        Total Farmado
      </div>
      <div className="text-4xl font-bold text-primary">
        {total.toLocaleString()}
      </div>
    </div>
  );
}
