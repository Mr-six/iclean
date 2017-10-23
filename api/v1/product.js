const {productModel} = require('../../models').v1
const $            = require('../../utils')
const Base         = require('./base')
const {schema}     = require('../../config')

let productApi = new Base({
  model: productModel,
  search: 'body',
})

productApi.methods.create = async function (ctx) {
  let body = ctx.request.body
  body.user = ctx.user.id
  const {error, value} = $.joi.validate(body, schema.product)  // 验证body对象
  if (error) return $.result(ctx, 'params error')
  let res = await productModel.create(value)
  $.result(ctx, res)
}

module.exports = productApi.methods