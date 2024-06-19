import { LoaderFunctionArgs, json, redirect } from "@remix-run/node";
import { useLoaderData, useActionData,Link, Form, ClientActionFunctionArgs } from "@remix-run/react";
import { useState } from "react";
import { Comment} from "~/components/comment";
import { db } from "~/utils/db.server";
import { createReply, deleteCom, getSession, fuckedLoader} from "~/utils/session.server"; //trebuie pt userId


export const loader= async ({params, request}: LoaderFunctionArgs) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId= session.get("userId");
    const user= await db.user.findFirst({
        where: {
            id: userId,
        },
        include:{
            likedComments: true,
            dislikedComments: true,
            likedPosts: true,
            dislikedPosts: true,
        }
    });
    const post= await db.post.findUnique({
        where: {
            id: params.postId,
        },
        include:{
            postedBy: true,
            likes: true,
            dislikes: true,
            links: true,
        }
    });
    if(!post){
        throw new Response("Post not found", { status: 404 });
    }
    const coms= await db.comment.findMany({
        where:{
            postId: post.id,
        },
        include: fuckedLoader(5),
        orderBy: [{
            pinned: 'desc',
        },
        {
            createdAt: "desc"
        }, 
    ],
            })
    if(!coms){
        throw new Response("Post not found", { status: 404 });
    }
    return json({coms, post, user});
}

export const action = async ({request, params}: ClientActionFunctionArgs) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId=session.get("userId");
    if(!userId){
        return redirect("/login");
    }
    const form=await request.formData();
    const content=String(form.get("content"));
    const postId=String(params.postId);
    const commentId=String(form.get("commentId")); // Extract parentId from form data
    const option=String(form.get("option"));
    if(!postId || !content ){
        return null;
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
    case "edit":
        return await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                content,
                edited: true,
            }
        })
    case "like":
        await db.comment.update({
            where: {
                id: commentId,
            },
            data: {
                dislikes: {
                    disconnect: {
                        id: userId,
                    }
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
                        id: userId,
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
                    }
                }
            }
        });
    case "pin":
        const pinned = await db.comment.update({
            where: {
                id: commentId,
            },
            data:{
                pinned: true
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
    const [com, setCom]=useState("");
    const handleSubmit = () => {
        setCom("");
    }
    return(
        <div className="fullComs">
            <Link to={"/post/" + data.post.id }>Back</Link>
            <br />
            {data.coms.length ? <>{data.coms.length} comment{data.coms.length >1 && "s"}<br /></> : null }
            <Form method="post" onSubmit={() => handleSubmit()} >
                <label>
                    Add a comment:
                    <br />
                    <textarea name="content" value={com} onInput={(e)=> setCom(e.currentTarget.value)} />
                </label>
                <button type="submit" name="option" value="reply" >Send</button>
            </Form>
            
            <div className="comments" >
                <ul>
                {data.coms.filter((com)=> com.parentId === null ).map((comment) =>(  //recursive loading <3
                    <li key={comment.id}>
                        <Comment limit={5} postAuthorId={data.post.postedBy?.id} user={data.user} full={true} comment={comment} />
                    </li>
                ))}
                </ul>
            </div>
        </div>
    )
}