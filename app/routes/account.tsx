import { Form, ClientActionFunctionArgs, Link, redirect, useActionData, json, useLoaderData } from "@remix-run/react";
import { useState } from "react";
import { getSession,destroySession,commitSession, validateUser } from "~/utils/session.server";
import { db } from "~/utils/db.server";
import bcrypt from "bcryptjs";
import { LoaderFunctionArgs } from "@remix-run/node";

export const loader = async ({request}: LoaderFunctionArgs ) => {
  const session= await getSession(
    request.headers.get("Cookie")
  );
  const userId=session.get("userId");
  if(!userId){
    return redirect("/startup");
  }
  const user= await db.user.findUnique({
    where: {
      id: userId,
    },
    include:{
      posts: true,
      comments: true,
      likedPosts: true,
      dislikedPosts: true,
      likedComments: true,
      dislikedComments: true,
    }
  })
  return json({user});
}

export const action = async ({request} : ClientActionFunctionArgs) => {
    const form= await request.formData();
    const option= form.get("option");
    const session = await getSession(
      request.headers.get('Cookie')
    );
    const userId=session.get("userId");
    const user= await db.user.findUnique({
      where:{
        id: userId,
      },
    });
    if(!user){
      throw new Error("User not found")
    }
    switch(option){
        case "logout" :
            return redirect("/login", {
      headers: {
        "Set-Cookie": await destroySession(session),
      },
    });
        case "changePass" :
          const oldPass=String(form.get("oldPass"));
          const newPass1=String(form.get("Pass1"));
          const newPass2=String(form.get("Pass2"));
          if(newPass1 != newPass2){
            throw new Error("How did this happen");
          }
          const newPassHash=await bcrypt.hash(newPass2, 10);
          const userid=await validateUser({password: oldPass, name: user.username});
          if(!userid){
            const error="Error when changing the password. Please try again";
            return json({error});
          }
          const newUser=await db.user.update({
            where: {
              id: userid,
            },
            data:{
              passwordHash: newPassHash,
            }
          });
          session.set('userId',newUser.id);
          return new Response("Password was successfully changed", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
        case "changeUsername":
          const newUsername=String(form.get("newUsername"));
          if (!newUsername || typeof newUsername !== "string") {
            return json({ error: "Invalid or missing username" }, { status: 400 });
        }
          const nameTaken= await db.user.findUnique({
            where:{
              username: newUsername,
            }
          });
          if(nameTaken){
            return json({error:"Username already taken" }, {status: 404});
          }
          const namedUser=await db.user.update({
            where: {
              id: userId,
            },
            data:{
              username: newUsername,
            },
          });
          session.set('userId',namedUser.id);
          return new Response("Username was successfully changed", {
            headers: {
                "Set-Cookie": await commitSession(session),
            },
        });
        case "changeMail":
          const oldEmail=String(form.get("oldEmail"));
          const newEmail=String(form.get("newEmail"));
          const userWEmail=await db.user.findUnique({
            where: {
              email: oldEmail,
            }
          });
          const userWNewMail=await db.user.findUnique({
            where:{
              email: newEmail,
            }
          });
          if(!userWEmail){
            return json({error:"Wrong email" }, {status: 404});
          }
          if(userWNewMail){
            return json({error:"There already exists an account with this email" }, {status: 404});
          }
          const updatedEmailUser=await db.user.update({
            where:{
              id: userId,
            },
            data:{
              email: newEmail,
            }
          }) 
          session.set('userId',updatedEmailUser.id);
          return new Response("Password was successfully changed", {
        headers: {
          "Set-Cookie": await commitSession(session),
        },
      });
      case "showEmail":
        const password=String(form.get("password"));
        const ok=await validateUser({password, name:user.username});
        if(!ok){
          return json({error:"Incorrect password" }, {status: 404});
        }
        return json({email: user.email});
      case "delete":
        await db.user.delete({
          where:{ 
            id:userId
          }
        });
        return redirect("/login", {
          headers: {
            "Set-Cookie": await destroySession(session),
          },
        });
        default:
          throw new Error("Unknown option");
    }
  };

export default function Account(){
  const data=useLoaderData<typeof loader>();
  const actionData=useActionData<typeof action>();
  const [pass, setPass]=useState("");
  const [pass1, setPass1]=useState("");
  const [pass2, setPass2]=useState("");
  const [logout, setLogout]=useState(false);
  const [name, setName]=useState("");
  const [mail, setMail]=useState("");
  const [oldMail, setOldMail]=useState("");
  const [showMail, setShowMail]=useState(false);
  const [password, setPassword]=useState("");
  const [del, setDel]=useState(false);
  function longPass(pass: string ){
    if(pass){
      return (pass.length>=6);
    }
  }
    return(
        <div className="bg-gray-100 min-h-screen flex items-center justify-center"  >
        <div className="mb-4 text-center" >
        <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-3xl">
        <div className="mb-4 text-center">
            <h1 className="text-2xl font-bold">Account Page</h1>
            <p className="text-gray-600">Logged in as <span id="username" className="font-semibold text-gray-800">{data.user?.username}</span></p>
        {data.user?.posts && <p>Congrats! You helped Vasonim's community by posting {data.user?.posts.length > 1 ? `${data.user?.posts.length} times`:'once' }!
          <br /> Also, you commented {data.user?.comments.length > 1 ? `${data.user?.comments.length} times` : "once" } on posts across this app! </p>}
        </div>
      <Form method='post' onSubmit={() => {
        setName("");
        setPass("");
        setPass1("");
        setPass2("");
        setLogout(false);
        setPassword("");
        }} >
          <div className="flex" >
            
        <details className="mb-4 " >
          <summary className="py-2 px-4 bg-gray-200 rounded" >Change password</summary> 
        <div className="mt-2 items-center  " >
        <input type="password" name="oldPass" placeholder="Old password"
        className="w-full py-2 px-3 mb-2 border rounded focus:outline-none "
        onInput={(e) => setPass(e.currentTarget.value)} 
        value={pass}
        /> 
        <input type="password" name="Pass1" placeholder="New password"
        className="w-full py-2 px-3 mb-2 border rounded focus:outline-none "
        onInput={(e: any) => setPass1(e.currentTarget.value)} 
        value={pass1}
        />
        {(!longPass(pass1) && pass1 ) && <p className="wrong" >New password too short</p>}
        <input type="password" name="Pass2" placeholder="Re-enter new password"
        className="w-full py-2 px-3 mb-2 border rounded focus:outline-none  "
        onInput={(e: any) => setPass2(e.currentTarget.value) } 
        value={pass2}
        />
        {((pass1 != pass2) && pass2 ) && <p className="wrong" >Passwords don't match</p>}
        {(pass1===pass2 && (pass1 && pass2 && pass ) ) ?  
        <button type="submit" name='option' value="changePass" 
        className="w-full py-2 px-4 bg-yellow-400 text-white rounded hover:bg-yellow-500   " >Change</button> : 
        <button type="submit" name='option' value="changePass" 
        className="w-full py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-400 focus:outline-none  " disabled>Change</button>}
          </div> 
        </details>

        <details className="mb-4" >
          <summary className="cursor-pointer py-2 px-4 bg-gray-200 rounded" >Change username</summary>
          <div className="mt-2" >
          <input type="text" name="newUsername" value={name} placeholder="New username"
          className="w-full py-2 px-3 mb-2 border rounded focus:outline-none "
          onInput={(e) => setName(e.currentTarget.value) } />
          {(name && name!=data.user?.username ) ?  <button type="submit" 
          name="option" 
          value="changeUsername" 
          className="w-full py-2 px-4 bg-yellow-400 text-white rounded hover:bg-yellow-500 focus:outline-none  " >
          Update Username</button> 
          : 
          <button type="button" 
          name="option" 
          value="changeUsername" 
          className="w-full py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-400 focus:outline-none  " disabled>Update Username</button> }
          </div>
        </details>

            <details className="mb-4" >
              <summary className="cursor-pointer py-2 px-4 bg-gray-200 rounded"  >Change email</summary>
              <div className="mt-2 " >
          <input type="text" name="oldEmail" value={oldMail} placeholder="Old email " 
          className="w-full py-2 px-3 mb-2 border rounded focus:outline-none "
          onInput={(e) => setOldMail(e.currentTarget.value) } />
          <input type="text" name="newEmail" value={mail} placeholder="New email"
          className="w-full py-2 px-3 mb-2 border rounded focus:outline-none "
          onInput={(e) => setMail(e.currentTarget.value) } />
        {(oldMail ===data.user?.email && mail && mail!=data.user?.email && mail.includes("@") ) ?  <button type="submit" 
        name="option" 
        value="changeMail"
        className="w-full py-2 px-4 bg-yellow-400 text-white rounded hover:bg-yellow-500 focus:outline-none  " >
          Change Email</button> : <button type="button" 
        name="option" 
        value="changeMail"
        className="w-full py-2 px-4 bg-gray-400 text-white rounded hover:bg-gray-400 focus:outline-none  " disabled>
          Change Email</button> }
              </div>
            </details>
            </div>
            <div className="flex mt-2 justify-center text-center " >

            <div className="mb-4 mx-auto" >
            <button className="py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 focus:outline-none "
             type="button" 
            onClick={() => {
              setLogout(!logout);
              setDel(false);
              setShowMail(false);
              } } >
          {logout ? "Cancel" : "Log Out" }
        </button>
            { logout && <>
            <p>Are you sure you want to log out?</p>
            <button type="submit" name='option' value="logout" className="mt-2 py-2 px-4 bg-gray-800 text-white rounded hover:bg-gray-900 focus:outline-none  " >Log out</button>
            </>}
        </div>


        <div className="mb-4 mx-auto " >
          <button className=" py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none  focus:ring-red-600 focus:ring-opacity-50" 
          type="button" 
          onClick={()=> {
            setDel(!del);
            setShowMail(false);
            setLogout(false);
            } } >{!del ? "Delete Account" : "Cancel" }</button>
          {del && <div>
            <p className="text-red-500 font-semibold w-64" >Are you sure you want to permanently delete your account?</p>
            <button type="submit" name="option" value="delete" className="mt-2 py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none  focus:ring-red-600 focus:ring-opacity-50"  >Delete</button>
          </div>}
            </div>


        <div className="mb-4 mx-auto " >
              <button className=" py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-500 focus:outline-none  focus:ring-yellow-600 focus:ring-opacity-50" 
              type="button" 
              onClick={() => {
                setShowMail(!showMail);
                setDel(false);
                setLogout(false);
                }} >
          {!showMail ? "Show Email" : "Cancel" }
          </button>
            {showMail && <div className="mt-2" >
                <input type="password" name="password" className="w-full py-2 px-3 border rounded focus:outline-none  focus:ring-yellow-500 focus:border-transparent"
                placeholder="Enter password "
                value={password} 
                onInput={(e) => setPassword(e.currentTarget.value) } />
              {actionData?.email && <p className="mt-2 text-gray-800 font-semibold " >{actionData?.email}</p>} 
              {actionData?.error && <p className="mt-2 text-gray-800 font-semibold " >{actionData?.error}</p>}   
              <button type="submit" name="option" value="showEmail" className=" py-2 px-4 bg-yellow-500 text-white rounded hover:bg-yellow-500 focus:outline-none  focus:ring-yellow-600 focus:ring-opacity-50" >Verify</button>
              </div>}
        </div>

            </div>
      </Form>
      
      </div>
      </div>
        </div >
    )
}