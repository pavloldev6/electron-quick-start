
const settings = require('../settings');
const express = require('express')
const { uuid } = require('uuidv4');
const Cookies = require('cookies');
const fs = require('fs');
const https = require('https');
const app = express();
const port = 3000;


app.get('/hello', (request, response) => {
  const cookies = new Cookies(request, response, { secure: true });
  const requestDomainTokens = settings.requestDomain.split('.');
  const rDomainWithoutSubdomain = '.' + requestDomainTokens.slice(requestDomainTokens.length - 2).join('.');

  const domain = settings.requestDomain; // set domain to be equal to the one in settings (including subdomain)
  // const domain = rDomainWithoutSubdomain; // set domain to be equal to domain only (without subdomain)
  const generatedId = uuid();
  cookies.set('sessionId', generatedId, {
    httpOnly: true,
    secure: true,
    // domain: 'localhost',
    sameSite: "strict"
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
