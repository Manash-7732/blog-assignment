import fastify from "fastify";
import { login, signup, getAllUsers } from "./controllers/userContollers";
import cors from "@fastify/cors";

const app = fastify({ logger: true });

app.register(cors, {
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
});

app.post("/api/login", login);
app.post("/api/signup", signup);
app.get("/api/users", getAllUsers);

app.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`🚀 Server ready at: http://localhost:5000`);
});
