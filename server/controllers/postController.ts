import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/config";

interface IPostByIdParam {
  id: number;
}

interface ICreatePostBody {
  title: string;
  content: string | null;
  authorEmail: string;
}

// Create a new post
export const createPost = async (
  req: FastifyRequest<{ Body: ICreatePostBody }>,
  res: FastifyReply
) => {
  const { title, content, authorEmail } = req.body;

  try {
    const result = await db.post.create({
      data: {
        title,
        content,
        author: { connect: { email: authorEmail } },
      },
    });
    return result;
  } catch (error) {
    return res.status(500).send({ error: "Error creating post" });
  }
};

// Increment post views
export const incrementPostViews = async (
  req: FastifyRequest<{ Params: IPostByIdParam }>,
  res: FastifyReply
) => {
  const { id } = req.params;

  try {
    const post = await db.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: { increment: 1 },
      },
    });
    return post;
  } catch (error) {
    return res
      .status(404)
      .send({ error: `Post with ID ${id} does not exist in the database` });
  }
};

// Toggle publish status of a post
export const togglePublishPost = async (
  req: FastifyRequest<{ Params: IPostByIdParam }>,
  res: FastifyReply
) => {
  const { id } = req.params;

  try {
    const postData = await db.post.findUnique({
      where: { id: Number(id) },
      select: { published: true },
    });

    if (!postData) {
      return res.status(404).send({ error: `Post with ID ${id} not found` });
    }

    const updatedPost = await db.post.update({
      where: { id: Number(id) },
      data: { published: !postData.published },
    });
    return updatedPost;
  } catch (error) {
    return res.status(500).send({ error: "Error updating post" });
  }
};

// Delete a post
export const deletePost = async (
  req: FastifyRequest<{ Params: IPostByIdParam }>,
  res: FastifyReply
) => {
  const { id } = req.params;

  try {
    const post = await db.post.delete({
      where: { id: Number(id) },
    });
    return post;
  } catch (error) {
    return res
      .status(404)
      .send({ error: `Post with ID ${id} does not exist in the database` });
  }
};

// Get user drafts
export const getUserDrafts = async (
  req: FastifyRequest<{ Params: IPostByIdParam }>,
  res: FastifyReply
) => {
  const { id } = req.params;

  try {
    const drafts = await db.user
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
  } catch (error) {
    return res.status(500).send({ error: "Error fetching drafts" });
  }
};

// Get a single post by ID
export const getPostById = async (
  req: FastifyRequest<{ Params: IPostByIdParam }>,
  res: FastifyReply
) => {
  const { id } = req.params;

  try {
    const post = await db.post.findUnique({
      where: { id: Number(id) },
    });

    if (!post) {
      return res.status(404).send({ error: `Post with ID ${id} not found` });
    }

    return post;
  } catch (error) {
    return res.status(500).send({ error: "Error fetching post" });
  }
};
