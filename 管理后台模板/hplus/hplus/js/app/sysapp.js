//$().ready(function () {


function initTable(){
    var table = $('#example').DataTable( {
        "dom": '<"toolbar">frtip',
        "processing": true,
        "serverSide": true,
        "ajax": {
            url: basePath+"app/view?start=0&limit=10&realname=",
            "dataSrc": "data",
            dataType: "jsonp"
        },
        "columnDefs": [
            {
                "render": function ( data, type, row ) {
                    var str = "";
                    str += "<button class='btn btn-info '   type='button' onclick=''><i class='fa fa-paste'></i> 编辑</button>&nbsp;";
                    str += "<button class='btn btn-info '   type='button' onclick=''><i class='fa fa-paste'></i> 锁定</button>";
                    return str; // data +' ('+ row[3]+')';
                },
                "targets": 5
            },
            {
                "visible": false,
                "targets": [ 3 ]
            },
            {
                "targets": [ 4 ],
                "visible": false,
                "searchable": false
            }
        ],
        "columns": [
            { "data": "name" },
            { "data": "app_key" },
            { "data": "app_secret" },
            { "data": "app_secret" },
            { "data": "name" }
        ]
    } );

    $("div.toolbar").html("<button type='button' class='btn btn-primary' data-toggle='modal' data-target='#myModal2'>添加</button>");

    $('#example tbody').on( 'click', 'button', function () {
        var data = table.row( $(this).parents('tr') ).data();
        alert( data[0] +"'s salary is: "+ data[ 1 ] );
    } );
}
initTable();


$.validator.setDefaults({
    highlight: function (e) {
        $(e).closest(".form-group").removeClass("has-success").addClass("has-error")
    }, success: function (e) {
        e.closest(".form-group").removeClass("has-error").addClass("has-success")
    }, errorElement: "span", errorPlacement: function (e, r) {
        e.appendTo(r.is(":radio") || r.is(":checkbox") ? r.parent().parent().parent() : r.parent())
    }, errorClass: "help-block m-b-none", validClass: "help-block m-b-none"
})
$("#commentForm").validate();
