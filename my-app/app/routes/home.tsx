import type { Route } from "./+types/home";
import { Button } from "~/components/ui/button";
import MapChart from "~/components/macro/MapChart";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return (
    <div>
      <h1 className="text-center text-6xl font-medium py-5">
        WebBench Dashboard
      </h1>
      {/* <p className="text-center text-2xl text-muted-foreground">Reliable</p> */}
      <MapChart />
    </div>
  );
}
