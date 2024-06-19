import {
  Link,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  ClientLoaderFunctionArgs,
  json,
} from "@remix-run/react";
import {getSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Post } from "~/components/post";
import { formatPost } from "~/components/functions";
// import "../styles/home.css";


export const loader= async ({request} : ClientLoaderFunctionArgs) => {
  const posts= await db.post.findMany({
    orderBy: { createdAt: "desc" },
    take: 10,
    include: {
      postedBy: true,
      comments: true,
      likes: true,
      dislikes: true,
    }
  });
  // console.log(posts); //il probez asa, dar imi umple terminalul
  const session = await getSession(
    request.headers.get('Cookie')
  );
  const userId=session.get("userId");
  const user= userId ? await db.user.findFirst({
    where:{
      id: userId,
    }
  }) : null;
  return json({user, posts});
}

export default function HomeScreen(){
  const data=useLoaderData<typeof loader>();
  return (
    <>
  <Outlet />
  <ScrollRestoration />
  <div className="homeScreen" >
    {data.posts.map((post)=>{
      const format=formatPost(post);
      const postId=post.id;
      return (<div  key={post.id} className="multiPost" >
              <Post 
              post={post}
              user={data.user}
              full={false}
              />
              <button><Link to={"post/"+postId} >More details</Link></button>
            </div>)
    })}
  </div>
  </>
  );
}