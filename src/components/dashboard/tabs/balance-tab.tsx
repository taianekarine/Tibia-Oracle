"use client";

interface OverviewTabProps {
  mode: "global" | "character";
  characterName?: string;
}

export function BalanceTab({
  mode,
  characterName,
}: OverviewTabProps) {
  console.log("[TAB][OVERVIEW]", { mode, characterName });

  return (
    <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Resumo</h3>
        <div className="mt-2 text-muted-foreground text-sm">
          Conteúdo fixo (dados virão depois)
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Atividade</h3>
        <div className="mt-2 text-muted-foreground text-sm">
          Mesmo layout sempre
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h3 className="text-sm font-medium">Progresso</h3>
        <div className="mt-2 text-muted-foreground text-sm">
          Global ou personagem, tanto faz
        </div>
      </div>
    </section>
  );
}
