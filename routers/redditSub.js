const Router = require('koa-router')
const { redditSubApi }   = require('../api').v1
const redditSub          = new Router()
const {
        initCoinList,
        collectSub,
        collectMetrics,
      }                  = require('../api/tool/spider')

/**
 * redditSub router
 */
redditSub.get('/currencies/:id', redditSubApi.getById)       // 查找

  .get('/initList', async (ctx) => {   // 初始化列表 
    try {
      await initCoinList()
      ctx.body = '耗时任务执行中*'
    } catch (e) {
      console.error(e)
    }
  })

  .get('/collectSub', async (ctx) => {  // 收集数据
    try {
      collectSub()
      ctx.body = '开始搜集数据'
    } catch (e) {
      console.error(e)
    }
  })
  .get('/collectMetrics', async (ctx) => {
    let res = await collectMetrics()
    ctx.body = res
  })



module.exports = redditSub