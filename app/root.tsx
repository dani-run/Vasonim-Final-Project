import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  MetaFunction,
  ClientLoaderFunctionArgs,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { getSession } from "./utils/session.server";
import { db } from "./utils/db.server";
import { Layout } from "./components/layout";

export const meta: MetaFunction = () => {
  return [
    { title: "Vasonim Forum" },
    { name: "description", content: "Welcome to Vasonim's Forum!" },
  ];
};

export const loader = async ({request} : ClientLoaderFunctionArgs ) => {
  const session=await getSession (
      request.headers.get("Cookie")
  )
  const userId=session.get("userId");
  if(!userId){
    return json({user: null});
  }
  const user=await db.user.findUnique({
      where:{
          id: userId,
      }
  });
  return json({user})
}

export default function App() {
  const location= useLocation();
  const data=useLoaderData<typeof loader>();
  const excludedRoutes=["/login", "/startup","/signup"];
  const isExcluded=excludedRoutes.includes(location.pathname);
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/app/styles/output.css" />
        <link href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body>
        { isExcluded ? (<Outlet />) : ( 
          <Layout user={data.user} location={location.pathname} >
            <Outlet />
          </Layout>
          ) }
      <Scripts />
      <ScrollRestoration />
      </body>
    </html>
  );
}