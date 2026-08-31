/* ================= AI-ПРОВЕРКА (ключ в localStorage, в код не зашит) ================= */
const AI_KEY_STORE = 'pav1-aikey';
function aiKey(){ try{ return localStorage.getItem(AI_KEY_STORE) || ''; }catch(e){ return ''; } }

/* приём ключа из фрагмента ссылки: #k=...  (фрагмент не уходит на сервер) */
try{
  if(location.hash.startsWith('#k=')){
    localStorage.setItem(AI_KEY_STORE, decodeURIComponent(location.hash.slice(3)));
    history.replaceState(null, '', location.pathname + location.search);
  }
}catch(e){}

const AI_SYS = `Ты проверяешь ответы ученицы уровня A1 по европейскому португальскому (учебник Português a Valer 1).
Вопрос один: ДОПУСТИМ ли её ответ — грамматически корректен и решает ли коммуникативную задачу. Совпадение с образцом НЕ требуется.
ok=true, если ответ грамматичен и по делу. Допустимы и НЕ являются ошибкой:
- другой порядок слов, синонимы, опущенное подлежащее, отсутствие запятых;
- стилистические варианты: quero/queria, por favor/faz favor/se faz favor, olá/bom dia, obrigado/obrigada;
- иная, но корректная формулировка той же мысли.
ok=false ТОЛЬКО при реальных ошибках: неверное спряжение или форма глагола, неверный предлог/артикль/род,
пропущенная диакритика (cafe вместо café), не тот смысл, слова не по-португальски, бразилизмы вместо европейской нормы (в т.ч. gerúndio: estou falando).
Отвечай ТОЛЬКО JSON: {"ok": true/false, "why": "одно короткое предложение по-русски", "fix": "минимально исправленный вариант ответа ученицы (пустая строка, если ошибок нет)"}`;

async function aiJudge(payload){
  const key = aiKey();
  if(!key) return null;
  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body: JSON.stringify({
        model:'gpt-4o-mini', temperature:0,
        response_format:{type:'json_object'},
        messages:[{role:'system',content:AI_SYS},{role:'user',content:JSON.stringify(payload)}]
      })
    });
    if(!r.ok) return {err: r.status===401 ? 'ключ не принят (401)' : 'ошибка API '+r.status};
    const j = await r.json();
    return JSON.parse(j.choices[0].message.content);
  }catch(e){ return {err:'нет связи с AI'}; }
}

/* принять ответ как верный задним числом */
function acceptAnswer(q){
  const idx = SES ? SES.i : -1;
  if(!SES) return;
  schedule(q.id, true);
  if(SES.log[idx]===0){ SES.log[idx]=1; SES.right++; SES.wrong--; }
  SES.again = SES.again.filter(p=>p.id!==q.p.id && p!==q.p);
  const a = (SES.answers||[]).slice(-1)[0];
  if(a && !a.ok){ a.ok = true; a.aiAccepted = true; }
  const d = today(); if(S.hist[d] && S.hist[d].ok < S.hist[d].n) S.hist[d].ok++;
  save();
}

/* спросить AI после локального «неверно» в обычных заданиях */
function aiSecondOpinion(q, given){
  if(!aiKey() || !given || !given.trim()) return;
  const box = document.createElement('div');
  box.className = 'verdict'; box.style.marginTop = '8px';
  box.innerHTML = '<span class="small muted">🤖 спрашиваю AI, допустим ли ваш вариант…</span>';
  const v = document.getElementById('verdict');
  if(!v) return;
  const anchor = v.querySelector('.ruleref');           // сразу под вердиктом, выше правил
  if(anchor) v.insertBefore(box, anchor); else v.appendChild(box);
  const taskRu = (q.gap ? q.gap.replace(/<[^>]+>/g,'') : (q.prompt||'').replace(/<[^>]+>/g,''));
  aiJudge({
    'задание': q.label + ': ' + taskRu + (q.hintLabel? ' ['+q.hintLabel+']':''),
    'образец_ответа': q.answers ? q.answers[0] : q.correct,
    'ответ_ученицы': given
  }).then(res=>{
    if(!res){ box.remove(); return; }
    if(res.err){ box.innerHTML = `<span class="small muted">🤖 ${esc(res.err)}</span>`; return; }
    if(res.ok){
      acceptAnswer(q);
      box.classList.add('ok');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 Засчитано: ваш вариант допустим</div>
        <div class="ru">${esc(res.why||'')}</div>`;
    }else{
      box.classList.add('no');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 AI подтверждает ошибку</div>
        <div class="ru">${esc(res.why||'')}</div>
        ${res.fix? `<div class="ru">исправление: <b>${esc(res.fix)}</b></div>`:''}`;
    }
  });
}

/* диалоги: допустимость реплики в ситуации */
function aiDialogOpinion(step, text, onAccept){
  if(!aiKey() || !text) return;
  const v = document.getElementById('verdict');
  if(!v) return;
  const box = document.createElement('div');
  box.className = 'verdict'; box.style.marginTop = '8px';
  box.innerHTML = '<span class="small muted">🤖 спрашиваю AI, уместен ли ответ в этой ситуации…</span>';
  v.appendChild(box);
  aiJudge({
    'ситуация': (DLG&&DLG.d? DLG.d.title+'. '+DLG.d.brief : ''),
    'собеседник_сказал': step.say,
    'задание': step.task,
    'образец': step.model,
    'ответ_ученицы': text
  }).then(res=>{
    if(!res){ box.remove(); return; }
    if(res.err){ box.innerHTML = `<span class="small muted">🤖 ${esc(res.err)}</span>`; return; }
    if(res.ok){
      box.classList.add('ok');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 Ответ уместен и корректен</div>
        <div class="ru">${esc(res.why||'')}</div>
        <button class="btn" id="aiGo" style="margin-top:8px">Принять и продолжить →</button>`;
      document.getElementById('aiGo').onclick = onAccept;
    }else{
      box.classList.add('no');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 AI подтверждает: так не сказать</div>
        <div class="ru">${esc(res.why||'')}</div>
        ${res.fix? `<div class="ru">как можно: <b>${esc(res.fix)}</b></div>`:''}`;
    }
  });
}
