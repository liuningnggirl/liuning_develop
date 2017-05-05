$(function(){
//订单管理
//<!--  点击搜索按钮 -->
	$('.ad-list .searchad-btn').click(listInviteCodes3);
//<!--  点击添加广告按钮 -->
	$('.ad-list .createad-btn').click(function(e) {
		clearAd();
		$('.ad-list').hide();
		$('.ad-create').show();
	});
//返回按钮
	$(".ad-create .return-adlist").click(function(){
		clearAd();
		$('.ad-list').show();
		$('.ad-create').hide();
	});
//权值点击显示数字
$(".creatweight,.imgheight,.imgwidth").live('keyup',function(){
	this.value=this.value.replace(/\D/g,'');
	});
$(".creatweight,.imgheight,.imgwidth").live('afterpaste',function(){
	this.value=this.value.replace(/\D/g,'')
	});
//点击否时隐藏链接输入框
$('.ad-create .imgurl1').click(function(){
		$('.ad-create .linkadress').show();
});
$('.ad-create .imgurl2').click(function(){
		$('.ad-create .linkadress').hide();
		$('.ad-create .linkurl').val('');
		
})
//图片
$('.fileimg').fileupload({
		dataType: 'json',
		done: function (e, data) {
			$(this).next($(".currentimg")).attr({"src":data.result.data.url,"photoHeight":data.result.data.height,"photoWidth":data.result.data.width});
		}
});
			
//创建新广告
	$(".ad-create .create-ad").live('click',function(){
		if($.trim($('.ad-create .creatadvertiser').val()) == ''){
			alert("广告主不能为空");
		}else if($.trim($('.ad-create .creatweight').val()) == '' || $('.ad-create .creatweight').val()=='0'){
			alert("展示权重不能为空或0");
		}else if($.trim($('.ad-create .startTime').val()) == '' ){
			alert("开始时间不能为空");
		}else if($.trim($('.ad-create .endTime').val()) == ''){
			alert("结束时间不能为空");
		}else if($('.ad-create .currentimg:eq(0)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(1)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(2)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(3)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(4)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(5)').attr("src") == 'images/add.jpg' || $('.ad-create .currentimg:eq(6)').attr("src") == 'images/add.jpg'){
			alert("请选择要展示的图片");
		}else if(!$('.ad-create .imgurl1').attr('checked') && !$('.ad-create .imgurl2').attr('checked')){
			alert("请选择是否有链接");
		}else if($('.ad-create .imgurl1').attr('checked') && $.trim($('.ad-create .linkurl').val()) == ''){
			alert("请输入链接地址");
		}else {
			if($('.ad-create .creatadvertiser').attr("adid")){
				editaddetail();
			}else{
				creataddetail();
			}
		}
	});
//点击上线
/*$(".adlist .adbtn").live('click',function(){
	var del=$(this);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/updateAdOnlineStatus/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {id:del.attr('id'),onLine:del.attr('onLine')},
		success : function(data){
			if(data.code == 0){
				if(del.hasClass("redbtn1")){
					del.val("上线");
					del.attr('onLine',"1");
					del.addClass("bluebtn1").removeClass("redbtn1");
				}else{
					del.val("下线");
					del.attr('onLine',"0");
					del.addClass("redbtn1").removeClass("bluebtn1");
				}
			}else{
				alert(data.data.error);	
			}
		}
	});
});*/
//获取编辑广告内容
$(".rewritebtn").live("click", function(){
	
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/getAdDetail/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {id:$(this).parent().parent().children('td:eq(0)').html()},
		success : function(data){
			if(data.code == 0){
				$('.ad-create .creatadvertiser').attr("adid",data.data.id);
				$('.ad-create .creatadvertiser').val(data.data.advertiser);
				$('.ad-create .creatweight').val(data.data.weight);
				$('.ad-create .startTime').val(data.data.onlineStartTime);
				$('.ad-create .endTime').val(data.data.onlineEndTime);
				$('#ad-img').css('display','block');
				for(var i=0; i<data.data.photos.length; i++){
					if(data.data.photos[i].screenHeight==960 && data.data.photos[i].screenWidth==640){
						$(".currentimg:eq(0)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==1136 && data.data.photos[i].screenWidth==640){
						$(".currentimg:eq(1)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==1334 && data.data.photos[i].screenWidth==750){
						$(".currentimg:eq(2)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==2208 && data.data.photos[i].screenWidth==1242){
						$(".currentimg:eq(3)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==800 && data.data.photos[i].screenWidth==480){
						$(".currentimg:eq(4)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==1280 && data.data.photos[i].screenWidth==720){
						$(".currentimg:eq(5)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}else if(data.data.photos[i].screenHeight==1920 && data.data.photos[i].screenWidth==1080){
						$(".currentimg:eq(6)").attr({'src':data.data.photos[i].url,'photoHeight':data.data.photos[i].photoHeight,'photoWidth':data.data.photos[i].photoWidth,'photoId':data.data.photos[i].photoId});
					}
					}
				if(data.data.hasLink== "0"){
					$('.ad-create .imgurl2').attr('checked','checked');
					$('.ad-create .linkadress').hide();
					}else{
						$('.ad-create .imgurl1').attr('checked','checked');
						$('.ad-create .linkurl').val(data.data.linkUrl);
						$('.ad-create .linkadress').show();
						}
				$('.ad-create .right_adtxt').val(data.data.remark);
				$('.ad-list').hide();
				$('.ad-create').show();
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		 }
	});	
	})
function clearAd(){
	$('.ad-create .rightbox').val('');
	$('.ad-create .right_adtxt').val('');
	$('.ad-create .startTime').val('');
	$('.ad-create .endTime').val('');
	$('.ad-create .currentimg').attr("src","images/add.jpg");
	$('.ad-create .creatadvertiser').removeAttr("adid");
	$('.ad-create .currentimg').removeAttr("photoid");
	$('.ad-create .imgurl1').click();
	$('#ad-img').css('display','none');
}
//定义添加传值数据
function advertiserInfo1(){
	//获取图片地址
		var data= new Object;
		data.advertiser=$('.ad-create .creatadvertiser').val();
		data.weight=$('.ad-create .creatweight').val();
		var photos= new Array;
		$.each($(".ad-create .imgboxs .imginnerbox"),function(key,val){
			var imgsUrl1= new Object;
			var chn=$(this).children(".currentimg");
			imgsUrl1.url=chn.attr('src');
			imgsUrl1.photoHeight=chn.attr('photoHeight');
			imgsUrl1.photoWidth=chn.attr('photoWidth');
			imgsUrl1.screenHeight=chn.attr('screenHeight');
			imgsUrl1.screenWidth=chn.attr('screenWidth');
			imgsUrl1.deviceType=chn.attr('deviceType');
			photos.push(imgsUrl1);
			return photos;
		});
		data.photos=photos;
		data.hasLink=$('.ad-create input[type=radio]:checked').val();
		data.linkUrl=$('.ad-create .linkurl').val();
		data.remark=$('.ad-create .right_adtxt').val();
		data.onlineStartTime=$('.ad-create .startTime').val();
		data.onlineEndTime=$('.ad-create .endTime').val();
		var datas = JSON.stringify(data);
		return datas;
	}
//定义修改传值数据
function advertiserInfo2(){
	//获取图片地址
		var data= new Object;
		data.id=$('.ad-create .creatadvertiser').attr("adid");
		data.advertiser=$('.ad-create .creatadvertiser').val();
		data.weight=$('.ad-create .creatweight').val();
		var photos= new Array;
		$.each($(".ad-create .imgboxs .imginnerbox"),function(key,val){
			var imgsUrl1= new Object;
			var chn=$(this).children(".currentimg");
			imgsUrl1.url=chn.attr('src');
			imgsUrl1.photoHeight=chn.attr('photoHeight');
			imgsUrl1.photoWidth=chn.attr('photoWidth');
			imgsUrl1.screenHeight=chn.attr('screenHeight');
			imgsUrl1.screenWidth=chn.attr('screenWidth');
			imgsUrl1.deviceType=chn.attr('deviceType');
			photos.push(imgsUrl1);
			return photos;
		});
		data.photos=photos;
		data.hasLink=$('.ad-create input[type=radio]:checked').val();
		data.linkUrl=$('.ad-create .linkurl').val();
		data.remark=$('.ad-create .right_adtxt').val();
		data.onlineStartTime=$('.ad-create .startTime').val();
		data.onlineEndTime=$('.ad-create .endTime').val();
		var datas = JSON.stringify(data);
		return datas;
	}
//创建新广告调用方法
function creataddetail(){
	var data=advertiserInfo1();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/addAdvertiser/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {advertiserInfo:data},
		success : function(data){
			if(data.code == 0){
				listInviteCodes3();
				clearAd();
				$('.ad-list').show();
				$('.ad-create').hide();
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		 }
	});
}
//编辑广告调用方法
function editaddetail(){
	//获取除了封面以外上传的其他图片地址
	var data=advertiserInfo2();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/updateAdvertiser/3.0.0',
		type : 'post',
		dataType : 'json',
		data:{advertiserInfo:data},
		success : function(data){
			if(data.code == 0){
				listInviteCodes3();
				clearAd();
				$('.ad-list').show();
				$('.ad-create').hide();
			}
			if(data.code == 1){
				alert(data.data.error);	
			}
		 }
	});
	}

});


//定义数据
function  getData3(page,advertiser,creatorName,startTime,endTime,remark,onlineStartTimeBegin,onlineStartTimeEnd,onlineEndTimeBegin,onlineEndTimeEnd){
	var data = new Object();
	data.page = page;
	data.advertiser = advertiser;
	data.creatorName = creatorName;
	data.startTime = startTime;
	data.endTime = endTime;
	data.remark = remark;
	data.onlineStartTimeBegin = onlineStartTimeBegin;
	data.onlineStartTimeEnd = onlineStartTimeEnd;
	data.onlineEndTimeBegin = onlineEndTimeBegin;
	data.onlineEndTimeEnd = onlineEndTimeEnd;
	return data;	
}

//搜索的数据
function genData3(){
	return getData3(
	1,$('.ad-list .advertiser').val(),
	$('.ad-list .creatorName').val(),$('.ad-list .adstartTime').val(),$('.ad-list .adendTime').val(),$('.ad-list .remark').val(),
	$('.ad-list .onlineStartTimeBegin').val(),$('.ad-list .onlineStartTimeEnd').val(),$('.ad-list .onlineEndTimeBegin').val(),$('.ad-list .onlineEndTimeEnd').val()
	);
}

//渲染数据
function sresolvePage3(data){
	$('.adlist tr:gt(0)').remove();
	for(var x = 0; x < data.data.pageData.length ; x ++){
		var contentImgTags = '<td>';
		for(var imgIndex = 0; imgIndex < data.data.pageData[x].photos.length ; imgIndex ++){
			contentImgTags +=  '<img width="25px"  src="'+data.data.pageData[x].photos[imgIndex].url+'" id="'+data.data.pageData[x].photos[imgIndex].photoId+'"/>';
		};
		contentImgTags += '</td>';
		var onoroutLine=''
		if(data.data.pageData[x].onLine == "0"){
			onoroutLine='<td >已下线</td>';
		}else{
			onoroutLine='<td >已上线</td>';
		}
		$('.adlist').append('<tr><td >'+data.data.pageData[x].id+'</td><td>'+data.data.pageData[x].advertiser+'</td><td>'+data.data.pageData[x].weight+'</td>'+contentImgTags+'<td>'+data.data.pageData[x].linkUrl+'</td><td>'+data.data.pageData[x].count+'</td><td>'+data.data.pageData[x].creatorName+'</td><td>'+data.data.pageData[x].createTime+'</td><td>'+data.data.pageData[x].remark+'</td><td>'+data.data.pageData[x].onlineStartTime+'</td><td>'+data.data.pageData[x].onlineEndTime+'</td>'+onoroutLine+'<td><input type="button" value="编辑" class="rewritebtn bluebtn1" /></td></tr>');
	}	
}

//根据不同的页码来渲染页面
function onClickPageNum3(p){
	var data = genData3();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/getAdList/3.0.0',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			sresolvePage3(data);
		},
	});
}

//获取入参，渲染页面
function listInviteCodes3(){
	//获取入参
	var data = genData3();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/adManage/getAdList/3.0.0',
		type : 'get',
		dataType : 'json',
		data: data,
		success : function(data){
			//创建分页
			$(".ad-list .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onClickPageNum3
			});
			
			//渲染页面
			sresolvePage3(data);
		},
	});
}
function clearAdSearch(){
	$(".ad-list .adSearch input[type=text]").val("");
}