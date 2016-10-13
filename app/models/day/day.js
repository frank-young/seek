var mongoose = require('mongoose')	
var DaySchema = require('../../schemas/day/day')
var Day = mongoose.model('Day',DaySchema)

module.exports = Day 
