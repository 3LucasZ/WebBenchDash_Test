import { DataCompare } from "../macro/data-compare";
import { DataCountry } from "../macro/data-country";
import { widgetData } from "./data";

export default function Widget({
  selectedCountry,
  selectedCountry2,
  selectedSubset,
  feature,
  selectedFeature,
}: {
  selectedCountry: string | null;
  selectedCountry2: string | null;
  selectedSubset: string;
  feature: string;
  selectedFeature: string;
}) {
  const myData = widgetData[feature as keyof typeof widgetData];
  if (!selectedCountry || selectedFeature != feature) {
    return <div></div>;
  }
  if (!selectedCountry2) {
    return (
      <DataCountry
        title={myData.title}
        path={myData.path}
        country={selectedCountry}
        subset={selectedSubset}
        regFeatures={myData.regFeatures}
        proportionFeatures={myData.proportionFeatures}
        categoricalPrefixes={myData.categoricalPrefixes}
      />
    );
  } else {
    return (
      <DataCompare
        title={myData.title}
        path={myData.path}
        country1={selectedCountry}
        country2={selectedCountry2}
        subset={selectedSubset}
      />
    );
  }
}
