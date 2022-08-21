import { assertEquals } from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.152.0/testing/mock.ts";
import { delay } from "https://deno.land/std@0.152.0/async/delay.ts";
import { DOMParser } from "https://deno.land/x/deno_dom@v0.1.33-alpha/deno-dom-wasm.ts";
import { act } from "https://esm.sh/react-dom@18.2.0/test-utils?target=es2020&dev";

/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React, { createRoot, Line } from "./deps.ts";
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
      if (type === Line) {
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
  const mediaQueryList = new EventTarget() as MediaQueryList;
  const matchMediaStub = stub(
    globalThis,
    "matchMedia",
    () => mediaQueryList,
  );
  try {
    act(() => {
      createRoot(document.querySelector("#root")!).render(<PopulationGraph />);
    });

    const calls = createElementStub.calls as unknown as {
      1: { args: [typeof SelectBox, SelectBoxProps] };
      8: { args: [typeof Line, Parameters<typeof Line>[0]] };
      13: { args: [typeof Line, Parameters<typeof Line>[0]] };
      15: { args: [typeof Line, Parameters<typeof Line>[0]] };
    };

    // 初期表示の際にレンダリングされるデータを確認
    {
      const { args } = calls[1];
      assertEquals(args[0], SelectBox);
      assertEquals(args[1].prefectures[0].prefCode, 100);
      assertEquals(args[1].prefectures[0].prefName, "○○県");
      assertEquals(typeof args[1].togglePrefecture, "function");
      assertEquals(
        document.querySelector("#root")!.innerHTML,
        `<div class="select-box"><input id="select-box-100" type="checkbox"><label for="select-box-100">○○県</label></div><div title="表示するデータがありません。上の選択画面から都道府県を選択してください。"><div></div></div>`,
      );
    }
    // 初期表示の際にレンダリングされるデータを確認
    {
      const { args } = calls[8];
      assertEquals(args[0], Line);
      assertEquals(args[1], {
        data: { datasets: [], labels: [] },
        height: "400",
        options: {
          color: "black",
          maintainAspectRatio: false,
          plugins: {
            title: { color: "black", display: true, text: "都道府県別の人口" },
          },
          scales: {
            xAxes: {
              ticks: { color: "black" },
              title: { color: "black", display: true, text: "year" },
            },
            yAxes: {
              beginAtZero: true,
              ticks: { color: "black" },
              title: { color: "black", display: true, text: "population" },
            },
          },
        },
      });
    }

    // チェックボックスをチェックした時に正しくデータが読み込まれ、表示が切り替わるか確認
    act(() => {
      calls[1].args[1].togglePrefecture(100);
    });
    await delay(1000);
    {
      const { args } = calls[13];
      assertEquals(args[0], Line);
      assertEquals<unknown>(args[1], {
        data: {
          datasets: [
            {
              backgroundColor: "hsl(42, 100%, 40%)",
              borderColor: "hsl(42, 100%, 40%)",
              data: [20],
              label: "○○県",
            },
          ],
          labels: ["1000"],
        },
        height: "400",
        options: {
          color: "black",
          maintainAspectRatio: false,
          plugins: {
            title: { color: "black", display: true, text: "都道府県別の人口" },
          },
          scales: {
            xAxes: {
              ticks: { color: "black" },
              title: { color: "black", display: true, text: "year" },
            },
            yAxes: {
              beginAtZero: true,
              ticks: { color: "black" },
              title: { color: "black", display: true, text: "population" },
            },
          },
        },
      });
    }
    // ダークモードに変更した時に表示が切り替わるか確認
    act(() => {
      mediaQueryList.dispatchEvent(
        new class extends Event {
          matches = true;
        }("change"),
      );
    });
    await delay(1000);
    {
      const { args } = calls[15];
      assertEquals(args[0], Line);
      assertEquals(args[1].options!.color, "white");
    }
  } finally {
    createElementStub.restore();
    fetchStub.restore();
    matchMediaStub.restore();
  }
});
