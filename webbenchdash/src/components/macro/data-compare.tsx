"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { featureData, label_display, unit_convert } from "../widget/data";

export function DataCompare({
  title,
  path,
  country1,
  country2,
  subset,
}: {
  title: string;
  path: string;
  country1: string;
  country2: string;
  subset: string;
}) {
  const [data1, setData1] = useState<Record<string, number>>({});
  const [data2, setData2] = useState<Record<string, number>>({});
  const allFeatureNames = Array.from(
    new Set([...Object.keys(data1), ...Object.keys(data2)])
  );
  const loading =
    Object.keys(data1).length == 0 && Object.keys(data2).length == 0;
  useEffect(() => {
    fetch(`http://0.0.0.0:8000/${path}/${country1}/${subset}`)
      .then((res) => res.json())
      .then((json) => {
        setData1(json);
      })
      .catch(console.error);

    fetch(`http://0.0.0.0:8000/${path}/${country2}/${subset}`)
      .then((res) => res.json())
      .then((json) => {
        setData2(json);
      })
      .catch(console.error);
  }, [country1, country2, subset]);

  return (
    <Card className="max-w-full  overflow-x-auto">
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
          <Table className="max-w-full w-full table-fixed">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[20%]"></TableHead>
                <TableHead className="w-[15%]">{country1}</TableHead>
                <TableHead className="w-[15%]">{country2}</TableHead>
                <TableHead className="w-[50%]">Description</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {allFeatureNames.map((featureName) => {
                const value1 = data1[featureName] ?? 0; // Use 0 if key doesn't exist
                const value2 = data2[featureName] ?? 0;
                const myFeatureData =
                  featureData[featureName as keyof typeof featureData];
                const dir = myFeatureData.direction;

                return (
                  <TableRow key={featureName}>
                    <TableCell className="font-medium break-words whitespace-normal">
                      {label_display(featureName)}
                    </TableCell>
                    <TableCell
                      className={cn("font-bold", {
                        "text-green-600": value1 * dir > value2 * dir,
                        "text-red-600": value1 * dir < value2 * dir,
                        "text-black": value1 * dir == value2 * dir,
                      })}
                    >
                      {unit_convert(myFeatureData.convert, value1)}
                    </TableCell>
                    <TableCell
                      className={cn("font-bold", {
                        "text-green-600": value1 * dir < value2 * dir,
                        "text-red-600": value1 * dir > value2 * dir,
                        "text-black": value1 * dir == value2 * dir,
                      })}
                    >
                      {unit_convert(myFeatureData.convert, value2)}
                    </TableCell>
                    <TableCell className="break-words whitespace-normal">
                      {myFeatureData.info}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
