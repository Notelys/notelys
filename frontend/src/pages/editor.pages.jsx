import { createContext, useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Navigate, useParams, useNavigate } from "react-router-dom";
import BlogEditor from "../components/blog-editor.component";
import PublishForm from "../components/publish-form.component";
import Loader from "../components/loader.component";
import api from "../common/api";
import { toast } from "react-hot-toast";

const blogStructure = {
    title: "",
    banner: "",
    content: [],
    tags: [],
    des: "",
    author: { personal_info: { } }
}

export const EditorContext = createContext({ });

const Editor = () => {

    let { blog_id } = useParams();
    const navigate = useNavigate();

    const [ blog, setBlog ] = useState(blogStructure);
    const [ editorState, setEditorState ] = useState("editor");
    const [ textEditor, setTextEditor ] = useState(null);
    const [ loading, setLoading ] = useState(true);
    
    let { userAuth: {access_token, username} } = useContext(UserContext);

    useEffect(() => {

        if(!blog_id){
            return setLoading(false);
        }

        api.post("/get-blog", {blog_id, draft: true, mode: 'edit'})
        .then(( { data: {blog} } ) => {
            if (blog.author.personal_info.username !== username) {
                toast.error("You don't have permission to edit this blog");
                navigate("/");
                return;
            }
            setBlog(blog);
            setLoading(false);
        })
        .catch(err => {
            setBlog(null);
            setLoading(false);
        })

    }, [])
    
    return(
        // by using this "EditorContext.Provider" now we can use all states "blog, setBlog, editorState, setEditorState" inside the "BlogEditor & PublishForm" components.
        <EditorContext.Provider value={{ blog, setBlog, editorState, setEditorState, textEditor, setTextEditor }}>
            {
                access_token === null ? <Navigate to="/signin" />
                : 
                loading ? <Loader /> :
                editorState == "editor" ? <BlogEditor/> : <PublishForm/>
            }
        </EditorContext.Provider>
    )
}

export default Editor;
