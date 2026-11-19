/* Balcãs 2027 · Diário de check-ins: GPS + OpenStreetMap (sem Google), foto, estrelas, nota, linha do tempo e mapa. */
(function(){
'use strict';
function $(s,r){return (r||document).querySelector(s)}
function $$(s,r){return [].slice.call((r||document).querySelectorAll(s))}
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}
var WD=['Dom','Seg','Ter','Qua','Qui','Sex','Sáb'];
function p2(n){return (n<10?'0':'')+n}
function nowLocal(){var d=new Date();return d.getFullYear()+'-'+p2(d.getMonth()+1)+'-'+p2(d.getDate())+'T'+p2(d.getHours())+':'+p2(d.getMinutes())}
function dayLabel(ds){var d=new Date(ds+'T12:00:00');return WD[d.getDay()]+' '+p2(d.getDate())+'/'+p2(d.getMonth()+1)}
function timeOf(ts){return ts.slice(11,16)}
function stars(r){r=+r||0;if(!r)return '';return '<span class="sth" style="--p:'+(r/5*100)+'%" title="'+r+' de 5">★★★★★</span>'}
function dist(a,b,c,d){var R=6371000,x=(c-a)*Math.PI/180,y=(d-b)*Math.PI/180,s=Math.sin(x/2)*Math.sin(x/2)+Math.cos(a*Math.PI/180)*Math.cos(c*Math.PI/180)*Math.sin(y/2)*Math.sin(y/2);return 2*R*Math.asin(Math.sqrt(s))}
function fmtD(m){return m<1000?'≈ '+Math.max(5,Math.round(m/5)*5)+' m':'≈ '+(m/1000).toFixed(1).replace('.',',')+' km'}
var KIND={
 tourism:{attraction:'Atração',museum:'Museu',viewpoint:'Mirante',hotel:'Hotel',hostel:'Hostel',guest_house:'Hospedagem',apartment:'Hospedagem',gallery:'Galeria',artwork:'Arte',zoo:'Zoológico',theme_park:'Parque temático',information:'Informações'},
 historic:{castle:'Castelo',monument:'Monumento',memorial:'Memorial',ruins:'Ruínas',fort:'Fortaleza',city_gate:'Portão da cidade',archaeological_site:'Sítio arqueológico',church:'Igreja',wayside_cross:'Cruz',building:'Edifício histórico'},
 amenity:{restaurant:'Restaurante',cafe:'Café',bar:'Bar',pub:'Pub',fast_food:'Fast food',ice_cream:'Sorveteria',place_of_worship:'Igreja / templo',theatre:'Teatro',cinema:'Cinema',marketplace:'Mercado',fountain:'Fonte',ferry_terminal:'Terminal de balsa',bus_station:'Rodoviária',townhall:'Prefeitura',library:'Biblioteca',university:'Universidade'},
 leisure:{park:'Parque',garden:'Jardim',marina:'Marina',beach_resort:'Praia',nature_reserve:'Reserva natural',playground:'Playground'},
 natural:{beach:'Praia',peak:'Pico',waterfall:'Cachoeira',cave_entrance:'Caverna',bay:'Baía',spring:'Nascente'},
 man_made:{tower:'Torre',lighthouse:'Farol',bridge:'Ponte'},
 building:{church:'Igreja',cathedral:'Catedral',chapel:'Capela',castle:'Castelo',fortress:'Fortaleza'}
};
function kindOf(t){
 var ks=['tourism','historic','amenity','leisure','natural','man_made','building'];
 for(var i=0;i<ks.length;i++){var k=ks[i];if(t[k]){var m=KIND[k]&&KIND[k][t[k]];if(m)return m;if(k==='tourism')return 'Atração';if(k==='historic')return 'Local histórico'}}
 if(t.shop)return 'Loja';return 'Lugar'}
function overpassQ(lat,lon,R){var a='(around:'+R+','+lat+','+lon+')';
 return '[out:json][timeout:12];('+
 'nwr'+a+'["name"]["tourism"];nwr'+a+'["name"]["historic"];'+
 'nwr'+a+'["name"]["amenity"~"^(restaurant|cafe|bar|pub|fast_food|ice_cream|place_of_worship|theatre|cinema|marketplace|fountain|ferry_terminal|bus_station|townhall|library|university)$"];'+
 'nwr'+a+'["name"]["leisure"~"^(park|garden|marina|beach_resort|nature_reserve|playground)$"];'+
 'nwr'+a+'["name"]["natural"~"^(beach|peak|waterfall|cave_entrance|bay|spring)$"];'+
 'nwr'+a+'["name"]["man_made"~"^(tower|lighthouse|bridge)$"];'+
 'nwr'+a+'["name"]["building"~"^(church|cathedral|chapel|castle|fortress)$"];'+
 'nwr'+a+'["name"]["shop"];);out center tags 80;'}
var OVP=['https://overpass-api.de/api/interpreter','https://overpass.kumi.systems/api/interpreter'];
function timed(url,opt,ms){var c=window.AbortController?new AbortController():null,t=setTimeout(function(){if(c)c.abort()},ms||12000);
 opt=opt||{};if(c)opt.signal=c.signal;return fetch(url,opt).then(function(r){clearTimeout(t);if(!r.ok)throw new Error('http '+r.status);return r.json()},function(e){clearTimeout(t);throw e})}
function nearby(lat,lon){
 function go(i){if(i>=OVP.length)return Promise.reject(new Error('sem resposta'));
  return timed(OVP[i],{method:'POST',headers:{'Content-Type':'application/x-www-form-urlencoded'},body:'data='+encodeURIComponent(overpassQ(lat,lon,130))},13000).catch(function(){return go(i+1)})}
 return go(0).then(function(j){var seen={},out=[];
  (j.elements||[]).forEach(function(e){var t=e.tags||{};if(!t.name)return;var la=e.lat!=null?e.lat:(e.center&&e.center.lat),lo=e.lon!=null?e.lon:(e.center&&e.center.lon);if(la==null)return;
   var d=dist(lat,lon,la,lo),bonus=(t.tourism||t.historic)?45:0;var key=t.name.toLowerCase();
   if(seen[key]&&seen[key].d<=d)return;var o={name:t.name,kind:kindOf(t),d:d,score:d-bonus,lat:la,lon:lo};seen[key]=o});
  Object.keys(seen).forEach(function(k){out.push(seen[k])});out.sort(function(a,b){return a.score-b.score});return out.slice(0,7)})}
function reverse(lat,lon){
 return timed('https://nominatim.openstreetmap.org/reverse?format=jsonv2&addressdetails=1&zoom=18&accept-language=pt-BR&lat='+lat+'&lon='+lon,{headers:{'Accept':'application/json'}},9000).then(function(j){
  var a=j.address||{},road=[a.road||a.pedestrian||a.footway||'',a.house_number||''].join(' ').trim(),city=a.city||a.town||a.village||a.municipality||a.county||'';
  return {addr:[road,city,a.country||''].filter(Boolean).join(', '),name:j.name||'',city:city,country:a.country||''}})}
/* foto: reduz no aparelho (≈ 60–90 KB) */
function shrink(file){return new Promise(function(res,rej){var fr=new FileReader();fr.onerror=rej;fr.onload=function(){var im=new Image();im.onerror=rej;im.onload=function(){
 var M=760,w=im.width,h=im.height,k=Math.min(1,M/Math.max(w,h));w=Math.round(w*k);h=Math.round(h*k);var c=document.createElement('canvas');c.width=w;c.height=h;c.getContext('2d').drawImage(im,0,0,w,h);
 var q=.68,u=c.toDataURL('image/jpeg',q);while(u.length>150000&&q>.35){q-=.1;u=c.toDataURL('image/jpeg',q)}res(u)};im.src=fr.result};fr.readAsDataURL(file)})}

var CK=window.CK,F={cur:null,pos:null,photo:null,rating:0,sugs:[],busy:false};
var map=null,layer=null,markers={},dayFilter='';

/* ---------- sheet ---------- */
function sheet(on){var s=$('#ck-sheet');s.hidden=!on;document.body.style.overflow=on?'hidden':''}
function openNew(){
 F.cur=null;F.pos=null;F.photo=null;F.rating=0;F.sugs=[];F.addr='';
 drawForm({name:'',kind:'',note:'',ts:nowLocal(),src:'manual'});sheet(true);locate()}
function openEdit(id){var c=CK.get(id);if(!c)return;F.cur=c;F.pos=(c.lat!=null)?{lat:c.lat,lon:c.lon,acc:c.acc}:null;F.photo=c.photo||null;F.rating=c.rating||0;F.sugs=[];F.addr=c.addr||'';
 drawForm(c);sheet(true);setLoc(F.pos?'<b>Local salvo.</b> '+(c.addr?esc(c.addr):'')+' <button type="button" class="lk" id="ck-relo">Atualizar posição</button>':'<b>Sem posição salva.</b> <button type="button" class="lk" id="ck-relo">Usar minha posição</button>');
 var r=$('#ck-relo');if(r)r.onclick=function(){locate()}}
function setLoc(h){$('#ck-loc').innerHTML=h}
function drawForm(c){
 $('#ck-title').textContent=F.cur?'Editar check-in':'Check-in';
 $('#ck-name').value=c.name||'';$('#ck-kind').value=c.kind||'';$('#ck-note').value=c.note||'';$('#ck-city').value=c.city||'';$('#ck-country').value=c.country||'';$('#ck-ts').value=(c.ts||nowLocal()).slice(0,16);
 drawStars();drawPhoto();$('#ck-sugs').innerHTML='';$('#ck-err').textContent=''}
function drawStars(){var h='';for(var i=1;i<=5;i++){var on=F.rating>=i?'full':(F.rating===i-.5?'half':'');h+='<button type="button" class="stb '+on+'" data-s="'+i+'" aria-label="'+i+' estrelas">★</button>'}
 $('#ck-stars').innerHTML=h+'<small>'+(F.rating?F.rating.toString().replace('.',',')+' de 5':'sem nota')+'</small>';
 $$('#ck-stars .stb').forEach(function(b){b.onclick=function(){var i=+b.dataset.s;F.rating=F.rating===i?i-.5:(F.rating===i-.5?0:i);drawStars()}})}
function drawPhoto(){var h=F.photo?'<img src="'+F.photo+'" alt="Foto do check-in"><button type="button" class="lk" id="ck-rmph">Remover foto</button>':'<span class="hint">Sem foto. Você pode tirar agora ou escolher da galeria.</span>';
 $('#ck-ph').innerHTML=h;var r=$('#ck-rmph');if(r)r.onclick=function(){F.photo=null;drawPhoto()}}
function drawSugs(){var el=$('#ck-sugs');if(!F.sugs.length){el.innerHTML='';return}
 el.innerHTML='<div class="lbl">Lugares perto de você (toque para usar)</div>'+F.sugs.map(function(s,i){return '<button type="button" class="chip sg" data-i="'+i+'"><b>'+esc(s.name)+'</b><small>'+esc(s.kind)+' · '+fmtD(s.d)+'</small></button>'}).join('');
 $$('#ck-sugs .sg').forEach(function(b){b.onclick=function(){var s=F.sugs[+b.dataset.i];$('#ck-name').value=s.name;$('#ck-kind').value=s.kind;F.src='osm';
  $$('#ck-sugs .sg').forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')})}})}
function locate(){
 if(!navigator.geolocation){setLoc('<b>Este aparelho não fornece localização.</b> Digite o nome do lugar abaixo.');return}
 setLoc('<span class="spin"></span> Localizando…');
 navigator.geolocation.getCurrentPosition(function(p){
  F.pos={lat:+p.coords.latitude.toFixed(6),lon:+p.coords.longitude.toFixed(6),acc:Math.round(p.coords.accuracy||0)};
  setLoc('<b>Posição encontrada</b> (precisão ≈ '+F.pos.acc+' m). Buscando lugares próximos…');
  var gone=false;
  reverse(F.pos.lat,F.pos.lon).then(function(r){F.addr=r.addr;F.rname=r.name;if(!$('#ck-city').value)$('#ck-city').value=r.city||'';if(!$('#ck-country').value)$('#ck-country').value=r.country||'';if(!gone)setLoc('<b>Posição encontrada</b> (precisão ≈ '+F.pos.acc+' m)'+(r.addr?'<br><small>'+esc(r.addr)+'</small>':'')+'<br><span class="spin"></span> Buscando lugares próximos…')},function(){});
  nearby(F.pos.lat,F.pos.lon).then(function(list){gone=true;F.sugs=list;
   if(list.length){setLoc('<b>Posição encontrada</b> (precisão ≈ '+F.pos.acc+' m)'+(F.addr?'<br><small>'+esc(F.addr)+'</small>':''));if(!$('#ck-name').value){$('#ck-name').value=list[0].name;$('#ck-kind').value=list[0].kind;F.src='osm'}drawSugs()}
   else{noPlace()}},function(){gone=true;noPlace(true)});
 },function(e){
  var m=e&&e.code===1?'Permissão de localização negada. Libere nas configurações do navegador, ou digite o nome do lugar abaixo.':e&&e.code===3?'A localização demorou demais.':'Não foi possível obter a localização.';
  setLoc('<b>'+m+'</b> <button type="button" class="lk" id="ck-retry">Tentar de novo</button>');var r=$('#ck-retry');if(r)r.onclick=locate},
 {enableHighAccuracy:true,timeout:15000,maximumAge:20000})}
function noPlace(fail){var nm=F.rname||'';
 setLoc('<b>Posição encontrada</b> (precisão ≈ '+(F.pos?F.pos.acc:'?')+' m)'+(F.addr?'<br><small>'+esc(F.addr)+'</small>':'')+'<br>'+(fail?'Não consegui buscar os lugares próximos (sem internet?).':'Nenhum lugar com nome por perto.')+' Digite o nome abaixo.'+(nm?' <button type="button" class="lk" id="ck-usern">Usar “'+esc(nm)+'”</button>':''));
 var u=$('#ck-usern');if(u)u.onclick=function(){$('#ck-name').value=nm}}
function save(){
 var name=$('#ck-name').value.trim();if(!name){$('#ck-err').textContent='Digite o nome do lugar.';$('#ck-name').focus();return}
 var ts=$('#ck-ts').value||nowLocal();
 var o=F.cur?JSON.parse(JSON.stringify(F.cur)):{};
 o.name=name;o.kind=$('#ck-kind').value.trim();o.city=$('#ck-city').value.trim();o.country=$('#ck-country').value.trim();o.note=$('#ck-note').value.trim();o.rating=F.rating||0;o.ts=ts;o.date=ts.slice(0,10);
 o.photo=F.photo||null;if(F.photo===null&&o.hasPhoto)delete o.hasPhoto;
 if(F.pos){o.lat=F.pos.lat;o.lon=F.pos.lon;o.acc=F.pos.acc;o.addr=F.addr||o.addr||''}
 o.src=o.src||(F.src||'manual');if(!F.cur&&F.src)o.src=F.src;
 if(F.cur)CK.update(o);else CK.add(o);
 sheet(false);dayFilter=dayFilter&&dayFilter!==o.date?'':dayFilter;draw();
 var t=$('#ck-toast');t.textContent='Check-in salvo: '+name;t.hidden=false;setTimeout(function(){t.hidden=true},2600)}

/* ---------- linha do tempo e mapa ---------- */
function ensureMap(){if(map||!window.L)return !!map;map=L.map('ck-map',{zoomControl:true,attributionControl:true}).setView([44.5,16],6);
 L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);layer=L.layerGroup().addTo(map);return true}
function drawMap(list){
 var box=$('#ck-mapbox');var pts=list.filter(function(c){return c.lat!=null});
 if(!pts.length){box.hidden=true;return}box.hidden=false;
 if(!window.L){$('#ck-map').innerHTML='<p class="hint" style="padding:14px">O mapa não carregou (sem internet?). A lista abaixo continua disponível.</p>';return}
 ensureMap();layer.clearLayers();markers={};
 var chron=pts.slice().sort(function(a,b){return a.ts<b.ts?-1:1}),ll=[];
 chron.forEach(function(c,i){var ico=L.divIcon({className:'ckpin',html:'<span>'+(i+1)+'</span>',iconSize:[30,30],iconAnchor:[15,15],popupAnchor:[0,-14]});
  var m=L.marker([c.lat,c.lon],{icon:ico,title:c.name}).addTo(layer);
  m.bindPopup('<b>'+esc(c.name)+'</b><br>'+esc(dayLabel(c.date))+' · '+timeOf(c.ts)+(c.rating?'<br>'+stars(c.rating):''));markers[c.id]=m;ll.push([c.lat,c.lon])});
 if(ll.length>1)L.polyline(ll,{color:'#0B7285',weight:3,opacity:.6,dashArray:'6 6'}).addTo(layer);
 setTimeout(function(){map.invalidateSize();if(ll.length===1)map.setView(ll[0],16);else map.fitBounds(ll,{padding:[30,30],maxZoom:17})},60)}
function where(c){var a=c.city,b=c.country;if(!a&&!b&&c.addr){var p=c.addr.split(',').map(function(x){return x.trim()}).filter(Boolean);if(p.length>=2){b=p[p.length-1];a=p[p.length-2]}}return [a,b].filter(Boolean).join(', ')}
function card(c){
 return '<article class="ckc" id="c-'+esc(c.id)+'">'+
 (c.photo?'<button type="button" class="ckph" data-zoom="'+esc(c.id)+'"><img loading="lazy" src="'+c.photo+'" alt="'+esc(c.name)+'"></button>':(c.hasPhoto?'<div class="ckph none">foto sincronizando…</div>':''))+
 '<div class="ckb"><div class="ckt"><h3>'+esc(c.name)+'</h3>'+stars(c.rating)+'</div>'+
 '<div class="ckm">'+timeOf(c.ts)+(c.kind?' · '+esc(c.kind):'')+(c.by?' · '+esc(String(c.by).split(' ')[0]):'')+'</div>'+
 (where(c)?'<div class="ckw">🌍 '+esc(where(c))+'</div>':'')+(c.addr?'<div class="cka">'+esc(c.addr)+'</div>':'')+(c.note?'<p class="ckn">'+esc(c.note)+'</p>':'')+
 '<div class="ckx">'+(c.lat!=null?'<button type="button" class="btn sec sm" data-map="'+esc(c.id)+'">Ver no mapa</button>':'')+'<button type="button" class="btn sec sm" data-edit="'+esc(c.id)+'">Editar</button><button type="button" class="btn sec sm danger" data-del="'+esc(c.id)+'">Apagar</button></div></div></article>'}
function draw(){
 var all=CK.list(),days={};all.forEach(function(c){days[c.date]=(days[c.date]||0)+1});
 var ks=Object.keys(days).sort().reverse();
 $('#ck-stat').innerHTML=all.length?'<div class="stat"><b>'+all.length+'</b><span>lugares</span></div><div class="stat"><b>'+ks.length+'</b><span>dia'+(ks.length>1?'s':'')+'</span></div><div class="stat"><b>'+all.filter(function(c){return c.photo||c.hasPhoto}).length+'</b><span>fotos</span></div>':'';
 $('#ck-days').innerHTML=ks.length>1?'<button type="button" class="chip" data-d="" aria-pressed="'+(!dayFilter)+'">Todos</button>'+ks.map(function(d){return '<button type="button" class="chip" data-d="'+d+'" aria-pressed="'+(dayFilter===d)+'">'+dayLabel(d)+' <small>'+days[d]+'</small></button>'}).join(''):'';
 $$('#ck-days .chip').forEach(function(b){b.onclick=function(){dayFilter=b.dataset.d;draw()}});
 var list=dayFilter?all.filter(function(c){return c.date===dayFilter}):all;
 var h='';if(!list.length)h='<div class="ckempty"><b>Nenhum check-in ainda.</b><p>Toque em “Fazer check-in aqui” quando chegar a um lugar. O portal pega a localização, sugere o nome e você confirma.</p></div>';
 else{var cur='';list.forEach(function(c){if(c.date!==cur){cur=c.date;var n=list.filter(function(x){return x.date===cur}).length;h+='<h2 class="ckd">'+dayLabel(cur)+' <small>'+n+' lugar'+(n>1?'es':'')+'</small></h2>'}h+=card(c)})}
 $('#ck-list').innerHTML=h;
 $$('#ck-list [data-edit]').forEach(function(b){b.onclick=function(){openEdit(b.dataset.edit)}});
 $$('#ck-list [data-del]').forEach(function(b){b.onclick=function(){var c=CK.get(b.dataset.del);if(c&&confirm('Apagar o check-in “'+c.name+'”?')){CK.remove(c.id);draw()}}});
 $$('#ck-list [data-map]').forEach(function(b){b.onclick=function(){var m=markers[b.dataset.map];if(m&&map){$('#ck-mapbox').scrollIntoView({block:'start'});map.setView(m.getLatLng(),17);m.openPopup()}}});
 $$('#ck-list [data-zoom]').forEach(function(b){b.onclick=function(){var c=CK.get(b.dataset.zoom);if(!c||!c.photo)return;var z=$('#ck-zoom');z.innerHTML='<img src="'+c.photo+'" alt="'+esc(c.name)+'"><button type="button" class="back">Fechar</button>';z.hidden=false;z.onclick=function(){z.hidden=true}}});
 drawMap(list);
 var s=CK.state;$('#ck-warn').innerHTML=s.err==='permission-denied'?'<div class="hj-note warn"><b>O Firebase ainda não liberou a coleção “checkins”.</b> Seus check-ins ficam salvos neste aparelho, mas não aparecem para a Andréa até a regra ser ajustada.</div>':(s.err?'<div class="hj-note warn">Erro ao sincronizar os check-ins ('+esc(s.err)+'). Eles continuam salvos neste aparelho.</div>':'')}

/* ---------- eventos ---------- */
function init(){
 $('#ck-new').onclick=openNew;$('#ck-close').onclick=function(){sheet(false)};$('#ck-cancel').onclick=function(){sheet(false)};
 $('#ck-save').onclick=save;
 $('#ck-name').addEventListener('input',function(){F.src='manual'});
 function onFile(inp){inp.onchange=function(){var f=inp.files&&inp.files[0];if(!f)return;$('#ck-ph').innerHTML='<span class="spin"></span> Preparando a foto…';
  shrink(f).then(function(u){F.photo=u;drawPhoto()},function(){F.photo=null;drawPhoto();$('#ck-err').textContent='Não consegui ler a foto.'});inp.value=''}}
 onFile($('#ck-cam'));onFile($('#ck-gal'));
 CK.onChange(draw);draw();
 if(window.FB&&FB.strip)FB.strip($('#ck-fb'));else document.addEventListener('fb-ready',function(){if(FB.strip)FB.strip($('#ck-fb'))});
 if(/[?&]novo=1/.test(location.search)){history.replaceState(null,'','diario.html');openNew()}}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
