$(function() {
	//建议意见字数显示
	$(".s-text").bind('input', function() {
		var bb = $('.s-text').val();
		var cc = bb.substring(0, 200);
		$('#username').val(cc);
		var aa = $(this).val().length;
		if(aa < 200) {
			$('#result').html($(this).val().length);
		} else {
			$('#result').html("200");
		}
	})

	//意见反馈提交
	$('.next-step').click(function() {
		var getParam = urlParse();
		var obj = new Object();
		var _text = $('.s-text').val();
		obj.backComment = _text;
		obj.mobile = getParam.mobile;
		var _obj = JSON.stringify(obj, 'utf-8');
		$.ajax({
			type: 'POST',
			contentType: "text/html; charset=UTF-8",
			url: '/fintech-appbiz/api/APPBizRest/sendComments/v1/',
			data: _obj,
			dataType: 'json',
			success: function(data) {
				if(data.retCode == '200') {
					window.location.href = '/fintech-appbiz/repayH5/helpCenter.html?success=ok';
				};
			}
		});
	})
})







