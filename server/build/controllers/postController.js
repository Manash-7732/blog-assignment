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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPostById = exports.getUserDrafts = exports.deletePost = exports.togglePublishPost = exports.incrementPostViews = exports.createPost = void 0;
const config_1 = require("../db/config");
// Create a new post
const createPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, content, authorEmail } = req.body;
    try {
        const result = yield config_1.db.post.create({
            data: {
                title,
                content,
                author: { connect: { email: authorEmail } },
            },
        });
        return result;
    }
    catch (error) {
        return res.status(500).send({ error: "Error creating post" });
    }
});
exports.createPost = createPost;
// Increment post views
const incrementPostViews = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield config_1.db.post.update({
            where: { id: Number(id) },
            data: {
                viewCount: { increment: 1 },
            },
        });
        return post;
    }
    catch (error) {
        return res
            .status(404)
            .send({ error: `Post with ID ${id} does not exist in the database` });
    }
});
exports.incrementPostViews = incrementPostViews;
// Toggle publish status of a post
const togglePublishPost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const postData = yield config_1.db.post.findUnique({
            where: { id: Number(id) },
            select: { published: true },
        });
        if (!postData) {
            return res.status(404).send({ error: `Post with ID ${id} not found` });
        }
        const updatedPost = yield config_1.db.post.update({
            where: { id: Number(id) },
            data: { published: !postData.published },
        });
        return updatedPost;
    }
    catch (error) {
        return res.status(500).send({ error: "Error updating post" });
    }
});
exports.togglePublishPost = togglePublishPost;
// Delete a post
const deletePost = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield config_1.db.post.delete({
            where: { id: Number(id) },
        });
        return post;
    }
    catch (error) {
        return res
            .status(404)
            .send({ error: `Post with ID ${id} does not exist in the database` });
    }
});
exports.deletePost = deletePost;
// Get user drafts
const getUserDrafts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const drafts = yield config_1.db.user
            .findUnique({
            where: { id: Number(id) },
        })
            .posts({
            where: { published: false },
        });
        if (!drafts) {
            return res
                .status(404)
                .send({ error: `No drafts found for user with ID ${id}` });
        }
        return drafts;
    }
    catch (error) {
        return res.status(500).send({ error: "Error fetching drafts" });
    }
});
exports.getUserDrafts = getUserDrafts;
// Get a single post by ID
const getPostById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        const post = yield config_1.db.post.findUnique({
            where: { id: Number(id) },
        });
        if (!post) {
            return res.status(404).send({ error: `Post with ID ${id} not found` });
        }
        return post;
    }
    catch (error) {
        return res.status(500).send({ error: "Error fetching post" });
    }
});
exports.getPostById = getPostById;
