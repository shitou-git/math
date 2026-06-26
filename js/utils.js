const currentGame = { value: 'home' };
let timerInterval = null;
let startTime = 0;

const STORAGE_KEY_MAP = {
    point24: { correct: 'point24CorrectCount', wrong: 'point24WrongCount' },
    multdiv: { correct: 'multdivCorrectCount', wrong: 'multdivWrongCount' }
};

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

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
    document.getElementById(timerId).textContent = `${minutes}:${seconds}`;
}

function getCounter(game, type) {
    const key = STORAGE_KEY_MAP[game][type];
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : 0;
}

function setCounter(game, type, value) {
    const key = STORAGE_KEY_MAP[game][type];
    localStorage.setItem(key, value);
}

function renderCounter(game) {
    const correctEl = document.getElementById(game + 'CorrectCount');
    const wrongEl = document.getElementById(game + 'WrongCount');
    if (correctEl) correctEl.textContent = getCounter(game, 'correct');
    if (wrongEl) wrongEl.textContent = getCounter(game, 'wrong');
}

function incrementCounter(game, type) {
    const current = getCounter(game, type);
    setCounter(game, type, current + 1);
    renderCounter(game);
}

function confirmResetCounter(game) {
    const labelMap = { point24: '加减法', multdiv: '乘除法' };
    const label = labelMap[game] || '当前页面';
    const ok = confirm(`确定要重置${label}的计数器吗？此操作不可撤销。`);
    if (ok) {
        const confirmAgain = confirm('再次确认：真的要重置计数器吗？');
        if (confirmAgain) {
            setCounter(game, 'correct', 0);
            setCounter(game, 'wrong', 0);
            renderCounter(game);
        }
    }
}

function showGame(game) {
    document.getElementById('homePage').style.display = 'none';
    document.getElementById('magicPage').classList.remove('active');
    document.getElementById('point24Page').classList.remove('active');
    document.getElementById('multdivPage').classList.remove('active');
    document.getElementById('sudokuPage').classList.remove('active');

    const gamePage = document.getElementById(game + 'Page');
    if (gamePage) {
        gamePage.classList.add('active');
    }

    currentGame.value = game;
}

function goHome() {
    document.getElementById('homePage').style.display = 'block';
    document.querySelectorAll('.game-page').forEach(page => {
        page.classList.remove('active');
    });
    stopTimer();
    currentGame.value = 'home';
}

export {
    currentGame,
    timerInterval,
    startTime,
    STORAGE_KEY_MAP,
    shuffleArray,
    startTimer,
    stopTimer,
    updateTimer,
    getCounter,
    setCounter,
    renderCounter,
    incrementCounter,
    confirmResetCounter,
    showGame,
    goHome
};
