var typeStr = '';//定义全局变量用来判断是ios还是android
$(function(){
	//意见提交成功
	var getParam = urlParse();
	if(getParam.success!='' && getParam.success!=undefined){
		$('#sure,#fullBg').removeClass('hidden');
	}
	
	//意见提交成功
	$('#sure p').click(function(){
		$('#fullBg,#sure').hide();
	})
//	$(document).on({
//		click: function() {
//			$('#fullBg,#sure').hide();
//		}
//	}, '#sure p')
	//标签页
	$('.h-title>li').click(function() {
		var index = $(this).index();
		$('.con > li').eq(index).show().siblings('li').hide();
		$('.h-title>li').eq(index).css({
			'color': '#1299f9'
		}).siblings('li').css({
			'color': '#666'
		});
		$('.h-title>li').eq(index).children('div').addClass('active').parent().siblings().children('div').removeClass('active');
	})

	//申请条件收缩
	$('#arrow>img').click(function() {
		var index = $(this).index();
		$('img').eq(index).hide().siblings('img').show();
		$('.toggle').toggle();
	})

	//客服电话遮罩
	//显示灰色遮罩
	$(document).on({
		click: function() {
			$('#fullBg,.customN').show();
		}
	}, '#custom')
	//拨打客服电话
	$('#phone').click(function(){
        if(typeStr == 'and'){
//          window.jsToJava.telephone();//吊起and
        }else if(typeStr == 'ios'){
            window.webkit.messageHandlers.telephone.postMessage('1010-6618');//吊起ios
        }
    });
	//关闭灰色遮罩
	$('.close').click(function(){
		$('#fullBg,.customN').hide();
	})
//	$(document).on({
//		click: function() {
//			$('#fullBg,.customN').hide();
//		}
//	}, '.close')

	
})

