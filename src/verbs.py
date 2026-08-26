# -*- coding: utf-8 -*-
"""Дієслова / Глаголы из Português a Valer 1 (Livro do Aluno + Caderno).
Формы: presente (5 позиций), PPS (5 позиций или None, если время не пройдено с этим глаголом).
Позиции: eu | tu | você/ele/ela | nós | vocês/eles/elas
"""

PERSONS = ["eu", "tu", "você, ele, ela", "nós", "vocês, eles, elas"]

# --- регулярные окончания -------------------------------------------------
END = {
    "ar": {"pres": ["o", "as", "a", "amos", "am"],
           "pps":  ["ei", "aste", "ou", "ámos", "aram"]},
    "er": {"pres": ["o", "es", "e", "emos", "em"],
           "pps":  ["i", "este", "eu", "emos", "eram"]},
    "ir": {"pres": ["o", "es", "e", "imos", "em"],
           "pps":  ["i", "iste", "iu", "imos", "iram"]},
}


def regular(inf):
    stem, ending = inf[:-2], inf[-2:]
    pres = [stem + s for s in END[ending]["pres"]]
    pps = [stem + s for s in END[ending]["pps"]]
    # орфографические изменения в 1 л. ед. ч. PPS
    if ending == "ar":
        if stem.endswith("c"):
            pps[0] = stem[:-1] + "quei"
        elif stem.endswith("g"):
            pps[0] = stem[:-1] + "guei"
        elif stem.endswith("ç"):
            pps[0] = stem[:-1] + "cei"
    return pres, pps


# --- исключения в презенсе -------------------------------------------------
PRES_IRR = {
    "ser":       ["sou", "és", "é", "somos", "são"],
    "estar":     ["estou", "estás", "está", "estamos", "estão"],
    "ter":       ["tenho", "tens", "tem", "temos", "têm"],
    "ir":        ["vou", "vais", "vai", "vamos", "vão"],
    "ver":       ["vejo", "vês", "vê", "vemos", "veem"],
    "ler":       ["leio", "lês", "lê", "lemos", "leem"],
    "ouvir":     ["ouço", "ouves", "ouve", "ouvimos", "ouvem"],
    "sair":      ["saio", "sais", "sai", "saímos", "saem"],
    "vir":       ["venho", "vens", "vem", "vimos", "vêm"],
    "poder":     ["posso", "podes", "pode", "podemos", "podem"],
    "querer":    ["quero", "queres", "quer", "queremos", "querem"],
    "dizer":     ["digo", "dizes", "diz", "dizemos", "dizem"],
    "saber":     ["sei", "sabes", "sabe", "sabemos", "sabem"],
    "dar":       ["dou", "dás", "dá", "damos", "dão"],
    "fazer":     ["faço", "fazes", "faz", "fazemos", "fazem"],
    "trazer":    ["trago", "trazes", "traz", "trazemos", "trazem"],
    "pôr":       ["ponho", "pões", "põe", "pomos", "põem"],
    "pedir":     ["peço", "pedes", "pede", "pedimos", "pedem"],
    "perder":    ["perco", "perdes", "perde", "perdemos", "perdem"],
    "dormir":    ["durmo", "dormes", "dorme", "dormimos", "dormem"],
    "vestir":    ["visto", "vestes", "veste", "vestimos", "vestem"],
    "despir":    ["dispo", "despes", "despe", "despimos", "despem"],
    "preferir":  ["prefiro", "preferes", "prefere", "preferimos", "preferem"],
    "sentir":    ["sinto", "sentes", "sente", "sentimos", "sentem"],
    "repetir":   ["repito", "repetes", "repete", "repetimos", "repetem"],
    "conseguir": ["consigo", "consegues", "consegue", "conseguimos", "conseguem"],
    "divertir":  ["divirto", "divertes", "diverte", "divertimos", "divertem"],
    "subir":     ["subo", "sobes", "sobe", "subimos", "sobem"],
    "conhecer":  ["conheço", "conheces", "conhece", "conhecemos", "conhecem"],
    "adormecer": ["adormeço", "adormeces", "adormece", "adormecemos", "adormecem"],
    "oferecer":  ["ofereço", "ofereces", "oferece", "oferecemos", "oferecem"],
    "esquecer":  ["esqueço", "esqueces", "esquece", "esquecemos", "esquecem"],
    "aquecer":   ["aqueço", "aqueces", "aquece", "aquecemos", "aquecem"],
    "aparecer":  ["apareço", "apareces", "aparece", "aparecemos", "aparecem"],
    "descer":    ["desço", "desces", "desce", "descemos", "descem"],
    "agradecer": ["agradeço", "agradeces", "agradece", "agradecemos", "agradecem"],
    "traduzir":  ["traduzo", "traduzes", "traduz", "traduzimos", "traduzem"],
    "conduzir":  ["conduzo", "conduzes", "conduz", "conduzimos", "conduzem"],
    "fugir":     ["fujo", "foges", "foge", "fugimos", "fogem"],
    "corrigir":  ["corrijo", "corriges", "corrige", "corrigimos", "corrigem"],
}

# --- PPS: только то, что реально пройдено в книге --------------------------
# ir/ser, estar, ter — единственные неправильные в PPS в этом учебнике
PPS_IRR = {
    "ser":   ["fui", "foste", "foi", "fomos", "foram"],
    "ir":    ["fui", "foste", "foi", "fomos", "foram"],
    "estar": ["estive", "estiveste", "esteve", "estivemos", "estiveram"],
    "ter":   ["tive", "tiveste", "teve", "tivemos", "tiveram"],
    "ler":   ["li", "leste", "leu", "lemos", "leram"],
    "ver":   ["vi", "viste", "viu", "vimos", "viram"],
    "dar":   ["dei", "deste", "deu", "demos", "deram"],
    "sair":  ["saí", "saíste", "saiu", "saímos", "saíram"],
    "subir": ["subi", "subiste", "subiu", "subimos", "subiram"],
    "conseguir": ["consegui", "conseguiste", "conseguiu", "conseguimos", "conseguiram"],
    "divertir":  ["diverti", "divertiste", "divertiu", "divertimos", "divertiram"],
}

# глаголы, PPS которых в учебнике A1 НЕ вводится → не тренируем
NO_PPS = {"poder", "querer", "dizer", "saber", "fazer", "trazer", "pôr", "vir",
          "doer", "chover", "nevar", "haver"}

# --- список глаголов: (инфинитив, перевод, юнит, возвратный) ---------------
VERBS = [
    ("ser", "быть (постоянный признак)", 1, False),
    ("ter", "иметь", 1, False),
    ("estar", "быть, находиться (состояние)", 2, False),
    ("morar", "жить, проживать", 1, False),
    ("estudar", "учиться, изучать", 1, False),
    ("trabalhar", "работать", 1, False),
    ("falar", "говорить", 1, False),
    ("chamar", "звать, называть", 1, False),
    ("chamar-se", "зваться, называться", 1, True),
    ("gostar", "нравиться (gostar de)", 1, False),
    ("jogar", "играть (в игру)", 1, False),
    ("viver", "жить", 2, False),
    ("comer", "есть, кушать", 2, False),
    ("escrever", "писать", 2, False),
    ("conhecer", "быть знакомым, знать (кого/что)", 2, False),
    ("beber", "пить", 2, False),
    ("correr", "бегать", 2, False),
    ("entender", "понимать", 2, False),
    ("adormecer", "засыпать", 2, False),
    ("oferecer", "дарить, предлагать", 2, False),
    ("descer", "спускаться", 2, False),
    ("vender", "продавать", 2, False),
    ("aprender", "учить, узнавать", 2, False),
    ("receber", "получать", 2, False),
    ("responder", "отвечать", 2, False),
    ("compreender", "понимать", 2, False),
    ("aquecer", "греть, подогревать", 2, False),
    ("perceber", "понимать, улавливать", 2, False),
    ("aparecer", "появляться, приходить", 2, False),
    ("atender", "отвечать (на звонок), обслуживать", 2, False),
    ("escolher", "выбирать", 2, False),
    ("bater", "стучать", 2, False),
    ("vestir", "надевать", 3, False),
    ("despir", "снимать (одежду)", 3, False),
    ("preferir", "предпочитать", 3, False),
    ("decidir", "решать", 3, False),
    ("partir", "уезжать, отправляться", 3, False),
    ("abrir", "открывать", 3, False),
    ("sentir", "чувствовать", 3, False),
    ("repetir", "повторять", 3, False),
    ("conseguir", "смочь, суметь", 3, False),
    ("permitir", "разрешать", 3, False),
    ("dividir", "делить", 3, False),
    ("cumprir", "выполнять, соблюдать", 3, False),
    ("imprimir", "печатать", 3, False),
    ("resumir", "кратко излагать", 3, False),
    ("assistir", "присутствовать, смотреть (assistir a)", 3, False),
    ("desistir", "отказываться, сходить с дистанции", 3, False),
    ("subir", "подниматься", 3, False),
    ("corrigir", "исправлять", 3, False),
    ("fugir", "убегать", 3, False),
    ("traduzir", "переводить", 3, False),
    ("levantar-se", "вставать", 3, True),
    ("esquecer-se", "забывать (esquecer-se de)", 3, True),
    ("vestir-se", "одеваться", 3, True),
    ("sentar-se", "садиться", 3, True),
    ("lavar-se", "мыться", 3, True),
    ("deitar-se", "ложиться спать", 3, True),
    ("sentir-se", "чувствовать себя", 3, True),
    ("divertir-se", "веселиться", 3, True),
    ("ver", "видеть, смотреть", 3, False),
    ("ler", "читать", 3, False),
    ("ouvir", "слушать, слышать", 3, False),
    ("ir", "идти, ехать", 3, False),
    ("sair", "выходить, гулять", 3, False),
    ("vir", "приходить, приезжать", 4, False),
    ("poder", "мочь (возможность, разрешение)", 4, False),
    ("querer", "хотеть", 4, False),
    ("dizer", "говорить, сказать", 4, False),
    ("saber", "знать (факт), уметь", 4, False),
    ("apanhar", "садиться на транспорт, ловить", 4, False),
    ("virar", "поворачивать", 4, False),
    ("atravessar", "переходить", 4, False),
    ("ficar", "оставаться, находиться", 4, False),
    ("arrumar", "убирать, приводить в порядок", 4, False),
    ("dar", "давать", 5, False),
    ("fazer", "делать", 5, False),
    ("trazer", "приносить", 5, False),
    ("pôr", "класть, ставить", 5, False),
    ("dançar", "танцевать", 5, False),
    ("viajar", "путешествовать", 5, False),
    ("comprar", "покупать", 5, False),
    ("chover", "идти (о дожде)", 5, False),
    ("nevar", "идти (о снеге)", 5, False),
    ("pedir", "просить, заказывать", 6, False),
    ("perder", "терять, опаздывать на", 6, False),
    ("dormir", "спать", 6, False),
    ("tomar", "принимать, пить (напиток)", 6, False),
    ("doer", "болеть (о части тела)", 6, False),
    ("telefonar", "звонить (telefonar a)", 7, False),
    ("emprestar", "одалживать (emprestar a)", 7, False),
    ("entregar", "сдавать, вручать", 7, False),
    ("devolver", "возвращать", 7, False),
    ("contar", "рассказывать", 7, False),
    ("enviar", "отправлять", 7, False),
    ("agradecer", "благодарить (agradecer a)", 7, False),
    ("convidar", "приглашать", 7, False),
    ("mostrar", "показывать", 7, False),
    ("pagar", "платить", 8, False),
    ("cozinhar", "готовить (еду)", 8, False),
    ("estacionar", "парковаться", 8, False),
    ("visitar", "посещать", 8, False),
    ("tirar", "доставать, снимать (фото)", 8, False),
    ("preparar", "готовить, подготавливать", 8, False),
    ("adorar", "обожать", 8, False),
    ("deixar", "оставлять", 8, False),
    ("mudar", "менять, переезжать", 8, False),
    ("esperar", "ждать", 8, False),
    ("entrar", "входить", 8, False),
    ("usar", "использовать, носить", 8, False),
    ("marcar", "назначать, бронировать", 8, False),
    ("reservar", "бронировать", 8, False),
    ("alugar", "арендовать", 8, False),
    ("nadar", "плавать", 8, False),
    ("chegar", "приходить, прибывать", 8, False),
    ("acordar", "просыпаться", 8, False),
    ("olhar", "смотреть (olhar para)", 8, False),
]

# безличные / дефектные глаголы: только 3-е лицо
IMPERSONAL = {
    "chover": {"pres": [None, None, "chove", None, None], "pps": [None, None, "choveu", None, None]},
    "nevar":  {"pres": [None, None, "neva", None, None],  "pps": [None, None, "nevou", None, None]},
    "doer":   {"pres": [None, None, "dói", None, "doem"], "pps": [None, None, "doeu", None, "doeram"]},
}

REFL_PRON = ["me", "te", "se", "nos", "se"]
# энклитика для нас: chamo-me, chamas-te, chama-se, chamamo-nos, chamam-se
def reflexive_forms(base_forms):
    out = []
    for i, f in enumerate(base_forms):
        p = REFL_PRON[i]
        if i == 3 and f.endswith("s"):      # nós: chamamos -> chamamo-nos
            f = f[:-1]
        out.append(f + "-" + p)
    return out


def build():
    data = {}
    for inf, ru, unit, refl in VERBS:
        base = inf[:-3] if refl else inf          # chamar-se -> chamar
        if base in IMPERSONAL:
            data[inf] = {"inf": inf, "ru": ru, "unit": unit, "refl": False,
                         "pres": IMPERSONAL[base]["pres"], "pps": IMPERSONAL[base]["pps"],
                         "irr": True, "impersonal": True}
            continue
        pres_irr = PRES_IRR.get(base)
        if pres_irr:
            pres = list(pres_irr)
        else:
            pres, _ = regular(base)
        if base in PPS_IRR:
            pps = list(PPS_IRR[base])
        elif base in NO_PPS:
            pps = None
        else:
            _, pps = regular(base)
        if refl:
            pres = reflexive_forms(pres)
            pps = reflexive_forms(pps) if pps else None
        data[inf] = {
            "inf": inf, "ru": ru, "unit": unit, "refl": refl,
            "pres": pres, "pps": pps,
            "irr": base in PRES_IRR,
        }
    return data


if __name__ == "__main__":
    import json, sys
    d = build()
    for k, v in d.items():
        f = lambda L: " ".join(x or "-" for x in L) if L else "—"
        print(k, "|", f(v["pres"]), "||", f(v["pps"]))
