import { Link} from "@remix-run/react";


export default function Sections(){
    return (<>
    <main className="flex flex-1 align-middle justify-center items-center text-center h-screen w-screen flex-col " >
        <div className="flex-1 p-6 " >
            <Link to="/sections/urgent" className="text-red-500 border-2 border-gray-500 bg-gray-100 h-60 w-80 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4 "  >Urgent Cases</Link>
        </div>

        <div className="flex-1 p-6" >
            <Link to="/sections/general" className="text-green-500 border-2 border-gray-500 bg-gray-100 h-60 w-80 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4  " >General Questions</Link>
        </div>

        <div className="flex-1 p-6  " >
            <Link to="/sections/informational" className="text-blue-500 border-2 border-gray-500 bg-gray-100 h-60 w-80 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4 " >Informational Resources</Link>
        </div>
        
    </main>
    </>)
}