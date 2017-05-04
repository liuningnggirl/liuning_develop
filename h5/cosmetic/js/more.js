/*=====化妆师列表more1.html====*/
	$(function(){
		
		function getParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return '';
	}
var pageSize = 10;
	$(function() {
		//加载第一页
		//getMoreDressers();
		 loadDressers();
	});
	
	function loadDressers(pageNum,pageSize){
		var key = getParam('key');
		$.ajax({//采用异步
			type: "post",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/dresser/listDresserBlur/1.5.0',
			data:getFinalRequestObject({accessToken: getAccessToken(),dresserCity:"北京",key: key,page:pageNum,num:10}),
			timeout:15000,//10s
			dataType:"json",
			success: initPage,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
			//console.log( XMLHttpRequest )
			//$(".main").html("尚未发布任何信息！");
		}});
	}

	function getWorkTags2(specials){
		var str = ''; 
		var datas=specials;
		var strs= new Array(); //定义一数组 
		strs=datas.split(","); //字符分割 
		for( var t=0;t<strs.length;t++){
			str +='<p>';
			str += strs[t];
			str +='</p>';
		}
		return str;
	}

	function initPage(data){
			console.log(data);
			$('.s_btn').remove();
			//console.log(data.data);
			//console.log(data.data.dressers);
			var str = "";
			for(var i = 0,j = data.data;i<j.length;i++){
				
				//console.log(j[i]);
				str += '<div class="head02"><a href="space.html?dresserId='+j[i].dresserId+'&v=<%= VERSION %>">';
				str += '<div class="center_img newimgbox"><img src="';
				str += j[i]['profile'];
				str += '" class="dressimgs"/>';
				if(j[i].isVDresser == 1 ){
					str += '<p><img src="images/vv.png"></p></div><div class="center_text"><ul>' ; 
				}else{
					str +='<p></p></div><div class="center_text"><ul>';
				}
				str += '<li><b class="vv charnum">'; 
				/*if(j[i]['dresserName'].length>7){
					var strn=j[i]['dresserName'];
					str += strn.substring(0,7)+"..." ; 
					}else{
				str += j[i]['dresserName'] ; 
					}*/
				str += j[i]['dresserName'] ; 
				str += '</b></li>'; 
				str += '<li class="search_main_ctwo">';
				if(j[i].specials != null){
					var strs= new Array(); //定义一数组 
					strs=j[i].specials.split(","); //字符分割 
					for( var t=0;t<strs.length;t++){
						str +='<p>';
						str += strs[t];
						str +='</p>';
					}
				} 
				//str += getWorkTags2(j[i].specials);
				str += '<span><b class="xinxin">';
				for( var l=0;l<j[i]['starLevel'];l++){
					str += '<img src="images/xing.png"/>';
				}
				str += '</b><img src="images/black_right.png"></span></li>';
				str += '<li>最近已接 <a class="text1">';
				str += j[i]["orderNum"] ;
				str += '</a> 单</li>';
				str += '</ul>' ;
				str += '</div></a></div>';
			}
			str += '</div><div>';
			

			if(data.data.length >= pageSize){
				str += '<div class="s_btn" id="s_click_btn">查看更多化妆师</div>';
			}
		$(".search_one_main2").append(str);
	
		$(".s_btn").unbind('click');
		$(".s_btn").on("click", getMoreDressersa);
	}
	/*分页 加载更多 共用*/
	function getMoreDressersa(){
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		loadDressers(pageNum,pageSize);
	}
	
});







