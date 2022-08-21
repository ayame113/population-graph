import ReactDOMServer from "https://esm.sh/react-dom@18.2.0/server";
/** @jsxFrag React.Fragment */
/** @jsx React.createElement */
import React from "./server_deps.ts";
import {
  DEPLOYMENT_ID,
  DESCRIPTION,
  FAVICON_URL,
  THEME_COLOR,
  TITLE,
  TOP_PAGE,
} from "../metadata.ts";

import { Header } from "./Header.tsx";
import { Main } from "./Main.tsx";
import { Footer } from "./Footer.tsx";

const preload = [
  { as: "fetch", href: "/api/prefectures" },
  { as: "script", href: "/components/main.ts" },
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
  {
    as: "script",
    href: "https://esm.sh/v91/react-dom@18.2.0/es2020/client.js",
  },
];

const serviceWorkerScript = `
if ("serviceWorker" in navigator)
  navigator.serviceWorker.register("/service_worker.js?__h=${DEPLOYMENT_ID}", { scope: "/" });
`;

/** トップページ */
export function Page() {
  return (
    <html lang="ja">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{TITLE}</title>
        <script type="module" src="/components/main.ts"></script>
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
        <meta name="theme-color" content={THEME_COLOR} />
        <meta property="og:title" content={TITLE} />
        <meta property="og:description" content={DESCRIPTION} />
        <meta property="og:url" content={TOP_PAGE} />
        <meta
          property="og:image"
          content="https://popl.deno.dev/twitter_card.png"
        />
        <meta property="og:type" content="website" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@_ayame113_" />
        <link rel="icon" type="image/png" href={FAVICON_URL} />
        <link rel="apple-touch-icon" href={FAVICON_URL} />
        <script
          type="module"
          dangerouslySetInnerHTML={{ __html: serviceWorkerScript }}
        />
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
