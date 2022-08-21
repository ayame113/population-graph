// @ts-check
/// <reference no-default-lib="true"/>
/// <reference lib="esnext" />
/// <reference lib="WebWorker" />
const sw =
  /** @type {ServiceWorkerGlobalScope & typeof globalThis} */ (globalThis);

const EXCLUDE_CACHE = new Set(["/service_worker.js"]);
const FOURCE_CACHE = ["/"];
const CACHE_KEY = location.href;
const cachePromise = caches.open(CACHE_KEY);
const isDevelop = location.hostname === "localhost";

// service workerをインストール
sw.addEventListener("install", (e) => {
  e.waitUntil((async () => {
    if (isDevelop) {
      console.log(
        `📈[[[install]]] (isDevelop: ${isDevelop}, version: "${location.search}")`,
      );
    }

    await sw.skipWaiting();
    const cache = await cachePromise;
    await cache.addAll(FOURCE_CACHE);
  })());
});

sw.addEventListener("activate", (e) => {
  if (isDevelop) {
    console.log(`📈[[[activate]]]`);
  }

  e.waitUntil((async () => {
    await sw.clients.claim();
    // 古いservice workerによってキャッシュされたデータを削除
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => key !== CACHE_KEY && caches.delete(key)),
    );
  })());
});

sw.addEventListener("fetch", (e) => {
  e.respondWith((async () => {
    const cache = await cachePromise;

    const cacheResponse = await cache.match(e.request);

    if (cacheResponse && !isDevelop) {
      // キャッシュが存在する場合、キャッシュからレスポンスを返す。
      // レスポンスを返した後に、キャッシュを更新する。
      queueMicrotask(() => {
        if (navigator.onLine) {
          cache.add(e.request);
        }
      });
      return cacheResponse;
    }

    // キャッシュが無い場合は、ネットワークからのレスポンスを返す。
    const fetchResponse = await fetch(e.request);
    if (shouldCache(fetchResponse)) {
      cache.put(e.request, fetchResponse.clone());
    }
    return fetchResponse;
  })());
});

/**
 * レスポンスをキャッシュしてよいかどうか
 * @param  {Response} response
 */
function shouldCache(response) {
  if (!response.ok) {
    return false;
  }
  if (EXCLUDE_CACHE.has(new URL(response.url).pathname)) {
    return false;
  }
  return true;
}
