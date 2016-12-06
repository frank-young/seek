$(document).ready(function() {
    getData()
    $('#refresh').on('click',function(){
        getData()
    })
});

//获取数据
function getData() {
    getServer('seek01','tr-data')
    getServer('seek02','ts-data')
    getServer('seek03','jb-data')
    getServer('seek04','jj-data')
}

//请求服务器
function getServer(domain,id){
    jQuery.ajax({
        url: '/order/api/' + domain,
        type: "get",
        beforeSend: function() {

        },
        success: function(data) {
            fillData(id,data.total)
        }
    });
}

//填充数据
function fillData(id,value) {

    $('#'+id).html('￥'+Number(value).toFixed(2))
}