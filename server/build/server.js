"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const config_1 = require("./db/config");
const app = (0, fastify_1.default)({ logger: true });
app.post(`/signup`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email } = req.body;
    const result = yield config_1.db.user.create({
        data: {
            name,
            email
        },
    });
    return result;
}));
app.post(`/login`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    const result = yield config_1.db.user.findUnique({ where: { email: email } });
    if (result) {
        const data = {
            message: "Login successfull!"
        };
        return data;
    }
}));
app.post(`/post`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, authorEmail } = req.body;
    const result = yield config_1.db.post.create({
        data: {
            title,
            content,
            author: { connect: { email: authorEmail } },
        },
    });
    return result;
}));
app.put('/post/:id/views', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield config_1.db.post.update({
            where: { id: Number(id) },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });
        return post;
    }
    catch (error) {
        return { error: `Post with ID ${id} does not exist in the database` };
    }
}));
app.put('/publish/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const postData = yield config_1.db.post.findUnique({
            where: { id: Number(id) },
            select: {
                published: true,
            },
        });
        const updatedPost = yield config_1.db.post.update({
            where: { id: Number(id) || undefined },
            data: { published: !(postData === null || postData === void 0 ? void 0 : postData.published) },
        });
        return updatedPost;
    }
    catch (error) {
        return { error: `Post with ID ${id} does not exist in the database` };
    }
}));
app.delete(`/post/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield config_1.db.post.delete({
        where: {
            id: Number(id),
        },
    });
    return post;
}));
app.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield config_1.db.user.findMany();
    return users;
}));
app.get('/user/:id/drafts', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const drafts = yield config_1.db.user
        .findUnique({
        where: { id: Number(id) },
    })
        .posts({
        where: { published: false },
    });
    return drafts;
}));
app.get(`/post/:id`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const post = yield config_1.db.post.findUnique({
        where: { id: Number(id) },
    });
    return post;
}));
app.get('/feed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { searchString, skip, take, orderBy } = req === null || req === void 0 ? void 0 : req.query;
    const or = searchString
        ? {
            OR: [
                { title: { contains: searchString } },
                { content: { contains: searchString } },
            ],
        }
        : {};
    const posts = yield config_1.db.post.findMany({
        where: Object.assign({ published: true }, or),
        include: { author: true },
        take: Number(take) || undefined,
        skip: Number(skip) || undefined,
        orderBy: {
            updatedAt: orderBy,
        },
    });
    return posts;
}));
app.listen({ port: 5000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`
  🚀 Server ready at: http://localhost:5000
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-fastify#3-using-the-rest-api`);
});
