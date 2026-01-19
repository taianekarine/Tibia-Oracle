export function formatItemName(itemName: string) {
  if (itemName.startsWith("a ")) {
    return itemName.slice(2);
  }

  return itemName;
}
