import iso3_to_iso2_data from "./iso3_to_iso2.json";
import iso2_to_iso3_data from "./iso2_to_iso3.json";
import iso2_to_country_data from "./iso2_to_country.json";
export function iso3_to_iso2(iso3: ISO3): ISO2 {
  return iso3_to_iso2_data[iso3] as ISO2;
}
export type ISO3 = keyof typeof iso3_to_iso2_data;
export type ISO2 = keyof typeof iso2_to_iso3_data;

export function iso2_to_iso3(iso2: ISO2): ISO3 {
  return iso2_to_iso3_data[iso2] as ISO3;
}
export function iso2_to_country(iso2: ISO2): string {
  return iso2_to_country_data[iso2 as keyof typeof iso2_to_country_data];
}
export function iso3_to_country(iso3: keyof typeof iso3_to_iso2_data): string {
  return iso2_to_country(iso3_to_iso2(iso3));
}
