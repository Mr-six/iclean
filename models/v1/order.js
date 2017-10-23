const Base = require('../base')

const Order = new Base('Order', {
  user:               { type: Base.ObjectId(), ref: 'User' },
  device_info:        String,
  body:               String,
  out_trade_no:       String,
  total_fee:          String,
  spbill_create_ip:   String,
  attach:             String,
  detail:             String,
  openid:             String,
  qrcode:             String,
  transaction_id:     {type: String, default: ''},  // 微信端订单id
  payed:              {type: Boolean, default: false},  // 支付状态
  sendAt:             {type: Date, default: Date.now},
  _index:             {type: Number, default: 0, index: true}
})

Order.methods.create = async function (query) {
  query._index = await this.count({}) + 1
  return await Order.create(query)
}

module.exports = Order.methods


