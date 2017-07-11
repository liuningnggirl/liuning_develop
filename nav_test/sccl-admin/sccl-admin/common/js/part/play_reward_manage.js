var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadRewardConfigInfo();
	//打赏积分数配置V4.0.8
	$('#play_reward_manage .play_reward_manage_content .prm_ul_btn_save').live('click',function(e) {
		var btn = $(this);
		var paramData = {
			firstScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.firstScore').val()),
			secondScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.secondScore').val()),
			thirdScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.thirdScore').val()),
			fourthScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.fourthScore').val()),
			fifthScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.fifthScore').val()),
			sixthScore:$.trim($('.play_reward_manage_ul .play_reward_manage_li .num.sixthScore').val())	
		};
		var r = confirm('确定要保存？？');
		if(r == true){
			$.post(testUrl+'/nggirl-web/web/admin/reward/updateRewardConfig/4.0.8',paramData,function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$('.play_reward_manage_ul .play_reward_manage_li').each(function(index, element) {
						$(this).children('input').attr('disabled','disabled');
					});
					btn.addClass('prm_ul_btn_edit').val('编辑').removeClass('prm_ul_btn_save');
				}else{
					alert(data.data.error);	
				}
			});
		}
    });
	
	//编辑
	$('#play_reward_manage .play_reward_manage_content .prm_ul_btn_edit').live('click',function(e) {
		var btn = $(this);
		$('.play_reward_manage_ul .play_reward_manage_li').each(function(index, element) {
            $(this).children('input').removeAttr('disabled');
        });
		btn.addClass('prm_ul_btn_save').val('保存').removeClass('prm_ul_btn_edit');
	});
	
	//
	$('.play_reward_manage_ul .play_reward_manage_li .num').keyup(function(e) {
        if($.trim($(this).val()) == 0 ){
			alert('输入值不可以为0或空!');
			$(this).val($(this).attr('score'));
		}else if($.trim($(this).val()) > 500){
			alert('最大输入值为500!');
			$(this).val(500);
		}
    });
})
//打赏南瓜币详情V4.0.8
function loadRewardConfigInfo(){
	$.get(testUrl+'/nggirl-web/web/admin/reward/rewardConfigInfo/4.0.8',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.play_reward_manage_ul .play_reward_manage_li .num.firstScore').val(data.data.firstScore);
			$('.play_reward_manage_ul .play_reward_manage_li .num.secondScore').val(data.data.secondScore);
			$('.play_reward_manage_ul .play_reward_manage_li .num.thirdScore').val(data.data.thirdScore);
			$('.play_reward_manage_ul .play_reward_manage_li .num.fourthScore').val(data.data.fourthScore);
			$('.play_reward_manage_ul .play_reward_manage_li .num.fifthScore').val(data.data.fifthScore);
			$('.play_reward_manage_ul .play_reward_manage_li .num.sixthScore').val(data.data.sixthScore);
		}else{
			alert(data.data.error);	
		}
	});
}
