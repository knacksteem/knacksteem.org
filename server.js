const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');
const redirectToHTTPS = require('express-http-to-https').redirectToHTTPS;

const app = express();

const options = {
  key: fs.readFileSync('./privkey.pem'),
  cert: fs.readFileSync('./fullchain.pem')
};

const staticPath = path.join(__dirname, 'build');
app.use(express.static(staticPath));
app.use(redirectToHTTPS([/localhost:(\d{4})/], [], 301));

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
