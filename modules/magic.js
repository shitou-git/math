const style = `
    .magic-grid {
        display: grid;
        gap: 3px;
        background: #333;
        padding: 3px;
        border-radius: 10px;
        margin: 0 auto;
    }
    
    .magic-grid.grid-3 { grid-template-columns: repeat(3, 1fr); max-width: 280px; }
    .magic-grid.grid-4 { grid-template-columns: repeat(4, 1fr); max-width: 320px; }
    .magic-grid.grid-5 { grid-template-columns: repeat(5, 1fr); max-width: 360px; }
    
    .magic-cell {
        background: #fff;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 24px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        border-radius: 5px;
        transition: all 0.2s;
    }
    
    .magic-cell.selected { background: #e3f2fd; transform: scale(1.05); }
    .magic-cell.fixed { color: #333; }
    .magic-cell.editable { color: #1565c0; }
    
    .magic-num-pad {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        gap: 8px;
        max-width: 300px;
        margin: 20px auto;
    }
    
    .magic-num-btn {
        padding: 12px;
        font-size: 18px;
        font-weight: bold;
        border: none;
        border-radius: 8px;
        background: #fff;
        cursor: pointer;
        box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    
    .magic-num-btn:hover { background: #e3f2fd; }
    .magic-num-btn:active { transform: scale(0.95); }
    .magic-num-btn.used { opacity: 0.4; pointer-events: none; }
    
    .difficulty-selector {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .diff-btn {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        background: rgba(255,255,255,0.3);
        color: white;
        transition: all 0.2s;
    }
    
    .diff-btn.active {
        background: white;
        color: #667eea;
    }
    
    .result-panel {
        text-align: center;
        margin-top: 20px;
        padding: 15px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        color: white;
    }
    
    .header { text-align: center; color: white; margin-bottom: 20px; }
    .header h1 { font-size: 32px; margin-bottom: 5px; }
    .header p { opacity: 0.8; }
`;

const html = `
    <div class="header">
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
            <button class="action-btn" onclick="magic.resetMagicGame()">新游戏</button>
            <button class="action-btn solve" onclick="magic.showMagicSolution()">显示答案</button>
            <button class="action-btn check" onclick="magic.checkMagicAnswer()">检查答案</button>
        </div>
        <div class="game-rules">
            <h4>🎯 玩法规则</h4>
            <p>在空格中填入数字，使每行、每列和对角线上的三个数字之和都相等（幻和）。</p>
        </div>
    </div>
`;

class MagicSquare {
    constructor() {
        this.level = 'easy';
        this.size = 3;
        this.grid = [];
        this.solution = [];
        this.selectedCell = null;
        this.usedNums = new Set();
        
        this.injectStyle();
        this.render();
        this.bindEvents();
    }
    
    injectStyle() {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        document.head.appendChild(styleEl);
    }
    
    render() {
        const container = document.getElementById('magic-container');
        if (container) {
            container.innerHTML = html;
            this.initGame();
        }
    }
    
    initGame() {
        const sizes = { easy: 3, medium: 4, hard: 5 };
        this.size = sizes[this.level] || 3;
        
        this.solution = this.generateMagicSquare(this.size);
        this.grid = JSON.parse(JSON.stringify(this.solution));
        
        const removeCount = { easy: 4, medium: 8, hard: 12 }[this.level] || 4;
        this.usedNums = new Set();
        
        const positions = [];
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                positions.push([i, j]);
            }
        }
        
        for (let i = 0; i < removeCount; i++) {
            const idx = Math.floor(Math.random() * positions.length);
            const [row, col] = positions.splice(idx, 1)[0];
            this.grid[row][col] = 0;
        }
        
        this.renderGrid();
        this.renderNumPad();
    }
    
    generateMagicSquare(n) {
        const grid = Array(n).fill(null).map(() => Array(n).fill(0));
        
        if (n % 2 === 1) {
            return this.generateOddMagicSquare(n);
        } else if (n % 4 === 0) {
            return this.generateDoublyEvenMagicSquare(n);
        } else {
            return this.generateSinglyEvenMagicSquare(n);
        }
    }
    
    generateOddMagicSquare(n) {
        const grid = Array(n).fill(null).map(() => Array(n).fill(0));
        let num = 1;
        let row = 0;
        let col = Math.floor(n / 2);
        
        while (num <= n * n) {
            grid[row][col] = num++;
            const newRow = (row - 1 + n) % n;
            const newCol = (col + 1) % n;
            
            if (grid[newRow][newCol] === 0) {
                row = newRow;
                col = newCol;
            } else {
                row = (row + 1) % n;
            }
        }
        
        return grid;
    }
    
    generateDoublyEvenMagicSquare(n) {
        const grid = Array(n).fill(null).map(() => Array(n).fill(0));
        let num = 1;
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                grid[i][j] = num++;
            }
        }
        
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                if ((i < n / 4 || i >= 3 * n / 4) && (j < n / 4 || j >= 3 * n / 4)) {
                    grid[i][j] = n * n + 1 - grid[i][j];
                } else if ((i >= n / 4 && i < 3 * n / 4) && (j >= n / 4 && j < 3 * n / 4)) {
                    grid[i][j] = n * n + 1 - grid[i][j];
                }
            }
        }
        
        return grid;
    }
    
    generateSinglyEvenMagicSquare(n) {
        const m = n / 2;
        const A = this.generateOddMagicSquare(m);
        const B = this.generateOddMagicSquare(m);
        const C = this.generateOddMagicSquare(m);
        const D = this.generateOddMagicSquare(m);
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                A[i][j] += 0 * m * m;
                B[i][j] += 1 * m * m;
                C[i][j] += 2 * m * m;
                D[i][j] += 3 * m * m;
            }
        }
        
        const grid = Array(n).fill(null).map(() => Array(n).fill(0));
        
        for (let i = 0; i < m; i++) {
            for (let j = 0; j < m; j++) {
                grid[i][j] = A[i][j];
                grid[i][j + m] = B[i][j];
                grid[i + m][j] = C[i][j];
                grid[i + m][j + m] = D[i][j];
            }
        }
        
        const k = (n / 2 - 1) / 2;
        for (let i = 0; i < m; i++) {
            for (let j = 0; j <= k; j++) {
                [grid[i][j], grid[i + m][j]] = [grid[i + m][j], grid[i][j]];
            }
        }
        
        for (let i = 0; i < m; i++) {
            for (let j = n - k + 1; j < n; j++) {
                [grid[i][j], grid[i + m][j]] = [grid[i + m][j], grid[i][j]];
            }
        }
        
        [grid[m / 2][0], grid[m + m / 2][0]] = [grid[m + m / 2][0], grid[m / 2][0]];
        [grid[m / 2][m], grid[m + m / 2][m]] = [grid[m + m / 2][m], grid[m / 2][m]];
        
        return grid;
    }
    
    renderGrid() {
        const gridEl = document.getElementById('magicGrid');
        if (!gridEl) return;
        
        gridEl.innerHTML = '';
        gridEl.className = `magic-grid grid-${this.size}`;
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const cell = document.createElement('div');
                cell.className = 'magic-cell';
                
                if (this.grid[i][j] !== 0) {
                    cell.textContent = this.grid[i][j];
                    cell.classList.add('fixed');
                    this.usedNums.add(this.grid[i][j]);
                } else {
                    cell.classList.add('editable');
                }
                
                cell.dataset.row = i;
                cell.dataset.col = j;
                cell.addEventListener('click', () => this.selectCell(i, j));
                
                gridEl.appendChild(cell);
            }
        }
    }
    
    renderNumPad() {
        const pad = document.getElementById('magicNumPad');
        if (!pad) return;
        
        pad.innerHTML = '';
        for (let i = 1; i <= this.size * this.size; i++) {
            const btn = document.createElement('button');
            btn.className = 'magic-num-btn';
            if (this.usedNums.has(i)) btn.classList.add('used');
            btn.textContent = i;
            btn.addEventListener('click', () => this.inputNumber(i));
            pad.appendChild(btn);
        }
    }
    
    selectCell(row, col) {
        if (this.grid[row][col] !== 0) return;
        
        document.querySelectorAll('.magic-cell').forEach(cell => {
            cell.classList.remove('selected');
        });
        
        this.selectedCell = { row, col };
        
        const selectedEl = document.querySelector(`.magic-cell[data-row="${row}"][data-col="${col}"]`);
        if (selectedEl) selectedEl.classList.add('selected');
    }
    
    inputNumber(num) {
        if (!this.selectedCell) return;
        if (this.usedNums.has(num)) return;
        
        const { row, col } = this.selectedCell;
        if (this.grid[row][col] !== 0) return;
        
        this.grid[row][col] = num;
        this.usedNums.add(num);
        
        const cell = document.querySelector(`.magic-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = num;
            cell.classList.remove('selected');
        }
        
        const btns = document.querySelectorAll('.magic-num-btn');
        btns.forEach(btn => {
            if (parseInt(btn.textContent) === num) {
                btn.classList.add('used');
            }
        });
        
        this.selectedCell = null;
        this.checkWin();
    }
    
    checkWin() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] !== this.solution[i][j]) return;
            }
        }
        
        const msg = document.getElementById('magicResult');
        if (msg) {
            msg.innerHTML = '<h3>🎉 恭喜完成！</h3><p>幻和：' + (this.size * (this.size * this.size + 1) / 2) + '</p>';
        }
    }
    
    resetMagicGame() {
        this.selectedCell = null;
        this.initGame();
        const msg = document.getElementById('magicResult');
        if (msg) msg.innerHTML = '<h3></h3><p></p>';
    }
    
    showMagicSolution() {
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                this.grid[i][j] = this.solution[i][j];
                const cell = document.querySelector(`.magic-cell[data-row="${i}"][data-col="${j}"]`);
                if (cell) {
                    cell.textContent = this.solution[i][j];
                    cell.classList.remove('editable');
                }
            }
        }
        
        const btns = document.querySelectorAll('.magic-num-btn');
        btns.forEach(btn => btn.classList.add('used'));
    }
    
    checkMagicAnswer() {
        let hasError = false;
        let filled = true;
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                if (this.grid[i][j] === 0) {
                    filled = false;
                } else if (this.grid[i][j] !== this.solution[i][j]) {
                    hasError = true;
                }
            }
        }
        
        const msg = document.getElementById('magicResult');
        if (msg) {
            if (!filled) {
                msg.innerHTML = '<h3>📝 还有空格未填</h3><p>请填完所有格子再检查</p>';
            } else if (hasError) {
                msg.innerHTML = '<h3>❌ 有错误</h3><p>再仔细看看吧！</p>';
            } else {
                msg.innerHTML = '<h3>🎉 全部正确！</h3><p>幻和：' + (this.size * (this.size * this.size + 1) / 2) + '</p>';
            }
        }
    }
    
    bindEvents() {
        setTimeout(() => {
            document.querySelectorAll('.diff-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.level = e.target.dataset.level;
                    this.resetMagicGame();
                });
            });
        }, 100);
    }
}

const magic = new MagicSquare();
window.magic = magic;

export function initMagic() {
    magic.resetMagicGame();
}