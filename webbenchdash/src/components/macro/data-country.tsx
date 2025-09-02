"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import { MyRadialChart } from "../micro/MyRadialChart";
import { MyPieChart } from "../micro/MyPieChart";
import { featureData, label_display, unit_convert } from "../widget/data";

export function DataCountry({
  title,
  path,
  country,
  subset,
  regFeatures,
  proportionFeatures,
  categoricalPrefixes,
}: {
  title: string;
  path: string;
  country: string;
  subset: string;
  regFeatures: string[];
  proportionFeatures: string[];
  categoricalPrefixes: string[];
}) {
  const [data, setData] = useState<Record<string, number>>({});

  const [loading, setLoading] = useState(true);
  useEffect(() => {
    if (country) {
      fetch(`http://0.0.0.0:8000/${path}/${country}/${subset}`)
        .then((res) => res.json())
        .then((json) => {
          setData(json);
        })
        .catch(console.error)
        .finally(() => setLoading(false));
    } else {
      setData({});
      setLoading(true);
    }
  }, [country, subset]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
          <div className="flex flex-row content-start items-center gap-4">
            {proportionFeatures.map((feature) => (
              <MyRadialChart p={data[feature]} feature={feature} />
            ))}
            {categoricalPrefixes.map((prefix) => (
              <MyPieChart data={filterByPrefix(data, prefix)} />
            ))}
            {regFeatures.map((item) => (
              <div>
                {label_display(item) +
                  ": " +
                  unit_convert(featureData[item].convert, data[item])}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function filterByPrefix(data: Record<string, number>, prefix: string) {
  return Object.entries(data)
    .filter(([key, value]) => key.startsWith(prefix)) // Find entries with the correct prefix
    .reduce((acc, [key, value]) => {
      // For each filtered entry, create a new key by removing the prefix
      const newKey = key.substring(prefix.length);
      acc[newKey] = value; // Add the new key-value pair to our new object
      return acc;
    }, {}); // The initial value for our accumulator is an empty object
}
