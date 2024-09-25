import { Prisma, PrismaClient } from '@prisma/client'
import fastify from 'fastify'
import { db } from "./db/config"

const app = fastify({ logger: true })

app.post<{
  Body: ISignupBody
}>(`/signup`, async (req, res) => {
  const { name, email} = req.body
  const result = await db.user.create({
    data: {
      name,
      email
    },
  })
  return result
})

app.post<{Body: {email: string}}>(`/login`, async (req, res) => {
  const { email } = req.body;
  const result = await db.user.findUnique({where: {email:email}})

  if(result) {
    const data = {
      message: "Login successfull!"
    }
    return data
  }
})

app.post<{
  Body: ICreatePostBody
}>(`/post`, async (req, res) => {
  const { title, content, authorEmail } = req.body
  const result = await db.post.create({
    data: {
      title,
      content,
      author: { connect: { email: authorEmail } },
    },
  })

  return result

})

app.put<{
  Params: IPostByIdParam
}>('/post/:id/views', async (req, res) => {
  const { id } = req.params

  try {
    const post = await db.post.update({
      where: { id: Number(id) },
      data: {
        viewCount: {
          increment: 1,
        },
      },
    })

    return post
  } catch (error) {
    return { error: `Post with ID ${id} does not exist in the database` }
  }
})

app.put<{
  Params: IPostByIdParam
}>('/publish/:id', async (req, res) => {
  const { id } = req.params

  try {
    const postData = await db.post.findUnique({
      where: { id: Number(id) },
      select: {
        published: true,
      },
    })

    const updatedPost = await db.post.update({
      where: { id: Number(id) || undefined },
      data: { published: !postData?.published },
    })
    return updatedPost
  } catch (error) {
    return { error: `Post with ID ${id} does not exist in the database` }
  }
})

app.delete<{
  Params: IPostByIdParam
}>(`/post/:id`, async (req, res) => {
  const { id } = req.params
  const post = await db.post.delete({
    where: {
      id: Number(id),
    },
  })
  return post
})

app.get('/users', async (req, res) => {
  const users = await db.user.findMany()
  return users
})

app.get<{
  Params: IPostByIdParam
}>('/user/:id/drafts', async (req, res) => {
  const { id } = req.params

  const drafts = await db.user
    .findUnique({
      where: { id: Number(id) },
    })
    .posts({
      where: { published: false },
    })

  return drafts
})

app.get<{
  Params: IPostByIdParam
}>(`/post/:id`, async (req, res) => {
  const { id } = req.params

  const post = await db.post.findUnique({
    where: { id: Number(id) },
  })
  return post
})

app.get<{
  Querystring: IFeedQueryString
}>('/feed', async (req, res) => {
  const { searchString, skip, take, orderBy } = req?.query

  const or: Prisma.PostWhereInput = searchString
    ? {
      OR: [
        { title: { contains: searchString as string } },
        { content: { contains: searchString as string } },
      ],
    }
    : {}

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
  })

  return posts
})
interface IFeedQueryString {
  searchString: string | null
  skip: number | null
  take: number | null
  orderBy: Prisma.SortOrder | null
}

interface IPostByIdParam {
  id: number
}

interface ICreatePostBody {
  title: string
  content: string | null
  authorEmail: string
}

interface ISignupBody {
  name: string | null
  email: string
  posts: Prisma.PostCreateInput[]
}

app.listen({ port: 5000 }, (err) => {
  if (err) {
    console.error(err)
    process.exit(1)
  }
  console.log(`
  🚀 Server ready at: http://localhost:5000
  ⭐️ See sample requests: http://pris.ly/e/ts/rest-fastify#3-using-the-rest-api`)
})