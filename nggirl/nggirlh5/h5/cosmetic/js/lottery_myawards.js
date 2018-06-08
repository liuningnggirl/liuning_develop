/**
 * Created by Alisa on 2016/9/29.
 */
$(function () {
    var page=0;
    getMyLotteryAwards(page);

    $('.goAward').click(function (e) {
        window.location.href = 'drawLottery.html?activityId='+$('.goAward').attr('activityId')+'&v=<%= VERSION %>';//抽奖活动页
    })

    $('.box ul').delegate('li','click',function () {
        window.location.href = "myLotteryAwardDetail.html?awardRecordId="+$(this).attr("awardRecordId")+'&v=<%= VERSION %>';//我的奖品详情页
    })
})

function getNextPage(){
    var page = $('body').data('page');//在body里面存储page
    if(page == undefined || parseInt(page) == NaN){
        page = 0;
    }
    page = page + 1;
    $('body').data('page',page);
    getMyLotteryAwards(page)
}

function getMyLotteryAwards(page) {
    var param = getFinalRequestObject({
        accessToken:getAccessToken(),
        page:page,
        num:20
    });
    $.get('<%= CLI_HOST_API_URL %>/nggirl/app/cli/lottery/myLotteryAwards/2.5.3',param,function (data) {
        var data = $.parseJSON(data);
        if (data.code == 0){
            if(data.data.awards.length > 0){
                if (data.data.awards.length == 20){
                    var tur = true;
                    $(window).scroll(function(){
                        var winH = $(window).height(); //浏览器当前窗口可视区域高度
                        var pageH = $(document.body).height(); //浏览器当前窗口文档body的高度
                        var scrollT = $(window).scrollTop(); //滚动条top
                        var lastPersentH = (pageH - winH - scrollT) / winH;
                        if(tur && lastPersentH < 0.01){
                            setTimeout(function(){
                                getNextPage();
                            },500);
                            tur = false;
                        }
                    });
                }
                for(var x = 0; x < data.data.awards.length; x ++){
                    $('.awards').append('<li awardRecordId="'+data.data.awards[x].awardRecordId+'"  awardId="'+data.data.awards[x].awardId+'" awardType="'+data.data.awards[x].awardType+'"><img class="awardimg" src="'+data.data.awards[x].awardImg+'" alt="" /><div class="left"><p class="awardname">'+data.data.awards[x].awardName+'</p><div class="smallword"><img src="images/label1.png"><p>抽奖</p></div></div></li>');
                }

            }else if(data.data.awards.length == 0 && page!=0){
                $('.awards').show();
            }else if(data.data.awards.length == 0 && page == 0){
                $('.box').hide();
                $('.noaward').show();
                $('.goAward').attr('activityId',data.data.activityId);
            }


        }else {
            alert(data.data.error);
        }

    });
}


