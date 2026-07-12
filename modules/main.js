// ========== 主入口路由模块 ==========
import { injectSudokuStyle, renderSudokuHTML, initSudoku } from './sudoku.js';
import { injectMagicStyle, renderMagicHTML, initMagic, resetMagicGame } from './magic.js';
import { injectArithmeticStyle, renderArithmeticHTML, initArithmetic, switchArithmeticMode } from './arithmetic.js';
import { injectSchulteStyle, renderSchulteHTML, initSchulte, stopSchulteClock } from './schulte.js';

// ========== 通用状态 ==========
let currentGame = 'home';
let timerInterval = null;
let startTime = 0;

// ========== 通用计时器函数 ==========
function startTimer(timerId) {
    stopTimer();
    startTime = Date.now();
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

// ========== 注入所有样式 ==========
function injectAllStyles() {
    injectSudokuStyle();
    injectMagicStyle();
    injectArithmeticStyle();
    injectSchulteStyle();
}

// ========== 渲染所有游戏页面 ==========
function renderAllPages() {
    document.getElementById('magicPage').innerHTML = renderMagicHTML();
    document.getElementById('arithmeticPage').innerHTML = renderArithmeticHTML();
    document.getElementById('schultePage').innerHTML = renderSchulteHTML();
    document.getElementById('sudokuPage').innerHTML = renderSudokuHTML();
}

// ========== 页面导航 ==========
function showGame(game) {
    document.getElementById('homePage').style.display = 'none';
    const pages = ['magicPage', 'arithmeticPage', 'schultePage', 'sudokuPage', 'dcPage', 'aoshuPage', 'siluPage'];
    pages.forEach(id => document.getElementById(id).classList.remove('active'));

    if (game === 'sudoku') {
        document.getElementById('sudokuPage').classList.add('active');
        initSudoku();
    } else if (game === 'magic') {
        document.getElementById('magicPage').classList.add('active');
        initMagic();
    } else if (game === 'arithmetic') {
        document.getElementById('arithmeticPage').classList.add('active');
        initArithmetic();
    } else if (game === 'schulte') {
        document.getElementById('schultePage').classList.add('active');
        initSchulte();
    } else if (game === 'dc') {
        document.getElementById('dcPage').classList.add('active');
    } else if (game === 'aoshu') {
        document.getElementById('aoshuPage').classList.add('active');
    } else if (game === 'silu') {
        document.getElementById('siluPage').classList.add('active');
    }
    currentGame = game;
}

function goHome() {
    document.getElementById('homePage').style.display = 'block';
    const pages = ['magicPage', 'arithmeticPage', 'schultePage', 'sudokuPage', 'dcPage', 'aoshuPage', 'siluPage'];
    pages.forEach(id => document.getElementById(id).classList.remove('active'));
    stopTimer();
    stopSchulteClock();
    currentGame = 'home';
}

// ========== 挂载到 window ==========
window.showGame = showGame;
window.goHome = goHome;
window.startTimer = startTimer;
window.stopTimer = stopTimer;
window.updateTimer = updateTimer;

// ========== 初始化 ==========
function init() {
    injectAllStyles();
    renderAllPages();
}

init();
