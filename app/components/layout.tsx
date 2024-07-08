import { Link } from "@remix-run/react";
import { faUser, faHouse, faList, faPlus, faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { config } from '@fortawesome/fontawesome-svg-core';
config.autoAddCss = false;



export function Layout({ location ,user, children }: { location: any ;user: any, children: React.ReactNode }) {
    return (
      <div className="" >
        <header className="">
          <nav> 
          <div className="fixed" >
<Link to="https://www.vasonim.com" target="_blank" className="flex-col items-center " >
  <img src="/logoVasonim.png " alt="Vasonim Logo" className="flex " />
  <p className="flex font-bold " >Vasonim</p>
</Link>
      <br />
      
            </div>
            <div className="nav">
      <div className="items-center flex-col flex" >
      { user?.id ? //afiseaza [object Object] daca selectez sesiunea
        (<>
        <Link to="/account" className={`text-center text-3xl ${location ==="/account" ? "text-orange-400 hover:text-orange-500" : "" }`} ><FontAwesomeIcon icon={faUser} /></Link>
        <br />
        </>)
      :
          (<>
          <Link to='/startup' className='text-center'>Got an account? Log in!</Link>
          <br />
          </>)
      }
        <Link to='/' className={`text-center text-3xl ${location ==="/" ? "text-orange-400 hover:text-orange-500" : "" }`} ><FontAwesomeIcon icon={faHouse} /></Link>
      <br />
      <Link to="/section" 
      className={`text-center text-3xl ${location === "/section" ? "text-orange-400 hover:text-orange-500" : `${location.includes("/sections") ? `${location.includes("urgent") ? "text-red-500 hover:text-red-600" : "" } ${location.includes("general") ? "text-green-500 hover:text-green-600" : "" } ${location.includes("informational") ? "text-blue-500 hover:text-blue-600" : "" }` : "" }` }`} >
        <FontAwesomeIcon icon={faList} />
      </Link>
      <br />
      <Link to={user ? '/new' : "/startup"} className={`text-center text-3xl ${location ==="/new" ? "text-orange-400 hover:text-orange-500" : "" }`} ><FontAwesomeIcon icon={faPlus} /></Link>
      <br/>
      </div>
      </div>
      </nav>
        </header>
        <main className="pl-20" >{children}</main>
        <footer>
          {/* Footer content */}
        </footer>
      </div>
    );
  }