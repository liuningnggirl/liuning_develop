$(function(){	
	//确认提示弹框--取消
	$('.window_white_half.sure .ws_double_btn .ws_double_btn_cancle').click(function(e) {
        $('.window_white_half.sure').hide();
    });
	
	//确认提示弹框--确认
	$('.ws_double_btn_ok').click(function(e) {
		checkAccessTokenLogin(function () {
			 var data = getFinalRequestObject({
				 accessToken: getAccessToken()
			 });
		}, 'nanGuaPeopleTest.html?v=<%= VERSION %>' + window.location.search);
		
		var testType= '';
		var testQuestions = '';
		var array= new Array();
		
		if($('.leve_type .leve_type_zhuang').hasClass('current')){
			$('.leve_type_caizhuang .leve_type_question_box .box_question').each(function(index, element) {
				var obj = new Object();
				obj.question = $(this).children('.bq_box').children('.bb_ques').html();
				obj.answer = $(this).children('.bq_box').children('.bq_textarea').val();
				array.push(obj);
			});		
		};
		if($('.leve_type .leve_type_fu').hasClass('current')){
			$('.leve_type_hufu .leve_type_question_box .box_question').each(function(index, element) {
				var obj = new Object();
				obj.question = $(this).children('.bq_box').children('.bb_ques').html();
				obj.answer = $(this).children('.bq_box').children('.bq_textarea').val();
				array.push(obj);
			});		
		};
		testQuestions = JSON.stringify(array);	
		$('.leve_type>p').each(function(index, element) {
            if($(this).hasClass('current')){
				testType = $(this).attr('testtype');
			};
        });
		$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/pumpkinexpert/submitTestQuestion/3.0.2',getFinalRequestObject({accessToken:getAccessToken(),testType:testType,testQuestions:testQuestions}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.window_white_half.ok').removeClass('question_hide').show();
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//提交成功确认
	$('.ws_double_btn_queren').click(function(e) {
		window.location.href ="nanGuaPeople.html?v=<%= VERSION %>";
    });
	
	//美妆类答题
	$('.leve_type .leve_type_zhuang').click(function(e) {
		$(this).addClass('current');
		$('.leve_type').addClass('question_hide');
        $('.leve_type_caizhuang').removeClass('question_hide');
		$('.bb_circle').css('left',($('.box_question').width()-55)/2);
    });
	//护肤类答题
	$('.leve_type .leve_type_fu').click(function(e) {
		$(this).addClass('current');
		$('.leve_type').addClass('question_hide');
        $('.leve_type_hufu').removeClass('question_hide').show();
		$('.bb_circle').css('left',($('.leve_type_hufu .box_question').width()-55)/2);
    });
	
	//美妆类下一题
	$('.leve_type_caizhuang .next_question').click(function(e) {
		if($(this).parent().parent().hasClass('question_07')){
			if($.trim($(this).parent().prev().children('.bq_textarea').val()) == ''){
				alert('答完这题才能提交哦~');		
			}else{
				$('.window_white_half.sure').removeClass('question_hide').show();
			}
		}else{
			nextZhuangAnswerFn($(this));
		}
    });
	
	//美妆类上一题
	$('.leve_type_caizhuang .prve_question').click(function(e) {
		preZhuangAnswerFn($(this));
    });
	
	//护肤类下一题
	$('.leve_type_hufu .next_question').click(function(e) {
		if($(this).parent().parent().hasClass('question_07')){
			if($.trim($(this).parent().prev().children('.bq_textarea').val()) == ''){
				alert('答完这题才能提交哦~');		
			}else{
				$('.window_white_half.sure').removeClass('question_hide').show();
			}
		}else{
			nextZhuangAnswerFn($(this));
		}
    });
	
	//护肤类上一题
	$('.leve_type_hufu .prve_question').click(function(e) {
		preZhuangAnswerFn($(this));
    });
});

//彩妆类下一题
function nextZhuangAnswerFn(btn){
	if($.trim(btn.parent().prev().children('.bq_textarea').val()) == ''){
		alert('答完这题才能查看下一题哦~');	
	}else{
		var x = btn.parent().prev().children('.bq_textarea').val();
		btn.parent().prev().children('.bq_textarea').val(x.replace(/\s+/g,""));
		btn.parent().parent().next().removeClass('question_hide');
		btn.parent().parent().addClass('question_hide');
	}
}

//彩妆类上一题
function preZhuangAnswerFn(btn){
	btn.parent().parent().prev().removeClass('question_hide');
	btn.parent().parent().addClass('question_hide');
}