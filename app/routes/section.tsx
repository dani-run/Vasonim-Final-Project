import { Link} from "@remix-run/react";
import { useState } from "react";

export default function Sections(){
  const [hoveredLink, setHoveredLink] = useState("");
 
  const handleMouseEnter = (link: any) => {
    setHoveredLink(link);
  };

  const handleMouseLeave = () => {
    setHoveredLink("");
  };

    return (<>
    <main className="flex flex-1 justify-center items-center text-center h-screen w-screen bg-gray-100 flex-col pr-20 " >
      <div className=" bg-white py-36 px-40 rounded-xl shadow-xl " >
      <div className="mb-20" >
        <p className="text-center text-3xl font-bold  " >Select a section you wish to see posts from</p>
      </div>
        <div className="flex " >
        <div className=" mr-6" >
            <Link to="/sections/urgent"
            onMouseEnter={() => handleMouseEnter('urgent')}
            onMouseLeave={() => handleMouseLeave()}
            className="text-red-500 hover:text-red-600 border-2 border-gray-500 bg-gray-100 h-72 w-96 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4 "  >Urgent Cases</Link>
            <div className={`text-center items-center bottom-full mb-2 bg-gray-700 text-white text-sm rounded  ${hoveredLink === 'urgent' ? 'fade-in show' : 'fade-in'}`}>
              <div className="bg-gray-700 text-white text-sm rounded px-2 py-1 mt-2">
              This section includes cases requiring immediate attention.
              </div>
            </div>
        </div>

        <div className=" mx-0 " >
            <Link to="/sections/general" 
            onMouseEnter={() => handleMouseEnter('general')}
            onMouseLeave={handleMouseLeave}
            className="text-green-500 hover:text-green-600 border-2 border-gray-500 bg-gray-100 h-72 w-96 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4  " 
            >
              General Questions
              </Link>
              <div className={`text-center items-center bottom-full mb-2 bg-gray-700 text-white text-sm rounded  ${hoveredLink === 'general' ? 'fade-in show' : 'fade-in'}`}>
              <div className="bg-gray-700 text-white text-sm rounded px-2 py-1 mt-2">
              This section includes general inquiries.
              </div>
            </div>
        </div>

        <div className=" ml-6 " >
            <Link to="/sections/informational" 
            onMouseEnter={() => handleMouseEnter('informational')}
            onMouseLeave={handleMouseLeave}
            className="text-blue-500 hover:text-blue-600 border-2 border-gray-500 bg-gray-100 h-72 w-96 rounded-3xl flex align-middle justify-center items-center text-center text-lg font-bold mb-4 " >Informational Resources</Link>
          <div className={`text-center items-center bottom-full mb-2 bg-gray-700 text-white text-sm rounded  ${hoveredLink === 'informational' ? 'fade-in show' : 'fade-in'}`}>
              <div className="bg-gray-700 text-white text-sm rounded px-2 py-1 mt-2">
              This section includes key user-shared resources.
              </div>
            </div>
        </div>
      </div>
        </div>
    </main>
    </>)
}