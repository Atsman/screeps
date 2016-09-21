const https = require('https');
const fs = require('fs');
const config = require('../config');

const req = https.request({
  hostname: 'screeps.com',
  port: 443,
  path: '/api/user/code',
  method: 'POST',
  auth: `${config.email}:${config.password}`,
  headers: {
    'Content-Type': 'application/json; charset=utf-8',
  },
}, (res) => {
  console.log(res.statusCode);
  console.log('Succesfully uploaded to screeps!');
});

fs.readFile('./dist/main.js', 'utf8', (err, content) => {
  if (err) {
    return console.error('dist/main.js does not exists');
  }

  const data = {
    branch: 'default',
    modules: {
      main: 'module.exports = ' + content,
    },
  };

  req.end(JSON.stringify(data));
});


