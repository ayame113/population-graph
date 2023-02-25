import {
  assert,
  assertEquals,
  assertRejects,
} from "https://deno.land/std@0.178.0/testing/asserts.ts";
import {
  assertSpyCallArg,
  assertSpyCalls,
  stub,
} from "https://deno.land/std@0.178.0/testing/mock.ts";

import { init, populationApi, prefecturesApi } from "./api.ts";

Deno.test(async function prefecturesApiTest(t) {
  await t.step("pattern", () => {
    assert(prefecturesApi.pattern.test("http://foo.com/api/prefectures"));
  });

  await t.step("response error", async () => {
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(Response.error()),
    );

    try {
      await assertRejects(async () => {
        await prefecturesApi.route();
      }, "failed to fetch API");

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      );

      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  });

  // エラーのレスポンスがキャッシュされていないことを確認します。
  await t.step("response ok", async () => {
    const fetchMockValue = "__TEST_FETCH_MOCK__";
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(Response.json({ result: fetchMockValue })),
    );
    try {
      const res1 = await prefecturesApi.route();
      const res2 = await prefecturesApi.route();
      assertEquals(await res1!.json(), fetchMockValue);
      assertEquals(await res2!.json(), fetchMockValue);

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      );

      // routeを複数回呼び出しても、結果がキャッシュされているのでfetchの呼び出し回数は1回
      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  });

  await t.step("init", async () => {
    const fetchMockValue = "__TEST_FETCH_MOCK__";
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(Response.json({ result: fetchMockValue })),
    );
    try {
      await init();

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://opendata.resas-portal.go.jp/api/v1/prefectures",
      );

      // routeを複数回呼び出しても、結果がキャッシュされているのでfetchの呼び出し回数は1回
      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  });
});

Deno.test(async function populationApiTest(t) {
  await t.step("pattern", () => {
    assertEquals(
      populationApi.pattern
        .exec("http://foo.com/api/population/11")!.pathname.groups.prefCode,
      "11",
    );
  });

  await t.step("response error", async () => {
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(Response.error()),
    );
    try {
      await assertRejects(async () => {
        await populationApi.route(new URL("https://foo.com/"), {
          // @ts-expect-error: for test
          pathname: { groups: { prefCode: "1" } },
        });
      });

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=1",
      );

      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  });

  // エラーのレスポンスがキャッシュされていないことを確認します。
  await t.step("response error", async () => {
    const fetchMockValue = "__TEST_FETCH_MOCK__";
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () =>
        Promise.resolve(
          Response.json({
            result: { data: [{ label: "総人口", data: fetchMockValue }] },
          }),
        ),
    );
    try {
      const res1 = await populationApi.route(new URL("https://foo.com/"), {
        // @ts-expect-error: for test
        pathname: { groups: { prefCode: "1" } },
      });
      const res2 = await populationApi.route(new URL("https://foo.com/"), {
        // @ts-expect-error: for test
        pathname: { groups: { prefCode: "1" } },
      });
      assertEquals(await res1!.json(), fetchMockValue);
      assertEquals(await res2!.json(), fetchMockValue);

      assertSpyCallArg(
        fetchSpy,
        0,
        0,
        "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=1",
      );

      // routeを複数回呼び出しても、結果がキャッシュされているのでfetchの呼び出し回数は1回
      assertSpyCalls(fetchSpy, 1);
    } finally {
      fetchSpy.restore();
    }
  });
});
