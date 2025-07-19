import React, { MouseEventHandler, useEffect, useState } from "react";
import { csv } from "d3-fetch";
import { scaleLinear } from "d3-scale";
import { geoCentroid, GeoGeometryObjects, select, type DSVRowArray } from "d3";
import {
  ComposableMap,
  Geographies,
  Geography,
  Sphere,
  Graticule,
  ZoomableGroup,
} from "react-simple-maps";
import { Slider } from "../ui/slider";
import { Toggle } from "../ui/toggle";
import { Italic, ZoomInIcon } from "lucide-react";

const geoUrl = "/features.json";

const colorScale = scaleLinear<string>()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = ({
  selectedCountry,
  setSelectedCountry,
  selectedCountry2,
  setSelectedCountry2,
}: {
  selectedCountry: string;
  setSelectedCountry: Function;
  selectedCountry2: string;
  setSelectedCountry2: Function;
}) => {
  const [autoZoom, setAutoZoom] = useState(false);
  const [data, setData] = useState<DSVRowArray<string> | null>(null);
  const [camera, setCamera] = useState<{
    center: [number, number];
    zoom: number;
  }>({ center: [0, 0], zoom: 1 });

  useEffect(() => {
    csv(`/vulnerability.csv`).then((data) => {
      setData(data);
    });
  }, []);

  const handleCountryClick = (geo: GeoGeometryObjects) => {
    console.log(geo);
    if (geo.properties.name == selectedCountry) {
      setSelectedCountry(selectedCountry2);
      setSelectedCountry2("");
    } else if (geo.properties.name == selectedCountry2) {
      setSelectedCountry2("");
    } else if (!selectedCountry) {
      setSelectedCountry(geo.properties.name);
    } else {
      setSelectedCountry2(geo.properties.name);
    }
    const centroid = geoCentroid(geo);
    if (autoZoom) {
      setCamera({ center: centroid, zoom: 4 });
    }
  };

  const handleFilter = (filter: SVGElement) => {
    return filter.type !== "dblclick";
  };

  return (
    <div className="relative">
      <div className="absolute top-2 left-2 z-10">
        <Toggle
          aria-label="Toggle italic"
          pressed={autoZoom}
          onPressedChange={setAutoZoom}
        >
          <ZoomInIcon />
          Auto Zoom
        </Toggle>
      </div>
      <ComposableMap
        projectionConfig={{
          rotate: [-10, 0, 0],
          scale: 147,
        }}
        height={350}
        // style={{width: "100%", height: "100%"}}
      >
        <ZoomableGroup
          center={camera.center}
          zoom={camera.zoom}
          onMoveEnd={(position) => {
            setCamera({
              center: [position.coordinates[0], position.coordinates[1]],
              zoom: position.zoom,
            });
          }}
          filterZoomEvent={handleFilter}
        >
          <Sphere
            stroke="#E4E5E6"
            strokeWidth={0.5}
            id={""}
            fill={"transparent"}
          />
          <Graticule stroke="#E4E5E6" strokeWidth={0.5} />

          {data && data.length > 0 && (
            <Geographies geography={geoUrl}>
              {({ geographies }) => {
                const reorderedGeographies = [...geographies];
                const selectedIndex = reorderedGeographies.findIndex(
                  (geo) => geo.properties.name === selectedCountry
                );
                const selectedIndex2 = reorderedGeographies.findIndex(
                  (geo) => geo.properties.name === selectedCountry2
                );
                if (selectedIndex !== -1) {
                  const [selectedGeo] = reorderedGeographies.splice(
                    selectedIndex,
                    1
                  );
                  reorderedGeographies.push(selectedGeo);
                }
                if (selectedIndex2 !== -1) {
                  const [selectedGeo] = reorderedGeographies.splice(
                    selectedIndex2,
                    1
                  );
                  reorderedGeographies.push(selectedGeo);
                }
                return reorderedGeographies.map((geo) => {
                  const d = data.find((s) => s.ISO3 === geo.id);
                  // console.log(geo);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      fill={d ? colorScale(Number(d["2017"])) : "#F5F4F6"}
                      stroke={
                        [selectedCountry, selectedCountry2].includes(
                          geo.properties.name
                        )
                          ? "#4D4D4D"
                          : "#FFFFFF"
                      }
                      strokeWidth={
                        [selectedCountry, selectedCountry2].includes(
                          geo.properties.name
                        )
                          ? 2
                          : 1
                      }
                      style={{
                        default: { outline: "none" },
                        hover: {
                          outline: "none",
                          // strokeWidth: 4,
                          // stroke: "#607D8B",
                          // zIndex: 1000,
                        },
                        pressed: {
                          outline: "none",
                        },
                      }}
                      onClick={() => handleCountryClick(geo)}
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                });
              }}
            </Geographies>
          )}
        </ZoomableGroup>
      </ComposableMap>
    </div>
  );
};

export default MapChart;
