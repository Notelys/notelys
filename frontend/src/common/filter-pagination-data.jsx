import api from "./api";

export const filterPaginationData = async ({ create_new_arr = false, state, data, page, countRoute, data_to_send = { }, user }) => {

    let obj;

    if(state != null && !create_new_arr){
        obj = { ...state, results: [ ...state.results, ...data ], page: page }
    } else {

        await api.post(countRoute, data_to_send)
        .then(({ data: { totalDocs } }) => {
            obj = { results: data, page: 1, totalDocs }
        })
        .catch(err => {
        })

    }

    return obj;

}