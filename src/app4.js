/* ================= ГЛАГОЛ ДНЯ ================= */
/* одна фраза во всех лицах и временах: presente → estar a → ir → PPS */
function lessonNum(){ return dayNum(today()) + (S.lessonOffset||0); }
function verbOfDay(){
  const drills = DATA.verbDrills.filter(d => S.set.units.includes(d.unit));
  return drills[lessonNum() % drills.length];
}
const U_SUBJ = ["У меня","У тебя","У неё","У нас","У них"];
const BE_PAST = ["была","был(а)","была","были","были"];
function ruPhrase(d, tense, p){
  const subj = DATA.subjRu[p];
  if(d.inf==='estar'){
    if(tense==='pres') return `${subj} сейчас ${d.objRu}.`;
    return `Вчера ${subj.toLowerCase()} ${BE_PAST[p]} ${d.objRu}.`;
  }
  if(d.inf==='ter'){
    if(tense==='pres') return `${U_SUBJ[p]} ${d.objRu}.`;
    if(tense==='ir') return `Завтра ${U_SUBJ[p].toLowerCase()} будет ${d.objRu}.`;
    return `Вчера ${U_SUBJ[p].toLowerCase()} был ${d.objRu}.`;
  }
  if(tense==='pres') return `${subj} ${d.ruPres[p]} ${d.objRu}.`;
  if(tense==='estar') return `${subj} сейчас ${d.ruPres[p]} ${d.objRu}.`;
  if(tense==='ir'){
    const rf = DATA.ruFut[d.inf];
    return rf ? `${subj} ${rf[p]} ${d.objRu}.` : `${subj} ${DATA.futRu[p]} ${d.ruInf} ${d.objRu}.`;
  }
  const v = p===0||p===2 ? d.ruPastF : (p===1 ? d.ruPastF.replace(/ла( |$)/,'л(а)$1') : d.ruPastP);
  return `Вчера ${subj.toLowerCase()} ${v} ${d.objRu}.`;
}
function ptPhrase(d, tense, p){
  const v = DATA.verbs.find(x=>x.inf===d.inf);
  const f = conjForm(v, tense, p);
  if(!f) return null;
  const subj = DATA.subjPt[p];
  let pre = '';
  if(tense==='pps') pre = 'Ontem, ';
  if(tense==='ir' && d.inf==='ter') pre = 'Amanhã, ';
  const sj = pre ? (subj==='Eu'?'eu':subj[0].toLowerCase()+subj.slice(1)) : subj;
  return `${pre}${pre? sj.charAt(0)+sj.slice(1) : subj} ${f} ${d.obj}.`;
}
function ptVariants(pt){
  const out = [pt];
  const noAdv = pt.replace(/^(Ontem|Amanhã), /,'');
  if(noAdv!==pt) out.push(noAdv.charAt(0).toUpperCase()+noAdv.slice(1));
  for(const base of [...out]){
    const m = base.match(/^(Ontem, |Amanhã, )?(eu|tu|ela|nós|eles)\s+(.+)$/i);
    if(m){
      const rest = m[3];
      const v = (m[1]||'') + rest.charAt(0).toUpperCase() + rest.slice(1);
      if(!out.includes(v)) out.push(v);
    }
  }
  return out;
}
function tensesForDrill(d){
  const v = DATA.verbs.find(x=>x.inf===d.inf);
  return ['pres','estar','ir','pps'].filter(t=>{
    if(t==='pps' && !v.pps) return false;
    if(d.inf==='estar' && (t==='estar'||t==='ir')) return false;
    if(!d.cont && t==='estar') return false;
    return true;
  });
}
function startVerbDay(){
  const d = verbOfDay();
  const v = DATA.verbs.find(x=>x.inf===d.inf);
  const tenses = tensesForDrill(d);
  const steps = [];
  tenses.forEach(t=>{
    const ps = shuffle([0,1,2,3,4]).slice(0, t==='pres'?5:3);
    ps.forEach(p=>{
      const pt = ptPhrase(d,t,p); if(!pt) return;
      steps.push({t, p, ru: ruPhrase(d,t,p), pt});
    });
  });
  SES = {queue: steps.map(s=>{ const q = ({
      p:{id:'vd-'+d.inf+'-'+s.t+'-'+s.p, kind:'trans', unit:d.unit, group:'trans',
         rule: s.t==='pres'?'pres_regulares':s.t==='estar'?'estar_a':s.t==='ir'?'ir_inf':'pps_regulares'},
      id:'vd-'+d.inf+'-'+s.t+'-'+s.p,
      type:'input', big:true,
      label:`Глагол дня: ${d.inf} · ${TENSES[s.t].name}`,
      prompt: s.ru, answers: ptVariants(s.pt),
      speakAfter: s.pt,
      rule: s.t==='pres'?'pres_regulares':s.t==='estar'?'estar_a':s.t==='ir'?'ir_inf':'pps_regulares',
      conj:{v, tense:s.t, person:s.p}
    }); q.p._pre = q; return q; }), i:0, right:0, wrong:0, again:[], log:[], title:'Глагол дня'};
  renderSession();
}

/* ================= ИСТОРИЯ ================= */
function startStory(st){
  const steps = st.phrases.map((ph,i)=>{ const q = ({
    p:{id:'st-'+st.unit+'-'+st.title+'-'+i, kind:'trans', unit:st.unit, group:'trans', rule:null},
    id:'st-'+st.unit+'-'+st.title+'-'+i,
    type:'input', big:true,
    label:`История: ${st.title} · фраза ${i+1} из ${st.phrases.length}`,
    prompt: ph.ru, answers:[ph.pt, ...(ph.alts||[])],
    speakAfter: ph.pt, story:{st, i}
  }); q.p._pre = q; return q; });
  SES = {queue:steps, i:0, right:0, wrong:0, again:[], log:[], title:'История: '+st.title,
         storyDone:st};
  renderSession();
}
function storiesFor(unit){
  return DATA.stories.filter(s=> unit? s.unit===unit : S.set.units.includes(s.unit));
}
function storyOfDay(){
  const list = storiesFor(null);
  return list[lessonNum() % list.length];
}

/* ================= ДИАЛОГИ (голос) ================= */
const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
let rec = null, recActive = false;

/* диктовка в текстовое поле (перевод, спряжения, истории) */
let dictRec = null, dictActive = false, dictBtnEl = null, dictAccum = '';
function toggleDictation(inp, btn){
  if(dictActive){ stopDictation(); return; }
  speechSynthesis.cancel();
  dictRec = new SR();
  dictRec.lang = 'pt-PT'; dictRec.interimResults = true; dictRec.continuous = true;
  const deadline = Date.now() + 15000;
  dictActive = true; dictBtnEl = btn; dictAccum = '';
  btn.textContent = '◼ стоп'; btn.style.background = 'var(--warn)';
  btn.style.color = '#fff'; btn.style.borderColor = 'var(--warn)';
  dictRec.onresult = e=>{
    let t = ''; for(const r of e.results) t += r[0].transcript + ' ';
    inp.value = (dictAccum + ' ' + t).trim();
  };
  dictRec.onerror = e=>{ if(e.error !== 'no-speech') stopDictation(); };
  dictRec.onend = ()=>{
    if(dictActive && Date.now() < deadline){
      dictAccum = inp.value;                       // не теряем сказанное при перезапуске
      try{ dictRec.start(); return; }catch(err){}
    }
    stopDictation();
  };
  dictRec.start();
  inp.focus();
}
function stopDictation(){
  dictActive = false;
  if(dictRec){ dictRec.onend = null; try{ dictRec.stop(); }catch(e){} dictRec = null; }
  if(dictBtnEl){ dictBtnEl.textContent = '🎤'; dictBtnEl.style.background = ''; dictBtnEl.style.color = ''; dictBtnEl = null; }
}

function dialogsList(){
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Диалоги · говорим вслух</h2>
     <p class="small muted" style="margin-top:-6px">Собеседник говорит по-португальски, вы отвечаете в микрофон.
     ${SR? '' : '<br><b style="color:var(--warn)">В этом браузере нет распознавания речи — откройте в Chrome или Safari, либо отвечайте текстом.</b>'}</p>
     <div class="grid">${DATA.dialogs.map(d=>{
       const done = (S.hist['dlg-'+d.id]||0);
       return `<button class="mode" data-d="${d.id}">
         <div class="t">${d.icon} ${esc(d.title)}</div>
         <div class="d">${esc(d.brief)}</div>
         ${done?`<div class="small" style="color:var(--accent);margin-top:5px">пройден ×${done}</div>`:''}
       </button>`;}).join('')}</div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-d]').forEach(b=> b.onclick = ()=>
    startDialog(DATA.dialogs.find(d=>d.id===b.dataset.d)));
}

let DLG = null;
function startDialog(d){
  DLG = {d, i:0, ok:0, tries:0, answers:[]};
  renderDialogIntro();
}
function renderDialogIntro(){
  const d = DLG.d;
  document.getElementById('view').innerHTML = `
   <div class="card">
     <div class="qtype">Диалог · ${esc(d.title)}</div>
     <div class="prompt" style="font-size:20px">${d.icon} Ваша задача</div>
     <p style="font-size:16.5px;line-height:1.6">${esc(d.brief)}</p>
     <p class="small muted">Слушайте собеседника и отвечайте вслух по-португальски.
        Не обязательно слово в слово — система ищет ключевые слова в вашем ответе.</p>
     <div class="row" style="margin-top:10px">
       <button class="btn" id="go">Начать разговор</button>
       <button class="btn ghost" id="back">← к списку</button>
     </div>
   </div>`;
  document.getElementById('go').onclick = ()=> renderDialogStep();
  document.getElementById('back').onclick = dialogsList;
}
function renderDialogStep(){
  const d = DLG.d;
  if(DLG.i >= d.steps.length) return finishDialog();
  const s = d.steps[DLG.i];
  document.getElementById('view').innerHTML = `
   <div class="card">
     <div style="display:flex;align-items:center;gap:10px">
       <button class="btn ghost small" id="quit" style="padding:6px 10px;font-size:13px">← выйти</button>
       <span class="small muted">${d.icon} ${esc(d.title)} · ${DLG.i+1}/${d.steps.length}</span>
     </div>
     <div class="bar"><i style="width:${Math.round(DLG.i/d.steps.length*100)}%"></i></div>
     <div class="qtype">Собеседник говорит <button class="speak" id="rep">🔊 ещё раз</button></div>
     <div class="prompt" style="font-size:21px">«${esc(s.say)}»<small>${esc(s.ru)}</small></div>
     <div class="verdict" style="background:var(--accent-soft);border:1px solid var(--accent);margin-top:10px">
       <b>Ваша задача:</b> ${esc(s.task)}</div>
     <div style="text-align:center;margin-top:18px">
       <button id="mic" style="width:84px;height:84px;border-radius:50%;border:none;font-size:34px;
         background:var(--accent);color:#fff;box-shadow:var(--shadow);transition:transform .1s">🎤</button>
       <div class="small muted" id="micState" style="margin-top:8px">${SR?'нажмите и говорите':'распознавание недоступно — ответьте текстом'}</div>
     </div>
     <div style="margin-top:12px">
       <input class="answer" id="typed" placeholder="…или напишите ответ здесь" autocomplete="off" autocapitalize="off" spellcheck="false">
       <div class="row" style="margin-top:10px">
         <button class="btn ghost" id="send">Отправить текст</button>
         <button class="btn ghost" id="hint">Подсказка</button>
       </div>
     </div>
     <div id="verdict"></div>
   </div>`;
  say(s.say);
  document.getElementById('rep').onclick = ()=> say(s.say);
  document.getElementById('quit').onclick = ()=>{ stopRec(); DLG=null; dialogsList(); };
  document.getElementById('hint').onclick = e=>{
    const all = [s.model, ...(s.models||[])];
    e.target.outerHTML = `<div class="small muted" style="align-self:center;line-height:1.7">`+
      all.map(m=>`💬 ${esc(m)}`).join('<br>')+`</div>`; };
  const mic = document.getElementById('mic');
  if(SR) mic.onclick = ()=> toggleRec(s);
  else { mic.style.opacity=.4; mic.style.cursor='default'; }
  const typed = document.getElementById('typed');
  document.getElementById('send').onclick = ()=> judgeDialog(s, typed.value);
  typed.onkeydown = e=>{ if(e.key==='Enter'){ e.preventDefault(); judgeDialog(s, typed.value); } };
}
function toggleRec(s){
  if(recActive){ userStopRec(); return; }
  speechSynthesis.cancel();
  rec = new SR();
  rec.lang = 'pt-PT'; rec.interimResults = true; rec.continuous = true; rec.maxAlternatives = 3;
  const mic = document.getElementById('mic'), st = document.getElementById('micState');
  const deadline = Date.now() + 15000;          // слушаем до 15 секунд
  let accumulated = '', interim = '';
  recActive = true;
  const remain = ()=> Math.max(0, Math.ceil((deadline-Date.now())/1000));
  const timer = setInterval(()=>{
    if(!recActive){ clearInterval(timer); return; }
    if(Date.now() >= deadline){ clearInterval(timer); userStopRec(); }
    else if(st && !interim && !accumulated) st.textContent = `слушаю… ${remain()} с · нажмите ещё раз, когда закончите`;
  }, 500);
  rec._finalize = ()=>{
    clearInterval(timer);
    const text = (accumulated + ' ' + interim).trim();
    resetMic();
    if(text) judgeDialog(s, text);
    else if(st) st.textContent = 'ничего не расслышала — попробуйте ещё раз';
  };
  rec.onstart = ()=>{ mic.style.background='var(--warn)'; mic.textContent='◼';
    st.textContent = `слушаю… ${remain()} с · нажмите ещё раз, когда закончите`; };
  rec.onresult = e=>{
    accumulated = ''; interim = '';
    for(const r of e.results){
      if(r.isFinal) accumulated += r[0].transcript + ' ';
      else interim += r[0].transcript + ' ';
    }
    st.textContent = '«'+(accumulated+interim).trim()+'»';
  };
  rec.onerror = e=>{
    if(e.error==='no-speech') return;           // тишина — просто ждём дальше
    recActive=false; clearInterval(timer); resetMic();
    st.textContent = e.error==='not-allowed' ? 'нет доступа к микрофону — разрешите в настройках браузера' : 'ошибка: '+e.error;
  };
  rec.onend = ()=>{
    if(recActive && Date.now() < deadline){
      try{ rec.start(); return; }catch(err){}   // браузер сам закрыл на паузе — продолжаем слушать
    }
    if(recActive){ recActive=false; const f=rec._finalize; rec._finalize=null; if(f) f(); }
  };
  rec.start();
}
function userStopRec(){
  if(!recActive) return;
  recActive = false;
  const r = rec, f = r._finalize;
  r._finalize = null;
  try{ r.stop(); }catch(e){}
  if(f) f();
}
function stopRec(){ if(rec){ rec._finalize=null; rec.onend=null; try{rec.stop();}catch(e){} } recActive=false; resetMic(); }
function resetMic(){ const m=document.getElementById('mic'); if(m){ m.style.background='var(--accent)'; m.textContent='🎤'; } }

function judgeDialog(s, text){
  stopRec();
  if(!text || !text.trim()) return;
  const t = strip(text.toLowerCase());
  const missing = [];
  for(const group of s.keys){
    if(!group.some(k => t.includes(strip(k.toLowerCase())))) missing.push(group[0]);
  }
  // структура: фраза должна быть похожа на один из образцов, а не просто содержать слова
  const models = [s.model, ...(s.models||[])];
  let bestSim = 0, bestModel = s.model;
  for(const m of models){ const v = sim(text, m); if(v > bestSim){ bestSim = v; bestModel = m; } }
  const grammarOk = bestSim >= 0.55;
  const ok = missing.length === 0 && grammarOk;
  DLG.tries++;
  const firstTry = !DLG.answers.some(a=>a.step===DLG.i);
  DLG.answers.push({step:DLG.i, task:s.task, given:text, ok, model:s.model,
                    models:s.models||[], missing, firstTry});
  const v = document.getElementById('verdict');
  const variants = m => m && m.length ?
    `<div class="ru" style="margin-top:6px">ещё можно сказать:<br>${m.map(x=>'· '+esc(x)).join('<br>')}</div>` : '';
  if(ok){
    DLG.ok++;
    v.innerHTML = `<div class="verdict ok"><div class="big">✓ Отлично!</div>
      <div class="ru">вы сказали: «${esc(text)}»</div>
      <div class="ru">образец: ${esc(s.model)}</div>${variants(s.models)}</div>
      <button class="btn wide" id="next" style="margin-top:12px">Дальше →</button>`;
    say(s.model);
    document.getElementById('next').onclick = ()=>{ DLG.i++; renderDialogStep(); };
  }else{
    const d = wordDiff(text, bestModel);
    const head = missing.length
      ? `Не хватает: ${missing.map(esc).join(', ')}`
      : `Слова есть, но фраза построена неверно`;
    v.innerHTML = `<div class="verdict no"><div class="big">${head}</div>
      <div class="ru" style="font-size:15px;margin-top:6px">вы: ${d.givenHtml}</div>
      <div class="ru">образец: <span class="diff" style="font-weight:600;color:var(--ink)">${d.targetHtml}</span></div>
      ${variants(s.models)}</div>
      <div class="row" style="margin-top:12px">
        <button class="btn" id="retry">Попробовать ещё раз</button>
        <button class="btn ghost" id="skipD">Пропустить</button>
      </div>`;
    document.getElementById('retry').onclick = ()=> renderDialogStep();
    document.getElementById('skipD').onclick = ()=>{ DLG.i++; renderDialogStep(); };
  }
}
function finishDialog(){
  const d = DLG.d;
  S.hist['dlg-'+d.id] = (S.hist['dlg-'+d.id]||0)+1;
  // статистика: по каждому шагу — первая попытка, ошибки
  const firstOk = d.steps.map((_,i)=>{
    const a = DLG.answers.find(x=>x.step===i && x.firstTry);
    return a ? (a.ok?1:0) : 0;
  });
  S.dlg = S.dlg || {};
  const rec = S.dlg[d.id] = S.dlg[d.id] || {runs:0, steps:d.steps.length, hist:[]};
  rec.runs++; rec.hist.push({d:today(), ok:firstOk.reduce((a,b)=>a+b,0)});
  if(rec.hist.length>20) rec.hist = rec.hist.slice(-20);
  const dd = today(); S.hist[dd] = S.hist[dd]||{n:0,ok:0};
  S.hist[dd].n += d.steps.length; S.hist[dd].ok += firstOk.reduce((a,b)=>a+b,0);
  save();
  // разбор: все шаги, где первая попытка была неудачной или шаг пропущен
  const problems = [];
  d.steps.forEach((st,i)=>{
    const tries = DLG.answers.filter(a=>a.step===i);
    const first = tries.find(a=>a.firstTry);
    const solved = tries.some(a=>a.ok);
    if(!first || !first.ok || !solved){
      problems.push({st, first, solved});
    }
  });
  const nOk = firstOk.reduce((a,b)=>a+b,0);
  let review = '';
  if(problems.length){
    review = `<div class="card"><h2>Разбор · ${problems.length} ${plural(problems.length,'реплика','реплики','реплик')}</h2>` +
      problems.map(p=>`<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line)">
        <div class="small muted">${esc(p.st.task)}</div>
        ${p.first && p.first.given ? `<div style="color:var(--warn)">✗ «${esc(p.first.given)}»
           <span class="small muted">${p.first.missing.length? '— не хватило: '+p.first.missing.map(esc).join(', ') : '— фраза построена неверно'}</span></div>`
          : `<div class="small muted">— пропущено —</div>`}
        <div style="color:var(--accent);font-weight:600">✓ ${esc(p.st.model)}
          <button class="speak" data-s="${esc(p.st.model)}">🔊</button></div>
        ${(p.st.models||[]).length? `<div class="small muted">также: ${p.st.models.map(esc).join(' · ')}</div>`:''}
      </div>`).join('') + `</div>`;
  }
  document.getElementById('view').innerHTML = review + `
   <div class="card done-hero">
     <div class="em">${nOk===d.steps.length?'🎉':'🗣'}</div>
     <h3>Диалог пройден</h3>
     <p class="muted">${nOk} из ${d.steps.length} реплик принято с первой попытки</p>
     <p class="small muted">пройден ${rec.runs} ${plural(rec.runs,'раз','раза','раз')}${rec.hist.length>1?
       ' · прошлые: '+rec.hist.slice(-5,-1).map(h=>h.ok+'/'+rec.steps).join(', '):''}</p>
     <div class="row" style="justify-content:center;margin-top:16px">
       <button class="btn" id="again">Ещё раз</button>
       <button class="btn ghost" id="list">Другие диалоги</button>
       <button class="btn ghost" id="home3">На главную</button>
     </div>
   </div>`;
  document.querySelectorAll('.speak[data-s]').forEach(b=> b.onclick=()=>say(b.dataset.s));
  document.getElementById('again').onclick = ()=> startDialog(d);
  document.getElementById('list').onclick = dialogsList;
  document.getElementById('home3').onclick = home;
  DLG = null;
}
