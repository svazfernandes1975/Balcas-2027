/* Checklist da locação: usada na página Dirigir (#lc-mount). Marcações salvas neste aparelho e sincronizadas (data/loc). */
(function(){
var mnt=document.getElementById('lc-mount');if(!mnt)return;
var st=document.createElement('style');st.textContent="\n.lc-alert{background:var(--surface);border:1px solid var(--line);border-left:6px solid var(--c-warn);border-radius:12px;padding:14px 16px;margin:12px 0}\n.lc-alert h3{margin:0 0 6px;font:800 1.05rem var(--f-display);color:var(--c-warn)}\n.lc-alert ol{margin:6px 0 0;padding-left:20px;display:grid;gap:6px;font-size:15px}\n.lc-meta{background:var(--surface);border:1px solid var(--line);border-radius:12px;padding:6px 14px;margin:12px 0}\n.lc-meta div{display:flex;flex-wrap:wrap;justify-content:space-between;gap:4px 12px;padding:8px 0;border-top:1px solid var(--line);font-size:14px}\n.lc-meta div:first-child{border-top:0}\n.lc-meta b{font-weight:600}\n.lc-meta a{font:600 14px var(--f-mono);color:var(--accent);text-decoration:none;white-space:nowrap}\n.lc-sec{margin-top:24px}\n.lc-sec h3{font:800 1.15rem var(--f-display);margin:0 0 2px;display:flex;justify-content:space-between;align-items:baseline;gap:8px}\n.lc-cnt{font:700 11px var(--f-mono);letter-spacing:.05em;text-transform:uppercase;color:var(--muted);white-space:nowrap}\n.lc-sub{font-size:13px;color:var(--muted);margin:0 0 8px}\n.lcl input[type=checkbox]{width:20px;height:20px;margin-top:2px;accent-color:var(--accent)}\n.lcl li.ok label{opacity:.55;text-decoration:line-through}\n.lc-note{font-size:13px;color:var(--muted);margin:18px 0 0}\n.pd-prog{margin:4px 0 10px}\n.pd-bar{height:8px;border-radius:8px;background:var(--line);overflow:hidden;margin:6px 0 4px}\n.pd-bar i{display:block;height:100%;width:0;background:var(--accent);transition:width .25s}\n";document.head.appendChild(st);
mnt.innerHTML='<div id="gx-sync" class="fbstrip" style="margin:6px 0 10px"></div>'+
'<p class="prose">Retirada em <b>18/05 às 11:00</b> e devolução em <b>05/06 às 11:00</b>, no aeroporto de Zagreb. Marque cada item: o que você marca fica salvo e vale nos dois aparelhos.</p>'+
'<div class="lc-alert"><h3>Estas regras anulam o seguro inteiro, até o da Rentalcover</h3><ol>'+
'<li>Sair da Croácia, ou passar por Neum (Bósnia), sem autorização escrita da locadora e taxa paga.</li>'+
'<li>Qualquer álcool: depois de um dano, o bafômetro precisa dar <b>0,00</b>.</li>'+
'<li>Não chamar a polícia em <b>qualquer</b> dano, ou sair do local antes de ela terminar.</li>'+
'<li>Outra pessoa dirigir sem constar no contrato.</li>'+
'<li>Estrada de terra, praia ou caminho de mata; balsa ou ilha sem o produto TRN.</li>'+
'<li>Deixar o documento do carro dentro do carro: se roubarem, você paga o valor do carro.</li></ol></div>'+
'<div class="lc-meta">'+
'<div><b>Assistência da locadora (pane, guincho, carro de troca)</b><a href="tel:+38572606606">+385 72 606 606, opção 9</a></div>'+
'<div><b>Balcão de Zagreb (voucher da Rentcars)</b><a href="tel:+385993824785">+385 99 382 4785</a></div>'+
'<div><b>Rentcars (dúvidas e cancelamento)</b><a href="tel:+554140421479">+55 41 4042 1479</a></div>'+
'<div><b>Emergência na Croácia</b><a href="tel:112">112</a></div>'+
'<div><b>Reembolso da Rentalcover</b><span>rentalcover.com/pt-br/claim</span></div></div>'+
'<div id="pd-prog" class="pd-prog"></div><div id="lc-list"></div>'+
'<p class="lc-note"><b>Carta verde:</b> o contrato não a menciona. Peça à locadora junto com a autorização de fronteira e confirme se ela está incluída na taxa. Ela é emitida no seguro do carro, então só a locadora a entrega.</p>'+
'<p class="lc-note">Fonte: condições gerais da franqueada (Auto Benussi d.o.o., de Pula, marca Executive Lease), recebidas em 23/11/2026, e voucher da Rentcars. É um texto de referência: vale o contrato que você assinar no balcão. Se algo diferir, confirme com a locadora.</p>';
var K='balcas2027-loc',s={};
try{s=JSON.parse(localStorage.getItem(K)||'{}')}catch(e){}
var DATA=[
{id:'b',t:'Na retirada',s:'18/05 às 11:00, aeroporto de Zagreb. Não saia do local com o carro antes de terminar esta parte.',i:[
['b12','drive','Releia as frases do <a href="#balcao">balcão</a> (PT e EN) e deixe à mão o e-mail da reserva com o valor da caução.'],
['b1','drive','Chegue às <b>11:00</b>. O voucher da Rentcars dá 29 minutos de tolerância (o contrato da franqueada fala em 2 horas; vale o mais rígido). Se for atrasar, avise a locadora antes.'],
['b2','warn','<b>Leia o contrato antes de assinar:</b> valor a pagar no balcão (só extras, porque o carro já está pago), franquia, bloqueio no cartão, combustível, quilometragem livre, condutores e países autorizados. Confira se não incluíram nada a mais.'],
['b3','drive','Se oferecerem seguro extra (CDW, ZE, WUG, Premium), recuse com educação, porque a Rentalcover já cobre. Use a frase do <a href="dirigir.html#balcao">balcão</a> e peça a lista do que já está incluído.'],
['b4','warn','<b>Autorização de fronteira por escrito no contrato</b>, com a taxa paga, para cada país do roteiro, e a carta verde em mãos. Sem isso, o seguro não vale fora da Croácia.'],
['b5','drive','Anote a <b>franquia</b> e o valor bloqueado no cartão e peça cópia do contrato.'],
['b6','warn','<b>Inspeção com o funcionário, antes de sair do local:</b> lataria, teto, rodas e pneus, para-brisa, espelhos, faróis, interior e estofamento. Todo dano precisa estar marcado no termo de vistoria. Reclamação depois que o carro saiu do local não é aceita.'],
['b7','drive','Fotografe e filme o carro todo, com o funcionário presente, incluindo o hodômetro e o nível de combustível.'],
['b8','drive','Confira o triângulo, o colete e o estepe ou kit de reparo. Veja onde ficam os documentos do carro.'],
['b9','drive','Pergunte se o carro é <b>gasolina ou diesel</b> e onde fica o posto mais perto do aeroporto.'],
['b10','drive','Assine o termo de vistoria <b>só depois</b> da inspeção e guarde cópia dele e do contrato.'],
['b14','drive','Moedas de €1 e €2 para parquímetro e pedágio.'],
['b13','drive','Antes de cruzar para a Eslovênia: e-vinheta comprada com a <b>placa exata</b> do carro (veja <a href="#vinheta">Vinheta</a>).'],
['b11','drive','Salve offline a <b>assistência da locadora: +385 72 606 606, opção 9</b>, o telefone do balcão e o do clube automobilístico (veja <a href="sos.html">SOS</a>).']]},
{id:'c',t:'Durante a viagem',s:'Os itens em vermelho anulam todo o seguro, inclusive o da Rentalcover.',i:[
['c1','warn','<b>Documento do carro fora do carro.</b> Ao estacionar e sair, leve o documento com você. Se o carro for roubado com o documento dentro, é falta grave e você paga o valor de mercado do carro. A chave nunca fica no carro.'],
['c2','warn','<b>Álcool zero ao volante.</b> Depois de qualquer dano o contrato exige bafômetro com 0,00 g/kg. A lei croata tolera 0,5 ‰, mas a cobertura não. Defina quem dirige antes do jantar.'],
['c3','warn','<b>Só quem está no contrato dirige</b>, sem exceção.'],
['c4','warn','<b>Só pelo asfalto.</b> Nada de estrada de terra, praia ou caminho de mata. Se o GPS mandar por um trecho de terra, volte e escolha outro caminho.'],
['c5','warn','<b>Fronteira só com autorização por escrito e carta verde</b> no porta-luvas, mais o passaporte. Neum (Bósnia) também conta; pela ponte de Pelješac você evita.'],
['c6','drive','Luz de óleo, AdBlue ou arrefecimento acesa: pare com segurança e ligue para a assistência. Seguir rodando com o aviso aceso é por sua conta.'],
['c7','drive','Combustível certo (confira a tampa). Combustível errado não é coberto.'],
['c8','drive','Não deixe nada à vista no carro. Bagagem e objetos pessoais não têm seguro do carro.'],
['c9','drive','Pedágios, e-vinheta da Eslovênia e estacionamento são seus. Multas chegam por e-mail da locadora: responda em <b>5 dias úteis</b> com o comprovante, ou eles pagam e cobram no cartão com taxa.'],
['c10','drive','Configure o GPS para evitar a <b>ZTL</b> e <b>Neum</b>. Antes de chegar a Dubrovnik, confirme que o hotel registrou a placa do carro.']]},
{id:'d',t:'Se houver dano, acidente, furto ou pane',s:'Siga na ordem. Pular um passo pode custar o seguro.',i:[
['d1','drive','Segurança primeiro: pisca-alerta, colete e triângulo. Ligue <b>112</b> se houver ferido.'],
['d2','warn','Ligue para a locadora: <b>+385 72 606 606, opção 9</b> (guincho, conserto e carro de troca em até 24 horas).'],
['d3','warn','<b>Chame a polícia em qualquer dano</b>, até arranhão de estacionamento, e peça o boletim. Sem boletim, perde-se a cobertura.'],
['d4','warn','<b>Faça o bafômetro no local</b> (precisa dar 0,00) e fique até a polícia liberar. Recusar ou sair antes anula tudo.'],
['d5','drive','Fotografe tudo: o dano, o local, as placas, os documentos do outro motorista e do seguro dele.'],
['d6','drive','Preencha o <b>constat</b> (relatório europeu de acidente), a declaração do evento e um novo termo de vistoria.'],
['d7','drive','<b>Não conserte por conta própria.</b> O reembolso de reparo exige aprovação escrita da locadora, oficina autorizada e nota original.'],
['d8','drive','Pague a franquia à locadora <b>no cartão, nunca em dinheiro</b>, e peça o reembolso à Rentalcover, com contrato, boletim, fotos e comprovantes.'],
['d9','drive','Guarde e-mails, contrato, termos e extratos. A fatura final pode chegar semanas depois.']]},
{id:'e',t:'Na devolução',s:'05/06 às 11:00, aeroporto de Zagreb (sábado).',i:[
['e1','warn','Chegue <b>antes das 11:00</b>. A tolerância é de 59 minutos; depois disso cobram uma diária inteira.'],
['e2','drive','Abasteça perto do aeroporto, no <b>mesmo nível</b> da retirada, e guarde o comprovante. Se faltar, cobram a diferença mais uma taxa de reabastecimento.'],
['e3','drive','Devolva o carro limpo, sem areia, lama ou pelos e sem cheiro de cigarro. Fumar é proibido e a limpeza especial é cobrada.'],
['e4','warn','<b>Inspeção com o funcionário</b> na entrega. Fotos e vídeo do carro todo, com hodômetro e tanque.'],
['e5','drive','Peça o <b>termo de devolução assinado</b> ou um e-mail de encerramento, e a confirmação de que o bloqueio do cartão será liberado.'],
['e6','drive','Evite devolver fora do horário (caixa de chaves). O carro fica sob sua responsabilidade até a inspeção do próximo dia útil, e danos e taxas são cobrados no cartão depois.'],
['e7','drive','Devolva no local combinado. Deixar o carro em outro lugar gera multa e taxa de transferência.'],
['e8','drive','Guarde por alguns meses o contrato, os termos, as fotos e os extratos. Multas e cobranças podem chegar depois.']]},
{id:'a',t:'Antes de viajar (preparação)',s:'Faça até abril de 2027. Peça tudo por escrito (e-mail ou chat) para mostrar no balcão.',i:[
['a1','warn','<b>Fronteiras:</b> peça por escrito à Alamo os países autorizados (Eslovênia, Itália e Montenegro; Bósnia só se for passar por Neum), o valor da taxa de fronteira e se a <b>carta verde</b> vem junto.'],
['a2','drive','Pergunte a <b>franquia</b> do carro reservado e o valor exato do <b>bloqueio no cartão</b>. O bloqueio é a franquia mais o custo estimado da locação, então pode passar de €1.100.'],
['a3','drive','Confirme o horário do balcão em 18/05 e em <b>05/06 (sábado)</b>. Retirada ou devolução fora do horário tem taxa e riscos.'],
['a4','warn','<b>Cartão de crédito físico, internacional e no nome do condutor</b>, com limite para o bloqueio e para pagar a franquia se houver dano. Não valem cartão pré-pago, virtual ou por aproximação, e a locadora pode recusar cartão de banco digital.'],
['a5','warn','<b>CNH física e original</b> (a digital não vale fora do Brasil), PID, passaporte, voucher da Rentcars e certificado da Rentalcover, impressos e no celular.'],
['a6','drive','Se a Andréa for dirigir, peça a inclusão como <b>condutora adicional</b>, que tem taxa. Quem não está no contrato não pode dirigir.'],
['a7','drive','Roteiro sem balsa nem ilha croata. Se isso mudar, peça por escrito o produto <b>TRN</b>; sem ele o carro fica sem seguro na balsa e na ilha.'],
['a8','drive','Cancelar a reserva da <b>Nova Rent a Car</b> (veja o lembrete em <a href="pendencias.html">Pendências</a>).']]}
];
function keep(){try{localStorage.setItem(K,JSON.stringify(s))}catch(e){}}
var box=document.getElementById('lc-list'),ready=false;
function render(){var tot=0,ok=0,h='';
 DATA.forEach(function(g){var c=0;g.i.forEach(function(x){if(s[x[0]])c++});tot+=g.i.length;ok+=c;
  h+='<div class="lc-sec"><h3><span>'+g.t+'</span><span class="lc-cnt">'+c+' de '+g.i.length+'</span></h3><p class="lc-sub">'+g.s+'</p><ol class="tl lcl">';
  g.i.forEach(function(x){var d=!!s[x[0]];
   h+='<li class="k-'+x[1]+(d?' ok':'')+'" style="grid-template-columns:28px minmax(0,1fr)"><input type="checkbox" id="lc'+x[0]+'" data-i="'+x[0]+'" aria-label="feito"'+(d?' checked':'')+'><div><label for="lc'+x[0]+'" style="color:var(--ink)">'+x[2]+'</label></div></li>'});
  h+='</ol></div>'});
 box.innerHTML=h;
 document.getElementById('pd-prog').innerHTML='<b>'+ok+' de '+tot+'</b> itens marcados ('+(tot?Math.round(ok*100/tot):0)+'%)<div class="pd-bar"><i style="width:'+(tot?ok*100/tot:0)+'%"></i></div>'}
function redraw(){var y=window.scrollY;render();window.scrollTo(0,y)}
box.addEventListener('change',function(e){var c=e.target;if(!c.dataset||!c.dataset.i)return;s[c.dataset.i]=c.checked;keep();
 var o={};o[c.dataset.i]=c.checked;if(ready&&window.FB)FB.set('data/loc',{done:o},true);redraw()});
render();
function bind(){if(!window.FB)return;
 var el=document.getElementById('gx-sync');if(el)FB.strip(el);
 var u1=null;
 FB.onAuth(function(u){if(u1){u1();u1=null}ready=false;if(!u)return;
  u1=FB.watchDoc('loc','data/loc',function(d,meta){
   var r=(d&&d.done)||{},miss={},n=0;
   Object.keys(r).forEach(function(k){s[k]=!!r[k]});
   Object.keys(s).forEach(function(k){if(!(k in r)&&s[k]){miss[k]=s[k];n++}});
   keep();redraw();ready=true;
   if(n&&!meta.fromCache)FB.set('data/loc',{done:miss},true)})})}
if(window.FB)bind();else{document.addEventListener('fb-ready',bind);setTimeout(function(){var el=document.getElementById('gx-sync');if(!window.FB&&el)el.textContent='☁ Salvo só neste aparelho (Firebase indisponível)'},4000)}
})();
