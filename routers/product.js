const Router       = require('koa-router')
const {authToken}  = require('../utils/auth')
const {productApi} = require('../api').v1
const product      = new Router()

/**
 * product router
 */
product.get('/',        productApi.all)       // 查找
       .post('/',       productApi.create)    // 新建

product.get('/:id',     productApi.findById)  // 查看
       .patch('/:id',   productApi.update)    // 更新
       .delete('/:id',  productApi.delete)    // 删除
       
module.exports = product