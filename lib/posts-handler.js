'use strict';
const pug = require("pug");
const util = require("./handler-util");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
// const util = require("./handler-util");
async function handle(req, res) {
    switch (req.method) {
        case 'GET':
            res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' });
            const posts = await prisma.post.findMany();
            res.write(pug.renderFile('./views/posts.pug', { posts }));
            res.end();
            break;
        case "POST":
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", () => {
                const params = new URLSearchParams(body);
                const message = params.get("message");
                console.log(`送信済み: ${message}`);
                handleRedirectPosts(req, res);
            });
            break;
        default:
            util.handleBadRequest(req, res);
            break;
    }
}
function handleRedirectPosts(req, res) {
    res.writeHead(303, { Location: "/posts" });
    res.end();
}
module.exports = {
    handle
};
