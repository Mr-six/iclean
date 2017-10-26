const crypto = require('crypto')
const $   = require('../../../utils')
const {we} = require('../../../config')
const redis  = require('../../../utils/redis')

async function decryptData (body) {
  let {openid, encryptedData, iv} = body
  let sessionKey = await redis.getVal(openid)
  if (!sessionKey) return -1  // 用户未换取openid
  sessionKey = new Buffer(sessionKey, 'base64')
  encryptedData = new Buffer(encryptedData, 'base64')
  iv = new Buffer(iv, 'base64')
  try {
    // 解密
   let decipher = crypto.createDecipheriv('aes-128-cbc', sessionKey, iv)
   // 设置自动 padding 为 true，删除填充补位
   decipher.setAutoPadding(true)
   let decoded = decipher.update(encryptedData, 'binary', 'utf8')
   decoded += decipher.final('utf8')
   
   decoded = JSON.parse(decoded)
   if (decoded.watermark.appid !== we.appid_app) return false
   return decoded
  } catch (err) {
    $.error(err)
    return false
  }
}
 

module.exports = decryptData
