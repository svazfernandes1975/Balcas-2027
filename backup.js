/* Backup: baixa gastos + check-ins (com fotos) num arquivo; restaura a partir dele */
(function(){
var KS=['balcas2027-gastos-v1','balcas2027-checkins-v1'];
function stamp(){var d=new Date(),p=function(n){return (n<10?'0':'')+n};return d.getFullYear()+p(d.getMonth()+1)+p(d.getDate())+'-'+p(d.getHours())+p(d.getMinutes())}
function pack(){var o={app:'balcas2027',kind:'backup',at:new Date().toISOString(),data:{}};KS.forEach(function(k){try{var r=localStorage.getItem(k);if(r)o.data[k]=JSON.parse(r)}catch(e){}});return o}
function dl(){var o=pack(),b=new Blob([JSON.stringify(o)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(b);a.download='balcas2027-backup-'+stamp()+'.json';document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove()},1500);
 try{localStorage.setItem('balcas2027-lastbk',String(Date.now()))}catch(e){}return o}
function info(o){var g=o.data[KS[0]],c=o.data[KS[1]];return {g:g&&g.entries?g.entries.length:0,c:Array.isArray(c)?c.length:0}}
function restore(file,done){var fr=new FileReader();fr.onerror=function(){done('Não consegui ler o arquivo.')};fr.onload=function(){var o;try{o=JSON.parse(fr.result)}catch(e){return done('Arquivo inválido.')}
 if(!o||o.app!=='balcas2027'||!o.data)return done('Este arquivo não é um backup do portal.');
 var n=info(o);if(!confirm('Restaurar o backup ('+n.g+' lançamentos, '+n.c+' check-ins)? Isso substitui os dados deste aparelho.'))return done('Restauração cancelada.');
 /* guarda uma cópia do que existe antes */
 try{localStorage.setItem('balcas2027-prerestore',JSON.stringify(pack()))}catch(e){}
 try{KS.forEach(function(k){if(o.data[k])localStorage.setItem(k,JSON.stringify(o.data[k]))})}catch(e){return done('Sem espaço para restaurar.')}
 done('Restaurado. Recarregando…');setTimeout(function(){location.reload()},700)};fr.readAsText(file)}
function mount(){var s=document.getElementById('bk-slot');if(!s)return;
 var last=0;try{last=+localStorage.getItem('balcas2027-lastbk')||0}catch(e){}
 s.innerHTML='<div class="bkc" style="margin:16px 0;padding:12px 14px;border:1px solid var(--line,var(--bd,#d5dde0));border-radius:12px;background:var(--surface,var(--card,#fff));color:var(--ink,inherit)"><b>💾 Backup dos dados</b><div style="font-size:.85rem;opacity:.8;margin:4px 0 8px">Baixa gastos e check-ins (com fotos) num arquivo no aparelho. Faça de vez em quando.'+(last?' Último: '+new Date(last).toLocaleDateString('pt-BR'):'')+'</div><button type="button" class="btn sec sm" id="bk-dl">Baixar backup</button> <button type="button" class="btn sec sm" id="bk-up">Restaurar de arquivo</button><input type="file" id="bk-file" accept="application/json,.json" hidden><div id="bk-msg" style="font-size:.85rem;margin-top:6px"></div></div>';
 var m=document.getElementById('bk-msg');
 document.getElementById('bk-dl').onclick=function(){var o=dl(),n=info(o);m.textContent='Baixado: '+n.g+' lançamentos e '+n.c+' check-ins.'};
 document.getElementById('bk-up').onclick=function(){document.getElementById('bk-file').click()};
 document.getElementById('bk-file').onchange=function(){if(this.files[0])restore(this.files[0],function(t){m.textContent=t})}}
window.BK={pack:pack,download:dl};
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount()})();
