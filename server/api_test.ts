import {
  assert,
  assertEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";
import { stub } from "https://deno.land/std@0.152.0/testing/mock.ts";

Deno.test({
  name: "prefecturesApi",
  async fn() {
    const fetchMockValue = "__TEST_FETCH_MOCK__";
    const fetchSpy = stub(
      globalThis,
      "fetch",
      () => Promise.resolve(Response.json({ result: fetchMockValue })),
    );
    try {
      const { prefecturesApi } = await import("./api.ts");
      assert(prefecturesApi.pattern.test("http://foo.com/api/prefectures"));
      const res = await prefecturesApi.route();
      assertEquals(await res!.json(), fetchMockValue);
    } finally {
      fetchSpy.restore();
    }
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "populationApi",
  async fn() {
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
      const { populationApi } = await import("./api.ts");

      assertEquals(
        populationApi.pattern
          .exec("http://foo.com/api/population/11")!.pathname.groups.prefCode,
        "11",
      );
      const res = await populationApi.route(new URL("https://foo.com/"), {
        // @ts-ignore: for test
        pathname: { groups: { prefCode: "1" } },
      });
      assertEquals(await res!.json(), fetchMockValue);
    } finally {
      fetchSpy.restore();
    }
  },
});
