/* ---------- экраны ---------- */
function counts(){
  buildPool();
  const due = POOL.filter(p=>isDue(p.id)).length;
  const learned = POOL.filter(p=>S.items[p.id] && S.items[p.id].b>=3).length;
  const started = POOL.filter(p=>S.items[p.id]).length;
  return {due, learned, started, total:POOL.length};
}
function chips(){
  const c = counts();
  document.getElementById('streakChip').innerHTML = `🔥 <b>${S.streak}</b>`;
  document.getElementById('dueChip').innerHTML = `к повтору <b>${c.due}</b>`;
  return c;
}
function home(){
  const c = chips();
  const doneToday = (S.hist[today()]||{}).n || 0;
  const pct = c.total ? Math.round(c.learned/c.total*100) : 0;
  const vd = verbOfDay();
  const th = themeOfDay();
  const dn = lessonNum();
  // история и диалог — под тему дня, если есть подходящие
  const stCands = DATA.stories.filter(s=> th.su && s.unit===th.su);
  const st = stCands.length ? stCands[dn % stCands.length] : storyOfDay();
  const dlgCands = DATA.dialogs.filter(d=> (th.dlg||[]).includes(d.id));
  const dlg = dlgCands.length ? dlgCands[dn % dlgCands.length] : DATA.dialogs[dn % DATA.dialogs.length];
  const todayUnits = new Set([vd.unit, st.unit, dlg.unit]);
  const doneKey = k => (S.hist['done-'+k]===today());
  const mark = k => doneKey(k) ? ' ✓' : '';
  document.getElementById('view').innerHTML = `
  <div class="card">
    <h2>Урок на сегодня</h2>
    <p class="small muted" style="margin-top:-6px">
      ${c.due ? `${c.due} ${plural(c.due,'карточка','карточки','карточек')} к повторению` : 'повторять пока нечего'}
      ${doneToday?` · сегодня ${doneToday} ${plural(doneToday,'ответ','ответа','ответов')}`:''}
    </p>
    <div class="opts" style="margin-top:8px">
      <button class="opt" id="lsVerb"><span class="k">1</span>
        <span><b>Глагол дня: ${vd.inf}</b>${mark('verb')}<br>
        <span class="small muted">одна фраза во всех лицах · ${tensesForDrill(vd).map(t=>TENSES[t].name).join(' · ')} · конструкции (ter de, costumar…)</span></span></button>
      <button class="opt" id="lsPps4"><span class="k">2</span>
        <span><b>⚡ PPS: ser · ir · estar · ter</b>${mark('pps4')}<br>
        <span class="small muted">ежедневная разминка: 12 форм прошедшего</span></span></button>
      <button class="opt" id="lsLex"><span class="k">3</span>
        <span><b>📚 Лексика дня: ${th.icon} ${esc(th.ru)}</b>${mark('lex')}<br>
        <span class="small muted">слова темы · узнавание и ввод вперемешку</span></span></button>
      <button class="opt" id="lsMain"><span class="k">4</span>
        <span><b>Тренировка · ${S.set.len} заданий</b>${mark('main')}<br>
        <span class="small muted">повторения + спряжения, предлоги, артикли, перевод</span></span></button>
      <button class="opt" id="lsStory"><span class="k">5</span>
        <span><b>🗣 История: ${esc(st.title)}</b>${mark('story')}<br>
        <span class="small muted">разговорная практика · ${st.phrases.length} фраз · юнит ${st.unit}</span></span></button>
      <button class="opt" id="lsDlg"><span class="k">6</span>
        <span><b>🗣 Диалог: ${dlg.icon} ${esc(dlg.title)}</b>${mark('dlg')}<br>
        <span class="small muted">разговорная практика · говорите вслух в микрофон</span></span></button>
    </div>
    ${['verb','pps4','lex','main','story','dlg'].every(doneKey)
      ? `<button class="btn wide" id="finishLesson" style="margin-top:12px">✅ Завершить урок · открыть следующий</button>`
      : `<button class="btn ghost wide" id="finishLesson" style="margin-top:12px">Пропустить этот урок → следующий</button>`}
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="small muted">освоено ${c.learned} из ${c.total} · в работе ${c.started}</div>
  </div>

  <div class="card">
    <h2>Отдельные блоки</h2>
    <div class="grid">
      <button class="mode" data-f="conj"><div class="t">Времена и конструкции</div>
        <div class="d">Presente · Estar a + Infinitivo · Ir + Infinitivo · PPS</div></button>
      <button class="mode" data-f="trans"><div class="t">Перевод с русского</div>
        <div class="d">фразы из учебника, ввод целиком</div></button>
      <button class="mode" data-f="prep"><div class="t">Предлоги и артикли</div>
        <div class="d">de/em · a/para/por · слияния do/na/pelo</div></button>
      <button class="mode" data-f="rules"><div class="t">Грамматика</div>
        <div class="d">ser/estar · императив · местоимения · há/desde</div></button>
      <button class="mode" id="toQw"><div class="t">❓ Вопросительные слова</div>
        <div class="d">quem · o que · onde · quando · quanto · porque… + на слух</div></button>
      <button class="mode" id="toComplex"><div class="t">🧩 Сложные предложения</div>
        <div class="d">сравнение · tão/tanto · há…que/desde · alguém/ninguém · é que</div></button>
      <button class="mode" id="toNums"><div class="t">🔢 Числа и часы</div>
        <div class="d">до 1000, словами и на слух · que horas são?</div></button>
      <button class="mode" id="toLexis"><div class="t">📚 Лексика по темам</div>
        <div class="d">${DATA.vocab.length} слов · ${DATA.themes.length} тем · антонимы</div></button>
      <button class="mode" data-f="weak"><div class="t">Работа над ошибками</div>
        <div class="d">то, где чаще всего ошибаешься</div></button>
      <button class="mode" id="allDlg"><div class="t">🗣 Все диалоги</div>
        <div class="d">кафе, аптека, врач, рынок, магазин, касса…</div></button>
      <button class="mode" id="allStories"><div class="t">📖 Все истории</div>
        <div class="d">${DATA.stories.length} мини-рассказов по юнитам</div></button>
    </div>
  </div>

  <div class="card">
    <h2>Тренировка по юниту</h2>
    <div class="row">${[1,2,3,4,5,6,7,8].map(u=>{
      const hot = todayUnits.has(u);
      return `<button class="btn ghost${hot?' hot':''}" data-u="${u}" style="padding:9px 14px"
        ${hot?'title="в сегодняшнем уроке"':''}>${u}</button>`;}).join('')}</div>
    <div class="small muted" style="margin-top:10px">
      <span style="color:var(--warn)">красным</span> — юниты сегодняшнего урока ·
      ${DATA.unitNames.map((n,i)=>`${i+1}. ${esc(n)}`).join(' · ')}</div>
  </div>

  <div class="row">
    <button class="btn ghost" id="toRules">📘 Правила</button>
    <button class="btn ghost" id="toStats">📊 Статистика</button>
    <button class="btn ghost" id="toSet">⚙️ Настройки</button>
  </div>`;
  document.getElementById('finishLesson').onclick = ()=>{
    S.lessonOffset = (S.lessonOffset||0) + 1;
    ['verb','pps4','lex','main','story','dlg'].forEach(k=> delete S.hist['done-'+k]);
    save(); home();
  };
  document.getElementById('lsVerb').onclick = ()=>{ S.hist['done-verb']=today(); save(); verbDayMenu(); };
  document.getElementById('lsPps4').onclick = ()=>{ S.hist['done-pps4']=today(); save(); startPps4(); };
  document.getElementById('lsLex').onclick = ()=>{
    S.hist['done-lex']=today(); save();
    const ids = new Set(themePool(th).map(p=>p.id));
    startSession(p=> ids.has(p.id), th.icon+' '+th.ru);
  };
  document.getElementById('lsMain').onclick = ()=>{ S.hist['done-main']=today(); save(); startSession(null); };
  document.getElementById('lsStory').onclick = ()=>{ S.hist['done-story']=today(); save(); startStory(st); };
  document.getElementById('lsDlg').onclick = ()=>{ S.hist['done-dlg']=today(); save(); startDialog(dlg); };
  document.getElementById('allDlg').onclick = dialogsList;
  document.getElementById('toLexis').onclick = lexisList;
  document.getElementById('toNums').onclick = numbersMenu;
  document.getElementById('toComplex').onclick = complexMenu;
  document.getElementById('toQw').onclick = qwMenu;
  document.getElementById('allStories').onclick = storiesList;
  document.querySelectorAll('[data-f]').forEach(b=> b.onclick = ()=>{
    const f = b.dataset.f;
    const RULEGRP = p => p.group==='rules';
    const PREP = p => p.rule && ['de_em_paises','prep_tempo','prep_movimento','para_por','em_meses','transportes','contracoes','lugar','prep_pronome','com_pronome','artigos'].includes(p.rule);
    if(f==='conj'){ conjMenu(); return; }
    const map = {
      conj: p=>p.kind==='conj',
      trans: p=>p.kind==='trans',
      prep: p=> PREP(p) || p.kind==='gender',
      rules: p=> RULEGRP(p) && !PREP(p),
      vocab: p=>p.group==='vocab',
      weak: p=> S.items[p.id] && S.items[p.id].w>0
    };
    startSession(map[f], b.querySelector('.t').textContent);
  });
  document.querySelectorAll('[data-u]').forEach(b=> b.onclick = ()=>
    startSession(p=>p.unit===+b.dataset.u, 'Юнит '+b.dataset.u));
  document.getElementById('toRules').onclick = rulesView;
  document.getElementById('toStats').onclick = statsView;
  document.getElementById('toSet').onclick = setView;
  document.onkeydown = null;
}

function storiesList(){
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Истории</h2>
     <p class="small muted" style="margin-top:-6px">Соберите рассказ: каждая фраза переводится с русского, в конце — весь текст с озвучкой.</p>
     <div class="grid">${DATA.stories.map((s,i)=>`
       <button class="mode" data-s="${i}"><div class="t">${esc(s.title)}</div>
         <div class="d">юнит ${s.unit} · ${s.phrases.length} фраз</div></button>`).join('')}</div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-s]').forEach(b=> b.onclick = ()=> startStory(DATA.stories[+b.dataset.s]));
}

function rulesView(){
  const byUnit = {};
  DATA.rules.forEach(r=> (byUnit[r.unit] = byUnit[r.unit]||[]).push(r));
  let html = `<div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>`;
  Object.keys(byUnit).sort().forEach(u=>{
    html += `<h2 style="margin:18px 0 8px">Юнит ${u} · ${esc(DATA.unitNames[u-1])}</h2>`;
    byUnit[u].forEach(r=>{
      html += `<details class="rule"><summary><span class="tag">${esc(r.id.split('_')[0])}</span>${esc(r.title)}</summary>
        <div class="body">${r.body}<div class="ex">${
          r.ex.map(e=>`<div><div class="p">${esc(e[0])} <button class="speak" data-s="${esc(e[0])}">🔊</button></div><div class="r">${esc(e[1])}</div></div>`).join('')
        }</div></div></details>`;
    });
  });
  document.getElementById('view').innerHTML = html;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('.speak[data-s]').forEach(b=> b.onclick = e=>{ e.preventDefault(); say(b.dataset.s); });
}

function statsView(){
  buildPool();
  const byRule = {};
  POOL.forEach(p=>{
    const m = S.items[p.id]; if(!m) return;
    const k = p.rule || p.theme || p.group;
    byRule[k] = byRule[k] || {r:0,w:0};
    byRule[k].r += m.r; byRule[k].w += m.w;
  });
  const rows = Object.entries(byRule).filter(([,v])=>v.r+v.w>0)
    .sort((a,b)=> (a[1].r/(a[1].r+a[1].w)) - (b[1].r/(b[1].r+b[1].w)));
  const days = Object.keys(S.hist).sort().slice(-14);
  const title = k => (DATA.rules.find(r=>r.id===k)||{}).title || k;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Последние 14 дней</h2>
     <div style="display:flex;gap:4px;align-items:flex-end;height:70px">
       ${days.length? days.map(d=>{const h=S.hist[d];const acc=h.n?h.ok/h.n:0;
         return `<div title="${d}: ${h.ok}/${h.n}" style="flex:1;background:var(--accent);opacity:${.35+acc*.65};
                 height:${Math.max(6,Math.min(70,h.n*3))}px;border-radius:4px"></div>`;}).join('')
         : '<div class="small muted">пока нет данных</div>'}
     </div>
   </div>
   <div class="card"><h2>Где чаще ошибки</h2>
     ${rows.length? rows.slice(0,14).map(([k,v])=>{
        const acc = Math.round(v.r/(v.r+v.w)*100);
        return `<div class="statline"><span>${esc(title(k))}</span>
          <span class="mini"><i style="width:${acc}%"></i></span>
          <span class="n">${acc}% · ${v.r+v.w}</span></div>`;}).join('')
       : '<div class="small muted">Ответьте на несколько заданий — здесь появится разбор по темам.</div>'}
   </div>
   <div class="card"><h2>Диалоги</h2>
     ${S.dlg && Object.keys(S.dlg).length ? Object.entries(S.dlg).map(([id,r])=>{
        const d = DATA.dialogs.find(x=>x.id===id); if(!d) return '';
        const last = r.hist[r.hist.length-1];
        const acc = Math.round(last.ok/r.steps*100);
        return `<div class="statline"><span>${d.icon} ${esc(d.title)}</span>
          <span class="mini"><i style="width:${acc}%"></i></span>
          <span class="n">${last.ok}/${r.steps} · ×${r.runs}</span></div>`;}).join('')
       : '<div class="small muted">Пройдите диалог — здесь появятся результаты.</div>'}
   </div>
   <div class="card"><h2>Сброс</h2>
     <button class="btn ghost" id="reset">Сбросить весь прогресс</button></div>`;
  document.getElementById('back').onclick = home;
  document.getElementById('reset').onclick = ()=>{
    if(confirm('Удалить весь прогресс и начать заново?')){ localStorage.removeItem(KEY); S=load(); home(); } };
}

function setView(){
  const s = S.set;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Настройки</h2>
     <label class="set">Заданий в сессии
       <select id="len">${[10,15,20,25,30,40].map(n=>`<option ${n===s.len?'selected':''}>${n}</option>`).join('')}</select></label>
     <label class="set">Новых карточек в день
       <select id="np">${[5,10,15,20,30].map(n=>`<option ${n===s.newPerDay?'selected':''}>${n}</option>`).join('')}</select></label>
     <label class="set">Строгая проверка диакритики
       <input type="checkbox" id="strict" ${s.strict?'checked':''}></label>
     <label class="set">Озвучка (pt-PT)
       <input type="checkbox" id="speak" ${s.speak?'checked':''}></label>
     <label class="set">AI-проверка ответов
       <span class="small muted" id="aikStatus">${aiKey()? 'ключ сохранён: '+aiKey().slice(0,10)+'…' : 'ключа нет'}</span></label>
     <div class="row">
       <input class="answer" id="aik" type="password" placeholder="ключ OpenAI (sk-…)"
         value="" style="margin-top:0;font-size:14px;flex:1">
       <button class="btn ghost" id="aikSave">Сохранить</button>
     </div>
     <div class="small muted" style="margin-top:6px">Ключ хранится только в этом браузере. При ошибке ответ дополнительно проверяется AI на допустимость — не на дословное совпадение.</div>
   </div>
   <div class="card"><h2>Юниты в работе</h2>
     <div class="row">${[1,2,3,4,5,6,7,8].map(u=>
       `<button class="btn ${s.units.includes(u)?'':'ghost'}" data-u="${u}" style="padding:9px 15px">${u}</button>`).join('')}</div>
     <div class="small muted" style="margin-top:10px">Выключенные юниты не попадают ни в сессию, ни в счётчики.</div>
   </div>
   <div class="card"><h2>Состав ежедневной сессии</h2>
     ${[['conj','Времена и спряжения'],['trans','Перевод с русского'],['rules','Грамматика и предлоги'],['vocab','Лексика']]
       .map(([k,n])=>`<label class="set">${n}
         <input type="range" min="0" max="60" step="5" value="${s.focus[k]}" data-focus="${k}" style="width:130px">
         <span class="small muted" id="f-${k}" style="width:38px;text-align:right">${s.focus[k]}%</span></label>`).join('')}
     <div class="small muted">Доли применяются к новым карточкам; всё, что пора повторить, идёт в сессию в любом случае.</div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.getElementById('len').onchange = e=>{ s.len=+e.target.value; save(); };
  document.getElementById('np').onchange = e=>{ s.newPerDay=+e.target.value; save(); };
  document.getElementById('strict').onchange = e=>{ s.strict=e.target.checked; save(); };
  document.getElementById('speak').onchange = e=>{ s.speak=e.target.checked; save(); };
  document.getElementById('aikSave').onclick = async ()=>{
    const v = document.getElementById('aik').value.replace(/\s+/g,'');
    const st = document.getElementById('aikStatus');
    if(!v){ localStorage.removeItem(AI_KEY_STORE); setView(); return; }
    localStorage.setItem(AI_KEY_STORE, v);
    st.textContent = 'проверяю ключ…';
    try{
      const r = await fetch('https://api.openai.com/v1/models', {headers:{'Authorization':'Bearer '+v}});
      st.textContent = r.ok ? '✓ ключ работает ('+v.slice(0,10)+'…, '+v.length+' симв.)'
        : '✗ ключ не принят ('+r.status+') — длина '+v.length+' симв., должно быть ~164';
      st.style.color = r.ok ? 'var(--accent)' : 'var(--warn)';
    }catch(e){ st.textContent = '✗ нет связи с api.openai.com'; st.style.color='var(--warn)'; }
  };
  document.querySelectorAll('[data-u]').forEach(b=> b.onclick = ()=>{
    const u=+b.dataset.u;
    s.units = s.units.includes(u) ? s.units.filter(x=>x!==u) : [...s.units,u].sort();
    if(!s.units.length) s.units=[u];
    save(); setView(); });
  document.querySelectorAll('[data-focus]').forEach(r=> r.oninput = ()=>{
    s.focus[r.dataset.focus] = +r.value;
    document.getElementById('f-'+r.dataset.focus).textContent = r.value+'%'; save(); });
}

/* ---------- проверка новой версии ---------- */
function checkUpdate(){
  fetch(location.pathname, {cache:'no-store'})
    .then(r=>r.text())
    .then(t=>{
      const m = t.match(/BUILD_ID = '([^']+)'/);
      if(m && m[1] !== BUILD_ID){
        if(document.getElementById('updChip')) return;
        const b = document.createElement('button');
        b.id='updChip'; b.className='btn';
        b.style.cssText='position:fixed;top:14px;left:50%;transform:translateX(-50%);z-index:99;box-shadow:var(--shadow)';
        b.textContent = '⬆️ Доступна новая версия — обновить';
        b.onclick = ()=> location.reload();
        document.body.appendChild(b);
      }
    }).catch(()=>{});
}
setTimeout(checkUpdate, 3000);
setInterval(checkUpdate, 10*60*1000);

/* ---------- старт ---------- */
document.getElementById('topSet').onclick = ()=>{ if(SES){ SES=null; } setView(); };
const dueChip = document.getElementById('dueChip');
dueChip.style.cursor = 'pointer';
dueChip.title = 'Повторить то, что пора';
dueChip.onclick = ()=>{
  buildPool();
  const due = POOL.filter(p=>isDue(p.id));
  if(!due.length){ alert('Сейчас нечего повторять — всё по расписанию.'); return; }
  const ids = new Set(due.map(p=>p.id));
  startSession(p=>ids.has(p.id), '🔁 Повторение');
};
buildPool();
home();
