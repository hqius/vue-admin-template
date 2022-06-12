
import request from '@/utils/request'
export default {
    //获取一级分类
    //     /admin/product/getCategory1
    //     getCategory1
    getCategory1() {
        return request.get('/admin/product/getCategory1')
    },
    //根据一级分类id获取二级分类
    //    /admin/product/getCategory2/{category1Id}
    //     getCategory2
     getCategory2(category1Id) {
        return request.get(`/admin/product/getCategory2/${category1Id}`)
    },
    //根据二级分类id获取三级分类
    //    /admin/product/getCategory3/{category2Id}
    //     getCategory3
    getCategory3(category2Id){
        return request.get(`/admin/product/getCategory3/${category2Id}`)
    }
 
}

