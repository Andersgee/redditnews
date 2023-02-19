/*
self.addEventListener("install", (event) => {
    console.log("hello from sw")
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
    
    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
});
*/

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  // First try to get the resource from the cache
  const responseFromCache = await caches.match(request);
  if (responseFromCache) {
    return responseFromCache;
  }

  // Next try to use the preloaded response, if it's there
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    putInCache(request, preloadResponse.clone());
    return preloadResponse;
  }

  // Next try to get the resource from the network
  try {
    const responseFromNetwork = await fetch(request);
    // response may be used only once
    // we need to save clone to put one copy in cache
    // and serve second one
    putInCache(request, responseFromNetwork.clone());
    return responseFromNetwork;
  } catch (error) {
    const fallbackResponse = await caches.match(fallbackUrl);
    if (fallbackResponse) {
      return fallbackResponse;
    }
    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};
/*
const enableNavigationPreload = async () => {
  if (self.registration.navigationPreload) {
    // Enable navigation preloads!
    await self.registration.navigationPreload.enable();
  }
};

self.addEventListener("activate", (event) => {
  event.waitUntil(enableNavigationPreload());
});
*/

self.addEventListener("install", (event) => {
  const files = [
    "./",
    "./_next/static/css/b0a7c091386eb3b5.css",
    "./_next/static/chunks/webpack-ee7e63bc15b31913.js",
    "./_next/static/chunks/framework-581f102fc68ef277.js",
    "./_next/static/chunks/main-cd1bc1aa6e2c8646.js",
    "./_next/static/chunks/pages/_app-bc418f9516849d8a.js",
    "./_next/static/chunks/pages/index-e4cfbaf82d203ad8.js",
    "./_next/static/j_xlN4-HGUrPIWpqd712n/_buildManifest.js",
    "./_next/static/j_xlN4-HGUrPIWpqd712n/_ssgManifest.js",
    //"./manifest.json",
    "./icons/favicon.svg",
    "./js/script.js",
    "./icons/favicon.svg",
  ];
  event.waitUntil(
    addResourcesToCache([
      "./",
      "./index.html",
      "./style.css",
      "./app.js",
      "./image-list.js",
      "./star-wars-logo.jpg",
      "./gallery/bountyHunters.jpg",
      "./gallery/myLittleVader.jpg",
      "./gallery/snowTroopers.jpg",
    ]),
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "./gallery/myLittleVader.jpg",
    }),
  );
});
