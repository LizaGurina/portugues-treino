/* ---------- формирование вопроса ---------- */
function makeQ(p){ if(p._pre) return p._pre;
  const q = {p, id:p.id};
  if(p.kind==='vocab'){
    const m = S.items[p.id];
    let production = m && m.b >= 2;        // сначала узнавание, потом производство
    if(SES && SES.mode==='rec') production = false;
    if(SES && SES.mode==='prod') production = true;
    if(production){
      q.type='input'; q.label='Переведите на португальский';
      q.prompt=p.ru; q.answers=[p.pt, (p.art? p.art+' '+p.pt : p.pt)];
      q.speakAfter=p.pt; q.note = p.art ? 'артикль не обязателен' : '';
    }else{
      q.type='choice'; q.label='Что это значит?'; q.prompt=(p.art? p.art+' ':'')+p.pt;
      q.speakNow=p.pt;
      const others = shuffle(DATA.vocab.filter(w=>w.theme===p.theme && w.ru!==p.ru)).slice(0,3);
      while(others.length<3){ const c=rnd(DATA.vocab); if(c.ru!==p.ru && !others.includes(c)) others.push(c); }
      q.options = shuffle([p.ru, ...others.map(o=>o.ru)]); q.correct=p.ru;
    }
  }
  else if(p.kind==='gender'){
    q.type='choice'; q.label='Какой артикль?'; q.prompt='___ '+p.pt;
    q.sub=p.ru; q.options=['o','a','os','as']; q.correct=p.art; q.speakAfter=p.art+' '+p.pt;
  }
  else if(p.kind==='conj'){
    const v = DATA.verbs[p.vi];
    let ps = [0,1,2,3,4].filter(i => conjForm(v,p.tense,i));
    const i = rnd(ps), form = conjForm(v,p.tense,i);
    q.type='input'; q.label=TENSES[p.tense].name;
    q.conj={v, tense:p.tense, person:i};
    q.prompt=`${PERSONS[i]} — <span style="color:var(--accent)">${v.inf}</span>`;
    const MK = {pres:'обычно', estar:'прямо сейчас', ir:'завтра', pps:'вчера'};
    const SUBJ_LC = ['я','ты','она','мы','они'];
    q.subHtml = `${esc(v.ru)} · <b style="color:var(--warn)">${TENSES[p.tense].short} — ${MK[p.tense]} ${SUBJ_LC[i]}…</b>`;
    q.answers=[form];
    if(!v.impersonal) PERSONS[i].split(', ').forEach(pr=> q.answers.push(pr+' '+form));
    q.speakAfter=form;
  }
  else if(p.kind==='conjh'){
    const d = DATA.verbDrills[p.di];
    const persons = [0,1,2,3,4];
    const pers = rnd(persons);
    const pt = ptPhrase(d, p.tense, pers);
    const correct = ruPhrase(d, p.tense, pers);
    const opts = [correct];
    let guard = 0;
    while(opts.length < 4 && guard++ < 60){
      const t2 = rnd(['pres','estar','ir','pps'].filter(t=>
        !(t==='estar' && !d.cont) && !(d.inf==='estar' && (t==='estar'||t==='ir'))));
      const p2 = rnd(persons);
      if(!ptPhrase(d, t2, p2)) continue;
      const ru2 = ruPhrase(d, t2, p2);
      if(!opts.includes(ru2)) opts.push(ru2);
    }
    q.type='choice'; q.label='Спряжение на слух — что это значит?';
    q.prompt='🔊'; q.sub='прослушайте фразу и выберите перевод';
    q.speakNow=pt; q.speakAfter=pt;
    q.options=shuffle(opts); q.correct=correct;
    q.rule = p.tense==='pres'?'pres_regulares':p.tense==='estar'?'estar_a':p.tense==='ir'?'ir_inf':'pps_regulares';
  }
  else if(p.kind==='numw'){
    q.type='input'; q.label='Напишите число словами';
    q.prompt=String(p.n); q.answers=[numToPt(p.n)];
    q.speakAfter=numToPt(p.n); q.rule='números';
  }
  else if(p.kind==='numh'){
    q.type='input'; q.label='Число на слух — запишите цифрами';
    q.prompt='🔊'; q.sub='нажмите динамик, чтобы прослушать ещё раз';
    q.answers=[String(p.n)]; q.speakNow=numToPt(p.n); q.speakAfter=numToPt(p.n);
    q.rule='números'; q.note='пишите цифрами: 42';
  }
  else if(p.kind==='horaw'){
    q.type='input'; q.label='Скажите время по-португальски';
    q.prompt='🕐 '+p.t; q.answers=horaWords(p.t);
    q.speakAfter=horaWords(p.t)[0]; q.rule='horas';
  }
  else if(p.kind==='horah'){
    q.type='input'; q.label='Время на слух — запишите цифрами';
    q.prompt='🔊'; q.sub='например: 14:30';
    q.answers=horaDigits(p.t); q.speakNow=horaWords(p.t)[0];
    q.speakAfter=horaWords(p.t)[0]; q.rule='horas';
  }
  else if(p.kind==='qw'){
    const c = DATA.qw[p.i];
    q.type='input'; q.big=true; q.label='Задайте вопрос';
    q.prompt='Спросите: '+c.ru; q.answers=[c.pt, ...(c.alts||[])];
    q.speakAfter=c.pt; q.rule='e_que';
  }
  else if(p.kind==='qwh'){
    const c = DATA.qw[p.i];
    q.type='choice'; q.label='Вопрос на слух — о чём спросили?';
    q.prompt='🔊'; q.sub='прослушайте вопрос и выберите перевод';
    q.speakNow=c.pt; q.speakAfter=c.pt;
    const others = shuffle(DATA.qw.filter(x=>x.ru!==c.ru)).slice(0,3).map(x=>x.ru);
    q.options=shuffle([c.ru, ...others]); q.correct=c.ru; q.rule='e_que';
  }
  else if(p.kind==='cx'){
    const c = DATA.complex[p.i];
    q.type='input'; q.big=true; q.label='Сложное предложение';
    q.prompt=c.ru; q.answers=[c.pt, ...(c.alts||[])];
    q.speakAfter=c.pt; q.rule=c.rule;
  }
  else if(p.kind==='anto'){
    const a = DATA.antonyms[p.i];
    const fwd = Math.random()<.5;
    const from = fwd? a[0] : a[1], to = fwd? a[1] : a[0];
    q.type='input'; q.label='Назовите антоним';
    q.prompt = from; q.sub = a[2];
    q.answers=[to]; q.speakAfter = from + ' — ' + to;
  }
  else if(p.kind==='gap'){
    const g = DATA.gaps[p.i];
    q.type='input'; q.label='Вставьте пропущенное';
    q.gap=g.s; q.answers=[g.a, ...(g.alts||[])]; q.note=g.hint||'';
    q.speakAfter=g.s.replace(/___/g, g.a.replace(/\|/g,' … '));
  }
  else if(p.kind==='mc'){
    const m = DATA.mc[p.i];
    q.type='choice'; q.label='Выберите правильный вариант'; q.gap=m.s;
    q.options=shuffle([m.a, ...m.wrong]); q.correct=m.a; q.note=m.hint||'';
    q.speakAfter=m.s.replace(/___/g, m.a);
  }
  else if(p.kind==='trans'){
    const t = DATA.trans[p.i];
    q.type='input'; q.label='Переведите на португальский'; q.prompt=t.ru;
    q.answers=[t.pt, ...(t.alts||[])]; q.speakAfter=t.pt; q.big=true;
  }
  q.rule = p.rule;
  return q;
}

/* ---------- сессия ---------- */
let SES = null;
function startSession(filter, title, mode){
  buildPool();
  const items = pickSession(S.set.len, filter);
  if(!items.length){ alert('Нет заданий по этому фильтру — проверьте выбранные юниты в настройках.'); return; }
  SES = {queue:[], i:0, right:0, wrong:0, again:[], log:[],
         title:title||'Ежедневная тренировка', mode: mode||null};
  SES.queue = items.map(makeQ);
  renderSession();
}
function renderSession(){
  const v = document.getElementById('view');
  if(SES.i >= SES.queue.length) return finishSession();
  const q = SES.queue[SES.i];
  const n = SES.queue.length, prog = Math.round(SES.i/n*100);
  let body = '';
  const speakBtn = q.speakAfter||q.speakNow ? `<button class="speak" id="sp" title="Прослушать">🔊</button>` : '';
  const hintBtn = q.hintLabel
    ? ` <button class="btn ghost" id="lblHint" style="padding:2px 10px;font-size:11px;border-radius:99px">показать подсказку</button>` : '';
  const head = `<div class="qtype">${esc(q.label)}${SES.repeat?' · повтор':''} ${speakBtn}${hintBtn}</div>`;

  if(q.gap){
    body += `<div class="gapline">${q.gap.replace(/___/g,'<u>&nbsp;</u>')}</div>`;
  }else{
    body += `<div class="prompt${q.big?'':' pt'}">${q.prompt}${
      q.subHtml?`<small>${q.subHtml}</small>` : q.sub?`<small>${esc(q.sub)}</small>`:''}</div>`;
  }
  if(q.type==='input'){
    body += `<input class="answer" id="ans" autocomplete="off" autocapitalize="off" spellcheck="false"
             placeholder="${q.big?'португальская фраза…':'ответ…'}">`;
    body += `<div class="accents">` + ['á','à','â','ã','ç','é','ê','í','ó','ô','õ','ú'].map(c=>`<button data-c="${c}">${c}</button>`).join('') + `</div>`;
    if(q.note) body += `<div class="small muted" style="margin-top:8px">💡 ${esc(q.note)}</div>`;
    body += `<div class="row" style="margin-top:14px"><button class="btn" id="go">Проверить</button>
             <button class="btn ghost" id="skip">Не знаю</button>
             <button class="btn ghost" id="dict" title="Продиктовать (pt-PT)">🎤</button></div>`;
  }else{
    body += `<div class="opts">` + q.options.map((o,i)=>
      `<button class="opt" data-o="${esc(o)}"><span class="k">${i+1}</span>${esc(o)}</button>`).join('') + `</div>`;
  }
  const dots = SES.queue.map((_,i)=>`<i class="${SES.log[i]===1?'done':SES.log[i]===0?'bad':''}"></i>`).join('');
  v.innerHTML = `
    <div class="card">
      <div style="display:flex;align-items:center;gap:10px">
        <button class="btn ghost small" id="quit" style="padding:6px 10px;font-size:13px">← выйти</button>
        <span class="small muted">${SES.i+1} / ${n}</span>
        <div class="dots">${dots}</div>
      </div>
      <div class="bar"><i style="width:${prog}%"></i></div>
      ${head}${body}
      <div id="verdict"></div>
    </div>`;
  document.getElementById('quit').onclick = ()=>{ SES=null; save(); home(); };
  const sp = document.getElementById('sp'); if(sp) sp.onclick = ()=> say(q.speakNow||q.speakAfter);
  const lh = document.getElementById('lblHint');
  if(lh) lh.onclick = ()=>{ lh.outerHTML = `<span style="color:var(--accent);font-weight:600">${esc(q.hintLabel)}</span>`; };
  if(q.speakNow) setTimeout(()=>say(q.speakNow), 250);
  if(q.type==='input'){
    const inp = document.getElementById('ans'); inp.focus();
    document.querySelectorAll('.accents button').forEach(b=> b.onclick=()=>{
      const s=inp.selectionStart; inp.value = inp.value.slice(0,s)+b.dataset.c+inp.value.slice(inp.selectionEnd);
      inp.focus(); inp.selectionStart=inp.selectionEnd=s+1; });
    document.getElementById('go').onclick = ()=> answer(q, inp.value);
    document.getElementById('skip').onclick = ()=> answer(q, '', true);
    const dictBtn = document.getElementById('dict');
    if(typeof SR!=='undefined' && SR) dictBtn.onclick = ()=> toggleDictation(inp, dictBtn);
    else dictBtn.style.display='none';
    inp.onkeydown = e=>{
      if(e.key==='Escape' && typeof stopDictation==='function'){ e.preventDefault(); stopDictation(); return; }
      if(e.key==='Enter'){ e.preventDefault(); answer(q, inp.value); } };
  }else{
    document.querySelectorAll('.opt').forEach(b=> b.onclick = ()=> answer(q, b.dataset.o));
    document.onkeydown = e=>{ const n=parseInt(e.key); if(n>=1&&n<=q.options.length){ const b=document.querySelectorAll('.opt')[n-1]; b&&b.click(); } };
  }
}

function answer(q, given, skipped){
  if(typeof stopDictation==='function') stopDictation();
  let res;
  if(q.type==='choice') res = {ok: !skipped && norm(given)===norm(q.correct), target:q.correct};
  else res = skipped ? {ok:false, target:q.answers[0]} : check(given, q.answers);
  if(skipped) res.ok = false;
  const ok = res.ok;
  schedule(q.id, ok);
  SES.log[SES.i] = ok?1:0;
  SES.answers = SES.answers || [];
  SES.answers.push({q: q.gap || q.prompt.replace(/<[^>]+>/g,''), given: (given||'').trim(),
                    target: res.target, ok, near: !!res.near});
  ok ? SES.right++ : SES.wrong++;
  if(!ok) SES.again.push(q.p);
  const d = today(); S.hist[d] = S.hist[d] || {n:0,ok:0}; S.hist[d].n++; if(ok) S.hist[d].ok++;
  if(isNewCounted(q.id)) S.newToday++;
  save();

  // визуальная разметка вариантов
  if(q.type==='choice'){
    document.querySelectorAll('.opt').forEach(b=>{
      if(norm(b.dataset.o)===norm(q.correct)) b.classList.add('ok');
      else if(norm(b.dataset.o)===norm(given)) b.classList.add('no');
      b.onclick=null;
    });
  }
  const inp = document.getElementById('ans'); if(inp) inp.disabled = true;
  const go = document.getElementById('go'); if(go) go.remove();
  const sk = document.getElementById('skip'); if(sk) sk.remove();

  let html = '';
  const target = res.target;
  if(ok){
    html = `<div class="verdict ok"><div class="big">✓ ${esc(target)}</div>`;
  }else if(res.near){
    const d = wordDiff(given, target);
    html = `<div class="verdict no">
      <div class="ru" style="font-size:16px;margin-bottom:6px">вы: ${d.givenHtml}</div>
      <div class="big diff">${d.targetHtml}</div>
      <div class="ru">не хватает диакритики</div>`;
  }else{
    if(given.trim()){
      const d = wordDiff(given, target);
      html = `<div class="verdict no">
        <div class="ru" style="font-size:16px;margin-bottom:6px">вы: ${d.givenHtml}</div>
        <div class="big diff">${d.targetHtml}</div>`;
    }else{
      html = `<div class="verdict no"><div class="big">${esc(target)}</div>`;
    }
  }
  if(q.speakNow){ html += `<div class="ru" style="font-weight:600;font-size:16px">🔊 ${esc(q.speakNow)}</div>`; }
  if(q.hintLabel){ html += `<div class="ru">${esc(q.hintLabel)}</div>`; }
  if(q.p.kind==='trans' && q.p.i!==undefined){ const t=DATA.trans[q.p.i]; html += `<div class="ru">${esc(t.ru)}</div>`; }
  if(q.p.kind==='vocab' || q.p.kind==='gender'){ html += `<div class="ru">${esc(q.p.ru)}</div>`; }
  html += `</div>`;
  if(q.conj) html += conjTable(q.conj);
  if(q.rule) html += ruleRef(q.rule);
  html += `<div class="row" style="margin-top:14px"><button class="btn wide" id="next">Дальше →</button></div>`;
  document.getElementById('verdict').innerHTML = html;
  if(!ok && !skipped && q.type==='input' && typeof aiSecondOpinion==='function')
    aiSecondOpinion(q, given);
  if(q.speakAfter) say(q.speakAfter);
  const nx = document.getElementById('next');
  nx.focus();
  const armed = Date.now();
  nx.onclick = ()=>{ if(Date.now()-armed < 700) return; SES.i++; document.onkeydown=null; renderSession(); };
  document.onkeydown = e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); nx.click(); } };
}
function isNewCounted(id){ const m=S.items[id]; return m && m.r+m.w===1; }

function conjTable(c){
  const v = c.v, rows = [0,1,2,3,4].map(i=>{
    const f = conjForm(v, c.tense, i); if(!f) return '';
    return `<tr class="${i===c.person?'hi':''}"><td>${PERSONS[i]}</td><td>${esc(f)}</td></tr>`;
  }).join('');
  return `<div class="ruleref"><b>${v.inf}</b> — ${esc(v.ru)} · ${TENSES[c.tense].name}
          <table class="conj">${rows}</table></div>`;
}
function ruleRef(id){
  const r = DATA.rules.find(x=>x.id===id); if(!r) return '';
  return `<div class="ruleref">📘 <b>${esc(r.title)}</b><br>${r.body}</div>`;
}

function finishSession(){
  const total = SES.right + SES.wrong;
  const pct = total ? Math.round(SES.right/total*100) : 0;
  const d = today();
  if(S.lastDay !== d){
    S.streak = (S.lastDay && dayNum(d)-dayNum(S.lastDay)===1) ? S.streak+1 : 1;
    S.lastDay = d;
  }
  save();
  const em = pct>=90?'🎉':pct>=70?'👏':'💪';
  const againPs = [...new Map(SES.again.map(p=>[p.id,p])).values()];
  const sesTitle = SES.title;
  let recap = '';
  if(SES.storyDone){
    const st = SES.storyDone;
    recap = `<div class="card"><h2>${esc(st.title)} — вся история</h2>` +
      st.phrases.map(ph=>`<div style="margin-bottom:9px"><div style="font-weight:560">${esc(ph.pt)}
        <button class="speak" data-s="${esc(ph.pt)}">🔊</button></div>
        <div class="small muted">${esc(ph.ru)}</div></div>`).join('') +
      `<button class="btn ghost" id="sayAll" style="margin-top:6px">🔊 Прослушать целиком</button></div>`;
  }
  const curWrong = (SES.answers||[]).filter(a=>!a.ok);
  const mistakes = [...(SES.prevWrong||[]), ...curWrong];
  let review = '';
  if(mistakes.length){
    review = `<div class="card"><h2>Разбор ошибок · ${mistakes.length}${SES.prevWrong&&SES.prevWrong.length?' · за все круги':''}</h2>` +
      mistakes.map(a=>`<div style="margin-bottom:12px;padding-bottom:10px;border-bottom:1px solid var(--line)">
        <div class="small muted">${esc(a.q)}</div>
        ${a.given? `<div style="color:var(--warn)">✗ ${esc(a.given)}</div>` : `<div class="small muted">— пропущено —</div>`}
        <div style="color:var(--accent);font-weight:600">✓ ${esc(a.target)}
          <button class="speak" data-s="${esc(a.target)}">🔊</button></div>
      </div>`).join('') + `</div>`;
  }
  document.getElementById('view').innerHTML = review + recap + `
   <div class="card done-hero">
     <div class="em">${em}</div>
     <h3>Готово на сегодня</h3>
     <p class="muted">${SES.right} из ${total} с первого раза · ${pct}%</p>
     <p class="small muted">Серия: ${S.streak} ${plural(S.streak,'день','дня','дней')} подряд</p>
     <div class="row" style="justify-content:center;margin-top:16px">
       ${againPs.length
         ? `<button class="btn" id="redo">Исправить ошибки · ${againPs.length}</button>`
         : `<button class="btn" id="more">Ещё подход</button>`}
       <button class="btn ghost" id="home2">На главную</button>
     </div>
   </div>`;
  const more = document.getElementById('more');
  if(more) more.onclick = ()=> startSession(null);
  document.getElementById('home2').onclick = ()=>{ SES=null; home(); };
  const redo = document.getElementById('redo');
  if(redo) redo.onclick = ()=>{
    SES = {queue: againPs.map(p=>makeQ(p)), i:0, right:0, wrong:0, again:[], log:[],
           title: sesTitle, repeat:true, prevWrong: mistakes};
    renderSession();
  };
  document.querySelectorAll('.speak[data-s]').forEach(b=> b.onclick=()=>say(b.dataset.s));
  const sa = document.getElementById('sayAll');
  if(sa){ const st=SES.storyDone; sa.onclick = ()=> say(st.phrases.map(p=>p.pt).join(' ')); }
  SES = null;
}
const plural=(n,a,b,c)=>{const m=n%100;if(m>=11&&m<=14)return c;const k=n%10;return k===1?a:k>=2&&k<=4?b:c;};
