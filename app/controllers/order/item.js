'use strict'

var Item = require('../../models/order/item')
var Order = require('../../models/order/order')
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

	exports.downloadItemDetailMonth = function(req, res) {
	    var year = req.query.year,
	        month = req.query.month,
	        domain = req.query.domain,
	        name = req.query.name

	    creatItemDetail(domain, name, year, month, res)

	}

	//报表生成
	function creatItem(domain, name, year, month, res) {
	    year = parseInt(year)
	    month = parseInt(month)

	    let fields = ['序号','品项大类','折前销售金额', '折让金额','折后金额','销售数量']

	    let itemData = [],
	    	cateData = [],
	    	countTotal = 0,
	        total = 0,
	        oldTotal = 0

	    async.waterfall([
	    	 (cb) => {
                Cate.fetch({ "domainlocal": domain}, function(err, cates) {
                    cates.forEach(function(cate,i) {
                    	cateData.push({
                    		"value": cate.value,
                    		"label": cate.label
                    	})
                    	if (i === cates.length - 1) {
	                        
	                        cb(null, cateData)
	                    }
                    })
                })

	        },
	    	(cateData, cb) => {
	    		
	            let len = getDaysInOneMonth(year, month - 1)
	            let m = changeNumberToString(month - 1)
	            let y = year

	            if(month == 1){
	            	y = year - 1
	            	m = '12'
	            }

        		for (let i = 26; i <= len; i++) {
	            	let day = changeNumberToString(i)
	            	Order.fetch({ "domainlocal": domain, "year": y, "month": m, 'day': day }, function(err, orders) {
	            		
                		if(orders.length !== 0 ){
                			orders.forEach(function(order,j) {
                				if(order.length !== 0){

                					order.dish.forEach(function(value,k) {
                						
	                					let plus = 0,
	                						old = 0

				                    	plus =  value.reducePrice * value.number
				                    	old = value.price * value.number
				                    	if (isNaN(plus) === true) {
				                    		plus = 0
				                    	}
				                    	if (isNaN(old) === true) {
				                    		old = 0
				                    	}
				                        let itemObj = {
			                        		// "时间": orders[j].year + '-' + orders[j].month + '-' + orders[j].day,
											// "名称": value.name,
											"number": value.number,
											"plus": plus,
											"cate": value.cate || 0,
											"name": value.name,
											"old": old
										}

				                        itemData.push(itemObj)

				                        total += plus
				                        oldTotal += old
			                            countTotal += Number(value.number)

			                            if (i === len && j === orders.length -1 && k === order.dish.length-1) {
					                        cb(null, itemData,cateData)
					                    }
									})

                				}
							})
            			}else {
            				if (i === len) {
		                        cb(null, itemData,cateData)
		                    }
            			}
            		})
	            }
	        },
	        (itemData,cateData, cb) => {
	            let len = 25
	            let m = changeNumberToString(month)

        		for (let i = 1; i <= len; i++) {
	            	let day = changeNumberToString(i)
	            	Order.fetch({ "domainlocal": domain, "year": year, "month": m, 'day': day }, function(err, orders) {
                		if(orders.length !== 0 ){
                			orders.forEach(function(order,j) {
                				if(order.length !== 0){

                					order.dish.forEach(function(value,k) {
                						
	                					let plus = 0,
	                						old = 0

				                    	plus =  value.reducePrice * value.number
				                    	old = value.price * value.number
				                    	if (isNaN(plus) === true) {
				                    		plus = 0
				                    	}
				                    	if (isNaN(old) === true) {
				                    		old = 0
				                    	}
				                        let itemObj = {
			                        		// "时间": orders[j].year + '-' + orders[j].month + '-' + orders[j].day,
											// "名称": value.name,
											"number": value.number,
											"plus": plus,
											"cate": value.cate || 0,
											"name": value.name,
											"old": old
										}

				                        itemData.push(itemObj)

				                        total += plus
				                        oldTotal += old
			                            countTotal += Number(value.number)
			                            if (i === len && j === orders.length -1 && k === order.dish.length-1) {
					                        cb(null, itemData,cateData)
					                    }
									})

                				}
							})
            			}else {
            				if (i === len) {
		                        cb(null, itemData,cateData)
		                    }
            			}  	
            		})
	            }
	        },
	        (itemData,cateData,cb) => {
	        	let newItemDate = []
	        	cateData.sort((a,b) => {
			        return a.value - b.value
				})
	        	cateData.forEach(function(v,i){
	        		let plus = 0,
	        			number = 0,
	        			old = 0

	        		itemData.forEach(function(value,index){
	        			if(v.value == value.cate){
	        				number += Number(value.number)
	        				plus += value.plus
		        			old += value.old
	        			}
	        		})
	        		newItemDate.push({
	        			"序号":i+1,
	        			"品项大类": v.label,
	        			"折前销售金额": t2(old),
	        			"折让金额": t2(old - plus),
	        			"折后金额": t2(plus),
	        			"销售数量": number

	        		})
	        	})

	            cb(null, newItemDate)
	        },
	   //      (itemData,cateData,cb) => {
	   //      	let newItemDate = []

	   //      	itemData.sort((a,b) => {
				//         if (a.cate == b.cate) {
				//         	return a.name.localeCompare(b.name)
				//         }
				//         return a.cate - b.cate

				// })
	   //      	console.log(itemData)
	   //      	itemData.forEach((value,index) => {
	   //      		if (index === 0 || value.cate !== itemData[index-1].cate) {
	   //      			let cate = {
		  //           		"时间": cateData[value.cate],
				// 			"名称": '-',
				// 			"数量": '-',
				// 			"小计": '-'
				// 		}
		  //       		newItemDate.push(cate)
	   //      		}
	   //      		newItemDate.push(value)        		
	   //      	})

	   //          cb(null, newItemDate)
	   //      },
	        (newItemDate,cb) => {
	            let itemTotal = {
	            		"序号":'合计',
	            		"品项大类": '-',
						"折前销售金额": t2(oldTotal),
						"折让金额": t2(oldTotal - total),
						"折后金额":t2(total),
						"销售数量": parseInt(countTotal)
					}

	            newItemDate.push(itemTotal)
	            cb(null, newItemDate)
	        },
	        (newItemDate, cb) => {
	            let csv = json2csv({ data: newItemDate, fields: fields })

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

	//报表详情生成
	function creatItemDetail(domain, name, year, month, res) {
	    year = parseInt(year)
	    month = parseInt(month)

	    let fields = ['时间','名称','折前销售金额', '折让金额','折后金额','销售数量', '分类']

	    let itemData = [],
	    	cateData = [],
	    	countTotal = 0,
	        total = 0,
	        oldTotal = 0

	    async.waterfall([
	    	 (cb) => {
                Cate.fetch({ "domainlocal": domain}, function(err, cates) {

                    cates.forEach(function(cate,i) {
                    	cateData.push({
                    		"value": cate.value,
                    		"label": cate.label
                    	})
                    	if (i === cates.length - 1) {
	                        
	                        cb(null, cateData)
	                    }
                    })
                })
	        },
	    	(cateData, cb) => {
	            let len = getDaysInOneMonth(year, month - 1)
	            let m = changeNumberToString(month - 1)
	            let y = year

	            if(month == 1){
	            	y = year - 1
	            	m = '12'
	            }

        		for (let i = 26; i <= len; i++) {
	            	let day = changeNumberToString(i)
	            	Order.fetch({ "domainlocal": domain, "year": y, "month": m, 'day': day }, function(err, orders) {
	            		
                		if(orders.length !== 0 ){
                			orders.forEach(function(order,j) {
                				if(order.length !== 0){

                					order.dish.forEach(function(value,k) {
                						
	                					let plus = 0,
	                						old = 0

				                    	plus =  value.reducePrice * value.number
				                    	old = value.price * value.number

				                    	if (isNaN(plus) === true) {
				                    		plus = 0
				                    	}
				                    	if (isNaN(old) === true) {
				                    		old = 0
				                    	}

				                        let itemObj = {
			                        		"时间": orders[j].year + '-' + orders[j].month + '-' + orders[j].day,
											"名称": value.name,
											"折前销售金额": t2(old),
											"折让金额": t2(old - plus),
											"折后金额": t2(plus),
											"销售数量": value.number,
											"分类": value.cate || 0,
											"name": value.name,
											"cate":value.cate || 0
										}

				                        itemData.push(itemObj)

				                        total += plus
				                        oldTotal += old
			                            countTotal += Number(value.number)

			                            if (i === len && j === orders.length -1 && k === order.dish.length-1) {
					                        cb(null, itemData,cateData)
					                    }
									})

                				}
							})
            			}else {
            				if (i === len) {
		                        cb(null, itemData,cateData)
		                    }
            			}
            		})
	            }
	        },
	        (itemData,cateData, cb) => {
	            let len = 25
	            let m = changeNumberToString(month)

        		for (let i = 1; i <= len; i++) {
	            	let day = changeNumberToString(i)
	            	Order.fetch({ "domainlocal": domain, "year": year, "month": m, 'day': day }, function(err, orders) {
                		if(orders.length !== 0 ){
                			orders.forEach(function(order,j) {
                				if(order.length !== 0){

                					order.dish.forEach(function(value,k) {
                						
	                					let plus = 0,
	                						old = 0

				                    	plus =  value.reducePrice * value.number
				                    	old = value.price * value.number
				                    	if (isNaN(plus) === true) {
				                    		plus = 0
				                    	}
				                    	if (isNaN(old) === true) {
				                    		old = 0
				                    	}

				                        let itemObj = {
			                        		"时间": orders[j].year + '-' + orders[j].month + '-' + orders[j].day,
											"名称": value.name,
											"折前销售金额": t2(old),
											"折让金额": t2(old - plus),
											"折后金额": t2(plus),
											"销售数量": value.number,
											"分类": value.cate || 0,
											"name": value.name,
											"cate":value.cate || 0
										}

				                        itemData.push(itemObj)

				                        total += plus
				                        oldTotal += old
			                            countTotal += Number(value.number)
			                            if (i === len && j === orders.length -1 && k === order.dish.length-1) {
					                        cb(null, itemData,cateData)
					                    }
									})

                				}
							})
            			}else {
            				if (i === len) {
		                        cb(null, itemData,cateData)
		                    }
            			}
	                    	
            		})
            		
	            }
	        },
	   //      (itemData,cateData,cb) => {
	   //      	let newItemDate = []
	   //      	cateData.sort((a,b) => {
			 //        return a.value - b.value
				// })

	   //      	console.log(cateData)

	   //      	cateData.forEach(function(v,i){
	   //      		let plus = 0,
	   //      			number = 0,
	   //      			old = 0

	   //      		itemData.forEach(function(value,index){
	   //      			if(v.value == value.cate){
	   //      				number += value.number
	   //      				plus += value.plus
		  //       			old += value.old
	   //      			}
	   //      		})
	   //      		newItemDate.push({
	   //      			"序号":i+1,
	   //      			"品项大类": v.label,
	   //      			"折前销售金额": t2(old),
	   //      			"折让金额": t2(old - plus),
	   //      			"折后金额": t2(plus),
	   //      			"销售数量": number

	   //      		})
	   //      	})

	   //          cb(null, newItemDate)
	   //      },
	        (itemData,cateData,cb) => {
	        	let newItemDate = []

	        	itemData.sort((a,b) => {
				        if (a.cate == b.cate) {
				        	if(a.name) {
				        		return a.name.localeCompare(b.name)
				        	} 
				        }
				        return a.cate - b.cate

				})

	        	itemData.forEach((value,index) => {
	        		if (index === 0 || value.cate !== itemData[index-1].cate) {
	        			let cate = {
		            		"时间": getIndex(cateData,value.cate),
							"名称": '-',
							"折前销售金额": '-',
							"折让金额": '-',
							"折后金额": '-',
							"销售数量": '-'
						}
		        		newItemDate.push(cate)
	        		}
	        		newItemDate.push(value)        		
	        	})

	            cb(null, newItemDate)
	        },
	        (newItemDate,cb) => {
	            let itemTotal = {
	            		"时间":'合计',
	            		"名称": '-',
						"折前销售金额": t2(oldTotal),
						"折让金额": t2(oldTotal - total),
						"折后金额": t2(total),
						"销售数量": parseInt(countTotal),
					}

	            newItemDate.push(itemTotal)
	            cb(null, newItemDate)
	        },
	        (newItemDate, cb) => {
	            let csv = json2csv({ data: newItemDate, fields: fields })

	            let file = name + year + '年' + month + '月品项详情.csv'
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

	//转换成两位小数
	function t2(value){
		let num = Number(value)
		return num.toFixed(2)
	}

	function getIndex(cate,index){
		var label
		cate.forEach(function(c){
			if (c.value == index) {
				label = c.label
			}
		})
		return label
	}



	