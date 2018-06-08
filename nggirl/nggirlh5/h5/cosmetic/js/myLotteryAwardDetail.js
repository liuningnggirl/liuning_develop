/**
 * Created by zhanghaiwei on 16/9/28.
 */

$(function () {
    loadPage();
});

function loadPage() {
    //加载页面数据
    $.ajax({
        url: '<%= CLI_HOST_API_URL %>/nggirl/app/cli/lottery/myLotteryAwardDetail/2.5.3',
        type: 'get',
        data: getFinalRequestObject({
            accessToken: getAccessToken(),
            awardRecordId: getParam('awardRecordId')
        }),
        dataType: 'json',
        success: function (data) {
            if (data.code == 0) {
                //渲染公共部分
                renderCommon(data);
                //该奖品是商品
                if (data.data.awardType == 1) {
                    //渲染商品
                    renderGoods(data);
                } else if (data.data.awardType == 2) {
                    renderCoupon(data);
                } else if (data.data.awardType == 3) {
                    renderThirdPartCoupon(data);
                }

            } else {
                alert(data.data.error);
            }
        }
    });


    //part2判断按钮是否可点击了
    $('.message input').die('keyup');
    $('.message input').live('keyup', autoChangeMessageBtnStatus);
    //part2点击保存按钮
    $('.part2 .mesbtn').click(saveAddress);
}

//渲染商品/南瓜券/第三方优惠券的公共部分
function renderCommon(data) {
    $('.lottery .headimg').html('<img src="' + data.data.awardHeadImg + '" />')
    $('.lottery .name-fee .name').text(data.data.awardName);
    $('.lottery .period .time').text(data.data.activityTime);
    //活动期间变颜色
    if (data.data.isInActivity == 1) {
        $('.lottery .period').addClass('inactivity');
    }
    var str = '';
    for (var i = 0; i < data.data.details.length; i++) {
        if (data.data.details[i].type == 2) {
            str += ('<p class="paragraph">' + data.data.details[i].content + '</p>');
        } else if (data.data.details[i].type == 3) {
            str += ('<p class="image"><img src="' + data.data.details[i].content + '" /></p>');
        }
    }

    //没有商品详情,就隐藏商品详情
    if (strIsEmpty(str)) {
        $('.lottery .details').addClass('hide');
    } else {
        $('.lottery .details .details-content').html(str);
    }
}


//渲染商品信息
function renderGoods(data) {
    //显示运费
    $('.lottery .name-fee .fee').removeClass('hide');
    //隐藏兑换码
    $('.lottery .invitecode').addClass('hide');

    //商品状态
    //已兑换
    if (data.data.status != 0) {
        $('.lottery .status .hint.finished').removeClass('hide');
        $('.lottery .status .hint.filladdress').addClass('hide');
    }
    //未填写地址信息
    else {
        $('.lottery .status .hint.finished').addClass('hide');
        $('.lottery .status .hint.filladdress').removeClass('hide');

        //显示填写地址的按钮
        $('.lottery .status .hint.filladdress').unbind();
        $('.lottery .status .hint.filladdress').click(showAddressWindow);
    }
}

//渲染南瓜券
function renderCoupon(data) {
    //先按照商品渲染
    renderGoods(data);
    //隐藏运费
    $('.lottery .name-fee .fee').addClass('hide');

    //显示为已兑换
    $('.lottery .status .hint.finished').removeClass('hide');
    $('.lottery .status .hint.filladdress').addClass('hide');
}

//渲染第三方兑换码
function renderThirdPartCoupon(data) {
    //隐藏运费
    $('.lottery .name-fee .fee').addClass('hide');
    //显示兑换码
    $('.lottery .invitecode').removeClass('hide');
    $('.lottery .invitecode').text(data.data.inviteCode);

    //隐藏下部的悬浮div
    $('.lottery .status .hint.finished').addClass('hide');
    $('.lottery .status .hint.filladdress').addClass('hide');

    //将详情与下面的距离重新调整
    $('.lottery .details').addClass('nostatus');
}

//自动检测确认按钮状态
function autoChangeMessageBtnStatus() {
    //三个信息都需要填写
    if (!strIsEmpty($(".message .box1 input").val())
        && !strIsEmpty($(".message .box2 input").val())
        && !strIsEmpty($(".message .box3 input").val())) {
        $(".mesbtn").removeClass('greyBtn');
    } else {
        $(".mesbtn").addClass('greyBtn');
    }
}

//保存地址信息
function saveAddress() {
    var realName = $.trim($('.message .box1 input').val());
    var phoneNum = $.trim($('.message .box2 input').val());
    var address = $.trim($('.message .box3 input').val());
    if (strIsEmpty(realName)) {
        alertFn('小南瓜还不知道你叫啥类~');
    } else if (strIsEmpty(phoneNum)) {
        alertFn('能告诉小南瓜你的电话吗^_^');
    } else if (strIsEmpty(address)) {
        alertFn('小南瓜有小礼物寄给你要告诉我地址哦~');
    } else {
        //验证手机号
        if (isPhoneNum(phoneNum)) {
            var genData = {
                accessToken: getAccessToken(),
                awardRecordId: getParam('awardRecordId'),
                realName: realName,
                phoneNum: phoneNum,
                address: address
            };
            $.post(
                '<%= CLI_HOST_API_URL %>/nggirl/app/cli/lottery/fillLotteryAwardAddress/2.5.3',
                getFinalRequestObject(genData),
                function (data) {
                    var data = $.parseJSON(data);
                    if (data.code == 0) {
                        $('.part2').addClass('hide');
                        //重新加载页面
                        //商品状态为已兑换
                        $('.lottery .status .hint.finished').removeClass('hide');
                        $('.lottery .status .hint.filladdress').addClass('hide');
                    } else {
                        alert(data.data.error);
                    }
                });
        } else {
            alertFn('哎呦，手机号写错啦~~！');
        }

    }
}

function showAddressWindow() {
    //显示填写地址页
    $('.part2').removeClass('hide');
    $.get(
        '<%= CLI_HOST_API_URL %>/nggirl/app/cli/scoreshop/getUserReciveAddess/2.5.2',
        getFinalRequestObject({accessToken: getAccessToken()}),
        function (json) {
            var data = $.parseJSON(json);
            if (data.code == 0) {
                //填写加载到的地址信息
                $('.message .box1 input').val(data.data.realName);
                $('.message .box2 input').val(data.data.phoneNum);
                $('.message .box3 input').val(data.data.address);

                //切换按钮状态
                autoChangeMessageBtnStatus();
            }

        }
    );
}

