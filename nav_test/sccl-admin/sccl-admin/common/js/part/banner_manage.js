var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	loadBannerPage();
	//获取跳转类型V2.4.0
	$.get(testUrl+'/nggirl-web/web/admin/banner/getForwardTypes/2.4.0',{id:$(this).attr('scrollHeadId')},function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			for(var x = 0; x < data.data.length; x ++){
				$('.modal-body #mb_select_kinds').append('<option forwardtype="'+data.data[x].forwardtype+'" isForwardkeyRequired="'+data.data[x].isForwardkeyRequired+'" forwardkeyDesc="'+data.data[x].forwardkeyDesc+'">'+data.data[x].forwardtypeName+'</option>');
			}
		}else{
			alert(data.data.error);	
		}
	});
	
	//获取原生页面对应的H5跳转链接V2.4.0
	$('.modal-body .mb_redirect_href').click(function(e) {
		$.get(testUrl+'/nggirl-web/web/admin/banner/getForwardH5Url/2.4.0',{forwardtype:$('#mb_select_kinds option:selected').attr('forwardtype'),forwardkey:$('.mb_forward_href').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				$('.modal-body .tz-address').val(data.data.h5url);
			}else{
				alert(data.data.error);	
			}
		});
    });
	
	//添加banner
	$('.banner-table .bt-add-btn').live('click',function(e) {
		//清除弹框的内容
		$('.tz-address').val('');
		$('.fx-content').val('');
		$("#img0").removeAttr('src');
		$("#fx-img0").removeAttr('src');
		$('.add-box-hide').removeAttr('scrollHeadId');

		$('.modal-body #mb_select_kinds option:eq(0)').attr('selected','selected');
		$('.mb_forwardkey').show();
		$('.modal-body .mb_forward_desc').html('请先选择类型');
		$('.mb_forward_href').val('');
		
		$('.banner-submit').show();
		$('.banner-gray-box').show();
		$('.banner-submit-edit,.mb_forwardkey,.mb_forwardkey_desc').hide();		
        $('.add-box-hide').show();
		$('.modal-header b').html('添加');
    });
	
	//上传大图
	$('#file0').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#img0').attr('src',data.result.data.url);
		}
	});
	//上传小图
	$('#fx-img-address').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$('#fx-img0').attr('src',data.result.data.url);
		}
	});
	
	//banner详情弹窗关闭按钮
	$('.close-btn').live('click',function(e) {
        $('.add-box-hide').hide();
		$('.banner-gray-box').hide();
    });
	$('.banner-cancle').live('click',function(e) {
        $('.add-box-hide').hide();
		$('.banner-gray-box').hide();
    });
	
	//添加banner
	$('.banner-submit').live('click',function(e) {
		if($("#img0").attr("src") == null || $("#img0").attr("src") == ''){
			alert('请先选择图片路径！！');	
		}else if($('.tz-address').val() == null || $('.tz-address').val() == ''){
			alert('请先填写转地址!!');
		}else if($('.fx-content').val() == null || $('.fx-content').val() == ''){
			alert('请先填写享内容!!');	
		}else if($("#fx-img0").attr("src") == null || $("#fx-img0").attr("src") == ''){
			alert('请先填写图片地址!!');
		}else if($('#mb_select_kinds option:selected').attr('isForwardkeyRequired') == 1 && $.trim($('.mb_forward_href').val()) == ''){
			alert('请填写跳转参数!!');
		}else{
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/banner/addBanner/2.4.0',
				type : 'post',
				dataType : 'json',
				data: {photoUrl:$("#img0").attr("src"),webPageUrl:$('.tz-address').val(),shareContent:$('.fx-content').val(),shareImage:$("#fx-img0").attr("src"),forwardtype:$('#mb_select_kinds option:selected').attr('forwardtype'),forwardkey:$('.mb_forward_href').val()},
				success : function(data){
					if(data.code == 0){
						$('.banner-gray-box').hide();
						$('.add-box-hide').hide();
						$('.banner tr:gt(0)').remove();
						//<!--  获取banner列表 --> 
						alert('添加成功！');
						loadBannerPage();
					}
					
					if(data.code == 1){
						alert(data.data.error);	
					}
				},
			});
		}
    });
	
	//选择不同的跳转类型
	$('.modal-body #mb_select_kinds').change(function(e) {
        //判断isForwardkeyRequired是否必填，1必填，0不填写
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 0){
			$('.mb_forwardkey').hide();
			$('.mb_forward_href').val('');
		}
		if($(this).children('option:selected').attr('isForwardkeyRequired') == 1){
			$('.mb_forwardkey,.mb_forwardkey_desc').show();
		}
		$('.modal-body .mb_forward_desc').html($(this).children('option:selected').attr('forwardkeyDesc'));
    });
	
	//修改banner 
	$('.abt-btn .ab-edit-btn').live('click',function(e) {
		$('.banner-gray-box').show();
		$('.banner-submit-edit').show();
		$('.banner-submit').hide();
		$.get(testUrl+'/nggirl-web/web/admin/banner/getDetails/2.4.0',{id:$(this).attr('scrollHeadId')},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
				console.log(data);
				$('.tz-address').val(data.data.webPageUrl);
				$('.fx-content').val(data.data.shareContent);
				$("#img0").attr("src",data.data.photoUrl);
				$("#fx-img0").attr("src",data.data.shareImage);
				$('.modal-header b').html('编辑');
				$('.modal-body #mb_select_kinds option').each(function(index, element) {
                    if($(this).attr('forwardtype') == data.data.forwardtype){
						$(this).attr('selected','selected');
						$('.mb_forward_desc').html($(this).attr('forwardkeyDesc'));
						if($(this).attr('isForwardkeyRequired') == 0){
							$('.mb_forwardkey').hide();
						}
						if($(this).attr('isForwardkeyRequired') == 1){
							$('.mb_forwardkey,.mb_forwardkey_desc').show();
						}
					}
					if(data.data.forwardkey == ''){
						$('.mb_forwardkey_desc').hide();	
					}else{
						$('.mb_forwardkey_desc').show();	
					}
                });
				$('.mb_forward_href').val(data.data.forwardkey);
			}
			
			if(data.code == 1){
				alert(data.data.error);	
			}
		});
        $('.add-box-hide').show();
		//把当前的scrollHeadId值放在弹框中
		$('.add-box-hide').attr('scrollHeadId',$(this).attr('scrollHeadId'));
    });
	
	//修改banner
	$('.banner-submit-edit').live('click',function(e) {
		if($("#img0").attr("src") == null || $("#img0").attr("src") == ''){
			alert('请先选择图片路径！！');	
		}else if($('.tz-address').val() == null || $('.tz-address').val() == ''){
			alert('请选填写转地址!!');
		}else if($('.fx-content').val() == null || $('.fx-content').val() == ''){
			alert('请选填写享内容!!');	
		}else if($("#fx-img0").attr("src") == null || $("#fx-img0").attr("src") == ''){
			alert('请先填写图片地址!!');
		}else if($('#mb_select_kinds option:selected').attr('isForwardkeyRequired') == 1 && $.trim($('.mb_forward_href').val()) == ''){
			alert('请填写跳转参数!!');
		}else{
			var r = confirm('确认要修改？？');
			if(r == true){
				$.ajax({
					url : testUrl+'/nggirl-web/web/admin/banner/updateBanner/2.4.0',
					type : 'post',
					dataType : 'json',
					data: {photoUrl:$("#img0").attr("src"),webPageUrl:$('.tz-address').val(),shareContent:$('.fx-content').val(),scrollHeadId:$('.add-box-hide').attr('scrollHeadId'),shareImage:$("#fx-img0").attr("src"),forwardtype:$('#mb_select_kinds option:selected').attr('forwardtype'),forwardkey:$('.mb_forward_href').val()},
					success : function(data){
						if(data.code == 0){
							alert('成功修改！！');
							$('.add-box-hide').hide();
							$('.banner-gray-box').hide();
							$('.banner tr:eq(1)').children('td').remove();
							//<!--  获取banner列表 --> 
							loadBannerPage();	
						}
						
						if(data.code == 1){
							alert(data.data.error);	
						}
					},
				});
			};
		}
    });

	//删除banner图片
	$('.abt-btn .ab-del-btn').live('click',function(e) {
		var r = confirm('确认要删除？？');
		if(r == true){
			//<!--  删除banner图片 -->
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/banner/deleteBanner/1.3.2',
				type : 'post',
				dataType : 'json',
				data: {scrollHeadId:$(this).attr('scrollHeadId')},
				success : function(data){
					if(data.code == 0){
						$(this).parent().parent().parent().remove();
						alert('成功删除！！');
						//<!--  获取banner列表 --> 
						loadBannerPage();	
					}
					
					if(data.code == 1){
						alert(data.data.error);	
					}
				},
			});
		}
    });
	
	//发布首页banner
	$('.banner-table .banner_content_index .check-id .ci-btn').click(function(e) {
		var str = '';
		var len = '';
		if($.trim($(this).siblings('input').val()) == ''){
			alert('六个bannerID为必填项!');
		}else{
			$(this).siblings('input').each(function(e) {
				if($.trim($(this).val()) != ''){
					str = str + $(this).val() + ',';	
				};
			});
			len = str.substring(0,str.length-1);
			
			$.post(testUrl+'/nggirl-web/web/admin/banner/online/1.3.2',{scrollHeadIds:len},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('发布成功');
					//获取上线中的banner
					getOnlineBannerIndexFn();
				}
				
				if(data.code == 1){
					alert(data.data.error);
				}
			});
		}
    });
	
	//发布积分商城banner
	$('.banner-table .banner_content_integralMall .check-id .ci-btn').click(function(e) {
		var str = '';
		var len = '';
		if($.trim($(this).siblings('input').val()) == ''){
			alert('六个bannerID为必填项!');
		}else{
			$(this).siblings('input').each(function(e) {
				if($.trim($(this).val()) != ''){
					str = str + $(this).val() + ',';	
				};
			});
			len = str.substring(0,str.length-1);
			
			$.post(testUrl+'/nggirl-web/web/admin/banner/scoreShopBannerOnline/2.5.2',{scrollHeadIds:len},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					alert('发布成功');
					//获取上线中的banner
					getOnlineBannerIntegralMallFn();
				}
				
				if(data.code == 1){
					alert(data.data.error);
				}
			});
		}
    });
});

//创建banner列表分页
function createBannerPage(data){
	$(".banner-table .tcdPageCode").createPage({
		pageCount:parseInt(data.data.totalPageNum),
		current:parseInt(data.data.currnetPageNum),
		backFn:function(p){
			var params = getBannerSearchParams();
			params.page = p;
			$('.banner-table .add-banner-table>tbody>tr:gt(0)').remove(); //清除原来的表格信息
			$.ajax({
				url : testUrl+'/nggirl-web/web/admin/banner/getBanners/1.3.2',
				type : 'get',
				dataType : 'json',
				data: params,
				success : initBannerPage
			});			
		}
	});
}

//初始化banner分页
function initBannerPage(data){
	createBannerPage(data);
	for(var x = 0; x < data.data.pageData.length; x ++){
		$('.banner-table .add-banner-table').append('<tr><td>'+data.data.pageData[x].scrollHeadId+'</td><td>'+data.data.pageData[x].shareContent+'</td><td><img src="'+data.data.pageData[x].photoUrl+'" width="80" alt="" /></td><td><div class="abt-btn"><input type="button" value="编辑" class="ab-edit-btn"  scrollHeadId="'+data.data.pageData[x].scrollHeadId+'" /> <input type="button" value="删除" class="ab-del-btn" scrollHeadId="'+data.data.pageData[x].scrollHeadId+'" /></div></td></tr>');
	}
}

//获取查询参数
function getBannerSearchParams(page){
	var params = new Object();
	if(page == undefined){
		page =1;
	}
	params.page = page;
	return params;
}

//加载banner分页数据
function loadBannerPage(){
	$('.banner-table .add-banner-table>tbody>tr:gt(0)').remove();
	$.ajax({
		url : testUrl+'/nggirl-web/web/admin/banner/getBanners/1.3.2',
		type : 'get',
		dataType : 'json',
		data: getBannerSearchParams(1),
		success : initBannerPage,
	});
	
	//获取首页上线中的banner
	getOnlineBannerIndexFn();
	//获取积分商城已发布BannerV2.5.2
	getOnlineBannerIntegralMallFn();
}
	
//获取首页上线中的banner
function getOnlineBannerIndexFn(){
	$.get(testUrl+'/nggirl-web/web/admin/banner/getOnlineBanner/1.3.2',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.banner_content_index .check-online .ct0').html('('+(data.data[0]||'')+')');
			$('.banner_content_index .check-online .ct1').html('('+(data.data[1]||'')+')');
			$('.banner_content_index .check-online .ct2').html('('+(data.data[2]||'')+')');
			$('.banner_content_index .check-online .ct3').html('('+(data.data[3]||'')+')');
			$('.banner_content_index .check-online .ct4').html('('+(data.data[4]||'')+')');
			$('.banner_content_index .check-online .ct5').html('('+(data.data[5]||'')+')');
			
			$('.banner_content_index .check-id .ct0').val(data.data[0]);
			$('.banner_content_index .check-id .ct1').val(data.data[1]);
			$('.banner_content_index .check-id .ct2').val(data.data[2]);
			$('.banner_content_index .check-id .ct3').val(data.data[3]);
			$('.banner_content_index .check-id .ct4').val(data.data[4]);
			$('.banner_content_index .check-id .ct5').val(data.data[5]);
		}
		
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}
	
//获取积分商城已发布BannerV2.5.2
function getOnlineBannerIntegralMallFn(){
	$.get(testUrl+'/nggirl-web/web/admin/banner/getScoreShopOnlineBanner/2.5.2',function(data){
		var data = $.parseJSON(data);
		if(data.code == 0){
			$('.banner_content_integralMall .check-online .ct0').html('('+(data.data[0]||'')+')');
			$('.banner_content_integralMall .check-online .ct1').html('('+(data.data[1]||'')+')');
			$('.banner_content_integralMall .check-online .ct2').html('('+(data.data[2]||'')+')');
			$('.banner_content_integralMall .check-online .ct3').html('('+(data.data[3]||'')+')');
			$('.banner_content_integralMall .check-online .ct4').html('('+(data.data[4]||'')+')');
			$('.banner_content_integralMall .check-online .ct5').html('('+(data.data[5]||'')+')');
			
			$('.banner_content_integralMall .check-id .ct0').val(data.data[0]);
			$('.banner_content_integralMall .check-id .ct1').val(data.data[1]);
			$('.banner_content_integralMall .check-id .ct2').val(data.data[2]);
			$('.banner_content_integralMall .check-id .ct3').val(data.data[3]);
			$('.banner_content_integralMall .check-id .ct4').val(data.data[4]);
			$('.banner_content_integralMall .check-id .ct5').val(data.data[5]);
		}
		
		if(data.code == 1){
			alert(data.data.error);	
		}
	});
}
	
