/* Balcãs 2027 · check-ins (diário da viagem): lista local + sincronização opcional com o Firebase (coleção "checkins"). */
(function(){
var KEY='balcas2027-checkins-v1',L=[],subs=[],unsub=null,fbUser=null,started=false;
var state={err:'',online:false};
function load(){try{var a=JSON.parse(localStorage.getItem(KEY)||'[]');L=Array.isArray(a)?a:[]}catch(e){L=[]}}
function persist(){var s;try{s=JSON.stringify(L);localStorage.setItem(KEY,s);return}catch(e){}
  try{localStorage.setItem(KEY,JSON.stringify(L.map(function(c){var o={};for(var k in c)o[k]=c[k];if(o.photo){o.photo=null;o.hasPhoto=true}return o})))}catch(e2){}}
function emit(){subs.forEach(function(f){try{f(L)}catch(e){}})}
function uid(){return 'c'+Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
function eb(code){state.err=code||'error';emit()}
function clean(c){var o={};for(var k in c)if(c[k]!==undefined)o[k]=c[k];delete o.synced;return o}
function push(c){if(window.FB&&FB.user)FB.set('checkins/'+c.id,clean(c),false,eb)}
function mergeRemote(rem,meta){
  var rm={};rem.forEach(function(r){if(r&&r.id)rm[r.id]=r});
  var out=[],seen={};
  L.forEach(function(l){var r=rm[l.id];
    if(r){seen[l.id]=1;var keep=(l.upd||0)>(r.upd||0)?l:r;if(keep===l&&l.upd!==r.upd)push(l);var o=clean(keep);if(!o.photo&&l.photo&&keep!==l)o.photo=l.photo;o.synced=true;out.push(o)}
    else if(l.synced&&meta&&meta.fromCache===false){/* apagado em outro aparelho */}
    else{out.push(l);if(!l.synced)push(l)}});
  Object.keys(rm).forEach(function(id){if(!seen[id]){var o=clean(rm[id]);o.synced=true;out.push(o)}});
  L=out;persist();emit()}
function start(){
  if(started||!window.FB)return;started=true;
  FB.onAuth(function(u){fbUser=u;if(unsub){try{unsub()}catch(e){}unsub=null}
    state.err='';state.online=!!u;
    if(u)unsub=FB.watchCol('gx-chk','checkins',mergeRemote,eb);
    emit()})}
load();
if(window.FB)start();else document.addEventListener('fb-ready',start);
window.CK={
  uid:uid,
  list:function(){return L.slice().sort(function(a,b){return a.ts<b.ts?1:a.ts>b.ts?-1:0})},
  get:function(id){return L.filter(function(c){return c.id===id})[0]||null},
  add:function(c){c.id=c.id||uid();c.upd=Date.now();c.by=c.by||(fbUser&&(fbUser.name||fbUser.email))||'';L.push(c);persist();push(c);emit();return c},
  update:function(c){c.upd=Date.now();var i=L.findIndex(function(x){return x.id===c.id});if(i<0)L.push(c);else L[i]=c;persist();push(c);emit();return c},
  remove:function(id){L=L.filter(function(c){return c.id!==id});persist();if(window.FB&&FB.user)FB.del('checkins/'+id,eb);emit()},
  onChange:function(f){subs.push(f);return function(){subs=subs.filter(function(x){return x!==f})}},
  state:state
};
})();

/* link do álbum de fotos (iCloud/Google Fotos): guardado no aparelho e sincronizado em data/album */
(function(){
var KEY='balcas2027-album',subs=[],unsub=null,started=false,url='';
try{url=localStorage.getItem(KEY)||''}catch(e){}
function emit(){subs.forEach(function(f){try{f(url)}catch(e){}})}
function ok(u){return /^https?:\/\/\S+$/i.test(u||'')}
function start(){if(started||!window.FB)return;started=true;
 FB.onAuth(function(u){if(unsub){try{unsub()}catch(e){}unsub=null}
  if(u)unsub=FB.watchDoc('gx-alb','data/album',function(d){var r=d&&d.url||'';if(r&&r!==url&&ok(r)){url=r;try{localStorage.setItem(KEY,r)}catch(e){}emit()}},function(){})})}
if(window.FB)start();else document.addEventListener('fb-ready',start);
window.ALB={get:function(){return url},valid:ok,
 set:function(u){u=(u||'').trim();if(u&&!ok(u))return false;url=u;try{if(u)localStorage.setItem(KEY,u);else localStorage.removeItem(KEY)}catch(e){}
  if(window.FB&&FB.user)FB.set('data/album',{url:u,ts:Date.now()},true,function(){});emit();return true},
 onChange:function(f){subs.push(f)}};
})();
