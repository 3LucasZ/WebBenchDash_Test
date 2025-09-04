"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";

const chartConfig = {
  value: {
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function ResilienceDNSChart({ country }: { country: string }) {
  const [data, setData] = useState<{ key: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch("http://0.0.0.0:8000/resilience-dns/" + country)
      .then((res) => res.json())
      .then((json) => {
        const transformed = Object.entries(json).map(([key, value]) => ({
          key,
          value: value as number,
        }));
        setData(transformed);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [country]);
  if (loading) {
    return <div></div>;
  }
  return (
    <Card>
      <CardHeader>
        <CardTitle>DNS Resilience</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={data}
            layout="vertical"
            margin={{
              right: 16,
            }}
          >
            <CartesianGrid horizontal={false} />
            <YAxis
              dataKey="key"
              type="category"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
              hide
            />
            <XAxis dataKey="value" type="number" hide />
            <ChartTooltip
              cursor={true}
              content={<ChartTooltipContent indicator="line" hideIndicator />}
            />
            <Bar
              dataKey="value"
              layout="vertical"
              fill="var(--color-desktop)"
              radius={4}
            >
              {/* <LabelList
                dataKey="key"
                position="insideLeft"
                offset={4}
                className="fill-[--color-label]"
                fontSize={10}
              /> */}
              <LabelList
                dataKey="key"
                position="right"
                offset={4}
                className="fill-foreground"
                fontSize={10}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
{
  /* <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 font-medium leading-none">
          Trending up by 5.2% this month <TrendingUp className="h-4 w-4" />
        </div>
        <div className="leading-none text-muted-foreground">
          Showing total visitors for the last 6 months
        </div>
      </CardFooter> */
}
