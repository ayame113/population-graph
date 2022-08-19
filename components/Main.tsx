import React from "./deps.ts";

import { About } from "./About.tsx";
import { Usage } from "./Usage.tsx";

/** メインコンポーネント */
export function Main() {
  return (
    <main>
      <About />
      <Usage />
      {/* PopulationGraph */}
      <section id="root">Loading...</section>
    </main>
  );
}
