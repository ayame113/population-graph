import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import React from "./deps.ts";

import { Header } from "./Header.tsx";
import { Main } from "./Main.tsx";
import { Footer } from "./Footer.tsx";

/** トップページ */
export function Page() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>都道府県総人口グラフ</title>
        <script type="module" src="/components/PopulationGraph.tsx"></script>
        <link
          rel="preload"
          as="fetch"
          crossOrigin=""
          href="/api/prefectures"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="/components/PopulationGraph.tsx"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="/components/Graph.tsx"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="/components/SelectBox.tsx"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="/components/deps.ts"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="https://esm.sh/v91/react@18.2.0/es2020/react.js"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="https://esm.sh/v91/react-dom@18.2.0/es2020/react-dom.js"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="https://esm.sh/v91/scheduler@0.23.0/es2020/scheduler.js"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="https://esm.sh/v91/react-chartjs-2@4.3.1/es2020/react-chartjs-2.js"
        />
        <link
          rel="preload"
          as="script"
          crossOrigin=""
          href="https://esm.sh/v91/chart.js@3.9.1/es2020/chart.js"
        />
        <link rel="stylesheet preload" href="/assets/style.css" />
        <meta name="description" content="都道府県の人口グラフ。" />
        <meta name="theme-color" content="#f32091" />
        <meta property="og:title" content="都道府県総人口グラフ" />
        <meta property="og:description" content="都道府県の人口グラフ。" />
        <meta property="og:url" content="https://popl.deno.dev/" />
        <meta property="og:image" content="https://favi.deno.dev/📈.png" />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@_ayame113_" />
        {/* Copyright 2018 Twitter, Inc and other contributors. Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/ */}
        <link rel="icon" type="image/png" href="https://favi.deno.dev/📈.png" />
        <link rel="apple-touch-icon" href="https://favi.deno.dev/📈.png" />
      </head>
      <body>
        <Header />
        <Main />
        <Footer />
      </body>
    </html>
  );
}

export const renderToString = () =>
  `<!DOCTYPE html>${ReactDOMServer.renderToString(<Page />)}`;
