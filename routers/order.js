const Router       = require('koa-router')
const {authToken}  = require('../utils/auth')
const {orderApi}   = require('../api').v1
const order        = new Router()

/**
 * order router
 */
order.get('/',                  orderApi.all)       // 查找
     .post('/',      authToken, orderApi.create)    // 新建

order.get('/:id',               orderApi.findById)  // 查看
     .patch('/:id',             orderApi.update)    // 更新
     .delete('/:id', authToken, orderApi.delete)    // 删除
       
module.exports = order