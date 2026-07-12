// 幻方游戏 ES Module
// 从 index.html 提取：
//   CSS  - 第351-478行（幻方游戏样式）
//   HTML - 第2143-2175行（幻方游戏页面）
//   JS   - 第2611-2855行（幻方游戏全部函数）
//   补充  - hideMagicResult（第2869-2874行）与难度按钮事件绑定（第3185-3192行）

// ===================== 状态 =====================
let magicDifficulty = 'easy';
let magicSolution = [];
let magicPuzzle = [];
let magicGridSize = 3;
let magicSelectedCell = null;
let magicMinNum = 1;
let magicMaxNum = 9;
let magicStartTime = 0;

// 幻方倒计时
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

// ===================== 幻方游戏函数 =====================
function generateMagicSquare(size) {
    const idx = Math.floor(Math.random() * magicTemplates.length);
    const template = magicTemplates[idx];

    // 根据难度设置不同的偏移量范围
    let offset;
    if (magicDifficulty === 'easy') {
        // 简单模式：幻和 <= 39 (原始幻和15 + 3*offset <= 39 => offset <= 8)
        offset = Math.floor(Math.random() * 8) + 1; // 1-8
    } else if (magicDifficulty === 'medium') {
        // 中等模式：幻和 <= 60 (15 + 3*offset <= 60 => offset <= 15)
        offset = Math.floor(Math.random() * 15) + 1; // 1-15
    } else {
        // 困难模式：更大的数字范围
        offset = Math.floor(Math.random() * 30) + 1; // 1-30
    }

    const magicSquare = template.map(row => row.map(num => num + offset));
    magicMinNum = Math.min(...magicSquare.flat());
    magicMaxNum = Math.max(...magicSquare.flat());
    return magicSquare;
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
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
        window.stopTimer();
    } else {
        resultPanel.classList.add('show', 'error');
        resultPanel.querySelector('h3').textContent = '有一些错误';
        resultPanel.querySelector('p').textContent = '检查红色标记的格子';
    }
}

function hideMagicResult() {
    const resultPanel = document.getElementById('magicResult');
    if (resultPanel) {
        resultPanel.classList.remove('show', 'success', 'error');
    }
}

function setupMagicEventListeners() {
    document.querySelectorAll('#magicPage .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#magicPage .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            magicDifficulty = btn.dataset.level;
            resetMagicGame();
        });
    });
}

// ===================== 样式注入 =====================
export function injectMagicStyle() {
    if (document.getElementById('magic-style')) return;
    const style = document.createElement('style');
    style.id = 'magic-style';
    style.textContent = MAGIC_CSS;
    document.head.appendChild(style);
}

// ===================== HTML 渲染 =====================
export function renderMagicHTML() {
    return MAGIC_HTML;
}

// ===================== 初始化 =====================
let magicListenersSetup = false;
export function initMagic() {
    if (!magicListenersSetup) {
        setupMagicEventListeners();
        magicListenersSetup = true;
    }
    resetMagicGame();
}

// ===================== 重置幻方游戏 =====================
export function resetMagicGame() {
    document.getElementById('magicResult').classList.remove('show');
    magicSelectedCell = null;
    magicStartTime = Date.now();
    renderMagicGrid();
    window.startTimer();
}

// ===================== 挂载到 window（供 onclick 调用） =====================
window.selectMagicCell = selectMagicCell;
window.selectMagicNumber = selectMagicNumber;
window.clearMagicCell = clearMagicCell;
window.showMagicSolution = showMagicSolution;
window.checkMagicAnswer = checkMagicAnswer;
window.resetMagicGame = resetMagicGame;

// ===================== CSS 文本 =====================
const MAGIC_CSS = `
        /* 幻方游戏样式 */
        .magic-square-grid {
            display: flex;
            justify-content: center;
            margin: 30px 0 20px 0;
        }

        .magic-grid {
            display: grid;
            gap: 5px;
            background: #1e293b;
            padding: 5px;
            border-radius: 10px;
        }

        .magic-grid.grid-3 {
            grid-template-columns: repeat(3, 1fr);
        }

        .magic-cell {
            width: 90px;
            height: 90px;
            background: white;
            border: none;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            outline: none;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .magic-cell.readonly {
            color: #1e293b;
            background: #f1f5f9;
        }

        .magic-cell.input-cell {
            color: #667eea;
            background: #f0f5ff;
            cursor: pointer;
        }

        .magic-cell.input-cell:hover {
            background: #e0e8ff;
        }

        .magic-cell.input-cell:active {
            background: #dbeafe;
            transform: scale(0.98);
        }

        .magic-cell.selected {
            background: #dbeafe;
            border: 3px solid #667eea;
            transform: scale(1.02);
        }

        .magic-cell.correct {
            background: #dcfce7;
            color: #16a34a;
        }

        .magic-cell.error {
            background: #fee2e2;
            color: #dc2626;
        }

        .magic-num-pad {
            display: flex;
            justify-content: center;
            gap: 10px;
            margin: 20px 0;
            flex-wrap: wrap;
        }

        .num-btn {
            width: 50px;
            height: 50px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 10px;
            font-size: 22px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            -webkit-user-select: none;
            user-select: none;
            touch-action: manipulation;
        }

        .num-btn:hover {
            border-color: #667eea;
            background: #f0f5ff;
        }

        .num-btn:active {
            background: #e0e8ff;
            border-color: #667eea;
            transform: translateY(1px);
        }

        .num-btn.operator {
            font-size: 26px;
            color: #667eea;
        }

        .clear-btn {
            background: #fee2e2;
            border-color: #fecaca;
            color: #dc2626;
        }

        .clear-btn:hover {
            background: #fecaca;
            border-color: #f87171;
        }

        .clear-btn:active {
            background: #fecaca;
            transform: translateY(1px);
        }
`;

// ===================== HTML 文本 =====================
const MAGIC_HTML = `
        <!-- 幻方游戏页面 -->
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="gradient-header">
                <h1>✨ 幻方游戏</h1>
                <p>点击空白格子，再点击下方数字填写</p>
            </div>
            <div class="game-container">
                <div class="difficulty-selector">
                    <button class="diff-btn active" data-level="easy">简单</button>
                    <button class="diff-btn" data-level="medium">中等</button>
                    <button class="diff-btn" data-level="hard">困难</button>
                </div>
                <div class="magic-square-grid">
                    <div id="magicGrid" class="magic-grid grid-3"></div>
                </div>
                <div class="magic-num-pad" id="magicNumPad"></div>
                <div class="result-panel" id="magicResult">
                    <h3></h3>
                    <p></p>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="resetMagicGame()">新游戏</button>
                    <button class="action-btn solve" onclick="showMagicSolution()">显示答案</button>
                    <button class="action-btn check" onclick="checkMagicAnswer()">检查答案</button>
                </div>
                <div class="game-rules">
                    <h4>🎯 玩法规则</h4>
                    <p>在空格中填入数字，使每行、每列和对角线上的三个数字之和都相等（幻和）。</p>
                </div>
            </div>
`;
