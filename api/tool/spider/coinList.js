const axios            = require('axios')
// const $                = require('../../../utils')
const pupp             = require('puppeteer')
// const { redditSubApi } = require('../../index').v1
// get top 100 

// ---- config ----
const base   = 'https://api.coinmarketcap.com/v1/ticker/'  // 目标地址
const num    = ''                                          // 数量(不填默认为100)
const target = `${base}?limit=${num}`                      // 请求目标
// ---- config ----



async function getCoinList () {
  try {
    const { data } = await axios.get(target)  // 币种信息列表
    let urlArray = []                       // 币种页面数组
    data.forEach( el => {                   // 遍历列表 提取币种id
      let id = el.id                        // 币种id
      let idUrl = `https:\/\/coinmarketcap\.com\/currencies\/${id}/#social`
      urlArray.push(idUrl)
    })
    console.info(urlArray[0], urlArray.length)
    let pageUrl1 = await axios.get(urlArray[0])
    

  } catch (e) {
    console.error(e)
    return false
  }
}

// getCoinList()

// puppeteer
async function getRedditId (url) {
  try {
    const browser = await pupp.launch()
    const page = await browser.newPage()
    await page.goto(url)
    console.info('goto :', url)
    await page.setViewport({
      width: 1920,
      height: 1080,
    })
    // page.on('load', async () => {
    //   console.info('page load ready')
    //   const _rid = await page.$$eval('#reddit a', el => el.href)
    //   console.info(_rid)
    // })
    // await page.waitForSelector('#navitems-group1 .fore2 a',)
    // const _rid = await page.$eval('#navitems-group1 .fore2 a', el => el.href)
    await page.waitForSelector('#reddit a',)
    const _rid = await page.$eval('#reddit a', el => el.href)
    console.info(_rid)
    await browser.close()

  } catch (e) {
    console.error(e)
  }
}

getRedditId('https://coinmarketcap.com/currencies/bitcoin/')
// getRedditId('https://www.jd.com')