import { ISO3, iso3_to_country } from "@/lib/country_convert";

export function CountryName({
  c1,
  c2,
}: {
  c1: ISO3 | undefined;
  c2: ISO3 | undefined;
}) {
  return (
    <p className="text-center text-3xl">
      {c1 ? iso3_to_country(c1) : "Select a Country"}
      {c2 ? " vs " + iso3_to_country(c2) : ""}
    </p>
  );
}
