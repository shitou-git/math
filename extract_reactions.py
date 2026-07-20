import re
import json
import sys
from typing import List, Dict, Tuple

COMPOUND_NAMES = {
    'H2O': '水', 'H2O2': '过氧化氢', 'CO2': '二氧化碳', 'CO': '一氧化碳',
    'NH3': '氨', 'NO': '一氧化氮', 'NO2': '二氧化氮', 'SO2': '二氧化硫',
    'SO3': '三氧化硫', 'P2O5': '五氧化二磷', 'NaCl': '氯化钠',
    'HCl': '氯化氢', 'NaOH': '氢氧化钠', 'Na2O': '氧化钠',
    'Na2O2': '过氧化钠', 'Na2CO3': '碳酸钠', 'NaHCO3': '碳酸氢钠',
    'Na2SO4': '硫酸钠', 'Na2SO3': '亚硫酸钠', 'Na2S': '硫化钠',
    'NaAlO2': '偏铝酸钠', 'MgO': '氧化镁', 'MgCl2': '氯化镁',
    'Al2O3': '氧化铝', 'Al(OH)3': '氢氧化铝', 'AlCl3': '氯化铝',
    'Fe': '铁', 'FeO': '氧化亚铁', 'Fe2O3': '氧化铁',
    'Fe3O4': '四氧化三铁', 'FeCl2': '氯化亚铁', 'FeCl3': '氯化铁',
    'FeSO4': '硫酸亚铁', 'Fe2(SO4)3': '硫酸铁', 'Fe(OH)2': '氢氧化亚铁',
    'Fe(OH)3': '氢氧化铁', 'Cu': '铜', 'CuO': '氧化铜',
    'Cu2O': '氧化亚铜', 'Cu(OH)2': '氢氧化铜', 'CuSO4': '硫酸铜',
    'Ag': '银', 'AgNO3': '硝酸银', 'AgCl': '氯化银',
    'CaO': '氧化钙', 'Ca(OH)2': '氢氧化钙', 'CaCO3': '碳酸钙',
    'CaCl2': '氯化钙', 'CaSO4': '硫酸钙', 'BaCl2': '氯化钡',
    'BaSO4': '硫酸钡', 'BaCO3': '碳酸钡', 'Zn': '锌',
    'ZnO': '氧化锌', 'Zn(OH)2': '氢氧化锌', 'ZnSO4': '硫酸锌',
    'MnO2': '二氧化锰', 'KMnO4': '高锰酸钾', 'K2MnO4': '锰酸钾',
    'H2SO4': '硫酸', 'HNO3': '硝酸', 'H2CO3': '碳酸',
    'HClO': '次氯酸', 'H2S': '硫化氢', 'CH4': '甲烷',
    'C2H4': '乙烯', 'C2H2': '乙炔', 'C6H6': '苯',
    'C2H5OH': '乙醇', 'CH3COOH': '乙酸', 'CH3CHO': '乙醛',
    'C6H5OH': '苯酚', 'CH3COOC2H5': '乙酸乙酯', 'NaClO': '次氯酸钠',
    'NaHSO4': '硫酸氢钠', 'Na2SiO3': '硅酸钠', 'Na3PO4': '磷酸钠',
    'NaH2PO4': '磷酸二氢钠', 'Na2HPO4': '磷酸氢二钠', 'NaNO3': '硝酸钠',
    'KOH': '氢氧化钾', 'KCl': '氯化钾', 'KClO3': '氯酸钾',
    'KHCO3': '碳酸氢钾', 'K2CO3': '碳酸钾', 'Ca(HCO3)2': '碳酸氢钙',
    'SiO2': '二氧化硅', 'Si': '硅', 'SiCl4': '四氯化硅',
    'Al2(SO4)3': '硫酸铝', 'NH4Cl': '氯化铵', 'NH4NO3': '硝酸铵',
    'NH4HCO3': '碳酸氢铵', '(NH4)2SO4': '硫酸铵',
    'HNO2': '亚硝酸', 'KNO3': '硝酸钾', 'Ba(NO3)2': '硝酸钡',
    'Cu(NO3)2': '硝酸铜', 'Hg': '汞', 'HgO': '氧化汞',
    'HgCl2': '氯化汞', 'Hg2Cl2': '氯化亚汞', 'FeS': '硫化亚铁',
    'FeS2': '二硫化亚铁', 'Pb': '铅', 'PbO': '氧化铅',
    'PbO2': '二氧化铅', 'Pb(NO3)2': '硝酸铅', 'PbSO4': '硫酸铅',
    'Sn': '锡', 'SnCl2': '氯化亚锡', 'SnCl4': '四氯化锡',
    'Br2': '溴', 'I2': '碘', 'HF': '氟化氢',
    'HBr': '溴化氢', 'HI': '碘化氢', 'NaF': '氟化钠',
    'NaBr': '溴化钠', 'NaI': '碘化钠', 'Cl2': '氯气',
    'O2': '氧气', 'N2': '氮气', 'H2': '氢气',
    'S': '硫', 'P': '磷', 'C': '碳', 'Si': '硅',
    'K2Cr2O7': '重铬酸钾', 'Cr2O3': '三氧化二铬', 'Na2CrO4': '铬酸钠',
    'CaC2': '碳化钙', 'CO(NH2)2': '尿素', 'H3PO4': '磷酸',
    'Na2S2O3': '硫代硫酸钠', 'H2SO3': '亚硫酸', 'NaHSO3': '亚硫酸氢钠',
    'KAl(SO4)2': '明矾', 'MgSO4': '硫酸镁',
    'NaNH2': '氨基钠', 'Ti': '钛', 'TiCl4': '四氯化钛',
    'NaPO3': '偏磷酸钠', 'Na3PO3': '亚磷酸钠',
    'H2SiO3': '硅酸', 'SiF4': '四氟化硅',
    'CaF2': '氟化钙', 'CaSiO3': '硅酸钙', 'Ca3(PO4)2': '磷酸钙',
    'NaHS': '硫氢化钠', 'Na2S4O6': '连四硫酸钠',
    'Na2SO5': '过一硫酸钠', 'Na2S2O4': '连二亚硫酸钠',
    'Na2S2O6': '连二硫酸钠', 'Na2S2O5': '焦亚硫酸钠',
    'Na2S2': '二硫化钠', 'Na2Sx': '多硫化钠',
    'C6H5ONa': '苯酚钠', 'C6H5COOH': '苯甲酸',
    'CH3COONa': '乙酸钠', 'CH3COOK': '乙酸钾', 'CH3COONH4': '乙酸铵',
    'CH3COOAg': '乙酸银', 'CH3COOCH3': '乙酸甲酯',
    'HCOOH': '甲酸', 'HCOONa': '甲酸钠', 'HCOONH4': '甲酸铵',
    'HCOOCH3': '甲酸甲酯', 'HCOOC2H5': '甲酸乙酯',
    'HOOCCOOH': '草酸', 'NaOOCCOONa': '草酸钠', 'Ca(OOCCOO)': '草酸钙',
    'HOCH2CH2OH': '乙二醇', 'HOCH2CH(OH)CH2OH': '丙三醇',
    'C2H5ONa': '乙醇钠', 'C2H5Br': '溴乙烷', 'C2H5Cl': '氯乙烷',
    'C2H5I': '碘乙烷', 'CH3OH': '甲醇',
    'CH3COCH3': '丙酮', 'C6H5CHO': '苯甲醛',
    'C6H5COCH3': '苯乙酮', 'C6H5COONa': '苯甲酸钠',
    'C6H5COOK': '苯甲酸钾', 'C6H5COONH4': '苯甲酸铵',
    'C6H5COOCH3': '苯甲酸甲酯', 'C6H5COOC2H5': '苯甲酸乙酯',
    'C6H5OK': '苯酚钾', 'C6H5NH2': '苯胺',
    'C6H5N2Cl': '氯化重氮苯', 'C6H5NO2': '硝基苯',
    'C6H5NHNH2': '苯肼',
    'CaSiO3': '硅酸钙', 'CaHPO4': '磷酸氢钙',
    'CaC2O4': '草酸钙', 'Ca(ClO)2': '次氯酸钙',
    'Ca(ClO3)2': '氯酸钙', 'Ca(ClO4)2': '高氯酸钙',
    'Ca(NO3)2': '硝酸钙', 'CaSO3': '亚硫酸钙', 'CaS': '硫化钙',
    'CaSO4·2H2O': '石膏', 'CaSO4·0.5H2O': '熟石膏',
    'CaBr2': '溴化钙', 'CaI2': '碘化钙',
    'Ca(CN)2': '氰化钙', 'Ca(CNO)2': '氰氨化钙',
    'Ca(HCOO)2': '甲酸钙', 'Ca(CH3COO)2': '乙酸钙',
    'Ca(C6H5COO)2': '苯甲酸钙',
    'Ca(C17H35COO)2': '硬脂酸钙', 'Ca(C17H33COO)2': '油酸钙',
    'Ca(C15H31COO)2': '软脂酸钙', 'Ca(C11H23COO)2': '月桂酸钙',
    'Ca(C9H19COO)2': '壬酸钙', 'Ca(C7H15COO)2': '庚酸钙',
    'Ca(C5H11COO)2': '戊酸钙', 'Ca(C3H7COO)2': '丙酸钙',
}

ELEMENT_SYMBOLS = {
    'H', 'He', 'Li', 'Be', 'B', 'C', 'N', 'O', 'F', 'Ne',
    'Na', 'Mg', 'Al', 'Si', 'P', 'S', 'Cl', 'Ar', 'K', 'Ca',
    'Sc', 'Ti', 'V', 'Cr', 'Mn', 'Fe', 'Co', 'Ni', 'Cu', 'Zn',
    'Ga', 'Ge', 'As', 'Se', 'Br', 'Kr', 'Rb', 'Sr', 'Y', 'Zr',
    'Nb', 'Mo', 'Tc', 'Ru', 'Rh', 'Pd', 'Ag', 'Cd', 'In', 'Sn',
    'Sb', 'Te', 'I', 'Xe', 'Cs', 'Ba', 'La', 'Ce', 'Pr', 'Nd',
    'Pm', 'Sm', 'Eu', 'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb',
    'Lu', 'Hf', 'Ta', 'W', 'Re', 'Os', 'Ir', 'Pt', 'Au', 'Hg',
    'Tl', 'Pb', 'Bi', 'Po', 'At', 'Rn', 'Fr', 'Ra', 'Ac', 'Th',
    'Pa', 'U', 'Np', 'Pu', 'Am', 'Cm', 'Bk', 'Cf', 'Es', 'Fm',
    'Md', 'No', 'Lr', 'H2', 'O2', 'N2', 'C', 'S', 'P', 'Cl2',
    'Br2', 'I2', 'F2', 'Na', 'Mg', 'Al', 'K', 'Ca', 'Fe', 'Cu',
    'Zn', 'Ag', 'Ba', 'Mn', 'Hg', 'Pb', 'Sn', 'Si'
}


def parse_formula(formula: str) -> List[str]:
    formula = formula.replace('↑', '').replace('↓', '')
    pattern = r'([A-Z][a-z]?)(\d*)'
    matches = re.findall(pattern, formula)
    elements = []
    for symbol, count in matches:
        cnt = int(count) if count else 1
        elements.extend([symbol] * cnt)
    return elements


def extract_elements(compound: str) -> List[str]:
    elements = parse_formula(compound)
    return list(set(elements))


def classify_reaction_type(reactants: List[str], products: List[str]) -> str:
    reactant_elements = []
    product_elements = []
    
    for r in reactants:
        reactant_elements.extend(extract_elements(r))
    for p in products:
        product_elements.extend(extract_elements(p))
    
    reactant_elements = list(set(reactant_elements))
    product_elements = list(set(product_elements))
    
    num_reactants = len(reactants)
    num_products = len(products)
    
    reactants_have_element = any(r in ELEMENT_SYMBOLS for r in reactants)
    products_have_element = any(p in ELEMENT_SYMBOLS for p in products)
    
    if num_reactants == 1 and num_products > 1:
        return '分解'
    elif num_reactants > 1 and num_products == 1:
        return '化合'
    elif reactants_have_element and products_have_element:
        return '置换'
    elif num_reactants == 2 and num_products == 2:
        return '复分解'
    else:
        return '氧化还原'


def parse_equation(equation: str) -> Tuple[List[str], List[str], str]:
    equation = equation.strip()
    
    condition = ''
    if '△' in equation:
        condition = '加热'
        equation = equation.replace('△', '')
    if '高温' in equation:
        condition = '高温'
        equation = equation.replace('高温', '')
    if '点燃' in equation:
        condition = '点燃'
        equation = equation.replace('点燃', '')
    if '催化剂' in equation:
        condition = '催化剂'
        equation = equation.replace('催化剂', '')
    if '通电' in equation:
        condition = '通电'
        equation = equation.replace('通电', '')
    if '加热' in equation:
        condition = '加热'
        equation = equation.replace('加热', '')
    if '熔融' in equation:
        condition = '熔融'
        equation = equation.replace('熔融', '')
    
    cond_parts = []
    if '浓' in equation:
        cond_parts.append('浓')
        equation = equation.replace('浓', '')
    if '稀' in equation:
        cond_parts.append('稀')
        equation = equation.replace('稀', '')
    if '冷' in equation:
        cond_parts.append('冷')
        equation = equation.replace('冷', '')
    if '饱和' in equation:
        cond_parts.append('饱和')
        equation = equation.replace('饱和', '')
    condition = ''.join(cond_parts)
    
    equation = re.sub(r'（[^）]+）', '', equation)
    equation = re.sub(r'\([^)]+\)', '', equation)
    
    arrow_pattern = r'→|＝|='
    parts = re.split(arrow_pattern, equation)
    
    if len(parts) != 2:
        return [], [], condition
    
    left = parts[0].strip()
    right = parts[1].strip()
    
    if not left or not right:
        return [], [], condition
    
    reactants = [r.strip() for r in left.split('+')]
    products = [p.strip() for p in right.split('+')]
    
    reactants = [r for r in reactants if r and not re.match(r'^\d+$', r)]
    products = [p for p in products if p and not re.match(r'^\d+$', p)]
    
    return reactants, products, condition


def convert_to_unicode_subscript(equation: str) -> str:
    subscripts = {'0': '₀', '1': '₁', '2': '₂', '3': '₃', '4': '₄', 
                  '5': '₅', '6': '₆', '7': '₇', '8': '₈', '9': '₉'}
    result = []
    i = 0
    while i < len(equation):
        if equation[i].isdigit():
            if i > 0 and equation[i-1].isalpha():
                result.append(subscripts.get(equation[i], equation[i]))
            else:
                result.append(equation[i])
        else:
            result.append(equation[i])
        i += 1
    return ''.join(result)


def generate_id(reactants: List[str], product: str) -> str:
    key_parts = []
    for r in reactants:
        elements = extract_elements(r)
        key_parts.extend(elements)
    elements = extract_elements(product)
    key_parts.extend(elements)
    return '-'.join(sorted(set(key_parts)))


def clean_compound(compound: str) -> str:
    compound = compound.replace('↑', '').replace('↓', '')
    compound = re.sub(r'^\d+', '', compound)
    return compound


def extract_coefficient(compound: str) -> int:
    match = re.match(r'^(\d+)', compound)
    if match:
        return int(match.group(1))
    return 1


def process_file(input_path: str) -> List[Dict]:
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    reactions = []
    seen_ids = set()
    
    for line in lines:
        line = line.strip()
        
        if not line:
            continue
        
        if re.match(r'^\d+\.', line):
            line = re.sub(r'^\d+\.', '', line).strip()
        
        if any(x in line for x in ['第', '页', '目录', '部分', '一、', '二、', '三、', '四、', '五、', '六、', '七、']):
            continue
        
        if 'kJ' in line or 'ΔH' in line or 'mol' in line:
            continue
        
        if '→' not in line and '＝' not in line and '=' not in line:
            continue
        
        reactants, products, condition = parse_equation(line)
        
        if len(reactants) == 0 or len(products) == 0:
            continue
        
        clean_products = [clean_compound(p) for p in products if clean_compound(p) and clean_compound(p) not in ELEMENT_SYMBOLS]
        
        if not clean_products:
            continue
        
        clean_reactants = [clean_compound(r) for r in reactants]
        
        r_type = classify_reaction_type(clean_reactants, clean_products)
        
        for product in clean_products:
            r_id = generate_id(clean_reactants, product)
            
            if r_id in seen_ids:
                continue
            seen_ids.add(r_id)
            
            reactant_elements = []
            for r in clean_reactants:
                if r in ELEMENT_SYMBOLS:
                    reactant_elements.append(r)
            
            product_name = COMPOUND_NAMES.get(product, '')
            
            eq_unicode = convert_to_unicode_subscript(line)
            
            description = f"{'+'.join(reactants)}反应生成{product}。"
            
            reaction = {
                'id': r_id,
                'type': r_type,
                'reactants': reactant_elements,
                'product': product,
                'productName': product_name,
                'equation': eq_unicode,
                'condition': condition,
                'description': description
            }
            reactions.append(reaction)
    
    print(f"Extracted {len(reactions)} reactions")
    return reactions


def main():
    if len(sys.argv) != 3:
        print("Usage: python extract_reactions.py <input.txt> <output.json>")
        sys.exit(1)
    
    input_path = sys.argv[1]
    output_path = sys.argv[2]
    
    reactions = process_file(input_path)
    
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(reactions, f, ensure_ascii=False, indent=2)
    
    print(f"Saved {len(reactions)} reactions to {output_path}")


if __name__ == '__main__':
    main()
