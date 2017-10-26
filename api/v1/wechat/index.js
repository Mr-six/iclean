const pay = require('./payment')
const axios = require('axios')
const $   = require('../../../utils')
const auth = require('../../../utils/auth')
const decryptData = require('./decryptData')
const redis  = require('../../../utils/redis')
const tool  = require('../../tool')
const {we, schema}  = require('../../../config')
const {productModel, orderModel, userModel} = require('../../../models').v1

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
  if (value.phone && value.openid) {  // 手机
    let exist = await userModel.findOne({"phone": value.phone},{select: 'token'})
    if (!value.verifyCode) return $.result(ctx, '请输入正确的验证码')
    let verifyCode = await tool.veryfyCode.checkCode(value.phone, value.verifyCode)
    if (!verifyCode) return $.result(ctx, '验证码错误')
    if (exist) {  // 若已存在首先检查token是否过期 否则 直接返回token
      let {_id, token} = exist
      try {
        const decode = await auth.tokenPromise(token)
      } catch (e) {  // 生成新token
        $.info('get new token')
        token = auth.createToken({id: _id})
        exist = await userModel.findOneAndUpdate({_id: user._id}, {token: token})
      }
      return $.result(ctx, exist)
    }
    value.status = 1  // 手机默认激活
  } else {
    return $.result(ctx, '请输入正确的手机号')
  }

  // 创建账户
  let opt = {
    status: 1,
    wallet: we.defaultWallet,  // 赠送金额
  }
  Object.assign(value, opt)
  let user = await userModel.create(value)     // 用户储存
  const token = auth.createToken({id: user._id})  // 生成token
  user = await userModel.findOneAndUpdate({_id: user._id}, { token: token })
  if ($.isEmpty(user)) $.result(ctx, '这册失败, 未知原因', 507)
  else {
    let {token} = user
    $.result(ctx, {token})
  }
}

/**
 * 微信小程序登陆 换取 openid
 */
async function saveOpenid (ctx) {
  let body = ctx.request.body
  if (body.code) {
      let code = body.code
      let {appid_app, appsecret_app} = we
      let target = 'https://api.weixin.qq.com/sns/jscode2session?appid='
          + appid_app +
          '&secret='
          + appsecret_app +
          '&js_code='
          + code +
          '&grant_type=authorization_code'
      let {data} = await axios.get(target)
      if (data.openid) {
        let {openid, session_key, expires_in} = data
        let res = await redis.setKey(openid, session_key)  // 储存
        $.info(res)
        $.result(ctx, {openid})
      } else {
        $.result(ctx, data)
      }
  }
}

/**
 * 微信小程序 自动登陆
 */
async function decrypt (ctx) {
  let body = ctx.request.body
  if (body.openid && body.iv && body.encryptedData) {
    try {
      let res = await decryptData(body)
      // $.info(res)
      // 返回数据格式:
      // { phoneNumber: '13273219209',
      // purePhoneNumber: '13273219209',
      // countryCode: '86',
      // watermark: { timestamp: 1509002949, appid: 'wx2a5cc65b9128ea65' } }
  
      // 注册登陆逻辑
      let exist = await userModel.findOne({"phone": res.phoneNumber},{select: 'token'})
      
      if (exist) {  // 若已存在首先检查token是否过期 否则 直接返回token
        $.info(exist)
        let {_id, token} = exist
        try {
          const decode = await auth.tokenPromise(token)
        } catch (e) {  // 生成新token
          $.info('get new token')
          token = auth.createToken({id: _id})
          exist = await userModel.findOneAndUpdate({_id: user._id}, {token: token})
        }
        return $.result(ctx, exist)
      }

      // 新建用户信息
      let user = await userModel.create({
        phone: res.phoneNumber,
        openid: body.openid,
        status: 1,
        wallet: we.defaultWallet,
      })
      const token = auth.createToken({id: user._id})  // 生成token
      user = await userModel.findOneAndUpdate({_id: user._id}, { token: token })
      if ($.isEmpty(user)) $.result(ctx, '这册失败, 未知原因', 507)
      else {
        let {token} = user
        $.result(ctx, {token})
      }
    } catch (e) {
      $.error(e)
      $.result(ctx, 'server err')
    }
  } else {
    $.result(ctx, 'err params')
  }
}


module.exports = {
  weappCreateOrder,
  weLogin,
  saveOpenid,
  decrypt,
}