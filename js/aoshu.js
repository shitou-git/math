let aoshuCurrentLevel = 'easy';
let aoshuCurrentIndex = 0;
let aoshuQuestions = [];

const aoshuQuestionBank = {
    easy: [
        {
            question: '凑整速算：99 + 99 + 99 + 3 = ?',
            hint: '观察算式，99接近100，可以把3拆成3个1，分别和99凑成100。',
            answer: '300',
            solution: '99 + 99 + 99 + 3\n= (99 + 1) + (99 + 1) + (99 + 1)\n= 100 + 100 + 100\n= 300'
        },
        {
            question: '找规律：2，5，8，11，( ? )，17',
            hint: '这是一个等差数列，相邻两个数的差是3。',
            answer: '14',
            solution: '观察数列：2，5，8，11，？，17\n5 - 2 = 3\n8 - 5 = 3\n11 - 8 = 3\n规律：后一个数比前一个数大3\n所以：11 + 3 = 14\n验证：14 + 3 = 17 ✓'
        },
        {
            question: '植树问题：一条路100米，每5米栽1棵（两端都栽），一共栽多少棵树？',
            hint: '两端都栽树时，棵数 = 间隔数 + 1。先算有多少个间隔。',
            answer: '21棵',
            solution: '路长100米，每5米一个间隔\n间隔数 = 100 ÷ 5 = 20个\n两端都栽树：棵数 = 间隔数 + 1\n所以：20 + 1 = 21棵'
        },
        {
            question: '和差问题：两数之和是20，两数之差是6，求这两个数分别是多少？',
            hint: '大数 = (和 + 差) ÷ 2，小数 = (和 - 差) ÷ 2',
            answer: '13和7',
            solution: '设大数为A，小数为B\nA + B = 20\nA - B = 6\n两式相加：2A = 26，A = 13\n两式相减：2B = 14，B = 7\n所以这两个数是13和7\n验证：13 + 7 = 20 ✓，13 - 7 = 6 ✓'
        },
        {
            question: '蜗牛爬井：蜗牛在10米深井底，白天爬4米，晚上滑2米，几天能爬到井口？',
            hint: '最后一天白天爬到井口就不会下滑了，先算最后一天之前需要爬多少米。',
            answer: '4天',
            solution: '最后一天白天爬4米就能到井口，所以之前需要爬：\n10 - 4 = 6米\n实际每天净爬：4 - 2 = 2米\n爬6米需要：6 ÷ 2 = 3天\n加上最后1天：3 + 1 = 4天\n\n验证：\n第1天结束：4 - 2 = 2米\n第2天结束：2 + 4 - 2 = 4米\n第3天结束：4 + 4 - 2 = 6米\n第4天白天：6 + 4 = 10米 ✓'
        }
    ],
    medium: [
        {
            question: '鸡兔同笼：鸡和兔共6只，共16条腿，问鸡和兔各几只？',
            hint: '假设全是鸡，算出腿数差，每只兔比鸡多2条腿。',
            answer: '鸡4只，兔2只',
            solution: '假设6只全是鸡，腿数：6 × 2 = 12条\n实际多了：16 - 12 = 4条腿\n每只兔比鸡多：4 - 2 = 2条腿\n兔的数量：4 ÷ 2 = 2只\n鸡的数量：6 - 2 = 4只\n\n验证：4 × 2 + 2 × 4 = 8 + 8 = 16条 ✓'
        },
        {
            question: '年龄问题：小明今年8岁，爸爸32岁，几年后爸爸年龄是小明的3倍？',
            hint: '年龄差不变。先算年龄差，再用差倍问题公式。',
            answer: '4年后',
            solution: '年龄差：32 - 8 = 24岁\n爸爸年龄是小明3倍时，年龄差是小明年龄的2倍\n那时小明年龄：24 ÷ (3 - 1) = 12岁\n需要：12 - 8 = 4年\n\n验证：4年后小明12岁，爸爸36岁\n36 ÷ 12 = 3 ✓'
        },
        {
            question: '抽屉原理：把4支铅笔放进3个笔筒，至少有一个笔筒里有几支铅笔？',
            hint: '平均分配，先每个笔筒放1支，剩下的1支无论放哪个笔筒。',
            answer: '2支',
            solution: '把4支铅笔放进3个笔筒\n先平均分：每个笔筒放1支，共放了3支\n还剩：4 - 3 = 1支\n剩下的1支无论放进哪个笔筒\n那个笔筒就有：1 + 1 = 2支\n\n所以至少有一个笔筒里有2支铅笔'
        },
        {
            question: '速算：1 + 2 + 3 + 4 + ... + 9 + 10 = ?',
            hint: '首尾配对相加，1+10=11，2+9=11，一共几对？',
            answer: '55',
            solution: '1 + 2 + 3 + ... + 10\n= (1 + 10) + (2 + 9) + (3 + 8) + (4 + 7) + (5 + 6)\n= 11 × 5\n= 55\n\n公式：等差数列求和 = (首项 + 末项) × 项数 ÷ 2\n= (1 + 10) × 10 ÷ 2\n= 11 × 5\n= 55'
        },
        {
            question: '周期问题：有一列数按"1，3，5，7，1，3，5，7..."排列，第25个数是几？',
            hint: '找出周期长度，用25除以周期，看余数是多少。',
            answer: '1',
            solution: '观察数列：1，3，5，7，1，3，5，7...\n周期长度：4（1，3，5，7循环）\n25 ÷ 4 = 6 余 1\n余数是1，说明第25个数是周期中的第1个数\n所以第25个数是1'
        }
    ],
    hard: [
        {
            question: '盈亏问题：小朋友分苹果，每人分3个多16个，每人分5个少4个，有几个小朋友？多少个苹果？',
            hint: '每人多分2个，不仅把多的16个分完，还少4个，说明需要多分20个。',
            answer: '10个小朋友，46个苹果',
            solution: '每人分3个 → 多16个\n每人分5个 → 少4个\n每人多分：5 - 3 = 2个\n总共多分：16 + 4 = 20个\n小朋友人数：20 ÷ 2 = 10人\n苹果数：10 × 3 + 16 = 46个\n\n验证：10 × 5 - 4 = 46个 ✓'
        },
        {
            question: '行程问题：甲乙两人从相距24千米的两地同时出发相向而行，甲每小时走6千米，乙每小时走4千米，几小时后相遇？',
            hint: '相遇时间 = 总路程 ÷ 速度和',
            answer: '2.4小时',
            solution: '相遇问题公式：\n相遇时间 = 总路程 ÷ 速度和\n\n甲速度：6千米/小时\n乙速度：4千米/小时\n速度和：6 + 4 = 10千米/小时\n总路程：24千米\n\n相遇时间：24 ÷ 10 = 2.4小时\n\n验证：2.4小时甲走了 6 × 2.4 = 14.4千米\n2.4小时乙走了 4 × 2.4 = 9.6千米\n14.4 + 9.6 = 24千米 ✓'
        },
        {
            question: '逻辑推理：小明、小红、小刚三人中，有一人是班长。已知：(1)小明不是班长；(2)小红不是班长；(3)小刚说真话。请问谁是班长？',
            hint: '排除法，小明和小红都不是班长，剩下的就是。',
            answer: '小刚是班长',
            solution: '已知条件：\n1. 小明不是班长\n2. 小红不是班长\n3. 小刚说真话（条件可信）\n\n三人中必有一人是班长\n小明不是，小红不是\n所以班长只能是小刚'
        },
        {
            question: '图形计数：下图中有多少个长方形？（3行3列的网格）',
            hint: '长方形由两条横线和两条竖线组成。横线上选2条，竖线上选2条。',
            answer: '36个',
            solution: '3行3列的网格，有4条横线，4条竖线\n选2条横线的组合数：C(4,2) = 4×3÷2 = 6\n选2条竖线的组合数：C(4,2) = 4×3÷2 = 6\n长方形总数：6 × 6 = 36个\n\n公式：m行n列的网格中\n长方形数 = C(m+1,2) × C(n+1,2)'
        },
        {
            question: '平均数问题：小明语文、数学、英语三科平均分是92分，语文90分，数学95分，英语多少分？',
            hint: '先算总分，再减去语文和数学的分数。',
            answer: '91分',
            solution: '三科平均分：92分\n三科总分：92 × 3 = 276分\n语文：90分\n数学：95分\n\n英语分数 = 总分 - 语文 - 数学\n= 276 - 90 - 95\n= 276 - 185\n= 91分\n\n验证：(90 + 95 + 91) ÷ 3 = 276 ÷ 3 = 92分 ✓'
        }
    ]
};

export function getAoshuHtml() {
    return `
        <div id="aoshuPage" class="game-page">
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="header">
                <h1>🧮 奥数题库</h1>
                <p>拓展思维，挑战奥数难题</p>
            </div>
            <div class="game-container">
                <div class="difficulty-selector">
                    <button class="diff-btn active" data-level="easy">初级</button>
                    <button class="diff-btn" data-level="medium">中级</button>
                    <button class="diff-btn" data-level="hard">高级</button>
                </div>
                <div class="aoshu-progress" style="text-align: center; color: #64748b; margin-bottom: 20px;">
                    第 <span id="aoshuCurrent">1</span> / <span id="aoshuTotal">5</span> 题
                </div>
                <div class="aoshu-question" id="aoshuQuestion" style="background: #f8fafc; border-radius: 12px; padding: 25px; margin-bottom: 20px; border-left: 4px solid #667eea;">
                    <h3 style="color: #1e293b; margin-bottom: 15px; font-size: 20px;">📝 题目</h3>
                    <p id="aoshuQuestionText" style="font-size: 18px; line-height: 1.8; color: #334155; white-space: pre-line;"></p>
                </div>
                <div class="aoshu-hint" id="aoshuHint" style="margin-bottom: 20px;">
                    <button class="hint-toggle-btn" id="hintToggleBtn" style="width: 100%; padding: 12px 20px; background: #fef3c7; border: none; border-radius: 10px; color: #92400e; font-size: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>💡 解题思路</span>
                        <span id="hintIcon">▼</span>
                    </button>
                    <div id="hintContent" style="display: none; background: #fffbeb; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #fde68a; border-top: none;">
                        <p id="aoshuHintText" style="line-height: 1.8; color: #78350f; white-space: pre-line;"></p>
                    </div>
                </div>
                <div class="aoshu-answer" id="aoshuAnswer" style="margin-bottom: 20px;">
                    <button class="answer-toggle-btn" id="answerToggleBtn" style="width: 100%; padding: 12px 20px; background: #dcfce7; border: none; border-radius: 10px; color: #166534; font-size: 16px; cursor: pointer; display: flex; justify-content: space-between; align-items: center;">
                        <span>✅ 答案与详解</span>
                        <span id="answerIcon">▼</span>
                    </button>
                    <div id="answerContent" style="display: none; background: #f0fdf4; padding: 20px; border-radius: 0 0 10px 10px; border: 1px solid #bbf7d0; border-top: none;">
                        <h4 style="color: #15803d; margin-bottom: 10px;">答案：<span id="aoshuAnswerText"></span></h4>
                        <div style="margin-top: 15px;">
                            <h4 style="color: #166534; margin-bottom: 10px;">📖 详细解答</h4>
                            <p id="aoshuSolutionText" style="line-height: 1.8; color: #14532d; white-space: pre-line; font-family: monospace; background: white; padding: 15px; border-radius: 8px;"></p>
                        </div>
                    </div>
                </div>
                <div class="action-buttons">
                    <button class="action-btn" id="aoshuPrevBtn">⬅️ 上一题</button>
                    <button class="action-btn" id="aoshuNextBtn">下一题 ➡️</button>
                </div>
            </div>
        </div>
    `;
}

export function initAoshu() {
    setupAoshuEventListeners();
    loadAoshuLevel('easy');
}

function setupAoshuEventListeners() {
    document.querySelectorAll('#aoshuPage .diff-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('#aoshuPage .diff-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            aoshuCurrentLevel = btn.dataset.level;
            loadAoshuLevel(aoshuCurrentLevel);
        });
    });

    document.getElementById('hintToggleBtn').addEventListener('click', toggleAoshuHint);
    document.getElementById('answerToggleBtn').addEventListener('click', toggleAoshuAnswer);
    document.getElementById('aoshuPrevBtn').addEventListener('click', aoshuPrevQuestion);
    document.getElementById('aoshuNextBtn').addEventListener('click', aoshuNextQuestion);
}

function loadAoshuLevel(level) {
    aoshuQuestions = aoshuQuestionBank[level] || [];
    aoshuCurrentIndex = 0;
    closeAoshuHint();
    closeAoshuAnswer();
    renderAoshuQuestion();
}

function renderAoshuQuestion() {
    if (aoshuQuestions.length === 0) return;
    
    const question = aoshuQuestions[aoshuCurrentIndex];
    document.getElementById('aoshuCurrent').textContent = aoshuCurrentIndex + 1;
    document.getElementById('aoshuTotal').textContent = aoshuQuestions.length;
    document.getElementById('aoshuQuestionText').textContent = question.question;
    document.getElementById('aoshuHintText').textContent = question.hint;
    document.getElementById('aoshuAnswerText').textContent = question.answer;
    document.getElementById('aoshuSolutionText').textContent = question.solution;
}

function toggleAoshuHint() {
    const content = document.getElementById('hintContent');
    const icon = document.getElementById('hintIcon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

function closeAoshuHint() {
    document.getElementById('hintContent').style.display = 'none';
    document.getElementById('hintIcon').textContent = '▼';
}

function toggleAoshuAnswer() {
    const content = document.getElementById('answerContent');
    const icon = document.getElementById('answerIcon');
    if (content.style.display === 'none') {
        content.style.display = 'block';
        icon.textContent = '▲';
    } else {
        content.style.display = 'none';
        icon.textContent = '▼';
    }
}

function closeAoshuAnswer() {
    document.getElementById('answerContent').style.display = 'none';
    document.getElementById('answerIcon').textContent = '▼';
}

function aoshuPrevQuestion() {
    if (aoshuCurrentIndex > 0) {
        aoshuCurrentIndex--;
        closeAoshuHint();
        closeAoshuAnswer();
        renderAoshuQuestion();
    }
}

function aoshuNextQuestion() {
    if (aoshuCurrentIndex < aoshuQuestions.length - 1) {
        aoshuCurrentIndex++;
        closeAoshuHint();
        closeAoshuAnswer();
        renderAoshuQuestion();
    }
}
