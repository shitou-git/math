import re
import json
import os

def extract_words_from_html(html_content):
    words = []
    
    word_database_match = re.search(r'const wordDatabase = (\{[\s\S]*?\});', html_content)
    if word_database_match:
        try:
            db_data = json.loads(word_database_match.group(1))
            for category, cat_data in db_data.items():
                if 'words' in cat_data:
                    for w in cat_data['words']:
                        words.append({
                            'en': w.get('en', ''),
                            'zh': w.get('zh', ''),
                            'ipa': w.get('ipa', ''),
                            'emoji': w.get('emoji', ''),
                            'category': cat_data.get('name', {}).get('zh', category),
                            'level': ''
                        })
        except Exception as e:
            print(f"解析 wordDatabase 失败: {e}")
    
    school_words_match = re.search(r'const schoolWords = (\{[\s\S]*?\});', html_content)
    if school_words_match:
        try:
            school_data = json.loads(school_words_match.group(1))
            for level, level_data in school_data.items():
                if 'words' in level_data:
                    level_zh = '小学' if level == 'primary' else '初中' if level == 'junior' else level
                    for w in level_data['words']:
                        words.append({
                            'en': w.get('en', ''),
                            'zh': w.get('zh', ''),
                            'ipa': w.get('ipa', ''),
                            'emoji': w.get('emoji', ''),
                            'category': '',
                            'level': level
                        })
        except Exception as e:
            print(f"解析 schoolWords 失败: {e}")
    
    valid_words = [w for w in words if w['en'] and w['zh']]
    print(f"共提取 {len(valid_words)} 个有效单词")
    
    return valid_words

def main():
    html_path = os.path.join(os.path.dirname(__file__), '..', 'dc.html')
    
    with open(html_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    words = extract_words_from_html(content)
    
    output_path = os.path.join(os.path.dirname(__file__), '..', 'data', 'words_export.json')
    os.makedirs(os.path.dirname(output_path), exist_ok=True)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump({'words': words}, f, ensure_ascii=False, indent=2)
    
    print(f"数据已导出到: {output_path}")
    print(f"格式: {{\"words\": [...], \"total\": {len(words)}}}")

if __name__ == '__main__':
    main()
