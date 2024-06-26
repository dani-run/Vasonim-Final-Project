import {
  Link,
  Outlet,
  ScrollRestoration,
  useLoaderData,
  ClientLoaderFunctionArgs,
  json,
} from "@remix-run/react";
import {fuckedLoader, getSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import { Post } from "~/components/post";
import { Comment } from "~/components/comment";
import { formatPost } from "~/components/functions";
// import "../styles/home.css";


export const loader= async ({request} : ClientLoaderFunctionArgs) => {
  const posts= await db.post.findMany({
    take: 10,
    include: {
      postedBy: true,
      likes: true,
      dislikes: true,
      comments: {
        include: fuckedLoader(5),
      } 
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
  <p className="text-3xl" >Recent posts you might be interested in:</p>
  <div className="pl-2" >
    {data.posts.map((post)=>{
      const comment=post.comments[Math.floor(Math.random() * post.comments?.length)];
      const postId=post.id;
      return (<>
      <div  key={post.id} className="flex items-start space-x-4" >
              <Post 
              post={post}
              user={data.user}
              full={false}
              />
              <div>
                { comment &&
                <div className="mt-6" > 
                  <Link to={`/coms/${post.id}`} >
                    <Comment id={comment.id} full={false} comment={comment} user={data.user} />
                  </Link>
                  
                </div>}
              <div className={!comment ? "mt-6" : "" } >
                <Link to={"post/"+postId} ><button type="button" className="hover:bg-yellow-400 w-24 h-12 rounded-xl " >More details</button></Link>
              </div>
              </div>
              
            </div>
            <br />
            </>)
    })}
    
  </div>
  </>
  );
}