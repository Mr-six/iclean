const pay = require('./payment')
const $   = require('../../../utils')
const tool  = require('../../tool')
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

/**
 * 微信小程序手机登陆+注册
 * 发送信息
 * - openid
 * - phone
 * - verifyCode
 * - nickname (选填)
 */
async function weLogin (ctx) {
  let body = ctx.request.body
  const {error, value} = $.joi.validate(body, schema.user)  // 验证body对象
  if (error) {
    $.error(error)
    return $.result(ctx, 'params error')
  }
  if (value.phone) {  // 手机
    let exist = await userModel.findOne({"phone": value.phone},{select: 'token'})
    if (!value.verifyCode) return $.result(ctx, '请输入正确的验证码')
    if (exist) return $.result(ctx, exist)  // 若已存在 直接返回token
    let verifyCode = await tool.veryfyCode.checkCode(value.phone, value.verifyCode)
    if (!verifyCode) return $.result(ctx, '验证码不正确')
    value.status = 1  // 手机默认激活
  } else {
    return $.result(ctx, '请输入正确的手机号')
  }
  let user = await userModel.create(value)     // 用户储存
  const token = auth.createToken({id: user._id})  // 生成token
  user = await userModel.findOneAndUpdate({_id: user._id}, { token: token })
  if ($.isEmpty(user)) $.result(ctx, '这册失败, 未知原因', 507)
  else {
    let {token} = user
    $.result(ctx, {token})
  }
}



module.exports = {
  weappCreateOrder,
  weLogin,
}