/**
 * 基于joi的对象验证
 */
const $     = require('../utils')

/**
 * 创建账户信息验证
 */
const user  = $.joi.object().keys({
  phone:       $.joi.string().regex(/^(0|86|17951)?(13[0-9]|14[579]|15[0-3,5-9]|17[0135678]|18[0-9])[0-9]{8}$/),
  verifyCode:  $.joi.string().min(3).max(10),
  email:       $.joi.string().email(),
  password:    $.joi.string().min(8).max(30).required(),
  newpassword: $.joi.string().min(8).max(30),
  nickname:    $.joi.string().min(3).max(30),
  openid:      $.joi.string().min(3).max(30),
}).without('phone', 'email')

/**
 * 修改用户信息
 */
const modifyIofo = $.joi.object().keys({
  headimgurl:  $.joi.string(),
  intro:       $.joi.string(),
  sex:         $.joi.number(),
  nickname:    $.joi.string().min(3).max(10)
})

/**
 * 文章信息验证
 */
const article = $.joi.object().keys({
  title:       $.joi.string(),
  user:        $.joi.any(),
  content:     $.joi.string().empty(''),
  markdown:    $.joi.string().empty(''),
  html:        $.joi.string().empty(''),
  subTitle:    $.joi.string().empty(''),
  headerImg:   $.joi.string().empty(''),
  status:      $.joi.string(),
  sendAt:      $.joi.date().empty(''),
})

/**
* 订单信息验证
*/
const order  =        $.joi.object().keys({
  user:               $.joi.any(),                                        // 关联id
  device_info:        $.joi.string().min(3).max(32).required(),           // 设备编号
  body:               $.joi.string().min(3).max(32).required(),           // 商品描述
  out_trade_no:       $.joi.string().min(3).max(32).required(),           // 商户订单
  total_fee:          $.joi.number().integer().required(),                // 标价金额 单位为分
  spbill_create_ip:   $.joi.string().ip({version: ['ipv4']}).required(),  // ip
  notify_url:         $.joi.string().min(3).max(256).required(),          // 通知地址
  trade_type:         $.joi.string().min(3).max(16).required(),           // 交易类型
  openid:             $.joi.string().min(3).max(32),                      // 微信用户的openid
  detail:             $.joi.string().min(3).max(6000),                    // 商品详情
  attach:             $.joi.string().min(3).max(127),                     // 附加数据
})

/**
* 商品信息验证
*/
const product  =      $.joi.object().keys({
  user:               $.joi.any(),                                        // 关联id
  device_info:        $.joi.string().min(3).max(32).required(),           // 设备编号
  body:               $.joi.string().min(3).max(32).required(),           // 商品描述
  detail:             $.joi.string().min(3).max(6000),                    // 商品详情
  total_fee:          $.joi.number().integer().required(),                // 标价金额 单位为分
  pic:                $.joi.string().uri(),                               // 商品图片
 })

module.exports = {
  user,
  article,
  modifyIofo,
  order,
  product,
}