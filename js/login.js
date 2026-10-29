/* SACV · login — lógica de DEMONSTRAÇÃO (JS puro, sem biblioteca).
   Em produção o formulário chama a API de autenticação do SACV (sem SSO).
   Troque a função entrar() e o destino após o login (hoje só mostra um aviso). */
(function () {
  const form = document.getElementById('form-login');
  const usuario = document.getElementById('usuario');
  const senha = document.getElementById('senha');
  const aviso = document.getElementById('erro-login');
  const avisoTexto = document.getElementById('erro-texto');
  const olho = document.getElementById('btn-olho');

  function mostrarAviso(texto, ok, campos) {
    avisoTexto.textContent = texto;
    aviso.classList.toggle('alerta--ok', ok);
    aviso.querySelector('use').setAttribute('href', ok ? '#i-circle-check' : '#i-circle-alert');
    aviso.hidden = false;
    [usuario, senha].forEach(c => ok ? c.removeAttribute('aria-invalid') : c.setAttribute('aria-invalid', String(campos.includes(c))));
    if (!ok) (campos[0] || usuario).focus();
  }

  function limparAviso() {
    aviso.hidden = true;
    [usuario, senha].forEach(c => c.removeAttribute('aria-invalid'));
  }

  // Demonstração: senha "erro" mostra o estado de falha; o resto é aceito.
  function entrar(u, s) {
    return s !== 'erro';
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const vazios = [usuario, senha].filter(c => !c.value.trim());
    if (vazios.length) return mostrarAviso('Preencha usuário e senha para entrar.', false, vazios);
    if (!entrar(usuario.value, senha.value)) return mostrarAviso('Usuário ou senha incorretos. Tente de novo.', false, [usuario, senha]);
    // As telas internas ainda não fazem parte deste protótipo.
    mostrarAviso('Acesso validado. As telas internas do SACV ainda não fazem parte deste protótipo.', true, []);
  });
  [usuario, senha].forEach(c => c.addEventListener('input', limparAviso));

  // Mostrar/ocultar senha: troca type e o ícone (eye ↔ eye-off)
  olho.addEventListener('click', () => {
    const visivel = senha.type === 'text';
    senha.type = visivel ? 'password' : 'text';
    olho.setAttribute('aria-pressed', String(!visivel));
    olho.setAttribute('aria-label', visivel ? 'Mostrar senha' : 'Ocultar senha');
    olho.querySelector('use').setAttribute('href', visivel ? '#i-eye' : '#i-eye-off');
  });

  if (new URLSearchParams(location.search).has('erro')) {
    mostrarAviso('Usuário ou senha incorretos. Tente de novo.', false, [usuario, senha]);
  }
})();
