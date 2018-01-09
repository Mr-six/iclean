const $ = require('../../utils')
const Base = require('../base')

const RedditSub = new Base('RedditSub', {
  name: {
    type: String,
    index: true,
  },
  reddit_subscribers_num: Array,
})


module.exports = RedditSub.methods