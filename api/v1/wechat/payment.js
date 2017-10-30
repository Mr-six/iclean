/**
 * 微信订单api
 */
const axios = require('axios')
const {we}  = require('../../../config')
const $     = require('../../../utils')

const defaults = {  // 默认配置
  baseURL: we.url,
  timeout: 1000*5,
}
Object.assign(axios.defaults, defaults)

/**
 * 统一下单接口
 * @param {String} url 目标url
 * @param {Object} params 统一下单对象
 * params 对象包含: 
 * - device_info  设备信息
 * - body         商品名称
 * - total_fee    总金额
 * - trade_type   交易类型 小程序:JSAPI 
 * - detail       商品详情(选填)
 * 
 * - out_trade_no 默认生成
 * - notify_url   默认配置
 */
async function req (url, params, ctx) {
  let {appid, mch_id, notify_url} = we

  // 获取ip
  let regip = /(25[0-5]|2[0-4]\d|[0-1]?\d?\d)(\.(25[0-5]|2[0-4]\d|[0-1]?\d?\d)){3}/
  let ip = ctx.request.headers['X-Real-IP'] || ctx.request.headers['x-forwarded-for'] || ctx.request.ip
  if (ip.match(regip)) ip = ip.match(regip)[0]
  else ip = '192.168.0.1'

  params = Object.assign({
    appid,
    mch_id,
    spbill_create_ip: ip,
    notify_url,
    nonce_str: $.createNonceStr(),
  }, params)

  params.sign = $.signWe(params)  // 执行签名

  let body = $.j2x(params)        // Object转为xml

  return axios
        .post(url, body)
        .then(({data}) => $.x2j(data))
}

module.exports = {
  // 下单
  createOrder(ctx, params = {}) {
    return req('/pay/unifiedorder', params, ctx)
  },
  // 查询
  queryOrder(ctx, params = {}) {
    return req('/pay/orderquery', params, ctx)
  },
  // 关闭订单
  closeOrder(ctx, params = {}) {
    return req('/pay/closeorder', params, ctx)
  },

  reverseOrder(ctx, params = {}) {
    return req('/secapi/pay/reverse', params, ctx)
  },

  refund(ctx, params = {}) {
    return req('/secapi/pay/refund', params, ctx)
  },

  queryRefund(ctx, params = {}) {
    return req('/pay/refundquery', params, ctx)
  },
}