export type ItemsMap = Record<string, number>;
export type CharacterItems = Record<string, ItemsMap>;

export type DividedItems = Record<string, ItemsMap>;

export function divideItemsFairly(
  globalItems: ItemsMap,
  characters: string[]
): DividedItems {
  const result: DividedItems = {};

  characters.forEach((c) => {
    result[c] = {};
  });

  Object.entries(globalItems).forEach(([item, total]) => {
    const base = Math.floor(total / characters.length);
    const remainder = total % characters.length;

    characters.forEach((character) => {
      result[character][item] = base;
    });

    // Distribui sobras para quem tem menos itens
    const sortedByLoad = [...characters].sort(
      (a, b) =>
        Object.values(result[a]).reduce((s, v) => s + v, 0) -
        Object.values(result[b]).reduce((s, v) => s + v, 0)
    );

    for (let i = 0; i < remainder; i++) {
      const target = sortedByLoad[i];
      result[target][item] += 1;
    }
  });

  return result;
}
