'use strict';
const postshandler = require("./posts-handler");
const util = require("./handler-util");
function router(req, res) {
    switch (req.url) {
        case '/posts':
            postshandler.handle(req, res);
            break;
        case "/logout":
            util.handleLogout(req, res);

            break;
        case "/posts/delete":
            postshandler.handleDelete(req, res);
            break;
        case "/favicon.ico":
            util.handlefavicon(req, res);
            break;
        case "/style.css":
            util.handleStyleCssFile(req, res);
            break;
        case "/nn-chat.js":
            util.handleNnChatJsFile(req, res);
            break;
        default:
            util.handleNotFound(req, res)
            break;

    }
}
module.exports = {
    router
}
