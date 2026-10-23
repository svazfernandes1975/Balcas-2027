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
 ['Planejamento','Voos','voos.html','','<path d="M10.5 13.5 3 11l1.5-1.5 8 .5 4.5-4.5a1.8 1.8 0 0 1 2.6 2.6L14.5 12.5l.5 8L13.5 22 11 14.5z"/>'],['','Hospedagem','hospedagem.html','','<path d="M3 18V7M3 14h18v4M21 14v-2.5A2.5 2.5 0 0 0 18.5 9H11v5"/><circle cx="7" cy="11" r="1.6"/>'],['','Imperdíveis','imperdiveis.html','','<path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1L3.2 9.5l6.1-.9z"/>'],['','Passeios pagos','passeios.html','','<path d="M3 9a2 2 0 0 0 0 6v3h18v-3a2 2 0 0 1 0-6V6H3z"/><path d="M14 6v12" stroke-dasharray="2 2"/>'],['','Compras e Tax Free','compras.html','','<path d="M6 8h12l1 12H5z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/>'],['','Dirigir','dirigir.html','','<path d="M5 16l1.500-5.500A2 2 0 0 1 8.400 9h7.200a2 2 0 0 1 1.900 1.500L19 16"/><rect x="3" y="16" width="18" height="4" rx="1.500"/><path d="M7 20v1M17 20v1"/>'],['','Clima','clima.html','','<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.900 4.900l1.400 1.400M17.700 17.700l1.400 1.400M2 12h2M20 12h2M4.900 19.100l1.400-1.400M17.700 6.300l1.400-1.400"/>'],['','Orçamento','gastos.html?aba=orcamento','','<circle cx="12" cy="12" r="9"/><path d="M14.8 9.2c-.6-.8-1.6-1.2-2.8-1.2-1.5 0-2.6.8-2.6 2s1 1.7 2.6 2 2.6.8 2.6 2-1.1 2-2.6 2c-1.2 0-2.2-.4-2.8-1.2M12 6.5V8m0 8v1.5"/>'],['','Controle de Gastos','gastos.html','','<path d="M6 3h12v18l-3-2-3 2-3-2-3 2z"/><path d="M9 8h6M9 12h6"/>'],['','Costumes e Dicas','costumes.html','','<path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z"/>'],['','Onde jantar','jantar.html','','<path d="M7 3v8M4.5 3v5a2.5 2.5 0 0 0 5 0V3M7 11v10M17 21V3c-2.2 1.5-3 4-3 7 0 2 1 3 3 3"/>'],['','Segurança e Documentos','seguranca.html','','<path d="M12 3 4.5 6v5.5c0 4.5 3 8 7.5 9.5 4.5-1.500 7.500-5 7.500-9.500V6z"/><path d="m9 12 2.200 2.200L15.500 10"/>'],['','Dossiê de imigração','dossie.html','','<path d="M6 3h9l4 4v14H6z"/><path d="M15 3v4h4M9 12h7M9 16h7"/>'],['','Pendências','pendencias.html','','<path d="M9 6h11M9 12h11M9 18h11"/><path d="m3.500 6 1 1 2-2M3.500 12l1 1 2-2M3.500 18l1 1 2-2"/>'],['','Checklist de mala','mala.html','','<rect x="6" y="7" width="12" height="14" rx="2"/><path d="M9 7V4h6v3M10 11v6M14 11v6"/>']
];

var CI={
'zagreb.html':'<path d="M5 21V10l2.500-6L10 10v11M14 21V10l2.500-6L19 10v11M3 21h18M10 21v-5h4v5"/>',
'ljubljana.html':'<path d="M2 13h20M2 18h20M3 18v-2a2.300 2.300 0 0 1 4.600 0v2M9.700 18v-2a2.300 2.300 0 0 1 4.600 0v2M16.400 18v-2a2.300 2.300 0 0 1 4.600 0v2M2 21h20M6 13V9M12 13V7M18 13V9"/>',
'trieste.html':'<path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5zM16 10h1.500a2.500 2.500 0 0 1 0 5H16M8 3v3M11 3v3M3 21h15"/>',
'plitvice.html':'<path d="M3 4h18M7 4v6M12 4v9M17 4v6M7 13v1M17 13v1M3 20c2-2 3.500-2 5.500 0s3.500 2 5.500 0 3.500-2 5.500 0 1.500 1 2.500 0M12 16v1"/>',
'split.html':'<path d="M3 21h18M4 10h16M4 10l8-6 8 6M6 10v11M10 10v11M14 10v11M18 10v11"/>',
'dubrovnik.html':'<path d="M3 21V9h3V7h2v2h2V7h2v2h2V7h2v2h3v12M3 21h18M9 21v-5a3 3 0 0 1 6 0v5"/>',
'kotor.html':'<path d="M2 20 9 7l3 5 3-4 7 12zM9 7l1 3M13 20l-2-3 3-1-2-3"/>',
'sibenik.html':'<path d="M4 21h16M6 21v-8M18 21v-8M5 13h14M7 13a5 5 0 0 1 10 0M12 8V5M10.500 6.500h3M10 21v-4h4v4"/>',
'rastoke.html':'<circle cx="12" cy="11" r="6"/><circle cx="12" cy="11" r="1.500"/><path d="M12 5v12M6 11h12M7.800 6.800l8.400 8.400M16.200 6.800l-8.400 8.400M3 21c2-1.500 3.500-1.500 5.500 0s3.500 1.500 5.500 0 3.500-1.500 6 0"/>',
'zagreb-final.html':'<path d="M5 21V4M5 4h13l-2.500 4 2.500 4H5M9 4v8M13 4v8M5 8h13"/>'};
function ico(f,cls){var p=CI[f];return p?'<svg class="'+cls+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>':''}
function decorate(){
 var st=document.createElement('style');st.textContent='.ci-p{width:16px;height:16px;vertical-align:-3px;margin-right:6px;flex:none}.ci-h{width:.8em;height:.8em;vertical-align:-.05em;margin-right:.3em;color:var(--accent);stroke-width:1.5}.ci-c{width:22px;height:22px;vertical-align:-4px;margin-right:8px;color:var(--accent)}';document.head.appendChild(st);
 [].forEach.call(document.querySelectorAll('nav.pills a[href]'),function(a){var f=a.getAttribute('href').split('#')[0];if(CI[f]&&!a.querySelector('svg'))a.insertAdjacentHTML('afterbegin',ico(f,'ci-p'))});
 var here=location.pathname.split('/').pop();var h=document.querySelector('.hero h1');if(h&&CI[here])h.insertAdjacentHTML('afterbegin',ico(here,'ci-h'));
 [].forEach.call(document.querySelectorAll('a[href$=".html#top"] article h3'),function(t){var f=t.closest('a').getAttribute('href').split('#')[0];if(CI[f])t.insertAdjacentHTML('afterbegin',ico(f,'ci-c'))});
}
var css='.hbg{position:fixed;top:calc(env(safe-area-inset-top,0px) + 10px);left:16px;z-index:30;box-shadow:0 1px 4px rgba(0,0,0,.12);width:40px;height:36px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--line);border-radius:8px;background:var(--surface);color:var(--ink);cursor:pointer;padding:0}.hbg:hover{border-color:var(--accent);color:var(--accent)}.hbg svg{width:20px;height:20px}'
+'.sm-ov{position:fixed;inset:0;background:rgba(8,20,24,.5);opacity:0;pointer-events:none;transition:opacity .2s;z-index:40}.sm-ov.open{opacity:1;pointer-events:auto}'
+'.sdm{position:fixed;top:0;left:0;bottom:0;width:min(300px,86vw);background:var(--surface);color:var(--ink);border-right:1px solid var(--line);box-shadow:4px 0 24px rgba(0,0,0,.18);transform:translateX(-102%);transition:transform .22s ease;z-index:41;display:flex;flex-direction:column;visibility:hidden;padding-top:env(safe-area-inset-top,0px)}.sdm.open{transform:none;visibility:visible}'
+'.sm-h{display:flex;align-items:center;justify-content:space-between;padding:12px 14px;border-bottom:1px solid var(--line)}.sm-h b{font:800 1.2rem var(--f-display)}.sm-x{border:1px solid var(--line);background:var(--bg);color:var(--ink);border-radius:8px;width:36px;height:36px;font-size:18px;cursor:pointer}'
+'.sm-b{overflow-y:auto;padding:8px 10px 24px;display:grid;gap:2px;align-content:start}.sm-g{font:600 11px var(--f-mono);letter-spacing:.12em;text-transform:uppercase;color:var(--muted);margin:14px 6px 4px}'
+'.sm-b a{display:block;text-decoration:none;color:var(--ink);padding:9px 12px;border-radius:8px;font-size:15px}.sm-b a:hover{background:color-mix(in srgb,var(--line) 40%,transparent)}.sm-b a[aria-current="page"]{background:var(--accent);color:var(--accent-ink);font-weight:600}.sm-b a.pl{display:flex;align-items:center;gap:11px}.sm-b a svg{width:19px;height:19px;flex:none;opacity:.85}.sm-b a.act{border:1px solid var(--accent);color:var(--accent);font-weight:600;margin-bottom:4px}'
+'/*cov*/.hbg-cov{position:fixed;top:env(safe-area-inset-top,0px);left:0;width:68px;height:57px;box-sizing:border-box;background:var(--bg);border-bottom:1px solid var(--line);z-index:29;pointer-events:none}body.has-hbg nav.pills{padding-left:68px;min-height:57px;box-sizing:border-box;align-items:center}.sm-b:not(.sm-t){flex:1;min-height:0}.sm-t{padding:0 10px 14px;overflow:visible;border-top:1px solid var(--line);flex:none}.tmt{display:flex;align-items:center;gap:10px;width:100%;box-sizing:border-box;font:inherit;font-size:14px;color:var(--ink);background:var(--bg);border:1px solid var(--line);border-radius:8px;padding:8px 10px;cursor:pointer;text-align:left}.tmt i{width:20px;height:20px;border-radius:50%;border:1px solid var(--line);flex:none}.tmt span{flex:1}.tmt svg{width:16px;height:16px;flex:none;transition:transform .15s}.tmt[aria-expanded="true"] svg{transform:rotate(180deg)}.tm{display:flex;flex-wrap:wrap;gap:8px;padding:10px 2px 2px}.tm[hidden]{display:none}.tmb{width:36px;height:36px;padding:0;border:0;border-radius:50%;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center}.tmb i{width:28px;height:28px;border-radius:50%;border:1px solid var(--line);display:block}.tmb:focus-visible,.tmt:focus-visible{outline:2px solid var(--accent);outline-offset:2px}.tmb[aria-pressed="true"]{box-shadow:0 0 0 2px var(--accent)}body.sm-lock{overflow:hidden}@media (prefers-reduced-motion:reduce){.sdm,.sm-ov{transition:none}}';
function build(){
 var st=document.createElement('style');st.textContent=css;document.head.appendChild(st);
 var here=location.pathname.split('/').pop()||'index.html';
 var h='<div class="sm-h"><b>Balcãs 2027</b><button type="button" class="sm-x" aria-label="Fechar menu">✕</button></div><div class="sm-b">';
 ITEMS.forEach(function(it){if(it[0])h+='<div class="sm-g">'+it[0]+'</div>';
  var f=it[2].split('#')[0];var cur=(f===here&&it[3]!=='act'&&it[2].indexOf('?')<0)?' aria-current="page"':'';
  var ic=CI[f]?ico(f,'')+'':it[4]?'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+it[4]+'</svg>':'';h+='<a href="'+it[2]+'"'+cur+((it[3]||ic)?' class="'+((it[3]||'')+(ic?' pl':'')).trim()+'"':'')+'>'+ic+it[1]+'</a>'});
 h+='</div>';
 var m=document.createElement('aside');m.className='sdm';m.id='sidemenu';m.setAttribute('aria-label','Menu do site');m.innerHTML=h;
 var ov=document.createElement('div');ov.className='sm-ov';
 document.body.appendChild(ov);document.body.appendChild(m);decorate();
 var TM=[['auto','Automático','linear-gradient(135deg,#EDF2F3 50%,#0C1A1F 50%)'],['light','Claro','#EDF2F3'],['dark','Escuro','#0C1A1F'],['adriatico','Adriático','linear-gradient(135deg,#0A1B2E 50%,#38C6E4 50%)'],['papel','Papel','linear-gradient(135deg,#F2EADA 50%,#A04A1C 50%)'],['sol','Pôr do sol','linear-gradient(135deg,#1D1320 50%,#FF9E5E 50%)'],['floresta','Floresta','linear-gradient(135deg,#E7F0E8 50%,#1D7A4B 50%)'],['contraste','Contraste','linear-gradient(135deg,#FFFFFF 50%,#000000 50%)']];
 var cur='auto';try{cur=localStorage.getItem('balcas-tema')||'auto'}catch(e){}
 var tb=document.createElement('div');tb.className='sm-b sm-t';
 function nmOf(t){for(var i=0;i<TM.length;i++)if(TM[i][0]===t)return TM[i]}
 var cd=nmOf(cur)||TM[0];
 tb.innerHTML='<button type="button" class="tmt" aria-expanded="false" aria-controls="tm-p"><i style="background:'+cd[2]+'"></i><span>Aparência: <b>'+cd[1]+'</b></span><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 15l6-6 6 6"/></svg></button><div class="tm" id="tm-p" hidden>'+TM.map(function(x){return '<button type="button" class="tmb" data-t="'+x[0]+'" aria-label="'+x[1]+'" title="'+x[1]+'" aria-pressed="'+(x[0]===cur)+'"><i style="background:'+x[2]+'"></i></button>'}).join('')+'</div>';
 m.appendChild(tb);
 var tt=tb.querySelector('.tmt'),tp=tb.querySelector('.tm');
 function tfold(o){tp.hidden=!o;tt.setAttribute('aria-expanded',o?'true':'false')}
 tt.addEventListener('click',function(){tfold(tp.hidden)});
 tb.addEventListener('click',function(e){var b=e.target.closest('.tmb');if(!b)return;var t=b.dataset.t;
  if(t==='auto')document.documentElement.removeAttribute('data-theme');else document.documentElement.setAttribute('data-theme',t);
  try{localStorage.setItem('balcas-tema',t)}catch(x){}
  [].forEach.call(tb.querySelectorAll('.tmb'),function(y){y.setAttribute('aria-pressed',y===b?'true':'false')});
  var n=nmOf(t);tt.querySelector('i').style.background=n[2];tt.querySelector('b').textContent=n[1]});

 var btn=document.createElement('button');btn.type='button';btn.className='hbg';btn.setAttribute('aria-label','Abrir menu');btn.setAttribute('aria-controls','sidemenu');btn.setAttribute('aria-expanded','false');
 btn.innerHTML='<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>';
 var nav=document.querySelector('nav.pills');
 var cov=document.createElement('div');cov.className='hbg-cov';cov.setAttribute('aria-hidden','true');document.body.appendChild(cov);document.body.appendChild(btn);document.body.classList.add('has-hbg')
 function open(o){if(!o)tfold(false);m.classList.toggle('open',o);ov.classList.toggle('open',o);document.body.classList.toggle('sm-lock',o);btn.setAttribute('aria-expanded',o?'true':'false');
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
var SITE_VERSION='v94';
(function(){
  function put(){var n=document.querySelector('nav.pills');if(!n||n.querySelector('.ver'))return;
    var v=document.createElement('span');v.className='ver';v.textContent=SITE_VERSION;v.title='Versão do site';
    v.style.cssText='flex:none;align-self:center;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted);border:1px dashed var(--line);border-radius:5px;padding:5px 7px';
    n.appendChild(v)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',put);else put();
})();
