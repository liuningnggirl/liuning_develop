	function getParam(name) {
		var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
		var r = window.location.search.substr(1).match(reg);
		if (r != null)
			return decodeURI(r[2]);
		return '';
	}
	var promotionName = getParam('promotionName');
	var pageSize = 5;
	$(function() {

		//加载第一页
		//getMoreDressers();
		loadDressers(0,5);
	});


	function loadDressers(pageNum,pageSize){
		var key = getParam('key');
		$.ajax({//采用异步
			type: "post",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/getPromotionWorks/1.2',
	 		data: getFinalRequestObject({promotionName:promotionName,accessToken:getAccessToken(),page:pageNum,num:pageSize}),
			dataType:"json",
			success: initPage,
			});
	}
	function initPage(data){
			console.log(data)
			$('.s_btn').remove();
			var res=data.data;
			var titleAdded = !(typeof(titleStr)=='undefined');
			var str='';

			titleStr='<div class="more_nav">|' + promotionName + '|</div>';
			var typeStr='';
			for (var i=0 ;i<res.length;i++){
				str +='<div class＝"more_main"><a href="workDetails-hbh.html?workId='+res[i].workId+'&v=<%= VERSION %>" style="-webkit-tap-highlight-color: rgba(0,0,0,0);"><div class="more_main01"><div class="more_main02"><img src="' + res[i].cover + '"></div><div class="s_main_ctwo1">' + getWorkTags(res[i]) + '<span>¥' + res[i].cost + '</span></div><div class="more_main03"> <p>' + res[i].descriptions + '</p></div></div></a></div>';
			}
			if( data.data.length >= pageSize){
				str += '<div class="s_btn" id="s_click_btn">查看更多</div>';
			}
			 if (!titleAdded) {
			 	//$(".more_w").append(titleStr);
			 }else{
			 	$(".more_w").append();
			};
			$(".more_w").append(str);
			$(".s_btn").unbind('click');
			$(".s_btn").on("click", getMoreDressers);
			
	}
	/*分页 加载更多 共用*/
	function getMoreDressers(){
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		loadDressers(pageNum,pageSize);
	}
	function getWorkTags(work){
	var str = '';
	for(var i=0;i<work.tags.length;i++){
		str += '<p>'+work.tags[i]+'</p>';
	}
	return str;
}
