// Trying to make the bare minimum for prompting as installable app
// without actually using any caching or intercepting requests etc
// is this all that is required?
// answer: nope. (the worker is stopped since there are no actual even listeners I believe)
/*
self.addEventListener("install", (event) => {
  self.skipWaiting();
});
*/

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

const handleRequestNormally = async ({ request, preloadResponsePromise }) => {
  const preloadResponse = await preloadResponsePromise;
  if (preloadResponse) {
    console.info("using preload response", preloadResponse);
    return preloadResponse;
  }

  try {
    const responseFromNetwork = await fetch(request);
    return responseFromNetwork;
  } catch (error) {
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};

self.addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequestNormally({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
    }),
  );
});

/*
self.addEventListener("fetch", (event) => {
  event.respondWith(
    cacheFirst({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
      fallbackUrl: "./gallery/myLittleVader.jpg",
    }),
  );
});

const addResourcesToCache = async (resources) => {
  const cache = await caches.open("v1");
  await cache.addAll(resources);
};

const putInCache = async (request, response) => {
  const cache = await caches.open("v1");
  await cache.put(request, response);
};

const cacheFirst = async ({ request, preloadResponsePromise, fallbackUrl }) => {
  //dont do anything special
  if (request.method !== "GET" || request.url !== "/") {
    return await fetch(request);
  }

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
    //const fallbackResponse = await caches.match(fallbackUrl);
    //if (fallbackResponse) {
    //  return fallbackResponse;
    //}

    // when even the fallback response is not available,
    // there is nothing we can do, but we must always
    // return a Response object
    return new Response("Network error happened", {
      status: 408,
      headers: { "Content-Type": "text/plain" },
    });
  }
};



self.addEventListener("install", (event) => {
  event.waitUntil(addResourcesToCache(["./"]));
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    handleRequestNormally({
      request: event.request,
      preloadResponsePromise: event.preloadResponse,
    }),
  );
});
*/
