#!/usr/bin/env python3
"""Gera sw.js a partir de sw.tpl.js: lista os arquivos do site e grava a versão atual (lida do nav.js)."""
import glob,re,json
v=re.search(r"SITE_VERSION='(v\d+)'",open('nav.js',encoding='utf-8').read()).group(1)
fs=sorted(glob.glob('*.html')+glob.glob('*.js')+glob.glob('*.css'))
fs=[f for f in fs if f not in('sw.js','sw.tpl.js')]
t=open('sw.tpl.js',encoding='utf-8').read().replace('__VERSION__',v).replace('__FILES__',json.dumps(fs))
open('sw.js','w',encoding='utf-8').write(t);print(v,len(fs),'arquivos')
