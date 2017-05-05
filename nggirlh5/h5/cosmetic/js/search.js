$(function () {
    var key = getParam('search');
	$('.sy_search').val(key);
	$('form.form1').on('submit', function(e){
		window.location.href = "search_one.html?search="+$(".sy_search").val()+'&v=<%= VERSION %>';
		return false;
	});
    $.ajax({//采用异步
        type: "post",
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/works/weixin/listInfoByKey/1.5.0',
        data: getFinalRequestObject({ accessToken: '4b4f888a035e487b94ce5f9efce96c48', key: key,cityName:'北京'}),
        timeout: 15000,//10s
        dataType: "json",
        success: function (data) {
            //console.info(data);
            var res = data.data;
            /*==判断显示那个页面==*/
            if (hasData(data)) {
                $('.box1').show();
            } else {
                $('.box2').show();
            }
            /*==化妆师和装束数据加载==*/
            if (res && null != res) {
                var dressers = res["dressers"];
				/*判断有没有加载到化妆师的信息*/
				if(res.dressers.data.length == 0){
					$('.more_nav1').hide();
					$('.s_btn').hide();	
				}else{
					if (dressers && null != dressers) {
						var str = "";
						for (var i = 0, j = dressers.data; i < j.length; i++) {
							str += '<div class="head02"><a href="space.html?dresserId=' + j[i].dresserId + '&v=<%= VERSION %>">';
							str += '<div class="center_img"><div class="searimgbox"><img src="';
							str += j[i]['profile'];
							str += '"/></div>';
							if (j[i].isVDresser == 1) {
								str += '<p><img src="images/vv.png"></p></div><div class="center_text"><ul>';
							} else {
								str += '<p></p></div><div class="center_text"><ul>';
							}
							str += '<li><b class="vv">';
							/*if(j[i]['dresserName'].length>7){
								var strn=j[i]['dresserName'];
								str += strn.substring(0,7)+"..." ; 
								}else{
								str += j[i]['dresserName'] ; 
								}*/
							str += j[i]['dresserName'] ;
							str += '</b></li>';
							str += '<li class="search_main_ctwo">';
							var strs= new Array(); //定义一数组 
							strs=j[i]["specials"].split(","); //字符分割 
							for( var t=0;t<strs.length;t++){
								str +='<p>';
								str += strs[t];
								str +='</p>';
							}
							str += '<span><b class="xinxin">';
							for (var l = 0; l < j[i]['starLevel']; l++) {
								str += '<img src="images/xing.png" />';
							}
							str += '</b><img src="images/black_right.png"></span></li>';
							str += '<li>最近已接 <a class="text1">';
							str += j[i]["orderNum"];
							str += '</a> 单</li>';
							str += '</ul></a></div>';
						}
						//判断是否有加载更多
						if(dressers.hasMore == 1){
							str += '<div class="s_btn" id="s_click_btn1">查看更多化妆师</div>';
							$(".search_one_main2").html(str);
						}else{
							$(".search_one_main2").html(str);
						}
						
					};
				}
				/*判断有没有加载到作品信息*/
                var works = res["works"];
				if(res.works.data.length == 0){
					$('.more_nav').hide();
					$('#s_click_btn').hide();
				}else{
					if (works && null != works) {
						var workData = works.data;
						var str = "";
						for (var j = 0; j < workData.length; j++) {
							str += '<div class="head01"><a href="workDetails.html?workId=' + workData[j].workId + '&v=<%= VERSION %>" ><div class="center_img"><img src="' + workData[j].cover + '"></div><div class="center_text"><div class="search_one_top"><p>¥<span>' + workData[j].cost + '</span></p></div><div class="search_main_ctwo">' + getWorkTags(workData[j]) + '</div><div class="love-item-title"><span>' + workData[j].descriptions + '</span></div></div></a></div>';
						}
						str += '</div></div>';
						if(works.hasMore == 1){
							str += '<div class="s_btn" id="s_click_btn">查看更多妆束</div>';
							$(".search_one_main").append(str);
						}else{
							
							$(".search_one_main").append(str);
						}
					};
				}
            };

            $('.sw_search>button').on('click', function () {
                var txt = $('.sy_search').val();
                window.location.href = "search_one.html?key=" + txt+'&v=<%= VERSION %>';
            });

            /*===取key值并跳转到下一个页面是===*/
            $("#s_click_btn1").on("click", function () {
                var key = getParam('search');
                window.location.href = "more1.html?key=" + key+'&v=<%= VERSION %>';
            });
            $("#s_click_btn").on("click", function () {
                var key = getParam('search');
                window.location.href = "more2.html?key=" + key+'&v=<%= VERSION %>';
            });

        },
        error: function (err) {
            console.info(err);
        }

        
    });
        $(".search_btn1 span").on("click", function () {
            var key = getParam('key');
            window.location.href = "home_page.html?v=<%= VERSION %>";
        });
});


function getWorkTags(work) {
    var str = '';
    for (var i = 0; i < work.tags.length; i++) {
        str += '<p>' + work.tags[i].tag + '</p>';
    }
    return str;
}

//判断是否首页搜索是否有数据
function hasData(data) {
    console.info(data.data.dressers.hasMore);
    console.info(data.data.works.hasMore);
    return data.data.dressers.data.length > 0 || data.data.works.data.length > 0;
}

