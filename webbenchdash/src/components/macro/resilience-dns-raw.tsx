"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartConfig } from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";

const chartConfig = {
  value: {
    color: "var(--chart-1)",
  },
  label: {
    color: "var(--background)",
  },
} satisfies ChartConfig;

export function ResilienceDNSRaw({
  country,
  subset,
}: {
  country: string;
  subset: string;
}) {
  const [data, setData] = useState<{ key: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (country) {
      fetch("http://0.0.0.0:8000/resilience-dns/" + country + "/" + subset)
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
    } else {
      setData([]);
      setLoading(true);
    }
  }, [country, subset]);
  return (
    <Card>
      <CardHeader>
        <CardTitle>DNS Resilience</CardTitle>
      </CardHeader>
      <CardContent className="h-60">
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
              <div>{item.key + ": " + Math.round(item.value * 100) / 100}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
