const Router        = require('koa-router')
const router        = new Router()
const user          = require('./user')
const order         = require('./order')
const product       = require('./product')
const article       = require('./article')
const {uploadApi}   = require('../api').v1
const {authToken}   = require('../utils/auth')

router.use('/user',         user.routes(),    user.allowedMethods())     // user router
router.use('/article',      article.routes(), article.allowedMethods())  // article router
router.use('/order',        order.routes(),   order.allowedMethods())    // order router
router.use('/product',      authToken,        product.routes(), product.allowedMethods())    // product router
router.get('/oss',          authToken,        uploadApi.getAcessOss)     // get oss token
router.get('/qiniu',        authToken,        uploadApi.getQiniu)        // get qiniu token
router.post('/upload',      authToken,        uploadApi.localUpload.single('file'), uploadApi.localUpload.file)  // localUpload

module.exports = router
