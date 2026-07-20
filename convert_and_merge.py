import json
import re
import sys

SUBSCRIPT_MAP = {'0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄',
                 '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'}

REVERSE_SUBSCRIPT = {v: k for k, v in SUBSCRIPT_MAP.items()}


def to_unicode_subscript(formula: str) -> str:
    result = []
    i = 0
    while i < len(formula):
        ch = formula[i]
        if ch.isdigit():
            if i > 0 and (formula[i-1].isalpha() or formula[i-1] == ')'):
                result.append(SUBSCRIPT_MAP.get(ch, ch))
            else:
                result.append(ch)
        elif ch in REVERSE_SUBSCRIPT:
            result.append(ch)
        else:
            result.append(ch)
        i += 1
    return ''.join(result)


def normalize_formula(formula: str) -> str:
    result = []
    for ch in formula:
        if ch in REVERSE_SUBSCRIPT:
            result.append(REVERSE_SUBSCRIPT[ch])
        else:
            result.append(ch)
    return ''.join(result)


def parse_formula(formula: str) -> dict:
    formula = normalize_formula(formula).replace('↑', '').replace('↓', '').strip()
    
    def parse_group(s, start):
        elements = {}
        i = start
        current_element = ''
        current_count = ''
        
        while i < len(s):
            ch = s[i]
            
            if ch == '(':
                if current_element:
                    cnt = int(current_count) if current_count else 1
                    elements[current_element] = elements.get(current_element, 0) + cnt
                    current_element = ''
                    current_count = ''
                
                inner, i = parse_group(s, i + 1)
                multiplier = ''
                while i < len(s) and s[i].isdigit():
                    multiplier += s[i]
                    i += 1
                mult = int(multiplier) if multiplier else 1
                
                for e, c in inner.items():
                    elements[e] = elements.get(e, 0) + c * mult
                continue
            
            if ch == ')':
                if current_element:
                    cnt = int(current_count) if current_count else 1
                    elements[current_element] = elements.get(current_element, 0) + cnt
                return elements, i + 1
            
            if ch.isupper():
                if current_element:
                    cnt = int(current_count) if current_count else 1
                    elements[current_element] = elements.get(current_element, 0) + cnt
                current_element = ch
                current_count = ''
                i += 1
                continue
            
            if ch.islower():
                current_element += ch
                i += 1
                continue
            
            if ch.isdigit():
                current_count += ch
                i += 1
                continue
            
            i += 1
        
        if current_element:
            cnt = int(current_count) if current_count else 1
            elements[current_element] = elements.get(current_element, 0) + cnt
        
        return elements, i
    
    result, _ = parse_group(formula, 0)
    return result


def get_elements(formula: str) -> list:
    return sorted(list(parse_formula(formula).keys()))


def generate_id(product_formula: str) -> str:
    elements = get_elements(product_formula)
    return '-'.join(e.lower() for e in elements)


def convert_reaction(r: dict) -> dict:
    product_normal = normalize_formula(r['product'])
    product_unicode = to_unicode_subscript(product_normal)
    
    elements = get_elements(product_normal)
    new_id = '-'.join(e.lower() for e in elements)
    
    reactant_elements = []
    for r_elem in r.get('reactants', []):
        elem_formula = normalize_formula(r_elem)
        elem_parsed = parse_formula(elem_formula)
        for e in elem_parsed.keys():
            if e not in reactant_elements:
                reactant_elements.append(e)
    
    equation = r.get('equation', '')
    equation = equation.replace('＝', ' → ')
    equation = equation.replace('=', ' → ')
    
    return {
        'id': new_id,
        'type': r['type'],
        'reactants': reactant_elements,
        'product': product_unicode,
        'productName': r.get('productName', ''),
        'equation': equation,
        'condition': r.get('condition', ''),
        'description': r.get('description', '')
    }


def main():
    if len(sys.argv) != 3:
        print("Usage: python convert_and_merge.py <existing.json> <new.json>")
        sys.exit(1)
    
    existing_path = sys.argv[1]
    new_path = sys.argv[2]
    
    with open(existing_path, 'r', encoding='utf-8') as f:
        existing = json.load(f)
    
    with open(new_path, 'r', encoding='utf-8') as f:
        new_reactions = json.load(f)
    
    existing_keys = set()
    for r in existing:
        product_norm = normalize_formula(r['product'])
        key = (r['id'], product_norm)
        existing_keys.add(key)
    
    added_count = 0
    skipped_duplicate = 0
    
    for r in new_reactions:
        converted = convert_reaction(r)
        product_norm = normalize_formula(converted['product'])
        key = (converted['id'], product_norm)
        
        if key in existing_keys:
            skipped_duplicate += 1
            continue
        
        existing.append(converted)
        existing_keys.add(key)
        added_count += 1
    
    with open(existing_path, 'w', encoding='utf-8') as f:
        json.dump(existing, f, ensure_ascii=False, indent=2)
    
    print(f"原有反应数: {len(existing) - added_count}")
    print(f"新增反应数: {added_count}")
    print(f"跳过重复数: {skipped_duplicate}")
    print(f"合并后总数: {len(existing)}")
    
    types = {}
    for r in existing:
        t = r['type']
        types[t] = types.get(t, 0) + 1
    print(f"\n类型分布: {types}")


if __name__ == '__main__':
    main()
