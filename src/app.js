(function(){
  'use strict';

  const state = { solution:{grid:[],placed:[]}, user:[], active:{cells:[],dir:'across'}, startTs:0, timer:null, lastFocused:null };
  const el = {
    year: document.getElementById('year'),
    grid: document.getElementById('gridContainer'),
    cluesAcross: document.getElementById('cluesAcross'),
    cluesDown: document.getElementById('cluesDown'),
    newBtn: document.getElementById('newBtn'),
    revealSquareBtn: document.getElementById('revealSquareBtn'),
    revealWordBtn: document.getElementById('revealWordBtn'),
    solveBtn: document.getElementById('solveBtn'),
    checkBtn: document.getElementById('checkBtn'),
    clearBtn: document.getElementById('clearBtn'),
    timerText: document.getElementById('timerText'),
    modal: document.getElementById('completionModal'),
    closeModalBtn: document.getElementById('closeModalBtn'),
    ctaLink: document.getElementById('ctaLink'),
    statsText: document.getElementById('statsText')
  };

  function setYear(){ if (el.year) el.year.textContent=String(new Date().getFullYear()); }
  function startTimer(){ stopTimer(); state.startTs=Date.now(); state.timer=setInterval(()=>{
    const ms=Date.now()-state.startTs, m=Math.floor(ms/60000), s=Math.floor((ms%60000)/1000);
    el.timerText.textContent=`${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
  },1000); }
  function stopTimer(){ if(state.timer) clearInterval(state.timer); }

  function initUser(){ const n=state.solution.grid.length; state.user=Array.from({length:n},(_,r)=>Array.from({length:n},(_,c)=> state.solution.grid[r][c]===null?null:'' )); }

  function focusCell(r,c){ const i=el.grid.querySelector(`input[data-row="${r}"][data-col="${c}"]`); if(i) i.focus(); state.lastFocused={row:r,col:c}; }

  function wordPath(r,c,dir){ const g=state.solution.grid, n=g.length, out=[]; if(g[r][c]===null) return out; let rr=r,cc=c; const dr=dir==='down'?1:0, dc=dir==='across'?1:0;
    while(rr-dr>=0 && cc-dc>=0 && g[rr-dr][cc-dc]!==null){ rr-=dr; cc-=dc; }
    while(rr<n && cc<n && g[rr][cc]!==null){ out.push({row:rr,col:cc}); rr+=dr; cc+=dc; }
    return out;
  }

  function highlight(r,c,dir){ state.active={ cells:wordPath(r,c,dir), dir };
    el.grid.querySelectorAll('.cw-cell').forEach(w=>w.classList.remove('active'));
    for(const cell of state.active.cells){ const input=el.grid.querySelector(`input[data-row="${cell.row}"][data-col="${cell.col}"]`); if(input) input.parentElement.classList.add('active'); }
    state.lastFocused={row:r,col:c};
  }

  function renderGrid(){ el.grid.innerHTML=''; const table=window.Crossword.buildTable(state.solution.grid,state.solution.placed); el.grid.appendChild(table);
    const inputs=el.grid.querySelectorAll('input[type="text"]');
    inputs.forEach(input=>{
      input.addEventListener('focus', (e)=>{ const t=e.target; const r=Number(t.dataset.row), c=Number(t.dataset.col); highlight(r,c,state.active.dir); });
      input.addEventListener('input', (e)=>{ const t=e.target; const v=(t.value||'').replace(/[^a-zA-Z]/g,'').toUpperCase(); t.value=v; const r=Number(t.dataset.row), c=Number(t.dataset.col); state.user[r][c]=v; if(v.length===1){ const idx=state.active.cells.findIndex(x=>x.row===r&&x.col===c); const nxt=state.active.cells[idx+1]; if(nxt) focusCell(nxt.row,nxt.col); } });
      input.addEventListener('keydown',(e)=>{
        const t=e.target; const r=Number(t.dataset.row), c=Number(t.dataset.col);
        if(e.key==='Tab'){ e.preventDefault(); state.active.dir= state.active.dir==='across'?'down':'across'; highlight(r,c,state.active.dir); return; }
        if(e.key==='Backspace' && !t.value){ const idx=state.active.cells.findIndex(x=>x.row===r&&x.col===c); const prev=state.active.cells[idx-1]; if(prev){ e.preventDefault(); focusCell(prev.row,prev.col);} }
        if(e.key==='ArrowUp'){ e.preventDefault(); focusCell(r-1,c);} if(e.key==='ArrowDown'){ e.preventDefault(); focusCell(r+1,c);} if(e.key==='ArrowLeft'){ e.preventDefault(); focusCell(r,c-1);} if(e.key==='ArrowRight'){ e.preventDefault(); focusCell(r,c+1);} 
      });
    });
    resizeToFit();
  }

  function buildClues(){ const across=state.solution.placed.filter(p=>p.direction==='across').sort((a,b)=>a.number-b.number); const down=state.solution.placed.filter(p=>p.direction==='down').sort((a,b)=>a.number-b.number);
    function render(ul,list){ ul.innerHTML=''; for(const p of list){ const li=document.createElement('li'); li.textContent=`${p.number}. ${p.clue} (${p.answer.length})`; li.addEventListener('click',()=>{ focusCell(p.row,p.col); highlight(p.row,p.col,p.direction); }); ul.appendChild(li);} }
    render(el.cluesAcross, across); render(el.cluesDown, down);
  }

  function updateStats(){
    const n=state.solution.grid.length; if(!n){ el.statsText.textContent=''; return; }
    let blocks=0; for(let r=0;r<n;r++) for(let c=0;c<n;c++){ if(state.solution.grid[r][c]===null) blocks++; }
    const words = state.solution.placed.length;
    el.statsText.textContent = `Blocks: ${blocks} | Words: ${words}`;
  }

  

  function resizeToFit(){
    const n = state.solution.grid.length; if(!n) return;
    const wrap = document.querySelector('.grid-wrap'); if(!wrap || !el.grid) return;
    const W = Math.max(0, wrap.clientWidth);
    const H = Math.max(0, wrap.clientHeight);
    const styles = getComputedStyle(el.grid);
    const containerBorder = (parseFloat(styles.borderTopWidth)||0) + (parseFloat(styles.borderBottomWidth)||0);
    // Account for padding on mobile
    const isMobile = window.innerWidth < 640;
    const padding = isMobile ? 24 : 0;
    const perCellW = (W - containerBorder - padding - 2*n) / n;
    const perCellH = (H - containerBorder - padding - 2*n) / n;
    let cell = Math.floor(Math.min(perCellW, perCellH));
    cell = isFinite(cell) && cell > 0 ? cell : 12;
    // Minimum cell size for mobile touch targets (32px), desktop (8px)
    const minSize = isMobile ? 32 : 8;
    const maxSize = isMobile ? 48 : 64;
    const clamped = Math.max(minSize, Math.min(cell, maxSize));
    el.grid.style.setProperty('--cell', `${clamped}px`);
  }

  function generate(){ 
    const categorySelect = document.getElementById('categorySelect');
    const selectedCategory = categorySelect ? categorySelect.value : 'default';
    const entries = (window.CrosswordData && window.CrosswordData[selectedCategory]) ? window.CrosswordData[selectedCategory] : [];
    
    if(!entries.length){ el.grid.innerHTML = '<div class="placeholder">No data loaded.</div>'; return; }
    const size = Math.max(11, Math.min(17, Math.ceil(entries.reduce((m,e)=>Math.max(m,(e.answer||'').length),0)+6)));
    const {grid,placed} = window.Crossword.generate(entries, size);
    state.solution.grid=grid; state.solution.placed=placed;
    initUser(); renderGrid(); buildClues(); updateStats(); resizeToFit();
    if (placed.length){ focusCell(placed[0].row, placed[0].col); highlight(placed[0].row, placed[0].col, placed[0].direction); }
    startTimer();
  }

  function firstEmptyCell(){
    for(const p of state.solution.placed){ for(const cell of p.cells){ const v=state.user[cell.row][cell.col]; if(!v){ return {row:cell.row, col:cell.col}; } } }
    return null;
  }

  function ensureActive(){
    if(state.active.cells && state.active.cells.length) return;
    if(state.lastFocused){ state.active={ cells:wordPath(state.lastFocused.row,state.lastFocused.col,state.active.dir), dir:state.active.dir }; return; }
    if(state.solution.placed.length){ const p=state.solution.placed[0]; state.active={ cells:p.cells.slice(), dir:p.direction }; }
  }

  function revealSquare(){
    const active=document.activeElement; if(active && active.tagName==='INPUT'){ const r=Number(active.dataset.row), c=Number(active.dataset.col); const sol=state.solution.grid[r][c]; if(sol){ active.value=sol.toUpperCase(); state.user[r][c]=active.value; return; } }
    if(state.lastFocused){ const r=state.lastFocused.row, c=state.lastFocused.col; const sol=state.solution.grid[r][c]; const input=el.grid.querySelector(`input[data-row="${r}"][data-col="${c}"]`); if(sol && input){ input.value=sol.toUpperCase(); state.user[r][c]=input.value; return; } }
    const cell=firstEmptyCell(); if(cell){ const sol=state.solution.grid[cell.row][cell.col]; const input=el.grid.querySelector(`input[data-row="${cell.row}"][data-col="${cell.col}"]`); if(sol && input){ input.value=sol.toUpperCase(); state.user[cell.row][cell.col]=input.value; focusCell(cell.row,cell.col); } }
  }

  function revealWord(){ ensureActive(); if(!state.active.cells.length) return; for(const cell of state.active.cells){ const sol=state.solution.grid[cell.row][cell.col]; const input=el.grid.querySelector(`input[data-row="${cell.row}"][data-col="${cell.col}"]`); if(sol && input){ input.value=sol.toUpperCase(); state.user[cell.row][cell.col]=input.value; } } }

  function solveAll(){
    const n=state.solution.grid.length; if(!n) return;
    for(let r=0;r<n;r++) for(let c=0;c<n;c++){
      const sol=state.solution.grid[r][c]; if(sol){ const input=el.grid.querySelector(`input[data-row="${r}"][data-col="${c}"]`); if(input){ input.value=sol.toUpperCase(); state.user[r][c]=input.value; } }
    }
    stopTimer();
    // When using Fill All, simulate a winning time (4 minutes) to show prize
    const simulatedTimeInMinutes = 4;
    updateCompletionModal(simulatedTimeInMinutes);
    el.modal.classList.remove('hidden');
  }

  function clearAll(){ el.grid.querySelectorAll('input[type="text"]').forEach(i=>i.value=''); for(let r=0;r<state.user.length;r++) for(let c=0;c<state.user[r].length;c++) if(state.user[r][c]!==null) state.user[r][c]=''; }
  const PRIZES = [
    "🎨 Personalised Home Décor Moodboard",
    "🏠 'My Dream Home' AI Blueprint Generator",
    "💰 Property Investment Starter Kit (Digital Pack + ₦50k Voucher)",
    "👨‍🏫 1-on-1 Real Estate Coaching Session",
    "📸 Free Photoshoot of Your New Home"
  ];

  function getRandomPrize() {
    return PRIZES[Math.floor(Math.random() * PRIZES.length)];
  }

  function updateCompletionModal(timeInMinutes) {
    const prizeText = document.getElementById('prizeText');
    const contactInfo = document.getElementById('contactInfo');
    const completionTitle = document.getElementById('completionTitle');
    
    if (timeInMinutes <= 5) {
      const prize = getRandomPrize();
      completionTitle.textContent = "🎉 Congratulations! You've Won!";
      prizeText.innerHTML = `
        <div class="prize-won">
          <h5>Your Prize:</h5>
          <p class="prize-name">${prize}</p>
        </div>
      `;
      contactInfo.innerHTML = `
        <div class="claim-info">
          <h6>Claim Your Prize:</h6>
          <p>Chat with any of our representatives:</p>
          <div class="contact-details">
            <div class="contact-person">
              <strong>Miss Smart</strong><br>
              <a href="https://wa.me/2349165226722" target="_blank" class="whatsapp-link">
                📱 +234 916 522 6722
              </a>
            </div>
            <div class="contact-person">
              <strong>Olayinka Okunola</strong><br>
              <a href="https://wa.me/2348128532038" target="_blank" class="whatsapp-link">
                📱 +234 812 853 2038
              </a>
            </div>
          </div>
        </div>
      `;
    } else {
      completionTitle.textContent = "👏 Well Done!";
      prizeText.innerHTML = `
        <div class="no-prize-message">
          <p>Complete the puzzle within 5 minutes to win amazing prizes!</p>
          <button onclick="location.reload()" class="btn btn-primary">Try Again</button>
        </div>
      `;
      contactInfo.innerHTML = '';
    }
  }

  function check(){ 
    const res=window.Crossword.check(state.solution.grid,state.user); 
    el.grid.querySelectorAll('.cw-cell').forEach(w=>w.classList.remove('error')); 
    for(const wrong of res.incorrectCells){ 
      const i=el.grid.querySelector(`input[data-row="${wrong.row}"][data-col="${wrong.col}"]`); 
      if(i) i.parentElement.classList.add('error'); 
    }
    if(res.isComplete && res.isCorrect){ 
      stopTimer(); 
      const timeInMinutes = (Date.now() - state.startTs) / 60000;
      updateCompletionModal(timeInMinutes);
      el.modal.classList.remove('hidden'); 
    }
  }

  function showWelcomeModal() {
    const welcomeModal = document.getElementById('welcomeModal');
    const startPlayingBtn = document.getElementById('startPlayingBtn');
    
    if (welcomeModal && startPlayingBtn) {
      startPlayingBtn.addEventListener('click', () => {
        welcomeModal.classList.add('hidden');
        generate(); // Start a new game automatically
      });
    }
  }

  function bind(){ 
    el.newBtn.addEventListener('click', generate); 
    el.revealSquareBtn.addEventListener('click', revealSquare); 
    el.revealWordBtn.addEventListener('click', revealWord); 
    el.solveBtn.addEventListener('click', solveAll); 
    el.clearBtn.addEventListener('click', clearAll); 
    el.checkBtn.addEventListener('click', check); 
    el.closeModalBtn.addEventListener('click', ()=>el.modal.classList.add('hidden')); 
  }

  function init(){ 
    setYear(); 
    bind(); 
    resizeToFit(); 
    showWelcomeModal(); // Show welcome modal on load
  }
  
  window.addEventListener('resize', resizeToFit);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded', init); else init();
})(); 