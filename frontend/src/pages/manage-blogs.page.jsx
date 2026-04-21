import { useContext, useEffect, useState } from "react";
import { UserContext } from "../App";
import { filterPaginationData } from "../common/filter-pagination-data";
import axios from "axios";

const ManageBlogs = () => {

    const [ blogs, setBlogs ] = useState(null);
    const [ drafts, setDrafts ] = useState(null);
    const [ query, setQuery ] = useState("");

    let { userAuth: { access_token } } = useContext(UserContext);

    const getBlogs = ({ page, draft, deletedDocCount = 0 }) => {

        axios.post(import.meta.env.VITE_SERVER_DOMAIN + "/user-written-blogs", {
            page, draft, query, deletedDocCount
        }, {
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        })
        .then( async ({ data }) => {
            let formatedData = await filterPaginationData({
                state: draft ? drafts : blogs,
                data: data.blogs,
                page,
                user: access_token,
                countRoute: "/user-written-blogs-count",
                data_to_send: { draft, query }
            })

            console.log(formatedData);

            if(draft){
                setDrafts(formatedData);
            } else {
                setBlogs(formatedData);
            }
        })
        .catch(err => {
            console.log(err);
        })
    }

    useEffect(() => {

        if(access_token){
            if(blogs == null){
                getBlogs({ page: 1, draft: false });
            }
            if(drafts == null){
                getBlogs({ page: 1, draft: true });
            }
        }

    }, [access_token, blogs, drafts, query])

    return (
        <h1>Again BlogPageeeeeeee</h1>
    )
}

export default ManageBlogs;