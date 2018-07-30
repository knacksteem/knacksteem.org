const path = require('path');
const express = require('express');
const https = require('https');
const http = require('http');
const fs = require('fs');

const app = express();

const options = {
  key: fs.readFileSync('/path/to/key.pem'),
  cert: fs.readFileSync('/path/to/cert.pem')
};

const staticPath = path.join(__dirname, '/build');
app.use(express.static(staticPath));

http.createServer(app).listen(80);
https.createServer(options, app).listen(443);
