$(function(){
	$(".choice_goods_picture_more .editImg").live("click",function(){
		$(".editThisImgOn").removeClass("editThisImgOn");
		$(this).siblings(".needEditImg").addClass("editThisImgOn");
		$(".now_goChoice_picture_change_second").click();
	})
	$(".shopMang").live("click",function(){
		$(".electricity_father_zong").show().siblings().hide();
		comming_write();
	})
	$(".input_select_value").live('change',function(event){
	 	var str='';
	 	var this_value=$(this).val()
	 	
        if($(this).val() != ""){
        	$.ajax({
                url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionBrandList/3.1.0',
                type : 'get',
                dataType : 'json',
                data: {brandName:this_value},
                success : function(data){
	                	console.log(data)
	                	$(".three_input_common_div").html("")
	                    $(".three_input_common_div").css("display","block");
	                    for(var i= 0; i<data.data.length; i++){
	                       str+='<li id='+data.data[i].id+'>'+data.data[i].brandName+'</li>'
	                    };
	                    $(".three_input_common_div").html(str)
	                    $(".three_input_common_div li").live('click',function(){
	                    	$(".input_select_value").val($(this).html())
	                    	$(".input_select_value").attr("id",$(this).attr("id"))
	                    	$(".three_input_common_div").css("display","none")
	                    })
                	
                	
	                },
			});
        }else{
        	$(".three_input_common_div").html("")
        	$(".three_input_common_div").css("display","none")
        }
    });
	//选择一个虚拟用户
	$('.increase_virtual_user .increase_user_list li').live('click',function(e) {
        $('.increase_virtual_user .Fill_choice_virtual_user').val($(this).children('span').html()).attr('userId',$(this).attr('userId'));
		$('.increase_virtual_user .increase_user_list').hide();
    });
	//虚拟用户列表
	$('.increase_virtual_user .Fill_choice_virtual_user').live("click",function(e) {
		$('.increase_virtual_user .increase_user_list').children('li').remove();
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/post/listAddWaterUser/3.0.2',{nickName:$('.add_new_ping_lun .add_ping_lun_user_xuni_name').val()},function(data){
			var data = $.parseJSON(data);
			if(data.code == 0){
			  $('.increase_virtual_user .increase_user_list').show();
			  for(var x = 0; x< data.data.length; x ++){
				  $('.increase_virtual_user .increase_user_list').append('<li userId='+data.data[x].userId+'><img src="'+data.data[x].profile+'" alt="" style="width:30px; height:30px; padding:10px; vertical-align:middle;"><span style="vertical-align:middle;">'+data.data[x].nickName+'</span></li>');
			  }	
			}else{
				alert(data.data.error);	
			}	
		});				
    });
	$(".img_increase_informatiion").live('click',function(){
			$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
				var data=$.parseJSON(data)
				var str='<li class="goods_canshu_information_zong_child_one"><select class="goods_canshu_information_seelect_one">'
				for(var i=0;i<data.data.length;i++){
							str+='<option keyId="'+data.data[i].keyId+'">'+data.data[i].name+'</option>'
				} 
				str+='</select><select class="goods_canshu_information_seelect_two">'
				for(var j=0;j<data.data[0].values.length;j++){
					str+='<option keyId="'+data.data[0].values[j].valueId+'">'+data.data[0].values[j].value+'</option>'
				}
				str+='</select><span><img class="goods_canshu_information_img" src="./images/ele-del.png"></span></li>'
				$(".goods_canshu_information_zong_child").append(str)
				})
			
		})
	$("#judge_goods_shopping_four").live('click',function(){
		$(".judge_goods_shopping_days").attr("value",0)
		$(".judge_goods_shopping_days").val(0)
		$(".judge_goods_shopping_days").attr("disabled",true)
	})
	$("#judge_goods_shopping_three").live('click',function(){
		$(".judge_goods_shopping_days").attr("value",7)
		$(".judge_goods_shopping_days").val(7)
		$(".judge_goods_shopping_days").attr("disabled",false)
	})
	$(".store_information_now").live('click',function(){

		/*获取商品小图*/
		/*if(kkkkkkkkkk==1){
			var imgUrl=$('.div_three_common_oh_jia').children().eq(2).attr("src")
		}else{*/
			var imgUrl=$(".choice_goods_picture_more_first_controlpic").children().eq(1).attr('src')
		/*}*/
		/*获取轮播图数组*/
		var headImgs="[";
		var children_img=$(".choice_goods_picture_more_last_choicePic").children()
		
		for(var i=0;i<children_img.length;i++){
			var img = new Image();
			img.src =$(children_img).eq(i).children().eq(2).attr("src");
			var w = $(children_img).eq(i).children().eq(2).attr("width");
			var h = $(children_img).eq(i).children().eq(2).attr("height");
			headImgs+='{"url":"'+$(children_img).eq(i).children().eq(2).attr("src")+'","width":'+w+',"height":'+h+'},'
		}
		var salePrice=$(".goods_yingxiao_case_three").val()
		headImgs=headImgs.substring(0,headImgs.length-1)	
		headImgs+="]"
		/*获取规格*/
		var standard=null;
		if($(".choice_goods_guige_select_one").html()=="单品"){
			standard=1;
		}else if($(".choice_goods_guige_select_one").html="套装"){
			standard=2;
		}
		
		/*获取商品主标题*/
		var mainTitle=$(".goods_yingxiao_case_one").val();
		var reamTitle=$(".goods_yingxiao_case_two").val();
		/*获取推荐度（数字以二的倍数算星）*/
		var recommendation=$(".choice_goods_guige_tuijiandu").val();
		if(recommendation=="" || recommendation==undefined || recommendation==null){
			recommendation=0
		}
		/*售后期限*/
		var serviceTerm=$(".judge_goods_shopping_days").val();
		/*获取例如瓶/个*/
		var unit=$(".choice_goods_guige_select_two option:selected").text()
	
		/*获取是否可以购买 0-否  1-是*/
		var isBuy=null;
		if($("#judge_goods_shopping_one").attr("checked")){
			isBuy=1
		}else if($("#judge_goods_shopping_two").attr("checked")){
			isBuy=0
		}
		/*获取可不可以售后 0-否 1-是*/
		var isService=null;
		if($("#judge_goods_shopping_three").attr("checked")){
			isService=1
		}else if($("#judge_goods_shopping_four").attr("checked")){
			isService=0
		}
		
		var brandId=$(".input_select_value").attr("id")

	
		var itemDetail1 = $(".title_duanluo_picture .editor_content").getArticleEditorData();
			if($.type(itemDetail1) != 'array'){
				alert(itemDetail1);
				return;
			}
			var itemDetail = JSON.stringify(itemDetail1);
		var newcre_categoryid_new=$(".lujing_gooods_choice").attr("id")
		
		$.post('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/addOrUpdateItem/3.1.0',{itemId:itmeid,categoryId:newcre_categoryid_new,brandId:brandId,mainTitle:mainTitle,salePrice:salePrice,reamTitle:reamTitle,imgUrl:imgUrl,headImgs:headImgs,standard:standard,unit:unit,recommendation:recommendation,isBuy:isBuy,isService:isService,serviceTerm:serviceTerm,itemDetail:itemDetail},function(data){
			var data=$.parseJSON(data)
			if(data.code==0){
				
				$(".electricity_father_zong").show().siblings().hide();
				alert("保存成功")
				//All_cancel_Fn();
				comming_write();
			}else if(data.code==1){
				alert(data.data.error)
				/*$(".electricity_father_zong").show().siblings().hide();
				All_cancel_Fn();
				comming_write();*/
			}
		})
	})
	
	$(".goods_canshu_information_img").live('click',function(){
		$(this).parent().parent().remove()
	})
		$(".store_goods_informatiion").live('click',function(){
			var itemId=itmeid;
			var properties='['
			var douniuo=$(".goods_canshu_information_zong_child li")
			for(var i=0;i<douniuo.length;i++){
				properties+='{"keyName":"'+$(douniuo[i]).children().eq(0).val()+'","value":"'+$(douniuo[i]).children().eq(1).val()+'"},'
			}
			properties=properties.substring(0,properties.length-1)
			properties+=']'
			$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveItemProperties/3.1.0",{itemId:itemId,properties:properties},function(data){
				var data=$.parseJSON(data)
				console.log(data)
				if(data.code==0){
					alert("保存成功")
				}
			})
		})

	var ses=new LocalStorageDeque('shop_evaluate_store');
	//评价页跳转指定页面按钮
	$('#shope_evaluate_manage .allShopComments .goto_page_box .goto_page_btn').click(function(){
		if($("#shope_evaluate_manage .allShopComments .goto_page_box .goto_redirect_page_num").val() > $(".allShopComments .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			$(".allShopComments").attr("page",$(".allShopComments .goto_page_box .goto_redirect_page_num").val());
			getItemComments();
		}
	});
//特定评价页跳转指定页面按钮
	$('#shope_evaluate_manage .singleShopComments .goto_page_box .goto_page_btn').click(function(){
		if($("#shope_evaluate_manage .singleShopComments .goto_page_box .goto_redirect_page_num").val() > $(".singleShopComments .goto_page_box").attr("totnum")){
			alert("没有此页");
		}else{
			$(".singleShopComments").attr("page",$(".singleShopComments .goto_page_box .goto_redirect_page_num").val());
			getOrderComments();
		}
	});
//种草帖子跳转指定页面按钮
	$('#electricity_supplier_goods_manage .abouting_goods_Posts_children_two .goto_page_box .goto_page_btn').click(function(){
		if($("#electricity_supplier_goods_manage .abouting_goods_Posts_children_two .goto_page_box .goto_redirect_page_num").val() > $(".electricity_supplier_goods_manage .abouting_goods_Posts_children_two").attr("totnum")){
			alert("没有此页");
		}else{
			$(".abouting_goods_Posts_children_two").attr("page",$(".singleShopComments .goto_page_box .goto_redirect_page_num").val());
			getSeedingPostDetail();
		}
	});
	/*点击商品分类获取多级列表*/
	$('.input_focus_click').live("focus",function(){
		var that=this;
		console.log(1)
		$(".goods_management_focus_click_chilComn_one").html("")
		$(".goods_management_focus_click_chilComn_two").html("")
		$(".goods_management_focus_click_chilComn_three").html("")
		$(".goods_management_focus_click_input").children().eq(0).val("")
		$(".goods_management_focus_click_input").children().eq(1).val("")
		$(".goods_management_focus_click_input").children().eq(2).val("")
		$(".goods_management_focus_click").css("display",'block')
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemCategories/3.1.0',function(data){
			var data=$.parseJSON(data);
			if(data.code==0){
				console.log(data)
				for(var i=0;i<data.data.length;i++){
					$('.goods_management_focus_click_chilComn_one').append('<li isLeaf="'+data.data[i].isLeaf+'" classid="'+data.data[i].id+'" index="'+i+'"><p>'+data.data[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
				}
				
				$(".goods_management_focus_click_chilComn_one").on('click','li',function(){
					$(".goods_management_focus_click_chilComn_three").html("")
					$(".goods_management_focus_click_chilComn_four").html("")
					$(".goods_management_focus_click_chilComn_five").html("")
					$(".goods_management_focus_click_chilComn_six").html("")
					var value_one=$(this).children().eq(0).html();
					$(".goods_management_focus_click_chilComn_two").html("")
					$(this).children().eq(1).css('display','block');
					$(this).siblings().children().eq(1).css('display','none')
					$('.goods_management_focus_click_input').children().eq(0).val($(this).children().eq(0).html())
					console.log($(this).children().eq(0).html())
					$('.goods_management_focus_click_t').live('click',function(){
								$(".input_focus_click").val(value_one)
					})
					var this_index=$(this).attr('index');
					var isLeaf=$(this).attr('isLeaf');
					if(isLeaf==0){
						console.log(data.data[this_index].children)
						for(var i=0;i<data.data[this_index].children.length;i++){
							$('.goods_management_focus_click_chilComn_two').append('<li isLeaf="'+data.data[this_index].children[i].isLeaf+'" classid="'+data.data[this_index].children[i].id+'" index="'+i+'"><p>'+data.data[this_index].children[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
						}
						
							$(".input_focus_click").val("")
							$(".input_focus_click").val($(this).children().eq(0).html())
						
						/*三级列表*/
						$(".goods_management_focus_click_chilComn_two").on('click','li',function(){
							var value_two=$(this).children().eq(0).html();
							$(".goods_management_focus_click_chilComn_three").html("")
							$(this).children().eq(1).css('display','block');
							$(this).siblings().children().eq(1).css('display','none')
							$('.goods_management_focus_click_input').children().eq(1).val($(this).children().eq(0).html())
							console.log($(this).children().eq(0).html())
							$('.goods_management_focus_click_t').live('click',function(){
								$(".input_focus_click").val(value_two)
							})
							var that_index=$(this).attr('index');
							var isLeaf=$(this).attr('isLeaf');
							if(isLeaf==0){
								
								for(var i=0;i<data.data[this_index].children[that_index].children.length;i++){
									$('.goods_management_focus_click_chilComn_three').append('<li isLeaf="'+data.data[this_index].children[that_index].children[i].isLeaf+'" classid="'+data.data[this_index].children[that_index].children[i].id+'" index="'+i+'"><p>'+data.data[this_index].children[that_index].children[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
								}
							
								$(".input_focus_click").val("")
								$(".input_focus_click").val($(this).children().eq(0).html())
								/*四级*/
								$(".goods_management_focus_click_chilComn_three").on('click','li',function(){
									var value_three=$(this).children().eq(0).html();
									$(".goods_management_focus_click_chilComn_four").html("")
									$(this).children().eq(1).css('display','block');
									$(this).siblings().children().eq(1).css('display','none')
									$('.goods_management_focus_click_input').children().eq(1).val($(this).children().eq(0).html())
									$('.goods_management_focus_click_t').live('click',function(){
										$(".input_focus_click").val(value_three)
									})
									var thatt_index=$(this).attr('index');
									var isLeaf=$(this).attr('isLeaf');
									if(isLeaf==0){
										for(var i=0;i<data.data[this_index].children[that_index].children[thatt_index].children.length;i++){
											$('.goods_management_focus_click_chilComn_four').append('<li isLeaf="'+data.data[this_index].children[that_index].children[thatt_index].children[i].isLeaf+'" classid="'+data.data[this_index].children[that_index].children[thatt_index].children[i].id+'" index="'+i+'"><p>'+data.data[this_index].children[that_index].children[thatt_index].children[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
										}
											$(".input_focus_click").val("")
											$(".input_focus_click").val($(this).children().eq(0).html())

											$(".goods_management_focus_click_chilComn_four").on('click','li',function(){
											var value_four=$(this).children().eq(0).html();
											$(".goods_management_focus_click_chilComn_five").html("")
											$(this).children().eq(1).css('display','block');
											$(this).siblings().children().eq(1).css('display','none')

												$('.goods_management_focus_click_input').children().eq(1).val($(this).children().eq(0).html())
												$('.goods_management_focus_click_t').live('click',function(){
													$(".input_focus_click").val(value_four)
												})
												var thattt_index=$(this).attr('index');
												var isLeaf=$(this).attr('isLeaf');
												if(isLeaf==0){
													for(var i=0;i<data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children.length;i++){
														$('.goods_management_focus_click_chilComn_five').append('<li isLeaf="'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[i].isLeaf+'" classid="'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[i].id+'" index="'+i+'"><p>'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
													}
													$(".input_focus_click").val("")
													$(".input_focus_click").val($(this).children().eq(0).html())

													$(".goods_management_focus_click_chilComn_five").on('click','li',function(){
													var value_five=$(this).children().eq(0).html();
													$(".goods_management_focus_click_chilComn_six").html("")
													$(this).children().eq(1).css('display','block');
													$(this).siblings().children().eq(1).css('display','none')

														$('.goods_management_focus_click_input').children().eq(1).val($(this).children().eq(0).html())
														$('.goods_management_focus_click_t').live('click',function(){
															$(".input_focus_click").val(value_five)
														})
														var thatttt_index=$(this).attr('index');
														var isLeaf=$(this).attr('isLeaf');
														if(isLeaf==0){
															for(var i=0;i<data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[thatttt_index].children.length;i++){
																$('.goods_management_focus_click_chilComn_five').append('<li isLeaf="'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[thatttt_index].children[i].isLeaf+'" classid="'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[thatttt_index].children[i].id+'" index="'+i+'"><p>'+data.data[this_index].children[that_index].children[thatt_index].children[thattt_index].children[thatttt_index].children[i].name+'</p><span><img style="display:none" src="./images/duihao.png"></span></li>')
															}
															$(".input_focus_click").val("")
															$(".input_focus_click").val($(this).children().eq(0).html())

														}else{
															$(".input_focus_click").val($(this).children().eq(0).html())
														}
													})
												}else{
													$(".input_focus_click").val($(this).children().eq(0).html())
												}
											})
									}else{
										$(".input_focus_click").val($(this).children().eq(0).html())
									}
								})
							}else{
								alert('无分支')
							}
						})

						$('.goods_management_focus_click_chilComn_three').on('click','li',function(){
							
							var choice_value=$(this).children().eq(0).html();
							$('.goods_management_focus_click_input').children().eq(2).val(choice_value)

								$(".input_focus_click").val("")
								$(".input_focus_click").val($(this).children().eq(0).html())
							
						})
						/*点击"确定"将数据放到input标签中*/

					}else{
						alert('无分支')
					}
				})
			}
		})
/*点击确定按钮*/
		$(".goods_management_focus_click_t").live('click',function(){
			$(".goods_management_focus_click").css('display','none')
		})
/*点击取消按钮*/
		$(".goods_management_focus_click_f").live("click",function(){
			$(".goods_management_focus_click_input input").val("");
			$(".goods_management_focus_click_chilComn").html("");
			$(".goods_management_focus_click").css('display','none')
			$(".input_focus_click").val("")
		})
	})
	$('.allShopComments .management_controller_checkout').click(function(){
		if($(this).attr('checked')=='checked'){
			$('.allShopComments .management_Summary_comment_checkbox').attr('checked','checked')
		}else{
			$('.allShopComments .management_Summary_comment_checkbox').removeAttr('checked')
		}
	})
	$('.singleShopComments .management_controller_checkout').click(function(){
		if($(this).attr('checked')=='checked'){
			$('.singleShopComments .management_Summary_comment_checkbox').attr('checked','checked')
		}else{
			$('.singleShopComments .management_Summary_comment_checkbox').removeAttr('checked')
		}
	})
	//搜索
	$('.start_search_now').live("click",function(){
		comming_write();
	})
	//取消搜索
	$('.All_cancel_search').live("click",function(){
		All_cancel_Fn();
		comming_write();
	})
	
	
	$(".goods_newCrease_edit").css("display",'none')


	/*主页模糊查询*/
	$(".shope_evaluate_manage .allShopComments .my_search_first").live("click",function(){
		getItemComments();
	})
	//评论取消全部
	$(".shope_evaluate_manage .allShopComments .all_cancel").live("click",function(){
		clearComments();
		getItemComments();
	})
	/*某一评价页模糊查询*/
	$(".shope_evaluate_manage .singleShopComments .my_search_first").live("click",function(){
		$(".singleShopComments").removeAttr("page");
		getOrderComments();
	})
	//评论取消全部
	$(".shope_evaluate_manage .singleShopComments .all_cancel").live("click",function(){
		$(".singleShopComments").removeAttr("page");
		clearSingleComments();
		getOrderComments();
	})
	/*评价的搜索功能*/
	/*$(".my_search_first").live('click',function(){
		var isComment=null;
		if($(this).parent().children().eq(0).val()=="待评价"){
			isComment=0
		}else if($(this).parent().children().eq(0).val()=="已评价"){
			isComment=1
		}
		var publicTimeSign=1;
		var lineStatus=null;
		if($(this).parent().children().eq(1).val()=="待审核"){
			lineStatus=0
		}else if($(this).parent().children().eq(1).val()=="审核通过"){
			lineStatus=1;
		}else if($(this).parent().children().eq(1).val()=="审核不通过"){
			lineStatus=2
		}
		var nickName=$(this).parent().children().eq(2).val();
		var itemName=$(this).parent().children().eq(3).val();
		var beginBrandTime=$(this).parent().children().eq(4).val();
		var endBrandTime=$(this).parent().children().eq(5).val();
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getSingleItemComments/3.1.0",{itemId:itemId_search,isComment:isComment,publicTimeSign:publicTimeSign,lineStatus:lineStatus,nickName:nickName,itemName:itemName,beginBrandTime:beginBrandTime,endBrandTime:endBrandTime})
		var data=$.parseJSON(data)
		console.log(data)
	})*/
	/*评论上下线*/
	$('.management_controller_shangxian').live('click',function(){
		var commentId='';
		$(".management_Summary_comment_checkbox").each(function(index, element) {
			if($(this).attr('checked')=='checked'){
				commentId += $(this).parent().parent().attr('classid')+',';
			}
        })
		var commentIds=commentId.substring(0,commentId.length-1)
		var onOrDownLine=1;
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/itemOnlineOrDownline/3.1.0",{commentIds:commentIds,onOrDownLine:onOrDownLine},function(data){
			var data=$.parseJSON(data)
			if(data.code !=0){
				alert(data.data.error);
			}else{
				getItemComments()
				getOrderComments()
			}
		})
	})
	$(".management_controller_xiaxian").live('click',function(){
		var commentId='';
		$(".management_Summary_comment_checkbox").each(function(index, element) {
            if($(this).attr('checked')=='checked'){
				commentId += $(this).parent().parent().attr('classid')+',';
			}
        })
		var commentIds=commentId.substring(0,commentId.length-1)
		var onOrDownLine=2;
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/itemOnlineOrDownline/3.1.0",{commentIds:commentIds,onOrDownLine:onOrDownLine},function(data){
			var data=$.parseJSON(data)
			if(data.code !=0){
				alert(data.data.error);
			}else{
				getItemComments()
				getOrderComments()
			}
		})
	})
	/*删除商品评论*/
	/*$(".click_remove").live('click',function(){
		var commentId=$(this).parent().parent().attr("classid");
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/deleteComment/3.1.0",{commentId:commentId},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			if(data.code !=0){
				alert(data.data.error);
			}else{
				getItemComments()
			}
		})
	})*/
	
	/*删除商家回复*/
	$(".management_remove").live("click",function(){
		var del=$(this);
		var replyId=$(this).parent().attr("replyid");
		var r=confirm("确定删除？");
		if(r == true){
			$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/deleteReply/3.1.0",{replyId:replyId},function(data){
				var data=$.parseJSON(data);
				if(data.code !=0){
						alert(data.data.error);
					}else{
						getItemComments();
						getOrderComments()
					}
			})
		}
	})

	
	/*获取商品详情(商品编辑)*/
	$(".goods_shaling_information_sku_button").live('click',function(){
			$(".goods_shaling_information_sku_chilr").append('<div class="shaling_sku_information_one" specid="0"><div class="shaling_sku_information_one_shang"><input type="text" placeholder="请输入商品属性(例如:颜色)" name=""><button class="shaling_sku_information_button_one">保存</button><button class="shaling_sku_information_button_two">删除商品属性</button></div><div class="shaling_sku_information_one_xia"></div><span style="display:inline-block" class="newCrease_goods">新增</span>')
			
	})
	$(".newCrease_goods").live('click',function(){
		$(this).prev().append('<span class="shaling_sku_information_one_xia_dingwei" valueId="0"><input type="checkbox" disabled="true"><input type="text" class="clickt_change_diaabled"  style="width:60px;" value=""/><img class="shaling_sku_img_one" src="./images/remove_one.png" alt="" /></span>')
	});
	/*删除小的属性值*/
		$(".shaling_sku_img_one").live('click',function(){
			$(this).parent().remove()
		})
		/*删除某个商品的销售属性V3.1.0*/
		$(".shaling_sku_information_button_two").live('click',function(){
			var specId=$(this).attr("specid");
			var del=$(this);
			if(specId !=null){
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteItemSpec/3.1.0",{itemId:itmeid,specId:specId},function(data){
				var data=$.parseJSON(data)
				if(data.code == 0){
					 del.parent().parent().remove();
				  
				}else{
				 	alert(data.data.error);
				}
			})
			}else{
				 del.parent().parent().remove();
			}
			
		})
		$(".shaling_sku_information_button_one").live('click',function(){
			var del= $(this);
			var that=this;
			if($(this).html()=="编辑"){
				$(this).html("保存")
				$(this).parent().siblings(".newCrease_goods").css("display","block")
				$(this).parent().siblings(".shaling_sku_information_one_xia").find(".clickt_change_diaabled").removeAttr("disabled")
				$(this).parent().siblings(".shaling_sku_information_one_xia").find(".shaling_sku_img_one").show();
			}else if($(this).html()=="保存"){
				var spec_name=$(this).prev().val()
				var specid_now=$(this).parent().parent().attr("specid")
				var spec_arr_need=$(this).parent().next().children("span")
				var spec=new Object;
				var arr= new Array;
				spec.specId=specid_now;
				spec.name=spec_name;
				for(var i=0;i<spec_arr_need.length;i++){
					if($(spec_arr_need[i]).children().eq(1).val() !=""){
						var one=new Object;
						one.valueId=$(spec_arr_need[i]).attr("valueid");
						one.value=$(spec_arr_need[i]).children().eq(1).val();
						arr.push(one);
						
					}else{
						alert("属性值不能为空！");
						return false;	
					}
				}
				spec.values=arr;
				var specs=JSON.stringify(spec);
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveItemSpec/3.1.0",{itemId:itmeid,spec:specs},function(data){
					var data=$.parseJSON(data)
					if(data.code != 0){
					  alert(data.data.error);
					}else{
					 	alert("保存成功！");
					 	//$(that).html("编辑");
					 	var str_sku_name='';
						str_sku_name +='<div class="shaling_sku_information_one_shang"><input type="text" placeholder="请输入商品属性(例如:颜色)" name="" value="'+data.data.name+'"><button class="shaling_sku_information_button_one" name="'+data.data.name+'" specId="'+data.data.specId+'">编辑</button><button class="shaling_sku_information_button_two" specId="'+data.data.specId+'" name="'+data.data.name+'">删除商品属性</button></div><div class="shaling_sku_information_one_xia">';
						for(var j=0;j<data.data.values.length;j++){
							str_sku_name+='<span class="shaling_sku_information_one_xia_dingwei" valueId="'+data.data.values[j].valueId+'" value="'+data.data.values[j].value+'"><input type="checkbox"><input type="text" class="clickt_change_diaabled" disabled="disabled" style="width:60px;" value="'+data.data.values[j].value+'"/><img class="shaling_sku_img_one hidden" src="./images/remove_one.png" alt="" /><img style="display:none" class="shaling_sku_img_two" src="./images/img_xiugaihh.png" valueId="'+data.data.values[j].valueId+'" /></span>'
						}
						str_sku_name +='</div><span class="newCrease_goods">新增</span>';
					  	del.parent().parent('.shaling_sku_information_one').attr("specId",data.data.specId).empty().append(str_sku_name);
					}
				})	
			}
		});
		$(".shaling_sku_information_one_xia_dingwei input[type='checkbox']").live("click",function(){
			$(this).parent().siblings().find("input[type='checkbox']").attr("checked",false);
		})
/*18.选择属性生成sku信息V3.1.0*/
		var store_value=new Array();
		var tring_name='';
		var skuSpecs='';
		var tring_name='';
		$(".shaling_two_span").live('click',function(){
			$(".shaling_sku_information_one_xia_dingwei input[type='checkbox']:checked").click();
		});
		$(".shaling_one_span").live('click',function(){
			if($(".shaling_sku_information_one_xia_dingwei input[type='checkbox']:checked").length==$(".shaling_sku_information_one").length){
				var data= new Array();
				var tring_name='';
				$(".shaling_sku_information_one_xia_dingwei input[type='checkbox']:checked").each(function(index, element) {
					
					tring_name +=$(this).next().val()+' '
					var obj= new Object();
					obj.specId=$(this).parent().parent().parent().attr("specid");
					obj.valueId=$(this).parent().attr("valueid");
					data.push(obj);
					return data;
				});
				tring_name=tring_name.substring(0,tring_name.length-1);
				var datas = JSON.stringify(data);
				console.log(datas);
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/createItemSku/3.1.0",{itemId:itmeid,skuName:tring_name,skuSpecs:datas},function(data){
					var data=$.parseJSON(data)
					console.log(data)
					if(data.code !=0){
					  alert(data.data.error);
					}else{
						var fun="WdatePicker({dateFmt:'yyyy-MM-dd'})";
						 $(".shaling_table_sku_management_body").append('<tr class="input_goods_skuing"><td><input disabled="disabled" type="text" value="'+data.data.skuName+'" style="width: 128px;"></td><td><input type="text" style="width: 60px;" name="" value="'+data.data.salePrice+'"></td><td><input type="text" style="width: 134px;"  onclick="'+fun+'" style="background: url(./images/time_01.png) no-repeat;" value=""></td><td><input type="text" style="width: 60px;"  value="'+data.data.totalStockQuantity+'" name="">件</td><td><input type="text" style="width: 60px;"   value="'+data.data.itemBarcode+'" name=""></td><td><input type="text" style="width: 60px;" disabled="disabled" value="'+data.data.stockQuantity+'" name=""></td><td><span style="cursor: pointer;margin-right: 4px;" class="sku_bianji_store_cook bluebtn" skuId="'+data.data.skuId+'">保存</span><span class="delSku redbtn" style="cursor: pointer; " skuId="'+data.data.skuId+'">删除</span></td></tr>');
					}
				})
			
			}else{
				alert("请选择属性");
			}
		})
		$(".sku_bianji_store_cook").live('click',function(){
			var del=$(this);
			if($(this).html()=="编辑"){
				$(this).html("保存")
				$(this).parent().parent().children().eq(0).children().eq(0).removeAttr("disabled")
				$(this).parent().parent().children().eq(1).children().eq(0).removeAttr("disabled")
				$(this).parent().parent().children().eq(2).children().eq(0).removeAttr("disabled")
				$(this).parent().parent().children().eq(3).children().eq(0).removeAttr("disabled")
				$(this).parent().parent().children().eq(4).children().eq(0).removeAttr("disabled")
				
			}else if($(this).html()=="保存"){
					$(this).parent().prev().children().eq(0).val($(this).parent().parent().children().eq(3).children().eq(0).val())
				/*	var itemId_one=itmeid;
					var skuId=$(this).attr("skuid")
					var skuName=$(this).parent().parent().children().eq(0).children().eq(0).val();
					var sku_salePrice=$(this).parent().parent().children().eq(1).children().eq(0).val();
					
					var sku_totalStockQuantity=$(this).parent().parent().children().eq(3).children().eq(0).val();
					var sku_itemBarcode=$(this).parent().parent().children().eq(4).children().eq(0).val();
					
					if(sku_savalidityDate == ""){
						console.log(1);
						var sku_savalidityDate1='';
					}else{
						console.log(2);
						var sku_savalidityDate1=Date.parse(new Date(sku_savalidityDate));
					}*/
 					var sku_savalidityDate=$(this).parent().parent().children().eq(2).children().eq(0).val();
					var genData = new Object();
					genData.itemId = itmeid;
					genData.skuId = $(this).attr("skuid");
					genData.skuName = $(this).parent().parent().children().eq(0).children().eq(0).val();
					genData.salePrice = $(this).parent().parent().children().eq(1).children().eq(0).val();
					
					genData.totalStockQuantity = $(this).parent().parent().children().eq(3).children().eq(0).val();
					genData. itemBarcode=$(this).parent().parent().children().eq(4).children().eq(0).val();
					
					if(sku_savalidityDate != ""){
						genData.savalidityDate = Date.parse(new Date(sku_savalidityDate));
					}
					//itemId:itemId_one,skuId:skuId,skuName:skuName,salePrice:sku_salePrice,savalidityDate:sku_savalidityDate1,totalStockQuantity:sku_totalStockQuantity,itemBarcode:sku_itemBarcode
					$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/updateItemSkuInfo/3.1.0",genData,function(data){
						var data=$.parseJSON(data)
						console.log(data)
						if(data.code == 0){
							del.html("编辑")
							del.parent().parent().children().eq(0).children().eq(0).attr("disabled","disabled")
							del.parent().parent().children().eq(1).children().eq(0).attr("disabled","disabled")
							del.parent().parent().children().eq(2).children().eq(0).attr("disabled","disabled")
							del.parent().parent().children().eq(3).children().eq(0).attr("disabled","disabled")
							del.parent().parent().children().eq(4).children().eq(0).attr("disabled","disabled")
						  	alert("保存成功")
						}else{
							alert(data.data.error);
						}
					})
					}
			;
		})
		$(".shaling_table_sku_management_body .delSku").live("click",function(){
			var itemId_one=itmeid;
			var del=$(this);
			  $.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteItemSku/3.1.0",{itemId:itemId_one,skuId:$(this).attr("skuid")},function(data){
					var data=$.parseJSON(data)
					if(data.code !=0){
						 alert(data.data.error);
					}else{
						del.parent().parent().remove();
					}
				})
		})
/*定义全局categaryID 和全局的itemid  为了在点击编辑的时候 改变全局变量*/
	
	var itmeid=null;
	var categoryId=null;
	var isleaf=null;
	var option_value=null;
	var templateid=null;
	var itemLabelIds=null;
	var templateIds=null;
	var kkkkkkkkkk=null;
/*获取商品详情(商品编辑)*/
$(".zengjia_pointer").live('click',function(){
		var datta=null;
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
			datta=$.parseJSON(data)
			$(".goods_newCrease_name").css("display","block")

		})
		//$(".choice_goods_category_ul_important").html("");
		/*新增销售属性信息*/
		$(".shaling_table_sku_management_body .input_goods_skuing").remove();
		$(".goods_canshu_information_zong_child").html("")
		$(".title_six_button_basic").click()
		$(".lujing_gooods_choice").html("")
		$(".goods_yingxiao_case_one").val("")
		$(".goods_yingxiao_case_two").val("")
		$(".choice_goods_picture_more_last_choicePic").html("")
		$(".select_commone_newcode").val("")
		$('.electricity_supplier_goods_manage input[type="text"]').val('');
		$('.electricity_supplier_goods_manage .needEditImg').removeAttr("src");
		$(".addOrEditShop").html("&gt;编辑商品");
		if($(this).val()=="新增商品"){
			shopGoodEdit();
			$("#judge_goods_shopping_one").attr("checked","checked")
			$("#judge_goods_shopping_three").attr("checked","checked")
			kkkkkkkkkk=1;
			$(".judge_goods_shopping_days").val('7')
			$('.duanluo_div_haalo2 .editor_content1').createArticleEditor({
				elements: ['paragraph'],
				data:[{type:2,content:''}],//购买须知初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
			$(".addOrEditShop").html("&gt;新增商品");
			$(".electricity_supplier_goods_manage .needEditImg").removeAttr("src");
/*			$(".choice_goods_picture_more_first_controlpic").html("")
			$(".choice_goods_picture_more_first_controlpic").append('<div class="div_three_common_oh_jia" style="display: inline-block;width: 100%;height: 153px;"><input type="button" value="选择文件" multiple data-url="https://photos.nggirl.com.cn/uploadserver/app/image/uploadsCompress/3.1.0" /><img src="images/u702.png" class="remove_img_click_new" style="display: none"><img src="" style="width: 100%;height: 84%" class="zeng_img_number"></div>')
*/
			
		}
	
    	

		categoryId=$(this).parent().parent().parent().attr('categoryid')
		itmeid=$(this).parent().parent().parent().attr('classid')
		$(".electricity_father_zong").css("display","none");
		$(".goods_newCrease_edit").css("display","block")

		
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemDetail/3.1.0",{itemId:itmeid},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			$(".goods_newCrease_name_span").html(data.data.reamTitle)
			$(".electricity_supplier_goods_manage .goods_newCrease_edit").attr("itemId",data.data.itemId);
			console.log(data.data.properties.length)

			for(var u=0;u<data.data.properties.length;u++){
				
				var str='<li class="goods_canshu_information_zong_child_one"><select class="goods_canshu_information_seelect_one">'
				str+='<option selected="selected">'+data.data.properties[u].keyName+'</option>'
				for(var i=0;i<datta.data.length;i++){
					
					str+='<option keyId="'+datta.data[i].keyId+'">'+datta.data[i].name+'</option>'
				} 
				str+='</select><select class="goods_canshu_information_seelect_two">'
				str+='<option selected="selected">'+data.data.properties[u].value+'</option>'
				for(var j=0;j<datta.data[0].values.length;j++){
					
					str+='<option keyId="'+datta.data[0].values[j].valueId+'">'+datta.data[0].values[j].value+'</option>'
				}
				str+='</select><span><img class="goods_canshu_information_img" src="./images/ele-del.png"></span></li>'
				$(".goods_canshu_information_zong_child").append(str)
				
			}
			
			$(".goods_canshu_information_zong_child_one .goods_canshu_information_seelect_one") .live("change",function(){
				var this_value=$(this).val()
				var that=this
				var str=null;
				$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
					var data=$.parseJSON(data)
					console.log(data)
					for(var i=0;i<data.data.length;i++){
						if(data.data[i].name==this_value){
							$(that).next().html("")
							for(var j=0;j<data.data[i].values.length;j++){
								str+='<option>'+data.data[i].values[j].value+'</option>'
							}
						}
						$(that).next().html(str)
					}
				})
			})
			/*单位*/
			itemLabelIds=data.data.itemLabelIds;
			var shopping_need_know_one_array=$(".shopping_need_know_one_iuyChildre input[type=checkbox]")
			for(var j=0;j<itemLabelIds.length;j++){
			  for(var i=0;i<shopping_need_know_one_array.length;i++){
				  if($(shopping_need_know_one_array[i]).attr("labelid")==itemLabelIds[j]){
					  $(shopping_need_know_one_array[i]).attr("checked","checked")
				  }
				  
			  }
			}
			$('.duanluo_div_haalo2 .editor_content1').createArticleEditor({
				elements: ['paragraph'],
				data:data.data.buyerReading,//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
			var valuesss=data.data.unit
			templateid=data.data.templateIds
			option_value=data.data.brandName
			$(".lujing_gooods_choice").html(data.data.categoryName)
			$(".judge_goods_shopping_days").val(data.data.serviceTerm)

/*------------------------------商品sku-----------------------------------*/
		var sku_input=null;
		function getMoth(str){  
            var oDate = new Date(str),  
            oMonth = oDate.getMonth()+1,  
            oDay = oDate.getDate(),  
            oTime = getzf(oMonth) +'-'+ getzf(oDay);//最后拼接时间  
            return oTime;  
        };
        var input_checkbox=$(".shangpin_wuliu_information input[type=checkbox]")
		$(input_checkbox).attr("checked",false);
        for(var i=0;i<templateid.length;i++){
        	for(var j=0;j<input_checkbox.length;j++){
        		if($(input_checkbox[j]).attr("templateid")==templateid[i]){
        			$(input_checkbox[j]).attr("checked","checked")
        		}
        	}
        }
		for(var i=0;i<data.data.itemSkus.length;i++){
			var fun="WdatePicker({dateFmt:'yyyy-MM-dd'})";
			sku_input+='<tr class="input_goods_skuing"><td><input type="text" value="'+data.data.itemSkus[i].skuName+'" style="width: 128px;" disabled="disabled"></td><td><input type="text" style="width: 60px;" disabled="disabled" name="" value="'+data.data.itemSkus[i].salePrice+'"></td><td><input type="text" style="width: 134px;" disabled="disabled" onclick="'+fun+'" value="'+new Date(data.data.itemSkus[i].savalidityDate).format("yyyy-MM-dd")+'" style="background: url(./images/time_01.png) no-repeat;"></td><td><input type="text" style="width: 60px;" disabled="disabled" value="'+data.data.itemSkus[i].totalStockQuantity+'" name="">件</td><td><input type="text" style="width: 60px;"  disabled="disabled" value="'+data.data.itemSkus[i].itemBarcode+'" name=""></td><td><input type="text" style="width: 60px;" disabled="disabled" value="'+data.data.itemSkus[i].stockQuantity+'" name=""></td><td><span style="margin-right: 5px; " class="sku_bianji_store_cook bluebtn" skuId="'+data.data.itemSkus[i].skuId+'">编辑</span><span class="delSku redbtn"  skuId="'+data.data.itemSkus[i].skuId+'">删除</span></td></tr>';
			
		}
		
		/*处于被选中的状态*/
		
		var new_arr=null;
		var number_string=null;
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemDetail/3.1.0",{itemId:itmeid},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			var data_yy_need=data;
			/*这里获取categoryPath  1-2-3-4*/
			console.log(data)
			$(".input_select_value").val(data.data.categoryName)
			$(".input_select_value").val(data.data.brandName)
			$(".lujing_gooods_choice").attr("id",data.data.categoryId)
			var new_arr_arr=new Array()
			for(var i in new_arr){
				new_arr_arr.push(new_arr[i])
			}

			var lujing_goods_append=null;
			$(".input_select_value").attr("id",data.data.brandId)
			number_string=data.data.categoryPath;
			new_arr=number_string.split("-")
			
			$(".goods_yingxiao_case_one").val(data.data.mainTitle)
			$(".goods_yingxiao_case_two").val(data.data.reamTitle)
			$(".choice_goods_picture_more_first_controlpic").children().eq(1).attr("src",data.data.imgUrl)
			var brandId=data.data.brandId
			
			$(".choice_goods_guige_select_two option[value='"+data.data.unit+"']").attr("selected","selected");
			//var width_new=$(".choice_goods_picture_more_last_choicePic").width()/data.data.headImgs.length
			
			for(var i=0;i<data.data.headImgs.length;i++){
				$(".choice_goods_picture_more_last_choicePic").append('<div class="div_three_common_oh"><input type="button" value="选取文件" class="now_goChoice_picture editImg" /><img src="images/u702.png" class="remove_img_click"><img itemId="'+data.data.headImgs[i].itemId+'" src="'+data.data.headImgs[i].url+'" id="'+data.data.headImgs[i].id+'" width="'+data.data.headImgs[i].itemId+'" height="'+data.data.headImgs[i].itemId+'" style="width: 100%;height: 84%" class="needEditImg"></div>')
			}
			/*规格*/
			if(parseInt(data.data.standard)==1){
				$(".choice_goods_guige_select_one").get(0).selectedIndex=0; 
			}else if(parseInt(data.data.standard)==2){
				$(".choice_goods_guige_select_one").get(0).selectedIndex=1;
				
			}
			$(".goods_yingxiao_case_three").val(data.data.salePrice)
			
			/*推荐度*/
			$(".choice_goods_guige_tuijiandu").val(data.data.recommendation)
			if(data.data.isBuy==0){
				$("#judge_goods_shopping_two").attr("checked","checked")
			}else if(data.data.isBuy==1){
				$("#judge_goods_shopping_one").attr("checked","checked")
			}
			if(data.data.isService==0){
				$("#judge_goods_shopping_four").attr("checked","checked")
			}else if(data.data.isService==1){
				$("#judge_goods_shopping_three").attr("checked","checked")
			}
			$(".judge_goods_shopping_days").val(data.data.serviceTerm)
			
			$('.title_duanluo_picture .editor_content').createArticleEditor({
				elements: ['paragraph', 'title', 'image'],
				data:data.data.itemDetail,//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
		})


		/*勾选商品物流信息管理*/

		$(".shaling_table_sku_management_body").append(sku_input)
		var str_sku_name='';
		for(var i=0;i<data.data.itemSpecs.length;i++){
			str_sku_name+='<div class="shaling_sku_information_one" specId="'+data.data.itemSpecs[i].specId+'"><div class="shaling_sku_information_one_shang"><input type="text" placeholder="请输入商品属性(例如:颜色)" name="" value="'+data.data.itemSpecs[i].name+'"><button class="shaling_sku_information_button_one" name="'+data.data.itemSpecs[i].name+'" specId="'+data.data.itemSpecs[i].specId+'">编辑</button><button class="shaling_sku_information_button_two" specId="'+data.data.itemSpecs[i].specId+'" name="'+data.data.itemSpecs[i].name+'">删除商品属性</button></div><div class="shaling_sku_information_one_xia">'
			for(var j=0;j<data.data.itemSpecs[i].values.length;j++){
				str_sku_name+='<span class="shaling_sku_information_one_xia_dingwei" valueId="'+data.data.itemSpecs[i].values[j].valueId+'" value="'+data.data.itemSpecs[i].values[j].value+'"><input type="checkbox"><input type="text" class="clickt_change_diaabled" disabled="disabled" style="width:60px;" value="'+data.data.itemSpecs[i].values[j].value+'"/><img class="shaling_sku_img_one hidden" src="./images/remove_one.png" alt="" /><img style="display:none" class="shaling_sku_img_two" src="./images/img_xiugaihh.png" valueId="'+data.data.itemSpecs[i].values[j].valueId+'" /></span>'
			}
			str_sku_name+='</div><span class="newCrease_goods">新增</span></div>'
		}
		$('.goods_shaling_information_sku_chilr').empty().append(str_sku_name);
	})
		

		var index;
		$(".choice_goods_category_ul_one li").live('click',function(){
			$(".choice_goods_category_ul_two").html("")
			var str=null;
			index=$(this).attr("index");
			if($(this).attr('isLeaf')==0){
				$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemCategories/3.1.0",function(data){
					var data=$.parseJSON(data)
					
					for(var i=0;i<data.data[index].children.length;i++){
						str+='<li isLeaf="'+data.data[index].children[i].isLeaf+'" id="'+data.data[index].children[i].id+'" index="'+index+'">'+data.data[index].children[i].name+'</li>'
					}
					str=str.slice(4)
					$(".choice_goods_category_ul_two").html(str)
				})
			}
		})
		$(".choice_goods_category_ul_two li").live('click',function(){
			$(".choice_goods_category_ul_three").html("")
			var str=null;
			index_three=$(this).attr("index")
			if($(this).attr('isLeaf')==0){
				$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemCategories/3.1.0",function(data){
					var data=$.parseJSON(data)
					for(var i=0;i<data.data[index].children[index_three].children.length;i++){
						str+='<li isLeaf="'+data.data[index].children[index_three].children[i].isLeaf+'" id="'+data.data[index].children[index_three].children[i].id+'" index="'+index+'">'+data.data[index].children[index_three].children[i].name+'</li>'
					}
					str=str.slice(4)
					$(".choice_goods_category_ul_three").html(str)
				})
			}
		})
		
	})

	


	
    	

	$('.tupianSize').click(function(e){
		
		var left=(e.pageX-135)+"px";
		var top=(e.pageY-80)+"px";
		$('.management_Popups_first').css({'display':'block','left':left,'top':top})
		
	})
	/*查看商品详情*/
	$('.look_tanchuang').live('click',function(e){
		var left=(e.pageX-135)+"px";
		var top=(e.pageY-80)+"px";
		$('.management_Popups_first').css({'display':'block','left':left,'top':top})
		var this_goodsID=$(this).children().eq(0).attr('classid')
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getItemInfo/3.1.0',{orderSkuId:this_goodsID},function(data){
			var data=$.parseJSON(data);
				var str_pinjie='<tr><th>商品名称</th><th>图片</th><th>数量</th><th>型号</th><th>金额</th></tr><tr><td class="management_Mask">'+data.data.iteName+'</td><td class="control_img"><img src="'+data.data.imgUrl+'"/></td><td style="margin-left: 18px;" class="management_number">'+data.data.quantity+'</td><td style="margin-left: 26px" class="management_Model">'+data.data.skuName+'</td><td style="margin-left: 16px;" class="management_money">'+data.data.amount+'</td></tr><tr><td></td><td></td><td class="make_sure" style="margin-left: 113px;">返回</td><td></td><td></td></tr>'
		
			$('.management_Popups_first').html(str_pinjie)
		})
	})
	//直接点击不了，用事件委托，可以点击到子类
	$('.management_Popups_first').on('click','.make_sure',function(){
		$('.management_Popups_first').css('display','none')
	})

	/*获取评论的时间节点*/
	var myDate=new Date();
	var years=myDate.getFullYear();   //获取年份
	var months=myDate.getMonth();     //获取月份	
	var data=myDate.getDate();        //获取日期
	var hours=myDate.getHours();	  //获取小时
	var minutes=myDate.getMinutes();  //获取分钟
	var seconds=myDate.getSeconds();  //获取秒数
	$('.huoqu_huifu_neirong').css('display','none')



	/*删除评论以及回复评论*/
	$('.click_remove').live('click',function(){
		var this_commentId=$(this).parent().parent().attr('classid')

		console.log(this_commentId)
		var r=confirm("确定删除？");
		if(r == true){
			$.ajax({
				type:'POST',
				url:'<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/deleteComment/3.1.0',
				data:{
					commentId:this_commentId
				},
				dataType:'json',
				success:function(data){
					if(data.code !=0){
						alert(data.data.error);
					}else{
						getItemComments()
						getOrderComments()
					}
				}
			})
		}
	})
		
	
	
/*商家进行评价*/
	$('.click_callback').live('click',function(e){
		$(".comThisCom").removeClass("comThisCom");
		$(this).addClass("comThisCom");
		var top=e.pageY-150;
		$('.huoqu_huifu_neirong').css({'display':'block','background':'#03ccbb','left':'655px','top':top})
		$(".huoqu_huifu_neirong .huoqu_huifu_neirong_three").removeClass("saleEdit");
		$('.huoqu_huifu_neirong .huoqu_huifu_neirong_three').addClass("saleCom")
		$('.huoqu_huifu_neirong .huoqu_huifu_neirong_two').val('');
	})
/*编辑商家回复*/
	$(".management_edit").live('click',function(e){
		$(".editThisCom").removeClass("editThisCom");
		$(this).addClass("editThisCom");
		var top=e.pageY-150;
		$('.huoqu_huifu_neirong').css({'display':'block','background':'#03ccbb','left':'655px','top':top})
		$(".huoqu_huifu_neirong .huoqu_huifu_neirong_three").removeClass("saleCom");
		$('.huoqu_huifu_neirong .huoqu_huifu_neirong_three').addClass("saleEdit")
		$('.huoqu_huifu_neirong .huoqu_huifu_neirong_two').val($(this).parent().siblings().find(".huifu_neirong").html());
	})

	$(".huoqu_huifu_neirong_three").live('click',function(){
		var huifu_value=$(this).prev().val();
		/*将回复的内容赋给商家评价中*/
		if(huifu_value==""){
			alert("请输入内容！");
		}else{
			if($(this).hasClass("saleEdit")){
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/updateReply/3.1.0",{replyId:$(".editThisCom").parent().attr("replyid"),replyContent:huifu_value},function(data){
					var data=$.parseJSON(data);
					if(data.code !=0){
						alert(data.data.error);
					}else{
						getItemComments()
						getOrderComments();
						$(".huoqu_huifu_neirong").hide()
					}
				})
			}else if($(this).hasClass("saleCom")){
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/replyComment/3.1.0",{commentId:$(".comThisCom").parent().parent().attr("classid"),replyContent:huifu_value},function(data){
					var data=$.parseJSON(data);
					if(data.code !=0){
						alert(data.data.error);
					}else{
						getItemComments()
						getOrderComments();
						$(".huoqu_huifu_neirong").hide()
					}
				})
			}
		}
			
		})
	

	$('.huoqu_huifu_neirong_four').live('click',function(){
		  $(this).parent().css('display','none')
	  })
	/*增加虚拟评价用户部分*/
	$('.increase_virtual_user').css('display','none')
	$('.management_controller_evaluatePond').live('click',function(){
		$('.increase_virtual_user').css('display','block')
		$('.increase_virtual_user .editor_content').createArticleEditor({
			elements: ['paragraph', 'image'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});
	})
	$('.virtual_user_fabu').live('click',function(){
			var ItemId=$(".singleShopComments").attr("itemId");
			/*评价者id和虚拟用户信息选择*/
			var commentContent = $(this).siblings(".editor_content").getArticleEditorData();
			if($.type(commentContent) != 'array'){
				alert(commentContent);
				return;
			}
			var commentContents = JSON.stringify(commentContent);
			if($('.Fill_Evaluator_id').val()=="" && $(".Fill_choice_virtual_user").val()==""){
				alert("请在评价者id或者选择虚拟用户栏输入内容")
			}else if(!$('.Fill_Evaluator_id').val()==""){
				var genData = {
					ItemId:ItemId,
					commentUserId:$(".Fill_Evaluator_id").val(),
					commentContent:commentContents
				};
				var r = confirm('确定要保存？？');
			}else{
				var genData = {
					ItemId:ItemId,
					virtailUserId:$(".Fill_choice_virtual_user").attr("userId"),
					commentContent:commentContents
				};
				var r = confirm('确定要保存？？');
			}
			if(r == true){
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/insertComment/3.1.0",genData,function(data){
					var data=$.parseJSON(data)
					if(data.code !=0){
						alert(data.data.error);
					}else{
						getOrderComments();
						$(".increase_virtual_user").hide()
					}
				})
			}
		
		})
		
	//排序页的返回
	$(".singleShopComments .management_Qpaixu").live('click',function(){
		$(".singleShopComments .sort").addClass("hidden");
		$(".singleShopComments .notsort").removeClass("hidden");
	})
	
	/*某个商品的全部评论排序*/
	$(".management_paixu_timer").live('click',function(){

		$(".singleShopComments .notsort").addClass("hidden");
		$(".singleShopComments .sort").removeClass("hidden");
	})
		$(".let_it_upknow").live('click',function(){
			var params = getOrderCommentsParams();
			if(typeof($(".singleShopComments").attr("page")) != "undefined"){
				params.page = $(".singleShopComments").attr("page");
			}
			params.commentId = $(this).parent().parent().attr("classid");
			if( $(this).parent().parent().prev().attr("classid")==undefined){
				params.toExchangeCommentId = $(this).parent().parent().prev().prev().attr("classid");
			}else{
				params.toExchangeCommentId = $(this).parent().parent().prev().attr("classid");
			}
			console.log(params.toExchangeCommentId);
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
				initOrderComments(data);
				$(".singleShopComments .tcdPageCode").createPage({
					pageCount:parseInt(data.data.totalPageNum),
					current:parseInt(data.data.currnetPageNum),
					backFn:function(p){
						params.page = p;
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
							type : 'post',
							dataType : 'json',
							data: params,
							success : function(data){
								initOrderComments(data);
							}
						});			
					}
				});

				}
			});	
				
		})
		$(".let_it_downknow").live('click',function(){
			var params = getOrderCommentsParams();
			if(typeof($(".singleShopComments").attr("page")) != "undefined"){
				params.page = $(".singleShopComments").attr("page");
			}
			params.commentId = $(this).parent().parent().attr("classid");
			if( $(this).parent().parent().next().attr("classid")==undefined){
				params.toExchangeCommentId = $(this).parent().parent().next().next().attr("classid");
			}else{
				params.toExchangeCommentId = $(this).parent().parent().next().attr("classid");
			}
			
			console.log(params.toExchangeCommentId);
			$.ajax({
				url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
				type : 'post',
				dataType : 'json',
				data: params,
				success : function(data){
				initOrderComments(data);
				$(".singleShopComments .tcdPageCode").createPage({
					pageCount:parseInt(data.data.totalPageNum),
					current:parseInt(data.data.currnetPageNum),
					backFn:function(p){
						params.page = p;
						$.ajax({
							url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
							type : 'post',
							dataType : 'json',
							data: params,
							success : function(data){
								initOrderComments(data);
							}
						});			
					}
				});
				}
			});	
		})
	$('.virtual_user_cancel').live('click',function(){
		$(this).parent().css('display','none')
	})
	/*定义全局变换的itemId*/
	var itemId_search=null;
	/*定义全局的commentid*/
	var commentid=null;
	/*查看全部评论*/
	$('.look_pingjia').live('click',function(){
		var pageInfo = new PageInfo("#electricity_supplier_goods_manage");
		ses.push(pageInfo);
		$("#electricity_supplier_goods_manage").hide();
		$("#shope_evaluate_manage").show();
		$('.allShopComments').hide();
		$('.singleShopComments,.lookAll_someManagement').show();
		$('.shope_evaluate_manage .singleShopComments').attr("itemId",$(this).attr("itemId"))
		clearSingleComments();
		getOrderComments();
	});
	
	$('.management_Summary_comment_allComment').live('click',function(){
		var pageInfo = new PageInfo(".allShopComments");
		ses.push(pageInfo);
		$('.allShopComments').hide();
		$('.singleShopComments,.lookAll_someManagement').show();
		var itemId=$(this).parent().parent().attr("classid")
		itemId_search=itemId;
		$('.shope_evaluate_manage .singleShopComments').attr("itemId",$(this).attr("itemId"));
		clearSingleComments();
		getOrderComments();
	});

	$('.callback_prevs').live('click',function(){
		$('.singleShopComments').css('display','none')
		$('.allShopComments').css('display','block')
		$('.lookAll_someManagement').css('display','none')
		var previousPage = ses.pop();
		var str = previousPage._name;
		$(str).show();
		if(str=="#electricity_supplier_goods_manage"){
			$("#shope_evaluate_manage").hide();
		}
	})
	//评论置顶
/*	$(".zhiding_pingliun").live('click',function(){
		var commentId=$(this).parent().parent().attr("classid")
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/topComment/3.1.0",{commentId:commentId},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			if(data.code !=0){
			  alert(data.data.error);
			}else{
				getSingleComments();
			}
		})
	})

*/

/*商品管理--商品物流信息*/
	$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalExpressTemplates/3.1.0",function(data){
		var data=$.parseJSON(data);
		var str='<div class="wuliu_management_parent">';
		for(var i=0;i<data.data.length;i++){
			str+='<div class="wuliu_management_parent"><div class="wuliu_management"><input type="checkbox" class="shangpin_wuliu_information_getinformation" name="/" templateId="'+data.data[i].templateId+'" companyCode="'+data.data[i].companyCode+'"><span>'+data.data[i].companyName+'</span><span>'+data.data[i].freightPrice+'</span></div><div class="wuliu_management_choice">'
			for(var j=0;j<data.data[i].provinces.length;j++){
				str+='<span provinceId="'+data.data[i].provinces[j].provinceId+'">'+data.data[i].provinces[j].provinceName+'</span>'
			}
			str+='</div></div>'
		}
		$(".shangpin_wuliu_information").append(str)
	})

/*保存商品快递信息*/
	$(".store_now_information").live('click',function(){
		var templateid='';
		$(".shangpin_wuliu_information_getinformation:checked").each(function(index, element) {
            templateid+=$(this).attr("templateid")+',';
        });
		templateid=templateid.substring(0,templateid.length -1);
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveItemExpress/3.1.0",{itemId:itmeid,templateIds:templateid},function(data){
		var data=$.parseJSON(data)
		if(data.code == 0){
			alert("保存成功");	
		}else{
			alert(data.code.error);
		}
		
		})
	})
	$('.pointer_common').live('click',function(){
				
		$(this).css('color','black')
		var this_value=$(this).children().eq(0).html()
		$(this).siblings().css('color','#B7BCB9')
		$('.change_everyTime').html(this_value)
		//为了调转页码添加
		$(".chooseThisType").removeClass("chooseThisType");
		$(this).addClass("chooseThisType")
		All_cancel_Fn();
		comming_write();
		$(".controller_first .goto_page_box .goto_redirect_page_num").val("");
	})
	/*全选按钮,获取商品的id*/
	$('.checkbox_first_now').live('click',function(){
		var that =this;
		if($(this).attr('checked')=='checked'){
			$('.checkbox_botton').attr('checked','checked')
		}else{
			$('.checkbox_botton').removeAttr('checked')
		}
	})
/*获取全部商品的classid*/
	$('.search_input_three .controller_remove').live('click',function(){
		var itemIdArry = new Array();
		$('.checkbox_botton').each(function(index, element) {
		   if($(this).attr('checked')=='checked'){
				itemIdArry.push($(this).parent().parent().parent().attr("classId"));
			} 
		});
	
		var itemIds = itemIdArry.join(",");
		var r=confirm("确定删除？");
		if(r == true){
			$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteItem/3.1.0",{itemIds:itemIds},function(data){
				var data=$.parseJSON(data);
				if(data.code !=0){
				  alert(data.data.error);
				}else{
					$('.checkbox_botton').each(function(index, element) {
					   if($(this).attr('checked')=='checked'){
							$(this).parent().parent().parent().remove();
							//comming_write();
							getItemStatInfo();
						} 
					});
				  $(".checkbox_first_now").removeAttr("checked")
				}
			})
		}
	})


	//该商品上架
	$('.search_input_three .controller_shangjai').live('click',function(){
		var itemIdArry = new Array();
		$('.checkbox_botton').each(function(index, element) {
		   if($(this).attr('checked')=='checked'){
				itemIdArry.push($(this).parent().parent().parent().attr("classId"));
			} 
		});
		var itemIds = itemIdArry.join(",");
		console.log(itemIds);
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/putonItem/3.1.0",{itemIds:itemIds},function(data){
			var data=$.parseJSON(data);
			if(data.code ==0){
			   $(".checkbox_first_now,.checkbox_botton").removeAttr("checked")
			   comming_write();
			   getItemStatInfo();
			}else{
				  alert(data.data.error);
			}
		})
	})
	//该商品下架
	$('.search_input_three .controller_xiajia').live('click',function(){
		var itemIdArry = new Array();
		$('.checkbox_botton').each(function(index, element) {
		   if($(this).attr('checked')=='checked'){
				itemIdArry.push($(this).parent().parent().parent().attr("classId"));
			} 
		});
		var itemIds = itemIdArry.join(",");
		console.log(itemIds);
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/putoffItem/3.1.0",{itemIds:itemIds},function(data){
			var data=$.parseJSON(data);
			if(data.code !=0){
			  alert(data.data.error);
			}else{
			  $(".checkbox_first_now,.checkbox_botton").removeAttr("checked")
			  comming_write();
			  getItemStatInfo();
			 // $(that).removeAttr("checked")
			}
		})
	})
	//下架商品是否在前端展示
	$('#electricity_supplier_goods_manage .main_body_table_main .showInH5').live("click",function(){
		var del=$(this);
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/updteItemShowStatus/3.1.0",{itemId:del.attr("itemId"),isShow:del.attr("isShow")},function(data){
			var data=$.parseJSON(data);
			if(data.code ==0){
				if(del.attr("isShow")=="0"){
					$(del).attr("isShow","1");	
					$(del).html("不在前端展示");
					$(del).siblings("img").attr("src","./images/notshow.png");
				}else{
					$(del).attr("isShow","0");
					$(del).html("在前端展示");	
					$(del).siblings("img").attr("src","./images/show.png");
				}
			  
			}else{
				alert(data.data.error);
			}
		})
	});	
	//查看该商品的H5页面
	$('#electricity_supplier_goods_manage .main_body_table_main .LookInH5').live("click",function(){
		onClickLookGood($(this));
	});	


	
//H5页面的动效
	
	var goodsParameterChirld_number=$('.goodsParameterChild').children('li').size()
	var goodsParameterChirld_number_height=goodsParameterChirld_number*0.8;
	$('.goodsPicture').live("click",function(){
		$('.goodsPictureChild').show().siblings().hide()
		$(this).addClass("on").siblings().removeClass("on");
	})
	$('.goodsParameter').live("click",function(){
		var li_number=$('.goodsParameterChild li');
		$('.goodsParameterChild').show().siblings().hide()
		$(this).addClass("on").siblings().removeClass("on");
		//$(this).css({'border-bottom':'1px solid #EE750D','color':'#F39A4C'}).siblings().css({'border-bottom':'1px solid #f5f6f7','color':'#5E5E5E'})
	})

//商品页跳转指定页面按钮
	$('#electricity_supplier_goods_manage .controller_first .goto_page_box .goto_page_btn').click(function(){
			$(".main_body_table_main").attr("page",$(".controller_first .goto_page_box .goto_redirect_page_num").val());
			comming_write();
	});

//商品列表点击升降按钮
	$('.main_body_table_main .orderByDown').live('click',function(){
		$(this).parent().attr("value","1");
		comming_write();
	})	
	$('.main_body_table_main .orderByUp').live('click',function(){
		$(this).parent().attr("value","0");
		comming_write();
	})	
//评价页升降序
/*	$('.management_top_shuoming .orderByDown').live('click',function(){
		$(this).parent().attr("value","1");
		getOrderComments();
		getItemComments();
	})	
	$('.management_top_shuoming .orderByUp').live('click',function(){
		$(this).parent().attr("value","2");
		getOrderComments();
		getItemComments();
	})	*/
	
	$('.title_six_button span').live('click',function(){
		
		$(this).css('background','skyblue').siblings().css('background','#EEEEEE')
	})

	//事件监听去获取上传的图片
/*	$('.now_goChoice_picture').change(function(){
		var img_last=$(this).val().split("\\")
		var lujing="images/"+img_last[img_last.length-1]
		$(this).next().attr('src',lujing)
	})
	$('.now_goChoice_picture_change_second').change(function(){
		var img_last=$(this).val().split("\\")
		var lujing="images/"+img_last[img_last.length-1]
		$(this).next().attr('src',lujing)
	})*/
	/*$('.shen_zhi_yizu').change(function(){
		var img_last=$(this).val().split("\\")
		console.log($(this).val())
		var lujing="images/"+img_last[img_last.length-1]
		console.log(lujing)
		$(this).next().next().attr('src',lujing)
	})*/

	$(".shen_zhi_yizu").live('click',function(){
		$(this).change(function(){
			var img_last=$(this).val().split("\\")
			var lujing="images/"+img_last[img_last.length-1]
			$(this).next().next().attr('src',lujing)
			console.log($(this).next().next().attr("src"))
		})
		$(this).parent().children().eq(2).attr("src",data.data.imgUrl)
	})

	$('.remove_img_click').live('click',function(){
		$(this).parent().remove();
	})
	/*增加详情页图片*/
	$('.controller_increse_picture').live('click',function(){
		
		var tipian='<div class="div_three_common_oh">'
                    +'<input type="button" value="选择文件" class="editImg"  />'
                    +'<img src="images/u702.png" class="remove_img_click">'
                    +'<img src="" style="width: 100%;height: 84%" class="zeng_img_number needEditImg"> '
                    +'</div>'
        $('.choice_goods_picture_more_last_choicePic').append(tipian)
      /*  if($('.choice_goods_picture_more_last_choicePic').children('div').length>4){
        	var zong_width=parseInt($(".choice_goods_picture_more_last_choicePic").width())
        	var zong_length=$('.choice_goods_picture_more_last_choicePic').children('div').length
        	$('.choice_goods_picture_more_last_choicePic').children('div').css("width",zong_width/zong_length-20)
        }*/
	})
/*	var img_url=null;
	$('.now_goChoice_picture_change').fileupload({
		dataType: 'json',
		done: function (e, data) {
			if(data.result.code == 0){
				$(".zeng_img_number:last").attr("src",data.result.data.url)
				img_url=data.result.data.url
			}else{
				alert(data.data.error);	
			}
		}
	});*/
/*	$(".div_three_common_oh input").live('click',function(){
		$(this).parent().siblings().children().eq(2).removeClass("zeng_img_number")
		$(".now_goChoice_picture_change").click()
	})*/

/*	$(".div_three_common_oh_jia input").live('click',function(){
		
		$(".now_goChoice_picture_change_second").click()
	})*/
	$('.now_goChoice_picture_change_second').fileupload({
		dataType: 'json',
		done: function (e, data) {
			if(data.result.code == 0){
				$(".editThisImgOn").attr("src",data.result.data.url);
				$(".editThisImgOn").attr("width",data.result.data.width);
				$(".editThisImgOn").attr("height",data.result.data.height);
				
			}else{
				alert(data.data.error);	
			}
		}
	});

	/*标题、段落、图片点击获取不同的编辑内容*/
	$('.title_duanluo_picture_choice_one').live('click',function(){
		$('.title_duanluo_picture_biaoti').css('display','block').siblings().css('display','none')
	})
	$('.title_duanluo_picture_choice_two').live('click',function(){
		$('.title_duanluo_picture_content').css('display','block').siblings().css('display','none')
	})
	$('.title_duanluo_picture_choice_three').live('click',function(){
		$('.title_duanluo_picture_tupian').css('display','block').siblings().css('display','none')
		$('.title_duanluo_picture_tupian_input').change(function(){
			var new_arr=$(this).val().split("\\")
			var img_url_choice='images/'+new_arr[new_arr.length-1]
			$('.title_duanluo_picture_tupian_child').children().eq(0).attr('src',img_url_choice)
		})
	})
	
/*定义全局categaryID 和全局的itemid  为了在点击编辑的时候 改变全局变量*/
/*	var categoryId=null;
	var itmeid=null;
	var newcre_categoryid=null;*/
	/*获取商品详情(商品编辑)*/
	/*$(".zengjia_pointer").live('click',function(){*/
		/*$(".choice_goods_category_ul_important").html("");
		categoryId=$(this).parent().parent().parent().attr('categoryId')
		itmeid=$(this).parent().parent().parent().attr('classid')
		$(".electricity_father_zong").css("display","none");
		$(".goods_newCrease_edit").css("display","block")*/
		/*var parameter_arr={};*/
	/*点击编辑商品时候*/
		$(".lujing_gooods_choice").html("")
		
		

	var categoryId=null;
	$(".choice_goods_category li").live('click',function(){
		categoryId=$(this).attr("id")
		console.log(categoryId)
	})
	var option_index=null
	
	


	/*获取标题*/

	/*点击商品基本信息-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_basic',function(){
		
		$(".three_input_common_div").css("display","none")
		
		$(".choice_goods_category_ul_one").html("")
		$(".choice_goods_category_ul_important").html("")
		$('.goods_basic_information_now_to').css('display','block').siblings().css('display','none')
		var itemId=itmeid;
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemCategories/3.1.0",function(data){
			
			var data=$.parseJSON(data)
			console.log(data)
			var str_one=null;
			for(var i=0;i<data.data.length;i++){
				str_one+='<li parentId="'+data.data[i].parentId+'" id="'+data.data[i].id+'">'+data.data[i].name+'</li>'
			}
			str_one=str_one.slice(4)
			$(".choice_goods_category_ul_one").html(str_one)
		})
		//shopGoodEdit();
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemCategories/3.1.0",function(data){
			var data=$.parseJSON(data)
			console.log(data)
			var str=null;
			for(var i=0;i<data.data.length;i++){
				str+='<li id="'+data.data[i].id+'" parentId="'+data.data[i].parentId+'" index="'+i+'" isLeaf="'+data.data[i].isLeaf+'">'+data.data[i].name+'</li>'
			}
			str=str.slice(4);
			var first_index=null;
			var second_index=null;
			var thirt_index=null;
			var four_index= null;
			var five_index=null;
			var six_index=null;
			$(".choice_goods_category_ul_one").html(str)
			$(".choice_goods_category_ul_one li").live('click',function(){
				$(".choice_goods_category_ul_important").html("")
				var str='<div style="display:inline-block;float:left;margin:0px 4px;" class="liuji_caidan_one">';
			first_index=$(this).attr("index");
				if($(this).attr("isleaf")==0){
					for(var i=0;i<data.data[first_index].children.length;i++){
						str+='<li id="'+data.data[first_index].children[i].id+'" index="'+i+'" isLeaf="'+data.data[first_index].children[i].isLeaf+'">'+data.data[first_index].children[i].name+'</li>'

					}
					str+='</div>'
					$(".choice_goods_category_ul_important").append(str)
				}else{
					$(".lujing_gooods_choice").attr("id",$(this).attr("id"))
					$(".lujing_gooods_choice").html($(this).html())
				}

			})
			$(".liuji_caidan_one li").live('click',function(){
				$(this).parent().next().remove()
				var second_index=$(this).attr("index")
				var str='<div style="display:inline-block;float:left;margin:0px 4px;" class="liuji_caidan_two">';
				if($(this).attr("isleaf")==0){
					for(var i=0;i<data.data[first_index].children[second_index].children.length;i++){
						str+='<li id="'+data.data[first_index].children[second_index].children[i].id+'" index="'+i+'" isLeaf="'+data.data[first_index].children[second_index].children[i].isLeaf+'">'+data.data[first_index].children[second_index].children[i].name+'</li>'
					}
					str+='</div>'
					$(".choice_goods_category_ul_important").append(str)
				}else{
					$(".lujing_gooods_choice").attr("id",$(this).attr("id"))
					$(".lujing_gooods_choice").html($(this).html())
				}
				$(".liuji_caidan_two li").live("click",function(){
					console.log($(this).attr("index"))
					$(this).parent().next().remove()
					var thirt_index=$(this).attr("index")
					var str='<div style="display:inline-block;float:left;margin:0px 4px;" class="liuji_caidan_three">';
					if($(this).attr("isleaf")==0){
						for(var i=0;i<data.data[first_index].children[second_index].children[thirt_index].children.length;i++){
							str+='<li id="'+data.data[first_index].children[second_index].children[thirt_index].children[i].id+'" index="'+i+'" isLeaf="'+data.data[first_index].children[second_index].children[thirt_index].children[i].isLeaf+'">'+data.data[first_index].children[second_index].children[thirt_index].children[i].name+'</li>'
						}
						str+='</div>'
						$(".choice_goods_category_ul_important").append(str)
					}else{
						$(".lujing_gooods_choice").attr("id",$(this).attr("id"))
						$(".lujing_gooods_choice").html($(this).html())
					}
					$(".liuji_caidan_three li").live("click",function(){
						
						$(this).parent().next().remove()
						var four_index=$(this).attr("index")
						var str='<div style="display:inline-block;float:left;margin:0px 4px;" class="liuji_caidan_four">';
						if($(this).attr("isleaf")==0){
								for(var i=0;i<data.data[first_index].children[second_index].children[thirt_index].children[four_index].children.length;i++){
									str+='<li id="'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[i].id+'" index="'+i+'" isLeaf="'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[i].isLeaf+'">'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[i].name+'</li>'
									}
							str+='</div>'
							$(".choice_goods_category_ul_important").append(str)
						}else{
							$(".lujing_gooods_choice").attr("id",$(this).attr("id"))
							$(".lujing_gooods_choice").html($(this).html())
						}
								$(".liuji_caidan_four li").live('click',function(){
								console.log($(this).attr("index"))

								$(this).parent().next().remove()
								var five_index=$(this).attr("index")
								var str='<div style="display:inline-block;float:left;margin:0px 4px;" class="liuji_caidan_five">';
								if($(this).attr("isleaf")==0){
										for(var i=0;i<data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[five_index].children.length;i++){
											str+='<li id="'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[five_index].children[i].id+'" index="'+i+'" isLeaf="'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[five_index].children[i].isLeaf+'">'+data.data[first_index].children[second_index].children[thirt_index].children[four_index].children[five_index].children[i].name+'</li>'
											}
									str+='</div>'
									$(".choice_goods_category_ul_important").append(str)
								}else{
									$(".lujing_gooods_choice").attr("id",$(this).attr("id"))
									$(".lujing_gooods_choice").html($(this).html())
								}
							})
					})
				})
			})
		})
	})
	/*点击商品参数信息-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_parameter',function(){
		
		$('.goods_canshu_information').css('display','block')
		$('.goods_canshu_information').siblings().css('display','none')
	})
	/*点击商品销售属性信息-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_property',function(){
		
		$('.goods_shaling_information_sku').css('display','block').siblings().css('display','none')
	})
	/*点击商品物流信息-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_logistics',function(){
		$('.shangpin_wuliu_information').css('display','block').siblings().css('display','none')

	})
	

	/*点击购买须知-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_buyNotice',function(){
		$('.shopping_need_know').css('display','block').siblings().css('display','none');
		/*var shopping_need_know_one_array=$(".shopping_need_know_one_iuyChildre input[type=checkbox]")
		for(var j=0;j<itemLabelIds.length;j++){
		  for(var i=0;i<shopping_need_know_one_array.length;i++){
			  if($(shopping_need_know_one_array[i]).attr("labelid")==itemLabelIds[j]){
				  $(shopping_need_know_one_array[i]).attr("checked","checked")
			  }
			  
		  }
		}*/
	})
	$(".shopping_need_know_two_button").live("click",function(){
		  var labelIds='';
		  $(".shopping_need_know_input").each(function(index, element) {
			  if($(this).attr("checked")){
			  labelIds+=$(this).parent().attr("labelid")+','
			  }
		  })
		  labelIds=labelIds.substring(0,labelIds.length-1)
		  
		  var buyerReading =$(".chooseKnow:checked").siblings(".editor_content").getArticleEditorData();
		  if($.type(buyerReading) != 'array'){
			  alert(buyerReading);
			  return;
		  }
		  var buyerReadings = JSON.stringify(buyerReading);
		  
		  $.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveItemLabelAndBuyerReading/3.1.0",{itemId:itmeid,labelIds:labelIds,buyerReading:buyerReadings},function(data){
		  var data=$.parseJSON(data)
			  if(data.code==0){
				  alert("保存成功！");
			  }else{
				  alert(data.data.error);
			  }
		  })
	  })
	/*点击关联帖子-->该模块出现*/
	$('.title_six_button').on('click','.title_six_button_aboutPost',function(){
		$('.abouting_goods_Posts').css('display','block').siblings().css('display','none')
		var itemId=itmeid;
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemDetail/3.1.0",{itemId:itemId},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			if(data.code==0){
				var new_array=data.data.linkPosts;
				var str='';
				for(var i=0;i<new_array.length;i++){
					str+='<span postType="'+new_array[i].postType+'" postId="'+new_array[i].postId+'">'+new_array[i].postId+'<span class="abouting_goods_input_Posts_remove"><img src="./images/remove_one.png"></span></span>'
				}
				
				$(".abouting_goods_input_Posts").html(str)
			}
		})
	})
	/*取消关联帖子*/
	$(".abouting_goods_input_Posts_remove").live('click',function(){
		var itemId=itmeid;
		var postId=$(this).parent().attr("postid")
	    var del=$(this);
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/cancelRelatePost/3.1.0",{itemId:itemId,postId:postId},function(data){
			var data=$.parseJSON(data)
			console.log(data)
			if(data.code == 0){
			//创建分页
				del.parent().remove();
			}else{
				alert(data.data.error);
			}
		})
	})
	/*点击选择帖子*/
		$('.abouting_goods_choice_Posts').live('click',function(){
			$('.abouting_goods_Posts_children_two .columnNameId').children("option:gt(0)").remove();
			getColumnNameInfo();
			var itemId=itmeid;
			console.log(itemId)
			$('.abouting_goods_Posts_children_one').css('display','none')
			$('.abouting_goods_Posts_children_two').css('display','block')
			getSeedingPostDetail();
		})
	//帖子查询
	$(".abouting_goods_Posts_children_two_search").live('click',function(){
		getSeedingPostDetail();		
	});
	/*选中帖子操作*/
	$(".choice_ture_iknow").live('click',function(){
		$(this).css("opacity","0")
		$(".choice_cuowu_iknow").css("opacity","100")
		var itemId=itmeid
		var postId=$(this).parent().parent().children().eq(0).html();
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/addRelatePost/3.1.0",{itemId:itemId,postId:postId},function(data){
			var data=$.parseJSON(data)
			if(data.code == 0){
			//创建分页
				getSeedingPostDetail();
			}else{
				alert(data.data.error);
			}
		})
	})
	/*取消选中帖子操作*/
	$(".choice_cuowu_iknow").live('click',function(){
		$(this).css("opacity","0")
		$(".choice_ture_iknow").css("opacity","100")
		var itemId=itmeid
		var postId=$(this).parent().parent().children().eq(0).html();
		$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/cancelRelatePost/3.1.0",{itemId:itemId,postId:postId},function(data){
			var data=$.parseJSON(data)
			if(data.code == 0){
			//创建分页
				getSeedingPostDetail();
			}else{
				alert(data.data.error);
			}
		})
	})
	/*点击返回*/
	$('.abouting_goods_Posts_children_two_back').live('click',function(){
		$('.abouting_goods_Posts_children_one').css('display','block')
		$('.abouting_goods_Posts_children_two').css('display','none')
		$('.title_six_button_aboutPost').click();
	})
	/*})*/
	
		




/*商品参数信息保存  相关功能*/
		$(".goods_canshu_information_zong_dusn").live('click',function(){
			var keyId=$(this).parent().children().eq(0).html();
			console.log(keyId)
			$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/deleteProperty/3.1.0",{keyId:keyId},function(data){
				var data=$.parseJSON(data);
				if(data.code=0){
					console.log(data)
				}
			})
		}) 
		var sund=null;
		$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalProperties/3.1.0",function(data){
					
					var data=$.parseJSON(data)
					sund=data
		})

		


/*保存商品参数*/
		$(".increase_picture_div").live('click',function(){
			$(this).parent().children().eq(3).css("display","inline-block")
			
			var that=this;
			var keyId=$(this).parent().children().eq(0).html();
			var name=$(this).parent().children().eq(1).html();
			$(".store_now_goods").live('click',function(){
				var value=$(that).prev().val();
				$(that).parent().children().eq(2).append("<option>"+value+"</option>")
				var value_arr=$(that).parent().children().eq(2).children();
				var values_arr=null;
				for(var i=0;i<value_arr.length;i++){
					values_arr+=""+$(value_arr[i]).val()+","
				}
				var valuesrr=values_arr.slice(4)
				$(that).parent().children().eq(3).val("")
				$(that).parent().children().eq(3).css("display","none")
				$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveProperty/3.1.0",{keyId:keyId,name:name,values:valuesrr},function(data){
						var data=$.parseJSON(data);
						if(data.code==0){
							console.log(data)
						}
				})
			})
			
		})

/*添加商品参数信息*/
		$(".tianjia_canshu").live('click',function(){
			$(".for_cha_create_create").removeAttr("style").css("display","block")
			
		})
/*添加之后保存*/
		$(".canshu_baocun_now").live('click',function(data){
			var itemId=itmeid;
			$(this).parent().children().eq(0).val(itemId)
			var name=$(this).parent().children().eq(1).val();
			var values=$(this).parent().children().eq(2).val();
			var properties='[{"keyName":"'+name+'","value":"'+values+'"}]'
			console.log(itemId+"+"+name+"+"+values)
			$.post("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/saveItemProperties/3.1.0",{itemId:itemId,properties:properties},function(data){
				var data=$.parseJSON(data);
				console.log(data)
			})
		})


		
		$(".goods_parameter_div_second_contrl_input img").live('click',function(){
			$(this).prev().remove();
			$(this).remove()
		})
		$(".goods_parameter_div_second_contrl_button").live('click',function(){
			$(".goods_parameter_div_store_input").append('<input type="text" name=""><img src="./images/remove_one.png">')
		})
	
	
})

 /*清除搜索信息*/
function All_cancel_Fn(){
		$(".electricity_supplier_goods_manage .search_input_fillin input[type='text']").val('');
		$(".electricity_supplier_goods_manage .search_input_second input[type='text']").val('');
		$(".orderByStr").attr("value","-1");
		$(".main_body_table_main").removeAttr("page");
	}
function comming_write(){
		var params = getShopParams();
		if(typeof($(".main_body_table_main").attr("page")) != "undefined"){
			params.page = $(".main_body_table_main").attr("page");
		}
		$.ajax({
			url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemList/3.1.0',
			type : 'post',
			dataType : 'json',
			data: params,
			success : function(data){
			initShopPageInfo(data);
			$(".controller_first .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					params.page = p;
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemList/3.1.0',
						type : 'post',
						dataType : 'json',
						data: params,
						success : function(data){
							console.log(data)
							initShopPageInfo(data);
						}
					});			
				}
			});
			}
		});
	}

//获取查询参数
function getShopParams(page){
	var params = new Object();
	if(page == undefined){
		page = 0;
	}
	params.page = page;
	params.num = 20;
	params.statusCode=$(".chooseThisType").attr("statuscode");
	params.itemId = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .itemId').val());
	params.itemBarcode = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .itemBarcode').val());
	params.categoryId = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .categoryId').val());
	params.brandName = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .brandName').val());
	params.country = $('.electricity_supplier_goods_manage .search_input_fillin .country').val();
	params.reamTitle = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .reamTitle').val());
	params.createUserName = $.trim($('.electricity_supplier_goods_manage .search_input_fillin .createUserName').val());
	
	params.lowStock = $.trim($('.electricity_supplier_goods_manage .search_input_second .Rest_first').val());
	params.highStock = $.trim($('.electricity_supplier_goods_manage .search_input_second .Rest_second').val());
	params.startTime = $('.electricity_supplier_goods_manage .search_input_second .search_time_first').val();
	params.endTime = $.trim($('.electricity_supplier_goods_manage .search_input_second .search_time_second').val());
	var data= new Array();
	$(".orderByStr").each(function(index, element) {
		var obj= new Object();
       	obj.name=$(this).attr("name");
		obj.value=$(this).attr("value");
		data.push(obj);
    }); 
	params.orderByStr = JSON.stringify(data);
	
	return params;
}
function initShopPageInfo(data){
	console.log(data)
	var str='';
	 $(".main_body_table_main").attr("page",data.data.currnetPageNum);
	for(var i=0;i<data.data.pageData.length;i++){
		str+='<tr classId="'+data.data.pageData[i].itemId+'" categoryId="'+data.data.pageData[i].categoryId+'">'
						   +'<td style="padding-left: 10px;" class="maian_body_fist_child">'
							+   '<div>'
							+       '商品编码:<span class="this_goods_id">'+data.data.pageData[i].itemId+'</span>'
							+       '类目:<span>'+data.data.pageData[i].categoryName+'</span>'
							+ 	'</div>'
							+   '<div class="picture_add_wenzi">'
							+       '<input type="checkbox" name="/" class="checkbox_botton">'
							+       '<img src="'+data.data.pageData[i].imgUrl+'" class="controller_picture_small">'
							+      '<div class="controller_wenzi_second" title="'+data.data.pageData[i].reamTitle+'">'+data.data.pageData[i].reamTitle+'</div>'
							+       '<div class="dingwei_pinpai_chandi" title="'+data.data.pageData[i].brandName+'/'+data.data.pageData[i].country+'">'
							+           '<span>'+data.data.pageData[i].brandName+'</span>/'
							+           '<span>'+data.data.pageData[i].country+'</span>'
							+       '</div>'
							+   '</div>'
						   +'</td>'
						   +'<td>'+data.data.pageData[i].salePrice+'</td>'
						   +'<td>'
						   +   '<span class="chucun_number">'+data.data.pageData[i].totalStockQuantity+'</span>'
						   +'</td>'
						   +'<td>'+data.data.pageData[i].stockQuantity+'</td>';
						   if(data.data.pageData[i].putonTime != null){
							   str+= '<td>'+new Date(data.data.pageData[i].putonTime).format("yyyy-MM-dd hh:mm:ss")+'</td>' ;  
							}else{
								str+= '<td></td>';
							}
						   if(data.data.pageData[i].putoffTime != null){
							   str+=  '<td>'+new Date(data.data.pageData[i].putoffTime).format("yyyy-MM-dd hh:mm:ss")+'</td>';
							}else{
								str+= '<td></td>';
							}
						   str+= '<td>'
						   +   '<span class="zhangcao_number">'+data.data.pageData[i].seedNum+'</span>'
							+   '<div class="look_changchao_number" comodityid="'+data.data.pageData[i].itemId+'">'
							+       '<img src="./images/img_show.png" style="width: 30px; vertical-align: middle;">'
							+       '<span>查看</span>'
							+   '</div>'
						   +'</td>';
						   
							if( data.data.pageData[i].isPuton=="0"){
						  	 	str+='<td>未上架</td>';
							}else if( data.data.pageData[i].isPuton=="1"){
						  	 	str+='<td>自主上架</td>';
							}else if( data.data.pageData[i].isPuton=="2"){
						  	 	str+='<td>自主下架</td>';
							}
							
						    str+='<td style="width: 120px;" class="zengjia_position" classid="'+data.data.pageData[i].itemId+'">'
						    if(data.data.pageData[i].isPuton =="2" && data.data.pageData[i].isShow =="0"){
								str+='<div class="showInH5Box">'
							+      '<img src="./images/show.png" class="controller_my_picture_size">'
							+       '<span class="showInH5" itemId="'+data.data.pageData[i].itemId+'" isShow="0">在前端展示</span>'
							+   '</div>';
							}else if(data.data.pageData[i].isPuton =="2" && data.data.pageData[i].isShow =="1"){
								str+='<div class="showInH5Box">'
							+      '<img src="./images/notshow.png" class="controller_my_picture_size">'
							+       '<span class="showInH5" itemId="'+data.data.pageData[i].itemId+'" isShow="1">不在前端展示</span>'
							+   '</div>';
							}
							str+='<div class="caozuo_one">'
							+      '<img src="./images/img_gai.png" class="controller_my_picture_size">'
							+       '<span class="zengjia_pointer">商品编辑</span>'
							+   '</div>'
							+   '<div class="caozuo_two">'
							+       '<img src="./images/look_icon.jpg" class="controller_my_picture_size">'
							+       '<span class="look_pingjia" itemId="'+data.data.pageData[i].itemId+'">查看评论</span>'
							+   '</div>'
							+   '<div class="caozuo_three">'
							+       '<img src="./images/look_icon.jpg" class="controller_my_picture_size">'
							+       '<span class="LookInH5" itemId="'+data.data.pageData[i].itemId+'">查看商品</span>'
							+   '</div>'
						   +'</td>'
						   +'<td class="electricity_Creator">'+data.data.pageData[i].createUserName+'</td>';
						   if(data.data.pageData[i].editUserName != null){
							   str+= '<td class="electricity_Modify">'+data.data.pageData[i].editUserName+'</td>' ;  
							}else{
								str+= '<td></td>';
							}
						str+= '</tr>';
	}
	$('.controller_first .goto_page_box').attr("totnum",data.data.totalPageNum);
	$('.controller_first .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
   $(".main_body_table_main tbody tr").remove()
   $(".main_body_table_main tbody").append(str)
}	
/*商品统计信息：就上面的数量填写*/
	function getItemStatInfo(){
		$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemStatInfo/3.1.0',function(data){
			var data=$.parseJSON(data);
			var str='<span class="pointer_common" statusCode="0">'
					+'<span class="Altogether_goods">总商品</span>:'
					+'<span class="Altogether_goods_number color_common">'+data.data.totalNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="1">'
					+'<span class="Conduct_showing_goods">在售中商品</span>:'
					+'<span class="Conduct_showing_goods_number color_common">'+data.data.onSaleNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="2">'
					+' <span class="wating_margincall_goods">待补仓商品</span>:'
					+'<span class="wating_margincall_goods_number color_common">'+data.data.coverNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="3">'
					+'<span class="Forsale_goods">待售商品</span>:'
					+'<span class="Forsale_goods_number color_common">'+data.data.forSaleNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="4">'
					+'<span class="Plantingrass_goods">种草商品</span>:'
					+'<span class="Plantingrass_goods_number color_common">'+data.data.seedingNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="5">'
					+'<span class="forbid_shop_goods">未上架不可购买商品</span>:'
					+'<span class="forbid_shop_goods_number color_common">'+data.data.putOffNum+'</span>'
				+'</span>'
				+'<span class="pointer_common" statusCode="6">'
					+'<span class="Expired_goods">保质期逾期商品</span>:'
					+'<span class="Expired_goods_number color_common">'+data.data.pastDueNum+'</span>'
				+'</span>'
			$(".electricity_adopt_find").html("")
			$(".electricity_adopt_find").html(str)
		})
	}
 //点击预览
    function onClickLookGood(del) {
        var str ='';
		var ok = del;
        $('.article_preview').remove();
        $('body').append('<div class="article_preview"><div class="preEffect" ><select class="selectSize">' +
            '<option value ="414_736">iPhone 6Plus(宽414px,高736px)</option>' +
            '<option value ="375_667">iPhone 6(宽375px,高667px)</option>' +
            '<option value="320_568">iPhone 5(宽320px,高568px)</option>' +
            '<option value="360_640">Galaxy S5(宽360px,高640px)</option>' +
            '</select><div class="exit-preview">点击退出预览</div>' +
            '<div class="preResult" ></div></div></div>');
			$.get('<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getItemDetail/3.1.0',{itemId:ok.attr('itemId')},function(data){
				var data = $.parseJSON(data);
				console.log(data)
				if(data.code == 0){
					var str='';
					str+='<div class="swiper-container containerMain"><div class="swiper-wrapper">';
					var imgArry=data.data.headImgs;
					for(var i in imgArry){
						str+='<div class="swiper-slide"><img src="'+imgArry[i].url+'"></div>';
					} 
					str+='<div class="swiper-pagination"></div></div>';
					if(data.data.salePrice==""){
						str+='<div class="goodsIntroducePart"><li class="firstTitle threrCommon">'+data.data.mainTitle+'</li><li class="secondTitle threrCommon">'+data.data.reamTitle+'</li><li class="price_contro threrCommon"><span class="price_header">￥</span><span class="price_money"></span></li></div>';
					}else{
						str+='<div class="goodsIntroducePart"><li class="firstTitle threrCommon">'+data.data.mainTitle+'</li><li class="secondTitle threrCommon">'+data.data.reamTitle+'</li><li class="price_contro threrCommon"><span class="price_header">￥</span><span class="price_money">'+data.data.salePrice+'</span></li></div>';
					}
					str+='<div class="goodsPicAndPara"><li class="goodsPicture goodsPicAndParaCommon on">图片详情</li><li class="goodsParameter goodsPicAndParaCommon">商品参数</li></div>';
					
					str+='<div class="goodsIntroducePicAndPara"><div class="goodsPictureChild">';
					
					$.each(data.data.itemDetail,function(key,val){
						if(val.type == 1){//标题
							str+='<h3>'+val.content+'</h3>';
						}else if(val.type == 2 ){//段落
							str+='<p style=" padding:5px; box-sizing:border-box;">'+val.content+'</p>';
						}else if(val.type == 3){//图片
							str+='<img src="'+val.content+'" style=" width:100%;padding: 5px; box-sizing: border-box;" />';
						}
					});
					//str+='<span class="goodsIntroducePicAndPara_child">'+data.data.comment.content+'</span>';
					str+='</div><div class="goodsParameterChild">';
					var key_value=data.data.properties;
					for(var i=0;i<key_value.length;i++){
						str+='<li><span class="goodsParameterChild_nature">'+key_value[i].keyName+'</span><span class="goodsParameterChild_value first_value">'+key_value[i].value+'</span></li>'
					}
					str+='</div></div>';
					str+='</div>';
					$('.preResult').append(str);
					$('.preResult').append('<div class="openApp">打开APP购买</div>');
				}else{
					alert(data.data.error);	
				}	
			});				
	
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
	//创建新的编辑器
	function shopGoodEdit(){
		$('.title_duanluo_picture .editor_content').createArticleEditor({
				elements: ['paragraph', 'title', 'image',],
				data:[{type:2,content:''}],//初始化内容
				defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
			});
	}
//获取全部评论查询参数
function getCommentsParams(page){
	var params = new Object();
	if(page == undefined){
		page = 0;
	}
	params.page = page;
	params.num = 20;
	params.isComment=$(".shope_evaluate_manage .allShopComments .select_Comment option:selected").attr("value");
	params.lineStatus = $('.shope_evaluate_manage .allShopComments .select_onlineStatus option:selected').attr("value");
	params.nickName = $.trim($('.shope_evaluate_manage .allShopComments .evaluateManagement_name').val());
	params.itemName = $.trim($('.shope_evaluate_manage .allShopComments .evaluateManagement_shop').val());
	params.beginBrandTime = $('.shope_evaluate_manage .allShopComments .evaluateManagement_start').val();
	params.endBrandTime = $('.shope_evaluate_manage .allShopComments .evaluateManagement_end').val();
	params.publicTimeSign=$(".shope_evaluate_manage .allShopComments .publicTimeSign").attr("value");
	return params;
}
/*获取全部评论*/
function getItemComments(){
	var params = getCommentsParams();
	if(typeof($(".allShopComments").attr("page")) != "undefined"){
		params.page = $(".allShopComments").attr("page");
	}
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getItemComments/3.1.0',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
		initItemComments(data);
		$(".allShopComments .tcdPageCode").createPage({
			pageCount:parseInt(data.data.totalPageNum),
			current:parseInt(data.data.currnetPageNum),
			backFn:function(p){
				params.page = p;
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getItemComments/3.1.0',
					type : 'get',
					dataType : 'json',
					data: params,
					success : function(data){
						initItemComments(data);
					}
				});			
			}
		});
		}
	});	
}
function initItemComments(data){
	var Character_string_contact=String();
	for(var i=0;i<parseInt(data.data.pageData.length);i++){
		var onlineStatus='';
		if(data.data.pageData[i].lineStatus=="0"){
			onlineStatus="待上线"
		}else if(data.data.pageData[i].lineStatus=="1"){
			onlineStatus="已上线"
		}else if(data.data.pageData[i].lineStatus=="2"){
			onlineStatus="已下线"
		}
		var reply='';
		var huifuBtn='';
		if(data.data.pageData[i].isReply=="1"){
			huifuBtn='<img class="management_tubiao_huifu" style="display:inline-block;" src="./images/huifu.png"><span class="management_Summary_comment_callback">回复</span>';
			reply='<tr class="dianjia_huifu"><td></td><td><span class="huifu_time">'+data.data.pageData[i].replyTime+'</span></td><td></td><td><span class="maijia_guniang">卖家（南瓜姑娘）</span></td><td><span class="huifu_neirong">'+data.data.pageData[i].replyContent+'</span></td><td></td><td replyId="'+data.data.pageData[i].replyId+'"><span class="dislay_inlineblock danduqiming"><img src="./images/img_gai.png"></span><span class="dislay_inlineblock management_edit" replyId="'+data.data.pageData[i].replyId+'">编辑</span><span class="dislay_inlineblock"><img src="./images/remove.png"></span><span class="dislay_inlineblock management_remove">删除</span></td></tr>';
		}else{
			huifuBtn='<img class="management_tubiao_huifu click_callback" style="display:inline-block;" src="./images/huifu.png"><span class="management_Summary_comment_callback click_callback">回复</span>';
		}
		var images='';
		if(data.data.pageData[i].imgsUrl[0]==null){
			images ='';
		}else{
			images ='<img class="tupianSizeTwo" src="'+data.data.pageData[i].imgsUrl[0]+'">';
		}
			Character_string_contact+='<tr classid="'+data.data.pageData[i].commentId+'"  ><td><input type="checkbox" class="management_Summary_comment_checkbox"><span class="management_Summary_comment_number">'+data.data.pageData[i].commentId+'</span></td><td class="management_Summary_comment_time">'+data.data.pageData[i].commentAuditTime+'</td><td class="management_Summary_comment_mianmo"><span class="management_miaomo">'+data.data.pageData[i].itemName+'(型号:'+data.data.pageData[i].skuName+')</span><br><span class="look_tanchuang"><img classid="'+data.data.pageData[i].orderSkuId+'" class="tupianSize" src="./images/Check.png"></span></td><td class="management_xingming">'+data.data.pageData[i].nickName+'</td><td class="management_Summary_comment_people"><span>'+data.data.pageData[i].content+'</span><br><span>'+images+'</span></td><td class="look_shangxiaxianstate">'+onlineStatus+'</td><td class="controller_huifu_shanchu_ohohoh" style="margin-top: 0px;text-align: left;">'+huifuBtn+'<br><img class="management_tubiao_huifu click_remove" style="display:inline-block;" src="./images/remove.png"><span class="management_Summary_comment_remove click_remove">删除</span><br><img class="management_tubiao_huifu click_lookAll" style="display:inline-block;" src="./images/Check.png"><span class="management_Summary_comment_allComment lookAll" itemId="'+data.data.pageData[i].itemId+'" commentId="'+data.data.pageData[i].commentId+'">查看全部评论</span></td></tr>'+reply;
		
	}
	$('.allShopComments .management_Summary_comment .first_tbody').html(Character_string_contact)
	var pingjia_state=$('.look_shangxiaxianstate');
	for(var i=0;i<pingjia_state.length;i++){
		if($(pingjia_state[i]).html()=="待上线" ){
			$(pingjia_state[i]).css('color',"#D54F40")
		}
	}	
	$(".allShopComments .goto_page_box").attr("totnum",data.data.totalPageNum);
	$('.allShopComments .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
}
//清除全部评价搜索数据
function clearComments(){
	$(".shope_evaluate_manage .select_Comment option:eq(0)").attr("selected","selected");
	$(".shope_evaluate_manage .select_onlineStatus option:eq(0)").attr("selected","selected");
	$('.shope_evaluate_manage input[type="text"]').val('');
}

/*//获取某一评论查询参数
function getSingleCommentsParams(page){
	var params = new Object();
	if(page == undefined){
		page = 0;
	}
	params.page = page;
	params.num = 20;
	params.isComment=$(".shope_evaluate_manage .singleShopComments .select_Comment option:selected").attr("value");
	params.lineStatus = $('.shope_evaluate_manage .singleShopComments .select_onlineStatus option:selected').attr("value");
	params.nickName = $.trim($('.shope_evaluate_manage .singleShopComments .evaluateManagement_name').val());
	params.itemName = $.trim($('.shope_evaluate_manage .singleShopComments .evaluateManagement_shop').val());
	params.beginBrandTime = $('.shope_evaluate_manage .singleShopComments .evaluateManagement_start').val();
	params.endBrandTime = $('.shope_evaluate_manage .singleShopComments .evaluateManagement_end').val();
	params.itemId=$('.shope_evaluate_manage .singleShopComments').attr("itemId");
	return params;
}
//获取全部评论
function getSingleComments(){
	var params = getSingleCommentsParams();
	if(typeof($(".singleShopComments").attr("page")) != "undefined"){
		params.page = $(".singleShopComments").attr("page");
	}
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getSingleItemComments/3.1.0',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
		initSingleComments(data);
		$(".singleShopComments .tcdPageCode").createPage({
			pageCount:parseInt(data.data.totalPageNum),
			current:parseInt(data.data.currnetPageNum),
			backFn:function(p){
				params.page = p;
				$.ajax({
					url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/getSingleItemComments/3.1.0',
					type : 'get',
					dataType : 'json',
					data: params,
					success : function(data){
						initSingleComments(data);
					}
				});			
			}
		});
		}
	});	
}
function initSingleComments(data){
	var data_store=String();
	$(".singleShopComments .management_Summary_comment .second_tbodys").empty();
	for(var i=0;i<data.data.pageData.length;i++){
		var commentStatus='';
		if(data.data.pageData[i].commentStatus=="0"){
			commentStatus="未评论"
		}else if(data.data.pageData[i].commentStatus=="1"){
			commentStatus="已评论"
		}
		var onlineStatus='';
		if(data.data.pageData[i].lineStatus=="0"){
			onlineStatus="待上线"
		}else if(data.data.pageData[i].lineStatus=="1"){
			onlineStatus="已上线"
		}else if(data.data.pageData[i].lineStatus=="2"){
			onlineStatus="已下线"
		}
		var reply='';
		var huifuBtn='';
		if(data.data.pageData[i].isReply=="1"){
			huifuBtn='<span class="management_Summary_comment_callback">回复</span>';
			reply='<tr class="dianjia_huifu"><td></td><td><span class="huifu_time">'+data.data.pageData[i].replyTime+'</span></td><td></td><td><span class="maijia_guniang">卖家（南瓜姑娘）</span></td><td><span class="huifu_neirong">'+data.data.pageData[i].replyContent+'</span></td><td></td><td replyId="'+data.data.pageData[i].replyId+'"><span class="dislay_inlineblock danduqiming"><img src="./images/img_gai.png"></span><span class="dislay_inlineblock management_edit" replyId="'+data.data.pageData[i].replyId+'">编辑</span><span class="dislay_inlineblock"><img src="./images/remove.png"></span><span class="dislay_inlineblock management_remove">删除</span></td></tr>';
		}else{
			huifuBtn='<span class="management_Summary_comment_callback click_callback">回复</span>';
		}
		data_store+='<tr style="position:relative" classid="'+data.data.pageData[i].commentId+'"  ><td><input type="checkbox" class="management_Summary_comment_checkbox"><span class="management_Summary_comment_number">'+data.data.pageData[i].commentId+'</span></td><td class="management_Summary_comment_time">'+data.data.pageData[i].commentAuditTime+'</td><td class="management_Summary_comment_mianmo"><span class="management_miaomo">'+data.data.pageData[i].itemName+'(型号:'+data.data.pageData[i].skuName+')</span><br><span class="look_tanchuang"><img classid="'+data.data.pageData[i].orderSkuId+'" class="tupianSize" src="./images/Check.png"></span></td><td class="management_xingming">'+data.data.pageData[i].nickName+'</td><td class="look_shangxiaxianstate">'+commentStatus+'</td><td class="management_Summary_comment_people">'+data.data.pageData[i].commentStatus+'<span>'+data.data.pageData[i].content+'</span><br><span><img class="tupianSizeTwo" src="'+data.data.pageData[i].imgsUrl[0]+'"></span></td><td class="look_shangxiaxianstate">'+onlineStatus+'</td><td class="controller_huifu_shanchu_ohohoh" style="margin-top: 0px;text-align: left;"><img class="management_tubiao_huifu click_callback" style="display:inline-block;" src="./images/huifu.png">'+huifuBtn+'<br><img class="management_tubiao_huifu click_remove" style="display:inline-block;" src="./images/remove.png"><span class="management_Summary_comment_remove click_remove">删除</span><br><span class="zhiding_pingliun" style="margin-left:45px;">置顶评论</span></td></tr>'+reply;
			}
	$(".singleShopComments .management_Summary_comment .second_tbodys").append(data_store)
	
	var pingjia_state=$('.look_shangxiaxianstate');
	for(var i=0;i<pingjia_state.length;i++){
		if($(pingjia_state[i]).html()=="待上线" ||$(pingjia_state[i]).html()=="未评论"){
			$(pingjia_state[i]).css('color',"#D54F40")
		}
	}	
	$(".singleShopComments .goto_page_box").attr("totnum",data.data.totalPageNum);
	$('.singleShopComments .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
}*/
//清除某一评价搜索数据
function clearSingleComments(){
	$(".shope_evaluate_manage .singleShopComments .select_Comment option:eq(0)").attr("selected","selected");
	$(".shope_evaluate_manage .singleShopComments .select_onlineStatus option:eq(0)").attr("selected","selected");
	$('.shope_evaluate_manage .singleShopComments input[type="text"]').val('');
	$(".singleShopComments").removeAttr("page");
}
//获取排序评论查询参数
function getOrderCommentsParams(page){
	var params = new Object();
	if(page == undefined){
		page = 0;
	}
	params.page = page;
	params.num = 20;
	params.isComment=$(".shope_evaluate_manage .singleShopComments .select_Comment option:selected").attr("value");
	params.lineStatus = $('.shope_evaluate_manage .singleShopComments .select_onlineStatus option:selected').attr("value");
	params.nickName = $.trim($('.shope_evaluate_manage .singleShopComments .evaluateManagement_name').val());
	params.itemName = $.trim($('.shope_evaluate_manage .singleShopComments .evaluateManagement_shop').val());
	params.beginBrandTime = $('.shope_evaluate_manage .singleShopComments .evaluateManagement_start').val();
	params.endBrandTime = $('.shope_evaluate_manage .singleShopComments .evaluateManagement_end').val();
	params.commentId=' ';
	params.itemId=$('.shope_evaluate_manage .singleShopComments').attr("itemId");
	params.toExchangeCommentId=' ';
	return params;
}
/*页面刷新*/
function myrefresh()
{
   window.location.reload();
}
/*获取排序评论*/
function getOrderComments(){
	var params = getOrderCommentsParams();
	if(typeof($(".singleShopComments").attr("page")) != "undefined"){
		params.page = $(".singleShopComments").attr("page");
	}
	console.log(params.page);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
		type : 'post',
		dataType : 'json',
		data: params,
		success : function(data){
			$(".singleShopComments").attr("page",data.data.currnetPageNum);
			initOrderComments(data);
			$(".singleShopComments .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					params.page = p;
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/comment/sortComment/3.1.0',
						type : 'post',
						dataType : 'json',
						data: params,
						success : function(data){
							initOrderComments(data);
						}
					});			
				}
			});
		}
	});	
}
function initOrderComments(data){
	var data_store=String();
	$(".singleShopComments").attr("page",data.data.currnetPageNum);
	$(".singleShopComments .management_Summary_comment .second_tbodys").empty();
	for(var i=0;i<data.data.pageData.length;i++){
		var onlineStatus='';
		if(data.data.pageData[i].lineStatus=="0"){
			onlineStatus="待上线"
		}else if(data.data.pageData[i].lineStatus=="1"){
			onlineStatus="已上线"
		}else if(data.data.pageData[i].lineStatus=="2"){
			onlineStatus="已下线"
		}
		var reply='';
		var huifuBtn='';
		if(data.data.pageData[i].isReply=="1"){
			huifuBtn='<img class="management_tubiao_huifu" style="display:inline-block;" src="./images/huifu.png"><span class="management_Summary_comment_callback">回复</span>';
			reply='<tr class="dianjia_huifu"><td></td><td><span class="huifu_time">'+data.data.pageData[i].replyTime+'</span></td><td></td><td><span class="maijia_guniang">卖家（南瓜姑娘）</span></td><td><span class="huifu_neirong">'+data.data.pageData[i].replyContent+'</span></td><td></td><td replyId="'+data.data.pageData[i].replyId+'"><span class="dislay_inlineblock danduqiming"><img src="./images/img_gai.png"></span><span class="dislay_inlineblock management_edit" replyId="'+data.data.pageData[i].replyId+'">编辑</span><span class="dislay_inlineblock"><img src="./images/remove.png"></span><span class="dislay_inlineblock management_remove">删除</span></td></tr>';
		}else{
			huifuBtn='<img class="management_tubiao_huifu click_callback" style="display:inline-block;" src="./images/huifu.png"><span class="management_Summary_comment_callback click_callback">回复</span>';
		}
		var shouleShow='';
		if($(".singleShopComments .management_controller_sort .finish").hasClass("hidden")){
			if(i==0){
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort"><img src="images/img_arr_down.png" class="let_it_downknow sort hidden"><br/>';
			}else if(i==data.data.pageData.length-1){
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort"><img src="images/img_arr_up.png" class="let_it_upknow sort hidden"><br/>';
			}else{
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort"><img src="images/img_arr_up.png" class="let_it_upknow sort hidden"><br/><img src="images/img_arr_down.png" class="let_it_downknow sort hidden"><br/>';
			}
		}else{
			if(i==0){
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort hidden"><img src="images/img_arr_down.png" class="let_it_downknow sort"><br/>';
			}else if(i==data.data.pageData.length-1){
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort hidden"><img src="images/img_arr_up.png" class="let_it_upknow sort"><br/>';
			}else{
				shouleShow='<input type="checkbox" class="management_Summary_comment_checkbox notsort hidden"><img src="images/img_arr_up.png" class="let_it_upknow sort"><br/><img src="images/img_arr_down.png" class="let_it_downknow sort"><br/>';
			}
		}
		var images='';
		if(data.data.pageData[i].imgsUrl[0]==null){
			images ='';
		}else{
			images ='<img class="tupianSizeTwo" src="'+data.data.pageData[i].imgsUrl[0]+'">';
		}
		data_store+='<tr style="position:relative" classid="'+data.data.pageData[i].commentId+'"  ><td class="first_none_click_block">'+shouleShow+'<span class="management_Summary_comment_number">'+data.data.pageData[i].commentId+'</span></td><td class="management_Summary_comment_time">'+data.data.pageData[i].commentAuditTime+'</td><td class="management_Summary_comment_mianmo"><span class="management_miaomo">'+data.data.pageData[i].itemName+'(型号:'+data.data.pageData[i].skuName+')</span><br><span class="look_tanchuang"><img classid="'+data.data.pageData[i].orderSkuId+'" class="tupianSize" src="./images/Check.png"></span></td><td class="management_xingming">'+data.data.pageData[i].nickName+'</td><td class="management_Summary_comment_people"><span>'+data.data.pageData[i].content+'</span><br><span>'+images+'</span></td><td class="look_shangxiaxianstate">'+onlineStatus+'</td><td class="controller_huifu_shanchu_ohohoh" style="margin-top: 0px;text-align: left;">'+huifuBtn+'<br><img class="management_tubiao_huifu click_remove" style="display:inline-block;" src="./images/remove.png"><span class="management_Summary_comment_remove click_remove">删除</span></td></tr>'+reply;
			}
	$(".singleShopComments .management_Summary_comment .second_tbodys").append(data_store)
	
	var pingjia_state=$('.look_shangxiaxianstate');
	for(var i=0;i<pingjia_state.length;i++){
		if($(pingjia_state[i]).html()=="待上线" ){
			$(pingjia_state[i]).css('color',"#D54F40")
		}
	}	
	$(".singleShopComments .goto_page_box").attr("totnum",data.data.totalPageNum);
	$('.singleShopComments .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
}
//购物须知
function getOptionalLabelAndBuyerReading1(){
	$(".shopping_need_know_one").empty();
	$(".shopping_need_know_two_position").children(".duanluo_div_haalo1").remove();
	
	/*$('.duanluo_div_haalo2 .editor_content1').createArticleEditor({
			elements: ['paragraph'],
			data:[{type:2,content:''}],//初始化内容
			defaultData:[{type:2,content:''}]//编辑器为空时,默认的元素
		});*/
	$.get("<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getOptionalLabelAndBuyerReading/3.1.0",function(data){
			
			var data=$.parseJSON(data)
			
			for(var i=0;i<data.data.itemLables.length;i++){
				$(".shopping_need_know_one").append('<div class="shopping_need_know_one_iuyChildre" labelId="'+data.data.itemLables[i].labelId+'"><input type="checkbox" class="shopping_need_know_input"labelId="'+data.data.itemLables[i].labelId+'" /><span>标签图标</span><span class="qouendzkfse">'+data.data.itemLables[i].shortWord+'</span><img src="'+data.data.itemLables[i].imgUrl+'" alt="" class="shopping_baoyou" /></div>')
			}
			var shopping_need_know_one_array=$(".shopping_need_know_one_iuyChildre input[type=checkbox]")
			var str_buyerReading='';
			var buyerReading=data.data.buyerReading;
			for(var i=0;i<data.data.buyerReading.length;i++){
				str_buyerReading+='<div class="duanluo_div_haalo duanluo_div_haalo1" templateId="'+buyerReading[i].templateId+'">'
				str_buyerReading+='<input type="radio" name="chooseKnow" class="chooseKnow" value=""><div class=" editor_content editor_content'+i+'">';
				str_buyerReading+='</div></div>'	
			}
			$(".shopping_need_know_two_position .duanluo_div_haalo2").before(str_buyerReading)
			for(var i=0;i<data.data.buyerReading.length;i++){	
				needKnowDetail1(buyerReading.length,buyerReading)
				$(".shopping_need_know_two_position .duanluo_div_haalo1 .articlebox").remove();
				$(".shopping_need_know_two_position .duanluo_div_haalo1 .editor_content").children().children().attr("contenteditable","false");
				$(".shopping_need_know_two_position .duanluo_div_haalo1 .editor_content").children().attr("contenteditable","false");
			}
		})
}
//获取商品种草帖子列表
//清除某一评价搜索数据
function clearSeedingPostList(){
	$(".shope_evaluate_manage .singleShopComments .select_Comment option:eq(0)").attr("selected","selected");
	$(".shope_evaluate_manage .singleShopComments .select_onlineStatus option:eq(0)").attr("selected","selected");
	$('.shope_evaluate_manage .singleShopComments input[type="text"]').val('');
	$(".singleShopComments").removeAttr("page");
}
//获取排序评论查询参数
function getSeedingData(page){
	var params = new Object();
	if(page == undefined){
		page = 0;
	}
	params.page = page;
	params.num = 20;
	params.itemId=$(".electricity_supplier_goods_manage .goods_newCrease_edit").attr("itemId"),
	params.columnId = $('.electricity_supplier_goods_manage .datas .columnNameId option:selected').attr("value");
	params.postType =  $('.electricity_supplier_goods_manage .datas .postType option:selected').attr("value");
	params.postId = $.trim($('.electricity_supplier_goods_manage .datas .postId').val());
	params.title = $('.electricity_supplier_goods_manage .datas .title').val();
	params.nickName = $('.electricity_supplier_goods_manage .datas .nickName').val();
	params.startTime=$('.electricity_supplier_goods_manage .datas .pstartTime').val();
	params.endTime=$('.electricity_supplier_goods_manage .datas .pendTime').val();
	return params;
}
/*获取排序评论*/
function getSeedingPostDetail(){
	var params = getSeedingData();
	if(typeof($(".abouting_goods_Posts_children_two").attr("page")) != "undefined"){
		params.page = $(".abouting_goods_Posts_children_two").attr("page");
	}
	console.log(params.page);
	$.ajax({
		url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getSeedingPostList/3.1.0',
		type : 'get',
		dataType : 'json',
		data: params,
		success : function(data){
			$(".abouting_goods_Posts_children_two").attr("page",data.data.currnetPageNum);
			getSeedingPostList(data);
			$(".abouting_goods_Posts_children_two_biaoge .tcdPageCode").createPage({
				pageCount:parseInt(data.data.totalPageNum),
				current:parseInt(data.data.currnetPageNum),
				backFn:function(p){
					params.page = p;
					$.ajax({
						url : '<%= CLI_HOST_API_URL %>/nggirl-web/web/admin/item/getSeedingPostList/3.1.0',
						type : 'get',
						dataType : 'json',
						data: params,
						success : function(data){
							getSeedingPostList(data);
						}
					});			
				}
			});
		}
	});	
}
function getSeedingPostList(data){
	var data_store=String();
	$(".abouting_goods_Posts_children_two_biaoge").attr("page",data.data.currnetPageNum);
	$(".abouting_goods_Posts_children_two_biaoge .bouting_goods_Posts_table .dongtai_store_tr").empty();
	var str='';
	for(var i=0;i<data.data.pageData.length;i++){
		var isSelected='';
		if(data.data.pageData[i].isSelected == "0"){
			isSelected='<button class="choice_ture_iknow" style="background: green;color: white">选中</button>';
		}else if(data.data.pageData[i].isSelected == "1"){
			isSelected='<button  class="choice_cuowu_iknow" style="background: red;color: white">取消选中</button>';
		}
		var postType='';
		if(data.data.pageData[i].postType == "1"){
			postType='文章';
		}else if(data.data.pageData[i].postType == "2"){
			postType='视频';
		}
		str+='<tr><td>'+data.data.pageData[i].postId+'</td><td>'+postType+'</td><td>'+data.data.pageData[i].columnName+'</td><td>'+data.data.pageData[i].title+'</td><td>'+data.data.pageData[i].nickName+'</td><td>'+isSelected+'</td></tr>'
	}
	$(".dongtai_store_tr").html(str);
	$(".abouting_goods_Posts_children_two_biaoge .goto_page_box").attr("totnum",data.data.totalPageNum);
	$('.abouting_goods_Posts_children_two_biaoge .goto_page_box .totNum').text(data.data.totalNum).css("color","#f00");
}