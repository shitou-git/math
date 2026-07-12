const style = `
    .schulte-board-wrap {
        position: relative;
        width: 100%;
        max-width: 350px;
        margin: 0 auto;
        padding-bottom: 100%;
    }
    
    .schulte-board {
        position: absolute;
        inset: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #fff;
        border-radius: 16px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        overflow: hidden;
    }
    
    .schulte-board-svg {
        width: 100%;
        height: 100%;
    }
    
    .schulte-number {
        cursor: pointer;
        transition: all 0.2s;
    }
    
    .schulte-number:hover { opacity: 0.8; }
    .schulte-number.clicked { opacity: 0.4; }
    
    .schulte-controls {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-top: 20px;
        flex-wrap: wrap;
    }
    
    .schulte-btn {
        padding: 12px 24px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        transition: all 0.2s;
        background: rgba(255,255,255,0.3);
        color: white;
    }
    
    .schulte-btn.primary {
        background: white;
        color: #667eea;
    }
    
    .schulte-btn:hover { opacity: 0.8; }
    .schulte-btn:active { transform: scale(0.95); }
    .schulte-btn:disabled { opacity: 0.5; cursor: not-allowed; }
    
    .schulte-panel {
        background: rgba(255,255,255,0.2);
        border-radius: 12px;
        padding: 15px;
        margin-top: 20px;
        color: white;
    }
    
    .schulte-panel-title {
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 10px;
    }
    
    .schulte-history-stats {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 15px;
        text-align: center;
    }
    
    .schulte-stat-v {
        font-size: 24px;
        font-weight: bold;
    }
    
    .schulte-stat-l {
        font-size: 12px;
        opacity: 0.8;
    }
    
    .schulte-history-list {
        list-style: none;
        padding: 0;
        margin: 10px 0;
    }
    
    .schulte-history-item {
        display: flex;
        justify-content: space-between;
        padding: 8px 0;
        border-bottom: 1px solid rgba(255,255,255,0.2);
    }
    
    .schulte-empty {
        text-align: center;
        opacity: 0.6;
        font-size: 14px;
    }
    
    .header { text-align: center; color: white; margin-bottom: 20px; }
    .header h1 { font-size: 32px; margin-bottom: 5px; }
    .header p { opacity: 0.8; }
`;

const html = `
    <div class="header">
        <h1>🎯 舒尔特方格</h1>
        <p>练习注意力，提升专注力</p>
    </div>
    <div class="game-container">
        <div class="schulte-board-wrap">
            <div class="schulte-board" id="schulteBoard" aria-label="舒尔特方格">
                <svg class="schulte-board-svg" id="schulteBoardSvg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet"></svg>
            </div>
            <div class="schulte-overlay" id="schulteOverlay">
                <div class="schulte-overlay-card">
                    <div class="schulte-overlay-emoji" id="schulteOverlayEmoji">🎯</div>
                    <h3 id="schulteOverlayTitle">准备开始</h3>
                    <p id="schulteOverlayDesc">点击下方「开始」按钮，按顺序点击数字。</p>
                    <button class="schulte-btn primary" id="schulteOverlayStart">开始训练</button>
                </div>
            </div>
        </div>
        <div class="schulte-controls">
            <button class="schulte-btn primary" id="schulteStartBtn">开始</button>
            <button class="schulte-btn" id="schultePauseBtn" disabled>暂停</button>
            <button class="schulte-btn" id="schulteResumeBtn" disabled>恢复</button>
            <button class="schulte-btn ghost" id="schulteResetBtn">重置</button>
        </div>
        <div class="schulte-panel schulte-history">
            <h3 class="schulte-panel-title">历史成绩</h3>
            <div class="schulte-history-stats" id="schulteHistoryStats">
                <div class="schulte-stat"><div class="schulte-stat-v">0</div><div class="schulte-stat-l">总场次</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">0</div><div class="schulte-stat-l">成功</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">—</div><div class="schulte-stat-l">最佳</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">—</div><div class="schulte-stat-l">成功率</div></div>
            </div>
            <ul class="schulte-history-list" id="schulteHistoryList"></ul>
            <p class="schulte-empty" id="schulteHistoryEmpty">暂无记录，完成一局后会出现在这里。</p>
        </div>
    </div>
`;

class SchulteGrid {
    constructor() {
        this.size = 5;
        this.numbers = [];
        this.currentNumber = 1;
        this.startTime = 0;
        this.timerInterval = null;
        this.isPaused = false;
        this.isPlaying = false;
        this.history = [];
        
        this.injectStyle();
        this.render();
        this.bindEvents();
        this.loadHistory();
    }
    
    injectStyle() {
        const styleEl = document.createElement('style');
        styleEl.textContent = style;
        document.head.appendChild(styleEl);
    }
    
    render() {
        const container = document.getElementById('schulte-container');
        if (container) {
            container.innerHTML = html;
            this.renderGrid();
        }
    }
    
    renderGrid() {
        const svg = document.getElementById('schulteBoardSvg');
        if (!svg) return;
        
        svg.innerHTML = '';
        
        const cells = this.size * this.size;
        const gap = 5;
        const cellSize = (100 - gap * (this.size - 1)) / this.size;
        
        this.numbers = [...Array(cells).keys()].map(i => i + 1);
        for (let i = this.numbers.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.numbers[i], this.numbers[j]] = [this.numbers[j], this.numbers[i]];
        }
        
        for (let i = 0; i < this.size; i++) {
            for (let j = 0; j < this.size; j++) {
                const num = this.numbers[i * this.size + j];
                const x = j * (cellSize + gap);
                const y = i * (cellSize + gap);
                
                const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
                g.classList.add('schulte-number');
                g.dataset.num = num;
                
                const rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                rect.setAttribute('x', x);
                rect.setAttribute('y', y);
                rect.setAttribute('width', cellSize);
                rect.setAttribute('height', cellSize);
                rect.setAttribute('rx', '5');
                rect.setAttribute('fill', this.getRandomColor());
                
                const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
                text.setAttribute('x', x + cellSize / 2);
                text.setAttribute('y', y + cellSize / 2);
                text.setAttribute('text-anchor', 'middle');
                text.setAttribute('dominant-baseline', 'middle');
                text.setAttribute('fill', '#fff');
                text.setAttribute('font-size', this.size <= 5 ? '16' : '12');
                text.setAttribute('font-weight', 'bold');
                text.textContent = num;
                
                g.appendChild(rect);
                g.appendChild(text);
                g.addEventListener('click', () => this.handleClick(num));
                
                svg.appendChild(g);
            }
        }
    }
    
    getRandomColor() {
        const colors = [
            '#667eea', '#764ba2', '#f093fb', '#f5576c', 
            '#4facfe', '#00f2fe', '#43e97b', '#38f9d7',
            '#fa709a', '#fee140', '#f09819', '#edde5d'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    handleClick(num) {
        if (!this.isPlaying || this.isPaused) return;
        if (num !== this.currentNumber) return;
        
        const g = document.querySelector(`.schulte-number[data-num="${num}"]`);
        if (g) {
            g.classList.add('clicked');
        }
        
        this.currentNumber++;
        
        if (this.currentNumber > this.size * this.size) {
            this.finish();
        }
    }
    
    start() {
        this.isPlaying = true;
        this.isPaused = false;
        this.currentNumber = 1;
        this.startTime = Date.now();
        
        document.querySelectorAll('.schulte-number').forEach(el => {
            el.classList.remove('clicked');
        });
        
        document.getElementById('schulteStartBtn')?.setAttribute('disabled', 'true');
        document.getElementById('schultePauseBtn')?.removeAttribute('disabled');
        document.getElementById('schulteResumeBtn')?.setAttribute('disabled', 'true');
        
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('schulteTimer')?.textContent = `${mins}:${secs}`;
        }, 1000);
    }
    
    pause() {
        this.isPaused = true;
        clearInterval(this.timerInterval);
        
        document.getElementById('schultePauseBtn')?.setAttribute('disabled', 'true');
        document.getElementById('schulteResumeBtn')?.removeAttribute('disabled');
    }
    
    resume() {
        this.isPaused = false;
        this.timerInterval = setInterval(() => {
            const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
            const mins = Math.floor(elapsed / 60).toString().padStart(2, '0');
            const secs = (elapsed % 60).toString().padStart(2, '0');
            document.getElementById('schulteTimer')?.textContent = `${mins}:${secs}`;
        }, 1000);
        
        document.getElementById('schultePauseBtn')?.removeAttribute('disabled');
        document.getElementById('schulteResumeBtn')?.setAttribute('disabled', 'true');
    }
    
    reset() {
        this.isPlaying = false;
        this.isPaused = false;
        clearInterval(this.timerInterval);
        this.currentNumber = 1;
        
        document.getElementById('schulteStartBtn')?.removeAttribute('disabled');
        document.getElementById('schultePauseBtn')?.setAttribute('disabled', 'true');
        document.getElementById('schulteResumeBtn')?.setAttribute('disabled', 'true');
        
        this.renderGrid();
    }
    
    finish() {
        this.isPlaying = false;
        clearInterval(this.timerInterval);
        
        const elapsed = Math.floor((Date.now() - this.startTime) / 1000);
        const mins = Math.floor(elapsed / 60);
        const secs = elapsed % 60;
        
        this.history.unshift({
            time: new Date().toLocaleString(),
            duration: `${mins}分${secs}秒`,
            size: this.size
        });
        
        if (this.history.length > 10) {
            this.history = this.history.slice(0, 10);
        }
        
        this.saveHistory();
        this.updateHistoryDisplay();
        
        document.getElementById('schulteStartBtn')?.removeAttribute('disabled');
        document.getElementById('schultePauseBtn')?.setAttribute('disabled', 'true');
        
        setTimeout(() => {
            alert(`🎉 完成！用时 ${mins}分${secs}秒`);
        }, 100);
    }
    
    saveHistory() {
        localStorage.setItem('schulteHistory', JSON.stringify(this.history));
    }
    
    loadHistory() {
        const saved = localStorage.getItem('schulteHistory');
        if (saved) {
            this.history = JSON.parse(saved);
            this.updateHistoryDisplay();
        }
    }
    
    updateHistoryDisplay() {
        const list = document.getElementById('schulteHistoryList');
        const empty = document.getElementById('schulteHistoryEmpty');
        
        if (!list || !empty) return;
        
        if (this.history.length === 0) {
            list.innerHTML = '';
            empty.style.display = 'block';
            return;
        }
        
        empty.style.display = 'none';
        list.innerHTML = this.history.map(item => `
            <li class="schulte-history-item">
                <span>${item.time}</span>
                <span>${item.duration}</span>
            </li>
        `).join('');
        
        const stats = document.getElementById('schulteHistoryStats');
        if (stats) {
            const total = this.history.length;
            const success = total;
            const best = this.history.reduce((min, item) => {
                const [mins, secs] = item.duration.match(/(\d+)分(\d+)秒/).slice(1);
                return Math.min(min, parseInt(mins) * 60 + parseInt(secs));
            }, Infinity);
            
            stats.innerHTML = `
                <div class="schulte-stat"><div class="schulte-stat-v">${total}</div><div class="schulte-stat-l">总场次</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${success}</div><div class="schulte-stat-l">成功</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${best !== Infinity ? `${Math.floor(best / 60)}分${best % 60}秒` : '—'}</div><div class="schulte-stat-l">最佳</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${total > 0 ? '100%' : '—'}</div><div class="schulte-stat-l">成功率</div></div>
            `;
        }
    }
    
    bindEvents() {
        setTimeout(() => {
            document.getElementById('schulteStartBtn')?.addEventListener('click', () => this.start());
            document.getElementById('schultePauseBtn')?.addEventListener('click', () => this.pause());
            document.getElementById('schulteResumeBtn')?.addEventListener('click', () => this.resume());
            document.getElementById('schulteResetBtn')?.addEventListener('click', () => this.reset());
            document.getElementById('schulteOverlayStart')?.addEventListener('click', () => {
                document.getElementById('schulteOverlay')?.style.display = 'none';
                this.start();
            });
        }, 100);
    }
}

const schulte = new SchulteGrid();

export function initSchulte() {
    schulte.reset();
}