"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_1 = __importDefault(require("fastify"));
const userContollers_1 = require("./controllers/userContollers");
const cors_1 = __importDefault(require("@fastify/cors"));
const app = (0, fastify_1.default)({ logger: true });
app.register(cors_1.default, {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
});
app.post("/api/login", userContollers_1.login);
app.post("/api/signup", userContollers_1.signup);
app.get("/api/users", userContollers_1.getAllUsers);
app.listen({ port: 5000 }, (err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
    console.log(`🚀 Server ready at: http://localhost:5000`);
});
