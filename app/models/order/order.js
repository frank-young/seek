var mongoose = require('mongoose')	
var OrderSchema = require('../../schemas/order/order')
var Order = mongoose.model('Order',OrderSchema)

module.exports = Order 
