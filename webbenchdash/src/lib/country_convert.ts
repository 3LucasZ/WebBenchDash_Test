import iso3_to_iso2_data from "./iso3_to_iso2.json";
import iso2_to_iso3_data from "./iso2_to_iso3.json";
export function iso3_to_iso2(iso3: keyof typeof iso3_to_iso2_data): string {
  return iso3_to_iso2_data[iso3];
}

export function iso2_to_iso3(iso2: keyof typeof iso2_to_iso3_data): string {
  return iso2_to_iso3_data[iso2];
}
