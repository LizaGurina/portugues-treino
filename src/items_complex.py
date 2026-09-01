# -*- coding: utf-8 -*-
"""Сложные предложения: перевод RU→PT по конструкциям учебника.
Формат: (группа, ru, pt, [альтернативы], правило)"""

COMPLEX = [
# --- 1. Сравнение: mais / menos / melhor / pior / maior ---
("comp", "Эта книга лучше той.", "Este livro é melhor do que aquele.", [], "comparativo"),
("comp", "Португальские машины лучше китайских.", "Os carros portugueses são melhores do que os chineses.", [], "comparativo"),
("comp", "Твой сад больше моего.", "O teu jardim é maior do que o meu.", [], "comparativo"),
("comp", "Мой дом меньше твоего.", "A minha casa é mais pequena do que a tua.", ["A minha casa é menor do que a tua."], "comparativo"),
("comp", "Метро быстрее автобуса.", "O metro é mais rápido do que o autocarro.", [], "comparativo"),
("comp", "В Порту холоднее, чем в Лиссабоне.", "Faz mais frio no Porto do que em Lisboa.", ["No Porto, faz mais frio do que em Lisboa."], "comparativo"),
("comp", "Красное вино дороже белого.", "O vinho tinto é mais caro do que o branco.", [], "comparativo"),
("comp", "Твои фотографии красивее моих.", "As tuas fotografias são mais bonitas do que as minhas.", [], "comparativo"),
("comp", "Этот фильм хуже книги.", "Este filme é pior do que o livro.", [], "comparativo"),
("comp", "Ездить на велосипеде полезнее, чем на машине.", "Andar de bicicleta é mais saudável do que andar de carro.", [], "comparativo"),

# --- 2. Восклицания tão / tanto(a/os/as) ---
("excl", "У меня так мало времени!", "Tenho tão pouco tempo!", ["Eu tenho tão pouco tempo!"], "tao_tanto"),
("excl", "Она такая маленькая!", "Ela é tão pequena!", [], "tao_tanto"),
("excl", "Ты пьёшь столько кофе!", "Tu bebes tanto café!", ["Bebes tanto café!"], "tao_tanto"),
("excl", "У них столько книг!", "Eles têm tantos livros!", ["Têm tantos livros!"], "tao_tanto"),
("excl", "Сегодня так жарко!", "Hoje faz tanto calor!", ["Faz tanto calor hoje!", "Hoje está tanto calor!"], "tao_tanto"),
("excl", "Она работает столько часов!", "Ela trabalha tantas horas!", [], "tao_tanto"),
("excl", "Этот суп такой горячий!", "Esta sopa está tão quente!", [], "tao_tanto"),
("excl", "Вы говорите так быстро!", "Vocês falam tão depressa!", ["Falam tão depressa!"], "tao_tanto"),
("excl", "Здесь столько людей!", "Há tantas pessoas aqui!", ["Aqui há tantas pessoas!"], "tao_tanto"),

# --- 3. Равенство: tão … como / tanto … como ---
("igual", "Она такая же красивая, как и умная.", "Ela é tão bonita como inteligente.", [], "igualdade"),
("igual", "Мой брат такой же высокий, как отец.", "O meu irmão é tão alto como o pai.", [], "igualdade"),
("igual", "У меня столько же работы, сколько у тебя.", "Tenho tanto trabalho como tu.", ["Eu tenho tanto trabalho como tu."], "igualdade"),
("igual", "Коимбра такая же красивая, как Порту.", "Coimbra é tão bonita como o Porto.", [], "igualdade"),
("igual", "Она говорит по-португальски так же хорошо, как ты.", "Ela fala português tão bem como tu.", [], "igualdade"),
("igual", "У нас столько же каникул, сколько у них.", "Temos tantas férias como eles.", ["Nós temos tantas férias como eles."], "igualdade"),
("igual", "Этот фильм такой же интересный, как книга.", "Este filme é tão interessante como o livro.", [], "igualdade"),
("igual", "Я пью столько же воды, сколько ты.", "Bebo tanta água como tu.", ["Eu bebo tanta água como tu."], "igualdade"),

# --- 4. Indefinidos: alguém / ninguém / nada / tudo / algum / nenhum … ---
("indef", "Кто-то стучит в дверь.", "Alguém bate à porta.", [], "indefinidos"),
("indef", "Никто не хочет выходить.", "Ninguém quer sair.", [], "indefinidos"),
("indef", "Я ничего не знаю.", "Não sei nada.", ["Eu não sei nada."], "indefinidos"),
("indef", "Здесь всё очень дорого.", "Aqui é tudo muito caro.", ["Aqui está tudo muito caro.", "Tudo é muito caro aqui."], "indefinidos"),
("indef", "У тебя есть какая-нибудь ручка?", "Tens alguma caneta?", ["Tu tens alguma caneta?"], "indefinidos"),
("indef", "У меня нет ни одной книги.", "Não tenho nenhum livro.", ["Eu não tenho nenhum livro."], "indefinidos"),
("indef", "Некоторые ученики уже говорят по-португальски.", "Alguns alunos já falam português.", [], "indefinidos"),
("indef", "В комнате никого нет.", "Não está ninguém na sala.", ["Ninguém está na sala."], "indefinidos"),
("indef", "Хочешь что-нибудь выпить?", "Queres beber alguma coisa?", [], "indefinidos"),
("indef", "Я никого не знаю в этом городе.", "Não conheço ninguém nesta cidade.", ["Eu não conheço ninguém nesta cidade."], "indefinidos"),

# --- 5. Há … que / desde ---
("tempo", "Я живу в Португалии четыре года.", "Vivo em Portugal há quatro anos.", ["Eu vivo em Portugal há quatro anos.", "Há quatro anos que vivo em Portugal."], "ha_desde"),
("tempo", "Уже четыре года, как я живу в Португалии.", "Há quatro anos que vivo em Portugal.", ["Há quatro anos que eu vivo em Portugal."], "ha_desde"),
("tempo", "Я живу в Португалии с 2022 года.", "Vivo em Portugal desde 2022.", ["Eu vivo em Portugal desde 2022."], "ha_desde"),
("tempo", "Она изучает португальский три месяца.", "Ela estuda português há três meses.", ["Há três meses que ela estuda português."], "ha_desde"),
("tempo", "Я знаю Педру с университета.", "Conheço o Pedro desde a universidade.", ["Eu conheço o Pedro desde a universidade."], "ha_desde"),
("tempo", "Мы ждём автобус уже час.", "Esperamos o autocarro há uma hora.", ["Há uma hora que esperamos o autocarro."], "ha_desde"),
("tempo", "Он работает здесь с января.", "Ele trabalha aqui desde janeiro.", [], "ha_desde"),
("tempo", "Уже много лет, как они живут у моря.", "Há muitos anos que vivem junto ao mar.", ["Eles vivem junto ao mar há muitos anos."], "ha_desde"),

# --- 6. Союзы и время: quando / enquanto / porque / por isso / antes de / depois de ---
("conj", "Когда она дома, она читает.", "Quando está em casa, ela lê.", ["Quando ela está em casa, lê.", "Quando ela está em casa, ela lê."], "conectores"),
("conj", "Пока ты готовишь ужин, я накрываю на стол.", "Enquanto tu preparas o jantar, eu ponho a mesa.", ["Enquanto preparas o jantar, ponho a mesa."], "marcadores_temp"),
("conj", "Я устала, поэтому иду домой.", "Estou cansada, por isso vou para casa.", [], "conectores"),
("conj", "Мы не идём на пляж, потому что идёт дождь.", "Não vamos à praia porque está a chover.", [], "conectores"),
("conj", "Перед сном я читаю.", "Antes de dormir, leio.", ["Antes de dormir, eu leio.", "Leio antes de dormir."], "marcadores_temp"),
("conj", "После обеда мы гуляем.", "Depois do almoço, damos um passeio.", ["Depois de almoçar, damos um passeio."], "marcadores_temp"),
("conj", "Когда жарко, мы идём на пляж.", "Quando está calor, vamos à praia.", ["Quando faz calor, vamos à praia."], "conectores"),
("conj", "Я звоню маме, когда прихожу домой.", "Telefono à mãe quando chego a casa.", ["Eu telefono à mãe quando chego a casa."], "conectores"),

# --- 7. Вопросы с é que ---
("eque", "Где ты живёшь?", "Onde é que moras?", ["Onde é que tu moras?", "Onde moras?"], "e_que"),
("eque", "Как тебя зовут?", "Como é que te chamas?", ["Como te chamas?"], "e_que"),
("eque", "Во сколько начинается урок?", "A que horas é que começa a aula?", ["A que horas começa a aula?"], "e_que"),
("eque", "Почему ты не идёшь с нами?", "Porque é que não vens connosco?", ["Porque não vens connosco?"], "e_que"),
("eque", "Что вы будете делать в выходные? (вы — несколько человек)", "O que é que vocês vão fazer no fim de semana?", ["O que vão fazer no fim de semana?"], "e_que"),
("eque", "Откуда она?", "De onde é que ela é?", ["De onde é ela?", "De onde ela é?"], "e_que"),
]

GROUPS = [
 ("comp",  "Сравнение", "melhor · pior · maior · mais/menos … do que"),
 ("excl",  "Восклицания", "tão · tanto / tanta / tantos / tantas"),
 ("igual", "Равенство", "tão … como · tanto … como"),
 ("indef", "Неопределённые", "alguém · ninguém · nada · tudo · algum · nenhum"),
 ("tempo", "Há … que / desde", "Há 4 anos que vivo… · vivo… desde 2022"),
 ("conj",  "Союзы и время", "quando · enquanto · porque · por isso · antes/depois de"),
 ("eque",  "Вопросы с é que", "Onde é que moras? · Porque é que…?"),
]
