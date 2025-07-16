"use client";

import { TrendingUp } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";

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
  value: {
    color: "hsl(var(--chart-1))",
  },
  label: {
    color: "hsl(var(--background))",
  },
} satisfies ChartConfig;

export function ResilienceDNSRaw({ country }: { country: string }) {
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
  return (
    <Card>
      <CardHeader>
        <CardTitle>DNS Resilience</CardTitle>
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
          <div>
            {data.map((item) => (
              <div>{item.key + ": " + item.value}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
