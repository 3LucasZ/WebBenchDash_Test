"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "../ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn, getKeysByPrefix } from "@/lib/utils";
import {
  featureData,
  label_display,
  sourcesCited,
  unit_convert,
} from "../widget/data";

export function DataCompare({
  title,
  country_1,
  country_2,
  country_1_df,
  country_2_df,
  features,
}: {
  title: string;
  country_1: string;
  country_2: string;
  country_1_df: Record<string, number>;
  country_2_df: Record<string, number>;
  features: string[];
}) {
  const loading = country_1_df == null || country_2_df == null;
  const featuresFull = getKeysByPrefix(country_1_df, features);

  return (
    <Card className="max-w-full  overflow-x-auto">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="max-w-full w-full table-fixed">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[20%]"></TableHead>
              <TableHead className="w-[15%]">{country_1}</TableHead>
              <TableHead className="w-[15%]">{country_2}</TableHead>
              <TableHead className="w-[50%]">Description</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {featuresFull.map((featureName) => {
              const value1 = country_1_df[featureName] ?? 0; // Use 0 if key doesn't exist
              const value2 = country_2_df[featureName] ?? 0;

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
      </CardContent>
      <CardFooter className="text-xs">{sourcesCited.join(", ")}</CardFooter>
    </Card>
  );
}
