import { Link, useLocation } from "@remix-run/react";

export function Layout({ location ,user, children }: { location: any ;user: any, children: React.ReactNode }) {
    return (
      <div className="mr-20" >
        <header className="mr-20">
          <nav className="mr-20" >
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
      <Link to='/' className={location==='/' ? 'text-orange-400 hover:text-orange-400 ' : '' } >Home</Link>
      <br />
      <Link to="/section" className={location==='/section' ? 'text-orange-400 hover:text-orange-400 ' : '' } >Sections</Link>
      <br />
      <Link to="/search" className={location==='/search' ? 'text-orange-400 hover:text-orange-400 ' : '' } >Search posts</Link>
      <br />
      <Link to="/new" className={location==='/new' ? 'text-orange-400 hover:text-orange-400 ' : '' } >Add a post</Link>
      <br/>
      </nav>
        </header>
        <main className="pl-20" >{children}</main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    );
  }