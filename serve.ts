import "https://deno.land/std@0.173.0/dotenv/load.ts";
import {
  serve,
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.173.0/http/mod.ts";
import { serveFile } from "https://deno.land/std@0.173.0/http/file_server.ts";
import { fromFileUrl } from "https://deno.land/std@0.173.0/path/mod.ts";
import { contentType } from "https://deno.land/std@0.173.0/media_types/mod.ts";
import {
  fourceInstantiateWasm,
  serveDirWithTs,
} from "https://deno.land/x/ts_serve@v1.4.2/mod.ts";

import type { Routing } from "./server/types.ts";
import { init, populationApi, prefecturesApi } from "./server/api.ts";
import { manifestJson } from "./server/manifest.json.ts";
import { renderToString } from "./components/Page.tsx";

fourceInstantiateWasm();
const routing: Routing[] = [prefecturesApi, populationApi, manifestJson];
const response404 = new Response(STATUS_TEXT[Status.NotFound], {
  status: Status.NotFound,
});

const html = renderToString();
const htmlContentType = contentType("html");
const workerPath = fromFileUrl(
  import.meta.resolve("./worker/service_worker.js"),
);

init();

const cache: Record<string, Response | undefined> = {};

export const handler = async (request: Request) => {
  // index.htmlのレスポンス
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return new Response(html, {
      headers: { "Content-Type": htmlContentType },
    });
  }

  if (url.pathname === "/twitter_card.png") {
    return await fetch("https://favi.deno.dev/📈.png");
  }

  if (url.pathname === "/service_worker.js") {
    return serveFile(request, workerPath);
  }

  // APIへのリクエストを受信
  for (const { pattern, route } of routing) {
    const match = pattern.exec(url);
    if (match) {
      return (await route(url, match, request)) ??
        response404.clone();
    }
  }

  // 静的ファイルを配信
  // キャッシュする
  if (cache[request.url]) {
    return cache[request.url]!.clone();
  }
  const response = await serveDirWithTs(request);
  if (response.ok) {
    cache[request.url] = response.clone();
  }
  return response;
};

if (import.meta.main) {
  serve(handler);
}
