const style = `
    :root {
        --c-primary: #7c3aed;
        --c-primary-soft: #ede9fe;
        --c-accent: #ec4899;
        --c-easy: #10b981;
        --c-mid: #f59e0b;
        --c-text: #1f2937;
        --c-muted: #6b7280;
        --shadow: 0 6px 20px rgba(124, 58, 237, 0.12);
    }

    .silu-body {
        font-family: "Microsoft YaHei", "PingFang SC", "Helvetica Neue", sans-serif;
        background: linear-gradient(135deg, #f0fdf4, #ecfeff);
        min-height: 100vh;
        color: var(--c-text);
        line-height: 1.75;
        padding: 20px;
    }

    .silu-container {
        max-width: 800px;
        margin: 0 auto;
    }

    .silu-header {
        text-align: center;
        padding: 30px 20px;
        background: linear-gradient(135deg, #10b981, #06b6d4);
        color: #fff;
        border-radius: 24px;
        margin-bottom: 20px;
        box-shadow: 0 12px 32px rgba(16, 185, 129, 0.25);
    }
    .silu-header h1 {
        font-size: 2rem;
        margin-bottom: 5px;
        letter-spacing: 2px;
    }
    .silu-header p {
        opacity: 0.9;
        font-size: 1rem;
    }

    .silu-tabs {
        display: flex;
        gap: 10px;
        margin-bottom: 20px;
        flex-wrap: wrap;
        justify-content: center;
    }
    .silu-tab {
        padding: 10px 20px;
        background: #fff;
        border-radius: 999px;
        cursor: pointer;
        font-size: 0.95rem;
        font-weight: bold;
        border: 2px solid transparent;
        transition: all 0.2s;
        box-shadow: 0 4px 10px rgba(0,0,0,0.05);
        color: var(--c-muted);
    }
    .silu-tab[data-category] {
        color: #7c3aed;
        border-color: #e9d5ff;
    }
    .silu-tab[data-category].active {
        background: #7c3aed;
        color: #fff;
        border-color: #7c3aed;
        transform: translateY(-2px);
    }

    .silu-formula-card {
        background: #fff;
        border-radius: 16px;
        padding: 20px;
        margin-bottom: 12px;
        box-shadow: var(--shadow);
        border-left: 5px solid #7c3aed;
        transition: transform 0.15s;
    }
    .silu-formula-card:hover { transform: translateY(-1px); }
    .silu-formula-card.search-hidden { display: none; }

    .silu-formula-title {
        font-size: 1.1rem;
        font-weight: bold;
        color: #5b21b6;
        margin-bottom: 8px;
    }

    .silu-formula-content {
        font-size: 0.95rem;
        color: #1f2937;
        line-height: 1.8;
        white-space: pre-wrap;
    }

    .silu-search-bar {
        margin-bottom: 20px;
    }
    .silu-search-input {
        width: 100%;
        padding: 12px 16px;
        border: 2px solid #d1fae5;
        border-radius: 12px;
        font-size: 1rem;
        font-family: inherit;
        outline: none;
        transition: border-color 0.2s;
    }
    .silu-search-input:focus { border-color: #10b981; }

    .silu-footer {
        text-align: center;
        margin-top: 20px;
        padding: 16px;
        color: #065f46;
        font-size: 0.9rem;
        opacity: 0.8;
    }
`;

const html = `
    <div class="silu-body">
        <div class="silu-container">
            <div class="silu-header">
                <h1>📖 数学公式速查</h1>
                <p>整理常用数学公式，方便学习参考</p>
            </div>

            <div class="silu-search-bar">
                <input type="text" class="silu-search-input" id="silu-search" placeholder="搜索公式名称或内容...">
            </div>

            <div class="silu-tabs" id="silu-tabs">
                <button class="silu-tab active" data-category="all">全部</button>
            </div>

            <div id="silu-formulas"></div>

            <div class="silu-footer">
                <p>💡 点击上方标签筛选不同类型的公式</p>
            </div>
        </div>
    </div>
`;

let formulas = [];

function injectStyle() {
    const styleEl = document.createElement('style');
    styleEl.textContent = style;
    document.head.appendChild(styleEl);
}

function render() {
    const container = document.getElementById('silu-container');
    if (container) {
        container.innerHTML = html;
        loadAndRender();
    }
}

function renderTabs() {
    const categories = ['all', ...new Set(formulas.map(f => f.category))];
    const tabsEl = document.getElementById('silu-tabs');
    
    tabsEl.innerHTML = categories.map(cat => 
        `<button class="silu-tab ${cat === 'all' ? 'active' : ''}" data-category="${cat}">${cat === 'all' ? '全部' : cat}</button>`
    ).join('');

    tabsEl.querySelectorAll('.silu-tab').forEach(tab => {
        tab.addEventListener('click', (e) => {
            tabsEl.querySelectorAll('.silu-tab').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filterByCategory(e.target.dataset.category);
        });
    });
}

function filterByCategory(category) {
    const cards = document.querySelectorAll('.silu-formula-card');
    cards.forEach(card => {
        if (category === 'all') {
            card.classList.remove('search-hidden');
        } else {
            const cardCategory = card.dataset.category;
            card.classList.toggle('search-hidden', cardCategory !== category);
        }
    });
}

function doSearch() {
    const keyword = document.getElementById('silu-search').value.trim().toLowerCase();
    const cards = document.querySelectorAll('.silu-formula-card');

    cards.forEach(card => {
        const title = card.querySelector('.silu-formula-title')?.textContent.toLowerCase() || "";
        const content = card.querySelector('.silu-formula-content')?.textContent.toLowerCase() || "";
        
        if (!keyword || title.includes(keyword) || content.includes(keyword)) {
            card.classList.remove('search-hidden');
        } else {
            card.classList.add('search-hidden');
        }
    });
}

function renderFormulas() {
    const container = document.getElementById('silu-formulas');
    if (!container) return;

    container.innerHTML = formulas.map((f, idx) => `
        <div class="silu-formula-card" data-category="${f.category}">
            <div class="silu-formula-title">${idx + 1}. ${f.name}</div>
            <div class="silu-formula-content">${f.content}</div>
        </div>
    `).join('');
}

function loadAndRender() {
    fetch("formulas.json")
        .then(res => {
            if (!res.ok) throw new Error("HTTP " + res.status);
            return res.json();
        })
        .then(data => {
            formulas = data;
            renderTabs();
            renderFormulas();
            
            document.getElementById('silu-search')?.addEventListener('input', doSearch);
        })
        .catch(err => {
            console.error("公式加载失败：", err);
            const container = document.getElementById('silu-formulas');
            if (container) {
                container.innerHTML =
                    '<div style="padding:24px;text-align:center;color:#b91c1c;">' +
                    '⚠️ 公式加载失败，请确认 formulas.json 文件存在。</div>';
            }
        });
}

export function initSilu() {
    injectStyle();
    render();
}