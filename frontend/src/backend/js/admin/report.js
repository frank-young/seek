$(document).ready(function() {
    getServer(id)
});

function getServer(id){
    jQuery.ajax({
        url: '/order/api/',
        type: "get",
        beforeSend: function() {

        },
        success: function(data) {

        }
    });

}