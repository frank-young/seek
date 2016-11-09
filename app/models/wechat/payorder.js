var mongoose = require('mongoose')	
var PayorderSchema = require('../../schemas/wechat/payorder')
var Payorder = mongoose.model('Payorder',PayorderSchema)

module.exports = Payorder 
