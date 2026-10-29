# SACV · Home, login e marca (protótipo)

Protótipo estático do **Sistema de Automação de Cargas Vagas** (GELOT / SEDUC-AM). Não precisa de build: abra `index.html` ou sirva a pasta com qualquer servidor estático.

Fluxo: `index.html` (home pública) → **Entrar** → `login.html`. As telas internas não fazem parte deste protótipo: o login de demonstração só confirma o acesso.

- `index.html`: home pública, só de apresentação: nome do sistema e o que ele faz (o acesso é pelo **Entrar** da navbar). Do Provão vêm só a navbar, o rodapé e a estrutura centralizada. O visual é próprio do SACV: grade de planilha, células marcadas (verdes = analisadas, amarela = a vaga) e o fluxo Importar → Analisar → Revisar → Consolidar. Não mostra nada da parte interna.
- `login.html`: card de login centralizado sobre o mesmo fundo de planilha da home. Acesso por usuário e senha (sem SSO/Keycloak). Tem "Voltar ao início", e a logo leva à home.
- `CONTEXTO.md`: o que é o SACV, perfis, passo a passo e pendências (fonte para textos e telas).
  - Estado de erro: `login.html?erro=1`, ou envie o formulário com a senha `erro`.
- `css/styles.css`: tokens → base → componentes → responsivo → movimento (um só arquivo para as duas telas).
- `js/fundo.js`: só **inicializa** o fundo animado (copia `data-src` para `src`) e avisa quando ele termina (evento `fundo:pronto`). Não controla a animação.
- `js/home.js`: interação do fluxo de etapas da home.
- `js/login.js`: lógica de demonstração do login. Troque `entrar()` pela integração real.

## Cor de ênfase: verde

Azul continua sendo a base institucional (navbar, títulos, rodapé). O **verde** é a ênfase: o V do monograma, o botão principal (incluindo "Entrar"), o destaque do título, o traço do fluxo, as células analisadas e o fio verde no topo do card de login. O amarelo aparece só como "a vaga" (ponto do símbolo, célula da grade).

| Token | Uso | Contraste |
|---|---|---|
| `--verde-800` #066B3A | fundo do botão primário | 7,0:1 com branco |
| `--verde-700` #087A43 | texto verde | 5,3:1 sobre branco |
| `--verde-500` #00A859 | ícones e decoração | só decorativo |
| `--verde-400` #2ECC7A | verde sobre fundo escuro (marca para fundo azul) | — |

## Marca (`assets/marca/`)

Símbolo: quadrado azul com um **V verde** (a vaga validada) e um **ponto amarelo** (a vaga em destaque). Lido junto, também lembra uma pessoa de braços abertos, ou seja, a carga ocupada.

| Arquivo | Uso |
|---|---|
| `sacv-icone.svg` | favicon, navbar, fundo claro (também em `favicon.svg`) |
| `sacv-icone-fundo-azul.svg` | símbolo sobre fundo azul/escuro |
| `sacv-horizontal.svg` | símbolo + nome, fundo claro |
| `sacv-horizontal-fundo-azul.svg` | símbolo + nome, fundo escuro |
| `sacv-monocromatica.svg` | uma cor (impressão, carimbos) |

> Pendência: nos SVGs horizontais o nome está em `<text>` (Plus Jakarta Sans 800). Antes de usar fora do navegador, converta o texto em contorno (no Figma ou Illustrator) para não depender da fonte instalada. Nas páginas, a marca é HTML e a fonte vem do Google Fonts.

## Rastreabilidade visual

| Elemento | Origem | Onde | Como ajustar |
|---|---|---|---|
| Ícones | Lucide 0.460.0 (ISC), https://lucide.dev | `<symbol>` no topo de cada HTML | troque o `<path>` pelo do ícone desejado |
| Fundo animado (home e login) | autoral, **SVG autocontido**: a grade de planilha (`<pattern>` com máscara radial que apaga as bordas), as células verdes e a vaga amarela, e a animação em CSS **dentro do próprio SVG**. Ao carregar, cada célula surge (0,6 s) e anda até o lugar em saltos de uma célula (`transform` com `steps`), como o cursor de uma planilha; atrasos de 0–300 ms; a vaga chega por último e o ponto aparece com um "pop". Cada salto leva 260 ms; total de 1,84 s. O SVG não escala: fica centrado no topo (1 unidade = 1 px). Com `prefers-reduced-motion`, o SVG não anima. | `assets/img/fundo-home.svg`, `fundo-login.svg` (gerados por `assets/img/gerar-fundos.js`); na página, `<img class="fundo-svg" data-src data-duracao>` | edite `CELULAS`, `MASCARA` e `PASSO_MS` em `gerar-fundos.js` e rode `node assets/img/gerar-fundos.js`. Se mudar a duração total, atualize `data-duracao` no HTML |
| Inicialização do fundo | autoral, JS puro: só troca `data-src` por `src` (a animação começa sozinha dentro do SVG) e, `data-duracao` ms depois do carregamento, dispara `fundo:pronto` | `js/fundo.js` | `data-duracao` no `<img>` |
| Destaque "Cargas Vagas" | autoral, CSS: texto verde com sublinhado largo em gradiente | `.apresentacao__titulo em` | paradas do `linear-gradient` |
| Fluxo em quatro etapas (interação) | autoral: JS puro + CSS. **Roda uma vez só**, depois que o fundo animado termina (evento `fundo:pronto`, de `js/fundo.js`; em telas até 1000 px, onde as células ficam fora da área visível, começa direto) e com a linha de etapas na tela: a cada 0,8 s o traço antes da etapa enche de verde (`::after`, `scaleX` 0 → 1, 300 ms) e a pílula acende em seguida (`transition-delay` 250 ms); as anteriores ficam verde-claro. No fim, as quatro ficam verdes e não anima mais. A legenda explicativa (`data-texto`) **não aparece no ciclo automático**: só quando a pessoa passa o mouse ou foca (Tab) uma etapa, que acende com a legenda; ao sair, volta ao consolidado sem legenda. Com `prefers-reduced-motion`, já começa consolidado. | `js/home.js`; CSS `.fluxo`, `.fluxo li[data-estado]`, `.fluxo__legenda` | `PASSO_MS` em `home.js`; durações nas `transition` do CSS; textos em `data-texto` |
| Fio verde no topo | autoral, CSS: faixa de 5 px em `--verde-500` | `.faixa-identidade` | `height`, `background` |
| Card de login | autoral, CSS: card branco com fio verde no topo e sombra suave | `.cartao-login` | `border-top`, `box-shadow`, `max-width` |
| Hover dos botões e links | autoral, CSS `transition` em `transform`, `background-color`, `box-shadow` (200 ms) | `.btn`, `.navbar__links a`, `.entrada__voltar` | `--duracao`, `--curva` |
| Mostrar/ocultar senha | autoral, JS puro (troca `type` e o ícone `eye` ↔ `eye-off`) | `js/login.js` | — |

As únicas animações são as pedidas: o fluxo de etapas da home e o fundo animado (home e login, dentro do SVG). Não há animações de entrada (fade-up, reveal): pela regra do Design System, elas só entram quando forem pedidas. `prefers-reduced-motion` desliga as transições e a animação do SVG.

## Assinatura institucional

`assinatura-seduc.svg`, `detin-getag.svg`, `redes-sociais.svg` e `rodape-linhas.svg` foram reaproveitados da home do Provão (recortes dos arquivos oficiais). A marca do SACV não usa elementos do brasão nem da marca do Governo.

## Pendências

- [ ] Contato da equipe de TI / GELOT (link "Fale com a equipe de TI" e rodapé).
- [ ] Contorno do mapa do Amazonas: ficou fora. Entra se houver vetor oficial.
- [ ] Fotos reais da rede estadual: aguardando arquivos autorizados.
- [ ] Converter o texto dos SVGs da marca em contorno.
- [ ] Destino depois do login: hoje só aparece o aviso "Acesso validado". Ligar às telas internas quando existirem.
