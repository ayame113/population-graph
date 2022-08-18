import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
import React from "./deps.ts";

import { Header } from "./Header.tsx";
import { Main } from "./Main.tsx";
import { Footer } from "./Footer.tsx";

const preload = [
  { as: "fetch", href: "/api/prefectures" },
  { as: "script", href: "/components/PopulationGraph.tsx" },
  { as: "script", href: "/components/Graph.tsx" },
  { as: "script", href: "/components/SelectBox.tsx" },
  { as: "script", href: "/components/deps.ts" },
  { as: "script", href: "https://esm.sh/v91/react@18.2.0/es2020/react.js" },
  {
    as: "script",
    href: "https://esm.sh/v91/react-dom@18.2.0/es2020/react-dom.js",
  },
  {
    as: "script",
    href: "https://esm.sh/v91/scheduler@0.23.0/es2020/scheduler.js",
  },
  {
    as: "script",
    href: "https://esm.sh/v91/react-chartjs-2@4.3.1/es2020/react-chartjs-2.js",
  },
  { as: "script", href: "https://esm.sh/v91/chart.js@3.9.1/es2020/chart.js" },
];
const TITLE = "都道府県総人口グラフ";
const DESCRIPTION = "都道府県の人口グラフ。";
const TOP_PAGE = "https://popl.deno.dev";
// Copyright 2018 Twitter, Inc and other contributors. Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
const FAVICON = "https://favi.deno.dev/📈.png";

/** トップページ */
export function Page() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{TITLE}</title>
        <script type="module" src="/components/PopulationGraph.tsx"></script>
        {preload.map(({ as, href }) => (
          <link
            rel="preload"
            as={as}
            crossOrigin=""
            href={href}
          />
        ))}
        <link rel="stylesheet preload" as="style" href="/assets/style.css" />
        <meta name="description" content={DESCRIPTION} />
        <meta name="theme-color" content="#f32091" />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={TOP_PAGE} />
        <meta property="og:image" content={FAVICON} />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@_ayame113_" />
        <link rel="icon" type="image/png" href={FAVICON} />
        <link rel="apple-touch-icon" href={FAVICON} />
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
