import {
  assert,
  assertArrayIncludes,
  assertEquals,
} from "https://deno.land/std@0.152.0/testing/asserts.ts";

import { populationApi, prefecturesApi } from "./api.ts";

Deno.test({
  name: "prefecturesApi",
  async fn() {
    assert(prefecturesApi.pattern.test("http://foo.com/api/prefectures"));
    const res = await (await prefecturesApi.route())!.json();
    assertArrayIncludes(res, [{ "prefCode": 1, "prefName": "北海道" }]);
  },
  sanitizeResources: false,
  sanitizeOps: false,
});

Deno.test({
  name: "populationApi",
  fn() {
    const {
      pathname: { groups: { prefCode } },
    } = populationApi.pattern.exec("http://foo.com/api/population/11")!;
    assertEquals(prefCode, "11");
  },
});
