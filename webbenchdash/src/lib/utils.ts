import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
export const basePath = "/WebBenchDash_Test";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function cvtRecord(
  json: Record<string, string>
): Record<string, number> {
  return Object.fromEntries(
    Object.entries(json).map(([key, value]) => [key, Number(value)])
  );
}
export function getKeysByPrefix(
  data: Record<string, any>,
  prefixes: string[]
): string[] {
  return Object.keys(data).filter((key) =>
    prefixes.some((prefix) => key.startsWith(prefix))
  );
}
