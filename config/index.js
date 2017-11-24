const isProd   =  process.env.NODE_ENV === 'production'
const path     = require('path')
const we       = require('./we')                    // 微信支付
const schema   = require('./schema')                // 验证规则
const proxyUrl = require('./proxyUrl')              // 代理 url
const custom   = require('./custom')                // 自定义配置
const static   = path.join( __dirname,'../static')  // 静态文件夹

module.exports = {
  isProd,                                             // 判断当前环境
  schema,                                             // 对象验证规则
  static,                                             // 静态目录
  proxyUrl,                                           // 代理 url
  cors: {origin: '*'},                                // 允许跨域设置
  limitDb:      20,                                   // 默认每页数据条数
  tokenExpires: '100d',                               // token 有效时间 100天
  port: isProd  ? '8003' : '8003',                    // 端口
  db:           'mongodb://127.0.0.1:27017/iclean',    // 生产数据库
  dbtest:       'mongodb://127.0.0.1:27017/test',     // 测试数据库
  ossCof:       custom.ossCof,                        // 阿里云 oss
  smsCof:       custom.smsCof,                        // 阿里云 sms
  qiniuCof:     custom.qiniuCof,                      // 七牛上传
  secret:       custom.secret,                        // jwt secret
  email:        custom.email,                         // 邮件服务
  baseUrl:      custom.baseUrl,                       // 网站地址
  we:           we,                                   // 微信配置
}