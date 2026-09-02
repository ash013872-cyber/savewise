const VERSION="savewise-v27";
const CORE=["./","./index.html?v=27","./manifest.webmanifest?v=27","./icon.svg?v=27","./icon-192.png?v=27","./icon-512.png?v=27","./fix.js?v=25","./navigation-fix-v26.js?v=26","./runtime-v27.js?v=27"];
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
    let injected=text;
    if(!injected.includes("fix.js?v=25"))injected=injected.replace(/<\/body>/i,'<script src="./fix.js?v=25"></script></body>');
    if(!injected.includes("navigation-fix-v26.js"))injected=injected.replace(/<\/body>/i,'<script src="./navigation-fix-v26.js?v=26"></script><script src="./runtime-v27.js?v=27"></script></body>');
    else if(!injected.includes("runtime-v27.js"))injected=injected.replace(/<\/body>/i,'<script src="./runtime-v27.js?v=27"></script></body>');
    const headers=new Headers(res.headers);headers.set("cache-control","no-store");
    const out=new Response(injected,{status:res.status,statusText:res.statusText,headers});
    caches.open(VERSION).then(c=>c.put(req,out.clone())).catch(()=>{});return out;
   }
   const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});return res;
  }).catch(()=>caches.match(req).then(r=>r||caches.match("./index.html"))));return;
 }
 event.respondWith(caches.match(req).then(cached=>cached||fetch(req).then(res=>{const copy=res.clone();caches.open(VERSION).then(c=>c.put(req,copy)).catch(()=>{});return res})));
});
