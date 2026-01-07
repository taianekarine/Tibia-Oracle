"use client";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  BarChart,
  Bar,
  XAxis,
  YAxis,
} from "recharts";

/* ===========================
   HELPERS – FORMATTERS
=========================== */
function formatCompact(value: number): string {
  if (value >= 1_000_000) return `${Math.round(value / 1_000_000)}M`;
  if (value >= 1_000) return `${Math.round(value / 1_000)}k`;
  return value.toString();
}

function formatDateLabel(date: string): string {
  const d = new Date(date);
  return d.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "short",
  });
}

/* ===========================
   HELPERS – RADAR NORMALIZER
=========================== */
function getLastSixMonths() {
  const now = new Date();
  const months: Array<{
    key: string;
    label: string;
  }> = [];

  for (let i = 5; i >= 0; i--) {
    const d = new Date(
      now.getFullYear(),
      now.getMonth() - i,
      1
    );

    const key = `${d.getFullYear()}-${String(
      d.getMonth() + 1
    ).padStart(2, "0")}`;

    const label = d.toLocaleDateString("pt-BR", {
      month: "short",
    });

    months.push({ key, label });
  }

  return months;
}

function normalizeLastSixMonths(
  data: Array<{
    date: string;
    profit: number;
    supplies?: number;
  }>
) {
  const months = getLastSixMonths();

  const map = new Map<
    string,
    { profit: number; supplies?: number }
  >();

  for (const item of data) {
    map.set(item.date, {
      profit: item.profit,
      supplies: item.supplies,
    });
  }

  return months.map((m) => ({
    month: m.label,
    profit: map.get(m.key)?.profit ?? 0,
    supplies: map.get(m.key)?.supplies ?? 0,
  }));
}

/* ===========================
   COMPONENT
=========================== */
type BalanceChartsProps = {
  sixMonths: Array<{
    date: string;
    profit: number;
    supplies?: number;
  }>;
  sevenDays: Array<{
    date: string;
    profit: number;
    supplies?: number;
  }>;
  showSupplies: boolean;
};

export function BalanceCharts({
  sixMonths,
  sevenDays,
  showSupplies,
}: BalanceChartsProps) {
  const radarData = normalizeLastSixMonths(sixMonths);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* =======================
          RADAR CHART
      ======================= */}
      <div>
        <div className="font-medium mb-1">
          Radar Chart
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Últimos 6 meses
        </div>

        <ChartContainer
          className="h-[320px]"
          config={{
            profit: {
              label: "Profit",
              color: "hsl(var(--foreground))",
            },
            supplies: {
              label: "Supplies",
              color: "hsl(var(--muted-foreground))",
            },
          }}
        >
        <RadarChart data={radarData} outerRadius="75%">
          <PolarGrid
            stroke="hsl(var(--border))"
            strokeOpacity={0.4}
          />

          <PolarAngleAxis
            dataKey="month"
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />

          <PolarRadiusAxis tick={false} axisLine={false} />

          <Radar
            dataKey="profit"
            stroke="hsl(var(--foreground))"
            strokeWidth={2.5}
            fill="hsl(var(--foreground))"
            fillOpacity={0.3}
            dot
          />

          {showSupplies && (
            <Radar
              dataKey="supplies"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth={2}
              fill="hsl(var(--muted-foreground))"
              fillOpacity={0.22}
              dot
            />
          )}

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
        </RadarChart>
        </ChartContainer>
      </div>

      {/* =======================
          BAR CHART
      ======================= */}
      <div>
        <div className="font-medium mb-1">
          Tooltip - Line Indicator
        </div>
        <div className="text-sm text-muted-foreground mb-4">
          Últimos 7 dias
        </div>

      <ChartContainer
        className="h-[300px]"
        config={{
          profit: {
            label: "Profit",
            color: "hsl(var(--foreground))",
          },
          supplies: {
            label: "Supplies",
            color: "hsl(var(--muted-foreground))",
          },
        }}
      >
        <BarChart data={sevenDays}>
          <XAxis
            dataKey="date"
            tickFormatter={formatDateLabel}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />

          <YAxis
            tickFormatter={formatCompact}
            axisLine={false}
            tickLine={false}
            tick={{ fill: "hsl(var(--muted-foreground))" }}
          />

          <Bar
            dataKey="profit"
            fill="var(--color-profit)"
            radius={6}
            activeBar={false}
          />

          {showSupplies && (
            <Bar
              dataKey="supplies"
              fill="var(--color-supplies)"
              radius={6}
              activeBar={false}
            />
          )}

          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent />}
          />
        </BarChart>
      </ChartContainer>

      </div>
    </div>
  );
}
