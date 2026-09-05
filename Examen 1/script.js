(function(){
  const DAY_START = 8, DAY_END = 18;
  const NAMES = ['Entrevista de trabajo','Reunión de directorio','Demo de producto','Capacitación de ventas',
    'Llamada con cliente','Revisión de diseño','Sesión de mentoring','Presentación trimestral',
    'Taller de UX','Sincronización de equipo','Reunión con proveedor','Retrospectiva de sprint'];
  const LETTERS = 'ABCDEFGH';

  let activities = [];
  let sortedOrder = [];
  let stepIndex = -1;
  let lastEnd = null;
  let awaitingDecision = false;
  let finished = false;
  let acceptedCount = 0, rejectedCount = 0;
  let playTimer = null;
  let evalTimeout = null;

  const rowsEl = document.getElementById('rows');
  const axisEl = document.getElementById('axis');
  const gridEl = document.getElementById('grid-lines');
  const chipsEl = document.getElementById('chips');
  const cursorEl = document.getElementById('cursor-line');
  const logEl = document.getElementById('log');
  const boardCountEl = document.getElementById('board-count');

  const btnStep = document.getElementById('btn-step');
  const btnPlay = document.getElementById('btn-play');
  const btnReset = document.getElementById('btn-reset');
  const btnNew = document.getElementById('btn-new');
  const speedSel = document.getElementById('speed');

  const mEvaluated = document.getElementById('m-evaluated');
  const mAccepted = document.getElementById('m-accepted');
  const mRejected = document.getElementById('m-rejected');
  const badgeDone = document.getElementById('badge-done');

  function fmt(h){
    const hh = Math.floor(h);
    const mm = Math.round((h-hh)*60);
    return String(hh).padStart(2,'0') + ':' + String(mm).padStart(2,'0');
  }

  function pct(h){
    return ((h - DAY_START) / (DAY_END - DAY_START)) * 100;
  }

  function shuffle(arr){
    const a = arr.slice();
    for(let i=a.length-1;i>0;i--){
      const j = Math.floor(Math.random()*(i+1));
      [a[i],a[j]]=[a[j],a[i]];
    }
    return a;
  }

  function generateActivities(){
    const n = 8;
    const names = shuffle(NAMES).slice(0,n);
    const acts = [];
    for(let i=0;i<n;i++){
      const start = DAY_START + Math.floor(Math.random()*(DAY_END-DAY_START-1));
      let duration = 1 + Math.floor(Math.random()*3);
      let end = Math.min(DAY_END, start+duration);
      if(end - start < 1) end = Math.min(DAY_END, start+1);
      acts.push({
        id:i,
        label:LETTERS[i],
        name:names[i],
        start, end,
        status:'pending'
      });
    }
    return acts;
  }

  function buildAxis(){
    axisEl.innerHTML = '';
    gridEl.innerHTML = '';
    for(let h=DAY_START; h<=DAY_END; h++){
      const s = document.createElement('span');
      s.style.left = pct(h)+'%';
      s.textContent = String(h).padStart(2,'0')+':00';
      axisEl.appendChild(s);
      const line = document.createElement('i');
      line.style.left = pct(h)+'%';
      gridEl.appendChild(line);
    }
  }

  function buildRows(){
    // remove old rows (keep grid-lines + cursor)
    Array.from(rowsEl.querySelectorAll('.row')).forEach(r=>r.remove());
    activities.forEach(act=>{
      const row = document.createElement('div');
      row.className = 'row';
      row.id = 'row-'+act.id;

      const label = document.createElement('div');
      label.className = 'row-label';
      label.innerHTML = '<b>'+act.label+' · '+act.name+'</b><span>'+fmt(act.start)+'–'+fmt(act.end)+'</span>';
      row.appendChild(label);

      const bar = document.createElement('div');
      bar.className = 'bar';
      bar.id = 'bar-'+act.id;
      bar.style.left = pct(act.start)+'%';
      bar.style.width = Math.max(pct(act.end)-pct(act.start), 4)+'%';
      bar.innerHTML = fmt(act.start)+'–'+fmt(act.end)+'<span class="tag"></span>';
      row.appendChild(bar);

      rowsEl.appendChild(row);
    });
  }

  function buildChips(){
    chipsEl.innerHTML = '';
    sortedOrder.forEach((act,i)=>{
      const chip = document.createElement('div');
      chip.className = 'chip';
      chip.id = 'chip-'+act.id;
      chip.textContent = act.label+' ('+fmt(act.start)+'–'+fmt(act.end)+')';
      chipsEl.appendChild(chip);
    });
  }

  function renderStates(){
    activities.forEach(act=>{
      const bar = document.getElementById('bar-'+act.id);
      const chip = document.getElementById('chip-'+act.id);
      bar.classList.remove('evaluating','accepted','rejected');
      chip.classList.remove('current','accepted','rejected');
      const tag = bar.querySelector('.tag');
      if(act.status==='evaluating'){ bar.classList.add('evaluating'); chip.classList.add('current'); tag.textContent='…'; }
      else if(act.status==='accepted'){ bar.classList.add('accepted'); chip.classList.add('accepted'); tag.textContent='✓'; }
      else if(act.status==='rejected'){ bar.classList.add('rejected'); chip.classList.add('rejected'); tag.textContent='✕'; }
      else { tag.textContent=''; }
    });

    if(lastEnd !== null){
      cursorEl.style.display = 'block';
      cursorEl.style.left = pct(lastEnd)+'%';
    } else {
      cursorEl.style.display = 'none';
    }

    mEvaluated.textContent = (stepIndex+1<0?0:Math.min(stepIndex+1, activities.length)) + ' / ' + activities.length;
    mAccepted.textContent = acceptedCount;
    mRejected.textContent = rejectedCount;
    badgeDone.classList.toggle('show', finished);

    btnStep.disabled = finished || awaitingDecision;
    btnPlay.disabled = finished;
  }

  function log(msg, cls){
    const p = document.createElement('p');
    if(cls) p.className = cls;
    p.textContent = msg;
    logEl.appendChild(p);
    logEl.scrollTop = logEl.scrollHeight;
  }

  function step(){
    if(finished || awaitingDecision) return;
    stepIndex++;
    if(stepIndex >= sortedOrder.length){
      finish();
      return;
    }
    const act = sortedOrder[stepIndex];
    act.status = 'evaluating';
    awaitingDecision = true;
    renderStates();
    log('→ Evaluando '+act.label+' · '+act.name+' ('+fmt(act.start)+'–'+fmt(act.end)+')', 'sys');
    evalTimeout = setTimeout(()=>decide(act), 380);
  }

  function decide(act){
    const canFit = (lastEnd === null) || (act.start >= lastEnd);
    if(canFit){
      act.status = 'accepted';
      acceptedCount++;
      log('✓ Aceptada — la sala está libre desde las '+(lastEnd===null?'el inicio del día':fmt(lastEnd))+'.', 'ok');
      lastEnd = act.end;
    } else {
      act.status = 'rejected';
      rejectedCount++;
      log('✕ Rechazada — se cruza con la última reunión aceptada (termina a las '+fmt(lastEnd)+').', 'no');
    }
    awaitingDecision = false;
    renderStates();
    if(stepIndex >= sortedOrder.length-1){
      finish();
    }
  }

  function finish(){
    if(finished) return;
    finished = true;
    pause();
    log('— Simulación completa: '+acceptedCount+' de '+activities.length+' reuniones asignadas a la Sala 4B. —', 'sys');
    renderStates();
  }

  function play(){
    if(finished) return;
    btnPlay.textContent = '⏸ Pausar';
    playTimer = setInterval(()=>{
      if(!awaitingDecision) step();
    }, Number(speedSel.value));
  }
  function pause(){
    btnPlay.textContent = '▶ Reproducir';
    clearInterval(playTimer);
    playTimer = null;
  }

  function resetSimulation(keepData){
    pause();
    clearTimeout(evalTimeout);
    if(!keepData){
      activities = generateActivities();
    } else {
      activities.forEach(a=>a.status='pending');
    }
    sortedOrder = activities.slice().sort((a,b)=> a.end - b.end || a.start - b.start);
    stepIndex = -1;
    lastEnd = null;
    awaitingDecision = false;
    finished = false;
    acceptedCount = 0;
    rejectedCount = 0;
    logEl.innerHTML = '';
    boardCountEl.textContent = activities.length + ' solicitudes';
    buildRows();
    buildChips();
    renderStates();
    log('Nuevo caso listo. '+activities.length+' solicitudes ordenadas por hora de fin. Pulsa "Avanzar un paso" o "Reproducir".', 'sys');
  }

  btnStep.addEventListener('click', step);
  btnPlay.addEventListener('click', ()=>{ if(playTimer) pause(); else play(); });
  btnReset.addEventListener('click', ()=> resetSimulation(true));
  btnNew.addEventListener('click', ()=> resetSimulation(false));
  speedSel.addEventListener('change', ()=>{ if(playTimer){ pause(); play(); } });

  buildAxis();
  resetSimulation(false);
})();

