import { Link, useLoaderData } from "@remix-run/react";

export function Layout({ user, children }: { user: any, children: React.ReactNode }) {
    return (
      <div>
        <header>
          <nav className="sidebar" >
      <Link to="https://www.vasonim.com" target="_blank" >Vasonim</Link>
      <br />
      { user?.id ? //afiseaza [object Object] daca selectez sesiunea
        (<>
        <Link to="/account" >Account settings</Link>
        <br />
        </>)
      :
          (<>
          <Link to='/startup' >Got an account? Log in!</Link>
          <br />
          </>)
      }
      <Link to='/' >Home</Link>
      <br />
      <Link to="/section" >Sections</Link>
      <br />
      <Link to="/search" >Search posts</Link>
      <br />
      <Link to="/new" >Add a post</Link>
      <br/>
      </nav>
        </header>
        <main>{children}</main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    );
  }