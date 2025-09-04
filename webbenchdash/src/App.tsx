import { useState } from "react";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";

import { CountryName } from "./components/macro/country-name";
import { ThemeProvider } from "./components/theme-provider";
import { ModeToggle } from "./components/mode-toggle";
import Widget from "./components/widget/Widget";
import { CsvDataProvider } from "./components/context/CSVContext";
import { ISO3 } from "./lib/country_convert";

function App() {
  const [selectedIso3_1, setSelectedIso3_1] = useState<ISO3>();
  const [selectedIso3_2, setSelectedIso3_2] = useState<ISO3>();
  const [selectedFeature, setSelectedFeature] = useState("reliability");
  const [selectedSubset, setSelectedSubset] = useState("gov");

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CsvDataProvider fileUrl={"/dataset.csv"}>
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
          <CountryName c1={selectedIso3_1} c2={selectedIso3_2} />
          <div className="min-h-4"></div>
          <MapChart
            selectedIso3={selectedIso3_1}
            setSelectedIso3={setSelectedIso3_1}
            selectedIso3_2={selectedIso3_2}
            setSelectedIso3_2={setSelectedIso3_2}
          />
          {/* flex flex-col gap-4 */}
          <div className="mx-4 right-4 bottom-4 sticky">
            {["reliability", "performance", "security"].map((feature) => (
              <Widget
                selectedIso3_1={selectedIso3_1}
                selectedIso3_2={selectedIso3_2}
                selectedSubset={selectedSubset}
                feature={feature}
                selectedFeature={selectedFeature}
              />
            ))}
          </div>
          <ModeToggle />
        </div>
      </CsvDataProvider>
    </ThemeProvider>
  );
}

export default App;
