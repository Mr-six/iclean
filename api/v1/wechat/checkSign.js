const $   = require('../../../utils')

function checkSign (obj) {
  let fMsg = $.j2x({  // 失败返回数据
    return_code: 'FAIL',
    return_msg: '签名失败'
  })
  let rMsg = $.j2x({  // 成功返回数据
    return_code: 'SUCCESS',
    return_msg: 'OK'
  })

  let {sign} = obj
  if (!sign || sign !== $.signWe(obj)) return fMsg
  return rMsg
}

module.exports = checkSign