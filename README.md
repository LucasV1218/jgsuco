## Jogo da forca com suco

Jogo da forca com suco é um jogo de forca desenvolvido em HTML, CSS e JavaScript puro, pensado para funcionar diretamente no navegador sem necessidade de instalação de dependências ou build tools.

O projeto tem foco em experiência divertida, interface visual marcante e mecânica simples de jogo: o jogador deve descobrir a palavra secreta antes de completar o boneco da forca.

## Visão geral

Esse repositório contém uma versão completa de um jogo da forca com:

- categorias de palavras;
- níveis de dificuldade;
- dicas por partida;
- teclado virtual e suporte ao teclado físico;
- sistema de estatísticas e streaks;
- perfil do jogador salvo no navegador;
- animações visuais e feedback em tempo real.

## Stack

- HTML5
- CSS3
- JavaScript (Vanilla JS)
- LocalStorage para persistência local

## Funcionalidades principais

- Escolha de categoria entre várias opções;
- Escolha de dificuldade (fácil, médio, difícil);
- Sistema de dicas com aumento gradual de ajuda;
- Letras usadas, acertos e erros em tempo real;
- Registro de vitórias, derrotas e sequência de vitórias;
- Tela de configuração com nome, avatar e preferências do jogador;
- Feedback visual com confetes, vinheta, toasts e animações;
- Compatibilidade com dispositivos de diferentes tamanhos.

## Estrutura do projeto

```text
jgsuco/
├── README.md
├── index (2).html
├── script.js
├── style.css
└── assets/ (se houver em versões futuras)
```

### Arquivos principais

- `index (2).html`: estrutura da interface do jogo e layout principal.
- `style.css`: estilos visuais, temas, animações, layout responsivo e acessibilidade.
- `script.js`: lógica do jogo, categorias, sorteio de palavras, dicas, regras, persistência e interações.
- `README.md`: documentação do projeto.

## Como executar

Como o projeto é um site estático, o modo mais simples é abrir o arquivo HTML em um navegador.

### Opção 1 — abrir diretamente

Abra o arquivo abaixo no navegador:

```text
index (2).html
```

### Opção 2 — rodar localmente com servidor simples

No terminal, na pasta do projeto:

```bash
cd jgsuco
python -m http.server 8000
```

Depois acesse:

```text
http://localhost:8000/
```

## Como jogar

1. Digite seu nome no cadastro inicial.
2. Escolha seu avatar.
3. Selecione a categoria desejada.
4. Escolha a dificuldade.
5. Defina a quantidade de dicas por partida.
6. Clique em "Começar partida".
7. Tente adivinhar a palavra antes de cometer 6 erros.

A cada acerto, a letra aparece na palavra. A cada erro, o boneco avança e a sequência de letras certas pode ser quebrada.

## Regras do jogo

- Cada partida sorteia uma palavra da categoria selecionada.
- O jogador pode usar letras do teclado físico ou o teclado virtual na tela.
- O máximo de erros é 6.
- Se acertar a palavra, a partida é vencida.
- Se atingir 6 erros, a palavra é revelada e o jogo termina.

## Sistema de categorias e dificuldade

As categorias incluem temas como:

- Animais
- Comidas
- Lugares
- Objetos
- Tecnologia
- Natureza
- Música
- Profissões

A dificuldade afeta a extensão das palavras e as dicas disponíveis:

- Fácil: palavras curtas
- Médio: palavras de tamanho intermediário
- Difícil: palavras mais longas

## Persistência local

O jogo salva o perfil do jogador no navegador usando `localStorage`, incluindo:

- nome;
- avatar;
- categoria favorita;
- quantidade de dicas;
- vitórias;
- derrotas;
- sequência atual;
- melhor sequência.

Isso permite que o jogador retorne e continue com as mesmas configurações.

## Design e UX

O projeto usa CSS avançado para oferecer:

- layout responsivo;
- animações de acertos e erros;
- destaque visual para sequência de letras certas;
- feedback de marcos e conquistas;
- alterações visuais para estados de vitória e derrota;
- acessibilidade com `aria-live`, foco visível e uso semântico de elementos.

## Personalização

O projeto é simples de customizar. Algumas alterações comuns:

- trocar palavras e dicas em `script.js`;
- alterar cores, bordas, espaçamento e fontes em `style.css`;
- ajustar textos da interface em `index (2).html`;
- adicionar novas categorias sem grande esforço.

## Observações

Este é um projeto de frontend lúdico, simples e educativo, ideal para aprender lógica de programação, manipulação do DOM, eventos do navegador e design de interfaces em JavaScript puro.

## Autor

Projeto desenvolvido por LucasV1218.

## Licença

Este repositório não informa uma licença explícita no momento. Caso queira usar ou adaptar o projeto, recomenda-se consultar diretamente o autor antes de distribuir ou reutilizar o código.
