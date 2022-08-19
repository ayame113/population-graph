import React, { createRoot } from "./deps.ts";
import { PopulationGraph } from "./PopulationGraph.tsx";

createRoot(document.querySelector("#root")!).render(
  React.createElement(PopulationGraph),
);
