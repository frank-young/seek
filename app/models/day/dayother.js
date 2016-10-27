var mongoose = require('mongoose')	
var DayotherSchema = require('../../schemas/day/dayother')
var Dayother = mongoose.model('Dayother',DayotherSchema)

module.exports = Dayother 
