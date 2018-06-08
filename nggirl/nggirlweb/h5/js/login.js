var prevurl = '/nggirl-web';
$(function(){
//返回登录页面
    $('.recoverform').children('.form-actions').children('.pull-left').click(function(e) {
        $('.recoverform').slideUp();
        $('.form-vertical').slideDown();
    });

//获取用户名和密码判断是否正确返回对应的值
    $('.login-box .form-vertical .pull-right').click(function(e) {
        $.ajax({
            url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/login',
            type : 'post',
            dataType : 'json',
            data: {username:$('.form-vertical .control-text .login-txt').val(), password:$('.form-vertical .control-text .pwd-txt').val()},
            success : function(data){
                if(data.code != 0){
                    alert(data.data.error);
                }else{
                    location.href='index2.shtml?v=<%= VERSION %>';
                }
            },
        });
        $('.form-vertical .control-text .login-txt').val('');
        $('.form-vertical .control-text .pwd-txt').val('');
    });
	
//按下回车键执行操作
	$('.login-box .form-vertical .pull-right').focus();
	var $inp = $('.login-box');
	$inp.bind('keydown', function (e) {
		var key = e.which;
		if (key == 13) {
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/login',
				type : 'post',
				dataType : 'json',
				data: {username:$('.form-vertical .control-text .login-txt').val(), password:$('.form-vertical .control-text .pwd-txt').val()},
				success : function(data){
					if(data.code != 0){
						alert(data.data.error);
					}else{
						location.href='index2.shtml?v=<%= VERSION %>';
					}
				},
			});
		}
	});
});

