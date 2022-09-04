export const DEPLOYMENT_ID = Deno.env.get("DENO_DEPLOYMENT_ID") ??
  crypto.randomUUID();
export const TITLE = "都道府県総人口グラフ";
export const DESCRIPTION = "都道府県の人口グラフ。";
export const TOP_PAGE = "https://popl.deno.dev";
// Copyright 2018 Twitter, Inc and other contributors. Graphics licensed under CC-BY 4.0: https://creativecommons.org/licenses/by/4.0/
export const FAVICON_URL = "https://favi.deno.dev/📈.png";
export const THEME_COLOR = "#f32091";
