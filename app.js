var express = require('express'),
	path = require('path'),
	mongoose = require('mongoose')	,
	session = require('express-session'),
	mongoStore = require('connect-mongo')(session),
	bodyParser = require('body-parser'),
	//multer = require('multer'),
	cookieParser = require('cookie-parser'),
	cookieSession = require('cookie-session'),
	schedule = require('node-schedule'),
	request = require('request'),
	port = process.env.PORT || 3000,	//设置端口
	app = express(),	//启动一个web服务器
	dbUrl = 'mongodb://127.0.0.1/seekdb'
 
mongoose.connect(dbUrl)

app.set('views','./app/views/pages')	//设置视图根目录
app.set('view engine','jade')	//设置默认的模板引擎

app.use(bodyParser.urlencoded({extended: true}))	//这里转换后才能使用  req.body里的内容
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname,'frontend/src')))
app.use('/admin',express.static(path.join(__dirname,'backend/src')))

// app.use(multer())
app.use(cookieParser())
app.use(cookieSession({
	secret: 'seek',
	name: 'session',
	keys:['key1','key2'],
	store:new mongoStore({
		url:dbUrl,
		collection: 'sessions'
	})
}))

require('./config/routes')(app)


function scheduleCancel(){

    var j = schedule.scheduleJob('0 30 * * * *', function(){
        var url = "http://127.0.0.1:3000/wechat/token"

        request(url, function (error, response, body) {
			if (!error && response.statusCode == 200) {
				console.log('获取access_token成功，时间：'+new Date())

			}
		})
    })

    
}

scheduleCancel()

app.locals.moment = require('moment')
var server = app.listen(port)	//监听这个端口

console.log('SeekCafe start on port '+port)

