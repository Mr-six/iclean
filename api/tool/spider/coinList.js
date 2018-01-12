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
const num    = ''                                         // 总数量(不填默认为100)
const rNum   = 200                                          // 单次爬取数量
const target = `${base}?limit=${num}`                     // 请求目标
const l      = pl(5)                                      // 请求并发数量
// ---- config ----


/**
 * 获取币种id和详情页 url
 */
async function getCoinList () {
  try {
    const { data } = await axios.get(target, {
      timeout: 30000
    })                                       // 币种信息列表
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
      // if (i < start || i > start + rNum) return
      const {id, idUrl} = el
      rList.push(l(async () => {
        // const browser = await pupp.launch({ headless: true})
        // const page = await browser.newPage()
        // await page.goto(idUrl, {
        //   timeout: 0,
        //   waitUntil: ['networkidle2', 'domcontentloaded']
        // })
        // $.info('goto: ', idUrl)
        // await page.setViewport({
        //   width: 1920,
        //   height: 1080,
        // })
        // await page.waitForSelector('#reddit a', { timeout: 0 })
        // const rid = await page.$eval('#reddit a', el => el.href.match(/https?.*\/r\/(.*)\//)[1])
        // await page.close()
        // await browser.close()
        const { data } = await axios.get(idUrl)
        const rid = data.match(/www\.reddit\.com\/r\/(.*?)\.embed\?/)[1]
        if (!rid) return
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


async function initCoinList (start) {
  let list = await getCoinList()
  await getRedditId(list, start)
  return `起始位置: ${start}, 完成抓取${rNum}`
}

module.exports = {
  initCoinList,
}