import { startTimer, stopTimer, incrementCounter, renderCounter } from './utils.js';

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
        for (let attempt = 0; attempt < 100; attempt++) {
            const ops = ['+', '-', '×', '÷'];
            num1 = Math.floor(Math.random() * 50) + 1;
            num2 = Math.floor(Math.random() * 20) + 1;
            num3 = Math.floor(Math.random() * 20) + 1;
            operator1 = ops[Math.floor(Math.random() * 4)];
            operator2 = ops[Math.floor(Math.random() * 4)];

            if (operator1 === '÷') {
                const d1 = Math.floor(Math.random() * 10) + 1;
                const q1 = Math.floor(Math.random() * 10) + 1;
                num1 = q1 * d1;
                num2 = d1;
            }
            if (operator2 === '÷') {
                const d2 = Math.floor(Math.random() * 10) + 1;
                const q2 = Math.floor(Math.random() * 10) + 1;
                num2 = q2 * d2;
                num3 = d2;
            }

            let step1, step2, result;

            const priority = { '+': 1, '-': 1, '×': 2, '÷': 2 };
            const p1 = priority[operator1];
            const p2 = priority[operator2];

            if (p2 > p1) {
                if (operator2 === '+') step1 = num2 + num3;
                else if (operator2 === '-') step1 = num2 - num3;
                else if (operator2 === '×') step1 = num2 * num3;
                else if (operator2 === '÷') step1 = num2 / num3;

                if (operator1 === '+') result = num1 + step1;
                else if (operator1 === '-') result = num1 - step1;
                else if (operator1 === '×') result = num1 * step1;
                else if (operator1 === '÷') result = num1 / step1;
            } else {
                if (operator1 === '+') step1 = num1 + num2;
                else if (operator1 === '-') step1 = num1 - num2;
                else if (operator1 === '×') step1 = num1 * num2;
                else if (operator1 === '÷') step1 = num1 / num2;

                if (operator2 === '+') result = step1 + num3;
                else if (operator2 === '-') result = step1 - num3;
                else if (operator2 === '×') result = step1 * num3;
                else if (operator2 === '÷') {
                    if (step1 % num3 !== 0) continue;
                    result = step1 / num3;
                }
            }

            if (result !== undefined && result > 0 && Number.isInteger(result)) {
                answer = result;
                return {
                    expression: `${num1} ${operator1} ${num2} ${operator2} ${num3} = `,
                    answer: answer
                };
            }
        }

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
    
    const clearBtn = document.createElement('button');
    clearBtn.className = 'num-btn clear-btn';
    clearBtn.textContent = '×';
    clearBtn.addEventListener('click', clearMultdivExpression);
    pad.appendChild(clearBtn);
}

function appendMultdivNumber(num) {
    hideMultdivResult();
    multdivExpression += num;
    document.getElementById('multdivExpression').textContent = multdivExpression;
}

function clearMultdivExpression() {
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
        stopTimer();
        setTimeout(() => {
            resetMultdivGame();
        }, 2000);
    } else {
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = '✗ 错误';
        incrementCounter('multdiv', 'wrong');
        multdivExpression = '';
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
    startTimer();
}

document.querySelectorAll('#multdivPage .diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#multdivPage .diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        multdivDifficulty = btn.dataset.level;
        resetMultdivGame();
    });
});

export { resetMultdivGame, showMultdivSolution, checkMultdivAnswer };
