import { useState } from "react";
import { Button } from "./components/ui/button";
import { FeatureSelect } from "./components/macro/feature-select";
import MapChart from "./components/macro/map-chart";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-center text-6xl font-medium py-5">
        WebBench Dashboard
      </h1>
      {/* <Button>Click me</Button> */}
      <div className="w-full flex justify-center">
        <FeatureSelect />
      </div>
      <MapChart />
    </>
  );
}

export default App;
