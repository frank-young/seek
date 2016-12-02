$(document).ready(function() {

    // $('#submit-report').on('click',function(){
    // 	$('#report').val()
    // })

    getList('seek02')
    
    $('#submit-report').on('click',function(){
    	getDownload('seek02','2016','11')
    })

});

function getList(domain){
    jQuery.ajax({
        url: '/manager/report/list?domain='+domain,
        type: "get",
        beforeSend: function() {

        },
        success: function(data) {
        	console.log(data)
        }
    });

}

function getDownload(domain,year,month){
    jQuery.ajax({
        url: '/manager/report/create?domain='+domain+'&year='+year+'&month='+month,
        type: "get",
        beforeSend: function() {

        },
        success: function(data) {
        	console.log(data)
        }
    });

}