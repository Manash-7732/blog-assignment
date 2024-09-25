import { FastifyReply, FastifyRequest } from 'fastify';
import { db } from '../db/config';

interface SignupBody {
  name: string;
  email: string;
}

const signup = async (req: FastifyRequest<{ Body: SignupBody }>, res: FastifyReply) => {
  const { name, email } = req.body; // req.body is now typed
  const result = await db.user.create({
    data: {
      name,
      email,
    },
  });
  return result;
};

export default signup;

const login = async (req: FastifyRequest<{ Body: SignupBody }>, res: FastifyReply) => {
    try {
        const { email } = req.body;
        const result = await db.user.findUnique({where: {email:email}})
        if(result) {
            const data = {
                message: "Login successfull!"
            }
            return data
        }
    } catch (error) {
        console.log(error)
    }
}

