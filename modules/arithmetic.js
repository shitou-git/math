const style = `
    .arithmetic-display {
        background: #fff;
        padding: 30px;
        border-radius: 16px;
        text-align: center;
        margin-bottom: 20px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    }
    
    .arithmetic-expression {
        font-size: 48px;
        font-weight: bold;
        color: #333;
        margin-bottom: 20px;
    }
    
    .arithmetic-answer {
        font-size: 36px;
        color: #666;
        min-height: 50px;
    }
    
    .arithmetic-keypad {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 10px;
        max-width: 320px;
        margin: 0 auto;
    }
    
    .arith-btn {
        padding: 20px;
        font-size: 24px;
        font-weight: bold;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        background: #fff;
        box-shadow: 0 2px 8px rgba(0,0,0,0.1);
        transition: all 0.2s;
    }
    
    .arith-btn:hover { background: #f0f0f0; }
    .arith-btn:active { transform: scale(0.95); }
    .arith-btn.operator { background: #667eea; color: white; }
    .arith-btn.clear { background: #f44336; color: white; }
    .arith-btn.backspace { background: #ff9800; color: white; }
    .arith-btn.equals { background: #4caf50; color: white; }
    
    .mode-selector {
        display: flex;
        justify-content: center;
        gap: 10px;
        margin-bottom: 20px;
    }
    
    .mode-btn {
        padding: 10px 20px;
        font-size: 16px;
        border: none;
        border-radius: 25px;
        cursor: pointer;
        background: rgba(255,255,255,0.3);
        color: white;
        transition: all 0.2s;
    }
    
    .mode-btn.active {
        background: white;
        color: #667eea;
    }
    
    .header { text-align: center; color: white; margin-bottom: 20px; }
    .header h1 { font-size: 32px; margin-bottom: 5px; }
    .header p { opacity: 0.8; }
`;

const html = `
    <div class="header">
        <h1>🧮 四则运算</h1>
        <p>练习加减乘除，使用数字按钮输入答案</p>
    </div>
    <div class="mode-selector" id="arithmeticModeSelector">
        <button class="mode-btn active" data-mode="addsub">➕➖ 加减法</button>
        <button class="mode-btn" data-mode="multdiv">✖️➗ 乘除法</button>
    </div>
    <div class="arithmetic-display">
        <div class="arithmetic-expression" id="arithExpression">2 + 3 = ?</div>
        <div class="arithmetic-answer" id="arithAnswer"></div>
    </div>
    <div class="arithmetic-keypad">
        <button class="arith-btn" onclick="arithmetic.input(7)">7</button>
        <button class="arith-btn" onclick="arithmetic.input(8)">8</button>
        <button class="arith-btn" onclick="arithmetic.input(9)">9</button>
        <button class="arith-btn backspace" onclick="arithmetic.backspace()">⌫</button>
        <button class="arith-btn" onclick="arithmetic.input(4)">4</button>
        <button class="arith-btn" onclick="arithmetic.input(5)">5</button>
        <button class="arith-btn" onclick="arithmetic.input(6)">6</button>
        <button class="arith-btn clear" onclick="arithmetic.clear()">C</button>
        <button class="arith-btn" onclick="arithmetic.input(1)">1</button>
        <button class="arith-btn" onclick="arithmetic.input(2)">2</button>
        <button class="arith-btn" onclick="arithmetic.input(3)">3</button>
        <button class="arith-btn equals" onclick="arithmetic.check()">✓</button>
        <button class="arith-btn" onclick="arithmetic.input(0)">0</button>
        <button class="arith-btn" onclick="arithmetic.input('.')">.</button>
        <button class="arith-btn" onclick="arithmetic.input('-')">±</button>
        <button class="arith-btn equals" onclick="arithmetic.check()">✓</button>
    </div>
`;

class Arithmetic {
    constructor() {
        this.mode = 'addsub';
        this.currentAnswer = '';
        this.currentProblem = null;
        
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
        const container = document.getElementById('arithmetic-container');
        if (container) {
            container.innerHTML = html;
            this.generateProblem();
        }
    }
    
    generateProblem() {
        this.currentAnswer = '';
        this.updateDisplay();
        
        const ops = this.mode === 'addsub' 
            ? ['+', '-'] 
            : ['×', '÷'];
        
        const op = ops[Math.floor(Math.random() * ops.length)];
        let num1, num2, answer;
        
        if (this.mode === 'addsub') {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
            
            if (op === '+') {
                answer = num1 + num2;
            } else {
                if (num1 < num2) [num1, num2] = [num2, num1];
                answer = num1 - num2;
            }
        } else {
            num1 = Math.floor(Math.random() * 12) + 2;
            num2 = Math.floor(Math.random() * 12) + 2;
            
            if (op === '×') {
                answer = num1 * num2;
            } else {
                answer = num1;
                num1 = num1 * num2;
            }
        }
        
        this.currentProblem = { num1, num2, op, answer };
        const exprEl = document.getElementById('arithExpression');
        if (exprEl) exprEl.textContent = `${num1} ${op} ${num2} = ?`;
    }
    
    input(val) {
        if (val === '±') {
            if (this.currentAnswer.startsWith('-')) {
                this.currentAnswer = this.currentAnswer.slice(1);
            } else {
                this.currentAnswer = '-' + this.currentAnswer;
            }
        } else {
            if (val === '.' && this.currentAnswer.includes('.')) return;
            this.currentAnswer += val;
        }
        this.updateDisplay();
    }
    
    backspace() {
        this.currentAnswer = this.currentAnswer.slice(0, -1);
        this.updateDisplay();
    }
    
    clear() {
        this.currentAnswer = '';
        this.updateDisplay();
    }
    
    updateDisplay() {
        const answerEl = document.getElementById('arithAnswer');
        if (answerEl) {
            answerEl.textContent = this.currentAnswer || '?';
        }
    }
    
    check() {
        if (!this.currentAnswer) return;
        
        const userAnswer = parseFloat(this.currentAnswer);
        const display = document.getElementById('arithExpression');
        
        if (userAnswer === this.currentProblem.answer) {
            display.textContent += ` ${this.currentAnswer} ✅`;
            setTimeout(() => this.generateProblem(), 1000);
        } else {
            display.textContent += ` ${this.currentAnswer} ❌`;
            setTimeout(() => {
                this.clear();
                display.textContent = `${this.currentProblem.num1} ${this.currentProblem.op} ${this.currentProblem.num2} = ?`;
            }, 1000);
        }
    }
    
    switchMode(mode) {
        this.mode = mode;
        document.querySelectorAll('.mode-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.mode === mode);
        });
        this.generateProblem();
    }
    
    bindEvents() {
        setTimeout(() => {
            document.querySelectorAll('.mode-btn').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    this.switchMode(e.target.dataset.mode);
                });
            });
        }, 100);
    }
}

const arithmetic = new Arithmetic();
window.arithmetic = arithmetic;

export function initArithmetic() {
    arithmetic.generateProblem();
}