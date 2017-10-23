const Base = require('../base')

const Product = new Base('Product', {
  user:               { type: Base.ObjectId(), ref: 'User' },
  device_info:        String,  // 设备名称或者商品名称 编号
  body:               String,  // 商品标题
  detail:             String,  // 商品描述
  pic:                String,  // 商品图片
  total_fee:          Number,  // 单价 单位 分
  _index:             { type: Number, default: 0, index: true }
})

Product.methods.create = async function (query) {
  query._index = await this.count({}) + 1
  return await Product.create(query)
}

module.exports = Product.methods


