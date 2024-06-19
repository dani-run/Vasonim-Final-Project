import { ClientLoaderFunctionArgs } from "@remix-run/react";
export const loader = async ({request}: ClientLoaderFunctionArgs) => {
  const session= await getSession(
    request.headers.get('Cookie')
  )
   return null;
};
import {
  Link,
  Outlet,
} from "@remix-run/react";
import { getSession } from "~/utils/session.server";

// import "../styles/index.css";

export default function Index() {
  return (
    <>
     <Outlet />
      <div className="firstPage" >
      <div className="buttons" >
        <div className="acc" >
          <Link to='/login' className="login" >Log into existing account</Link>
          <br />
          <Link to='/signup' className="signup" >Create new account</Link>
        </div>
      </div>
      </div>
    </>
  );
}
