const axios            = require('axios')
const $                = require('../../../utils')
// const { redditSubApi } = require('../../index').v1
// get top 100 

// ---- config ----
const base   = 'https://api.coinmarketcap.com/v1/ticker/'  // 目标地址
const num    = ''                                          // 数量(不填默认为100)
const target = `${base}?limit=${num}`                      // 请求目标
// ---- config ----


async function getCoinList () {
  try {
    let { data } = await axios.get(target)  // 币种信息列表
    let urlArray = []                       // 币种页面数组
    data.forEach( el => {                   // 遍历列表 提取币种id
      let id = el.id                        // 币种id
      let idUrl = `https:\/\/coinmarketcap\.com\/currencies\/${id}`
      urlArray.push(idUrl)
    })
    $.info(urlArray[0], urlArray.length)
    let page1 = await axios.get(urlArray[0])

  } catch (e) {
    console.error(e)
    return false
  }
}

getCoinList()