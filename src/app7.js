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
Регистр букв (заглавная/строчная) НЕ считается ошибкой — полностью игнорируй его и не упоминай.
Если в задании по-русски не указано число («вы» без пометки), считай верными И você/о senhor (вежливо к одному), И vocês (к нескольким) — не считай выбор обращения ошибкой.
Поле «для_справки_один_из_вариантов» дано ТОЛЬКО чтобы ты понял смысл задания. Оцени фразу ученицы саму по себе, как её оценил бы носитель: грамматична ли она и решает ли задачу. НИКОГДА не сравнивай с этим полем и не ссылайся на него.
Другое вопросительное слово, другая конструкция, другой порядок слов — НЕ ошибка, если получившаяся фраза корректна и уместна. Например «Чем ты занимаешься? (профессия)»: верны и «O que fazes?», и «Qual é a tua profissão?», и «Em que trabalhas?». Запрещённые формулировки: «не совпадает с образцом», «неверный выбор слова для этого вопроса», «в задании указано другое», «отличается от примера».
Синонимы и равноправные бытовые варианты европейского португальского — НЕ ошибка: telemóvel/telefone, autocarro, pequeno-almoço, casa de banho, comboio, ecrã, sandes, faz favor/por favor, adeus/até logo. Слово, отличное от примера, ошибочно только если оно реально означает другое или не существует. Каждая ошибка — только конкретная языковая: диакритика, род, число, спряжение, предлог, порядок слов, лексика.
ok=false ТОЛЬКО при реальных ошибках: неверное спряжение или форма глагола, неверный предлог/артикль/род,
пропущенная диакритика (cafe вместо café), не тот смысл, слова не по-португальски, бразилизмы вместо европейской нормы (в т.ч. gerúndio: estou falando).
Отвечай ТОЛЬКО JSON: {"ok": true/false, "why": "...", "fix": "минимально исправленный вариант ответа ученицы (пустая строка, если ошибок нет)"}
Поле "why": если ошибок нет — одно предложение, почему вариант хорош. Если есть — перечисли ВСЕ ошибки, каждую с новой строки в формате «слово → исправление — короткое объяснение почему (род, спряжение, предлог и т.п.)». Не пропускай ни одной ошибки, включая согласование рода и числа.`;

async function aiJudge(payload){
  const key = aiKey();
  if(!key) return null;
  try{
    const r = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{'Content-Type':'application/json','Authorization':'Bearer '+key},
      body: JSON.stringify({
        model:'gpt-4o', temperature:0,
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
    'для_справки_один_из_вариантов': q.answers ? q.answers[0] : q.correct,
    'ответ_ученицы': given
  }).then(res=>{
    if(!res){ box.remove(); return; }
    if(res.err){ box.innerHTML = `<span class="small muted">🤖 ${esc(res.err)}</span>`; return; }
    if(res.ok){
      acceptAnswer(q);
      const first = v.querySelector('.verdict.no');
      if(first){
        first.classList.remove('no'); first.classList.add('ok');
        first.querySelectorAll('.wr').forEach(e=>{
          e.style.cssText='color:inherit;text-decoration:none;font-weight:inherit';
          e.classList.remove('wr');
        });
        const big = first.querySelector('.big');
        if(big && !big.textContent.startsWith('✓')) big.insertAdjacentText('afterbegin','✓ ');
      }
      box.classList.add('ok');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 Засчитано: ваш вариант допустим</div>
        <div class="ru">${esc(res.why||'')}</div>`;
    }else{
      box.classList.add('no');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 AI подтверждает ошибку</div>
        <div class="ru" style="white-space:pre-line">${esc(res.why||'')}</div>
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
    'для_справки_один_из_вариантов': step.model,
    'ответ_ученицы': text
  }).then(res=>{
    if(!res){ box.remove(); return; }
    if(res.err){ box.innerHTML = `<span class="small muted">🤖 ${esc(res.err)}</span>`; return; }
    if(res.ok){
      const first = v.querySelector('.verdict.no');
      if(first){
        first.classList.remove('no'); first.classList.add('ok');
        first.querySelectorAll('.wr').forEach(e=>{
          e.style.cssText='color:inherit;text-decoration:none;font-weight:inherit';
          e.classList.remove('wr');
        });
      }
      box.classList.add('ok');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 Ответ уместен и корректен</div>
        <div class="ru">${esc(res.why||'')}</div>
        <button class="btn" id="aiGo" style="margin-top:8px">Принять и продолжить →</button>`;
      document.getElementById('aiGo').onclick = onAccept;
    }else{
      box.classList.add('no');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 AI подтверждает: так не сказать</div>
        <div class="ru" style="white-space:pre-line">${esc(res.why||'')}</div>
        ${res.fix? `<div class="ru">как можно: <b>${esc(res.fix)}</b></div>`:''}`;
    }
  });
}

/* AI-верификация ПРИНЯТОГО ответа в диалоге (принят по ключам, не дословно) */
function aiDialogVerify(step, text){
  if(!aiKey() || !text) return;
  const models = [step.model, ...(step.models||[])];
  if(models.some(m => canon(m) === canon(text))) return;   // дословное совпадение — AI не нужен
  const v = document.getElementById('verdict');
  if(!v) return;
  const box = document.createElement('div');
  box.className = 'verdict'; box.style.marginTop = '8px';
  box.innerHTML = '<span class="small muted">🤖 проверяю грамматику…</span>';
  const okBox = v.querySelector('.verdict.ok');
  if(okBox && okBox.nextSibling) v.insertBefore(box, okBox.nextSibling); else v.appendChild(box);
  aiJudge({
    'ситуация': (DLG&&DLG.d? DLG.d.title+'. '+DLG.d.brief : ''),
    'собеседник_сказал': step.say,
    'задание': step.task,
    'для_справки_один_из_вариантов': step.model,
    'ответ_ученицы': text
  }).then(res=>{
    if(!res || res.err){ box.remove(); return; }
    if(res.ok){
      box.innerHTML = `<span class="small" style="color:var(--accent)">🤖 AI подтверждает: грамматика верна${res.why? ' · '+esc(res.why):''}</span>`;
    }else{
      // честно понижаем вердикт
      if(okBox){ okBox.classList.remove('ok'); okBox.classList.add('no'); }
      DLG.ok = Math.max(0, DLG.ok-1);
      const a = DLG.answers.slice(-1)[0];
      if(a){ a.ok = false; a.missing = a.missing||[]; }
      box.classList.add('no');
      box.innerHTML = `<div class="big" style="font-size:15px">🤖 AI нашёл ошибку</div>
        <div class="ru" style="white-space:pre-line">${esc(res.why||'')}</div>
        ${res.fix? `<div class="ru">правильно: <b>${esc(res.fix)}</b>
          <button class="speak" onclick="say('${esc(res.fix).replace(/'/g,"\\'")}')">🔊</button></div>`:''}`;
    }
  });
}
