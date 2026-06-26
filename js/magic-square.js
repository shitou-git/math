import { shuffleArray, startTimer, stopTimer } from './utils.js';

let magicDifficulty = 'easy';
let magicSolution = [];
let magicPuzzle = [];
let magicGridSize = 3;
let magicSelectedCell = null;
let magicMinNum = 1;
let magicMaxNum = 9;
let magicStartTime = 0;

const magicCountdownConfig = {
    easy: 2,
    medium: 3,
    hard: 5
};

const magicDifficultyConfig = {
    easy: { size: 3, holes: 4 },
    medium: { size: 3, holes: 5 },
    hard: { size: 3, holes: 6 }
};

const magicTemplates = [
    [[8,1,6],[3,5,7],[4,9,2]],
    [[6,1,8],[7,5,3],[2,9,4]],
    [[2,9,4],[7,5,3],[6,1,8]],
    [[4,9,2],[3,5,7],[8,1,6]],
    [[6,7,2],[1,5,9],[8,3,4]],
    [[2,7,6],[9,5,1],[4,3,8]],
    [[4,3,8],[9,5,1],[2,7,6]],
    [[8,3,4],[1,5,9],[6,7,2]]
];

function generateMagicSquare(size) {
    const idx = Math.floor(Math.random() * magicTemplates.length);
    const template = magicTemplates[idx];
    
    let offset;
    if (magicDifficulty === 'easy') {
        offset = Math.floor(Math.random() * 8) + 1;
    } else if (magicDifficulty === 'medium') {
        offset = Math.floor(Math.random() * 15) + 1;
    } else {
        offset = Math.floor(Math.random() * 30) + 1;
    }
    
    const magicSquare = template.map(row => row.map(num => num + offset));
    magicMinNum = Math.min(...magicSquare.flat());
    magicMaxNum = Math.max(...magicSquare.flat());
    return magicSquare;
}

function createMagicPuzzle(grid, holes) {
    const puzzle = grid.map(row => [...row]);
    const positions = [];
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[0].length; j++) {
            positions.push([i, j]);
        }
    }
    const shuffledPositions = shuffleArray(positions);
    for (let i = 0; i < holes; i++) {
        const [row, col] = shuffledPositions[i];
        puzzle[row][col] = 0;
    }
    return puzzle;
}

function renderMagicNumPad() {
    const padDiv = document.getElementById('magicNumPad');
    padDiv.innerHTML = '';
    
    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.onclick = () => selectMagicNumber(i);
        padDiv.appendChild(btn);
    }
    
    const zeroBtn = document.createElement('button');
    zeroBtn.className = 'num-btn';
    zeroBtn.textContent = 0;
    zeroBtn.onclick = () => selectMagicNumber(0);
    padDiv.appendChild(zeroBtn);
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'num-btn clear-btn';
    clearBtn.textContent = '×';
    clearBtn.onclick = () => clearMagicCell();
    padDiv.appendChild(clearBtn);
}

function selectMagicCell(cell) {
    hideMagicResult();
    document.querySelectorAll('.magic-cell').forEach(c => c.classList.remove('selected'));
    cell.classList.add('selected');
    magicSelectedCell = cell;
}

function selectMagicNumber(num) {
    if (!magicSelectedCell || magicSelectedCell.classList.contains('readonly')) return;
    hideMagicResult();
    const currentValue = magicSelectedCell.textContent || '';
    magicSelectedCell.textContent = currentValue + num;
}

function clearMagicCell() {
    if (!magicSelectedCell || magicSelectedCell.classList.contains('readonly')) return;
    hideMagicResult();
    magicSelectedCell.textContent = '';
}

function renderMagicGrid() {
    const gridDiv = document.getElementById('magicGrid');
    const config = magicDifficultyConfig[magicDifficulty];
    magicGridSize = config.size;
    gridDiv.className = `magic-grid grid-${magicGridSize}`;
    gridDiv.innerHTML = '';
    
    magicSolution = generateMagicSquare(magicGridSize);
    magicPuzzle = createMagicPuzzle(magicSolution, config.holes);
    
    for (let i = 0; i < magicGridSize; i++) {
        for (let j = 0; j < magicGridSize; j++) {
            const cell = document.createElement('div');
            cell.className = 'magic-cell';
            cell.dataset.row = i;
            cell.dataset.col = j;
            
            if (magicPuzzle[i][j] !== 0) {
                cell.textContent = magicPuzzle[i][j];
                cell.classList.add('readonly');
            } else {
                cell.classList.add('input-cell');
                cell.onclick = () => selectMagicCell(cell);
            }
            gridDiv.appendChild(cell);
        }
    }
    
    renderMagicNumPad();
}

function showMagicSolution() {
    const elapsedMinutes = magicStartTime ? (Date.now() - magicStartTime) / 60000 : 0;
    const requiredMinutes = magicCountdownConfig[magicDifficulty] || 2;
    if (elapsedMinutes < requiredMinutes) {
        const remaining = Math.ceil(requiredMinutes - elapsedMinutes);
        const resultPanel = document.getElementById('magicResult');
        resultPanel.classList.remove('show', 'success');
        resultPanel.classList.add('show', 'error');
        resultPanel.querySelector('h3').textContent = '倒计时还没结束';
        resultPanel.querySelector('p').textContent = `还剩 ${remaining} 分钟才能显示答案`;
        return;
    }
    if (!magicSolution || magicSolution.length === 0) {
        const resultPanel = document.getElementById('magicResult');
        resultPanel.classList.remove('show', 'success');
        resultPanel.classList.add('show', 'error');
        resultPanel.querySelector('h3').textContent = '请先开始游戏';
        resultPanel.querySelector('p').textContent = '请点击重新开始按钮开始游戏';
        return;
    }
    const cells = document.querySelectorAll('.magic-cell');
    cells.forEach(cell => {
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        if (magicSolution[row] && magicSolution[row][col] !== undefined) {
            cell.textContent = magicSolution[row][col];
            cell.classList.remove('input-cell');
            cell.classList.add('readonly');
        }
    });
}

function checkMagicAnswer() {
    let allCorrect = true;
    let hasEmpty = false;
    const cells = document.querySelectorAll('.magic-cell');
    
    cells.forEach(cell => {
        cell.classList.remove('correct', 'error');
        if (cell.classList.contains('readonly')) return;
        
        const row = parseInt(cell.dataset.row);
        const col = parseInt(cell.dataset.col);
        const value = parseInt(cell.textContent);
        
        if (!value) {
            hasEmpty = true;
            return;
        }
        
        if (value === magicSolution[row][col]) {
            cell.classList.add('correct');
        } else {
            cell.classList.add('error');
            allCorrect = false;
        }
    });
    
    const resultPanel = document.getElementById('magicResult');
    resultPanel.classList.remove('show', 'success', 'error');
    
    if (hasEmpty) {
        resultPanel.classList.add('show', 'error');
        resultPanel.querySelector('h3').textContent = '请先填写完整';
        resultPanel.querySelector('p').textContent = '填写所有空白处的数字后再检查';
    } else if (allCorrect) {
        resultPanel.classList.add('show', 'success');
        const elapsedSeconds = Math.floor((Date.now() - magicStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        resultPanel.querySelector('h3').textContent = '🎉 太棒了！全部正确！';
        resultPanel.querySelector('p').textContent = `你用了 ${timeStr} 完成了幻方！`;
        stopTimer();
    } else {
        resultPanel.classList.add('show', 'error');
        resultPanel.querySelector('h3').textContent = '有一些错误';
        resultPanel.querySelector('p').textContent = '检查红色标记的格子';
    }
}

function resetMagicGame() {
    document.getElementById('magicResult').classList.remove('show');
    magicSelectedCell = null;
    magicStartTime = Date.now();
    renderMagicGrid();
    startTimer();
}

function hideMagicResult() {
    const resultPanel = document.getElementById('magicResult');
    if (resultPanel) {
        resultPanel.classList.remove('show', 'success', 'error');
    }
}

document.querySelectorAll('#magicPage .diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#magicPage .diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        magicDifficulty = btn.dataset.level;
        resetMagicGame();
    });
});

export { resetMagicGame, showMagicSolution, checkMagicAnswer };
