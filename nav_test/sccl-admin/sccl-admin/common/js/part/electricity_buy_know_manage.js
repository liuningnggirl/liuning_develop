var testUrl = 'https://testcli.nggirl.com.cn';
$(function(){
	getOptionalLabelAndBuyerReading();
	//添加购买须知图片
	$('.electricity_buy_know_manage .beforeBuy .buyKnowFile').live('click',function(){
		$(".changThis").removeClass("changThis");
		$(this).siblings("img.buy_file_img").addClass("changThis");
		$('.electricity_buy_know_manage .beforeBuy .buy_file').click();
	});
	//添加购买须知图片
	$('.electricity_buy_know_manage .beforeBuy .buy_file').fileupload({
		dataType: 'json',
		done: function (e, data) {
			if(data.result.code == 0){
				$(".changThis").attr('src',data.result.data.url);
			}else{
				alert(data.data.error);	
			}
		}
	});
	
	//购买须知添加模块
	$('.electricity_buy_know_manage  .beforeBuy .addBuyKnow').live("click",function(){
		console.log(1);
		var str='';
		str='<div class="buyKnow"><label>标签图标：</label><input type="text" class="buyKnowDesc" maxlength="8" value=""><label class="buyKnowFile show">选取文件</label><img src="" class="buy_file_img"><button class="buyKnow_ideti_myselfti buyKnow_there_common">保存</button><button class="buyKnow_remove_myselfti buyKnow_there_common">删除</button></div>';
        $(this).parent().append(str);
	});

/*添加购物须知方案*/
$(".add_buy_need_know_they").live('click',function(){
	var str='';
		str+='<div class="duanluo_div_haalo"><div class="duanluo_div_haalo_div"><span class="edit_wenan_know">保存</span><span style="color: red;margin-left:10px;" class="duanluo_div_haalo_remove">删除</span></div><div class=" editor_content editor_contents"></div>'
	
		$(".store_div_buyknow").append(str)
	//初始化编辑器
		needKnowDetail();
		
	})
/*删除某个购物须知标签V3.1.0*/
	$(".buyKnow_remove_myselfti").live('click',function(){
		var r=confirm("确定删除？");
		var del=$(this);
		if(r == true){
		var labelid=$(this).attr('labelid');
		$.post(testUrl+"/nggirl-web/web/admin/item/deleteLabel/3.1.0",{labelId:labelid},function(data){
			var data=$.parseJSON(data)
			
			if(data.code !=0){
				alert(data.data.error);
			}else{
				del.parent().remove()
			}
		})
		}
	})
/*保存某个购物须知标签*/
	$(".buyKnow_ideti_myselfti").live('click',function(){
		if($(this).html()=="编辑"){
			$(this).siblings(".buyKnowFile").css("display","block")
			$(this).html("保存")
			$(this).siblings(".buyKnowDesc").removeAttr("disabled")
		}else if($(this).html()=="保存"){
			if($(this).siblings(".buyKnowDesc").val() == ""){
				alert("请输入题目");
			}else if($(this).siblings(".buy_file_img").attr("src") == ""){
				alert("请选择图标");
			}else{
			$(this).siblings(".buyKnowFile").css("display","none")
			$(this).html("编辑")
			$(this).siblings(".buyKnowDesc").attr("disabled","disabled")
			var labelid=$(this).attr('labelid');
			var shortWord=$(this).siblings(".buyKnowDesc").val();
			var imgUrl=$(this).siblings("img").attr("src");
			$.post(testUrl+"/nggirl-web/web/admin/item/savaLabel/3.1.0",{labelId:labelid,shortWord:shortWord,imgUrl:imgUrl},function(data){
				console.log("保存某个购物须知标签")
				getOptionalLabelAndBuyerReading();
			})
			}
		}
		
	})
/*删除某个购物须知模板*/
	$(".duanluo_div_haalo_remove").live('click',function(){
		var templateId=$(this).attr('templateId');
		var del=$(this)
		var r=confirm("确定删除？");
		if(r == true){
		$.post(testUrl+"/nggirl-web/web/admin/item/deleteBuyerReading/3.1.0",{templateId:templateId},function(data){
			del.parent().parent().remove();
		})
		}
	})
/*编辑购买文案须知*/
	$(".edit_wenan_know").live('click',function(){
		var templateId=$(this).attr("templateid");
		var index=$(this).attr('index')
		var detail=new Object();
		var del=$(this);
		if($(this).html()=="编辑"){
			$(this).html("保存")
			$(this).parent().siblings(".editor_content").children().css("background","#fff")
			$(this).parent().siblings(".editor_content").children().children().attr("contenteditable","true");
		   $(this).parent().siblings(".editor_content").children().attr("contenteditable","true");

		}else if($(this).html()=="保存"){
			$(this).html("编辑")
			var usnouny = $(this).parent().siblings(".editor_content").getArticleEditorData();
			if($.type(usnouny) != 'array'){
				alert(usnouny);
				return;
			}
			var usnounys = JSON.stringify(usnouny);
			/*调保存文档编辑接口*/
			$.post(testUrl+"/nggirl-web/web/admin/item/saveBuyerReading/3.1.0",{templateId:templateId,detail:usnounys},function(data){
				getOptionalLabelAndBuyerReading();
			})	
		}
	})
});
/*获取可选标签和购物须知*/
function getOptionalLabelAndBuyerReading(){
	$.get(testUrl+"/nggirl-web/web/admin/item/getOptionalLabelAndBuyerReading/3.1.0",function(data){
		$(".beforeBuy .buyKnow,.esg_box_one_import .store_div_buyknow .duanluo_div_haalo").remove();
		var data=$.parseJSON(data)
		var itemLables=data.data.itemLables;
		
		for(var i =0;i<itemLables.length;i++){
			$(".beforeBuy").append('<div class="buyKnow" labelId="'+itemLables[i].labelId+'"><label>标签图标：</label><input type="text" class="buyKnowDesc" disabled="false" maxlength="8" value="'+itemLables[i].shortWord+'"><label class="buyKnowFile">选取文件</label><img src="'+itemLables[i].imgUrl+'" class="buy_file_img"><button class="buyKnow_ideti_myselfti buyKnow_there_common" labelId="'+itemLables[i].labelId+'">编辑</button><button class="buyKnow_remove_myselfti buyKnow_there_common" labelId="'+itemLables[i].labelId+'">删除</button></div>'
			)
		}
		var buyerReading=data.data.buyerReading;
		var sstring=String();
		for(var i=0;i<buyerReading.length;i++){
			
			sstring+='<div class="duanluo_div_haalo"><div class="duanluo_div_haalo_div"><span class="edit_wenan_know" templateId="'+buyerReading[i].templateId+'" index="'+i+'">编辑</span><span style="color: red;margin-left:10px;" class="duanluo_div_haalo_remove" templateId="'+buyerReading[i].templateId+'">删除</span></div>'
			sstring+='<div class=" editor_content editor_content'+i+'">';
			sstring+='</div></div>'	
		}
		
		$(".esg_box_one_import .store_div_buyknow").append(sstring)
		
		for(var i=0;i<buyerReading.length;i++){
			
			needKnowDetail1(buyerReading.length,buyerReading)
		}
		$(".electricity_buy_know_manage .editor_content").children().children().attr("contenteditable","false");
		$(".electricity_buy_know_manage .editor_content").children().attr("contenteditable","false");
		$(".electricity_buy_know_manage .editor_content").children().css("background","#dcdcdc")
	})
}

//初始化购买须知
	function needKnowDetail(){
			$('.editor_contents').createArticleEditor({
				elements: ['paragraph'],
				data:[{type:2,content:''}],//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
	};
	function needKnowDetail1(del,buyerReading){
		console.log(buyerReading);
		for(var i=0;i<del;i++){
			$('.editor_content'+i+'').createArticleEditor({
				elements: ['paragraph'],
				data:buyerReading[i].detail,//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
		}
	};
	


