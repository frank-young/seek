var mongoose = require('mongoose')	
var CookSchema = require('../../schemas/dish/cook')
var Cook = mongoose.model('Cook',CookSchema)

module.exports = Cook 
