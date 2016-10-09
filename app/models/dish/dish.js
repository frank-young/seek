var mongoose = require('mongoose')	
var DishSchema = require('../../schemas/dish/dish')
var Dish = mongoose.model('Dish',DishSchema)

module.exports = Dish 
