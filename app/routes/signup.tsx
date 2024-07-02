import { Form,ClientActionFunctionArgs,Link, json, useActionData, ClientLoaderFunctionArgs } from "@remix-run/react"
import { useState } from "react";
import { redirect } from "@remix-run/node";
import { register } from "~/utils/session.server";
import { getSession, commitSession } from "~/utils/session.server";

export const loader= async ({request}:ClientLoaderFunctionArgs ) =>{
    const session = await getSession(
        request.headers.get("Cookie")
    );
    if(session.has("userId")){
        return redirect("/");
    }
    return null;
}

export const action = async ({request} :ClientActionFunctionArgs) => {
    const session = await getSession(
        request.headers.get("Cookie")
      );
    const form = await request.formData();
    const password = String(form.get('password2'));
    const username = String(form.get('username'));
    const email = String(form.get('email'));
    const user= await register({password, username, email });
        if (user === 1) {
            return json({error: "Username already taken"})
          }else if(user === 2){
            return json({error: "Account registered with this email already exists"}) 
          }else if(user === 3){
            return json({error: "Both username and email are already being used"})
          }
          session.set('userId',user.id);
        return redirect('/', {
            headers: {
                'Set-Cookie': await commitSession(session)
            }
        });
}

export default function SignUp(){
const actionData=useActionData<typeof action>();
const [name, setName]=useState('')
const [email, setEmail]=useState('');
const [password, setPassword]=useState('');
const [password2, setPassword2]=useState('');
function noEmail(){
    return ( !(email.includes(".") && email.includes("@")) && email);
}
function wrongPass(){
    if (password2){
        return (password !==password2);
    }
};
function shortPass(){
    if (password){
         return (!(password.length>=6));
    };
};
    return (<div className="justify-center flex items-center h-screen bg-gray-100 " >
                <div className=" bg-white shadow-2xl h-128 w-192 flex flex-col rounded-3xl items-center " >
                    <div className="fixed text-center mt-2" >
                        <p className="font-bold text-2xl mb-2 " >Welcome to Vasonim Forum</p>
                        <Link to='/login' className="font-semibold text-lg mb-2 underline text-yellow-500 " >Already have an account? Log in!</Link>
                    </div>
    <div className="flex flex-col justify-center items-center mt-20 mb-auto text-center " >
    <Form method="post" >
        <div className="block text-gray-700" >
             
            <input type="text" required 
            name='username' placeholder="Username"
            className="mt-4 block w-96 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none "
             onInput={e => {
                setName(e.currentTarget.value);
            }
            } />
        </div>
        {(name.length<3 && name ) && <p className="wrong" >Usernames must contain at least 3 characters</p> }
        <div className="block text-gray-700" >
            
            <input type="email" placeholder="Email"
            className="mt-4 block w-96 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none "
            value={email} 
            name='email' required onInput={e=>{
                setEmail(e.currentTarget.value);
                }} />
        </div>
        {noEmail() && <p className="wrong" > Please enter a valid email address</p>}
        <div className="block text-gray-700" >
            <input type="password" required placeholder="Password"
            className="mt-4 block w-96 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none "
             value={password} 
             onInput={e=>{
                setPassword(e.currentTarget.value);
                }} />
        </div>
        {shortPass() && <p className="wrong" >Password is too short</p> }
        <div className="block text-gray-700" >
            <input type="password" value={password2} placeholder="Confirm password"
            className="mt-4 block w-96 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none "
            name='password2' onInput={e=>{
                setPassword2(e.currentTarget.value);
                }} required/>
        </div>
        {wrongPass() && <p className="wrong">Passwords are not matching</p>}
        {actionData?.error && <p className="mt-2 text-gray-800 font-semibold " >{actionData.error}</p>}
        { (!noEmail() && email && !wrongPass() && password && password2 && name) ? 
        <button type="submit"
         className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 my-4 " >Create account</button> 
         :
         <button type="button" 
         className="bg-gray-400 text-white px-4 py-2 rounded-lg hover:bg-gray-400 mt-4 " disabled >Create account</button>}
    </Form>
    <Link to='/startup' className="font-semibold text-md mt-4 underline text-gray-950">
            Back to Startup Page
          </Link>
                    </div>
                </div>
        </div>);
};