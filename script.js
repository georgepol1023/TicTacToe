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
themeEl.addEventListener('change', e=>applyTheme(e.target.value));
applyTheme('dark');

// Tic Tac Toe logic (all JS from previous script)
