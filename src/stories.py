# -*- coding: utf-8 -*-
"""Мини-истории: 3–4 фразы из лексики юнита, собираются пофразно переводом с русского.
Все конструкции и слова — из пройденного материала книги."""

# (unit, заголовок RU, [(ru, pt, [альтернативы])])
STORIES = [
 (1, "Новая коллега", [
   ("Это Элена, она итальянка.", "Esta é a Elena, ela é italiana.", ["Esta é a Elena. Ela é italiana."]),
   ("Она врач и работает в больнице.", "Ela é médica e trabalha no hospital.", []),
   ("Ей 37 лет, и сейчас она живёт в Лиссабоне.", "Ela tem 37 anos e agora mora em Lisboa.", ["Tem 37 anos e agora mora em Lisboa."]),
   ("Она говорит по-итальянски и по-португальски.", "Ela fala italiano e português.", ["Fala italiano e português."]),
 ]),
 (1, "Я и мой сосед", [
   ("Меня зовут Андрей, я из России.", "Eu chamo-me Andrei e sou da Rússia.", ["Chamo-me Andrei e sou da Rússia.", "Eu chamo-me Andrei, sou da Rússia."]),
   ("Я живу в Браге и работаю в школе.", "Eu moro em Braga e trabalho numa escola.", ["Moro em Braga e trabalho numa escola."]),
   ("Мой сосед — механик.", "O meu vizinho é mecânico.", []),
   ("Он из Кабо-Верде.", "Ele é de Cabo Verde.", []),
 ]),
 (2, "Семья Беатриш", [
   ("У Беатриш большая семья.", "A Beatriz tem uma família grande.", []),
   ("Её мама — учительница, а папа — инженер.", "A mãe dela é professora e o pai é engenheiro.", ["A mãe dela é professora e o pai dela é engenheiro."]),
   ("Бабушка и дедушка живут в Вила-Реал.", "Os avós vivem em Vila Real.", ["A avó e o avô vivem em Vila Real."]),
   ("Все они очень приятные.", "Eles são todos muito simpáticos.", ["Todos são muito simpáticos.", "São todos muito simpáticos."]),
 ]),
 (2, "Кот в комнате", [
   ("Кот в рюкзаке.", "O gato está dentro da mochila.", []),
   ("Книга рядом с пеналом.", "O livro está ao lado do estojo.", []),
   ("Компьютер на столе.", "O computador está em cima da mesa.", []),
   ("А туфли — под стулом.", "E os sapatos estão debaixo da cadeira.", ["Os sapatos estão debaixo da cadeira."]),
 ]),
 (3, "Утро Жорже", [
   ("Жорже встаёт в семь часов.", "O Jorge levanta-se às sete horas.", ["O Jorge levanta-se às 7:00."]),
   ("На завтрак он ест хлопья с молоком.", "Ao pequeno-almoço, ele come cereais com leite.", ["Ao pequeno-almoço, come cereais com leite."]),
   ("Он выходит из дома в восемь и садится на метро.", "Ele sai de casa às oito e apanha o metro.", ["Sai de casa às oito e apanha o metro.", "Ele sai de casa às 8:00 e apanha o metro."]),
   ("Вечером он читает книгу и рано ложится.", "À noite, ele lê um livro e deita-se cedo.", ["À noite, lê um livro e deita-se cedo."]),
 ]),
 (3, "В ресторане", [
   ("Мы обедаем на террасе.", "Nós almoçamos na esplanada.", ["Almoçamos na esplanada."]),
   ("Я предпочитаю рыбу, а Паулу ест курицу.", "Eu prefiro peixe e o Paulo come frango.", []),
   ("Мы пьём апельсиновый сок.", "Nós bebemos sumo de laranja.", ["Bebemos sumo de laranja."]),
   ("На десерт мы заказываем два паштела де ната.", "Para sobremesa, pedimos dois pastéis de nata.", ["De sobremesa, pedimos dois pastéis de nata."]),
 ]),
 (4, "Наша квартира", [
   ("Мы живём в квартире в центре города.", "Nós moramos num apartamento no centro da cidade.", ["Moramos num apartamento no centro da cidade."]),
   ("В квартире две комнаты, кухня и балкон.", "O apartamento tem dois quartos, uma cozinha e uma varanda.", []),
   ("Рядом с домом есть булочная и аптека.", "Ao lado do prédio, há uma padaria e uma farmácia.", ["Perto do prédio, há uma padaria e uma farmácia."]),
   ("Супермаркет далеко, поэтому мы ездим на машине.", "O supermercado fica longe, por isso vamos de carro.", ["O supermercado é longe, por isso vamos de carro."]),
 ]),
 (4, "Дорога на работу", [
   ("Грег ездит на работу на метро.", "O Greg vai para o trabalho de metro.", []),
   ("Сегодня метро не работает.", "Hoje, o metro não funciona.", []),
   ("Поэтому ему надо сесть на автобус.", "Por isso, ele tem de apanhar o autocarro.", ["Por isso, tem de apanhar o autocarro."]),
   ("Автобус проходит по центральному проспекту.", "O autocarro passa pela avenida central.", ["O autocarro passa pela Avenida Central."]),
 ]),
 (5, "Планы на выходные", [
   ("В субботу будет солнечно.", "No sábado, vai estar sol.", []),
   ("Мы устроим пикник на пляже.", "Nós vamos fazer um piquenique na praia.", ["Vamos fazer um piquenique na praia."]),
   ("Я принесу бутерброды и фрукты.", "Eu vou trazer sandes e fruta.", ["Vou trazer sandes e fruta."]),
   ("Вечером мы посмотрим фильм дома.", "À noite, vamos ver um filme em casa.", []),
 ]),
 (5, "Зимой", [
   ("Зимой в Португалии идёт дождь.", "No inverno, chove em Portugal.", []),
   ("Я надеваю пальто и шарф.", "Eu visto o casaco e ponho o cachecol.", ["Visto o casaco e ponho o cachecol."]),
   ("На Серра-да-Эштрела может идти снег.", "Na Serra da Estrela, pode nevar.", []),
   ("Поэтому мы приносим тёплую одежду.", "Por isso, trazemos roupa quente.", ["Por isso, nós trazemos roupa quente."]),
 ]),
 (6, "Педру болен", [
   ("Педру чувствует себя плохо.", "O Pedro sente-se mal.", []),
   ("У него болит голова, и у него кашель.", "Dói-lhe a cabeça e tem tosse.", ["Dói-lhe a cabeça e ele tem tosse."]),
   ("Он принимает обезболивающее и пьёт чай.", "Ele toma um analgésico e bebe chá.", ["Toma um analgésico e bebe chá."]),
   ("Сегодня ему надо спать больше.", "Hoje, ele tem de dormir mais.", ["Hoje, tem de dormir mais."]),
 ]),
 (7, "День рождения", [
   ("В субботу у Риты день рождения.", "No sábado, é o aniversário da Rita.", []),
   ("Она приглашает всех друзей.", "Ela convida todos os amigos.", ["Convida todos os amigos."]),
   ("Мы дарим ей книгу и цветы.", "Nós oferecemos-lhe um livro e flores.", ["Oferecemos-lhe um livro e flores."]),
   ("На столе столько сладостей!", "Há tantos doces em cima da mesa!", ["Em cima da mesa, há tantos doces!"]),
 ]),
 (8, "Отпуск в Кабо-Верде", [
   ("В прошлом году я провела отпуск в Кабо-Верде.", "No ano passado, passei férias em Cabo Verde.", ["No ano passado, eu passei férias em Cabo Verde."]),
   ("Я плавала каждый день и посетила рынок.", "Nadei todos os dias e visitei o mercado.", ["Eu nadei todos os dias e visitei o mercado."]),
   ("Мы остановились в отеле в центре города.", "Ficámos num hotel no centro da cidade.", ["Nós ficámos num hotel no centro da cidade."]),
   ("Отпуск был замечательный!", "As férias foram fantásticas!", ["As férias foram muito boas!"]),
 ]),
 (8, "Вчерашний день", [
   ("Вчера я встала в восемь.", "Ontem, levantei-me às oito.", ["Ontem, eu levantei-me às oito.", "Ontem, levantei-me às 8:00."]),
   ("Утром я работала в библиотеке.", "De manhã, trabalhei na biblioteca.", ["De manhã, eu trabalhei na biblioteca."]),
   ("Потом я пообедала с Аной в ресторане.", "Depois, almocei com a Ana num restaurante.", ["Depois, eu almocei com a Ana num restaurante."]),
   ("Вечером мы сходили в кино.", "À noite, fomos ao cinema.", ["À noite, nós fomos ao cinema."]),
 ]),
 (4, "Квартира Аны · um → o", [
   ("Ана живёт в квартире в Лиссабоне.", "A Ana mora num apartamento em Lisboa.", []),
   ("В квартире есть кухня и балкон.", "O apartamento tem uma cozinha e uma varanda.", []),
   ("Кухня маленькая, но балкон большой.", "A cozinha é pequena, mas a varanda é grande.", []),
   ("Утром Ана пьёт кофе на балконе.", "De manhã, a Ana bebe café na varanda.", ["De manhã, a Ana bebe um café na varanda."]),
 ]),
 (7, "Подарок · um → o", [
   ("У Риты есть подарок для подруги.", "A Rita tem um presente para a amiga.", []),
   ("Подарок — это книга.", "O presente é um livro.", []),
   ("Книга очень интересная.", "O livro é muito interessante.", []),
   ("Подруга обожает книгу!", "A amiga adora o livro!", []),
 ]),
 (3, "Обед · um → o", [
   ("Я заказываю суп и стакан вина.", "Eu peço uma sopa e um copo de vinho.", ["Peço uma sopa e um copo de vinho."]),
   ("Суп очень горячий.", "A sopa está muito quente.", []),
   ("Вино белое и холодное.", "O vinho é branco e está frio.", ["O vinho é branco e frio."]),
   ("Официант приносит счёт.", "O empregado traz a conta.", []),
 ]),
 (1, "Теннисист из России", [
   ("Его зовут Андрей Денисов.", "O nome dele é Andrei Denisov.", ["Ele chama-se Andrei Denisov."]),
   ("Он из России, и ему 53 года.", "Ele é da Rússia e tem 53 anos.", []),
   ("Он теннисист.", "Ele é tenista.", ["É tenista."]),
   ("Сейчас он живёт в Браге.", "Agora, ele mora em Braga.", ["Agora, mora em Braga."]),
 ]),
 (2, "Лифт не работает", [
   ("Лифт не работает.", "O elevador não funciona.", []),
   ("Поэтому сеньор Перейра спускается по лестнице пешком.", "Por isso, o Sr. Pereira desce as escadas a pé.", []),
   ("Он живёт на четвёртом этаже.", "Ele mora no quarto andar.", ["Mora no quarto andar."]),
   ("Вечером его дети засыпают до девяти.", "À noite, os filhos dele adormecem antes das nove.", ["À noite, os seus filhos adormecem antes das nove."]),
 ]),
 (3, "Счёт на троих", [
   ("Мы ужинаем в ресторане втроём.", "Nós jantamos num restaurante os três.", ["Jantamos num restaurante os três."]),
   ("Официант приносит счёт.", "O empregado traz a conta.", []),
   ("Я делю счёт на троих.", "Eu divido a conta pelos três.", ["Divido a conta pelos três."]),
   ("По десять евро с каждого.", "São dez euros a cada um.", []),
 ]),
 (4, "Дорога в кино", [
   ("Где находится кинотеатр?", "Onde fica o cinema?", []),
   ("Поверни на следующей улице налево.", "Vira na próxima rua à esquerda.", []),
   ("Потом — на первой направо.", "Depois, na primeira à direita.", ["Depois, vira na primeira à direita."]),
   ("Это близко: пять минут пешком.", "É perto: são cinco minutos a pé.", ["É perto. São cinco minutos a pé."]),
 ]),
 (5, "Спортсменка", [
   ("Атлетка занимается плаванием больше десяти лет.", "A atleta pratica natação há mais de dez anos.", []),
   ("Она играет в теннис шесть месяцев.", "Ela joga ténis há seis meses.", ["Joga ténis há seis meses."]),
   ("Она бегает каждый день, когда хорошая погода.", "Ela corre todos os dias quando está bom tempo.", ["Corre todos os dias quando está bom tempo."]),
   ("Зимой она предпочитает заниматься дома.", "No inverno, ela prefere fazer exercício em casa.", ["No inverno, prefere fazer exercício em casa."]),
 ]),
 (6, "На приёме у доктора Сары", [
   ("Педру всегда усталый, но никогда не занимается спортом.", "O Pedro está sempre cansado, mas nunca faz exercício físico.", []),
   ("У него бессонница почти каждый день.", "Ele tem insónias quase todos os dias.", ["Tem insónias quase todos os dias."]),
   ("У него часто болит голова, и он принимает обезболивающее.", "Dói-lhe a cabeça frequentemente e ele toma um analgésico.", []),
   ("Доктор Сара говорит: лучше сделать анализы.", "A Dra. Sara diz: é melhor fazer análises.", ["A doutora diz que é melhor fazer análises."]),
 ]),
 (7, "Рождество", [
   ("На Рождество мы обычно едим треску.", "No Natal, costumamos comer bacalhau.", []),
   ("На столе также есть болу-рей.", "Em cima da mesa, também há bolo-rei.", ["Também há bolo-rei em cima da mesa."]),
   ("Дети открывают подарки в полночь.", "As crianças abrem os presentes à meia-noite.", []),
   ("Вся семья вместе, и все очень довольные.", "A família está toda junta e todos estão muito contentes.", ["Toda a família está junta e todos estão contentes."]),
 ]),
 (8, "Путешествие Саймона", [
   ("Саймон проснулся в семь часов и принял душ.", "O Simon acordou às sete horas e tomou banho.", []),
   ("Потом он собрал чемодан и вызвал такси.", "Depois, preparou a mala e chamou um táxi.", ["Depois, ele preparou a mala e chamou um táxi."]),
   ("В аэропорту он стоял в очереди на регистрацию.", "No aeroporto, esteve na fila para fazer o check-in.", ["No aeroporto, ele esteve na fila para o check-in."]),
   ("Когда он прилетел, он арендовал машину и приехал в отель в два часа.",
    "Quando chegou, alugou um carro e chegou ao hotel às duas.", ["Quando chegou, ele alugou um carro e chegou ao hotel às duas horas."]),
 ]),
]