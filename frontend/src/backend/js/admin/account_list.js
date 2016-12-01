$(document).ready(function() {
    // 使用 jQuery 异步提交表单

    $('#btn-del').on('click', function() {
        var sure = del_sure()
        if (sure) {
            var id = $(this).attr('data-id')
            jQuery.ajax({
                url: '/manager/ctrl/account/del?id=' + id,
                type: "delete",
                beforeSend: function() {

                },
                success: function(data) {
                	aletMsg(data.msg)
                    if (data.status == 1) {
                        $('#' + id).remove()
                    } else {
                        rmDis()
                    }
                    setTimeout(function() {
                        $('#f-alert').slideUp(300)
                    }, 3000)
                }
            });

        }
    })
});

function del_sure() {
    var sure = confirm("你真的确定要删除吗?");
    if (sure == true) {
        return true;
    } else {
        return false;
    }
}
