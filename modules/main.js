// ========== 主入口路由模块（懒加载版） ==========
// 只在用户首次进入某游戏时才动态加载对应模块、注入样式、渲染HTML

let currentGame = 'home';
let timerInterval = null;
let startTime = 0;

// 各游戏模块的缓存：{ mod, inited }
const moduleCache = {
    sudoku: null,
    magic: null,
    arithmetic: null,
    schulte: null,
};

// ========== 通用计时器函数 ==========
function startTimer(timerId) {
    stopTimer();
    startTime = Date.now();
    // 不再更新显示，只在游戏完成时计算用时
    timerInterval = setInterval(() => {}, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimer(timerId) {
    const elapsed = Math.floor((Date.now() - startTime) / 1000);
    const minutes = String(Math.floor(elapsed / 60)).padStart(2, '0');
    const seconds = String(elapsed % 60).padStart(2, '0');
    const el = document.getElementById(timerId);
    if (el) el.textContent = `${minutes}:${seconds}`;
}

// ========== 懒加载游戏模块 ==========
async function ensureGame(game) {
    if (moduleCache[game]) return moduleCache[game].mod;
    let mod;
    if (game === 'sudoku') {
        mod = await import('./sudoku.js');
        mod.injectSudokuStyle();
        document.getElementById('sudokuPage').innerHTML = mod.renderSudokuHTML();
    } else if (game === 'magic') {
        mod = await import('./magic.js');
        mod.injectMagicStyle();
        document.getElementById('magicPage').innerHTML = mod.renderMagicHTML();
    } else if (game === 'arithmetic') {
        mod = await import('./arithmetic.js');
        mod.injectArithmeticStyle();
        document.getElementById('arithmeticPage').innerHTML = mod.renderArithmeticHTML();
    } else if (game === 'schulte') {
        mod = await import('./schulte.js');
        mod.injectSchulteStyle();
        document.getElementById('schultePage').innerHTML = mod.renderSchulteHTML();
    }
    moduleCache[game] = { mod, inited: false };
    return mod;
}

// ========== 页面导航 ==========
async function showGame(game) {
    document.getElementById('homePage').style.display = 'none';
    const pages = ['magicPage', 'arithmeticPage', 'schultePage', 'sudokuPage', 'dcPage', 'aoshuPage', 'siluPage'];
    pages.forEach(id => document.getElementById(id).classList.remove('active'));

    // iframe 页面：直接显示，首次点击时才加载 src
    if (game === 'dc' || game === 'aoshu' || game === 'silu') {
        const pageEl = document.getElementById(game + 'Page');
        const iframe = pageEl.querySelector('iframe');
        if (iframe && !iframe.src) {
            iframe.src = iframe.dataset.src;
        }
        pageEl.classList.add('active');
        currentGame = game;
        return;
    }

    // 游戏页面：懒加载模块
    const pageId = game + 'Page';
    const pageEl = document.getElementById(pageId);
    // 先显示页面（即使内容还在加载，用户也能看到反馈）
    pageEl.classList.add('active');
    currentGame = game;

    const mod = await ensureGame(game);
    // 防止用户在加载期间已切换到其他页面
    if (currentGame !== game) return;

    if (game === 'sudoku') mod.initSudoku();
    else if (game === 'magic') mod.initMagic();
    else if (game === 'arithmetic') mod.initArithmetic();
    else if (game === 'schulte') mod.initSchulte();
}

function goHome() {
    document.getElementById('homePage').style.display = 'block';
    const pages = ['magicPage', 'arithmeticPage', 'schultePage', 'sudokuPage', 'dcPage', 'aoshuPage', 'siluPage'];
    pages.forEach(id => document.getElementById(id).classList.remove('active'));
    stopTimer();
    // 停止舒尔特计时（若已加载）
    if (moduleCache.schulte && moduleCache.schulte.mod.stopSchulteClock) {
        moduleCache.schulte.mod.stopSchulteClock();
    }
    currentGame = 'home';
}

// ========== 挂载到 window ==========
window.showGame = showGame;
window.goHome = goHome;
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.updateTimer = updateTimer;
