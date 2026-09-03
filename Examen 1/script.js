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
})();
