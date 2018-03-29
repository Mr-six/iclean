const userApi     = require('./user')
const articleApi  = require('./article')
const orderApi    = require('./order')
const productApi  = require('./product')
const uploadApi   = require('./upload')
const wechatApi   = require('./wechat')
module.exports    = {
    userApi,
    articleApi,
    uploadApi,
    orderApi,
    productApi,
    wechatApi,
}