var fs = require('fs'),
  httpProxy = require('http-proxy');

var proxy = httpProxy.createServer({
  ssl: {
    key: fs.readFileSync('./key.pem', 'utf8'),
    cert: fs.readFileSync('./cert.pem', 'utf8'),
  },
  target: 'https://9spokes.io/api/v1',
  secure: false, // Depends on your needs, could be false.
});

proxy.on('proxyRes', function(proxyRes, req, res) {
  console.log(
    'RAW Response from the target',
    JSON.stringify(proxyRes.headers, true, 2)
  );

  res.setHeader('access-control-allow-origin', '*');

  if (req.headers['access-control-request-method']) {
    res.setHeader(
      'access-control-allow-methods',
      req.headers['access-control-request-method']
    );
  }

  if (req.headers['access-control-request-headers']) {
    res.setHeader(
      'access-control-allow-headers',
      req.headers['access-control-request-headers']
    );
  }

  if (req.method === 'OPTIONS') {
    console.log('OPTIONS');
    res.writeHead(200);
    res.end()
  }
});
proxy.listen(8000);

