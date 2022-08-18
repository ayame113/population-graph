import type { Population, Prefectures } from "../types.ts";
const RESAS_API_KEY = Deno.env.get("RESAS_API_KEY")!;

const PREFECTURES_URL =
  "https://opendata.resas-portal.go.jp/api/v1/prefectures";
const POPULATION_URL =
  "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=";

/** 都道府県APIの設定 */
export const prefecturesApi = {
  pattern: new URLPattern({ pathname: "/api/prefectures" }),
  async route(): Promise<Response | undefined> {
    return Response.json(await getPrefectures());
  },
};

/** 人口APIの設定 */
export const populationApi = {
  pattern: new URLPattern({ pathname: "/api/population/:prefCode" }),
  async route(
    _url: URL,
    { pathname: { groups: { prefCode } } }: URLPatternResult,
  ): Promise<Response | undefined> {
    return Response.json(await getPopulation(prefCode));
  },
};

// 人口APIのレスポンスをキャッシュする
const populationCache: Record<string, Promise<Population> | undefined> = {};
/** 人口APIを呼び出す */
function getPopulation(prefCode: string): Promise<Population> {
  if (populationCache[prefCode]) {
    return populationCache[prefCode]!;
  }

  return populationCache[prefCode] = (async () => {
    const res = await fetch(`${POPULATION_URL}${prefCode}`, {
      headers: { "X-API-KEY": RESAS_API_KEY },
    });

    // エラー時はキャッシュしない
    if (!res.ok) {
      console.error("failed to fetch API", res);
      throw new Error("failed to fetch API");
    }

    return (await res.json()).result.data
      .find((v: Record<string, string>) => v.label === "総人口").data;
  })();
}

// 都道府県APIのレスポンスをキャッシュする
let prefecturesCache: Promise<Prefectures> | undefined;
/** 都道府県APIを呼び出す */
function getPrefectures(): Promise<Prefectures> {
  if (prefecturesCache) {
    return prefecturesCache;
  }

  return prefecturesCache = (async () => {
    const res = await fetch(PREFECTURES_URL, {
      headers: { "X-API-KEY": RESAS_API_KEY },
    });

    // エラー時はキャッシュしない
    if (!res.ok) {
      console.error("failed to fetch API", res);
      throw new Error("failed to fetch API");
    }

    return (await res.json()).result;
  })();
}
// 初回実行時に強制的にAPIを呼び出し、キャッシュする
getPrefectures().catch(console.error);
