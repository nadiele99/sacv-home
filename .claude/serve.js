// Servidor estático do protótipo SACV (só para visualizar localmente).
// Uso: node .claude/serve.js [pasta] [porta]   (padrão: a pasta SACV, porta 5174)
const http = require('http'), fs = require('fs'), path = require('path');

const raiz = path.resolve(process.argv[2] || path.join(__dirname, '..'));
const porta = +process.argv[3] || 5174;
const tipos = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.md': 'text/plain; charset=utf-8',
};

http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p.endsWith('/')) p += 'index.html';
  const arquivo = path.join(raiz, p);
  if (!arquivo.startsWith(raiz)) return res.writeHead(403).end();
  fs.readFile(arquivo, (erro, dados) => {
    if (erro) return res.writeHead(404).end('404');
    res.writeHead(200, { 'Content-Type': tipos[path.extname(arquivo)] || 'application/octet-stream', 'Cache-Control': 'no-store' }).end(dados);
  });
}).listen(porta, () => console.log('SACV em http://localhost:' + porta));
