/* ================= ЧИСЛА И ЧАСЫ ================= */
const NUM_UNITS = ['zero','um','dois','três','quatro','cinco','seis','sete','oito','nove','dez',
 'onze','doze','treze','catorze','quinze','dezasseis','dezassete','dezoito','dezanove','vinte'];
const NUM_TENS = {20:'vinte',30:'trinta',40:'quarenta',50:'cinquenta',60:'sessenta',
 70:'setenta',80:'oitenta',90:'noventa'};
const NUM_HUNDREDS = {100:'cem',200:'duzentos',300:'trezentos',400:'quatrocentos',500:'quinhentos',
 600:'seiscentos',700:'setecentos',800:'oitocentos',900:'novecentos'};

function numToPt(n){
  if(n===1000) return 'mil';
  if(n<=20) return NUM_UNITS[n];
  if(n<100){
    const t = Math.floor(n/10)*10, u = n%10;
    return u? NUM_TENS[t]+' e '+NUM_UNITS[u] : NUM_TENS[t];
  }
  const h = Math.floor(n/100)*100, rest = n%100;
  if(!rest) return NUM_HUNDREDS[h];
  const hw = h===100? 'cento' : NUM_HUNDREDS[h];
  return hw + ' e ' + numToPt(rest);
}

/* фиксированные наборы — стабильные id для Лейтнера */
const NUM_SET = [3,7,9,12,14,16,17,19,20,
 21,25,28,32,38,42,47,50,56,63,69,74,77,81,88,93,99,
 100,101,115,134,160,200,245,278,300,342,386,400,415,468,
 500,516,555,600,611,645,700,730,777,800,808,850,900,902,930,999,1000];
const HORA_SET = ['1:00','2:30','5:15','7:00','8:15','9:30','10:45','12:00','0:00',
 '13:00','14:30','15:15','16:45','17:00','18:30','19:15','20:00','21:30','22:45','23:00'];

function horaWords(t){        // все допустимые прочтения
  let [h,m] = t.split(':').map(Number);
  const fem = n => n===1?'uma': n===2?'duas': numToPt(n);
  const out = [];
  const push = s => { if(!out.includes(s)) out.push(s); };
  if(h===12 && m===0){ push('meio-dia'); push('é meio-dia'); return out; }
  if(h===0 && m===0){ push('meia-noite'); push('é meia-noite'); return out; }
  const parte = h>=6&&h<12 ? 'da manhã' : (h>=12&&h<20 ? 'da tarde' : 'da noite');
  const h12 = h%12===0? 12 : h%12;
  const base12 = fem(h12);
  const min = m===0? '' : m===30? ' e meia' : m===15? ' e um quarto' : ' e '+numToPt(m);
  const minNum = m===0? '' : ' e '+(m===30?'meia':m===15?'um quarto':numToPt(m));
  const verb = h12===1? 'é ' : 'são ';
  push(base12 + min + ' ' + parte);                 // «três e meia da tarde»
  push(verb + base12 + min + ' ' + parte);
  push(base12 + min);                               // «três e meia»
  if(m===0){ push(base12+' horas'); push(verb+base12+' horas'); push(base12+' horas '+parte); }
  if(m===15){ push(base12+' e quinze'); push(base12+' e quinze '+parte); }
  if(m===30){ push(base12+' e trinta'); push(base12+' e trinta '+parte); }
  if(m===45){ push(base12+' e quarenta e cinco'); push('um quarto para as '+fem(h12===12?1:h12+1)); }
  // 24-часовое прочтение
  push(fem(h) + (m? ' e '+numToPt(m):' horas'));
  return out;
}
function horaDigits(t){       // допустимые цифровые ответы на слух
  let [h,m] = t.split(':').map(Number);
  const mm = String(m).padStart(2,'0');
  const out = [`${h}:${mm}`, `${h}h${mm}`];
  const h12 = h%12===0? 12 : h%12;
  if(h12!==h) out.push(`${h12}:${mm}`, `${h12}h${mm}`);
  if(h===0) out.push(`24:${mm}`,`12:${mm}`);
  return out;
}

function numbersMenu(){
  document.getElementById('view').innerHTML = `
   <div class="row" style="margin-bottom:14px"><button class="btn ghost" id="back">← назад</button></div>
   <div class="card"><h2>🔢 Числа и часы</h2>
     <div class="opts">
       <button class="opt" data-n="numw"><span class="k">1</span>
         <span><b>Числа: написать словами</b><br><span class="small muted">42 → quarenta e dois</span></span></button>
       <button class="opt" data-n="numh"><span class="k">2</span>
         <span><b>Числа: понять на слух</b> 🔊<br><span class="small muted">слышишь число → пишешь цифрами</span></span></button>
       <button class="opt" data-n="horaw"><span class="k">3</span>
         <span><b>Часы: сказать время</b><br><span class="small muted">14:30 → duas e meia da tarde</span></span></button>
       <button class="opt" data-n="horah"><span class="k">4</span>
         <span><b>Часы: понять на слух</b> 🔊<br><span class="small muted">слышишь время → пишешь 14:30</span></span></button>
       <button class="opt" data-n="all"><span class="k">5</span>
         <span><b>Всё вперемешку</b></span></button>
     </div>
   </div>`;
  document.getElementById('back').onclick = home;
  document.querySelectorAll('[data-n]').forEach(b=> b.onclick = ()=>{
    const k = b.dataset.n;
    const f = k==='all' ? (p=>['numw','numh','horaw','horah'].includes(p.kind))
                        : (p=>p.kind===k);
    startSession(f, '🔢 Числа и часы');
  });
}
