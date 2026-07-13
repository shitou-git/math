// 四则运算游戏 ES Module（加减法 + 乘除法）
// 从 index.html 提取：
//   CSS  - 第479-609行（24点游戏样式，加减法/乘除法共用）
//   HTML - 第2176-2326行（四则运算游戏页面，含加减法与乘除法两个 section）
//   JS   - 第2570-2588行（四则运算模式切换 switchArithmeticMode）
//          第2857-3201行（加减法计算游戏 + 加减法事件绑定）
//          第3203-3564行（乘除法计算游戏 + 乘除法事件绑定）
//   计时器函数 startTimer/stopTimer/updateTimer 不包含在本模块中，
//   它们是通用函数，由 main.js 提供并挂载到 window，本模块通过裸调用使用。
//   计数器函数从 schulte.js 导入。

import { getCounter, setCounter, renderCounter, incrementCounter, confirmResetCounter } from './schulte.js';

// ===================== 状态 =====================
let arithmeticMode = 'addsub';

// 加减法状态
let point24Difficulty = 'easy';
let point24Answer = 0;
let point24Expression = '';
let point24StartTime = 0;
// 加减法倒计时
const point24CountdownConfig = {
    easy: 2,
    medium: 3,
    hard: 5
};
let currentProblem = null;

// 乘除法状态
let multdivDifficulty = 'easy';
let multdivAnswer = 0;
let multdivExpression = '';
let multdivStartTime = 0;
let multdivProblem = null;

const multdivCountdownConfig = {
    easy: 2,
    medium: 3,
    hard: 5
};

// ===================== 四则运算模式切换 =====================
export function switchArithmeticMode(mode) {
    arithmeticMode = mode;
    const addsubSection = document.getElementById('addsubSection');
    const multdivSection = document.getElementById('multdivSection');
    document.querySelectorAll('#arithmeticModeSelector .diff-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === mode);
    });
    if (mode === 'addsub') {
        addsubSection.style.display = 'block';
        multdivSection.style.display = 'none';
        resetPoint24Game();
    } else {
        addsubSection.style.display = 'none';
        multdivSection.style.display = 'block';
        resetMultdivGame();
    }
}

// ===================== 加减法计算游戏 =====================
function hidePoint24Result() {
    const resultPanel = document.getElementById('point24Result');
    if (resultPanel) {
        resultPanel.classList.remove('show', 'success', 'error');
    }
    const solutionDiv = document.getElementById('point24Solution');
    if (solutionDiv) {
        solutionDiv.style.display = 'none';
    }
}

function generateAddSubProblem() {
    let num1, num2, operator, answer, tip = '';

    if (point24Difficulty === 'easy') {
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '+') {
            num1 = Math.floor(Math.random() * 81) + 10;
            const maxNum2 = 100 - num1;
            const minNum2 = Math.min(10, maxNum2);
            num2 = Math.floor(Math.random() * (maxNum2 - minNum2 + 1)) + minNum2;
        } else {
            num1 = Math.floor(Math.random() * 90) + 10;
            num2 = Math.floor(Math.random() * 90) + 10;
            if (num1 < num2) {
                [num1, num2] = [num2, num1];
            }
        }
        answer = operator === '+' ? num1 + num2 : num1 - num2;
    } else if (point24Difficulty === 'medium') {
        num1 = Math.floor(Math.random() * 400) + 100;
        num2 = Math.floor(Math.random() * 400) + 100;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }
        answer = operator === '+' ? num1 + num2 : num1 - num2;
    } else {
        num1 = Math.floor(Math.random() * 4000) + 500;
        num2 = Math.floor(Math.random() * 4000) + 500;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
        }
        answer = operator === '+' ? num1 + num2 : num1 - num2;
    }

    // 生成速算技巧提示
    tip = generateAddSubTip(num1, num2, operator, answer);

    return {
        expression: `${num1} ${operator} ${num2} = `,
        answer: answer,
        tip: tip
    };
}

function generateAddSubTip(num1, num2, operator, answer) {
    let tips = [];
    const remainder1 = num1 % 10;
    const remainder2 = num2 % 10;
    const tens1 = Math.floor(num1 / 10) * 10;
    const tens2 = Math.floor(num2 / 10) * 10;

    if (operator === '+') {
        // 技巧一：凑整法（最万能、最常用）
        const roundNum1 = Math.ceil(num1 / 10) * 10;
        const roundNum2 = Math.ceil(num2 / 10) * 10;
        const diff1 = roundNum1 - num1;
        const diff2 = roundNum2 - num2;

        if (diff1 > 0 && diff1 <= 5 && num1 >= 10) {
            tips.push(`【凑整法】${num1}离${roundNum1}差${diff1}，把${num2}拆成${diff1}+${num2-diff1}，先算${num1}+${diff1}=${roundNum1}，再加上${num2-diff1}`);
        } else if (diff2 > 0 && diff2 <= 5 && num2 >= 10) {
            tips.push(`【凑整法】${num2}离${roundNum2}差${diff2}，把${num1}拆成${diff2}+${num1-diff2}，先算${num2}+${diff2}=${roundNum2}，再加上${num1-diff2}`);
        }

        // 技巧二：多加要减去（凑整补差法）
        if (num2 === 9 || num2 === 19 || num2 === 29 || num2 === 99 || num2 === 199) {
            const round = Math.ceil(num2 / 10) * 10;
            const over = round - num2;
            tips.push(`【多加要减去】${num2}接近${round}，先算${num1}+${round}，多加了${over}，再减去${over}`);
        } else if (num1 === 9 || num1 === 19 || num1 === 29 || num1 === 99 || num1 === 199) {
            const round = Math.ceil(num1 / 10) * 10;
            const over = round - num1;
            tips.push(`【多加要减去】${num1}接近${round}，先算${round}+${num2}，多加了${over}，再减去${over}`);
        }

        // 技巧三：互补数先加（找好朋友数）
        if (remainder1 + remainder2 === 10) {
            tips.push(`【互补数先加】${remainder1}找${remainder2}凑10！个位凑成10后，十位相加更简单`);
        }

        // 技巧四：拆分分组法
        if (num1 >= 10 && num2 >= 10) {
            tips.push(`【拆分分组法】十位加十位：${tens1}+${tens2}，个位加个位：${remainder1}+${remainder2}，最后合并`);
        }

        // 技巧五：找朋友法（加9变加10减1）
        if (remainder2 === 9) {
            tips.push(`【找朋友法】个位是9，+9可以变成+10-1，这样更好算`);
        } else if (remainder1 === 9) {
            tips.push(`【找朋友法】个位是9，+9可以变成+10-1，这样更好算`);
        }

        // 技巧六：基准数法（两个数相近）
        if (Math.abs(num1 - num2) <= 10 && num1 >= 50) {
            tips.push(`【基准数法】${num1}和${num2}很接近，以较小的数为基准再调整`);
        }

        // 技巧七：简单凑十（个位数相加）
        if (num1 < 10 && num2 < 10) {
            if (remainder1 + remainder2 === 10) {
                tips.push(`【凑十法】${remainder1}+${remainder2}=10，凑成整十更简单`);
            } else {
                tips.push(`【直接相加】个位直接相加即可`);
            }
        }

    } else {
        // 减法技巧

        // 技巧一：凑整减法（最常用）
        const roundNum = Math.ceil(num2 / 10) * 10;
        const diff = roundNum - num2;
        if (diff > 0 && diff <= 5 && num2 >= 10) {
            tips.push(`【凑整减法】${num2}接近${roundNum}，先算${num1}-${roundNum}，多减了${diff}，再加回${diff}`);
        }

        // 技巧二：拆分减数减法
        if (num2 >= 10 && num2 < 100) {
            tips.push(`【拆分减数】把${num2}拆成${tens2}+${remainder2}，先减整十，再减个位`);
        }

        // 技巧三：同尾数相减秒杀
        if (remainder1 === remainder2) {
            tips.push(`【同尾数相减】个位都是${remainder1}，直接抵消，只需算十位`);
        }

        // 技巧四：退位减法口诀
        if (remainder1 < remainder2) {
            tips.push(`【退位减法】个位${remainder1}<${remainder2}不够减，十位借1当10，个位变成${remainder1+10}再减`);
        }

        // 技巧五：直接相减（不退位）
        if (remainder1 >= remainder2) {
            tips.push(`【直接相减】个位够减直接相减，十位相减，最后合并`);
        }

        // 技巧六：补差减法（两个数很接近）
        if (num1 - num2 < 10 && num1 > num2) {
            tips.push(`【补差减法】${num1}和${num2}很接近，直接算差距即可`);
        }

        // 技巧七：找朋友法（减9变减10加1）
        if (remainder2 === 9 && num2 >= 9) {
            tips.push(`【找朋友法】个位是9，减9可以变成减10加1，这样更好算`);
        }

        // 技巧八：百位减法速算（被减数是整百）
        if (num1 % 100 === 0 && num2 < num1) {
            tips.push(`【百位减法】整百数减小数，百位减1作补偿，十位和个位用补数`);
        }
    }

    // 通用提示兜底
    if (tips.length === 0) {
        if (operator === '+') {
            tips.push(`从个位开始加起${remainder1+remainder2>=10?'，满十要进一':''}`);
        } else {
            tips.push(`从个位开始减起${remainder1<remainder2?'，不够减要借位':''}`);
        }
    }

    // 随机选择一条提示
    return tips[Math.floor(Math.random() * tips.length)];
}

function renderPoint24NumPad() {
    const padDiv = document.getElementById('point24NumPad');
    padDiv.innerHTML = '';

    for (let i = 1; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.onclick = () => appendPoint24Number(i);
        padDiv.appendChild(btn);
    }

    const zeroBtn = document.createElement('button');
    zeroBtn.className = 'num-btn';
    zeroBtn.textContent = 0;
    zeroBtn.onclick = () => appendPoint24Number(0);
    padDiv.appendChild(zeroBtn);

    const clearBtn = document.createElement('button');
    clearBtn.className = 'num-btn clear-btn';
    clearBtn.textContent = '×';
    clearBtn.onclick = () => clearPoint24Expression();
    padDiv.appendChild(clearBtn);
}

function appendPoint24Number(num) {
    hidePoint24Result();
    // 正向输入：输入的数字依次放在右边（正常顺序）
    point24Expression += num;
    document.getElementById('point24Expression').textContent = point24Expression;
}

function clearPoint24Expression() {
    // 只清空输入表达式，不再调用 hidePoint24Result()，避免隐藏错误提示
    point24Expression = '';
    document.getElementById('point24Expression').textContent = '';
}

function renderPoint24Numbers() {
    currentProblem = generateAddSubProblem();
    point24Answer = currentProblem.answer;
    point24Expression = '';

    document.getElementById('point24Problem').textContent = currentProblem.expression;
    document.getElementById('point24Expression').textContent = '';
    document.getElementById('point24Solution').style.display = 'none';

    // 显示速算技巧提示
    const tipPanel = document.getElementById('point24Tip');
    const tipText = document.getElementById('point24TipText');
    if (currentProblem.tip) {
        tipText.textContent = '💡 ' + currentProblem.tip;
        tipPanel.style.display = 'block';
    } else {
        tipPanel.style.display = 'none';
    }

    renderPoint24NumPad();
}

function checkPoint24Answer() {
    const expressionEl = document.getElementById('point24Expression');

    if (!point24Expression) {
        return;
    }

    const userAnswer = parseInt(point24Expression);

    if (userAnswer === point24Answer) {
        expressionEl.classList.remove('error');
        expressionEl.classList.add('success');
        expressionEl.textContent = '✓ 正确';
        incrementCounter('point24', 'correct');
        const elapsedSeconds = Math.floor((Date.now() - point24StartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        window.stopTimer();
        setTimeout(() => {
            resetPoint24Game();
        }, 2000);
    } else {
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = '✗ 错误';
        incrementCounter('point24', 'wrong');
        point24Expression = '';
        // 1.5秒后清除错误状态
        setTimeout(() => {
            expressionEl.classList.remove('error');
            expressionEl.textContent = '';
        }, 1500);
    }
}

function showPoint24Solution() {
    const elapsedMinutes = point24StartTime ? (Date.now() - point24StartTime) / 60000 : 0;
    const requiredMinutes = point24CountdownConfig[point24Difficulty] || 2;
    if (elapsedMinutes < requiredMinutes) {
        const remaining = Math.ceil(requiredMinutes - elapsedMinutes);
        const expressionEl = document.getElementById('point24Expression');
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = `还需${remaining}分钟`;
        setTimeout(() => {
            expressionEl.classList.remove('error');
            expressionEl.textContent = '';
        }, 2000);
        return;
    }
    if (!currentProblem) {
        return;
    }
    const solutionEl = document.getElementById('solutionText');
    if (solutionEl) {
        solutionEl.textContent = `${currentProblem.expression}${point24Answer}`;
        document.getElementById('point24Solution').style.display = 'block';
    }
}

function resetPoint24Game() {
    point24StartTime = Date.now();
    renderPoint24Numbers();
    renderCounter('point24');
    window.startTimer();
}

// ===================== 加减法事件绑定 =====================
function setupAddsubEventListeners() {
    document.querySelectorAll('#addsubSection .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#addsubSection .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            point24Difficulty = btn.dataset.level;
            resetPoint24Game();
        });
    });
}

// ===================== 乘除法计算游戏 =====================
function hideMultdivResult() {
    const resultPanel = document.getElementById('multdivResult');
    if (resultPanel) {
        resultPanel.classList.remove('show', 'success', 'error');
    }
    const solutionDiv = document.getElementById('multdivSolution');
    if (solutionDiv) {
        solutionDiv.style.display = 'none';
    }
}

function generateMultdivProblem() {
    let num1, num2, num3, num4, operator1, operator2, answer;

    if (multdivDifficulty === 'easy') {
        const opType = Math.floor(Math.random() * 2);
        if (opType === 0) {
            num1 = Math.floor(Math.random() * 9) + 2;
            num2 = Math.floor(Math.random() * 9) + 2;
            answer = num1 * num2;
            const tip = generateMultdivTip(num1, num2, '×', answer);
            return { expression: `${num1} × ${num2} = `, answer: answer, tip: tip };
        } else {
            num2 = Math.floor(Math.random() * 9) + 2;
            answer = Math.floor(Math.random() * 9) + 2;
            num1 = num2 * answer;
            const tip = generateMultdivTip(num1, num2, '÷', answer);
            return { expression: `${num1} ÷ ${num2} = `, answer: answer, tip: tip };
        }
    } else if (multdivDifficulty === 'medium') {
        const opType = Math.floor(Math.random() * 2);
        if (opType === 0) {
            num1 = Math.floor(Math.random() * 20) + 2;
            num2 = Math.floor(Math.random() * 20) + 2;
            answer = num1 * num2;
            const tip = generateMultdivTip(num1, num2, '×', answer);
            return { expression: `${num1} × ${num2} = `, answer: answer, tip: tip };
        } else {
            num2 = Math.floor(Math.random() * 20) + 2;
            answer = Math.floor(Math.random() * 20) + 2;
            num1 = num2 * answer;
            const tip = generateMultdivTip(num1, num2, '÷', answer);
            return { expression: `${num1} ÷ ${num2} = `, answer: answer, tip: tip };
        }
    } else {
        // 高级：加减乘除混合运算，按四则运算优先级计算
        for (let attempt = 0; attempt < 100; attempt++) {
            const ops = ['+', '-', '×', '÷'];
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            num3 = Math.floor(Math.random() * 20) + 1;
            operator1 = ops[Math.floor(Math.random() * 4)];
            operator2 = ops[Math.floor(Math.random() * 4)];

            // 处理所有除法：确保能整除
            if (operator1 === '÷') {
                const d1 = Math.floor(Math.random() * 10) + 1;   // 除数
                const q1 = Math.floor(Math.random() * 10) + 1;   // 商
                num1 = q1 * d1;
                num2 = d1;
            }
            if (operator2 === '÷') {
                const d2 = Math.floor(Math.random() * 10) + 1;   // 除数
                const q2 = Math.floor(Math.random() * 10) + 1;   // 商
                num2 = q2 * d2;
                num3 = d2;
            }

            // 按四则运算优先级计算结果
            // 先处理 operator1 和 operator2 的优先级，计算中间步骤
            let step1, step2, result;

            // 判断优先级
            const priority = { '+': 1, '-': 1, '×': 2, '÷': 2 };
            const p1 = priority[operator1];
            const p2 = priority[operator2];

            if (p2 > p1) {
                // 先算 op2，再算 op1
                if (operator2 === '+') step1 = num2 + num3;
                else if (operator2 === '-') step1 = num2 - num3;
                else if (operator2 === '×') step1 = num2 * num3;
                else if (operator2 === '÷') step1 = num2 / num3;

                if (operator1 === '+') result = num1 + step1;
                else if (operator1 === '-') result = num1 - step1;
                else if (operator1 === '×') result = num1 * step1;
                else if (operator1 === '÷') result = num1 / step1;
            } else {
                // 先算 op1，再算 op2（或左到右同级）
                if (operator1 === '+') step1 = num1 + num2;
                else if (operator1 === '-') step1 = num1 - num2;
                else if (operator1 === '×') step1 = num1 * num2;
                else if (operator1 === '÷') step1 = num1 / num2;

                if (operator2 === '+') result = step1 + num3;
                else if (operator2 === '-') result = step1 - num3;
                else if (operator2 === '×') result = step1 * num3;
                else if (operator2 === '÷') {
                    // 确保能整除
                    if (step1 % num3 !== 0) continue;
                    result = step1 / num3;
                }
            }

            // 验证结果是正整数
            if (result !== undefined && result > 0 && Number.isInteger(result)) {
                answer = result;
                return {
                    expression: `${num1} ${operator1} ${num2} ${operator2} ${num3} = `,
                    answer: answer
                };
            }
        }

        // fallback
        num1 = Math.floor(Math.random() * 50) + 10;
        num2 = Math.floor(Math.random() * 50) + 10;
        num3 = Math.floor(Math.random() * 50) + 10;
        answer = num1 + num2 + num3;
        return { expression: `${num1} + ${num2} + ${num3} = `, answer: answer };
    }
}

function generateMultdivTip(num1, num2, operator, answer) {
    let tips = [];

    if (operator === '×') {
        const remainder1 = num1 % 10;
        const remainder2 = num2 % 10;

        if (num2 === 25) {
            tips.push(`凑整法：${num1} × 25，可以把${num1}拆成${num1/4}×4，然后4×25=100`);
        } else if (num1 === 25) {
            tips.push(`凑整法：25 × ${num2}，可以把${num2}拆成${num2/4}×4，然后4×25=100`);
        } else if (num2 === 125) {
            tips.push(`凑整法：${num1} × 125，可以把${num1}拆成${num1/8}×8，然后8×125=1000`);
        } else if (num1 === 125) {
            tips.push(`凑整法：125 × ${num2}，可以把${num2}拆成${num2/8}×8，然后8×125=1000`);
        }

        if (num2 === 5 || num1 === 5) {
            const otherNum = num2 === 5 ? num1 : num2;
            tips.push(`凑整法：×5可以转化为÷2×10，${otherNum}${operator}5 = ${otherNum}×10÷2`);
        }

        if (num2 === 9 || num2 === 99 || num2 === 999) {
            tips.push(`分配律：${num2}接近${num2+1}，可以用${num2+1}-1代替，${num1}×(${num2+1}-1)`);
        } else if (num1 === 9 || num1 === 99 || num1 === 999) {
            tips.push(`分配律：${num1}接近${num1+1}，可以用${num1+1}-1代替，(${num1+1}-1)×${num2}`);
        }

        if (num1 % 10 === 0 || num2 % 10 === 0) {
            const roundNum = num1 % 10 === 0 ? num1 : num2;
            const otherNum = num1 % 10 === 0 ? num2 : num1;
            tips.push(`简便计算：${roundNum}末尾有0，可以先算${roundNum/10}×${otherNum}，再在结果末尾加一个0`);
        }

        if (num1 >= 10 && num2 >= 10) {
            const tens1 = Math.floor(num1 / 10) * 10;
            const ones1 = num1 % 10;
            tips.push(`分配律：${num1} = ${tens1} + ${ones1}，可以拆成${tens1}×${num2} + ${ones1}×${num2}`);
        }

        const factors = getFactors(num2);
        if (factors.length > 2) {
            tips.push(`分解因数：${num2}可以分解为${factors.slice(1, -1).join('×')}，${num1}×${num2} = ${num1}${factors.slice(1, -1).map(f => '×' + f).join('')}`);
        }
    } else if (operator === '÷') {
        if (num2 === 5) {
            tips.push(`简便计算：÷5可以转化为×2÷10，${num1}÷5 = ${num1}×2÷10`);
        } else if (num2 === 25) {
            tips.push(`简便计算：÷25可以转化为×4÷100，${num1}÷25 = ${num1}×4÷100`);
        } else if (num2 === 125) {
            tips.push(`简便计算：÷125可以转化为×8÷1000，${num1}÷125 = ${num1}×8÷1000`);
        }

        const factors = getFactors(num2);
        if (factors.length > 2) {
            tips.push(`拆分法：${num2}可以分解为${factors.slice(1, -1).join('×')}，${num1}÷${num2} = ${num1}${factors.slice(1, -1).map(f => '÷' + f).join('')}`);
        }

        if (num1 % 10 === 0) {
            tips.push(`简便计算：${num1}末尾有0，可以先同时除以10，变成${num1/10}÷${num2/10}`);
        }

        if (num1 >= 100 && num2 < 10) {
            const tens = Math.floor(num1 / 10) * 10;
            const ones = num1 % 10;
            tips.push(`拆分法：${num1} = ${tens} + ${ones}，可以拆成${tens}÷${num2} + ${ones}÷${num2}`);
        }
    }

    if (tips.length === 0) {
        if (operator === '×') {
            tips.push(`直接计算：${num1} × ${num2}，可以逐位相乘再相加`);
        } else {
            tips.push(`直接计算：${num1} ÷ ${num2}，可以用长除法计算`);
        }
    }

    return tips[Math.floor(Math.random() * tips.length)];
}

function getFactors(n) {
    const factors = [];
    for (let i = 1; i <= Math.sqrt(n); i++) {
        if (n % i === 0) {
            factors.push(i);
            if (i !== n / i) {
                factors.push(n / i);
            }
        }
    }
    return factors.sort((a, b) => a - b);
}

function renderMultdivNumPad() {
    const pad = document.getElementById('multdivNumPad');
    pad.innerHTML = '';

    for (let i = 0; i <= 9; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        btn.textContent = i;
        btn.addEventListener('click', () => appendMultdivNumber(i));
        pad.appendChild(btn);
    }

    // 添加清除按钮
    const clearBtn = document.createElement('button');
    clearBtn.className = 'num-btn clear-btn';
    clearBtn.textContent = '×';
    clearBtn.addEventListener('click', clearMultdivExpression);
    pad.appendChild(clearBtn);
}

function appendMultdivNumber(num) {
    hideMultdivResult();
    // 正向输入：输入的数字依次放在右边（正常顺序）
    multdivExpression += num;
    document.getElementById('multdivExpression').textContent = multdivExpression;
}

function clearMultdivExpression() {
    // 只清空输入表达式，不再调用 hideMultdivResult()，避免隐藏错误提示
    multdivExpression = '';
    document.getElementById('multdivExpression').textContent = '';
}

function renderMultdivNumbers() {
    multdivProblem = generateMultdivProblem();
    multdivAnswer = multdivProblem.answer;
    multdivExpression = '';

    document.getElementById('multdivProblem').textContent = multdivProblem.expression;
    document.getElementById('multdivExpression').textContent = '';
    document.getElementById('multdivSolution').style.display = 'none';

    const tipPanel = document.getElementById('multdivTip');
    const tipText = document.getElementById('multdivTipText');
    if (multdivProblem.tip) {
        tipText.textContent = multdivProblem.tip;
        tipPanel.style.display = 'block';
    } else {
        tipPanel.style.display = 'none';
    }

    renderMultdivNumPad();
}

function checkMultdivAnswer() {
    const expressionEl = document.getElementById('multdivExpression');

    if (!multdivExpression) {
        return;
    }

    const userAnswer = parseFloat(multdivExpression);

    if (Math.abs(userAnswer - multdivAnswer) < 0.01) {
        expressionEl.classList.remove('error');
        expressionEl.classList.add('success');
        expressionEl.textContent = '✓ 正确';
        incrementCounter('multdiv', 'correct');
        const elapsedSeconds = Math.floor((Date.now() - multdivStartTime) / 1000);
        const minutes = Math.floor(elapsedSeconds / 60);
        const seconds = elapsedSeconds % 60;
        const timeStr = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
        window.stopTimer();
        setTimeout(() => {
            resetMultdivGame();
        }, 2000);
    } else {
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = '✗ 错误';
        incrementCounter('multdiv', 'wrong');
        multdivExpression = '';
        // 1.5秒后清除错误状态
        setTimeout(() => {
            expressionEl.classList.remove('error');
            expressionEl.textContent = '';
        }, 1500);
    }
}

function showMultdivSolution() {
    const elapsedMinutes = multdivStartTime ? (Date.now() - multdivStartTime) / 60000 : 0;
    const requiredMinutes = multdivCountdownConfig[multdivDifficulty] || 2;
    if (elapsedMinutes < requiredMinutes) {
        const remaining = Math.ceil(requiredMinutes - elapsedMinutes);
        const expressionEl = document.getElementById('multdivExpression');
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = `还需${remaining}分钟`;
        setTimeout(() => {
            expressionEl.classList.remove('error');
            expressionEl.textContent = '';
        }, 2000);
        return;
    }
    if (!multdivProblem) {
        return;
    }
    const solutionEl = document.getElementById('multdivSolutionText');
    if (solutionEl) {
        const answerText = Number.isInteger(multdivAnswer) ? multdivAnswer.toString() : multdivAnswer.toFixed(2);
        solutionEl.textContent = `${multdivProblem.expression}${answerText}`;
        document.getElementById('multdivSolution').style.display = 'block';
    }
}

function resetMultdivGame() {
    multdivStartTime = Date.now();
    renderMultdivNumbers();
    renderCounter('multdiv');
    window.startTimer();
}

// ===================== 乘除法事件绑定 =====================
function setupMultdivEventListeners() {
    document.querySelectorAll('#multdivSection .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#multdivSection .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            multdivDifficulty = btn.dataset.level;
            resetMultdivGame();
        });
    });
}

// ===================== 样式注入 =====================
export function injectArithmeticStyle() {
    if (document.getElementById('arithmetic-style')) return;
    const style = document.createElement('style');
    style.id = 'arithmetic-style';
    style.textContent = ARITHMETIC_CSS;
    document.head.appendChild(style);
}

// ===================== HTML 渲染 =====================
export function renderArithmeticHTML() {
    return ARITHMETIC_HTML;
}

// ===================== 乘法口诀表生成 =====================
function generateMultiplicationTable() {
    const table = document.getElementById('multiplicationTable');
    if (!table) return;

    let html = '<thead><tr><th>×</th>';
    for (let i = 1; i <= 19; i++) {
        html += `<th>${i}</th>`;
    }
    html += '</tr></thead><tbody>';

    for (let row = 1; row <= 19; row++) {
        html += `<tr><td>${row}</td>`;
        for (let col = 1; col <= 19; col++) {
            html += `<td>${row * col}</td>`;
        }
        html += '</tr>';
    }
    html += '</tbody>';

    table.innerHTML = html;
}

// ===================== 初始化 =====================
let arithmeticListenersSetup = false;
export function initArithmetic() {
    if (!arithmeticListenersSetup) {
        setupAddsubEventListeners();
        setupMultdivEventListeners();
        arithmeticListenersSetup = true;
    }
    // 页面加载时自动初始化两个页面的计数器显示（原 DOMContentLoaded 逻辑）
    renderCounter('point24');
    renderCounter('multdiv');
    // 默认进入加减法模式
    switchArithmeticMode('addsub');
    // 生成乘法口诀表
    generateMultiplicationTable();
}

// ===================== 挂载到 window（供 onclick 调用）=====================
if (typeof window !== 'undefined') {
    window.switchArithmeticMode = switchArithmeticMode;
    window.appendPoint24Number = appendPoint24Number;
    window.clearPoint24Expression = clearPoint24Expression;
    window.checkPoint24Answer = checkPoint24Answer;
    window.showPoint24Solution = showPoint24Solution;
    window.resetPoint24Game = resetPoint24Game;
    window.appendMultdivNumber = appendMultdivNumber;
    window.clearMultdivExpression = clearMultdivExpression;
    window.checkMultdivAnswer = checkMultdivAnswer;
    window.showMultdivSolution = showMultdivSolution;
    window.resetMultdivGame = resetMultdivGame;
    // 计数器重置由 schulte.js 提供，这里同样挂载一份确保 onclick 可用
    window.confirmResetCounter = confirmResetCounter;
}

// ===================== CSS 文本 =====================
const ARITHMETIC_CSS = `
        /* 四则运算数字键盘样式 */
        .magic-num-pad {
            display: flex;
            justify-content: center;
            gap: 12px;
            margin: 25px 0;
            flex-wrap: wrap;
        }

        .num-btn {
            width: 70px;
            height: 70px;
            border: 2px solid #e2e8f0;
            background: white;
            border-radius: 12px;
            font-size: 28px;
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

        /* 乘法口诀表样式 */
        .multiplication-table-wrapper {
            overflow-x: auto;
            overflow-y: auto;
            max-height: 500px;
            padding: 10px;
            background: #faf5ff;
            border-radius: 12px;
        }

        .multiplication-table {
            border-collapse: collapse;
            margin: 0 auto;
            font-size: 12px;
        }

        .multiplication-table th,
        .multiplication-table td {
            width: 45px;
            height: 35px;
            text-align: center;
            vertical-align: middle;
            border: 1px solid #e2e8f0;
            font-weight: 500;
        }

        .multiplication-table th {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            font-weight: 600;
            font-size: 14px;
            position: sticky;
            top: 0;
            z-index: 1;
        }

        .multiplication-table td:first-child {
            background: linear-gradient(135deg, #8b5cf6, #ec4899);
            color: white;
            font-weight: 600;
            font-size: 14px;
            position: sticky;
            left: 0;
            z-index: 1;
        }

        .multiplication-table th:first-child {
            background: #7c3aed;
            font-size: 16px;
        }

        .multiplication-table td {
            background: white;
            color: #333;
        }

        .multiplication-table td:nth-child(odd):not(:first-child) {
            background: #faf5ff;
        }

        .multiplication-table tr:nth-child(odd) td:not(:first-child) {
            background: #faf5ff;
        }

        .multiplication-table td:hover:not(:first-child) {
            background: #ede9fe;
            color: #7c3aed;
            font-weight: 600;
        }

        /* 24点游戏样式 */
        .point-24-numbers {
            display: flex;
            justify-content: center;
            gap: 20px;
            margin: 30px 0;
            flex-wrap: wrap;
        }

        .number-card {
            width: 80px;
            height: 100px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 40px;
            font-weight: bold;
            border-radius: 15px;
            box-shadow: 0 5px 20px rgba(102, 126, 234, 0.4);
            cursor: pointer;
            transition: all 0.3s ease;
        }

        .number-card:hover {
            transform: scale(1.05);
        }

        .number-card.selected {
            border: 4px solid #fbbf24;
            box-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }

        .point-24-display {
            text-align: center;
            margin: 20px 0;
        }

        .point-24-display > div {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 70px;
            padding: 8px 15px;
        }

        .point-24-display > div > span:first-child {
            font-size: 32px;
            font-weight: bold;
            color: #1a1a1a;
        }

        .point-24-display .expression {
            font-size: 32px;
            font-weight: bold;
            color: #667eea;
            height: 50px;
            min-height: 50px;
            max-height: 50px;
            padding: 0 15px;
            background: #f8fafc;
            border-radius: 12px;
            border: 2px solid #e2e8f0;
            margin-bottom: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            overflow: hidden;
        }

        .point-24-display .expression.error {
            border-color: #ef4444;
            color: #ef4444;
        }

        .point-24-display .expression.success {
            border-color: #22c55e;
            color: #22c55e;
        }

        .point-24-ops {
            display: flex;
            justify-content: center;
            gap: 15px;
            margin: 20px 0;
        }

        .op-btn {
            width: 60px;
            height: 60px;
            border: 3px solid #e2e8f0;
            background: white;
            border-radius: 12px;
            font-size: 28px;
            font-weight: bold;
            cursor: pointer;
            transition: all 0.2s ease;
            color: #667eea;
        }

        .op-btn:hover {
            border-color: #667eea;
            background: #f0f5ff;
        }

        .point-24-hint {
            text-align: center;
            color: #64748b;
            font-size: 14px;
            margin-top: 15px;
        }

        .solution-display {
            background: #f0f5ff;
            padding: 20px;
            border-radius: 12px;
            margin-top: 20px;
            text-align: center;
        }

        .solution-display h4 {
            color: #667eea;
            margin-bottom: 15px;
        }

        .solution-display .solution {
            font-size: 18px;
            color: #1e293b;
            font-family: monospace;
        }
`;

// ===================== HTML 文本 =====================
const ARITHMETIC_HTML = `
        <!-- 四则运算游戏页面（加减法 + 乘除法合并） -->
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="gradient-header">
                <h1>🧮 四则运算</h1>
                <p>练习加减乘除，使用数字按钮输入答案</p>
            </div>
            <!-- 模式切换：加减法 / 乘除法 -->
            <div class="difficulty-selector" id="arithmeticModeSelector" style="margin-bottom: 20px;">
                <button class="diff-btn active" data-mode="addsub" onclick="switchArithmeticMode('addsub')">➕➖ 加减法</button>
                <button class="diff-btn" data-mode="multdiv" onclick="switchArithmeticMode('multdiv')">✖️➗ 乘除法</button>
            </div>
            <!-- 加减法区块 -->
            <div id="addsubSection">
            <div class="game-container">
                <div class="difficulty-selector">
                    <button class="diff-btn active" data-level="easy">初级</button>
                    <button class="diff-btn" data-level="medium">中级</button>
                    <button class="diff-btn" data-level="hard">高级</button>
                </div>
                <div class="point-24-display" style="margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 36px; padding: 10px 20px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 80px;">
                        <span id="point24Problem"></span>
                        <span class="expression" id="point24Expression"></span>
                    </div>
                </div>
                <div id="point24Tip" class="tip-panel">
                    <p id="point24TipText"></p>
                </div>
                <div class="magic-num-pad" id="point24NumPad"></div>
                <div id="point24Solution" class="solution-display" style="display:none;">
                    <h4>正确答案:</h4>
                    <div class="solution" id="solutionText"></div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="resetPoint24Game()">下一题</button>
                    <button class="action-btn solve" onclick="showPoint24Solution()">显示答案</button>
                    <button class="action-btn check" onclick="checkPoint24Answer()">提交答案</button>
                </div>
                <div class="counter-panel">
                    <div class="counter-items">
                        <div class="counter-item correct"><span class="counter-label">正确：</span><span id="point24CorrectCount">0</span></div>
                        <div class="counter-item wrong"><span class="counter-label">错误：</span><span id="point24WrongCount">0</span></div>
                        <button class="counter-reset-btn" onclick="confirmResetCounter('point24')">🔄 重置</button>
                    </div>
                </div>
                <div class="game-rules" style="margin-top: 20px;">
                    <h4>📚 加减法速算技巧教程</h4>
                    <div style="text-align: left; line-height: 1.8; font-size: 14px; color: #333;">
                        <p><strong>【加法速算八大技巧】</strong></p>
                        <p><strong>1. 凑整法（最万能）</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：看大数，拆小数，先凑整，再加余。</p>
                        <p style="margin-left: 15px; color: #666;">例：28 + 15 = 28 + 2 + 13 = 30 + 13 = 43</p>
                        <p><strong>2. 多加要减去</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：接近整数先凑整，多加几，减几。</p>
                        <p style="margin-left: 15px; color: #666;">例：36 + 19 = 36 + 20 - 1 = 55</p>
                        <p><strong>3. 互补数先加</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：1找9，2找8，3找7，4找6，5找5。</p>
                        <p style="margin-left: 15px; color: #666;">例：36 + 24 = 60（个位6+4=10）</p>
                        <p><strong>4. 拆分分组法</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：十位加十位，个位加个位，最后合并。</p>
                        <p style="margin-left: 15px; color: #666;">例：56 + 37 = 50+30 + 6+7 = 80 + 13 = 93</p>
                        <p><strong>5. 找朋友法</strong></p>
                        <p style="margin-left: 15px; color: #666;">+9=+10-1，例：25 + 9 = 25 + 10 - 1 = 34</p>
                        <p><strong>6. 基准数法</strong></p>
                        <p style="margin-left: 15px; color: #666;">两个数相近时使用，例：98 + 95 = 95×2 + 3 = 193</p>
                        <p><br><strong>【减法速算八大技巧】</strong></p>
                        <p><strong>1. 凑整减法（最常用）</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：减数凑整数，多减几，加几。</p>
                        <p style="margin-left: 15px; color: #666;">例：53 - 19 = 53 - 20 + 1 = 34</p>
                        <p><strong>2. 拆分减数减法</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：先减整，再减零。</p>
                        <p style="margin-left: 15px; color: #666;">例：72 - 36 = 72 - 30 - 6 = 36</p>
                        <p><strong>3. 同尾数相减秒杀</strong></p>
                        <p style="margin-left: 15px; color: #666;">个位相同直接抵消，例：86 - 26 = 60</p>
                        <p><strong>4. 退位减法</strong></p>
                        <p style="margin-left: 15px; color: #666;">口诀：个位不够十位凑，十位借1当作10。</p>
                        <p style="margin-left: 15px; color: #666;">例：62 - 38 = 24（个位12-8=4，十位5-3=2）</p>
                        <p><strong>5. 找朋友法</strong></p>
                        <p style="margin-left: 15px; color: #666;">-9=-10+1，例：75 - 19 = 75 - 20 + 1 = 56</p>
                        <p><strong>6. 补差减法</strong></p>
                        <p style="margin-left: 15px; color: #666;">两个数接近时直接算差距，例：91 - 87 = 4</p>
                        <p><strong>7. 连减变减和</strong></p>
                        <p style="margin-left: 15px; color: #666;">a-b-c = a-(b+c)，例：135 - 27 - 73 = 135 - 100 = 35</p>
                        <p><strong>8. 百位减法速算</strong></p>
                        <p style="margin-left: 15px; color: #666;">例：500 - 246 = 254（百位5-1-2=2，十位9-4=5，个位10-6=4）</p>
                    </div>
                </div>
            </div>
            </div>

            <!-- 乘除法区块 -->
            <div id="multdivSection" style="display:none;">
            <div class="game-container">
                <div class="difficulty-selector">
                    <button class="diff-btn active" data-level="easy">初级</button>
                    <button class="diff-btn" data-level="medium">中级</button>
                    <button class="diff-btn" data-level="hard">高级</button>
                </div>
                <div class="point-24-display" style="margin-bottom: 20px; text-align: center;">
                    <div style="font-size: 36px; padding: 10px 20px; display: inline-flex; align-items: center; justify-content: center; gap: 10px; min-height: 80px;">
                        <span id="multdivProblem"></span>
                        <span class="expression" id="multdivExpression"></span>
                    </div>
                    <div id="multdivTip" class="tip-panel">
                        <p id="multdivTipText"></p>
                    </div>
                </div>
                <div class="magic-num-pad" id="multdivNumPad"></div>
                <div id="multdivSolution" class="solution-display" style="display:none;">
                    <h4>正确答案:</h4>
                    <div class="solution" id="multdivSolutionText"></div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" onclick="resetMultdivGame()">下一题</button>
                    <button class="action-btn solve" onclick="showMultdivSolution()">显示答案</button>
                    <button class="action-btn check" onclick="checkMultdivAnswer()">提交答案</button>
                </div>
                <div class="counter-panel">
                    <div class="counter-items">
                        <div class="counter-item correct"><span class="counter-label">正确：</span><span id="multdivCorrectCount">0</span></div>
                        <div class="counter-item wrong"><span class="counter-label">错误：</span><span id="multdivWrongCount">0</span></div>
                        <button class="counter-reset-btn" onclick="confirmResetCounter('multdiv')">🔄 重置</button>
                    </div>
                </div>
                <div class="game-rules" style="margin-top: 20px;">
                    <h4>📚 乘除法速算技巧教程</h4>
                    <div style="text-align: left; line-height: 1.8; font-size: 14px; color: #333;">
                        <p><strong>一、乘法凑整法</strong></p>
                        <p>• 利用10、100、1000等整十整百数简化计算。</p>
                        <p style="margin-left: 15px; color: #666;">例：12 × 25 = 3 × (4 × 25) = 3 × 100 = 300</p>
                        <p><strong>二、分解因数法</strong></p>
                        <p>• 把一个数分解成容易计算的因数。</p>
                        <p style="margin-left: 15px; color: #666;">例：36 × 15 = 36 × (3 × 5) = 108 × 5 = 540</p>
                        <p><strong>三、乘法分配律</strong></p>
                        <p>• 利用(a+b)×c = a×c + b×c简化计算。</p>
                        <p style="margin-left: 15px; color: #666;">例：99 × 7 = (100 - 1) × 7 = 700 - 7 = 693</p>
                        <p><strong>四、除法凑整法</strong></p>
                        <p>• 被除数和除数同时扩大相同倍数，商不变。</p>
                        <p style="margin-left: 15px; color: #666;">例：350 ÷ 25 = (350 × 4) ÷ (25 × 4) = 1400 ÷ 100 = 14</p>
                        <p><strong>五、除法拆分法</strong></p>
                        <p>• 把除数拆分成因数，转化为连除。</p>
                        <p style="margin-left: 15px; color: #666;">例：48 ÷ 12 = 48 ÷ (4 × 3) = 48 ÷ 4 ÷ 3 = 4</p>
                        <p><strong>六、分数与小数互转</strong></p>
                        <p>• 熟悉常见分数与小数的转换。</p>
                        <p style="margin-left: 15px; color: #666;">例：0.25 = 1/4，0.5 = 1/2，0.75 = 3/4</p>
                    </div>
                </div>
            </div>
            </div>

            <!-- 乘法口诀表区块 -->
            <div class="game-container" id="multiplicationTableSection">
                <h3 style="text-align: center; color: #7c3aed; margin-bottom: 20px; font-size: 24px;">📐 19×19乘法口诀表</h3>
                <div class="multiplication-table-wrapper">
                    <table class="multiplication-table" id="multiplicationTable">
                    </table>
                </div>
            </div>
`;
