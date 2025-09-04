import { iso3_to_country } from "@/lib/country_convert";

export function CountryName({ c1, c2 }: { c1: string; c2: string }) {
  return (
    <p className="text-center text-3xl">
      {iso3_to_country(c1) || "Select a Country"}
      {c2 && " vs " + iso3_to_country(c2)}
    </p>
  );
}
