$(document).ready(function() {
	// 使用 jQuery 异步提交表单
	$('#f-signin').submit(function() {
		jQuery.ajax({
			url: '/manager/signin/ctrl',
			data: $('#f-signin').serialize(),
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

	$('#f-signup').submit(function() {
		jQuery.ajax({
			url: '/manager/signup/ctrl',
			data: $('#f-signup').serialize(),
			type: "POST",
			beforeSend: function() {  
				dis()
			},
			success: function(data) {
				if(data.status == 1){
					aletMsg(data.msg)
					setTimeout(function(){
						window.location.href = "/manager/signin"
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

	$('input[type="password"]').attr('type', 'text').addClass('password-fix');
	setTimeout(function(){
	    $('input.password-fix').attr('type', 'password').removeClass('password-fix');
	}, 500);

});

//禁止按钮点击
function dis(){
	$('#f-submit').attr('disabled','disabled');
}

// 取消禁止按钮点击
function rmDis(){
	$('#f-submit').removeAttr('disabled');
}

// 弹出提示
function aletMsg(msg){
	$('#f-alert').html(msg).slideDown(300)
}