import "https://deno.land/std@0.152.0/dotenv/load.ts";
import {
  serve,
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.152.0/http/mod.ts";
import { contentType } from "https://deno.land/std@0.152.0/media_types/mod.ts";
import { serveDirWithTs } from "https://deno.land/x/ts_serve@v1.3.0/mod.ts";

import type { Routing } from "./server/types.ts";
import { init, populationApi, prefecturesApi } from "./server/api.ts";
import { renderToString } from "./components/Page.tsx";

const routing: Routing[] = [prefecturesApi, populationApi];
const response404 = new Response(STATUS_TEXT[Status.NotFound], {
  status: Status.NotFound,
});

const html = renderToString();
const htmlContentType = contentType("html");

init();

serve(async (request) => {
  // index.htmlのレスポンス
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return new Response(html, {
      headers: { "Content-Type": htmlContentType },
    });
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
  return serveDirWithTs(request);
});
