import iso3_to_iso2_data from "./iso3_to_iso2.json";
import iso2_to_iso3_data from "./iso2_to_iso3.json";
import iso2_to_country_data from "./iso2_to_country.json";
export function iso3_to_iso2(iso3: keyof typeof iso3_to_iso2_data): string {
  return iso3_to_iso2_data[iso3];
}

export function iso2_to_iso3(iso2: keyof typeof iso2_to_iso3_data): string {
  return iso2_to_iso3_data[iso2];
}
export function iso2_to_country(
  iso2: keyof typeof iso2_to_country_data
): string {
  return iso2_to_country_data[iso2];
}
export function iso3_to_country(iso3: keyof typeof iso3_to_iso2_data): string {
  return iso2_to_country(iso3_to_iso2(iso3));
}
