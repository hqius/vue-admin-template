import request from '../../utils/request'

export default {
    // DELETE /admin/product/baseTrademark/remove/{id}
    // 删除BaseTrademark
    delete(id) {
        return request.delete(`/admin/product/baseTrademark/remove/${id}`)
    },
    // POST /admin/product/baseTrademark/save
    // 新增BaseTrademark
    // PUT /admin/product/baseTrademark/update
    // 修改BaseTrademark
    addOrUpdateTrademark(trademark) {
        if (trademark.id) {
            return request.put('/admin/product/baseTrademark/update',trademark)
        }
        return request.post('/admin/product/baseTrademark/save',trademark)
    },


    // GET /admin/product/baseTrademark/{page}/{limit}
    //查询品牌分页列表
    getPageList(page, limit) {
        return request.get(`/admin/product/baseTrademark/${page}/${limit}`)
    },
    //获取所有品牌列表
    getList(){
        return request.get(`/admin/product/baseTrademark/getTrademarkList`)
    }
}