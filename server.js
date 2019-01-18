const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const options = {
  key: fs.readFileSync('./privkey.pem'),
  cert: fs.readFileSync('./fullchain.pem')
};

const staticPath = path.join(__dirname, 'build');
app.use(express.static(staticPath));

http
  .createServer(function(req, res) {
    res.writeHead(301, {
      Location: 'https://' + req.headers['host'] + req.url
    });
    res.end();
  })
  .listen(80);

https.createServer(options, app).listen(443);
