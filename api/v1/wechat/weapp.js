/**
 * 微信
 */
const axios = require('axios')
const $     = require('../../../utils')
const {we}  = require('../../../config')

// code 换取openid
async function getOpenId (code) {
  let {appid_app, appsecret_app} = we
  let target = 'https://api.weixin.qq.com/sns/jscode2session?appid='
      + appid_app +
      '&secret='
      + appsecret_app +
      '&js_code='
      + code +
      '&grant_type=authorization_code'
  try {
    let {data} = await axios.get(target)
    if (data) return data
    else return false
  } catch (e) {
    $.error(e)
    return false
  }
}

module.exports = {
  getOpenId,
}