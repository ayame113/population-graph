import React from "./deps.ts";

import { About } from "./About.tsx";
import { Usage } from "./Usage.tsx";

export function Main() {
  return (
    <main>
      <About />
      <Usage />
      <section id="root">Loading...</section>
    </main>
  );
}
