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
Вопрос один: допустим ли её ответ — грамматичен ли он и решает ли коммуникативную задачу. Совпадение с примером НЕ требуется.
Поле «для_справки_один_из_вариантов» дано ТОЛЬКО чтобы понять смысл задания: оцени фразу ученицы саму по себе, как носитель, и никогда не ссылайся на этот пример.

ПОРЯДОК РАБОТЫ:
1) Сначала переведи фразу ученицы на русский БУКВАЛЬНО, как она написана (поле "перевод").
2) Сравни этот перевод со смыслом задания. Если смысл тот же и фраза грамматична — ok:true, даже если слова другие.
3) Только потом перечисли конкретные языковые ошибки.

Верни JSON:
{"перевод": "что буквально означает фраза ученицы", "ok": true|false, "errors": [{"from":"...", "to":"...", "type":"...", "why":"короткое объяснение по-русски"}], "fix": "исправленный вариант или пустая строка"}

Тип каждой ошибки — строго одно из:
- "diacritico" — пропущен или лишний знак: cafe→café, manha→manhã
- "ortografia" — опечатка, неверное написание: arumar→arrumar
- "concordancia" — род или число: duas bilhetas→dois bilhetes
- "conjugacao" — неверная форма глагола или лицо: telefoneu→telefonou
- "preposicao" — неверный или лишний предлог/артикль: para quem→a quem
- "estrutura" — сломанный порядок слов, из-за которого фраза непонятна
- "sentido" — фраза грамматична, но означает НЕ то, что просили (vens «придёшь» вместо voltas «вернёшься»; posso falar «можно мне говорить» вместо просьбы к собеседнику)
- "lexico" — ученица выбрала ДРУГОЕ существующее слово, которое здесь тоже уместно (viver/morar, estudar/aprender, telemóvel/telefone, apanhar/tomar о транспорте и любые другие синонимы)
- "registo" — стиль/вежливость (quero vs queria)
- "maiuscula", "pontuacao" — регистр и знаки препинания

ВАЖНО: "lexico", "registo", "maiuscula", "pontuacao" — это НЕ ошибки уровня A1: помечай их этим типом, но НЕ считай основанием для ok:false.
ok:false ставь, только если есть хотя бы одна ошибка типа diacritico, ortografia, concordancia, conjugacao, preposicao, estrutura или sentido.
Опущенное подлежащее (pro-drop) не ошибка и не попадает в errors: «Moro em Lisboa», «Oferece um presente» — норма.
Регистр букв игнорируй полностью.
Если ошибок указанных типов нет — errors может содержать записи с типом lexico/registo, но ok:true и fix:"".
Каждая запись errors должна иметь from ≠ to.
Проверь по переводу: если «перевод» совпадает по смыслу с заданием и в errors только мягкие типы — ставь ok:true.
Слово без нужного акцента — это другое слово (nos «нас» ≠ nós «мы», e «и» ≠ é «есть»): такие случаи всегда diacritico, не пропускай их.`;

/* фильтр вердикта: отбрасываем классы, которые не ошибки на A1 */
const SOFT_TYPES = new Set(['lexico','registo','maiuscula','pontuacao','estilo','sinonimo']);
function sameWord(a,b){ return (a||'').toLowerCase().trim() === (b||'').toLowerCase().trim(); }
function cleanVerdict(res, given){
  if(!res || res.err) return res;
  let hard = [], soft = [];
  if(Array.isArray(res.errors)){
    res.errors.forEach(e=>{
      if(!e || sameWord(e.from, e.to)) return;                 // «vivemos → vivemos»
      (SOFT_TYPES.has((e.type||'').toLowerCase()) ? soft : hard).push(e);
    });
  }else if(!res.ok && res.why){                                 // старый формат — подстраховка
    (res.why||'').split(/\n|;\s+/).map(t=>t.trim()).filter(Boolean).forEach(t=>{
      const m = t.match(/^(.+?)\s*(?:→|->)\s*([^—\-]+)/);
      if(m && sameWord(m[1], m[2])) return;
      hard.push({why:t});
    });
  }
  const fmt = e => e.from && e.to ? `${e.from} → ${e.to} — ${e.why||''}`.trim() : (e.why||'');
  const tr = res['перевод'] ? `ваша фраза: «${res['перевод']}»` : '';
  if(!hard.length){
    const note = soft.length ? 'Вариант допустим. ' + soft.map(e=>`${e.from} / ${e.to} — оба годятся`).join('; ')
                             : (res.ok && res.why ? res.why : 'Вариант допустим.');
    return {ok:true, why:note, fix:''};
  }
  if(res.fix && sameWord(res.fix, given)) return {ok:true, why:'Вариант допустим.', fix:''};
  const lines = hard.map(fmt);
  if(tr && hard.some(e=>(e.type||'')==='sentido')) lines.unshift(tr);
  return {ok:false, why:lines.join('\n'), fix:res.fix||''};
}

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
  }).then(res0=>{
    const res = cleanVerdict(res0, given);
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
  }).then(res0=>{
    const res = cleanVerdict(res0, text);
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
  }).then(res0=>{
    const res = cleanVerdict(res0, text);
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
