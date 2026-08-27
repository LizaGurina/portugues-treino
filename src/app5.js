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

/* ================= СПРЯЖЕНИЯ: ВЫБОР ГЛАГОЛОВ ================= */
function conjMenu(){
  buildPool();
  const nIrr = POOL.filter(p=>p.kind==='conj' && p.irr).length;
  const nReg = POOL.filter(p=>p.kind==='conj' && !p.irr).length;
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>Времена и конструкции</h2>
     <div class="opts">
       <button class="opt" data-c="all"><span class="k">1</span>
         <span><b>Все глаголы</b><br><span class="small muted">${nReg+nIrr} карточек спряжения</span></span></button>
       <button class="opt" data-c="reg"><span class="k">2</span>
         <span><b>Только правильные</b><br><span class="small muted">-ar / -er / -ir без сюрпризов · ${nReg} карточек</span></span></button>
       <button class="opt" data-c="irr"><span class="k">3</span>
         <span><b>Только неправильные</b><br><span class="small muted">ser, ir, fazer, pôr… и глаголы с чередованием (prefiro, durmo) · ${nIrr} карточек</span></span></button>
       <button class="opt" data-c="hear"><span class="k">4</span>
         <span><b>На слух → перевод</b> 🔊<br><span class="small muted">слышишь «estou a ver» — выбираешь «я сейчас смотрю»</span></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-c]').forEach(b=> b.onclick = ()=>{
    const c = b.dataset.c;
    const f = c==='hear' ? (p => p.kind==='conjh')
      : (p => p.kind==='conj' && (c==='all' || (c==='irr') === !!p.irr));
    startSession(f, c==='hear' ? 'Спряжения на слух'
      : c==='irr' ? 'Неправильные глаголы' : c==='reg' ? 'Правильные глаголы' : 'Времена и конструкции');
  });
}
