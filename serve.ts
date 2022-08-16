import "https://deno.land/std@0.152.0/dotenv/load.ts";
import {
  serve,
  Status,
  STATUS_TEXT,
} from "https://deno.land/std@0.152.0/http/mod.ts";
import { serveFile } from "https://deno.land/std@0.152.0/http/file_server.ts";
import { serveDirWithTs } from "https://deno.land/x/ts_serve@v1.3.0/mod.ts";

import type { Routing } from "./types.ts";
import { populationApi, prefecturesApi } from "./server/api.ts";

const routing: Routing[] = [prefecturesApi, populationApi];
const response404 = new Response(STATUS_TEXT[Status.NotFound], {
  status: Status.NotFound,
});

serve(async (request) => {
  const url = new URL(request.url);
  if (url.pathname === "/") {
    return serveFile(request, "./index.html");
  }
  for (const { pattern, route } of routing) {
    const match = pattern.exec(url);
    if (match) {
      return (await route(url, match, request)) ??
        response404.clone();
    }
  }
  return serveDirWithTs(request);
});
