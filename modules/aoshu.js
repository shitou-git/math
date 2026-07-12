const style = `
    :root {
        --c-primary: #7c3aed;
        --c-primary-soft: #ede9fe;
        --c-accent: #ec4899;
        --c-easy: #10b981;
        --c-easy-soft: #d1fae5;
        --c-mid: #f59e0b;
        --c-mid-soft: #fef3c7;
        --c-hard: #ef4444;
        --c-hard-soft: #fee2e2;
        --c-text: #1f2937;
        --c-muted: #6b7280;
        --c-bg: linear-gradient(135deg, #faf5ff 0%, #fff7ed 50%, #fdf2f8 100%);
        --shadow: 0 6px 20px rgba(124, 58, 237, 0.12);
        --shadow-strong: 0 12px 32px rgba(139, 92, 246, 0.25);
    }

    .aoshu-body {
        font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif;
        background: var(--c-bg);
        min-height: 100vh;
        color: var(--c-text);
        line-height: 1.75;
        padding: 20px;
    }

    .aoshu-container {
        max-width: 1060px;
        margin: 0 auto;
    }

    .aoshu-header {
        text-align: center;
        padding: 38px 24px 32px;
        background: linear-gradient(135deg, #8b5cf6, #ec4899, #f59e0b);
        color: #fff;
        border-radius: 28px;
        margin-bottom: 24px;
        box-shadow: var(--shadow-strong);
        position: relative;
        overflow: hidden;
    }
    .aoshu-header::before {
        content: "";
        position: absolute;
        inset: 0;
        background-image:
            radial-gradient(circle at 15% 25%, rgba(255,255,255,0.18) 0%, transparent 25%),
            radial-gradient(circle at 85% 75%, rgba(255,255,255,0.15) 0%, transparent 30%);
        pointer-events: none;
    }
    .aoshu-header h1 {
        font-size: 2.4rem;
        margin-bottom: 8px;
        letter-spacing: 3px;
        text-shadow: 2px 2px 0 rgba(0,0,0,0.12);
        position: relative;
    }
    .aoshu-header p {
        font-size: 1.05rem;
        opacity: 0.95;
        letter-spacing: 1px;
        position: relative;
    }

    .aoshu-tabs {
        display: flex;
        gap: 12px;
        margin-bottom: 22px;
        flex-wrap: wrap;
        justify-content: center;
    }
    .aoshu-tab {
        padding: 12px 28px;
        background: #fff;
        border-radius: 999px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        border: 3px solid transparent;
        transition: all 0.2s;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.06);
        color: var(--c-muted);
    }
    .aoshu-tab[data-level="easy"] { border-color: #a7f3d0; color: var(--c-easy); }
    .aoshu-tab[data-level="easy"]:hover, .aoshu-tab[data-level="easy"].active {
        background: #10b981; color: #fff; border-color: #10b981; transform: translateY(-2px); }
    .aoshu-tab[data-level="medium"] { border-color: #fcd34d; color: var(--c-mid); }
    .aoshu-tab[data-level="medium"]:hover, .aoshu-tab[data-level="medium"].active {
        background: #f59e0b; color: #fff; border-color: #f59e0b; transform: translateY(-2px); }
    .aoshu-tab[data-level="hard"] { border-color: #fca5a5; color: var(--c-hard); }
    .aoshu-tab[data-level="hard"]:hover, .aoshu-tab[data-level="hard"].active {
        background: #ef4444; color: #fff; border-color: #ef4444; transform: translateY(-2px); }

    .aoshu-level-section { display: none; animation: aoshuFadeIn 0.4s ease; }
    .aoshu-level-section.active { display: block; }
    @keyframes aoshuFadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to   { opacity: 1; transform: translateY(0); }
    }

    .aoshu-level-intro {
        background: #fff;
        padding: 16px 22px;
        border-radius: 18px;
        margin-bottom: 16px;
        font-size: 0.98rem;
        color: #4c1d95;
        border-left: 6px solid #c4b5fd;
        box-shadow: var(--shadow);
    }

    .aoshu-search-bar {
        display: flex;
        gap: 10px;
        margin-bottom: 16px;
        align-items: center;
        flex-wrap: wrap;
    }
    .aoshu-search-input {
        flex: 1;
        min-width: 200px;
        padding: 10px 16px;
        border: 2px solid #e9d5ff;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
    }
    .aoshu-search-input:focus { border-color: #7c3aed; }

    .aoshu-category-btn {
        padding: 10px 14px;
        border: 2px solid #e9d5ff;
        border-radius: 12px;
        font-size: 0.95rem;
        font-family: inherit;
        color: #7c3aed;
        background: #faf5ff;
        cursor: pointer;
        outline: none;
        display: flex;
        align-items: center;
        gap: 6px;
        transition: all 0.2s;
    }
    .aoshu-category-btn:hover { background: #f3e8ff; border-color: #7c3aed; }
    .aoshu-category-btn.open { background: #7c3aed; color: #fff; }

    .aoshu-category-menu {
        position: absolute;
        top: 100%;
        left: 0;
        right: 0;
        background: #fff;
        border: 2px solid #e9d5ff;
        border-radius: 12px;
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        list-style: none;
        padding: 4px;
        margin: 8px 0 0 0;
        display: none;
        z-index: 100;
    }
    .aoshu-category-menu.show { display: block; }
    .aoshu-category-menu li {
        padding: 10px 16px;
        cursor: pointer;
        border-radius: 8px;
        color: #374151;
    }
    .aoshu-category-menu li:hover { background: #f3e8ff; color: #7c3aed; }
    .aoshu-category-menu li.active { background: #7c3aed; color: #fff; }

    .aoshu-search-result-tip {
        font-size: 0.9rem;
        color: #7c3aed;
        margin-bottom: 10px;
        font-weight: bold;
    }

    .aoshu-problem-card {
        background: #fff;
        border-radius: 20px;
        padding: 20px 24px;
        margin-bottom: 12px;
        box-shadow: var(--shadow);
        border: 2px solid #f3e8ff;
        transition: transform 0.15s, border-color 0.2s;
    }
    .aoshu-problem-card:hover { transform: translateY(-1px); border-color: #ddd6fe; }
    .aoshu-problem-card.search-hidden { display: none; }

    .aoshu-problem-header {
        display: flex;
        align-items: baseline;
        gap: 10px;
        margin-bottom: 10px;
        padding-bottom: 8px;
        border-bottom: 2px dashed #e9d5ff;
        flex-wrap: wrap;
    }
    .aoshu-problem-number { font-size: 1.05rem; font-weight: bold; color: var(--c-primary); }
    .aoshu-problem-title { font-size: 1rem; font-weight: bold; color: #5b21b6; }
    .aoshu-problem-category {
        font-size: 0.8rem;
        margin-left: auto;
        background: #fef3c7;
        color: #92400e;
        padding: 3px 10px;
        border-radius: 999px;
        font-weight: bold;
    }

    .aoshu-problem-text {
        font-size: 0.98rem;
        color: #1f2937;
        margin-bottom: 12px;
        padding: 2px 0;
        white-space: pre-wrap;
    }

    .aoshu-view-btn {
        padding: 8px 18px;
        background: linear-gradient(135deg, #8b5cf6, #ec4899);
        color: #fff;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 3px 10px rgba(139, 92, 246, 0.3);
        transition: transform 0.15s;
    }
    .aoshu-view-btn:hover { transform: translateY(-2px); }

    .aoshu-hint-box {
        display: none;
        margin-top: 12px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #ecfdf5, #f0f9ff);
        border-radius: 14px;
        border-left: 5px solid #10b981;
        color: #064e3b;
        line-height: 1.85;
        font-size: 0.96rem;
        animation: aoshuSlideDown 0.3s ease;
    }
    .aoshu-hint-box.show { display: block; }
    .aoshu-hint-box h4 { margin-bottom: 4px; color: #047857; font-size: 0.98rem; margin-top: 4px; }
    .aoshu-hint-box h4:first-child { margin-top: 0; }

    .aoshu-view-answer-btn {
        margin-top: 14px;
        padding: 10px 22px;
        background: linear-gradient(135deg, #f59e0b, #ef4444);
        color: #fff;
        border: none;
        border-radius: 10px;
        cursor: pointer;
        font-size: 0.9rem;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 3px 10px rgba(239, 68, 68, 0.25);
        transition: transform 0.15s;
    }
    .aoshu-view-answer-btn:hover { transform: translateY(-2px); }

    .aoshu-pwd-box {
        display: none;
        margin-top: 10px;
        padding: 12px 16px;
        background: linear-gradient(135deg, #faf5ff, #fdf2f8);
        border: 2px dashed #c4b5fd;
        border-radius: 14px;
        animation: aoshuSlideDown 0.25s ease;
        align-items: center;
        gap: 10px;
        flex-wrap: wrap;
    }
    .aoshu-pwd-box.show { display: flex; }
    @keyframes aoshuSlideDown {
        from { opacity: 0; transform: translateY(-6px); }
        to   { opacity: 1; transform: translateY(0); }
    }
    .aoshu-pwd-box label { font-size: 0.9rem; color: #5b21b6; font-weight: bold; }
    .aoshu-pwd-box input {
        flex: 1;
        min-width: 140px;
        padding: 8px 12px;
        font-size: 0.9rem;
        border: 2px solid #ddd6fe;
        border-radius: 8px;
        outline: none;
        font-family: inherit;
        background: #fff;
    }
    .aoshu-pwd-box input:focus { border-color: #8b5cf6; box-shadow: 0 0 0 3px rgba(139,92,246,0.15); }
    .aoshu-pwd-box .submit-btn {
        padding: 8px 18px;
        font-size: 0.9rem;
        font-weight: bold;
        color: #065f46;
        background: #a7f3d0;
        border: 2px solid #6ee7b7;
        border-radius: 8px;
        cursor: pointer;
        font-family: inherit;
        transition: background 0.15s;
    }
    .aoshu-pwd-box .submit-btn:hover { background: #6ee7b7; }

    .aoshu-answer-box {
        display: none;
        margin-top: 12px;
        padding: 16px 20px;
        background: linear-gradient(135deg, #fdf4ff, #fef3c7);
        border-radius: 14px;
        border-left: 5px solid #a78bfa;
        color: #4c1d95;
        line-height: 1.85;
        font-size: 0.96rem;
        animation: aoshuSlideDown 0.3s ease;
    }
    .aoshu-answer-box.show { display: block; }
    .aoshu-answer-box h4 { margin-bottom: 4px; color: #7c3aed; font-size: 0.98rem; margin-top: 4px; }
    .aoshu-answer-box h4:first-child { margin-top: 0; }
    .aoshu-answer-box .answer {
        margin-top: 8px;
        padding: 8px 12px;
        background: #fff;
        border-radius: 10px;
        font-weight: bold;
        color: #db2777;
        display: inline-block;
    }

    .aoshu-footer {
        text-align: center;
        margin-top: 26px;
        padding: 16px 10px;
        color: #6d28d9;
        font-size: 0.9rem;
        opacity: 0.9;
    }

    .formula-btn {
        padding: 12px 24px;
        background: linear-gradient(135deg, #06b6d4, #3b82f6);
        color: #fff;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        font-size: 1rem;
        font-weight: bold;
        font-family: inherit;
        box-shadow: 0 4px 12px rgba(6, 182, 212, 0.3);
        transition: transform 0.15s;
        margin-left: 10px;
    }
    .formula-btn:hover { transform: translateY(-2px); }
`;

const html = `
    <div class="aoshu-body">
        <div class="aoshu-container">
            <div class="aoshu-header">
                <h1>🧮 小学生奥数乐园</h1>
                <p><span class="emoji">🎯</span> 精选思维训练题 <span class="emoji">✨</span></p>
            </div>

            <div class="aoshu-tabs">
                <button class="aoshu-tab active" data-level="easy">🌱 简单</button>
                <button class="aoshu-tab" data-level="medium">🌿 中等</button>
                <button class="aoshu-tab" data-level="hard">🌳 困难</button>
                <button class="formula-btn" onclick="app.navigate('silu')">📖 查看公式</button>
            </div>

            <section class="aoshu-level-section active" id="section-easy">
                <div class="aoshu-level-intro">🎯 简单题：适合小学低年级，培养基础思维能力</div>
                <div class="aoshu-search-bar">
                    <input type="text" class="aoshu-search-input" id="search-easy" placeholder="搜索题目名称或题型，例如：几何、鸡兔…">
                    <button class="aoshu-category-btn" id="cat-btn-easy" onclick="toggleCategoryMenu('easy')">
                        <span id="cat-text-easy">题型</span>
                        <span class="arrow">▼</span>
                    </button>
                    <div class="aoshu-category-menu" id="cat-menu-easy"></div>
                </div>
                <div class="aoshu-search-result-tip" id="tip-easy"></div>
                <div id="problems-easy"></div>
            </section>

            <section class="aoshu-level-section" id="section-medium">
                <div class="aoshu-level-intro">🎯 中等题：适合小学中高年级，提升逻辑推理能力</div>
                <div class="aoshu-search-bar">
                    <input type="text" class="aoshu-search-input" id="search-medium" placeholder="搜索题目名称或题型，例如：几何、鸡兔…">
                    <button class="aoshu-category-btn" id="cat-btn-medium" onclick="toggleCategoryMenu('medium')">
                        <span id="cat-text-medium">题型</span>
                        <span class="arrow">▼</span>
                    </button>
                    <div class="aoshu-category-menu" id="cat-menu-medium"></div>
                </div>
                <div class="aoshu-search-result-tip" id="tip-medium"></div>
                <div id="problems-medium"></div>
            </section>

            <section class="aoshu-level-section" id="section-hard">
                <div class="aoshu-level-intro">🎯 困难题：适合小学高年级及以上，挑战思维极限</div>
                <div class="aoshu-search-bar">
                    <input type="text" class="aoshu-search-input" id="search-hard" placeholder="搜索题目名称或题型，例如：几何、鸡兔…">
                    <button class="aoshu-category-btn" id="cat-btn-hard" onclick="toggleCategoryMenu('hard')">
                        <span id="cat-text-hard">题型</span>
                        <span class="arrow">▼</span>
                    </button>
                    <div class="aoshu-category-menu" id="cat-menu-hard"></div>
                </div>
                <div class="aoshu-search-result-tip" id="tip-hard"></div>
                <div id="problems-hard"></div>
            </section>

            <div class="aoshu-footer">
                <p>🌈 勤动脑筋，数学就会越来越有趣！加油！</p>
            </div>
        </div>
    </div>
`;

const PASSWORD = "admin";
let problems = { easy: [], medium: [], hard: [] };
let randomTargetCard = null;
let randomSolveCount = 0;

function injectStyle() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
}

function render() {
    const container = document.getElementById('aoshu-container');
    if (container) {
        container.innerHTML = html;
        bindTabEvents();
        loadAndRender();
    }
}

function bindTabEvents() {
    document.querySelectorAll('.aoshu-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.aoshu-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.aoshu-level-section').forEach(s => s.classList.remove('active'));
            
            e.target.classList.add('active');
            const level = e.target.dataset.level;
            document.getElementById(`section-${level}`)?.classList.add('active');
        });
    });
}

function toggleCategoryMenu(level) {
    const menu = document.getElementById(`cat-menu-${level}`);
    const btn = document.getElementById(`cat-btn-${level}`);
    
    document.querySelectorAll('.aoshu-category-menu').forEach(m => {
        if (m.id !== `cat-menu-${level}`) m.classList.remove('show');
    });
    document.querySelectorAll('.aoshu-category-btn').forEach(b => {
        if (b.id !== `cat-btn-${level}`) b.classList.remove('open');
    });
    
    if (!menu.innerHTML) {
        const categories = [...new Set(problems[level]?.map(p => p.cat) || [])];
        menu.innerHTML = categories.map(c => 
            `<li data-cat="${c}" onclick="selectCategory('${level}', '${c}')">${c}</li>`
        ).join('');
    }
    
    menu.classList.toggle('show');
    btn.classList.toggle('open');
}

function selectCategory(level, cat) {
    const container = document.getElementById(`problems-${level}`);
    const tip = document.getElementById(`tip-${level}`);
    const cards = container.querySelectorAll('.aoshu-problem-card');
    const textEl = document.getElementById(`cat-text-${level}`);
    const menu = document.getElementById(`cat-menu-${level}`);
    const btn = document.getElementById(`cat-btn-${level}`);

    textEl.textContent = cat;
    menu.querySelectorAll('li').forEach(li => li.classList.remove('active'));
    menu.querySelector(`li[data-cat="${cat}"]`)?.classList.add('active');

    menu.classList.remove('show');
    btn.classList.remove('open');

    let shown = 0;
    cards.forEach(card => {
        const cardCat = card.querySelector('.aoshu-problem-category')?.textContent || "";
        if (cardCat === cat) {
            card.classList.remove('search-hidden');
            shown++;
        } else {
            card.classList.add('search-hidden');
        }
    });

    tip.textContent = `${cat}类题目共 ${shown} 道`;
}

function doSearch(level) {
    const keyword = document.getElementById(`search-${level}`).value.trim();
    const container = document.getElementById(`problems-${level}`);
    const tip = document.getElementById(`tip-${level}`);
    const cards = container.querySelectorAll('.aoshu-problem-card');

    if (!keyword) {
        cards.forEach(card => card.classList.remove('search-hidden'));
        tip.textContent = "";
        return;
    }

    let shown = 0;
    cards.forEach(card => {
        const title = card.querySelector('.aoshu-problem-title')?.textContent || "";
        const text = card.querySelector('.aoshu-problem-text')?.textContent || "";
        const cat = card.querySelector('.aoshu-problem-category')?.textContent || "";
        const match = title.includes(keyword) || text.includes(keyword) || cat.includes(keyword);
        if (match) {
            card.classList.remove('search-hidden');
            shown++;
        } else {
            card.classList.add('search-hidden');
        }
    });

    tip.textContent = `找到 ${shown} 道相关题目`;
}

function renderProblems(level) {
    const container = document.getElementById(`problems-${level}`);
    const list = problems[level];
    if (!list || !container) return;

    container.innerHTML = '';

    list.forEach((p, idx) => {
        const card = document.createElement("div");
        card.className = "aoshu-problem-card";
        card.innerHTML =
            `<div class="aoshu-problem-header">
                <span class="aoshu-problem-number">第 ${idx+1} 题</span>
                <span class="aoshu-problem-title">${p.title}</span>
                <span class="aoshu-problem-category">${p.cat}</span>
            </div>
            <div class="aoshu-problem-text">${p.text}</div>
            <button class="aoshu-view-btn">👀 查看解析</button>
            <div class="aoshu-hint-box">
                <h4>💡 解题思路（先动动脑筋，再看下方答案）</h4>
                ${(p.hint || p.solution).map(s => `<div>${s}</div>`).join("")}
                <button class="aoshu-view-answer-btn">🔐 查看答案</button>
            </div>
            <div class="aoshu-pwd-box">
                <label>🔐 密码：</label>
                <input type="password" class="pwd" placeholder="密码是本题的答案">
                <button class="submit-btn">确认</button>
            </div>
            <div class="aoshu-answer-box">
                <h4>✅ 完整解答</h4>
                ${p.solution.map(s => `<div>${s}</div>`).join("")}
                <h4>📝 最终答案</h4>
                <div class="answer">${p.answer}</div>
            </div>`;
        container.appendChild(card);

        const viewBtn = card.querySelector(".aoshu-view-btn");
        const viewAnsBtn = card.querySelector(".aoshu-view-answer-btn");
        const pwdBox  = card.querySelector(".aoshu-pwd-box");
        const pwdInput = card.querySelector(".pwd");
        const submitBtn = card.querySelector(".submit-btn");
        const hintBox = card.querySelector(".aoshu-hint-box");
        const ansBox = card.querySelector(".aoshu-answer-box");

        const answerPwd = p.answer.replace(/[^\d]/g, "");
        const currentCard = card;

        function collapseOthers() {
            document.querySelectorAll(".aoshu-problem-card").forEach(c => {
                if (c === currentCard) return;
                const otherHint = c.querySelector(".aoshu-hint-box");
                const otherAns = c.querySelector(".aoshu-answer-box");
                const otherPwd = c.querySelector(".aoshu-pwd-box");
                const otherBtn = c.querySelector(".aoshu-view-btn");
                const otherViewAnsBtn = c.querySelector(".aoshu-view-answer-btn");
                const otherInput = c.querySelector(".pwd");
                if (otherHint) otherHint.classList.remove("show");
                if (otherAns) otherAns.classList.remove("show");
                if (otherPwd) otherPwd.classList.remove("show");
                if (otherBtn) otherBtn.textContent = "👀 查看解析";
                if (otherViewAnsBtn) otherViewAnsBtn.textContent = "🔐 查看答案";
                if (otherInput) otherInput.value = "";
            });
        }

        viewBtn.addEventListener("click", () => {
            collapseOthers();

            if (viewBtn.textContent === "🙈 收起解析") {
                hintBox.classList.remove("show");
                ansBox.classList.remove("show");
                pwdBox.classList.remove("show");
                viewAnsBtn.textContent = "🔐 查看答案";
                viewBtn.textContent = "👀 查看解析";
                pwdInput.value = "";
            } else {
                viewBtn.textContent = "🙈 收起解析";
                hintBox.classList.add("show");
            }
        });

        viewAnsBtn.addEventListener("click", () => {
            if (viewAnsBtn.textContent === "🙈 收起答案") {
                ansBox.classList.remove("show");
                pwdBox.classList.remove("show");
                viewAnsBtn.textContent = "🔐 查看答案";
                pwdInput.value = "";
            } else {
                if (pwdBox.classList.contains("show")) {
                    pwdBox.classList.remove("show");
                } else {
                    pwdBox.classList.add("show");
                    setTimeout(() => pwdInput.focus(), 50);
                }
            }
        });

        function tryUnlock() {
            const input = pwdInput.value.trim();
            const isAnswerPwd = answerPwd && input === answerPwd;
            if (input === PASSWORD || isAnswerPwd) {
                ansBox.classList.add("show");
                pwdBox.classList.remove("show");
                viewAnsBtn.textContent = "🙈 收起答案";
            } else {
                pwdInput.value = "";
                pwdInput.placeholder = "❌ 密码错误，重新输入";
                pwdInput.focus();
                setTimeout(() => {
                    pwdInput.placeholder = "密码是本题的答案";
                }, 1500);
            }
        }

        submitBtn.addEventListener("click", tryUnlock);
        pwdInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") tryUnlock();
        });
    });
}

function loadAndRender() {
    fetch("problems.json")
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            problems = data;
            renderProblems("easy");
            renderProblems("medium");
            renderProblems("hard");
        })
        .catch(err => {
            console.error("题库加载失败：", err);
            ["easy", "medium", "hard"].forEach(level => {
                const container = document.getElementById(`problems-${level}`);
                if (container) {
                    container.innerHTML =
                        '<div style="padding:24px;text-align:center;color:#b91c1c;">' +
                        '⚠️ 题库加载失败，请确认 problems.json 文件存在。</div>';
                }
            });
        });
}

export function initAoshu() {
    injectStyle();
    render();
}