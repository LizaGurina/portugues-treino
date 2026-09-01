/* ---------- хранилище и настройки ---------- */
const KEY = 'pav1-treino-v1';
const DEF = {
  items:{}, streak:0, lastDay:null, hist:{}, newToday:0, newDay:null,
  set:{ len:20, newPerDay:20, strict:true, speak:true, units:[1,2,3,4,5,6,7,8],
        focus:{conj:30, trans:25, rules:30, vocab:15} }
};
let S = load();
function load(){
  try{ const r = JSON.parse(localStorage.getItem(KEY)); if(r&&r.items){ r.set = Object.assign({}, DEF.set, r.set||{}); return r; } }catch(e){}
  return JSON.parse(JSON.stringify(DEF));
}
function save(){ localStorage.setItem(KEY, JSON.stringify(S)); }
const today = () => new Date().toISOString().slice(0,10);
const dayNum = d => Math.floor(new Date(d+'T00:00:00').getTime()/864e5);

/* ---------- Leitner ---------- */
const BOX_DAYS = [0,1,3,7,16,35];
function meta(id){ return S.items[id] || (S.items[id] = {b:0,due:null,r:0,w:0}); }
function schedule(id, ok){
  const m = meta(id);
  m.b = ok ? Math.min(5, m.b+1) : (m.b>=3 ? 1 : 0);
  ok ? m.r++ : m.w++;
  const d = new Date(); d.setDate(d.getDate() + BOX_DAYS[m.b]);
  m.due = d.toISOString().slice(0,10);
  m.seen = today();
}
const isDue = id => { const m=S.items[id]; return m && m.due && m.due <= today(); };
const isNew = id => !S.items[id] || S.items[id].due === null;

/* ---------- нормализация и сверка ---------- */
const strip = s => s.normalize('NFD').replace(/[̀-ͯ]/g,'');
function norm(s){
  return (s||'').toLowerCase().trim()
    .replace(/[«»""'']/g,'"').replace(/\s+/g,' ')
    .replace(/[.!?;,]+$/,'').replace(/\s([.,!?;:])/g,'$1');
}
const canon = s => norm(s).replace(/[.,!?;:«»"()]/g,'').replace(/\s+/g,' ').trim();
/* «3: 15», «3 h 15», «3.15», «03:15» → «3:15» */
function normTime(s){
  let t = (s||'').toString().trim().toLowerCase()
    .replace(/\s*[:.\-hн]\s*/g, ':')
    .replace(/\s+/g, '');
  const m = t.match(/^(\d{1,2}):?(\d{2})?$/);
  if(!m) return null;
  const h = parseInt(m[1],10), mi = m[2] ? parseInt(m[2],10) : 0;
  if(h>24 || mi>59) return null;
  return h + ':' + String(mi).padStart(2,'0');
}
function check(given, answers){
  const gt = normTime(given);
  if(gt){
    for(const a of answers){ const at = normTime(a); if(at && at===gt) return {ok:true, target:a}; }
  }
  const g = canon(given);
  const digits = x => (x||'').toString().replace(/[\s.,']/g,'');
  if(/^[\d\s.,']+$/.test(given||'')){
    for(const a of answers){ if(/^[\d\s.,']+$/.test(a) && digits(a)===digits(given)) return {ok:true, target:a}; }
  }
  for(const a of answers){ if(g === canon(a)) return {ok:true, target:a}; }
  for(const a of answers){ if(strip(g) === strip(canon(a))) return {ok:!S.set.strict, near:true, target:a}; }
  // ближайший ответ для показа
  let best = answers[0], bs = -1;
  for(const a of answers){ const s = sim(g, norm(a)); if(s>bs){bs=s;best=a;} }
  return {ok:false, near:false, target:best};
}
function simTok(s){ return strip((s||'').toLowerCase()).split(/\s+/)
  .map(w=>w.replace(/[^a-z0-9-]/g,'')).filter(Boolean); }
function sim(a,b){ // доля общих слов (по нормализованной форме)
  const A = simTok(a), B = simTok(b);
  if(!A.length || !B.length) return 0;
  const setB = new Map(); B.forEach(w=>setB.set(w,(setB.get(w)||0)+1));
  let n=0; for(const w of A){ const c=setB.get(w)||0; if(c>0){ n++; setB.set(w,c-1); } }
  return 2*n/(A.length+B.length);
}
function diffHtml(given, target){
  const g = given.trim(), t = target;
  let out = '', i = 0;
  const gs = strip(g.toLowerCase()), ts = strip(t.toLowerCase());
  if(gs === ts){ // только диакритика
    for(i=0;i<t.length;i++){
      const same = g[i] && g[i].toLowerCase() === t[i].toLowerCase();
      out += same ? esc(t[i]) : '<b>'+esc(t[i])+'</b>';
    }
    return out;
  }
  return esc(t);
}
const esc = s => (s+'').replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

/* пословный дифф: LCS по нормализованным словам */
function wordDiff(given, target){
  const tokG = given.trim().split(/\s+/), tokT = target.trim().split(/\s+/);
  const nG = tokG.map(w=>strip(norm(w))), nT = tokT.map(w=>strip(norm(w)));
  const m = nG.length, n = nT.length;
  const L = Array.from({length:m+1},()=>new Array(n+1).fill(0));
  for(let i=m-1;i>=0;i--) for(let j=n-1;j>=0;j--)
    L[i][j] = nG[i]===nT[j] ? L[i+1][j+1]+1 : Math.max(L[i+1][j], L[i][j+1]);
  const okG = new Array(m).fill(false), okT = new Array(n).fill(false);
  let i=0, j=0;
  while(i<m && j<n){
    if(nG[i]===nT[j]){ okG[i]=true; okT[j]=true; i++; j++; }
    else if(L[i+1][j] >= L[i][j+1]) i++;
    else j++;
  }
  const exactT = {}; tokT.forEach((w,k)=>{ exactT[nT[k]] = exactT[nT[k]]||w; });
  const givenHtml = tokG.map((w,k)=>{
    if(!okG[k]) return `<span class="wr">${esc(w)}</span>`;
    const tw = exactT[nG[k]];
    if(tw && norm(w)!==norm(tw)) return `<span class="wr">${esc(w)}</span>`;
    return esc(w);
  }).join(' ');
  const targetHtml = tokT.map((w,k)=> okT[k] ? esc(w) : `<b>${esc(w)}</b>`).join(' ');
  return {givenHtml, targetHtml};
}

/* ---------- озвучка ---------- */
let voices = [];
function pickVoice(){
  voices = speechSynthesis.getVoices();
  return voices.find(v=>v.lang==='pt-PT') || voices.find(v=>v.lang&&v.lang.startsWith('pt')) || null;
}
if(window.speechSynthesis){ speechSynthesis.onvoiceschanged = pickVoice; pickVoice(); }
function say(text){
  if(!S.set.speak || !window.speechSynthesis) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text.replace(/_+/g,' … '));
  const v = pickVoice(); if(v) u.voice = v;
  u.lang = 'pt-PT'; u.rate = .92;
  speechSynthesis.speak(u);
}

/* ---------- сборка пула заданий ---------- */
const PERSONS = DATA.persons;
const TENSES = {
  pres:  {name:'Presente do Indicativo', short:'настоящее'},
  estar: {name:'Estar a + Infinitivo',   short:'перифраза: действие сейчас'},
  ir:    {name:'Ir + Infinitivo',        short:'перифраза: будущее'},
  pps:   {name:'Pretérito Perfeito Simples do Indicativo (PPS)', short:'простое прошедшее'}
};
const ESTAR = ['estou a','estás a','está a','estamos a','estão a'];
const IR    = ['vou','vais','vai','vamos','vão'];
const REFL  = ['me','te','se','nos','se'];

function conjForm(v, tense, p){
  if(tense==='pres') return v.pres[p];
  if(tense==='pps')  return v.pps ? v.pps[p] : null;
  if(v.impersonal && p!==2 && p!==4) return null;
  const inf = v.refl ? v.inf.slice(0,-2) + REFL[p] : v.inf;   // levantar-se → levantar-me
  const aux = (tense==='estar'?ESTAR:IR)[v.impersonal?2:p];
  return aux + ' ' + inf;
}

let POOL = [];
function buildPool(){
  POOL = [];
  // лексика
  DATA.vocab.forEach((w,i)=>{
    POOL.push({id:'v'+i, kind:'vocab', pt:w.pt, ru:w.ru, art:w.art, unit:w.unit, theme:w.theme, group:'vocab'});
    if(w.art) POOL.push({id:'g'+i, kind:'gender', pt:w.pt, ru:w.ru, art:w.art, unit:w.unit, theme:w.theme, group:'vocab'});
  });
  // спряжения
  DATA.verbs.forEach((v,i)=>{
    ['pres','estar','ir','pps'].forEach(t=>{
      if(t==='pps' && !v.pps) return;
      if(v.impersonal && (t==='estar')) return;
      POOL.push({id:'c'+i+t, kind:'conj', vi:i, tense:t, unit:v.unit, group:'conj', irr:!!v.irr,
                 rule: t==='pres'?'pres_regulares': t==='estar'?'estar_a': t==='ir'?'ir_inf':(v.pps&&DATA.ppsIrr.includes(v.inf)?'pps_irregulares':'pps_regulares')});
    });
  });
  DATA.verbDrills.forEach((d,i)=>{
    ['pres','estar','ir','pps'].forEach(t=>{
      if(t==='estar' && !d.cont) return;
      if(d.inf==='estar' && (t==='estar'||t==='ir')) return;
      const v = DATA.verbs.find(x=>x.inf===d.inf);
      if(t==='pps' && (!v || !v.pps)) return;
      POOL.push({id:'ch'+i+t, kind:'conjh', di:i, tense:t, unit:d.unit, group:'conj', irr:!!(v&&v.irr)});
    });
  });
  NUM_SET.forEach(n=>{
    const unit = n<=50?1: n<=160?2: 4;
    POOL.push({id:'nw'+n, kind:'numw', n, unit, theme:'números', group:'rules'});
    POOL.push({id:'nh'+n, kind:'numh', n, unit, theme:'números', group:'rules'});
  });
  HORA_SET.forEach(t=>{
    POOL.push({id:'hw'+t, kind:'horaw', t, unit:3, theme:'horas', group:'rules'});
    POOL.push({id:'hh'+t, kind:'horah', t, unit:3, theme:'horas', group:'rules'});
  });
  DATA.qw.forEach((x,i)=>{
    POOL.push({id:'qw'+i, kind:'qw', i, unit:3, qwg:x.g, group:'trans'});
    POOL.push({id:'qh'+i, kind:'qwh', i, unit:3, qwg:x.g, group:'trans'});
  });
  DATA.complex.forEach((x,i)=>
    POOL.push({id:'cx'+i, kind:'cx', i, unit:7, cxg:x.g, rule:x.rule, group:'trans'}));
  DATA.antonyms.forEach((x,i)=>
    POOL.push({id:'a'+i, kind:'anto', i, unit:7, theme:'antónimos', group:'vocab'}));
  DATA.gaps.forEach((x,i)=> POOL.push({id:'x'+i, kind:'gap', i, unit:x.unit, rule:x.rule, group:'rules'}));
  DATA.mc.forEach((x,i)=>  POOL.push({id:'m'+i, kind:'mc',  i, unit:x.unit, rule:x.rule, group:'rules'}));
  DATA.trans.forEach((x,i)=>POOL.push({id:'t'+i, kind:'trans', i, unit:x.unit, rule:x.rule, group:'trans'}));
  // числа/часы/антонимы — сквозные, не зависят от выбранных юнитов
  const CROSS = new Set(['numw','numh','horaw','horah','anto']);
  POOL = POOL.filter(p => CROSS.has(p.kind) || S.set.units.includes(p.unit));
}

/* ---------- подбор сессии ---------- */
function pickSession(n, filter){
  const pool = POOL.filter(filter || (()=>true));
  const due = pool.filter(p=>isDue(p.id));
  due.sort((a,b)=> (S.items[a.id].due||'').localeCompare(S.items[b.id].due||''));
  const out = due.slice(0, n);
  if(out.length < n){
    if(S.newDay !== today()){ S.newDay = today(); S.newToday = 0; }
    let budget = filter ? 999 : Math.max(0, S.set.newPerDay - S.newToday);
    const fresh = shuffle(pool.filter(p=>isNew(p.id)));
    const w = S.set.focus, quota = {conj:0,trans:0,rules:0,vocab:0};
    const need = n - out.length;
    Object.keys(quota).forEach(k => quota[k] = Math.round(need * w[k]/100));
    for(const p of fresh){
      if(out.length>=n || budget<=0) break;
      const g = p.group;
      if(quota[g] > 0){ out.push(p); quota[g]--; budget--; }
    }
    for(const p of fresh){ if(out.length>=n||budget<=0) break; if(!out.includes(p)){ out.push(p); budget--; } }
    // если дневной лимит новых исчерпан, всё равно добираем сессию до полной длины
    for(const p of fresh){ if(out.length>=n) break; if(!out.includes(p)) out.push(p); }
  }
  if(out.length < n){ // добираем слабыми
    const weak = pool.filter(p=>S.items[p.id] && !out.includes(p))
                     .sort((a,b)=> (S.items[b.id].w||0)-(S.items[a.id].w||0));
    out.push(...weak.slice(0, n-out.length));
  }
  if(out.length < n){ // всё уже пройдено — повторяем досрочно (ближайшие по сроку первыми)
    const rest = pool.filter(p=>!out.includes(p))
      .sort((a,b)=> (((S.items[a.id]||{}).due)||'9999').localeCompare((((S.items[b.id]||{}).due)||'9999')));
    out.push(...rest.slice(0, n-out.length));
  }
  return shuffle(out);
}
function themeOfDay(){
  return DATA.themes[(dayNum(today()) + (S.lessonOffset||0)) % DATA.themes.length];
}
function themePool(th){
  const keys = new Set(th.vt);
  return POOL.filter(p => (p.theme && keys.has(p.theme)) ||
                          (th.key==='festas' && p.kind==='anto'));
}
function shuffle(a){ a=[...a]; for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];} return a; }
const rnd = a => a[Math.floor(Math.random()*a.length)];
