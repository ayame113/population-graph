import React, { createRoot } from "./deps.ts";
import { PopulationGraph } from "./PopulationGraph.tsx";

// render react app
createRoot(document.querySelector("#root")!).render(
  React.createElement(PopulationGraph),
);
