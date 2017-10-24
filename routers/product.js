const Router       = require('koa-router')
const {authToken}  = require('../utils/auth')
const {productApi} = require('../api').v1
const product      = new Router()

/**
 * product router
 */
product.get('/',               authToken, productApi.all)       // 查找
       .post('/',              authToken, productApi.create)    // 新建

product.get('/detail/:id',     authToken, productApi.findById)  // 查看
       .patch('/detail/:id',   authToken, productApi.update)    // 更新
       .delete('/detail/:id',  authToken, productApi.delete)    // 删除
       
module.exports = product