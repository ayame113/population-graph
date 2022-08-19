import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.152.0/testing/mock.ts";
import { delay } from "https://deno.land/std@0.152.0/async/delay.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import { act } from "https://esm.sh/react-dom@18.2.0/test-utils?target=es2020&dev";

import React, { createRoot } from "./deps.ts";
import { Graph, GraphProps } from "./Graph.tsx";
import { SelectBox, SelectBoxProps } from "./SelectBox.tsx";

export const fetchStub = stub(
  globalThis,
  "fetch",
  () => Promise.resolve(Response.json([{ prefCode: 100, prefName: "○○県" }])),
);

// @ts-expect-error: for test
globalThis.document = new DOMParser().parseFromString(
  `<html><head></head><body><div id="root"></div></body></html>`,
  "text/html",
);

// @ts-expect-error: for test
globalThis.HTMLIFrameElement = class {};

const { PopulationGraph } = await import("./PopulationGraph.tsx");
fetchStub.restore();

Deno.test(async function renderPopulationGraph() {
  const originalReactCreateElement = React.createElement;
  const createElementStub = stub(
    React,
    "createElement",
    (type, ...args) => {
      // @ts-expect-error: for test
      if (type === SelectBox) {
        return originalReactCreateElement("div");
      }
      if (type === Graph) {
        return originalReactCreateElement("div");
      }
      return originalReactCreateElement(type, ...args);
    },
  );
  const fetchStub = stub(
    globalThis,
    "fetch",
    () => Promise.resolve(Response.json([{ year: 1000, value: 20 }])),
  );
  try {
    act(() => {
      createRoot(document.querySelector("#root")!).render(<PopulationGraph />);
    });

    const calls = createElementStub.calls as unknown as {
      1: { args: [typeof SelectBox, SelectBoxProps] };
      2: { args: [typeof Graph, GraphProps] };
      5: { args: [typeof Graph, GraphProps] };
    };

    // 初期表示の際にレンダリングされるデータを確認
    {
      const { args } = calls[1];
      assertEquals(args[0], SelectBox);
      assertEquals(args[1].prefectures[0].prefCode, 100);
      assertEquals(args[1].prefectures[0].prefName, "○○県");
      assertEquals(typeof args[1].togglePrefecture, "function");
    }
    // 初期表示の際にレンダリングされるデータを確認
    {
      const { args } = calls[2];
      assertEquals(args[0], Graph);
      assertEquals(args[1], { data: [] });
    }

    // チェックボックスをチェックした時に正しくデータが読み込まれ、表示が切り替わるか確認
    act(() => {
      calls[1].args[1].togglePrefecture(100);
    });
    await delay(1000);
    {
      const { args } = calls[5];
      assertEquals(args[0], Graph);
      assertEquals<unknown>(args[1], {
        data: [{
          isLoading: false,
          prefName: "○○県",
          selected: true,
          value: { "1000": 20 },
        }],
      });
    }
  } finally {
    createElementStub.restore();
    fetchStub.restore();
  }
});
