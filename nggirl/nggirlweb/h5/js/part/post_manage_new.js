// JavaScript Document
$(function(){
	//postInfo();
	var backPost=new LocalStorageDeque('postPageRestore');
	$(".post_search .choose_post span").live('click',function(){
		$(this).addClass("on").siblings().removeClass("on");
	});
	$(".post_search .define").live('click',function(){
		$(".choose_post_days").hide();
		$(this).hide();
		$(".choose_post_time").css("display","inline-block");
		$(".advanced_filter").show();
	});
	$(".moreChoose").live('click',function(){
		$(".advanced_filter").toggle();
	});
	$(".post_search .clearBtm").live('click',function(){
		$(".post_search input").val("");
		$(".post_search  .choose_post .on").removeClass("on");
		$(".allColumnNum ").removeClass("on");
		postInfo();
	});
	$(".wait_review").live('click',function(){
		$(".post_manage_box").hide();
		$(".wait_pass_box").show();
		WaitPostInfo();
		$(".wait_pass_box .tongguoshenhe input").css("background","#ccc");
	});
	$(".wait_pass_box .pass_back_btn").live('click',function(){
		$(".post_manage_box").show();
		$(".wait_pass_box").hide();
	});
	$(".postListTabel .lookMore").live('click',function(){
		$(".postListTabel .lookMore").remove();
		$(".postListTabel .lookMoreHide").show();
	});
	$(".post_manage_box .post_column .allColumnNum").live('click',function(){
		$(this).addClass("on").siblings().removeClass("on");
		postInfo();
	});
	//时间
	$(".post_manage_box .post_search .choose_post_days .24hour").live('click',function(){
		var startTime=getPostTime(86400000);
		var endTime=getPostTime(0);
		$(".post_manage_box .post_search .choose_post_time .pstartTime").val(startTime);
		$(".post_manage_box .post_search .choose_post_time .pendTime").val(endTime);
		postInfo();
	});
	$(".post_manage_box .post_search .choose_post_days .3days").live('click',function(){
		var startTime=getPostTime(86400000*3);
		var endTime=getPostTime(0);
		$(".post_manage_box .post_search .choose_post_time .pstartTime").val(startTime);
		$(".post_manage_box .post_search .choose_post_time .pendTime").val(endTime);
		postInfo();
	});
	$(".post_manage_box .post_search .choose_post_days .7days").live('click',function(){
		var startTime=getPostTime(86400000*7);
		var endTime=getPostTime(0);
		$(".post_manage_box .post_search .choose_post_time .pstartTime").val(startTime);
		$(".post_manage_box .post_search .choose_post_time .pendTime").val(endTime);
		postInfo();
	});
	//搜索按钮
	$(".post_manage_box .post_search .advanced_filter .searchBtm").live('click',function(){
		postInfo();
	});
	//加精
	$(".post_manage_box .postListTabel .changeoriPostCream").live('click',function(){		
		$(".digestThis").removeClass("digestThis");
		$(this).addClass("digestThis");
		$("#post_manage .allreasonBox .reasonList .selfReason").removeAttr("disabled");
		if($(this).hasClass("redbtn1")){
			$("#post_manage .cancelDigest").show();
		}else{
			addOrCancelDigest();
		}
	});
	//编辑人数
	$(".postListTabel .changeViewNum,.postListTabel .changeDianZanNum ").live('click',function(event){
		$(".changeThisNum").removeClass("changeThisNum");
		$(this).addClass("changeThisNum");
		var event = event || window.event;
		$("#post_manage .changeOk").hide();
		$("#post_manage .changeNumBox").show();
		
		$("#post_manage .changeNumBox").css({"top":event.clientY,"left":event.clientX});
		$("#post_manage .changeNumBox .truenum").text($(this).parent().attr("trueNum"));
		$("#post_manage .changeNumBox .moniNum").val($(this).parent().attr("initNum"));
		if($(this).hasClass("changeViewNum")){
			$("#post_manage .changeNumBox").attr("num","1");
			$("#post_manage .changeNumBox .true").text("真实浏览量");
			$("#post_manage .changeNumBox .newadd").text("模拟浏览量");
		}else if($(this).hasClass("changeDianZanNum")){
			$("#post_manage .changeNumBox").attr("num","2");
			$("#post_manage .changeNumBox .true").text("真实点赞数");
			$("#post_manage .changeNumBox .newadd").text("模拟点赞数");
		}
	});
	//关闭编辑人数弹窗
	$(".changeNumBox .closeNumBox ").live('click',function(event){
		$("#post_manage .changeNumBox").hide();
	});
	//保存编辑人数弹窗
	$(".changeNumBox .getBackStatus ").live('click',function(event){
		//$("#post_manage .changeNumBox .moniNum").val("0");
		$("#post_manage .changeOk").show();
		$("#post_manage .changeNumBox").delay(500).fadeOut(1000);
		if($("#post_manage .changeNumBox").attr("num")=="1"){
			setupInitViewNum(0);
		}else{
			setupInitPraiseNum(0);
		}
	});
	//恢复编辑人数弹窗
	$(".changeNumBox .changeStatus ").live('click',function(event){
		$("#post_manage .changeOk").show();
		$("#post_manage .changeNumBox").delay(500).fadeOut(1000);
		if($("#post_manage .changeNumBox").attr("num")=="1"){
			setupInitViewNum($("#post_manage .changeNumBox .moniNum").val());
		}else{
			setupInitPraiseNum($("#post_manage .changeNumBox .moniNum").val());
		}
	});
	//待审核页面选择全部或取消
	$(".waitPassTabel .checkAll").live('click',function(event){
		if($(this).attr("checked")){
			$(".waitPassTabel .checkWaitPost").attr("checked","true");
			$(".waitPassTabel .checkWaitPost").addClass("on");
			$(".wait_pass_box .tongguoshenhe input").css("background","#51a351");
		}else{
			$(".waitPassTabel .checkWaitPost").removeAttr("checked");
			$(".waitPassTabel .checkWaitPost").removeClass("on");
			$(".wait_pass_box .tongguoshenhe input").css("background","#ccc");
		}
	});
	//待审核页面底部通过按钮交互
	$(".waitPassTabel .checkWaitPost").live('click',function(event){
		var i=0;
		$(".waitPassTabel .checkWaitPost").each(function(index, element) {
            if($(this).attr("checked")){
				$(".wait_pass_box .tongguoshenhe input").css("background","#51a351");
				return false;
			}else{
				i++;
				if(i == $(".waitPassTabel .checkWaitPost").length){
					$(".wait_pass_box .tongguoshenhe input").css("background","#ccc");
				}
			}
        });
		
	});
	//待审核页面通过
	$(".wait_pass_box .tongguoshenhe input").live('click',function(event){
		var data= new Array();
		$(".waitPassTabel .checkWaitPost").each(function(index, element) {
			var obj= new Object();
            if($(this).attr("checked")){
				obj.postId=$(this).parent().parent().attr("postId");
				obj.postType=$(this).parent().parent().attr("postType");
				data.push(obj);
				return data;
			}
        });
		var datas = JSON.stringify(data);
		onLinePostFn(datas);
	});
	//下线
	$(".postListTabel .changePostStatus").live('click',function(event){
		$(".onorottline").removeClass("onorottline");
		$(this).addClass("onorottline");
		$("#post_manage .outlineReasonBox").show();
		$("#post_manage .outlineReasonBox .reasonList .selfReason").removeAttr("disabled");
		
	});
	//下线原因完成按钮
	$("#post_manage .outlineReasonBox .finish").live('click',function(event){
		var reason="";
		if($("#post_manage .outlineReasonBox .reasonList p.on").text() !="" ){
			reason=$("#post_manage .outlineReasonBox .reasonList p.on").text();
			changePostStatusFn(reason);
		}else if($.trim($("#post_manage .outlineReasonBox .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#post_manage .outlineReasonBox .reasonList .selfReason").val());
			changePostStatusFn(reason);
		}else{
			alert("请选择原因!");
		}
	});
	//通过
	$(".waitPassTabel .passPost,.preResult .passBox .passPost").live('click',function(){
		var data= new Array();
		var obj= new Object();
		obj.postId=$(this).parent().parent().attr("postId");
		obj.postType=$(this).parent().parent().attr("postType");
		data.push(obj);
		var datas = JSON.stringify(data);
		console.log(datas);
		onLinePostFn(datas)
	});
	//不通过
	$(".waitPassTabel .unPassPost,.preResult .passBox .unPassPost").live('click',function(){
		$("#post_manage .reasonBox").show();
		$(".unPassThis").removeClass("unPassThis");
		$(this).addClass("unPassThis");
		$("#post_manage .allreasonBox .reasonList .selfReason").removeAttr("disabled");
	});
	//删除
	$(".waitPassTabel .column-del,.post_manage_box .postListTabel .postDel").live('click',function(){
		$("#post_manage .delReasonBox").show();
		$(".delThis").removeClass("delThis");
		$(this).addClass("delThis");
		$("#post_manage .allreasonBox .reasonList .selfReason").removeAttr("disabled");
	});
	//不通过弹窗操作
	$(".allreasonBox .closeReasonBox").live('click',function(event){
		$(".allreasonBox").hide();
		$(".allreasonBox .reasonList p").removeClass("on");
		$(".allreasonBox .reasonList .selfReason").val("");
	});
	$(".allreasonBox .reasonList p").live('click',function(event){
		if($(this).hasClass("on")){
			$(this).removeClass("on");
			$(".allreasonBox .reasonList .selfReason").removeAttr("disabled");
		}else{
			$(this).addClass("on").siblings().removeClass("on");
			$(".allreasonBox .reasonList .selfReason").attr("disabled","true");
		}
	});
	$("#post_manage .reasonBox .finish").live('click',function(event){
		var reason="";
		if($("#post_manage .reasonBox .reasonList p.on").text() !="" ){
			reason=$("#post_manage .reasonBox .reasonList p.on").text();
			auditFailFn(reason);
		}else if($.trim($("#post_manage .reasonBox .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#post_manage .reasonBox .reasonList .selfReason").val());
			auditFailFn(reason);
		}else{
			alert("请选择原因!");
		}
		//auditFailFn();
	});
	//删除完成按钮
	$("#post_manage .delReasonBox .finish").live('click',function(event){
		var reason="";
		if($("#post_manage .delReasonBox .reasonList p.on").text() !="" ){
			reason=$("#post_manage .delReasonBox .reasonList p.on").text();
			deletPostFn(reason);
		}else if($.trim($("#post_manage .delReasonBox .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#post_manage .delReasonBox .reasonList .selfReason").val());
			console.log(reason);
			deletPostFn(reason);
		}else{
			alert("请选择原因!");
		}
		//auditFailFn();
	});
	//取消加精完成按钮
	$("#post_manage .cancelDigest .finish").live('click',function(event){
		var reason="";
		if($("#post_manage .cancelDigest .reasonList p.on").text() !="" ){
			reason=$("#post_manage .cancelDigest .reasonList p.on").text();
			addOrCancelDigest(reason);
		}else if($.trim($("#post_manage .cancelDigest .reasonList .selfReason").val()) !=""){
			reason=$.trim($("#post_manage .cancelDigest .reasonList .selfReason").val());
			addOrCancelDigest(reason);
		}else{
			alert("请选择原因!");
		}
		//auditFailFn();
	});
	//预览
	$("#post_manage .lookArtical").live('click',function(event){
		onClickLookPost($(this));
	});
});
   //点击预览
    function onClickLookPost(del) {
        var str ='';
		var ok = del;
        $('.article_preview').remove();
        $('body').append('<div class="article_preview"><div class="preEffect" ><select class="selectSize">' +
            '<option value ="414_736">iPhone 6Plus(宽414px,高736px)</option>' +
            '<option value ="375_667">iPhone 6(宽375px,高667px)</option>' +
            '<option value="320_568">iPhone 5(宽320px,高568px)</option>' +
            '<option value="360_640">Galaxy S5(宽360px,高640px)</option>' +
            '</select><div class="exit-preview">点击退出预览</div>' +
            '<div class="preResult" postId="'+ok.parent().parent().attr('postId')+'" postType="'+ok.parent().parent().attr('postType')+'"></div></div></div>');
		
        //判断是视频还是文章
		if(ok.parent().parent().attr('postType') == 1){//文章
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getArticleDetail/2.5.3',{postId:ok.parent().parent().attr('postId'),postType:1},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$.each( data.data.articles,function(key,val){
						if(val.type == 1){//标题
							$('.preResult').append('<h3>'+val.content+'</h3>');
						}else if(val.type == 2 ){//段落
							$('.preResult').append('<p style=" padding:5px; box-sizing:border-box;">'+val.content+'</p>');
						}else if(val.type == 3){//图片
							$('.preResult').append('<img src="'+val.content+'" style=" width:100%;padding: 5px; box-sizing: border-box;" />');
						}else if(val.type == 4){//标题
							$('.preResult').append('<p style=" text-align:center">'+val.content+'</p>');
						}else if(val.type == 5 ){//段落
							$('.preResult').append('<div class="goodsComodity" contentEditable="false"><div class="postShop postShopa goods clearfix" currentId="' +
            val.comodity.comodityId + '"><div class="shopLeft goods"><img src="' +
            val.comodity.photo + '" class="goodsPhoto goods"></div><div class="shopCenter goods"><p class="goodsName goods">' +
            val.comodity.comodityName + '</p><p class="productprize goods">参考价：<span>¥ <b class="goodsPrize goods">' +
            val.comodity.refPrice + '</b></span></p><p class="recommendation">推荐度：'
            + val.comodity.recommendations + '</p></div><div class="shopRight goods"><p class="zhongcao zhongcao1 goods">长草</p><p class="zhongcaonum goods"><span>0</span>人已采集</p></div></div></div>');
						}else if(val.type == 6){//图片
							$('.preResult').append('<div class="work clearfix" workId="' + val.work.workId + '" contentEditable="false" >' +
            '<div class="work-cover"><image src="' + val.work.cover + '" /></div>' +
            '<div class="work-detail">' +
            '<div class="workName">' + val.work.workName + '</div>' +
            '<div class="cost">￥' +val.work.cost + '</div>' +
            '</div><div class="workCollection"><p class="collection">收藏</p><p class="zhongcaonum"><span>0</span>人已收藏</p></div>' +
            '</div>');
						};
					})
					if($(ok).hasClass("intonggguo")){
						$('.preResult').append('<div class="passBox"><input type="button" value="通过" class="bluebtn1 passPost"><input type="button" value="不通过" class="redbtn1 unPassPost"></div>');
					}
				}else{
					alert(data.data.error);	
				}	
			});				
		};
		if(ok.parent().parent().attr('postType') == 2){//视频
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getVideoDetail/2.5.3',{postId:ok.parent().parent().attr('postId'),postType:2},function(data){
				var data = $.parseJSON(data);
				if(data.code == 0){
					$.each( data.data.articles,function(key,val){
						if(val.type == 1){//标题
							$('.preResult').append('<h3>'+val.content+'</h3>');
						}else if(val.type == 2 ){//段落
							$('.preResult').append('<p style=" padding:5px; box-sizing:border-box;">'+val.content+'</p>');
						}else if(val.type == 3){//图片
							$('.preResult').append('<img src="'+val.content+'" style=" width:100%;padding: 5px; box-sizing: border-box;" />');
						}else if(val.type == 4){//标题
							$('.preResult').append('<p style=" text-align:center">'+val.content+'</p>');
						}else if(val.type == 5 ){//段落
							$('.preResult').append('<div class="goodsComodity" contentEditable="false"><div class="postShop postShopa goods clearfix" currentId="' +
            val.comodity.comodityId + '"><div class="shopLeft goods"><img src="' +
            val.comodity.photo + '" class="goodsPhoto goods"></div><div class="shopCenter goods"><p class="goodsName goods">' +
            val.comodity.comodityName + '</p><p class="productprize goods">参考价：<span>¥ <b class="goodsPrize goods">' +
            val.comodity.refPrice + '</b></span></p><p class="recommendation">推荐度：'
            + val.comodity.recommendations + '</p></div><div class="shopRight goods"><p class="zhongcao zhongcao1 goods">长草</p><p class="zhongcaonum goods"><span>0</span>人已采集</p></div></div></div>');
						}else if(val.type == 6){//图片
							$('.preResult').append('<div class="work clearfix" workId="' + val.work.workId + '" contentEditable="false" >' +
            '<div class="work-cover"><image src="' + val.work.cover + '" /></div>' +
            '<div class="work-detail">' +
            '<div class="workName">' + val.work.workName + '</div>' +
            '<div class="cost">￥' +val.work.cost + '</div>' +
            '</div><div class="workCollection"><p class="collection">收藏</p><p class="zhongcaonum"><span>0</span>人已收藏</p></div>' +
            '</div>');
						};
					})
					if($(ok).hasClass("intonggguo")){
						$('.preResult').append('<div class="passBox"><input type="button" value="通过" class="bluebtn1 passPost"><input type="button" value="不通过" class="redbtn1 unPassPost"></div>');
					}
				}else{
					alert(data.data.error);	
				}	
			});				
		};
        $('.preResult p').attr('contenteditable', false);
        $('body').addClass('no-scroll');
        //改变预览窗口大小
        changePreviewSize();
        //选择不同尺寸预览
       $('.article_preview .selectSize').change(changePreviewSize);
        //隐藏预览
        $('.article_preview .exit-preview').unbind();
        $('.article_preview .exit-preview').click('click', function () {
            $('body').removeClass('no-scroll');
            $('.article_preview').remove();
			$('#post_manage .allreasonBox').hide();
        });
    }
 //改变预览窗口大小
    function changePreviewSize() {
        var width_height = $('.selectSize').val();
        var width = width_height.substring(0, width_height.indexOf('_'));
        var height = width_height.substring(width_height.indexOf('_') + 1, width_height.length);

        $('.preEffect').css({
            'margin-left': (0 - width / 2) + 'px',
            'width': width + 'px',
            'height': height + 'px'
        });

        $('.article_preview .preResult img').css({
            'max-width': width + 'px'
        });
    }
//获取专栏帖子个数
function getColumnTieNum(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getColumnPostNum/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".post_manage_box .post_column").empty();
				var str='';
				str+='<span class="allColumnNum">全部（'+data.data.totalNum+'）</span>';
				$.each(data.data.postNum ,function(key,val){
					str+='<span class="allColumnNum" columnId="'+val.columnId+'">'+val.columnName+'（'+val.postNum+'）</span>';
				})
			    $(".post_manage_box .post_column").append(str);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//获取专栏帖子个数
function getwaitTieNum(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getCheckingPostCount/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {},
		success : function(data){
			if(data.code == 0){
				$(".post_manage_box .wait_review span").text(data.data.postNum);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//审核通过的帖子定义数据
function  getOnlinePostData(columnId,startTime,endTime,postType,isEssential,postId,title,nickName,label,num,page,publishTimeStartTime,publishTimeEndTime,lastEditStartTime,lastEditEndTime){
	var data = new Object();
	data.columnId = columnId;
	data.startTime = startTime;
	data.endTime = endTime;
	data.postType = postType;
	data.isEssential = isEssential;
	data.postId = postId;
	data.title = title;
	data.nickName = nickName;
	data.label = label;
	data.num = num;
	data.page = page;
	data.publishTimeStartTime=publishTimeStartTime;
	data.publishTimeEndTime=publishTimeEndTime;
	data.lastEditStartTime=lastEditStartTime;
	data.lastEditEndTime=lastEditEndTime;
	return data;	
}
//搜索的数据
function onlinePostData(){
		return getOnlinePostData(
		$(".post_manage_box .post_column .on").attr('columnId'),
		$(".post_manage_box .post_search .choose_post_time .pstartTime").val(),
		$(".post_manage_box .post_search .choose_post_time .pendTime").val(),
		$(".post_manage_box .post_search .filter_post_type .on").attr("postType"),
		$(".post_manage_box .post_search .filter_post_cream .on").attr("isEssential"),
		$(".post_manage_box .post_search .advanced_filter .postIdNew").val(),
		$(".post_manage_box .post_search .advanced_filter .postTitle").val(),
		$(".post_manage_box .post_search .advanced_filter .postPublisher").val(),
		$(".post_manage_box .post_search .advanced_filter .postLabel").val(),
		20,1,
		$(".post_manage_box .post_search .advanced_filter .publishStartTime").val(),
		$(".post_manage_box .post_search .advanced_filter .publishEndTime").val(),
		$(".post_manage_box .post_search .advanced_filter .changeStartTime").val(),
		$(".post_manage_box .post_search .advanced_filter .changeEndTime").val()
		)
}
//渲染数据
function postlistdetail(data){
	$('.post_manage_box .postListTabel tr:gt(0)').remove();
	$.each(data.data.pageData,function(key,val){
		var status='';
		var cream='';
		if(val.isEssential == '0'){
			cream='<input type="button" value="加精" class="bluebtn1 changeoriPostCream"  isEssential="0" />';
		}else if(val.isEssential == '1'){
			cream='<input type="button" value="取消加精" class="redbtn1 changeoriPostCream"  isEssential="1" />';
		};
		if(val.status == '1'){
			status='<input type="button" value="上线" class="bluebtn1 changePostStatus"  postId="'+val.postId+'" postType="'+val.postType+'" online="1"/><img src="images/u2187.png" class="lookOutlineReason">';
		}else if(val.status == '2'){
			status='<input type="button" value="下线" class="redbtn1 changePostStatus"  postId="'+val.postId+'" postType="'+val.postType+'" online="0"/>';
		};
		//判断最后编辑者是否为null
		var editSysUser='';
		if(val.editSysUser == null){
			editSysUser='';
		}else{
			editSysUser=val.editSysUser;
		};
		//判断是否是模拟的浏览时
		var viewNum='';
		if(val.initViewNum == 0){
			viewNum='<td class="changeViewNumtd" trueNum="'+val.trueViewNum+'" initNum="'+val.initViewNum+'"><p class="addThisBefore">'+val.trueViewNum+'</p><img src="images/u84.png" class="changeViewNum"></td>';
		}else{
			var allViewNum='';
			allViewNum = parseInt(val.trueViewNum)+parseInt(val.initViewNum);
			viewNum='<td class="changeViewNumtd" trueNum="'+val.trueViewNum+'" initNum="'+val.initViewNum+'"><p class="moni">模拟</p><p class="addThisBefore">'+allViewNum+'</p><img src="images/u84.png" class="changeViewNum"></td>';
		};
		//判断是否是模拟的
		var likeNum='';
		if(val.initPraiseNum == 0){
			likeNum='<td class="changeDianZanNumtd" trueNum="'+val.likeNum+'" initNum="'+val.initPraiseNum+'"><p class="addThisBefore">'+val.likeNum+'</p><img src="images/u84.png" class="changeDianZanNum"></td>';
		}else{
			var allLikeNum='';
			allLikeNum = parseInt(val.likeNum)+parseInt(val.initPraiseNum);
			likeNum='<td class="changeDianZanNumtd" trueNum="'+val.likeNum+'" initNum="'+val.initPraiseNum+'"><p class="moni">模拟</p><p class="addThisBefore">'+allLikeNum+'</p><img src="images/u84.png" class="changeDianZanNum"></td>';
		};
		$('.post_manage_box .postListTabel').append('<tr postType="'+val.postType+'" postId="'+val.postId+'" columnId="'+val.columnId+'" title="'+val.title+'"><td>'+val.postId+'</td><td>'+val.title+'</td>'+viewNum+likeNum+'<td>'+val.commentNum+'<img src="images/u220.png" class="goToCommentPage" utype="'+val.postType+'" cid="'+val.postId+'" ></td><td class="columntype">'+val.columnName+'</td><td class="lookMore"></td><td class="lookMoreHide">'+val.onlineTime+'</td><td class="lookMoreHide">'+val.nickName+'</td><td class="lookMoreHide">'+val.publishTime+'</td><td class="lookMoreHide">'+editSysUser+'</td><td class="lookMoreHide">'+val.editTime+'</td><td>'+cream + status+'</td><td><input type="button" value="查看" class="bluebtn1 lookArtical"  /><input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+val.postType+'" postId="'+val.postId+'" /><input type="button" value="删除" class="redbtn1 postDel"/></td></tr>');
		if($(".postListTabel tr .lookMoreHide").css("display") !="none"){
			$(".postListTabel .lookMore").remove();
			$(".postListTabel .lookMoreHide").show();
		}
	});
}
//根据不同的页码来渲染页面
function onclickpostPageNum(p){
	var data = onlinePostData();
	data.page = p;
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getApprovedPost/3.0.0',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			postlistdetail(data);
		},
	});
}
//获取入参，渲染页面
function postInfo(){
	//获取入参
	var data = onlinePostData();
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getApprovedPost/3.0.0',
		type : 'post',
		dataType : 'json',
		data: data,
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".post_manage_box .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:onclickpostPageNum
			});
			//渲染页面
			postlistdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//待审核的帖子
//渲染数据
function waitPostListdetail(data){
	$('.wait_pass_box .waitPassTabel tr:gt(0)').remove();
	$.each(data.data.pageData,function(key,val){
		$('.wait_pass_box .waitPassTabel').append('<tr postType="'+val.postType+'" postId="'+val.postId+'" title="'+val.title+'"><td><input type="checkbox" class="checkWaitPost"></td><td>'+val.title+'</td><td>'+val.labels+'</td><td>'+val.columnName+'</td><td>'+val.nickName+'</td><td>'+val.publishTime+'</td><td><input type="button" value="查看" class="bluebtn1 lookArtical intonggguo"   /><input type="button" value="编辑" class="bluebtn1 articaldeatiledit" postType="'+val.postType+'" postId="'+val.postId+'" /><input type="button" value="删除" class="redbtn1 column-del"/></td><td><input type="button" value="通过" class="bluebtn1 passPost"/><input type="button" value="不通过" class="redbtn1 unPassPost"/></td></tr>');
	});
}
//根据不同的页码来渲染页面
function waitPostPageNum(p){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getCheckingPost/3.0.0',
		type : 'get',
		dataType : 'json',
		data: {num:20,page:p},
		success : function(data){
			waitPostListdetail(data);
		},
	});
}
	
//获取入参，渲染页面
function WaitPostInfo(){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/getCheckingPost/3.0.0',
		type : 'get',
		dataType : 'json',
		data:  {num:20,page:0},
		success : function(data){
			if(data.code == 0){
			//创建分页
			$(".wait_pass_box .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:waitPostPageNum
			});
			//渲染页面
			waitPostListdetail(data);
			}else{
				alert(data.data.error);
			}
		},
	});
}
//删除帖子
function deletPostFn(reason){
	console.log(reason);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/deletePost/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postType:$(".delThis").parent().parent().attr("postType"),postId:$(".delThis").parent().parent().attr("postId"),reason:reason},
		success : function(data){
			if(data.code == 0){
				$(".delThis").parent().parent().remove();
				$("#post_manage .allreasonBox").hide();
				$("#post_manage .allreasonBox .reasonList p").removeClass("on");
				$("#post_manage .allreasonBox .reasonList .selfReason").val("");
			}else{
				alert(data.data.error);
			}
		},
	});
}
//加精操作
function addOrCancelDigest(reason){
	console.log($(".digestThis").parent().parent().attr("postType"));
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/addOrCancelDigest/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postType:$(".digestThis").parent().parent().attr("postType"),postId:$(".digestThis").parent().parent().attr("postId"),isEssential:$(".digestThis").attr("isEssential"),reason:reason},
		success : function(data){
			if(data.code == 0){
				if($(".digestThis").hasClass("redbtn1")){
					$(".digestThis").removeClass("redbtn1");
					$(".digestThis").val("加精").addClass("bluebtn1");
					$(".digestThis").attr("isEssential","0");
					$("#post_manage .allreasonBox").hide();
					$("#post_manage .allreasonBox .reasonList p").removeClass("on");
					$("#post_manage .allreasonBox .reasonList .selfReason").val("");
				}else{
					$(".digestThis").removeClass("bluebtn1");
					$(".digestThis").addClass("redbtn1");
					$(".digestThis").val("取消加精");
					$(".digestThis").attr("isEssential","1")
				}
			}else{
				alert(data.data.error);
			}
		},
	});
}
//帖子下线
function changePostStatusFn(data){
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/offLinePost/3.0.0',
			type : 'post',
			dataType : 'json',
			data: {postId:$(".post_manage_box .postListTabel .onorottline").attr("postId"),postType:$(".post_manage_box .postListTabel .onorottline").attr("postType"),reason:data},
			success : function(data){
				if(data.code == 0){
					$(".post_manage_box .postListTabel .onorottline").parent().parent().remove();
					$("#post_manage .allreasonBox").hide();
					$("#post_manage .allreasonBox .reasonList p").removeClass("on");
					$("#post_manage .allreasonBox .reasonList .selfReason").val("");
				}else{
					alert(data.data.error);
				}
			},
		});
	
};
//为审核通过的列表上线(审核通过)
function onLinePostFn(params){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/onLinePost/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {params:params},
		success : function(data){
			if(data.code == 0){
				WaitPostInfo();
			}else{
				alert(data.data.error);
			}
		},
	});
}
//审核不通过
function auditFailFn(reason){
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/auditFail/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postId:$(".unPassThis").parent().parent().attr("postId"),postType:$(".unPassThis").parent().parent().attr("postType"),reason:reason},
		success : function(data){
			if(data.code == 0){
				WaitPostInfo();
				$("#post_manage .allreasonBox").hide();
				$("#post_manage .allreasonBox .reasonList p").removeClass("on");
				$("#post_manage .allreasonBox .reasonList .selfReason").val("");
			}else{
				alert(data.data.error);
			}
		},
	});
}
//设置帖子的模拟浏览数
function setupInitViewNum(data){
	var initViewNum=data
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/setupInitViewNum/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postType:$(".post_manage_box .postListTabel .changeThisNum").parent().parent().attr("postType"),postId:$(".post_manage_box .postListTabel .changeThisNum").parent().parent().attr("postId"),initViewNum:initViewNum},
		success : function(data){
			if(data.code == 0){
				if(initViewNum=="0"){
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".addThisBefore").text($(".changeThisNum").parent().attr("trueNum"));
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".moni").remove();
					$(".post_manage_box .postListTabel .changeThisNum").parent().attr("initNum","0");
				}else{
					var vNum="";
					vNum = parseInt(initViewNum)+parseInt($(".changeThisNum").parent().attr("trueNum"));
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".addThisBefore").text(vNum);
					$(".post_manage_box .postListTabel .changeThisNum").parent().attr("initNum",initViewNum);
					if(!$(".post_manage_box .postListTabel .changeThisNum").siblings().hasClass("moni")){
						$(".post_manage_box .postListTabel .changeThisNum").parent().prepend('<p class="moni">模拟</p>');
					}
				}
			}else{
				alert(data.data.error);
			}
		},
	});
}
//设置帖子的模拟喜欢的人数V3.0.0
function setupInitPraiseNum(data){
	var initViewNum=data
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/column/setupInitPraiseNum/3.0.0',
		type : 'post',
		dataType : 'json',
		data: {postType:$(".post_manage_box .postListTabel .changeThisNum").parent().parent().attr("postType"),postId:$(".post_manage_box .postListTabel .changeThisNum").parent().parent().attr("postId"),initPraiseNum:data},
		success : function(data){
			if(data.code == 0){
				if(initViewNum=="0"){
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".addThisBefore").text($(".changeThisNum").parent().attr("trueNum"));
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".moni").remove();
					$(".post_manage_box .postListTabel .changeThisNum").parent().attr("initNum","0");
				}else{
					var vNum="";
					vNum = parseInt(initViewNum)+parseInt($(".changeThisNum").parent().attr("trueNum"));
					$(".post_manage_box .postListTabel .changeThisNum").siblings(".addThisBefore").text(vNum);
					$(".post_manage_box .postListTabel .changeThisNum").parent().attr("initNum",initViewNum);
					if(!$(".post_manage_box .postListTabel .changeThisNum").siblings().hasClass("moni")){
						$(".post_manage_box .postListTabel .changeThisNum").parent().prepend('<p class="moni">模拟</p>');
					}
				}
			}else{
				alert(data.data.error);
			}
		},
	});
}
//获取时间
function getPostTime(data){
	var startTime= Date.parse(new Date())-data;
	var s = new Date(startTime); 
	var year=s.getFullYear();
	var m=parseInt(s.getMonth() + 1);
	if(m<10){
		m="0"+m;
	}
	var day=parseInt(s.getDate());
	if(day<10){
		day="0"+day;
	}
	var hours=parseInt(s.getHours());
	if(hours<10){
		hours="0"+hours;
	}
	var minutes=parseInt(s.getMinutes());
	if(minutes<10){
		minutes="0"+minutes;
	}
	var seconds=parseInt(s.getSeconds());
	if(seconds<10){
		seconds="0"+seconds;
	}
	return year+'-'+m+'-'+day+' '+hours+':'+minutes+':'+seconds;
}