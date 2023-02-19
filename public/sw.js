/*
note to self:
This service worker is the bare minimum I made for the website to be considered a pwa,
meaning it passes lighthouse pwa test and triggers install prompt.

references:
https://web.dev/learn/pwa/installation/#installation-criteria
https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers
https://developer.mozilla.org/en-US/docs/Web/API/FetchEvent/preloadResponse#examples
*/

self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      const response = await event.preloadResponse;
      if (response) return response;
      return fetch(event.request);
    })(),
  );
});
