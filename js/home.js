/* SACV · home — interação do fluxo Importar → Analisar → Revisar → Consolidar.
   Origem: autoral, JS puro (sem biblioteca). Visual em css/styles.css, bloco [Fluxo].

   Funcionamento:
   1. Uma vez só, depois que o fundo animado termina ("fundo:pronto") e com a seção
      na tela: o ciclo percorre as etapas.
      A cada passo (PASSO_MS) a etapa atual ganha data-estado="ativa" e as anteriores
      ficam "feita". O traço antes da etapa enche de verde (CSS) e a pílula acende logo
      depois (transition-delay).
   2. Ao terminar, todas ficam "feita" (ciclo consolidado) e a animação não volta mais.
   3. Depois disso, só o mouse ou o foco numa etapa mostra aquela etapa e a legenda
      explicativa (a legenda NÃO aparece no ciclo automático). Ao sair, volta ao
      estado consolidado, sem legenda. Mouse durante o ciclo inicial interrompe o ciclo.
   - prefers-reduced-motion: não anima; já começa consolidado e responde ao mouse. */
(function () {
  const fluxo = document.getElementById('fluxo');
  const legenda = document.getElementById('fluxo-legenda');
  if (!fluxo || !legenda) return;

  const etapas = [...fluxo.querySelectorAll('li')];
  const FINAL = etapas.length;    // índice do estado "ciclo consolidado"
  const PASSO_MS = 800;           // tempo de cada etapa no ciclo inicial
  const reduzido = matchMedia('(prefers-reduced-motion: reduce)').matches;

  let timer = null, interrompido = false;

  // comTexto: a legenda só aparece no mouse/foco; no ciclo automático fica vazia
  function mostrar(i, comTexto = false) {
    etapas.forEach((li, j) => {
      li.dataset.estado = i >= FINAL || j < i ? 'feita' : j === i ? 'ativa' : '';
    });
    legenda.textContent = comTexto && i < FINAL ? etapas[i].dataset.texto : ' ';
  }

  function terminar() {
    clearInterval(timer); timer = null;
    mostrar(FINAL);
  }

  // 1 e 2: ciclo único
  function rodarUmaVez() {
    let i = 0;
    mostrar(i);
    timer = setInterval(() => (++i >= FINAL ? terminar() : mostrar(i)), PASSO_MS);
  }

  // 3: mouse/foco mostra a etapa; ao sair, volta ao consolidado
  etapas.forEach((li, i) => {
    const entrar = () => { interrompido = true; clearInterval(timer); timer = null; mostrar(i, true); };
    li.addEventListener('mouseenter', entrar);
    li.addEventListener('focus', entrar);
    li.addEventListener('mouseleave', () => mostrar(FINAL));
    li.addEventListener('blur', () => mostrar(FINAL));
  });

  if (reduzido) { mostrar(FINAL); return; }

  // Só começa depois que o fundo animado termina (evento "fundo:pronto", de js/fundo.js)
  // E quando a linha de etapas está na tela. Em telas até 1000 px as células do fundo
  // ficam fora da área visível, então não há o que esperar. Margem de segurança: 3 s.
  const fundoPronto = new Promise(resolve => {
    if (matchMedia('(max-width: 1000px)').matches || document.documentElement.dataset.fundo === 'pronto') return resolve();
    document.addEventListener('fundo:pronto', resolve, { once: true });
    setTimeout(resolve, 3000);
  });
  const naTela = new Promise(resolve => {
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { obs.disconnect(); resolve(); }
    }, { threshold: 0.6 });
    obs.observe(fluxo);
  });
  Promise.all([fundoPronto, naTela]).then(() => setTimeout(() => { if (!interrompido) rodarUmaVez(); }, 250));
})();
