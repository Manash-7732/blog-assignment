import { FastifyReply, FastifyRequest } from "fastify";
import jwt from "jsonwebtoken"; // Import JWT library
import { db } from "../db/config";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // Replace with your actual secret

interface SignupBody {
  name: string;
  email: string;
}

// User signup
export const signup = async (
  req: FastifyRequest<{ Body: SignupBody }>,
  res: FastifyReply
) => {
  try {
    const { name, email } = req.body;

    await db.user.create({
      data: {
        name,
        email,
      },
    });

    const token = jwt.sign({ email: email }, JWT_SECRET, {
      expiresIn: "1h",
    });

    const data = {
      message: "Login successful!",
      token,
    };
    return res.send(data);
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

export default signup;

// User login
export const login = async (
  req: FastifyRequest<{ Body: { email: string } }>,
  res: FastifyReply
) => {
  try {
    const { email } = req.body;
    const user = await db.user.findUnique({ where: { email: email } });

    if (user) {
      // Generate token using only the email
      const token = jwt.sign({ email: user.email }, JWT_SECRET, {
        expiresIn: "1h",
      });

      const data = {
        message: "Login successful!",
        token,
      };
      return res.send(data);
    } else {
      return res.status(401).send({ message: "Invalid email" });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).send({ error: "Internal Server Error" });
  }
};

// Get all users
export const getAllUsers = async (req: FastifyRequest, res: FastifyReply) => {
  try {
    const users = await db.user.findMany();
    return users;
  } catch (error) {
    return res.status(500).send({ error: "Error fetching users" });
  }
};
