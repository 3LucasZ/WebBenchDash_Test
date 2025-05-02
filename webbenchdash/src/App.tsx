import { useState } from "react";
import { Button } from "./components/ui/button";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");

  return (
    <>
      <p className="text-center text-6xl font-medium py-5">
        WebBench Dashboard
      </p>
      <div className="w-full flex justify-center">
        <FeatureSelect />
      </div>
      <div className="min-h-4"></div>
      <p className="text-center text-3xl py-5">{selectedCountry}</p>
      <MapChart
        selectedCountry={selectedCountry}
        setSelectedCountry={setSelectedCountry}
      />
    </>
  );
}

export default App;
