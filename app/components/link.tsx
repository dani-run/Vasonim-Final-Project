import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faTrash } from "@fortawesome/free-solid-svg-icons"
import { Form, Link } from "@remix-run/react"
import { useState } from "react"

export function LinkItem({ canEdit, link }: any) {
const [del, setDel]=useState(false);

return (<div  className="flex " >
        { canEdit && <Form method="post" >
            <input type="hidden" name="linkId" value={link.id} />
            <button 
            type="button" 
            onClick={() => setDel(!del) }
            className={`ml-2 !border-0 !shadow-none hover:bg-inherit ${del ? 'text-gray-600 hover:text-gray-700' : 'text-red-500 hover:text-red-600 ' } `}
            ><FontAwesomeIcon icon={faTrash} /></button>
        <Link to={link.content} target="_blank" className="text-blue-500 hover:underline" >{link.content}</Link>
            {del && <div className=" " >
                 <p>Are you sure you want do delete this link?</p> 
                 <button type="submit" name="option" value="deleteLink" className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg" >Delete</button>
                 </div> }
        </Form>}
            </div>)
}