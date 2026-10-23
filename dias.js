/* Classificação dos dias da viagem · Balcãs 2027 */
(function(){
var CR=[ /* chave, rótulo, grupo */
 ['cult','Cultura','x'],['hist','História','x'],['gastro','Gastronomia','x'],['nat','Natureza e paisagem','x'],
 ['cheio','Dia cheio','c'],['esf','Esforço físico','c'],['estr','Tempo na estrada','c'],['cans','Cansaço no fim do dia','c']];
var SH={cult:'Cultura',hist:'História',gastro:'Gastro',nat:'Natureza',cheio:'Cheio',esf:'Esforço',estr:'Estrada',cans:'Cansaço'};
function D(d,w,cid,loc,km,a,r,h){return {d:d,w:w,cid:cid,loc:loc,km:km,h:h||'',c:{cult:a[0],hist:a[1],gastro:a[2],nat:a[3],cheio:a[4],esf:a[5],estr:a[6],cans:a[7]},r:r}}
/*          cult hist gastro nat cheio esf estr cans */
var L=[
D('15/05','Sáb','zagreb','Chegada a Zagreb',0,[0,0,0,0,1,0,0,4],'Voo longo, imigração em Frankfurt e pouso de madrugada em Zagreb; só o táxi até o hotel.',''),
D('16/05','Dom','zagreb','Zagreb',0,[4,3,3,2,3,3,0,2],'Cidade Alta toda de uma vez, canhão ao meio-dia e almoço: começa tarde, termina cedo.',''),
D('17/05','Seg','zagreb','Zagreb',0,[3,2,3,1,2,3,0,2],'Dolac, catedral e Ilica: dia solto, sem subir à Cidade Alta.',''),
D('18/05','Ter','ljubljana','Zagreb → Ljubljana',140,[2,1,2,1,3,1,2,3],'Retirada do carro, estrada até Ljubljana e passeio à beira do rio.','1h45'),
D('19/05','Qua','ljubljana','Lago Bled',110,[3,3,3,5,4,3,2,3],'Lago Bled cedo: pletna, castelo e kremšnita.','1h40'),
D('20/05','Qui','ljubljana','Postojna, Predjama e Trieste',258,[4,4,3,4,5,3,4,5],'O dia mais carregado: Postojna, Predjama e Trieste, com ~260 km e volta à noite.','3h45'),
D('21/05','Sex','plitvice','Ljubljana → Plitvice',260,[2,2,2,1,2,1,3,3],'Manhã livre em Ljubljana e estrada até Plitvice.','3h15'),
D('22/05','Sáb','plitvice','Parque de Plitvice',20,[1,0,2,5,5,5,1,5],'Dia inteiro no parque: lagos, passarelas e pernas cansadas.','0h30'),
D('23/05','Dom','split','Plitvice → Split',290,[2,3,3,2,3,2,4,3],'Smiljan (desvio de 60 km), estrada até Split e primeira noite no Peristilo.','4h00'),
D('24/05','Seg','split','Split',0,[5,5,4,3,4,4,0,4],'Palácio de Diocleciano, porões, catedral e Marjan: o melhor de Split.',''),
D('25/05','Ter','split','Trogir e Klis',75,[4,4,3,2,4,3,2,3],'Trogir e a fortaleza de Klis, com estrada curta.','1h45'),
D('26/05','Qua','dubrovnik','Split → Dubrovnik',230,[2,2,3,2,2,2,4,3],'Litoral até Dubrovnik, com parada opcional em Ston.','3h45'),
D('27/05','Qui','dubrovnik','Dubrovnik',0,[5,5,4,3,5,5,0,5],'Muralhas às 8h e teleférico ao pôr do sol: o pico da viagem.',''),
D('28/05','Sex','dubrovnik','Lokrum ou Cavtat',0,[3,2,4,4,3,3,0,2],'Lokrum de barco, com calma (Cavtat de carro soma 40 km) e jantar de despedida.',''),
D('29/05','Sáb','kotor','Dubrovnik → Kotor',95,[4,4,3,3,3,2,3,3],'Fronteira com Montenegro e a Cidade Velha de Kotor.','2h30'),
D('30/05','Dom','kotor','Fortaleza e Perast',24,[3,4,3,5,4,5,1,4],'1.350 degraus até São João e a ilha de Perast.','0h40'),
D('31/05','Seg','kotor','Lovćen ou Budva',80,[3,3,4,5,3,2,3,3],'Serpentinas até Lovćen, presunto em Njeguši e Budva opcional.','2h15'),
D('01/06','Ter','sibenik','Kotor → costa dálmata',430,[1,1,2,3,2,1,5,5],'Dia de estrada: 430 km do Montenegro à costa dálmata.','7h00'),
D('02/06','Qua','sibenik','Šibenik e Krka',55,[3,3,3,5,4,4,2,3],'Šibenik de manhã e Krka à tarde, com piscina para fechar.','1h15'),
D('03/06','Qui','rastoke','Vodice → Rastoke',258,[1,1,2,3,2,1,3,3],'Estrada até Rastoke e fim de tarde nas cascatas.','3h20'),
D('04/06','Sex','zagreb-final','Rastoke → Zagreb',128,[1,1,3,2,2,1,2,2],'Volta a Zagreb, compras e a última noite.','1h45'),
D('05/06','Sáb','zagreb-final','Zagreb → São Paulo',20,[0,0,0,0,1,1,1,5],'Devolução do carro e a volta: Zagreb, Frankfurt e São Paulo, em voo direto de Frankfurt.','0h30')
];
var BY={};L.forEach(function(x,i){x.n=i+1;BY[x.d]=x;
 var c=x.c;x.m=(c.cheio+c.esf+c.estr+2*c.cans)/5;
 x.lv=x.m<1.5?1:x.m<2.5?2:x.m<3.25?3:x.m<4?4:5;
 x.lb=['','Leve','Tranquilo','Moderado','Intenso','Puxado'][x.lv]});
function f1(n){return n.toFixed(1).replace('.',',')}
function seg(v,cls){var s='';for(var i=1;i<=5;i++)s+='<i class="'+(i<=v?'on '+cls:'')+'"></i>';return s}
function row(x,k,lab,g){var v=x.c[k],cls=g==='x'?'ex':'l'+v;
 var extra=k==='estr'&&x.km?' <em>≈ '+x.km+' km'+(x.h?' · '+x.h:'')+'</em>':'';
 return '<div class="dr"><span class="dn">'+lab+extra+'</span><span class="ds" role="img" aria-label="'+lab+': '+v+' de 5">'+seg(v,cls)+'</span></div>'}
function gauge(x){var pct=Math.round(x.m/5*100);
 return '<div class="dg l'+x.lv+'" role="img" aria-label="Intensidade do dia: '+f1(x.m)+' de 5"><svg viewBox="0 0 80 46" aria-hidden="true"><path d="M7 41 A33 33 0 0 1 73 41" pathLength="100" class="gb"/><path d="M7 41 A33 33 0 0 1 73 41" pathLength="100" class="gf" style="stroke-dasharray:'+pct+' 100"/></svg><b>'+f1(x.m)+'</b></div>'}
function panel(x,opt){opt=opt||{};
 var xs='',cs='';CR.forEach(function(c){var r=row(x,c[0],c[1],c[2]);if(c[2]==='x')xs+=r;else cs+=r});
 return '<div class="dia'+(opt.big?' big':'')+'" data-d="'+x.d+'"><div class="dia-h">'+gauge(x)+'<div class="dt"><span class="dl l'+x.lv+'">'+x.lb+'</span><span class="dk">Dia '+x.n+' de '+L.length+' · '+x.w+' '+x.d+'</span><p>'+x.r+'</p></div></div>'
  +'<div class="dcols"><div class="dgrp"><h4>O que o dia entrega</h4>'+xs+'</div><div class="dgrp"><h4>O que o dia cobra</h4>'+cs+'</div></div></div>'}
function heat(){
 var h='<div class="hmw"><table class="hm"><thead><tr><th>Dia</th>'+CR.map(function(c){return '<th class="g'+c[2]+'" title="'+c[1]+'">'+SH[c[0]]+'</th>'}).join('')+'<th>Km</th><th>Ritmo</th></tr></thead><tbody>';
 L.forEach(function(x){h+='<tr><td><a href="'+x.cid+'.html#d-'+x.d.replace('/','-')+'"><b>'+x.d+'</b> <span>'+x.w+'</span><small>'+x.loc+'</small></a></td>'
  +CR.map(function(c){var v=x.c[c[0]];return '<td><span class="hc '+(c[2]==='x'?'hx':'hl')+v+'" title="'+c[1]+': '+v+' de 5">'+v+'</span></td>'}).join('')
  +'<td class="km">'+(x.km||'—')+'</td><td><span class="dl l'+x.lv+'">'+x.lb+'</span></td></tr>'});
 return h+'</tbody></table></div><p class="hmn">Escala de 0 a 5. Em azul-petróleo, o que o dia entrega (quanto mais escuro, mais intenso). Do verde ao vermelho, o que o dia cobra (quanto mais quente, mais pesado). O ritmo combina dia cheio, esforço, estrada e cansaço (o cansaço pesa em dobro).</p>'}
var CSS='.dia{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:14px 16px;margin:0 0 14px;display:grid;gap:12px}'
+'.dia-h{display:flex;gap:14px;align-items:center}.dg{position:relative;width:84px;flex:none;height:56px}.dg svg{width:100%;height:auto;display:block;overflow:visible}.dg path{fill:none;stroke-width:7;stroke-linecap:round}.dg .gb{stroke:var(--line)}.dg .gf{stroke:var(--gc)}.dg b{position:absolute;left:0;right:0;bottom:-2px;text-align:center;font:800 1.15rem/1 var(--f-display);font-variant-numeric:tabular-nums}'
+'.dt{display:grid;gap:3px;min-width:0}.dt p{margin:0;font-size:14.5px;line-height:1.4;color:var(--ink)}.dk{font:600 11.5px/1.2 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted)}'
+'.dl{display:inline-block;width:max-content;font:700 11px/1.4 var(--f-mono);letter-spacing:.06em;text-transform:uppercase;padding:2px 9px;border-radius:6px;color:#fff;background:var(--gc)}'
+'.dcols{display:grid;grid-template-columns:1fr 1fr;gap:6px 28px}@media(max-width:620px){.dcols{grid-template-columns:1fr}}'
+'.dgrp{display:grid;gap:7px;align-content:start}.dgrp h4{margin:0 0 2px;font:600 11px/1.2 var(--f-mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}'
+'.dr{display:flex;justify-content:space-between;align-items:center;gap:10px;font-size:13.5px}.dn em{font-style:normal;color:var(--muted);font-size:12px}.ds{display:flex;gap:3px;flex:none}.ds i{width:17px;height:7px;border-radius:4px;background:var(--line);display:block}.ds i.ex{background:var(--accent)}'
+':root{--g1:#3F9A6B;--g2:#7FAE4F;--g3:#D69E1F;--g4:#DD7A35;--g5:#C9432F}@media (prefers-color-scheme:dark){:root:not([data-theme="light"]){--g1:#5CC08C;--g2:#9CC96A;--g3:#E8B94A;--g4:#EE9558;--g5:#EE7A66}}:root[data-theme="dark"]{--g1:#5CC08C;--g2:#9CC96A;--g3:#E8B94A;--g4:#EE9558;--g5:#EE7A66}'
+'.l0{--gc:var(--line)}.l1{--gc:var(--g1)}.l2{--gc:var(--g2)}.l3{--gc:var(--g3)}.l4{--gc:var(--g4)}.l5{--gc:var(--g5)}.ds i.on.l1{background:var(--g1)}.ds i.on.l2{background:var(--g2)}.ds i.on.l3{background:var(--g3)}.ds i.on.l4{background:var(--g4)}.ds i.on.l5{background:var(--g5)}.dl.l3{color:#2b1d00}.dl.l2{color:#10240a}'
+'.dia.big{padding:18px 20px}.dia.big .dg{width:104px;height:68px}.dia.big .dg b{font-size:1.45rem}.dia.big .dt p{font-size:16px}.dia.big .dr{font-size:14.5px}.dia.big .ds i{width:20px;height:8px}'
+'.hd-n{display:flex;align-items:center;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 10px}.hd-n .t{font:700 1.05rem/1.2 var(--f-display)}.hd-n .t small{display:block;font:600 11.5px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);margin-bottom:2px}.hd-b{display:flex;gap:6px;align-items:center}.hd-b button{font:inherit;font-size:18px;line-height:1;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:8px;width:40px;height:40px;cursor:pointer}.hd-b button:disabled{opacity:.35;cursor:default}.hd-b a{font-size:14px;font-weight:600;margin-left:6px}'
+'.hmw{overflow:auto;max-height:min(75vh,640px);background:var(--surface);border:1px solid var(--line);border-radius:12px}.hm{width:100%;border-collapse:collapse;font-size:13px;min-width:720px}.hm th{font:600 10.5px var(--f-mono);letter-spacing:.06em;text-transform:uppercase;color:var(--muted);padding:8px 6px;text-align:center;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:2;background:var(--surface)}.hm th:first-child{text-align:left;padding-left:12px;left:0;z-index:3}.hm th.gc{color:var(--c-eat)}.hm td{padding:4px 6px;text-align:center;border-bottom:1px solid var(--line)}.hm tr:last-child td{border-bottom:0}.hm td:first-child{text-align:left;padding-left:12px;white-space:nowrap;position:sticky;left:0;z-index:1;background:var(--surface);box-shadow:1px 0 0 var(--line)}.hm td a{text-decoration:none;color:var(--ink);display:grid;line-height:1.25}.hm td a span{color:var(--muted);font-size:11px;display:inline}.hm td a small{color:var(--muted);font-size:11.5px}.hm td.km{font-variant-numeric:tabular-nums;color:var(--muted)}'
+'.hc{display:inline-flex;align-items:center;justify-content:center;width:28px;height:24px;border-radius:6px;font:700 12px var(--f-mono);color:var(--ink)}'
+'.hx0,.hl0{background:transparent;color:var(--muted)}.hx1{background:color-mix(in srgb,var(--accent) 14%,var(--surface))}.hx2{background:color-mix(in srgb,var(--accent) 30%,var(--surface))}.hx3{background:color-mix(in srgb,var(--accent) 50%,var(--surface))}.hx4{background:color-mix(in srgb,var(--accent) 72%,var(--surface));color:var(--accent-ink)}.hx5{background:var(--accent);color:var(--accent-ink)}'
+'.hl1{background:color-mix(in srgb,var(--g1) 30%,var(--surface))}.hl2{background:color-mix(in srgb,var(--g2) 40%,var(--surface))}.hl3{background:color-mix(in srgb,var(--g3) 60%,var(--surface))}.hl4{background:color-mix(in srgb,var(--g4) 75%,var(--surface))}.hl5{background:var(--g5);color:#fff}'
+'.hmn{font-size:12.5px;color:var(--muted);margin:8px 0 0;max-width:80ch}'
+'.cd-n{gap:8px 22px!important}.cd-n b{font-size:clamp(2rem,9.5vw,3.6rem)!important}'
+'.maplg{display:flex;flex-wrap:wrap;gap:6px 18px;align-items:center;margin:8px 2px 0;font-size:13px;color:var(--muted)}.maplg i{display:inline-block;width:11px;height:11px;border-radius:50%;margin-right:6px;vertical-align:-1px;box-sizing:border-box}.maplg .ld{background:var(--c-tip)}.maplg .lc{background:var(--accent);box-shadow:0 0 0 3px color-mix(in srgb,var(--accent) 30%,transparent)}.maplg .lf{border:2px solid var(--accent);background:var(--surface)}.maplg b{color:var(--ink)}'
+'@keyframes mp{0%{r:11;opacity:.55}100%{r:21;opacity:0}}.mpulse{fill:var(--accent);animation:mp 2s ease-out infinite;pointer-events:none}@media (prefers-reduced-motion:reduce){.mpulse{animation:none;opacity:.25;r:17}}';
var st=document.createElement('style');st.textContent=CSS;document.head.appendChild(st);
function key(d){return d.replace('/','-')}
function inject(){
 [].forEach.call(document.querySelectorAll('section.day > .day-h'),function(h){
  var sp=h.querySelector('.date');if(!sp)return;var m=sp.textContent.match(/(\d\d\/\d\d)/);if(!m||!BY[m[1]])return;
  var sec=h.parentNode;if(!sec.id)sec.id='d-'+key(m[1]);
  if(sec.querySelector(':scope > .dia'))return;
  var w=document.createElement('div');w.innerHTML=panel(BY[m[1]]);h.parentNode.insertBefore(w.firstChild,h.nextSibling)})}

/* mapa: cores conforme os dias passam */
var STOPS=[['zagreb',0,3,'Zagreb'],['ljubljana',3,6,'Ljubljana'],['plitvice',6,8,'Plitvice'],['split',8,11,'Split'],['dubrovnik',11,14,'Dubrovnik'],['kotor',14,17,'Kotor'],['sibenik',17,19,'Šibenik · Vodice'],['rastoke',19,20,'Rastoke'],['zagreb-final',20,22,'Zagreb final']];
function paintMap(dayIdx){
 var svg=document.querySelector('svg[aria-label^="Mapa"]');if(!svg)return;
 var NS='http://www.w3.org/2000/svg';
 function st(s,e){return dayIdx>=e?'d':dayIdx>=s?'c':'f'}
 function dot(href,s,e,num){var a=svg.querySelector('a[href="'+href+'.html"]');if(!a)return;var c=a.querySelector('circle'),t=a.querySelector('text[text-anchor="middle"]'),k=st(s,e);
  var old=a.querySelector('.mpulse');if(old)old.remove();
  if(k==='d'){c.setAttribute('fill','var(--c-tip)');c.setAttribute('stroke','none');if(t){t.textContent='✓';t.setAttribute('fill','#fff')}}
  else if(k==='c'){c.setAttribute('fill','var(--accent)');c.setAttribute('stroke','none');if(t){t.textContent=num;t.setAttribute('fill','var(--accent-ink)')}
   var r=document.createElementNS(NS,'circle');r.setAttribute('class','mpulse');r.setAttribute('cx',c.getAttribute('cx'));r.setAttribute('cy',c.getAttribute('cy'));r.setAttribute('r','11');a.insertBefore(r,c)}
  else{c.setAttribute('fill','var(--surface)');c.setAttribute('stroke','var(--accent)');c.setAttribute('stroke-width','2');if(t){t.textContent=num;t.setAttribute('fill','var(--accent)')}}}
 STOPS.forEach(function(x,i){dot(x[0],x[1],x[2],String(i+1))});
 var tr=svg.querySelector('a[href="trieste.html"] circle');if(tr){var k=dayIdx>=6?'d':dayIdx===5?'c':'f';tr.setAttribute('fill',k==='d'?'var(--c-tip)':k==='c'?'var(--accent)':'var(--surface)');tr.setAttribute('stroke',k==='d'?'var(--c-tip)':'var(--accent)')}
 [].forEach.call(svg.querySelectorAll('.rseg'),function(l){var i=+l.dataset.i,arrived=dayIdx>=STOPS[i+1][1];
  l.setAttribute('stroke',arrived?'var(--c-tip)':'var(--route)');l.setAttribute('stroke-dasharray',arrived?'none':'6 4');l.setAttribute('stroke-opacity',arrived?'1':'.7')});
 var lg=document.getElementById('maplg');if(lg){var cur=STOPS.filter(function(x){return dayIdx>=x[1]&&false||(dayIdx>=x[1]-0&&dayIdx<x[2])})[0];
  var msg=dayIdx<0?'A viagem ainda não começou.':dayIdx>=L.length?'Viagem concluída.':(cur?'<b>Agora: '+cur[3]+'</b> · dia '+(dayIdx+1)+' de '+L.length:'');
  lg.innerHTML='<span><i class="ld"></i>já visitado</span><span><i class="lc"></i>etapa atual</span><span><i class="lf"></i>a visitar</span><span>'+msg+'</span>'}}
/* página inicial */
function dayIndex(){var q=(location.search.match(/[?&]dia=(\d\d)[\/-](\d\d)/)||[]);if(q.length&&BY[q[1]+'/'+q[2]])return BY[q[1]+'/'+q[2]].n-1;var n=new Date(),c=new Date(n.getFullYear(),n.getMonth(),n.getDate()).getTime(),t=new Date(2027,4,15).getTime();return Math.floor((c-t)/86400000)}
function home(){
 paintMap(dayIndex());
 var box=document.getElementById('home-dia'),hm=document.getElementById('home-dias');
 if(hm)hm.innerHTML='<div class="day-h"><span class="date">dia a dia</span><h2>Como são os dias</h2></div>'+heat();
 if(!box)return;
 var now=new Date(),q=(location.search.match(/[?&]dia=(\d\d)[\/-](\d\d)/)||[]),idx=-1,mode='prev';
 if(q.length){var k=q[1]+'/'+q[2];if(BY[k]){idx=BY[k].n-1;mode='ask'}}
 if(idx<0){var y=now.getFullYear(),mo=now.getMonth()+1,dd=now.getDate();
  var t=new Date(2027,4,15).getTime(),e=new Date(2027,5,5).getTime(),c=new Date(y,mo-1,dd).getTime();
  if(c>=t&&c<=e){idx=Math.round((c-t)/86400000);mode='today'}else if(c>e){idx=L.length-1;mode='past'}else{idx=0;mode='prev'}}
 var today=mode==='today'?idx:-1;
 function draw(){var x=L[idx],lab=idx===today?'Hoje na viagem':(mode==='prev'||mode==='ask'&&today<0&&false?'Prévia do roteiro':'Dia da viagem');
  if(mode==='past'&&idx===L.length-1)lab='Último dia da viagem';
  if(mode==='prev')lab=idx===0?'Prévia · o primeiro dia':'Prévia do roteiro';
  if(idx===today)lab='Hoje na viagem';
  box.innerHTML='<div class="day-h"><span class="date">classificação do dia</span><h2>'+lab+'</h2></div><div class="hd-n"><div class="t"><small>Dia '+x.n+' de '+L.length+'</small>'+x.loc+'</div><div class="hd-b"><button type="button" id="hd-p" aria-label="Dia anterior"'+(idx===0?' disabled':'')+'>‹</button><button type="button" id="hd-n" aria-label="Próximo dia"'+(idx===L.length-1?' disabled':'')+'>›</button><a href="'+x.cid+'.html#d-'+key(x.d)+'">Ver o roteiro →</a></div></div>'+panel(x,{big:true});
  document.getElementById('hd-p').onclick=function(){if(idx>0){idx--;draw()}};
  document.getElementById('hd-n').onclick=function(){if(idx<L.length-1){idx++;draw()}}}
 draw()}
window.DIAS={list:L,by:BY,panel:panel,heat:heat};
function go(){inject();home()}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',go);else go();
})();
