// 中华历史时间轴 ES Module

// ===================== 历史数据 =====================
const HISTORY_DYNASTIES = [
    {
        id: "xia",
        name: "夏朝",
        period: "前2070年 — 前1600年",
        duration: "共471年",
        color: "#d97706",
        emoji: "👑",
        summary: "中国历史上第一个王朝",
        events: [
            { title: "大禹治水", desc: "禹因治水有功，受舜禅让而称帝" },
            { title: "世袭制开始", desc: "启继承父业，家天下取代公天下" },
            { title: "青铜器萌芽", desc: "进入青铜时代，文明奠基" },
        ],
    },
    {
        id: "shang",
        name: "商朝",
        period: "前1600年 — 前1046年",
        duration: "共554年",
        color: "#b45309",
        emoji: "🏺",
        summary: "甲骨文、青铜器鼎盛时期",
        events: [
            { title: "商汤灭夏", desc: "汤于鸣条之战击败夏桀，建立商朝" },
            { title: "甲骨文成熟", desc: "殷墟出土甲骨文，文字体系完善" },
            { title: "司母戊鼎", desc: "世界最大的青铜器代表" },
        ],
    },
    {
        id: "zhou",
        name: "周朝",
        period: "前1046年 — 前256年",
        duration: "共790年",
        color: "#0891b2",
        emoji: "🎭",
        summary: "分封制、礼乐制，文化奠基",
        events: [
            { title: "武王伐纣", desc: "牧野之战，周朝建立" },
            { title: "分封制", desc: "周天子将土地分封给诸侯" },
            { title: "礼乐文明", desc: "周公制礼作乐，影响千年" },
            { title: "春秋战国", desc: "诸侯争霸，百家争鸣" },
        ],
    },
    {
        id: "qin",
        name: "秦朝",
        period: "前221年 — 前207年",
        duration: "共16年",
        color: "#9333ea",
        emoji: "⚔️",
        summary: "中国第一个大一统王朝",
        events: [
            { title: "秦始皇统一", desc: "灭六国，建立中央集权制" },
            { title: "书同文车同轨", desc: "统一文字、度量衡、货币" },
            { title: "万里长城", desc: "修建长城抵御北方游牧民族" },
            { title: "秦制影响千年", desc: "郡县制奠定后世政治格局" },
        ],
    },
    {
        id: "han",
        name: "汉朝",
        period: "前202年 — 220年",
        duration: "共420年",
        color: "#dc2626",
        emoji: "🐉",
        summary: "丝绸之路、汉文化形成",
        events: [
            { title: "文景之治", desc: "休养生息，开创盛世" },
            { title: "汉武盛世", desc: "北击匈奴，开疆拓土" },
            { title: "丝绸之路", desc: "张骞凿空，开辟东西商道" },
            { title: "造纸术", desc: "蔡伦改进造纸术，推动文明传播" },
        ],
    },
    {
        id: "sanguo",
        name: "三国两晋南北朝",
        period: "220年 — 589年",
        duration: "共370年",
        color: "#0d9488",
        emoji: "🏯",
        summary: "分裂中的民族大融合",
        events: [
            { title: "三国鼎立", desc: "魏蜀吴三分天下" },
            { title: "五胡乱华", desc: "北方多民族政权更替" },
            { title: "南北朝对峙", desc: "南北政权长期并存" },
            { title: "佛教兴盛", desc: "佛教传入并广泛传播" },
        ],
    },
    {
        id: "sui",
        name: "隋朝",
        period: "581年 — 618年",
        duration: "共38年",
        color: "#ca8a04",
        emoji: "🏛️",
        summary: "重新统一，开凿大运河",
        events: [
            { title: "杨坚代周", desc: "建立隋朝，结束南北分裂" },
            { title: "开皇之治", desc: "开创繁荣盛世" },
            { title: "大运河", desc: "贯通南北水上交通命脉" },
            { title: "科举制雏形", desc: "开创通过考试选拔官吏的制度" },
        ],
    },
    {
        id: "tang",
        name: "唐朝",
        period: "618年 — 907年",
        duration: "共290年",
        color: "#ea580c",
        emoji: "🏮",
        summary: "盛世巅峰，万国来朝",
        events: [
            { title: "贞观之治", desc: "太宗开创盛世典范" },
            { title: "开元盛世", desc: "玄宗时期经济文化顶峰" },
            { title: "安史之乱", desc: "由盛转衰的转折点" },
            { title: "诗歌鼎盛", desc: "李白、杜甫等伟大诗人辈出" },
            { title: "对外交流", desc: "遣唐使、丝绸之路空前繁荣" },
        ],
    },
    {
        id: "song",
        name: "宋朝",
        period: "960年 — 1279年",
        duration: "共320年",
        color: "#7c3aed",
        emoji: "📜",
        summary: "经济文化科技高度发达",
        events: [
            { title: "陈桥兵变", desc: "赵匡胤建立宋朝" },
            { title: "重文轻武", desc: "文官政治，文化繁荣" },
            { title: "四大发明成熟", desc: "活字印刷、指南针、火药" },
            { title: "海外贸易", desc: "泉州等港口繁荣" },
            { title: "理学兴起", desc: "程朱理学影响深远" },
        ],
    },
    {
        id: "yuan",
        name: "元朝",
        period: "1271年 — 1368年",
        duration: "共98年",
        color: "#2563eb",
        emoji: "🐎",
        summary: "疆域空前，多元文化",
        events: [
            { title: "忽必烈建元", desc: "建立元朝，统一中国" },
            { title: "行省制度", desc: "创立行省制沿用至今" },
            { title: "戏曲繁荣", desc: "元曲、杂剧达到高峰" },
            { title: "对外交流", desc: "马可波罗来华，东西交流" },
        ],
    },
    {
        id: "ming",
        name: "明朝",
        period: "1368年 — 1644年",
        duration: "共277年",
        color: "#16a34a",
        emoji: "⛵",
        summary: "郑和下西洋，科技文化繁荣",
        events: [
            { title: "朱元璋建明", desc: "推翻元朝，建立明朝" },
            { title: "郑和下西洋", desc: "七下西洋，最远抵非洲" },
            { title: "紫禁城", desc: "修建北京故宫" },
            { title: "小说鼎盛", desc: "三国演义、水浒传等名著" },
            { title: "西学东渐", desc: "利玛窦等传教士东来" },
        ],
    },
    {
        id: "qing",
        name: "清朝",
        period: "1644年 — 1912年",
        duration: "共268年",
        color: "#4f46e5",
        emoji: "🏵️",
        summary: "最后一个封建王朝",
        events: [
            { title: "清军入关", desc: "建立全国统治" },
            { title: "康乾盛世", desc: "三代皇帝开创盛世" },
            { title: "闭关锁国", desc: "限制对外交流，逐渐落后" },
            { title: "鸦片战争", desc: "近代屈辱史开始" },
            { title: "辛亥革命", desc: "结束两千余年帝制" },
        ],
    },
    {
        id: "modern",
        name: "近现代",
        period: "1912年 — 至今",
        duration: "百余年",
        color: "#0ea5e9",
        emoji: "🚀",
        summary: "走向现代化的历程",
        events: [
            { title: "民国建立", desc: "亚洲第一个共和制国家" },
            { title: "新文化运动", desc: "民主与科学思想传播" },
            { title: "新中国成立", desc: "人民站起来了" },
            { title: "改革开放", desc: "经济腾飞，综合国力提升" },
            { title: "科技崛起", desc: "航天、高铁、5G引领世界" },
        ],
    },
];

// ===================== 渲染函数 =====================

export function renderHistoryHTML() {
    const dynastyCards = HISTORY_DYNASTIES.map((d, i) => {
        const side = i % 2 === 0 ? "left" : "right";
        return `
            <div class="htl-dynasty htl-${side}">
                <div class="htl-dot" style="background:${d.color}"></div>
                <div class="htl-line" style="background:${d.color}"></div>
                <div class="htl-card" style="border-color:${d.color}">
                    <div class="htl-card-header" style="background:${d.color}">
                        <span class="htl-emoji">${d.emoji}</span>
                        <span class="htl-name">${d.name}</span>
                    </div>
                    <div class="htl-card-body">
                        <div class="htl-period">
                            <span class="htl-period-label">时期</span>
                            <span class="htl-period-val">${d.period}</span>
                        </div>
                        <div class="htl-duration">${d.duration}</div>
                        <div class="htl-summary">${d.summary}</div>
                        <div class="htl-events">
                            ${d.events.map(e => `
                                <div class="htl-event">
                                    <div class="htl-event-title">${e.title}</div>
                                    <div class="htl-event-desc">${e.desc}</div>
                                </div>
                            `).join("")}
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join("");

    return `
        <div class="htl-page">
            <div class="htl-hero">
                <div class="htl-hero-title">📜 中华历史时间轴</div>
                <div class="htl-hero-sub">从夏朝到现代 · 五千年文明长河</div>
                <div class="htl-hero-scroll">⬇️ 向下滚动探索</div>
            </div>
            <div class="htl-timeline">
                <div class="htl-timeline-line"></div>
                ${dynastyCards}
            </div>
            <div class="htl-footer">
                <div class="htl-footer-line"></div>
                <div class="htl-footer-text">🌟 五千年文明，生生不息</div>
            </div>
        </div>
    `;
}

// ===================== CSS =====================

export function injectHistoryStyle() {
    const id = "history-module-style";
    if (document.getElementById(id)) return;
    const style = document.createElement("style");
    style.id = id;
    style.textContent = `
        .htl-page {
            padding: 16px;
            max-width: 100%;
        }

        .htl-hero {
            text-align: center;
            padding: 40px 20px 60px;
            background: linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%);
            border-radius: 20px;
            margin-bottom: 30px;
            box-shadow: 0 10px 30px rgba(245, 158, 11, 0.2);
            position: relative;
            overflow: hidden;
        }

        .htl-hero::before {
            content: "📜";
            position: absolute;
            font-size: 200px;
            opacity: 0.15;
            top: -20px;
            right: -20px;
        }

        .htl-hero-title {
            font-size: 28px;
            font-weight: 800;
            color: #7c2d12;
            margin-bottom: 12px;
            text-shadow: 2px 2px 0 rgba(255,255,255,0.5);
        }

        .htl-hero-sub {
            font-size: 16px;
            color: #92400e;
            margin-bottom: 20px;
        }

        .htl-hero-scroll {
            display: inline-block;
            padding: 8px 20px;
            background: rgba(255,255,255,0.6);
            border-radius: 999px;
            color: #92400e;
            font-size: 14px;
            animation: htl-bounce 1.5s infinite;
        }

        @keyframes htl-bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(8px); }
        }

        .htl-timeline {
            position: relative;
            padding: 20px 0 40px;
        }

        .htl-timeline-line {
            position: absolute;
            left: 50%;
            top: 0;
            bottom: 0;
            width: 4px;
            background: linear-gradient(to bottom, #f59e0b, #8b5cf6, #ec4899);
            transform: translateX(-50%);
            border-radius: 2px;
            opacity: 0.7;
        }

        .htl-dynasty {
            position: relative;
            width: 50%;
            padding: 20px 40px;
            box-sizing: border-box;
        }

        .htl-dynasty.htl-left {
            left: 0;
            text-align: right;
        }

        .htl-dynasty.htl-right {
            left: 50%;
            text-align: left;
        }

        .htl-dot {
            position: absolute;
            top: 30px;
            width: 18px;
            height: 18px;
            border-radius: 50%;
            border: 4px solid white;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            z-index: 2;
        }

        .htl-left .htl-dot {
            right: -9px;
        }

        .htl-right .htl-dot {
            left: -9px;
        }

        .htl-line {
            position: absolute;
            top: 38px;
            height: 2px;
            opacity: 0.5;
        }

        .htl-left .htl-line {
            right: -25px;
            width: 25px;
        }

        .htl-right .htl-line {
            left: -25px;
            width: 25px;
        }

        .htl-card {
            background: white;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 8px 24px rgba(0,0,0,0.08);
            border: 2px solid;
            transition: all 0.3s ease;
        }

        .htl-card:hover {
            transform: translateY(-4px);
            box-shadow: 0 16px 40px rgba(0,0,0,0.15);
        }

        .htl-card-header {
            color: white;
            padding: 12px 16px;
            display: flex;
            align-items: center;
            gap: 10px;
            justify-content: inherit;
        }

        .htl-left .htl-card-header {
            flex-direction: row-reverse;
        }

        .htl-emoji {
            font-size: 24px;
        }

        .htl-name {
            font-size: 22px;
            font-weight: 800;
            letter-spacing: 2px;
        }

        .htl-card-body {
            padding: 16px;
            text-align: left;
        }

        .htl-period {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-bottom: 4px;
        }

        .htl-left .htl-period {
            flex-direction: row-reverse;
        }

        .htl-period-label {
            font-size: 12px;
            color: #94a3b8;
            background: #f1f5f9;
            padding: 2px 8px;
            border-radius: 4px;
        }

        .htl-period-val {
            font-size: 14px;
            color: #64748b;
            font-weight: 600;
        }

        .htl-duration {
            font-size: 12px;
            color: #94a3b8;
            margin-bottom: 8px;
        }

        .htl-left .htl-duration {
            text-align: right;
        }

        .htl-summary {
            font-size: 14px;
            color: #475569;
            font-weight: 600;
            padding: 8px 10px;
            background: #f8fafc;
            border-radius: 8px;
            margin-bottom: 12px;
            border-left: 3px solid #e2e8f0;
        }

        .htl-events {
            display: flex;
            flex-direction: column;
            gap: 8px;
        }

        .htl-event {
            padding: 10px 12px;
            background: #fefce8;
            border-radius: 8px;
            border-left: 3px solid #eab308;
            transition: all 0.2s ease;
        }

        .htl-event:hover {
            background: #fef3c7;
            transform: translateX(4px);
        }

        .htl-event-title {
            font-size: 14px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 4px;
        }

        .htl-event-desc {
            font-size: 13px;
            color: #78350f;
            line-height: 1.5;
        }

        .htl-footer {
            text-align: center;
            padding: 40px 20px;
        }

        .htl-footer-line {
            width: 100px;
            height: 3px;
            background: linear-gradient(to right, transparent, #f59e0b, transparent);
            margin: 0 auto 20px;
            border-radius: 2px;
        }

        .htl-footer-text {
            font-size: 18px;
            color: #78350f;
            font-weight: 600;
        }

        @media (max-width: 768px) {
            .htl-timeline-line {
                left: 20px;
            }

            .htl-dynasty,
            .htl-dynasty.htl-right {
                width: 100%;
                left: 0;
                padding: 20px 10px 20px 40px;
                text-align: left;
            }

            .htl-dynasty.htl-left {
                text-align: left;
            }

            .htl-dot {
                left: 11px !important;
                right: auto !important;
            }

            .htl-line {
                left: -25px !important;
                right: auto !important;
            }

            .htl-left .htl-card-header {
                flex-direction: row;
            }

            .htl-left .htl-period {
                flex-direction: row;
                justify-content: flex-start;
            }

            .htl-left .htl-duration {
                text-align: left;
            }

            .htl-hero-title {
                font-size: 22px;
            }
        }

        @media (max-width: 480px) {
            .htl-page {
                padding: 10px;
            }

            .htl-hero {
                padding: 30px 15px 40px;
            }

            .htl-hero-title {
                font-size: 20px;
            }

            .htl-name {
                font-size: 18px;
            }

            .htl-card-body {
                padding: 12px;
            }
        }
    `;
    document.head.appendChild(style);
}

export function initHistory() {
    document.getElementById("historyPage").scrollTop = 0;
}
