import json
import sys

def main():
    if len(sys.argv) != 3:
        print("Usage: python merge_reactions.py <existing.json> <new.json>")
        sys.exit(1)
    
    existing_path = sys.argv[1]
    new_path = sys.argv[2]
    
    with open(existing_path, 'r', encoding='utf-8') as f:
        existing = json.load(f)
    
    with open(new_path, 'r', encoding='utf-8') as f:
        new_reactions = json.load(f)
    
    existing_ids = set()
    for r in existing:
        existing_ids.add(r['id'])
    
    added_count = 0
    for r in new_reactions:
        if r['id'] not in existing_ids:
            existing.append(r)
            existing_ids.add(r['id'])
            added_count += 1
    
    with open(existing_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print(f"原有反应数: {len(existing) - added_count}")
    print(f"新增反应数: {added_count}")
    print(f"合并后总数: {len(existing)}")

if __name__ == '__main__':
    main()
