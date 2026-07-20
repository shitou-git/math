import re
import json
import sys
from typing import List, Dict, Tuple

COMPOUND_NAMES = {
    'H2O': '水', 'H2O2': '过氧化氢', 'CO2': '二氧化碳', 'CO': '一氧化碳',
    'NH3': '氨', 'NO': '一氧化氮', 'NO2': '二氧化氮', 'SO2': '二氧化硫',
    'SO3': '三氧化硫', 'P2O5': '五氧化二磷', 'P2O3': '三氧化二磷',
    'NaCl': '氯化钠', 'HCl': '氯化氢', 'NaOH': '氢氧化钠',
    'Na2O': '氧化钠', 'Na2O2': '过氧化钠', 'Na2CO3': '碳酸钠',
    'NaHCO3': '碳酸氢钠', 'Na2SO4': '硫酸钠', 'Na2SO3': '亚硫酸钠',
    'Na2S': '硫化钠', 'NaAlO2': '偏铝酸钠', 'MgO': '氧化镁',
    'MgCl2': '氯化镁', 'Al2O3': '氧化铝', 'Al(OH)3': '氢氧化铝',
    'AlCl3': '氯化铝', 'FeO': '氧化亚铁', 'Fe2O3': '氧化铁',
    'Fe3O4': '四氧化三铁', 'FeCl2': '氯化亚铁', 'FeCl3': '氯化铁',
    'FeSO4': '硫酸亚铁', 'Fe2(SO4)3': '硫酸铁', 'Fe(OH)2': '氢氧化亚铁',
    'Fe(OH)3': '氢氧化铁', 'CuO': '氧化铜', 'Cu2O': '氧化亚铜',
    'Cu(OH)2': '氢氧化铜', 'CuSO4': '硫酸铜', 'AgNO3': '硝酸银',
    'AgCl': '氯化银', 'CaO': '氧化钙', 'Ca(OH)2': '氢氧化钙',
    'CaCO3': '碳酸钙', 'CaCl2': '氯化钙', 'CaSO4': '硫酸钙',
    'BaCl2': '氯化钡', 'BaSO4': '硫酸钡', 'BaCO3': '碳酸钡',
    'ZnO': '氧化锌', 'Zn(OH)2': '氢氧化锌', 'ZnSO4': '硫酸锌',
    'MnO2': '二氧化锰', 'KMnO4': '高锰酸钾', 'K2MnO4': '锰酸钾',
    'H2SO4': '硫酸', 'HNO3': '硝酸', 'H2CO3': '碳酸',
    'HClO': '次氯酸', 'H2S': '硫化氢', 'NaClO': '次氯酸钠',
    'NaHSO4': '硫酸氢钠', 'Na2SiO3': '硅酸钠', 'Na3PO4': '磷酸钠',
    'NaH2PO4': '磷酸二氢钠', 'Na2HPO4': '磷酸氢二钠', 'NaNO3': '硝酸钠',
    'KOH': '氢氧化钾', 'KCl': '氯化钾', 'KClO3': '氯酸钾',
    'KHCO3': '碳酸氢钾', 'K2CO3': '碳酸钾', 'Ca(HCO3)2': '碳酸氢钙',
    'SiO2': '二氧化硅', 'SiCl4': '四氯化硅', 'Al2(SO4)3': '硫酸铝',
    'NH4Cl': '氯化铵', 'NH4NO3': '硝酸铵', 'NH4HCO3': '碳酸氢铵',
    '(NH4)2SO4': '硫酸铵', '(NH4)2CO3': '碳酸铵',
    'HNO2': '亚硝酸', 'KNO3': '硝酸钾', 'Ba(NO3)2': '硝酸钡',
    'Cu(NO3)2': '硝酸铜', 'HgO': '氧化汞', 'HgCl2': '氯化汞',
    'Hg2Cl2': '氯化亚汞', 'FeS': '硫化亚铁', 'FeS2': '二硫化亚铁',
    'PbO': '氧化铅', 'PbO2': '二氧化铅', 'Pb(NO3)2': '硝酸铅',
    'PbSO4': '硫酸铅', 'SnCl2': '氯化亚锡', 'SnCl4': '四氯化锡',
    'HF': '氟化氢', 'HBr': '溴化氢', 'HI': '碘化氢',
    'NaF': '氟化钠', 'NaBr': '溴化钠', 'NaI': '碘化钠',
    'K2Cr2O7': '重铬酸钾', 'Cr2O3': '三氧化二铬', 'Na2CrO4': '铬酸钠',
    'CaC2': '碳化钙', 'CO(NH2)2': '尿素', 'H3PO4': '磷酸',
    'Na2S2O3': '硫代硫酸钠', 'H2SO3': '亚硫酸', 'NaHSO3': '亚硫酸氢钠',
    'KAl(SO4)2': '明矾', 'MgSO4': '硫酸镁', 'NaNH2': '氨基钠',
    'TiCl4': '四氯化钛', 'NaPO3': '偏磷酸钠', 'Na3PO3': '亚磷酸钠',
    'H2SiO3': '硅酸', 'SiF4': '四氟化硅', 'CaF2': '氟化钙',
    'CaSiO3': '硅酸钙', 'Ca3(PO4)2': '磷酸钙', 'NaHS': '硫氢化钠',
    'Na2S4O6': '连四硫酸钠', 'CaHPO4': '磷酸氢钙',
    'Ca(H2PO4)2': '磷酸二氢钙', 'Ca(ClO)2': '次氯酸钙',
    'Ca(NO3)2': '硝酸钙', 'CaSO3': '亚硫酸钙', 'CaS': '硫化钙',
    'CaBr2': '溴化钙', 'CaI2': '碘化钙', 'Ca(CN)2': '氰化钙',
    'Mg(OH)2': '氢氧化镁', 'MgCO3': '碳酸镁', 'Mg(NO3)2': '硝酸镁',
    'Mg3N2': '氮化镁', 'MgS': '硫化镁', 'MgBr2': '溴化镁',
    'MgI2': '碘化镁', 'MgF2': '氟化镁',
    'Ba(OH)2': '氢氧化钡', 'BaSO3': '亚硫酸钡',
    'BaS': '硫化钡', 'BaO': '氧化钡', 'BaO2': '过氧化钡',
    'ZnCl2': '氯化锌', 'Zn(NO3)2': '硝酸锌', 'ZnCO3': '碳酸锌',
    'ZnS': '硫化锌', 'Zn3(PO4)2': '磷酸锌',
    'Fe(NO3)2': '硝酸亚铁', 'Fe(NO3)3': '硝酸铁', 'FeCO3': '碳酸亚铁',
    'CuCl2': '氯化铜', 'CuCl': '氯化亚铜', 'CuCO3': '碳酸铜',
    'Cu2S': '硫化亚铜', 'CuS': '硫化铜',
    'Ag2O': '氧化银', 'AgBr': '溴化银', 'AgI': '碘化银',
    'Ag2S': '硫化银', 'Ag2SO4': '硫酸银', 'Ag2CO3': '碳酸银',
    'K2O': '氧化钾', 'K2O2': '过氧化钾', 'KO2': '超氧化钾',
    'KHSO4': '硫酸氢钾', 'K2SO4': '硫酸钾', 'K2SO3': '亚硫酸钾',
    'K2S': '硫化钾', 'KHS': '硫氢化钾', 'KAlO2': '偏铝酸钾',
    'Li2O': '氧化锂', 'LiOH': '氢氧化锂', 'LiCl': '氯化锂',
    'Li2CO3': '碳酸锂', 'LiHCO3': '碳酸氢锂', 'SrO': '氧化锶',
    'Sr(OH)2': '氢氧化锶', 'SrCl2': '氯化锶', 'TiO2': '二氧化钛',
    'V2O5': '五氧化二钒', 'CrO3': '三氧化铬', 'Cr2(SO4)3': '硫酸铬',
    'CrCl3': '氯化铬', 'MnSO4': '硫酸锰', 'MnCl2': '氯化锰',
    'Mn(NO3)2': '硝酸锰', 'CoO': '氧化钴', 'CoCl2': '氯化钴',
    'NiO': '氧化镍', 'NiCl2': '氯化镍', 'WO3': '三氧化钨',
    'SiC': '碳化硅', 'Si3N4': '氮化硅', 'N2O': '一氧化二氮',
    'N2O3': '三氧化二氮', 'N2O4': '四氧化二氮', 'N2O5': '五氧化二氮',
    'PCl3': '三氯化磷', 'PCl5': '五氯化磷', 'PH3': '磷化氢',
    'As2O3': '三氧化二砷', 'Sb2O3': '三氧化二锑', 'Bi2O3': '三氧化二铋',
    'SeO2': '二氧化硒', 'TeO2': '二氧化碲',
    'H2Se': '硒化氢', 'H2Te': '碲化氢',
    'Cl2O': '一氧化二氯', 'ClO2': '二氧化氯', 'Cl2O7': '七氧化二氯',
    'HClO4': '高氯酸', 'HClO3': '氯酸', 'HClO2': '亚氯酸',
    'KClO4': '高氯酸钾', 'KClO': '次氯酸钾',
    'HBrO': '次溴酸', 'HBrO3': '溴酸', 'HIO': '次碘酸',
    'HIO3': '碘酸', 'HIO4': '高碘酸',
    'NaH': '氢化钠', 'CaH2': '氢化钙', 'LiH': '氢化锂',
    'KH': '氢化钾', 'NaBH4': '硼氢化钠', 'LiAlH4': '氢化铝锂',
    'B2O3': '三氧化二硼', 'BF3': '三氟化硼', 'BCl3': '三氯化硼',
    'H3BO3': '硼酸', 'Na2B4O7': '硼砂',
    'Al2S3': '硫化铝', 'AlN': '氮化铝', 'Ca3N2': '氮化钙',
    'Li3N': '氮化锂', 'FeBr2': '溴化亚铁', 'FeBr3': '溴化铁',
    'FeI2': '碘化亚铁', 'CuBr2': '溴化铜', 'CuBr': '溴化亚铜',
    'CuI': '碘化亚铜', 'ZnBr2': '溴化锌', 'ZnI2': '碘化锌',
    'FeOOH': '羟基氧化铁', 'FeCO3': '碳酸亚铁', 'MnCO3': '碳酸锰',
    'CoCO3': '碳酸钴', 'NiCO3': '碳酸镍', 'AgF': '氟化银',
    'Tl2O': '氧化亚铊', 'Tl2O3': '三氧化二铊',
    'BiCl3': '三氯化铋', 'SbCl3': '三氯化锑', 'SnO': '氧化亚锡',
    'SnO2': '二氧化锡', 'PbCl2': '氯化铅', 'PbCl4': '四氯化铅',
    'PbS': '硫化铅', 'PbCrO4': '铬酸铅', 'Pb3O4': '四氧化三铅',
    'Fe3C': '碳化铁', 'Ni(OH)2': '氢氧化镍', 'Co(OH)2': '氢氧化钴',
    'CdO': '氧化镉', 'CdCl2': '氯化镉', 'CdSO4': '硫酸镉',
    'In2O3': '三氧化二铟', 'Ga2O3': '三氧化二镓', 'GeO2': '二氧化锗',
    'Ba(NO3)2': '硝酸钡', 'Fe(SCN)3': '硫氰化铁',
    'Na2ZnO2': '锌酸钠', 'Na2BO2': '偏硼酸钠',
    'Hg(NO3)2': '硝酸汞',
}

ELEMENT_SYMBOLS = {
    'H2', 'O2', 'N2', 'Cl2', 'Br2', 'I2', 'F2',
    'Na', 'Mg', 'Al', 'K', 'Ca', 'Fe', 'Cu',
    'Zn', 'Ag', 'Ba', 'Mn', 'Hg', 'Pb', 'Sn',
    'Si', 'P', 'S', 'C', 'B', 'Ti', 'V', 'Cr',
    'Co', 'Ni', 'Pt', 'Au', 'W', 'Mo', 'Li', 'Be',
}

SUBSCRIPT_MAP = {'₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4',
                 '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9'}

NORMAL_SUBSCRIPT_MAP = {v: k for k, v in SUBSCRIPT_MAP.items()}


def normalize_subscripts(formula: str) -> str:
    result = []
    for ch in formula:
        if ch in SUBSCRIPT_MAP:
            result.append(SUBSCRIPT_MAP[ch])
        else:
            result.append(ch)
    return ''.join(result)


def to_unicode_subscript(formula: str) -> str:
    result = []
    i = 0
    while i < len(formula):
        if formula[i].isdigit():
            if i > 0 and (formula[i-1].isalpha() or formula[i-1] == ')'):
                result.append(NORMAL_SUBSCRIPT_MAP.get(formula[i], formula[i]))
            else:
                result.append(formula[i])
        else:
            result.append(formula[i])
        i += 1
    return ''.join(result)


def parse_formula(formula: str) -> Dict[str, int]:
    formula = formula.replace('↑', '').replace('↓', '').strip()
    formula = normalize_subscripts(formula)
    
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


def get_elements(compound: str) -> List[str]:
    elements = parse_formula(compound)
    return list(elements.keys())


def get_coefficient(compound: str) -> Tuple[int, str]:
    compound = compound.strip()
    match = re.match(r'^(\d+)(.*)', compound)
    if match:
        return int(match.group(1)), match.group(2).strip()
    return 1, compound


def clean_compound(compound: str) -> str:
    compound = compound.strip()
    compound = compound.replace('↑', '').replace('↓', '')
    compound = compound.replace('↑', '').replace('↓', '')
    compound = normalize_subscripts(compound)
    _, formula = get_coefficient(compound)
    return formula.strip()


def is_valid_inorganic_compound(compound: str) -> bool:
    if not compound:
        return False
    
    if compound in ELEMENT_SYMBOLS:
        return True
    
    if '+' in compound or '—' in compound or '－' in compound or '–' in compound or '=' in compound:
        return False
    
    if re.search(r'[+\-]\s*$', compound) or re.search(r'^[+\-]', compound):
        return False
    
    if any(c in compound for c in [' ', '、', '…', '·', '•']):
        return False
    
    if not re.match(r'^[A-Z(]', compound):
        return False
    
    if re.search(r'[a-z]{3,}', compound):
        return False
    
    if compound.count('(') != compound.count(')'):
        return False
    
    elements = parse_formula(compound)
    if not elements:
        return False
    
    if len(elements) == 1 and list(elements.keys())[0] not in ELEMENT_SYMBOLS:
        single_element = list(elements.keys())[0]
        if elements[single_element] == 1:
            return False
    
    valid_elements = {'H', 'O', 'N', 'C', 'S', 'P', 'Cl', 'Br', 'I', 'F', 'B',
                      'Na', 'K', 'Li', 'Ca', 'Mg', 'Ba', 'Al', 'Fe', 'Cu', 'Zn',
                      'Ag', 'Pb', 'Mn', 'Cr', 'Co', 'Ni', 'Sn', 'Hg', 'Ti', 'Si',
                      'Pt', 'Au', 'W', 'Mo', 'Be', 'Sr', 'Cd', 'In', 'Ga', 'Ge',
                      'V', 'Nb', 'Ta', 'Zr', 'Hf', 'Bi', 'Sb', 'Se', 'Te', 'As',
                      'Rb', 'Cs', 'Fr', 'Ra', 'Ac', 'Th', 'Pa', 'U',
                      'Sc', 'Y', 'La', 'Ce', 'Pr', 'Nd', 'Pm', 'Sm', 'Eu',
                      'Gd', 'Tb', 'Dy', 'Ho', 'Er', 'Tm', 'Yb', 'Lu',
                      'Ru', 'Rh', 'Pd', 'Os', 'Ir', 'Re', 'Tc', 'Po', 'At', 'Rn'}
    
    for e in elements.keys():
        if e not in valid_elements:
            return False
    
    carbon_count = elements.get('C', 0)
    hydrogen_count = elements.get('H', 0)
    
    if carbon_count > 0:
        if compound not in COMPOUND_NAMES:
            known_inorganic_carbon = [
                'CO', 'CO2', 'C',
                'Na2CO3', 'NaHCO3', 'K2CO3', 'KHCO3', 'CaCO3', 'Ca(HCO3)2',
                'MgCO3', 'BaCO3', 'CuCO3', 'FeCO3', 'MnCO3', 'CoCO3', 'NiCO3',
                'Ag2CO3', 'Li2CO3', 'LiHCO3', 'SrCO3', 'CdCO3',
                'Na2C2O4', 'CaC2O4',
                'CaC2', 'SiC', 'Fe3C', 'Al4C3',
                'H2CO3',
                'NaCN', 'KCN', 'Ca(CN)2',
                'CO(NH2)2',
                'CF4', 'CCl4', 'SiCl4',
                'HCN',
            ]
            if compound not in known_inorganic_carbon:
                return False
    
    return True


def is_ion_reaction(reactants: List[str], products: List[str]) -> bool:
    all_compounds = reactants + products
    for c in all_compounds:
        c_clean = clean_compound(c)
        if '+' in c_clean or '-' in c_clean:
            return True
        if re.search(r'\d+[+\-]', c_clean):
            return True
        if re.search(r'[+\-]\d+', c_clean):
            return True
    return False


def is_balanced(reactants: List[str], products: List[str]) -> bool:
    left_elements = {}
    for r in reactants:
        r_clean = clean_compound(r)
        coef, formula = get_coefficient(r)
        elements = parse_formula(formula)
        for e, c in elements.items():
            left_elements[e] = left_elements.get(e, 0) + c * coef
    
    right_elements = {}
    for p in products:
        p_clean = clean_compound(p)
        coef, formula = get_coefficient(p)
        elements = parse_formula(formula)
        for e, c in elements.items():
            right_elements[e] = right_elements.get(e, 0) + c * coef
    
    if set(left_elements.keys()) != set(right_elements.keys()):
        return False
    
    for e in left_elements:
        if left_elements[e] != right_elements[e]:
            return False
    
    return True


def classify_reaction_type(reactants: List[str], products: List[str]) -> str:
    clean_reactants = [clean_compound(r) for r in reactants]
    clean_products = [clean_compound(p) for p in products]
    
    num_reactants = len(clean_reactants)
    num_products = len(clean_products)
    
    reactants_have_element = any(r in ELEMENT_SYMBOLS for r in clean_reactants)
    products_have_element = any(p in ELEMENT_SYMBOLS for p in clean_products)
    
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


def extract_condition(equation: str) -> Tuple[str, str]:
    condition_parts = []
    eq = equation
    
    condition_keywords = {
        '点燃': '点燃',
        '高温': '高温',
        '加热': '加热',
        '△': '加热',
        '催化剂': '催化剂',
        '通电': '通电',
        '电解': '电解',
        '熔融': '熔融',
        '光照': '光照',
        '放电': '放电',
        '浓硫酸': '浓硫酸',
        '浓H2SO4': '浓硫酸',
    }
    
    for kw, cond in condition_keywords.items():
        if kw in eq:
            if cond not in condition_parts:
                condition_parts.append(cond)
            eq = eq.replace(kw, '', 1)
    
    if '(浓)' in eq or '（浓）' in eq:
        condition_parts.append('浓')
        eq = eq.replace('(浓)', '').replace('（浓）', '')
    
    if '(稀)' in eq or '（稀）' in eq:
        condition_parts.append('稀')
        eq = eq.replace('(稀)', '').replace('（稀）', '')
    
    return ''.join(condition_parts), eq


def parse_equation(equation: str) -> Tuple[List[str], List[str], str]:
    equation = equation.strip()
    
    if not equation or len(equation) < 5:
        return [], [], ''
    
    if re.search(r'[（(][^）)]*[）)][^=→＝]*$', equation):
        pass
    
    if re.search(r'（.*）', equation):
        equation = re.sub(r'（[^）]*注[^）]*）', '', equation)
        equation = re.sub(r'（[^）]*用[^）]*）', '', equation)
        equation = re.sub(r'（[^）]*例如[^）]*）', '', equation)
    
    if re.search(r'\(.*\)', equation):
        equation = re.sub(r'\([^)]*注[^)]*\)', '', equation)
        equation = re.sub(r'\([^)]*例[^)]*\)', '', equation)
    
    condition, eq = extract_condition(equation)
    
    arrow_pattern = r'→|＝|=|—'
    parts = re.split(arrow_pattern, eq, maxsplit=1)
    
    if len(parts) != 2:
        return [], [], condition
    
    left = parts[0].strip()
    right = parts[1].strip()
    
    if not left or not right:
        return [], [], condition
    
    def remove_trailing_comment(s):
        while True:
            changed = False
            
            open_idx = s.rfind('（')
            if open_idx == -1:
                open_idx = s.rfind('(')
            
            if open_idx != -1:
                after = s[open_idx:]
                if re.search(r'[\u4e00-\u9fff]', after):
                    s = s[:open_idx].strip()
                    changed = True
            
            if not changed:
                break
        return s
    
    right = remove_trailing_comment(right)
    left = remove_trailing_comment(left)
    
    reactants = [r.strip() for r in left.split('+')]
    products = [p.strip() for p in right.split('+')]
    
    reactants = [r for r in reactants if r and not re.match(r'^\d+$', r)]
    products = [p for p in products if p and not re.match(r'^\d+$', p)]
    
    if not reactants or not products:
        return [], [], condition
    
    return reactants, products, condition


def generate_id(reactants: List[str], product: str) -> str:
    key_parts = []
    for r in reactants:
        elements = get_elements(clean_compound(r))
        key_parts.extend(elements)
    elements = get_elements(clean_compound(product))
    key_parts.extend(elements)
    return '-'.join(sorted(set(key_parts)))


def convert_equation_to_unicode(equation: str) -> str:
    result = []
    i = 0
    while i < len(equation):
        ch = equation[i]
        if ch.isdigit():
            if i > 0 and (equation[i-1].isalpha() or equation[i-1] == ')'):
                result.append(NORMAL_SUBSCRIPT_MAP.get(ch, ch))
            else:
                result.append(ch)
        elif ch in SUBSCRIPT_MAP:
            result.append(ch)
        else:
            result.append(ch)
        i += 1
    return ''.join(result)


def process_file(input_path: str) -> List[Dict]:
    with open(input_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.split('\n')
    
    reactions = []
    seen_ids = set()
    skipped = {'unbalanced': 0, 'organic': 0, 'ion': 0, 'invalid': 0, 'element_product': 0, 'duplicate': 0}
    
    for line in lines:
        line = line.strip()
        
        if not line:
            continue
        
        if re.match(r'^\d+\.', line):
            line = re.sub(r'^\d+\.', '', line).strip()
        
        if any(x in line for x in ['第', '页', '目录', '部分', '一、', '二、', '三、', '四、', '五、', '六、', '七、', '八、', '九、', '十、']):
            continue
        
        if 'kJ' in line or 'ΔH' in line or 'mol' in line or '热量' in line:
            continue
        
        if '→' not in line and '＝' not in line and '=' not in line:
            continue
        
        if re.match(r'^[a-z]', line):
            continue
        
        if '离子方程式' in line or '电极反应' in line or '热化学' in line:
            continue
        
        reactants, products, condition = parse_equation(line)
        
        if len(reactants) == 0 or len(products) == 0:
            skipped['invalid'] += 1
            continue
        
        clean_reactants = []
        for r in reactants:
            cr = clean_compound(r)
            if is_valid_inorganic_compound(cr):
                clean_reactants.append(cr)
            else:
                break
        
        if len(clean_reactants) != len(reactants):
            skipped['invalid'] += 1
            continue
        
        clean_products = []
        for p in products:
            cp = clean_compound(p)
            if is_valid_inorganic_compound(cp):
                clean_products.append(cp)
            else:
                break
        
        if len(clean_products) != len(products):
            skipped['invalid'] += 1
            continue
        
        if not clean_reactants or not clean_products:
            skipped['invalid'] += 1
            continue
        
        if is_ion_reaction(clean_reactants, clean_products):
            skipped['ion'] += 1
            continue
        
        has_organic = False
        for c in clean_reactants + clean_products:
            elements = parse_formula(c)
            c_count = elements.get('C', 0)
            h_count = elements.get('H', 0)
            if c_count >= 3 and h_count >= 4:
                has_organic = True
                break
        if has_organic:
            skipped['organic'] += 1
            continue
        
        if not is_balanced(reactants, products):
            skipped['unbalanced'] += 1
            continue
        
        r_type = classify_reaction_type(clean_reactants, clean_products)
        
        for product in clean_products:
            if product in ELEMENT_SYMBOLS:
                skipped['element_product'] += 1
                continue
            
            r_id = generate_id(clean_reactants, product)
            
            if r_id in seen_ids:
                skipped['duplicate'] += 1
                continue
            seen_ids.add(r_id)
            
            reactant_elements = []
            for r in clean_reactants:
                if r in ELEMENT_SYMBOLS:
                    reactant_elements.append(r)
            
            product_name = COMPOUND_NAMES.get(product, '')
            
            eq_unicode = convert_equation_to_unicode(line)
            
            description = f"{'+'.join(clean_reactants)}反应生成{product}。"
            
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
    print(f"Skipped: {skipped}")
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
    
    types = {}
    for r in reactions:
        t = r['type']
        types[t] = types.get(t, 0) + 1
    print(f"类型分布: {types}")
    
    no_name = sum(1 for r in reactions if not r['productName'])
    print(f"无productName的反应: {no_name}")
    
    no_reactants = sum(1 for r in reactions if not r['reactants'])
    print(f"无reactants的反应: {no_reactants}")


if __name__ == '__main__':
    main()
