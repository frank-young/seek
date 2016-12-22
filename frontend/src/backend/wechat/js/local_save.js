(function(){
	var num = g('num').getAttribute('data-num'),
		domain = g('domain').getAttribute('data-domain')
	localSave('num',num)
	localSave('domain',domain)
	window.location.href = "http://127.0.0.1:8080/table?id="+num+"&domain="+domain
})()

function g(id) {
	return document.getElementById(id)
}

function localSave(index,value) {
	localStorage.setItem(index,value)
}