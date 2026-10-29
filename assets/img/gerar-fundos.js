/* Gera os fundos animados do SACV (SVG autocontido, sem JavaScript dentro).
   Uso: node assets/img/gerar-fundos.js   (rodar na pasta SACV)
   Saída: assets/img/fundo-home.svg e assets/img/fundo-login.svg

   Cada SVG tem: grade de planilha (pattern) com máscara radial que apaga as bordas,
   células marcadas (verdes = analisadas, amarela = a vaga) e a animação em CSS
   dentro do próprio <style> do SVG. A página só carrega o arquivo com <img>.

   Para mudar posições ou movimentos, edite CELULAS abaixo e rode de novo.
   col/lin: posição em células a partir do centro (col) e do topo (lin).
   dx/dy: de quantas células de distância a célula vem andando.
   atraso: ms antes de começar. */
const fs = require('fs'), path = require('path');

const L = 96, A = 32;                 // célula da planilha (px)
const W = 2400, H = 1200;             // tamanho do SVG (cobre telas até 2400 px)
const CX = W / 2 - L / 2;             // x da coluna 0 (centrada)
const PASSO_MS = 260;                 // tempo de cada salto de uma célula
const SURGE_MS = 600;                 // fade-in de cada célula
const POP_MS = 500;                   // "pop" do ponto da vaga

const CELULAS = {
  home: [
    { col: -7, lin: 3, dx: -3, dy: 0, atraso: 0 },
    { col: -6, lin: 3, dx: 0, dy: -3, atraso: 120 },
    { col: -7, lin: 4, dx: 0, dy: 3, atraso: 200 },
    { col: -5, lin: 11, dx: -3, dy: 0, atraso: 80 },
    { col: 5, lin: 9, dx: 0, dy: -3, atraso: 60 },
    { col: 6, lin: 10, dx: 3, dy: 0, atraso: 160 },
    { col: 5, lin: 10, dx: 0, dy: 3, atraso: 240 },
    { col: 5, lin: 3, dx: 4, dy: 0, atraso: 300, vaga: true },
  ],
  login: [
    { col: -5, lin: 5, dx: -3, dy: 0, atraso: 0 },
    { col: -4, lin: 5, dx: 0, dy: -3, atraso: 120 },
    { col: -5, lin: 6, dx: 0, dy: 3, atraso: 200 },
    { col: 4, lin: 16, dx: 0, dy: 3, atraso: 60 },
    { col: 5, lin: 17, dx: 3, dy: 0, atraso: 160 },
    { col: 4, lin: 7, dx: 4, dy: 0, atraso: 300, vaga: true },
  ],
};
// centro e raios da máscara da grade (onde a grade é visível)
const MASCARA = { home: { cy: 380, rx: 980, ry: 560 }, login: { cy: 420, rx: 980, ry: 620 } };

function svg(nome) {
  const cels = CELULAS[nome], m = MASCARA[nome];
  const fim = Math.max(...cels.map(c => c.atraso + (Math.abs(c.dx) + Math.abs(c.dy)) * PASSO_MS + (c.vaga ? POP_MS : 0)));
  const keyframes = [], rects = [];
  cels.forEach((c, i) => {
    const passos = Math.abs(c.dx) + Math.abs(c.dy);
    const x = CX + c.col * L, y = c.lin * A;
    keyframes.push(`@keyframes andar${i}{from{transform:translate(${c.dx * L}px,${c.dy * A}px)}to{transform:none}}`);
    const anim = `animation:andar${i} ${passos * PASSO_MS}ms steps(${passos},end) ${c.atraso}ms both,surgir ${SURGE_MS}ms ease-out ${c.atraso}ms both`;
    if (c.vaga) {
      rects.push(`  <g class="vaga" style="${anim}">
    <rect x="${x}" y="${y}" width="${L}" height="${A}" fill="#FFF6D6" stroke="#FFD233" stroke-width="1.5"/>
    <circle class="ponto" cx="${x + L / 2}" cy="${y + A / 2}" r="5" fill="#FFD233" style="animation:pop ${POP_MS}ms cubic-bezier(.3,1.6,.5,1) ${c.atraso + passos * PASSO_MS}ms both"/>
  </g>`);
    } else {
      rects.push(`  <rect class="analisada" x="${x}" y="${y}" width="${L}" height="${A}" style="${anim}"/>`);
    }
  });

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" fill="none">
<!-- SACV · fundo animado (${nome}). Gerado por assets/img/gerar-fundos.js: edite lá, não aqui.
     Autocontido: grade + células + animação em CSS dentro deste arquivo, sem JavaScript.
     Animação (uma vez, ao carregar): cada célula surge e anda de célula em célula até o lugar
     (transform com steps), como o cursor de uma planilha; a vaga amarela chega por último e
     o ponto dela aparece com um "pop". Duração total: ${fim} ms.
     Posicione na página centralizado no topo, sem escalar (1 unidade = 1 px). -->
<defs>
  <pattern id="grade" width="${L}" height="${A}" patternUnits="userSpaceOnUse">
    <path d="M0 0V${A}M0 0H${L}" stroke="#074999" stroke-opacity=".09" stroke-width="2"/>
  </pattern>
  <radialGradient id="fade" cx="${W / 2}" cy="${m.cy}" r="1" gradientUnits="userSpaceOnUse"
    gradientTransform="translate(${W / 2} ${m.cy}) scale(${m.rx} ${m.ry}) translate(${-W / 2} ${-m.cy})">
    <stop offset=".35" stop-color="#fff"/>
    <stop offset=".8" stop-color="#fff" stop-opacity="0"/>
  </radialGradient>
  <mask id="mascara"><rect width="${W}" height="${H}" fill="url(#fade)"/></mask>
</defs>
<style>
  .analisada{fill:rgb(0 168 89 / .10);stroke:rgb(0 168 89 / .28);stroke-width:1}
  .ponto{transform-box:fill-box;transform-origin:center}
  ${keyframes.join('\n  ')}
  @keyframes surgir{from{opacity:0}to{opacity:1}}
  @keyframes pop{from{transform:scale(0)}to{transform:scale(1)}}
  @media (prefers-reduced-motion: reduce){*{animation:none!important}}
</style>
<rect width="${W}" height="${H}" fill="url(#grade)" mask="url(#mascara)"/>
${rects.join('\n')}
</svg>
`;
}

for (const nome of Object.keys(CELULAS)) {
  const dest = path.join(__dirname, `fundo-${nome}.svg`);
  fs.writeFileSync(dest, svg(nome));
  console.log('gerado', dest);
}
