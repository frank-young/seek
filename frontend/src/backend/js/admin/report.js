$(document).ready(function() {
    var arr = ['seek01','seek02','seek03','seek04']
    getDate(arr)
    
    $('#submit-report').on('click',function(){
        var report = $('#report').val()
    	var name = $('#report').find("option:selected").text()
        var need = hasFile(report)
        var shop = JSON.parse(localStorage.getItem(report))

        console.log(name)
        clearHtml('#list')
        if(need){
            shop.forEach(function(value,index){
                createFile(report,name,value.year,value.month)
            })
        }
    })
})

//请求所有店铺
function getDate(arr){
    arr.forEach(function(value,index){
        getList(value)
    })
}

//获取门店日期报表
function getList(domain){
    jQuery.ajax({
        url: '/manager/report/list?domain='+domain,
        type: "get",
        beforeSend: function() {

        },
        success: function(data) {
            localStorage.setItem(domain,JSON.stringify(data.month))
        }
    });

}

//店铺文件的存在判断
function hasFile(value){
    if(JSON.parse(localStorage.getItem(value)) !== null || JSON.parse(localStorage.getItem(value)) !== []){
        return true
    }else{
        return false
    }
}

// 生成文件
function createFile(domain,name,year,month){
    jQuery.ajax({
        url: '/manager/report/create?domain='+domain+'&name='+name+'&year='+year+'&month='+month,
        type: "get",
        beforeSend: function() {
            $('#load').append(downloadTpls())
        },
        success: function(data) {
            clearHtml('#load')
            addHtml(data.file,data.link)
        }
    })
}

//清除html
function clearHtml(id){
    $(id).html("")
}

//添加html
function addHtml(name,link){
    $('#list').append(tpls(name,link))
}

//生成列表
function tpls(name,link){
    var html = '<div class="row item">'+
                    '<div class="col-xs-8">'+
                        '<div class="a-name">'+
                            '<a href="'+link+'">'+name+'</a>'+
                        '</div>'+
                    '</div>'+
                    '<div class="col-xs-4">'+
                        '<a href="'+link+'" class="btn btn-info btn-block" download>'+
                            '<span class="glyphicon glyphicon-download-alt"></span>下载'+
                        '</a>'+
                    '</div>'+
                '</div>';

    return html;
}

//加载中模版
function downloadTpls(){
    var html = '<div class="row item">'+
                    '<div class="col-xs-12 text-center">'+
                        '报表生成中，请稍后...'+
                    '</div>'+
                '</div>';

    return html;
}















