$(function(){
	var id1 = 'seek01',
		id2 = 'seek02'

	function getData(id,modal){
		$.get("/order/api/"+id,
	    function(data) {
	        //成功时的回调方法
	        $(modal).html(parseInt(data.realTotal).toFixed(2))
	    })

	}

	setInterval(function(){
		getData(id1,'#total1')
		getData(id2,'#total2')
	},1000)

	getData(id1,'#total1')
	getData(id2,'#total2')
})