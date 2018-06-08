// JavaScript Document
		$(function(){
			getUserAddresses(0);
			$(".btn").live("click",function(){
				window.location.href="new_goods_add_address.html"
			});
			$(".list-li").live("click",function(){
				window.location.href="new_goods_pay.html?addressId="+$(this).attr("addressId");
			});
			$(".list-li .delBtn").live("click",function(){
				var _this=$(this);
				$(".delThis").removeClass("delThis");
				$(this).addClass("delThis");
				$(".adin_suredel").attr("addressId",_this.parent().attr("addressId"));
				$(".ad_flbot,.ad_sure").show();
				return false;
			});
			$(".adin_suredel").live("click",function(){
				deleteUserAddress($(this).attr("addressId"));
			})
			$(".ad_notsure,.ad_flbot").live("click",function(){
				$(".ad_flbot,.ad_sure").hide();
			})
			function deleteUserAddress(_this){
				$.post('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/address/deleteUserAddress/3.1.0',getFinalRequestObject({accessToken: getAccessToken(),addressId:_this}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						$(".ad_flbot,.ad_sure").hide();
						$(".delThis").parent().remove();
					}
				});			
			}
			function getUserAddresses(pageNum){
				$.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/item/address/getUserAddresses/3.1.0',getFinalRequestObject({accessToken: getAccessToken(),pageNum:pageNum,pageSize:20}),function(data){
					var data = $.parseJSON(data);
					if(data.code == 0){
						var str='';
						for(var x = 0; x < data.data.length; x ++){
							str+='<li class="list-li" addressId="'+data.data[x].addressId+'"><span class="name">'+data.data[x].consignee+'</span><span>'+data.data[x].contact+'</span>';
							if(data.data[x].isDefault == 1){
								str+='<span class="defult">【默认】</span>';
							}
							str+='<p class="address">'+data.data[x].provinceName+data.data[x].cityName+data.data[x].districtName+data.data[x].betterAddress+'</p>';
							str+='<div class="delBtn">删除</div></li>';
							
							if( data.data.length >= 20 ){
								var tur = true;	
								var page = ++pageNum;
								$(window).scroll(function(){
									var winH = $(window).height(); //页面可视区域高度  
									var pageH = $(".box").height();  
									var scrollT = $(window).scrollTop(); //滚动条top  
									var aa = (pageH - winH - scrollT) / winH;  
									if(tur && aa < 0.02){ 
										setTimeout(function(){
										  getUserAddresses(page);
										},200);
									    tur = false;
									} 
							   });
							}
						}
						$(".box").append(str);	
						$(".delBtn").each(function(index, element) {
								$(this).css({"height":$(this).parent().height()+11,"line-height":$(this).parent().height()+11+"px"});
							});
					}else{
						alert(data.data.error);	
					}
				});
			}
		})
//滑动
window.addEventListener('load',function(){
	var initX;
	var moveX;
	var X = 0;
	var objX = 0;
	window.addEventListener('touchstart',function(event){
		//event.preventDefault();
		var obj = event.target.parentNode;
		if(obj.className == "list-li"){
			initX = event.targetTouches[0].pageX;
			objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
		}
		if( objX == 0){
			window.addEventListener('touchmove',function(event) {
				//event.preventDefault();
				var obj = event.target.parentNode;
				if (obj.className == "list-li") {
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						obj.style.WebkitTransform = "translateX(" + 0 + "px)";
					}
					else if (X < 0) {
						var l = Math.abs(X);
						obj.style.WebkitTransform = "translateX(" + -l + "px)";
						if(l>70){
							l=70;
							obj.style.WebkitTransform = "translateX(" + -l + "px)";
						}
					}
				}
			});
		}
		else if(objX<0){
			window.addEventListener('touchmove',function(event) {
				//event.preventDefault();
				var obj = event.target.parentNode;
				if (obj.className == "list-li") {
					moveX = event.targetTouches[0].pageX;
					X = moveX - initX;
					if (X > 0) {
						var r = -70 + Math.abs(X);
						obj.style.WebkitTransform = "translateX(" + r + "px)";
						if(r>0){
							r=0;
							obj.style.WebkitTransform = "translateX(" + r + "px)";
						}
					}
					else {     //向左滑动
						obj.style.WebkitTransform = "translateX(" + -70 + "px)";
					}
				}
			});
		}

	})
	window.addEventListener('touchend',function(event){
		//event.preventDefault();
		var obj = event.target.parentNode;
		if(obj.className == "list-li"){
			objX =(obj.style.WebkitTransform.replace(/translateX\(/g,"").replace(/px\)/g,""))*1;
			if(objX>-40){
				obj.style.WebkitTransform = "translateX(" + 0 + "px)";
			}else{
				obj.style.WebkitTransform = "translateX(" + -70 + "px)";
			}
		}
	 })
})