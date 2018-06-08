// JavaScript Document
$(function(){
			var provinceId='';
			var cityId='';
			var districtId='';
			$(".btn").live("click",function(){
				var isDefault=0;
				if($(".defult").hasClass("on")){
					isDefault=1
				}
				$.post('<%= UGC_HOST_API_URL %>/nggirl/app/cli/item/address/addUserAddress/3.1.0',getFinalRequestObject({accessToken: getAccessToken(),consignee:$(".consignee input").val(),contact:$(".contact input").val(),provinceId:provinceId,cityId:cityId,districtId:districtId,betterAddress:$(".detAdd input").val(),isDefault:isDefault}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						window.location.href="new_goods_address.html";
					}else{
						$(".tipBox").html(data.data.error).fadeIn(100).delay(1000).fadeOut(400);
					}
				});
			})
			$(".tipBox").css("top",($(window).height()-$(".tipBox").height()-60)/2);
			$(".tipBox").css("left",($(window).width()-$(".tipBox").width()-84)/2);
			$(".message input").live("change",function(){
				var i =0;
				$(".message input").each(function(index, element) {
					if($(this).val() !=""){
						i++;
					}else{
						i--;
						return false;
					}
				});	
				if(i == 4){
					$(".btn").css("color","#EE750C");
				}else{
					$(".btn").css("color","#9a9a9a");
				}
			})
			
			$(".message .address").live("click",function(){
				$(".dis").blur();
				$(".box,.shadow").show();
			})
			$(".cityTit .close,.shadow").live("click",function(){
				$(".box,.shadow").hide();
			})
			$(".cityTit .sure").live("click",function(){
				if($(".area").html() == "请选择" || $(".city").html() == "请选择"){
					$(".box,.shadow").hide();
				}else{
					$(".box,.shadow").hide();
					$(".address input").val($(".selector p .pro").text()+" "+$(".selector p .city").text()+" "+$(".selector p .area").text());
					provinceId=$(".selector .pro").attr("provinceId");
					cityId=$(".selector .city").attr("cityId");
					districtId=$(".selector .area").attr("districtId");
				}
			})
			getPro();
			$(".province p").live("click",function(){
				$(this).addClass("selt");
				$(this).siblings().removeClass("selt");
				$(".selector .pro").attr("provinceId",$(this).attr("provinceId"));
				$(".selector .pro").html($(this).html()).removeClass("wait").removeClass("wait1");
				$(".selector .city").html("请选择").removeClass("hidden").addClass("wait").addClass("wait1");
				$(".selector .area").hide();
				getCity($(this).attr("provinceId"))
			})
			$(".cityBox p").live("click",function(){
				$(this).addClass("selt");
				$(this).siblings().removeClass("selt");
				$(".selector .city").attr("cityId",$(this).attr("cityId"));
				$(".selector .city").html($(this).html()).removeClass("wait").removeClass("wait1");
				getArea($(this).attr("cityId"))
			})
			$(".areaBox p").live("click",function(){
				$(this).addClass("selt");
				$(this).siblings().removeClass("selt");
				$(".selector .area").attr("districtId",$(this).attr("districtId"));
				$(".selector .area").html($(this).html()).removeClass("wait");
			})
			$(".selector p span").live("click",function(){
				$(".wait1").removeClass("wait1");
				$(this).addClass("wait1");
				if($(this).index() == 0){
					$(".box .province").show().siblings().hide();	
				}else if($(this).index() == 1){
					$(".box .cityBox").show().siblings().hide();	
				}else if($(this).index() == 2){
					$(".box .areaBox").show().siblings().hide();	
				}
			})
			$(".defult").live("click",function(){
				if($(this).hasClass("on")){
					$(this).removeClass("on");
				}else{
					$(this).addClass("on");
				}
			});
			
			function getPro(){
				$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/address/getAllProvinces/3.1.0',getFinalRequestObject(),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						var str='';
						for(var i = 0; i < data.data.length; i ++){
							str +="<p provinceId="+data.data[i].provinceId+">"+data.data[i].provinceName+"</p>";
						}
						$(".box .province").empty().show().append(str).siblings().hide();			
					}else{
						alert(data.data.error);	
					}
				});
			}
			function getCity(provinceId){
				$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/address/getAllCitiesInProvince/3.1.0',getFinalRequestObject({provinceId:provinceId}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						var str='';
						for(var i = 0; i < data.data.length; i ++){
							str +="<p cityId="+data.data[i].cityId+">"+data.data[i].cityName+"</p>";
						}
						$(".box .cityBox").empty().show().append(str).siblings().hide();			
					}else{
						alert(data.data.error);	
					}
				});
			}
			function getArea(cityId){
				$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/address/getAllDistrictsInCity/3.1.0',getFinalRequestObject({cityId:cityId}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						if(data.data.length != 0){
							var str='';
							for(var i = 0; i < data.data.length; i ++){
								str +="<p districtId="+data.data[i].districtId+">"+data.data[i].districtName+"</p>";
							}
							$(".box .areaBox").empty().show().append(str).siblings().hide();
							
							$(".selector .area").html("请选择").removeClass("hidden").addClass("wait").addClass("wait1");
							$(".selector .area").show();
						}
					}else{
						alert(data.data.error);	
					}
				});
			}
		})