import { Form,ClientActionFunctionArgs, ClientLoaderFunctionArgs, Link, useActionData } from "@remix-run/react"
import { json, redirect } from "@remix-run/node";
import { validateUser, getSession, commitSession, destroySession } from "~/utils/session.server";
import { useState } from "react";

export const loader = async ({request}: ClientLoaderFunctionArgs) => {
    const session = await getSession(
        request.headers.get('Cookie')
    );
    if (session.has('userId')){
        return redirect('/');
    }
    return null;
}

export const action = async ({request}: ClientActionFunctionArgs) => {
    const session = await getSession(
        request.headers.get("Cookie")
      );
    const form =await request.formData();
    const name=String(form.get('name'));
    const password=String(form.get('password'));
    const userId=await validateUser({password,name});
    if (userId === null) {
        session.flash("error", "Invalid username/password");
        const error = session.get("error");
        //redirectioneaza aici, dar cu tot cu erori
        return json({error});
      }
      session.set('userId',userId);
    return redirect('/', {
        headers: {
            'Set-Cookie': await commitSession(session),
        }
    });
}

export default function Login(){
    const actionData=useActionData<typeof action>();
    const [name, setName]=useState("");
    const [pass, setPass]=useState("");
    return(
        <div className="justify-center flex items-center h-screen bg-gray-100" >
            
            <div className=" bg-white shadow-2xl rounded-3xl h-128 w-192 flex flex-col items-center " >
                <div className="fixed text-center mb-4 mt-10 " >
                    <p className="font-bold text-2xl mb-2 " >Welcome Back!</p>
                    <Link to='/signup' className="font-semibold text-lg mb-2 underline text-yellow-500 " >Don't have an account? Create one!</Link>
                </div>
         
            <div className="flex-col flex top-2 justify-center my-auto  items-center  text-center " >
                <Form method="post" >
                    <label className="block text-gray-700" >
                    <input type='text' name="name" placeholder="Username or Email"
                     className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none " 
                     onInput={(e) => setName(e.currentTarget.value) } />
                     </label>
                <br />
                <label className="block text-gray-700" >
                    <input type='password' name="password" placeholder="Password"
                     className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none " 
                     onInput={(e) => setPass(e.currentTarget.value) } />
                     </label>
                <br />
                {actionData ? <>{actionData.error }<br /></> : null }
                {(name && pass) ? <button type="submit"
                 className="bg-yellow-500 text-black px-4 py-2 rounded-lg hover:bg-yellow-600 mb-4 " >Log in</button> 
                 :
                 <button type="button"
                 className="bg-gray-400 text-white px-4 py-2 rounded-lg mb-4 hover:bg-gray-400 " disabled>Log in</button> }
            </Form>
            <Link to='/startup' className="font-semibold text-md mt-6 underline text-gray-950">
            Back to Startup Page
          </Link>
            </div>
            </div>
        </div>
    )
}