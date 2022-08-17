/// <reference lib="dom" />

import type { Population, Prefectures } from "../types.ts";
import React, { render, useCallback, useState } from "./deps.ts";
import { SelectBox } from "./SelectBox.tsx";
import { Graph, GraphProps } from "./Graph.tsx";

type PopulationRecord = Record<number, {
  selected: boolean;
  isLoading: boolean;
  value: { [year: number]: number } | null;
  prefName: string;
}>;

const prefectures: Prefectures = await (await fetch("/api/prefectures")).json();

function App() {
  console.log("render App");
  const [populations, setPopulations] = useState<{ data: PopulationRecord }>({
    data: Object.fromEntries(
      prefectures.map(({ prefCode, prefName }) => [prefCode, {
        prefName,
        selected: false,
        isLoading: false,
        value: null,
      }]),
    ),
  });

  const togglePrefecture = useCallback((prefCode: number) => {
    const { data } = populations;
    data[prefCode].selected = !data[prefCode].selected;

    if (!data[prefCode].isLoading && !data[prefCode].value) {
      data[prefCode].isLoading = true;
      getPopulationAPI(prefCode).then((population) => {
        data[prefCode].value = population;
        data[prefCode].isLoading = false;

        const skipRender = !data[prefCode].selected;
        if (skipRender) {
          return;
        }

        setPopulations({ data });
      });
    }

    const skipRender = !data[prefCode].value;
    if (skipRender) {
      return;
    }

    setPopulations({ data });
  }, []);

  return (
    <>
      <SelectBox
        prefectures={prefectures}
        togglePrefecture={togglePrefecture}
      />
      <Graph
        data={Object.values(populations.data)
          .filter((d) => d.value && d.selected) as GraphProps["data"]}
      />
    </>
  );
}

async function getPopulationAPI(
  prefCode: number,
): Promise<{ [year: number]: number }> {
  const res = await fetch(`/api/population/${prefCode}`);
  const data: Population = await res.json();
  return Object.fromEntries(data.map((d) => [d.year, d.value]));
}

render(<App />, document.querySelector("#root"));
