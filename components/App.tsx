/// <reference lib="dom" />

import type { Population, Prefectures } from "../types.ts";
import React, { render, useState } from "./deps.ts";
import { SelectBox } from "./SelectBox.tsx";
import { Graph } from "./Graph.tsx";

const prefecturesPromise: Promise<Prefectures> =
  (await fetch("/api/prefectures")).json();

function App() {
  const [prefectures, setPrefectures] = useState<Prefectures | null>(null);
  const [isFirst, setIsFirst] = useState(true);
  if (isFirst) {
    setIsFirst(false);
    prefecturesPromise.then((data) => setPrefectures(data));
  }
  console.log(prefectures);

  const [selectedPrefectures, setSelectedPrefectures] = useState({
    data: new Set<number>(),
  });
  const togglePrefecture = (prefCode: number) => {
    if (selectedPrefectures.data.has(prefCode)) {
      selectedPrefectures.data.delete(prefCode);
    } else {
      selectedPrefectures.data.add(prefCode);
    }
    setSelectedPrefectures({
      data: selectedPrefectures.data,
    });
  };
  return (
    <div>
      <SelectBox
        prefectures={prefectures}
        togglePrefecture={togglePrefecture}
      />
      <Graph selectedPrefectures={selectedPrefectures} />
    </div>
  );
}

render(<App />, document.querySelector("#root"));
