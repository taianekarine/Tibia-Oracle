import { ALLOWED_ITEMS } from "./allowedItems";

export function filterAllowedItems(
  items: Record<string, number>
) {
  const filtered: Record<string, number> = {};

  Object.entries(items).forEach(([item, count]) => {
    if (ALLOWED_ITEMS.includes(item)) {
      filtered[item] = count;
    }
  });

  return filtered;
}
