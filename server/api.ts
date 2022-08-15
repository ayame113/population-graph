import "https://deno.land/std@0.152.0/dotenv/load.ts";

import type { Population } from "../types.ts";
const RESAS_API_KEY = Deno.env.get("RESAS_API_KEY")!;

const prefectures = (async () => {
  const res = await fetch(
    "https://opendata.resas-portal.go.jp/api/v1/prefectures",
    {
      headers: {
        "X-API-KEY": RESAS_API_KEY,
      },
    },
  );
  return (await res.json()).result;
})();

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

async function getPopulation(prefCode: string) {
  const res = await fetch(
    `https://opendata.resas-portal.go.jp/api/v1/population/composition/perYear?cityCode=-&prefCode=${prefCode}`,
    {
      headers: {
        "X-API-KEY": RESAS_API_KEY,
      },
    },
  );
  return (await res.json()).result.data
    .find((v: Record<string, string>) => v.label === "総人口").data;
}
