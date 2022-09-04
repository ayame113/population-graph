import { DESCRIPTION, FAVICON_URL, THEME_COLOR, TITLE } from "./metadata.ts";

/** 都道府県APIの設定 */
export const manifestJson = {
  pattern: new URLPattern({ pathname: "/manifest.json" }),
  route() {
    return Response.json({
      name: TITLE,
      short_name: TITLE,
      description: DESCRIPTION,
      display: "minimal-ui",
      icons: [{
        src: FAVICON_URL,
        sizes: "512x512",
        type: "image/png",
        purpose: "any maskable",
      }],
      start_url: "/",
      theme_color: THEME_COLOR,
      background_color: "#fdf5e6",
    }, {
      headers: {
        "cache-control": "public, max-age=31536000",
      },
    });
  },
};
