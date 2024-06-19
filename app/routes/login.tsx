import { Form,ClientActionFunctionArgs, ClientLoaderFunctionArgs, Link, useActionData } from "@remix-run/react"
import { json, redirect } from "@remix-run/node";
import { validateUser, getSession, commitSession, destroySession } from "~/utils/session.server";

export const loader = async ({request}: ClientLoaderFunctionArgs) => {
    const session = await getSession(
        request.headers.get('Cookie')
    );
    if (session.has('userId')){
        return redirect('/');
    }
    const data= {error: session.get('error')};
    return json(data, {
     headers: {
        "Set-Cookie": await commitSession(session),
     },
    });
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
    console.log(name, password, ' logged');
    return redirect('/', {
        headers: {
            'Set-Cookie': await commitSession(session)
        }
    });
}

export default function Login(){
    const actionData=useActionData<typeof action>();
    return(
        <>
        <p>Welcome Back!</p>
            <Form method="post" >
                <label>
                    Username or email: 
                    <input type='text' name="name" />
                </label>
                <br />
                <label>
                    Password: 
                    <input type="password" name='password' />
                </label>
                <br />
                {actionData ? <>{actionData.error }<br /></> : null }
                <button type='submit' >Log in</button>
            </Form>
            <Link to='/startup' >Back</Link>
            <br />
            <Link to='/signup' >Dont't have an account? Create one!</Link>
        </>
    )
}