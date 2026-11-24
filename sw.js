/* Balcãs 2027 · service worker: deixa o portal abrir sem internet.
   Estratégia: rede primeiro (sempre a versão nova quando há sinal), cache como reserva. Só mexe em arquivos do próprio site e no SDK do Firebase.
   Nunca intercepta Firestore, login, mapas ou qualquer outra requisição. Gerado por mk-sw.py. */
const V='v161',CACHE='balcas-'+V,SDK='balcas-sdk',FILES=["atr.css", "atualizar.html", "backup.js", "ckstore.js", "clima.html", "compras.html", "costumes.html", "diario.html", "diario.js", "dias.js", "dirigir.html", "dossie.html", "dubrovnik.html", "fb.js", "gastos.css", "gastos.html", "gastos.js", "h2c.min.js", "hoje.html", "hospedagem.html", "imperdiveis.html", "index.html", "jantar.html", "jspdf.min.js", "kotor.html", "leaflet.css", "leaflet.js", "livro.html", "ljubljana.html", "locacao.html", "locacao.js", "lugares.js", "mala.html", "nav.js", "orcamento.html", "passeios.html", "pendencias.html", "plitvice.html", "rastoke.html", "seguranca.html", "sibenik.html", "sos.html", "split.html", "temas.css", "trieste.html", "voos.html", "zagreb-final.html", "zagreb.html", "manifest.webmanifest", "icon-180.png", "icon-192.png", "icon-512.png"];
const WAIT=7000;

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await Promise.all(['./'].concat(FILES).map(async f=>{try{const r=await fetch(f,{cache:'reload'});if(r&&r.ok)await c.put(f,r)}catch(x){}}));
    await self.skipWaiting();
  })());
});
self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    for(const k of await caches.keys())if(k.startsWith('balcas-')&&k!==CACHE&&k!==SDK)await caches.delete(k);
    await self.clients.claim();
  })());
});

async function fromCache(req){
  const c=await caches.open(CACHE);
  return (await c.match(req))||(await c.match(req,{ignoreSearch:true}))||null;
}
async function netFirst(e){
  const req=e.request;
  const net=fetch(req).then(async r=>{
    if(r&&r.ok){try{(await caches.open(CACHE)).put(req,r.clone())}catch(x){}}
    return r;
  });
  net.catch(()=>{});
  const cached=await fromCache(req);
  if(!cached)return net;                       /* nada guardado: espera a rede */
  const timer=new Promise(res=>setTimeout(()=>res(null),WAIT));
  try{const r=await Promise.race([net,timer]);if(r)return r}catch(x){}
  e.waitUntil(net.catch(()=>{}));              /* rede lenta: usa o cache e deixa a rede atualizar ao fundo */
  return cached;
}
async function sdk(req){
  const c=await caches.open(SDK),hit=await c.match(req);
  if(hit)return hit;
  const r=await fetch(req);
  if(r&&(r.ok||r.type==='opaque')){try{c.put(req,r.clone())}catch(x){}}
  return r;
}
self.addEventListener('fetch',e=>{
  const req=e.request;
  if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    if(u.pathname.endsWith('/sw.js'))return;
    e.respondWith(netFirst(e).catch(async()=>{
      const c=await fromCache(req);if(c)return c;
      if(req.mode==='navigate'){const i=await fromCache('./');if(i)return i}
      return Response.error();
    }));
  }else if(u.hostname==='www.gstatic.com'&&u.pathname.indexOf('/firebasejs/')===0){
    e.respondWith(sdk(req));
  }
});
