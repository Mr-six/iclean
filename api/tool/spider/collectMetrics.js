/**
 * 收集redditmetrics数据
 */

const axios = require('axios')
const schedule = require('node-schedule')
const $ = require('../../../utils')
const { pl } = require('./utils')
// const { redditSubApi } = require('../../index').v1

// ---- config ----
const target = 'http://redditmetrics.com/r/'  // 目标地址
const frequency = `*/1 * * * *`               // 统计频率 cron 风格
const l = pl(3)                               // axios 并发数量
// ---- config ----

// 获取订阅列表
async function getList() {
  try {
    let listArr = []
    const list = await redditSubApi.getall()
    list.forEach(el => {
      const { id, rid } = el
      listArr.push({
        id,
        url: `${target}${rid}`,
      })
    })
    return listArr
  } catch (e) {
    $.error(e)
    return false
  }
}

// 获取订阅人数
async function getSub(arr) {
  if (!arr || arr.length < 0) return
  try {
    let rList = []  // 请求列表
    arr.forEach(el => {
      const { id, url } = el
      rList.push(l(async () => {
        const { data } = await axios.get(url)
        const subNum = data.data.subscribers          // 当前订阅人数
        const activeNum = data.data.active_user_count  // 在线人数
        $.info(`版块: ${id},人数: ${subNum}`)
        await redditSubApi.push(id, {
          sub: [
            Date.now(),
            subNum,
          ],
          active: [
            Date.now(),
            activeNum,
          ]
        })
      }))
    })

    const r = await Promise.all(rList)

  } catch (e) {
    $.error(e)
    return false
  }
}

let url = 'http://redditmetrics.com/r/ethereum'

async function test () {
  let {data} = await axios.get(url)
  data = data.replace(/\s+/g, '')
  // $.info(data)
  // let reg = /data\:\[.*?\];\/\//  // 
  let reg = /data\:\[.*?\]/g  // 
  let r = data.match(reg)
  // r = r[0].split(';')
  // r = r[0].match(/data\:.?,pointSize/)
  // $.info(r.length)
  return r
}
// test(url)





module.exports = test