#!/usr/bin/env python3
"""Gera search-index.json: o texto de cada página do site, em trechos, para a página busca.html.
Abre cada página num Chromium (para pegar também o que o JavaScript monta), junta o texto por bloco
e guarda: página, título da seção, texto, id mais próximo. Rode a cada publicação (precisa do Playwright)."""
import json,glob,os,subprocess,sys,time,socket
from playwright.sync_api import sync_playwright
SKIP={'gastos.html','diario.html','hoje.html','atualizar.html','locacao.html','orcamento.html','busca.html','dossie.html'}
WAIT={'pendencias.html':7000}
pages=[f for f in sorted(glob.glob('*.html')) if f not in SKIP]
s=socket.socket();s.bind(('127.0.0.1',0));port=s.getsockname()[1];s.close()
srv=subprocess.Popen([sys.executable,'-m','http.server',str(port),'--bind','127.0.0.1'],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
time.sleep(1)
JS=r"""()=>{
 var BAD='script,style,noscript,svg,template,nav.pills,.sdm,.sm-ov,.hbg,.hbg-cov,.bk,#bk-hl,select,textarea,input,option,[data-nosearch]';
 var INL={inline:1,'inline-block':1,'inline-flex':1,'inline-grid':1,contents:1,ruby:1,'ruby-text':1};
 function bad(el){return el.closest&&el.closest(BAD)}
 function hid(el){for(var e=el;e&&e!==document.body;e=e.parentElement){var d=getComputedStyle(e).display;if(d==='none')return true}return false}
 function blockOf(n){var e=n.parentElement;while(e&&e!==document.body){var d=getComputedStyle(e).display;if(!INL[d])break;e=e.parentElement}
   if(!e)return document.body;var tr=e.closest('tr');return tr||e}
 var tw=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),order=[],map=new Map(),n;
 while(n=tw.nextNode()){var t=n.nodeValue.replace(/\s+/g,' ');var p=n.parentElement;if(!t.trim()){if(p&&!bad(p)&&!hid(p)){var b0=blockOf(n);if(map.has(b0)&&p.closest('td,th')===map.get(b0)[map.get(b0).length-1].cell)map.get(b0).push({t:' ',cell:map.get(b0)[map.get(b0).length-1].cell})}continue}if(!p||bad(p)||hid(p))continue;
   var b=blockOf(n);if(!map.has(b)){map.set(b,[]);order.push(b)}
   var cell=p.closest('td,th');map.get(b).push({t:t,cell:cell})}
 var out=[],head='',seen={};
 order.forEach(function(b){
   var parts=[],lastCell=null,cur='';
   map.get(b).forEach(function(x){if(b.tagName==='TR'&&x.cell!==lastCell&&cur){parts.push(cur.trim());cur=''}lastCell=x.cell;cur+=x.t});
   if(cur.trim())parts.push(cur.trim());
   var text=parts.join(' · ').replace(/\s+/g,' ').trim();
   if(text.length<3)return;
   var isH=/^H[1-6]$/.test(b.tagName)||b.tagName==='SUMMARY';
   if(isH)head=text.slice(0,120);
   var id='',e=b;while(e&&e!==document.body&&!id){id=e.id||'';e=e.parentElement}
   if(!id){var pr=b.previousElementSibling;var k=0;while(pr&&k<6&&!id){id=pr.id||'';pr=pr.previousElementSibling;k++}}
   var key=head+'|'+text;if(seen[key])return;seen[key]=1;
   out.push([head,text.slice(0,700),id||'']);
 });
 return {title:document.title.replace(/\s*[·|].*$/,'').trim(),rows:out}
}"""
idx={'v':1,'pages':[],'rows':[]}
with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':430,'height':900})
    for f in pages:
        try:
            pg.goto('http://127.0.0.1:%d/%s'%(port,f),wait_until='load');pg.wait_for_timeout(WAIT.get(f,1800))
            r=pg.evaluate(JS)
        except Exception as e:
            print('ERRO',f,e);continue
        pi=len(idx['pages']);idx['pages'].append([f,r['title'] or f])
        for h,t,a in r['rows']:idx['rows'].append([pi,h,t,a])
        print('%-20s %4d trechos'%(f,len(r['rows'])))
    b.close()
srv.terminate()
js=json.dumps(idx,ensure_ascii=False,separators=(',',':'))
open('search-index.json','w',encoding='utf-8').write(js)
print('total',len(idx['rows']),'trechos,',round(len(js.encode())/1024),'KB')
