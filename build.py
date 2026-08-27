#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Собирает единый HTML-файл тренажёра из данных в src/."""
import json, os, re, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(HERE, 'src'))

import verbs as V, vocab as VO, rules as R, items_gap as IG, items_trans as IT, lessons as L, stories as ST, dialogs as DG, themes as TH

UNIT_NAMES = ["Olá! Eu sou a Ana.", "A tua amiga é muito simpática!", "Vamos almoçar?",
              "A vossa casa fica longe?", "Como vai estar o tempo?", "Estás melhor?",
              "Quantos anos fazes?", "Passei férias em Cabo Verde."]

def drop_pronoun(pt):
    """«Eu vou sair.» → «Vou sair.» — допустимый вариант ответа."""
    m = re.match(r'^(Eu|Nós|Tu|Ele|Ela|Eles|Elas)\s+(.+)$', pt)
    if not m: return None
    rest = m.group(2)
    return rest[0].upper() + rest[1:]

def build_data():
    vd = V.build()
    verbs = list(vd.values())
    data = {
        "persons": V.PERSONS,
        "verbs": verbs,
        "ppsIrr": [k for k in V.PPS_IRR],
        "unitNames": UNIT_NAMES,
        "vocab": [{"pt": pt, "art": art, "ru": ru, "unit": u, "theme": t}
                  for pt, art, ru, u, t in VO.VOCAB],
        "rules": [{"id": i, "unit": u, "title": t, "body": b,
                   "ex": [[p, r] for p, r in ex]} for i, u, t, b, ex in R.RULES],
        "gaps": [{"rule": r, "s": s, "a": a, "alts": alts, "unit": u, "hint": h}
                 for r, s, a, alts, u, h in IG.GAPS],
        "mc": [{"rule": r, "s": s, "a": a, "wrong": w, "unit": u, "hint": h}
               for r, s, a, w, u, h in IG.MC],
        "trans": [],
        "verbDrills": [dict(inf=i, obj=o, objRu=oru, ruInf=ri, ruPres=rp,
                            ruPastF=pf, ruPastP=pp, cont=c, unit=u)
                       for i,o,oru,ri,rp,pf,pp,c,u in L.VERB_DRILLS],
        "subjRu": L.SUBJ_RU, "ruFut": L.RU_FUT, "subjPt": L.SUBJ_PT, "futRu": L.FUT_RU,
        "stories": [dict(unit=u, title=t, phrases=[dict(ru=r, pt=p_, alts=a) for r,p_,a in ph])
                    for u,t,ph in ST.STORIES],
        "dialogs": DG.DIALOGS,
        "themes": TH.THEMES,
        "antonyms": TH.ANTONYMS,
    }
    for r, ru, pt, alts, u in IT.TRANS:
        alts = list(alts)
        for cand in [pt] + list(alts):
            d = drop_pronoun(cand)
            if d and d not in alts and d != pt:
                alts.append(d)
        data["trans"].append({"rule": r, "ru": ru, "pt": pt, "alts": alts, "unit": u})
    return data


def validate(data):
    corpus = set(open(os.path.join(HERE, 'src', 'corpus_words.txt'), encoding='utf-8').read().split())
    tok = lambda s: re.findall(r"[a-zà-öø-ÿA-ZÀ-Ö]+", s.lower())
    unknown = set()
    for t in data["trans"]:
        unknown |= {w for w in tok(t["pt"]) if w not in corpus}
    for g in data["gaps"]:
        unknown |= {w for w in tok(g["s"]) if w not in corpus}
    for st in data["stories"]:
        for ph in st["phrases"]:
            unknown |= {w for w in tok(ph["pt"]) if w not in corpus}
    import re as _re
    strip_ph = lambda t: _re.sub(r"\{\w+\.\w+\}", " ", t)
    for d in data["dialogs"]:
        for step in d["steps"]:
            unknown |= {w for w in tok(strip_ph(step["model"])) if w not in corpus}
        for slot in (d.get("slots") or {}).values():
            for v in slot:
                for f, val in v.items():
                    if f in ("pt", "frase", "loc", "lojaPt", "prodPt"):
                        unknown |= {w for w in tok(val) if w not in corpus}
    ids = {r["id"] for r in data["rules"]}
    bad_rule = {x["rule"] for x in data["gaps"] + data["mc"] + data["trans"] if x["rule"] not in ids}
    return unknown, bad_rule


def main():
    data = build_data()
    unknown, bad_rule = validate(data)
    if bad_rule:
        print("!! ссылки на несуществующие правила:", bad_rule)
    js = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    parts = ['template_head.html', 'app.js', 'app2.js', 'app4.js', 'app5.js', 'app3.js']
    out = open(os.path.join(HERE, 'src', parts[0]), encoding='utf-8').read().replace('/*__DATA__*/', js)
    for p in parts[1:]:
        out += open(os.path.join(HERE, 'src', p), encoding='utf-8').read() + "\n"
    out += "</script>\n</body>\n</html>\n"
    dest = os.path.join(HERE, 'index.html')
    open(dest, 'w', encoding='utf-8').write(out)
    n_conj = sum(1 for v in data["verbs"] for t in ('pres', 'estar', 'ir', 'pps')
                 if not (t == 'pps' and not v["pps"]) and not (v.get("impersonal") and t == 'estar'))
    print(f"index.html — {len(out)/1024:.0f} КБ")
    print(f"  глаголов {len(data['verbs'])} → {n_conj} карточек спряжения")
    print(f"  слов {len(data['vocab'])}, правил {len(data['rules'])}")
    print(f"  подстановок {len(data['gaps'])}, выборов {len(data['mc'])}, переводов {len(data['trans'])}")
    print(f"  глаголов дня {len(data['verbDrills'])}, историй {len(data['stories'])}, диалогов {len(data['dialogs'])}")
    if unknown:
        print("  вне корпуса книги (проверьте):", ', '.join(sorted(unknown)))


if __name__ == '__main__':
    main()
