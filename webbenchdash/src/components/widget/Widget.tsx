import { ISO2, iso2_to_iso3, ISO3 } from "@/lib/country_convert";
import { useCsvData } from "../context/CSVContext";
import { DataCompare } from "../macro/data-compare";
import { DataCountry } from "../macro/data-country";
import { widgetData as allWidgetData } from "./data";
import { cvtRecord } from "@/lib/utils";

export default function Widget({
  selectedIso3_1,
  selectedIso3_2,
  selectedSubset,
  feature,
  selectedFeature,
}: {
  selectedIso3_1: ISO3 | undefined;
  selectedIso3_2: ISO3 | undefined;
  selectedSubset: string;
  feature: string;
  selectedFeature: string;
}) {
  if (!selectedIso3_1 || selectedFeature != feature) {
    return <div></div>;
  }

  const { csvData: data } = useCsvData();
  const widgetData = allWidgetData[feature as keyof typeof allWidgetData];
  //filter by subset and country
  const data_t = data.filter(
    (row) => row.gov == (selectedSubset == "gov" ? "1" : "0")
  );
  const data1_t =
    data_t.find((row) => iso2_to_iso3(row.cc as ISO2) == selectedIso3_1) ||
    data_t[0];
  const data1 = cvtRecord(data1_t);

  if (!selectedIso3_2) {
    return (
      <DataCountry
        title={widgetData.title}
        regFeatures={widgetData.regFeatures}
        proportionFeatures={widgetData.proportionFeatures}
        categoricalPrefixes={widgetData.categoricalPrefixes}
        df={data1}
      />
    );
  }
  const data2_t =
    data_t.find((row) => iso2_to_iso3(row.cc as ISO2) == selectedIso3_2) ||
    data_t[0];
  const data2 = cvtRecord(data2_t);

  return (
    <DataCompare
      title={widgetData.title}
      country_1_df={data1}
      country_2_df={data2}
      country_1={selectedIso3_1}
      country_2={selectedIso3_2}
      features={[
        ...widgetData.regFeatures,
        ...widgetData.categoricalPrefixes,
        ...widgetData.regFeatures,
      ]}
    />
  );
}
