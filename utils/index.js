const joi      = require('joi')
const moment   = require('moment')
const crypto   = require('crypto')
const bcrypt   = require('bcrypt')
const log4js   = require('koa-log4')
const xml2json = require('xml2json')           // xml 转json
const json2xml = require('json2xml')           // json 转 xml
const logConf  = require('../config/logConf')  


log4js.configure(logConf)
const logger = log4js.getLogger('app')

module.exports           = logger
module.exports.joi       = joi
module.exports.logHttp   = log4js.koaLogger(log4js.getLogger('http'), {
  level: 'auto'
})

module.exports.x2j = xml2json.toJson

module.exports.j2x = xml2json.json2xml


/**
 * 密码加密
 * passwd 未加密密码
 */
module.exports.encrypt = function (passwd) {
  return bcrypt.hash(passwd, 10)
}

/**
 * 密码解密
 * passwd 未加密密码
 * hash 加密后的密码
 */
module.exports.decrypt = function (passwd, hash) {
  return bcrypt.compare(passwd, hash)
}

/**
 * 生成时间戳
 */
module.exports.createTimestamp = function () {
  return parseInt(new Date().getTime() / 1000) + ''
}

/**
* 生成随机字符串
*/
module.exports.createNonceStr = function () {
  return Math.random().toString(36).substr(2, 15)
}

/**
* 生成随机数字验证码
*/
module.exports.createVerifyCode = function (len = 4) {
  return Math.random().toString().substr(2, len)
}

/**
 * md5
 */
module.exports.md5 = function (str) {
  return crypto.createHash('md5').update(str.toString()).digest('hex')
}
// sha1加密
module.exports.sha1 = function (str) {
  return crypto.createHash("sha1").update(str.toString()).digest("hex")
}

/**
 * base64
 */
module.exports.base64 = function (str) {
  return Buffer(str.toString()).toString('base64')
}

/**
 * trim
 */
module.exports.trimStr = function (str) {
  return str.replace(/(^\s*)|(\s*$)/g, "")
}

/**
 * 对参数对象进行字典排序
 * @param  {对象} args 签名所需参数对象
 * @return {字符串}    排序后生成字符串
 */
module.exports.raw = function (args) {
  var keys = Object.keys(args)
  keys = keys.sort()
  var newArgs = {}
  keys.forEach(function (key) {  // 键值不为空 且不等于sign
    if (args[key] !== '' && key !== 'sign') newArgs[key] = args[key]
  })

  var string = ''
  for (var k in newArgs) {
    string += '&' + k + '=' + newArgs[k]
  }
  string = string.substr(1)
  return string
}

// 微信支付签名
module.exports.signWe = function (data) {
  let sig = module.exports.raw(data)
  sig += '&key=' + we.key
  sig = module.exports.md5(sig).toUpperCase()
  return sig
}


/**
 * 生成 API 返回数据
 * @param   res     response
 * @param   data    返回数据 （code===0:数据体, code>0:error message)
 * @param   status  Status Code
 * @param   code    Error Code (default: 0)
 */
module.exports.result = function (ctx, data, status, code = 0) {
  let redata = {}
  if (typeof data === 'string' ||
    data === 'null' ||
    data === undefined ||
    data === null || code) {
    status = status || 400
    redata = {
      success: false,
      errMsg: data,
    }
  } else {
    status = status || 200
    redata = {
      success: true,
      data: data
    }
  }
  ctx.status = status
  ctx.body = redata
  // ctx.status(status).send(redata)
}

module.exports.isTrue = function (value) {
  if (typeof value === 'boolean') {
    return value
  } else if (typeof value === 'string') {
    return '1 true yes ok'.split(' ').indexOf(value.trim().toLowerCase()) !== -1
  } else {
    return !!value
  }
}

module.exports.isEmpty = function (value) {
  if (typeof value === 'string') {
    return value.trim() === ''
  } else if (typeof value === 'number') {
    return value === 0
  } else if (typeof value === 'object' && value !== null) {
    return Object.keys(value).length === 0
  } else {
    return value === null || value === undefined
  }
}

module.exports.dateformat = function (obj, format) {
  format = format || 'YYYY-MM-DD HH:mm:ss'
  if (process.env.NODE_ENV === 'test') {
    return obj
  }
  return moment(obj).format(format)
}