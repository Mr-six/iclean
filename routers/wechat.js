const Router       = require('koa-router')
const {authToken}  = require('../utils/auth')
const {wechatApi}   = require('../api').v1
const wechat        = new Router()

wechat.post('/createOrder',         wechatApi.weappCreateOrder)  // 微信小程序下单
      .post('/saveOpenid',          wechatApi.saveOpenid)        // 保存openid
      .post('/decrypt',             wechatApi.decrypt)           // 数据解密
      .post('/login',               wechatApi.weLogin)           // 微信手机登陆
      .post('/weCallBack',          wechatApi.weCallBack)        // 微信支付回调地址
      .get('/jssdk',                wechatApi.getJsConfig)       // 微信jssdk
     
module.exports = wechat