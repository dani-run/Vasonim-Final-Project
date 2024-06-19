import { Form } from "@remix-run/react";
import { formatPost } from "./functions";
import { useState } from "react";

export type CommentProps = {
    comment: {
      id: string;
      content: string;
      author: string;
      date: string;
      replies: CommentProps[];
    };
  };

export function Comment({comment, user, full, limit, postAuthorId}: any){
    const userId=user.id;
    const canDelete =(userId === comment.postedBy?.id || userId === postAuthorId);
    const canEdit= userId===comment.postedBy?.id;
    const replies=comment.replies;
    const content=comment.content;
    const [com, setCom]=useState('');
    const [edit, setEdit]=useState(false);
    const [reply, setReply]=useState(false);
    const [pinned, setPinned]=useState(false);
    const handleSubmit = (e: any) => {
        setCom("");
        setEdit(false);
        setReply(false);
    };
    const format=formatPost(comment);
    return (<div className={!comment.pinned ? "reply"  : "pinned"} >

        {format.author && (<div className="comment" >
            By {format.author} on {format.realDate} 
            <p>{content}</p>
            Likes: {comment.likes.length}{" "}
            Dislikes: {comment.dislikes.length}
            {comment.edited && <p className="edited" >Edited</p> }
        </div>
    )}
        
        {(limit !=0 && (reply || edit)) && (
            <Form method="post" onSubmit={handleSubmit} >
            <input type="hidden" name="commentId" value={comment.id} />
            <label>
                Reply:
                <textarea name="content" value={com} 
                onInput={(e)=> setCom(e.currentTarget.value)} />
            </label>
            {reply && <button type="submit" name="option" value="reply" >Send reply</button>}
            {(edit && canEdit && com!=content ) && <button type="submit" name="option" value="edit" >Edit </button>}
        </Form>
    )}
        
        {canDelete && <Form method="post" >
            <input type="hidden" name="commentId" value={comment.id} />
            <button type="submit" name="option" value="delete" >Delete</button>
            { ((user.id===postAuthorId) &&((comment.pinned || !(comment.onPost.hasPinned) ))) && <button type="submit" name="option" onClick={() => setPinned(!comment.pinned) } value={!comment.pinned ? "pin" : "unpin"} >{!comment.pinned ? "Pin as BEST answer" : "Unpin"}</button>}
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
                    { !(comment.likes.some((like :any ) => like.id===user.id )) ? 
                    <button type="submit" value="like" name="option" >Like</button> 
                    :
                    <button type="submit" value="unlike" name="option" >Unlike</button>}
                    { !(comment.dislikes.some((dislike :any ) => dislike.id===user.id )) ? 
                    <button type="submit" value="dislike" name="option" >Dislike</button> 
                    :
                    <button type="submit" value="undislike" name="option" >Remove dislike</button>}
                </Form>
        </div>
        <br />
        { (limit!=0 && full ) && (<button onClick={()=>{
            setCom("");
            setReply(!reply);
            setEdit(false);
            }} >
            {!reply ? "Reply" : "Cancel" }
        </button>)}
        {full ? <details> 
            <summary>More replies {replies.length ? `(${replies.length})` : null} </summary>
            <ul>
            {replies?.map((reply :any )=>{
            return (
            <li key={reply.id} >
                <Comment limit={limit-1} postAuthorId={postAuthorId} user={user} full={full} comment={reply} />
            </li>)
        })}
         </ul>
        </details>
        : //aici se schimba, modific de 2 ori, i aint writin another function
        <ul>
            {replies?.map((reply :any )=>{
            return (
            <li key={reply.id} >
                <Comment limit={limit-1} postAuthorId={postAuthorId} user={user} full={full} comment={reply} />
            </li>)
        })}
         </ul> }
         
        <br />
        </div>
    );
}