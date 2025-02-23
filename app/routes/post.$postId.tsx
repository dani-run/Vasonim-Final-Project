import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData, Link, Form, ClientActionFunctionArgs, NavLink } from "@remix-run/react";
import { Post } from "~/components/post";
import { Comment } from "~/components/comment";
import { db } from "~/utils/db.server";
import { createReply, deleteCom, getSession, fuckedLoader } from "~/utils/session.server"; //trebuie pt userId
import { useState } from "react";
import fetch from "node-fetch";

export const loader= async ({params, request}: LoaderFunctionArgs) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId=session.get("userId");
    const user=userId ? await db.user.findUnique({
        where: {
            id: userId,
        }
    }) : null ;
    
    const post= await db.post.findUnique({
        where:{
            id: params.postId,
        },
        include:{
            postedBy: true,
            links: true,
            likes: true,
            dislikes: true,
            comments: {
                include: fuckedLoader(5),
                orderBy: [
                    {
                    pinned: "desc",
                },{
                    createdAt: "desc",
                }
            ],
            },
        },
            });
    if(!post){
        throw new Response("Post not found", { status: 404 });
    } 
    return json({post, user});
}

export const action = async ({request, params}: ClientActionFunctionArgs) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId=session.get("userId");
    if(!userId){
        return redirect("/startup");
    }
    const form=await request.formData();
    const content=String(form.get("content"));
    const postId=String(params.postId);
    if(!postId || !content ){
        return null;
    }
    const commentId=String(form.get("commentId")); // Extract parentId from form data
    const option=String(form.get("option"));
    const post= await db.post.findUnique({
        where: {
            id: postId,
        }
    });
    if(!post){
        return redirect("/");
    }
    
    switch(option){
       case "reply" :
        const reply=await createReply({
        content,
        userId,
        postId,
        parentId: ((commentId === "null" || commentId === "undefined" ) ? null : commentId )
    })
    return reply;
    case "delete": 
        return deleteCom(commentId);
    case "deletePost":
        await db.post.delete({
            where:{
                id: postId,
            }
        })
        return redirect("/");
    case "editPost":
        if(post.section === "informational"){
            const notWorkingLinks=form.getAll("links[]") as string[];
            const links=notWorkingLinks.map(l => "https://"+l);
            const checks=links.map(async (l)=>{
                try {
                const exists= await db.link.findFirst({
                    where:{
                        content: l,
                        postId,
                    }
                });
                if(exists){
                    throw new Error;
                }
                const response=await fetch(l);
                return response.ok;
            }catch(err){
                return false;
            }
            });
            const results= await Promise.all(checks);
            const workingLinks=links.filter((_,index) => results[index]);
            if(!workingLinks.length){
                return null;
            }
            const promises=workingLinks.map( async l => db.link.create({
                data:{
                    content: l,
                    postId: postId,
                }
            }) );
            await Promise.all(promises);
        }
        return await db.post.update({
            where:{
                id: params.postId,
            },
            data:{
                content,
                edited: new Date(),
            }
        });
    case "edit":
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                content,
                edited: new Date(),
            }
        })
    case "deleteLink":
        const linkId=String(form.get("linkId"));
        return await db.link.delete({
            where:{
                id: linkId,
            }
        });
    case "like":
        await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                dislikes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                likes: {
                    connect: {
                        id: userId,
                    },
                }
            }
        });
    case "unlike":
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                likes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
    case "dislike":
        await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                likes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                dislikes: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    case "undislike":
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                dislikes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
    case "likePost":
        await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                dislikes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
        return await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                likes: {
                    connect: {
                        id: userId,
                    },
                }
            }
        });
    case "unlikePost":
        return await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                likes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
    case "dislikePost":
        await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                likes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
        return await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                dislikes: {
                    connect: {
                        id: userId
                    }
                }
            }
        });
    case "undislikePost":
        return await db.post.update({
            where: {
                id: params.postId,
            },
            data: {
                dislikes: {
                    disconnect: {
                        id: userId,
                    },
                }
            }
        });
    case "pin":
        const pinned = await db.comment.update({
            where: {
                id: commentId,
            },
            data:{
                pinned: true,
            }
        });
        return await db.post.update({
            where: {
                id: pinned.postId,
            },
            data :{
                hasPinned: true,
            }
        });
    case "unpin":
        const unPinned = await db.comment.update({
            where: {
                id: commentId,
            },
            data:{
                pinned: false
            }
        });
        return await db.post.update({
            where: {
                id: unPinned.postId,
            },
            data :{
                hasPinned: false,
            }
        });
    default:
        throw new Error("How the fuck did you get here");
    }
};

export default function PostRoute(){
    const data=useLoaderData<typeof loader>();
    const actionData=useActionData<typeof action>(); //ma mai gandesc
    const [com, setCom] =useState("");
    const coms=data.post.comments;
    const pinnedCom=coms.find((com : any ) => com.pinned);
    const handleSubmit = () => {
        setCom("");
    }
    return(
        <div className="flex h-screen w-screen justify-between ">
            <div className="mx-2 min-w-240 max-w-272 h-screen overflow-x-hidden p-4 " >
            <Link to="/" className="text-gray-800 hover:text-gray-900" >Back to home page</Link>
            <Post 
            post={data.post}
            user={data.user}
            full={true}
            />
            </div>
            <div className="right-0 w-2/5 p-4 overflow-x-hidden mr-10 ">
            {coms.length ? <p>{coms.length} comment{coms.length >1 && "s"}</p> : null }
            
            <Form method="post" onSubmit={() => handleSubmit()} >
                <label>
                    Add a comment:
                    <br />
                    <textarea name="content" value={com} onInput={(e)=> setCom(e.currentTarget.value)} />
                </label>
                <button type="submit" name="option" value="reply" className="mt-2 p-2 bg-yellow-500 hover:bg-yellow-600 text-black rounded-lg" >Send</button>
            </Form>
            { (pinnedCom?.parentId !== null && pinnedCom ) && <div className="comments mt-4 " >
                <Comment limit={0} postAuthorId={data.post.postedBy?.id} user={data.user} full={true} comment={pinnedCom} replies={null} />
            </div>}       
            <div className="comments mt-4 " >
                <ul>
                {coms.filter((com : any )=> com.parentId === null  ).map((comment : any ) =>(  //recursive loading <3
                    <li key={comment.id} id={comment.id} >
                        <Comment limit={5} postAuthorId={data.post.postedBy?.id} user={data.user} full={true} comment={comment} replies={comment.replies} />
                    </li>
                ))}
                </ul>
            </div>
        </div>
        </div>
    )
}