import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";
import {
  assertSpyCallArg,
  assertSpyCalls,
  stub,
} from "https://deno.land/std@0.152.0/testing/mock.ts";

import { handler } from "./serve.ts";

Deno.test({
  name: "server - index",
  async fn() {
    const res = await handler(new Request("https://favi.deno.dev/"));
    assertEquals(res.headers.get("Content-Type"), "text/html; charset=UTF-8");
    assert((await res.text()).includes(`<html lang="ja">`));
  },
});

Deno.test({
  name: "server - twitter_card.png",
  async fn() {
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(new Response("hello!")),
    );

    try {
      const res = await handler(
        new Request("https://favi.deno.dev/twitter_card.png"),
      );
      assertEquals(await res.text(), "hello!");

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://favi.deno.dev/📈.png",
      );

      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  },
});

Deno.test({
  name: "server - api",
  async fn() {
    const res = await handler(
      new Request("https://favi.deno.dev/manifest.json"),
    );
    assertEquals(res.headers.get("Content-Type"), "application/json");
    assert((await res.json()).name, "都道府県総人口グラフ");
  },
});

Deno.test({
  name: "server - worker file",
  async fn() {
    const res = await handler(
      new Request("https://favi.deno.dev/service_worker.js"),
    );
    assertEquals(
      res.headers.get("Content-Type"),
      "application/javascript; charset=UTF-8",
    );
    assert((await res.text()).includes(`addEventListener("fetch"`));
  },
});

Deno.test({
  name: "server - static file",
  async fn() {
    const res = await handler(
      new Request("https://favi.deno.dev/assets/style.css"),
    );
    assertEquals(res.headers.get("Content-Type"), "text/css; charset=UTF-8");
    assert((await res.text()).includes(`cursor: pointer;`));
  },
});
