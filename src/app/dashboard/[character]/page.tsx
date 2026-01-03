import { DashboardShell } from "@/components/dashboard/dashboard-shell";

type PageProps = {
  params: Promise<{
    character: string;
  }>;
};

export default async function DashboardCharacterPage({ params }: PageProps) {
  const { character } = await params;

  const characterName = decodeURIComponent(character);

  console.log("[DASHBOARD][CHARACTER]", characterName);

  return (
    <DashboardShell
      mode="character"
      characterName={characterName}
    />
  );
}
