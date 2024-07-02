import { ClientLoaderFunctionArgs, redirect } from "@remix-run/react";
import {  Link,
} from "@remix-run/react";
import { getSession } from "~/utils/session.server";


export const loader = async ({request}: ClientLoaderFunctionArgs) => {
  const session= await getSession(
    request.headers.get('Cookie')
  );
  if(session.has("userId")){
    return redirect("/")
  } 
   return null;
};

export default function Index() {
  return (
    <div className="justify-center flex items-center h-screen bg-gray-100" >
      <div className="bg-yellow-100 flex-col flex h-128 w-192 rounded-3xl shadow-2xl justify-center items-center " >
            <img src="./logoVasonim.png" alt="Vasonim logo" className="h-64 w-64 " />
            <p className="vasonim " >Vasonim Forum</p>
            <div className="mt-10 mb-10 " >
            <Link to='/login' className="inline-block py-2 px-0 mr-32 bg-black rounded-xl text-white font-bold w-28 text-center text-2xl " >Log in</Link>
            <Link to='/signup' className="inline-block py-2 px-0 ml-32 bg-yellow-400 rounded-xl font-bold w-32 text-center text-2xl " >Sign up</Link>
            </div>
            <Link to='/' className="inline-block py-2 px-0 bg-red-600 rounded-xl font-bold text-center mb-10" >Continue as guest</Link>
          </div>
    </div>
    );
}
