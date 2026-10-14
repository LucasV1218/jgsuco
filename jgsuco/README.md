# Jogo da Forca — Jornada

Jogo da Forca desenvolvido em HTML, CSS e JavaScript puro. A evolução mantém a mecânica original e acrescenta uma camada de progressão local: pontuação, combos, sequência de vitórias, níveis, conquistas, recompensas, ranking mockado, Oportuni Clube, espaço de apoio, Conta Plus e tela de resultado.

## Stack

- HTML5
- CSS3
- JavaScript Vanilla
- `localStorage`
- Sem framework e sem backend.

## Estrutura

```text
jgsuco/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Funcionalidades

### Gameplay
- categorias de palavras;
- dificuldade Fácil, Médio e Difícil;
- dicas configuráveis;
- teclado virtual;
- teclado físico;
- validação de letras repetidas;
- 6 erros máximos;
- feedback visual e sonoro apenas via animações CSS;
- tela de resultado antes da próxima partida.

### Progressão
- pontuação por letra;
- bônus de palavra concluída;
- multiplicador de combo por acertos consecutivos;
- sequência de vitórias;
- recorde de sequência;
- nível calculado pela pontuação;
- atividade cognitiva lúdica, sem finalidade médica;
- conquistas;
- recompensas por vitórias e sequências;
- persistência local.

### Experiência contínua
- perfil do jogador;
- painel principal;
- progresso;
- ranking com dados simulados;
- recompensas;
- Oportuni Clube como mock;
- Conta Plus como demonstração;
- área de apoio com QR Code placeholder;
- espaço publicitário mockado somente após a partida.

## Regra de pontuação

As regras ficam centralizadas em `PROGRESSION`, no `script.js`.

- Fácil: multiplicador base 1x.
- Médio: multiplicador 1,35x.
- Difícil: multiplicador 1,8x.
- Cada acerto concede pontos.
- O combo aumenta o valor do próximo acerto até um limite de 2x.
- Vitória concede bônus.
- Vitória perfeita concede bônus adicional.
- Sequências de vitórias aumentam o bônus.

O objetivo é criar sensação de domínio e progressão sem depender de moedas, energia ou sistemas paralelos.

## Dados simulados

Ranking e números de jogadores online são explicitamente mockados. Eles não representam usuários reais.

A camada `mockData` foi separada para facilitar futura substituição por API, Supabase, Firebase ou outro serviço.

## Persistência

O navegador salva:

- nome;
- avatar;
- categoria;
- dificuldade;
- dicas;
- pontuação;
- nível;
- vitórias e derrotas;
- sequência e recorde;
- letras descobertas;
- melhor combo;
- atividade cognitiva;
- conquistas;
- recompensas;
- preferência Plus.

## Como executar

Abra `index.html` diretamente ou use:

```bash
python -m http.server 8000
```

Depois acesse `http://localhost:8000`.

## Testes mínimos realizados

- validação de sintaxe JavaScript com `node --check`;
- conferência estrutural dos IDs HTML usados pelo JavaScript;
- conferência de persistência e migração de campos novos com defaults;
- conferência da regra de progressão e recompensas.

## Design / UX

O projeto preserva o design system atual baseado em:

- fundo lavanda;
- índigo escuro;
- roxo como marca;
- verde para acerto;
- vermelho para erro;
- dourado para marcos;
- Lexend;
- cartões arredondados;
- sombras sólidas;
- feedback visual curto.

A evolução adiciona hierarquia de produto e mantém o gameplay visualmente limpo.

## Arquitetura

O JavaScript está organizado conceitualmente em:

```text
CONFIGURAÇÃO
↓
ESTADO DO JOGADOR
↓
ESTADO DA PARTIDA
↓
DADOS / MOCKS
↓
FUNÇÕES DO JOGO
↓
FUNÇÕES DE PROGRESSÃO
↓
FUNÇÕES DE RECOMPENSA
↓
FUNÇÕES DE INTERFACE
↓
EVENTOS
```

Não foram introduzidos frameworks, backend, autenticação real, pagamentos, publicidade real ou integrações reais com parceiros.

## Autor

LucasV1218


## Atualização de interface — barra de perigo e personagens por categoria

- O contador textual `Erros 0 / 6` foi removido.
- A partida agora usa uma barra de perigo de 0% a 100%, com estados de segurança, atenção, perigo e última chance.
- A quantidade de dicas é escolhida antes da partida, de 0 a 5. As pistas escolhidas são liberadas automaticamente conforme os erros aumentam; não existe botão manual de pedir dica.
- O placar de pontos do rodapé foi removido. A pontuação continua existindo internamente para a Jornada, nível, ranking e recompensas.
- O personagem é construído progressivamente em seis erros: cabeça, cabelo, corpo, mãos, pés e elemento visual da categoria.
- Cada categoria possui identidade visual própria: Animais, Comidas, Lugares, Objetos, Tecnologia, Natureza, Música e Profissões.
- A mensagem da barra usa o contexto da categoria para orientar o raciocínio sem revelar a resposta.


## Atualização V4 — personagens e dicas

- Cada categoria possui um personagem/objeto vetorial próprio dentro da moldura da forca.
- O personagem é construído em 6 etapas visuais conforme os erros.
- Dicas configuráveis de 0 a 5 antes da partida.
- Menu `Como jogar` com instruções rápidas.
- Fonte geral ampliada sem barras de rolagem visíveis.
- Mais palavras foram adicionadas em todas as categorias, cobrindo melhor Fácil, Médio e Difícil pelo tamanho da resposta.


## Atualização V5 — Jornada, XP e enquadramento da forca

- A Jornada do jogador foi reorganizada para mostrar todos os tópicos sem rolagem no painel principal; o layout se ajusta ao tamanho da janela.
- Ao selecionar um tópico, seu conteúdo abre imediatamente em um painel sobreposto; o botão Fechar retorna aos tópicos.
- A barra de progresso agora usa a mesma fórmula que calcula o nível e exibe o XP conquistado e o necessário para o próximo nível.
- Subidas de nível durante uma partida exibem uma mensagem de parabéns e incentivo. Se o nível mudar no acerto final ou no bônus da vitória, a mensagem aparece na tela de resultado.
- O personagem vetorial foi aumentado e alinhado ao ponto de suspensão da corda; a altura da coluna também foi ajustada para conectar com a viga.
- O personagem foi explicitamente tornado visível no render, evitando o estado invisível causado pela classe de opacidade inicial.

### Verificações da V5

- `node --check script.js`
- IDs usados por `getElementById` conferidos contra `index.html`.
- Fórmula da barra verificada nos limites de XP dos níveis.
- Abertura visual em Chromium headless não pôde ser validada neste ambiente: o processo do navegador trava antes de gerar o DOM, por limitações de DBus/zygote do ambiente de execução.


## Ajustes V6

- Mascotes vetoriais refeitos em seis camadas coerentes com cada categoria: gato, pizza, castelo, mochila, robô, árvore, guitarra, personagem cartunesco, bombeiro e criatura surpresa.
- Ao vencer, o render revela explicitamente todas as letras da resposta, sem depender da lista interna de acertos para preencher as células.
- Tabuleiro ampliado para aproveitar até 1120 px no desktop, teclado virtual com maior área útil e regras responsivas para evitar rolagem de página.
- Ajuste interno de escala considera altura e largura da janela, sem exigir zoom manual do navegador.


## Ajustes V7
- A palavra agora possui um estado explícito de vitória e uma renderização de segurança que escreve todas as letras da palavra original.
- Ao concluir uma palavra, o conjunto de acertos é sincronizado com todas as letras únicas da solução antes da exibição do resultado.
- Personagens humanoides receberam braços retos, mãos alinhadas e pés voltados para fora, em vez de pés virados para dentro.
- CSS reforça que células reveladas jamais fiquem visualmente vazias.


## Atualizações V9

- Jornada do jogador com ação principal mais evidente e cartões de navegação refinados.
- Como jogar reescrito em instruções rápidas e práticas.
- Dicas focadas em características reais da palavra secreta; removidas pistas genéricas de quantidade de letras e inicial.
- A quantidade de dicas exibidas respeita as pistas disponíveis para cada palavra e o limite escolhido pelo jogador (até cinco).
- Categoria Lugares reformulada para conter apenas países e cidades, incluindo palavras longas para o nível difícil.
- Banco ampliado com palavras novas e desafiadoras em várias categorias.
- Barra da rodada chega a 100% ao encerrar por vitória ou derrota, independentemente da dificuldade e da quantidade de dicas.
- Braços e pernas do personagem de Profissões ajustados para uma postura mais reta.
