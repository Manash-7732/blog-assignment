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
exports.getAllUsers = exports.login = exports.signup = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken")); // Import JWT library
const config_1 = require("../db/config");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret
// User signup
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email } = req.body;
        yield config_1.db.user.create({
            data: {
                name,
                email,
            },
        });
        const token = jsonwebtoken_1.default.sign({ email: email }, JWT_SECRET, {
            expiresIn: "1h",
        });
        const data = {
            message: "Login successful!",
            token,
        };
        return res.send(data);
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.signup = signup;
exports.default = exports.signup;
// User login
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield config_1.db.user.findUnique({ where: { email: email } });
        if (user) {
            // Generate token using only the email
            const token = jsonwebtoken_1.default.sign({ email: user.email }, JWT_SECRET, {
                expiresIn: "1h",
            });
            const data = {
                message: "Login successful!",
                token,
            };
            return res.send(data);
        }
        else {
            return res.status(401).send({ message: "Invalid email" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Internal Server Error" });
    }
});
exports.login = login;
// Get all users
const getAllUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield config_1.db.user.findMany();
        return users;
    }
    catch (error) {
        return res.status(500).send({ error: "Error fetching users" });
    }
});
exports.getAllUsers = getAllUsers;
