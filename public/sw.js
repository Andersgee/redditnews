self.addEventListener("install", (event) => {
    console.log("hello from sw")
    // The promise that skipWaiting() returns can be safely ignored.
    self.skipWaiting();
    
    // Perform any other actions required for your
    // service worker to install, potentially inside
    // of event.waitUntil();
});