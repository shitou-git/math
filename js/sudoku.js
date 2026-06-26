import { shuffleArray } from './utils.js';

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

export function initSudoku() {
    setupSudokuEventListeners();
    generateSudokuGame();
}

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
