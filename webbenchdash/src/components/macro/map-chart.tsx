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
import { iso3_to_iso2 } from "@/lib/country_convert";

const geoUrl = "/features.json";
const countryCodesUrl = "/country_codes.json";

const colorScale = scaleLinear<string>()
  .domain([0.29, 0.68])
  .range(["#ffedea", "#ff5233"]);

const MapChart = ({
  selectedIso3: selectedCountry,
  setSelectedIso3: setSelectedCountry,
  selectedIso3_2: selectedCountry2,
  setSelectedIso3_2: setSelectedCountry2,
}: {
  selectedIso3: string;
  setSelectedIso3: Function;
  selectedIso3_2: string;
  setSelectedIso3_2: Function;
}) => {
  const [autoZoom, setAutoZoom] = useState(false);
  const [countriesInScope, setCountriesInScope] = useState<string[]>([]);
  const [data, setData] = useState<DSVRowArray<string> | null>(null);
  const [camera, setCamera] = useState<{
    center: [number, number];
    zoom: number;
  }>({ center: [0, 0], zoom: 1 });

  useEffect(() => {
    fetch(countryCodesUrl)
      .then((response) => response.json())
      .then((data) => {
        setCountriesInScope(data);
      });

    csv(`/vulnerability.csv`).then((data) => {
      setData(data);
    });
  }, []);

  const handleCountryClick = (geo: GeoGeometryObjects) => {
    // console.log(geo);
    if (geo.id == selectedCountry) {
      setSelectedCountry(selectedCountry2);
      setSelectedCountry2("");
    } else if (geo.id == selectedCountry2) {
      setSelectedCountry2("");
    } else if (!selectedCountry) {
      setSelectedCountry(geo.id);
    } else {
      setSelectedCountry2(geo.id);
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
                  (geo) => geo.id === selectedCountry
                );
                const selectedIndex2 = reorderedGeographies.findIndex(
                  (geo) => geo.id === selectedCountry2
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
                  const isInScope = countriesInScope.includes(
                    iso3_to_iso2(geo.id)
                  );
                  var fill: string;
                  if (!isInScope) {
                    fill = "#f0f0f0";
                  } else if (
                    [selectedCountry, selectedCountry2].includes(geo.id)
                  ) {
                    fill = "#f87171";
                  } else {
                    fill = "#d0d0d0";
                  }
                  const d = data.find((s) => s.ISO3 === geo.id);
                  // console.log(geo);
                  return (
                    <Geography
                      key={geo.rsmKey}
                      geography={geo}
                      // fill={d ? colorScale(Number(d["2017"])) : "#F5F4F6"}
                      // fill="#DDDDDD"
                      fill={fill}
                      stroke={
                        [selectedCountry, selectedCountry2].includes(geo.id)
                          ? "#dc2626"
                          : "#FFFFFF"
                      }
                      strokeWidth={
                        [selectedCountry, selectedCountry2].includes(geo.id)
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
