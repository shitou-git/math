// 中华历史时间轴 ES Module
// 数据来源：https://zhonghua.5000yan.com/

// ===================== 历史数据 =====================
const HISTORY_DYNASTIES = [
    {
        id: "yuangu",
        name: "远古时代",
        period: "约公元前4300年 — 前2070年",
        duration: "两千余年",
        color: "#78716c",
        emoji: "🪨",
        summary: "华夏文明的源头，三皇五帝传说",
        rulers: "盘古 → 女娲 → 伏羲 → 神农 → 黄帝 → 尧 → 舜",
        events: [
            { date: "前4300—前2500年", title: "大汶口文化", desc: "大汶口文化中晚期，处于父系氏族公社时期" },
            { date: "约前3000年", title: "黄帝战蚩尤", desc: "黄帝于涿鹿之战击败蚩尤，被尊为华夏始祖" },
            { date: "约前2500年", title: "尧舜禅让", desc: "尧让位于舜，开创禅让制，传贤不传子" },
            { date: "帝尧时期", title: "制定历法", desc: "尧命羲和观测天象，制定历法，以366日为一年" },
        ],
    },
    {
        id: "xia",
        name: "夏朝",
        period: "约前2070年 — 前1600年",
        duration: "共471年",
        color: "#d97706",
        emoji: "👑",
        summary: "中国历史上第一个王朝，开启家天下时代",
        rulers: "禹 → 启 → 太康 → 中康 → 相 → 少康 → 杼 → 槐 → 芒 → 泄 → 不降 → 扃 → 廑 → 孔甲 → 皋 → 发 → 桀(亡)",
        events: [
            { date: "约前2070年", title: "夏朝建立", desc: "禹将部落联盟首领之位传子启，夏朝建立" },
            { date: "约前2061年", title: "世袭制开始", desc: "启继承父业，家天下取代公天下" },
            { date: "约前2000年", title: "凿井技术", desc: "中国约在此时已有凿井取水的技术" },
            { date: "约前1961年", title: "少康中兴", desc: "少康平定寒浞之乱，恢复夏朝统治" },
            { date: "约前1652年", title: "孔甲乱政", desc: "孔甲好鬼神之事，不修政事，诸侯多叛" },
            { date: "约前1600年", title: "夏桀亡国", desc: "汤伐夏桀，战于鸣条，夏朝灭亡" },
        ],
    },
    {
        id: "shang",
        name: "商朝",
        period: "约前1600年 — 前1046年",
        duration: "共554年",
        color: "#b45309",
        emoji: "🏺",
        summary: "甲骨文、青铜器鼎盛，华夏文字形成",
        rulers: "成汤 → 太甲 → 沃丁 → 太庚 → 小甲 → 雍己 → 太戊 → 中丁 → 外壬 → 河亶甲 → 祖乙 → 祖辛 → 沃甲 → 祖丁 → 南庚 → 阳甲 → 盘庚 → 小辛 → 小乙 → 武丁 → 祖庚 → 祖甲 → 廪辛 → 康丁 → 武乙 → 文丁 → 帝乙 → 帝辛(纣,亡)",
        events: [
            { date: "约前1600年", title: "商汤灭夏", desc: "成汤于鸣条之战击败夏桀，建立商朝" },
            { date: "约前1580年", title: "伊尹放太甲", desc: "伊尹废太甲，三年后迎回复位" },
            { date: "约前1300年", title: "盘庚迁殷", desc: "盘庚迁都至殷，国势复兴" },
            { date: "约前1250年", title: "武丁中兴", desc: "武丁任用傅说为相，开创盛世" },
            { date: "约前1200年", title: "甲骨文成熟", desc: "殷墟出土甲骨文，汉字体系完善" },
            { date: "约前1200年", title: "青铜全盛", desc: "商朝进入青铜器全盛时代" },
            { date: "前1046年", title: "牧野之战", desc: "周武王率军伐商，牧野之战大败商军，商朝灭亡" },
        ],
    },
    {
        id: "xizhou",
        name: "西周",
        period: "前1046年 — 前771年",
        duration: "共275年",
        color: "#0891b2",
        emoji: "🎭",
        summary: "分封制、礼乐制奠基",
        rulers: "武王 → 成王 → 康王 → 昭王 → 穆王 → 共王 → 懿王 → 孝王 → 夷王 → 厉王 → 宣王 → 幽王(亡)",
        events: [
            { date: "前1046年", title: "武王伐纣", desc: "牧野之战，周武王灭商，建立周朝" },
            { date: "前1042年", title: "周公摄政", desc: "周公旦制礼作乐，辅佐成王，奠定周制" },
            { date: "前1040年", title: "分封制", desc: "周天子将土地分封给诸侯，建立封建体系" },
            { date: "前10世纪", title: "周穆王西巡", desc: "周穆王西巡，会见西王母，见《穆天子传》" },
            { date: "前9世纪", title: "厉王专利", desc: "周厉王实行专利，引起国人不满" },
            { date: "前841年", title: "国人暴动", desc: "国人暴动，厉王出奔，召公、周公二相行政，号曰共和，中国历史始有准确年代" },
            { date: "前828年", title: "宣王即位", desc: "厉王死于彘，召公、周公立太子静为王，是为周宣王" },
            { date: "前771年", title: "西周灭亡", desc: "申侯与缯、西夷犬戎攻周幽王，杀之于骊山，西周亡" },
        ],
    },
    {
        id: "dongzhou",
        name: "东周列国",
        period: "前770年 — 前256年",
        duration: "共515年",
        color: "#0e7490",
        emoji: "📜",
        summary: "春秋争霸，战国七雄，百家争鸣",
        rulers: "平王 → 桓王 → 庄王 → 釐王 → 惠王 → 襄王 → 顷王 → 匡王 → 定王 → 简王 → 灵王 → 景王 → 悼王 → 敬王 → 元王 → 贞定王 → 哀王 → 思王 → 考王 → 威烈王 → 安王 → 烈王 → 显王 → 慎靓王 → 赧王(亡)",
        events: [
            { date: "前770年", title: "平王东迁", desc: "周平王自镐京东迁洛邑，东周开始" },
            { date: "前722年", title: "《春秋》记事始", desc: "史书《春秋》记事从本年开始" },
            { date: "前685年", title: "齐桓公称霸", desc: "齐桓公即位，以管仲为相，成为春秋首霸" },
            { date: "前632年", title: "城濮之战", desc: "晋文公盟诸侯于践土，成为霸主" },
            { date: "前594年", title: "初税亩", desc: "鲁国实行初税亩，标志井田制开始瓦解" },
            { date: "前551年", title: "孔子诞生", desc: "儒家学派创始人孔子诞生" },
            { date: "前536年", title: "子产铸刑书", desc: "郑国子产铸刑书，公布成文法" },
            { date: "前479年", title: "孔子去世", desc: "孔子去世，儒家学派创始人" },
            { date: "前473年", title: "越灭吴", desc: "越王勾践灭吴，成为诸侯霸主" },
            { date: "前453年", title: "三家分晋", desc: "赵、韩、魏三家共灭智氏，三分其领地" },
            { date: "前403年", title: "列为诸侯", desc: "周威烈王命赵、韩、魏列为诸侯" },
            { date: "前356年", title: "商鞅变法", desc: "秦孝公任用商鞅，实行变法" },
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
            { date: "前221年", title: "秦朝建立", desc: "秦王嬴政灭六国，建立中国历史上第一个统一王朝" },
            { date: "前220年", title: "书同文车同轨", desc: "统一文字为小篆，统一度量衡、货币" },
            { date: "前214年", title: "修万里长城", desc: "蒙恬连接旧长城，修建万里长城御匈奴" },
            { date: "前213年", title: "焚书坑儒", desc: "始皇采纳李斯建议，焚毁诸子百家书籍" },
            { date: "前210年", title: "始皇驾崩", desc: "秦始皇东巡途中病逝于沙丘" },
            { date: "前209年", title: "陈胜吴广起义", desc: "大泽乡起义，中国历史上第一次大规模农民起义" },
            { date: "前207年", title: "秦朝灭亡", desc: "子婴在位46天投降刘邦，秦朝亡" },
        ],
    },
    {
        id: "xihan",
        name: "西汉",
        period: "前202年 — 8年",
        duration: "共210年",
        color: "#dc2626",
        emoji: "🐉",
        summary: "丝绸之路开通，汉文化定型",
        rulers: "高祖刘邦 → 惠帝 → 前少帝 → 后少帝 → 文帝 → 景帝 → 武帝 → 昭帝 → 宣帝 → 元帝 → 成帝 → 哀帝 → 平帝 → 孺子婴(亡)",
        events: [
            { date: "前202年", title: "西汉建立", desc: "刘邦称帝，建立汉朝，定都长安" },
            { date: "前180年", title: "文景之治", desc: "文帝、景帝休养生息，开创古代盛世" },
            { date: "前141年", title: "汉武即位", desc: "汉武帝刘彻继位，开疆拓土" },
            { date: "前138年", title: "张骞通西域", desc: "张骞凿空西域，开辟丝绸之路" },
            { date: "前127年", title: "推恩令", desc: "主父偃建议推恩令，削弱诸侯王势力" },
            { date: "前119年", title: "北击匈奴", desc: "卫青、霍去病分道出击匈奴" },
            { date: "前51年", title: "石渠阁会议", desc: "汉宣帝召集石渠阁会议，讲论五经异同" },
            { date: "8年", title: "王莽代汉", desc: "王莽即真天子位，定国号曰新，西汉灭亡" },
        ],
    },
    {
        id: "donghan",
        name: "东汉",
        period: "25年 — 220年",
        duration: "共195年",
        color: "#ef4444",
        emoji: "🐎",
        summary: "光武中兴，佛教传入",
        rulers: "光武帝 → 明帝 → 章帝 → 和帝 → 殇帝 → 安帝 → 少帝 → 顺帝 → 冲帝 → 质帝 → 桓帝 → 灵帝 → 少帝 → 献帝(亡)",
        events: [
            { date: "25年", title: "东汉建立", desc: "刘秀称帝，建元建武，是为东汉光武帝" },
            { date: "92年", title: "宦官用权之始", desc: "汉和帝与宦官郑众定议，诛大将军窦宪" },
            { date: "105年", title: "蔡伦造纸", desc: "蔡伦改进造纸术，推动世界文明传播" },
            { date: "166年", title: "党锢之祸", desc: "第一次党锢之祸，李膺等200余人被逮捕下狱" },
            { date: "184年", title: "黄巾起义", desc: "张角率众起义，因起义军皆戴黄巾，故称黄巾起义" },
        ],
    },
    {
        id: "sanguo",
        name: "三国",
        period: "220年 — 280年",
        duration: "共60年",
        color: "#0d9488",
        emoji: "🏯",
        summary: "魏蜀吴三分天下",
        rulers: "魏：曹丕 → 曹叡 → 曹芳 → 曹髦 → 曹奂(亡) | 蜀：刘备 → 刘禅(亡) | 吴：孙权 → 孙亮 → 孙休 → 孙皓(亡)",
        events: [
            { date: "208年", title: "赤壁之战", desc: "曹操被孙刘联军击败，奠定三国鼎立雏型" },
            { date: "220年", title: "曹魏建立", desc: "曹丕废汉献帝，建立魏国" },
            { date: "221年", title: "蜀汉建立", desc: "刘备于成都称帝，建立蜀汉" },
            { date: "229年", title: "东吴建立", desc: "孙权于建业称帝，建立吴国" },
            { date: "263年", title: "魏灭蜀", desc: "司马昭派邓艾、钟会灭蜀" },
            { date: "280年", title: "西晋统一", desc: "晋武帝司马炎灭吴，结束三国分裂" },
        ],
    },
    {
        id: "xijin",
        name: "西晋",
        period: "266年 — 316年",
        duration: "共51年",
        color: "#10b981",
        emoji: "⚔️",
        summary: "短暂统一，八王之乱",
        rulers: "武帝司马炎 → 惠帝 → 怀帝 → 愍帝(亡)",
        events: [
            { date: "265年", title: "西晋建立", desc: "司马炎废魏主，称帝，是为晋武帝，定都洛阳" },
            { date: "280年", title: "统一全国", desc: "晋灭吴，结束三国分裂局面" },
            { date: "291年", title: "八王之乱", desc: "八王之乱爆发，西晋由盛转衰" },
            { date: "316年", title: "西晋灭亡", desc: "匈奴攻破长安，西晋亡" },
        ],
    },
    {
        id: "dongjin",
        name: "东晋十六国",
        period: "317年 — 420年",
        duration: "共103年",
        color: "#22c55e",
        emoji: "🏛️",
        summary: "衣冠南渡，南北对峙",
        rulers: "元帝 → 明帝 → 成帝 → 康帝 → 穆帝 → 哀帝 → 废帝 → 简文帝 → 孝武帝 → 安帝 → 恭帝(亡)",
        events: [
            { date: "317年", title: "东晋建立", desc: "司马睿南迁建康，建立东晋" },
            { date: "357年", title: "前秦苻坚即位", desc: "前秦苻坚即位，称大秦天王，汉人王猛辅政" },
            { date: "383年", title: "淝水之战", desc: "晋秦淝水之战，前秦大败，内部分崩" },
            { date: "399—412年", title: "法显求佛", desc: "高僧法显前往天竺求佛，著有《佛国记》" },
        ],
    },
    {
        id: "nanbeichao",
        name: "南北朝",
        period: "420年 — 589年",
        duration: "共169年",
        color: "#0d9488",
        emoji: "🎭",
        summary: "民族大融合，佛教兴盛",
        rulers: "南朝：宋 → 齐 → 梁 → 陈 | 北朝：北魏 → 东魏 → 西魏 → 北齐 → 北周",
        events: [
            { date: "420年", title: "刘宋建立", desc: "刘裕废晋恭帝自立，国号宋，南朝开始" },
            { date: "494年", title: "孝文帝汉化", desc: "北魏孝文帝迁都洛阳，推行汉化改革" },
            { date: "500年", title: "祖冲之去世", desc: "祖冲之去世，首次把圆周率准确推算到小数点后七位" },
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
            { date: "581年", title: "隋朝建立", desc: "杨坚称帝，国号隋，是为隋文帝，建都长安" },
            { date: "589年", title: "统一南北", desc: "隋军南下灭陈，结束三百年分裂" },
            { date: "595年", title: "开皇之治", desc: "文帝励精图治，开创开皇盛世" },
            { date: "605年", title: "开凿大运河", desc: "炀帝征发百万民工开凿南北大运河" },
            { date: "607年", title: "营建东都", desc: "炀帝迁都洛阳，大修宫殿园林" },
            { date: "618年", title: "隋亡唐兴", desc: "李渊起兵太原，建立唐朝，隋朝亡" },
        ],
    },
    {
        id: "tang",
        name: "唐朝",
        period: "618年 — 907年",
        duration: "共289年",
        color: "#ea580c",
        emoji: "🏮",
        summary: "盛世巅峰，诗歌鼎盛，万国来朝",
        rulers: "高祖 → 太宗 → 高宗 → 中宗 → 睿宗 → 武周 → 中宗 → 睿宗 → 玄宗 → 肃宗 → 代宗 → 德宗 → 顺宗 → 宪宗 → 穆宗 → 敬宗 → 文宗 → 武宗 → 宣宗 → 懿宗 → 僖宗 → 昭宗 → 哀帝(亡)",
        events: [
            { date: "618年", title: "唐朝建立", desc: "李渊称帝，国号唐，是为唐高祖，隋朝亡" },
            { date: "626年", title: "贞观之治", desc: "太宗李世民登基，开创贞观盛世" },
            { date: "641年", title: "文成公主入藏", desc: "文成公主嫁松赞干布，汉藏和亲" },
            { date: "645年", title: "玄奘取经归来", desc: "玄奘取经而还，抵达长安，《大唐西域记》成书" },
            { date: "690年", title: "武则天称帝", desc: "武则天废睿宗，称帝，改国号为周" },
            { date: "705年", title: "神龙政变", desc: "张柬之等人发动政变，逼武则天退位，复国号唐" },
            { date: "712年", title: "开元盛世", desc: "玄宗开元年间，经济文化达顶峰" },
            { date: "755年", title: "安史之乱", desc: "安禄山史思明叛乱，唐朝由盛转衰" },
            { date: "762年", title: "杜甫逝世", desc: "诗圣杜甫逝世，留下1400余首诗篇" },
            { date: "868年", title: "雕版《金刚经》", desc: "现存最早有纪年的雕版印刷品" },
            { date: "907年", title: "朱温篡唐", desc: "朱温废唐哀帝，建立后梁，唐朝亡" },
        ],
    },
    {
        id: "wudai",
        name: "五代十国",
        period: "907年 — 979年",
        duration: "共72年",
        color: "#a16207",
        emoji: "⚔️",
        summary: "大分裂时期，政权更迭频繁",
        rulers: "后梁 → 后唐 → 后晋 → 后汉 → 后周",
        events: [
            { date: "907年", title: "后梁建立", desc: "朱温逼唐哀帝禅让，建立后梁，唐朝亡" },
            { date: "916年", title: "契丹建辽", desc: "耶律阿保机称帝，是为辽太祖，建契丹国" },
            { date: "923年", title: "后唐建立", desc: "李存勖灭后梁，建立后唐" },
            { date: "936年", title: "后晋建立", desc: "石敬瑭借契丹之力灭后唐，建立后晋" },
            { date: "947年", title: "后汉建立", desc: "刘知远建立后汉" },
            { date: "951年", title: "后周建立", desc: "郭威建立后周" },
            { date: "960年", title: "陈桥兵变", desc: "赵匡胤黄袍加身，建立宋朝" },
        ],
    },
    {
        id: "song",
        name: "宋辽金",
        period: "960年 — 1279年",
        duration: "共319年",
        color: "#7c3aed",
        emoji: "📜",
        summary: "经济文化科技空前发达，四大发明成熟",
        rulers: "北宋：太祖 → 太宗 → 真宗 → 仁宗 → 英宗 → 神宗 → 哲宗 → 徽宗 → 钦宗(亡) | 南宋：高宗 → 孝宗 → 光宗 → 宁宗 → 理宗 → 度宗 → 恭帝 → 端宗 → 帝昺(亡)",
        events: [
            { date: "960年", title: "北宋建立", desc: "陈桥兵变，赵匡胤即位，是为宋太祖" },
            { date: "993年", title: "王小波李顺起义", desc: "王小波、李顺起义" },
            { date: "1005年", title: "澶渊之盟", desc: "宋辽议和，岁币换和平" },
            { date: "1038年", title: "西夏建立", desc: "党项首领元昊称帝，国号大夏，史称西夏" },
            { date: "1069年", title: "王安石变法", desc: "王安石推行熙宁变法" },
            { date: "1088年", title: "活字印刷", desc: "毕昇发明活字印刷术" },
            { date: "1127年", title: "靖康之变", desc: "金军俘宋徽、钦二帝北还，北宋灭亡" },
            { date: "1127年", title: "南宋建立", desc: "康王赵构于南京应天府即位，建立南宋" },
            { date: "1141年", title: "绍兴和议", desc: "宋金议和，史称绍兴和议" },
            { date: "1279年", title: "崖山之战", desc: "元军攻破崖山，宋帝溺死，宋亡" },
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
        rulers: "世祖忽必烈 → 成宗 → 武宗 → 仁宗 → 英宗 → 泰定帝 → 天顺帝 → 文宗 → 明宗 → 宁宗 → 顺帝(亡)",
        events: [
            { date: "1206年", title: "成吉思汗建蒙古国", desc: "铁木真统一蒙古各部，被尊为成吉思汗" },
            { date: "1271年", title: "元朝建立", desc: "忽必烈改国号为元，取《易经》大哉乾元" },
            { date: "1276年", title: "元灭南宋", desc: "元军攻破临安，南宋投降" },
            { date: "1286年", title: "《农桑辑要》颁行", desc: "中国现存最古的官修农书" },
            { date: "1295年", title: "马可波罗回国", desc: "马可波罗在华17年后返回威尼斯" },
            { date: "1313年", title: "恢复科举", desc: "元仁宗恢复科举考试，以程朱理学为标准" },
            { date: "1345年", title: "修三史", desc: "元朝修成《辽史》《金史》《宋史》" },
            { date: "1351年", title: "红巾军起义", desc: "韩山童、刘福通起义，元朝气数尽" },
            { date: "1368年", title: "元朝灭亡", desc: "徐达率军攻入大都，元朝灭亡" },
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
        rulers: "太祖朱元璋 → 建文帝 → 成祖 → 仁宗 → 宣宗 → 英宗 → 代宗 → 宪宗 → 孝宗 → 武宗 → 世宗 → 穆宗 → 神宗 → 光宗 → 熹宗 → 思宗(亡)",
        events: [
            { date: "1368年", title: "明朝建立", desc: "朱元璋在应天府即帝位，国号明，是为明太祖" },
            { date: "1399—1402年", title: "靖难之役", desc: "燕王朱棣发动靖难之役，即位称帝，是为明成祖" },
            { date: "1405年", title: "郑和下西洋", desc: "明成祖命郑和使南洋各地，郑和下西洋自此始" },
            { date: "1407年", title: "《永乐大典》成书", desc: "明成祖永乐五年，《永乐大典》成书" },
            { date: "1421年", title: "迁都北京", desc: "明成祖迁都北京，以南京为留都" },
            { date: "1449年", title: "土木之变", desc: "英宗被瓦剌军所俘，史称土木之变" },
            { date: "1457年", title: "夺门之变", desc: "宦官曹吉祥迎太上皇英宗复位" },
            { date: "1563年", title: "大破倭寇", desc: "戚继光、俞大猷大破倭寇，收复兴化" },
            { date: "1571年", title: "俺答封贡", desc: "明朝封俺答为顺义王，开互市" },
            { date: "1581年", title: "一条鞭法", desc: "张居正进行赋役制度改革，推行一条鞭法" },
            { date: "1588年", title: "努尔哈赤统一建州", desc: "努尔哈赤统一建州女真" },
            { date: "1594年", title: "东林党议", desc: "顾宪成修东林书院讲学，东林党议始" },
            { date: "1600年", title: "利玛窦到京", desc: "耶稣会教士利玛窦到达北京传教" },
            { date: "1615年", title: "八旗制度", desc: "努尔哈赤正式建立八旗制度" },
            { date: "1616年", title: "后金建立", desc: "努尔哈赤称汗，国号金，史称后金" },
            { date: "1619年", title: "萨尔浒之战", desc: "明军大败于后金" },
            { date: "1637年", title: "《天工开物》", desc: "宋应星所著《天工开物》刊行" },
            { date: "1644年", title: "明朝灭亡", desc: "李自成攻占北京，崇祯帝自缢，明亡" },
        ],
    },
    {
        id: "qing",
        name: "清朝",
        period: "1636年 — 1912年",
        duration: "共276年",
        color: "#4f46e5",
        emoji: "🏵️",
        summary: "最后封建王朝，康乾盛世，近代屈辱",
        rulers: "太祖努尔哈赤 → 太宗皇太极 → 世祖顺治 → 圣祖康熙 → 世宗雍正 → 高宗乾隆 → 仁宗嘉庆 → 宣宗道光 → 文宗咸丰 → 穆宗同治 → 德宗光绪 → 宣统(亡)",
        events: [
            { date: "1636年", title: "改国号为清", desc: "皇太极即帝位，改国号为清" },
            { date: "1644年", title: "清军入关", desc: "多尔衮率军入关，定鼎北京" },
            { date: "1661年", title: "郑成功收复台湾", desc: "郑成功率军驱逐荷兰殖民者，收复台湾" },
            { date: "1684年", title: "统一台湾", desc: "施琅率军统一台湾" },
            { date: "1729年", title: "设立军机处", desc: "因西北用兵，设军机房，后改为军机处" },
            { date: "1735年", title: "乾隆登基", desc: "弘历即位，开创康乾盛世顶峰" },
            { date: "1771年", title: "土尔扈特回归", desc: "土尔扈特部在渥巴锡率领下重返祖国" },
            { date: "1782年", title: "《四库全书》", desc: "第一部《四库全书》修成" },
            { date: "1839年", title: "虎门销烟", desc: "林则徐在虎门海滩销毁收缴的鸦片" },
            { date: "1840年", title: "鸦片战争", desc: "鸦片战争爆发，中国开始近代屈辱史" },
            { date: "1842年", title: "《南京条约》", desc: "清廷被迫与英国签订《南京条约》" },
            { date: "1851年", title: "太平天国", desc: "洪秀全建太平天国，与清廷对峙14年" },
            { date: "1856年", title: "第二次鸦片战争", desc: "英国借口亚罗号事件，挑起第二次鸦片战争" },
            { date: "1860年", title: "英法联军攻陷北京", desc: "英法联军攻陷北京，签订《北京条约》" },
            { date: "1861年", title: "辛酉政变", desc: "慈禧发动政变，两太后垂帘听政" },
            { date: "1864年", title: "太平天国失败", desc: "天京为清军攻陷，太平天国起义失败" },
            { date: "1894年", title: "甲午战争", desc: "中日甲午战争爆发，北洋水师覆没" },
            { date: "1898年", title: "戊戌变法", desc: "光绪帝颁布新政，百日维新失败" },
            { date: "1900年", title: "八国联军", desc: "八国联军进犯北京" },
            { date: "1901年", title: "《辛丑条约》", desc: "清廷与十一国签订《辛丑条约》" },
            { date: "1905年", title: "废除科举", desc: "清廷废除科举考试制度" },
            { date: "1911年", title: "辛亥革命", desc: "武昌起义，结束两千余年帝制" },
            { date: "1912年", title: "清朝灭亡", desc: "溥仪退位，清朝灭亡" },
        ],
    },
    {
        id: "modern",
        name: "近现代",
        period: "1912年 — 1949年",
        duration: "共38年",
        color: "#0ea5e9",
        emoji: "🚀",
        summary: "走向民族独立的复兴之路",
        rulers: "孙中山 → 袁世凯 → 北洋政府 → 国民政府 → 新中国",
        events: [
            { date: "1912年", title: "中华民国成立", desc: "南京临时政府成立，孙中山就任临时大总统" },
            { date: "1915年", title: "新文化运动", desc: "陈独秀创办《青年杂志》，新文化运动开始" },
            { date: "1919年", title: "五四运动", desc: "爱国学生运动，开启新民主主义革命" },
            { date: "1921年", title: "中国共产党成立", desc: "中国共产党在上海成立" },
            { date: "1924年", title: "黄埔军校建立", desc: "黄埔军校建立" },
            { date: "1925年", title: "孙中山逝世", desc: "3月12日，孙中山在北京逝世" },
            { date: "1927年", title: "南昌起义", desc: "八一南昌起义，人民军队诞生" },
            { date: "1931年", title: "九一八事变", desc: "日本在沈阳制造九一八事变" },
            { date: "1934年", title: "长征开始", desc: "中央红军开始二万五千里长征" },
            { date: "1936年", title: "西安事变", desc: "张学良、杨虎城发动西安事变" },
            { date: "1937年", title: "卢沟桥事变", desc: "全面抗日战争开始" },
            { date: "1937年", title: "南京大屠杀", desc: "12月，南京陷落，日军入城大肆杀戮" },
            { date: "1940年", title: "百团大战", desc: "八路军发动百团大战" },
            { date: "1945年", title: "抗战胜利", desc: "日本无条件投降，台湾光复" },
            { date: "1949年", title: "新中国成立", desc: "10月1日，中华人民共和国成立" },
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
                <div class="htl-rulers-axis" style="background:${d.color}">
                    <span class="htl-rulers-text">${d.rulers}</span>
                </div>
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
                <div class="htl-hero-sub">从远古时代到现代 · 五千年文明长河</div>
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
            margin-top: 78px;
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

        .htl-rulers-axis {
            position: absolute;
            top: 56px;
            width: 260px;
            padding: 6px 12px;
            border-radius: 12px;
            font-size: 11px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.18);
            z-index: 3;
            line-height: 1.5;
            text-align: center;
            word-break: break-all;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        .htl-left .htl-rulers-axis {
            right: -130px;
        }

        .htl-right .htl-rulers-axis {
            left: -130px;
        }

        .htl-rulers-text {
            color: #fff;
            display: block;
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

            .htl-rulers-axis {
                position: relative !important;
                top: auto !important;
                left: auto !important;
                right: auto !important;
                width: calc(100% - 30px) !important;
                margin: 0 0 10px 30px;
                text-align: left;
                -webkit-line-clamp: 2;
            }

            .htl-card {
                margin-top: 0;
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

            .htl-rulers-text {
                font-size: 10px;
            }
        }
    `;
    document.head.appendChild(style);
}

export function initHistory() {
    document.getElementById("historyPage").scrollTop = 0;
}
