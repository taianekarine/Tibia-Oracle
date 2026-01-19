type ItemsMap = Record<string, number>;

type Transfers = {
  from: string;
  to: string;
  items: ItemsMap;
}[];

export function calculateItemTransfers(
  current: Record<string, ItemsMap>,
  target: Record<string, ItemsMap>
): Transfers {
  const surplus: Record<string, ItemsMap> = {};
  const deficit: Record<string, ItemsMap> = {};

  Object.keys(target).forEach((character) => {
    surplus[character] = {};
    deficit[character] = {};

    Object.keys(target[character]).forEach((item) => {
      const currentQty = current[character]?.[item] ?? 0;
      const targetQty = target[character][item];
      const diff = currentQty - targetQty;

      if (diff > 0) surplus[character][item] = diff;
      if (diff < 0) deficit[character][item] = Math.abs(diff);
    });
  });

  const transfers: Transfers = [];

  Object.keys(deficit).forEach((receiver) => {
    Object.entries(deficit[receiver]).forEach(
      ([item, needed]) => {
        let remaining = needed;

        Object.keys(surplus).forEach((sender) => {
          const available = surplus[sender][item] ?? 0;
          if (available <= 0 || remaining <= 0) return;

          const qty = Math.min(available, remaining);

          transfers.push({
            from: sender,
            to: receiver,
            items: { [item]: qty },
          });

          surplus[sender][item] -= qty;
          remaining -= qty;
        });
      }
    );
  });

  return transfers;
}
