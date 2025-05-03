import { useState } from "react";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";
import { ClusterChart } from "./components/macro/cluster-chart";
import { PercentileChart } from "./components/macro/percentile-chart";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("USA");

  return (
    <>
      <p className="text-center text-4xl font-medium py-4">
        WebBench Dashboard
      </p>
      <div className="w-full flex justify-center">
        <FeatureSelect />
      </div>
      <div className="min-h-4"></div>
      <p className="text-center text-3xl">
        {selectedCountry || "Select a Country"}
      </p>
      <div className="min-h-4"></div>
      <MapChart
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
      <div className="min-h-4"></div>
      <div className="flex gap-4 w-full px-4">
        <div className="w-1/3">
          <ClusterChart country={selectedCountry} />
        </div>
        <div className="w-1/3">
          <PercentileChart country={selectedCountry} />
        </div>
        <div className="w-1/3">{/* <SecurityChart /> */}</div>
      </div>
      <div className="min-h-4"></div>
    </>
  );
}

export default App;
