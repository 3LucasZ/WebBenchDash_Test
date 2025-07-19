"use client";

import { TrendingUp } from "lucide-react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  desktop: {
    label: "value",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function ClusterChart({ country }: { country: string }) {
  const [data, setData] = useState<{ key: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (country) {
      fetch("http://0.0.0.0:8000/clusters/" + country)
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
    }
  }, [country]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Cluster Distribution</CardTitle>
        {/* <CardDescription>January - June 2024</CardDescription> */}
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
            <Skeleton className="h-4 w-[250px]" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-60">
            <BarChart data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="key"
                tickLine={false}
                axisLine={false}
                // tickMargin={10}
                tickFormatter={(value) => value.slice(1, 3)}
              />
              <ChartTooltip
                cursor={true}
                content={<ChartTooltipContent hideIndicator />}
              />
              <Bar dataKey="value" fill="var(--color-desktop)" radius={4} />
            </BarChart>
          </ChartContainer>
        )}
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
