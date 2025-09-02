import { useState } from "react";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";
import { ClusterChart } from "./components/macro/cluster-chart";
import { PercentileChart } from "./components/macro/percentile-chart";

import { CountryName } from "./components/macro/country-name";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import { NontechRaw } from "./components/macro/nontech-raw";
import { DataRaw } from "./components/macro/data-raw";
import { DataCountry } from "./components/macro/data-country";
import { DataCompare } from "./components/macro/data-compare";
import Widget from "./components/widget/Widget";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState("reliability");
  const [selectedSubset, setSelectedSubset] = useState("gov");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <div className="flex flex-col h-screen min-h-screen w-screen min-w-screen overflow-y-hidden">
        <p className="text-center text-4xl font-medium py-4">
          WebBench Dashboard
        </p>
        {/* <div className="min-h-4"></div> */}
        <div className="w-full flex justify-center">
          <FeatureSelect
            value1={selectedFeature}
            onValue1Change={setSelectedFeature}
            value2={selectedSubset}
            onValue2Change={setSelectedSubset}
          />
        </div>
        <div className="min-h-4"></div>
        <CountryName c1={selectedCountry} c2={selectedCountry2} />
        <div className="min-h-4"></div>
        <MapChart
          selectedCountry={selectedCountry}
          setSelectedCountry={setSelectedCountry}
          selectedCountry2={selectedCountry2}
          setSelectedCountry2={setSelectedCountry2}
        />
        {/* flex flex-col gap-4 */}
        <div className="px-4 pb-4 bottom-0 sticky">
          {["reliability", "performance", "security"].map((feature) => (
            <Widget
              selectedCountry={selectedCountry}
              selectedCountry2={selectedCountry2}
              selectedSubset={selectedSubset}
              feature={feature}
              selectedFeature={selectedFeature}
            />
          ))}
        </div>
        <ModeToggle />
      </div>
    </ThemeProvider>
  );
}

export default App;
