import { FastifyReply, FastifyRequest } from "fastify";
import { db } from "../db/config";
import { Prisma } from "@prisma/client";

interface IFeedQueryString {
  searchString: string | null;
  skip: number | null;
  take: number | null;
  orderBy: Prisma.SortOrder | null;
}

export const getSearchPosts = async (
  req: FastifyRequest<{ Querystring: IFeedQueryString }>,
  res: FastifyReply
) => {
  const { searchString, skip, take, orderBy } = req?.query;

  const or: Prisma.PostWhereInput = searchString
    ? {
        OR: [
          { title: { contains: searchString as string } },
          { content: { contains: searchString as string } },
        ],
      }
    : {};

  const posts = await db.post.findMany({
    where: {
      published: true,
      ...or,
    },
    include: { author: true },
    take: Number(take) || undefined,
    skip: Number(skip) || undefined,
    orderBy: {
      updatedAt: orderBy as Prisma.SortOrder,
    },
  });

  return posts;
};
