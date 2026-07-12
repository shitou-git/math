// 数独游戏 ES Module
// 从 index.html 提取：
//   CSS  - 第1691-2102行（数独游戏样式）
//   HTML - 第2458-2498行（数独游戏页面）
//   JS   - 第4369-4807行（数独游戏全部函数）

// ===================== 状态 =====================
let sudokuCurrentSize = 4;
let sudokuCurrentDifficulty = 'easy';
let sudokuSolution = [];
let sudokuPuzzle = [];
let sudokuSelectedCell = null;
let sudokuTimerInterval = null;
let sudokuSeconds = 0;
let sudokuSolveTimerInterval = null;
let sudokuSolveRemainingSeconds = 0;

const sudokuSolveTimeConfig = {
    4: 120,
    6: 240,
    9: 300
};

const sudokuDifficultyConfig = {
    4: {
        easy: 10,
        medium: 8,
        hard: 6
    },
    6: {
        easy: 20,
        medium: 16,
        hard: 12
    },
    9: {
        easy: 35,
        medium: 28,
        hard: 22
    }
};

// ===================== 数独游戏函数 =====================
function setupSudokuEventListeners() {
    document.querySelectorAll('#sudokuPage .level-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#sudokuPage .level-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sudokuCurrentSize = parseInt(btn.dataset.size);
            generateSudokuGame();
        });
    });

    document.querySelectorAll('#sudokuPage .difficulty-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#sudokuPage .difficulty-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            sudokuCurrentDifficulty = btn.dataset.difficulty;
            generateSudokuGame();
        });
    });

    document.getElementById('sudokuNewGame').addEventListener('click', generateSudokuGame);
    document.getElementById('sudokuCheck').addEventListener('click', checkSudokuAnswer);
    document.getElementById('sudokuSolve').addEventListener('click', showSudokuSolution);
}

function generateSudokuGame() {
    clearSudokuMessage();
    hideSudokuTimer();
    resetSudokuTimer();
    sudokuSolution = generateSudokuSolution(sudokuCurrentSize);
    sudokuPuzzle = createSudokuPuzzle(sudokuSolution, sudokuCurrentSize, sudokuCurrentDifficulty);
    renderSudokuGrid();
    renderSudokuNumberPad();
    startSudokuTimer();
    initSudokuSolveTimer();
}

function generateSudokuSolution(size) {
    const grid = Array(size).fill(null).map(() => Array(size).fill(0));
    solveSudoku(grid, size);
    return grid;
}

function solveSudoku(grid, size) {
    const emptyCell = findEmptyCell(grid);
    if (!emptyCell) return true;
    const [row, col] = emptyCell;
    const numbers = shuffleArray([...Array(size)].map((_, i) => i + 1));

    for (const num of numbers) {
        if (isValidSudokuPlacement(grid, row, col, num, size)) {
            grid[row][col] = num;
            if (solveSudoku(grid, size)) return true;
            grid[row][col] = 0;
        }
    }
    return false;
}

function findEmptyCell(grid) {
    for (let row = 0; row < grid.length; row++) {
        for (let col = 0; col < grid[row].length; col++) {
            if (grid[row][col] === 0) return [row, col];
        }
    }
    return null;
}

function isValidSudokuPlacement(grid, row, col, num, size) {
    if (grid[row].includes(num)) return false;

    for (let r = 0; r < size; r++) {
        if (grid[r][col] === num) return false;
    }

    let boxRowSize, boxColSize;
    if (size === 4) {
        boxRowSize = 2;
        boxColSize = 2;
    } else if (size === 6) {
        boxRowSize = 2;
        boxColSize = 3;
    } else {
        boxRowSize = 3;
        boxColSize = 3;
    }

    const boxRow = Math.floor(row / boxRowSize) * boxRowSize;
    const boxCol = Math.floor(col / boxColSize) * boxColSize;

    for (let r = boxRow; r < boxRow + boxRowSize; r++) {
        for (let c = boxCol; c < boxCol + boxColSize; c++) {
            if (grid[r][c] === num) return false;
        }
    }

    return true;
}

function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

function createSudokuPuzzle(solution, size, difficulty) {
    const puzzle = solution.map(row => [...row]);
    const cellsToRemove = size * size - sudokuDifficultyConfig[size][difficulty];
    const positions = [];

    for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
            positions.push([r, c]);
        }
    }

    const shuffledPositions = shuffleArray(positions);
    for (let i = 0; i < cellsToRemove; i++) {
        const [r, c] = shuffledPositions[i];
        puzzle[r][c] = 0;
    }

    return puzzle;
}

function renderSudokuGrid() {
    const grid = document.getElementById('sudokuGrid');
    grid.innerHTML = '';
    grid.className = `sudoku-grid grid-${sudokuCurrentSize}`;

    for (let r = 0; r < sudokuCurrentSize; r++) {
        for (let c = 0; c < sudokuCurrentSize; c++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = r;
            cell.dataset.col = c;

            if (sudokuPuzzle[r][c] !== 0) {
                cell.textContent = sudokuPuzzle[r][c];
                cell.classList.add('prefilled');
            } else {
                const input = document.createElement('input');
                input.type = 'text';
                input.maxLength = 1;
                input.readOnly = true;
                input.addEventListener('focus', () => {
                    sudokuSelectedCell = { row: r, col: c };
                    cell.classList.add('selected');
                });
                input.addEventListener('blur', () => cell.classList.remove('selected'));
                cell.appendChild(input);
            }

            cell.addEventListener('click', () => {
                if (!cell.classList.contains('prefilled')) {
                    const input = cell.querySelector('input');
                    if (input) input.focus();
                }
            });

            grid.appendChild(cell);
        }
    }
}

function renderSudokuNumberPad() {
    const pad = document.getElementById('sudokuNumberPad');
    pad.innerHTML = '';

    for (let i = 1; i <= sudokuCurrentSize; i++) {
        const btn = document.createElement('button');
        btn.className = 'number-btn';
        btn.textContent = i;
        btn.addEventListener('click', () => handleSudokuNumberClick(i));
        pad.appendChild(btn);
    }

    const clearBtn = document.createElement('button');
    clearBtn.className = 'number-btn';
    clearBtn.textContent = '×';
    clearBtn.addEventListener('click', () => handleSudokuNumberClick(0));
    pad.appendChild(clearBtn);
}

function handleSudokuNumberClick(num) {
    if (!sudokuSelectedCell) return;
    clearSudokuMessage();

    const cell = document.querySelector(`#sudokuGrid .cell[data-row="${sudokuSelectedCell.row}"][data-col="${sudokuSelectedCell.col}"]`);
    if (!cell || cell.classList.contains('prefilled')) return;

    const input = cell.querySelector('input');
    if (input) {
        input.value = num === 0 ? '' : num;
    }
}

function checkSudokuAnswer() {
    let allCorrect = true;
    let hasEmpty = false;

    const userGrid = Array(sudokuCurrentSize).fill(null).map(() => Array(sudokuCurrentSize).fill(0));

    for (let r = 0; r < sudokuCurrentSize; r++) {
        for (let c = 0; c < sudokuCurrentSize; c++) {
            userGrid[r][c] = sudokuPuzzle[r][c];
        }
    }

    for (let r = 0; r < sudokuCurrentSize; r++) {
        for (let c = 0; c < sudokuCurrentSize; c++) {
            const cell = document.querySelector(`#sudokuGrid .cell[data-row="${r}"][data-col="${c}"]`);
            cell.classList.remove('error', 'correct');

            if (sudokuPuzzle[r][c] !== 0) continue;

            const input = cell.querySelector('input');
            const value = input ? parseInt(input.value) : 0;

            if (value === 0 || isNaN(value)) {
                hasEmpty = true;
                continue;
            }

            userGrid[r][c] = value;
        }
    }

    if (hasEmpty) {
        showSudokuMessage('还有空格未填！', 'error');
        return;
    }

    for (let r = 0; r < sudokuCurrentSize; r++) {
        for (let c = 0; c < sudokuCurrentSize; c++) {
            const cell = document.querySelector(`#sudokuGrid .cell[data-row="${r}"][data-col="${c}"]`);

            if (sudokuPuzzle[r][c] !== 0) continue;

            const rowSet = new Set();
            let rowValid = true;
            for (let i = 0; i < sudokuCurrentSize; i++) {
                if (rowSet.has(userGrid[r][i])) {
                    rowValid = false;
                    break;
                }
                rowSet.add(userGrid[r][i]);
            }

            const colSet = new Set();
            let colValid = true;
            for (let i = 0; i < sudokuCurrentSize; i++) {
                if (colSet.has(userGrid[i][c])) {
                    colValid = false;
                    break;
                }
                colSet.add(userGrid[i][c]);
            }

            let boxRowSize, boxColSize;
            if (sudokuCurrentSize === 4) {
                boxRowSize = 2;
                boxColSize = 2;
            } else if (sudokuCurrentSize === 6) {
                boxRowSize = 2;
                boxColSize = 3;
            } else {
                boxRowSize = 3;
                boxColSize = 3;
            }

            const boxRow = Math.floor(r / boxRowSize) * boxRowSize;
            const boxCol = Math.floor(c / boxColSize) * boxColSize;
            const boxSet = new Set();
            let boxValid = true;

            for (let i = boxRow; i < boxRow + boxRowSize; i++) {
                for (let j = boxCol; j < boxCol + boxColSize; j++) {
                    if (boxSet.has(userGrid[i][j])) {
                        boxValid = false;
                        break;
                    }
                    boxSet.add(userGrid[i][j]);
                }
                if (!boxValid) break;
            }

            if (rowValid && colValid && boxValid) {
                cell.classList.add('correct');
            } else {
                cell.classList.add('error');
                allCorrect = false;
            }
        }
    }

    if (allCorrect) {
        stopSudokuTimer();
        showSudokuMessage(`🎉 恭喜你！答案完全正确！\n用时：${formatSudokuTime(sudokuSeconds)}`, 'success');
    } else {
        showSudokuMessage('有一些错误，请检查红色标记的格子', 'error');
    }
}

function showSudokuSolution() {
    if (sudokuSolveRemainingSeconds > 0) {
        const mins = Math.floor(sudokuSolveRemainingSeconds / 60);
        const secs = sudokuSolveRemainingSeconds % 60;
        showSudokuMessage(`还需要等待 ${mins}分${secs}秒才能查看答案！`, 'error');
        return;
    }

    for (let r = 0; r < sudokuCurrentSize; r++) {
        for (let c = 0; c < sudokuCurrentSize; c++) {
            const cell = document.querySelector(`#sudokuGrid .cell[data-row="${r}"][data-col="${c}"]`);
            if (sudokuPuzzle[r][c] === 0) {
                const input = cell.querySelector('input');
                if (input) {
                    input.value = sudokuSolution[r][c];
                    input.disabled = true;
                }
            }
        }
    }
    showSudokuMessage('答案已显示', 'success');
}

function showSudokuMessage(text, type) {
    const message = document.getElementById('sudokuMessage');
    message.textContent = text;
    message.className = `message ${type}`;
}

function clearSudokuMessage() {
    const message = document.getElementById('sudokuMessage');
    message.textContent = '';
    message.className = 'message';
}

function startSudokuTimer() {
    if (sudokuTimerInterval) {
        clearInterval(sudokuTimerInterval);
    }
    sudokuTimerInterval = setInterval(() => {
        sudokuSeconds++;
        updateSudokuTimerDisplay();
    }, 1000);
}

function stopSudokuTimer() {
    if (sudokuTimerInterval) {
        clearInterval(sudokuTimerInterval);
        sudokuTimerInterval = null;
    }
}

function resetSudokuTimer() {
    stopSudokuTimer();
    sudokuSeconds = 0;
    updateSudokuTimerDisplay();
}

function initSudokuSolveTimer() {
    if (sudokuSolveTimerInterval) {
        clearInterval(sudokuSolveTimerInterval);
        sudokuSolveTimerInterval = null;
    }
    sudokuSolveRemainingSeconds = sudokuSolveTimeConfig[sudokuCurrentSize];
    sudokuSolveTimerInterval = setInterval(function() {
        if (sudokuSolveRemainingSeconds > 0) {
            sudokuSolveRemainingSeconds--;
        }
    }, 1000);
}

function hideSudokuTimer() {
    const timerContainer = document.getElementById('sudokuTimerContainer');
    timerContainer.classList.add('hidden');
}

function showSudokuTimer() {
    const timerContainer = document.getElementById('sudokuTimerContainer');
    timerContainer.classList.remove('hidden');
}

function updateSudokuTimerDisplay() {
    const timerDisplay = document.getElementById('sudokuTimer');
    timerDisplay.textContent = formatSudokuTime(sudokuSeconds);
}

function formatSudokuTime(totalSeconds) {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

// ===================== 样式注入 =====================
export function injectSudokuStyle() {
    if (document.getElementById("sudoku-style")) return;
    const style = document.createElement("style");
    style.id = "sudoku-style";
    style.textContent = SUDOKU_CSS;
    document.head.appendChild(style);
}

// ===================== HTML 渲染 =====================
export function renderSudokuHTML() {
    return SUDOKU_HTML;
}

// ===================== 初始化 =====================
export function initSudoku() {
    setupSudokuEventListeners();
    generateSudokuGame();
}

// ===================== CSS 文本 =====================
const SUDOKU_CSS = `
        /* 数独游戏样式 */
        .controls {
            display: flex;
            flex-direction: column;
            gap: 15px;
            margin-bottom: 25px;
        }

        .level-selector, .difficulty-selector {
            display: flex;
            gap: 10px;
            justify-content: center;
            flex-wrap: wrap;
        }

        .level-btn {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .level-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(245, 87, 108, 0.4);
        }

        .level-btn:active:not(.active) {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
        }

        .level-btn.active {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(245, 87, 108, 0.6);
            outline: 3px solid #333;
        }

        .difficulty-btn {
            background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
            color: white;
            padding: 12px 24px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .difficulty-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 172, 254, 0.4);
        }

        .difficulty-btn:active:not(.active) {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(79, 172, 254, 0.3);
        }

        .difficulty-btn.active {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(79, 172, 254, 0.6);
            outline: 3px solid #333;
        }

        .action-buttons {
            display: flex;
            gap: 15px;
            justify-content: center;
            margin-top: 20px;
        }

        .action-btn {
            background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
            color: #333;
            padding: 12px 30px;
            border: none;
            border-radius: 10px;
            font-size: 1rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .action-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(67, 233, 123, 0.4);
        }

        .action-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(67, 233, 123, 0.3);
        }

        .action-btn.check {
            background: linear-gradient(135deg, #fa709a 0%, #fee140 100%);
        }

        .action-btn.check:hover {
            box-shadow: 0 5px 15px rgba(250, 112, 154, 0.4);
        }

        .action-btn.check:active {
            box-shadow: 0 2px 8px rgba(250, 112, 154, 0.3);
        }

        .action-btn.solve {
            background: linear-gradient(135deg, #a8edea 0%, #fed6e3 100%);
        }

        .action-btn.solve:hover {
            box-shadow: 0 5px 15px rgba(168, 237, 234, 0.4);
        }

        .action-btn.solve:active {
            box-shadow: 0 2px 8px rgba(168, 237, 234, 0.3);
        }

        .counter-panel {
            margin: 20px auto 0 auto;
            padding: 16px 24px;
            background: linear-gradient(135deg, #fff9f0 0%, #fff5f8 100%);
            border-radius: 12px;
            border: 1px solid #f0e0d0;
            max-width: 500px;
        }

        .counter-items {
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 20px;
            flex-wrap: wrap;
        }

        .counter-item {
            display: inline-flex;
            align-items: center;
            font-size: 16px;
            font-weight: 600;
            padding: 6px 14px;
            border-radius: 8px;
            background: #fff;
        }

        .counter-item.correct {
            color: #2a9d8f;
            border: 1px solid #a8edea;
        }

        .counter-item.wrong {
            color: #e76f51;
            border: 1px solid #fed6e3;
        }

        .counter-label {
            font-size: 14px;
            margin-right: 4px;
            color: #666;
            font-weight: 500;
        }

        .counter-reset-btn {
            padding: 8px 16px;
            border-radius: 8px;
            border: 1px solid #ddd;
            background: #fff;
            font-size: 14px;
            cursor: pointer;
            color: #555;
            transition: all 0.2s;
        }

        .counter-reset-btn:hover {
            background: #f8f8f8;
            border-color: #bbb;
            box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
        }

        .counter-reset-btn:active {
            transform: scale(0.97);
        }

        .game-wrapper {
            display: flex;
            justify-content: center;
            margin: 25px 0;
            overflow-x: auto;
            -webkit-overflow-scrolling: touch;
        }

        .sudoku-grid {
            display: inline-grid;
            gap: 0;
            border: 5px solid #1a1a1a;
            border-radius: 10px;
            overflow: hidden;
        }

        .sudoku-grid .cell {
            border: 1px solid #ddd;
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 1.5rem;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.2s ease;
            background: white;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .sudoku-grid .cell input {
            width: 100%;
            height: 100%;
            border: none;
            text-align: center;
            font-size: inherit;
            font-weight: inherit;
            outline: none;
            background: transparent;
            -webkit-user-select: none;
            user-select: none;
            pointer-events: none;
        }

        .sudoku-grid .cell.prefilled {
            background: #f0f0f0;
            color: #333;
            cursor: default;
        }

        .sudoku-grid .cell:not(.prefilled):hover {
            background: #f5f8ff;
        }

        .sudoku-grid .cell:not(.prefilled):active {
            background: #dbeafe;
        }

        .sudoku-grid .cell.user-filled {
            color: #667eea;
        }

        .sudoku-grid .cell.error {
            background: #ffebee;
            color: #c62828;
        }

        .sudoku-grid .cell.correct {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .sudoku-grid .cell.selected {
            background: #e3f2fd;
            box-shadow: inset 0 0 0 2px #2196f3;
        }

        .grid-4 {
            grid-template-columns: repeat(4, 1fr);
        }

        .grid-6 {
            grid-template-columns: repeat(6, 1fr);
        }

        .grid-9 {
            grid-template-columns: repeat(9, 1fr);
        }

        .grid-4 .cell {
            width: 11vmin;
            height: 11vmin;
            font-size: 1.4rem;
        }

        .grid-6 .cell {
            width: 9vmin;
            height: 9vmin;
            font-size: 1.2rem;
        }

        .grid-9 .cell {
            width: 7vmin;
            height: 7vmin;
            font-size: 1rem;
        }

        /* 数独宫格线加粗（浅绿色） */
        .grid-4 .cell:nth-child(4n+2) {
            border-right: 4px solid #90EE90;
        }
        .grid-4 .cell:nth-child(n+5):nth-child(-n+8) {
            border-bottom: 4px solid #90EE90;
        }

        .grid-6 .cell:nth-child(6n+3) {
            border-right: 4px solid #90EE90;
        }
        .grid-6 .cell:nth-child(n+7):nth-child(-n+12) {
            border-bottom: 4px solid #90EE90;
        }
        .grid-6 .cell:nth-child(n+19):nth-child(-n+24) {
            border-bottom: 4px solid #90EE90;
        }

        .grid-9 .cell:nth-child(9n+3) {
            border-right: 4px solid #90EE90;
        }
        .grid-9 .cell:nth-child(9n+6) {
            border-right: 4px solid #90EE90;
        }
        .grid-9 .cell:nth-child(n+19):nth-child(-n+27) {
            border-bottom: 4px solid #90EE90;
        }
        .grid-9 .cell:nth-child(n+46):nth-child(-n+54) {
            border-bottom: 4px solid #90EE90;
        }

        .number-pad {
            display: flex;
            justify-content: center;
            gap: 6px;
            flex-wrap: wrap;
            margin-top: 20px;
        }

        .number-btn {
            width: 8vmin;
            height: 8vmin;
            max-width: 45px;
            max-height: 45px;
            min-width: 35px;
            min-height: 35px;
            border-radius: 10px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 1.3rem;
            border: none;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .number-btn:hover {
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(102, 126, 234, 0.4);
        }

        .number-btn:active {
            transform: translateY(1px);
            box-shadow: 0 2px 8px rgba(102, 126, 234, 0.4);
        }

        .timer.hidden {
            display: none;
        }

        .timer-label {
            color: #888;
            font-weight: 500;
            margin-right: 5px;
        }

        .message {
            text-align: center;
            margin-top: 20px;
            font-size: 1.2rem;
            font-weight: 600;
            padding: 15px;
            border-radius: 10px;
            white-space: pre-line;
            line-height: 1.6;
        }

        .message.success {
            background: #e8f5e9;
            color: #2e7d32;
        }

        .message.error {
            background: #ffebee;
            color: #c62828;
        }
`;

// ===================== HTML 文本 =====================
const SUDOKU_HTML = `
        <!-- 数独游戏页面 -->
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="gradient-header">
                <h1>📊 数独游戏</h1>
                <p>锻炼逻辑思维的经典数字游戏</p>
            </div>
            <div class="game-container">
                <div class="controls">
                    <div class="level-selector">
                        <button class="level-btn active" data-size="4">初级</button>
                        <button class="level-btn" data-size="6">中级</button>
                        <button class="level-btn" data-size="9">高级</button>
                    </div>
                    <div class="difficulty-selector">
                        <button class="difficulty-btn active" data-difficulty="easy">简单</button>
                        <button class="difficulty-btn" data-difficulty="medium">中等</button>
                        <button class="difficulty-btn" data-difficulty="hard">困难</button>
                    </div>
                    <div class="timer hidden" id="sudokuTimerContainer">
                        <span class="timer-label">用时：</span>
                        <span id="sudokuTimer">00:00</span>
                    </div>
                </div>
                <div class="game-wrapper">
                    <div class="sudoku-grid grid-4" id="sudokuGrid"></div>
                </div>
                <div class="number-pad" id="sudokuNumberPad"></div>
                <div class="action-buttons">
                    <button class="action-btn" id="sudokuNewGame">新游戏</button>
                    <button class="action-btn check" id="sudokuCheck">检查答案</button>
                    <button class="action-btn solve" id="sudokuSolve">显示答案</button>
                </div>
                <div class="message" id="sudokuMessage"></div>
                <div class="game-rules">
                    <h4>🎯 玩法规则</h4>
                    <p>在空格中填入数字 1-9，使每行、每列和每个宫格内的数字都不重复。九宫格：每行、每列、每个3×3小宫格含1-9各一次。四宫格：每行、每列、每个2×2小宫格含1-4各一次。六宫格：每行、每列、每个2×3小宫格含1-6各一次。</p>
                </div>
            </div>
`;
