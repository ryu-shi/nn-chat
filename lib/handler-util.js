'use strict'
const fs = require("node:fs");
function handleLogout(req, res) {
    res.writeHead(401, { Location: "/" });
    res.end();
}
function handleNotFound(req, res) {
    res.writeHead(404, { 'Content-Type': 'text/plain', charset: "utf-8" });
    res.end('Not Found');
}
function handleBadRequest(req, res) {
    res.writeHead(400, { 'Content-Type': 'text/plain', charset: "utf-8" });
    res.end('Bad Request');
}
function handlefavicon(req, res) {
    res.writeHead(200, {
        'Content-Type': 'image/vnd.microsoft.icon',
        "Cache-Control": "public, max-age=86400, immutable"
    });
    const favicon = fs.readFileSync("./favicon.ico");
    res.end(favicon);
}
function handleStyleCssFile(req, res) {
    res.writeHead(200, {
        "Content-Type": "text/css",
    });
    const file = fs.readFileSync("./public/style.css");
    res.end(file)
}
function handleNnChatJsFile(req, res) {
    res.writeHead(200, {
        "Content-Type": "text.javasctipt",
    });
    const file = fs.readFileSync("./public/nn-chat.js");
    res.end(file)
}
module.exports = {
    handleLogout,
    handleNotFound,
    handleBadRequest,
    handlefavicon,
    handleStyleCssFile,
    handleNnChatJsFile,
}