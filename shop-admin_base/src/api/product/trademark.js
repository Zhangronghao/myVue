import request from '../../utils/request'

const api_name = '/admin/product/baseTrademark'

export default{
    getTrademarkList(page,limit){
        return request({
            url:`${api_name}/${page}/${limit}`,
            method:'GET'
        })
    },
    addTrademark(trademark){
        return request({
            url:`${api_name}/save`,
            method:'POST',
            data:trademark
        })
    },
    updateTrademark(trademark){
        return request({
            url:`${api_name}/update`,
            method:'PUT',
            data:trademark
        })
    },
    deleteTrademark(id){
        return request({
            url:`${api_name}/remove/${id}`,
            method:'DELETE'
        })
    },
}