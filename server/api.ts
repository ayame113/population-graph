import type { Population, Prefectures } from "../types.ts";
const RESAS_API_KEY = Deno.env.get("RESAS_API_KEY")!;

const PREFECTURES_URL =
  "https://opendata.resas-portal.go.jp/api/v1/prefectures";
const POPULATION_URL =
  "https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=";

// cache prefectures API result
// NOTE: avoid Top-Level-Await!!!
const prefectures: Promise<Prefectures> = (async () => {
  const res = await fetch(PREFECTURES_URL, {
    headers: {
      "X-API-KEY": RESAS_API_KEY,
    },
  });
  return (await res.json()).result;
})();

// cache population API result
const populationCache: Record<string, Promise<Population>> = {};

export const prefecturesApi = {
  pattern: new URLPattern({ pathname: "/api/prefectures" }),
  async route(): Promise<Response | undefined> {
    return Response.json(await prefectures);
  },
};

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

/** call population API */
async function getPopulation(prefCode: string) {
  const res = await fetch(`${POPULATION_URL}${prefCode}`, {
    headers: {
      "X-API-KEY": RESAS_API_KEY,
    },
  });
  return (await res.json()).result.data
    .find((v: Record<string, string>) => v.label === "総人口").data;
}
