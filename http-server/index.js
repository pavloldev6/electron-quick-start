
const settings = require('../settings');
const express = require('express')
const Cookies = require('cookies');
const fs = require('fs');
const https = require('https');
const app = express();
const port = 3000;


app.get('/', (request, response) => {
  const cookies = new Cookies(request, response, { secure: true });
  const requestDomainTokens = settings.requestDomain.split('.');
  const rDomainWithoutSubdomain = '.' + requestDomainTokens.slice(requestDomainTokens.length - 2).join('.');
  cookies.set('sessionId', 'sessionIdCookieValue', {
    httpOnly: true,
    secure: true,
    // domain: settings.requestDomain,
    domain: rDomainWithoutSubdomain,
  });
  response.send('Hello from Express!')
})

const httpsServer = https.createServer({
  key: fs.readFileSync('./http-server/server.key'),
  cert: fs.readFileSync('./http-server/server.cert')
}, app);

httpsServer.listen(port, () => {
  console.log(`server is listening on ${port}. Go to https://localhost:${port}/`)
});
