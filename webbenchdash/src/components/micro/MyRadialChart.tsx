"use client";

import {
  Label,
  PolarGrid,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from "recharts";

import { ChartConfig, ChartContainer } from "@/components/ui/chart";

export function MyRadialChart({ p, feature }: { p: number; feature: string }) {
  const outerRadius = 70;
  const thickness = 20;
  const innerRadius = outerRadius - thickness;
  const chartConfig = {
    feature: {
      label: feature,
    },
  } satisfies ChartConfig;
  const chartData = [{ name: feature, value: p * 100 }];
  return (
    <ChartContainer config={chartConfig}>
      <RadialBarChart
        data={chartData}
        startAngle={0}
        endAngle={p * 360}
        innerRadius={innerRadius}
        outerRadius={outerRadius}
      >
        <PolarGrid
          gridType="circle"
          radialLines={false}
          stroke="none"
          className="first:fill-muted last:fill-background"
          polarRadius={[
            innerRadius + thickness / 5,
            innerRadius - thickness / 5,
          ]}
        />
        <RadialBar background cornerRadius={10} dataKey={"value"} />
        <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
          <Label
            content={({ viewBox }) => {
              if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-2xl font-bold"
                    >
                      {p * 100}%
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground text-sm"
                    >
                      {feature}
                    </tspan>
                  </text>
                );
              }
            }}
          />
        </PolarRadiusAxis>
      </RadialBarChart>
    </ChartContainer>
  );
}
