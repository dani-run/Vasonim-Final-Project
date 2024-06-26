import { ClientActionFunctionArgs, Form, Link, redirect } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";


export const action = async ({request}: ClientActionFunctionArgs ) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId=session.get("userId");
    const form=await request.formData();
    const title=String(form.get("title"));
    const section=String(form.get("section"));
    const content=String(form.get("content"));
    console.log(content, title, section);
    switch(section){
        case "general" :
            const genPost= await db.post.create({
                data: {
                    title,
                    content,
                    section,
                    userId,
                },
            });
            console.log(genPost);
            return redirect(`/post/${genPost.id}`);
        case "urgent":
            const reason=String(form.get("reason"));
            const urgPost=await db.post.create({
                data: {
                    title,
                    content,
                    section,
                    userId,
                    reason,
                },
            });
            console.log(urgPost);
            return redirect(`/post/${urgPost.id}`);
        case "informational":
            const links=form.getAll("links[]") as string[];
            const checks=links.map(async (l)=>{
                try {
                const response=await fetch(l);
                return response.ok;
            }catch(err){
                return false;
            }
            });
            const results= await Promise.all(checks);
            const workingLinks=links.filter((_,index) => results[index]);
            console.log(links, workingLinks);
            const infoPost=await db.post.create({
                data: {
                    title,
                    content,
                    section,
                    userId,
                },
            });
            const promises=workingLinks.map( async l =>  db.link.create({
                data:{
                    content: l,
                    postId: infoPost.id,
                }
            }) );
            await Promise.all(promises);
            return redirect(`/post/${infoPost.id}`);
    }
}

export default function NewPostRoute(){
    const [title, setTitle]=useState("");
    const [section, setSection]=useState("");
    const [content, setContent]=useState("");
    const [link, setLink]=useState("");
    const [links, setLinks]=useState<Array<string>>([]);
    const handleSubmit = () => {
        setContent("");
        setTitle("");
    }
    return (<>
        <h3>Create a new post</h3>
        <Form method="post" onSubmit={handleSubmit} >
            <label>
                Title: {} 
            <input type="text" name="title" required value={title}
             onChange={(e: any) => setTitle(e.currentTarget.value) } />
            </label>
            <br />
            Section:<br />
                <label> 
                    <input type="radio" name="section" value="urgent" 
                    onClick={() => setSection("urgent") } required 
                    className="" />
                    Urgent Question
                </label>
                <br />
                <label> 
                    <input type="radio" name="section" value="informational"
                    onClick={() => setSection("informational") } required />
                    Informational Resources
                </label>
                <br />
                <label> 
                    <input type="radio" name="section" value="general" 
                    onClick={() => setSection("general") } required />
                    General Questions
                </label>
                <br />
                <label> Content: <br />
                    <textarea name="content" required
                    value={content} 
                    onChange={(e: any) => setContent(e.currentTarget.value) } />
                </label>
                <br />
                {section==="urgent" && <>
                    <label> Describe why you have an urgent case:
                        <input type="text" name="reason" required />
                    </label>
                    <br />
                </> }
                {section === "informational" &&
                <div className="links">
                <label>What resources do you want to share?<br />
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
                {(section && title && content ) && <button type="submit" value="create" name="option" >Create</button>}
        </Form>
    </>);
}