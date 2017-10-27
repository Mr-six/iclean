const Router       = require('koa-router')
const {authToken}  = require('../utils/auth')
const {wechatApi}   = require('../api').v1
const wechat        = new Router()

/**
 * wechat router
 */
// wechat.get('/',                  wechatApi.all)       // 查找
//       .post('/',      authToken, wechatApi.create)    // 新建

// wechat.get('/:id',               wechatApi.findById)  // 查看
//       .patch('/:id',             wechatApi.update)    // 更新
//       .delete('/:id', authToken, wechatApi.delete)    // 删除

wechat.post('/createOrder',         wechatApi.weappCreateOrder)  // 微信小程序下单
      .post('/saveOpenid',          wechatApi.saveOpenid)        // 保存openid
      .post('/decrypt',             wechatApi.decrypt)           // 数据解密
      .post('/login',               wechatApi.weLogin)           // 微信手机登陆
      .post('/weCallBack',          wechatApi.weCallBack)        // 微信支付回调地址
     
module.exports = wechat