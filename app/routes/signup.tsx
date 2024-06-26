import { Form,ClientActionFunctionArgs,Link, json, useActionData } from "@remix-run/react"
import { useState } from "react";
import { redirect } from "@remix-run/node";
import { register } from "~/utils/session.server";
import { getSession, commitSession } from "~/utils/session.server";

export const action = async ({request} :ClientActionFunctionArgs) => {
    const session = await getSession(
        request.headers.get("Cookie")
      );
    const form = await request.formData();
    const password = String(form.get('password2'));
    const username = String(form.get('username'));
    const email = String(form.get('email'));
    const user= await register({password, username, email });
       // return redirect('/');
        if (user === 1) {
            return json({error: "Username already taken"})
          }else if(user === 2){
            return json({error: "Account registered with this email already exists"}) 
          }else if(user === 3){
            return json({error: "Both username and email are already being used"})
          }
          session.set('userId',user.id);
        console.log(username, password, ' logged');
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
    return (!email.includes("@") && email);
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
    return (<>
    <Link to='/startup'>Back</Link>
    <Form method="post" >
        <label>
            Username: 
            <input type="text" required name='username' onInput={e => {
                setName(e.currentTarget.value);
            }
            } />
        </label>
        <br />
        <label>
            Email:
            <input type="email" value={email} name='email' required onInput={e=>{
                setEmail(e.currentTarget.value);
                }} />
        </label>
        {noEmail() && <p className="wrong" > Please enter a valid email address.</p>}
        <br />
        <label>
            Password: 
            <input type="password" required value={password} onInput={e=>{
                setPassword(e.currentTarget.value);
                }} />
        </label>
        {shortPass() && <p className="wrong" >Password too short</p> }
        <br />
        <label>
            Confirm password: 
            <input type="password" value={password2} name='password2' onInput={e=>{
                setPassword2(e.currentTarget.value);
                }} required/>
        </label>
        {wrongPass() && <p className="wrong">passwords not matching</p>}
        <br/>
        <label>
            Profile picture(optional)
            <input type="text"/>
        </label>
        <br />
        {actionData?.error && <>{actionData.error}<br /></>}
        
        { (!noEmail() && email && !wrongPass() && password && password2 && name) ? <button type="submit" >Create account</button> : <p>Create account</p>}
    </Form>
        </>);
};