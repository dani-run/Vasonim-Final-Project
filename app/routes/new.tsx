import { ClientActionFunctionArgs, ClientLoaderFunctionArgs, Form, Link, redirect } from "@remix-run/react";
import { useState } from "react";
import { getSession } from "~/utils/session.server";
import { db } from "~/utils/db.server";

export const loader= async ({request}: ClientLoaderFunctionArgs ) => {
    const session= await getSession(
        request.headers.get("Cookie")
    );
    if(!session.has("userId")){
        return redirect('/startup');
    }
    return null;
}

export const action = async ({request}: ClientActionFunctionArgs ) => {
    const session = await getSession(  //trebuie pt userId
        request.headers.get("Cookie")
      );
    const userId=session.get("userId");
    if(!userId){
        return redirect('/startup');
    }
    const form=await request.formData();
    const title=String(form.get("title"));
    const section=String(form.get("section"));
    const content=String(form.get("content"));
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
    return (<div className="bg-gray-200 shadow-md justify-center align-middle flex flex-col items-center rounded-lg h-screen transition-all ease-in-out duration-300 overflow-hidden " >
        <div className="bg-white rounded-xl flex flex-col justify-center items-center shadow-lg p-8 " >
        <h3 className="font-bold text-3xl mb-4 mt-2" >Create a new post</h3>
        <div className="mt-10 post !bg-inherit flex items-start justify-center !shadow-none !border-0  w-full" >
        <Form method="post" onSubmit={handleSubmit} className="w-full max-w-xl" >
            <div className="mb-6 flex justify-center items-center " > 
            <input type="text" name="title" required value={title} placeholder="Title"
            className="w-144 px-4 py-2 rounded-md border border-gray-300 focus:outline-none "
             onChange={(e: any) => setTitle(e.currentTarget.value) } />
            </div>
            <div className="mb-4" >
           <p className="font-semibold" >Section:</p> 
                <label className="flex items-center mb-2" > 
                    <input type="radio" name="section" value="urgent" 
                    onClick={() => {
                        setSection("urgent");
                        setLinks([]);
                        setLink("");
                    } } required 
                    className="radio checked:bg-red-500 "  />
                    Urgent Question
                </label>
                <label className="flex items-center mb-2" > 
                    <input type="radio" name="section" value="informational"
                    onClick={() => {
                        setSection("informational");
                        setLinks([]);
                        setLink("");
                    } } required 
                    className="radio checked:bg-blue-500"/>
                    Informational Resources
                </label>
                <label className="flex items-center mb-2" > 
                    <input type="radio" name="section" value="general" 
                    onClick={() => {
                        setSection("general");
                        setLinks([]);
                        setLink("");
                    } } required
                    className="radio checked:bg-green-500 " />
                    General Questions
                </label>
                </div>
                <div className="flex flex-col justify-start text-left" >
                <div className="mb-4">
                    <textarea name="content" required placeholder="Content"
                    value={content} 
                    onChange={(e: any) => setContent(e.currentTarget.value) }
                    className="w-full h-40 px-4 py-2 rounded-md border border-gray-300 focus:outline-none " />
                </div>
                <br />
                <div className={`mb-4 transition-height ${section === "urgent" ? "transition-height-active" : "transition-height"}`} >
                {section==="urgent" && <>
                    <label> Describe why you have an urgent case:<br />
                        <textarea name="reason" required 
                         className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-500" />
                    </label>
                    <br />
                </> }
                </div>
                <div className={`mb-4 transition-height ${section === "informational" ? "transition-height-active" : "transition-height"}`} >
                {section === "informational" &&
                <div className="links">
                <label>What resources do you want to share?<br />
                    <input type="text"  
                    value={link} 
                    className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none "
                    onInput={(e) => setLink(e.currentTarget.value)} 
                    />                    
                </label>
                {(links.every((l: string)=> l.replace("https://",'') !== link ) && link ) ? <button 
                onClick={(e) =>{ 
                    e.preventDefault();
                    if(link){
                        setLinks([...links,link]);
                        setLink("");
                    }
                }} 
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 mb-4 " >Add link</button> 
                : 
                <p className="w-24 py-2 px-4 bg-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 mb-4" >Add Link</p>}
                    <ul>
                        {links.map((item : string, index: number) =>
                        <li key={index} className="mb-1" >
                            <input type="hidden" name="links[]" value={item} />
                            {item}
                        </li>)}
                    </ul>  
                </div> }
                            </div>
                            </div>
                {(section && title && content ) ? <button type="submit" value="create" name="option" 
                className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 mb-4 " >Create</button> : 
                <p className="w-20 text-center py-2 px-4 bg-gray-400 text-white rounded-lg focus:outline-none focus:ring-2 mb-4 " >Create</p> }
        </Form>

                            </div>
                            </div>
    </div>);
}