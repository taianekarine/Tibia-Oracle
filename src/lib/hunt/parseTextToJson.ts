export function parseTextToJson(rawText: string) {
  console.log("[HUNT][PARSE_TEXT] Iniciando parse de texto");

  const lines = rawText
    .split("\n")
    .map(l => l.trim())
    .filter(Boolean);

  const result: any = {
    "Killed Monsters": [],
    "Looted Items": [],
  };

  let currentSection: "monsters" | "loot" | null = null;

  for (const line of lines) {
    console.log("[HUNT][RAW_LINE]", JSON.stringify(line));

    // SESSION DATA — robusto
    const sessionMatch = line.match(
      /session\s*data\s*:?\s*from\s*(.+?)\s*to\s*(.+)/i
    );

    if (sessionMatch) {
      result["Session start"] = sessionMatch[1].trim();
      result["Session end"] = sessionMatch[2].trim();
      continue;
    }

    // SESSION LENGTH
    const lengthMatch = line.match(/session\s*:?\s*(.+)/i);
    if (lengthMatch && !line.toLowerCase().includes("data")) {
      result["Session length"] = lengthMatch[1].trim();
      continue;
    }

    if (/killed\s+monsters/i.test(line)) {
      currentSection = "monsters";
      continue;
    }

    if (/looted\s+items/i.test(line)) {
      currentSection = "loot";
      continue;
    }

    if (/^\d+\s+/i.test(line) && currentSection === "monsters") {
      const [count, ...nameParts] = line.split(" ");
      result["Killed Monsters"].push({
        Count: Number(count),
        Name: nameParts.join(" "),
      });
      continue;
    }

    if (/^\d+\s+/i.test(line) && currentSection === "loot") {
      const [count, ...nameParts] = line.split(" ");
      result["Looted Items"].push({
        Count: Number(count),
        Name: nameParts.join(" "),
      });
      continue;
    }

    const keyValue = line.split(":");
    if (keyValue.length >= 2) {
      const key = keyValue.shift()!.trim();
      const value = keyValue.join(":").trim();
      result[key] = value;
    }
  }

  console.log("[HUNT][PARSED_SESSION]", {
    start: result["Session start"],
    end: result["Session end"],
    length: result["Session length"],
  });

  return result;
}
