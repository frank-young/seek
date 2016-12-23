(function(){
	var num = g('num').getAttribute('data-num'),
		domain = g('domain').getAttribute('data-domain')
	num = encodeURI(num)
	var url = 'http://127.0.0.1:8080/?num='+ num +'&domain='+domain

	window.location.href = url
})()

function g(id) {
	return document.getElementById(id)
}

function localSave(index,value) {
	localStorage.setItem(index,value)
}