$(function(){
	$('input[type="password"]').attr('type', 'text').addClass('password-fix');
	setTimeout(function(){
	    $('input.password-fix').attr('type', 'password').removeClass('password-fix');
	}, 500);
})
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