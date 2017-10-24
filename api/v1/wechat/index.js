const pay = require('./payment')
const $   = require('../../../utils')
const {we}  = require('../../../config')
const {productModel, orderModel} = require('../../../models').v1

/**
 * 微信小程序支付接口
 * @param {koa} ctx 
 * 发送数据:
 * - product_id 商品id
 * - openid 用户openid
 * - token 用户token
 */
async function weappCreateOrder (ctx) {
  let body = ctx.request.body
  let product_id = body.product_id
  if (!product_id) return $.result(ctx, 'param err')
  try {
    let data = await productModel.findById(product_id)  // 数据库查找商品信息
    body.body = data.body                // 商品名称
    body.total_fee = data.total_fee      // 商品价格
    body.detail = data.detail            // 商品简介
    body.device_info = data.device_info  // 设备编号
    body.trade_type = 'JSAPI'            // 交易类型 小程序
    body.appid = we.appid_app            // 小程序id

    let res = await pay.createOrder(ctx, body)  // 调用接口创建订单
    // $.info(res)
    if (!res.prepay_id) return $.result(ctx, res)

    // 调用再次签名 https://pay.weixin.qq.com/wiki/doc/api/wxa/wxa_api.php?chapter=7_7&index=3
    let weappParams = {
      appId: we.appid_app,
      timeStamp: $.createTimestamp(),
      nonceStr: $.createNonceStr(),
      package: 'prepay_id=' + res.prepay_id,
      signType: 'MD5'
    }
    weappParams.paySign = $.signWe(weappParams)  // 进行签名
    $.result(ctx, weappParams)

    if (res.return_code === 'SUCCESS') {  // 使用数据库写入订单
      body.user = ctx.user.id
      orderModel.create(body)
    }
  } catch (e) {
    $.error(e)
    $.result(ctx, 'err')
  }
}

module.exports = {
  weappCreateOrder,
}