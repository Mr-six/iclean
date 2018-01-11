const { redditSubModel } = require('../../models').v1
const $ = require('../../utils')
const Base = require('./base')

let redditSubApi = new Base({
  model: redditSubModel,
  search: 'name',
})


/**
 * 初始化 reddit 订阅列表
 * @param {String} name reddit
 */
redditSubApi.methods.create = async (info) => {
  let res
  const {id,rid} = info  // 货币id和reddit id
  let exist = await redditSubApi.model.findOne({ id: id })
  if (!exist) {
    res = await redditSubApi.model.create({ id: id, rid: rid, reddit_subscribers_num: [] })
  }
  return res ? res : 'exist'
}

/**
 * reddit 向订阅表中添加数据
 * @param {String} id 币种id
 * @param {Array} info 某时间此版块的订阅人数
 */
redditSubApi.methods.push = async (id, info) => {
  let exist = await redditSubApi.model.findOne({ id: id })
  if (!exist) {  // 如果数据列表不存在,则创建
    let res = await redditSubApi.model.create({ id: id }, {
      reddit_subscribers_num: []
    })
  }

  let res = await redditSubApi.model.push({ id: id }, {
    reddit_subscribers_num: info
  })
  return res
}

/**
 * 获取币种列表
 * @param {String} name reddit
 */
redditSubApi.methods.getall = async (info) => {
  const res = await redditSubApi.model.all(info)
  return res
}

redditSubApi.methods.getById = async (ctx) => {
  const id = ctx.params.id
  $.result(ctx, await redditSubApi.model.all({ id: id }))
}

module.exports = redditSubApi.methods