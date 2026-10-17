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

/* Versão do site: ATUALIZAR a cada nova publicação */
var SITE_VERSION='v40';
(function(){
  function put(){var n=document.querySelector('nav.pills');if(!n||n.querySelector('.ver'))return;
    var v=document.createElement('span');v.className='ver';v.textContent=SITE_VERSION;v.title='Versão do site';
    v.style.cssText='flex:none;align-self:center;font:600 11px/1 var(--f-mono,monospace);letter-spacing:.06em;color:var(--muted);border:1px dashed var(--line);border-radius:5px;padding:5px 7px';
    n.insertBefore(v,n.firstChild)}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',put);else put();
})();
