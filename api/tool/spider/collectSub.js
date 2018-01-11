/**
 * 爬取对应reddit对应版块订阅数量信息
 */

const axios = require('axios')
const schedule = require('node-schedule')
const $ = require('../../../utils')
const { pl } = require('./utils')
const { redditSubApi } = require('../../index').v1

// ---- config ----
const target = 'https://www.reddit.com/r/'  // 目标地址
const frequency = `*/30 * * * *`             // 统计频率 cron 风格
const l = pl(5)                             // axios 并发数量
// ---- config ----

// 获取订阅列表
async function getList () {
  try {
    let listArr = []
    const list = await redditSubApi.getall()
    
    list.forEach(el => {
      const { id, rid } = el
      listArr.push({
        id,
        url: `${target}${rid}/about.json`,
      })
    })
    return listArr
  } catch (e) {
    $.error(e)
    return false
  }
}

// 获取订阅人数
async function getSub (arr) {
  if (!arr || arr.length < 0) return
  try {
    let rList = []  // 请求列表
    arr.forEach( el => {
      const {id, url} = el
      rList.push(l( async () => {
        const {data} = await axios.get(url)  // 当前订阅人数
        const subNub = data.data.subscribers
        // $.info(`版块: ${id},人数: ${subNub}`)
        await redditSubApi.push(id, [
          Date.now(),
          subNub,
        ])
      }))
    })

    const r = await Promise.all(rList)

  } catch (e) {
    $.error(e)
    return false
  }
}

async function colection () {
  const list = await getList()
  await getSub(list)
}

function startCol () {
  $.info('开始收集数据')
  let j = schedule.scheduleJob(frequency, () => {
    colection()
  })
}

module.exports = startCol