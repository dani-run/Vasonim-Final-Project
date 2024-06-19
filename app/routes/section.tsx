import { Link} from "@remix-run/react";


export default function Sections(){
    return (<>
    <main >
        <br />
        <Link to="/sections/urgent" >Urgent Cases</Link>
        <br />
        <Link to="/sections/general" >General Questions</Link>
        <br />
        <Link to="/sections/informational" >Informational Resources</Link>
    </main>
    </>)
}