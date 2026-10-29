/* SACV · fundo animado — SÓ a inicialização (JS puro, sem biblioteca).
   A animação dos quadros (andar de célula em célula, surgir, "pop" da vaga) está
   inteira dentro do SVG (assets/img/fundo-*.svg). Este script não mexe nela:
     1. copia data-src para src: o SVG carrega e a animação começa sozinha;
     2. quando o SVG carrega, espera data-duracao (ms) e dispara o evento
        "fundo:pronto" no document, para quem precisar esperar o fundo
        (ex.: as etapas da home, em js/home.js).
   Sem este script o fundo não aparece (a página continua funcionando). */
(function () {
  const fundos = document.querySelectorAll('img.fundo-svg[data-src]');
  const avisar = () => {
    document.documentElement.dataset.fundo = 'pronto';   // para quem chegar depois do evento
    document.dispatchEvent(new Event('fundo:pronto'));
  };
  if (!fundos.length) return avisar();

  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;
  fundos.forEach(img => {
    img.addEventListener('load', () => setTimeout(avisar, reduzido ? 0 : +img.dataset.duracao || 0), { once: true });
    img.addEventListener('error', avisar, { once: true });
    img.src = img.dataset.src;
  });
})();
