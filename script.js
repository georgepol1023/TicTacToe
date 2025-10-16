// Theme switching
const themeEl = document.getElementById('theme');
const cardEl = document.querySelector('.card');

const themes = {
  dark: {bg:'linear-gradient(180deg, #071029 0%, #061524 100%)', card:'linear-gradient(to bottom, rgba(11,18,32,0.85), rgba(11,18,32,0.75))', accent:'#7dd3fc'},
  sunset: {bg:'linear-gradient(180deg, #ff7e5f, #feb47b)', card:'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', accent:'#ffdd99'},
  ocean: {bg:'linear-gradient(180deg, #2193b0, #6dd5ed)', card:'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', accent:'#a0e7e5'},
  forest: {bg:'linear-gradient(180deg, #134e4a, #16a34a)', card:'linear-gradient(to bottom, rgba(255,255,255,0.15), rgba(255,255,255,0.05))', accent:'#b7f5d0'}
};

function applyTheme(name){
  const t = themes[name];
  document.body.style.background = t.bg;
  cardEl.style.background = t.card;
  document.documentElement.style.setProperty('--accent', t.accent);
}

themeEl.addEventListener('change', e => applyTheme(e.target.value));
applyTheme('dark');

// --- Tic Tac Toe Logic ---
let board = Array(9).fill(null);
let currentPlayer = 'X';
let isGameOver = false;
let history = [];
let scores = {X:0, O:0, D:0};

const cells = [...document.querySelectorAll('.cell')];
const turnEl = document.getElementById('turn');
const modeEl = document.getElementById('mode');
const aiLevelEl = document.getElementById('ai-level');
const resetBtn = document.getElementById('resetBtn');
const undoBtn = document.getElementById('undoBtn');
const scoreX = document.getElementById('scoreX');
const scoreO = document.getElementById('scoreO');
const scoreD = document.getElementById('scoreD');
const downloadBtn = document.getElementById('downloadBtn');

const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8],
  [0,3,6],[1,4,7],[2,5,8],
  [0,4,8],[2,4,6]
];

// Render board
function render(){
  cells.forEach((c,i) => {
    c.textContent = board[i] || '';
    c.classList.remove('highlight');
  });
  turnEl.textContent = currentPlayer;
}

// Check winner
function checkWinner(bd){
  for(const line of WIN_LINES){
    const [a,b,c] = line;
    if(bd[a] && bd[a] === bd[b] && bd[a] === bd[c]) return {winner: bd[a], line};
  }
  if(bd.every(x => x)) return {winner: 'draw'};
  return null;
}

// Set winner
function setStatusWinner(winner,line){
  isGameOver = true;
  if(winner==='draw'){
    scores.D++;
    scoreD.textContent = scores.D;
    alert("It's a draw!");
  } else {
    scores[winner]++;
    if(winner==='X') scoreX.textContent = scores.X;
    else scoreO.textContent = scores.O;
    if(line) line.forEach(i => cells[i].classList.add('highlight'));
    alert(`${winner} wins!`);
  }
}

// Make a move
function makeMove(i,player){
  if(isGameOver || board[i]) return false;
  board[i] = player;
  history.push({i,player});
  const result = checkWinner(board);
  if(result){
    setStatusWinner(result.winner,result.line||[]);
  } else {
    currentPlayer = (player==='X')?'O':'X';
    if(modeEl.value==='pve' && currentPlayer==='O') setTimeout(aiMove,150);
  }
  render();
  return true;
}

// Undo last move
function undo(){
  if(!history.length || isGameOver) return;
  const last = history.pop();
  board[last.i] = null;
  isGameOver = false;
  currentPlayer = last.player;
  render();
}

// AI move
function aiMove(){
  if(isGameOver) return;
  if(aiLevelEl.value==='random'){
    const empties = board.map((v,i)=>v?null:i).filter(v=>v!==null);
    const idx = empties[Math.floor(Math.random()*empties.length)];
    makeMove(idx,'O');
  } else {
    const move = minimaxDecision(board,'O');
    if(move !== null) makeMove(move,'O');
  }
}

// Minimax AI
function minimaxDecision(bd,player){
  const avail = bd.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(avail.length===9) return 4; // center opening
  let bestVal = -Infinity, bestMove = null;
  for(const idx of avail){
    const copy = bd.slice();
    copy[idx] = player;
    const val = minimax(copy,0,false);
    if(val > bestVal){ bestVal = val; bestMove = idx; }
  }
  return bestMove;
}

function minimax(bd,depth,isMaximizing){
  const res = checkWinner(bd);
  if(res){
    if(res.winner==='X') return -1;
    if(res.winner==='O') return 1;
    if(res.winner==='draw') return 0;
  }
  const avail = bd.map((v,i)=>v?null:i).filter(v=>v!==null);
  if(isMaximizing){
    let best = -Infinity;
    for(const i of avail){ bd[i]='O'; best = Math.max(best,minimax(bd,depth+1,false)); bd[i]=null; }
    return best;
  } else {
    let best = Infinity;
    for(const i of avail){ bd[i]='X'; best = Math.min(best,minimax(bd,depth+1,true)); bd[i]=null; }
    return best;
  }
}

// Event listeners
cells.forEach(c => c.addEventListener('click', e=>{
  const i = Number(e.currentTarget.dataset.index);
  if(modeEl.value==='pve' && currentPlayer==='O') return;
  makeMove(i,currentPlayer);
}));

resetBtn.addEventListener('click', () => {
  board = Array(9).fill(null);
  history = [];
  isGameOver = false;
  currentPlayer = 'X';
  render();
});

undoBtn.addEventListener('click', undo);

modeEl.addEventListener('change', () => {
  board = Array(9).fill(null);
  history = [];
  isGameOver = false;
  currentPlayer = 'X';
  render();
});

// Export board
downloadBtn.addEventListener('click', () => {
  const payload = {board, currentPlayer, scores, history, mode: modeEl.value, ai: aiLevelEl.value, time: new Date().toISOString()};
  const blob = new Blob([JSON.stringify(payload,null,2)],{type:'application/json'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'tic-tac-toe-board.json';
  a.click();
  URL.revokeObjectURL(url);
});

// Initialize
render();
