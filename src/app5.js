/* ================= ЛЕКСИКА ПО ТЕМАМ ================= */
function lexisList(){
  buildPool();
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Лексика по темам</h2>
     <p class="small muted" style="margin-top:-6px">${DATA.vocab.length} слов и выражений из учебника + ${DATA.antonyms.length} пар антонимов</p>
     <div class="grid">${DATA.themes.map(t=>{
        const pool = themePool(t);
        const learned = pool.filter(p=>S.items[p.id] && S.items[p.id].b>=3).length;
        const pct = pool.length? Math.round(learned/pool.length*100) : 0;
        return `<button class="mode" data-t="${t.key}">
          <div class="t">${t.icon} ${esc(t.ru)}</div>
          <div class="d">${pool.length} ${plural(pool.length,'карточка','карточки','карточек')} · освоено ${pct}%</div>
          <div class="mini" style="width:100%;margin-top:7px"><i style="width:${pct}%"></i></div>
        </button>`;}).join('')}
       <button class="mode" data-t="__anto"><div class="t">↔️ Антонимы</div>
         <div class="d">${DATA.antonyms.length} пар · назови противоположное</div></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-t]').forEach(b=> b.onclick = ()=> lexisTheme(b.dataset.t));
}

function lexisTheme(key){
  if(key==='__anto'){
    startSession(p=>p.kind==='anto', 'Антонимы');
    return;
  }
  const t = DATA.themes.find(x=>x.key===key);
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← к темам</button></div>
   <div class="card"><h2>${t.icon} ${esc(t.ru)}</h2>
     <div class="opts">
       <button class="opt" data-m="rec"><span class="k">1</span>
         <span><b>Узнать · PT → RU</b><br><span class="small muted">португальское слово с озвучкой → выбор перевода</span></span></button>
       <button class="opt" data-m="prod"><span class="k">2</span>
         <span><b>Вспомнить · RU → PT</b><br><span class="small muted">русское слово → ввод или диктовка по-португальски</span></span></button>
       <button class="opt" data-m="mix"><span class="k">3</span>
         <span><b>Смешанный</b><br><span class="small muted">новое — на узнавание, знакомое — на ввод</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = lexisList;
  document.querySelectorAll('[data-m]').forEach(b=> b.onclick = ()=>{
    const mode = b.dataset.m;
    buildPool();
    const ids = new Set(themePool(t).map(p=>p.id));
    startSession(p=> ids.has(p.id), t.icon+' '+t.ru, mode==='mix'? null : mode);
  });
}

/* ================= СПРЯЖЕНИЯ: ГЛАГОЛ → РАЗДЕЛЫ ================= */
function isIrrInf(inf){ return !!(DATA.verbs.find(x=>x.inf===inf)||{}).irr; }

function conjMenu(){
  buildPool();
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Времена и конструкции</h2>
     <div class="opts">
       <button class="opt" data-c="reg"><span class="k">1</span>
         <span><b>Случайный правильный глагол</b><br><span class="small muted">-ar / -er / -ir</span></span></button>
       <button class="opt" data-c="irr"><span class="k">2</span>
         <span><b>Случайный неправильный глагол</b><br><span class="small muted">ser, ir, fazer, pôr, dormir…</span></span></button>
       <button class="opt" data-c="pick"><span class="k">3</span>
         <span><b>Выбрать глагол</b><br><span class="small muted">все ${DATA.verbs.filter(v=>!v.impersonal).length} глаголов учебника</span></span></button>
       <button class="opt" data-c="pps4"><span class="k">4</span>
         <span><b>⚡ PPS: ser · ir · estar · ter</b><br><span class="small muted">четыре главных неправильных в прошедшем</span></span></button>
       <button class="opt" data-c="hear"><span class="k">5</span>
         <span><b>На слух → перевод</b> 🔊<br><span class="small muted">слышишь «estou a ver» — выбираешь «я сейчас смотрю»</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-c]').forEach(b=> b.onclick = ()=>{
    const c = b.dataset.c;
    if(c==='hear'){ startSession(p=>p.kind==='conjh', 'Спряжения на слух'); return; }
    if(c==='pps4'){ startPps4(); return; }
    if(c==='pick'){ verbPick(); return; }
    const pool = DATA.verbs.filter(v=> !v.impersonal && !!v.irr === (c==='irr'));
    verbSections(drillFor(rnd(pool).inf));
  });
}

const STATIVE = new Set(['ser','estar','ter','morar','gostar','querer','poder','saber','conhecer','preferir','doer','chover','nevar','haver']);
function drillFor(inf){
  const full = DATA.verbDrills.find(d=>d.inf===inf);
  if(full) return Object.assign({full:true}, full);
  const v = DATA.verbs.find(x=>x.inf===inf);
  return { inf, unit:v.unit, obj:'', objRu:'',
    ruInf: (v.ru||'').split(/[,(]/)[0].trim(),
    cont: !STATIVE.has(inf) && !v.impersonal, full:false };
}
function verbPick(){
  const fullSet = new Set(DATA.verbDrills.map(d=>d.inf));
  const list = DATA.verbs.filter(v=>!v.impersonal)
    .sort((a,b)=> (fullSet.has(b.inf)-fullSet.has(a.inf)) || a.inf.localeCompare(b.inf));
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Выберите глагол · ${list.length}</h2>
     <p class="small muted" style="margin-top:-6px">⭐ — с полными фразами (дополнение, все виды заданий)</p>
     <div class="grid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
       ${list.map(v=>`<button class="mode" data-inf="${v.inf}">
         <div class="t">${fullSet.has(v.inf)?'⭐ ':''}${v.inf}${v.irr?' <span class="tag">неправ.</span>':''}</div>
         <div class="d">${esc(v.ru||'')}</div></button>`).join('')}
     </div>
   </div>`;
  document.getElementById('back').onclick = conjMenu;
  document.querySelectorAll('[data-inf]').forEach(b=> b.onclick = ()=> verbSections(drillFor(b.dataset.inf)));
}

function verbSections(d){
  const v = DATA.verbs.find(x=>x.inf===d.inf);
  const hasPps = !!(v && v.pps);
  const nPeri = PERIS.filter(pe =>
    pe.id.split(' ')[0] !== d.inf && (!pe.needCont || d.cont) &&
    (!pe.skill || SKILL_VERBS.has(d.inf)) && (!pe.usePres || d.ruPres) &&
    true).length;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← к выбору</button></div>
   <div class="card"><h2>${d.inf} — ${esc(d.ruInf||'')} ${isIrrInf(d.inf)?'<span class="tag">неправильный</span>':''}</h2>
     <div class="opts">
       <button class="opt" data-s="pres"><span class="k">1</span>
         <span><b>Настоящее · Presente do Indicativo</b><br><span class="small muted">все лица</span></span></button>
       <button class="opt" data-s="peri"><span class="k">2</span>
         <span><b>Связки · construções + Infinitivo</b><br><span class="small muted">${nPeri} конструкций: ir, querer, ter de (obrigação), precisar de (necessidade), dever (obrigação moral), começar a, acabar de, continuar a…</span></span></button>
       <button class="opt" data-s="pps" ${hasPps?'':'disabled style="opacity:.4"'}><span class="k">3</span>
         <span><b>Прошедшее · Pretérito Perfeito Simples (PPS)</b><br>
         <span class="small muted">${hasPps?'все лица + маркеры времени':'в учебнике A1 PPS этого глагола не вводится'}</span></span></button>
       <button class="opt" data-s="pps4"><span class="k">4</span>
         <span><b>⚡ PPS: ser · ir · estar · ter</b><br><span class="small muted">отдельная разминка, не зависит от глагола</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = conjMenu;
  document.querySelectorAll('[data-s]').forEach(b=> b.onclick = ()=>{
    const m = b.dataset.s;
    if(m==='pps4'){ startPps4(); return; }
    if(m==='pps' && !hasPps) return;
    startVerbSection(d, m);
  });
}

/* раздел одного глагола: pres | pps | peri */
function startVerbSection(d, mode){
  const v = DATA.verbs.find(x=>x.inf===d.inf);
  const steps = [];
  if(mode==='peri'){
    const cands = PERIS.filter(pe =>
      pe.id.split(' ')[0] !== d.inf && (!pe.needCont || d.cont) &&
      (!pe.skill || SKILL_VERBS.has(d.inf)) && (!pe.usePres || d.ruPres) &&
      !(d.inf==='poder' && ['querer','conseguir','dever (obrigação moral)','queria (cortesia)'].includes(pe.id)) &&
      !(d.inf==='querer' && pe.id==='queria (cortesia)'));
    shuffle(cands).forEach(pe=>{
      const ps = pe.persons || [0,1,2,3,4];
      const p = ps[Math.floor(Math.random()*ps.length)];
      const q = periQuestion(d, v, pe, p);
      steps.push({label:`${d.inf} · связки`, hintLabel:`конструкция ${pe.id} + Infinitivo`,
                  ru:q.ru, pt:q.pt, answers:q.answers, rule:pe.rule});
    });
  }else if(d.full){
    const t = mode;
    shuffle([0,1,2,3,4]).forEach(p=>{
      const mk = t==='pps' ? rnd(PPS_MARKERS) : null;
      const pt = ptPhrase(d,t,p,mk); if(!pt) return;
      steps.push({label:`${d.inf} · ${TENSES[t].name}`, ru:ruPhrase(d,t,p,mk), pt,
                  answers:ptVariants(pt),
                  rule: t==='pres'?'pres_regulares':'pps_regulares',
                  conj:{v, tense:t, person:p}});
    });
  }else{
    // без полных фраз: карточки «лицо → форма» с красной подсказкой
    const t = mode;
    const SUBJ_LC = ['я','ты','она','мы','они'];
    const MKW = {pres:'обычно', pps:'вчера'};
    shuffle([0,1,2,3,4]).forEach(p=>{
      const form = conjForm(v, t, p); if(!form) return;
      const answers = [form];
      PERSONS[p].split(', ').forEach(pr=> answers.push(pr+' '+form));
      steps.push({label:`${d.inf} · ${TENSES[t].name}`, card:true,
        prompt:`${PERSONS[p]} — <span style="color:var(--accent)">${d.inf}</span>`,
        subHtml:`${esc(d.ruInf)} · <b style="color:var(--warn)">${TENSES[t].short} — ${MKW[t]} ${SUBJ_LC[p]}…</b>`,
        answers, pt:form,
        rule: t==='pres'?'pres_regulares':'pps_regulares',
        conj:{v, tense:t, person:p}});
    });
  }
  // возвратный близнец: в Presente подмешиваем chamo-me / vestes-te / …
  if(mode==='pres'){
    const twin = DATA.verbs.find(x=>x.inf===d.inf+'-se');
    if(twin){
      const SUBJ_LC = ['я','ты','она','мы','они'];
      shuffle([0,1,2,3,4]).slice(0,3).forEach(p=>{
        const form = conjForm(twin, 'pres', p); if(!form) return;
        const answers = [form];
        PERSONS[p].split(', ').forEach(pr=> answers.push(pr+' '+form));
        steps.push({label:`${d.inf} · возвратная форма (-se)`, card:true,
          prompt:`${PERSONS[p]} — <span style="color:var(--accent)">${twin.inf}</span>`,
          subHtml:`${esc(twin.ru)} · <b style="color:var(--warn)">Presente — обычно ${SUBJ_LC[p]}… (себя)</b>`,
          answers, pt:form, rule:'reflexos',
          conj:{v:twin, tense:'pres', person:p}});
      });
    }
  }
  SES = {queue: shuffle(steps).map((s,i)=>({
      id:'vs-'+d.inf+'-'+mode+'-'+i, p:{id:'vs-'+d.inf+'-'+mode+'-'+i, kind:'trans', unit:d.unit},
      type:'input', big:!s.card, label:s.label,
      hintLabel: s.hintLabel||null,
      prompt: s.card ? s.prompt : s.ru,
      subHtml: s.subHtml||null,
      answers:s.answers, speakAfter:s.pt, rule:s.rule, conj:s.conj||null
    })), i:0, right:0, wrong:0, again:[], log:[],
    title: d.inf+' · '+(mode==='peri'?'связки':mode==='pres'?'Presente':'PPS')};
  renderSession();
}

/* ⚡ PPS-разминка: ser / ir / estar / ter */
function startPps4(){
  const infs = ['ser','ir','estar','ter'];
  const SUBJ_LC = ['я','ты','она','мы','они'];
  const qs = [];
  infs.forEach(inf=>{
    const v = DATA.verbs.find(x=>x.inf===inf);
    const vi = DATA.verbs.indexOf(v);
    shuffle([0,1,2,3,4]).slice(0,3).forEach(p=>{
      const form = v.pps[p];
      const answers = [form];
      PERSONS[p].split(', ').forEach(pr=> answers.push(pr+' '+form));
      qs.push({
        id:'pps4-'+inf+'-'+p, p:{id:'pps4-'+inf+'-'+p, kind:'conj', unit:8, group:'conj'},
        type:'input', label:TENSES.pps.name,
        prompt:`${PERSONS[p]} — <span style="color:var(--accent)">${inf}</span>`,
        subHtml:`<b style="color:var(--warn)">простое прошедшее — вчера ${SUBJ_LC[p]}…</b>`,
        answers, speakAfter:form, rule:'pps_irregulares',
        conj:{v, tense:'pps', person:p}
      });
    });
  });
  SES = {queue: shuffle(qs), i:0, right:0, wrong:0, again:[], log:[],
         title:'⚡ PPS: ser · ir · estar · ter'};
  renderSession();
}
