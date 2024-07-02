import {
    Link,
    ScrollRestoration,
    useLoaderData,
    ClientLoaderFunctionArgs,
    json,
    Outlet,
  } from "@remix-run/react";
  import {fuckedLoader, getSession } from "~/utils/session.server";
  import { db } from "~/utils/db.server";
  import { Post } from "~/components/post";
import { Comment } from "~/components/comment";  
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";  
import { faMaximize } from "@fortawesome/free-solid-svg-icons";


  export const loader= async ({request, params} : ClientLoaderFunctionArgs) => {
    const posts= await db.post.findMany({
        where:{
            section: params.section
        },
      orderBy: { createdAt: "desc" },
      take: 10,
      include: {
        postedBy: true,
        comments: {
          include : fuckedLoader(5)
        },
        likes: true,
        dislikes: true,
      }
    });
    const session = await getSession(
      request.headers.get('Cookie')
    );
    const userId=session.get("userId");
    const user= userId ? await db.user.findUnique({
      where:{
        id: userId,
      }
    }) : null;
    return json({user, posts});
  }
  
  export default function Section(){
    const data=useLoaderData<typeof loader>();
    return (
      <>
    <ScrollRestoration />
    <div className="homeScreen" >
      {data.posts.map((post)=>{
        const comment=post.comments.find(com => com.pinned === true) || post.comments[0] ;
        const postId=post.id;
        return (<div key={post.id} className="flex " >
          <div  className="flex space-x-6 p-4 bg-white shadow-md rounded-lg w-screen m-6" >
                  <Post className="m-2 w-3/5 flex flex-col justify-between top-0 left-20 p-4 "
                  post={post}
                  user={data.user}
                  full={false}
                  />
                  <div className="w-2/5 flex flex-col justify-start " >
                    { comment &&
                    <div className="mt-6 mb-10 " > 
                      <Link to={`/post/${post.id}`} >
                        <Comment full={false} comment={comment} user={data.user} replies={null} />
                      </Link>
                      
                    </div>}
                  <div className={`w-64 ${!comment ? "mt-6" : "" }`} >
                    <Link to={"/post/"+postId} ><button type="button" className="hover:bg-yellow-400 w-64 h-24 rounded-xl justify-center items-center font-bold text-3xl text-center text-nowrap flex " >
                      <FontAwesomeIcon icon={faMaximize} className="text-5xl"/>
                       More Details
                       </button>
                    </Link>
                  </div>
                  </div>
                </div>
                </div>)
      })}
    </div>
    </>
    );
  }