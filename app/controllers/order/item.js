'use strict'

var Item = require('../../models/order/item')
var Cate = require('../../models/dish/cate')
var Cook = require('../../models/dish/cook')
var _ = require('underscore'),
	json2csv = require('json2csv'),
	fs = require('fs'),
	path = require('path'),
	async = require('async')

	//品项列表页
	exports.list = function(req,res){
		var user = req.session.user
		Item.fetch({"domainlocal":user.domain},function(err,items){
			res.json({
				status:"1",
				msg:"请求成功",
				items:items
			})
		})
	}

	// 今日品项列表
	exports.todaylist = function(req,res){
		var user = req.session.user
		var date = new Date(),
			Y = date.getFullYear(),
	        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1),
	        D = (date.getDate() < 10 ? '0'+(date.getDate()) : date.getDate())

		Item.fetch({"domainlocal":user.domain,"year":Y,"month":M,"day":D},function(err,items){
			res.json({
				status:"1",
				msg:"请求成功",
				items:items
			})
		})
	}


	//品项更新、新建
	exports.save = function(req,res){
		var itemObj = req.body.item 	//从路由传过来的 item对象
		var user = req.session.user
		itemObj.userlocal = user.email
		itemObj.domainlocal = user.domain

		var _item = new Item(itemObj)
			_item.save(function(err,item){
				if(err){
					console.log(err)
				}
				res.json({msg:"添加成功",status: 1})
			})
	}

	//品项更新、新建
	exports.update = function(req,res){
		var id = req.body.item._id
		var itemObj = req.body.item 	//从路由传过来的 item对象
		var _item
		if(id !=="undefined"){
			Item.findById(id,function(err,item){
				if(err){
					console.log(err)
				}
				_item = _.extend(item,itemObj)	//复制对象的所有属性到目标对象上，覆盖已有属性 ,用来覆盖以前的数据，起到更新作用
				_item.save(function(err,item){
					if(err){
						console.log(err)
					}

					res.json({msg:"更新成功",status: 1})
				})
			})
		}
		
	}

	//删除品项
	exports.del = function(req,res){
		var id = req.query.id
		if(id){
			Item.remove({_id: id},function(err,item){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

	//根据品项号删除品项
	exports.delSome = function(req,res){
		var orderNum = req.query.id
		if(orderNum){
			Item.remove({"orderNum": orderNum},function(err,item){
				if(err){
					console.log(err)
				}else{
					res.json({status: 1,msg:"删除成功"})
				}
			})
		}
	}

	//品项详情页,每日品项详情
	exports.detail = function(req,res){
		var id = req.params.id
		var user = req.session.user
		var year = id.substr(0,4),
			month = id.substr(4,2),
			day = id.substr(6,2)

		Item.fetch({"domainlocal":user.domain,"year":year,"month":month,"day":day},function(err,items){
			
			res.json({
				status:1,
				msg:'读取成功',
				items:items
			})
		})

	}


	//品项报告列表页
	exports.itemdayList = function(req,res){
		var user = req.session.user
		Item.fetch({"domainlocal":user.domain},function(err,items){
			var arr =[] 
			items.forEach(function(item){
				arr.push({
					'year':item.year,
					'month':item.month,
					'day':item.day
				})
			})
			
			var month = distinct(arr)

			res.json({
				msg:"请求成功",
				status: 1,
				items:month
			})
		})

		// 去除重复元素
		function distinct(arr) {
		    let ret = [],
		        length = arr.length;
		    for(let i = 0;i < length; i++){
		        for(let j = i+1; j<length;j++){
		            if(arr[i].year === arr[j].year && arr[i].month === arr[j].month  && arr[i].day === arr[j].day){
		                j = ++i;
		            }
		        }
		        ret.push(arr[i]);
		    }
		    return ret;
		}

	}


	//下载品项报告
	exports.downloadItemDay = function(req,res){
		var year = req.query.year
		var month = req.query.month
		var day = req.query.day

		var user = req.session.user
		var fields = ['名称', '数量','小计']

		var itemData = []
		Item.fetch({"domainlocal":user.domain,"year":year,"month":month,"day":day},function(err,items){

			items.forEach(function(value,index){

				var itemObj = {
					"名称":value.name,
					"数量":value.number,
					"小计":value.total
				}
				itemData.push(itemObj)
			})
			var csv = json2csv({ data: itemData, fields: fields })
			
			var file = year+'年'+month+'月'+day+'日品项报告.csv'
			var link = '/orderprint/item/'+file

			fs.writeFile('frontend/src'+link, csv, function(err) {
				if(err){
					console.log(err)
				}else{
					res.json({
				  		status:1,
				  		msg:"生成文件成功！",
				  		link:link,
				  		file:file
				  	})
				}
			})
		})
	}

	exports.downloadItemMonth = function(req, res) {
	    var year = req.query.year,
	        month = req.query.month,
	        domain = req.query.domain,
	        name = req.query.name

	    creatItem(domain, name, year, month, res)

	}

	//报表生成
	function creatItem(domain, name, year, month, res) {
	    year = parseInt(year)
	    month = parseInt(month)

	    let fields = ['时间','名称', '数量','小计']

	    let itemData = [],
	    	cateData = [],
	    	countTotal = 0,
	        total = 0
	    async.waterfall([
	    	 (cb) => {
                Cate.fetch({ "domainlocal": domain}, function(err, cates) {

                    cates.forEach(function(cate,i) {
                    	cateData.push(cate.label)
                    	if (i === cates.length - 1) {
	                        cb(null, cateData)
	                    }
                    })

                })

	        },
	    	(cateData, cb) => {
	            let len = getDaysInOneMonth(year, month - 1)
	            let m = changeNumberToString(month - 1)
                Cook.fetch({ "domainlocal": domain}, function(err, cooks) {
                	cooks.forEach(function(cook,j) {
                		for (let i = 26; i <= len; i++) {
			            	let day = changeNumberToString(i)
			            	Item.fetch({ "name": cook.name, "year": year, "month": m, 'day': day }, function(err, items) {
	                			if(items.length !== 0 ){
	                				items.forEach(function(value, index) {
				                    	let plus = 0
				                    	if (value.total === 0) {
				                    		plus = value.price * value.number
				                    	} else {
				                    		plus =  value.total
				                    	}
				                    	
				                        let itemObj = {
			                        		"时间": value.year + '-' + value.month + '-' + value.day,
											"名称": value.name,
											"数量": value.number,
											"小计": plus,
											"cate": cook.cate
										}

				                        itemData.push(itemObj)

				                        total += plus
			                            countTotal += value.number
				                    })
				                    
	                			}

	                			if (j === cooks.length - 1 && i === len) {
			                        cb(null,itemData,cateData)
			                    }
	                		})

			            }
                			                		
                	})
                	
                })

	        },
	        (itemData,cateData, cb) => {
	            let len = 31
	            let m = changeNumberToString(month)
                Cook.fetch({ "domainlocal": domain}, function(err, cooks) {
                	cooks.forEach(function(cook,j) {
                		for (let i = 1; i <= len; i++) {
			            	let day = changeNumberToString(i)
			            	Item.fetch({ "name": cook.name, "year": year, "month": m, 'day': day }, function(err, items) {
	                			if(items.length !== 0 ){
	                				items.forEach(function(value, index) {
				                    	let plus = 0
				                    	if (value.total === 0) {
				                    		plus = value.price * value.number
				                    	} else {
				                    		plus =  value.total
				                    	}
				                    	
				                        let itemObj = {
			                        		"时间": value.year + '-' + value.month + '-' + value.day,
											"名称":value.name,
											"数量":value.number,
											"小计":plus,
											"cate": cook.cate
										}

				                        itemData.push(itemObj)

				                        total += plus
			                            countTotal += value.number
				                    })
				                    
	                			}
	                			if (j === cooks.length - 1 && i === len) {
			                        cb(null,itemData,cateData)
			                    }
	                		})

			            }
                			                		
                	})
                	
                })

	        },
	        (itemData,cateData,cb) => {
	        	let newItemDate = []
	        	itemData.sort((a,b) => {
	        		return a.cate - b.cate
	        	})
	        	itemData.forEach((value,index) => {
	        		if (index === 0 || value.cate !== itemData[index-1].cate) {
	        			let cate = {
		            		"时间": cateData[value.cate],
							"名称": '-',
							"数量": '-',
							"小计": '-'
						}
		        		newItemDate.push(cate)
	        		}
	        		newItemDate.push(value)        		
	        	})
	            cb(null, newItemDate)
	        },
	        (itemData,cb) => {
	            let itemTotal = {
	            		"时间": '合计',
						"名称": '-',
						"数量": countTotal,
						"小计": (Math.round(total * 100))/100
					}

	            itemData.push(itemTotal)
	            cb(null, itemData)
	        },
	        (itemData, cb) => {
	            let csv = json2csv({ data: itemData, fields: fields })

	            let file = name + year + '年' + month + '月品项.csv'
	            let link = '/orderprint/item/' + file

	            fs.writeFile('frontend/src' + link, csv, function(err) {
	                if (err) throw err
	                cb(null, file, link)
	            })
	        },
	    ], (err, file, link) => {
	        if (err) {
	            res.json({
	                errno: 1000,
	                data: "发生错误"
	            })
	        } else {
	            res.json({
	                status: 1,
	                msg: "生成文件成功！",
	                link: link,
	                file: file
	            })

	        }
	    })
	}

	// 获取月份的天数
	function getDaysInOneMonth(year, month) {
	    month = parseInt(month, 10)
	    let d = new Date(year, month, 0)
	    return d.getDate()
	}

	// 格式转化
	function changeNumberToString(value) {
	    return value < 10 ? '0' + value : '' + value
	}



	