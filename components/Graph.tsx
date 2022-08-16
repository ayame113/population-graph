/// <reference lib="dom" />

import React, { useState } from "./deps.ts";
import type { Population } from "../types.ts";

export interface GraphProps {
  data: Population[];
}

export function Graph(props: GraphProps) {
  return (
    <>
      <div>{JSON.stringify(props.data)}</div>
    </>
  );
}
