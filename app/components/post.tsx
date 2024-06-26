import { Form } from "@remix-run/react"
import { useState } from "react"
import { formatPost } from "./functions";

export function Post({ post ,user, full }: any){
const [link,setLink]=useState("");
const [links,setLinks]=useState(post.links?.map((l: any) => l.content ) || []);
const [edit,setEdit]=useState(false);
const [delPost, setDelPost ]=useState(false);
const content=post.content;
const [postContent, setPostContent]=useState(content);
const format=formatPost(post);
const date=format.realDate;
const author=format.author;
const title=post.title;
const likes=post.likes;
const dislikes=post.dislikes
const canEdit= user?.id===post.postedBy?.id;
    return(
        <div >
            <div className="pl-1" >
            <div className="font-bold flex-1 ">
                Posted by {author} on {date}
            </div>
            {full && <div className="edited" >
                {post.edited ? <p className="edited" >Edited on {format.edited}</p>: null} 
            </div>}
            </div>
            <div className="post" >
                <h4>{title}</h4>
                {post.reason && <h5>Urgent because:<br /> {post.reason}</h5>}
                {post.section === "informational" &&  <p>Links:
                <ul>
                    {post.links?.map((link: any) => {
                        const [del, setDel]=useState(false);
                        return <li key={link.id} >
                        <a href={link.content} target="_blank" >{link.content}</a>
                        { canEdit && <Form method="post" >
                            <input type="hidden" name="linkId" value={link.id} />
                            <button type="button" name="option" onClick={() => setDel(!del) } >{!del ? "Delete": "Cancel" }</button>
                            {del && <><p>Are you sure you want to delete this link?</p><button type="submit" name="option" value="deleteLink" ></button></>}
                        </Form>}
                        </li>} )}
                </ul>
                </p>}
                <br />
                {content}
                <div className="edit" >
                    {(full && canEdit ) && (<button onClick={()=>{
            setEdit(!edit);
            setPostContent(content);
        }} >
                
            {!edit ? "Edit" : "Cancel" }
        </button>)}
                {(full && canEdit ) && <div className="delete" >
                    <Form method="post" >
                    <button type="button" name="option" onClick={() => setDelPost(!delPost) } >{!delPost ? "Delete post": "Cancel" }</button>
                    {delPost && <><p>Are you sure you want to delete this post?</p><button type="submit" name="option" value="deletePost" >Delete post</button></>}
                    </Form>
                </div>}
            {edit && <Form method="post" onSubmit={() => setLinks(post.links?.map((l: any) => l.content ))} >
                <textarea name="content" 
                value={postContent} 
                onInput={(e: any) => setPostContent(e.currentTarget.value) } />
                { (postContent != content || links != post.links?.map((l: any) => l.content )) && <button type="submit" name="option" value="editPost" >Edit post</button>}
                {post.section === "informational" &&
                <div className="links">
                <label> Do you want to share more resources?<br />
                    <input type="text"  
                    value={link} 
                    onInput={(e) => setLink(e.currentTarget.value)} 
                    />                    
                </label>
                <button 
                onClick={(e) =>{ 
                    e.preventDefault();
                    if(link){
                    setLinks([...links,link]);
                    setLink("");
                }
                    }} >Add link</button>
                    <ul>
                        {links.map((item : string, index: number) =>
                        <li key={index} >
                            <input type="hidden" name="links[]" value={item} />
                            {item}
                        </li>)}
                    </ul>  
                </div> }
            </Form>
            }
                </div>
                
            
            <div className="reactions">
                Likes: {likes.length}
                <br />
                Dislikes: {dislikes.length}
                { full && <Form method="post" >
                    { !(likes.some((like :any ) => like.id===user?.id )) ? 
                    <button type="submit" value="likePost" name="option" className="like" >Like</button> 
                    :
                    <button type="submit" value="unlikePost" name="option" className="liked" >Unlike</button>}
                    { !(dislikes.some((dislike :any ) => dislike.id===user?.id )) ? 
                    <button type="submit" value="dislikePost" name="option" className="dislike" >Dislike</button> 
                    :
                    <button type="submit" value="undislikePost" name="option" className="disliked" >Remove dislike</button>}
                </Form>}   
            </div>
            </div>
        </div>
    )
}
