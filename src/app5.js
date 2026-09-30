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
         <span><b>Значение слова · PT → RU</b><br><span class="small muted">слышишь и видишь португальское слово → выбираешь перевод</span></span></button>
       <button class="opt" data-m="recpt"><span class="k">2</span>
         <span><b>Выбрать слово · RU → PT</b><br><span class="small muted">«усталость» → выбираешь o cansaço из четырёх</span></span></button>
       <button class="opt" data-m="prod"><span class="k">3</span>
         <span><b>Написать слово · RU → PT</b><br><span class="small muted">«антибиотик» → antibiótico (ввод или диктовка)</span></span></button>
       <button class="opt" data-m="mix"><span class="k">4</span>
         <span><b>Смешанный</b><br><span class="small muted">новое → значение, потом выбор слова, затем ввод по памяти</span></span></button>
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
       <button class="opt" data-c="ppsmenu"><span class="k">4</span>
         <span><b>⏪ Прошедшее PPS</b><br><span class="small muted">ser/ir/estar/ter · правильные · fazer, ver, vir, dizer, trazer</span></span></button>
       <button class="opt" data-c="hear"><span class="k">5</span>
         <span><b>На слух → перевод</b> 🔊<br><span class="small muted">слышишь «estou a ver» — выбираешь «я сейчас смотрю»</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-c]').forEach(b=> b.onclick = ()=>{
    const c = b.dataset.c;
    if(c==='hear'){ startSession(p=>p.kind==='conjh', 'Спряжения на слух'); return; }
    if(c==='ppsmenu'){ ppsMenu(); return; }
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
  const card = v => `<button class="mode" data-inf="${v.inf}">
      <div class="t">${fullSet.has(v.inf)?'⭐ ':''}${v.inf}${v.irr?' <span class="tag">неправ.</span>':''}</div>
      <div class="d">${esc(v.ru||'')}</div></button>`;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Выберите глагол · ${list.length}</h2>
     <input class="answer" id="vSearch" placeholder="поиск: falar, спать, -ir, неправ…"
       autocomplete="off" autocapitalize="off" spellcheck="false" style="margin-top:0">
     <div class="row" style="margin-top:8px">
       <button class="btn ghost" data-f="all" style="padding:6px 12px;font-size:13px">все</button>
       <button class="btn ghost" data-f="star" style="padding:6px 12px;font-size:13px">⭐ с фразами</button>
       <button class="btn ghost" data-f="irr" style="padding:6px 12px;font-size:13px">неправильные</button>
       <button class="btn ghost" data-f="reg" style="padding:6px 12px;font-size:13px">правильные</button>
       <button class="btn ghost" data-f="-ar" style="padding:6px 12px;font-size:13px">-ar</button>
       <button class="btn ghost" data-f="-er" style="padding:6px 12px;font-size:13px">-er</button>
       <button class="btn ghost" data-f="-ir" style="padding:6px 12px;font-size:13px">-ir</button>
     </div>
     <p class="small muted" style="margin-top:10px">⭐ — с полными фразами (дополнение, все виды заданий)</p>
     <div class="grid" id="vGrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr))">
       ${list.map(card).join('')}
     </div>
     <div class="small muted" id="vEmpty" style="display:none">Ничего не найдено</div>
   </div>`;
  document.getElementById('back').onclick = conjMenu;
  const grid = document.getElementById('vGrid');
  const bind = ()=> grid.querySelectorAll('[data-inf]').forEach(b=>
    b.onclick = ()=> verbSections(drillFor(b.dataset.inf)));
  bind();
  let mode = 'all';
  const apply = ()=>{
    const q = strip((document.getElementById('vSearch').value||'').toLowerCase().trim());
    const sel = list.filter(v=>{
      if(mode==='star' && !fullSet.has(v.inf)) return false;
      if(mode==='irr' && !v.irr) return false;
      if(mode==='reg' && v.irr) return false;
      if(mode.startsWith('-') && !v.inf.endsWith(mode.slice(1))) return false;
      if(!q) return true;
      return strip(v.inf.toLowerCase()).includes(q) || strip((v.ru||'').toLowerCase()).includes(q);
    });
    grid.innerHTML = sel.map(card).join('');
    document.getElementById('vEmpty').style.display = sel.length? 'none':'block';
    bind();
  };
  document.getElementById('vSearch').oninput = apply;
  document.querySelectorAll('[data-f]').forEach(b=> b.onclick = ()=>{
    mode = b.dataset.f;
    document.querySelectorAll('[data-f]').forEach(x=>x.classList.add('ghost'));
    b.classList.remove('ghost');
    apply();
  });
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
       <button class="opt" data-s="imp" ${impForms(d.inf)?'':'disabled style="opacity:.4"'}><span class="k">4</span>
         <span><b>Императив · fala / não fales</b><br>
         <span class="small muted">${impForms(d.inf)?'приказ и запрет: tu · você · vocês':'для этого глагола не тренируем'}</span></span></button>
       <button class="opt" data-s="pps4"><span class="k">5</span>
         <span><b>⏪ PPS: неправильные глаголы</b><br><span class="small muted">ser/ir/estar/ter и fazer, ver, vir, dizer, trazer</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = conjMenu;
  document.querySelectorAll('[data-s]').forEach(b=> b.onclick = ()=>{
    const m = b.dataset.s;
    if(m==='pps4'){ ppsMenu(); return; }
    if(m==='imp'){ if(impForms(d.inf)) startImpSession(impQuestions(d.inf, 6), d.inf+' · Императив'); return; }
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
  // ter / estar: состояния (fome, sede, frio, dores…) во всех временах раздела
  if((d.inf==='ter' || d.inf==='estar') && (mode==='pres' || mode==='pps')){
    stateQuestions(d.inf, mode, 5).forEach(sq=>{
      steps.push({label:`${d.inf} · состояния (ter / estar com)`, ru:sq.ru, pt:sq.pt,
                  answers:sq.answers, rule:sq.rule});
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
  SES = {queue: shuffle(steps).map((s,i)=>{ const q = ({
      id:'vs-'+d.inf+'-'+mode+'-'+i, p:{id:'vs-'+d.inf+'-'+mode+'-'+i, kind:'trans', unit:d.unit},
      type:'input', big:!s.card, label:s.label,
      hintLabel: s.hintLabel||null,
      prompt: s.card ? s.prompt : s.ru,
      subHtml: s.subHtml||null,
      answers:s.answers, speakAfter:s.pt, rule:s.rule, conj:s.conj||null
    }); q.p._pre = q; return q; }), i:0, right:0, wrong:0, again:[], log:[],
    title: d.inf+' · '+(mode==='peri'?'связки':mode==='pres'?'Presente':'PPS')};
  renderSession();
}

/* ⚡ PPS-разминка: ser / ir / estar / ter — полными фразами */
const PPS4 = {
 ser: {objs:[{pt:['muito simpática','muito simpático'], ru:['очень любезна','очень любезен (любезна)','очень любезна','очень любезны','очень любезны'], plPt:['muito simpáticas','muito simpáticos']}],
       ruV:['была','был(а)','была','были','были']},
 ir:  {objs:[{pt:'ao cinema', ru:'в кино', v:'ход'}, {pt:'à praia', ru:'на пляж', v:'ход'},
             {pt:'ao mercado', ru:'на рынок', v:'ход'}, {pt:'ao Porto', ru:'в Порту', v:'езд'}],
       ruV:['ила','ил(а)','ила','или','или']},
 estar:{objs:[{pt:'em casa', ru:'дома'}, {pt:'na praia', ru:'на пляже'},
              {pt:'no hospital', ru:'в больнице'}, {pt:'em Lisboa', ru:'в Лиссабоне'}],
       ruV:['была','был(а)','была','были','были']},
 ter: {objs:[{pt:'aula de português', ru:'урок португальского', was:'был'},
             {pt:'febre', ru:'температура', was:'была'},
             {pt:'muito trabalho', ru:'много работы', was:'было'},
             {pt:'uma reunião', ru:'встреча', was:'была'}]},
};
function startPps4(){
  const RU_U2 = ['у меня','у тебя','у неё','у нас','у них'];
  const qs = [];
  ['ser','ir','estar','ter'].forEach(inf=>{
    const v = DATA.verbs.find(x=>x.inf===inf);
    const cfg = PPS4[inf];
    shuffle([0,1,2,3,4]).slice(0,3).forEach(p=>{
      const form = v.pps[p];
      const subj = DATA.subjPt[p], subjRu = DATA.subjRu[p];
      const mk = rnd(PPS_MARKERS.filter(m=>!m.pos));
      const o = rnd(cfg.objs);
      let ru, full, full2=null;
      if(inf==='ser'){
        const adj = (p>=3? o.plPt : o.pt);
        ru = `${mk.ru} ${subjRu.toLowerCase()} ${['была','был(а)','была','были','были'][p]} ${o.ru[p]}.`;
        full = `${mk.pt}, ${subj.toLowerCase()} ${form} ${adj[0]}.`;
        full2 = `${mk.pt}, ${subj.toLowerCase()} ${form} ${adj[1]}.`;
      }else if(inf==='ir'){
        ru = `${mk.ru} ${subjRu.toLowerCase()} ${o.v}${cfg.ruV[p]} ${o.ru}.`;
        full = `${mk.pt}, ${subj.toLowerCase()} ${form} ${o.pt}.`;
      }else if(inf==='estar'){
        ru = `${mk.ru} ${subjRu.toLowerCase()} ${cfg.ruV[p]} ${o.ru}.`;
        full = `${mk.pt}, ${subj.toLowerCase()} ${form} ${o.pt}.`;
      }else{
        ru = `${mk.ru} ${RU_U2[p]} ${o.was} ${o.ru}.`;
        full = `${mk.pt}, ${subj.toLowerCase()} ${form} ${o.pt}.`;
      }
      const answers = [];
      [full, full2].filter(Boolean).forEach(f=>{
        answers.push(...ptVariants(f));
        answers.push(f.replace(/^[^,]+, /,''));
      });
      answers.push(form);
      PERSONS[p].split(', ').forEach(pr=> answers.push(pr+' '+form));
      const _q = {
        id:'pps4-'+inf+'-'+p, p:{id:'pps4-'+inf+'-'+p, kind:'conj', unit:8, group:'conj'},
        type:'input', big:true, label:TENSES.pps.name,
        hintLabel: inf+' · PPS',
        prompt: ru,
        answers, speakAfter: full, rule:'pps_irregulares',
        conj:{v, tense:'pps', person:p}
      };
      _q.p._pre = _q; qs.push(_q);
    });
  });
  SES = {queue: shuffle(qs), i:0, right:0, wrong:0, again:[], log:[],
         title:'⚡ PPS: ser · ir · estar · ter'};
  renderSession();
}

/* ================= ВОПРОСИТЕЛЬНЫЕ СЛОВА ================= */
function qwMenu(){
  buildPool();
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>❓ Вопросительные слова</h2>
     <div class="opts">
       ${DATA.qwGroups.map((g,i)=>{
         const n = DATA.qw.filter(x=>x.g===g.key).length;
         return `<button class="opt" data-q="${g.key}"><span class="k">${i+1}</span>
           <span><b>${esc(g.ru)}</b><br><span class="small muted">${esc(g.d)} · ${n}</span></span></button>`;
       }).join('')}
       <button class="opt" data-q="__all"><span class="k">${DATA.qwGroups.length+1}</span>
         <span><b>Все вопросы вперемешку</b><br><span class="small muted">${DATA.qw.length} вопросов</span></span></button>
       <button class="opt" data-q="__hear"><span class="k">${DATA.qwGroups.length+2}</span>
         <span><b>На слух</b> 🔊<br><span class="small muted">слышишь вопрос — выбираешь, о чём спросили</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-q]').forEach(b=> b.onclick = ()=>{
    const g = b.dataset.q;
    const f = g==='__hear' ? (p=>p.kind==='qwh')
      : g==='__all' ? (p=>p.kind==='qw')
      : (p=>p.kind==='qw' && p.qwg===g);
    const t = g==='__hear' ? 'Вопросы на слух'
      : g==='__all' ? 'Вопросительные слова' : DATA.qwGroups.find(x=>x.key===g).ru;
    startSession(f, '❓ '+t);
  });
}

/* ================= ИМПЕРАТИВ ================= */
function impMenu(){
  buildPool();
  const all = POOL.filter(p=>p.kind==='imp');
  const verbs = [...new Set(all.map(p=>p.inf))];
  const cnt = f => all.filter(f).length;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>❗ Императив · ${verbs.length} глаголов</h2>
     <p class="small muted" style="margin-top:-6px">fala · não fales · fale · não fale · falem · não falem</p>
     <div class="opts">
       <button class="opt" data-i="all"><span class="k">1</span>
         <span><b>Все формы вперемешку</b><br><span class="small muted">${all.length} карточек</span></span></button>
       <button class="opt" data-i="tu"><span class="k">2</span>
         <span><b>Только «ты» · tu</b><br><span class="small muted">fala / não fales · ${cnt(p=>p.person==='tu')}</span></span></button>
       <button class="opt" data-i="voce"><span class="k">3</span>
         <span><b>Вежливое · você</b><br><span class="small muted">fale / não fale · ${cnt(p=>p.person==='voce')}</span></span></button>
       <button class="opt" data-i="voces"><span class="k">4</span>
         <span><b>К нескольким · vocês</b><br><span class="small muted">falem / não falem · ${cnt(p=>p.person==='voces')}</span></span></button>
       <button class="opt" data-i="pos"><span class="k">5</span>
         <span><b>Только приказы</b><br><span class="small muted">без «não» · ${cnt(p=>!p.neg)}</span></span></button>
       <button class="opt" data-i="neg"><span class="k">6</span>
         <span><b>Только запреты</b><br><span class="small muted">не делай / не делайте · ${cnt(p=>p.neg)}</span></span></button>
       <button class="opt" data-i="pick"><span class="k">7</span>
         <span><b>Выбрать глагол</b><br><span class="small muted">все 6 форм одного глагола</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-i]').forEach(b=> b.onclick = ()=>{
    const k = b.dataset.i;
    if(k==='pick'){ impVerbPick(); return; }
    const f = k==='all' ? (p=>p.kind==='imp')
      : k==='pos' ? (p=>p.kind==='imp' && !p.neg)
      : k==='neg' ? (p=>p.kind==='imp' && p.neg)
      : (p=>p.kind==='imp' && p.person===k);
    const t = {all:'Императив', tu:'Императив · tu', voce:'Императив · você',
               voces:'Императив · vocês', pos:'Императив · приказы', neg:'Императив · запреты'}[k];
    startSession(f, '❗ '+t);
  });
}

function impVerbPick(){
  buildPool();
  const verbs = [...new Set(POOL.filter(p=>p.kind==='imp').map(p=>p.inf))].sort();
  const card = inf => { const v = DATA.verbs.find(x=>x.inf===inf);
    return `<button class="mode" data-inf="${inf}"><div class="t">${inf}</div>
            <div class="d">${esc((v&&v.ru)||'')}</div></button>`; };
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Императив: выберите глагол · ${verbs.length}</h2>
     <input class="answer" id="iSearch" placeholder="поиск: fechar, закрыть…" style="margin-top:0"
       autocomplete="off" autocapitalize="off" spellcheck="false">
     <div class="grid" id="iGrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:12px">
       ${verbs.map(card).join('')}</div>
   </div>`;
  document.getElementById('back').onclick = impMenu;
  const bind = ()=> document.querySelectorAll('#iGrid [data-inf]').forEach(b=>
    b.onclick = ()=> startImpSession(impQuestions(b.dataset.inf, 6), b.dataset.inf+' · Императив'));
  bind();
  document.getElementById('iSearch').oninput = e=>{
    const q = strip(e.target.value.toLowerCase().trim());
    const sel = verbs.filter(inf=>{
      const v = DATA.verbs.find(x=>x.inf===inf);
      return !q || strip(inf).includes(q) || strip(((v&&v.ru)||'').toLowerCase()).includes(q);
    });
    document.getElementById('iGrid').innerHTML = sel.map(card).join('');
    bind();
  };
}

function startImpSession(qsteps, title){
  SES = {queue: qsteps.map((s,i)=>{ const q = ({
      id:'imp-'+i+'-'+s.pt, p:{id:'imp-'+s.pt, kind:'conj', unit:6, group:'conj'},
      type:'input', label:s.label, prompt:s.prompt, subHtml:s.subHtml,
      answers:s.answers, speakAfter:s.pt, rule:s.rule
    }); q.p._pre = q; return q; }), i:0, right:0, wrong:0, again:[], log:[], title};
  renderSession();
}

/* ================= СЛОЖНЫЕ ПРЕДЛОЖЕНИЯ ================= */
function complexMenu(){
  buildPool();
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Сложные предложения</h2>
     <p class="small muted" style="margin-top:-6px">перевод целых фраз по конструкциям учебника</p>
     <div class="opts">
       ${DATA.cxGroups.map((g,i)=>{
         const n = DATA.complex.filter(c=>c.g===g.key).length;
         return `<button class="opt" data-g="${g.key}"><span class="k">${i+1}</span>
           <span><b>${esc(g.ru)}</b><br><span class="small muted">${esc(g.d)} · ${n}</span></span></button>`;
       }).join('')}
       <button class="opt" data-g="__all"><span class="k">${DATA.cxGroups.length+1}</span>
         <span><b>Всё вперемешку</b><br><span class="small muted">${DATA.complex.length} предложений</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-g]').forEach(b=> b.onclick = ()=>{
    const g = b.dataset.g;
    const f = g==='__all' ? (p=>p.kind==='cx') : (p=>p.kind==='cx' && p.cxg===g);
    const t = g==='__all' ? 'Сложные предложения' : DATA.cxGroups.find(x=>x.key===g).ru;
    startSession(f, t);
  });
}

/* ================= ГРАММАТИКА: ПОДРАЗДЕЛЫ ================= */
const GRAM_GROUPS = [
 {key:'serestar', ru:'Ser или estar',            icon:'⚖️', rules:['ser_estar']},
 {key:'imper',    ru:'Императив',                icon:'❗', rules:['imperativo']},
 {key:'pron',     ru:'Местоимения',              icon:'👉', rules:['ci_pronome','prep_pronome','com_pronome','reflexos']},
 {key:'demo',     ru:'Указательные este/esse/aquele', icon:'📍', rules:['demonstrativos']},
 {key:'indef',    ru:'Неопределённые alguém/ninguém', icon:'🔍', rules:['indefinidos']},
 {key:'hadesde',  ru:'Há и desde',               icon:'⏳', rules:['ha_desde']},
 {key:'comp',     ru:'Сравнение и tão/tanto',    icon:'📊', rules:['comparativo','igualdade','tao_tanto']},
 {key:'modal',    ru:'ter de · precisar · dever · costumar', icon:'🎯', rules:['ter_de','precisar_dever','costumar','cortesia']},
 {key:'estados',  ru:'estar com / ter + nome',   icon:'🤒', rules:['estar_com_ter','andar_adj']},
 {key:'verbos',   ru:'Presente и выбор глагола', icon:'🔤', rules:['pres_regulares','saber_conhecer']},
 {key:'pps',      ru:'Прошедшее PPS',            icon:'⏪', rules:['pps_regulares','pps_irregulares','pps_marcadores']},
 {key:'futuro',   ru:'Estar a / Ir + Infinitivo',icon:'▶️', rules:['estar_a','ir_inf']},
 {key:'conect',   ru:'Союзы и маркеры времени',  icon:'🔗', rules:['conectores','marcadores_temp','impessoal_se']},
 {key:'ordinais', ru:'Порядковые числительные',  icon:'🥇', rules:['ordinais']},
];
function grammarMenu(){
  buildPool();
  const isGram = p => p.group==='rules' && !['numw','numh','horaw','horah'].includes(p.kind);
  const cnt = g => POOL.filter(p=> isGram(p) && g.rules.includes(p.rule)).length;
  const groups = GRAM_GROUPS.filter(g=>cnt(g)>0);
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Грамматика — что отрабатываем?</h2>
     <div class="opts">
       ${groups.map((g,i)=>`<button class="opt" data-gg="${g.key}"><span class="k">${i+1}</span>
         <span><b>${g.icon} ${esc(g.ru)}</b><br><span class="small muted">${cnt(g)} заданий</span></span></button>`).join('')}
       <button class="opt" data-gg="__all"><span class="k">${groups.length+1}</span>
         <span><b>Всё вперемешку</b><br><span class="small muted">${POOL.filter(isGram).length} заданий</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-gg]').forEach(b=> b.onclick = ()=>{
    const k = b.dataset.gg;
    if(k==='__all'){ startSession(isGram, 'Грамматика'); return; }
    const g = GRAM_GROUPS.find(x=>x.key===k);
    startSession(p=> isGram(p) && g.rules.includes(p.rule), g.icon+' '+g.ru);
  });
}

/* ================= PPS: три группы ================= */
const PPS_IRR2 = ['fazer','ver','vir','dizer','trazer'];
const PPS_CORE = ['ser','ir','estar','ter'];
function ppsMenu(){
  buildPool();
  const regs = DATA.verbs.filter(v=>v.pps && !v.irr && !v.impersonal).length;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>⏪ Pretérito Perfeito Simples</h2>
     <div class="opts">
       <button class="opt" data-p="core"><span class="k">1</span>
         <span><b>ser · ir · estar · ter</b><br><span class="small muted">фразами: fui, estive, tive…</span></span></button>
       <button class="opt" data-p="reg"><span class="k">2</span>
         <span><b>Regulares</b><br><span class="small muted">-ei/-aste/-ou · -i/-este/-eu · ${regs} глаголов</span></span></button>
       <button class="opt" data-p="irr"><span class="k">3</span>
         <span><b>Irregulares</b><br><span class="small muted">fazer · ver · vir · dizer · trazer</span></span></button>
       <button class="opt" data-p="mix"><span class="k">4</span>
         <span><b>Всё вперемешку</b><br><span class="small muted">выбрать нужную форму по смыслу</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = conjMenu;
  document.querySelectorAll('[data-p]').forEach(b=> b.onclick = ()=>{
    const k = b.dataset.p;
    if(k==='core'){ startPps4(); return; }
    const list = k==='irr' ? PPS_IRR2
      : k==='reg' ? DATA.verbs.filter(v=>v.pps && !v.irr && !v.impersonal).map(v=>v.inf)
      : DATA.verbs.filter(v=>v.pps && !v.impersonal).map(v=>v.inf);
    startPpsCards(list, k==='irr' ? '⏪ PPS irregulares' : k==='reg' ? '⏪ PPS regulares' : '⏪ PPS вперемешку');
  });
}
/* карточки «лицо + глагол → форма PPS» */
function startPpsCards(infs, title){
  const SUBJ_LC = ['я','ты','она','мы','они'];
  const qs = [];
  shuffle(infs).slice(0, 12).forEach(inf=>{
    const v = DATA.verbs.find(x=>x.inf===inf); if(!v || !v.pps) return;
    const ps = shuffle([0,1,2,3,4]).slice(0, infs.length<8 ? 3 : 2);
    ps.forEach(p=>{
      const form = v.pps[p]; if(!form) return;
      const answers = [form];
      PERSONS[p].split(', ').forEach(pr=> answers.push(pr+' '+form));
      const q = {
        id:'ppsc-'+inf+'-'+p, p:{id:'ppsc-'+inf+'-'+p, kind:'conj', unit:8, group:'conj'},
        type:'input', label:TENSES.pps.name, hintLabel: inf+' · PPS',
        prompt:`${PERSONS[p]} — <span style="color:var(--accent)">${inf}</span>`,
        subHtml:`${esc(v.ru)} · <b style="color:var(--warn)">простое прошедшее — вчера ${SUBJ_LC[p]}…</b>`,
        answers, speakAfter:form, rule: v.irr?'pps_irregulares':'pps_regulares',
        conj:{v, tense:'pps', person:p}
      };
      q.p._pre = q; qs.push(q);
    });
  });
  SES = {queue: shuffle(qs).slice(0,20), i:0, right:0, wrong:0, again:[], log:[], title};
  renderSession();
}

/* ================= СЛОВАРЬ В КАРТИНКАХ (613 слов) ================= */
function atlasMenu(){
  buildPool();
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>📔 Словарь по темам</h2>
     <p class="small muted" style="margin-top:-6px">${DATA.vocab2.length} слов · узнавание и диктовка</p>
     <input class="answer" id="aSearch" placeholder="поиск темы или слова…" style="margin-top:4px"
       autocomplete="off" autocapitalize="off" spellcheck="false">
     <div class="grid" id="aGrid" style="grid-template-columns:repeat(auto-fit,minmax(150px,1fr));margin-top:12px">
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  const render = (q)=>{
    const qq = strip((q||'').toLowerCase().trim());
    const themes = DATA.themes2.filter(t=>{
      if(!qq) return true;
      if(strip(t.ru.toLowerCase()).includes(qq)) return true;
      return DATA.vocab2.some(w=>w.theme===t.key &&
        (strip(w.pt.toLowerCase()).includes(qq) || strip(w.ru.toLowerCase()).includes(qq)));
    });
    document.getElementById('aGrid').innerHTML = themes.map(t=>{
      const pool = atlasPool(t.key);
      const learned = pool.filter(p=>S.items[p.id] && S.items[p.id].b>=3).length;
      const pct = pool.length? Math.round(learned/pool.length*100):0;
      return `<button class="mode" data-at="${t.key}">
        <div class="t">${t.icon} ${esc(t.ru)}</div>
        <div class="d">${pool.length} слов · освоено ${pct}%</div>
        <div class="mini" style="width:100%;margin-top:7px"><i style="width:${pct}%"></i></div>
      </button>`;}).join('') ||
      '<div class="small muted">Ничего не найдено</div>';
    document.querySelectorAll('[data-at]').forEach(b=> b.onclick = ()=> atlasTheme(b.dataset.at));
  };
  render('');
  document.getElementById('aSearch').oninput = e=> render(e.target.value);
}
function atlasTheme(key){
  const t = DATA.themes2.find(x=>x.key===key);
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← к темам</button></div>
   <div class="card"><h2>${t.icon} ${esc(t.ru)}</h2>
     <div class="opts">
       <button class="opt" data-am="rec"><span class="k">1</span>
         <span><b>Узнавать слова · PT → RU</b><br><span class="small muted">слышишь и видишь слово → выбираешь перевод</span></span></button>
       <button class="opt" data-am="prod"><span class="k">2</span>
         <span><b>Диктовать слова · RU → PT</b><br><span class="small muted">русское слово → говоришь в микрофон или пишешь</span></span></button>
       <button class="opt" data-am="mix"><span class="k">3</span>
         <span><b>Смешанный</b><br><span class="small muted">новое — узнавание, знакомое — диктовка</span></span></button>
     </div>
     <button class="btn ghost wide" id="listWords" style="margin-top:12px">📄 Показать все слова темы</button>
   </div>`;
  document.getElementById('back').onclick = atlasMenu;
  document.querySelectorAll('[data-am]').forEach(b=> b.onclick = ()=>{
    buildPool();
    const ids = new Set(atlasPool(key).map(p=>p.id));
    startSession(p=>ids.has(p.id), t.icon+' '+t.ru, b.dataset.am==='mix'? null : b.dataset.am);
  });
  document.getElementById('listWords').onclick = ()=>{
    const ws = DATA.vocab2.filter(w=>w.theme===key);
    document.getElementById('view').innerHTML = `
     <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back2">← назад</button></div>
     <div class="card"><h2>${t.icon} ${esc(t.ru)} · ${ws.length}</h2>
       ${ws.map(w=>`<div class="statline">
         <span><b>${w.art? w.art+' ':''}${esc(w.pt)}</b> — ${esc(w.ru)}</span>
         <button class="speak" data-s="${esc(w.pt)}">🔊</button></div>`).join('')}
     </div>`;
    document.getElementById('back2').onclick = ()=> atlasTheme(key);
    document.querySelectorAll('.speak[data-s]').forEach(b=> b.onclick = ()=> say(b.dataset.s));
  };
}
