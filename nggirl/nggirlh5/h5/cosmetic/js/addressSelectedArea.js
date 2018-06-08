$(function(){
	$('.sheng,.shi').height($(window).height() - 110);
	//获取全国城市列表V2.4.2
	$.get('<%= CLI_HOST_API_URL %>/nggirl/app/allCommonCity/2.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.sheng').append('<li cityCode="'+data.data[x].cityCode+'" provinceId="'+data.data[x].provinceId+'">'+data.data[x].provinceName+'</li>');
			}
			$('.sheng li').eq(0).addClass('current_sheng');
			$('.shi').append('<li cityId="1" cityCode="010">北京市</li>');
		}else{
			alert(data.data.error);	
		}
	});
	
	//选中省
	$('.sheng').delegate("li","click",function(){
		$('.tba_ok').removeClass('tba_ok_blue');
		$('.shi li').remove();
		var btn = $(this);
		btn.addClass('current_sheng').siblings().removeClass('current_sheng');
		$.get('<%= CLI_HOST_API_URL %>/nggirl/app/allCommonCity/2.4.2',getFinalRequestObject({accessToken: getAccessToken()}),function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				for(var x = 0; x < data.data.length; x ++){
					if(data.data[x].provinceName == btn.html()){
						$('.shi').append(getShiFn(data.data[x].cities));	
					}
				}
			}else{
				alert(data.data.error);	
			}
		});
	})
	
	//选中市
	$('.shi').delegate("li","click",function(){
		$(this).addClass('current_shi').siblings().removeClass('current_shi');
		$('.tba_ok').addClass('tba_ok_blue');
	});
	
	//选中城市
	$('.tba_ok').click(function(e) {
		var str = '';
		var sheng = '';
		var shi = '';
		var shengshi =$('.bc_address').html();
        $('.sheng li').each(function(index, element) {
            if($(this).hasClass('current_sheng')){
				sheng = $(this).html();
				$('.bc_address').attr('provinceId',$(this).attr('provinceId'));
				$('.bc_address').attr('sheng',$(this).html());
			}
        });
        $('.shi li').each(function(index, element) {
            if($(this).hasClass('current_shi')){
				shi = $(this).html();
				$('.box').show();
				$('.box_area').hide();
				$('.bc_address').attr('cityId',$(this).attr('cityId'));
				$('.bc_address').attr('shi',$(this).html());
				$('.bc_address').attr('cityCode',$(this).attr('cityCode'));
				if(shengshi != sheng+' '+shi && shengshi !='请选择地址'){
					$('.select-street .select-href').html('请选择').css('color','#9a9a9a');
				}else{
					
				}
				$('.bc_address').html(sheng+' '+shi).css('color','#3a3a3a');
			}
        });
    });
	
	//点击返回箭头
	$('.title-btn-arr img').click(function(e) {
		$('.box_area').hide();
		$('.box').show();
    });
	
	//获取城市对应的市
	function getShiFn(shi){
		var str = '';
		if(shi.length > 0){
			for(var x = 0; x < shi.length; x ++){
				str += '<li cityCode="'+shi[x].cityCode+'" cityId="'+shi[x].cityId+'">'+shi[x].cityName+'</li>';	
			}	
		}else{
			str = '';	
		}
		return str;
	}
	
})
