const formulasData = [
    {
        id: 'calc',
        name: '计算类',
        icon: '🔢',
        items: [
            {
                title: '凑整速算',
                formula: '利用加法交换律、结合律，将能凑成整十、整百、整千的数先相加',
                keyFormulas: [
                    'a + b = b + a（加法交换律）',
                    '(a + b) + c = a + (b + c)（加法结合律）',
                    'a - b - c = a - (b + c)（连减性质）'
                ],
                steps: [
                    '观察数字特点，寻找互补数（个位相加为10的数）',
                    '利用运算律调整运算顺序',
                    '先凑整，再计算剩余部分',
                    '检验结果是否正确'
                ],
                example: {
                    question: '计算：36 + 48 + 64 + 52',
                    solution: '36 + 48 + 64 + 52\n= (36 + 64) + (48 + 52)\n= 100 + 100\n= 200'
                }
            },
            {
                title: '连减连除巧算',
                formula: '一个数连续减去（除以）几个数，等于减去（除以）这几个数的和（积）',
                keyFormulas: [
                    'a - b - c = a - (b + c)',
                    'a - b + c = a - (b - c)',
                    'a ÷ b ÷ c = a ÷ (b × c)',
                    'a ÷ b × c = a ÷ (b ÷ c)'
                ],
                steps: [
                    '观察连减或连除的特点',
                    '判断后面几个数的和或积是否为整数',
                    '添括号改变运算顺序',
                    '先算括号内，再算括号外'
                ],
                example: {
                    question: '计算：300 - 73 - 27',
                    solution: '300 - 73 - 27\n= 300 - (73 + 27)\n= 300 - 100\n= 200'
                }
            },
            {
                title: '乘法分配律',
                formula: '两个数的和（差）与一个数相乘，可以先分别相乘再相加（减）',
                keyFormulas: [
                    '(a + b) × c = a × c + b × c',
                    '(a - b) × c = a × c - b × c',
                    'a × c + b × c = (a + b) × c（提取公因数）'
                ],
                steps: [
                    '观察是否有公因数或能凑整的数',
                    '确定使用正向还是逆向分配律',
                    '提取公因数或展开计算',
                    '简化运算得出结果'
                ],
                example: {
                    question: '计算：99 × 37',
                    solution: '99 × 37\n= (100 - 1) × 37\n= 100 × 37 - 1 × 37\n= 3700 - 37\n= 3663'
                }
            }
        ]
    },
    {
        id: 'application',
        name: '应用类',
        icon: '📝',
        items: [
            {
                title: '和差问题',
                formula: '已知两数之和与两数之差，求这两个数',
                keyFormulas: [
                    '大数 = (和 + 差) ÷ 2',
                    '小数 = (和 - 差) ÷ 2',
                    '和 = 大数 + 小数',
                    '差 = 大数 - 小数'
                ],
                steps: [
                    '找出题目中的"和"与"差"',
                    '确定哪个是大数，哪个是小数',
                    '代入公式计算',
                    '检验结果是否符合题意'
                ],
                example: {
                    question: '两筐水果共重150千克，第一筐比第二筐多8千克，两筐水果各多少千克？',
                    solution: '第一筐（大数）= (150 + 8) ÷ 2 = 158 ÷ 2 = 79（千克）\n第二筐（小数）= (150 - 8) ÷ 2 = 142 ÷ 2 = 71（千克）\n\n答：第一筐重79千克，第二筐重71千克。'
                }
            },
            {
                title: '和倍问题',
                formula: '已知两数之和及倍数关系，求这两个数',
                keyFormulas: [
                    '小数 = 和 ÷ (倍数 + 1)',
                    '大数 = 小数 × 倍数',
                    '或：大数 = 和 - 小数'
                ],
                steps: [
                    '确定1倍数（小数）',
                    '找出和对应的倍数和',
                    '用和除以倍数和求出1倍数',
                    '再求出几倍数（大数）'
                ],
                example: {
                    question: '果园里有苹果树和梨树共360棵，苹果树的棵数是梨树的3倍，苹果树和梨树各有多少棵？',
                    solution: '梨树（1倍数）= 360 ÷ (3 + 1) = 360 ÷ 4 = 90（棵）\n苹果树 = 90 × 3 = 270（棵）\n\n答：梨树有90棵，苹果树有270棵。'
                }
            },
            {
                title: '差倍问题',
                formula: '已知两数之差及倍数关系，求这两个数',
                keyFormulas: [
                    '小数 = 差 ÷ (倍数 - 1)',
                    '大数 = 小数 × 倍数',
                    '或：大数 = 小数 + 差'
                ],
                steps: [
                    '确定1倍数（小数）',
                    '找出差对应的倍数差',
                    '用差除以倍数差求出1倍数',
                    '再求出几倍数（大数）'
                ],
                example: {
                    question: '小明的邮票比小红多24张，小明的邮票张数是小红的3倍，小明和小红各有多少张邮票？',
                    solution: '小红（1倍数）= 24 ÷ (3 - 1) = 24 ÷ 2 = 12（张）\n小明 = 12 × 3 = 36（张）\n\n答：小红有12张邮票，小明有36张邮票。'
                }
            },
            {
                title: '鸡兔同笼',
                formula: '已知总头数和总脚数，求鸡、兔各多少只',
                keyFormulas: [
                    '假设全是鸡：兔数 = (总脚数 - 2 × 总头数) ÷ 2',
                    '假设全是兔：鸡数 = (4 × 总头数 - 总脚数) ÷ 2',
                    '鸡数 + 兔数 = 总头数',
                    '2 × 鸡数 + 4 × 兔数 = 总脚数'
                ],
                steps: [
                    '假设全部是鸡（或兔）',
                    '计算假设情况下的总脚数',
                    '找出实际与假设的脚数差',
                    '用脚数差除以每只的脚数差，得到另一种动物的数量'
                ],
                example: {
                    question: '鸡兔同笼，共有30个头，88只脚。求笼中鸡兔各有多少只？',
                    solution: '假设全是鸡，总脚数 = 30 × 2 = 60（只）\n脚数差 = 88 - 60 = 28（只）\n兔数 = 28 ÷ (4 - 2) = 28 ÷ 2 = 14（只）\n鸡数 = 30 - 14 = 16（只）\n\n答：鸡有16只，兔有14只。'
                }
            },
            {
                title: '年龄问题',
                formula: '年龄差不变，年龄倍数关系随时间变化',
                keyFormulas: [
                    '年龄差 = 大年龄 - 小年龄（不变）',
                    '几年后年龄 = 大小年龄差 ÷ 倍数差 - 小年龄',
                    '几年前年龄 = 小年龄 - 大小年龄差 ÷ 倍数差'
                ],
                steps: [
                    '抓住"年龄差不变"这个关键',
                    '找出年龄差对应的倍数差',
                    '利用差倍问题公式计算',
                    '注意验证时间是否合理'
                ],
                example: {
                    question: '爸爸今年35岁，女儿今年5岁，几年后爸爸的年龄是女儿的4倍？',
                    solution: '年龄差 = 35 - 5 = 30（岁）\n当爸爸年龄是女儿4倍时，女儿年龄 = 30 ÷ (4 - 1) = 10（岁）\n几年后 = 10 - 5 = 5（年）\n\n答：5年后爸爸的年龄是女儿的4倍。'
                }
            },
            {
                title: '植树问题',
                formula: '在一定长度的路线上植树，根据两端是否植树有不同公式',
                keyFormulas: [
                    '两端都植：棵数 = 间隔数 + 1 = 全长 ÷ 间距 + 1',
                    '一端植一端不植：棵数 = 间隔数 = 全长 ÷ 间距',
                    '两端都不植：棵数 = 间隔数 - 1 = 全长 ÷ 间距 - 1',
                    '封闭图形：棵数 = 间隔数 = 周长 ÷ 间距'
                ],
                steps: [
                    '判断植树类型（两端是否植树）',
                    '确定全长、间距、棵数中的已知量',
                    '选择对应的公式计算',
                    '注意单位是否统一'
                ],
                example: {
                    question: '在一条长100米的小路一边植树，每隔5米栽一棵（两端都要栽），一共需要多少棵树苗？',
                    solution: '间隔数 = 100 ÷ 5 = 20（个）\n棵数 = 20 + 1 = 21（棵）\n\n答：一共需要21棵树苗。'
                }
            }
        ]
    },
    {
        id: 'speed',
        name: '行程类',
        icon: '🚀',
        items: [
            {
                title: '相遇问题',
                formula: '两人（车）相向而行，求相遇时间或路程',
                keyFormulas: [
                    '相遇时间 = 总路程 ÷ (甲速度 + 乙速度)',
                    '总路程 = (甲速度 + 乙速度) × 相遇时间',
                    '速度和 = 甲速度 + 乙速度',
                    '甲走的路程 = 甲速度 × 相遇时间'
                ],
                steps: [
                    '确定是相向而行（面对面）',
                    '找出总路程和速度和',
                    '代入相遇时间公式计算',
                    '注意检验单位是否统一'
                ],
                example: {
                    question: '甲乙两车从相距480千米的两地相向而行，甲车每小时行60千米，乙车每小时行40千米，两车几小时后相遇？',
                    solution: '速度和 = 60 + 40 = 100（千米/小时）\n相遇时间 = 480 ÷ 100 = 4.8（小时）\n\n答：两车4.8小时后相遇。'
                }
            },
            {
                title: '追及问题',
                formula: '两人（车）同向而行，快的追慢的，求追及时间',
                keyFormulas: [
                    '追及时间 = 路程差 ÷ (快速度 - 慢速度)',
                    '路程差 = (快速度 - 慢速度) × 追及时间',
                    '速度差 = 快速度 - 慢速度',
                    '快的走的路程 = 慢的走的路程 + 路程差'
                ],
                steps: [
                    '确定是同向而行（方向相同）',
                    '找出路程差和速度差',
                    '代入追及时间公式计算',
                    '注意检验结果是否合理'
                ],
                example: {
                    question: '甲乙两人从A地去B地，甲每分钟走80米，乙每分钟走60米，乙先走了10分钟后甲才出发，甲几分钟能追上乙？',
                    solution: '路程差 = 60 × 10 = 600（米）\n速度差 = 80 - 60 = 20（米/分钟）\n追及时间 = 600 ÷ 20 = 30（分钟）\n\n答：甲30分钟能追上乙。'
                }
            }
        ]
    },
    {
        id: 'geometry',
        name: '几何类',
        icon: '📐',
        items: [
            {
                title: '周长公式',
                formula: '封闭图形一周的长度叫做周长',
                keyFormulas: [
                    '长方形周长 = (长 + 宽) × 2，C = 2(a + b)',
                    '正方形周长 = 边长 × 4，C = 4a',
                    '圆的周长 = 直径 × π = 2 × π × 半径，C = πd = 2πr',
                    '三角形周长 = 三边之和，C = a + b + c'
                ],
                steps: [
                    '识别图形类型',
                    '找出计算周长需要的边长',
                    '代入对应的周长公式',
                    '注意单位是否统一'
                ],
                example: {
                    question: '一个长方形的长是12厘米，宽是8厘米，求它的周长是多少厘米？',
                    solution: '周长 = (12 + 8) × 2 = 20 × 2 = 40（厘米）\n\n答：长方形的周长是40厘米。'
                }
            },
            {
                title: '面积公式',
                formula: '物体表面或平面图形的大小叫做面积',
                keyFormulas: [
                    '长方形面积 = 长 × 宽，S = ab',
                    '正方形面积 = 边长 × 边长，S = a²',
                    '三角形面积 = 底 × 高 ÷ 2，S = ah ÷ 2',
                    '平行四边形面积 = 底 × 高，S = ah',
                    '梯形面积 = (上底 + 下底) × 高 ÷ 2，S = (a + b)h ÷ 2',
                    '圆的面积 = π × 半径²，S = πr²'
                ],
                steps: [
                    '识别图形类型',
                    '找出计算面积需要的条件（底、高等）',
                    '代入对应的面积公式',
                    '注意面积单位是平方单位'
                ],
                example: {
                    question: '一个三角形的底是10厘米，高是6厘米，求它的面积是多少平方厘米？',
                    solution: '面积 = 10 × 6 ÷ 2 = 60 ÷ 2 = 30（平方厘米）\n\n答：三角形的面积是30平方厘米。'
                }
            }
        ]
    },
    {
        id: 'sequence',
        name: '规律数列类',
        icon: '📊',
        items: [
            {
                title: '等差数列',
                formula: '从第二项起，每一项与前一项的差都相等的数列',
                keyFormulas: [
                    '通项公式：第n项 = 首项 + (n - 1) × 公差，aₙ = a₁ + (n - 1)d',
                    '项数公式：n = (末项 - 首项) ÷ 公差 + 1',
                    '求和公式：和 = (首项 + 末项) × 项数 ÷ 2，S = (a₁ + aₙ) × n ÷ 2',
                    '公差公式：d = (末项 - 首项) ÷ (n - 1)'
                ],
                steps: [
                    '确定首项、末项、公差、项数中的已知量',
                    '判断要求的是什么（第n项、和还是项数）',
                    '选择对应的公式计算',
                    '验证结果是否正确'
                ],
                example: {
                    question: '求等差数列1, 4, 7, 10, ... 的第10项是多少？前10项的和是多少？',
                    solution: '首项a₁ = 1，公差d = 3\n\n第10项：a₁₀ = 1 + (10 - 1) × 3 = 1 + 27 = 28\n\n前10项和：S₁₀ = (1 + 28) × 10 ÷ 2 = 29 × 5 = 145\n\n答：第10项是28，前10项的和是145。'
                }
            },
            {
                title: '等比数列',
                formula: '从第二项起，每一项与前一项的比都相等的数列',
                keyFormulas: [
                    '通项公式：第n项 = 首项 × 公比^(n-1)，aₙ = a₁ × q^(n-1)',
                    '求和公式（q≠1）：S = a₁ × (1 - qⁿ) ÷ (1 - q)',
                    '或：S = (a₁ - aₙ × q) ÷ (1 - q)',
                    '当q = 1时：S = n × a₁'
                ],
                steps: [
                    '确定首项、公比、项数等已知量',
                    '判断公比是否等于1',
                    '选择对应的公式计算',
                    '注意指数运算的正确性'
                ],
                example: {
                    question: '求等比数列2, 6, 18, 54, ... 的第5项是多少？前5项的和是多少？',
                    solution: '首项a₁ = 2，公比q = 3\n\n第5项：a₅ = 2 × 3^(5-1) = 2 × 3⁴ = 2 × 81 = 162\n\n前5项和：S₅ = 2 × (1 - 3⁵) ÷ (1 - 3) = 2 × (1 - 243) ÷ (-2) = 2 × (-242) ÷ (-2) = 242\n\n答：第5项是162，前5项的和是242。'
                }
            }
        ]
    }
];

function getFormulasHtml() {
    let html = `
        <div id="formulasPage" class="game-page">
            <button class="back-btn" onclick="goHome()">← 返回首页</button>
            <div class="header">
                <h1>📐 奥数公式大全</h1>
                <p>常用公式速查手册</p>
            </div>
            <div class="game-container">
                <div class="formulas-category-list">
    `;

    formulasData.forEach((category) => {
        html += `
                    <div class="formula-category" data-category="${category.id}">
                        <div class="category-header" onclick="toggleCategory('${category.id}')">
                            <span class="category-icon">${category.icon}</span>
                            <span class="category-name">${category.name}</span>
                            <span class="category-arrow">▼</span>
                        </div>
                        <div class="category-items" id="category-${category.id}">
        `;

        category.items.forEach((item, index) => {
            html += `
                            <div class="formula-item">
                                <div class="formula-title" onclick="toggleFormula('${category.id}-${index}')">
                                    <span class="formula-name">${item.title}</span>
                                    <span class="formula-arrow">▶</span>
                                </div>
                                <div class="formula-content" id="formula-${category.id}-${index}">
                                    <div class="formula-section">
                                        <h4>📌 核心公式</h4>
                                        <ul>
            `;
            
            item.keyFormulas.forEach((f) => {
                html += `<li>${f}</li>`;
            });

            html += `
                                        </ul>
                                    </div>
                                    <div class="formula-section">
                                        <h4>🎯 解题四步法</h4>
                                        <ol>
            `;

            item.steps.forEach((step, i) => {
                html += `<li><strong>第${i + 1}步：</strong>${step}</li>`;
            });

            html += `
                                        </ol>
                                    </div>
                                    <div class="formula-section">
                                        <h4>💡 典型例题</h4>
                                        <div class="example-question">
                                            <strong>题目：</strong>${item.example.question}
                                        </div>
                                        <div class="example-solution">
                                            <strong>解答：</strong>
                                            <pre>${item.example.solution}</pre>
                                        </div>
                                    </div>
                                </div>
                            </div>
            `;
        });

        html += `
                        </div>
                    </div>
        `;
    });

    html += `
                </div>
            </div>
            <div class="footer">
                <p>奥数公式大全 - 学习路上的好帮手</p>
            </div>
        </div>
    `;

    return html;
}

function toggleCategory(categoryId) {
    const content = document.getElementById('category-' + categoryId);
    const category = document.querySelector(`[data-category="${categoryId}"]`);
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        category.querySelector('.category-arrow').textContent = '▼';
    } else {
        content.style.display = 'none';
        category.querySelector('.category-arrow').textContent = '▶';
    }
}

function toggleFormula(formulaId) {
    const content = document.getElementById('formula-' + formulaId);
    const item = content.previousElementSibling;
    const arrow = item.querySelector('.formula-arrow');
    
    if (content.style.display === 'none' || content.style.display === '') {
        content.style.display = 'block';
        arrow.textContent = '▼';
    } else {
        content.style.display = 'none';
        arrow.textContent = '▶';
    }
}

function initFormulas() {
    const formulaStyles = `
        .formulas-category-list {
            display: flex;
            flex-direction: column;
            gap: 12px;
        }

        .formula-category {
            border: 1px solid #e2e8f0;
            border-radius: 12px;
            overflow: hidden;
            background: #fafbff;
        }

        .category-header {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 16px 20px;
            cursor: pointer;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            font-size: 18px;
            font-weight: 600;
            transition: all 0.3s ease;
            user-select: none;
            touch-action: manipulation;
        }

        .category-header:hover {
            filter: brightness(1.05);
        }

        .category-header:active {
            filter: brightness(0.95);
        }

        .category-icon {
            font-size: 24px;
        }

        .category-name {
            flex: 1;
        }

        .category-arrow {
            font-size: 14px;
            transition: transform 0.3s ease;
        }

        .category-items {
            display: none;
            padding: 10px;
        }

        .formula-item {
            margin-bottom: 8px;
            border: 1px solid #e2e8f0;
            border-radius: 8px;
            background: white;
            overflow: hidden;
        }

        .formula-item:last-child {
            margin-bottom: 0;
        }

        .formula-title {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 16px;
            cursor: pointer;
            background: #f8fafc;
            font-weight: 600;
            color: #334155;
            transition: background 0.2s ease;
            user-select: none;
            touch-action: manipulation;
        }

        .formula-title:hover {
            background: #f1f5f9;
        }

        .formula-title:active {
            background: #e2e8f0;
        }

        .formula-arrow {
            font-size: 12px;
            color: #94a3b8;
            transition: transform 0.3s ease;
        }

        .formula-content {
            display: none;
            padding: 16px;
            border-top: 1px solid #e2e8f0;
        }

        .formula-section {
            margin-bottom: 20px;
        }

        .formula-section:last-child {
            margin-bottom: 0;
        }

        .formula-section h4 {
            color: #667eea;
            margin-bottom: 10px;
            font-size: 15px;
        }

        .formula-section ul,
        .formula-section ol {
            margin: 0;
            padding-left: 24px;
            line-height: 2;
            color: #334155;
            font-size: 14px;
        }

        .formula-section li {
            margin-bottom: 4px;
        }

        .example-question {
            background: #f0f9ff;
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 10px;
            line-height: 1.6;
            color: #0c4a6e;
            font-size: 14px;
        }

        .example-solution {
            background: #f0fdf4;
            padding: 12px;
            border-radius: 8px;
            line-height: 1.6;
            color: #14532d;
            font-size: 14px;
        }

        .example-solution pre {
            margin: 8px 0 0 0;
            font-family: inherit;
            white-space: pre-wrap;
            word-wrap: break-word;
            font-size: 14px;
            line-height: 1.8;
        }

        @media (max-width: 768px) {
            .category-header {
                padding: 14px 16px;
                font-size: 16px;
            }

            .category-icon {
                font-size: 20px;
            }

            .formula-title {
                padding: 10px 14px;
                font-size: 14px;
            }

            .formula-content {
                padding: 12px;
            }

            .formula-section h4 {
                font-size: 14px;
            }

            .formula-section ul,
            .formula-section ol {
                font-size: 13px;
                padding-left: 20px;
            }

            .example-question,
            .example-solution,
            .example-solution pre {
                font-size: 13px;
            }
        }
    `;

    const styleElement = document.createElement('style');
    styleElement.id = 'formulas-styles';
    styleElement.textContent = formulaStyles;
    document.head.appendChild(styleElement);

    window.toggleCategory = toggleCategory;
    window.toggleFormula = toggleFormula;
}

export { initFormulas, getFormulasHtml };
