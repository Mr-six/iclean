// 获取货币列表和reddit对应数据并保存到数据库

const axios            = require('axios')
const $                = require('../../../utils')
const pupp             = require('puppeteer')
const {  pl }          = require('./utils')
const { redditSubApi } = require('../../index').v1


const header = {
  'User-Agent':'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/55.0.2883.95 Safari/537.36'
}

Object.assign(axios.default, {header})

// ---- config ----
const base   = 'https://api.coinmarketcap.com/v1/ticker/'  // 目标地址
const l      = pl(5)                                      // 请求并发数量
// ---- config ----


/**
 * 获取币种id和详情页 url
 */
async function getCoinList(start, limit) {
  const target = `${base}?start=${start}&limit=${limit}`     // 请求目标
  try {
    const { data } = await axios.get(target, {
      timeout: 30000
    })                                      // 币种信息列表
    let urlArray = []                       // 币种页面数组
    data.forEach( el => {                   // 遍历列表 提取币种id
      let id = el.id                        // 币种id
      let idUrl = `https:\/\/coinmarketcap\.com\/currencies\/${id}/`
      urlArray.push({
        id,
        idUrl
      })
    })
    $.info('get target urls: ', urlArray.length)
    return urlArray
  } catch (e) {
    $.error(e)
    return false
  }
}




// puppeteer 爬虫
async function getRedditId (urlArr, start) {
  if (!urlArr || urlArr.length < 0) return
  try {
    
    let rList = []  // 请求列表
    urlArr.forEach( (el, i) => {
      const {id, idUrl} = el
      rList.push(l(async () => {
        const { data } = await axios.get(idUrl)
        const _rid = data.match(/www\.reddit\.com\/r\/(.*?)\.embed\?/)
        if (!_rid || _rid.length < 1) return
        const rid = _rid[1]
        $.info({
          id: el.id,
          rid,
          i
        })
        await redditSubApi.create({
          id,
          rid,
        })
      }))
    })

    const r = await Promise.all(rList)

    $.info('列表更新完成')
    

  } catch (e) {
    $.error(e)
  }
}


async function initCoinList (start = 0, num = 100) {
  let list = await getCoinList(start, num)
  await getRedditId(list)
  return `起始位置: ${start}, 完成抓取${num}条列表。列表初始化完成。可开始执行数据抓取。`
}

module.exports = {
  initCoinList,
}