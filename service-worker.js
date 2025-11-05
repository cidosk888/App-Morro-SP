self.addEventListener("install", (e) => {
  console.log("Service Worker instalado - App Morro SP");
  self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  // Cache opcional (pode melhorar depois)
});