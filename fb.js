/* Bálcãs 2027 · camada Firebase (login Google + Firestore com cache offline).
   Expõe window.FB. Se este arquivo não carregar (sem rede na primeira visita), o site segue funcionando só com o armazenamento local. */
import {initializeApp} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js';
import {getAuth,onAuthStateChanged,GoogleAuthProvider,signInWithPopup,signInWithRedirect,signOut} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-auth.js';
import {initializeFirestore,persistentLocalCache,persistentMultipleTabManager,doc,collection,setDoc,deleteDoc,onSnapshot,writeBatch} from 'https://www.gstatic.com/firebasejs/10.14.1/firebase-firestore.js';

const firebaseConfig={
  apiKey:"AIzaSyD95ASCpiIlMUyrTAH5JpbLtcaQ5hFoy6E",
  authDomain:"balcas-2027.firebaseapp.com",
  projectId:"balcas-2027",
  storageBucket:"balcas-2027.firebasestorage.app",
  messagingSenderId:"671965267655",
  appId:"1:671965267655:web:ef875440d3a74ffb1aa0e2"
};
const BASE='trips/balcas2027';

const app=initializeApp(firebaseConfig);
const auth=getAuth(app);
let db;
try{db=initializeFirestore(app,{localCache:persistentLocalCache({tabManager:persistentMultipleTabManager()})})}
catch(e){db=initializeFirestore(app,{})}

let user=null,authDone=false;
const W={},SL=new Set(),AL=new Set();
const st={state:'init',email:''};

function calc(){
  const ws=Object.values(W);let s;
  if(!authDone)s='init';
  else if(!user)s='out';
  else if(ws.some(w=>w.err==='permission-denied'))s='denied';
  else if(ws.some(w=>w.err))s='error';
  else if(!navigator.onLine)s='offline';
  else if(ws.some(w=>w.pending))s='pending';
  else s='ok';
  st.state=s;st.email=user?(user.email||''):'';
  SL.forEach(f=>{try{f(st)}catch(e){}});
}
addEventListener('online',calc);addEventListener('offline',calc);

onAuthStateChanged(auth,u=>{
  user=u;authDone=true;FB.user=u?{uid:u.uid,email:u.email,name:u.displayName}:null;
  if(!u)for(const k in W)delete W[k];
  AL.forEach(f=>{try{f(FB.user)}catch(e){}});calc();
});

const ref=p=>doc(db,BASE+'/'+p);
const FB={
  ready:true,user:null,status:st,
  onAuth(cb){AL.add(cb);if(authDone)try{cb(FB.user)}catch(e){}return()=>AL.delete(cb)},
  onStatus(cb){SL.add(cb);try{cb(st)}catch(e){}return()=>SL.delete(cb)},
  login(){
    const pr=new GoogleAuthProvider();pr.setCustomParameters({prompt:'select_account'});
    return signInWithPopup(auth,pr).catch(e=>{
      if(e&&(e.code==='auth/popup-blocked'||e.code==='auth/operation-not-supported-in-this-environment'))return signInWithRedirect(auth,pr);
      if(e&&(e.code==='auth/popup-closed-by-user'||e.code==='auth/cancelled-popup-request'))return;
      alert('Não foi possível entrar: '+(e&&e.code||e));
    });
  },
  logout(){return signOut(auth)},
  watchDoc(key,path,cb){
    return onSnapshot(ref(path),{includeMetadataChanges:true},s=>{
      W[key]={pending:s.metadata.hasPendingWrites};
      cb(s.exists()?s.data():null,s.metadata);calc();
    },e=>{W[key]={err:e.code||'error'};calc()});
  },
  watchCol(key,path,cb){
    return onSnapshot(collection(db,BASE+'/'+path),{includeMetadataChanges:true},s=>{
      W[key]={pending:s.metadata.hasPendingWrites};
      cb(s.docs.map(d=>d.data()),s.metadata);calc();
    },e=>{W[key]={err:e.code||'error'};calc()});
  },
  set(path,data,merge){return setDoc(ref(path),data,{merge:!!merge}).catch(e=>{W.w={err:e.code||'error'};calc()})},
  del(path){return deleteDoc(ref(path)).catch(e=>{W.w={err:e.code||'error'};calc()})},
  batch(ops){
    for(let i=0;i<ops.length;i+=400){
      const b=writeBatch(db);
      ops.slice(i,i+400).forEach(o=>{if(o.set)b.set(ref(o.set[0]),o.set[1]);else b.delete(ref(o.del))});
      b.commit().catch(e=>{W.w={err:e.code||'error'};calc()});
    }
  },
  strip(el){
    if(!document.getElementById('fbstrip-css')){
      const s=document.createElement('style');s.id='fbstrip-css';
      s.textContent='.fbstrip{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;justify-content:space-between;font-size:13px;border:1px solid var(--line);background:var(--surface);border-radius:10px;padding:8px 12px;color:var(--muted)}.fbstrip b{color:var(--ink)}.fbstrip.ok b{color:var(--c-tip)}.fbstrip.warn b{color:var(--c-eat)}.fbstrip.bad b{color:var(--c-warn)}.fbstrip button{font:inherit;font-size:13px;font-weight:600;color:var(--ink);background:var(--surface);border:1px solid var(--line);border-radius:8px;padding:6px 12px;min-height:36px;cursor:pointer}.fbstrip button.go{background:var(--accent);border-color:var(--accent);color:var(--accent-ink)}';
      document.head.appendChild(s);
    }
    const draw=s=>{
      const em=s.email?` · ${s.email}`:'';
      const M={
        init:['','<span>☁ Verificando login…</span>'],
        out:['warn','<span><b>☁ Sincronização desligada.</b> Os dados ficam só neste aparelho.</span><button class="go" type="button" data-a="in">Entrar com Google</button>'],
        ok:['ok',`<span><b>☁ Sincronizado</b>${em}</span><button type="button" data-a="out">Sair</button>`],
        pending:['warn',`<span><b>☁ Enviando…</b> Já está salvo neste aparelho${em}</span><button type="button" data-a="out">Sair</button>`],
        offline:['warn',`<span><b>☁ Sem conexão.</b> Tudo fica salvo neste aparelho e sobe quando a internet voltar${em}</span>`],
        denied:['bad',`<span><b>☁ Esta conta não tem acesso</b>${em}. Entre com o Google autorizado.</span><button type="button" data-a="out">Trocar de conta</button>`],
        error:['bad',`<span><b>☁ Erro ao sincronizar.</b> Os dados continuam salvos neste aparelho${em}</span><button type="button" data-a="out">Sair</button>`]
      }[s.state]||['',''];
      el.className='fbstrip '+M[0];el.innerHTML=M[1];
      el.querySelectorAll('[data-a]').forEach(b=>b.onclick=()=>b.dataset.a==='in'?FB.login():FB.logout());
    };
    FB.onStatus(draw);
  }
};
window.FB=FB;
document.dispatchEvent(new Event('fb-ready'));
