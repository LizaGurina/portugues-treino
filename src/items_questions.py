# -*- coding: utf-8 -*-
"""Вопросительные слова: «Спросите: …» → португальский вопрос.
Формат: (группа, ru, pt, [альтернативы])
Короткая форма и форма с é que принимаются везде."""

QW = [
# --- Люди: quem / de quem / com quem / a quem ---
("pessoas", "Кто та сеньора?", "Quem é aquela senhora?", []),
("pessoas", "Кто твой преподаватель португальского?", "Quem é o teu professor de português?", []),
("pessoas", "Чья это куртка?", "De quem é este casaco?", []),
("pessoas", "Чьи это ключи?", "De quem são estas chaves?", []),
("pessoas", "С кем ты идёшь в кино?", "Com quem vais ao cinema?", ["Com quem é que vais ao cinema?", "Com quem é que tu vais ao cinema?"]),
("pessoas", "С кем она живёт?", "Com quem é que ela mora?", ["Com quem mora ela?", "Com quem ela mora?"]),
("pessoas", "Кому вы вчера звонили? (вы — несколько человек)", "A quem é que vocês telefonaram ontem?", ["A quem telefonaram ontem?", "A quem é que telefonaram ontem?", "A quem é que vocês ligaram ontem?"]),
("pessoas", "Кому вы вчера звонили? (вежливо, к одному)", "A quem é que telefonou ontem?", ["A quem telefonou ontem?", "A quem é que o senhor telefonou ontem?"]),

# --- Что / какой: o que / qual / que ---
("oque", "Чем ты занимаешься? (профессия)", "O que fazes?", ["O que é que fazes?", "O que é que tu fazes?"]),
("oque", "Что ты любишь делать?", "O que gostas de fazer?", ["O que é que gostas de fazer?"]),
("oque", "Что вы будете делать сегодня вечером? (вы — несколько человек)", "O que vão fazer hoje à noite?", ["O que é que vocês vão fazer hoje à noite?", "O que vocês vão fazer hoje à noite?"]),
("oque", "Что это?", "O que é isto?", []),
("oque", "Какая у тебя профессия?", "Qual é a tua profissão?", []),
("oque", "Какой у вас номер телефона? (вежливо, к одному)", "Qual é o seu número de telemóvel?", ["Qual é o seu número de telefone?", "Qual é o número de telemóvel do senhor?", "Qual é o número de telefone do senhor?"]),
("oque", "Который час?", "Que horas são?", []),
("oque", "Какой сегодня день?", "Que dia é hoje?", []),
("oque", "Сколько вам лет? (вежливо)", "Que idade tem?", ["Quantos anos tem?"]),

# --- Место: onde / aonde / de onde / para onde ---
("lugar", "Где ты живёшь?", "Onde moras?", ["Onde é que moras?", "Onde é que tu moras?"]),
("lugar", "Где находится аптека?", "Onde fica a farmácia?", ["Onde é que fica a farmácia?", "Onde é a farmácia?"]),
("lugar", "Где мои очки?", "Onde estão os meus óculos?", ["Onde é que estão os meus óculos?"]),
("lugar", "Куда ты идёшь сегодня вечером?", "Aonde vais hoje à noite?", ["Aonde é que vais hoje à noite?"]),
("lugar", "Куда едет этот автобус?", "Para onde vai este autocarro?", ["Este autocarro vai para onde?"]),
("lugar", "Откуда ты?", "De onde és?", ["De onde é que és?", "De onde é que tu és?"]),
("lugar", "Откуда они?", "De onde são eles?", ["De onde é que eles são?", "De onde eles são?"]),

# --- Время: quando / a que horas / em que ---
("tempo", "Когда приезжает Марта?", "Quando é que a Marta chega?", ["Quando chega a Marta?", "Quando a Marta chega?"]),
("tempo", "Когда ты возвращаешься?", "Quando voltas?", ["Quando é que voltas?", "Quando é que tu voltas?"]),
("tempo", "Во сколько возвращается Марта?", "A que horas é que a Marta volta?", ["A que horas volta a Marta?", "A que horas a Marta volta?"]),
("tempo", "Во сколько начинается урок?", "A que horas começa a aula?", ["A que horas é que começa a aula?"]),
("tempo", "Во сколько отходит поезд?", "A que horas parte o comboio?", ["A que horas é que parte o comboio?"]),
("tempo", "В какой день у тебя экзамен?", "Em que dia é o teu exame?", []),
("tempo", "В каком месяце у тебя день рождения?", "Em que mês fazes anos?", ["Em que mês é que fazes anos?"]),

# --- Количество: quanto / quantos / quanto tempo / há quanto tempo ---
("quanto", "Сколько это стоит?", "Quanto custa?", ["Quanto é?", "Quanto é que custa?"]),
("quanto", "Сколько стоят эти ботинки?", "Quanto custam estas botas?", ["Quanto é que custam estas botas?"]),
("quanto", "Сколько тебе лет?", "Quantos anos tens?", ["Quantos anos é que tens?", "Quantos anos é que tu tens?"]),
("quanto", "На скольких языках она говорит?", "Quantas línguas é que ela fala?", ["Quantas línguas fala ela?", "Quantas línguas ela fala?"]),
("quanto", "Сколько времени это занимает?", "Quanto tempo demora?", ["Quanto tempo é que demora?"]),
("quanto", "Как давно ты живёшь в Португалии?", "Há quanto tempo vives em Portugal?", ["Há quanto tempo é que vives em Portugal?", "Há quanto tempo é que tu vives em Portugal?"]),
("quanto", "Как давно вы работаете в больнице? (вежливо, к одному)", "Há quanto tempo trabalha no hospital?", ["Há quanto tempo é que trabalha no hospital?"]),
("quanto", "Как давно вы работаете в больнице? (вы — несколько человек)", "Há quanto tempo trabalham no hospital?", ["Há quanto tempo é que vocês trabalham no hospital?"]),

# --- Как: como / que tal ---
("como", "Как тебя зовут?", "Como te chamas?", ["Como é que te chamas?", "Como é que tu te chamas?"]),
("como", "Как вас зовут? (вежливо, к одному)", "Como se chama?", ["Como é que se chama?", "Como é que o senhor se chama?", "Como é que a senhora se chama?"]),
("como", "Как ты? (разговорно)", "Que tal estás?", ["Como estás?", "Tudo bem?"]),
("como", "Какая она? (внешность, характер)", "Como é ela?", ["Como é que ela é?"]),
("como", "Как ты добираешься до работы?", "Como vais para o trabalho?", ["Como é que vais para o trabalho?"]),
("como", "Как насчёт кофе?", "Que tal um café?", []),

# --- Почему ---
("porque", "Почему ты не живёшь в Лиссабоне?", "Porque é que não vives em Lisboa?", ["Porque não vives em Lisboa?"]),
("porque", "Почему она не идёт с нами?", "Porque é que ela não vem connosco?", ["Porque ela não vem connosco?", "Porque não vem connosco?"]),
("porque", "Почему ты изучаешь португальский?", "Porque é que estudas português?", ["Porque estudas português?"]),

# --- Да/нет: posso / pode / queres / tens / és / estás ---
("simnao", "Можно открыть окно?", "Posso abrir a janela?", []),
("simnao", "Можете повторить, пожалуйста? (вежливо, к одному)", "Pode repetir, por favor?", ["Podia repetir, por favor?"]),
("simnao", "Не могли бы вы сказать, где вокзал? (вежливо, к одному)", "Podia dizer-me onde fica a estação?", ["Pode dizer-me onde fica a estação?"]),
("simnao", "Хочешь пойти с нами в кино?", "Queres vir ao cinema connosco?", ["Queres ir ao cinema connosco?"]),
("simnao", "У тебя есть братья и сёстры?", "Tens irmãos?", ["Tu tens irmãos?", "Tens irmãos e irmãs?"]),
("simnao", "Ты замужем или нет?", "És casada ou solteira?", ["É casada ou solteira?"]),
("simnao", "Ты устала?", "Estás cansada?", ["Tu estás cansada?"]),
("simnao", "Вы женаты? (вежливо, к одному)", "É casado?", ["O senhor é casado?"]),
]

QW_GROUPS = [
 ("pessoas", "Люди", "quem · de quem · com quem · a quem"),
 ("oque",    "Что / какой", "o que · qual · que idade · que horas"),
 ("lugar",   "Место", "onde · aonde · de onde · para onde"),
 ("tempo",   "Время", "quando · a que horas · em que dia/mês"),
 ("quanto",  "Сколько", "quanto (custa) · quantos · quanto tempo · há quanto tempo"),
 ("como",    "Как", "como · que tal"),
 ("porque",  "Почему", "porque (é que) …"),
 ("simnao",  "Да/нет-вопросы", "posso · pode/podia · queres · tens · és · estás"),
]
