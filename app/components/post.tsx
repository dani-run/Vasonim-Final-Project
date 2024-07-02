import { Form } from "@remix-run/react"
import { useState } from "react"
import { formatPost } from "./functions";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faThumbsDown, faThumbsUp } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Post({ post , user, full }: any){
const [link,setLink]=useState("");
const [links,setLinks]=useState(post.links?.map((l: any) => l.content ) || [] );
const [edit,setEdit]=useState(false);
const [delPost, setDelPost ]=useState(false);
const [del, setDel]=useState('');
const content=post.content;
const [postContent, setPostContent]=useState(content);
const format=formatPost(post);
const date=format.realDate;
const author=format.author;
const title=post.title;
const likes=post.likes;
const dislikes=post.dislikes
const canEdit= user?.id===post.postedBy?.id || false;
console.log(user?.username);
console.log(canEdit);
    return(

        <div className="bg-gray-200 shadow-md rounded-lg p-6 m-6 mb-4 transition-all ease-in-out duration-300 overflow-hidden" >
            <div  className="flex items-center justify-between " >
            <div className="font-bold ">
                Posted by {author} on {date}
            </div>
            {(post.edited != post.createdAt )&& <p className="text-sm italic" >Edited on {format.edited}</p>
            }
            </div>
            <div className="mt-4 post " >
                <div className="flex justify-between" >
                <h4 className="text-xl font-semibold mt-2" >{title}</h4>
                {post.reason && <h5 className="text-sm font-semibold mt-2" >Urgent because:<br /> {post.reason}</h5>}
                <div className="" >
                {(full && canEdit ) && <div className="m-4 text-right " >
                    <Form method="post" className="inline-block" >
                    <button type="button" name="option" onClick={() => setDelPost(!delPost)}
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" >
                        {!delPost ? "Delete post": "Cancel" }
                        </button>
                    {delPost && <><p className="mt-2 " >Are you sure you want to delete this post?</p><button 
                    className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg mt-2" type="submit" name="option" value="deletePost" 
                    >
                        Confirm Delete</button></>}
                    </Form>
                </div>}
                </div>
                </div>
                {post.section === "informational" && 
                <div className="mt-4" > 
                <p className="font-semibold" >Links:</p>
                <ul className="list-disc overflow-y-auto ml-4" >
                    {post.links?.map((link: any) => {
                        return (<li key={link.id} >
                            <div  className="flex " >
                        { canEdit && <Form method="post" >
                            <input type="hidden" name="linkId" value={link.id} />
                            <button 
                            type="submit" 
                            name="option" value="deleteLink"
                             className={`ml-2 !border-0 !shadow-none hover:bg-inherit ${del===link.id ? 'text-gray-600 hover:text-gray-700' : 'text-red-500 hover:text-red-600 ' } `}
                            ><FontAwesomeIcon icon={faTrash} /></button>
                        </Form>}
                        <a href={link.content} target="_blank" className="text-blue-500 hover:underline" >{link.content}</a>
                            </div>
                        </li>)} )}
                </ul>
                </div>}
                
               <div className="mt-4" >{content}</div>
                    {(full && canEdit ) && (
                        <div className="mt-4" >
                        <button onClick={()=>{
            setEdit(!edit);
            setPostContent(content);
        }}
        className="bg-yellow-500 text-black px-4 py-2 rounded-lg mr-2" >
                
            {!edit ? "Edit" : "Cancel" }
        </button></div>)}
                
            {edit && 
            <Form method="post" onSubmit={() => setLinks(post.links?.map((l: any) => l.content ))} className="mt-4 overflow-auto transition-all ease-in-out duration-300 " >
                <textarea name="content" 
                value={postContent} 
                onInput={(e: any) => setPostContent(e.currentTarget.value) }
                className="!border border-gray-300 p-2 w-full rounded-md" />
                { ((postContent !== content) || (JSON.stringify(links.map((l: string) => l.replace("https://", '')  )) !== JSON.stringify(post.links?.map((l: any) => l.content.replace("https://", '') )))) &&<div> <button className="bg-yellow-500 text-black px-4 py-2 rounded-lg mt-2"
                 type="submit" name="option" value="editPost" >
                    Edit post
                    </button>
                    {(JSON.stringify(links.map((l: string) => l.replace("https://", '')  )) !== JSON.stringify(post.links?.map((l: any) => l.content.replace("https://", '')))) && <p className="font-semibold " >Note: New valid links take a few seconds to appear.</p> }
                    </div>}
                {post.section === "informational" &&
                <div className="mt-4">
                <label className="block font-semibold mb-2" >Share additional resources:<br />
                    <input type="text"  
                    className="border border-gray-300 p-2 rounded-md mr-2"
                    value={link} 
                    onInput={(e) => setLink(e.currentTarget.value)} 
                    />                    
                </label>
                { (links.every((l: string)=> l.replace("https://",'') !== link ) && link ) ? <button 
                onClick={(e) =>{ 
                    e.preventDefault();
                    if(link){
                    setLinks([...links,link]);
                    setLink("");
                }
                    }} 
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg" >Add link</button> 
                    : 
                    <p className="w-24 py-2 px-4 bg-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 " >Add Link</p> }
                    <ul className="mt-2 max-h-40 overflow-auto " >
                        {links.map((item : string, index: number) =>
                        <li key={index} className="flex items-center" >
                            <input type="hidden" name="links[]" value={item} />
                           <span className="overflow-hidden overflow-ellipsis whitespace-nowrap" >{item}</span> 
                        </li>)}
                    </ul>  
                </div> }
            </Form>
            }
                
            
            <div className="mt-4 flex items-center ">
            <div className="mr-4">
            <p className="font-semibold">Reactions:</p>
            <p className="text-sm">Likes: {likes.length}</p>
            <p className="text-sm">Dislikes: {dislikes.length}</p>
          </div>
                { full && <Form method="post" >
                    { !(likes.some((like :any ) => like.id===user?.id )) ? 
                    <button type="submit" value="likePost" name="option" className="like text-4xl px-4 py-2 rounded-lg mr-2  " ><FontAwesomeIcon icon={faThumbsUp} /></button> 
                    :
                    <button type="submit" value="unlikePost" name="option" className="liked text-4xl px-4 py-2 rounded-lg mr-2  " ><FontAwesomeIcon icon={faThumbsUp} /></button>}
                    { !(dislikes.some((dislike :any ) => dislike.id===user?.id )) ? 
                    <button type="submit" value="dislikePost" name="option" className="dislike text-4xl px-4 py-2 rounded-lg mr-2  " ><FontAwesomeIcon icon={faThumbsDown} /></button> 
                    :
                    <button type="submit" value="undislikePost" name="option" className="disliked text-4xl px-4 py-2 rounded-lg mr-2  " ><FontAwesomeIcon icon={faThumbsDown} /></button>}
                </Form>}   
            </div>
            </div>
        </div>
    )
}
