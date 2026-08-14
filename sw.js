const VERSION="savewise-v19";
const CORE=["./","./index.html","./manifest.webmanifest","./icon.svg","./icon-192.png","./icon-512.png"];
self.addEventListener("install",event=>{
  event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));
});
self.addEventListener("activate",event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("savewise-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener("fetch",event=>{
  const req=event.request;
  if(req.method!=="GET")return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return;
  // Network-first for HTML so deployments update immediately; cache fallback for offline use.
  if(req.mode==="navigate" || url.pathname.endsWith("/index.html") || url.pathname.endsWith("/")) {
    event.respondWith(fetch(req,{cache:"no-store"}).then(res=>{
      const copy=res.clone(); caches.open(VERSION).then(c=>c.put(req,copy)); return res;
    }).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));
    return;
  }
  event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{
    const copy=res.clone(); caches.open(VERSION).then(c=>c.put(req,copy)); return res;
  })));
});
