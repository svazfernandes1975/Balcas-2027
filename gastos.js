/* Controle de gastos — protótipo v2 (dados só neste aparelho, em localStorage) */
(function(){
'use strict';
var KEY='balcas2027-gastos-v1';
(function(){try{if(document.getElementById('gx-crit'))return;var st=document.createElement('style');st.id='gx-crit';
st.textContent='.gx .cs.cpl{display:flex!important;flex-direction:row!important;flex-wrap:nowrap!important;gap:4px!important;width:max-content;max-width:100%}.gx .cs.cpl button{margin:0!important;min-width:40px!important;padding:6px 9px!important;border-radius:8px!important;flex:none}.gx .mrow[data-m]{grid-template-columns:minmax(0,1.4fr) auto minmax(0,1fr) auto!important}@media (max-width:560px){.gx .mrow[data-m]{grid-template-columns:1fr 1fr!important}.gx .mrow[data-m]>label:nth-child(1),.gx .mrow[data-m]>label:nth-child(2){grid-column:1/-1!important}}';
document.head.appendChild(st)}catch(e){}})();
var root=document.getElementById('gx');
function $(s,r){return (r||root).querySelector(s)}
function $$(s,r){return Array.prototype.slice.call((r||root).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,6)}
var BASE=['EUR','USD','BRL'];
function curList(){return BASE.concat(((typeof S!=='undefined'&&S&&S.extra)||[]).map(function(x){return x.code}))}
function curSym(c){return c==='EUR'?'€':c==='USD'?'US$':c==='BRL'?'R$':c}
function curOpts(sel){return curList().map(function(c){return '<option'+(c===sel?' selected':'')+'>'+c+'</option>'}).join('')}

/* ---------- padrões ---------- */
var DEFB=[['hosp','Hospedagem',2778,'EUR','trip',1],['cafe','Café da manhã',160,'EUR','trip',1],['almoco','Almoço',780,'EUR','trip',1],['jantar','Jantar',1218,'EUR','trip',1],['comb','Combustível',350,'EUR','trip',1],['pedagio','Carro',150,'EUR','trip',1],['estac','Estacionamento',115,'EUR','trip',1],['transp','Transporte local',100,'EUR','trip',1],['ingr','Ingressos e passeios',708,'EUR','trip',1],['extras','Extras',400,'EUR','trip',1],['compras','Compras',0,'EUR','trip',1],['outros','Outros',0,'EUR','trip',1],['taxas','Taxas e outros',70,'EUR','trip',1],['carro','Aluguel do carro',927,'EUR','trip',1],['voo','Passagens (taxas)',1400,'BRL','pre',0]];
function defCats(){return DEFB.map(function(x){return{id:x[0],name:x[1]}})}
function defLines(){return DEFB.map(function(x){return{id:'l_'+x[0],cat:x[0],label:'',qty:1,unit:x[2],val:x[2],cur:x[3],when:x[4],bal:!!x[5]}})}
function defCountries(){return[{name:'Brasil',cur:'BRL'},{name:'Croácia',cur:'EUR'},{name:'Eslovênia',cur:'EUR'},{name:'Montenegro',cur:'EUR'},{name:'Itália',cur:'EUR'}]}
function defRoute(){return[{from:'1900-01-01',c:'Brasil'},{from:'2027-05-15',c:'Croácia'},{from:'2027-05-18',c:'Eslovênia'},{from:'2027-05-21',c:'Croácia'},{from:'2027-05-29',c:'Montenegro'},{from:'2027-06-01',c:'Croácia'},{from:'2027-06-06',c:'Brasil'}]}
function defaults(){return{
  v:3,
  rates:{usdBrl:5.28,eurBrl:6.0},
  extra:[],
  trip:{start:'2027-05-15',end:'2027-06-05'},
  refDate:'',
  methods:[
    {id:'cash',name:'Cash EUR',cur:'EUR',dcur:'EUR',init:350,cnt:true},
    {id:'wiseusd',name:'Wise USD',cur:'USD',dcur:'EUR',init:1026.05,cnt:true},
    {id:'wiseeur',name:'Wise EUR',cur:'EUR',dcur:'EUR',init:1047.71,cnt:true},
    {id:'c6eur',name:'C6 EUR',cur:'EUR',dcur:'EUR',init:27.51,cnt:true},
    {id:'nomad',name:'Nomad USD',cur:'USD',dcur:'EUR',init:1047,cnt:true},
    {id:'c6usd',name:'C6 USD',cur:'USD',dcur:'EUR',init:253.2,cnt:true},
    {id:'brcard',name:'Cartão BR (R$)',cur:'BRL',dcur:'BRL',init:0,cnt:false}
  ],
  cats:defCats(),budget:defLines(),
  countries:defCountries(),route:defRoute(),
  entries:[],
  last:{method:'cash',cat:'almoco',cur:'EUR'}
}}
function migrate(o){
  if(o.v===1){
    o.budget.forEach(function(b){b.when=b.pre?'pre':'trip';b.bal=!b.pre;b.cur=b.cur||'EUR';delete b.pre});
    o.entries.forEach(function(e){if(e.t==='g'){var m=o.methods.filter(function(x){return x.id===e.m})[0];e.cur=m?m.cur:'EUR';e.debit=e.amt}});
    if(!o.methods.some(function(m){return m.id==='brcard'}))o.methods.push({id:'brcard',name:'Cartão BR (R$)',cur:'BRL',init:0,cnt:false});
    o.last=o.last||{};o.last.cur='EUR';o.v=2;
  }
  if(o.v<3)(function(){var pd=o.budget.filter(function(b){return b.id==='pedagio'})[0];if(pd&&pd.name==='Pedágio e vinheta')pd.name='Carro';
    var at=o.budget.map(function(b){return b.id}).indexOf('extras')+1||o.budget.length;
    [['compras','Compras'],['outros','Outros']].forEach(function(x){if(!o.budget.some(function(b){return b.id===x[0]})){o.budget.splice(at,0,{id:x[0],name:x[1],val:0,cur:'EUR',when:'trip',bal:true});at++}})})();
  if(o.v<3){o.cats=o.budget.map(function(b){return{id:b.id,name:b.name}});o.budget=o.budget.map(function(b){return{id:'l_'+b.id,cat:b.id,label:'',val:b.val,cur:b.cur||'EUR',when:b.when||'trip',bal:!!b.bal}});o.v=3}
  if(!o.extra)o.extra=[];
  o.budget.forEach(function(l){if(l.qty===undefined){l.qty=1;l.unit=l.val}});
  if(o.rates.usdBrl===undefined)o.rates.usdBrl=Math.round((o.rates.usdEur||0.88)*o.rates.eurBrl*10000)/10000;
  o.extra.forEach(function(x){if(x.brl===undefined)x.brl=Math.round(o.rates.eurBrl/(x.perEur||1)*10000)/10000});
  if(!o.countries){o.countries=defCountries();o.route=defRoute()}
  o.methods.forEach(function(m){if(!m.dcur)m.dcur=m.cur==='USD'?'EUR':m.cur});
  return o}
function load(){try{var r=localStorage.getItem(KEY);if(r){var o=JSON.parse(r);if(o&&(o.v===1||o.v===2||o.v===3))return migrate(o)}}catch(e){}return defaults()}
var S=load();
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}try{pushDiff()}catch(e){}}
/* ---------- SYNC (Firebase: Firestore + login Google) ----------
   config: documento data/config; lançamentos: um documento por lançamento em entries/{id}.
   O localStorage continua sendo o cache local; o Firestore guarda a cópia compartilhada. */
var SYNC={on:false,ready:false,uid:null,unsubs:[],pushed:{},cfgPushed:'',cfg:null,ent:[],cfgSeen:false,entSeen:false,cfgServer:false,entServer:false,cfgSig:null,entSig:null,bound:false};
var CFGK=['v','cats','budget','methods','rates','extra','countries','route','trip','refDate','ratesAt'];
var SKEY='balcas2027-synced';
function cfgOf(o){var c={};CFGK.forEach(function(k){if(o[k]!==undefined)c[k]=o[k]});return c}
function jclean(o){return JSON.parse(JSON.stringify(o))}
function byId(a,b){return a.id<b.id?-1:a.id>b.id?1:0}
function refreshUI(){
  if(root){
    var busy=false;
    if(tab==='lancar'){var a=document.activeElement;busy=!!((a&&a.closest&&a.closest('#g-form,#t-form,#a-form'))||F.edit||F.editT||F.editA||($('#g-amt')&&$('#g-amt').value))}
    if(!busy){try{render()}catch(e){}}
  }
  try{document.dispatchEvent(new Event('gx-sync'))}catch(e){}
}
function applyCfg(c){Object.keys(c).forEach(function(k){S[k]=c[k]});migrate(S);if(!S.last)S.last={method:'cash',cat:'almoco',cur:'EUR'}}
function setBaseline(entList){SYNC.pushed={};entList.forEach(function(e){SYNC.pushed[e.id]=JSON.stringify(e)})}
function pushDiff(){
  if(!SYNC.on||!SYNC.ready||!window.FB)return;
  var ops=[],cur={};
  S.entries.forEach(function(e){if(!e||!e.id)return;var j=JSON.stringify(e);cur[e.id]=j;if(SYNC.pushed[e.id]!==j)ops.push({set:['entries/'+e.id,jclean(e)]})});
  Object.keys(SYNC.pushed).forEach(function(id){if(!(id in cur))ops.push({del:'entries/'+id})});
  var cj=JSON.stringify(cfgOf(S));
  if(cj!==SYNC.cfgPushed)ops.push({set:['data/config',{c:jclean(cfgOf(S)),ts:Date.now()}]});
  if(!ops.length)return;
  SYNC.pushed=cur;SYNC.cfgPushed=cj;
  FB.batch(ops);
}
function step(changed){
  if(!SYNC.on||!SYNC.cfgSeen||!SYNC.entSeen)return;
  if(SYNC.ready&&!changed)return;
  var synced=false;try{synced=localStorage.getItem(SKEY)===SYNC.uid}catch(e){}
  if(!SYNC.ready){
    if(!synced&&!(SYNC.cfgServer&&SYNC.entServer))return;
    var rem=SYNC.ent.slice().sort(byId),ids={};rem.forEach(function(e){ids[e.id]=1});
    if(synced){S.entries=rem}
    else{S.entries=rem.concat(S.entries.filter(function(e){return e&&e.id&&!ids[e.id]}).map(jclean)).sort(byId)}
    setBaseline(rem);
    if(SYNC.cfg&&SYNC.cfg.c){applyCfg(SYNC.cfg.c);SYNC.cfgPushed=JSON.stringify(cfgOf(S))}else SYNC.cfgPushed='';
    try{localStorage.setItem(SKEY,SYNC.uid)}catch(e){}
    SYNC.ready=true;save();refreshUI();return;
  }
  S.entries=SYNC.ent.slice().sort(byId);setBaseline(S.entries);
  if(SYNC.cfg&&SYNC.cfg.c){applyCfg(SYNC.cfg.c);SYNC.cfgPushed=JSON.stringify(cfgOf(S))}
  try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}
  refreshUI();
}
function syncStop(){SYNC.unsubs.forEach(function(f){try{f()}catch(e){}});SYNC.unsubs=[];SYNC.on=false;SYNC.ready=false;SYNC.cfgSeen=SYNC.entSeen=SYNC.cfgServer=SYNC.entServer=false;SYNC.cfgSig=SYNC.entSig=null}
function syncStart(u){
  syncStop();SYNC.uid=u.uid;SYNC.on=true;
  SYNC.unsubs.push(FB.watchDoc('gx-cfg','data/config',function(d,meta){
    var sg=JSON.stringify(d);var ch=sg!==SYNC.cfgSig;SYNC.cfgSig=sg;SYNC.cfg=d;SYNC.cfgSeen=true;if(!meta.fromCache)SYNC.cfgServer=true;step(ch)}));
  SYNC.unsubs.push(FB.watchCol('gx-ent','entries',function(list,meta){
    var sg=JSON.stringify(list);var ch=sg!==SYNC.entSig;SYNC.entSig=sg;SYNC.ent=list;SYNC.entSeen=true;if(!meta.fromCache)SYNC.entServer=true;step(ch)}));
}
function mountStrip(){var el=document.getElementById('gx-sync');if(!el)return;if(window.FB)FB.strip(el);else el.innerHTML='<span class="fbs">☁ Salvo só neste aparelho (Firebase indisponível)</span>'}
function canWrite(){return !!(window.FB&&FB.user&&FB.status&&FB.status.state!=='denied')}
var lockWas=null,fbWait=true;
function applyLock(){
  if(!root)return;
  var lock=!canWrite(),g=$('#gx-gate');
  root.classList.toggle('locked',lock);
  if(g){
    g.hidden=!lock;
    if(lock){
      var stt=window.FB&&FB.status?FB.status.state:'nofb',msg,btn='';
      if(!window.FB){msg=fbWait?'<b>Carregando o login…</b>':'<b>Não foi possível carregar o login.</b> Sem internet, o Controle de Gastos não abre. Conecte-se e recarregue a página.'}
      else if(stt==='init'){msg='<b>Verificando o login…</b>'}
      else if(stt==='denied'){msg='<b>Esta conta não tem acesso.</b> Entre com uma das contas Google autorizadas.';btn='<button type="button" class="btn" id="gate-out">Trocar de conta</button>'}
      else{msg='<b>Entre com o Google para usar o Controle de Gastos.</b> Só assim os lançamentos são salvos na nuvem e aparecem nos dois celulares. Você entra uma vez por aparelho.';btn='<button type="button" class="btn" id="gate-in">Entrar com Google</button>'}
      g.innerHTML='<h3>🔒 Controle de Gastos bloqueado</h3><p style="margin:0;font-size:15px">'+msg+'</p>'+btn;
      var bi=$('#gate-in'),bo=$('#gate-out');
      if(bi)bi.onclick=function(){FB.login()};
      if(bo)bo.onclick=function(){FB.logout()};
    }
  }
  if(lockWas===true&&!lock){try{render()}catch(e){}}
  lockWas=lock;
}
function initSync(){
  if(SYNC.bound||!window.FB)return;SYNC.bound=true;mountStrip();
  FB.onAuth(function(u){syncStop();if(u)syncStart(u);else refreshUI();applyLock()});
  FB.onStatus(function(s){if(s.state==='denied'||s.state==='out')syncStop();applyLock()});
  applyLock();
}
if(root){setTimeout(function(){fbWait=false;applyLock()},5000)}
if(window.FB)initSync();else{document.addEventListener('fb-ready',initSync);if(root)setTimeout(applyLock,0);if(root)setTimeout(function(){if(!window.FB)mountStrip()},4000)}


/* ---------- formatação e conversão ---------- */
var nfc={};
function money(v,c){c=c||'EUR';if(!nfc[c]){try{nfc[c]=new Intl.NumberFormat('pt-BR',{style:'currency',currency:c})}catch(e){nfc[c]={format:function(x){return c+' '+(Math.round(x*100)/100).toLocaleString('pt-BR',{minimumFractionDigits:2})}}}}return nfc[c].format(v||0)}
function num(s){s=String(s==null?'':s).trim().replace(/\s/g,'');if(!s)return NaN;if(s.indexOf(',')>-1)s=s.replace(/\./g,'').replace(',','.');return parseFloat(s)}
function brlPer(c){if(c==='BRL')return 1;if(c==='EUR')return S.rates.eurBrl;if(c==='USD')return S.rates.usdBrl;var x=S.extra.filter(function(e){return e.code===c})[0];return x?x.brl:1}
function perEur(c){return S.rates.eurBrl/brlPer(c)}
function toEUR(v,c){return v/perEur(c)}
function fromEUR(v,c){return v*perEur(c)}
function entryBrl(e){return e.brl!=null?e.brl:fromEUR(e.eur,'BRL')}
function conv(v,from,to){return from===to?v:fromEUR(toEUR(v,from),to)}
function r2(v){return Math.round(v*100)/100}
function fin(v){return (Math.round((+v||0)*100)/100).toFixed(2).replace('.',',')}
function finq(v){return String(Math.round(v*1000)/1000).replace('.',',')}
function fin4(v){var t=String(Math.round(v*10000)/10000);if(t.indexOf('.')<0)t+='.00';else if(t.split('.')[1].length<2)t+='0';return t.replace('.',',')}
function brl(eur){return money(eur*S.rates.eurBrl,'BRL')}
function both(eur){return money(eur)+' · '+brl(eur)}
function dnum(s){var p=String(s).split('-');return Date.UTC(+p[0],+p[1]-1,+p[2])/864e5}
function todayStr(){var d=new Date();return d.getFullYear()+'-'+('0'+(d.getMonth()+1)).slice(-2)+'-'+('0'+d.getDate()).slice(-2)}
function fmtDate(s){var p=s.split('-');var d=new Date(Date.UTC(+p[0],+p[1]-1,+p[2]));return new Intl.DateTimeFormat('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit',year:'2-digit',timeZone:'UTC'}).format(d).replace('.','')}
function mById(id){return S.methods.filter(function(m){return m.id===id})[0]}
function bById(id){return S.cats.filter(function(c){return c.id===id})[0]}
function lEur(l){return toEUR(l.val,l.cur)}
function isPre(e){return e.date<S.trip.start}
function debited(e){return e.debit!=null?e.debit:e.amt}

/* ---------- cálculos ---------- */
function balance(m){var b=m.init;S.entries.forEach(function(e){
  if(e.t==='g'&&e.m===m.id)b-=debited(e);
  else if(e.t==='t'){if(e.from===m.id)b-=e.out;if(e.to===m.id)b+=e.in}
  else if(e.t==='a'&&e.m===m.id)b+=e.delta});return b}
function stats(){
  var by={},byT={},byP={},spentT=0,spentP=0,spentTb=0,spentPb=0;
  S.entries.forEach(function(e){if(e.t!=='g')return;by[e.cat]=(by[e.cat]||0)+e.eur;if(isPre(e)){byP[e.cat]=(byP[e.cat]||0)+e.eur;spentP+=e.eur;spentPb+=entryBrl(e)}else{byT[e.cat]=(byT[e.cat]||0)+e.eur;spentT+=e.eur;spentTb+=entryBrl(e)}});
  var budT=0,budP=0,need=0,bT={},bP={},bBal={};
  S.budget.forEach(function(l){var v=lEur(l);if(l.when==='pre'){budP+=v;bP[l.cat]=(bP[l.cat]||0)+v}else{budT+=v;bT[l.cat]=(bT[l.cat]||0)+v;if(l.bal)bBal[l.cat]=(bBal[l.cat]||0)+v}});
  Object.keys(bBal).forEach(function(c){need+=Math.max(0,bBal[c]-(byT[c]||0))});
  var total=dnum(S.trip.end)-dnum(S.trip.start)+1;
  var last='';S.entries.forEach(function(e){if(e.t==='g'&&!isPre(e)&&e.date>last)last=e.date});
  var t=todayStr(),auto=(t>=S.trip.start&&t<=S.trip.end)?t:(last||S.trip.start);
  var ref=S.refDate||auto;
  var idx=Math.max(0,Math.min(total,dnum(ref)-dnum(S.trip.start)+1));
  var left=idx===0?total:Math.max(1,total-idx+1);
  var avail=0;S.methods.forEach(function(m){if(m.cnt)avail+=toEUR(balance(m),m.cur)});
  var rem=budT-spentT;
  return{by:by,byT:byT,byP:byP,bT:bT,bP:bP,spentT:spentT,spentTb:spentTb,spentPb:spentPb,spentP:spentP,budT:budT,budP:budP,need:need,rem:rem,total:total,ref:ref,idx:idx,left:left,avail:avail,
    perDay:rem/left,avg:idx>0?spentT/idx:0,proj:idx>0?spentT/idx*total:0,started:t>=S.trip.start||!!S.refDate||last!==''}
}

if(!root){window.GX={stats:stats,money:money,brl:brl,both:both,S:function(){return S}};return}

/* ---------- estado do formulário ---------- */
var D={line:null,route:false};
function addCancels(l){l.forEach(function(p){var a=$('#'+p[0]);if(!a||(a.nextSibling&&a.nextSibling.className==='btn sec sm cx'))return;var c=document.createElement('button');c.type='button';c.className='btn sec sm cx';c.textContent='Cancelar';c.onclick=function(){$$('input',a.parentNode).forEach(function(i){i.value=i.id==='b-qty'?'1':''})};a.parentNode.insertBefore(c,a.nextSibling)})}
function catLines(id){return S.budget.filter(function(l){return l.cat===id})}
function lnName(l,i){return l.label||('Linha '+(i+1))}
function lnById(id){return S.budget.filter(function(l){return l.id===id})[0]||null}
var F={ln:null,mode:'g',cat:null,meth:null,ecur:'EUR',step:1,country:null,ctouched:false,whereOpen:false,edit:null,editT:null,editA:null,brlTouched:false,tIn:false,debTouched:false,dateTouched:false,curTouched:false};
F.ecur=(mById(S.last.method)&&mById(S.last.method).dcur)||S.last.cur||'EUR';
var tab='lancar';try{tab=sessionStorage.getItem('gx-tab')||'lancar'}catch(e){}
var undoSnap=null,toastT=null;
function toast(msg,undo){
  var t=$('#gx-toast',document);if(!t)return;
  t.innerHTML='<span>'+esc(msg)+'</span>'+(undo?'<button type="button" id="gx-undo">Desfazer</button>':'');
  t.hidden=false;clearTimeout(toastT);toastT=setTimeout(function(){t.hidden=true},6000);
  var u=$('#gx-undo',document);if(u)u.onclick=function(){if(undoSnap){S.entries=JSON.parse(undoSnap);save();render()}t.hidden=true}
}
function snap(){undoSnap=JSON.stringify(S.entries)}
function setTab(t){tab=t;if(t==='lancar'&&!F.edit&&!F.editT&&!F.editA&&F.mode==='g')F.step=1;try{sessionStorage.setItem('gx-tab',t)}catch(e){}render();window.scrollTo(0,0);if(t==='lancar'&&F.mode==='g'){try{$('#g-amt').focus()}catch(e){}}}
$$('.gx-tabs button').forEach(function(b){b.addEventListener('click',function(){setTab(b.dataset.tab)})});

/* ---------- LANÇAR ---------- */
function countryByName(n){return S.countries.filter(function(c){return c.name===n})[0]}
function countryFor(date){var r=S.route.slice().sort(function(a,b){return a.from<b.from?-1:1}),n=null;r.forEach(function(x){if(x.from<=date)n=x.c});return countryByName(n)||S.countries[0]}
function curCountry(date){return(F.ctouched&&countryByName(F.country))||countryFor(date)}
function dateDefault(){var t=todayStr();return t<=S.trip.end?t:stats().ref}
function chipsMeth(){
  var h='';S.methods.forEach(function(m){h+='<button type="button" class="chip" data-id="'+m.id+'" aria-pressed="'+(F.meth===m.id)+'">'+esc(m.name)+'<small>'+money(balance(m),m.cur)+'</small></button>'});
  var el=$('#g-meths');el.innerHTML=h;$$('.chip',el).forEach(function(c){c.onclick=function(){F.meth=c.dataset.id;S.last.method=F.meth;F.debTouched=false;F.step=2;save();rLancar()}})
}
function renderWhere(ct,dt){
  var h='<div class="wr"><span>Onde: <b>'+esc(ct.name)+'</b> · '+ct.cur+(F.ctouched?'':' <small>(pela data)</small>')+(dt<S.trip.start?' <em class="tag">antes da viagem</em>':'')+'</span><button type="button" class="btn sec sm" id="w-chg">'+(F.whereOpen?'fechar':'mudar')+'</button></div>';
  if(F.whereOpen)h+='<div class="chips">'+S.countries.map(function(c){return '<button type="button" class="chip" data-c="'+esc(c.name)+'" aria-pressed="'+(c.name===ct.name)+'">'+esc(c.name)+'<small>'+c.cur+'</small></button>'}).join('')+'</div>';
  var w=$('#g-where');w.innerHTML=h;
  $('#w-chg').onclick=function(){F.whereOpen=!F.whereOpen;rLancar()};
  $$('[data-c]',w).forEach(function(b){b.onclick=function(){F.country=b.dataset.c;F.ctouched=true;F.curTouched=false;F.debTouched=false;F.whereOpen=false;rLancar();$('#g-amt').focus()}})
}
function rLancar(){
  if(!mById(F.meth))F.meth=mById(S.last.method)?S.last.method:(S.methods[0]&&S.methods[0].id);
  if(!bById(F.cat))F.cat=bById(S.last.cat)?S.last.cat:(S.cats[0]&&S.cats[0].id);
  ['g','t','a'].forEach(function(k){$('#p-'+k).hidden=F.mode!==k});
  var st=stats();
  $('#k-saldo').innerHTML='<b>'+money(st.avail)+'</b><span>saldo</span>';
  $('#k-gasto').innerHTML='<b>'+money(st.spentT)+'</b><span>gasto</span>';
  var k=$('#k-dia');k.className='kpi '+(st.idx===0||st.perDay>=st.avg?'ok':'warn');
  k.innerHTML='<b>'+money(Math.max(0,st.perDay))+'</b><span>por dia ('+st.left+' d)</span>';
  if(F.mode==='g'){
    var dt=$('#g-date').value||dateDefault(F.cat),ct=curCountry(dt);
    if(!F.curTouched)F.ecur=ct.cur;
    var h='';S.cats.forEach(function(b){h+='<button type="button" class="chip" data-id="'+b.id+'" aria-pressed="'+(F.cat===b.id)+'">'+esc(b.name)+'</button>'});
    var ce=$('#g-cats');ce.innerHTML=h;$$('.chip',ce).forEach(function(c){c.onclick=function(){
      F.cat=c.dataset.id;S.last.cat=F.cat;F.ln=null;
      if(!F.dateTouched)$('#g-date').value=dateDefault(F.cat);
      var many=catLines(F.cat).length>1;F.step=many?2:3;save();rLancar();if(!many)$('#g-amt').focus()}});
    var cl=catLines(F.cat),se=$('#g-subs');
    if(!se){se=document.createElement('div');se.id='g-subs';se.className='subs';ce.parentNode.appendChild(se)}
    if(F.ln&&!cl.some(function(l){return l.id===F.ln}))F.ln=null;
    if(cl.length>1){var sh='<div class="lbl">Subcategoria <span class="hint">(escolha uma)</span></div><div class="chips">';cl.forEach(function(l,i){sh+='<button type="button" class="chip" data-ln="'+l.id+'" aria-pressed="'+(F.ln===l.id)+'">'+esc(lnName(l,i))+'</button>'});se.innerHTML=sh+'</div>';se.hidden=false;
      $$('[data-ln]',se).forEach(function(b){b.onclick=function(){F.ln=b.dataset.ln;F.step=3;rLancar();$('#g-amt').focus()}})}
    else{se.innerHTML='';se.hidden=true;F.ln=cl.length===1?cl[0].id:null}
    chipsMeth();renderWhere(ct,dt);
    $('#g-ecur').innerHTML=curList().map(function(c){return '<button type="button" data-c="'+c+'" aria-pressed="'+(c===F.ecur)+'">'+curSym(c)+'</button>'}).join('');
    var m=mById(F.meth),cb=bById(F.cat),a=num($('#g-amt').value),diff=!!m&&m.cur!==F.ecur;
    [1,2,3].forEach(function(n){$('#s'+n).classList.toggle('on',F.step===n);$('#s'+n+' .stp-h').setAttribute('aria-expanded',String(F.step===n))});
    $('#sv1').innerHTML=m?esc(m.name)+' <small>'+money(balance(m),m.cur)+'</small>':'—';
    var cl2=catLines(F.cat),lx=lnById(F.ln);$('#sv2').textContent=cb?cb.name+(lx&&cl2.length>1?' › '+lnName(lx,cl2.indexOf(lx)):''):'—';
    $('#sv3').textContent=a>0?money(a,F.ecur):'informe o valor';
    $('#g-deb').hidden=!diff;
    if(diff){$('#g-debname').textContent=m.name;$('#g-debcur').textContent=m.cur;if(!F.debTouched)$('#g-debit').value=a>0?fin(conv(a,F.ecur,m.cur)):''}
    var needBrl=F.ecur!=='BRL'&&!(m&&m.cur==='BRL');
    $('#g-brl').hidden=!needBrl;
    if(needBrl&&!F.brlTouched)$('#g-brlv').value=a>0?fin(conv(a,F.ecur,'BRL')):'';
    var brlv=brlOf(a,m,diff);
    var cv='';
    if(a>0){cv='<div class="cvs">'+curList().map(function(c){var v=c==='BRL'?brlv:conv(a,F.ecur,c);return '<span class="cv'+(c===F.ecur?' on':'')+'"><small>'+c+'</small><b>'+money(v,c)+'</b></span>'}).join('')+'</div>';
      if(!diff&&m)cv+='<p class="hint" style="margin:6px 0 0">Sai de <b>'+esc(m.name)+'</b>: '+money(a,m.cur)+'</p>'}
    $('#g-conv').innerHTML=cv;
    var go=$('#g-go');
    go.textContent=F.edit?'Salvar alteração':(a>0?('Lançar '+money(a,F.ecur)+(cb?' · '+cb.name:'')):'Digite o valor');
    go.disabled=!(a>0);
    $('#g-cancel').hidden=!F.edit;
  }
  if(F.mode==='t'){
    var opts=S.methods.map(function(m){return '<option value="'+m.id+'">'+esc(m.name)+' ('+m.cur+')</option>'}).join('');
    var tf=$('#t-from'),tt=$('#t-to'),pf=tf.value,pt=tt.value;
    tf.innerHTML=opts;tt.innerHTML=opts;
    tf.value=mById(pf)?pf:(S.methods[0]&&S.methods[0].id);
    tt.value=mById(pt)?pt:(S.methods[1]?S.methods[1].id:tf.value);
    tUpdate();
  }
  if(F.mode==='a'){
    var am=$('#a-m'),pv=am.value;
    am.innerHTML=S.methods.map(function(m){return '<option value="'+m.id+'">'+esc(m.name)+' ('+m.cur+')</option>'}).join('');
    am.value=mById(pv)?pv:(S.methods[0]&&S.methods[0].id);
    aUpdate();
  }
}
function endEditTA(){F.editT=null;F.editA=null;F.tIn=false;['t-out','t-in','t-desc','a-real','a-desc'].forEach(function(i){var x=$('#'+i);if(x)x.value=''})}
function balEx(m,id){var all=S.entries;S.entries=all.filter(function(x){return x.id!==id});var b=balance(m);S.entries=all;return b}
function tUpdate(){
  var f=mById($('#t-from').value),t=mById($('#t-to').value);if(!f||!t)return;
  $('#t-out-cur').textContent=f.cur;$('#t-in-cur').textContent=t.cur;
  var out=num($('#t-out').value);
  $('#t-go').textContent=F.editT?'Salvar alteração':'Registrar';$('#t-cancel').hidden=!F.editT;
  if(!F.tIn)$('#t-in').value=out>0?fin(conv(out,f.cur,t.cur)):'';
}
function aUpdate(){
  var m=mById($('#a-m').value);if(!m)return;
  var cur=balEx(m,F.editA);$('#a-cur').textContent=m.cur;$('#a-go').textContent=F.editA?'Salvar alteração':'Corrigir saldo';$('#a-cancel').hidden=!F.editA;
  $('#a-now').textContent=(F.editA?'Saldo calculado sem esta correção: ':'Saldo calculado agora: ')+money(cur,m.cur)+(m.cur!=='EUR'?' · '+money(toEUR(cur,m.cur)):'');
  var real=num($('#a-real').value);
  $('#a-diff').textContent=isFinite(real)?('Ajuste de '+(real-cur>=0?'+':'')+money(real-cur,m.cur)):'';
}
function resetForm(){F.ln=null;F.legacy=false;F.brlTouched=false;$('#g-brlv').value='';F.step=1;F.ctouched=false;F.country=null;F.whereOpen=false;F.edit=null;F.debTouched=false;F.dateTouched=false;F.curTouched=false;$('#g-amt').value='';$('#g-debit').value='';$('#g-desc').value='';$('#g-date').value=dateDefault(F.cat)}
function brlOf(a,m,diff){
  if(!(a>0))return 0;
  if(F.ecur==='BRL')return a;
  if(m&&m.cur==='BRL'&&diff){var d=num($('#g-debit').value);return d>0?d:conv(a,F.ecur,'BRL')}
  var v=num($('#g-brlv').value);return(F.brlTouched&&v>0)?v:conv(a,F.ecur,'BRL')}
function submitG(){
  var m=mById(F.meth),a=num($('#g-amt').value);
  if(!m||!(a>0)){toast('Informe um valor maior que zero');$('#g-amt').focus();return}
  if(!F.cat){toast('Escolha uma categoria');return}
  if(catLines(F.cat).length>1&&!F.ln&&!F.legacy){toast('Escolha a subcategoria');F.step=2;rLancar();return}
  var diff=m.cur!==F.ecur,deb=diff?num($('#g-debit').value):a;
  if(!(deb>0))deb=conv(a,F.ecur,m.cur);
  snap();
  var e={id:F.edit||uid(),t:'g',date:$('#g-date').value||dateDefault(F.cat),m:m.id,cur:F.ecur,amt:r2(a),debit:r2(deb),cat:F.cat,ln:F.ln||null,desc:$('#g-desc').value.trim(),eur:Math.round(toEUR(a,F.ecur)*10000)/10000,usd:r2(conv(a,F.ecur,'USD')),brl:r2(brlOf(a,m,diff)),ctry:curCountry($('#g-date').value||dateDefault(F.cat)).name};
  if(F.edit){S.entries=S.entries.map(function(x){return x.id===F.edit?e:x})}else S.entries.push(e);
  S.last.cur=F.ecur;save();var was=F.edit;resetForm();render();
  toast((was?'Alterado: ':'Lançado: ')+money(a,e.cur)+(diff?' · debitado '+money(deb,m.cur):'')+' · '+(bById(e.cat)?bById(e.cat).name:''),true);
  $('#g-amt').focus();
}
function submitT(){
  var f=mById($('#t-from').value),t=mById($('#t-to').value),o=num($('#t-out').value),i=num($('#t-in').value);
  if(!f||!t||f.id===t.id){toast('Escolha meios diferentes');return}
  if(!(o>0)||!(i>0)){toast('Informe o valor que sai e o que entra');return}
  snap();var te={id:F.editT||uid(),t:'t',date:dateDefault(),from:f.id,to:t.id,out:r2(o),in:r2(i),desc:$('#t-desc').value.trim()};
  var wasT=F.editT;
  if(wasT){S.entries=S.entries.map(function(x){if(x.id===wasT){te.date=x.date;return te}return x})}else S.entries.push(te);
  save();endEditTA();if(wasT){F.mode='g'}render();
  toast((wasT?'Alterado: ':'Movido: ')+money(o,f.cur)+' → '+money(i,t.cur),true);
}
function submitA(){
  var m=mById($('#a-m').value),real=num($('#a-real').value);
  if(!m||!isFinite(real)){toast('Informe o saldo real');return}
  var d=r2(real-balEx(m,F.editA));if(d===0){toast('Saldo já confere');return}
  snap();var ae={id:F.editA||uid(),t:'a',date:dateDefault(),m:m.id,delta:d,desc:$('#a-desc').value.trim()||'Correção de saldo'};
  var wasA=F.editA;
  if(wasA){S.entries=S.entries.map(function(x){if(x.id===wasA){ae.date=x.date;return ae}return x})}else S.entries.push(ae);
  save();endEditTA();if(wasA){F.mode='g'}render();
  toast('Saldo de '+m.name+' corrigido ('+(d>=0?'+':'')+money(d,m.cur)+')',true);
}

/* ---------- RESUMO ---------- */
function preBuckets(){
  var B={br:{name:'Pago aqui, em reais',hint:'antes da viagem, em R$',planned:0,spent:0,spentB:0,cats:{}},out:{name:'Antecipado em outra moeda',hint:'antes da viagem, em € ou US$',planned:0,spent:0,spentB:0,cats:{}}};
  function row(k,c){return B[k].cats[c]||(B[k].cats[c]={p:0,s:0})}
  S.budget.forEach(function(l){if(l.when!=='pre')return;var k=l.cur==='BRL'?'br':'out',v=lEur(l);B[k].planned+=v;row(k,l.cat).p+=v});
  S.entries.forEach(function(e){if(e.t!=='g'||!isPre(e))return;var k=e.cur==='BRL'?'br':'out';B[k].spent+=e.eur;B[k].spentB+=entryBrl(e);row(k,e.cat).s+=e.eur});
  return B}
var selMeio=null;
function mhist(m){
  var rows=[],gast=0;
  S.entries.forEach(function(e){
    if(e.t==='g'&&e.m===m.id){var dd=debited(e),b=bById(e.cat),c=e.cur||m.cur;gast+=dd;
      rows.push({d:e.date,id:e.id,l:esc(b?b.name:'Sem categoria')+(isPre(e)?' <em class="tag">antes</em>':'')+(e.desc?' · '+esc(e.desc):''),m:esc(e.ctry||''),v:'−'+money(dd,m.cur),s:(c!==m.cur?'gasto de '+money(e.amt,c):'')})}
    else if(e.t==='t'){var f=mById(e.from),t=mById(e.to);
      if(e.from===m.id)rows.push({d:e.date,id:e.id,l:'Saque / saldo movido'+(e.desc?' · '+esc(e.desc):''),m:'para '+esc(t?t.name:'?'),v:'−'+money(e.out,m.cur),s:''});
      if(e.to===m.id)rows.push({d:e.date,id:e.id+'b',l:'Saque / saldo movido'+(e.desc?' · '+esc(e.desc):''),m:'de '+esc(f?f.name:'?'),v:'+'+money(e.in,m.cur),s:''})}
    else if(e.t==='a'&&e.m===m.id)rows.push({d:e.date,id:e.id,l:'Correção de saldo'+(e.desc&&e.desc!=='Correção de saldo'?' · '+esc(e.desc):''),m:'',v:(e.delta>=0?'+':'−')+money(Math.abs(e.delta),m.cur),s:''})});
  rows.sort(function(a,b){return a.d<b.d?1:a.d>b.d?-1:(a.id<b.id?1:-1)});
  var h='<div id="mh" style="display:grid;gap:8px;border-top:1px solid var(--line);padding-top:10px"><h3 style="font-size:1rem">Histórico · '+esc(m.name)+'</h3><div class="split3">'+
    '<div class="sp"><span>Saldo inicial</span><b>'+money(m.init,m.cur)+'</b></div>'+
    '<div class="sp"><span>Gasto neste meio</span><b>'+money(gast,m.cur)+'</b>'+(m.cur!=='EUR'?'<small>'+money(toEUR(gast,m.cur))+'</small>':'')+'</div>'+
    '<div class="sp"><span>Saldo atual</span><b>'+money(balance(m),m.cur)+'</b></div></div>';
  if(!rows.length)return h+'<p class="hint" style="margin:0">Nenhum movimento neste meio ainda.</p></div>';
  var cur='';h+='<div class="list">';
  rows.forEach(function(r){
    if(r.d!==cur){cur=r.d;h+='<div class="dh"><span>'+fmtDate(cur)+'</span><span></span></div>'}
    h+='<div class="it"><div>'+r.l+(r.m?'<div class="m">'+r.m+'</div>':'')+'</div><div class="v">'+r.v+(r.s?'<small>'+r.s+'</small>':'')+'</div></div>'});
  return h+'</div></div>'}
function rResumo(){
  var st=stats(),h='';
  var okSaldo=st.avail>=st.need,plan=st.budT/st.total;
  var cls,msg;
  if(!st.started||st.idx===0){
    cls='';msg='<b>A viagem ainda não começou.</b> Orçamento da viagem: '+both(st.budT)+' para '+st.total+' dias ('+money(plan)+' por dia). '+(okSaldo?'O dinheiro que você tem nos meios cobre o previsto.':'O dinheiro nos meios não cobre o previsto: faltam '+money(st.need-st.avail)+'.');
  }else{
    var over=st.proj-st.budT;
    if(st.rem<0){cls='bad';msg='<b>Orçamento estourado</b> em '+money(-st.rem)+'. Já gastou '+money(st.spentT)+' de '+money(st.budT)+'.'}
    else if(over<=0){cls='ok';msg='<b>No ritmo certo.</b> Gastando '+money(st.avg)+' por dia, você fecha em cerca de '+money(st.proj)+', abaixo dos '+money(st.budT)+' previstos.'}
    else if(over<=st.budT*0.1){cls='warn';msg='<b>Atenção ao ritmo.</b> Gastando '+money(st.avg)+' por dia, você fecha em cerca de '+money(st.proj)+', '+money(over)+' acima do previsto. Para ficar dentro, gaste até '+money(Math.max(0,st.perDay))+' por dia daqui em diante.'}
    else{cls='bad';msg='<b>Ritmo acima do orçamento.</b> Gastando '+money(st.avg)+' por dia, você fecha em cerca de '+money(st.proj)+', '+money(over)+' acima do previsto. Para ficar dentro, só '+money(Math.max(0,st.perDay))+' por dia daqui em diante.'}
    msg+=' '+(okSaldo?'O dinheiro nos meios cobre o que falta.':'<b>Atenção:</b> o dinheiro nos meios não cobre o que falta gastar ('+money(st.need-st.avail)+' a menos).');
  }
  h+='<div class="banner '+cls+'">'+msg+'</div>';
  var pct=st.budT>0?st.spentT/st.budT:0;
  h+='<div class="kpis">';
  h+='<div class="kpi"><span>Gasto na viagem</span><b>'+money(st.spentT)+'</b><span>'+money(st.spentTb,'BRL')+' · '+Math.round(pct*100)+'% do orçamento</span><div class="bar '+(pct>1?'bad':'')+'" style="margin-top:6px"><i style="width:'+Math.min(100,pct*100)+'%"></i></div></div>';
  h+='<div class="kpi '+(st.rem<0?'bad':'')+'"><span>Ainda posso gastar</span><b>'+money(st.rem)+'</b><span>'+brl(st.rem)+' · '+money(Math.max(0,st.perDay))+' por dia (' +st.left+' d)</span></div>';
  h+='</div>';
  h+='<div class="card"><h3>Dinheiro que tenho nos meios</h3><div class="split3">'+
   '<div class="sp"><span>Tenho agora</span><b>'+money(st.avail)+'</b><small>'+brl(st.avail)+'</small></div>'+
   '<div class="sp"><span>Falta gastar (previsto)</span><b>'+money(st.need)+'</b><small>'+brl(st.need)+'</small></div>'+
   '<div class="sp '+(okSaldo?'ok':'bad')+'"><span>'+(okSaldo?'Sobram':'Faltam')+'</span><b>'+money(Math.abs(st.avail-st.need))+'</b><small>'+brl(Math.abs(st.avail-st.need))+'</small></div>'+
   '</div><p class="hint" style="margin:0">Soma do que sobrou em Cash, Wise etc. (só os meios marcados como "contam").</p></div>';
  // médias por dia + categorias
  var pdAvg=st.idx>0?st.avg:null,pdLeft=st.perDay;
  var avgCls=pdAvg==null?'':(pdAvg>plan*1.1?'bad':(pdAvg>plan?'warn':'ok'));
  var leftCls=pdLeft<=0?'bad':(pdLeft<plan*0.85?'warn':'ok');
  h+='<div class="card"><h3>Onde estou gastando</h3>';
  h+='<div class="avgs"><div class="av"><span>Previsto por dia</span><b>'+money(plan)+'</b></div><div class="av '+avgCls+'"><span>Gasto por dia (média)</span><b>'+(pdAvg==null?'–':money(pdAvg))+'</b></div><div class="av '+leftCls+'"><span>Posso gastar por dia</span><b>'+money(Math.max(0,pdLeft))+'</b></div></div>';
  var flagTxt=[];
  if(pdAvg!=null&&pdAvg>plan)flagTxt.push('você está gastando '+money(pdAvg-plan)+' por dia a mais que o previsto');
  if(pdLeft<plan*0.85&&st.idx>0)flagTxt.push('o que sobra permite '+money(Math.max(0,pdLeft))+' por dia, abaixo dos '+money(plan)+' previstos');
  if(flagTxt.length)h+='<p class="alert">Atenção: '+flagTxt.join('; ')+'.</p>';
  var ids={};S.cats.forEach(function(c){ids[c.id]=1});
  var rows=S.cats.filter(function(c){return (st.bT[c.id]||0)>0||(st.byT[c.id]||0)>0}).map(function(c){
    var v=st.bT[c.id]||0,g=st.byT[c.id]||0,p=v>0?g/v:(g>0?9:0);
    var avg=st.idx>0?g/st.idx:null,pr=avg==null?0:avg*st.total,left=(v-g)/st.left;
    var lvl=g>v?'bad':((avg!=null&&pr>v*1.05)||p>0.85?'warn':'');
    return{c:c,v:v,g:g,p:p,avg:avg,pr:pr,left:left,lvl:lvl}}).sort(function(x,y){var o={bad:2,warn:1,'':0};return(o[y.lvl]-o[x.lvl])||(y.p-x.p)});
  rows.forEach(function(r){
    var tag=r.lvl==='bad'?(r.g>r.v?' <em class="tag bad">estourou</em>':''):(r.lvl==='warn'?' <em class="tag warn">atenção</em>':'');
    var extra=[];
    extra.push(r.avg==null?'sem gastos ainda':'média '+money(r.avg)+'/dia');
    extra.push(r.left>0?'pode gastar '+money(r.left)+'/dia':'sem saldo no orçamento');
    var proj=(r.avg!=null&&r.pr>r.v*1.05&&r.g<=r.v)?'<div class="m wn">No ritmo atual fecha em '+money(r.pr)+' ('+money(r.pr-r.v)+' acima do previsto).</div>':'';
    h+='<div class="cat '+r.lvl+'"><div class="l"><span>'+esc(r.c.name)+tag+'</span><span>'+Math.round(r.p*100)+'%</span></div><div class="bar '+r.lvl+'"><i style="width:'+Math.min(100,r.p*100)+'%"></i></div><div class="m">'+money(r.g)+' de '+money(r.v)+' · resta '+money(r.v-r.g)+'</div><div class="m">'+extra.join(' · ')+'</div>'+proj+'</div>'});
  if(!rows.length)h+='<p class="hint">Ainda não há gastos na viagem.</p>';
  h+='</div>';
  // antes da viagem
  var B=preBuckets();
  if(B.br.planned>0||B.br.spent>0||B.out.planned>0||B.out.spent>0){
    h+='<div class="card"><h3>Antes da viagem</h3><p class="hint">O que você paga ou já pagou daqui, antes de embarcar. Não entra no ritmo diário nem no dinheiro dos meios.</p>';
    ['br','out'].forEach(function(k){var b=B[k];if(!(b.planned>0||b.spent>0))return;
      var falta=b.planned-b.spent,cl=falta<-0.005?'warn':(falta>0.005?'bad':'ok');
      h+='<div class="pb"><div class="pbh"><b>'+b.name+'</b><span class="m">'+b.hint+'</span></div>';
      h+='<p class="gs">Pago <b>'+money(b.spent)+'</b> ('+money(b.spentB,'BRL')+') de <b>'+money(b.planned)+'</b> ('+brl(b.planned)+') · '+(falta>0.005?'<b class="bad">falta pagar '+money(falta)+' ('+brl(falta)+')</b>':(falta<-0.005?'<b class="warn">acima em '+money(-falta)+'</b>':'<b class="ok">tudo pago</b>'))+'</p>';
      Object.keys(b.cats).forEach(function(id){var r=b.cats[id],c=bById(id),f=r.p-r.s;
        h+='<div class="it"><div>'+esc(c?c.name:'?')+'</div><div class="v">'+money(r.s)+' de '+money(r.p)+'<small>'+(f>0.005?'falta '+money(f):(f<-0.005?'acima '+money(-f):'pago'))+'</small></div></div>'});
      h+='</div>'});
    h+='</div>';
  }
  h+='<div class="card"><h3>Quanto tenho em cada meio</h3><p class="hint" style="margin:0">Toque num meio para ver o histórico dele.</p><div class="mpills">';
  S.methods.forEach(function(m){var bl=balance(m),e=toEUR(bl,m.cur);
    h+='<button type="button" class="chip" data-pm="'+m.id+'" aria-pressed="'+(selMeio===m.id)+'">'+esc(m.name)+'<small>'+money(bl,m.cur)+(m.cur!=='EUR'?' · '+money(e):'')+(m.cnt?'':' · não conta')+'</small></button>'});
  h+='</div><div class="split3" style="margin-top:2px"><div class="sp"><span>Total dos meios que contam</span><b>'+money(st.avail)+'</b><small>'+brl(st.avail)+'</small></div></div>';
  if(selMeio&&mById(selMeio))h+=mhist(mById(selMeio));
  h+='</div>';
  h+='<details class="card"><summary>Como o cálculo funciona e dia de referência</summary><div style="display:grid;gap:8px;margin-top:8px">';
  h+='<p class="gs">Dia de referência: <b>'+fmtDate(st.ref)+'</b> (dia '+st.idx+' de '+st.total+'). Deixe vazio para usar a data de hoje durante a viagem, ou o último gasto lançado. Para simular, escolha um dia:</p>';
  h+='<label class="f" style="max-width:220px"><input type="date" id="r-ref" value="'+esc(S.refDate)+'" aria-label="Dia de referência"></label>';
  h+='<p class="hint">Gasto por dia = gasto da viagem ÷ dias decorridos. Posso gastar por dia = o que ainda resta do orçamento ÷ dias que faltam (contando o de referência). Gastos com data anterior ao início da viagem (' +fmtDate(S.trip.start)+') contam como "antes da viagem". O dinheiro dos meios "cobre" quando soma pelo menos o que falta gastar nas linhas marcadas como "sai do saldo dos meios".</p></div></details>';
  $('#v-resumo').innerHTML=h;
  $$('[data-pm]').forEach(function(bt){bt.onclick=function(){selMeio=(selMeio===bt.dataset.pm)?null:bt.dataset.pm;rResumo();var x=$('#mh');if(x&&selMeio)x.scrollIntoView({block:'nearest'})}});
  var rr=$('#r-ref');if(rr)rr.onchange=function(){S.refDate=this.value;save();render()};
}

/* ---------- EXTRATO ---------- */
var fxOpen=false;
var FX={q:'',type:'',when:'',cat:[],meth:[],ctry:[],from:'',to:''};
function fxCount(){var n=0;['q','type','when','from','to'].forEach(function(k){if(FX[k])n++});['cat','meth','ctry'].forEach(function(k){if(FX[k].length)n++});return n}
function fxReset(){FX.q='';FX.type='';FX.when='';FX.cat=[];FX.meth=[];FX.ctry=[];FX.from='';FX.to=''}
function fxMatch(e){
  if(FX.type&&e.t!==FX.type)return false;
  if(FX.cat.length&&!(e.t==='g'&&FX.cat.indexOf(e.cat)>-1))return false;
  if(FX.meth.length&&!(FX.meth.indexOf(e.m)>-1||FX.meth.indexOf(e.from)>-1||FX.meth.indexOf(e.to)>-1))return false;
  if(FX.ctry.length&&!(e.t==='g'&&FX.ctry.indexOf(e.ctry)>-1))return false;
  if(FX.when==='pre'&&!isPre(e))return false;
  if(FX.when==='trip'&&isPre(e))return false;
  if(FX.from&&e.date<FX.from)return false;
  if(FX.to&&e.date>FX.to)return false;
  if(FX.q){var c=bById(e.cat),m=mById(e.m),f=mById(e.from),t=mById(e.to);
    var hay=[e.desc,c&&c.name,m&&m.name,f&&f.name,t&&t.name,e.ctry,e.t==='t'?'saque transferência':'',e.t==='a'?'correção ajuste':''].join(' ').toLowerCase();
    if(hay.indexOf(FX.q.toLowerCase())<0)return false}
  return true}
function rExtrato(){
  var all=S.entries;
  if(!all.length){$('#v-extrato').innerHTML='<div class="card"><p class="hint">Nenhum lançamento ainda. Use a aba Lançar.</p></div>';return}
  function chip(group,val,text,on,sub){return '<button type="button" class="chip fch" data-fg="'+group+'" data-fv="'+esc(val)+'" aria-pressed="'+on+'">'+esc(text)+(sub?'<small>'+esc(sub)+'</small>':'')+'</button>'}
  var ctries={};all.forEach(function(e){if(e.ctry)ctries[e.ctry]=1});
  var used={};all.forEach(function(e){if(e.t==='g')used[e.cat]=1});
  var n=fxCount();
  var h='<div class="card fxb"><div class="fxs"><span class="hint" id="fx-sum"></span><button type="button" class="btn sec sm" id="fx-clr">Limpar filtros</button></div><details id="fx-d"'+(fxOpen?' open':'')+'><summary><span><b>Filtros</b>'+(n?' <em class="tag">'+n+' ativo'+(n>1?'s':'')+'</em>':'')+'</span><span class="chev" aria-hidden="true"></span></summary><div class="fxbody">'+
   '<label class="f">Buscar<input type="text" id="fx-q" value="'+esc(FX.q)+'" placeholder="descrição, categoria, meio, país"></label>'+
   '<div class="lbl">Tipo</div><div class="chips">'+chip('type','','Todos',!FX.type)+chip('type','g','Gastos',FX.type==='g')+chip('type','t','Saques',FX.type==='t')+chip('type','a','Correções de saldo',FX.type==='a')+'</div>'+
   '<div class="lbl">Quando</div><div class="chips">'+chip('when','','Qualquer época',!FX.when)+chip('when','pre','Antes da viagem',FX.when==='pre')+chip('when','trip','Durante a viagem',FX.when==='trip')+'</div>'+
   '<div class="lbl">Categoria <span class="hint">(pode escolher várias)</span></div><div class="chips">'+S.cats.map(function(c){return chip('cat',c.id,c.name,FX.cat.indexOf(c.id)>-1)}).join('')+'</div>'+
   '<div class="lbl">Meio de pagamento <span class="hint">(pode escolher vários)</span></div><div class="chips">'+S.methods.map(function(m){return chip('meth',m.id,m.name,FX.meth.indexOf(m.id)>-1)}).join('')+'</div>'+
   (Object.keys(ctries).length?'<div class="lbl">País</div><div class="chips">'+Object.keys(ctries).map(function(c){return chip('ctry',c,c,FX.ctry.indexOf(c)>-1)}).join('')+'</div>':'')+
   '<div class="lbl">Período</div><div class="fxg"><label class="f">De<input type="date" id="fx-from" value="'+esc(FX.from)+'"></label><label class="f">Até<input type="date" id="fx-to" value="'+esc(FX.to)+'"></label></div>'+
   '</div></details></div><div class="card" id="fx-list"></div>';
  $('#v-extrato').innerHTML=h;
  $$('.fch').forEach(function(b){b.onclick=function(){var g=b.dataset.fg,v=b.dataset.fv;
    if(g==='type'||g==='when')FX[g]=(FX[g]===v?'':v);
    else{var i=FX[g].indexOf(v);if(i>-1)FX[g].splice(i,1);else FX[g].push(v)}
    rExtrato()}});
  $('#fx-from').onchange=function(){FX.from=this.value;rExtrato()};
  $('#fx-to').onchange=function(){FX.to=this.value;rExtrato()};
  $('#fx-d').addEventListener('toggle',function(){fxOpen=this.open});
  $('#fx-q').addEventListener('input',function(){FX.q=this.value.trim();drawList();$('#fx-clr').hidden=!fxCount()});
  $('#fx-clr').onclick=function(){fxReset();rExtrato()};
  drawList();
}
function drawList(){
  var es=S.entries.filter(fxMatch).sort(function(a,b){return a.date<b.date?1:a.date>b.date?-1:(a.id<b.id?1:-1)});
  var gsum=0,gb=0,gn=0;es.forEach(function(e){if(e.t==='g'){gsum+=e.eur;gb+=entryBrl(e);gn++}});
  $('#fx-sum').textContent=(fxCount()?es.length+' de '+S.entries.length+' lançamentos':es.length+' lançamentos')+(gn?' · gastos '+money(gsum)+' ('+money(gb,'BRL')+')':'');
  $('#fx-clr').hidden=!fxCount();
  var L=$('#fx-list');
  if(!es.length){L.innerHTML='<p class="hint">Nenhum lançamento com esses filtros.</p>';return}
  var h='',cur='',dayTot={};
  es.forEach(function(e){if(e.t==='g'&&!isPre(e))dayTot[e.date]=(dayTot[e.date]||0)+e.eur});
  es.forEach(function(e){
    if(e.date!==cur){cur=e.date;h+='<div class="dh"><span>'+fmtDate(cur)+'</span><span>'+(dayTot[cur]?money(dayTot[cur]):'')+'</span></div>'}
    if(e.t==='g'){var m=mById(e.m),b=bById(e.cat),c=e.cur||(m?m.cur:'EUR');
      var sub=[];if(m&&m.cur!==c)sub.push('debitado '+money(debited(e),m.cur));if(c!=='EUR')sub.push('≈ '+money(e.eur));if(c!=='BRL')sub.push(money(entryBrl(e),'BRL'));
      var lq=e.ln?lnById(e.ln):null,cls=lq?catLines(e.cat):[],lt=lq&&cls.length>1?' › '+esc(lnName(lq,cls.indexOf(lq))):'';
      h+='<div class="it"><div>'+esc(b?b.name:'Sem categoria')+lt+(isPre(e)?' <em class="tag">antes</em>':'')+(e.desc?' · '+esc(e.desc):'')+'<div class="m">'+esc(m?m.name:'?')+(e.ctry?' · '+esc(e.ctry):'')+'</div></div><div class="v">'+money(e.amt,c)+(sub.length?'<small>'+sub.join(' · ')+'</small>':'')+'</div><div class="acts"><button class="btn sec sm" data-edit="'+e.id+'">Editar</button><button class="btn sec sm danger" data-del="'+e.id+'">Apagar</button></div></div>'}
    else if(e.t==='t'){var f=mById(e.from),t=mById(e.to);
      h+='<div class="it"><div>Saque / saldo movido'+(e.desc?' · '+esc(e.desc):'')+'<div class="m">'+esc(f?f.name:'?')+' → '+esc(t?t.name:'?')+'</div></div><div class="v">'+money(e.out,f?f.cur:'EUR')+'<small>→ '+money(e.in,t?t.cur:'EUR')+'</small></div><div class="acts"><button class="btn sec sm" data-editt="'+e.id+'">Editar</button><button class="btn sec sm danger" data-del="'+e.id+'">Apagar</button></div></div>'}
    else{var mm=mById(e.m);
      h+='<div class="it"><div>Correção de saldo'+(e.desc&&e.desc!=='Correção de saldo'?' · '+esc(e.desc):'')+'<div class="m">'+esc(mm?mm.name:'?')+'</div></div><div class="v">'+(e.delta>=0?'+':'')+money(e.delta,mm?mm.cur:'EUR')+'</div><div class="acts"><button class="btn sec sm" data-edita="'+e.id+'">Editar</button><button class="btn sec sm danger" data-del="'+e.id+'">Apagar</button></div></div>'}
  });
  L.innerHTML=h;
  $$('[data-del]',L).forEach(function(b){b.onclick=function(){snap();S.entries=S.entries.filter(function(x){return x.id!==b.dataset.del});save();render();toast('Lançamento apagado',true)}});
  $$('[data-editt]',L).forEach(function(b){b.onclick=function(){
    var e=S.entries.filter(function(x){return x.id===b.dataset.editt})[0];if(!e)return;
    endEditTA();F.mode='t';F.editT=e.id;F.tIn=true;setTab('lancar');
    $('#t-from').value=e.from;$('#t-to').value=e.to;$('#t-out').value=fin(e.out);$('#t-in').value=fin(e.in);$('#t-desc').value=e.desc||'';tUpdate()}});
  $$('[data-edita]',L).forEach(function(b){b.onclick=function(){
    var e=S.entries.filter(function(x){return x.id===b.dataset.edita})[0];if(!e)return;
    endEditTA();F.mode='a';F.editA=e.id;setTab('lancar');
    $('#a-m').value=e.m;var mm=mById(e.m);$('#a-real').value=fin(balEx(mm,e.id)+e.delta);$('#a-desc').value=e.desc||'';aUpdate()}});
  $$('[data-edit]',L).forEach(function(b){b.onclick=function(){
    var e=S.entries.filter(function(x){return x.id===b.dataset.edit})[0];if(!e)return;
    F.mode='g';F.step=3;F.whereOpen=false;F.ctouched=!!e.ctry;F.country=e.ctry||null;F.edit=e.id;F.cat=e.cat;F.ln=e.ln||null;F.legacy=!e.ln;F.meth=e.m;F.ecur=e.cur||'EUR';F.debTouched=true;F.dateTouched=true;F.curTouched=true;
    setTab('lancar');$('#g-amt').value=fin(e.amt);$('#g-date').value=e.date;$('#g-desc').value=e.desc||'';
    var m=mById(e.m);$('#g-debit').value=fin(debited(e));F.brlTouched=true;$('#g-brlv').value=fin(entryBrl(e));rLancar()}});
}

/* ---------- MEIOS ---------- */
var CV={a:'100',from:'EUR'};
function curUsed(code){return S.methods.some(function(m){return m.cur===code})||S.countries.some(function(c){return c.cur===code})||S.budget.some(function(l){return l.cur===code})||S.entries.some(function(e){return e.cur===code})}
function drawConv(){
  var a=num(CV.a),out=$('#cv-out');if(!out)return;
  if(!(a>=0)){out.innerHTML='<p class="hint">Digite um valor.</p>';return}
  out.innerHTML='<div class="cvs cvw">'+curList().map(function(c){return '<span class="cv'+(c===CV.from?' on':'')+'"><small>'+c+'</small><b>'+money(conv(a,CV.from,c),c)+'</b></span>'}).join('')+'</div>'+
   '<p class="hint" style="margin:6px 0 0">Cotações usadas (em R$): '+curList().filter(function(c){return c!=='BRL'}).map(function(c){return money(1,c)+' = '+money(brlPer(c),'BRL')}).join(' · ')+'</p>'}
function rMeios(){
  var h='<div class="card"><h3>Conversor de moedas</h3><p class="hint">Usa as cotações da seção Câmbio, logo abaixo. Euro, dólar e real ficam sempre disponíveis; as outras moedas você adiciona lá.</p><div class="amt" style="margin-top:4px"><input type="text" id="cv-amt" inputmode="decimal" value="'+esc(CV.a)+'" aria-label="Valor a converter" style="font-size:1.5rem;min-height:52px"><select id="cv-from" style="max-width:110px" aria-label="Moeda de origem">'+curOpts(CV.from)+'</select></div><div id="cv-out"></div></div>';
  h+='<div class="card"><h3>Câmbio</h3><div class="row2"><label class="f">1 US$ = quantos R$?<input type="text" inputmode="decimal" id="c-usd" value="'+fin4(S.rates.usdBrl)+'"></label><label class="f">1 € = quantos R$?<input type="text" inputmode="decimal" id="c-brl" value="'+fin4(S.rates.eurBrl)+'"></label></div><div class="acts" style="margin-top:10px"><button type="button" class="btn sec sm" id="fx-upd">↻ Atualizar cotações</button></div><div id="fx-prop"></div><p class="hint" id="fx-when">'+(S.ratesAt?'Cotações aplicadas em '+esc(S.ratesAt)+'.':'Cotações digitadas à mão.')+'</p><h3 style="margin-top:12px">Outras moedas</h3><p class="hint">Informe sempre quanto vale <b>1 unidade em R$</b>. As conversões entre dólar, euro e as outras moedas são calculadas a partir daí. Use para um país com moeda diferente de euro, dólar e real.</p>'+
  S.extra.map(function(x,i){return '<div class="xrow crow" data-x="'+i+'"><label class="f">1 '+esc(x.code)+' = quantos R$?<input type="text" inputmode="decimal" data-f="brl" value="'+fin4(x.brl)+'"></label><button type="button" class="btn sec sm danger" data-rm>Remover '+esc(x.code)+'</button></div>'}).join('')+
  '<div class="crow"><label class="f">Código (3 letras)<input type="text" id="x-code" maxlength="3" placeholder="GBP" style="text-transform:uppercase"></label><label class="f">1 unidade = quantos R$?<input type="text" id="x-rate" inputmode="decimal" placeholder="7,20"></label><button type="button" class="btn sm" id="x-add">Salvar moeda</button></div>'+
  '<p class="hint">Cada gasto guarda o valor em euro e em reais da hora em que foi lançado. Mudar o câmbio depois não altera os já lançados, mas os saldos e o orçamento passam a usar o novo valor.</p></div>';
  h+='<div class="card"><h3>Meios de pagamento</h3><p class="hint">Edite nome, moeda e saldo inicial antes da viagem. O saldo atual muda a cada lançamento e aparece nas três moedas.</p>';
  S.methods.forEach(function(m){
    var used=S.entries.some(function(e){return e.m===m.id||e.from===m.id||e.to===m.id});
    var b=balance(m),e=toEUR(b,m.cur);
    h+='<div class="mrow" data-m="'+m.id+'"><label class="f">Nome<input type="text" data-f="name" value="'+esc(m.name)+'"></label>'+
    '<label class="f">Moeda<select data-f="cur"'+(used?' disabled title="Já tem lançamentos"':'')+'>'+curOpts(m.cur)+'</select></label>'+
    '<label class="f">Saldo inicial<input type="text" inputmode="decimal" data-f="init" value="'+fin(m.init)+'"></label>'+
    '<button type="button" class="btn sec sm danger" data-rm="'+m.id+'">Remover</button>'+
    '<div class="hint" style="grid-column:1/-1">Saldo atual: <b>'+money(b,m.cur)+'</b>'+(m.cur!=='EUR'?' · '+money(e):'')+(m.cur!=='BRL'?' · '+brl(e):'')+'</div>'+
    '<label class="chk" style="grid-column:1/-1"><input type="checkbox" data-f="cnt"'+(m.cnt?' checked':'')+'> Conta no saldo disponível da viagem</label></div>'});
  h+='</div><div class="card"><h3>Novo meio</h3><div class="mrow"><label class="f">Nome<input type="text" id="n-name" placeholder="Ex.: Cartão de crédito A"></label><label class="f">Moeda<select id="n-cur">'+curOpts('EUR')+'</select></label><label class="f">Saldo inicial<input type="text" inputmode="decimal" id="n-init" placeholder="0,00"></label><button type="button" class="btn sm" id="n-add">Salvar meio</button></div></div>';
  h+='<div class="card"><h3>Países e moedas</h3><p class="hint">A moeda do país vem como padrão ao lançar. Dá para trocar em cada lançamento.</p>';
  S.countries.forEach(function(c,i){h+='<div class="crow" data-ci="'+i+'"><label class="f">País<input type="text" data-f="name" value="'+esc(c.name)+'"></label><label class="f">Moeda<select data-f="cur">'+curOpts(c.cur)+'</select></label><button type="button" class="btn sec sm danger" data-rm>Remover</button></div>'});
  h+='<div class="crow"><label class="f">Novo país<input type="text" id="cn-name" placeholder="Ex.: Albânia"></label><label class="f">Moeda<select id="cn-cur">'+curOpts('EUR')+'</select></label><button type="button" class="btn sm" id="cn-add">Salvar país</button></div></div>';
  h+='<div class="card"><h3>Roteiro: país por data</h3><p class="hint">Cada linha vale a partir da data indicada, até a próxima. É daqui que o site tira o país de cada lançamento.</p>';
  S.route.forEach(function(r,i){h+='<div class="crow" data-ri="'+i+'"><label class="f">A partir de<input type="date" data-f="from" value="'+esc(r.from)+'"></label><label class="f">País<select data-f="c">'+S.countries.map(function(c){return '<option'+(c.name===r.c?' selected':'')+'>'+esc(c.name)+'</option>'}).join('')+'</select></label><button type="button" class="btn sec sm danger" data-rm>Remover</button></div>'});
  h+=''+(D.route?'<div class="crow draft"><label class="f">A partir de<input type="date" id="r-from" value="'+esc(S.trip.start)+'"></label><label class="f">País<select id="r-c">'+S.countries.map(function(c){return '<option>'+esc(c.name)+'</option>'}).join('')+'</select></label><button type="button" class="btn sm" id="r-save">Salvar</button><button type="button" class="btn sec sm" id="r-cancel">Cancelar</button></div>':'<div class="acts"><button type="button" class="btn sec sm" id="r-add">+ Nova mudança de país</button></div>')+'</div>';
  h+='<div class="card"><h3>Dados e backup</h3><p class="hint">Com o login Google (faixa no topo), os dados sincronizam entre os seus aparelhos e ficam também neste. Exporte um JSON para ter uma cópia de segurança.</p><div class="acts"><button type="button" class="btn sec sm" id="d-exp">Exportar JSON</button><label class="btn sec sm" style="display:inline-flex;align-items:center;cursor:pointer">Importar JSON<input type="file" id="d-imp" accept="application/json" hidden></label><button type="button" class="btn sec sm danger" id="d-clr">Apagar lançamentos</button><button type="button" class="btn sec sm danger" id="d-rst">Restaurar tudo ao padrão</button></div></div>';
  $('#v-meios').innerHTML=h;
  $$('.mrow[data-m]').forEach(function(row){var m=mById(row.dataset.m);
    $$('[data-f]',row).forEach(function(i){i.onchange=function(){
      var f=i.dataset.f;if(f==='name')m.name=i.value.trim()||m.name;
      else if(f==='cur')m.cur=i.value;
      else if(f==='dcur')m.dcur=i.value;
      else if(f==='init'){var v=num(i.value);if(isFinite(v))m.init=r2(v)}
      else if(f==='cnt')m.cnt=i.checked;
      save();render()}});
    $('[data-rm]',row).onclick=function(){
      var used=S.entries.some(function(e){return e.m===m.id||e.from===m.id||e.to===m.id});
      if(used){alert('Este meio já tem lançamentos. Apague-os antes ou apenas desmarque "Conta no saldo".');return}
      if(confirm('Remover '+m.name+'?')){S.methods=S.methods.filter(function(x){return x.id!==m.id});save();render()}}});
  $('#n-add').onclick=function(){var n=$('#n-name').value.trim();if(!n){toast('Dê um nome ao meio');return}
    var v=num($('#n-init').value);S.methods.push({id:uid(),name:n,cur:$('#n-cur').value,dcur:$('#n-cur').value,init:isFinite(v)?r2(v):0,cnt:true});save();render()};
  $$('.crow[data-ci]').forEach(function(row){var i=+row.dataset.ci,c=S.countries[i];
    $$('[data-f]',row).forEach(function(inp){inp.onchange=function(){if(inp.dataset.f==='name'){var nn=inp.value.trim();if(nn){S.route.forEach(function(r){if(r.c===c.name)r.c=nn});c.name=nn}}else c.cur=inp.value;save();render()}});
    $('[data-rm]',row).onclick=function(){if(S.route.some(function(r){return r.c===c.name})){alert('Este país está no roteiro. Troque ou remova essa data antes.');return}if(S.countries.length<2)return;S.countries.splice(i,1);save();render()}});
  $$('.crow[data-ri]').forEach(function(row){var i=+row.dataset.ri,r=S.route[i];
    $$('[data-f]',row).forEach(function(inp){inp.onchange=function(){if(inp.dataset.f==='from'){if(inp.value)r.from=inp.value}else r.c=inp.value;save();render()}});
    $('[data-rm]',row).onclick=function(){if(S.route.length<2)return;S.route.splice(i,1);save();render()}});
  $('#cn-add').onclick=function(){var n=$('#cn-name').value.trim();if(!n||countryByName(n)){toast('Informe um nome novo');return}S.countries.push({name:n,cur:$('#cn-cur').value});save();render()};
  if($('#r-add'))$('#r-add').onclick=function(){D.route=true;render()};
  if($('#r-save')){$('#r-cancel').onclick=function(){D.route=false;render()};$('#r-save').onclick=function(){S.route.push({from:$('#r-from').value||S.trip.start,c:$('#r-c').value});S.route.sort(function(a,b){return a.from<b.from?-1:1});D.route=false;save();render()}}
  addCancels([['n-add'],['x-add'],['cn-add']]);
  $('#cv-amt').addEventListener('input',function(){CV.a=this.value;drawConv()});
  $('#cv-from').onchange=function(){CV.from=this.value;drawConv()};
  drawConv();
  $$('.xrow[data-x]').forEach(function(row){var i=+row.dataset.x,x=S.extra[i];
    $('[data-f=brl]',row).onchange=function(){var v=num(this.value);if(v>0){x.brl=v;save();render()}};
    $('[data-rm]',row).onclick=function(){if(curUsed(x.code)){alert('A moeda '+x.code+' está em uso (meio, país, orçamento ou lançamento). Troque antes de remover.');return}S.extra.splice(i,1);save();render()}});
  $('#x-add').onclick=function(){var c=($('#x-code').value||'').trim().toUpperCase(),v=num($('#x-rate').value);
    if(!/^[A-Z]{3}$/.test(c)){toast('Use o código de 3 letras, como GBP');return}
    if(curList().indexOf(c)>-1){toast('Essa moeda já existe');return}
    if(!(v>0)){toast('Informe quantos R$ vale 1 '+c);return}
    S.extra.push({code:c,brl:v});save();render();toast('Moeda adicionada: '+c)};
  $('#fx-upd').onclick=function(){
    var btn=this,box=$('#fx-prop');btn.disabled=true;box.innerHTML='<p class="hint">Buscando a cotação média do dia…</p>';
    var syms=['USD','BRL'].concat(S.extra.map(function(x){return x.code}));
    function tm(u){var c=new AbortController(),t=setTimeout(function(){c.abort()},8000);return fetch(u,{signal:c.signal}).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http '+r.status);return r.json()})}
    tm('https://api.frankfurter.dev/v1/latest?base=EUR&symbols='+syms.join(',')).then(function(j){return{rates:j.rates,date:j.date,src:'Banco Central Europeu (frankfurter.dev)'}})
    .catch(function(){return tm('https://open.er-api.com/v6/latest/EUR').then(function(j){return{rates:j.rates,date:(j.time_last_update_utc||'').slice(5,16),src:'open.er-api.com'}})})
    .then(function(o){
      var r=o.rates||{};if(!(r.USD>0)||!(r.BRL>0))throw new Error('sem dados');
      var R4=function(v){return Math.round(v*10000)/10000},P={usdBrl:R4(r.BRL/r.USD),eurBrl:R4(r.BRL),extra:{}};
      S.extra.forEach(function(x){if(r[x.code]>0)P.extra[x.code]=R4(r.BRL/r[x.code])});
      var ln=['1 US$ = R$ '+fin4(P.usdBrl),'1 € = R$ '+fin4(P.eurBrl)].concat(Object.keys(P.extra).map(function(c){return '1 '+c+' = R$ '+fin4(P.extra[c])}));
      box.innerHTML='<div class="alert" style="margin-top:8px"><b>Cotação média do dia</b> ('+esc(o.src)+', '+esc(o.date||'hoje')+')<br>'+ln.map(esc).join(' · ')+'<br><span class="hint">É a cotação média de mercado; o cartão da Wise cobra uma taxa pequena por cima. Depois de aplicar, você ainda pode ajustar à mão.</span><div class="acts" style="margin-top:8px"><button type="button" class="btn sm" id="fx-ok">Aplicar</button><button type="button" class="btn sec sm" id="fx-no">Cancelar</button></div></div>';
      $('#fx-no').onclick=function(){box.innerHTML=''};
      $('#fx-ok').onclick=function(){S.rates.usdBrl=P.usdBrl;S.rates.eurBrl=P.eurBrl;S.extra.forEach(function(x){if(P.extra[x.code])x.brl=P.extra[x.code]});
        var d=new Date();S.ratesAt=('0'+d.getDate()).slice(-2)+'/'+('0'+(d.getMonth()+1)).slice(-2)+'/'+d.getFullYear()+' ('+(o.src.indexOf('frankfurter')>-1?'BCE':'open.er-api')+')';save();render();toast('Cotações atualizadas')};
    }).catch(function(){box.innerHTML='<p class="hint" style="color:var(--c-warn)">Não consegui buscar a cotação agora (sem internet?). Os valores atuais continuam; você pode digitar à mão.</p>'})
    .then(function(){btn.disabled=false});
  };
  $('#c-usd').onchange=function(){var v=num(this.value);if(v>0){S.rates.usdBrl=v;save();render()}};
  $('#c-brl').onchange=function(){var v=num(this.value);if(v>0){S.rates.eurBrl=v;save();render()}};
  $('#d-exp').onclick=function(){var b=new Blob([JSON.stringify(S,null,1)],{type:'application/json'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='gastos-balcas-2027.json';document.body.appendChild(a);a.click();a.remove()};
  $('#d-imp').onchange=function(){var f=this.files[0];if(!f)return;var r=new FileReader();r.onload=function(){try{var o=JSON.parse(r.result);if(o&&(o.v===1||o.v===2||o.v===3)&&o.methods&&o.budget&&o.entries){S=migrate(o);save();render();toast('Dados importados')}else toast('Arquivo inválido')}catch(e){toast('Arquivo inválido')}};r.readAsText(f)};
  $('#d-clr').onclick=function(){if(confirm('Apagar todos os lançamentos? Meios e orçamento ficam. Vale também para a nuvem e para os outros aparelhos.')){S.entries=[];save();render()}};
  $('#d-rst').onclick=function(){if(confirm('Restaurar meios, orçamento e lançamentos ao padrão? Vale também para a nuvem e para os outros aparelhos.')){S=defaults();save();render()}};
}

/* ---------- ORÇAMENTO ---------- */
function whenOpts(sel){return '<option value="trip"'+(sel==='trip'?' selected':'')+'>Durante a viagem</option><option value="pre"'+(sel==='pre'?' selected':'')+'>Antes da viagem</option>'}
function lineRow(l,n){
  return '<div class="brow lr" data-l="'+l.id+'"><div class="lh">Linha '+n+'</div><label class="f nm">Nome da linha (subcategoria)<input type="text" data-f="label" value="'+esc(l.label)+'" placeholder="Ex.: Hotel de Zagreb"></label>'+
  '<div class="qu"><label class="f">Quantidade<input type="text" inputmode="decimal" data-f="qty" value="'+finq(l.qty)+'"></label><label class="f">Valor unitário<input type="text" inputmode="decimal" data-f="unit" value="'+fin(l.unit)+'"></label><div class="f qt"><span>Total</span><b>'+money(l.val,l.cur)+'</b>'+(l.cur!=='EUR'?'<small>≈ '+both(lEur(l))+'</small>':'')+'</div></div>'+
  '<label class="f">Moeda<select data-f="cur">'+curOpts(l.cur)+'</select></label><label class="f">Quando paga<select data-f="when">'+whenOpts(l.when)+'</select></label>'+
  (l.when==='trip'?'<label class="chk"><input type="checkbox" data-f="bal"'+(l.bal?' checked':'')+'> sai do dinheiro dos meios</label>':'<span class="hint">paga daqui'+(l.cur==='BRL'?', em reais':', em '+l.cur)+'</span>')+
  '<button type="button" class="btn sec sm danger" data-rml="'+l.id+'">Remover linha</button></div>'}
var orcView='tab';try{orcView=sessionStorage.getItem('gx-orc')||'tab'}catch(e){}
function orcSeg(){return '<div class="seg orcseg" role="group" aria-label="Visão do orçamento"><button type="button" data-ov="tab" aria-pressed="'+(orcView==='tab')+'">Ver tabela</button><button type="button" data-ov="edit" aria-pressed="'+(orcView==='edit')+'">Configurar orçamento</button></div>'}
function bindSeg(){$$('[data-ov]',$('#v-orc')).forEach(function(b){b.onclick=function(){orcView=b.dataset.ov;try{sessionStorage.setItem('gx-orc',orcView)}catch(e){}rOrc();window.scrollTo(0,0)}})}
function ms(v){return new Intl.NumberFormat('pt-BR',{style:'currency',currency:'EUR',minimumFractionDigits:2,maximumFractionDigits:2}).format(v||0)}
function rOrcTab(){
  var st=stats(),B=preBuckets(),h=orcSeg();
  function cell(v,cls){return '<td class="'+(cls||'')+'">'+ms(v)+'</td>'}
  h+='<div class="card"><h3>Orçamento em tabela</h3><p class="hint">Valores em euro, arredondados. Previsto vem das linhas do orçamento; gasto vem dos lançamentos (antes e durante a viagem). Para mudar valores, moedas ou linhas, toque em uma categoria ou em "Configurar orçamento".</p><div class="tblw"><table class="otbl"><thead><tr><th>Item</th><th>Previsto</th><th>Gasto</th><th>Resta</th></tr></thead><tbody>';
  S.cats.forEach(function(c){
    var ls=S.budget.filter(function(l){return l.cat===c.id}),plan=(st.bT[c.id]||0)+(st.bP[c.id]||0),sp=st.by[c.id]||0,rest=plan-sp;
    h+='<tr class="oc go'+(plan===0&&sp===0?' zero':'')+'" data-goc="'+c.id+'"><td>'+esc(c.name)+'</td>'+cell(plan,'cp')+cell(sp,'cg')+cell(rest,rest<-0.005?'neg cr':(rest>0.005?'cr':'cz'))+'</tr>';
    var showLines=ls.length>1||(ls[0]&&(ls[0].label||ls[0].cur!=='EUR'||ls[0].when==='pre'));
    if(showLines)ls.forEach(function(l){
      h+='<tr class="ol"><td>'+esc(l.label||'(sem descrição)')+(l.qty!==1?' <span class="qx">'+finq(l.qty)+' × '+money(l.unit,l.cur)+'</span>':'')+' <em class="tag">'+(l.when==='pre'?'antes':'durante')+'</em></td><td>'+ms(lEur(l))+(l.cur!=='EUR'?'<small>'+money(l.val,l.cur)+'</small>':'')+'</td><td></td><td></td></tr>'})});
  var tp=B.br.planned+B.out.planned+st.budT,ts=B.br.spent+B.out.spent+st.spentT;
  function tot(name,p,s,cls){var r=p-s;return '<tr class="ot '+(cls||'')+'"><td>'+name+'</td>'+cell(p,'cp')+cell(s,'cg')+cell(r,r<-0.005?'neg cr':(r>0.005?'cr':'cz'))+'</tr>'}
  h+='</tbody><tfoot>'+tot('Antes da viagem · pago aqui em R$',B.br.planned,B.br.spent)+tot('Antes da viagem · outra moeda',B.out.planned,B.out.spent)+tot('Durante a viagem',st.budT,st.spentT)+tot('Total geral',tp,ts,'gt')+'</tfoot></table></div>';
  h+='<p class="hint">Em reais: previsto '+brl(tp)+' · gasto '+money(st.spentTb+st.spentPb,'BRL')+'.</p><div class="acts"><button type="button" class="btn" data-ov="edit">Configurar orçamento</button></div></div>';
  $('#v-orc').innerHTML=h;bindSeg();
  $$('[data-goc]').forEach(function(r){r.onclick=function(){orcView='edit';try{sessionStorage.setItem('gx-orc','edit')}catch(e){}rOrc();var t=$('[data-c="'+r.dataset.goc+'"]');if(t)t.scrollIntoView({block:'start'})}});
}
function rOrc(){
  if(orcView==='tab'){rOrcTab();return}
  var st=stats(),h='',br=0,out=0,tr=0;
  S.budget.forEach(function(l){var v=lEur(l);if(l.when==='pre'){if(l.cur==='BRL')br+=v;else out+=v}else tr+=v});
  h+='<div class="alert" style="border-color:var(--accent)"><b>Como funciona:</b> a categoria <b>não tem valor próprio</b>. O total dela é sempre a <b>soma das linhas</b> que estão dentro dela. Preencha quantidade e valor unitário em cada linha e, para detalhar (por exemplo, vários hotéis em Hospedagem), toque em <b>+ Linha</b>. Cada linha tem a própria moeda e o próprio momento de pagamento.</div>';
  h+='<div class="card"><h3>Como o orçamento está dividido</h3><div class="split3">'+
   '<div class="sp"><span>Pago aqui, em reais</span><b>'+money(br*S.rates.eurBrl,'BRL')+'</b><small>'+money(br)+' · antes da viagem</small></div>'+
   '<div class="sp"><span>Antecipado, outra moeda</span><b>'+money(out)+'</b><small>antes da viagem, em € ou US$</small></div>'+
   '<div class="sp"><span>Durante a viagem</span><b>'+money(tr)+'</b><small>'+brl(tr)+' · sai dos meios</small></div></div>'+
   '<p class="gs">Total: <b>'+both(br+out+tr)+'</b>. Cada categoria pode ter várias linhas, com valor, moeda e momento próprios. Assim a hospedagem, por exemplo, pode ter hotéis pagos antes e outros pagos na viagem.</p></div>';
  h+='<div class="card"><h3>+ Nova categoria</h3><p class="hint">Vira uma opção na hora de lançar. Os valores abaixo viram a primeira linha da categoria; depois você pode adicionar mais linhas, e o total será a soma delas.</p><div class="brow"><label class="f nm">Nome<input type="text" id="b-name" placeholder="Ex.: Souvenirs"></label><label class="f">Quantidade<input type="text" inputmode="decimal" id="b-qty" value="1"></label><label class="f">Valor unitário<input type="text" inputmode="decimal" id="b-unit" placeholder="0,00"></label><label class="f">Moeda<select id="b-cur">'+curOpts('EUR')+'</select></label><label class="f">Quando paga<select id="b-when">'+whenOpts('trip')+'</select></label><button type="button" class="btn sm" id="b-add">Salvar categoria</button></div></div>';
  S.cats.forEach(function(c){
    var ls=S.budget.filter(function(l){return l.cat===c.id}),pre=0,tri=0;
    ls.forEach(function(l){if(l.when==='pre')pre+=lEur(l);else tri+=lEur(l)});
    h+='<div class="card" data-c="'+c.id+'"><div class="chd"><label class="f nm">Categoria<input type="text" data-cn value="'+esc(c.name)+'"></label><button type="button" class="btn sec sm danger" data-rmc="'+c.id+'">Remover categoria</button></div>'+
       '<div class="ctot"><div><span>Total da categoria</span><small>soma de '+ls.length+(ls.length===1?' linha':' linhas')+'</small></div><div class="ctv"><b>'+money(tri+pre)+'</b><small>'+(tri+pre===0?'sem valor previsto':[tri>0?'durante '+money(tri):'',pre>0?'antes '+money(pre):''].filter(Boolean).join(' · '))+'</small></div></div>';
    ls.forEach(function(l,ix){h+=lineRow(l,ix+1)});
    if(D.line===c.id)h+='<div class="brow lr draft"><div class="lh">Nova linha em '+esc(c.name)+'</div><label class="f nm">Nome da linha (subcategoria)<input type="text" id="dl-label" placeholder="Ex.: Hotel de Zagreb"></label><div class="qu"><label class="f">Quantidade<input type="text" inputmode="decimal" id="dl-qty" value="1"></label><label class="f">Valor unitário<input type="text" inputmode="decimal" id="dl-unit" placeholder="0,00"></label></div><label class="f">Moeda<select id="dl-cur">'+curOpts('EUR')+'</select></label><label class="f">Quando paga<select id="dl-when">'+whenOpts('trip')+'</select></label><div class="acts"><button type="button" class="btn sm" id="dl-save">Salvar linha</button><button type="button" class="btn sec sm" id="dl-cancel">Cancelar</button></div></div>';
  else h+='<div class="acts"><button type="button" class="btn sec sm" data-addl="'+c.id+'">+ Linha em '+esc(c.name)+'</button></div>';
  h+='</div>'});
  h+='<div class="acts"><button type="button" class="btn sec sm" id="b-rst">Restaurar orçamento padrão</button></div>';
  $('#v-orc').innerHTML=orcSeg()+h;bindSeg();
  $$('.brow[data-l]').forEach(function(row){var l=S.budget.filter(function(x){return x.id===row.dataset.l})[0];if(!l)return;
    $$('[data-f]',row).forEach(function(i){i.onchange=function(){var f=i.dataset.f;
      if(f==='label')l.label=i.value.trim();
      else if(f==='qty'){var q=num(i.value);if(isFinite(q)&&q>=0){l.qty=Math.round(q*1000)/1000;l.val=r2(l.qty*l.unit)}}
      else if(f==='unit'){var u=num(i.value);if(isFinite(u)&&u>=0){l.unit=r2(u);l.val=r2(l.qty*l.unit)}}
      else if(f==='cur')l.cur=i.value;
      else if(f==='when'){l.when=i.value;l.bal=i.value==='trip'}
      else l.bal=i.checked;
      save();render()}});
    $('[data-rml]',row).onclick=function(){S.budget=S.budget.filter(function(x){return x.id!==l.id});save();render()}});
  $$('[data-cn]').forEach(function(i){i.onchange=function(){var c=bById(i.closest('[data-c]').dataset.c);if(c&&i.value.trim()){c.name=i.value.trim();save();render()}}});
  $$('[data-rmc]').forEach(function(b){b.onclick=function(){var c=bById(b.dataset.rmc);
    if(S.entries.some(function(e){return e.cat===c.id})){alert('Há lançamentos nesta categoria. Apague-os antes.');return}
    if(confirm('Remover '+c.name+' e as linhas dela?')){S.cats=S.cats.filter(function(x){return x.id!==c.id});S.budget=S.budget.filter(function(l){return l.cat!==c.id});save();render()}}});
  $$('[data-addl]').forEach(function(b){b.onclick=function(){D.line=b.dataset.addl;render();var x=$('#dl-label');if(x)x.focus()}});
  if($('#dl-save')){$('#dl-cancel').onclick=function(){D.line=null;render()};
    $('#dl-save').onclick=function(){var q=num($('#dl-qty').value),v=num($('#dl-unit').value),w=$('#dl-when').value;if(!(q>=0))q=1;if(!isFinite(v)||v<0)v=0;
      S.budget.push({id:uid(),cat:D.line,label:$('#dl-label').value.trim(),qty:q,unit:r2(v),val:r2(q*v),cur:$('#dl-cur').value,when:w,bal:w==='trip'});D.line=null;save();render();toast('Linha salva')}}
  addCancels([['b-add']]);
  $('#b-add').onclick=function(){var n=$('#b-name').value.trim(),q=num($('#b-qty').value),v=num($('#b-unit').value);if(!(q>=0))q=1;if(!n){toast('Dê um nome à categoria');$('#b-name').focus();return}
    var id=uid(),w=$('#b-when').value;S.cats.push({id:id,name:n});S.budget.push({id:uid(),cat:id,label:'',qty:q,unit:isFinite(v)&&v>=0?r2(v):0,val:isFinite(v)&&v>=0?r2(q*v):0,cur:$('#b-cur').value,when:w,bal:w==='trip'});save();render();toast('Categoria adicionada: '+n)};
  $('#b-rst').onclick=function(){if(confirm('Restaurar o orçamento padrão? Os lançamentos ficam, mas categorias e linhas criadas saem do orçamento.')){S.cats=defCats();S.budget=defLines();save();render()}};
}

/* ---------- render ---------- */
function pillify(root){
  $$('select',root).forEach(function(sel){
    var o=[].map.call(sel.options,function(x){return x.value});
    if(o.length<3||!o.every(function(v){return curList().indexOf(v)>-1}))return;
    if(sel.dataset.pl)return;sel.dataset.pl='1';sel.hidden=true;
    var g=document.createElement('div');g.className='cs cpl';g.setAttribute('role','group');
    o.forEach(function(v){var b=document.createElement('button');b.type='button';b.textContent=v==='EUR'?'€':v==='USD'?'US$':v==='BRL'?'R$':v;b.title=v;
      b.setAttribute('aria-pressed',sel.value===v?'true':'false');b.disabled=sel.disabled;
      b.onclick=function(e){e.preventDefault();if(sel.value===v)return;sel.value=v;
        [].forEach.call(g.children,function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
        sel.dispatchEvent(new Event('change',{bubbles:true}))};
      g.appendChild(b)});
    sel.parentNode.insertBefore(g,sel.nextSibling)})}
(function(){['#v-meios','#v-orc'].forEach(function(id){var el=$(id);if(!el||!window.MutationObserver)return;new MutationObserver(function(){pillify(el)}).observe(el,{childList:true,subtree:true})})})();
function render(){
  $$('.gx-tabs button').forEach(function(b){b.setAttribute('aria-selected',String(b.dataset.tab===tab))});
  $$('.view').forEach(function(v){v.hidden=v.id!=='v-'+tab});
  if(tab==='lancar')rLancar();else if(tab==='resumo')rResumo();else if(tab==='extrato')rExtrato();else if(tab==='meios')rMeios();else if(tab==='orc')rOrc();
}

/* ---------- ligações do formulário ---------- */
$('#t-cancel').onclick=function(){endEditTA();F.mode='g';render();setTab('extrato')};
$('#a-cancel').onclick=function(){endEditTA();F.mode='g';render();setTab('extrato')};
$$('[data-mode]').forEach(function(b){b.onclick=function(){F.mode=b.dataset.mode;if(F.mode==='g')F.step=1;endEditTA();render();if(F.mode==='g'){$('#g-amt').focus()}else{window.scrollTo(0,0)}}});
$('#g-ecur').addEventListener('click',function(ev){var b=ev.target.closest('button');if(!b)return;F.ecur=b.dataset.c;F.curTouched=true;F.debTouched=false;F.brlTouched=false;rLancar();$('#g-amt').focus()});
$('#g-amt').addEventListener('input',function(){F.debTouched=false;F.brlTouched=false;rLancar()});
$('#g-brlv').addEventListener('input',function(){F.brlTouched=true;rLancar()});
$('#g-debit').addEventListener('input',function(){F.debTouched=true;rLancar()});
$('#g-date').addEventListener('change',function(){F.dateTouched=true;rLancar()});
$$('.stp-h').forEach(function(b){b.onclick=function(){F.step=+b.dataset.step;rLancar();if(F.step===3)$('#g-amt').focus()}});
$('#g-form').addEventListener('submit',function(e){e.preventDefault();submitG()});
$('#g-cancel').onclick=function(){resetForm();render()};
$('#t-form').addEventListener('submit',function(e){e.preventDefault();submitT()});
$('#a-form').addEventListener('submit',function(e){e.preventDefault();submitA()});
$('#t-from').onchange=$('#t-to').onchange=function(){F.tIn=false;tUpdate()};
$('#t-out').addEventListener('input',function(){F.tIn=!!F.editT;tUpdate()});
$('#t-in').addEventListener('input',function(){F.tIn=true});
$('#a-m').onchange=aUpdate;$('#a-real').addEventListener('input',aUpdate);
$('#g-date').value=dateDefault(null);
render();
if(tab==='lancar'&&F.mode==='g'){try{$('#g-amt').focus({preventScroll:true})}catch(e){}}
})();
