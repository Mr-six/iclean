const Router = require('koa-router')
const { redditSubApi } = require('../api').v1
const redditSub = new Router()


/**
 * redditSub router
 */
redditSub.get('/', redditSubApi.all)       // 查找


module.exports = redditSub