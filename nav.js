(function(){
var S;try{S=window.sessionStorage}catch(e){}
function g(k){try{return S.getItem(k)}catch(e){return null}}
function s(k,v){try{S.setItem(k,v)}catch(e){}}
function norm(p){return p.replace(/index\.html$/,'')}
var here=norm(location.pathname);
try{history.scrollRestoration='manual'}catch(e){}
var nav=(performance.getEntriesByType&&performance.getEntriesByType('navigation')[0])||{};
var type=nav.type||'navigate';
var stack=[];try{stack=JSON.parse(g('bk-stack')||'[]')}catch(e){}
function saveStack(){s('bk-stack',JSON.stringify(stack))}

var viaBack=g('bk-restore')===here;
if(viaBack){s('bk-restore','');s('bk-from','')}
else if(type==='back_forward'){while(stack.length&&stack[stack.length-1]===here)stack.pop();saveStack()}
else if(type==='navigate'){var from=g('bk-from');if(from&&from!==here){stack.push(from);saveStack()}s('bk-from','')}

function restore(){var y=parseInt(g('pos:'+here)||'0',10);if(y>0)window.scrollTo(0,y)}
if(viaBack||type==='back_forward'){
  restore();
  document.addEventListener('DOMContentLoaded',restore);
  window.addEventListener('load',restore);
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(restore);
  setTimeout(restore,250);setTimeout(restore,700);
}
function leave(){s('pos:'+here,String(Math.round(window.pageYOffset)));s('bk-from',here)}
window.addEventListener('pagehide',leave);
document.addEventListener('visibilitychange',function(){if(document.visibilityState==='hidden')leave()});

function goBack(){
  var t=stack.pop();saveStack();
  leave();
  if(!t){location.href='index.html';return}
  s('bk-restore',t);location.href=t;
}
document.querySelectorAll('[data-back]').forEach(function(b){b.addEventListener('click',goBack)});

document.addEventListener('click',function(e){
  var a=e.target.closest&&e.target.closest('a[href]');
  if(!a||!a.hash||e.defaultPrevented||a.target==='_blank')return;
  if(a.href.split('#')[0]!==location.href.split('#')[0])return;
  e.preventDefault();
  if(a.hash==='#top'){window.scrollTo(0,0)}
  else{var el=document.getElementById(decodeURIComponent(a.hash.slice(1)));if(el)el.scrollIntoView()}
});
})();


/* Menu lateral (hambúrguer): único lugar com os links de planejamento */
(function(){
var ITEMS=[
 ['','＋ Lançar gasto','gastos.html#top','act'],
 ['','Início','index.html'],
 ['Etapas','1 · Zagreb','zagreb.html'],['','2 · Ljubljana','ljubljana.html'],['','↳ Trieste','trieste.html'],['','3 · Plitvice','plitvice.html'],['','4 · Split','split.html'],['','5 · Dubrovnik','dubrovnik.html'],['','6 · Kotor','kotor.html'],['','7 · Šibenik','sibenik.html'],['','8 · Rastoke','rastoke.html'],['','9 · Zagreb final','zagreb-final.html'],
 ['Planejamento','✈ Voos','voos.html'],['','Hospedagem','hospedagem.html'],['','Imperdíveis','imperdiveis.html'],['','Passeios pagos','passeios.html'],['','Orçamento','orcamento.html'],['','Controle de Gastos','gastos.html'],['','Costumes e Dicas','costumes.html'],['','Onde jantar','jantar.html'],['','Segurança e Documentos','seguranca.html'],['','Dossiê de imigração','dossie.html'],['','Pendências','pendencias.html']
];
var css='.hbg{flex:none;align-self:center;width:40px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);cursor:pointer;padding:0}.hbg:hover{border-color:var(--accent);color:var(--accent)}.hbg svg{width:20px;height:20px}'
+'.sm-ov{position:fixed;inset:0;background:rgba(8,20,24,.5);opacity:0;pointer-events:none;transition:opacity .2s;z-index:40}.sm-ov.open{opacity:1;pointer-events:auto}'
+'.sm{position:fixed;top:0;left:0;bottom:0;width:min(300px,86vw);background:var(--surface);color:var(--ink);border-right:1px solid var(--line);box-shadow:4px 0 24px rgba(0,0,0,.18);transform:translateX(-102%);transition:transform .22s ease;z-index:41;display:flex;flex-direction:column;visibility:hidden;padding-top:env(safe-area-inset-top,0px)}.sm.open{transform:none;visibility:visible}'
+'.sm-h{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line)}.sm-h b{font:800 1.2rem var(--f-display)}.sm-x{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;width:36px;height:36px;font-size:18px;cursor:pointer}'
+'.sm-b{overflow-y:auto;padding:8px 10px 24px;display:grid;gap:2px;align-content:start}.sm-g{font:600 11px var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:14px 6px 4px}'
+'.sm-b a{display:block;text-decoration:none;color:var(--ink);padding:9px 12px;border-radius:8px;font-size:15px}.sm-b a:hover{background:color-mix(in srgb,var(--line) 40%,transparent)}.sm-b a[aria-current="page"]{background:var(--accent);color:var(--accent-ink);font-weight:600}.sm-b a.act{border:1px solid var(--accent);color:var(--accent);font-weight:600;margin-bottom:4px}'
+'body.sm-lock{overflow:hidden}@media (prefers-reduced-motion:reduce){.sm,.sm-ov{transition:none}}';
function build(){
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 var here=location.pathname.split('/').pop()||'index.html';
 var h='<div class="sm-h"><b>Balcãs 2027</b><button type="button" class="sm-x" aria-label="Fechar menu">✕</button></div><div class="sm-b">';
 ITEMS.forEach(function(it){if(it[0])h+='<div class="sm-g">'+it[0]+'</div>';
  var f=it[2].split('#')[0];var cur=(f===here&&it[3]!=='act')?' aria-current="page"':'';
  h+='<a href="'+it[2]+'"'+cur+(it[3]?' class="'+it[3]+'"':'')+'>'+it[1]+'</a>'});
 h+='</div>';
 var m=document.createElement('aside');m.className='sm';m.id='sidemenu';m.setAttribute('aria-label','Menu do site');m.innerHTML=h;
 var ov=document.createElement('div');ov.className='sm-ov';
 document.body.appendChild(ov);document.body.appendChild(m);
 var btn=document.createElement('button');btn.type='button';btn.className='hbg';btn.setAttribute('aria-label','Abrir menu');btn.setAttribute('aria-controls','sidemenu');btn.setAttribute('aria-expanded','false');
 btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
 var nav=document.querySelector('nav.pills');
 if(nav)nav.insertBefore(btn,nav.firstChild);else{btn.style.cssText='position:fixed;top:10px;left:10px;z-index:30';document.body.appendChild(btn)}
 function open(o){m.classList.toggle('open',o);ov.classList.toggle('open',o);document.body.classList.toggle('sm-lock',o);btn.setAttribute('aria-expanded',o?'true':'false');
  if(o){var c=m.querySelector('a[aria-current]')||m.querySelector('a');if(c)c.focus({preventScroll:true})}else btn.focus({preventScroll:true})}
 btn.addEventListener('click',function(){open(!m.classList.contains('open'))});
 ov.addEventListener('click',function(){open(false)});
 m.querySelector('.sm-x').addEventListener('click',function(){open(false)});
 document.addEventListener('keydown',function(e){if(e.key==='Escape'&&m.classList.contains('open'))open(false)});
 m.addEventListener('click',function(e){var a=e.target.closest('a');if(a&&a.getAttribute('href').split('#')[0]===here&&a.hash){open(false)}});
}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',build);else build();
})();

/* Versão do site: ATUALIZAR a cada nova publicação */
var SITE_VERSION='v49';
(function(){
  function put(){var n=document.querySelector('nav.pills');if(!n||n.querySelector('.ver'))return;
    var v=document.createElement('span');v.className='ver';v.textContent=SITE_VERSION;v.title='Versão do site';
    v.style.cssText='flex:none;align-self:center;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted);border:1px dashed var(--line);border-radius:5px;padding:5px 7px';
    var hb=n.querySelector('.hbg');n.insertBefore(v,hb?hb.nextSibling:n.firstChild)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',put);else put();
})();
