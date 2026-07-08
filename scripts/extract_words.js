const fs = require('fs');
const path = require('path');

const htmlPath = path.join(__dirname, '..', 'dc.html');
const content = fs.readFileSync(htmlPath, 'utf-8');

function extractData(content, varName) {
  const pattern = new RegExp(`const\\s+${varName}\\s*=\\s*([\\s\\S]*?);\\s*$`, 'm');
  const match = content.match(pattern);
  if (!match) return null;
  
  try {
    const code = `const data = ${match[1]}; JSON.stringify(data)`;
    const result = eval(code);
    return JSON.parse(result);
  } catch (e) {
    console.error(`解析 ${varName} 失败:`, e.message);
    return null;
  }
}

const wordDatabase = extractData(content, 'wordDatabase');
const schoolWords = extractData(content, 'schoolWords');

const words = [];

if (wordDatabase) {
  for (const category in wordDatabase) {
    const catData = wordDatabase[category];
    if (catData.words) {
      const catZh = catData.name?.zh || category;
      for (const w of catData.words) {
        if (w.en && w.zh) {
          words.push({
            en: w.en,
            zh: w.zh,
            ipa: w.ipa || '',
            emoji: w.emoji || '',
            category: catZh,
            level: ''
          });
        }
      }
    }
  }
}

if (schoolWords) {
  for (const level in schoolWords) {
    const levelData = schoolWords[level];
    if (levelData.words) {
      for (const w of levelData.words) {
        if (w.en && w.zh) {
          words.push({
            en: w.en,
            zh: w.zh,
            ipa: w.ipa || '',
            emoji: w.emoji || '',
            category: '',
            level: level
          });
        }
      }
    }
  }
}

const outputPath = path.join(__dirname, '..', 'data', 'words_export.json');
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify({ words }, null, 2), 'utf-8');

console.log(`共提取 ${words.length} 个有效单词`);
console.log(`数据已导出到: ${outputPath}`);
