"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const TAILWIND_COLOR_MAP = {
  "slate-950": "210 20% 9%",
  "slate-900": "215 18% 13%",
  "slate-800": "215 14% 17%",
  "slate-700": "215 11% 29%",
  "slate-600": "215 8% 39%",
  "slate-500": "215 10% 50%",
  "slate-400": "215 14% 65%",
  "slate-300": "215 20% 77%",
  "slate-200": "215 28% 86%",
  "slate-100": "220 20% 88%",
  "slate-50": "214 32% 91%",
};
const COLOR_KEYS = ["slate-950", "slate-700", "slate-500", "slate-300"];

const generateChartConfig = (data: Record<string, number>): ChartConfig => {
  const config: ChartConfig = {};
  const dataKeys = Object.keys(data);

  dataKeys.forEach((category: string, index) => {
    const colorKey = COLOR_KEYS[
      index % COLOR_KEYS.length
    ] as keyof typeof TAILWIND_COLOR_MAP;
    const colorValue = TAILWIND_COLOR_MAP[colorKey];

    config[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1),
      color: `hsl(${colorValue})`,
    };
  });
  return config;
};

const processChartData = (data: Record<string, number>) => {
  return Object.entries(data).map(([category, proportion], index) => {
    const colorKey = COLOR_KEYS[
      index % COLOR_KEYS.length
    ] as keyof typeof TAILWIND_COLOR_MAP;
    const colorValue = TAILWIND_COLOR_MAP[colorKey];

    return {
      label: category,
      value: proportion,
      fill: `hsl(${colorValue})`,
    };
  });
};

export function MyPieChart({
  data = { c1: 0.2, c2: 0.3, c3: 0.5 },
}: {
  data: Record<string, number>;
}) {
  const outerRadius = 55;
  const chartSize = outerRadius * 2;
  const processedData = processChartData(data);
  const dynamicChartConfig = generateChartConfig(data);

  return (
    <ChartContainer
      config={dynamicChartConfig}
      className="[&_.recharts-text]:fill-background"
      style={{ width: chartSize, height: chartSize }}
    >
      <PieChart width={chartSize} height={chartSize}>
        <ChartTooltip content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={processedData}
          nameKey="label"
          dataKey="value"
          outerRadius={outerRadius}
        >
          <LabelList
            dataKey="label"
            className="fill-background"
            stroke="none"
            fontSize={12}
          />
        </Pie>
      </PieChart>
    </ChartContainer>
  );
}
