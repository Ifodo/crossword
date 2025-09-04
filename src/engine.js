(function(){
  'use strict';

  function sanitize(text){
    return (text||'').toLowerCase().normalize('NFD').replace(/[^a-z]/g,'');
  }

  function makeGrid(n){
    const g = Array.from({length:n},()=>Array.from({length:n},()=>null));
    return g;
  }

  function canPlace(grid, word, r, c, dir){
    const n = grid.length; const dr = dir==='down'?1:0, dc = dir==='across'?1:0;
    const er = r + dr*(word.length-1), ec = c + dc*(word.length-1);
    if (er<0||er>=n||ec<0||ec>=n) return false;
    for (let i=0;i<word.length;i++){
      const rr = r + dr*i, cc = c + dc*i;
      const cell = grid[rr][cc];
      if (cell!==null && cell!==word[i]) return false;
      // adjacency: avoid touching non-cross neighbors
      if (cell===null){
        if (dir==='across'){
          if (rr>0 && grid[rr-1][cc]!==null) return false;
          if (rr<n-1 && grid[rr+1][cc]!==null) return false;
        } else {
          if (cc>0 && grid[rr][cc-1]!==null) return false;
          if (cc<n-1 && grid[rr][cc+1]!==null) return false;
        }
      }
    }
    const br = r-dr, bc = c-dc; if (br>=0&&bc>=0&&br<n&&bc<n&&grid[br][bc]!==null) return false;
    const ar = er+dr, ac = ec+dc; if (ar>=0&&ac>=0&&ar<n&&ac<n&&grid[ar][ac]!==null) return false;
    return true;
  }

  function place(grid, word, r, c, dir){
    const dr = dir==='down'?1:0, dc = dir==='across'?1:0; const cells=[];
    for(let i=0;i<word.length;i++){
      const rr=r+dr*i, cc=c+dc*i; grid[rr][cc]=word[i]; cells.push({row:rr,col:cc});
    }
    return cells;
  }

  function scorePlacement(grid, word, r, c, dir){
    const n=grid.length, dr=dir==='down'?1:0, dc=dir==='across'?1:0; let cross=0, dist=0; const mid=(n-1)/2;
    for(let i=0;i<word.length;i++){
      const rr=r+dr*i, cc=c+dc*i; if(grid[rr][cc]!==null) cross++; dist += Math.abs(rr-mid)+Math.abs(cc-mid);
    }
    return cross*10 - dist;
  }

  function findSpots(grid, word){
    const n=grid.length; const spots=[];
    // try crossings first
    for(let r=0;r<n;r++){
      for(let c=0;c<n;c++){
        const ch=grid[r][c]; if(ch===null) continue;
        for(let k=0;k<word.length;k++){
          if(word[k]!==ch) continue;
          const sc=c-k; if(sc>=0 && sc+word.length-1<n && canPlace(grid,word,r,sc,'across')) spots.push({row:r,col:sc,dir:'across',score:scorePlacement(grid,word,r,sc,'across')});
          const sr=r-k; if(sr>=0 && sr+word.length-1<n && canPlace(grid,word,sr,c,'down')) spots.push({row:sr,col:c,dir:'down',score:scorePlacement(grid,word,sr,c,'down')});
        }
      }
    }
    // fallback anywhere
    if (!spots.length){
      for(let r=0;r<n;r++) for(let c=0;c<n;c++){
        if(canPlace(grid,word,r,c,'across')) spots.push({row:r,col:c,dir:'across',score:scorePlacement(grid,word,r,c,'across')});
        if(canPlace(grid,word,r,c,'down')) spots.push({row:r,col:c,dir:'down',score:scorePlacement(grid,word,r,c,'down')});
      }
    }
    spots.sort((a,b)=>b.score-a.score); return spots;
  }

  function generate(entries, size){
    const words = entries.map((e,i)=>({ id:e.id||`w_${i}`, answer:sanitize(e.answer), clue:e.clue||e.answer })).filter(e=>e.answer.length>1);
    words.sort((a,b)=>b.answer.length-a.answer.length);
    const grid = makeGrid(size);
    const placed=[];

    if (words.length){
      const first=words[0]; const row=Math.floor(size/2); const col=Math.max(0, Math.floor((size-first.answer.length)/2));
      const cells = place(grid, first.answer, row, col, 'across');
      placed.push({ ...first, row, col, direction:'across', cells, number:1 });
    }
    for(let i=1;i<words.length;i++){
      const cur=words[i]; const spots=findSpots(grid,cur.answer); if(!spots.length) continue;
      const best=spots[0]; const cells=place(grid,cur.answer,best.row,best.col,best.dir);
      placed.push({ ...cur, row:best.row, col:best.col, direction:best.dir, cells, number:0 });
    }

    // Numbering
    let num=1; for(const p of placed){ if(p.number===1) continue; const start = p.direction==='across' ? (p.col===0 || grid[p.row][p.col-1]===null) : (p.row===0 || grid[p.row-1][p.col]===null); p.number = start ? ++num : 0; }
    for(const p of placed){ if(!p.number) p.number=++num; }
    return { grid, placed };
  }

  function buildTable(grid, placed){
    const table = document.createElement('table'); table.className='cw-grid';
    const starts=new Map(); for(const p of placed){ starts.set(`${p.row},${p.col}`, p.number); }
    for(let r=0;r<grid.length;r++){
      const tr=document.createElement('tr');
      for(let c=0;c<grid.length;c++){
        const td=document.createElement('td'); const sol=grid[r][c];
        if (sol===null){ const div=document.createElement('div'); div.className='cw-black'; td.appendChild(div); tr.appendChild(td); continue; }
        const wrap=document.createElement('div'); wrap.className='cw-cell';
        const input=document.createElement('input'); input.type='text'; input.maxLength=1; input.dataset.row=String(r); input.dataset.col=String(c); input.autocomplete='off'; input.spellcheck=false; input.setAttribute('aria-label',`Row ${r+1}, Column ${c+1}`);
        wrap.appendChild(input);
        const key=`${r},${c}`; if(starts.has(key)){ const label=document.createElement('div'); label.className='cw-number'; label.textContent=String(starts.get(key)); td.appendChild(label); }
        td.appendChild(wrap); tr.appendChild(td);
      }
      table.appendChild(tr);
    }
    return table;
  }

  function check(grid, user){
    const n=grid.length; const wrong=[]; let complete=true;
    for(let r=0;r<n;r++) for(let c=0;c<n;c++){
      const sol=grid[r][c]; const v=user[r][c]; if(sol===null) continue; if(!v) complete=false; if(v && v.toLowerCase()!==sol) wrong.push({row:r,col:c});
    }
    return { isComplete: complete, isCorrect: complete && wrong.length===0, incorrectCells: wrong };
  }

  window.Crossword = { sanitize, generate, buildTable, check };
})(); 