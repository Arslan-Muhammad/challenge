const http = require('http')

const PORT = process.env.PORT || 3000

const server = http.createServer((req, res) => {

  if (req.method === 'GET' && req.url === '/') return respondHello(req, res)

  else if (req.method === 'POST' && req.url === '/base64') return base64Handler(req, res)

  else if (req.method === 'GET' && req.url === '/user-agent') return userAgentHandler(req, res)

  else if (req.method === 'GET' && req.url === '/fiat-lux') return fiatluxHandler(req, res)

  else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
  } res.end()
})

function respondHello(req, res) {
  res.end(JSON.stringify({ msg: 'hello' }))
}
function base64Handler(req, res) {
  let body = '';

  req.on('data', chunk => {
    body += chunk.toString();
  });

  req.on('end', () => {
    const { text, decode } = JSON.parse(body);

    if (decode) {
      const decoded = Buffer.from(text, 'base64').toString('utf-8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ decoded }));
    } else {
      const encoded = Buffer.from(text).toString('base64');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ encoded }));
    }
  });
}
function userAgentHandler(req, res) {
  const userAgent = req.headers['user-agent'];
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ userAgent }));
}
function fiatluxHandler(req, res) {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('fiat lux returns plain text');
}


server.listen(PORT)
console.log(`Server listening on port ${PORT}`)

if (require.main !== module) module.exports = server
