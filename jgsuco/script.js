/* JOGO DA FORCA - estado em "state"; toda ação altera o state e chama render(). */
/* IDEIA CENTRAL: o jogo guarda tudo numa variável (state). Quando algo acontece
   (clique, tecla), o código atualiza o state e depois chama render(), que redesenha
   a tela a partir do state. Assim a tela sempre reflete os dados. */
   (function () {
    /* Esta função se executa sozinha (IIFE: "Immediately Invoked Function Expression").
       Tudo o que for declarado aqui dentro fica PRIVADO: não "vaza" para o resto da página. */
    'use strict';
    /* Modo estrito: o JS avisa de erros comuns (como usar variável sem declarar). */
    var MAX_ERRORS = 6;
    var HINT_MAX = 5;
    /* Número máximo de erros permitidos (cabeça, corpo, 2 braços, 2 pernas = 6 partes). */
  
    /* Banco de palavras por categoria: [palavra, dica 1 (vaga), dica 2 (clara)].
       Para criar uma categoria nova, basta adicionar um bloco aqui. */
    var CATS = [
      /* CATS é uma lista (array) de categorias. Cada categoria é um objeto com:
         id = identificador interno, n = nome exibido, i = emoji, w = lista de palavras.
         Cada palavra é outra lista: [PALAVRA, dica vaga, dica clara]. */
      { id: 'animais', n: 'Animais', i: '🐘', w: [
        ['ELEFANTE', 'É o maior mamífero que anda em terra firme', 'Tem presas de marfim e uma tromba longa'],
        ['BORBOLETA', 'Antes de ser assim, passou por um casulo', 'Inseto de asas coloridas que visita flores'],
        ['GIRAFA', 'Tem o pescoço mais longo do reino animal', 'Vive na savana e come folhas de árvores altas'],
        ['TARTARUGA', 'Carrega a própria casa nas costas', 'Réptil de casco duro e passos lentos'],
        ['GOLFINHO', 'Mamífero marinho muito inteligente', 'Salta sobre as ondas e se comunica por assobios'],
        ['CACHORRO', 'É um dos animais domésticos mais comuns', 'Late, tem quatro patas e costuma viver com pessoas'],
        ['LAGARTIXA', 'Pequeno réptil que pode aparecer em paredes', 'Tem quatro patas e é conhecida por se mover rapidamente'],
        ['HIPOPOTAMO', 'Passa bastante tempo na água', 'Grande mamífero africano de boca enorme'],
        ['ORNITORRINCO', 'Parece juntar características de vários animais', 'Mamífero australiano que põe ovos'],
        ['AXOLOTE', 'Mantém características juvenis mesmo adulto', 'Salamandra aquática mexicana capaz de regenerar partes do corpo'],
        ['CAMALEAO', 'Pode mudar de cor e mover os olhos separadamente', 'Réptil conhecido pela língua longa e pelos pés adaptados a galhos'],
        ['ORNITORRINCO', 'Parece juntar características de vários animais', 'Mamífero australiano que põe ovos'] ] },
      /* Fim da categoria Animais. Observe: a palavra vem em MAIÚSCULAS e pode ter acento. */
      { id: 'comidas', n: 'Comidas', i: '🍫', w: [
        ['ABACAXI', 'Usa uma coroa de folhas pontiagudas', 'Casca áspera, polpa amarela e ácida'],
        ['CHOCOLATE', 'Nasce de uma semente tropical', 'Doce que derrete na boca, feito de cacau'],
        ['MORANGO', 'Pequena fruta vermelha cheia de sementinhas por fora', 'Combina com creme e chantilly'],
        ['MACARRÃO', 'Prato favorito de domingo na casa de muita gente', 'Massa de trigo servida com molho'],
        ['PIPOCA', 'Estoura quando esquenta', 'Petisco de cinema feito de milho'],
        ['BANANA', 'Fruta amarela muito comum', 'Pode ser comida pura ou em vitaminas'],
        ['LASANHA', 'É montada em camadas', 'Massa com molho e recheio assada no forno'],
        ['HAMBURGUER', 'É muito comum em lanchonetes', 'Pão recheado com carne ou outros ingredientes'],
        ['BRIGADEIRO', 'É presença certa em festas', 'Doce brasileiro feito tradicionalmente com leite condensado e chocolate'],
        ['RATATOUILLE', 'Prato francês feito com legumes cozidos', 'Receita provençal que combina berinjela, abobrinha, tomate e pimentão'],
        ['CARBONARA', 'Receita italiana que leva ovo e queijo', 'Molho clássico de massa preparado tradicionalmente com guanciale e pecorino'],
        ['GUACAMOLE', 'Acompanha nachos e tacos', 'Preparação mexicana cremosa feita principalmente com abacate'],
        ['CROISSANT', 'É comum em cafés franceses', 'Pão folhado em formato de meia-lua'] ] },
      /* Categoria Comidas. */
      { id: 'lugares', n: 'Países e cidades', i: '🌍', w: [
        ['BRASIL', 'Tem a maior parte da Floresta Amazônica', 'País sul-americano cuja língua oficial é o português'],
        ['PORTUGAL', 'Sua capital é Lisboa e sua língua é o português', 'País europeu ligado historicamente à navegação'],
        ['ARGENTINA', 'É famosa pelo tango e pela região da Patagônia', 'País vizinho do Brasil cuja capital é Buenos Aires'],
        ['ISLANDIA', 'Tem vulcões, gêiseres e auroras boreais', 'País insular do Atlântico Norte, perto do Círculo Polar Ártico'],
        ['SINGAPURA', 'É uma cidade-Estado do Sudeste Asiático', 'País conhecido por seu porto, arranha-céus e jardins futuristas'],
        ['REYKJAVIK', 'Seu nome é associado a “baía fumegante”', 'Capital da Islândia'],
        ['BUENOSAIRES', 'É conhecida pelo tango e por bairros como La Boca', 'Capital da Argentina, às margens do Rio da Prata'],
        ['JOANESBURGO', 'É uma das maiores cidades da África do Sul', 'Cidade sul-africana ligada à história do ouro e ao apartheid'],
        ['KUALALUMPUR', 'Suas torres Petronas são um marco famoso', 'Capital da Malásia'],
        ['SANFRANCISCO', 'Tem bondes históricos e a ponte Golden Gate', 'Cidade da Califórnia conhecida por suas colinas e baía'],
        ['ANTANANARIVO', 'Fica na ilha de Madagascar', 'Capital de Madagascar, situada em uma região montanhosa'],
        ['LIECHTENSTEIN', 'É um pequeno principado entre a Suíça e a Áustria', 'País alpino cuja capital é Vaduz'],
        ['MADAGASCAR', 'Abriga lêmures que não existem naturalmente em outros lugares', 'Grande ilha africana no Oceano Índico'],
        ['VLADIVOSTOK', 'Fica no extremo leste da Rússia, perto do Pacífico', 'Cidade portuária russa próxima às fronteiras com China e Coreia do Norte'],
        ['QUIRGUISTAO', 'Seu território é dominado por montanhas da Ásia Central', 'País cuja capital é Bisqueque'] ] },
      /* Categoria Lugares. */
      { id: 'objetos', n: 'Objetos', i: '🔑', w: [
        ['GUARDA-CHUVA', 'Aparece quando o tempo fecha', 'Abre-se sobre a cabeça para proteger da água'],
        ['RELÓGIO', 'Anda sem parar, mas nunca sai do lugar', 'Seus ponteiros marcam as horas'],
        ['ESPELHO', 'Mostra tudo, mas só o que está à frente', 'Superfície que reflete a sua imagem'],
        ['TESOURA', 'Tem duas lâminas que trabalham juntas', 'Serve para cortar papel e tecido'],
        ['MOCHILA', 'A gente leva objetos dentro dela', 'Bolsa usada nas costas para transportar materiais'],
        ['CADERNO', 'Tem páginas para anotar coisas', 'Material usado para escrever e organizar informações'],
        ['TELESCOPIO', 'É usado para observar o céu', 'Instrumento que amplia objetos muito distantes'],
        ['CALCULADORA', 'Ajuda a resolver contas', 'Dispositivo que realiza operações matemáticas'],
        ['MICROSCOPIO', 'Revela detalhes invisíveis a olho nu', 'Instrumento óptico que amplia estruturas muito pequenas'],
        ['PARALELEPIPEDO', 'É um sólido geométrico com seis faces em forma de paralelogramo', 'Forma tridimensional parecida com uma caixa retangular'],
        ['TERMOMETRO', 'Ajuda a acompanhar febre e clima', 'Instrumento usado para medir temperatura'] ] },
      /* Categoria Objetos. "GUARDA-CHUVA" tem hífen: o código trata como caractere que não é letra. */
      { id: 'tecnologia', n: 'Tecnologia', i: '💻', w: [
        ['TECLADO', 'Tem mais de uma centena de teclas', 'Periférico em que se digita'],
        ['JAVASCRIPT', 'Roda dentro do navegador', 'Linguagem que dá comportamento às páginas web'],
        ['COMPUTADOR', 'Processa dados em silêncio', 'Máquina com tela, teclado e processador'],
        ['CELULAR', 'Cabe no bolso e vive na mão', 'Aparelho de ligações, mensagens e aplicativos'],
        ['MOUSE', 'Fica ao lado do teclado', 'Dispositivo usado para apontar e clicar'],
        ['INTERNET', 'Conecta pessoas e dispositivos', 'Rede mundial usada para acessar sites e serviços'],
        ['ROBOTICA', 'Mistura tecnologia, programação e máquinas', 'Área que trabalha com criação e controle de robôs'],
        ['INTELIGENCIA', 'É uma palavra comum em tecnologia e comportamento', 'Capacidade de aprender, compreender ou resolver problemas'],
        ['CRIPTOGRAFIA', 'Protege mensagens transformando-as em códigos', 'Técnica de segurança da informação que restringe a leitura de dados'],
        ['CIBERSEGURANCA', 'Combate invasões e roubo de dados', 'Práticas para proteger sistemas, redes e informações digitais'],
        ['PROCESSADOR', 'É conhecido como o cérebro do computador', 'Componente que executa instruções e cálculos'] ] },
      /* Categoria Tecnologia. */
      { id: 'natureza', n: 'Natureza', i: '🌋', w: [
        ['MONTANHA', 'Quanto mais alta, mais fria', 'Grande elevação natural, às vezes com neve no topo'],
        ['VULCÃO', 'Quando acorda, faz muito barulho', 'Montanha que expele lava e cinzas'],
        ['CACHOEIRA', 'A água cai e não se machuca', 'Queda d’água em um rio'],
        ['ARCO-ÍRIS', 'Aparece depois da chuva com sol', 'Faixa de sete cores no céu'],
        ['OCEANO', 'Tem água salgada e é enorme', 'Grande extensão de água que cobre parte do planeta'],
        ['GELEIRA', 'É formada por gelo acumulado', 'Grande massa de gelo encontrada em regiões frias'],
        ['FLORESTA', 'Tem grande quantidade de árvores', 'Área coberta por vegetação e vida animal'],
        ['TEMPESTADE', 'Pode vir acompanhada de vento e chuva fortes', 'Fenômeno atmosférico intenso'],
        ['BIODIVERSIDADE', 'É ameaçada pela perda de habitats', 'Variedade de seres vivos em uma região ou no planeta'],
        ['FOTOSSINTESE', 'Depende de luz, água e gás carbônico', 'Processo pelo qual plantas produzem açúcares usando energia luminosa'],
        ['ESTALACTITES', 'Crescem penduradas no teto de cavernas', 'Formações minerais que se desenvolvem para baixo a partir do teto'] ] },
      /* Categoria Natureza. */
      { id: 'musica', n: 'Música', i: '🎸', w: [
        ['VIOLÃO', 'Tem seis cordas', 'Instrumento de madeira, presença certa em rodas de samba'],
        ['BATERIA', 'Quem toca precisa de braços e pernas coordenados', 'Conjunto de tambores e pratos tocado com baquetas'],
        ['SANFONA', 'Respira enquanto toca', 'Instrumento de fole, marca das festas juninas'],
        ['PIANO', 'Tem teclas pretas e brancas', 'Instrumento de teclas muito usado em diversos estilos'],
        ['TROMPETE', 'É um instrumento de sopro', 'Tem bocais e válvulas e produz som com os lábios'],
        ['AFINACAO', 'Ajuda a deixar o som correto', 'Processo de ajustar as notas de um instrumento'],
        ['CONTRABAIXO', 'Tem som grave e cordas', 'Instrumento que costuma sustentar a parte grave da música'],
        ['SINFONIA', 'É uma composição extensa para orquestra', 'Obra musical geralmente dividida em vários movimentos'],
        ['IMPROVISACAO', 'Acontece sem uma execução totalmente planejada', 'Criação musical espontânea feita durante a apresentação'],
        ['CLARINETE', 'Tem palheta simples e corpo geralmente escuro', 'Instrumento de sopro da família das madeiras'] ] },
      /* Categoria Música. */
      { id: 'desenhos', n: 'Desenhos', i: '🎬', w: [
        ['ESPONJA', 'Mora no fundo do mar e tem uma personalidade muito otimista', 'Personagem amarelo que vive na Fenda do Biquíni'],
        ['PICA-PAU', 'Adora aprontar e costuma causar confusão', 'Ave azul e vermelha conhecida por sua risada característica'],
        ['SCOOBY', 'Tem quatro patas e é facilmente assustado', 'Cachorro que participa de mistérios com uma turma de amigos'],
        ['TOM', 'Vive perseguindo um pequeno rival', 'Gato de um clássico desenho de perseguição'],
        ['JERRY', 'É pequeno, esperto e adora queijo', 'Rato que sempre consegue escapar do gato'],
        ['MONICA', 'É uma personagem brasileira muito conhecida', 'Menina de vestido vermelho criada por Mauricio de Sousa'],
        ['NARUTO', 'É um jovem ninja muito determinado', 'Personagem principal de uma série de anime e mangá'],
        ['GARFIELD', 'Adora comer e dormir', 'Gato laranja famoso por sua preguiça e humor'],
        ['DRAGONBALL', 'Tem lutas e aventuras cheias de energia', 'Série conhecida por personagens como Goku e Vegeta'],
        ['TRANSFORMERS', 'Robôs podem virar veículos', 'Franquia de ficção científica sobre robôs alienígenas que mudam de forma'],
        ['CAVALHEIROS', 'Defendem a deusa Atena em armaduras', 'Nome popular de uma série de anime conhecida como Saint Seiya'],
        ['POKEMON', 'Treinadores viajam para capturar criaturas', 'Franquia com criaturas como Pikachu e Charizard'] ] },
      /* Categoria Desenhos. */
      { id: 'profissoes', n: 'Profissões', i: '👷', w: [
        ['ARQUITETURA', 'Une beleza e engenharia', 'Arte e técnica de projetar edifícios'],
        ['BOMBEIRO', 'Corre em direção ao perigo', 'Combate incêndios e faz resgates'],
        ['PROFESSORA', 'Ensina quase todas as outras profissões', 'Dá aulas na escola'],
        ['MÉDICO', 'Usa jaleco branco e estetoscópio', 'Cuida da saúde das pessoas'],
        ['PILOTO', 'Trabalha com aeronaves', 'Profissional responsável por conduzir um avião'],
        ['DENTISTA', 'Cuida da boca e dos dentes', 'Profissional que trata dentes e saúde bucal'],
        ['JORNALISTA', 'Trabalha com informação', 'Profissional que apura e comunica notícias'],
        ['ENGENHEIRO', 'Usa matemática e técnica para criar soluções', 'Profissional que projeta e desenvolve sistemas e estruturas'],
        ['ASTRONAUTA', 'Treina para trabalhar fora da Terra', 'Profissional preparado para viajar e atuar no espaço'],
        ['VETERINARIA', 'Atende pacientes que não falam', 'Profissional da saúde que cuida de animais'],
        ['PROGRAMADOR', 'Transforma requisitos em instruções para máquinas', 'Profissional que escreve, testa e mantém código de software'],
        ['ARQUEOLOGO', 'Estuda vestígios materiais de sociedades antigas', 'Pesquisador que analisa objetos, ruínas e sítios do passado'] ] }
      /* Última categoria (sem vírgula depois, pois é o último item da lista). */
    ];
    var ALL = [];
    /* ALL será uma lista "achatada" com TODAS as palavras de TODAS as categorias (usada no modo Surpresa). */
    CATS.forEach(function (c) { c.w.forEach(function (x) { ALL.push({ w: x[0], h: [x[1], x[2]], c: c }); }); });
    /* Para cada categoria (c), percorre suas palavras (x) e coloca em ALL um objeto:
       w = a palavra (x[0]), h = lista das duas dicas (x[1] e x[2]), c = a categoria a que pertence. */
  
    var $ = function (id) { return document.getElementById(id); };
    /* Atalho: $('word') equivale a document.getElementById('word'). Encurta o código abaixo. */
    var el = {
      /* "el" guarda referências a todos os elementos da página que o JS vai usar.
         Buscar uma vez só e guardar é mais eficiente do que buscar toda hora. */
      word: $('word'), used: $('used'), msg: $('msg'), kb: $('kb'),
      /* Palavra, letras usadas, contador de erros, mensagem e teclado virtual. */
      parts: document.querySelectorAll('.part'), hintList: $('hintList'),
      /* parts = TODAS as partes do boneco (querySelectorAll devolve uma lista); lista e botão de dicas. */
      newBtn: $('new'), changeBtn: $('change'), confetti: $('confetti'), setup: $('setup'),
      /* Botões Nova partida e Trocar categoria, camada de confete e tela de configuração. */
      name: $('name'), levels: $('levels'), setupNote: $('setupNote'), setupBox: document.querySelector('.setup-box'), hintChoices: $('hintChoices'), hintValue: $('hintValue'), hintNote: $('hintNote'),
      /* Campo do nome, grupos de botões de dificuldade e de dicas, e a nota explicativa. */
      startBtn: $('startBtn'), player: $('player'), cats: $('cats'), topic: $('topic'),
      /* Botão Começar, texto do jogador, carrossel de categorias e barra de categoria do topo. */
      tIco: $('tIco'), tName: $('tName'),
      /* Emoji e nome da categoria na barra, área dos corações e placar. */
      stage: document.querySelector('.stage'), categoryCharacter: $('categoryCharacter'),
      /* Novos elementos: sequência de letras, trilha de rodadas ganhas, aviso de marco e vinheta de erro. */
      chainBox: $('chainBox'), chain: $('chain'), chainLabel: $('chainLabel'),
      trophyBox: $('trophyBox'), trophies: $('trophies'), trophyLabel: $('trophyLabel'),
      toast: $('toast'), vignette: $('vignette'), hook: $('hook'),
      avatars: $('avatars'), welcome: $('welcome'), welcomeText: $('welcomeText'), forget: $('forget'), setupTitle: $('setupTitle'),
      dangerTitle: $('dangerTitle'), dangerText: $('dangerText'), dangerBar: $('dangerBar'), dangerCount: $('dangerCount'), hintProgress: $('hintProgress'), categoryCharacter: $('categoryCharacter'),
      hudStreak: $('hudStreak'),
      hub: $('hub'), hubBox: document.querySelector('#hub .hub-box'), hubProgressText: $('hubProgressText'), hubName: $('hubName'), hubAvatar: $('hubAvatar'), hubLevel: $('hubLevel'),
      hubScore: $('hubScore'), hubWinStreak: $('hubWinStreak'), hubCognitive: $('hubCognitive'),
      hubLevelBar: $('hubLevelBar'), hubJourney: $('hubJourney'), hubPlay: $('hubPlay'), hubConfigure: $('hubConfigure'), hubClose: $('hubClose'), hubPanel: $('hubPanel'),
      result: $('result'), resultTitle: $('resultTitle'), resultWord: $('resultWord'), resultPoints: $('resultPoints'),
      resultCombo: $('resultCombo'), resultStreak: $('resultStreak'), resultCognitive: $('resultCognitive'),
      resultAchievement: $('resultAchievement'), resultReward: $('resultReward'), resultLevelUp: $('resultLevelUp'), resultNext: $('resultNext'),
      resultMenu: $('resultMenu'), mockAd: $('mockAd')
      /* Referências do HUD, painel de jornada e tela de resultado. */
    };
  
    var LEVELS = {
      easy:   { label: 'Fácil', max: 7, note: 'Palavras de até 7 letras. Mais margem para pensar.' },
      medium: { label: 'Médio', max: 9, note: 'Palavras de 8 a 9 letras. Equilíbrio entre descoberta e desafio.' },
      hard:   { label: 'Difícil', max: Infinity, note: 'Palavras de 10 letras ou mais. Atenção às pistas e ao tema.' }
    };
    var settings = { name: '', avatar: '🦊', level: 'medium', hints: 2, cat: 'all' };
    /* Escolhas do jogador. Valores iniciais: sem nome, nível médio, 2 dicas, categoria 'all' (Surpresa). */
    var stats = {
      wins: 0, losses: 0, streak: 0, best: 0,
      score: 0, level: 1, cognitiveScore: 0, letterBest: 0, totalLetters: 0,
      achievements: [], rewards: [], plus: false, totalGames: 0
    };

    /* ---------- CADASTRO (perfil salvo no navegador) ---------- */
    /* ---------- PROGRESSÃO: regras centralizadas ---------- */
    var CATEGORY_CHARACTERS = {
      /* Cada desenho usa seis camadas semânticas: em cada erro entra uma parte real do mascote da categoria. */
      animais: { label:'gato mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Gato em construção">
        <g class="char-part p1"><circle cx="50" cy="39" r="25" fill="#d9a05c" stroke="#704629" stroke-width="3"/><path d="M31 52 Q50 66 69 52" fill="#c88b49"/></g>
        <g class="char-part p2"><path d="M31 62 Q50 52 69 62 L76 92 Q76 101 67 101 L33 101 Q24 101 24 92Z" fill="#d9a05c" stroke="#704629" stroke-width="3"/><path d="M32 91 L32 104 Q32 111 41 111 L45 111 L45 98 M55 98 L55 111 L61 111 Q69 111 69 103 L69 91" fill="#d9a05c" stroke="#704629" stroke-width="3" stroke-linejoin="round"/></g>
        <g class="char-part p3"><path d="M29 27 L25 5 L44 20Z M71 27 L75 5 L56 20Z" fill="#d9a05c" stroke="#704629" stroke-width="3" stroke-linejoin="round"/><path d="M31 21 L30 12 L39 20 M69 21 L70 12 L61 20" fill="#ed9da6"/></g>
        <g class="char-part p4"><path d="M72 79 Q90 78 88 60 Q87 51 79 56" fill="none" stroke="#b9793b" stroke-width="7" stroke-linecap="round"/><path d="M72 79 Q90 78 88 60 Q87 51 79 56" fill="none" stroke="#704629" stroke-width="2" stroke-linecap="round"/></g>
        <g class="char-part p5"><ellipse cx="41" cy="39" rx="3.5" ry="5" fill="#25213d"/><ellipse cx="59" cy="39" rx="3.5" ry="5" fill="#25213d"/><path d="M46 48 L50 51 L54 48Z" fill="#e56c80"/><path d="M50 51 Q45 57 41 52 M50 51 Q55 57 59 52" fill="none" stroke="#704629" stroke-width="2" stroke-linecap="round"/><path d="M39 49 L20 46 M39 53 L21 56 M61 49 L80 46 M61 53 L79 56" stroke="#704629" stroke-width="1.8" stroke-linecap="round"/></g>
        <g class="char-part p6"><path d="M35 68 Q50 77 65 68" fill="none" stroke="#fff0bd" stroke-width="5" stroke-linecap="round"/><circle cx="50" cy="73" r="4" fill="#f6c453" stroke="#704629" stroke-width="1.5"/><path d="M35 84 L43 88 M65 84 L57 88" stroke="#b9793b" stroke-width="3" stroke-linecap="round"/></g>
      </svg>`},
      comidas: { label:'pizza mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Pizza em construção">
        <g class="char-part p1"><path d="M13 31 Q50 10 87 31 L62 105 Q59 113 50 113 Q41 113 38 105Z" fill="#f5c95b" stroke="#a85a25" stroke-width="3" stroke-linejoin="round"/></g>
        <g class="char-part p2"><path d="M20 29 Q50 12 80 29 L60 96 Q57 103 50 103 Q43 103 40 96Z" fill="#ef8b35"/><path d="M24 34 Q50 20 76 34 L59 91 Q56 97 50 97 Q44 97 41 91Z" fill="#f9df79"/><circle cx="39" cy="48" r="6" fill="#d94448"/><circle cx="63" cy="43" r="6" fill="#d94448"/><circle cx="53" cy="70" r="6" fill="#d94448"/><path d="M47 39 q-5 -5 -8 0 M66 61 q-5 -5 -8 0" stroke="#4c9a5a" stroke-width="3" fill="none" stroke-linecap="round"/></g>
        <g class="char-part p3"><path d="M13 27 Q50 4 87 27 L82 39 Q50 19 18 39Z" fill="#d98434" stroke="#a85a25" stroke-width="3" stroke-linejoin="round"/><path d="M19 31 Q50 13 81 31" fill="none" stroke="#ffdf8b" stroke-width="3" stroke-linecap="round"/></g>
        <g class="char-part p4"><circle cx="34" cy="64" r="5" fill="#d94448" stroke="#a52d38" stroke-width="1.5"/><circle cx="65" cy="78" r="4.5" fill="#d94448" stroke="#a52d38" stroke-width="1.5"/><path d="M42 82 Q50 86 58 82" fill="none" stroke="#4c9a5a" stroke-width="3" stroke-linecap="round"/><circle cx="57" cy="54" r="3" fill="#4c9a5a"/></g>
        <g class="char-part p5"><ellipse cx="42" cy="58" rx="3.2" ry="4.2" fill="#25213d"/><ellipse cx="59" cy="58" rx="3.2" ry="4.2" fill="#25213d"/><path d="M44 68 Q50 74 57 68" fill="none" stroke="#8e4728" stroke-width="2.5" stroke-linecap="round"/><path d="M33 67 L23 64 M67 67 L77 64" stroke="#8e4728" stroke-width="1.8" stroke-linecap="round"/></g>
        <g class="char-part p6"><path d="M29 23 Q21 12 34 13 Q40 14 39 23 Q49 12 53 20 Q55 25 46 29" fill="#39a96b" stroke="#28784b" stroke-width="1.5"/><path d="M69 51 l3 6 7 1 -5 5 1 7 -6 -4 -6 4 1 -7 -5 -5 7 -1Z" fill="#fff4ca" stroke="#d98434" stroke-width="1"/></g>
      </svg>`},
      lugares: { label:'castelo', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Castelo em construção">
        <g class="char-part p1"><path d="M13 39 L31 39 L31 29 L42 29 L42 43 L58 43 L58 29 L69 29 L69 39 L87 39 L87 105 L13 105Z" fill="#a6a0dc" stroke="#514577" stroke-width="3" stroke-linejoin="round"/></g>
        <g class="char-part p2"><path d="M8 39 L30 39 L30 104 L8 104Z M70 39 L92 39 L92 104 L70 104Z" fill="#8d7dc5" stroke="#514577" stroke-width="3"/><path d="M15 47 L15 60 M23 47 L23 60 M77 47 L77 60 M85 47 L85 60" stroke="#d9d3ff" stroke-width="3"/></g>
        <g class="char-part p3"><path d="M6 39 L19 9 L32 39Z M68 39 L81 9 L94 39Z" fill="#f4bd4f" stroke="#514577" stroke-width="3"/><path d="M22 48 L22 36 L31 36 L31 48 M69 48 L69 36 L78 36 L78 48" fill="#f4bd4f" stroke="#514577" stroke-width="2"/></g>
        <g class="char-part p4"><path d="M42 105 L42 80 Q50 68 58 80 L58 105Z" fill="#514577" stroke="#342d54" stroke-width="2"/><rect x="32" y="58" width="8" height="12" rx="2" fill="#e9f3ff"/><rect x="60" y="58" width="8" height="12" rx="2" fill="#e9f3ff"/><path d="M50 58 L50 68" stroke="#514577" stroke-width="2"/></g>
        <g class="char-part p5"><path d="M50 13 L50 2" stroke="#514577" stroke-width="2.5"/><path d="M51 3 L77 10 L51 18Z" fill="#e74f63" stroke="#514577" stroke-width="2"/></g>
        <g class="char-part p6"><path d="M8 106 Q15 94 23 106 M77 106 Q84 94 92 106" fill="none" stroke="#4d9a65" stroke-width="5" stroke-linecap="round"/><path d="M37 19 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1Z" fill="#f6c453"/></g>
      </svg>`},
      objetos: { label:'mochila mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Mochila em construção">
        <g class="char-part p1"><rect x="23" y="24" width="54" height="80" rx="15" fill="#8067bb" stroke="#44356d" stroke-width="3"/><path d="M38 26 Q38 9 50 9 Q62 9 62 26" fill="none" stroke="#44356d" stroke-width="6" stroke-linecap="round"/></g>
        <g class="char-part p2"><rect x="30" y="55" width="40" height="35" rx="9" fill="#a998da" stroke="#44356d" stroke-width="2.5"/><path d="M34 63 Q50 57 66 63" fill="none" stroke="#cfc5f4" stroke-width="3"/></g>
        <g class="char-part p3"><path d="M25 38 Q10 42 14 67 L18 84 M75 38 Q90 42 86 67 L82 84" fill="none" stroke="#44356d" stroke-width="6" stroke-linecap="round"/><path d="M28 32 L28 45 M72 32 L72 45" stroke="#c9b9f1" stroke-width="3" stroke-linecap="round"/></g>
        <g class="char-part p4"><path d="M50 28 L50 53" stroke="#f6c453" stroke-width="3"/><circle cx="50" cy="52" r="4" fill="#f6c453" stroke="#44356d" stroke-width="1.5"/><path d="M38 75 L62 75" stroke="#8067bb" stroke-width="2"/></g>
        <g class="char-part p5"><ellipse cx="42" cy="43" rx="3.5" ry="4.5" fill="#25213d"/><ellipse cx="58" cy="43" rx="3.5" ry="4.5" fill="#25213d"/><path d="M43 49 Q50 56 57 49" fill="none" stroke="#44356d" stroke-width="2.5" stroke-linecap="round"/></g>
        <g class="char-part p6"><path d="M40 88 L45 84 L50 88 L55 84 L60 88" fill="none" stroke="#f6c453" stroke-width="3" stroke-linecap="round"/><path d="M46 67 l4 -7 4 7 7 1 -5 5 1 7 -7 -4 -6 4 1 -7 -5 -5Z" fill="#f6c453" stroke="#44356d" stroke-width="1.5"/></g>
      </svg>`},
      tecnologia: { label:'robô', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Robô em construção">
        <g class="char-part p1"><rect x="23" y="9" width="54" height="40" rx="10" fill="#a9bfd9" stroke="#3e506e" stroke-width="3"/><path d="M30 18 L70 18" stroke="#eaf4ff" stroke-width="3" stroke-linecap="round"/></g>
        <g class="char-part p2"><rect x="28" y="52" width="44" height="40" rx="8" fill="#6f88ad" stroke="#3e506e" stroke-width="3"/><rect x="39" y="62" width="22" height="13" rx="3" fill="#d9fff5" stroke="#3e506e" stroke-width="2"/></g>
        <g class="char-part p3"><path d="M28 59 L11 80 M72 59 L89 80" fill="none" stroke="#6f88ad" stroke-width="8" stroke-linecap="round"/><circle cx="10" cy="82" r="5" fill="#a9bfd9" stroke="#3e506e" stroke-width="2"/><circle cx="90" cy="82" r="5" fill="#a9bfd9" stroke="#3e506e" stroke-width="2"/><path d="M40 92 L38 106 L27 106 M60 92 L62 106 L73 106" fill="none" stroke="#3e506e" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g class="char-part p4"><circle cx="39" cy="29" r="5" fill="#1eaa92" stroke="#3e506e" stroke-width="2"/><circle cx="61" cy="29" r="5" fill="#1eaa92" stroke="#3e506e" stroke-width="2"/><path d="M42 39 Q50 44 58 39" fill="none" stroke="#3e506e" stroke-width="2.5" stroke-linecap="round"/></g>
        <g class="char-part p5"><path d="M50 9 L50 2" stroke="#3e506e" stroke-width="3"/><circle cx="50" cy="2" r="4" fill="#f6c453" stroke="#3e506e" stroke-width="1.5"/><circle cx="22" cy="53" r="4" fill="#f6c453" stroke="#3e506e" stroke-width="1.5"/><circle cx="78" cy="53" r="4" fill="#f6c453" stroke="#3e506e" stroke-width="1.5"/></g>
        <g class="char-part p6"><circle cx="50" cy="82" r="4" fill="#1eaa92" stroke="#3e506e" stroke-width="1.5"/><path d="M34 68 L38 68 M62 68 L66 68" stroke="#fff" stroke-width="2" stroke-linecap="round"/><path d="M79 15 l2 4 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1Z" fill="#f6c453"/></g>
      </svg>`},
      natureza: { label:'árvore mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Árvore em construção">
        <g class="char-part p1"><path d="M42 60 L42 111 L58 111 L58 60Z" fill="#9a6338" stroke="#5a3a27" stroke-width="3"/><path d="M17 62 Q4 45 20 31 Q16 14 37 17 Q49 0 61 16 Q83 8 82 31 Q98 45 82 62Z" fill="#75bd65" stroke="#3c8247" stroke-width="3" stroke-linejoin="round"/></g>
        <g class="char-part p2"><circle cx="34" cy="43" r="23" fill="#75bd65" stroke="#3c8247" stroke-width="3"/><circle cx="65" cy="42" r="24" fill="#64ad5d" stroke="#3c8247" stroke-width="3"/><circle cx="50" cy="24" r="23" fill="#83ce70" stroke="#3c8247" stroke-width="3"/></g>
        <g class="char-part p3"><path d="M48 63 L35 43 M53 61 L67 40 M50 50 L50 28" fill="none" stroke="#5a3a27" stroke-width="4" stroke-linecap="round"/></g>
        <g class="char-part p4"><ellipse cx="29" cy="31" rx="5" ry="9" transform="rotate(-35 29 31)" fill="#a6de72"/><ellipse cx="70" cy="29" rx="5" ry="9" transform="rotate(35 70 29)" fill="#a6de72"/><circle cx="37" cy="59" r="5" fill="#f36b71"/><circle cx="67" cy="55" r="5" fill="#f6c453"/><path d="M49 10 Q52 1 57 8" fill="none" stroke="#3c8247" stroke-width="3"/></g>
        <g class="char-part p5"><ellipse cx="42" cy="42" rx="3.2" ry="4.4" fill="#25213d"/><ellipse cx="59" cy="42" rx="3.2" ry="4.4" fill="#25213d"/><path d="M43 51 Q50 58 57 51" fill="none" stroke="#315b36" stroke-width="2.5" stroke-linecap="round"/></g>
        <g class="char-part p6"><path d="M20 17 l2 5 5 1 -4 3 1 5 -4 -3 -4 3 1 -5 -4 -3 5 -1Z" fill="#f6c453"/><path d="M77 44 q7 -8 12 0 q-5 7 -12 0Z" fill="#f3a5bd" stroke="#aa5d84" stroke-width="1.5"/><path d="M82 43 L82 51" stroke="#aa5d84" stroke-width="1.5"/></g>
      </svg>`},
      musica: { label:'guitarra mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Guitarra em construção">
        <g class="char-part p1"><path d="M42 57 Q27 47 20 65 Q13 83 30 96 Q41 105 50 92 Q59 105 70 96 Q87 83 80 65 Q73 47 58 57 L55 41 L45 41Z" fill="#c98443" stroke="#6b4329" stroke-width="3" stroke-linejoin="round"/><path d="M43 56 L40 16 L60 16 L57 56Z" fill="#e2b26b" stroke="#6b4329" stroke-width="3"/></g>
        <g class="char-part p2"><path d="M41 50 L41 14 L59 14 L59 50Z" fill="#9d6638" stroke="#6b4329" stroke-width="2.5"/><rect x="43" y="11" width="14" height="8" rx="2" fill="#70472b" stroke="#6b4329" stroke-width="2"/></g>
        <g class="char-part p3"><circle cx="50" cy="78" r="9" fill="#f7e4a7" stroke="#6b4329" stroke-width="2.5"/><path d="M45 20 L45 91 M48 20 L48 93 M52 20 L52 93 M55 20 L55 91" stroke="#fff5d2" stroke-width="1.2"/><path d="M45 28 L55 28 M45 37 L55 37 M45 46 L55 46" stroke="#5a3927" stroke-width="1.5"/></g>
        <g class="char-part p4"><path d="M41 15 L34 10 M41 22 L34 27 M59 15 L66 10 M59 22 L66 27" stroke="#6b4329" stroke-width="3" stroke-linecap="round"/><circle cx="33" cy="10" r="3" fill="#f6c453" stroke="#6b4329" stroke-width="1"/><circle cx="33" cy="27" r="3" fill="#f6c453" stroke="#6b4329" stroke-width="1"/><circle cx="67" cy="10" r="3" fill="#f6c453" stroke="#6b4329" stroke-width="1"/><circle cx="67" cy="27" r="3" fill="#f6c453" stroke="#6b4329" stroke-width="1"/></g>
        <g class="char-part p5"><ellipse cx="39" cy="69" rx="3" ry="4" fill="#25213d"/><ellipse cx="61" cy="69" rx="3" ry="4" fill="#25213d"/><path d="M43 85 Q50 91 57 85" fill="none" stroke="#6b4329" stroke-width="2.5" stroke-linecap="round"/><path d="M23 80 L13 86 M77 80 L87 86" stroke="#c98443" stroke-width="5" stroke-linecap="round"/></g>
        <g class="char-part p6"><text x="72" y="43" font-family="Arial,sans-serif" font-size="17" font-weight="700" fill="#5b3df5">♪</text><text x="18" y="45" font-family="Arial,sans-serif" font-size="13" font-weight="700" fill="#e5384f">♫</text><path d="M34 99 L30 108 M66 99 L70 108" stroke="#6b4329" stroke-width="5" stroke-linecap="round"/></g>
      </svg>`},
      desenhos: { label:'mascote de desenho animado', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Personagem de desenho em construção">
        <g class="char-part p1"><circle cx="50" cy="37" r="25" fill="#ffd7a8" stroke="#34304e" stroke-width="3"/><path d="M30 57 Q50 49 70 57 L75 93 L25 93Z" fill="#5d77e8" stroke="#34304e" stroke-width="3"/></g>
        <g class="char-part p2"><path d="M27 33 Q20 9 42 12 Q48 0 58 12 Q78 8 74 34 Q65 20 55 23 Q42 15 27 33Z" fill="#583b2e" stroke="#34304e" stroke-width="3" stroke-linejoin="round"/></g>
        <g class="char-part p3"><path d="M34 65 L66 65 L70 89 L30 89Z" fill="#f6c453" stroke="#34304e" stroke-width="2.5"/><path d="M50 68 L50 86" stroke="#fff1c6" stroke-width="3"/></g>
        <g class="char-part p4"><path d="M29 65 L10 82 M71 65 L90 82" fill="none" stroke="#ffd7a8" stroke-width="8" stroke-linecap="round"/><circle cx="10" cy="82" r="4" fill="#ffd7a8" stroke="#34304e" stroke-width="1.5"/><circle cx="90" cy="82" r="4" fill="#ffd7a8" stroke="#34304e" stroke-width="1.5"/><path d="M39 92 L37 105 L25 105 M61 92 L63 105 L75 105" fill="none" stroke="#34304e" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path d="M25 105 L37 105 M63 105 L75 105" stroke="#e95763" stroke-width="7" stroke-linecap="round"/></g>
        <g class="char-part p5"><ellipse cx="41" cy="37" rx="3.5" ry="5" fill="#25213d"/><ellipse cx="59" cy="37" rx="3.5" ry="5" fill="#25213d"/><path d="M42 48 Q50 56 58 48" fill="none" stroke="#a84d55" stroke-width="2.8" stroke-linecap="round"/><circle cx="33" cy="45" r="4" fill="#f09ba5"/><circle cx="67" cy="45" r="4" fill="#f09ba5"/></g>
        <g class="char-part p6"><path d="M83 15 L86 21 L93 22 L88 27 L89 34 L83 30 L77 34 L78 27 L73 22 L80 21Z" fill="#f6c453" stroke="#34304e" stroke-width="1.5"/><path d="M30 63 L25 59 M70 63 L75 59" stroke="#e95763" stroke-width="3" stroke-linecap="round"/></g>
      </svg>`},
      profissoes: { label:'bombeiro mascote', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Bombeiro em construção">
        <g class="char-part p1"><circle cx="50" cy="35" r="20" fill="#f2bd93" stroke="#67442f" stroke-width="3"/><path d="M35 48 Q50 43 65 48 L70 96 L30 96Z" fill="#d9414f" stroke="#702d37" stroke-width="3"/></g>
        <g class="char-part p2"><path d="M32 29 Q31 9 50 7 Q69 9 68 29 L63 32 L37 32Z" fill="#f3b33f" stroke="#67442f" stroke-width="3"/><path d="M29 30 Q50 25 71 30" fill="none" stroke="#67442f" stroke-width="5" stroke-linecap="round"/></g>
        <g class="char-part p3"><path d="M30 62 L13 67 M70 62 L87 67" fill="none" stroke="#d9414f" stroke-width="9" stroke-linecap="round"/><circle cx="12" cy="67" r="5" fill="#f2bd93" stroke="#67442f" stroke-width="2"/><circle cx="88" cy="67" r="5" fill="#f2bd93" stroke="#67442f" stroke-width="2"/><path d="M40 94 L39 105 L27 105 M60 94 L61 105 L73 105" fill="none" stroke="#2f3548" stroke-width="8" stroke-linecap="butt" stroke-linejoin="round"/><path d="M27 105 L38 105 M62 105 L74 105" fill="none" stroke="#e95763" stroke-width="7" stroke-linecap="round"/></g>
        <g class="char-part p4"><path d="M34 62 L66 62 M33 76 L67 76" stroke="#ffd45c" stroke-width="6"/><path d="M37 66 L63 66 M37 80 L63 80" stroke="#fff2b5" stroke-width="2"/></g>
        <g class="char-part p5"><ellipse cx="43" cy="37" rx="3" ry="4" fill="#25213d"/><ellipse cx="57" cy="37" rx="3" ry="4" fill="#25213d"/><path d="M43 45 Q50 50 57 45" fill="none" stroke="#67442f" stroke-width="2.5" stroke-linecap="round"/><path d="M38 51 Q50 55 62 51" fill="none" stroke="#b56d49" stroke-width="2"/></g>
        <g class="char-part p6"><path d="M82 84 Q92 77 93 88 L87 96 L80 93Z" fill="#4f8cc9" stroke="#28527d" stroke-width="2"/><path d="M91 87 L98 83" stroke="#50cce0" stroke-width="4" stroke-linecap="round"/><path d="M48 15 L52 15" stroke="#fff1b5" stroke-width="3" stroke-linecap="round"/></g>
      </svg>`},
      surpresa: { label:'criatura surpresa', svg:`<svg viewBox="0 0 100 120" role="img" aria-label="Criatura surpresa em construção">
        <g class="char-part p1"><path d="M23 48 Q18 20 43 22 Q57 12 72 28 Q87 41 77 69 L70 94 Q50 107 30 94Z" fill="#a48bf5" stroke="#4f3a9b" stroke-width="3"/></g>
        <g class="char-part p2"><path d="M31 32 L23 10 L43 23 M68 30 L78 9 L80 35" fill="#ffca5c" stroke="#4f3a9b" stroke-width="3" stroke-linejoin="round"/><path d="M31 87 L24 100 M69 87 L76 100" stroke="#4f3a9b" stroke-width="7" stroke-linecap="round"/></g>
        <g class="char-part p3"><ellipse cx="40" cy="54" rx="7" ry="10" fill="#fff" stroke="#4f3a9b" stroke-width="2"/><ellipse cx="60" cy="54" rx="7" ry="10" fill="#fff" stroke="#4f3a9b" stroke-width="2"/><circle cx="42" cy="56" r="3.5" fill="#25213d"/><circle cx="62" cy="56" r="3.5" fill="#25213d"/></g>
        <g class="char-part p4"><path d="M28 66 L10 82 M72 66 L90 82" fill="none" stroke="#a48bf5" stroke-width="8" stroke-linecap="round"/><circle cx="10" cy="83" r="4.5" fill="#ffca5c" stroke="#4f3a9b" stroke-width="1.5"/><circle cx="90" cy="83" r="4.5" fill="#ffca5c" stroke="#4f3a9b" stroke-width="1.5"/><path d="M39 91 L37 103 L25 103 M61 91 L63 103 L75 103" fill="none" stroke="#4f3a9b" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g class="char-part p5"><path d="M39 72 Q50 83 61 72" fill="none" stroke="#4f3a9b" stroke-width="3" stroke-linecap="round"/><circle cx="31" cy="65" r="4" fill="#ff99ba"/><circle cx="69" cy="65" r="4" fill="#ff99ba"/></g>
        <g class="char-part p6"><path d="M84 18 L87 24 L94 25 L89 30 L90 37 L84 33 L78 37 L79 30 L74 25 L81 24Z" fill="#f6c453" stroke="#4f3a9b" stroke-width="1.5"/><path d="M32 96 L38 93 M68 96 L62 93" stroke="#ffca5c" stroke-width="4" stroke-linecap="round"/></g>
      </svg>`}
    };

    var mockData = {
      onlineNow: 1284,
      categoryPlayers: 326,
      rank: 37,
      /* Dados abaixo são deliberadamente simulados e não representam usuários reais. */
      leaderboard: [['ANA', 9840], ['CARLOS', 9420], ['MARIA', 8110]]
    };

    var PROGRESSION = {
      points: { easy: 100, medium: 150, hard: 220 },
      difficultyMultiplier: { easy: 1, medium: 1.35, hard: 1.8 },
      letterBase: 10,
      winBonus: 100,
      perfectBonus: 50,
      streakTargets: [3, 7, 14],
      winTargets: [5, 10, 25, 50],
      achievements: [
        { id: 'first-hit', icon: '🏅', name: 'Primeiro acerto', test: function (s, d) { return d.totalHits >= 1; } },
        { id: 'combo-5', icon: '🔥', name: '5 letras seguidas', test: function (s, d) { return d.bestChain >= 5; } },
        { id: 'combo-10', icon: '⚡', name: '10 letras seguidas', test: function (s, d) { return d.bestChain >= 10; } },
        { id: 'wins-10', icon: '🏆', name: '10 vitórias', test: function (s) { return s.wins >= 10; } },
        { id: 'master', icon: '🧠', name: 'Mestre das palavras', test: function (s) { return s.wins >= 25 && s.best >= 10; } },
         { id: 'letters-100', icon: '🎯', name: '100 letras descobertas', test: function (s) { return s.totalLetters >= 100; } }
      ],
      rewards: [
        { id: 'win-5', target: 5, type: 'wins', icon: '🎁', name: 'Recompensa básica', text: 'Você desbloqueou um benefício conceitual.' },
        { id: 'win-10', target: 10, type: 'wins', icon: '🎁', name: 'Recompensa intermediária', text: 'Uma recompensa especial foi liberada.' },
        { id: 'win-25', target: 25, type: 'wins', icon: '🏆', name: 'Recompensa especial', text: 'Você alcançou um marco importante.' },
        { id: 'win-50', target: 50, type: 'wins', icon: '👑', name: 'Recompensa premium', text: 'Marco máximo da primeira versão.' },
        { id: 'streak-3', target: 3, type: 'streak', icon: '🔥', name: 'Clube da sequência', text: '3 vitórias seguidas desbloqueiam um benefício mockado.' },
        { id: 'streak-7', target: 7, type: 'streak', icon: '⚡', name: 'Sequência especial', text: '7 vitórias seguidas desbloqueiam um benefício especial.' },
        { id: 'streak-14', target: 14, type: 'streak', icon: '💎', name: 'Sequência premium', text: '14 vitórias seguidas desbloqueiam um benefício premium.' }
      ]
    };

    var AVATARS = ['🦊', '🐼', '🐸', '🦁', '🐙', '🦄', '🐯', '🐵'];
    /* Opções de avatar do cadastro. */
    var STORE_KEY = 'forca.perfil.v1';
    /* Nome da "gaveta" no localStorage (memória do navegador) onde o perfil fica guardado. */
    function save() {
      /* Persiste perfil + progresso. O jogo continua funcional mesmo se localStorage estiver indisponível. */
      try {
        localStorage.setItem(STORE_KEY, JSON.stringify({ settings: settings, stats: stats }));
      } catch (e) { /* armazenamento pode estar bloqueado pelo navegador */ }
    }
    function load() {
      /* Carrega dados antigos e aplica valores seguros; campos novos recebem defaults. */
      try {
        var d = JSON.parse(localStorage.getItem(STORE_KEY) || 'null');
        if (!d) return;
        var a = d.settings || {}, b = d.stats || {};
        if (typeof a.name === 'string') settings.name = a.name.slice(0, 20);
        if (AVATARS.indexOf(a.avatar) > -1) settings.avatar = a.avatar;
        if (LEVELS[a.level]) settings.level = a.level;
        if (typeof a.hints === 'number' && a.hints >= 0 && a.hints <= HINT_MAX) settings.hints = Math.floor(a.hints);
        settings.hints = Math.min(HINT_MAX, Math.max(0, settings.hints || 0));
        if (a.cat === 'all' || CATS.some(function (c) { return c.id === a.cat; })) settings.cat = a.cat;
        ['wins', 'losses', 'streak', 'best', 'score', 'level', 'cognitiveScore', 'letterBest', 'totalLetters', 'totalGames'].forEach(function (k) {
          if (typeof b[k] === 'number' && b[k] >= 0) stats[k] = Math.floor(b[k]);
        });
        if (Array.isArray(b.achievements)) stats.achievements = b.achievements.filter(function (id) {
          return PROGRESSION.achievements.some(function (a) { return a.id === id; });
        });
        if (Array.isArray(b.rewards)) stats.rewards = b.rewards.filter(function (id) {
          return PROGRESSION.rewards.some(function (r) { return r.id === id; });
        });
        stats.plus = b.plus === true;
        stats.level = levelFromScore(stats.score);
      } catch (e) { /* dados corrompidos não devem impedir o jogo de abrir */ }
    }
    function difficultyKey() { return settings.level; }
    function levelFromScore(score) { return Math.max(1, Math.floor(Math.sqrt(score / 100)) + 1); }
    function comboMultiplier(chain) { return Math.min(2, 1 + Math.max(0, chain - 1) * 0.1); }
    function difficultyMultiplier() { return PROGRESSION.difficultyMultiplier[difficultyKey()] || 1; }
    function addScore(points) {
      var previousLevel = Math.max(1, stats.level || 1);
      stats.score += Math.max(0, Math.round(points));
      stats.level = levelFromScore(stats.score);
      updateHUD();

      if (stats.level > previousLevel && state) {
        var gainedLevels = [];
        for (var level = previousLevel + 1; level <= stats.level; level++) gainedLevels.push(level);
        // Se o nível subir no último acerto ou no bônus final, mostramos a notícia na tela de resultado.
        if (state.over || (typeof hasWon === 'function' && hasWon())) {
          state.levelUps = (state.levelUps || []).concat(gainedLevels);
        } else {
          showLevelUp(stats.level, gainedLevels.length);
        }
      }
    }

    function showLevelUp(level, gainedCount) {
      var txt = gainedCount > 1
        ? '🎉 SUBIU ' + gainedCount + ' NÍVEIS! VOCÊ CHEGOU AO NÍVEL ' + level + '! Continue assim — cada acerto está fazendo diferença.'
        : '🎉 PARABÉNS! VOCÊ CHEGOU AO NÍVEL ' + level + '! Sua evolução está acontecendo. Continue mandando bem!';
      clearTimeout(toastTimer);
      el.toast.textContent = txt;
      replay(el.toast, 'show');
      toastTimer = setTimeout(function () { el.toast.classList.remove('show'); }, 3600);
      if (el.hubLevelBar) replay(el.hubLevelBar.parentElement, 'level-up');
    }
    function checkAchievements(detail) {
      var unlocked = [];
      PROGRESSION.achievements.forEach(function (a) {
        if (stats.achievements.indexOf(a.id) === -1 && a.test(stats, detail)) {
          stats.achievements.push(a.id);
          unlocked.push(a);
        }
      });
      return unlocked;
    }
    function checkRewards() {
      var unlocked = [];
      PROGRESSION.rewards.forEach(function (r) {
        var value = r.type === 'wins' ? stats.wins : stats.streak;
        if (value >= r.target && stats.rewards.indexOf(r.id) === -1) {
          stats.rewards.push(r.id);
          unlocked.push(r);
        }
      });
      return unlocked;
    }
    function updateHUD() {
      if (el.hudScore) el.hudScore.textContent = stats.score.toLocaleString('pt-BR') + ' pts';
      if (el.hudStreak) el.hudStreak.textContent = '🔥 ' + stats.streak;
      if (el.hubName) el.hubName.textContent = settings.name || 'Jogador';
      if (el.hubAvatar) el.hubAvatar.textContent = settings.avatar;
      if (el.hubLevel) el.hubLevel.textContent = stats.level;
      if (el.hubScore) el.hubScore.textContent = stats.score.toLocaleString('pt-BR');
      if (el.hubWinStreak) el.hubWinStreak.textContent = stats.streak;
      if (el.hubCognitive) el.hubCognitive.textContent = stats.cognitiveScore.toLocaleString('pt-BR');
      if (el.hubJourney) {
        el.hubJourney.textContent = stats.level >= 10 ? '🌳🏆' : stats.level >= 7 ? '🌳✨' : stats.level >= 4 ? '🌳' : stats.level >= 2 ? '🌿' : '🌱';
      }
      if (el.hubLevelBar) {
        // levelFromScore usa limites quadráticos: nível 1 < 100 XP, nível 2 < 400 XP etc.
        var currentLevel = Math.max(1, stats.level);
        var base = Math.pow(currentLevel - 1, 2) * 100;
        var next = Math.pow(currentLevel, 2) * 100;
        var earned = Math.max(0, stats.score - base);
        var needed = Math.max(1, next - base);
        var pct = Math.min(100, Math.max(0, (earned / needed) * 100));
        el.hubLevelBar.style.width = pct + '%';
        var track = el.hubLevelBar.parentElement;
        track.setAttribute('aria-valuenow', String(Math.round(pct)));
        track.setAttribute('aria-valuetext', Math.round(pct) + '% concluído');
        if (el.hubProgressText) {
          el.hubProgressText.textContent = earned.toLocaleString('pt-BR') + '/' + needed.toLocaleString('pt-BR') + ' XP para o nível ' + (currentLevel + 1);
        }
      }
    }
    function openHub() {
      updateHUD();
      el.hub.hidden = false;
      el.hubPanel.hidden = true;
      el.hubPanel.innerHTML = '';
      if (el.setup) el.setup.hidden = true;
      if (el.name) el.name.blur();
      fit();
    }
    function closeHub() {
      el.hub.hidden = true;
      if (el.hubBox) el.hubBox.style.zoom = '';
      fit();
    }
    function panelHTML(type) {
      if (type === 'progress') {
        return '<div class="panel-head"><b>📈 Progresso</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="panel-stats"><span><b>' + stats.totalGames + '</b><small>partidas</small></span><span><b>' + stats.wins + '</b><small>vitórias</small></span><span><b>' + stats.totalLetters + '</b><small>letras descobertas</small></span><span><b>' + stats.best + '</b><small>melhor sequência</small></span></div>' +
          '<p><strong>🧠 Atividade cognitiva:</strong> ' + stats.cognitiveScore + ' pontos de treino mental.</p><p><strong>🌱 Jornada:</strong> nível ' + stats.level + ' — continue aumentando a dificuldade para ganhar mais pontos.</p>';
      }
      if (type === 'achievements') {
        return '<div class="panel-head"><b>🏆 Conquistas</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="achievement-list">' + PROGRESSION.achievements.map(function(a) {
            var on = stats.achievements.indexOf(a.id) > -1;
            return '<div class="' + (on ? 'unlocked' : 'locked') + '"><span>' + a.icon + '</span><b>' + a.name + '</b><small>' + (on ? 'Desbloqueada' : 'Ainda bloqueada') + '</small></div>';
          }).join('') + '</div>';
      }
      if (type === 'ranking') {
        var score = stats.score;
        var rows = [
          ['ANA', 9840], ['CARLOS', 9420], [settings.name || 'VOCÊ', score], ['MARIA', 8110]
        ].sort(function(a,b){return b[1]-a[1];});
        return '<div class="panel-head"><b>🥇 Ranking</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="online-mock"><span>👥 ' + mockData.onlineNow.toLocaleString('pt-BR') + ' jogando agora</span><span>🎯 ' + mockData.categoryPlayers + ' nesta categoria</span><span>🏆 posição mockada #' + mockData.rank + '</span></div>' +
          '<p class="mock-note">Os outros jogadores são dados simulados nesta versão. Sua pontuação é real e local.</p>' +
          '<ol class="ranking">' + rows.map(function(r,i){ return '<li class="' + (r[0] === (settings.name || 'VOCÊ') ? 'me' : '') + '"><b>' + String(i+1).padStart(2,'0') + '</b><span>' + r[0] + '</span><strong>' + r[1].toLocaleString('pt-BR') + '</strong></li>'; }).join('') + '</ol>';
      }
      if (type === 'rewards') {
        return '<div class="panel-head"><b>🎁 Recompensas</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="reward-list">' + PROGRESSION.rewards.map(function(r){var on=stats.rewards.indexOf(r.id)>-1;return '<div class="' + (on?'unlocked':'locked') + '"><span>'+r.icon+'</span><b>'+r.name+'</b><small>'+r.text+'</small></div>';}).join('') + '</div>' +
          '<div class="club-card"><b>🎁 OPORTUNI CLUBE</b><p>Benefícios e descontos entram como integração futura. Nesta versão, a recompensa é apenas um mock visual.</p></div>';
      }
      if (type === 'plus') {
        return '<div class="panel-head"><b>✨ Conta Plus</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="plus-card"><strong>' + (stats.plus ? 'Plus ativo neste protótipo' : 'Uma experiência mais limpa') + '</strong><p>Sem anúncios, benefícios especiais, categorias antecipadas e estatísticas avançadas.</p><button class="start" type="button" id="plusMock">' + (stats.plus ? 'Plus ativo' : 'Ativar demonstração Plus') + '</button><small>Sem pagamento real nesta versão.</small></div>';
      }
      if (type === 'how') {
        return '<div class="panel-head"><b>🎮 Como jogar</b><button class="link panel-close" type="button">Fechar</button></div>' +
          '<div class="howto"><p><b>1 · Escolha letras</b><br>Use o teclado da tela ou o teclado físico.</p><p><b>2 · Descubra a palavra</b><br>Acertos revelam letras; erros montam o personagem.</p><p><b>3 · Use as pistas</b><br>As dicas escolhidas aparecem automaticamente e falam sobre a palavra.</p><p><b>4 · Ganhe XP</b><br>Vencer rende pontos, níveis e sequência de vitórias.</p><p class="howto-goal"><b>Objetivo:</b> complete a palavra antes de chegar ao sexto erro.</p></div>';
      }
      return '<div class="panel-head"><b>❤️ Apoie o projeto</b><button class="link panel-close" type="button">Fechar</button></div>' +
        '<div class="support-card"><strong>Ajude a manter o jogo gratuito</strong><p>Este espaço está preparado para um QR Code ou outra forma de apoio futura.</p><div class="qr-placeholder">QR<br>CODE</div><small>Placeholder — nenhuma cobrança é realizada.</small></div>';
    }
    function showPanel(type) {
      el.hubPanel.innerHTML = panelHTML(type);
      el.hubPanel.hidden = false;
      el.hubPanel.querySelectorAll('.panel-close').forEach(function(b){b.addEventListener('click',function(){el.hubPanel.hidden=true;});});
      var plusMock = el.hubPanel.querySelector('#plusMock');
      if (plusMock) plusMock.addEventListener('click',function(){stats.plus=true;save();showPanel('plus');});
      fit();
    }

    /* ---------- NAVEGAÇÃO DA JORNADA ---------- */
    /* Estes eventos ligam os botões do painel ao fluxo real do jogo. */
    el.hubPlay.addEventListener('click', function () {
      closeHub();
      newGame();
    });

    el.hubConfigure.addEventListener('click', function () {
      closeHub();
      openSetup();
    });

    el.hubClose.addEventListener('click', function () {
      /* Se já existe uma partida ativa, apenas fecha a Jornada e volta ao tabuleiro.
         Caso contrário, retorna para a configuração do jogador. */
      if (state && !state.over) {
        closeHub();
        fit();
      } else {
        closeHub();
        openSetup();
      }
    });

    document.querySelectorAll('#hub .hub-grid button[data-panel]').forEach(function (button) {
      button.addEventListener('click', function () {
        showPanel(button.getAttribute('data-panel'));
      });
    });

    el.resultNext.addEventListener('click', function () {
      el.result.hidden = true;
      newGame();
    });

    el.resultMenu.addEventListener('click', function () {
      el.result.hidden = true;
      openHub();
    });

    /* Dicas adicionais específicas por palavra. Não usamos contagem de letras nem letra inicial como dica. */
    var WORD_HINTS = {
      LAGARTIXA:['Costuma ficar em paredes e tetos para caçar insetos.','Pode soltar a cauda como mecanismo de defesa.','Seus dedos ajudam a aderir a superfícies.'],
      ORNITORRINCO:['Tem bico parecido com o de um pato e patas adaptadas para nadar.','O macho possui um esporão venenoso nas patas traseiras.'],
      AXOLOTE:['É famoso pelas brânquias externas que parecem plumas.','Consegue regenerar membros e partes de alguns órgãos.'],
      CAMALEAO:['Sua língua pode ser lançada rapidamente para capturar presas.','Seus olhos conseguem se movimentar em direções diferentes.'],
      RATATOUILLE:['O nome também é conhecido por um filme de animação sobre um rato cozinheiro.','Os legumes costumam ser cortados e cozidos juntos.'],
      CARBONARA:['A receita tradicional não leva creme de leite.','O calor da massa ajuda a formar um molho cremoso com ovo e queijo.'],
      GUACAMOLE:['O abacate é amassado e misturado com ingredientes como limão e cebola.','É servido com frequência como acompanhamento de comida mexicana.'],
      CROISSANT:['Sua massa é folhada e forma várias camadas finas.','É frequentemente servido no café da manhã com manteiga ou geleia.'],
      MICROSCOPIO:['É essencial em laboratórios para observar células.','Modelos ópticos usam lentes para ampliar a imagem.'],
      PARALELEPIPEDO:['Uma caixa de sapatos é um exemplo aproximado dessa forma.','Em geometria, suas faces opostas são paralelas.'],
      TERMOMETRO:['Pode indicar a temperatura corporal ou do ambiente.','Há modelos digitais, clínicos e meteorológicos.'],
      CRIPTOGRAFIA:['Uma chave pode ser necessária para decifrar a informação.','É usada para proteger mensagens e transações digitais.'],
      CIBERSEGURANCA:['Inclui práticas como autenticação multifator e atualização de sistemas.','Ajuda a reduzir riscos de phishing, malware e invasões.'],
      PROCESSADOR:['Sua velocidade costuma ser expressa em gigahertz.','Executa operações lógicas e aritméticas.'],
      BIODIVERSIDADE:['Inclui variedade genética, de espécies e de ecossistemas.','A conservação de habitats ajuda a protegê-la.'],
      FOTOSSINTESE:['A clorofila participa do processo.','Como resultado, as plantas liberam oxigênio.'],
      ESTALACTITES:['Costumam ser confundidas com formações que crescem do chão para cima.','Depósitos minerais se acumulam gota a gota em cavernas.'],
      SINFONIA:['É geralmente escrita para uma orquestra.','Beethoven compôs nove sinfonias numeradas.'],
      IMPROVISACAO:['O músico cria ideias no momento, sem seguir tudo nota por nota.','É comum em solos de jazz.'],
      CLARINETE:['O som é produzido por uma palheta presa ao bocal.','É comum em bandas, orquestras e grupos de choro.'],
      TRANSFORMERS:['Optimus Prime é um dos personagens mais conhecidos.','Os personagens alternam entre forma robótica e veículos.'],
      CAVALHEIROS:['Seus protagonistas usam armaduras associadas às constelações.','A história é conhecida também pelo nome Saint Seiya.'],
      POKEMON:['Pikachu é o mascote mais reconhecido da franquia.','As criaturas podem evoluir para outras formas.'],
      ASTRONAUTA:['Pode passar períodos em microgravidade.','Precisa de treinamento para operar equipamentos e usar traje espacial.'],
      VETERINARIA:['Pode atuar em clínicas, fazendas, laboratórios e saúde pública.','Entre suas atividades estão diagnóstico, prevenção e tratamento de doenças animais.'],
      PROGRAMADOR:['Trabalha com linguagens como Java, Python ou JavaScript.','Depura erros e testa o comportamento do software.'],
      ARQUEOLOGO:['Pode estudar cerâmicas, ferramentas, construções e sepultamentos.','O trabalho de campo envolve escavação e registro cuidadoso de evidências.'],
      ISLANDIA:['É conhecida por fontes termais e paisagens vulcânicas.','Sua capital é Reykjavík.'],
      SINGAPURA:['Tem quatro idiomas oficiais, incluindo inglês e mandarim.','É conhecida pelos jardins Gardens by the Bay.'],
      REYKJAVIK:['É a principal porta de entrada para conhecer a Islândia.','Seu nome significa algo próximo de “baía fumegante”.'],
      BUENOSAIRES:['O bairro La Boca é conhecido por casas coloridas.','A cidade tem uma avenida chamada 9 de Julho.'],
      JOANESBURGO:['Soweto é uma área urbana historicamente importante ligada à cidade.','É frequentemente chamada de Johannesburg em inglês.'],
      KUALALUMPUR:['As Torres Petronas já foram os edifícios mais altos do mundo.','Seu nome costuma ser abreviado como KL.'],
      SANFRANCISCO:['A ilha de Alcatraz fica em sua baía.','A Golden Gate é uma ponte suspensa de cor alaranjada.'],
      ANTANANARIVO:['É também chamada informalmente de Tana.','Fica no planalto central de Madagascar.'],
      LIECHTENSTEIN:['É um dos poucos países duplamente sem litoral.','Sua capital, Vaduz, fica às margens do Reno.'],
      MADAGASCAR:['A avenida dos Baobás é uma paisagem famosa da ilha.','A separação antiga do continente favoreceu espécies endêmicas.'],
      VLADIVOSTOK:['Seu nome pode ser traduzido como “senhor do Oriente”.','É o terminal oriental da Ferrovia Transiberiana.'],
      QUIRGUISTAO:['O lago Issyk-Kul é uma de suas paisagens naturais mais conhecidas.','Também é chamado de Quirguizistão em português.'],
      BRASIL:['Seu território é dividido em 26 estados e um Distrito Federal.','Brasília é sua capital, inaugurada em 1960.'],
      PORTUGAL:['Lisboa fica junto ao estuário do rio Tejo.','O país inclui os arquipélagos dos Açores e da Madeira.'],
      ARGENTINA:['O Aconcágua, o ponto mais alto das Américas, fica em seu território.','Sua moeda é o peso argentino.']
    };

    function buildHints(entry) {
      var specific = WORD_HINTS[norm(entry.w)] || [];
      /* Primeiro vêm as duas pistas escritas para a palavra; depois, pistas adicionais específicas. */
      return entry.h.concat(specific).filter(function (hint, index, all) {
        return typeof hint === 'string' && hint.trim() && all.indexOf(hint) === index;
      }).slice(0, HINT_MAX);
    }

    function fit() {
      var main = document.querySelector('main');
      var root = document.documentElement;
      if (!main) return;
      main.style.zoom = '';

      /* Os painéis modais continuam cabendo na janela independentemente do tamanho do jogo. */
      if (el.hub && !el.hub.hidden && el.hubBox) {
        el.hubBox.style.zoom = '';
        var hubHeight = Math.max(1, el.hubBox.scrollHeight);
        var hubWidth = Math.max(1, el.hubBox.scrollWidth);
        var hubZoom = Math.min(1, (window.innerHeight - 16) / hubHeight, (window.innerWidth - 16) / hubWidth);
        el.hubBox.style.zoom = String(Math.max(.35, hubZoom));
        root.classList.remove('scrolls');
        return;
      }
      if (!el.setup.hidden && el.setupBox) {
        el.setupBox.style.zoom = '';
        var setupHeight = Math.max(1, el.setupBox.scrollHeight);
        var setupWidth = Math.max(1, el.setupBox.scrollWidth);
        var setupZoom = Math.min(1, (window.innerHeight - 24) / setupHeight, (window.innerWidth - 24) / setupWidth);
        el.setupBox.style.zoom = String(Math.max(.55, setupZoom));
        root.classList.remove('scrolls');
        return;
      }
      if (el.result && !el.result.hidden) {
        root.classList.remove('scrolls');
        return;
      }

      /* Usa largura total em desktop: isso reduz a quantidade de linhas do teclado e a altura da partida. */
      var availableHeight = Math.max(1, window.innerHeight - el.topic.getBoundingClientRect().height - 8);
      var availableWidth = Math.max(1, window.innerWidth - 10);
      var naturalHeight = Math.max(1, main.scrollHeight);
      var naturalWidth = Math.max(1, main.scrollWidth);
      var scale = Math.min(1, availableHeight / naturalHeight, availableWidth / naturalWidth);
      main.style.zoom = String(Math.max(.48, scale));
      root.classList.remove('scrolls');
    }
    window.addEventListener('resize', fit);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    /* Reajusta quando a janela muda de tamanho e quando a fonte termina de carregar. */
    /* Placar: vitórias, derrotas, sequência atual de vitórias e melhor sequência (recorde). */
    var state, last = '', confettiTimer;
    /* state = dados da partida atual (criado em newGame); last = última palavra sorteada
       (para não repetir seguida); confettiTimer = temporizador que limpa os confetes. */
  
    function norm(c) { return c.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toUpperCase(); }
    /* Normaliza o texto: 'NFD' separa a letra do acento (É vira E + ´); o replace remove os acentos
       (\u0300-\u036f é a faixa dos acentos); toUpperCase deixa maiúsculo. Assim, digitar E acerta É. */
    function isLetter(c) { return /^[A-Z]$/.test(c); }
    /* Retorna true se c é uma única letra de A a Z. (/^...$/ é uma expressão regular: início e fim do texto.) */
    function levelOf(word) {
      /* Descobre a dificuldade de uma palavra pelo número de letras. */
      var n = norm(word).replace(/[^A-Z]/g, '').length;
      /* Normaliza, remove tudo que não é A-Z (hífens, por exemplo) e conta o tamanho. */
      return n <= LEVELS.easy.max ? 'easy' : n <= LEVELS.medium.max ? 'medium' : 'hard';
      /* Operador ternário (condição ? se sim : se não), encadeado: até 7 = easy; até 9 = medium; senão hard. */
    }
    function say(text, cls) { el.msg.textContent = text; el.msg.className = cls || ''; }
    /* Mostra uma mensagem e define sua classe CSS (warn/win/lose) para mudar a cor. Sem cls, fica sem classe. */
    function replay(node, cls) { node.classList.remove(cls); void node.offsetWidth; node.classList.add(cls); }
    /* Reinicia uma animação CSS: remove a classe, força o navegador a recalcular o layout
       (ler offsetWidth faz isso; "void" descarta o valor) e recoloca a classe. Sem isso, a animação não repetiria. */
  
    /* ---------- INICIAR PARTIDA ---------- */
    function newGame() {
      el.result.hidden = true;
      el.hub.hidden = true;
      // Sorteia dentro da categoria escolhida (ou de todas); prefere a dificuldade, se houver palavras dela.
      var pool = ALL.filter(function (x) { return settings.cat === 'all' || x.c.id === settings.cat; });
      /* pool = "sacola" de palavras candidatas: todas (modo Surpresa) ou só as da categoria escolhida. */
      var byLevel = pool.filter(function (x) { return levelOf(x.w) === settings.level; });
      /* Dentre as candidatas, as que têm a dificuldade escolhida. */
      if (byLevel.length) pool = byLevel;
      /* Se existir alguma dessa dificuldade, usa só essas. Senão, mantém todas (evita sortear de uma lista vazia). */
      var entry;
      /* entry = a palavra sorteada. */
      do { entry = pool[Math.floor(Math.random() * pool.length)]; } while (entry.w === last && pool.length > 1);
      /* Sorteia um índice aleatório (Math.random dá 0 a 0,999...; multiplicar pelo tamanho e arredondar para
         baixo com Math.floor dá um índice válido). Repete enquanto sair a mesma palavra da rodada anterior,
         desde que haja mais de uma opção. */
      last = entry.w;
      /* Guarda a palavra sorteada para comparar na próxima partida. */
  
      state = {
        /* Cria o estado de uma partida nova. */
        word: entry.w, key: norm(entry.w), cat: entry.c,
        /* word = palavra como exibida (com acento); key = versão sem acento, usada para comparar letras; cat = categoria. */
        hints: buildHints(entry), hintsShown: 0,
        /* hints = só as primeiras N dicas (N escolhido pelo jogador; slice recorta a lista); hintsShown = quantas já foram reveladas. */
        hits: [], misses: [], over: false, lost: false, won: false, chain: [], scoreThisGame: 0, cognitiveThisGame: 0, bestChain: 0, totalHits: 0, levelUps: []
        /* Estado da rodada: acertos, erros, combo, pontos e atividade cognitiva da partida. */
      };
  
      // Categoria SEMPRE visível no topo (mostra a categoria real da palavra sorteada).
      el.tIco.textContent = entry.c.i;
      /* Coloca o emoji da categoria na barra do topo. */
      el.tName.textContent = entry.c.n;
      el.stage.setAttribute('data-character', entry.c.id);
      el.stage.setAttribute('aria-label', 'Personagem da categoria ' + entry.c.n);
      /* A categoria define a identidade visual do personagem da rodada. */
      replay(el.topic, 'flash');
      /* Faz a barra piscar (animação "flash") para chamar atenção ao tema novo. */
  
      clearTimeout(confettiTimer);
      /* Cancela o temporizador de confete da partida anterior, se ainda estiver pendente. */
      el.confetti.innerHTML = '';
      /* Remove confetes que ainda estejam na tela. */
      state.chain = []; state.fresh = null; state.freshMiss = false;
      /* chain = letras certas seguidas nesta partida; fresh = letra recém-acertada (para animar); freshMiss = acabou de errar. */
      clearChain(); renderWins(); el.toast.classList.remove('show'); updateHUD();
      el.hook.innerHTML = ''; el.newBtn.classList.remove('urge'); el.newBtn.textContent = 'Nova partida';
      /* Apaga o incentivo da rodada anterior e devolve o botão ao normal. */
      /* Limpa a corrente de letras, redesenha a trilha de vitórias e esconde o aviso de marco. */
      el.kb.classList.remove('locked');
      /* Destrava o teclado (tira o visual apagado). */
      el.kb.querySelectorAll('button').forEach(function (b) { b.className = ''; });
      /* Limpa as classes hit/miss de todas as teclas, deixando-as "novas". */
      say('Tema: ' + entry.c.n + '. Escolha uma letra.', 'warn');
      /* Mensagem inicial, em cinza (classe warn). O + junta textos. */
      render();
      /* Desenha a tela com o estado novo. */
    }
  
    function renderCategoryCharacter() {
      if (!el.categoryCharacter || !state || !state.cat) return;
      var cfg = CATEGORY_CHARACTERS[state.cat.id] || CATEGORY_CHARACTERS.surpresa;
      el.categoryCharacter.setAttribute('data-character', state.cat.id);
      el.categoryCharacter.setAttribute('aria-label', cfg.label);
      el.categoryCharacter.classList.add('show-main');
      el.categoryCharacter.innerHTML = cfg.svg;
      el.categoryCharacter.querySelectorAll('.char-part').forEach(function(node) {
        var match = node.getAttribute('class').match(/p(\d)/);
        var part = match ? Number(match[1]) : 99;
        node.classList.toggle('show', state.misses.length >= part);
      });
      el.categoryCharacter.classList.toggle('finished', state.misses.length >= MAX_ERRORS);
    }

    function renderDangerMeter() {
      var errors = state.misses.length;
      var pct = state.over ? 100 : Math.round((errors / MAX_ERRORS) * 100);
      var categoryAdvice = {
        animais: 'Observe habitat, comportamento e características do animal.',
        comidas: 'Pense em sabor, ingredientes e aparência.',
        lugares: 'Imagine o ambiente, a função e o que existe no local.',
        objetos: 'Pense na utilidade, formato e uso cotidiano.',
        tecnologia: 'Relacione com computadores, programação ou dispositivos.',
        natureza: 'Lembre de paisagens, fenômenos e elementos naturais.',
        musica: 'Pense em instrumentos, sons, ritmos e formas de tocar.',
        desenhos: 'Pense nos personagens e nas características do desenho.',
        profissoes: 'Relacione a palavra com tarefas e ferramentas do trabalho.'
      };
      var advice = categoryAdvice[state.cat.id] || 'Use a categoria para eliminar possibilidades.';
      var stages = [
        ['Zona segura', 'Você está no controle. ' + advice],
        ['Atenção', 'Ainda dá para descobrir com calma. Use a categoria.'],
        ['Pista liberada', 'Uma pista pode aparecer aqui, se você escolheu receber dicas.'],
        ['Perigo', 'O personagem está ganhando forma. Cruze categoria e letras.'],
        ['Perigo alto', 'Olhe para a pista mais recente e elimine possibilidades.'],
        ['Última chance', 'Agora cada letra conta. Pense antes de arriscar.'],
        ['Fim da rodada', state.lost ? 'O personagem foi completado. Tente outra palavra.' : 'Palavra descoberta. Você dominou a rodada.']
      ];
      var st=state.over ? stages[MAX_ERRORS] : stages[Math.min(errors,MAX_ERRORS)];
      el.dangerTitle.textContent=st[0];
      el.dangerText.textContent=st[1];
      el.dangerCount.textContent=pct+'%';
      el.dangerBar.style.width=pct+'%';
      el.dangerBar.parentElement.setAttribute('data-level',String(errors));
      el.dangerBar.parentElement.setAttribute('aria-valuenow',String(pct));
      el.stage.classList.toggle('danger',errors>=5&&!state.over);
    }

    function renderHints() {
      el.hintList.innerHTML='';
      var max=Math.min(HINT_MAX,settings.hints,state.hints.length);
      for(var n=0;n<Math.min(state.hintsShown,max);n++){
        var li=document.createElement('li');
        li.textContent=state.hints[n];
        el.hintList.appendChild(li);
      }
      if(max===0) el.hintProgress.textContent='Nenhuma dica escolhida para esta rodada.';
      else {
        var left=Math.max(0,max-state.hintsShown);
        el.hintProgress.textContent=left>0 ? left+(left===1?' pista ainda pode ser liberada.':' pistas podem ser liberadas automaticamente.') : 'Todas as pistas escolhidas já foram liberadas.';
      }
    }

    function autoHint() {
      if(state.over) return;
      var max=Math.min(HINT_MAX,settings.hints,state.hints.length);
      if(max<=0 || state.hintsShown>=max) return;
      var target=Math.min(max,state.misses.length);
      if(target<=state.hintsShown) return;
      state.hintsShown=target;
      say('🧠 Pista '+target+' de '+max+' liberada.','warn');
      replay(el.hintList,'hintPulse');
    }

    /* ---------- DESENHAR A TELA ---------- */
    function renderWord() {
      /* Renderiza cada posição diretamente a partir da palavra original.
         A letra visível não depende do índice da palavra normalizada nem do estado da tecla. */
      if (!el.word || !state || typeof state.word !== 'string') return;
      el.word.replaceChildren();

      var chars = Array.from(state.word);
      var solved = state.won === true || (state.over === true && state.lost === false);
      var revealAll = solved || state.lost === true;
      var freshN = 0;

      chars.forEach(function (ch, i) {
        var normalizedChar = norm(ch);
        var letter = isLetter(normalizedChar);
        var revealed = letter && (revealAll || state.hits.indexOf(normalizedChar) !== -1);
        var span = document.createElement('span');
        span.className = 'cell';
        span.setAttribute('data-index', String(i));

        if (!letter) {
          span.classList.add('gap');
          span.textContent = ch;
        } else {
          /* Sempre escreve a letra original quando ela deve estar visível.
             O conteúdo é definido antes de anexar o nó ao DOM. */
          span.textContent = revealed ? ch : '';
          if (solved) {
            span.classList.add('win');
            span.setAttribute('data-revealed', 'true');
            span.style.setProperty('--i', String(i));
            span.style.animationDelay = '0ms';
          } else if (revealed) {
            span.setAttribute('data-revealed', 'true');
            if (state.fresh === normalizedChar) {
              span.classList.add('fresh');
              span.style.setProperty('--j', String(freshN++));
            }
            if (state.lost) span.classList.add('reveal');
          }
        }
        el.word.appendChild(span);
      });

      /* Guarda de integridade: na vitória, reconstrói as células a partir da palavra original.
         Isso cobre qualquer renderização intermediária ou divergência no conjunto de acertos. */
      if (solved) {
        var cells = el.word.querySelectorAll('.cell');
        chars.forEach(function (ch, i) {
          var cell = cells[i];
          if (!cell || !isLetter(norm(ch))) return;
          cell.textContent = ch;
          cell.classList.remove('gap', 'reveal', 'fresh');
          cell.classList.add('win');
          cell.setAttribute('data-revealed', 'true');
          cell.style.setProperty('--i', String(i));
        });
      }
    }

    function render() {
      /* Redesenha a tela inteira a partir de state. */
      renderWord();
      var all = state.hits.map(function (l) { return '<span class="hit">' + l + '</span>'; })
        .concat(state.misses.map(function (l) { return '<span class="miss">' + l + '</span>'; }));
      /* Monta uma lista de pedaços de HTML: cada acerto em <span class="hit"> e, depois (concat junta listas),
         cada erro em <span class="miss"> (o CSS risca os erros). */
      el.used.innerHTML = all.join(' ') || '<span style="color:var(--muted)">—</span>';
      /* join(' ') une tudo separado por espaço. Se a lista estiver vazia (texto vazio = falso para o ||),
         mostra um traço cinza "—". */
  
      el.parts.forEach(function (p, i) { p.classList.toggle('show', i < state.misses.length); });
      renderCategoryCharacter();
      renderDangerMeter();
      renderHints();
      updateHUD();
      /* A barra de perigo substitui o contador textual de erros. */
      fit();
      /* Reajusta o tamanho à janela (a lista de dicas, por exemplo, pode ter crescido). */
    }
  

    /* ---------- SEQUÊNCIA DE LETRAS CERTAS (corrente) ---------- */
    var chainTimer, toastTimer;
    function clearChain() {
      /* Esvazia a corrente e volta o rótulo ao texto inicial. */
      clearTimeout(chainTimer);
      el.chain.innerHTML = '';
      el.chainBox.removeAttribute('data-tier');
      el.chainLabel.textContent = 'Letras certas seguidas';
    }
    function addToChain(c) {
      /* Cada acerto seguido vira uma "bolha" com a letra. Quanto maior a corrente, mais "quente" fica. */
      if (!state.chain.length) clearChain();
      /* Se a corrente estava vazia (início ou logo após quebrar), recomeça limpa. */
      var prev = el.chain.querySelector('.last'); if (prev) prev.classList.remove('last');
      var b = document.createElement('span');
      b.className = 'bub last'; b.textContent = c;
      el.chain.appendChild(b);
      while (el.chain.children.length > 8) el.chain.removeChild(el.chain.firstChild);
      /* Mostra só as 8 últimas bolhas, para a corrente caber numa linha e o layout não pular. */
      var n = state.chain.push(c);
      /* Cada letra certa gera pontos; o multiplicador cresce com o combo e é limitado a 2x. */
      state.bestChain = Math.max(state.bestChain, n);
      state.totalHits++;
      stats.totalLetters++;
      var letterPoints = Math.round(PROGRESSION.letterBase * difficultyMultiplier() * comboMultiplier(n));
      state.scoreThisGame += letterPoints;
      state.cognitiveThisGame += Math.max(1, Math.round(difficultyMultiplier()));
      addScore(letterPoints);
      el.chainBox.setAttribute('data-tier', n >= 6 ? 3 : n >= 4 ? 2 : 1);
      /* Nível de "calor": 1 normal, 2 (4+ acertos) roxo, 3 (6+ acertos) dourado. O CSS muda as cores. */
      el.chainLabel.textContent = (n >= 3 ? '🔥 ' : '') + n + (n === 1 ? ' letra certa' : ' letras certas seguidas');
      replay(el.chainBox, 'bump');
    }
    function breakChain() {
      /* Errou: as bolhas se espalham e caem, e a corrente zera. */
      if (!state.chain.length) return;
      el.chain.querySelectorAll('.bub').forEach(function (b) {
        b.classList.remove('last');
        b.style.setProperty('--fx', (Math.random() * 90 - 45) + 'px');
        b.style.setProperty('--fr', (Math.random() * 120 - 60) + 'deg');
        b.classList.add('break');
      });
      el.chainBox.setAttribute('data-tier', 'broken');
      el.chainLabel.textContent = 'Sequência quebrada';
      replay(el.chainBox, 'bump');
      state.chain = [];
      chainTimer = setTimeout(clearChain, 1100);
    }
    function waveChain() {
      /* Vitória: as bolhas fazem uma ola, uma depois da outra. */
      var bubs = el.chain.querySelectorAll('.bub');
      bubs.forEach(function (b, i) { b.style.setProperty('--i', i); b.classList.add('wave'); });
      el.chainLabel.textContent = state.misses.length === 0 ? '✨ Rodada perfeita: nenhuma letra errada' : '✨ Palavra completa';
    }

    /* ---------- RODADAS GANHAS SEGUIDAS (estrelas) ---------- */
    function renderWins(mode, prev) {
      /* mode: 'add' (acabou de ganhar) | 'crumble' (acabou de perder; prev = sequência perdida) | nada (só desenha). */
      var n = mode === 'crumble' ? prev : stats.streak;
      var slots = Math.max(5, Math.ceil(Math.max(n, 1) / 5) * 5);
      /* Sempre mostra casas vazias até o próximo múltiplo de 5: dá a sensação de "meta" a alcançar. */
      el.trophies.innerHTML = '';
      for (var i = 0; i < slots; i++) {
        var s = document.createElement('span');
        s.className = 'star' + (i < n ? ' on' : '');
        s.textContent = '★';
        if (mode === 'add' && i === n - 1) s.className += ' stamp';
        if (mode === 'crumble' && i < n) { s.className += ' crumble'; s.style.setProperty('--i', i); }
        el.trophies.appendChild(s);
      }
      el.trophyLabel.textContent = 'Rodadas ganhas seguidas: ' + stats.streak + (stats.best > 0 ? ' · recorde ' + stats.best : '');
      if (mode === 'add') replay(el.trophyBox, 'bump');
      if (mode === 'crumble' && prev > 0) setTimeout(function () { if (stats.streak === 0) renderWins(); }, 1000);
      /* Depois que as estrelas caem, redesenha a trilha vazia. */
    }
    function milestone(n) {
      if (!n || n % 5 !== 0) return;
      var txt = n === 5 ? '🔥 5 VITÓRIAS! A SEQUÊNCIA PEGOU FOGO!' :
        n === 10 ? '🔥🔥 10 VITÓRIAS! VOCÊ ESTÁ EM OUTRO NÍVEL!' :
        n === 15 ? '🔥🔥🔥 15 VITÓRIAS! ISSO JÁ É DOMÍNIO!' :
        '🔥 ' + n + ' VITÓRIAS! A LENDA DA SEQUÊNCIA CONTINUA!';
      clearTimeout(toastTimer);
      el.toast.textContent = txt;
      replay(el.toast, 'show');
      toastTimer = setTimeout(function () { el.toast.classList.remove('show'); }, 3600);
      celebrate();
    }


    /* ---------- INCENTIVO PARA CONTINUAR JOGANDO ---------- */
    function nudge(kind, d) {
      /* Mostra uma frase que dá um bom motivo para jogar "só mais uma" e faz o botão chamar a atenção. */
      save();
      /* Fim de rodada: guarda o placar no perfil. */
      var line;
      if (kind === 'win') {
        var n = stats.streak;
        var target = n < 3 ? 3 : n < 5 ? 5 : n < 10 ? 10 : (Math.floor(n / 5) + 1) * 5;
        /* Próxima meta: 3, 5, 10 e depois de 5 em 5. */
        var left = target - n;
        line = (d.perfect ? '✨ Sem errar nenhuma! ' : '') + 'Falta' + (left > 1 ? 'm ' : ' ') + left + (left > 1 ? ' vitórias' : ' vitória') + ' para ' + target + ' seguidas. Bora?';
        el.newBtn.textContent = 'Próxima palavra';
      } else {
        line = d.missing <= 2 ? 'Faltaram só ' + d.missing + (d.missing === 1 ? ' letra' : ' letras') + '! Revanche?'
          : d.prev > 1 ? 'Sua sequência foi de ' + d.prev + ' vitórias. Dá para superar!'
          : 'Palavra nova, chance nova. Revanche?';
        el.newBtn.textContent = 'Revanche';
      }
      el.hook.innerHTML = line + '<small>Aperte Enter para continuar</small>';
      replay(el.hook, 'in');
      el.newBtn.classList.add('urge');
    }

    /* ---------- VITÓRIA E DERROTA ---------- */
    function hasWon() {
      /* Verifica se o jogador descobriu todas as letras. */
      return state.key.split('').every(function (k) { return !isLetter(k) || state.hits.indexOf(k) > -1; });
      /* every = "todos os itens passam no teste?". Cada caractere precisa: não ser letra (hífen conta como ok)
         OU já estar entre os acertos. Se todos passarem, é vitória. */
    }
  
    function celebrate() {
      /* Cria a chuva de confetes. */
      var colors = ['#5b3df5', '#ffb703', '#12a56b', '#e5384f', '#1d1a3b', '#ff8fab'];
      /* Paleta dos confetes, combinando com o tema (vinho, dourado, preto...). */
      for (var n = 0; n < 110; n++) {
        /* Repete 80 vezes: um confete por volta. */
        var p = document.createElement('div');
        /* Cria uma <div> para o confete. */
        p.className = 'confetto' + (n % 3 === 0 ? ' round' : '');
        /* Aplica a classe que dá forma e a animação de queda. */
        p.style.left = Math.random() * 100 + 'vw';
        /* Posição horizontal aleatória, de 0 a 100% da largura da tela (vw = % da largura). */
        p.style.background = colors[Math.floor(Math.random() * colors.length)];
        /* Cor sorteada da paleta. */
        p.style.animationDuration = (2.5 + Math.random() * 2.5) + 's';
        /* Duração da queda aleatória, entre 2,5 e 5 segundos: uns caem mais rápido que outros. */
        p.style.animationDelay = (Math.random() * 0.8) + 's';
        /* Atraso aleatório de até 0,8s para não caírem todos juntos. */
        p.style.setProperty('--dx', (Math.random() * 160 - 80) + 'px');
        /* Variável CSS --dx: deslize lateral entre -80px e +80px (usada no @keyframes fall). */
        p.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        /* Variável CSS --rot: giro entre -360° e +360°. */
        el.confetti.appendChild(p);
        /* Coloca o confete na camada da tela. */
      }
      confettiTimer = setTimeout(function () { el.confetti.innerHTML = ''; }, 6000);
      /* Depois de 6 segundos (6000 ms), remove todos os confetes do HTML para não acumular elementos. */
    }
  
    function finish(lost) {
      /* Fecha a rodada e transforma o resultado em progressão persistente. */
      state.over = true; state.lost = lost; state.won = !lost;
      if (!lost) {
        /* Sincroniza o conjunto de acertos com a palavra completa para evitar estados visuais divergentes. */
        Array.from(new Set(Array.from(state.key).filter(function (ch) { return isLetter(ch); }))).forEach(function (ch) {
          if (state.hits.indexOf(ch) === -1) state.hits.push(ch);
        });
      }
      el.kb.classList.add('locked');
      stats.totalGames++;

      var unlockedAchievements = [];
      var unlockedRewards = [];
      var resultBonus = 0;

      if (lost) {
        var prevStreak = stats.streak;
        stats.losses++; stats.streak = 0;
        renderWins('crumble', prevStreak);
        var missing = state.key.split('').filter(function (k, i, a) {
          return isLetter(k) && state.hits.indexOf(k) < 0 && a.indexOf(k) === i;
        }).length;
        nudge('lose', { missing: missing, prev: prevStreak });
        say('Fim de jogo, ' + settings.name + '. A palavra era ' + state.word + '.', 'lose');
        stats.cognitiveScore += state.cognitiveThisGame;
      } else {
        var prevStreak = stats.streak;
        stats.wins++;
        stats.streak++;
        stats.best = Math.max(stats.best, stats.streak);
        stats.letterBest = Math.max(stats.letterBest, state.bestChain);

        var winBase = Math.round(PROGRESSION.winBonus * difficultyMultiplier());
        var streakBonus = Math.round(stats.streak * 15 * difficultyMultiplier());
        var perfectBonus = state.misses.length === 0 ? PROGRESSION.perfectBonus : 0;
        resultBonus = winBase + streakBonus + perfectBonus;
        addScore(resultBonus);
        state.scoreThisGame += resultBonus;
        state.cognitiveThisGame += Math.round(10 * difficultyMultiplier()) + Math.min(20, stats.streak);
        stats.cognitiveScore += state.cognitiveThisGame;

        renderWins('add'); milestone(stats.streak); waveChain();
        nudge('win', { perfect: state.misses.length === 0 });
        say('Vitória, ' + settings.name + '! Você descobriu a palavra.', 'win');
        celebrate();
      }

      stats.letterBest = Math.max(stats.letterBest, state.bestChain);
      stats.level = levelFromScore(stats.score);
      unlockedAchievements = checkAchievements(state);
      unlockedRewards = checkRewards();
      save();
      updateHUD();
      /* Revela a palavra inteira antes de abrir a tela de resultado. */
      renderWord();
      renderDangerMeter();
      renderHints();
      renderResult(lost, unlockedAchievements, unlockedRewards);
    }

    function renderResult(lost, achievements, rewards) {
      /* Resultado concentra recompensa, progressão e próximo passo sem mandar o jogador embora. */
      el.resultTitle.textContent = lost ? 'Quase lá.' : 'Você venceu!';
      el.resultKicker.textContent = lost ? 'Partida encerrada' : 'Partida finalizada';
      el.resultWord.textContent = lost ? 'A palavra era ' + state.word + '.' : 'Palavra: ' + state.word;
      el.resultPoints.textContent = (state.scoreThisGame >= 0 ? '+' : '') + state.scoreThisGame.toLocaleString('pt-BR');
      el.resultCombo.textContent = state.bestChain;
      el.resultStreak.textContent = stats.streak;
      el.resultCognitive.textContent = '+' + state.cognitiveThisGame;

      if (el.resultLevelUp) {
        if (state.levelUps && state.levelUps.length) {
          var lastLevel = state.levelUps[state.levelUps.length - 1];
          el.resultLevelUp.hidden = false;
          el.resultLevelUp.innerHTML = '<b>🎉 Nível novo desbloqueado!</b><span>Parabéns! Você chegou ao nível ' + lastLevel + '. Continue praticando — sua evolução está aparecendo.</span>';
        } else {
          el.resultLevelUp.hidden = true;
          el.resultLevelUp.innerHTML = '';
        }
      }

      if (achievements.length) {
        el.resultAchievement.hidden = false;
        el.resultAchievement.innerHTML = '<b>🏆 Nova conquista!</b><span>' + achievements.map(function(a){return a.icon + ' ' + a.name;}).join(' · ') + '</span>';
      } else el.resultAchievement.hidden = true;

      if (rewards.length) {
        el.resultReward.hidden = false;
        el.resultReward.innerHTML = '<b>🎁 Nova recompensa!</b><span>' + rewards.map(function(r){return r.icon + ' ' + r.name;}).join(' · ') + '</span>';
      } else el.resultReward.hidden = true;

      /* Publicidade é apenas mock e só aparece no encerramento; Plus não recebe esse espaço. */
      el.mockAd.hidden = stats.plus;
      el.result.hidden = false;
      el.resultNext.textContent = lost ? 'Tentar novamente' : 'Próxima palavra';
    }

    /* ---------- TENTATIVA ---------- */
    function guess(raw) {
      /* Processa uma tentativa de letra. "raw" é o texto como veio (do teclado físico ou virtual). */
      if (!state || state.over) return;
      /* Se não há partida ou ela já acabou, ignora (return sai da função). */
      var c = norm(raw);
      /* Normaliza: tira acento e deixa maiúsculo. */
      if (raw.length !== 1 || !isLetter(c)) { say('Digite apenas letras de A a Z.', 'warn'); return; }
      /* Valida: precisa ser exatamente 1 caractere e uma letra A–Z. Senão avisa e sai. */
      if (state.hits.indexOf(c) > -1 || state.misses.indexOf(c) > -1) { say('A letra ' + c + ' já foi usada.', 'warn'); return; }
      /* Se a letra já foi tentada (acerto ou erro), avisa e sai, sem punir o jogador. */
  
      var btn = el.kb.querySelector('[data-k="' + c + '"]');
      /* Encontra a tecla virtual dessa letra pelo atributo data-k (ex.: [data-k="A"]). */
      if (state.key.indexOf(c) > -1) {
        /* Se a letra existe na palavra (versão sem acento): */
        state.hits.push(c); btn.className = 'hit';
        /* Registra o acerto (push adiciona ao fim da lista) e pinta a tecla de verde. */
        say('A letra ' + c + ' está na palavra.', '');
        state.fresh = c; addToChain(c);
        /* Marca a letra para animar na palavra e a adiciona à corrente de acertos seguidos. */
        /* Mensagem neutra (sem classe). */
      } else {
        /* Senão, é um erro: */
        state.misses.push(c); btn.className = 'miss';
        /* Registra o erro e risca a tecla. */
        say('A letra ' + c + ' não está em ' + state.cat.n.toLowerCase() + '. Pense no tema!', '');
        /* Mensagem lembrando o tema (toLowerCase deixa o nome da categoria em minúsculas). */
        replay(el.stage, 'shake'); // balança o boneco a cada erro
        state.freshMiss = true; breakChain(); replay(el.vignette, 'hurt');
        autoHint();
        /* Erro: quebra a corrente de letras e acende a vinheta vermelha nas bordas da tela. */
        /* Dispara a animação de tremor no desenho. */
      }
      if (hasWon()) finish(false);
      /* Se completou a palavra, encerra com vitória. */
      else if (state.misses.length >= MAX_ERRORS) finish(true);
      /* Senão, se chegou a 6 erros, encerra com derrota. */
      render();
      /* Redesenha a tela com tudo atualizado. */
      state.fresh = null; state.freshMiss = false;
      /* Zera os "avisos" de animação, para não repetirem no próximo render. */
    }
  
    /* ---------- EVENTOS ---------- */
    'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(function (l) {
      /* Quebra o alfabeto em letras e, para cada uma (l), cria uma tecla virtual: */
      var b = document.createElement('button');
      /* Cria um <button>. */
      b.type = 'button'; b.textContent = l; b.setAttribute('data-k', l);
      /* Define o tipo, o texto da tecla e o atributo data-k (que o guess usa para achar o botão). */
      b.addEventListener('click', function () { guess(l); });
      /* Ao clicar, chama guess com essa letra. */
      el.kb.appendChild(b);
      /* Insere a tecla no teclado da tela. */
    });
  
    document.addEventListener('keydown', function (e) {
      /* Escuta qualquer tecla pressionada no teclado físico. "e" descreve o evento. */
      if (!el.setup.hidden) return;
      if (e.key === 'Enter' && state && state.over && e.target.tagName !== 'BUTTON') { newGame(); return; }
      /* Fim de partida: Enter começa a próxima (se o foco está num botão, o próprio botão já cuida disso). */
      /* Se a tela de configuração está aberta, não joga (assim digitar o nome não gasta letras). */
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      /* Ignora atalhos (Ctrl+C, Cmd+R, Alt+...), para não atrapalhar o navegador. */
      if (e.key.length !== 1 || e.key === ' ') return;
      /* Ignora teclas especiais (Enter, Shift, setas têm nome com mais de 1 caractere) e o espaço. */
      guess(e.key);
      /* Tenta a letra digitada. */
    });
  
    el.newBtn.addEventListener('click', newGame);
    /* Clicar em "Nova partida" chama newGame diretamente (sem parênteses: passamos a função, não a executamos). */
  
    /* ---------- CONFIGURAÇÃO ---------- */
    function mark(group, attr, value) {
      /* Marca visualmente qual botão de um grupo está selecionado.
         group = o grupo; attr = nome do atributo (ex.: 'data-level'); value = valor escolhido. */
      group.querySelectorAll('button').forEach(function (b) {
        /* Para cada botão do grupo: */
        b.setAttribute('aria-checked', String(b.getAttribute(attr) === String(value)));
        /* aria-checked fica "true" só no botão cujo atributo é igual ao valor escolhido, e "false" nos demais.
           String(...) converte para texto, pois atributos HTML são sempre texto. O CSS usa esse atributo para pintar. */
      });
    }
  
    // Monta o seletor de categorias (carrossel com scroll): "Surpresa" + uma carta por categoria.
    [{ id: 'all', n: 'Surpresa', i: '🎲', c: ALL.length }].concat(CATS.map(function (c) {
      /* Começa com uma lista de 1 item (a carta "Surpresa", com o total de palavras em c) e concatena
         a lista gerada por CATS.map, que transforma cada categoria num objeto simplificado: */
      return { id: c.id, n: c.n, i: c.i, c: c.w.length };
      /* id, nome, emoji e quantidade de palavras da categoria. */
    })).forEach(function (c) {
      /* Para cada carta da lista final (Surpresa + categorias), cria um botão: */
      var b = document.createElement('button');
      /* Novo botão. */
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('data-cat', c.id);
      /* Tipo botão, papel de "radio" (acessibilidade) e data-cat guardando o id da categoria. */
      b.innerHTML = '<span class="ci">' + c.i + '</span><b>' + c.n + '</b><small>' + c.c + ' palavras</small>';
      /* Conteúdo da carta: emoji, nome em negrito e contagem de palavras. */
      el.cats.appendChild(b);
      /* Adiciona a carta ao carrossel. */
    });
    el.cats.addEventListener('click', function (e) {
      /* Um único "ouvinte" no carrossel inteiro (delegação de eventos): funciona para qualquer carta clicada. */
      var b = e.target.closest('button'); if (!b) return;
      /* e.target = onde se clicou (pode ser o emoji dentro da carta); closest sobe até o botão.
         Se o clique não foi em botão, sai. */
      settings.cat = b.getAttribute('data-cat');
      /* Guarda a categoria escolhida. */
      refreshSetup();
      /* Atualiza a tela de configuração (marca a carta selecionada). */
      b.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
      /* Rola o carrossel suavemente para centralizar a carta clicada. */
    });
    // Roda do mouse rola o carrossel na horizontal.
    el.cats.addEventListener('wheel', function (e) {
      /* Escuta a roda do mouse sobre o carrossel. */
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX) && el.cats.scrollWidth > el.cats.clientWidth) {
        /* Se o movimento da roda é mais vertical que horizontal E o conteúdo é mais largo que a área visível
           (ou seja, há o que rolar): */
        el.cats.scrollLeft += e.deltaY; e.preventDefault();
        /* converte a rolagem vertical em horizontal e impede a página de rolar para baixo. */
      }
    }, { passive: false });
    /* passive:false avisa ao navegador que podemos chamar preventDefault (necessário para bloquear a rolagem). */
  
    function refreshSetup() {
      mark(el.cats,'data-cat',settings.cat);
      mark(el.levels,'data-level',settings.level);
      mark(el.avatars,'data-av',settings.avatar);
      mark(el.hintChoices,'data-hints',String(settings.hints));
      el.setupNote.textContent=LEVELS[settings.level].note;
      el.hintValue.textContent=String(settings.hints);
      el.hintNote.textContent=settings.hints===0?'Sem dicas automáticas.':(settings.hints===1?'1 pista será liberada automaticamente.':settings.hints+' pistas serão liberadas automaticamente conforme o perigo aumentar.');
      el.startBtn.disabled=el.name.value.trim()==='';
    }
    function openSetup() {
      /* Abre a tela de configuração. */
      el.name.value = settings.name;
      var back = settings.name !== '';
      /* back = já existe um perfil cadastrado neste aparelho. */
      el.setupTitle.textContent = back ? 'Seu perfil' : 'Criar seu perfil';
      el.welcome.hidden = !back;
      el.welcomeText.textContent = 'Bem-vindo de volta, ' + settings.name + '! ' + (stats.wins ? stats.wins + (stats.wins === 1 ? ' vitória' : ' vitórias') + ' até agora.' : 'Bora jogar?');
      el.startBtn.textContent = back ? 'Começar partida' : 'Cadastrar e jogar';
      /* Preenche o campo com o nome já usado (ou vazio na primeira vez). */
      el.setup.hidden = false;
      /* Mostra a tela (tira o atributo hidden). */
      if (state) render();
      /* Só redesenha o tabuleiro se já existir uma partida ativa. */
      fit();
      /* Ajusta o tabuleiro à janela. */
    }
    el.levels.addEventListener('click', function (e) {
      /* Clique em algum botão de dificuldade: */
      var b = e.target.closest('button'); if (!b) return;
      /* Descobre o botão clicado; se não foi botão, sai. */
      settings.level = b.getAttribute('data-level');
      /* Guarda o nível escolhido (easy, medium ou hard). */
      /* (a quantidade de dicas escolhida pelo jogador é mantida ao trocar a dificuldade) */
      /* Ajusta as dicas para o padrão desse nível (o jogador ainda pode mudar depois). */
      refreshSetup();
      /* Atualiza a tela. */
    });
    el.hintChoices.addEventListener('click', function(e){ var b=e.target.closest('button'); if(!b)return; settings.hints=Math.min(HINT_MAX,Math.max(0,Number(b.getAttribute('data-hints'))||0)); refreshSetup(); });
    AVATARS.forEach(function (av) {
      /* Cria um botão por avatar no cadastro. */
      var b = document.createElement('button');
      b.type = 'button'; b.setAttribute('role', 'radio'); b.setAttribute('data-av', av); b.setAttribute('aria-label', 'Avatar ' + av); b.textContent = av;
      el.avatars.appendChild(b);
    });
    el.avatars.addEventListener('click', function (e) {
      var b = e.target.closest('button'); if (!b) return;
      settings.avatar = b.getAttribute('data-av'); refreshSetup();
    });
    el.forget.addEventListener('click', function () {
      /* "Não sou eu": apaga o perfil deste aparelho para um novo jogador se cadastrar. */
      if (!window.confirm('Apagar o perfil e as estatísticas salvos neste aparelho?')) return;
      try { localStorage.removeItem(STORE_KEY); } catch (e) {}
      settings.name = ''; settings.avatar = AVATARS[0]; settings.hints = 2; settings.level = 'medium'; settings.cat = 'all';
      stats.wins = stats.losses = stats.streak = stats.best = 0;
      stats.score = stats.level = stats.cognitiveScore = stats.letterBest = stats.totalLetters = stats.totalGames = 0;
      stats.achievements = []; stats.rewards = []; stats.plus = false;
      openSetup();
    });
    el.name.addEventListener('input', refreshSetup);
    /* A cada letra digitada no nome ("input"), reavalia se o botão Começar deve ficar ativo. */
  
    function start() {
      /* Fecha a configuração e começa a jogar. */
      var n = el.name.value.trim();
      /* Nome digitado, sem espaços nas pontas. */
      if (!n) { el.name.focus(); return; }
      /* Se estiver vazio, devolve o foco ao campo e não inicia. */
      settings.name = n;
      /* Guarda o nome. */
      el.setup.hidden = true;
      /* Esconde a tela de configuração. */
      el.player.textContent = settings.avatar + ' ' + n + ' · ' + LEVELS[settings.level].label;
      save();
      /* Cadastro concluído: guarda o perfil neste aparelho. */
      /* Mostra "Nome · Dificuldade" no cabeçalho. */
      el.player.textContent = settings.avatar + ' ' + n + ' · ' + LEVELS[settings.level].label;
      openHub();
      /* O perfil entra primeiro no painel principal; o gameplay só começa ao escolher "Jogar agora". */
    }
    el.startBtn.addEventListener('click', start);
    /* Clique em "Começar partida" chama start. */
    el.name.addEventListener('keydown', function (e) { if (e.key === 'Enter') start(); });
    /* Apertar Enter no campo do nome também começa o jogo. */
    el.changeBtn.addEventListener('click', openSetup);
    /* "Trocar categoria" reabre a configuração. */
  
    load();
    /* Antes de abrir o menu, recupera o perfil salvo (se houver). */
    openSetup();
    /* Última linha: ao carregar a página, abre a tela de configuração. É o ponto de partida de tudo. */
  })();