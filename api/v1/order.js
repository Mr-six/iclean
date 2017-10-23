const {orderModel} = require('../../models').v1
const $            = require('../../utils')
const Base         = require('./base')
const {schema}     = require('../../config')

let orderAPI = new Base({
  model: orderModel,
  search: 'body',
})

orderAPI.methods.create = async function (ctx) {
  let body = ctx.request.body
  body.user = ctx.user.id
  const {error, value} = $.joi.validate(body, schema.order)  // 验证body对象
  if (error) return $.result(ctx, 'params error')
  let res = await orderModel.create(value)
  $.result(ctx, res)
}

module.exports = orderAPI.methods