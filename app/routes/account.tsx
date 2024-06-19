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
      }
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
          console.log(userid);
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
          console.log(userId);
          const namedUser=await db.user.update({
            where: {
              id: userId,
            },
            data:{
              username: newUsername,
            },
          });
          console.log(namedUser);
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
  function longPass(pass: string ){
    if(pass){
      return (pass.length>=6);
    }
  }
    return(
        <>
        <div className="logout" >
        <Link to='/' >Back</Link>
        <br />
        <p>Logged in as <i>{data.user?.username}</i></p>
      <Form method='post' onSubmit={() => {
        setName("");
        setPass("");
        setPass1("");
        setPass2("");
        setLogout(false);
        setPassword("");
        }} >
         { logout && <>
         <p>Are you sure you want to log out?</p>
        <button type="submit" name='option' value="logout" >Log out</button>
        </>}
        <button type="button" onClick={() => setLogout(!logout) } >
          {logout ? "I changed my mind" : "Log out" }
        </button>
        <br />
        <button type="button" onClick={() => setShowMail(!showMail) } >
          {!showMail ? "Show email" : "Cancel" }
          </button>
            {showMail && <>
            <br />
            <label>
                Enter password: {}
                <input type="password" name="password" 
                value={password} 
                onInput={(e) => setPassword(e.currentTarget.value) } />
              </label>
              <button type="submit" name="option" value="showEmail" >Verify</button>
              <br />
              {actionData?.error}
              {actionData?.email && <> The email for this account is <strong>{actionData?.email} </strong></>}  
              </>}
        <details >
          <summary >Change password</summary>
        <label>Enter old password: {}
        <input type="password" name="oldPass" 
        onInput={(e) => setPass(e.currentTarget.value)} 
        value={pass}
        /> 
        </label>
        <br />
        <label>Enter new password: {}
        <input type="password" name="Pass1" 
        onInput={(e: any) => setPass1(e.currentTarget.value)} 
        value={pass1}
        />
        </label>
        {(!longPass(pass1) && pass1 ) && <p className="wrong" >New password too short</p>}
        <br />
        <label>Re-enter new password: {}
        <input type="password" name="Pass2" 
        onInput={(e: any) => setPass2(e.currentTarget.value) } 
        value={pass2}
        />
        </label>
        {((pass1 != pass2) && pass2 ) && <p className="wrong" >Passwords don't match</p>}
        {(pass1===pass2 && (pass1 && pass2 && pass ) ) ? <><br /> 
        <button type="submit" name='option' value="changePass" >Change</button></> : 
        <p>Change</p> }
        {actionData?.error} 
        </details>
        <details>
          <summary>Change username</summary>
        <label>
          Enter new username:
          <input type="text" name="newUsername" value={name} 
          onInput={(e) => setName(e.currentTarget.value) } />
        </label>
        <br />
        
          {(name && name!=data.user?.username ) ?  <button type="submit" 
          name="option" 
          value="changeUsername" 
        >
          Change</button> : <p>Change</p> }
        </details>
            <details>
              <summary>Change email</summary>
              <label>
          Enter old email:
          <input type="text" name="oldEmail" value={oldMail} 
          onInput={(e) => setOldMail(e.currentTarget.value) } />
        </label>
        <br />
              <label>
          Enter new email:
          <input type="text" name="newEmail" value={mail} 
          onInput={(e) => setMail(e.currentTarget.value) } />
        </label>
        <br />
        {(oldMail ===data.user?.email && mail && mail!=data.user?.email && mail.includes("@") ) ?  <button type="submit" 
        name="option" 
        value="changeMail" 
        >
          Change</button> : <p>Change</p> }
            </details>
      </Form>
      
      </div>
        </>
    )
}