import {
  Outlet,
  Scripts,
  ScrollRestoration,
  ClientLoaderFunctionArgs,
  json,
  useLoaderData,
  useLocation,
} from "@remix-run/react";
import { getSession } from "./utils/session.server";
import { db } from "./utils/db.server";
import { Layout } from "./components/layout";
import {config} from "@fortawesome/fontawesome-svg-core";
config.autoAddCss= false;


export const loader = async ({request} : ClientLoaderFunctionArgs ) => {
  const session=await getSession (
      request.headers.get("Cookie")
  );
  const userId=session.get("userId");
  const user=userId ? await db.user.findUnique({
      where:{
          id: userId,
      }
  }) : null ;
  return json({user});
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
        <title>Vasonim Forum</title>
        <link rel="stylesheet" href="/node_modules/@fortawesome/fontawesome-svg-core/styles.css" />
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Pacifico&display=swap" />
        <link rel="stylesheet" href="/app/styles/output.css" />
        <script src="https://kit.fontawesome.com/1832baa3d3.js" crossOrigin="anonymous"></script>
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