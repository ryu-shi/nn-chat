'use strict';
const pug = require("pug");
const util = require("./handler-util");
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const timezone = require('dayjs/plugin/timezone');
const relativeTime = require('dayjs/plugin/relativeTime');
require('dayjs/locale/ja');
dayjs.locale('ja');
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
dayjs.tz.setDefault('Asia/Tokyo');

async function handle(req, res) {
    switch (req.method) {
        case 'GET':
            res.writeHead(200, { 'Content-Type': 'text/html', charset: 'utf-8' });
            const posts = await prisma.post.findMany({
                orderBy: {
                    createdAt: "asc"
                }
            });
            posts.forEach((post) => {
                post.message = post.message.replace(/\n/g, '<br>');
                post.relativeCreatedAt = dayjs(post.createdAt).tz().fromNow();
                post.absoluteCreatedAt = dayjs(post.createdAt).tz().format('YYYY年MM月DD日 HH時mm分ss秒');
            });
            res.write(pug.renderFile('./views/posts.pug', { posts, user: req.user }));
            res.end();
            break;
        case "POST":
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const params = new URLSearchParams(body);
                const message = params.get("message");
                console.log(`送信済み: ${message}`);
                await prisma.post.create({
                    data: {
                        message,
                        postedBy: req.user
                    }
                })
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
function handleDelete(req, res) {
    switch (req.method) {
        case "POST":
            let body = "";
            req.on("data", (chunk) => {
                body += chunk;
            });
            req.on("end", async () => {
                const params = new URLSearchParams(body);
                const id = parseInt(params.get("id"));
                const post = await prisma.post.findUnique({
                    where: { id }
                });
                if (post.postedBy === req.user || req.user == "admin") {
                    await prisma.post.delete({
                        where: { id }
                    });
                }
                handleRedirectPosts(req, res);
            });
            break;
        default:
            util.handleBadRequest(req, res);
            break;
    }
}
module.exports = {
    handle,
    handleDelete,
};
