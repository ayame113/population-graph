import "https://deno.land/std@0.152.0/dotenv/load.ts";
import {
  serve,
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.152.0/http/mod.ts";
import { contentType } from "https://deno.land/std@0.152.0/media_types/mod.ts";
import {
  fourceInstantiateWasm,
  serveDirWithTs,
} from "https://deno.land/x/ts_serve@v1.4.0/mod.ts";

import type { Routing } from "./server/types.ts";
import { init, populationApi, prefecturesApi } from "./server/api.ts";
import { renderToString } from "./components/Page.tsx";

fourceInstantiateWasm();
const routing: Routing[] = [prefecturesApi, populationApi];
const response404 = new Response(STATUS_TEXT[Status.NotFound], {
  status: Status.NotFound,
});

const html = renderToString();
const htmlContentType = contentType("html");

init();

const cache: Record<string, Response | undefined> = {};

serve(async (request) => {
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

  // APIへのリクエストを受信
  for (const { pattern, route } of routing) {
    const match = pattern.exec(url);
    if (match) {
      return (await route(url, match, request)) ??
        response404.clone();
    }
  }

  // 静的ファイルを配信
  // キャッシュ
  if (cache[request.url]) {
    return cache[request.url]!.clone();
  }
  const response = await serveDirWithTs(request);
  cache[request.url] = response.clone();
  return response;
});
