// 舒尔特方格游戏 ES Module
// 从 index.html 提取：
//   CSS  - 第611-1285行（舒尔特方格新样式）+ 第1670-1690行（舒尔特方格小屏幕适配，原位于 @media(max-width:480px) 内）
//   HTML - 第2328-2457行（舒尔特方格游戏页面）
//   JS   - 第3616-4368行（舒尔特方格游戏全部函数）
//   计数器函数 + STORAGE_KEY_MAP - 第3567-3608行

// ===================== 常量 =====================
const STORAGE_KEY_MAP = {
    point24: { correct: 'point24CorrectCount', wrong: 'point24WrongCount' },
    multdiv: { correct: 'multdivCorrectCount', wrong: 'multdivWrongCount' }
};

const SCHULTE_STORE_KEY = "schulte_records_v2";
const SCHULTE_LAYOUT_LABEL = { grid: "方形", circle: "圆形", hexagon: "蜂巢", radial: "圆盘" };
const SCHULTE_ORDER_LABEL = { asc: "正序", desc: "倒序" };

const SCHULTE_FONT_CLASSES = ["font-round", "font-serif", "font-mono", "font-cond"];
const SCHULTE_COLORS = [
    "#667eea", "#764ba2", "#16a34a", "#f59e0b", "#dc2626", "#0891b2",
    "#ea580c", "#65a30d", "#db2777", "#4f46e5", "#ec4899", "#0d9488",
];
const SCHULTE_ZONE_COLORS = [
    "rgba(220, 38, 38, 0.18)", "rgba(102, 126, 234, 0.18)", "rgba(22, 163, 74, 0.18)", "rgba(245, 158, 11, 0.18)",
    "rgba(118, 75, 162, 0.18)", "rgba(8, 145, 178, 0.18)", "rgba(234, 88, 12, 0.18)", "rgba(101, 163, 13, 0.18)",
];

// ===================== 状态 =====================
const schulteState = {
    size: 5,
    layout: "grid",
    order: "asc",
    interf: { color: false, font: false, jitter: false, mirror: false, zoneColor: false, rotation: false },
    running: false,
    paused: false,
    finished: false,
    numbers: [],
    zoneColors: [],
    count: 0,
    next: 1,
    step: 1,
    elapsed: 0,
    rafId: null,
    lastTick: 0,
};

let schulteCellEls = [];

// ===================== 工具函数 =====================
// 原始 index.html 中的全局函数（第2667行），模块内自带本地副本以保持自包含
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// ===================== 计数器函数 =====================
export function getCounter(game, type) {
    const key = STORAGE_KEY_MAP[game][type];
    const value = localStorage.getItem(key);
    return value ? parseInt(value, 10) : 0;
}

export function setCounter(game, type, value) {
    const key = STORAGE_KEY_MAP[game][type];
    localStorage.setItem(key, value);
}

export function renderCounter(game) {
    const correctEl = document.getElementById(game + 'CorrectCount');
    const wrongEl = document.getElementById(game + 'WrongCount');
    if (correctEl) correctEl.textContent = getCounter(game, 'correct');
    if (wrongEl) wrongEl.textContent = getCounter(game, 'wrong');
}

export function incrementCounter(game, type) {
    const current = getCounter(game, type);
    setCounter(game, type, current + 1);
    renderCounter(game);
}

export function confirmResetCounter(game) {
    const labelMap = { point24: '加减法', multdiv: '乘除法' };
    const label = labelMap[game] || '当前页面';
    const ok = confirm(`确定要重置${label}的计数器吗？此操作不可撤销。`);
    if (ok) {
        const confirmAgain = confirm('再次确认：真的要重置计数器吗？');
        if (confirmAgain) {
            setCounter(game, 'correct', 0);
            setCounter(game, 'wrong', 0);
            renderCounter(game);
        }
    }
}

// ===================== 舒尔特方格函数 =====================
function bindSchulteSeg(segId, attr, cb) {
    const seg = document.getElementById(segId);
    seg.addEventListener("click", (e) => {
        const btn = e.target.closest(".schulte-seg-btn");
        if (!btn) return;
        seg.querySelectorAll(".schulte-seg-btn").forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        cb(btn.dataset[attr]);
    });
}

function schulteIdleDesc() {
    const start = 1;
    const end = schulteState.count;
    const range = schulteState.order === "asc" ? `${start} 到 ${end}` : `${end} 到 ${start}`;
    return `点击「开始」后，按${SCHULTE_ORDER_LABEL[schulteState.order]}依次点击数字 ${range}（${SCHULTE_LAYOUT_LABEL[schulteState.layout]}布局）。`;
}

function computeSchulteLayout(layout, size) {
    let count, coords = [], cell;
    if (layout === "grid") {
        count = size * size;
        coords = Array.from({ length: count }, (_, i) => ({
            x: ((i % size) + 0.5) / size * 100,
            y: (Math.floor(i / size) + 0.5) / size * 100,
        }));
        cell = (86 / size);
    } else if (layout === "circle") {
        count = size * size;
        const Rmax = 46;
        const centerR = 10;
        let rings, ringCounts;
        if (count <= 25) {
            rings = 2;
            const inner = 8;
            ringCounts = [inner, count - inner];
        } else if (count <= 36) {
            rings = 3;
            const r1 = 8, r2 = 12;
            ringCounts = [r1, r2, count - r1 - r2];
        } else {
            rings = 4;
            const r1 = 8, r2 = 12, r3 = 14;
            ringCounts = [r1, r2, r3, count - r1 - r2 - r3];
        }
        const usableR = Rmax - centerR;
        const ringWidth = usableR / rings;
        const ringRadii = [];
        for (let k = 0; k < rings; k++) {
            ringRadii.push(centerR + (k + 0.5) * ringWidth);
        }
        coords = [];
        for (let k = 0; k < rings; k++) {
            const r = ringRadii[k];
            const cr = ringCounts[k];
            const offset = (k % 2) * (Math.PI / cr);
            for (let j = 0; j < cr; j++) {
                const a = -Math.PI / 2 + offset + (j * 2 * Math.PI) / cr;
                coords.push({ x: 50 + r * Math.cos(a), y: 50 + r * Math.sin(a), ring: k });
            }
        }
        const innermostCount = ringCounts[0];
        const innermostRadius = ringRadii[0];
        const innerArc = (2 * Math.PI * innermostRadius) / innermostCount;
        const cellByInnerArc = innerArc * 0.5;
        const cellByRingWidth = ringWidth * 0.6;
        cell = Math.min(cellByInnerArc, cellByRingWidth, 11);
        cell = Math.max(cell, 5);
    } else if (layout === "hexagon") {
        const rows = size, cols = size;
        count = rows * cols;
        const s = Math.min(
            100 / ((cols + 0.5) * Math.sqrt(3)),
            100 / (1.5 * rows + 0.5)
        );
        const colStep = Math.sqrt(3) * s;
        const rowStep = 1.5 * s;
        const ox = 50 - (cols - 1) * colStep / 2 - colStep / 4;
        const oy = 50 - (rows - 1) * rowStep / 2;
        coords = [];
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const offsetX = (r % 2 === 1) ? colStep * 0.5 : 0;
                coords.push({
                    x: ox + c * colStep + offsetX,
                    y: oy + r * rowStep
                });
            }
        }
        cell = s * 1.2;
    } else if (layout === "radial") {
        count = size * size;
        const Rmax = 44;
        // 同心圆盘：中心1个 + 若干环
        let ringCounts;
        if (count === 25) {
            ringCounts = [1, 8, 8, 8];
        } else if (count === 36) {
            ringCounts = [1, 8, 12, 15];
        } else if (count === 49) {
            ringCounts = [1, 8, 12, 14, 14];
        } else if (count < 25) {
            ringCounts = [1, count - 1];
        } else {
            // 通用 fallback：中心1个，其余尽量均匀分配到4~5环
            const remaining = count - 1;
            const rings = Math.min(5, Math.max(3, Math.round(Math.sqrt(count) / 1.5)));
            const base = Math.floor(remaining / rings);
            ringCounts = [1];
            for (let k = 0; k < rings; k++) ringCounts.push(base);
            let diff = remaining - base * rings;
            let idx = rings;
            while (diff !== 0) {
                ringCounts[idx] += Math.sign(diff);
                if (idx > 1) idx--;
                else idx = rings;
                diff -= Math.sign(diff);
            }
        }
        const rings = ringCounts.length;
        const ringRadii = [];
        for (let k = 0; k < rings; k++) {
            // 中心半径0，各环均匀分布在 8~Rmax 之间
            if (k === 0) ringRadii.push(0);
            else ringRadii.push(8 + ((k - 0.5) / (rings - 1)) * (Rmax - 8));
        }
        coords = [];
        for (let k = 0; k < rings; k++) {
            const radius = ringRadii[k];
            const cr = ringCounts[k];
            if (cr === 1) {
                coords.push({ x: 50, y: 50, ring: k });
                continue;
            }
            const offset = (k % 2) * (Math.PI / cr);
            for (let j = 0; j < cr; j++) {
                const a = -Math.PI / 2 + offset + (j * 2 * Math.PI) / cr;
                coords.push({ x: 50 + radius * Math.cos(a), y: 50 + radius * Math.sin(a), ring: k });
            }
        }
        const outerRingCount = ringCounts[rings - 1];
        const outerCircumference = 2 * Math.PI * Rmax;
        const cellByOuter = (outerCircumference / outerRingCount) * 0.85;
        const cellByRing = ((Rmax - 8) / (rings - 1)) * 0.9;
        cell = Math.min(cellByOuter, cellByRing, 12);
        cell = Math.max(cell, 5);
    }
    return { count, coords, cell: Math.max(cell, 6) };
}

function applySchulteLayout() {
    const board = document.getElementById("schulteBoard");
    const svg = document.getElementById("schulteBoardSvg");
    const { count, coords, cell } = computeSchulteLayout(schulteState.layout, schulteState.size);

    // 检查是否需要分层
    const hasRings = coords.length > 0 && coords[0].ring !== undefined;

    // 清理旧的ring容器
    const oldRings = board.querySelectorAll(".schulte-ring");
    oldRings.forEach(r => r.remove());

    // 创建ring容器（如果需要）
    const ringContainers = [];
    if (hasRings) {
        const maxRing = Math.max(...coords.map(c => c.ring));
        for (let k = 0; k <= maxRing; k++) {
            const ring = document.createElement("div");
            ring.className = "schulte-ring ring-" + k;
            board.appendChild(ring);
            ringContainers.push(ring);
        }
    }

    while (schulteCellEls.length < count) {
        const el = document.createElement("div");
        el.className = "schulte-cell";
        const span = document.createElement("span");
        span.className = "num";
        el.appendChild(span);
        el.addEventListener("click", () => onSchulteCellClick(parseInt(el.dataset.num, 10), el));
        schulteCellEls.push(el);
    }
    while (schulteCellEls.length > count) {
        const el = schulteCellEls.pop();
        el.style.opacity = "0";
        setTimeout(() => el.remove(), 420);
    }
    for (let i = 0; i < count; i++) {
        const el = schulteCellEls[i];
        const num = schulteState.numbers[i];
        el.dataset.num = num;
        el.querySelector(".num").textContent = num;
        const p = coords[i];
        el.style.left = p.x + "%";
        el.style.top = p.y + "%";
        el.style.width = cell + "%";
        el.style.height = cell + "%";
        let fontSizeRatio = 0.34;
        if (schulteState.layout === "circle") fontSizeRatio = 0.55;
        if (schulteState.layout === "radial") fontSizeRatio = 0.42;
        if (schulteState.layout === "hexagon") fontSizeRatio = 0.33;
        el.style.fontSize = (cell * fontSizeRatio) + "vmin";
        el.style.opacity = "1";
        el.style.pointerEvents = "auto";
        el.classList.remove("correct", "wrong");
        el.classList.remove("ring-0", "ring-1", "ring-2", "ring-3", "ring-4", "ring-5");
        if (p.ring !== undefined) el.classList.add("ring-" + p.ring);
        styleSchulteCell(el, num, i);
        if (schulteState.layout === "hexagon") {
            el.style.background = "transparent";
            el.style.border = "none";
            el.style.borderRadius = "0";
            el.style.clipPath = "";
        } else if (schulteState.layout === "circle") {
            el.style.background = "transparent";
            el.style.border = "none";
            el.style.borderRadius = "0";
            el.style.clipPath = "";
        } else {
            el.style.background = "";
            el.style.border = "";
            el.style.borderRadius = "";
            el.style.clipPath = "";
        }

        // 把格子放到对应的ring容器中
        if (hasRings && p.ring !== undefined && ringContainers[p.ring]) {
            ringContainers[p.ring].appendChild(el);
        } else {
            board.appendChild(el);
        }
    }
    drawSchulteBoardSvg();
    schulteState.count = count;
    board.className = "schulte-board layout-" + schulteState.layout;
    if (schulteState.interf.jitter) board.classList.add("jitter");
    const isRingLayout = schulteState.layout === "circle" || schulteState.layout === "radial";
    if (schulteState.interf.rotation && isRingLayout) board.classList.add("rotate");
}

function drawSchulteBoardSvg() {
    const svg = document.getElementById("schulteBoardSvg");
    const layout = schulteState.layout;
    const size = schulteState.size;
    svg.innerHTML = "";
    const ns = "http://www.w3.org/2000/svg";
    const strokeColor = "#6b9080";
    const fillColor = "#ffffff";
    const bgColor = "#eef4ed";

    if (layout === "hexagon") {
        const rows = size, cols = size;
        const s = Math.min(
            100 / ((cols + 0.5) * Math.sqrt(3)),
            100 / (1.5 * rows + 0.5)
        );
        const colStep = Math.sqrt(3) * s;
        const rowStep = 1.5 * s;
        const ox = 50 - (cols - 1) * colStep / 2 - colStep / 4;
        const oy = 50 - (rows - 1) * rowStep / 2;

        const getHexPoints = (r, c) => {
            const offsetX = (r % 2 === 1) ? colStep * 0.5 : 0;
            const cx = ox + c * colStep + offsetX;
            const cy = oy + r * rowStep;
            const points = [];
            for (let k = 0; k < 6; k++) {
                const angle = Math.PI / 3 * k - Math.PI / 2;
                points.push({ x: cx + s * Math.cos(angle), y: cy + s * Math.sin(angle) });
            }
            return points;
        };

        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const points = getHexPoints(r, c);
                const polyPoints = points.map(p => p.x.toFixed(3) + "," + p.y.toFixed(3)).join(" ");
                const poly = document.createElementNS(ns, "polygon");
                poly.setAttribute("points", polyPoints);
                poly.setAttribute("fill", "#ffffff");
                poly.setAttribute("stroke", "none");
                svg.appendChild(poly);
            }
        }

        const edges = new Set();
        for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
                const points = getHexPoints(r, c);
                for (let k = 0; k < 6; k++) {
                    const p1 = points[k];
                    const p2 = points[(k + 1) % 6];
                    const key = [
                        Math.round(p1.x * 100) / 100,
                        Math.round(p1.y * 100) / 100,
                        Math.round(p2.x * 100) / 100,
                        Math.round(p2.y * 100) / 100
                    ].sort().join(",");
                    if (!edges.has(key)) {
                        edges.add(key);
                        const line = document.createElementNS(ns, "line");
                        line.setAttribute("x1", p1.x.toFixed(3));
                        line.setAttribute("y1", p1.y.toFixed(3));
                        line.setAttribute("x2", p2.x.toFixed(3));
                        line.setAttribute("y2", p2.y.toFixed(3));
                        line.setAttribute("stroke", "#6b9080");
                        line.setAttribute("stroke-width", "0.6");
                        line.setAttribute("stroke-linecap", "round");
                        svg.appendChild(line);
                    }
                }
            }
        }
    } else if (layout === "circle") {
        const count = size * size;
        const Rmax = 46;
        const centerR = 10;
        let rings, ringCounts;
        if (count <= 25) {
            rings = 2;
            const inner = 8;
            ringCounts = [inner, count - inner];
        } else if (count <= 36) {
            rings = 3;
            const r1 = 8, r2 = 12;
            ringCounts = [r1, r2, count - r1 - r2];
        } else {
            rings = 4;
            const r1 = 8, r2 = 12, r3 = 14;
            ringCounts = [r1, r2, r3, count - r1 - r2 - r3];
        }
        const usableR = Rmax - centerR;
        const ringWidth = usableR / rings;
        const ringRadiiInner = [];
        const ringRadiiOuter = [];
        for (let k = 0; k < rings; k++) {
            ringRadiiInner.push(centerR + k * ringWidth);
            ringRadiiOuter.push(centerR + (k + 1) * ringWidth);
        }
        const centerCircle = document.createElementNS(ns, "circle");
        centerCircle.setAttribute("cx", "50");
        centerCircle.setAttribute("cy", "50");
        centerCircle.setAttribute("r", centerR);
        centerCircle.setAttribute("fill", "#f5f2e9");
        centerCircle.setAttribute("stroke", strokeColor);
        centerCircle.setAttribute("stroke-width", "0.6");
        svg.appendChild(centerCircle);
        for (let k = 0; k < rings; k++) {
            const g = document.createElementNS(ns, "g");
            g.setAttribute("class", "schulte-svg-ring ring-" + k);
            const rInner = ringRadiiInner[k];
            const rOuter = ringRadiiOuter[k];
            const cr = ringCounts[k];
            const offset = (k % 2) * (Math.PI / cr);
            for (let j = 0; j < cr; j++) {
                const a1 = -Math.PI / 2 + offset + (j - 0.5) * 2 * Math.PI / cr;
                const a2 = -Math.PI / 2 + offset + (j + 0.5) * 2 * Math.PI / cr;
                const path = document.createElementNS(ns, "path");
                const x1 = 50 + rInner * Math.cos(a1);
                const y1 = 50 + rInner * Math.sin(a1);
                const x2 = 50 + rOuter * Math.cos(a1);
                const y2 = 50 + rOuter * Math.sin(a1);
                const x3 = 50 + rOuter * Math.cos(a2);
                const y3 = 50 + rOuter * Math.sin(a2);
                const x4 = 50 + rInner * Math.cos(a2);
                const y4 = 50 + rInner * Math.sin(a2);
                const largeArc = (2 * Math.PI / cr) > Math.PI ? 1 : 0;
                const d = `M ${x1.toFixed(3)} ${y1.toFixed(3)} L ${x2.toFixed(3)} ${y2.toFixed(3)} A ${rOuter.toFixed(3)} ${rOuter.toFixed(3)} 0 ${largeArc} 1 ${x3.toFixed(3)} ${y3.toFixed(3)} L ${x4.toFixed(3)} ${y4.toFixed(3)} A ${rInner.toFixed(3)} ${rInner.toFixed(3)} 0 ${largeArc} 0 ${x1.toFixed(3)} ${y1.toFixed(3)} Z`;
                path.setAttribute("d", d);
                path.setAttribute("fill", fillColor);
                path.setAttribute("stroke", strokeColor);
                path.setAttribute("stroke-width", "0.6");
                path.setAttribute("stroke-linejoin", "round");
                g.appendChild(path);
            }
            svg.appendChild(g);
        }
    } else if (layout === "radial") {
        const count = size * size;
        const Rmax = 44;
        let ringCounts;
        if (count === 25) {
            ringCounts = [1, 8, 8, 8];
        } else if (count === 36) {
            ringCounts = [1, 8, 12, 15];
        } else if (count === 49) {
            ringCounts = [1, 8, 12, 14, 14];
        } else if (count < 25) {
            ringCounts = [1, count - 1];
        } else {
            const remaining = count - 1;
            const rings = Math.min(5, Math.max(3, Math.round(Math.sqrt(count) / 1.5)));
            const base = Math.floor(remaining / rings);
            ringCounts = [1];
            for (let k = 0; k < rings; k++) ringCounts.push(base);
            let diff = remaining - base * rings;
            let idx = rings;
            while (diff !== 0) {
                ringCounts[idx] += Math.sign(diff);
                if (idx > 1) idx--;
                else idx = rings;
                diff -= Math.sign(diff);
            }
        }
        const rings = ringCounts.length;
        // 绘制轨道线：每个环一条同心圆
        for (let k = 1; k < rings; k++) {
            const radius = 8 + ((k - 0.5) / (rings - 1)) * (Rmax - 8);
            const circle = document.createElementNS(ns, "circle");
            circle.setAttribute("cx", "50");
            circle.setAttribute("cy", "50");
            circle.setAttribute("r", radius.toFixed(3));
            circle.setAttribute("fill", "none");
            circle.setAttribute("stroke", strokeColor);
            circle.setAttribute("stroke-width", "0.5");
            circle.setAttribute("stroke-dasharray", "2 2");
            svg.appendChild(circle);
        }
        // 外边界圆
        const outerCircle = document.createElementNS(ns, "circle");
        outerCircle.setAttribute("cx", "50");
        outerCircle.setAttribute("cy", "50");
        outerCircle.setAttribute("r", "46");
        outerCircle.setAttribute("fill", "none");
        outerCircle.setAttribute("stroke", strokeColor);
        outerCircle.setAttribute("stroke-width", "0.6");
        svg.appendChild(outerCircle);
    }
}

function styleSchulteCell(el, num, i) {
    const span = el.querySelector(".num");
    if (schulteState.interf.color) span.style.color = SCHULTE_COLORS[num % SCHULTE_COLORS.length];
    else span.style.color = "";
    SCHULTE_FONT_CLASSES.forEach((f) => span.classList.remove(f));
    if (schulteState.interf.font) span.classList.add(SCHULTE_FONT_CLASSES[num % SCHULTE_FONT_CLASSES.length]);
    el.classList.toggle("mirror", schulteState.interf.mirror && num % 2 === 0);
    if (schulteState.interf.zoneColor && schulteState.zoneColors && schulteState.zoneColors[i]) {
        el.style.backgroundColor = schulteState.zoneColors[i];
    } else {
        el.style.backgroundColor = "";
    }
}

function schulteZoneFor(i) {
    const { count } = computeSchulteLayout(schulteState.layout, schulteState.size);
    if (schulteState.layout === "grid") {
        const row = Math.floor(i / schulteState.size), col = i % schulteState.size;
        return (row < schulteState.size / 2 ? 0 : 2) + (col < schulteState.size / 2 ? 0 : 1);
    }
    if (schulteState.layout === "hexagon") return Math.floor(i / schulteState.size);
    return Math.floor((i / count) * 4) % 4;
}

function buildSchulteBoard() {
    const { count } = computeSchulteLayout(schulteState.layout, schulteState.size);
    schulteState.numbers = shuffleArray(Array.from({ length: count }, (_, i) => 1 + i));
    schulteState.zoneColors = Array.from({ length: count }, () => SCHULTE_ZONE_COLORS[Math.floor(Math.random() * SCHULTE_ZONE_COLORS.length)]);
    applySchulteLayout();
    updateSchulteAllInterferences();
}

function updateSchulteAllInterferences() {
    schulteCellEls.forEach((el, i) => styleSchulteCell(el, parseInt(el.dataset.num, 10), i));
    const board = document.getElementById("schulteBoard");
    board.classList.toggle("jitter", schulteState.interf.jitter);
    const isRingLayout = schulteState.layout === "circle" || schulteState.layout === "radial";
    board.classList.toggle("rotate", schulteState.interf.rotation && isRingLayout);
}

function updateSchulteProgress() {
    const total = schulteState.count;
    let done, t;
    if (schulteState.order === "asc") {
        done = schulteState.next - 1;
        t = schulteState.next;
        if (schulteState.next > total) t = "✓";
    } else {
        done = total - schulteState.next + 1;
        t = schulteState.next;
        if (schulteState.next < 1) t = "✓";
    }
    document.getElementById("schulteProgressValue").textContent = `${Math.max(0, done)} / ${total}`;
    document.getElementById("schulteTargetNum").textContent = t;
}

function onSchulteCellClick(num, cell) {
    if (!schulteState.running || schulteState.paused || schulteState.finished) return;
    if (cell.classList.contains("correct")) return;
    if (num === schulteState.next) {
        cell.classList.remove("wrong");
        cell.classList.add("correct");
        cell.style.pointerEvents = "none";
        schulteState.next += schulteState.step;
        updateSchulteProgress();
        const finished = schulteState.order === "asc" ? schulteState.next > schulteState.count : schulteState.next < 1;
        if (finished) finishSchulteGame("success");
    } else {
        cell.classList.remove("wrong");
        void cell.offsetWidth;
        cell.classList.add("wrong");
        setTimeout(() => cell.classList.remove("wrong"), 350);
    }
}

function schulteTick(now) {
    if (!schulteState.running || schulteState.paused) return;
    const dt = now - schulteState.lastTick;
    schulteState.lastTick = now;
    schulteState.elapsed += dt;
    document.getElementById("schulteTimeValue").textContent = fmtSchulteTime(schulteState.elapsed);
    schulteState.rafId = requestAnimationFrame(schulteTick);
}

function startSchulteClock() {
    schulteState.lastTick = performance.now();
    schulteState.rafId = requestAnimationFrame(schulteTick);
}

export function stopSchulteClock() {
    if (schulteState.rafId) cancelAnimationFrame(schulteState.rafId);
    schulteState.rafId = null;
}

function fmtSchulteTime(ms) {
    const s = ms / 1000;
    if (s < 60) return s.toFixed(1) + "s";
    const m = Math.floor(s / 60);
    const r = (s - m * 60).toFixed(1);
    return `${m}:${r.padStart(4, "0")}`;
}

function startSchulteGame() {
    buildSchulteBoard();
    schulteState.running = true;
    schulteState.paused = false;
    schulteState.finished = false;
    schulteState.step = schulteState.order === "asc" ? 1 : -1;
    schulteState.next = schulteState.order === "asc" ? 1 : schulteState.count;
    schulteState.elapsed = 0;
    document.getElementById("schulteTimeValue").textContent = "0.0s";
    document.getElementById("schulteOverlay").classList.add("hidden");
    document.getElementById("schulteStartBtn").disabled = true;
    document.getElementById("schultePauseBtn").disabled = false;
    document.getElementById("schulteResumeBtn").disabled = true;
    document.getElementById("schulteResetBtn").disabled = false;
    updateSchulteProgress();
    startSchulteClock();
}

function pauseSchulteGame() {
    if (!schulteState.running || schulteState.paused) return;
    schulteState.paused = true;
    stopSchulteClock();
    document.getElementById("schultePauseBtn").disabled = true;
    document.getElementById("schulteResumeBtn").disabled = false;
    showSchulteOverlay("⏸", "已暂停", "点击「恢复」继续训练。", "继续", false);
}

function resumeSchulteGame() {
    if (!schulteState.running || !schulteState.paused) return;
    schulteState.paused = false;
    document.getElementById("schulteOverlay").classList.add("hidden");
    document.getElementById("schultePauseBtn").disabled = false;
    document.getElementById("schulteResumeBtn").disabled = true;
    startSchulteClock();
}

function resetSchulteGame() {
    stopSchulteClock();
    schulteState.running = false;
    schulteState.paused = false;
    schulteState.finished = false;
    document.getElementById("schulteStartBtn").disabled = false;
    document.getElementById("schultePauseBtn").disabled = true;
    document.getElementById("schulteResumeBtn").disabled = true;
    document.getElementById("schulteResetBtn").disabled = false;
    showSchulteOverlay("🎯", "准备开始", schulteIdleDesc(), "开始训练", true);
    refreshSchulteIdle();
}

function finishSchulteGame(reason) {
    stopSchulteClock();
    schulteState.running = false;
    schulteState.finished = true;
    document.getElementById("schultePauseBtn").disabled = true;
    document.getElementById("schulteResumeBtn").disabled = true;
    document.getElementById("schulteStartBtn").disabled = false;
    const total = schulteState.count;
    const success = reason === "success";
    const usedMs = schulteState.elapsed;
    const found = schulteState.order === "asc" ? schulteState.next - 1 : total - schulteState.next + 1;
    if (success) {
        document.getElementById("schulteBoard").classList.add("solved");
        const desc = `你完成了全部 ${total} 个方格，用时 ${fmtSchulteTime(usedMs)}。`;
        showSchulteOverlay("🎉", "全部完成！", desc, "再来一局", true);
    } else {
        const desc = `本局未完成。已找到 ${Math.max(0, found)} / ${total} 个数字，用时 ${fmtSchulteTime(usedMs)}。`;
        showSchulteOverlay("🏁", "已结束本轮", desc, "再来一局", true);
    }
    saveSchulteRecord({
        size: schulteState.size, count: total, layout: schulteState.layout, order: schulteState.order,
        success, timeMs: Math.round(usedMs), found: Math.max(0, found),
        interf: { ...schulteState.interf }, date: Date.now(),
    });
}

function showSchulteOverlay(emoji, title, desc, btnText, startAction) {
    document.getElementById("schulteOverlayEmoji").textContent = emoji;
    document.getElementById("schulteOverlayTitle").textContent = title;
    document.getElementById("schulteOverlayDesc").textContent = desc;
    document.getElementById("schulteOverlayStart").textContent = btnText;
    document.getElementById("schulteOverlayStart").dataset.action = startAction ? "start" : "resume";
    document.getElementById("schulteOverlay").classList.remove("hidden");
}

function refreshSchulteIdle() {
    if (schulteState.running) return;
    schulteState.count = computeSchulteLayout(schulteState.layout, schulteState.size).count;
    schulteState.step = schulteState.order === "asc" ? 1 : -1;
    schulteState.next = schulteState.order === "asc" ? 1 : schulteState.count;
    document.getElementById("schulteTimeValue").textContent = "0.0s";
    buildSchulteBoard();
    schulteCellEls.forEach((c) => (c.style.pointerEvents = "none"));
    updateSchulteProgress();
    // 更新覆盖层描述
    if (!document.getElementById("schulteOverlay").classList.contains("hidden")) {
        document.getElementById("schulteOverlayDesc").textContent = schulteIdleDesc();
    }
}

// ---------- 历史记录 ----------
function loadSchulteRecords() {
    try { return JSON.parse(localStorage.getItem(SCHULTE_STORE_KEY)) || []; } catch (e) { return []; }
}

function saveSchulteRecord(rec) {
    const list = loadSchulteRecords();
    list.unshift(rec);
    if (list.length > 100) list.length = 100;
    try { localStorage.setItem(SCHULTE_STORE_KEY, JSON.stringify(list)); } catch (e) {}
    renderSchulteHistory();
}

function renderSchulteHistory() {
    const all = loadSchulteRecords();
    const list = document.getElementById("schulteHistoryList");
    const empty = document.getElementById("schulteHistoryEmpty");

    const okList = all.filter((r) => r.success);
    const best = okList.length ? okList.reduce((a, b) => (a.timeMs <= b.timeMs ? a : b)) : null;
    document.getElementById("schulteHistoryStats").innerHTML = `
                <div class="schulte-stat"><div class="schulte-stat-v">${all.length}</div><div class="schulte-stat-l">总场次</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${okList.length}</div><div class="schulte-stat-l">成功</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${best ? fmtSchulteTime(best.timeMs) : "—"}</div><div class="schulte-stat-l">最佳</div></div>
                <div class="schulte-stat"><div class="schulte-stat-v">${all.length ? Math.round((okList.length / all.length) * 100) + "%" : "—"}</div><div class="schulte-stat-l">成功率</div></div>`;

    list.innerHTML = "";
    empty.classList.toggle("hidden", all.length > 0);
    const interfTxt = (r) => Object.entries(r.interf || {}).filter(([, v]) => v)
        .map(([k]) => ({ color: "色", font: "字", jitter: "抖", mirror: "镜", zoneColor: "区", rotation: "转" }[k])).join("");
    all.slice(0, 20).forEach((r) => {
        const li = document.createElement("li");
        li.className = "schulte-history-item";
        const orderTxt = r.order === "desc" ? "倒" : "正";
        const resTxt = r.success ? "完成" : `弃 ${r.found}/${r.count}`;
        const resCls = r.success ? "res-ok" : "res-fail";
        const d = new Date(r.date);
        const dateStr = `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
        li.innerHTML = `
                    <div class="row1">
                        <span><span class="mode-badge">${orderTxt}</span>
                            &nbsp;${r.size}×${r.size}·${SCHULTE_LAYOUT_LABEL[r.layout] || "方"}${interfTxt(r) ? "·" + interfTxt(r) : ""}</span>
                        <span class="${resCls}">${resTxt}</span>
                    </div>
                    <div class="meta">⏱ ${fmtSchulteTime(r.timeMs)}</div>
                    <div class="date">${dateStr}</div>`;
        list.appendChild(li);
    });
}

// ===================== 样式注入 =====================
export function injectSchulteStyle() {
    if (document.getElementById("schulte-style")) return;
    const style = document.createElement("style");
    style.id = "schulte-style";
    style.textContent = SCHULTE_CSS;
    document.head.appendChild(style);
}

// ===================== HTML 渲染 =====================
export function renderSchulteHTML() {
    return SCHULTE_HTML;
}

// ===================== 初始化 =====================
export function initSchulte() {
    bindSchulteSeg("schulteSizeSeg", "size", (v) => {
        schulteState.size = parseInt(v, 10);
        refreshSchulteIdle();
    });
    bindSchulteSeg("schulteLayoutSeg", "layout", (v) => {
        schulteState.layout = v;
        refreshSchulteIdle();
    });
    bindSchulteSeg("schulteOrderSeg", "order", (v) => {
        schulteState.order = v;
        refreshSchulteIdle();
    });

    ["schulteInterfColor", "schulteInterfFont", "schulteInterfJitter", "schulteInterfMirror", "schulteInterfZoneColor", "schulteInterfRotation"].forEach((id) => {
        const key = id.replace("schulteInterf", "").replace(/^./, (c) => c.toLowerCase());
        document.getElementById(id).addEventListener("change", (e) => {
            schulteState.interf[key] = e.target.checked;
            updateSchulteAllInterferences();
        });
    });

    document.getElementById("schulteStartBtn").addEventListener("click", startSchulteGame);
    document.getElementById("schultePauseBtn").addEventListener("click", pauseSchulteGame);
    document.getElementById("schulteResumeBtn").addEventListener("click", resumeSchulteGame);
    document.getElementById("schulteResetBtn").addEventListener("click", resetSchulteGame);
    document.getElementById("schulteOverlayStart").addEventListener("click", () => {
        if (document.getElementById("schulteOverlayStart").dataset.action === "start") startSchulteGame();
        else resumeSchulteGame();
    });

    renderSchulteHistory();
    refreshSchulteIdle();
    showSchulteOverlay("🎯", "准备开始", schulteIdleDesc(), "开始训练", true);
}

// ===================== 挂载到 window（供 onclick 调用）=====================
if (typeof window !== "undefined") {
    window.startSchulteGame = startSchulteGame;
    window.pauseSchulteGame = pauseSchulteGame;
    window.resumeSchulteGame = resumeSchulteGame;
    window.resetSchulteGame = resetSchulteGame;
    window.confirmResetCounter = confirmResetCounter;
}

// ===================== CSS 文本 =====================
const SCHULTE_CSS = `
        /* 舒尔特方格新样式 */
        .schulte-app {
            display: flex;
            flex-direction: column;
            gap: 16px;
            align-items: center;
            margin-top: 15px;
            max-width: 700px;
            margin-left: auto;
            margin-right: auto;
        }

        .schulte-panel {
            background: white;
            border-radius: 18px;
            padding: 18px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            width: 100%;
        }

        .schulte-stage {
            width: 100%;
            display: flex;
            flex-direction: column;
            gap: 14px;
            order: -1;
        }

        .schulte-panel-title {
            font-size: 14px;
            letter-spacing: 1px;
            color: #64748b;
            text-transform: uppercase;
            margin-bottom: 14px;
            font-weight: 600;
        }

        .schulte-field {
            margin-bottom: 20px;
        }

        .schulte-field-label {
            display: block;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 9px;
            color: #1e293b;
        }

        .schulte-tag {
            font-size: 10px;
            background: linear-gradient(135deg, #667eea, #764ba2);
            color: #fff;
            padding: 2px 7px;
            border-radius: 20px;
            margin-left: 6px;
            vertical-align: middle;
        }

        .schulte-seg {
            display: flex;
            flex-wrap: wrap;
            gap: 7px;
        }

        .schulte-seg-btn {
            flex: 1 1 auto;
            min-width: 60px;
            padding: 8px 8px;
            font-size: 12px;
            border-radius: 10px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #64748b;
            cursor: pointer;
            transition: all 0.18s;
            font-family: inherit;
            font-weight: 500;
        }

        .schulte-seg-btn:hover {
            color: #1e293b;
            border-color: #667eea;
        }

        .schulte-seg-btn.active {
            color: #fff;
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-color: transparent;
            box-shadow: 0 4px 12px rgba(102, 126, 234, 0.35);
        }

        .schulte-checks {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
        }

        .schulte-check {
            flex: 1 1 calc(33.33% - 6px);
            min-width: 110px;
            display: flex;
            align-items: center;
            gap: 11px;
            cursor: pointer;
            user-select: none;
            padding: 7px 10px;
            border-radius: 10px;
            transition: background 0.15s;
        }

        .schulte-check:hover {
            background: #f8fafc;
        }

        .schulte-check input {
            display: none;
        }

        .schulte-check-box {
            width: 20px;
            height: 20px;
            border-radius: 6px;
            border: 2px solid #cbd5e1;
            position: relative;
            flex-shrink: 0;
            transition: all 0.18s;
        }

        .schulte-check input:checked + .schulte-check-box {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-color: transparent;
        }

        .schulte-check input:checked + .schulte-check-box::after {
            content: "✓";
            position: absolute;
            inset: 0;
            display: flex;
            align-items: center;
            justify-content: center;
            color: #fff;
            font-size: 13px;
            font-weight: 700;
        }

        .schulte-check-text {
            font-size: 13px;
            font-weight: 500;
            line-height: 1.2;
            color: #1e293b;
        }

        .schulte-check-text small {
            display: block;
            font-size: 10px;
            color: #94a3b8;
            font-weight: 400;
        }

        /* 游戏区 */
        .schulte-stage {
            display: flex;
            flex-direction: column;
            gap: 14px;
            width: 100%;
            order: -1;
        }

        .schulte-hud {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
        }

        .schulte-hud-item {
            background: white;
            border-radius: 14px;
            padding: 10px;
            text-align: center;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
        }

        .schulte-hud-label {
            display: block;
            font-size: 11px;
            color: #64748b;
            letter-spacing: 0.5px;
        }

        .schulte-hud-value {
            display: block;
            font-size: clamp(18px, 2.5vw, 26px);
            font-weight: 700;
            margin-top: 3px;
            font-variant-numeric: tabular-nums;
            color: #1e293b;
        }

        #schulteTargetNum {
            color: #667eea;
        }

        .schulte-hud-item.danger .schulte-hud-value {
            color: #dc2626;
        }

        .schulte-board-wrap {
            position: relative;
            background: linear-gradient(180deg, #eef4ed 0%, #d8e2dc 100%);
            border-radius: 18px;
            padding: 20px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            min-height: 300px;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .schulte-board {
            position: relative;
            width: 100%;
            max-width: min(65vh, 100%);
            aspect-ratio: 1 / 1;
        }

        .schulte-board-svg {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        }

        .schulte-cell {
            position: absolute;
            transform: translate(-50%, -50%);
            display: flex;
            align-items: center;
            justify-content: center;
            background: #f8fafc;
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            cursor: pointer;
            transition: left .5s cubic-bezier(.4, 0, .2, 1), top .5s cubic-bezier(.4, 0, .2, 1),
                        width .5s cubic-bezier(.4, 0, .2, 1), height .5s cubic-bezier(.4, 0, .2, 1),
                        opacity .4s ease, background .18s, transform .12s;
            user-select: none;
            -webkit-user-select: none;
            color: #1e293b;
            overflow: hidden;
        }

        .schulte-cell:hover {
            transform: translate(-50%, -50%) scale(1.06);
            background: #eef2ff;
        }

        .schulte-cell.correct {
            background: #dcfce7;
            color: #16a34a;
            pointer-events: none;
        }

        .schulte-cell.wrong {
            animation: schulte-shake 0.32s;
            background: #fee2e2;
        }

        @keyframes schulte-shake {
            0%, 100% { transform: translate(-50%, -50%); }
            20% { transform: translate(calc(-50% - 6px), -50%); }
            40% { transform: translate(calc(-50% + 6px), -50%); }
            60% { transform: translate(calc(-50% - 4px), -50%); }
            80% { transform: translate(calc(-50% + 4px), -50%); }
        }

        .schulte-cell .num {
            position: relative;
            z-index: 2;
        }

        /* 抖动干扰 */
        .schulte-board.jitter .schulte-cell {
            animation: schulte-jitter 0.9s ease-in-out infinite;
        }

        .schulte-board.jitter .schulte-cell:nth-child(3n) {
            animation-duration: 1.1s;
            animation-delay: 0.1s;
        }

        .schulte-board.jitter .schulte-cell:nth-child(3n+1) {
            animation-duration: 0.75s;
            animation-delay: 0.2s;
        }

        .schulte-board.jitter .schulte-cell:nth-child(2n) {
            animation-delay: 0.3s;
        }

        @keyframes schulte-jitter {
            0%, 100% { transform: translate(-50%, -50%) translate(0, 0) rotate(0deg); }
            25% { transform: translate(-50%, -50%) translate(2px, -2px) rotate(0.6deg); }
            50% { transform: translate(-50%, -50%) translate(-2px, 2px) rotate(-0.6deg); }
            75% { transform: translate(-50%, -50%) translate(1px, 1px) rotate(0.3deg); }
        }

        /* 旋转干扰 */
        .schulte-board.rotate {
            animation: none;
        }

        .schulte-board.rotate .schulte-ring.ring-0 {
            animation: schulte-ring-rotate-cw 20s linear infinite;
        }
        .schulte-board.rotate .schulte-ring.ring-1 {
            animation: schulte-ring-rotate-ccw 30s linear infinite;
        }
        .schulte-board.rotate .schulte-ring.ring-2 {
            animation: schulte-ring-rotate-cw 40s linear infinite;
        }
        .schulte-board.rotate .schulte-ring.ring-3 {
            animation: schulte-ring-rotate-ccw 50s linear infinite;
        }
        .schulte-board.rotate .schulte-ring.ring-4 {
            animation: schulte-ring-rotate-cw 60s linear infinite;
        }

        .schulte-board.rotate .schulte-svg-ring.ring-0 {
            animation: schulte-svg-ring-rotate-cw 20s linear infinite;
            transform-origin: 50px 50px;
        }
        .schulte-board.rotate .schulte-svg-ring.ring-1 {
            animation: schulte-svg-ring-rotate-ccw 30s linear infinite;
            transform-origin: 50px 50px;
        }
        .schulte-board.rotate .schulte-svg-ring.ring-2 {
            animation: schulte-svg-ring-rotate-cw 40s linear infinite;
            transform-origin: 50px 50px;
        }
        .schulte-board.rotate .schulte-svg-ring.ring-3 {
            animation: schulte-svg-ring-rotate-ccw 50s linear infinite;
            transform-origin: 50px 50px;
        }
        .schulte-board.rotate .schulte-svg-ring.ring-4 {
            animation: schulte-svg-ring-rotate-cw 60s linear infinite;
            transform-origin: 50px 50px;
        }

        .schulte-ring {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
        }
        .schulte-ring .schulte-cell {
            pointer-events: auto;
        }

        /* 数字反向旋转保持水平 */
        .schulte-board.rotate .ring-0 .schulte-cell .num {
            animation: schulte-num-rotate-ccw 20s linear infinite;
            display: inline-block;
        }
        .schulte-board.rotate .ring-1 .schulte-cell .num {
            animation: schulte-num-rotate-cw 30s linear infinite;
            display: inline-block;
        }
        .schulte-board.rotate .ring-2 .schulte-cell .num {
            animation: schulte-num-rotate-ccw 40s linear infinite;
            display: inline-block;
        }
        .schulte-board.rotate .ring-3 .schulte-cell .num {
            animation: schulte-num-rotate-cw 50s linear infinite;
            display: inline-block;
        }
        .schulte-board.rotate .ring-4 .schulte-cell .num {
            animation: schulte-num-rotate-ccw 60s linear infinite;
            display: inline-block;
        }

        @keyframes schulte-num-rotate-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes schulte-num-rotate-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        @keyframes schulte-ring-rotate-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes schulte-ring-rotate-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }
        @keyframes schulte-svg-ring-rotate-cw {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
        }
        @keyframes schulte-svg-ring-rotate-ccw {
            from { transform: rotate(0deg); }
            to { transform: rotate(-360deg); }
        }

        /* 镜像干扰 */
        .schulte-cell.mirror .num {
            display: inline-block;
            transform: scaleX(-1);
        }

        /* 蜂窝布局专用 */
        .schulte-board.layout-hexagon .schulte-cell {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
            z-index: 1;
        }

        .schulte-board.layout-hexagon .schulte-cell:hover {
            background: rgba(107, 144, 128, 0.12) !important;
            transform: translate(-50%, -50%) scale(1.06);
        }

        .schulte-board.layout-hexagon .schulte-cell.correct {
            background: transparent !important;
            color: #dc2626;
        }

        .schulte-board.layout-hexagon .schulte-cell.wrong {
            background: transparent !important;
        }

        /* 圆形布局专用 */
        .schulte-board.layout-circle .schulte-cell {
            background: transparent !important;
            border: none !important;
            border-radius: 0 !important;
            box-shadow: none !important;
        }

        .schulte-board.layout-circle .schulte-cell:hover {
            background: transparent !important;
            transform: translate(-50%, -50%) scale(1.06);
        }

        .schulte-board.layout-circle .schulte-cell.correct {
            background: transparent !important;
            color: #16a34a;
        }

        .schulte-board.layout-circle .schulte-cell.wrong {
            background: transparent !important;
        }

        /* 字体干扰 */
        .font-round {
            font-family: "Comic Sans MS", "Chalkboard SE", "PingFang SC", cursive;
        }

        .font-serif {
            font-family: Georgia, "Times New Roman", "Songti SC", serif;
        }

        .font-mono {
            font-family: "SF Mono", "Consolas", "Courier New", monospace;
        }

        .font-cond {
            font-family: "Arial Narrow", "Helvetica Neue", sans-serif;
            font-stretch: condensed;
        }

        /* 覆盖层 */
        .schulte-overlay {
            position: absolute;
            inset: 0;
            background: rgba(15, 23, 42, 0.45);
            backdrop-filter: blur(6px);
            -webkit-backdrop-filter: blur(6px);
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 18px;
            z-index: 5;
        }

        .schulte-overlay.hidden {
            display: none;
        }

        .schulte-overlay-card {
            background: white;
            border-radius: 18px;
            padding: 28px 32px;
            text-align: center;
            max-width: 80%;
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
        }

        .schulte-overlay-emoji {
            font-size: 42px;
            margin-bottom: 10px;
        }

        .schulte-overlay-card h3 {
            font-size: 20px;
            margin-bottom: 8px;
            color: #1e293b;
        }

        .schulte-overlay-card p {
            font-size: 13px;
            color: #64748b;
            margin-bottom: 16px;
            line-height: 1.6;
        }

        /* 控制按钮 */
        .schulte-controls {
            display: flex;
            gap: 10px;
            flex-wrap: wrap;
            justify-content: center;
        }

        .schulte-btn {
            padding: 11px 22px;
            border-radius: 12px;
            border: 1px solid #e2e8f0;
            background: #f8fafc;
            color: #1e293b;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.18s;
            font-family: inherit;
            min-width: 85px;
        }

        .schulte-btn:hover:not(:disabled) {
            transform: translateY(-2px);
            border-color: #667eea;
        }

        .schulte-btn:disabled {
            opacity: 0.4;
            cursor: not-allowed;
        }

        .schulte-btn.primary {
            background: linear-gradient(135deg, #667eea, #764ba2);
            border-color: transparent;
            color: #fff;
            box-shadow: 0 6px 18px rgba(102, 126, 234, 0.35);
        }

        .schulte-btn.ghost {
            background: transparent;
        }

        /* 历史记录 */
        .schulte-history-stats {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 8px;
            margin-bottom: 14px;
        }

        .schulte-stat {
            background: #f8fafc;
            border-radius: 10px;
            padding: 8px 10px;
        }

        .schulte-stat .schulte-stat-v {
            font-size: 16px;
            font-weight: 700;
            color: #1e293b;
        }

        .schulte-stat .schulte-stat-l {
            font-size: 10px;
            color: #64748b;
        }

        .schulte-history-list {
            list-style: none;
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-height: 50vh;
            overflow-y: auto;
            padding: 0;
            margin: 0;
        }

        .schulte-history-item {
            background: #f8fafc;
            border-radius: 10px;
            padding: 9px 12px;
            display: flex;
            flex-direction: column;
            gap: 3px;
            animation: schulte-fadeIn 0.3s;
        }

        @keyframes schulte-fadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: none; }
        }

        .schulte-history-item .row1 {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }

        .schulte-history-item .mode-badge {
            font-size: 10px;
            padding: 2px 7px;
            border-radius: 20px;
            background: rgba(102, 126, 234, 0.15);
            color: #667eea;
            font-weight: 600;
        }

        .schulte-history-item .res-ok {
            color: #16a34a;
            font-weight: 700;
        }

        .schulte-history-item .res-fail {
            color: #dc2626;
            font-weight: 700;
        }

        .schulte-history-item .meta {
            font-size: 11px;
            color: #64748b;
        }

        .schulte-history-item .date {
            font-size: 10px;
            color: #94a3b8;
        }

        .schulte-empty {
            font-size: 12px;
            color: #94a3b8;
            text-align: center;
            padding: 16px 0;
        }

        /* 完成动画 */
        .schulte-board.solved .schulte-cell {
            animation: schulte-celebrate 0.6s ease;
        }

        @keyframes schulte-celebrate {
            0% { transform: translate(-50%, -50%) scale(1); }
            40% { transform: translate(-50%, -50%) scale(1.12); }
            100% { transform: translate(-50%, -50%) scale(1); }
        }

        @media (max-width: 480px) {
            /* 舒尔特方格小屏幕适配 */
            .schulte-hud-value {
                font-size: 18px;
            }

            .schulte-btn {
                flex: 1 1 auto;
                min-width: 0;
                padding: 10px 12px;
            }

            .schulte-board {
                max-width: 92vw;
            }

            .btn, .action-btn {
                padding: 10px 18px;
                font-size: 13px;
            }
        }
`;

// ===================== HTML 文本 =====================
const SCHULTE_HTML = `
        <!-- 舒尔特方格游戏页面 -->
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="gradient-header">
                <h1>🎯 舒尔特方格</h1>
                <p>按顺序点击数字，锻炼专注力</p>
            </div>
            <div class="schulte-app">
                <!-- 设置面板 -->
                <div class="schulte-panel schulte-settings">
                    <h3 class="schulte-panel-title">训练设置</h3>

                    <div class="schulte-field">
                        <label class="schulte-field-label">方格规模</label>
                        <div class="schulte-seg" id="schulteSizeSeg">
                            <button class="schulte-seg-btn active" data-size="5">25 (5×5)</button>
                            <button class="schulte-seg-btn" data-size="6">36 (6×6)</button>
                            <button class="schulte-seg-btn" data-size="7">49 (7×7)</button>
                        </div>
                    </div>

                    <div class="schulte-field">
                        <label class="schulte-field-label">图形布局</label>
                        <div class="schulte-seg" id="schulteLayoutSeg">
                            <button class="schulte-seg-btn active" data-layout="grid">方形</button>
                            <button class="schulte-seg-btn" data-layout="circle">圆形</button>
                            <button class="schulte-seg-btn" data-layout="hexagon">蜂巢</button>
                            <button class="schulte-seg-btn" data-layout="radial">圆盘</button>
                        </div>
                    </div>

                    <div class="schulte-field">
                        <label class="schulte-field-label">排序模式</label>
                        <div class="schulte-seg" id="schulteOrderSeg">
                            <button class="schulte-seg-btn active" data-order="asc">正序 ↑</button>
                            <button class="schulte-seg-btn" data-order="desc">倒序 ↓</button>
                        </div>
                    </div>

                    <div class="schulte-field">
                        <label class="schulte-field-label">干扰模式 <span class="schulte-tag">可叠加</span></label>
                        <div class="schulte-checks">
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfColor" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">颜色干扰<small>数字随机配色</small></span>
                            </label>
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfFont" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">字体干扰<small>随机字体形态</small></span>
                            </label>
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfJitter" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">抖动干扰<small>格子周期抖动</small></span>
                            </label>
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfMirror" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">镜像干扰<small>部分数字翻转</small></span>
                            </label>
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfZoneColor" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">色块分区<small>按区域区分背景色</small></span>
                            </label>
                            <label class="schulte-check">
                                <input type="checkbox" id="schulteInterfRotation" />
                                <span class="schulte-check-box"></span>
                                <span class="schulte-check-text">旋转干扰<small>仅圆形/圆盘模式生效</small></span>
                            </label>
                        </div>
                    </div>
                </div>

                <!-- 游戏区 -->
                <div class="schulte-stage">
                    <div class="schulte-hud">
                        <div class="schulte-hud-item">
                            <span class="schulte-hud-label">当前目标</span>
                            <span class="schulte-hud-value" id="schulteTargetNum">—</span>
                        </div>
                        <div class="schulte-hud-item">
                            <span class="schulte-hud-label">用时</span>
                            <span class="schulte-hud-value" id="schulteTimeValue">0.0s</span>
                        </div>
                        <div class="schulte-hud-item">
                            <span class="schulte-hud-label">进度</span>
                            <span class="schulte-hud-value" id="schulteProgressValue">0 / 25</span>
                        </div>
                    </div>

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
                </div>

                <!-- 历史记录 -->
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
