/*===订单详情====*/
$(function(){
	function getParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return '';
	}
	var pageSize = 20;
	$(function() {
	
		//加载第一页
		loadDressersone(0,20);
	 
	});
	 function loadDressersone(pageNum,pageSize){
		var key = getParam('key');
		$.ajax({//采用异步
			type: "post",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/reservationDetails/1.0',
			data:getFinalRequestObject({accessToken: getAccessToken(), reservationId: getParam('reservationId')}),
			timeout:15000,//10s
			dataType:"json",
			success: initPageone,
		})
	 }

	function initPageone(data){
		console.log(data.data);
		var workData = data.data;
		var str1 = "";
		var str = "";
		var str_li="";
		str1 += '<div class="center_img"><img src="'+ workData.cover +'"> '+ getvv(workData)+'</div><div class="center_text"><ul><li class="search_main_ctwo01"><a>'+workData.workType+'</a><b class="vv">¥'+workData.cost+'</b></li><li class="search_main_ctwo">'+ getxTags(workData.tags) +'<span><img src="images/back_right_l.png"></span></li></ul></div>';
		str += '<div class="bh-left1"><img src="'+ workData.profile +'"  class="bl-photo"/></div><div class="bh-right1"><div class="bh-name" style=" display:inline-block;">'+workData.name+'</div>'+ getWorkDsex(workData) +'<div class="bh-start1">'+ getstart(workData) +'</div><div class="bh_d_btn1"><div class="bh_d1"><img src="images/xinxi.png"></div><div class="bh_dh1"><img src="images/dianhua.png"></div></div></div>';
		str_li +='<div class="li_workDetails"><ul><li>预约订单号 <b>'+ workData.reservationId +'</b></li><li>预约时间 <b>'+ workData.reservationTime+'</b></li><li>预约地址 <b>'+ workData.reservationAddress+'</b></li></ul></div><div class="li_workDetails"><ul><li class="praisepj">评价 <b>'+getstartp(workData)+'<img src="images/back_right.png"></b></li><li>投诉 <b><img src="images/back_right.png"></b></li></ul></div>';
		$(".head02").append(str1);
		$(".box-hzs1").append(str);
		$(".li_w").append(str_li);
		
		if (workData.praised == 0) {
			$(".praisepj").on("click",function(){
				window.location.href="order_complain.html?v=<%= VERSION %>";
			})
		}else{
			$(".praisepj").on("click",function(){
				window.location.href="order_evaluate.html?v=<%= VERSION %>";
			})
		}
	}
	/*化妆师作品标签*/
	function getxTags(tags){
		var str = '';
		for( var t=0;t<tags.length;t++){
			str +='<p>'+ tags[t] +'</p>';
		}
		return str;
	}
	/*判断作品是否加v*/
	function getvv(workData){
		var vv = workData.isVDresser;
		if (vv == 1){
			vv = '<p><img src="images/vv.png"></p>';
		}else{
			vv = '<p></p>';
		};
		return vv;
	}
	/*判断化妆师性别*/
	function getWorkDsex(workData){
		var	workDatasex = workData.sex;
		if (workDatasex == 0){
			workDatasex = '<img src="images/girl_03.jpg" style="width:7%; display:inline-block; margin:0 0 0 .2rem; display:none;" class="sex0 bh_sex1" />';
		}else{
			workDatasex = '<img src="images/boy_03.png" class="sex1 bh_sex1" />'
		};
		return workDatasex;
	}
	/*判断有几个星星*/
	function getstart(star){
		var str = '';
		for(var i = 1;i <= star.starLevel;i++){
			str += '<img src="images/xing.png"/>';
		};
		return str;
	}
	/*判断评价有几个星星*/
	function getstartp(workData){
		var praise = workData.praised;
		if (praise == 0) {
			var str = '';
			for(var i = 1;i <= workData.sumEvaluation;i++){
				str += '';
			};
			return str;
		}else{
			var str = '';
			for(var i = 1;i <= workData.sumEvaluation;i++){
				str += '<img src="images/xing.png"/>';
			};
			return str;
		};
	}
});











