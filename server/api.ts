import type { Population, Prefectures } from "../types.ts";
const RESAS_API_KEY = Deno.env.get("RESAS_API_KEY")!;

const PREFECTURES_URL =
  "https://opendata.resas-portal.go.jp/api/v1/prefectures";
const POPULATION_URL =
  "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=";

// 都道府県APIのレスポンスをキャッシュする
// NOTE: avoid Top-Level-Await!!!
const prefectures: Promise<Prefectures> = (async () => {
  const res = await fetch(PREFECTURES_URL, {
    headers: {
      "X-API-KEY": RESAS_API_KEY,
    },
  });
  return (await res.json()).result;
})();

// 人口APIのレスポンスをキャッシュする
const populationCache: Record<string, Promise<Population>> = {};

/** 都道府県APIの設定 */
export const prefecturesApi = {
  pattern: new URLPattern({ pathname: "/api/prefectures" }),
  async route(): Promise<Response | undefined> {
    return Response.json(await prefectures);
  },
};

/** 人口APIの設定 */
export const populationApi = {
  pattern: new URLPattern({ pathname: "/api/population/:prefCode" }),
  async route(
    _url: URL,
    { pathname: { groups: { prefCode } } }: URLPatternResult,
  ): Promise<Response | undefined> {
    populationCache[prefCode] ??= getPopulation(prefCode);
    return Response.json(await populationCache[prefCode]);
  },
};

/** 人口APIを呼び出す */
async function getPopulation(prefCode: string) {
  const res = await fetch(`${POPULATION_URL}${prefCode}`, {
    headers: {
      "X-API-KEY": RESAS_API_KEY,
    },
  });
  return (await res.json()).result.data
    .find((v: Record<string, string>) => v.label === "総人口").data;
}
