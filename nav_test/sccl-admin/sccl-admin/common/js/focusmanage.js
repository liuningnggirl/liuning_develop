$(function($){
	
	//定义全局变量，记录选中的标题、段落或图片对象。
	var selectedTitle;  //选中的标题
	var selectedParagraph; //选中的段落
	var selectedImage;    //选中的图像
	var selectedVideo;    //选中的视频
	var imageUrl;  //记录文件服务器返回的图片url
	var videoUrl;  //记录文件服务器返回的视频url
	var posterUrl; //视频封面图片url
	
	
	
	$("#m_tabs").tabs();  //初始化标签
	
	//复制元素
	$('#m_tabs .telement').click(function(event) {
		$(this).clone().appendTo($('#showplate'));
	});

	$("#img_cover").live("click",function(){
		selectedImage = $(this);
		 $("#imageurl").hide();
		 $("#m_linkUrl").val($(this).attr("superlink"));
		 if($("#m_linkUrl").val()==''){
			 $("#m_islink").attr("checked",false);
			 $(".mlink").hide();			 
		 }		 
		$('#dialog-image').dialog('open');
		$(".imgCoverHide").hide();
		$("#m_isNotShowInApp").hide();//上传封面图时，隐藏掉

		$('#progress .bar').css( 'width', 0 );
		
		$("#imgcontent").fileupload({
			url: "https://photos.nggirl.com.cn/uploadserver/app/image/uploads/3.0.0",  //app/image/user/work/upload",
			dataType: 'json',
        	done: function (e, data) {				
			  imageUrl=	data.result.data.url;
					                        	
      		 },
		   change: function (e, data) {
      	 	 $.each(data.files, function (index, file) {           
				 $("#imageurl").val(file.name);								 
      	 	 });			
  	 	    },
  	 	   progressall: function (e, data) {
			 var progress = parseInt(data.loaded / data.total * 100, 10);
		     $('#progress .bar').css(
				   'width',
				      progress + '%'
		      );			
           }
    	});	
	});

     //删除元素
	$('#showplate .ele-del').live('click',function(event) {
		event.preventDefault();
		event.stopPropagation();
		$(this).closest('.telement').remove();
	});
	
	//下移元素
	$('#showplate .ele-down').live('click',function(event) {
		event.preventDefault();
		event.stopPropagation();
		var next= $(this).closest('.telement').next();  
		$(this).closest('.telement').insertAfter(next);		
	});
	
	//上移元素
	$('#showplate .ele-up').live('click',function(event) {
		event.preventDefault();
		event.stopPropagation();
		var pre= $(this).closest('.telement').prev();  
		$(this).closest('.telement').insertBefore(pre);		
	});
	
	$("#t_islink").on("change",function(){
		if($("#t_islink").is(":checked")){
			$(".tlink").show();
		}
		else{
			$(".tlink").hide();
		}
		});
	$("#p_islink").on("change",function(){
		if($("#p_islink").is(":checked")){
			$(".plink").show();
			
		}
		else{
			$(".plink").hide();
		}
		});
	$("#m_islink").on("change",function(){
		if($("#m_islink").is(":checked")){
			$(".mlink").show();
			
		}
		else{
			$(".mlink").hide();
		}
		});
	
	
	$("#save").click(function(event){    //保存
		
	   var content=$("#showplate").html().replace(/\s+/g, " "); 	 
	  var coverImage=$("#img_cover").attr("src");
	  var title=$("#title_cover").val();
	  var description=$("#content_cover").val();
	  var id = $("#contentId").val();
	 if(id!=null&&id!=""){
			$('#dialog-updateSave').dialog('open');	
			return;	 
	 }
	   $.post("/nggirl-web/web/admin/focuscontent/add",{title:title,description:description,coverImage:coverImage,content:content},function(data){
		  var j_result=eval('(' + data + ')');
		 if(j_result.code==0)
		 {
			 alert("保存成功！");
		 }
		 else
			  alert("保存失败！");		   
	   });	   
	});
	
	$("#open").click(function(event){  //打开历史焦点图
	     
		  $('#dialog-open').dialog('open');	
	   
		
	});

$("#dialog-open").dialog({
        	autoOpen: false,
			height: 200,
			width: 400,
			modal: true,
			buttons:{
				"确定":function(){
					var contentId=$("#openFocus").val();
					$.get("/nggirl-web/web/admin/focuscontent/getContent",{contentId:contentId},function(data){
						 var jdata = JSON.parse(data);
						var  id= jdata.data.content.id;
						var title=jdata.data.content.title;
						var description=jdata.data.content.description;
						var content =jdata.data.content.content;
						var imgUrl =jdata.data.content.coverImage; 
						$("#title_cover").val(title);
						$("#content_cover").val(description);
						$("#showplate").html(content);
						$("#img_cover").attr("src",imgUrl);
						$("#contentId").val(id);
					});
					
					$( this ).dialog( "close" );
				},
				"取消":function(){
					$( this ).dialog( "close" );
				}
			   },
			close: function() {
			}
	
});


$("#dialog-updateSave").dialog({  //更新前询问
	autoOpen: false,
	height: 200,
	width: 400,
	modal: true,
	buttons:{
		"是的，更新":function(){
			 var content=$("#showplate").html().replace(/\s+/g, " "); 	 
			  var coverImage=$("#img_cover").attr("src");
			  var title=$("#title_cover").val();
			  var description=$("#content_cover").val();
			  var contentId=$("#contentId").val();
			  
			$.post("/nggirl-web/web/admin/focuscontent/update",{id:contentId,title:title,description:description,coverImage:coverImage,content:content},function(data){
				 var j_result=eval('(' + data + ')');
				 if(j_result.code==0)
				 {
					 alert("更新成功！");
				 }
				 else{
					  alert("更新失败！");	
				 }
		});
			$( this ).dialog( "close" );
			
		},
		"不，新建一个":function(){
			 var content=$("#showplate").html().replace(/\s+/g, " "); 	 
			  var coverImage=$("#img_cover").attr("src");
			  var title=$("#title_cover").val();
			  var description=$("#content_cover").val();			  
			$.post("/nggirl-web/web/admin/focuscontent/add",{title:title,description:description,coverImage:coverImage,content:content},function(data){
				 var j_result=eval('(' + data + ')');
				 if(j_result.code==0)
				 {
					 alert("保存成功！");
				 }
				 else{
					  alert("保存失败！");	
				 }
		});
			$( this ).dialog( "close" );
			
			
		},
		"取消":function(){
			$( this ).dialog( "close" );
		}
	   },
	close: function() {
		
	}

});
	//初始化标题对话框
$( "#dialog-title" ).dialog({
			autoOpen: false,
			height: 480,
			width: 450,
			modal: true,
			buttons: {
				"确定": function() {
					var titileContent = selectedTitle.children('.ele-content-text');
					var content = $(this).find('#content').val();  //标题文字
					var size = $(this).find('#t_size').val()+"rem"; //字体大小
					var font = $(this).find('#t_font').val(); //字体
					var color = $(this).find('#t_color').val(); //字体颜色
					var bcolor = $(this).find('#t_bcolor').val(); //背景颜色
					var align = $(this).find('#t_align').val(); //字体对齐方式
					var weight = $(this).find('#t_fontweight').val(); //字体对齐方式		
					var margin_up = $(this).find('#t_space_up').val()+"rem"; //段间上边距		
					var margin_down = $(this).find('#t_space_down').val()+"rem"; //段间下边距
					var margin_left = $(this).find('#t_space_left').val()+"rem"; //段间上边距		
					var margin_right = $(this).find('#t_space_right').val()+"rem"; //段间下边距
					var islink = $(this).find("#t_islink").is(":checked");
					var tUrl = $(this).find("#t_linkUrl").val();
					var isNotShowInApp = $(this).find("#t_isNotShowInApp").is(":checked");//是否在app内不显示
					
					
					var indent="0rem";
					if(isNotShowInApp == true){
						titileContent.addClass("notShowInApp");
					}
								
				    
					//var hcontent="<"+size+">"+content+"</"+size+">";			
					titileContent.text(content);
					if(selectedTitle.children('.ele-content-text').hasClass("m-Title6"))
					{
						titileContent.css({"color":color,"font-family":font,"text-align":align,"font-weight":weight,"margin-bottom":margin_down,"margin-left":margin_left,"margin-right":margin_right,"font-size":size,"margin-top":margin_up,"border-top-color":bcolor,"border-bottom-color":bcolor});
					}
					else
					{
					    titileContent.css({"color":color,"font-family":font,"text-align":align,"font-weight":weight,"margin-bottom":margin_down,"margin-left":margin_left,"margin-right":margin_right,"font-size":size,"margin-top":margin_up,"background-color":bcolor});
					}
					if(islink==true)
					{
				     	selectedTitle.attr("superlink",tUrl);
				}
					$(this).dialog("close");
				},
				"取消": function() {
					$( this ).dialog( "close" );
				}
			},
			close: function() {
				
			}
		});
	
	//弹出编辑标题对话框
	$('#showplate .m-Title').live('click',function(event){	
	  
	    selectedTitle= $(this);	
		
		$('#dialog-title .text').val(selectedTitle.find('.ele-content-text').text());
	    $('#t_font').val(selectedTitle.find('.ele-content-text').css("font-family"));	
	    $('#t_color').val(rgb2hex(selectedTitle.find('.ele-content-text').css("color")));
		$('#t_bcolor').val(rgb2hex(selectedTitle.find('.ele-content-text').css("background-color")));
	    $('#t_align').val(selectedTitle.find('.ele-content-text').css("text-align"));
		 $('#t_fontweight').val(selectedTitle.find('.ele-content-text').css("font-weight"));
		 var w= selectedTitle.find('.ele-content-text').css("font-weight");
		var size = selectedTitle.find('.ele-content-text').css("text-size");
		$("#t_fontweight").val(selectedTitle.find('.ele-content-text').css("font-weight"));
		 var style=  selectedTitle.find('.ele-content-text').attr("style");
		 
		 if(typeof style == 'undefined'){	
		 //初始化的值			
		 $('#t_size').val(selectedTitle.find('.ele-content-text').css("font-size").replace(/[^0-9.]/ig,"")/16); 
		 //获取标题大小
	   $('#t_space_up').val(selectedTitle.find('.ele-content-text').css("margin-top").replace(/[^0-9.]/ig,"")/16);
	    $('#t_space_down').val(selectedTitle.find('.ele-content-text').css("margin-bottom").replace(/[^0-9.]/ig,"")/16);
		 $('#t_space_left').val(selectedTitle.find('.ele-content-text').css("margin-left").replace(/[^0-9.]/ig,"")/16);
	    $('#t_space_right').val(selectedTitle.find('.ele-content-text').css("margin-right").replace(/[^0-9.]/ig,"")/16);		
		}
		else{									 
		     var margin = getmargin(style);
		 //获取标题大
		 $('#t_size').val(getfontsize(style));
	   $('#t_space_up').val(margin[0]);
	    $('#t_space_right').val(margin[1]);
	    $('#t_space_down').val(margin[2]);
		 $('#t_space_left').val(margin[3]);			
		}
		
		if(selectedTitle.children("div").hasClass("m-Title6"))  //是m-Title6的div
		{
			$('#t_bcolor').val(rgb2hex(selectedTitle.find('.ele-content-text').css("border-top")));
		}
	
		
		$("#t_linkUrl").val($(this).attr("superlink"));
		if($("#t_linkUrl").val()==''){
			 $("#t_islink").attr("checked",false);
			 $(".tlink").hide();
			 
		 }		
		$('#dialog-title').dialog('open');	
		   
	});


	//初始化段落对话框
	$( "#dialog-paragraph" ).dialog({
			autoOpen: false,
			height: 600,
			width: 450,
			modal: true,
			buttons: {
				"确定": function() {
					
					var content = $(this).find('#paragraphcontent').val();
					var paragraphContent = selectedParagraph.children('.ele-content-text');	
					var size = $(this).find('#p_size').val()+"rem"; //字体大小
					var font = $(this).find('#p_font').val(); //字体
					var color = $(this).find('#p_color').val(); //字体颜色
					var bcolor = $(this).find('#p_bcolor').val(); //背景颜色
				    var weight = $(this).find('#p_fontweight').val(); //背景颜色				
					var margin_up = $(this).find('#p_space_up').val()+"rem";; //段间上边距		
					var margin_down = $(this).find('#p_space_down').val()+"rem";; //段间下边距
					var margin_left = $(this).find('#p_space_left').val()+"rem";; //段间上边距		
					var margin_right = $(this).find('#p_space_right').val()+"rem";; //段间下边距
					var line_height = $(this).find('#p_space_line').val()+"rem"; //段间下边距
					var indent="0rem";	
					var islink = $(this).find("#p_islink").is(":checked");
					var tUrl = $(this).find("#p_linkUrl").val();
					var isNotShowInApp = $(this).find("#p_isNotShowInApp").is(":checked");//是否在app内不显示
					paragraphContent.text(content);
					//var v= $(this).find("input[name='isindent']").val();
					//var is=$(this).find("#yesIndent[checked]").va;
					var s= $('input:radio[name="isindent"]:checked').val();
					if(isNotShowInApp == true){
						paragraphContent.addClass("notShowInApp")
					}
					if(s=='yes')					
					{
						indent="2rem";						 
					}
					paragraphContent.css({"color":color,"font-family":font,"font-weight":weight,"font-size":size,"margin-bottom":margin_down,"margin-top":margin_up,"margin-left":margin_left,"margin-right":margin_right,"line-height":line_height,"background-color":bcolor,"text-indent":indent});
					if(islink==true)
					{
						//paragraphContent.html("<a>"+paragraphContent.html()+"</a>");
						//paragraphContent.find("a").attr("href",tUrl);
						selectedParagraph.attr("superlink",tUrl);
					}
					$(this).dialog( "close" );
				},
				"取消": function() {
					$(this).dialog( "close" );
				}
			},
			close: function() {
				
			}
		});
	
	
	$('#showplate .m-Paragraph').live('click',function(event){
	  
		selectedParagraph = $(this);
		
		$('#dialog-paragraph').dialog('open');
		$('#dialog-paragraph .text').val(selectedParagraph.find('.ele-content-text').text());
		var pff= selectedParagraph.find('.ele-content-text').css("font-family");
		var pcolor=selectedParagraph.find('.ele-content-text').css("color");
		var pbcolor=selectedParagraph.find('.ele-content-text').css("background-color");
		 $('#p_font').val(selectedParagraph.find('.ele-content-text').css("font-family"));	
	
	   $('#p_color').val(rgb2hex(pcolor));	
	   
	     $('#p_bcolor').val(rgb2hex(pbcolor));	
	    $('#p_align').val(selectedParagraph.find('.ele-content-text').css("text-align"));	
		 var style=  selectedParagraph.find('.ele-content-text').attr("style");
		 if(typeof style == 'undefined'){
			   $('#p_size').val(selectedParagraph.find('.ele-content-text').css("font-size").replace(/[^0-9.]/ig,"")/16);		
			   $('#p_space_up').val(selectedParagraph.find('.ele-content-text').css("margin-top").replace(/[^0-9.]/ig,"")/16);
				$('#p_space_down').val(selectedParagraph.find('.ele-content-text').css("margin-bottom").replace(/[^0-9.]/ig,"")/16);
				 $('#p_space_left').val(selectedParagraph.find('.ele-content-text').css("margin-left").replace(/[^0-9.]/ig,"")/16);
				$('#p_space_right').val(selectedParagraph.find('.ele-content-text').css("margin-right").replace(/[^0-9.]/ig,"")/16);
			 $('#p_space_line').val(selectedParagraph.find('.ele-content-text').css("line-height").replace(/[^0-9.]/ig,"")/16);
		 }
		 else{
			 
			  
			  var margin = getmargin(style);
		 //获取标题大
		    $('#p_size').val(getfontsize(style));			
			 $('#p_space_up').val(margin[0]);
			 $('#p_space_right').val(margin[1]);
			 $('#p_space_down').val(margin[2]);
			 $('#p_space_left').val(margin[3]);	
			  $('#p_space_line').val(getlineheight(style));
			 
		 }
			 
		
		 $("#p_linkUrl").val($(this).attr("superlink"));
		 if($("#p_linkUrl").val()==''){
			 $("#p_islink").attr("checked",false);
			 $(".plink").hide();
			 
		 }	
			
		
	});

	//初始化图片对话框
	$( "#dialog-image" ).dialog({
			autoOpen: false,
			height: 300,
			width: 450,
			modal: true,
			buttons: {
				"确定": function() {
					var islink = $(this).find("#m_islink").is(":checked");
					var tUrl = $(this).find("#m_linkUrl").val();
					var isNotShowInApp = $(this).find("#m_isNotShowInApp").is(":checked");

					if(islink==true)
					{
						selectedImage.attr("superlink",tUrl);
					}
				   if(selectedImage.children('div').hasClass("ele-content-img"))
				   {
					selectedImage.children('.ele-content-img').children('img').attr("data-original",imageUrl);
					$("img.lazy").lazyload({effect : "fadeIn"})//由于更多部分的作品处于隐藏状态，添加threshold后会导致，隐藏的作品提前加载，而没有了渐入效果
					   if(isNotShowInApp == true){
						   selectedImage.children('.ele-content-img').addClass("notShowInApp");
					   }
				   }
				   else 
				    {
			             $("#img_cover").attr("src",imageUrl);
						if(isNotShowInApp == true){
							$("#img_cover").addClass("notShowInApp");
						}
					}
					$( this ).dialog( "close" );
					$(".imgCoverHide").show();
					$("#m_isNotShowInApp").show();
				},
				"取消": function() {
					$( this ).dialog( "close" );
					$(".imgCoverHide").show();
					$("#m_isNotShowInApp").show();
				}
			},
			close: function() {
				
			}
		});





	//弹出编辑图片对话框,上传文件
	$('#showplate .m-Image').live('click',function(event){
		var dialogPicture = $('.ui-dialog-title:contains("图片")').closest('.ui-dialog');
		btnOk = $('.ui-button-text:contains("确定")',dialogPicture).parent();
		btnOk.attr('disabled', 'disabled');
		btnOk.addClass('ui-state-disabled');
		selectedImage = $(this);
		 $("#m_linkUrl").val($(this).attr("superlink"));
		 if($("#m_linkUrl").val()==''){
			 $("#m_islink").attr("checked",false);
			 $(".mlink").hide();
			 
		 }
		 $("#imageurl").hide();
		
		$('#dialog-image').dialog('open');

		$('#progress .bar').css( 'width', 0 );		
		$("#imgcontent").fileupload({
			url: "https://photos.nggirl.com.cn/uploadserver/app/image/uploads/3.0.0",  //app/image/user/work/upload",
			dataType: 'json',
        	done: function (e, data) {				
			 imageUrl=	data.result.data.url;	
			 
			 	var dialogPicture = $('.ui-dialog-title:contains("图片")').closest('.ui-dialog');
			 	var btnOk = $('.ui-button-text:contains("确定")',dialogPicture).parent();
			 	btnOk.removeAttr('disabled');
				btnOk.removeClass('ui-state-disabled');
      		  },
		   change: function (e, data) {
      	 	 $.each(data.files, function (index, file) {
              // alert('Selected file: ' + file.name);
				 $("#imageurl").val(file.name);
				  $("#imageurl").show();
      	 	 });			
  	 	    },
  	 	     progressall: function (e, data) {
				 var progress = parseInt(data.loaded / data.total * 100, 10);
			  $('#progress .bar').css(
  				  'width',
					     progress + '%'
			   );			
	         }
    	});
	});

	//初始化视频对话框
	$( "#dialog-video" ).dialog({
		autoOpen: false,
		height: 400,
		width: 450,
		modal: true,
		buttons: {
			"确定": function() {
				selectedVideo.find('.ele-content-video').find('img').remove();
				var isNotShowInApp = $(this).find("#v_isNotShowInApp").is(":checked");
				var video = '<video controls="controls" width="100%">您的设备不支持视频播放</video>';
				selectedVideo.children('.ele-content-video').append(video);
				selectedVideo.find("video").attr("src",videoUrl);
				selectedVideo.find("video").attr("poster",posterUrl);
				if(isNotShowInApp == true){
					selectedVideo.children('.ele-content-video').addClass("notShowInApp");
				}

				$( this ).dialog( "close" );
			},
			"取消": function() {
				$( this ).dialog( "close" );
			}
		},
		close: function() {
		}
	});

    //弹出编辑视频对话框
	$("#showplate .m-Video").live('click', function () {
		var dialogVideo = $('.ui-dialog-title:contains("视频")').closest('.ui-dialog');
		btnOk = $('.ui-button-text:contains("确定")',dialogVideo).parent();
		btnOk.attr('disabled', 'disabled');
		btnOk.addClass('ui-state-disabled');
		selectedVideo = $(this);
		//$("#videourl").hide();
		//$('#v_progress .bar').css( 'width', 0 );
		$('#dialog-video').dialog('open');
		$("#videoContent").fileupload({
			url: "https://photos.nggirl.com.cn/uploadserver/app/file/upload/3.0.0",
			dataType: 'json',
			done: function (e, data) {
				videoUrl=	data.result.data.url;
				var dialogVideo = $('.ui-dialog-title:contains("视频")').closest('.ui-dialog');
				var btnOk = $('.ui-button-text:contains("确定")',dialogVideo).parent();
				btnOk.removeAttr('disabled');
				btnOk.removeClass('ui-state-disabled');
			},
			change: function (e, data) {
				$.each(data.files, function (index, file) {
					// alert('Selected file: ' + file.name);
					$("#videourl").val(file.name);
					$("#videourl").show();
				});
			},
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#v_progress .bar').css(
					'width',
					progress + '%'
				);
			}
		});
		
		$("#videoPoster").fileupload({
			url: "https://photos.nggirl.com.cn/uploadserver/app/file/upload/3.0.0",
			dataType: 'json',
			done: function (e, data) {
				posterUrl =	data.result.data.url;
				var dialogVideo = $('.ui-dialog-title:contains("视频")').closest('.ui-dialog');
				var btnOk = $('.ui-button-text:contains("确定")',dialogVideo).parent();
				btnOk.removeAttr('disabled');
				btnOk.removeClass('ui-state-disabled');
			},
			change: function (e, data) {
				$.each(data.files, function (index, file) {
					// alert('Selected file: ' + file.name);
					$("#posterurl").val(file.name);
					$("#posterurl").show();
				});
			},
			progressall: function (e, data) {
				var progress = parseInt(data.loaded / data.total * 100, 10);
				$('#v_progress_posterurl .bar').css(
					'width',
					progress + '%'
				);
			}
		});
	});

});



//颜色转换函数（将RGB格式转为十六进制格式）
function zero_fill_hex(num, digits) {
  var s = num.toString(16);
  while (s.length < digits)
    s = "0" + s;
  return s;
}
function rgb2hex(rgb) {

  if (rgb.charAt(0) == '#')
    return rgb;
 
  var ds = rgb.split(/\D+/);
  var decimal = Number(ds[1]) * 65536 + Number(ds[2]) * 256 + Number(ds[3]);
  return "#" + zero_fill_hex(decimal, 6);
}
function getfontsize(str){
    var index = str.indexOf('font-size');	
	return str.substr(index,20).replace(/[^0-9.]/ig,"");	
}
function getlineheight(str){
    var index = str.indexOf('line-height');	
	return str.substr(index,20).replace(/[^0-9.]/ig,"");	
}
function getmargin(str){
	var strArray = new Array();
     var index = str.indexOf('margin');	
	 var start = str.indexOf(':',index);
	 var end = str.indexOf(';',start);
	 var margin = str.substr(start+2,end-start-1);
	 strArray = margin.split(" ");
	 for(var i=0;i<strArray.length;i++){
		 strArray[i]=strArray[i].replace(/[^0-9.]/ig,"");		 
	 }
	 if(strArray.length==1){
		 strArray[3]=strArray[2]=strArray[1]=strArray[0];
	 }
	 if(strArray.length==2){
		 strArray[2]=strArray[0];
		 strArray[3]=strArray[1];
	 }
	 if(strArray.length==3){		
		 strArray[3]=strArray[1];
	 }
	 return strArray;
	
}
