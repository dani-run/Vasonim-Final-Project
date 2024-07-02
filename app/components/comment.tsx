import { Form, Link } from "@remix-run/react";
import { formatPost } from "./functions";
import { useState } from "react";
import { faThumbTack } from "@fortawesome/free-solid-svg-icons";
import {faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";


export function Comment({comment, user, full, limit, postAuthorId, replies}: any){
    const userId=user?.id || null ;
    const canDelete=(userId === comment.postedBy?.id || userId === postAuthorId);
    const canEdit= userId===comment.postedBy?.id;
    const content=comment.content;
    const [com, setCom]=useState('');
    const [edit, setEdit]=useState(false);
    const [reply, setReply]=useState(false);
    const [pinned, setPinned]=useState(false);
    const [delCom, setDelCom]=useState(false);
    const handleSubmit = () => {
        setCom("");
        setEdit(false);
        setReply(false);
    };
    const format=formatPost(comment);
    return (<div className={`relative ${comment.pinned ? "bg-gray-100" : "bg-white"} p-4 border-b border-gray-200 ${comment.pinned ? "pl-12" : ""}`} >
        {comment.pinned && <div className="absolute top-2 left-2 text-xs text-yellow-600 " >
            <p>👑Pinned by post author</p>
            </div>}

            <div className="text-sm" >
        {format.author && (<div className={`comment font-semibold mb-1 ${comment.pinned ? 'mt-2' :'' }`} >
            <div className="font-semibold mb-1">
                By {format.author} on {format.realDate} 
            </div>
           <p className={`py-2 ${comment.pinned ? "bg-yellow-200 rounded-sm px-4" : ""}`}>{content}</p> 
           <div className="flex items-center text-sm text-gray-600" >
            Likes: {comment.likes.length}{" "}
            Dislikes: {comment.dislikes.length}
        </div>
        </div>
    )}
        
        {(limit !=0 && (reply || edit)) && (
            <Form method="post" onSubmit={handleSubmit} >
            <input type="hidden" name="commentId" value={comment.id} />
            <label className="block mb-2" >
                {reply ? 'Reply:' : 'Edit' }
                <textarea name="content" value={com} 
                className="border border-gray-300 p-2 rounded-md w-full"
                onInput={(e)=> setCom(e.currentTarget.value)} />
            </label>
            {(reply && com ) && <button type="submit" name="option" value="reply"
            className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg"
             >Send reply</button>}
            {(edit && canEdit && com!=content ) && <button type="submit" name="option" value="edit"
            className="bg-yellow-500 text-black px-4 py-2 rounded-lg ml-2"
             >Edit </button>}
        </Form>
    )}
        
        {canDelete && <Form method="post" >
            <input type="hidden" name="commentId" value={comment.id} />
            <button type="button" name="option" onClick={() => setDelCom(!delCom) } 
            className="text-sm text-gray-500"
                >{!delCom ? "Delete comment": "Cancel" }</button>
                    {delCom && <><p>Are you sure you want to delete this comment?</p><button type="submit" name="option" value="delete" className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2" >Delete comment</button></>}
            { ((userId===postAuthorId) &&((comment.pinned || !(comment.onPost.hasPinned) ))) && <button className={`text-3xl ${!comment.pinned ? "pin" : "pinned" }`} type="submit" name="option" onClick={() => setPinned(!comment.pinned) } value={!comment.pinned ? "pin" : "unpin"} ><FontAwesomeIcon icon={faThumbTack} /></button>}
        </Form>

        }
        {(full && canEdit) && (<button onClick={()=>{
            setCom(content);
            setEdit(!edit);
            setReply(false);
        }} >
            {!edit ? "Edit" : "Cancel" }
        </button>)}
        <div className="reactions">
                <Form method="post" >
                    <input type="hidden" name="commentId" value={comment.id} />
                    { !(comment.likes.some((like :any ) => like.id===userId )) ? 
                    <button type="submit" value="like" name="option" className="like !bg-inherit text-4xl " ><FontAwesomeIcon icon={faThumbsUp} /></button> 
                    :
                    <button type="submit" value="unlike" name="option" className="liked !bg-inherit text-4xl " ><FontAwesomeIcon icon={faThumbsUp} /></button>}
                    { !(comment.dislikes.some((dislike :any ) => dislike.id===userId )) ? 
                    <button type="submit" value="dislike" name="option" className="dislike !bg-inherit text-4xl " ><FontAwesomeIcon icon={faThumbsDown} /></button> 
                    :
                    <button type="submit" value="undislike" name="option" className="disliked !bg-inherit text-4xl " ><FontAwesomeIcon icon={faThumbsDown} /></button>}
                </Form>
        </div>
        <br />
        { (limit!==0 && full ) && (
            <div className="mt-2" >
            <button onClick={()=>{
            setCom("");
            setReply(!reply);
            setEdit(false);
            }}
            className="text-sm text-gray-500 focus:outline-none" >
            {!reply ? "Reply" : "Cancel" }
        </button></div>)}


        {/* nu stiu ce urmeaza aici, n am timpul sau rabdarea sa o refac, intelegi daca vezi asta Radu */}
        {(full && limit ) ? <details className="flex mt-2 " > 
            <summary className="text-sm text-gray-500 " >More replies {replies?.length ? `(${replies?.length})` : null} </summary>
            <ul>
            {replies?.map((reply :any )=>{
            return (
            <li key={reply.id} >
                <Comment limit={limit-1} postAuthorId={postAuthorId} user={user} full={full} comment={reply} replies={reply.replies} />
            </li>)
        })}
         </ul>
        </details>
        : //nu e logic
        <ul>
            {replies?.map((reply :any )=>{
              return full ? (
            <li className="mt-2 " key={reply.id}  >
                <Comment limit={limit-1} postAuthorId={postAuthorId} user={user} full={full} comment={reply} replies={reply.replies}  />
            </li>) : (<Link to={`/post/${reply.onPost.id}`} key={reply.id} > 
                <li  >
                    <Comment limit={limit-1} postAuthorId={postAuthorId} user={user} full={full} comment={reply} replies={reply.replies}  />
                </li>
            </Link>)
        })}
         </ul> }
        <br />
            </div>
        </div>
    );
}