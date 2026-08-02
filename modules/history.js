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
        summary: "中国历史上第一个王朝，开启家天下时代",
        rulers: "禹 → 启 → 太康 → 少康 → 桀(亡)",
        events: [
            { date: "前2070年", title: "夏朝建立", desc: "禹因治水有功，受舜禅让而称帝，夏朝建立" },
            { date: "前2061年", title: "启家天下", desc: "启继承父业，世袭制取代禅让制，家天下开始" },
            { date: "前1961年", title: "少康中兴", desc: "少康平定寒浞之乱，恢复夏朝统治" },
            { date: "前1652年", title: "孔甲乱政", desc: "孔甲好鬼神之事，不修政事，诸侯多叛" },
            { date: "前1600年", title: "夏桀亡国", desc: "桀暴虐无道，商汤于鸣条之战击败夏桀" },
        ],
    },
    {
        id: "shang",
        name: "商朝",
        period: "前1600年 — 前1046年",
        duration: "共554年",
        color: "#b45309",
        emoji: "🏺",
        summary: "甲骨文、青铜器鼎盛，华夏文字形成",
        rulers: "成汤 → 盘庚 → 武丁 → 帝辛(纣,亡)",
        events: [
            { date: "前1600年", title: "商汤灭夏", desc: "成汤于鸣条之战击败夏桀，建立商朝" },
            { date: "前1300年", title: "盘庚迁殷", desc: "盘庚迁都至殷，史称盘庚迁殷，国势复兴" },
            { date: "前1250年", title: "武丁中兴", desc: "武丁任用贤相傅说、甘盘，开创盛世" },
            { date: "前1200年", title: "甲骨文成熟", desc: "殷墟出土甲骨文，汉字体系臻于完善" },
            { date: "前1046年", title: "牧野之战", desc: "周武王姬发率诸侯联军击败商纣，商朝灭亡" },
        ],
    },
    {
        id: "zhou",
        name: "周朝",
        period: "前1046年 — 前256年",
        duration: "共790年",
        color: "#0891b2",
        emoji: "🎭",
        summary: "分封制、礼乐制奠基，百家争鸣",
        rulers: "武王 → 成王 → 康王 → 幽王(亡)",
        events: [
            { date: "前1046年", title: "武王伐纣", desc: "牧野之战，周武王灭商，建立周朝" },
            { date: "前1042年", title: "周公摄政", desc: "周公旦制礼作乐，辅佐成王，奠定周制" },
            { date: "前841年", title: "国人暴动", desc: "周厉王专利，国人暴动，共和行政开始" },
            { date: "前771年", title: "犬戎破镐", desc: "犬戎攻破镐京，周幽王被杀，西周亡" },
            { date: "前770年", title: "平王东迁", desc: "周平王东迁洛邑，东周开始" },
            { date: "前551年", title: "孔子诞生", desc: "儒家学派创始人孔子诞生，文化奠基" },
            { date: "前256年", title: "秦灭东周", desc: "秦庄襄王灭东周，周朝正式终结" },
        ],
    },
    {
        id: "qin",
        name: "秦朝",
        period: "前221年 — 前207年",
        duration: "共16年",
        color: "#9333ea",
        emoji: "⚔️",
        summary: "中国第一个大一统王朝，制度奠基",
        rulers: "秦始皇嬴政 → 秦二世胡亥 → 子婴(亡)",
        events: [
            { date: "前221年", title: "六国归一", desc: "秦始皇嬴政灭齐，完成统一六国大业" },
            { date: "前220年", title: "书同文", desc: "统一文字为小篆，度量衡、货币均统一" },
            { date: "前214年", title: "修长城", desc: "蒙恬连接旧长城，修建万里长城御匈奴" },
            { date: "前213年", title: "焚书坑儒", desc: "始皇采纳李斯建议，焚毁诸子百家书籍" },
            { date: "前210年", title: "始皇驾崩", desc: "秦始皇东巡途中病逝，李斯赵高矫诏" },
            { date: "前209年", title: "陈胜吴广起义", desc: "大泽乡起义，中国历史上第一次大规模农民起义" },
            { date: "前207年", title: "秦朝灭亡", desc: "子婴在位46天便投降刘邦，秦朝亡" },
        ],
    },
    {
        id: "han",
        name: "汉朝",
        period: "前202年 — 220年",
        duration: "共420年",
        color: "#dc2626",
        emoji: "🐉",
        summary: "丝绸之路开通，汉文化定型",
        rulers: "高祖刘邦 → 文帝 → 景帝 → 武帝 → 献帝(亡)",
        events: [
            { date: "前202年", title: "刘邦建汉", desc: "楚汉相争，刘邦击败项羽，建立汉朝" },
            { date: "前180年", title: "文景之治", desc: "文帝、景帝休养生息，开创古代盛世" },
            { date: "前141年", title: "汉武登基", desc: "刘彻继位，开疆拓土，北击匈奴" },
            { date: "前138年", title: "张骞通西域", desc: "张骞凿空西域，开辟丝绸之路" },
            { date: "前127年", title: "推恩令", desc: "主父偃建议推恩令，削弱诸侯王势力" },
            { date: "105年", title: "蔡伦造纸", desc: "蔡伦改进造纸术，推动世界文明传播" },
            { date: "184年", title: "黄巾起义", desc: "张角领导黄巾起义，汉朝由盛转衰" },
            { date: "220年", title: "汉朝终结", desc: "曹丕废汉献帝，建立魏国，汉朝亡" },
        ],
    },
    {
        id: "sanguo",
        name: "三国两晋南北朝",
        period: "220年 — 589年",
        duration: "共370年",
        color: "#0d9488",
        emoji: "🏯",
        summary: "分裂中的民族大融合，佛教兴盛",
        rulers: "三国 → 西晋 → 东晋 → 南北朝",
        events: [
            { date: "220年", title: "三国鼎立", desc: "曹丕建魏、刘备建蜀、孙权建吴，三分天下" },
            { date: "280年", title: "西晋统一", desc: "晋武帝司马炎灭吴，结束三国分裂" },
            { date: "316年", title: "西晋灭亡", desc: "匈奴攻破长安，西晋亡，东晋南迁" },
            { date: "383年", title: "淝水之战", desc: "东晋以少胜多击败前秦，南北对峙格局形成" },
            { date: "494年", title: "孝文帝汉化", desc: "北魏孝文帝迁都洛阳，推行汉化改革" },
            { date: "589年", title: "隋灭陈", desc: "隋文帝灭陈，结束近三百年分裂局面" },
        ],
    },
    {
        id: "sui",
        name: "隋朝",
        period: "581年 — 618年",
        duration: "共38年",
        color: "#ca8a04",
        emoji: "🏛️",
        summary: "重新统一，开皇盛世，开凿大运河",
        rulers: "文帝杨坚 → 炀帝杨广 → 恭帝杨侑(亡)",
        events: [
            { date: "581年", title: "杨坚代周", desc: "杨坚受禅代周，建立隋朝，国号隋" },
            { date: "589年", title: "统一南北", desc: "隋军南下灭陈，结束三百年分裂" },
            { date: "595年", title: "开皇之治", desc: "文帝励精图治，开创开皇盛世" },
            { date: "605年", title: "隋炀帝即位", desc: "杨广弑父杀兄即位，年号大业" },
            { date: "605年", title: "开凿大运河", desc: "炀帝征发百万民工开凿南北大运河" },
            { date: "607年", title: "营建东都", desc: "炀帝迁都洛阳，大修宫殿园林" },
            { date: "618年", title: "隋亡唐兴", desc: "李渊起兵太原，建立唐朝，隋朝亡" },
        ],
    },
    {
        id: "tang",
        name: "唐朝",
        period: "618年 — 907年",
        duration: "共290年",
        color: "#ea580c",
        emoji: "🏮",
        summary: "盛世巅峰，诗歌鼎盛，万国来朝",
        rulers: "高祖 → 太宗 → 高宗 → 玄宗 → 哀帝(亡)",
        events: [
            { date: "618年", title: "李渊建唐", desc: "李渊建立唐朝，年号武德" },
            { date: "626年", title: "贞观之治", desc: "太宗李世民登基，开创贞观盛世" },
            { date: "641年", title: "文成公主入藏", desc: "文成公主嫁松赞干布，汉藏和亲" },
            { date: "690年", title: "武则天称帝", desc: "中国历史上唯一正统女皇，国号周" },
            { date: "712年", title: "开元盛世", desc: "玄宗开元年间，经济文化达顶峰" },
            { date: "755年", title: "安史之乱", desc: "安禄山史思明叛乱，唐朝由盛转衰" },
            { date: "762年", title: "杜甫逝世", desc: "诗圣杜甫逝世，留下1400余首诗篇" },
            { date: "868年", title: "《金刚经》雕版", desc: "现存最早有纪年的雕版印刷品" },
            { date: "907年", title: "朱温篡唐", desc: "朱温废唐哀帝，建立后梁，唐朝亡" },
        ],
    },
    {
        id: "song",
        name: "宋朝",
        period: "960年 — 1279年",
        duration: "共320年",
        color: "#7c3aed",
        emoji: "📜",
        summary: "经济文化科技空前发达，四大发明成熟",
        rulers: "太祖赵匡胤 → 太宗 → 真宗 → 神宗 → 末帝(亡)",
        events: [
            { date: "960年", title: "陈桥兵变", desc: "赵匡胤黄袍加身，建立宋朝，年号建隆" },
            { date: "1005年", title: "澶渊之盟", desc: "宋辽议和，岁币换和平" },
            { date: "1069年", title: "王安石变法", desc: "王安石推行熙宁变法，影响深远" },
            { date: "1088年", title: "活字印刷", desc: "毕昇发明活字印刷术，领先世界数百年" },
            { date: "1127年", title: "靖康之变", desc: "金军攻陷汴京，掳徽钦二帝，北宋亡" },
            { date: "1127年", title: "南宋建立", desc: "赵构于应天称帝，后定都临安" },
            { date: "1279年", title: "崖山海战", desc: "陆秀夫负帝昺投海，南宋亡" },
        ],
    },
    {
        id: "yuan",
        name: "元朝",
        period: "1271年 — 1368年",
        duration: "共98年",
        color: "#2563eb",
        emoji: "🐎",
        summary: "疆域空前，行省制度，戏曲繁荣",
        rulers: "忽必烈 → 成宗 → 仁宗 → 顺帝(亡)",
        events: [
            { date: "1206年", title: "成吉思汗建蒙古国", desc: "铁木真统一蒙古各部，被尊为成吉思汗" },
            { date: "1271年", title: "元朝建立", desc: "忽必烈改国号为元，取《易经》大哉乾元" },
            { date: "1276年", title: "元灭南宋", desc: "元军攻破临安，南宋投降" },
            { date: "1295年", title: "马可波罗回国", desc: "马可波罗在华17年后返回威尼斯" },
            { date: "1313年", title: "恢复科举", desc: "元仁宗恢复科举考试，以程朱理学为标准" },
            { date: "1351年", title: "红巾军起义", desc: "韩山童刘福通起义，元朝气数尽" },
            { date: "1368年", title: "朱元璋北伐", desc: "徐达率军攻入大都，元朝灭亡" },
        ],
    },
    {
        id: "ming",
        name: "明朝",
        period: "1368年 — 1644年",
        duration: "共277年",
        color: "#16a34a",
        emoji: "⛵",
        summary: "郑和下西洋，小说戏曲繁荣",
        rulers: "太祖朱元璋 → 成祖 → 仁宗 → 神宗 → 思宗(亡)",
        events: [
            { date: "1368年", title: "朱元璋建明", desc: "朱元璋建立明朝，定都应天府" },
            { date: "1405年", title: "郑和首下西洋", desc: "郑和率27000人首次下西洋，前后七次" },
            { date: "1421年", title: "迁都北京", desc: "明成祖迁都北京，修建紫禁城" },
            { date: "1573年", title: "万历新政", desc: "张居正推行一条鞭法，整顿吏治" },
            { date: "1592年", title: "援朝抗日", desc: "万历年间援朝抗倭，大败丰臣秀吉" },
            { date: "1616年", title: "后金建立", desc: "努尔哈赤建立后金，年号天命" },
            { date: "1627年", title: "明末大旱", desc: "陕西大旱，李自成张献忠起义" },
            { date: "1644年", title: "明亡", desc: "李自成攻入北京，崇祯帝自缢煤山" },
        ],
    },
    {
        id: "qing",
        name: "清朝",
        period: "1644年 — 1912年",
        duration: "共268年",
        color: "#4f46e5",
        emoji: "🏵️",
        summary: "最后封建王朝，康乾盛世，近代屈辱",
        rulers: "太祖 → 太宗 → 世祖 → 圣祖 → 高宗 → 德宗(亡)",
        events: [
            { date: "1644年", title: "清军入关", desc: "多尔衮率军入关，定鼎北京" },
            { date: "1662年", title: "郑成功收复台湾", desc: "驱逐荷兰殖民者，收复台湾" },
            { date: "1684年", title: "康熙收复台湾", desc: "施琅率军统一台湾" },
            { date: "1735年", title: "乾隆登基", desc: "弘历即位，开创康乾盛世顶峰" },
            { date: "1840年", title: "鸦片战争", desc: "英国发动鸦片战争，中国开始近代屈辱史" },
            { date: "1851年", title: "太平天国", desc: "洪秀全建太平天国，与清廷对峙14年" },
            { date: "1894年", title: "甲午战争", desc: "中日甲午海战，北洋水师覆没" },
            { date: "1898年", title: "戊戌变法", desc: "光绪帝颁布新政，百日维新失败" },
            { date: "1911年", title: "辛亥革命", desc: "武昌起义，结束两千余年帝制" },
            { date: "1912年", title: "中华民国成立", desc: "孙中山就任临时大总统" },
        ],
    },
    {
        id: "modern",
        name: "近现代",
        period: "1912年 — 至今",
        duration: "百余年",
        color: "#0ea5e9",
        emoji: "🚀",
        summary: "走向现代化的复兴之路",
        rulers: "孙中山 → 袁世凯 → 北洋政府 → 国民政府 → 新中国",
        events: [
            { date: "1919年", title: "五四运动", desc: "爱国学生运动，开启新民主主义革命" },
            { date: "1921年", title: "建党百年", desc: "中国共产党在上海成立，嘉兴南湖红船" },
            { date: "1937年", title: "抗日战争", desc: "卢沟桥事变，全面抗战爆发" },
            { date: "1945年", title: "抗战胜利", desc: "日本无条件投降，台湾光复" },
            { date: "1949年", title: "新中国成立", desc: "10月1日，中华人民共和国成立" },
            { date: "1978年", title: "改革开放", desc: "十一届三中全会，开启改革开放新时代" },
            { date: "2001年", title: "加入世贸", desc: "WTO多哈会议批准中国入世" },
            { date: "2020年", title: "全面小康", desc: "完成脱贫攻坚，实现第一个百年奋斗目标" },
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
                        <div class="htl-rulers">
                            <span class="htl-rulers-label">统治者</span>
                            <span class="htl-rulers-val">${d.rulers}</span>
                        </div>
                        <div class="htl-summary">${d.summary}</div>
                        <div class="htl-events">
                            ${d.events.map(e => `
                                <div class="htl-event">
                                    <div class="htl-event-date">${e.date}</div>
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
            margin-bottom: 6px;
        }

        .htl-left .htl-duration {
            text-align: right;
        }

        .htl-rulers {
            display: flex;
            align-items: flex-start;
            gap: 8px;
            margin-bottom: 8px;
            flex-wrap: wrap;
        }

        .htl-left .htl-rulers {
            flex-direction: row-reverse;
        }

        .htl-rulers-label {
            font-size: 12px;
            color: #8b5cf6;
            background: #ede9fe;
            padding: 2px 8px;
            border-radius: 4px;
            white-space: nowrap;
            flex-shrink: 0;
        }

        .htl-rulers-val {
            font-size: 13px;
            color: #6366f1;
            font-weight: 500;
            line-height: 1.6;
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

        .htl-event-date {
            font-size: 12px;
            color: #b45309;
            font-weight: 700;
            background: #fef3c7;
            display: inline-block;
            padding: 2px 8px;
            border-radius: 4px;
            margin-bottom: 4px;
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

            .htl-left .htl-rulers {
                flex-direction: row;
                justify-content: flex-start;
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

            .htl-rulers-val {
                font-size: 12px;
            }
        }
    `;
    document.head.appendChild(style);
}

export function initHistory() {
    document.getElementById("historyPage").scrollTop = 0;
}
