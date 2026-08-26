# -*- coding: utf-8 -*-
"""Правила из Português a Valer 1 — объяснения по-русски, примеры из учебника."""

# (id, unit, title, body_ru, examples[(pt, ru)])
RULES = [
("ser_estar", 2, "Ser или estar",
 "<b>ser</b> — постоянный признак: кто это, откуда, кем работает, какой по характеру.<br>"
 "<b>estar</b> — состояние и местонахождение прямо сейчас: где, как себя чувствует, какой в данный момент.",
 [("A Yudith é da Venezuela.", "Юдит из Венесуэлы. (происхождение → ser)"),
  ("A Valentina está sempre alegre.", "Валентина всегда весёлая. (состояние → estar)"),
  ("O António é arquiteto.", "Антониу — архитектор. (профессия → ser)"),
  ("As irmãs da Margarida estão no Algarve.", "Сёстры Маргариды в Алгарве. (место → estar)")]),

("artigos", 1, "Артикли",
 "Определённые: <b>o / a / os / as</b>. Ставятся перед именами людей, названиями стран "
 "и некоторых городов: <i>o Paulo, a Ana, a França, o Porto</i>.<br>"
 "Неопределённые: <b>um / uma / uns / umas</b>.<br>"
 "Перед названиями городов артикля обычно нет: <i>em Lisboa, de Coimbra</i>, но <i>no Porto, no Rio de Janeiro</i>.<br><br>"
 "<b>Первое упоминание → um/uma, дальше → o/a.</b> Когда предмет появляется в рассказе впервые "
 "(новый для слушателя), берём неопределённый артикль; когда возвращаемся к нему — определённый: "
 "<i>A Rita tem <b>um</b> presente. <b>O</b> presente é <b>um</b> livro.</i>",
 [("Eu sou a Teresa.", "Я Тереза."),
  ("A Ana mora num apartamento. O apartamento tem uma varanda.",
   "Ана живёт в (какой-то) квартире. В (этой) квартире есть балкон."),
  ("Precisamos de um mapa.", "Нам нужна карта (какая-нибудь)."),
  ("O Paulo e a Ana são irmãos.", "Паулу и Ана — брат и сестра.")]),

("pres_regulares", 3, "Presente do Indicativo — правильные глаголы",
 "<b>-ar</b>: -o, -as, -a, -amos, -am (falar → falo, falas, fala, falamos, falam)<br>"
 "<b>-er</b>: -o, -es, -e, -emos, -em (comer → como, comes, come, comemos, comem)<br>"
 "<b>-ir</b>: -o, -es, -e, -imos, -em (decidir → decido, decides, decide, decidimos, decidem)<br>"
 "Графические изменения в 1 л. ед. ч.: <i>conhecer → conheço, descer → desço, "
 "vestir → visto, preferir → prefiro, conseguir → consigo, dormir → durmo, pedir → peço, perder → perco</i>.",
 [("Eu vivo em Leiria.", "Я живу в Лейрии."),
  ("Vocês conhecem Portugal?", "Вы знаете Португалию?"),
  ("Ela prefere alimentos sem glúten.", "Она предпочитает еду без глютена.")]),

("reflexos", 3, "Возвратные глаголы и место местоимения",
 "Обычно местоимение стоит <b>после</b> глагола через дефис: <i>chamo-me, levanto-me, veste-se</i>.<br>"
 "В 1 л. мн. ч. -s исчезает: <i>chamamos + nos → chamamo-nos</i>.<br>"
 "Местоимение уходит <b>перед</b> глаголом после: <i>não, nunca, também, só, já, que, onde, "
 "como, porque, todos</i> и в вопросах с вопросительным словом.",
 [("Eu chamo-me Rafaela.", "Меня зовут Рафаэла."),
  ("Eu não me chamo Rafaela.", "Меня не зовут Рафаэла. (отрицание → перед глаголом)"),
  ("Como te chamas?", "Как тебя зовут? (вопросительное слово → перед глаголом)"),
  ("Eu visto-me quando me levanto.", "Я одеваюсь, когда встаю.")]),

("de_em_paises", 1, "Предлоги de и em: страны и города",
 "<b>de</b> + происхождение (с глаголом ser): <i>Nós somos da Argentina.</i><br>"
 "<b>em</b> + место жительства (с глаголом morar): <i>Nós moramos em Portimão.</i><br>"
 "Со странами артикль есть → предлог сливается: <b>de + a = da, de + o = do, em + a = na, em + o = no</b>.<br>"
 "С городами артикля обычно нет: <i>de Braga, em Lisboa</i>. Исключения: <i>no Porto, no Rio de Janeiro</i>.",
 [("A Margarida é de Braga.", "Маргарида из Браги."),
  ("O Sr. Pereira mora na Rússia.", "Сеньор Перейра живёт в России."),
  ("Eu sou de Portugal e moro no Porto.", "Я из Португалии и живу в Порту.")]),

("possessivos", 2, "Притяжательные",
 "Согласуются с <b>предметом</b>, а не с владельцем, и обычно идут с артиклем: "
 "<i>o meu carro, a minha casa, os meus livros, as minhas chaves</i>.<br>"
 "eu → meu/minha · tu → teu/tua · você, ele, ela → seu/sua (или dele/dela) · "
 "nós → nosso/nossa · vocês, eles → vosso/vossa (или deles/delas).",
 [("Emília, esta garrafa de água é tua?", "Эмилия, это твоя бутылка воды?"),
  ("Peter e Elena, têm os vossos cadernos?", "Питер и Елена, у вас есть ваши тетради?"),
  ("A mãe dela é professora.", "Её мама — учительница.")]),

("prep_tempo", 3, "Предлоги времени a, de, em",
 "<b>a</b> — часы, части дня, дни недели как <i>привычка</i>: <i>às 17:00, à noite, à segunda-feira</i><br>"
 "<b>de</b> — часть дня после указания часа: <i>às cinco da tarde</i>; <i>de manhã, de tarde, de noite</i><br>"
 "<b>em</b> — дни недели как <i>разовое событие</i>: <i>no domingo, na sexta-feira</i><br>"
 "Слияния: a+o=ao, a+a=à, a+os=aos, a+as=às · de+o=do, de+a=da · em+o=no, em+a=na",
 [("À sexta-feira à noite, costumo ir ao cinema.", "По пятницам вечером я обычно хожу в кино. (привычка)"),
  ("No domingo, vamos ao Porto?", "В воскресенье поедем в Порту? (разовое)"),
  ("Ele chega às cinco da tarde.", "Он приходит в пять вечера.")]),

("ter_de", 4, "Ter de + инфинитив",
 "Выражает <b>необходимость и обязанность</b>: «должен, надо».<br>"
 "tenho de · tens de · tem de · temos de · têm de + инфинитив.",
 [("Está muito frio. Temos de vestir o casaco.", "Очень холодно. Нам надо надеть куртку."),
  ("Tu tens de comer melhor.", "Тебе нужно лучше питаться."),
  ("Elas têm de apanhar o metro.", "Им надо сесть на метро.")]),

("estar_a", 4, "Estar a + Infinitivo (действие сейчас)",
 "Действие происходит <b>прямо сейчас</b>, в момент речи. Аналог английского present continuous.<br>"
 "Формально это <i>perífrase verbal</i> (глагольная конструкция), а не отдельное время.<br>"
 "estou a · estás a · está a · estamos a · estão a + инфинитив.<br>"
 "У возвратных глаголов местоимение переходит к инфинитиву: <i>estou a levantar-me</i>.",
 [("Eu estou a ler o livro.", "Я сейчас читаю книгу."),
  ("Agora, a Rute está a estudar, porque tem exame amanhã.", "Сейчас Рут занимается, потому что завтра экзамен."),
  ("Tu estás a pentear-te.", "Ты сейчас причёсываешься.")]),

("comparativo", 4, "Сравнительная степень: больше / меньше",
 "<b>mais</b> + прилагательное/наречие + <b>do que</b><br>"
 "<b>menos</b> + прилагательное/наречие + <b>do que</b><br>"
 "Исключения: bom → <b>melhor do que</b> · mau → <b>pior do que</b> · grande → <b>maior do que</b>.",
 [("Eu sou mais alto do que o meu irmão.", "Я выше своего брата."),
  ("Este prato é menos caro do que aquele.", "Это блюдо дешевле того."),
  ("Lisboa é maior do que Coimbra.", "Лиссабон больше Коимбры.")]),

("prep_movimento", 4, "Предлоги движения a, para, por",
 "<b>a</b> — ненадолго, с возвращением: <i>Vou à padaria e volto já.</i><br>"
 "<b>para</b> — надолго или конечный пункт: <i>Vou para a biblioteca. Até logo!</i><br>"
 "<b>por</b> — путь, маршрут: <i>Hoje, vamos pela avenida.</i><br>"
 "por + o = pelo, por + a = pela, por + os = pelos, por + as = pelas",
 [("A Maria vai para Portimão passar férias.", "Мария едет в Портиман на отпуск."),
  ("Eu vou a casa e volto já.", "Я схожу домой и сразу вернусь."),
  ("Hoje, a Rita passa pela casa da avó.", "Сегодня Рита заходит к бабушке.")]),

("transportes", 4, "Транспорт: de или em",
 "<b>de</b> + транспорт вообще, без уточнения: <i>de carro, de autocarro, de avião</i>. "
 "Исключение: <b>ir a pé</b> — идти пешком.<br>"
 "<b>em</b> + конкретный транспорт: <i>no avião da TAP, no carro do meu pai, no elétrico n.º 28</i>.",
 [("O Juan vai de mota para o trabalho.", "Хуан ездит на работу на мотоцикле."),
  ("Nós vamos para os Açores no avião da TAP.", "Мы летим на Азоры самолётом TAP."),
  ("Muitos alunos vão a pé para a escola.", "Многие ученики ходят в школу пешком.")]),

("com_pronome", 4, "Предлог com + местоимение",
 "com + eu → <b>comigo</b> · com + tu → <b>contigo</b> · com + você/о senhor → <b>consigo</b> · "
 "com + nós → <b>connosco</b> · com + vocês/os senhores → <b>convosco</b><br>"
 "С ela/ele/elas/eles ничего не сливается: <i>com ela, com eles</i>.",
 [("Ela vai comigo ao oculista.", "Она идёт со мной к окулисту."),
  ("Carlos, eu vou contigo ao hospital.", "Карлуш, я пойду с тобой в больницу."),
  ("A Bruna estuda convosco?", "Бруна занимается с вами?")]),

("ir_inf", 5, "Ir + Infinitivo (будущее)",
 "Планы и действия в будущем: «собираюсь / буду». Это <i>futuro perifrástico</i> — "
 "глагольная конструкция (perífrase), а не простое будущее время.<br>"
 "vou · vais · vai · vamos · vão + инфинитив.",
 [("Eu vou sair de casa às 9:00.", "Я выйду из дома в 9:00."),
  ("Vocês vão arrendar um apartamento nas férias.", "Вы снимете квартиру на отпуск."),
  ("Amanhã, vai chover.", "Завтра будет дождь.")]),

("saber_conhecer", 5, "Conhecer, saber, conseguir, poder",
 "<b>conhecer</b> — быть знакомым: место, книга, человек.<br>"
 "<b>saber</b> — знать факт; уметь (навык).<br>"
 "<b>conseguir</b> — быть в состоянии, справляться физически.<br>"
 "<b>poder</b> — возможность, разрешение; в отрицании — запрет.",
 [("Eu não conheço o Alentejo.", "Я не знаю (не бывала в) Алентежу."),
  ("Ele sabe cozinhar pratos tailandeses.", "Он умеет готовить тайские блюда."),
  ("Eu não consigo dizer esta palavra.", "У меня не получается произнести это слово."),
  ("Na biblioteca, nós não podemos falar ao telemóvel.", "В библиотеке нельзя говорить по телефону.")]),

("ha_desde", 5, "Há и desde",
 "<b>há</b> + <i>отрезок</i> времени: сколько времени уже длится. <i>há dois anos, há um mês</i><br>"
 "<b>desde</b> + <i>точка отсчёта</i>: с какого момента. <i>desde 2020, desde criança, desde que...</i><br>"
 "Оба употребляются с настоящим временем.",
 [("O Yasir vive em Portugal há dois anos.", "Ясир живёт в Португалии два года."),
  ("O Cristiano está na biblioteca desde o início da tarde.", "Криштиану в библиотеке с начала дня."),
  ("A Olívia faz campismo desde criança.", "Оливия ходит в походы с детства.")]),

("igualdade", 5, "Сравнение равенства: tão / tanto ... como",
 "<b>tão</b> + прилагательное/наречие + <b>como</b><br>"
 "<b>tanto/tanta/tantos/tantas</b> + существительное + <b>como</b> (согласуется с существительным).",
 [("A Francisca é tão alta como a irmã.", "Франсишка такая же высокая, как сестра."),
  ("O Luís tem tantas férias como a minha namorada.", "У Луиша столько же отпуска, сколько у моей девушки."),
  ("Eu bebo tanta água como tu.", "Я пью столько же воды, сколько ты.")]),

("ci_pronome", 5, "Местоимения косвенного дополнения (кому?)",
 "me · te · lhe (você, ela, ele) · nos · vos · lhes<br>"
 "Обычно <b>после</b> глагола через дефис: <i>A Sara dá-lhe o casaco.</i><br>"
 "<b>Перед</b> глаголом — после não, nunca, também, só, já, que, onde и вопросительных слов.",
 [("A Sara dá-lhe o casaco.", "Сара даёт ему куртку."),
  ("O Peter não lhe telefona.", "Питер ей не звонит."),
  ("Nós emprestamos-lhe o caderno.", "Мы одалживаем ему тетрадь.")]),

("prep_pronome", 5, "para, por, sem, de + местоимение",
 "para <b>mim</b> · para <b>ti</b> · para <b>si</b> (você, о senhor) · para ela/ele · para nós · para vocês · para elas/eles.<br>"
 "Так же с <i>por, sem, de</i>: <i>sem mim, por ti, de ti</i>.",
 [("Para ti, qual é a melhor praia portuguesa?", "Какой, по-твоему, лучший португальский пляж?"),
  ("Podes ir ao cinema sem mim.", "Можешь пойти в кино без меня."),
  ("Dr. Pedro, este dossiê é para si.", "Доктор Педру, эта папка для вас.")]),

("em_meses", 5, "Предлог em: месяцы, времена года, праздники",
 "С месяцами — просто <b>em</b>: <i>em junho, em janeiro</i>.<br>"
 "С временами года — <b>с артиклем</b>: <i>na primavera, no verão, no outono, no inverno</i>.<br>"
 "С праздниками — тоже с артиклем: <i>no Natal, na Páscoa, no Ano Novo</i>.",
 [("A Isabel vai fazer uma viagem em junho.", "Изабел поедет в путешествие в июне."),
  ("Na primavera, gosto de passear pelos campos.", "Весной я люблю гулять по полям."),
  ("No Natal, costumamos comer bacalhau.", "На Рождество мы обычно едим треску.")]),

("conectores", 5, "Союзы e, mas, porque, quando",
 "<b>e</b> — добавление · <b>mas</b> — противопоставление · "
 "<b>porque</b> — причина · <b>quando</b> — время.",
 [("A Luísa vive junto ao mar, mas não gosta de peixe.", "Луиза живёт у моря, но не любит рыбу."),
  ("A Mariana está cansada porque trabalha muito.", "Мариана устала, потому что много работает."),
  ("Quando está sol, vamos correr à beira-mar.", "Когда солнечно, мы бегаем у моря.")]),

("imperativo", 6, "Императив: informal (tu) и formal (você)",
 "<b>tu</b>: берём форму 3 л. ед. ч. настоящего времени → <i>ele compra → Compra os medicamentos!</i><br>"
 "<b>você</b>: берём 1 л. ед. ч. и меняем окончание:<br>"
 "-ar → <b>-e</b>: eu procuro → <i>procure</i> · -er → <b>-a</b>: eu como → <i>coma</i> · "
 "-ir → <b>-a</b>: eu visto → <i>vista</i><br>"
 "Глагол pôr идёт по правилу -er: eu ponho → <i>ponha</i>.",
 [("Fátima, procure a ficha do doente no arquivo.", "Фатима, найдите карту пациента в архиве."),
  ("Rita, coma alimentos mais saudáveis.", "Рита, ешьте более здоровую еду."),
  ("Faz este exercício antes de a aula acabar.", "Сделай это упражнение до конца урока.")]),

("para_por", 6, "Para и por",
 "<b>para</b>: цель (<i>para ganhar mais</i>), направление/пункт назначения (<i>vão para Lisboa</i>), "
 "мнение (<i>para nós, é o melhor</i>).<br>"
 "<b>por</b>: причина (<i>por ter alergias</i>), маршрут (<i>passam por Coimbra</i>), "
 "продолжительность (<i>por um mês</i>), приблизительное время (<i>pelas onze</i>).",
 [("Ele trabalha muito para ganhar mais dinheiro.", "Он много работает, чтобы больше зарабатывать."),
  ("A Marta espirra muito por ter alergias.", "Марта часто чихает из-за аллергии."),
  ("Nós devemos chegar ao Porto pelas 20:00.", "Мы должны приехать в Порту около 20:00.")]),

("tao_tanto", 7, "Tão и tanto в восклицаниях",
 "<b>tão</b> + прилагательное или наречие: <i>O Luís é tão tímido!</i><br>"
 "<b>tanto / tanta / tantos / tantas</b> + существительное (согласуется в роде и числе): "
 "<i>tanto açúcar, tanta fome, tantos doces, tantas horas</i>.",
 [("Hoje, tenho tanta fome!", "Сегодня я такая голодная!"),
  ("Tu falas tão baixo!", "Ты говоришь так тихо!"),
  ("A Cátia trabalha tantas horas!", "Катя работает столько часов!")]),

("indefinidos", 7, "Неопределённые местоимения",
 "Изменяемые: algum/alguma/alguns/algumas · nenhum/nenhuma · muito · pouco · todo · outro — "
 "согласуются с существительным.<br>"
 "Неизменяемые: <b>alguém / ninguém</b> (о людях), <b>tudo / nada</b> (о вещах).",
 [("Vês alguém no jardim?", "Ты видишь кого-то в саду?"),
  ("Eu não conheço ninguém na festa.", "Я никого не знаю на вечеринке."),
  ("Vou para Cabo Verde todos os anos.", "Я езжу в Кабо-Верде каждый год.")]),

("marcadores_temp", 7, "antes de, depois de, quando, enquanto",
 "<b>antes de</b> — до (действие раньше) · <b>depois de</b> — после · "
 "<b>quando</b> — в момент действия · <b>enquanto</b> — одновременно, пока.<br>"
 "antes/depois + de сливается с артиклем: <i>antes do Carnaval, depois da aula</i>.",
 [("Antes do Carnaval, as crianças escolhem os disfarces.", "Перед карнавалом дети выбирают костюмы."),
  ("Eu tomo um café depois do almoço.", "Я пью кофе после обеда."),
  ("A Luísa faz os convites enquanto o marido reserva o restaurante.",
   "Луиза делает приглашения, пока муж бронирует ресторан.")]),

("pps_regulares", 8, "Pretérito Perfeito Simples — правильные глаголы",
 "Завершённое действие в прошлом.<br>"
 "<b>-ar</b>: -ei, -aste, -ou, -ámos, -aram (trabalhar → trabalhei, trabalhaste, trabalhou, trabalhámos, trabalharam)<br>"
 "<b>-er</b>: -i, -este, -eu, -emos, -eram (comer → comi, comeste, comeu, comemos, comeram)<br>"
 "<b>-ir</b>: -i, -iste, -iu, -imos, -iram (vestir → vesti, vestiste, vestiu, vestimos, vestiram)<br>"
 "Орфография в 1 л. ед. ч.: <i>ficar → fiquei · pagar → paguei · começar → comecei</i>.",
 [("Eu não trabalhei esta semana.", "Я не работала на этой неделе."),
  ("No domingo passado, nós comemos cachupa.", "В прошлое воскресенье мы ели кашупу."),
  ("Ontem, o Tiago vestiu o casaco.", "Вчера Тиагу надел куртку.")]),

("pps_irregulares", 8, "PPS — неправильные: ir/ser, estar, ter",
 "<b>ir</b> и <b>ser</b> совпадают: fui, foste, foi, fomos, foram<br>"
 "<b>estar</b>: estive, estiveste, esteve, estivemos, estiveram<br>"
 "<b>ter</b>: tive, tiveste, teve, tivemos, tiveram",
 [("No sábado à noite, tu foste ao cinema?", "В субботу вечером ты ходила в кино?"),
  ("Ontem, o empregado foi muito simpático.", "Вчера официант был очень любезен."),
  ("Hoje de manhã, a Annika teve um acidente.", "Сегодня утром у Анники была авария.")]),

("pps_marcadores", 8, "Маркеры прошедшего времени",
 "ontem · na semana passada · no mês passado · no ano passado · em 2020 · "
 "<b>já</b> (уже) · <b>nunca</b> (никогда) · <b>ainda não</b> (ещё не).",
 [("Nós já fomos ao Gerês.", "Мы уже были в Жерес."),
  ("Tu nunca estiveste em minha casa.", "Ты никогда не была у меня дома."),
  ("A Teresa ainda não chegou a Cabo Verde.", "Тереза ещё не приехала в Кабо-Верде.")]),

("lugar", 2, "Выражения места",
 "dentro de · ao lado de · em frente de · atrás de · debaixo de · em cima de · entre<br>"
 "Все с <b>de</b>, а значит сливаются с артиклем: <i>ao lado do estojo, debaixo da mesa</i>.",
 [("O livro está ao lado do estojo.", "Книга рядом с пеналом."),
  ("O sapato está debaixo da mesa.", "Туфля под столом."),
  ("O gato está entre a mesa e a mala.", "Кот между столом и сумкой.")]),

("contracoes", 3, "Слияния предлогов с артиклями",
 "de + o/a/os/as = <b>do, da, dos, das</b><br>"
 "em + o/a/os/as = <b>no, na, nos, nas</b><br>"
 "a + o/a/os/as = <b>ao, à, aos, às</b><br>"
 "por + o/a/os/as = <b>pelo, pela, pelos, pelas</b>",
 [("A Rita é de Lisboa, mas mora em Coimbra.", "Рита из Лиссабона, но живёт в Коимбре."),
  ("Brasília é a capital do Brasil.", "Бразилиа — столица Бразилии."),
  ("O metro passa pela Avenida da Liberdade.", "Метро проходит по Авениде да Либердаде.")]),
]
