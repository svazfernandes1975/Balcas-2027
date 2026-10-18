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
 ['Planejamento','Voos','voos.html','','<path d="M10.5 13.5 3 11l1.5-1.5 8 .5 4.5-4.5a1.8 1.8 0 0 1 2.6 2.6L14.5 12.5l.5 8L13.5 22 11 14.5z"/>'],['','Hospedagem','hospedagem.html','','<path d="M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="7" cy="11" r="1.6"/>'],['','Imperdíveis','imperdiveis.html','','<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'],['','Passeios pagos','passeios.html','','<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>'],['','Orçamento','gastos.html?aba=orcamento','','<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2c-.6-.8-1.6-1.2-2.8-1.2-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1.2 0-2.2-.4-2.8-1.2M12 6.5V8m0 8v1.5"/>'],['','Controle de Gastos','gastos.html','','<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'],['','Costumes e Dicas','costumes.html','','<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'],['','Onde jantar','jantar.html','','<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.5-3 4-3 7 0 2 1 3 3 3"/>'],['','Segurança e Documentos','seguranca.html','','<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.500 7.500-5 7.500-9.500V6z"/><path d="m9 12 2.200 2.200L15.500 10"/>'],['','Dossiê de imigração','dossie.html','','<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>'],['','Pendências','pendencias.html','','<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.500 6 1 1 2-2M3.500 12l1 1 2-2M3.500 18l1 1 2-2"/>']
];
var css='.hbg{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:16px;z-index:30;box-shadow:0 1px 4px rgba(0,0,0,.12);width:40px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);cursor:pointer;padding:0}.hbg:hover{border-color:var(--accent);color:var(--accent)}.hbg svg{width:20px;height:20px}'
+'.sm-ov{position:fixed;inset:0;background:rgba(8,20,24,.5);opacity:0;pointer-events:none;transition:opacity .2s;z-index:40}.sm-ov.open{opacity:1;pointer-events:auto}'
+'.sm{position:fixed;top:0;left:0;bottom:0;width:min(300px,86vw);background:var(--surface);color:var(--ink);border-right:1px solid var(--line);box-shadow:4px 0 24px rgba(0,0,0,.18);transform:translateX(-102%);transition:transform .22s ease;z-index:41;display:flex;flex-direction:column;visibility:hidden;padding-top:env(safe-area-inset-top,0px)}.sm.open{transform:none;visibility:visible}'
+'.sm-h{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line)}.sm-h b{font:800 1.2rem var(--f-display)}.sm-x{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;width:36px;height:36px;font-size:18px;cursor:pointer}'
+'.sm-b{overflow-y:auto;padding:8px 10px 24px;display:grid;gap:2px;align-content:start}.sm-g{font:600 11px var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:14px 6px 4px}'
+'.sm-b a{display:block;text-decoration:none;color:var(--ink);padding:9px 12px;border-radius:8px;font-size:15px}.sm-b a:hover{background:color-mix(in srgb,var(--line) 40%,transparent)}.sm-b a[aria-current="page"]{background:var(--accent);color:var(--accent-ink);font-weight:600}.sm-b a.pl{display:flex;align-items:center;gap:11px}.sm-b a svg{width:19px;height:19px;flex:none;opacity:.85}.sm-b a.act{border:1px solid var(--accent);color:var(--accent);font-weight:600;margin-bottom:4px}'
+'/*cov*/.hbg-cov{position:fixed;top:env(safe-area-inset-top,0px);left:0;width:68px;height:57px;box-sizing:border-box;background:var(--bg);border-bottom:1px solid var(--line);z-index:29;pointer-events:none}body.has-hbg nav.pills{padding-left:68px;min-height:57px;box-sizing:border-box;align-items:center}body.sm-lock{overflow:hidden}@media (prefers-reduced-motion:reduce){.sm,.sm-ov{transition:none}}';
function build(){
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 var here=location.pathname.split('/').pop()||'index.html';
 var h='<div class="sm-h"><b>Balcãs 2027</b><button type="button" class="sm-x" aria-label="Fechar menu">✕</button></div><div class="sm-b">';
 ITEMS.forEach(function(it){if(it[0])h+='<div class="sm-g">'+it[0]+'</div>';
  var f=it[2].split('#')[0];var cur=(f===here&&it[3]!=='act'&&it[2].indexOf('?')<0)?' aria-current="page"':'';
  var ic=it[4]?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+it[4]+'</svg>':'';h+='<a href="'+it[2]+'"'+cur+((it[3]||ic)?' class="'+((it[3]||'')+(ic?' pl':'')).trim()+'"':'')+'>'+ic+it[1]+'</a>'});
 h+='</div>';
 var m=document.createElement('aside');m.className='sm';m.id='sidemenu';m.setAttribute('aria-label','Menu do site');m.innerHTML=h;
 var ov=document.createElement('div');ov.className='sm-ov';
 document.body.appendChild(ov);document.body.appendChild(m);
 var btn=document.createElement('button');btn.type='button';btn.className='hbg';btn.setAttribute('aria-label','Abrir menu');btn.setAttribute('aria-controls','sidemenu');btn.setAttribute('aria-expanded','false');
 btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
 var nav=document.querySelector('nav.pills');
 var cov=document.createElement('div');cov.className='hbg-cov';cov.setAttribute('aria-hidden','true');document.body.appendChild(cov);document.body.appendChild(btn);document.body.classList.add('has-hbg')
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
var SITE_VERSION='v56';
(function(){
  function put(){var n=document.querySelector('nav.pills');if(!n||n.querySelector('.ver'))return;
    var v=document.createElement('span');v.className='ver';v.textContent=SITE_VERSION;v.title='Versão do site';
    v.style.cssText='flex:none;align-self:center;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted);border:1px dashed var(--line);border-radius:5px;padding:5px 7px';
    n.appendChild(v)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',put);else put();
})();
