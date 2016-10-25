var mongoose = require('mongoose')	
var DishSchema = require('../../schemas/dish/cook')
var Dish = mongoose.model('Dish',DishSchema)

module.exports = Dish 
