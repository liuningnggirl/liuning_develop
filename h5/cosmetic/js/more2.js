/*===化妆师装束more2.html====*/
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
	
		loadDressersone();
	 
	});
	
	function loadDressersone(pageNum,pageSize){
	var key = getParam('key');
		$.ajax({//采用异步
			type: "post",
			url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/weixin/listWorksBlur/1.4.1',
			data:getFinalRequestObject({key: key,page:pageNum,num:10,cityName:'北京'}),
			timeout:15000,//10s
			dataType:"json",
			success: initPageone,
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				//console.log( XMLHttpRequest )
				//$(".main").html("尚未发布任何信息！");
			}
		});
	}

	function initPageone(data){
		//console.log(data);
		$('.s_btn').remove();
		var workData = data.data;
			var str = "";
			for(var j = 0; j < workData.length; j++) {
				str += '<div class="head01"><a href="workDetails.html?workId='+workData[j].workId+'&v=<%= VERSION %>" style="-webkit-tap-highlight-color: rgba(0,0,0,0);"><div class="center_img"><img class="lazy" data-original="' + workData[j].cover + '"></div><div class="center_text"><div class="search_one_top"><p>¥<span>'+workData[j].cost+'</span></p></div><div class="search_main_ctwo">'+getWorkTags(workData[j])+'</div><div class="love-item-title"><span>'+workData[j].descriptions+'</span></div></div></a></div>';
			}
	
			str += '</div></div></div></div>';
			if(data.data.length >= pageSize){
				str += '<div class="s_btn" id="s_click_btn">查看更多妆束</div>';
			}
			$(".search_one_main").append(str);
	
		$(".s_btn").unbind('click');
		$(".s_btn").on("click", getMoreDressers);
		$("img.lazy").lazyload({effect : "fadeIn",threshold:200})
	
			
	}
	
	function getMoreDressers(){
		var pageNum = $('body').data('pageNum');
		if(pageNum == undefined || parseInt(pageNum) == NaN){
			pageNum = 0;
		}
		pageNum = pageNum + 1;
		$('body').data('pageNum',pageNum);
		loadDressersone(pageNum,pageSize);
	}
});

function getWorkTags(work){
	var str = '';
	for(var i=0;i<work.tags.length;i++){
		str += '<p>'+work.tags[i].tag+'</p>';
	}
	return str;
}/*======装束列表more2.html======
=======结束=======*/