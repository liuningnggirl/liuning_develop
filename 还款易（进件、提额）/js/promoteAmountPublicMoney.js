var applyInfo = new Object();
var getParam = urlParse();
var applyInfoStr = '';
var applyAnother = '';
loader.init();
$(function(){
    //获取省市列表
    var _urlParse = urlParse();
    var obj = {};
    obj.mobile = _urlParse.mobile;
    obj.dataType = "2";
    var _obj = JSON.stringify(obj,'utf-8');
    $.ajax({
        type: 'POST',
        contentType : "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/querySocialSecurityAddress/v1/',
        data: _obj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.retCode == '200'){
                loader.hideL();
                for(var x in data.responseBody){
                    $('body').data('dataMessage', data.responseBody);
                    $('.selectBox .province').append('<p province='+data.responseBody[x].code+'>'+data.responseBody[x].name+'</p>');
                }
            }else{
                loader.hideL();
            }
        },
        error: function () {
            loader.hideL();
        }
    });

    //选择省
    $('.selectBox .province p').live('click',function(){
        var data = $('body').data('dataMessage');
        var this_= $(this);
        for(x in data){
            if(this_.html() == data[x].name){
                getCity(data[x].sub);
            }
        }
        $('.selector p .pro').html(this_.html()).removeClass('wait wait1').next().addClass('wait wait1').removeClass('hidden').attr('province',this_.attr('province'));
        $(this).addClass('selt').siblings().removeClass('selt');
        $('.selectBox .province').hide();
        $('.selectBox .cityBox').show();
    });

    //更改省
    $('.selector p .pro').click(function(){
        $('.selector p .city,.selector p .area').html('请选择').removeClass('selt');
        $(this).addClass('wait1 wait').siblings().removeClass('wait1 wait');
        $('.selectBox .province').show();
        $('.selectBox .cityBox,.selectBox .areaBox').hide();
    });

    //更改市
    $('.selector p .city').click(function(){
        $('.selectBox .areaBox,.selectBox .province').hide();
        $('.selectBox .cityBox').show();
        $('.selector p .area').html('请选择').removeClass('selt');
        $(this).addClass('wait1 wait').siblings().removeClass('wait1 wait');
    });

    //选择市
    $('.selectBox .cityBox p').live('click',function(){
        $('.selectBox .areaBox').html('');
        $(this).addClass('selt').siblings().removeClass('selt');
        $('.selector p .city').html($(this).html()).removeClass('wait wait1').next().addClass('wait wait1').removeClass('hidden').attr('city',$(this).attr('city')).attr('country',$(this).attr('country'));
        //根据当前城市的编码获取当前城市的社保登陆表单
        var obj = {};
        obj.dataType = "2";
        obj.province = $('.selector .city').attr('province');
        obj.city = $('.selector .area').attr('city');
        obj.country = $('.selector .area').attr('country');
        var _obj = JSON.stringify(obj, 'utf-8');
        $.ajax({
            type: 'POST',
            contentType: "text/html; charset=UTF-8",
            url: '/fintech-appbiz/api/APPBizRest/socialSecurityForm/v1/',
            data: _obj,
            dataType: 'json',
            beforeSend: function () {
                loader.showL();
            },
            success: function (data) {
                if(data.retCode == '200'){
                    loader.hideL();
                    $('.selectBox .areaBox').show().siblings().hide();
                    $('.selectBox .areaBox p').remove();
                    $('body').data('dataType', data.responseBody.formInfo);
                    for(x in data.responseBody.formInfo){
                        $('.selectBox .areaBox').append('<p>'+data.responseBody.formInfo[x].name+'</p>');
                    }
                }else{
                    loader.hideL();
                }
            },
            error: function () {
                loader.hideL();
            }
        });
    });

    //选择社保源
    $('.selectBox .areaBox p').live('click',function(){
        var data = $('body').data('dataType');
        $('.selector p .area').html($(this).html()).removeClass('wait');
        for(var x in data){
            if($(this).html() == data[x].name){
                $(this).addClass('selt').siblings().removeClass('selt');
                getLoginType(data[x].tabs);
            }
        }
    });

    //请选择省市
    $('.tc_content .select_provice').click(function(){
        $('.main .box,.main .shadow').removeClass('hidden');
    });

    //请选择登录类型
    $('.tc_content .select_type').click(function(){
        if($('.select_provice p').html() == '请选择省市' ){
            showMsg($('.error-msg'), '请先选择省市!!');
        }else{
            $('.box_content .nav_tabs,.main .shadow_login_type').removeClass('hidden');
        }
    });

    //选取省市
    $('.cityTit .sure').click(function(){
        var pro = $('.selector p .pro').html();
        var city = $('.selector p .city').html();
        var area = $('.selector p .area').html();
        if(pro != '请选择' && city != '请选择' && area != '请选择'){
            $('.main .box,.main .shadow').addClass('hidden');
            $('.tc_content .select_provice p').html(pro +' '+ city +' '+ area);
        };
        $(".tab_content li .tc_content div:gt(1)").remove();
        $('.select_type').html('请选择登录类型');
    });

    //根据登录类型渲染登录页面
    $('.nav_tabs li').live('click',function(){
        var data = $('body').data('dataTypeTabs');
        if(!$(this).hasClass('btn_cancle')){
            for(var x in data){
                if($(this).html() == data[x].descript){
                    getForm(data[x].field);
                    $('.tc_content .select_type p').html($(this).html());
                    $('.main .shadow_login_type,.box_content .nav_tabs').addClass('hidden');
                }
            }
        }
    });

    //取消选择省市县
    $('.cityTit .close').click(function(){
       $('.shadow,.box').addClass('hidden');
    });

    //提交社保采集申请接口
    $('.btn_content .btn_sure').live('click',function() {
        applyInfoStr = applyAnother;
        //var orgAccount = $.trim($('.org_card_num input').val());
        var obj = new Object();
        obj.dataType = '2';
        obj.name = $.trim($('.name input').val());
        obj.mobile =  $.trim($('.cell_phone_num input').val());
        obj.cardNo = $.trim($('.id_card_num input').val());
        obj.consultId = getParam.consultId;
        var a = $('.tab_content li .tc_content div:gt(1)');
        for(var x = 0; x < a.length;x++){
            if(isValContent($(a[x]).children('input').val())){
                showMsg($('.error-msg'), $(a[x]).attr('parameter_name')+'不能为空');
                return false;
            }else if(isIncludeSpecalStr($(a[x]).children('input').val())){
                showMsg($('.error-msg'), $(a[x]).attr('parameter_name')+'不能包含特殊字符');
                return false;
            }else if($(a[x]).attr('parameter_name') == '身份证'){
                if(!IdCodeValid($(a[x]).children('input').val()).pass){
                    showMsg($('.error-msg'), '请输入正确'+$(a[x]).attr('parameter_name'))+'号码';
                    return false;
                }else{
                    applyInfoStr += '"'+$(a[x]).attr('code')+'":'+'"'+ $(a[x]).children('input').val() +'",';
                }
            }else if($(a[x]).attr('parameter_name') == '手机号'){
                if(!isPhoneNum($(a[x]).children('input').val())){
                    showMsg($('.error-msg'), '请输入正确'+$(a[x]).attr('parameter_name'))+'号码';
                    return false;
                }else{
                    applyInfoStr += '"'+$(a[x]).attr('code')+'":'+'"'+ $(a[x]).children('input').val() +'",';
                }
            }else{
                applyInfoStr += '"'+$(a[x]).attr('code')+'":'+'"'+ $(a[x]).children('input').val() +'",';
            }
        }
        applyInfoStr = '{'+applyInfoStr.substring(0,applyInfoStr.length -1)+'}';

        var objStr = JSON.parse(applyInfoStr)
        obj.applyInfo = objStr;
        var _obj = JSON.stringify(obj, 'utf-8');
        if(_obj != undefined){
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                url: '/fintech-appbiz/api/APPBizRest/submitSocialSecurity/v1/',
                data: _obj,
                dataType: 'json',
                beforeSend: function () {
                    loader.showL();
                },
                success: function (data) {
                    if (data.retCode == '200' && data.responseBody!=null) {
                        loader.hideL();
                        $('.success_box').removeClass('hidden');
                    } else {
                        loader.hideL();
                        showMsg($('.error-msg'), data.errorDesc);
                    };
                },
                error: function () {
                    loader.hideL();
                }
            });
        }
    });

    //继续认证
    $('.btn_renzheng').click(function(){
        window.location.href = "promoteAmountList.html";
    });

    //提交借款
    $('.btn_sumbit').click(function(){
        if(typeStr == 'and'){
            window.jsToJava.redirect_submit_loan_jieyue();//吊起and借款提交成功页面
        }else if(typeStr == 'ios'){
            window.webkit.messageHandlers.redirect_submit_loan_jieyue.postMessage(null);//吊起ios借款提交成功页面
        }
    });
});

//获取市
function getCity(sub){
    var str = '';
    $('.selectBox .cityBox').html('');
    for(x in sub){
        str += $('.selectBox .cityBox').append('<p city='+sub[x].code+' country='+sub[x].fullcode+'>'+sub[x].name+'</p>');
    }
    return str;
}

//获取登录类型
function getLoginType(data){
    $('body').data('dataTypeTabs', data);
    new LArea().init({
        'trigger': '#demo2',
        'valueTo': '#value2',
        'keys': {
            id: 'value',
            name: 'text'
        },
        'type': 2,
        'data': [data]
    });
}

//渲染表单
function getForm(data,dataFinal){
    var str = '';
    $(".tab_content li .tc_content div:gt(1)").remove();
    //$('.tab_content li .tc_content').append('<div class="org_card_num"><input type="text" value="" placeholder="请输入机构账号"></div>')
    for(var x in data){
        $('.tab_content li .tc_content').append('<div parameter_name="'+data[x].parameter_name+'" class="'+data[x].parameter_code+'" code="'+data[x].parameter_code+'"><input type='+data[x].parameter_type+' value="" placeholder='+data[x].parameter_message+'></div>');
    }
    $('.tab_content li .btn_content').html('<div class="btn_sure next-step">确定</div>');
    applyAnother += '"type":'+ '"'+dataFinal.type+'",';
    applyAnother += '"sort":'+ '"'+dataFinal.sort+'",';
    applyAnother += '"website":'+ '"'+dataFinal.website+'",';
    if(dataFinal.account != undefined){
        applyAnother += '"account":'+ '"'+dataFinal.account+'",';
    };
}

window.LArea = (function() {
    var MobileArea = function() {
        this.gearArea;
        this.data;
        this.index = 0;
        this.value = [0, 0, 0];
    }
    MobileArea.prototype = {
        init: function(params) {
            this.params = params;
            this.trigger = document.querySelector(params.trigger);
            if(params.valueTo){
                this.valueTo=document.querySelector(params.valueTo);
            }
            this.keys = params.keys;
            this.type = params.type||1;
            switch (this.type) {
                case 1:
                case 2:
                    break;
                default:
                    throw new Error('错误提示: 没有这种数据源类型');
                    break;
            }
            this.bindEvent();
        },
        getData: function(callback) {
            var _self = this;
            if (typeof _self.params.data == "object") {
                _self.data = _self.params.data;
                callback();
            } else {
                var xhr = new XMLHttpRequest();
                xhr.open('get', _self.params.data);
                xhr.onload = function(e) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 0) {
                        var responseData = JSON.parse(xhr.responseText);
                        _self.data = responseData.data;
                        if (callback) {
                            callback()
                        };
                    }
                }
                xhr.send();
            }
        },
        bindEvent: function() {
            var _self = this;
            //呼出插件
            function popupArea(e) {
                _self.gearArea = document.createElement("div");
                _self.gearArea.className = "gearArea";
                _self.gearArea.innerHTML = '<div class="area_ctrl slideInUp">' +
                    '<div class="area_btn_box">' +
                    '<div class="area_btn larea_cancel">取消</div>' +
                    '<div class="area_btn larea_finish">确定</div>' +
                    '</div>' +
                    '<div class="area_roll_mask">' +
                    '<div class="area_roll">' +
                    '<div>' +
                    '<div class="gear area_province" data-areatype="area_province"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear area_city" data-areatype="area_city"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '<div>' +
                    '<div class="gear area_county" data-areatype="area_county"></div>' +
                    '<div class="area_grid">' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>';
                //document.body.appendChild(_self.gearArea);
                $('.test').html(_self.gearArea);
                areaCtrlInit();
                var larea_cancel = _self.gearArea.querySelector(".larea_cancel");
                larea_cancel.addEventListener('touchstart', function(e) {
                    _self.close(e);
                });
                var larea_finish = _self.gearArea.querySelector(".larea_finish");
                larea_finish.addEventListener('touchstart', function(e) {
                    _self.finish(e);
                    var data = $('body').data('dataTypeTabs');
                    for(var x in data){
                        if($('.select_type').html() == data[x].descript){
                            getForm(data[x].field,data[x]);
                            $('.main .shadow_login_type,.box_content .nav_tabs').addClass('hidden');
                        }
                    }
                });
                var area_province = _self.gearArea.querySelector(".area_province");
                var area_city = _self.gearArea.querySelector(".area_city");
                var area_county = _self.gearArea.querySelector(".area_county");
                area_province.addEventListener('touchstart', gearTouchStart);
                area_city.addEventListener('touchstart', gearTouchStart);
                area_county.addEventListener('touchstart', gearTouchStart);
                area_province.addEventListener('touchmove', gearTouchMove);
                area_city.addEventListener('touchmove', gearTouchMove);
                area_county.addEventListener('touchmove', gearTouchMove);
                area_province.addEventListener('touchend', gearTouchEnd);
                area_city.addEventListener('touchend', gearTouchEnd);
                area_county.addEventListener('touchend', gearTouchEnd);
            }
            //初始化插件默认值
            function areaCtrlInit() {
                _self.gearArea.querySelector(".area_province").setAttribute("val", _self.value[0]);
                _self.gearArea.querySelector(".area_city").setAttribute("val", _self.value[1]);
                _self.gearArea.querySelector(".area_county").setAttribute("val", _self.value[2]);

                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                    case 2:
                        _self.setGearTooth(_self.data[0]);
                        break;
                }
            }
            //触摸开始
            function gearTouchStart(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                clearInterval(target["int_" + target.id]);
                target["old_" + target.id] = e.targetTouches[0].screenY;
                target["o_t_" + target.id] = (new Date()).getTime();
                var top = target.getAttribute('top');
                if (top) {
                    target["o_d_" + target.id] = parseFloat(top.replace(/em/g, ""));
                } else {
                    target["o_d_" + target.id] = 0;
                }
                target.style.webkitTransitionDuration = target.style.transitionDuration = '0ms';
            }
            //手指移动
            function gearTouchMove(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break
                    }
                }
                target["new_" + target.id] = e.targetTouches[0].screenY;
                target["n_t_" + target.id] = (new Date()).getTime();
                var f = (target["new_" + target.id] - target["old_" + target.id]) * 30 / window.innerHeight;
                target["pos_" + target.id] = target["o_d_" + target.id] + f;
                target.style["-webkit-transform"] = 'translate3d(0,' + target["pos_" + target.id] + 'em,0)';
                target.setAttribute('top', target["pos_" + target.id] + 'em');
                if(e.targetTouches[0].screenY<1){
                    gearTouchEnd(e);
                };
            }
            //离开屏幕
            function gearTouchEnd(e) {
                e.preventDefault();
                var target = e.target;
                while (true) {
                    if (!target.classList.contains("gear")) {
                        target = target.parentElement;
                    } else {
                        break;
                    }
                }
                var flag = (target["new_" + target.id] - target["old_" + target.id]) / (target["n_t_" + target.id] - target["o_t_" + target.id]);
                if (Math.abs(flag) <= 0.2) {
                    target["spd_" + target.id] = (flag < 0 ? -0.08 : 0.08);
                } else {
                    if (Math.abs(flag) <= 0.5) {
                        target["spd_" + target.id] = (flag < 0 ? -0.16 : 0.16);
                    } else {
                        target["spd_" + target.id] = flag / 2;
                    }
                }
                if (!target["pos_" + target.id]) {
                    target["pos_" + target.id] = 0;
                }
                rollGear(target);
            }
            //缓动效果
            function rollGear(target) {
                var d = 0;
                var stopGear = false;
                function setDuration() {
                    target.style.webkitTransitionDuration = target.style.transitionDuration = '200ms';
                    stopGear = true;
                }
                clearInterval(target["int_" + target.id]);
                target["int_" + target.id] = setInterval(function() {
                    var pos = target["pos_" + target.id];
                    var speed = target["spd_" + target.id] * Math.exp(-0.03 * d);
                    pos += speed;
                    if (Math.abs(speed) > 0.1) {} else {
                        var b = Math.round(pos / 3) * 3;
                        pos = b;
                        setDuration();
                    }
                    if (pos > 0) {
                        pos = 0;
                        setDuration();
                    }
                    var minTop = -(target.dataset.len - 1) * 3;
                    if (pos < minTop) {
                        pos = minTop;
                        setDuration();
                    }
                    if (stopGear) {
                        var gearVal = Math.abs(pos) / 3;
                        setGear(target, gearVal);
                        clearInterval(target["int_" + target.id]);
                    }
                    target["pos_" + target.id] = pos;
                    target.style["-webkit-transform"] = 'translate3d(0,' + pos + 'em,0)';
                    target.setAttribute('top', pos + 'em');
                    d++;
                }, 30);
            }
            //控制插件滚动后停留的值
            function setGear(target, val) {
                val = Math.round(val);
                target.setAttribute("val", val);
                switch (_self.type) {
                    case 1:
                        _self.setGearTooth(_self.data);
                        break;
                    case 2:
                        switch(target.dataset['areatype']){
                            case 'area_province':
                                _self.setGearTooth(_self.data[0]);
                                break;
                            case 'area_city':
                                var ref = target.childNodes[val].getAttribute('ref');
                                var childData=[];
                                var nextData= _self.data[2];
                                for (var i in nextData) {
                                    if(i==ref){
                                        childData = nextData[i];
                                        break;
                                    }
                                };
                                _self.index=2;
                                _self.setGearTooth(childData);
                                break;
                        }
                }

            }
            _self.getData(function() {
                _self.trigger.addEventListener('click', popupArea);
            });
        },
        //重置节点个数
        setGearTooth: function(data) {
            var _self = this;
            var item = data || [];
            var l = item.length;
            var gearChild = _self.gearArea.querySelectorAll(".gear");

            var gearVal = '';
            if(gearChild[_self.index].getAttribute('val') == 'NaN'){
                gearVal =_self.index;
            }else{
                gearVal = gearChild[_self.index].getAttribute('val');
            }

            var maxVal = l - 1;
            if (gearVal > maxVal) {
                gearVal = maxVal;
            }
            gearChild[_self.index].setAttribute('data-len', l);
            if (l > 0 ) {
                var id = item[gearVal][this.keys['id']];
                var childData;
                switch (_self.type) {
                    case 1:
                        childData = item[gearVal].child
                        break;
                    case 2:
                        var nextData= _self.data[_self.index+1]
                        for (var i in nextData) {
                            if(i==id){
                                childData = nextData[i];
                                break;
                            }
                        };
                        break;
                }
                var itemStr = "";
                for (var i = 0; i < l; i++) {
                    itemStr += "<div class='tooth'>" + item[i].descript + "</div>";
                }
                $('.area_roll>div:gt(0)').hide();
                gearChild[_self.index].innerHTML = itemStr;
                gearChild[_self.index].style["-webkit-transform"] = 'translate3d(0,' + (-gearVal * 3) + 'em,0)';
                gearChild[_self.index].setAttribute('top', -gearVal * 3 + 'em');
                gearChild[_self.index].setAttribute('val', gearVal);
                _self.index++;
                if (_self.index > 2) {
                    _self.index = 0;
                    return;
                }
                _self.setGearTooth(childData);
            } else {
                gearChild[_self.index].innerHTML = "<div class='tooth'></div>";
                gearChild[_self.index].setAttribute('val', 0);
                if(_self.index==1){
                    gearChild[2].innerHTML = "<div class='tooth'></div>";
                    gearChild[2].setAttribute('val', 0);
                }
                _self.index = 0;
            }
        },
        finish: function(e) {
            var _self = this;
            var area_province = _self.gearArea.querySelector(".area_province");
            var area_city = _self.gearArea.querySelector(".area_city");
            var area_county = _self.gearArea.querySelector(".area_county");
            var provinceVal = parseInt(area_province.getAttribute("val"));
            var provinceText = area_province.childNodes[provinceVal].innerText;
            var provinceCode = area_province.childNodes[provinceVal].getAttribute('ref');
            var cityVal = parseInt(area_city.getAttribute("val"));
            var cityText = area_city.childNodes[cityVal].textContent;
            var cityCode = area_city.childNodes[cityVal].getAttribute('ref');
            var countyVal = parseInt(area_county.getAttribute("val"));
            var countyText = area_county.childNodes[countyVal].textContent;
            var countyCode = area_county.childNodes[countyVal].getAttribute('ref');
            _self.trigger.value = provinceText + ((cityText)?(',' + cityText):(''))+ ((countyText)?(',' + countyText):(''));
            _self.value = [provinceVal, cityVal, countyVal];
            $('#demo2').html(provinceText);
            if(this.valueTo){
                this.valueTo.value= provinceCode +((cityCode)?(',' + cityCode):('')) + ((countyCode)?(',' + countyCode):(''));
            }
            _self.close(e);
        },
        close: function(e) {
            e.preventDefault();
            var _self = this;
            var evt = new CustomEvent('input');
            _self.trigger.dispatchEvent(evt);
            //document.body.removeChild(_self.gearArea);
            $('.test').html('');
            _self.gearArea=null;
        }
    }
    return MobileArea;
})()