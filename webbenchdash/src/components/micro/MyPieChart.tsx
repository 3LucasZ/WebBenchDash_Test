"use client";

import { LabelList, Pie, PieChart } from "recharts";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const generateChartConfig = (data: Record<string, number>): ChartConfig => {
  const config: ChartConfig = {};
  const dataKeys = Object.keys(data);
  dataKeys.forEach((category: string) => {
    config[category] = {
      label: category.charAt(0).toUpperCase() + category.slice(1),
    };
  });
  return config;
};

const processChartData = (data: Record<string, number>) => {
  const colors = ["--color-red-400", "--color-amber-400", "--color-green-400"];
  return Object.entries(data).map(([category, proportion], index) => {
    return {
      label: category,
      value: proportion,
      fill: `var(${colors[index % colors.length]})`,
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
