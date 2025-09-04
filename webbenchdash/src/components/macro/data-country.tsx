"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MyRadialChart } from "../micro/MyRadialChart";
import { MyPieChart } from "../micro/MyPieChart";
import { MyStat } from "../micro/MyStat";
import { WebFeature } from "../widget/data";

export function DataCountry({
  title,
  df,
  regFeatures,
  proportionFeatures,
  categoricalPrefixes,
}: {
  title: string;
  df: Record<string, number>;
  regFeatures: WebFeature[];
  proportionFeatures: WebFeature[];
  categoricalPrefixes: string[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-row content-start items-center gap-8">
          {proportionFeatures.map((feature) => (
            <MyRadialChart p={df[feature]} feature={feature} />
          ))}
          {categoricalPrefixes.map((prefix) => (
            <MyPieChart data={filterByPrefix(df, prefix)} />
          ))}
          {regFeatures.map((item) => (
            <MyStat label={item} value={df[item]} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function filterByPrefix(
  data: Record<string, number>,
  prefix: string
): Record<string, number> {
  const accum: Record<string, number> = {};
  return Object.entries(data)
    .filter(([key]) => key.startsWith(prefix)) // Find entries with the correct prefix
    .reduce((acc, [key, value]) => {
      // For each filtered entry, create a new key by removing the prefix
      const newKey = key.substring(prefix.length);
      acc[newKey] = value; // Add new key-value to object
      return acc;
    }, accum); // Initial value for accumulator is {}
}
