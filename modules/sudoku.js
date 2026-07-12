const style = `
    .sudoku-grid {
        display: grid;
        gap: 1px;
        background: #333;
        padding: 2px;
        border-radius: 8px;
        margin: 0 auto;
    }
    
    .sudoku-grid.grid-4 { grid-template-columns: repeat(4, 1fr); max-width: 300px; }
    .sudoku-grid.grid-6 { grid-template-columns: repeat(6, 1fr); max-width: 350px; }
    .sudoku-grid.grid-9 { grid-template-columns: repeat(9, 1fr); max-width: 400px; }
    
    .sudoku-cell {
        background: #fff;
        aspect-ratio: 1;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 20px;
        font-weight: bold;
        cursor: pointer;
        user-select: none;
        transition: background 0.2s;
    }
    
    .sudoku-cell.selected { background: #e3f2fd; }
    .sudoku-cell.highlighted { background: #f3e5f5; }
    .sudoku-cell.same-value { background: #e8f5e9; }
    .sudoku-cell.error { background: #ffebee; color: #c62828; }
    .sudoku-cell.fixed { color: #333; }
    .sudoku-cell.editable { color: #1565c0; }
    
    .sudoku-cell.border-r { border-right: 2px solid #333; }
    .sudoku-cell.border-b { border-bottom: 2px solid #333; }
    
    .number-pad {
        display: grid;
        grid-template-columns: repeat(9, 1fr);
        gap: 5px;
        max-width: 400px;
        margin: 20px auto;
    }
    
    .num-btn {
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
    
    .num-btn:hover { background: #e3f2fd; }
    .num-btn:active { transform: scale(0.95); }
    
    .action-buttons {
        display: flex;
        gap: 10px;
        justify-content: center;
        margin-top: 20px;
    }
    
    .action-btn {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .action-btn.check { background: #4caf50; color: white; }
    .action-btn.solve { background: #ff9800; color: white; }
    
    .controls {
        text-align: center;
        margin-bottom: 20px;
    }
    
    .level-selector, .difficulty-selector {
        display: inline-flex;
        gap: 5px;
        margin: 0 10px;
    }
    
    .level-btn, .difficulty-btn {
        padding: 8px 16px;
        font-size: 14px;
        border: none;
        border-radius: 20px;
        cursor: pointer;
        background: rgba(255,255,255,0.3);
        color: white;
        transition: all 0.2s;
    }
    
    .level-btn.active, .difficulty-btn.active {
        background: white;
        color: #667eea;
    }
    
    .timer {
        display: inline-block;
        margin-left: 10px;
        color: white;
        font-weight: bold;
    }
    
    .hidden { display: none; }
    
    .message {
        text-align: center;
        margin-top: 20px;
        padding: 10px;
        border-radius: 10px;
        font-weight: bold;
    }
    
    .message.success { background: #e8f5e9; color: #2e7d32; }
    .message.error { background: #ffebee; color: #c62828; }
    
    .game-rules {
        margin-top: 20px;
        padding: 15px;
        background: rgba(255,255,255,0.2);
        border-radius: 10px;
        color: white;
        font-size: 14px;
    }
    
    .header { text-align: center; color: white; margin-bottom: 20px; }
    .header h1 { font-size: 32px; margin-bottom: 5px; }
    .header p { opacity: 0.8; }
`;

const html = `
    <div class="header">
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

class Sudoku {
    constructor() {
        this.gridSize = 4;
        this.difficulty = 'easy';
        this.board = [];
        this.solution = [];
        this.selectedCell = null;
        this.timerInterval = null;
        this.startTime = 0;
        
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
        const container = document.getElementById('sudoku-container');
        if (container) {
            container.innerHTML = html;
            this.initGame();
        }
    }
    
    initGame() {
        this.board = this.generatePuzzle();
        this.renderGrid();
        this.renderNumberPad();
        this.startTimer();
    }
    
    generatePuzzle() {
        const size = this.gridSize;
        this.solution = this.generateSolution(size);
        const puzzle = JSON.parse(JSON.stringify(this.solution));
        
        const removeCount = {
            easy: Math.floor(size * size * 0.2),
            medium: Math.floor(size * size * 0.4),
            hard: Math.floor(size * size * 0.5)
        }[this.difficulty] || Math.floor(size * size * 0.3);
        
        const positions = [];
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                positions.push([i, j]);
            }
        }
        
        for (let i = 0; i < removeCount; i++) {
            const idx = Math.floor(Math.random() * positions.length);
            const [row, col] = positions.splice(idx, 1)[0];
            puzzle[row][col] = 0;
        }
        
        return puzzle;
    }
    
    generateSolution(size) {
        const grid = Array(size).fill(null).map(() => Array(size).fill(0));
        this.fillGrid(grid, size);
        return grid;
    }
    
    fillGrid(grid, size) {
        const empty = this.findEmpty(grid);
        if (!empty) return true;
        
        const [row, col] = empty;
        const nums = this.shuffleArray([...Array(size).keys()].map(i => i + 1));
        
        for (const num of nums) {
            if (this.isValid(grid, row, col, num, size)) {
                grid[row][col] = num;
                if (this.fillGrid(grid, size)) return true;
                grid[row][col] = 0;
            }
        }
        return false;
    }
    
    findEmpty(grid) {
        for (let i = 0; i < grid.length; i++) {
            for (let j = 0; j < grid[i].length; j++) {
                if (grid[i][j] === 0) return [i, j];
            }
        }
        return null;
    }
    
    shuffleArray(arr) {
        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
        return arr;
    }
    
    isValid(grid, row, col, num, size) {
        for (let i = 0; i < size; i++) {
            if (grid[row][i] === num || grid[i][col] === num) return false;
        }
        
        const boxSize = size === 4 ? 2 : (size === 6 ? 3 : 3);
        const boxRow = Math.floor(row / boxSize) * boxSize;
        const boxCol = Math.floor(col / boxSize) * boxSize;
        
        for (let i = boxRow; i < boxRow + boxSize; i++) {
            for (let j = boxCol; j < boxCol + boxSize; j++) {
                if (grid[i][j] === num) return false;
            }
        }
        return true;
    }
    
    renderGrid() {
        const gridEl = document.getElementById('sudokuGrid');
        if (!gridEl) return;
        
        const size = this.gridSize;
        const boxSize = size === 4 ? 2 : (size === 6 ? 3 : 3);
        
        gridEl.innerHTML = '';
        gridEl.className = `sudoku-grid grid-${size}`;
        
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                const cell = document.createElement('div');
                cell.className = 'sudoku-cell';
                if (j % boxSize === boxSize - 1 && j !== size - 1) cell.classList.add('border-r');
                if (i % boxSize === boxSize - 1 && i !== size - 1) cell.classList.add('border-b');
                
                if (this.board[i][j] !== 0) {
                    cell.textContent = this.board[i][j];
                    cell.classList.add('fixed');
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
    
    renderNumberPad() {
        const pad = document.getElementById('sudokuNumberPad');
        if (!pad) return;
        
        pad.innerHTML = '';
        for (let i = 1; i <= this.gridSize; i++) {
            const btn = document.createElement('button');
            btn.className = 'num-btn';
            btn.textContent = i;
            btn.addEventListener('click', () => this.inputNumber(i));
            pad.appendChild(btn);
        }
    }
    
    selectCell(row, col) {
        if (this.board[row][col] !== 0) return;
        
        document.querySelectorAll('.sudoku-cell').forEach(cell => {
            cell.classList.remove('selected', 'highlighted', 'same-value');
        });
        
        this.selectedCell = { row, col };
        
        const cells = document.querySelectorAll('.sudoku-cell');
        cells.forEach(cell => {
            const r = parseInt(cell.dataset.row);
            const c = parseInt(cell.dataset.col);
            
            if (r === row || c === col) {
                cell.classList.add('highlighted');
            }
            
            if (this.board[r][c] !== 0 && this.board[r][c] === this.board[row][col]) {
                cell.classList.add('same-value');
            }
        });
        
        const selectedEl = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
        if (selectedEl) selectedEl.classList.add('selected');
    }
    
    inputNumber(num) {
        if (!this.selectedCell) return;
        
        const { row, col } = this.selectedCell;
        if (this.board[row][col] !== 0) return;
        
        this.board[row][col] = num;
        
        const cell = document.querySelector(`.sudoku-cell[data-row="${row}"][data-col="${col}"]`);
        if (cell) {
            cell.textContent = num;
        }
        
        this.checkWin();
    }
    
    checkWin() {
        for (let i = 0; i < this.gridSize; i++) {
            for (let j = 0; j < this.gridSize; j++) {
                if (this.board[i][j] !== this.solution[i][j]) return;
            }
        }
        
        this.stopTimer();
        const msg = document.getElementById('sudokuMessage');
        if (msg) {
            msg.className = 'message success';
            msg.textContent = '🎉 恭喜完成！';
        }
    }
    
    startTimer() {
        this.stopTimer();
        this.startTime = Date.now();
        document.getElementById('sudokuTimerContainer')?.classList.remove('hidden');
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('sudokuTimer')?.textContent = `${mins}:${secs}`;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    bindEvents() {
        setTimeout(() => {
            document.querySelectorAll('.level-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.level-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.gridSize = parseInt(e.target.dataset.size);
                    this.initGame();
                });
            });
            
            document.querySelectorAll('.difficulty-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    document.querySelectorAll('.difficulty-btn').forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    this.difficulty = e.target.dataset.difficulty;
                    this.initGame();
                });
            });
            
            document.getElementById('sudokuNewGame')?.addEventListener('click', () => {
                this.initGame();
                document.getElementById('sudokuMessage')?.textContent = '';
            });
            
            document.getElementById('sudokuCheck')?.addEventListener('click', () => {
                let hasError = false;
                document.querySelectorAll('.sudoku-cell').forEach(cell => {
                    cell.classList.remove('error');
                });
                
                for (let i = 0; i < this.gridSize; i++) {
                    for (let j = 0; j < this.gridSize; j++) {
                        if (this.board[i][j] !== 0 && this.board[i][j] !== this.solution[i][j]) {
                            hasError = true;
                            const cell = document.querySelector(`.sudoku-cell[data-row="${i}"][data-col="${j}"]`);
                            if (cell) cell.classList.add('error');
                        }
                    }
                }
                
                const msg = document.getElementById('sudokuMessage');
                if (msg) {
                    if (hasError) {
                        msg.className = 'message error';
                        msg.textContent = '❌ 有错误，请检查！';
                    } else {
                        msg.className = 'message success';
                        msg.textContent = '✅ 全部正确！';
                    }
                }
            });
            
            document.getElementById('sudokuSolve')?.addEventListener('click', () => {
                for (let i = 0; i < this.gridSize; i++) {
                    for (let j = 0; j < this.gridSize; j++) {
                        this.board[i][j] = this.solution[i][j];
                        const cell = document.querySelector(`.sudoku-cell[data-row="${i}"][data-col="${j}"]`);
                        if (cell) {
                            cell.textContent = this.solution[i][j];
                            cell.classList.remove('editable');
                        }
                    }
                }
                this.stopTimer();
            });
        }, 100);
    }
}

let sudokuInstance = null;

export function initSudoku() {
    if (!sudokuInstance) {
        sudokuInstance = new Sudoku();
    }
}