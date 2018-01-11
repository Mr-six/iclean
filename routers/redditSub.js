const Router = require('koa-router')
const { redditSubApi }   = require('../api').v1
const redditSub          = new Router()
const {
        initCoinList,
        collectSub,
      }                  = require('../api/tool/spider')

/**
 * redditSub router
 */
redditSub.get('/currencies/:id', redditSubApi.getById)       // 查找
  .get('/initList', async (ctx) => {
    try {
      await initCoinList()
      ctx.body = '耗时任务执行中*'
    } catch (e) {
      console.error(e)
    }
  })
  .get('/collectSub', async (ctx) => {
    try {
      collectSub()
      ctx.body = '获取数据完成'
    } catch (e) {
      console.error(e)
    }
  })


module.exports = redditSub