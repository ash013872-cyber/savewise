const VERSION="savewise-v24";
const CORE=["./","./index.html?v=24","./manifest.webmanifest?v=24","./icon.svg?v=24","./icon-192.png?v=24","./icon-512.png?v=24","./fix.js?v=24"];
self.addEventListener("install",event=>{event.waitUntil(caches.open(VERSION).then(cache=>cache.addAll(CORE)).then(()=>self.skipWaiting()));});
self.addEventListener("activate",event=>{event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k.startsWith("savewise-")&&k!==VERSION).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));});
self.addEventListener("fetch",event=>{
 const req=event.request;if(req.method!=="GET")return;
 const url=new URL(req.url);if(url.origin!==self.location.origin)return;
 if(req.mode==="navigate"||url.pathname.endsWith("/index.html")||url.pathname.endsWith("/")){
  event.respondWith(fetch(new Request(req,{cache:"no-store"})).then(async res=>{
   if(!res||!res.ok)return res;
   const type=res.headers.get("content-type")||"";
   if(type.includes("text/html")){
    const text=await res.text();
    const injected=text.includes("fix.js?v=24")?text:text.replace(/<\/body>/i,'<script src="./fix.js?v=24"></script></body>');
    const headers=new Headers(res.headers);headers.set("cache-control","no-store");
    const out=new Response(injected,{status:res.status,statusText:res.statusText,headers});
    caches.open(VERSION).then(c=>c.put(req,out.clone())).catch(()=>{});return out;
   }
   const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});return res;
  }).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});return res})));
});
