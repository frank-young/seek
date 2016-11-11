var mongoose = require('mongoose')	
var AlipayorderSchema = require('../../schemas/alipay/alipayorder')
var Alipayorder = mongoose.model('Alipayorder',AlipayorderSchema)

module.exports = Alipayorder 
