import { startTimer, stopTimer, incrementCounter, renderCounter } from './utils.js';

let point24Difficulty = 'easy';
let point24Answer = 0;
let point24Expression = '';
let point24StartTime = 0;
let currentProblem = null;

const point24CountdownConfig = {
    easy: 2,
    medium: 3,
    hard: 5
};

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
        num1 = Math.floor(Math.random() * 90) + 10;
        num2 = Math.floor(Math.random() * 90) + 10;
        operator = Math.random() > 0.5 ? '+' : '-';
        if (operator === '-' && num1 < num2) {
            [num1, num2] = [num2, num1];
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
        const roundNum1 = Math.ceil(num1 / 10) * 10;
        const roundNum2 = Math.ceil(num2 / 10) * 10;
        const diff1 = roundNum1 - num1;
        const diff2 = roundNum2 - num2;
        
        if (diff1 > 0 && diff1 <= 5 && num1 >= 10) {
            tips.push(`【凑整法】${num1}离${roundNum1}差${diff1}，把${num2}拆成${diff1}+${num2-diff1}，先算${num1}+${diff1}=${roundNum1}，再加上${num2-diff1}`);
        } else if (diff2 > 0 && diff2 <= 5 && num2 >= 10) {
            tips.push(`【凑整法】${num2}离${roundNum2}差${diff2}，把${num1}拆成${diff2}+${num1-diff2}，先算${num2}+${diff2}=${roundNum2}，再加上${num1-diff2}`);
        }

        if (num2 === 9 || num2 === 19 || num2 === 29 || num2 === 99 || num2 === 199) {
            const round = Math.ceil(num2 / 10) * 10;
            const over = round - num2;
            tips.push(`【多加要减去】${num2}接近${round}，先算${num1}+${round}，多加了${over}，再减去${over}`);
        } else if (num1 === 9 || num1 === 19 || num1 === 29 || num1 === 99 || num1 === 199) {
            const round = Math.ceil(num1 / 10) * 10;
            const over = round - num1;
            tips.push(`【多加要减去】${num1}接近${round}，先算${round}+${num2}，多加了${over}，再减去${over}`);
        }

        if (remainder1 + remainder2 === 10) {
            tips.push(`【互补数先加】${remainder1}找${remainder2}凑10！个位凑成10后，十位相加更简单`);
        }

        if (num1 >= 10 && num2 >= 10) {
            tips.push(`【拆分分组法】十位加十位：${tens1}+${tens2}，个位加个位：${remainder1}+${remainder2}，最后合并`);
        }

        if (remainder2 === 9) {
            tips.push(`【找朋友法】个位是9，+9可以变成+10-1，这样更好算`);
        } else if (remainder1 === 9) {
            tips.push(`【找朋友法】个位是9，+9可以变成+10-1，这样更好算`);
        }

        if (Math.abs(num1 - num2) <= 10 && num1 >= 50) {
            tips.push(`【基准数法】${num1}和${num2}很接近，以较小的数为基准再调整`);
        }

        if (num1 < 10 && num2 < 10) {
            if (remainder1 + remainder2 === 10) {
                tips.push(`【凑十法】${remainder1}+${remainder2}=10，凑成整十更简单`);
            } else {
                tips.push(`【直接相加】个位直接相加即可`);
            }
        }

    } else {
        const roundNum = Math.ceil(num2 / 10) * 10;
        const diff = roundNum - num2;
        if (diff > 0 && diff <= 5 && num2 >= 10) {
            tips.push(`【凑整减法】${num2}接近${roundNum}，先算${num1}-${roundNum}，多减了${diff}，再加回${diff}`);
        }

        if (num2 >= 10 && num2 < 100) {
            tips.push(`【拆分减数】把${num2}拆成${tens2}+${remainder2}，先减整十，再减个位`);
        }

        if (remainder1 === remainder2) {
            tips.push(`【同尾数相减】个位都是${remainder1}，直接抵消，只需算十位`);
        }

        if (remainder1 < remainder2) {
            tips.push(`【退位减法】个位${remainder1}<${remainder2}不够减，十位借1当10，个位变成${remainder1+10}再减`);
        }

        if (remainder1 >= remainder2) {
            tips.push(`【直接相减】个位够减直接相减，十位相减，最后合并`);
        }

        if (num1 - num2 < 10 && num1 > num2) {
            tips.push(`【补差减法】${num1}和${num2}很接近，直接算差距即可`);
        }

        if (remainder2 === 9 && num2 >= 9) {
            tips.push(`【找朋友法】个位是9，减9可以变成减10加1，这样更好算`);
        }

        if (num1 % 100 === 0 && num2 < num1) {
            tips.push(`【百位减法】整百数减小数，百位减1作补偿，十位和个位用补数`);
        }
    }

    if (tips.length === 0) {
        if (operator === '+') {
            tips.push(`从个位开始加起${remainder1+remainder2>=10?'，满十要进一':''}`);
        } else {
            tips.push(`从个位开始减起${remainder1<remainder2?'，不够减要借位':''}`);
        }
    }

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
    point24Expression += num;
    document.getElementById('point24Expression').textContent = point24Expression;
}

function clearPoint24Expression() {
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
        stopTimer();
        setTimeout(() => {
            resetPoint24Game();
        }, 2000);
    } else {
        expressionEl.classList.remove('success');
        expressionEl.classList.add('error');
        expressionEl.textContent = '✗ 错误';
        incrementCounter('point24', 'wrong');
        point24Expression = '';
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
    startTimer();
}

document.querySelectorAll('#point24Page .diff-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('#point24Page .diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        point24Difficulty = btn.dataset.level;
        resetPoint24Game();
    });
});

export { resetPoint24Game, showPoint24Solution, checkPoint24Answer };
