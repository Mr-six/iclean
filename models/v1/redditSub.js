const $ = require('../../utils')
const Base = require('../base')

const RedditSub = new Base('RedditSub', {
  id: {                                   // 货币id
    type: String,
    index: true,
  },
  rid: String,                            // reddit 版块名称
  reddit_subscribers_num: Array,          // 订阅数量
  reddit_active_user_num: Array,          // 在线人数
  reddit_subscribers_growth: Array,       // 增长数量
})


module.exports = RedditSub.methods