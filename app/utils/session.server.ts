import {
  createCookieSessionStorage,
  redirect
} from "@remix-run/node";
import bcrypt from "bcryptjs";
import { db } from "./db.server";
  

type SessionData = {
  userId: string;
}
type SessionFlashData = {
  error: string;
}

type LoginForm = {
  password: string;
  username: string;
  email: string;
};

type user = {
  password: string;
  name: string;
}

type Comment = {
  content: string ;
  parentId: string | null ; 
  userId: string ;
  postId: string;
}

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}
export const {getSession, commitSession, destroySession}= createCookieSessionStorage<SessionData, SessionFlashData>(
  {
    cookie:{
      name: 'session',
      path: "/",
      sameSite: "lax",
      secrets: [sessionSecret],
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
    },
  }
);

export async function register({password, username, email,}: LoginForm) {
  const existsName= await db.user.findUnique({
    where:{
        username,
    }
  })
  const existsEmail= await db.user.findUnique({
    where:{
      email,
    }
  });
  if(existsEmail && existsName){
    return 3;
  }
  if(existsEmail){
    return 2;
  }
  if(existsName){
    return 1;
  }
  const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
      data: { passwordHash, username, email },
    });
    return user ;
  };

export async function validateUser({password, name }: user){
    const user= await db.user.findFirst({
      where: {
        OR: [
          {username: name},
          {email: name},
        ],
      },
    });
    if(!user){
      return null;
    }
  
    const isCorrectPassword=await bcrypt.compare(
      password,
      user.passwordHash
    );

    if(!isCorrectPassword){
      return null;
    }
    return user.id;
  }

export async function createReply({content, parentId, userId, postId }: Comment) {
    const user= await db.user.findUnique({
      where:{
        id: userId,
      }
    });
    if(!user){
      throw new Error("User not found");
    }
    const reply= await db.comment.create({
      data: {
        content,
        parentId,
        postId,
        userId: user.id,
      },
    });
    return reply;
} 

export async function deleteCom(commentId : string){
  const comment=await db.comment.findFirst({
    where: {
      id: commentId,
    }
  });
  if (!comment){
    throw new Response("comment has already been deleted", {status: 404});
  }
  await db.post.update({
    where: {
      id: comment.postId,
    },
    data: {
      hasPinned: false,
    }
  });
  return await db.comment.delete({
    where: {
      id: commentId,
    },
  });
}

export function fuckedLoader(limit: number): any{
  if (!limit){
    return {
      postedBy: true,
      likes: true,
      dislikes: true,
      onPost: true,
      links: true,
    }
  }
  return {
      postedBy: true,
      likes: true,
      dislikes: true,
      onPost: true,
      links: true,
      replies: {
          include: fuckedLoader(limit-1),
          orderBy: [{
            pinned: 'desc',
          },
            {
            createdAt: 'desc',
        },
      ]
      },
  }
}
