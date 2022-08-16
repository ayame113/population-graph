/// <reference lib="dom" />

import type { Population, Prefectures } from "../types.ts";
import React, { render, useEffect, useState } from "./deps.ts";
import { SelectBox } from "./SelectBox.tsx";
import { Graph } from "./Graph.tsx";

// type PopulationRecord = Record<
//   number,
//   | { isLoading: false; data: Population }
//   | { isLoading: true; data?: undefined }
//   | undefined
// >;
type PopulationRecord = Record<
  number,
  | { isLoading: false; data: Population }
  | { isLoading: true; data?: undefined }
  | undefined
>;

const prefecturesPromise: Promise<Prefectures> =
  (await fetch("/api/prefectures")).json();

function App() {
  console.log("render App");
  const [prefectures, setPrefectures] = useState<Prefectures | null>(null);
  useEffect(() => {
    prefecturesPromise.then((data) => setPrefectures(data));
  }, []);
  // const [isFirst, setIsFirst] = useState(true);
  // if (isFirst) {
  //   setIsFirst(false);
  //   prefecturesPromise.then((data) => setPrefectures(data));
  // }

  const [populations, setPopulations] = useState<
    { data: PopulationRecord }
  >({ data: {} });

  const [selectedPrefectures, setSelectedPrefectures] = useState(
    { data: new Set<number>() },
  );
  const togglePrefecture = (prefCode: number) => {
    const { data } = selectedPrefectures;
    if (data.has(prefCode)) {
      data.delete(prefCode);
    } else {
      data.add(prefCode);
      loadPopulation(prefCode);
    }
    setSelectedPrefectures({ data });
  };
  const loadPopulation = (prefCode: number) => {
    const { data } = populations;
    if (data[prefCode]) {
      return;
    }
    data[prefCode] = { isLoading: true };
    getPopulationAPI(prefCode).then((population) => {
      data[prefCode] = {
        isLoading: false,
        data: population,
      };
      setPopulations({ data });
    });
  };
  return (
    <div>
      <SelectBox
        prefectures={prefectures}
        togglePrefecture={togglePrefecture}
      />
      <Graph
        data={[...selectedPrefectures.data]
          .map((prefCode) => populations.data[prefCode]?.data)
          .filter((v): v is Population => !!v)}
      />
    </div>
  );
}

async function getPopulationAPI(prefCode: number): Promise<Population> {
  const res = await fetch(`/api/population/${prefCode}`);
  return res.json();
}

render(<App />, document.querySelector("#root"));
