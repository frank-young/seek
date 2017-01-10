(function(){
	var num = g('num').getAttribute('data-num'),
		domain = g('domain').getAttribute('data-domain'),
		openid = g('openid').getAttribute('data-openid')
	num = encodeURI(num)
	var url = 'http://192.168.31.217:8080/?num='+ num +'&domain='+ domain +'&openid=' + openid

	window.location.href = url
})()

function g(id) {
	return document.getElementById(id)
}

function localSave(index,value) {
	localStorage.setItem(index,value)
}