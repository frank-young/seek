$(document).ready(function() {
	// 使用 jQuery 异步提交表单
	$('#setting').submit(function() {
		jQuery.ajax({
			url: '/manager/ctrl/setting',
			data: $('#setting').serialize(),
			type: "POST",
			beforeSend: function() {  
				dis()
			},
			success: function(data) {
				if(data.status == 1){
					aletMsg(data.msg)
					setTimeout(function(){
						window.location.href = "/manager/index"
					},1000)
				}else{
					aletMsg(data.msg)
					rmDis()
					setTimeout(function(){
						$('#f-alert').slideUp(300)
					},3000)
				}
			}
		});
		return false;
	});
});
