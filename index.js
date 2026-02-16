'use strict';

const http = require('http');
const router = require('./lib/router');
const auth = require('http-auth');
const basic = auth.basic({
    realm: 'Enter username and password.',
    file: './users.htpasswd'
});
const server = http.createServer(basic.check((req, res) => {
    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/plain');
    router.router(req, res);
}))
    .on('error', (err) => {
        console.error(err);
    })
    .on("clientError", (err) => {
        console.error(err);

    });

const port = 8000;
server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}/\n`);
});