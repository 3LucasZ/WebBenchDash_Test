import { useState } from "react";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";
import { ClusterChart } from "./components/macro/cluster-chart";
import { PercentileChart } from "./components/macro/percentile-chart";
import { ResilienceDNSRaw } from "./components/macro/resilience-dns-raw";
import { CountryName } from "./components/macro/country-name";

function App() {
  const [selectedCountry, setSelectedCountry] = useState<string>("");
  const [selectedCountry2, setSelectedCountry2] = useState<string>("");
  const [selectedFeature, setSelectedFeature] = useState("reliability");
  const [selectedSubset, setSelectedSubset] = useState("gov");

  return (
    <div className="flex flex-col h-screen min-h-screen overflow-hidden">
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
      <div className="flex max-w-6xl gap-4 px-4 bottom-3 sticky">
        {selectedFeature == "reliability" && (
          <div className="w-1/2">
            <ResilienceDNSRaw
              country={selectedCountry}
              subset={selectedSubset}
            />
          </div>
        )}
        {selectedFeature == "reliability" && selectedCountry2 && (
          <div className="w-1/2">
            <ResilienceDNSRaw
              country={selectedCountry2}
              subset={selectedSubset}
            />
          </div>
        )}
        {selectedFeature == "performance" && (
          <div className="w-1/2">
            <ClusterChart country={selectedCountry} />
          </div>
        )}

        <div className="w-1/2">
          <PercentileChart country={selectedCountry} />
        </div>
        {/* <div className="w-1/3"><SecurityChart /></div> */}
      </div>
    </div>
  );
}

export default App;
