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
redditSubApi.methods.create = async (name) => {
  let res
  let exist = await redditSubApi.model.findOne({ name: name })
  if (!exist) {
    res = await redditSubApi.model.create({ name: name }, {
      reddit_subscribers_num: []
    })
  }
  return res ? res : 'exist'
}

/**
 * reddit 向订阅表中添加数据
 * @param {String} name reddit
 * @param {Array} info 某时间此版块的订阅人数
 */
redditSubApi.methods.push = async (name, info) => {
  let exist = await redditSubApi.model.findOne({ name: name })
  if (!exist) {  // 如果数据列表不存在,则创建
    let res = await redditSubApi.model.create({ name: name }, {
      reddit_subscribers_num: []
    })
  }

  let res = await redditSubApi.model.push({ name: name }, {
    reddit_subscribers_num: info
  })
  return res
}

module.exports = redditSubApi.methods