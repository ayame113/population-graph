/// <reference lib="dom" />

import React from "./deps.ts";

export interface GraphProps {
  selectedPrefectures: { data: Set<number> };
}

export function Graph(props: GraphProps) {
  return <div>{[...props.selectedPrefectures.data].join(", ")}</div>;
}
