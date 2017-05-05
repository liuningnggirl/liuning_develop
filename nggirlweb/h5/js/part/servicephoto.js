$(function(){
//订单管理
//<!--  点击搜索按钮 -->
	$(".searchsp-btn").click(listsephoCodes);
	
//点击添加作品按钮弹出--》添加作品页面
	$('.add-sepho-btm').live('click',function(){
		$('.published-work-btn-update').hide();
		$('.sepho-list,.sepho').show();
		$('.ckxq').hide();
		listsephoCodes();
		});
//<!--  点击添加服务实拍按钮 -->
	$('.sepho-list .addsp-btn').click(function(e) {
		$('.sepho-list').hide();
		$('.sp-create').show();
		$(".countnum").children("span").text("0");
		
	});
//返回按钮
	$(".sp-create .return-sp").click(function(){
		$('.sp-create .dressid').val('');
		$('.sp-create .phodesc').val('');
		$('.imgpho img').removeAttr("src");
		$('.sp-create .spTime').val('');
		$('.sp-create .create-sp').removeAttr("postid")
		$('.currentpho').css('display','none');
		$('.sepho-list').show();
		$('.sp-create ').hide();
	});
//权值点击显示数字
$(".dressid").live('keyup',function(){
	this.value=this.value.replace(/\D/g,'');
	});
$(".dressid").live('afterpaste',function(){
	this.value=this.value.replace(/\D/g,'')
	});
//获取当前输入字数
$(".phodesc").live('keyup',function(){
	var num=$.trim($('.sp-create .phodesc').val().length);
	$(".countnum").children("span").text(num);
	if(num > 140){
		var currentnum=$(this).val().substr(0,140);
		$(this).val(currentnum);
		}
	});
//图片
$('.filepho').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$(this).next(".imgpho").children(".currentpho").attr({"src":data.result.data.url,"photoHeight":data.result.data.height,"photoWidth":data.result.data.width});
			$(this).next(".imgpho").children(".currentpho").show();
		}
});
			
//创建新服务实拍
	$(".sp-create .create-sp").live('click',function(){
		
		if($.trim($('.sp-create .dressid').val()) == ''){
			alert("化妆师编号不能为空！");
			}else if(!$('.sp-create .currentpho:eq(0)').attr("src") && !$('.sp-create .currentpho:eq(1)').attr("src") && !$('.sp-create .currentpho:eq(2)').attr("src") && !$('.sp-create .currentpho:eq(3)').attr("src")){
			alert("请选择图片");
			}else if($.trim($('.sp-create .phodesc').val()) == ''){
			alert("描述不能为空！");
			}else if($.trim($('.sp-create .spTime').val()) == ''){
			alert("请选择时间");
			}else {
				if($('.sp-create .create-sp').attr("postid")){
					editspdetail();
					}else{
						creatspdetail();
					}
			}
	});

//获取编辑服务实拍内容
$(".recrebtn").live("click", function(){
		
		$('.sepho-list').hide();
		$('.sp-create').show();
		$('.sp-create .create-sp').attr("postid",$(this).parent().siblings(".postid").html())
		$('.dressid').val($(this).parent().attr("dresserid"));
		$('.phodesc').val($(this).parent().siblings(".sephodesc").html());
		$('.spTime').val($(this).parent().siblings(".publishtime").html());
		for(var i=0;i<$(this).parent().siblings('.postimg').children('img').length;i++){
			$('.imgpho:eq('+i+') img').show();
			$('.imgpho:eq('+i+') img').attr("src",$(this).parent().siblings('.postimg').children('img:eq('+i+')').attr("src"));
			}
		var num=$.trim($(this).parent().siblings(".sephodesc").html().length);
		$(".countnum").children("span").text(num);
});

//定义添加传值数据
function sephoInfo1(){
	//获取图片地址
		var imgsUrl1 = '';
		var imgsContentPhoto1 = '';
		for(var i=0;i<4;i++){
			if($(".currentpho:eq("+i+")").attr('src') && $(".currentpho:eq("+i+")").attr('src') != "undefined"){
			imgsUrl1 += '{"imgUrl":"'+$(".currentpho:eq("+i+")").attr('src')+'","height":'+$(".currentpho:eq("+i+")").attr('photoHeight')+',"width":'+$(".currentpho:eq("+i+")").attr('photoWidth')+'},';
			}
		}
		//去掉最后一个逗号
		imgsContentPhoto1 = imgsUrl1.substring(0,imgsUrl1.length-1);
		console.log(imgsContentPhoto1);
		var advertiserInfo1='{"dresserId":"'+$('.sp-create .dressid').val()+'","postImgs":['+imgsContentPhoto1+'],"descrip":"'+$('.sp-create .phodesc').val()+'","publishTime":"'+$('.sp-create .spTime').val()+'"}';
		return advertiserInfo1;
	}
//定义修改传值数据
function sephoInfo2(){
	//获取图片地址
		var imgsUrl2 = '';
		var imgsContentPhoto2 = '';
		for(var i=0;i<4;i++){
			if($(".currentpho:eq("+i+")").attr('src') && $(".currentpho:eq("+i+")").attr('src') != "undefined"){
			imgsUrl2 += '{"imgUrl":"'+$(".currentpho:eq("+i+")").attr('src')+'","height":'+$(".currentpho:eq("+i+")").attr('photoHeight')+',"width":'+$(".currentpho:eq("+i+")").attr('photoWidth')+'},';
			}
		}
		//去掉最后一个逗号
		imgsContentPhoto2 = imgsUrl2.substring(0,imgsUrl2.length-1);
		
		var advertiserInfo2='{"postId":"'+$(".create-sp").attr('postid')+'","dresserId":"'+$('.sp-create .dressid').val()+'","postImgs":['+imgsContentPhoto2+'],"descrip":"'+$('.sp-create .phodesc').val()+'","publishTime":"'+$('.sp-create .spTime').val()+'"}';
		
		return advertiserInfo2;
	}
//创建新服务实拍调用方法
function creatspdetail(){
	var data=sephoInfo1();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/addPost/1.5.0',
		type : 'post',
		dataType : 'json',
		data: {servicePostInfo:data},
		success : function(data){
			if(data.code == 0){
				listsephoCodes();
				$('.sp-create .dressid').val('');
				$('.sp-create .phodesc').val('');
				$('.sp-create .spTime').val('');
				$('.currentpho').css('display','none');
				$('.imgpho img').removeAttr("src");
				$('.sepho-list').show();
				$('.sp-create').hide();
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		 }
	});
}
//编辑服务实拍调用方法
function editspdetail(){
	//获取除了封面以外上传的其他图片地址
	var data=sephoInfo2();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/updatePost/1.5.0',
		type : 'post',
		dataType : 'json',
		data:{servicePostInfo:data},
		success : function(data){
			if(data.code == 0){
				listsephoCodes();
				$('.sp-create .dressid').val('');
				$('.sp-create .phodesc').val('');
				$('.sp-create .spTime').val('');
				$('.sp-create .create-sp').removeAttr("postid");
				$('.imgpho img').removeAttr("src");
				$('.currentpho').css('display','none');
				$('.sepho-list').show();
				$('.sp-create ').hide();
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		 }
	});
	}

});


//定义数据
function  getsephoData(num,page,nickName,startTime,endTime,postId){
	var data = new Object();
	data.num = num;
	data.page = page;
	data.nickName = nickName;
	data.startTime = startTime;
	data.endTime = endTime;
	data.postId = postId;
	return data;	
}

//搜索的数据
function gensephoData(){
	return getsephoData(
	20,1,$('.sepho-list .sephoname').val(),
	$('.sepho-list .spstartTime').val(),$('.sepho-list .spendTime').val(),$('.sepho-list .sephoid').val()
	);
}
//取消全部
$(".closesp-btn").live('click',function(){
	$('.sepho-list .sephoname').val("");
	$('.sepho-list .spstartTime').val("");
	$('.sepho-list .spendTime').val("");
	$('.sepho-list .sephoid').val("");
	listsephoCodes();
	})
//删除服务实拍
	$('.delsephobtn').live('click',function(e) {
		$(".delcodeboxs").css("top",$(window).scrollTop()+156);
		$(".delcodeboxs,.allboxs").show();
		var del=$(this);
		$(".delcodeboxs .suredels").click(function(){
			$(".delcodeboxs,.allboxs").hide();
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/deletePost/1.5.0',
				type : 'post',
				dataType : 'json',
				data: {postId:del.parent().parent().children('td:eq(0)').html()},
				success : function(data){
					if(data.code==0){
						del.parent().parent().remove();
					}else{
						alert(data.data.error);
						}
				},
			});
		});
		$(".delcodeboxs .notdels").click(function(){
			$(".delcodeboxs,.allboxs").hide();
			});
    });

//渲染数据
function sephoPage(data){
	$('.splist tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var contentImgTags = '<td class="wid275 postimg">';
		for(var imgIndex = 0; imgIndex < data.data.pageData[x].postImgs.length ; imgIndex ++){
			if(data.data.pageData[x].postImgs[imgIndex] != "" &&data.data.pageData[x].postImgs[imgIndex] != "null")
			contentImgTags +=  '<img src="'+data.data.pageData[x].postImgs[imgIndex]+'"/>';
		};
		contentImgTags += '</td>';'+contentImgTags+'
		$('.splist').append('<tr><td class="postid">'+data.data.pageData[x].postId+'</td><td class="publishtime">'+data.data.pageData[x].publishTime+'</td><td>'+data.data.pageData[x].nickName+'</td><td>'+data.data.pageData[x].phoneNum+'</td>'+contentImgTags+'<td class="sephodesc">'+data.data.pageData[x].descrip+'</td><td dresserId="'+data.data.pageData[x].dresserId+'"><input type="button" value="编辑" class="recrebtn" /><br><br><input type="button" value="删除" class="delsephobtn"/></td></tr>');
		
		
	}	
	
	
}

//根据不同的页码来渲染页面
function onClicksephoPageNum(p){
	var data = gensephoData();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getPostList/1.5.0',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			sephoPage(data);
		},
	});
}

//获取入参，渲染页面
function listsephoCodes(){
	//获取入参
	var data = gensephoData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/dresser/getPostList/1.5.0',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			//创建分页
			$(".sepho-list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onClicksephoPageNum
			});
			
			//渲染页面
			sephoPage(data);
		},
	});
}