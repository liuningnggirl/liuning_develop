var getParam = urlParse();
loader.init();
$(function(){
    //获取保险列表
    $.ajax({
        type: 'GET',
        url: '/fintech-appbiz/api/APPBizRest/commercialInsuranceAddrs/v1/',
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if(data.retCode == '200' && data.responseBody !=undefined){
                loader.hideL();
                new LArea().init({
                    'trigger': '#demo2',
                    'valueTo': '#value2',
                    'keys': {
                        id: 'value',
                        name: 'text'
                    },
                    'type': 2,
                    'data': [data.responseBody.websites]
                });

            }else{
                loader.hideL();
            }
        },
        error: function () {
            loader.hideL();
        }
    });

    //提交商业保险
    $('.btn_sure').live('click',function() {
        var obj = new Object();
        obj.account = $.trim($('.select_box .account input').val());//保险网站账号
        obj.password = $.trim($('.select_box .password input').val());
        obj.website = $('#demo2').attr('website');
        obj.name = $.trim($('.select_box .name input').val());
        obj.cardNo = $.trim($('.select_box .id_card_num input').val());
        obj.mobile = $.trim($('.select_box .cell_phone_num input').val());
        obj.consultId = getParam.consultId;//咨询单号
        if(isValContent($('.select_box .name input').val())){
            showMsg($('.error-msg'), '姓名不能为空');
        }else if(isIncludeSpecalStr($('.select_box .name input').val())){
            showMsg($('.error-msg'), '姓名中不能包括特殊字符');
        }else if(isValContent($('.select_box .id_card_num input').val())){
            showMsg($('.error-msg'), '身份证号不能为空');
        }else if(!IdCodeValid($.trim($('.select_box .id_card_num input').val())).pass){
            showMsg($('.error-msg'), '请输入正确身份证号');
        }else if(isValContent($('.select_box .cell_phone_num input').val())){
            showMsg($('.error-msg'), '手机号不能为空');
        }else if(!isPhoneNum($.trim($('.select_box .cell_phone_num input').val()))){
            showMsg($('.error-msg'), '请输入正确手机号');
        }else if(isValContent($('.select_box .account input').val())){
            showMsg($('.error-msg'), '商业保险账号不能为空');
        }else if(isIncludeSpecalStr($('.select_box .account input').val())){
            showMsg($('.error-msg'), '商业保险账号中不能包含特殊字符');
        }else if(isValContent($('.select_box .password input').val())){
            showMsg($('.error-msg'), '密码不能为空');
        }else if(isIncludeSpecalStr($('.select_box .password input').val())){
            showMsg($('.error-msg'), '密码中不能包括特殊字符');
        }else{
            var _obj = JSON.stringify(obj, 'utf-8');
            $.ajax({
                type: 'POST',
                contentType: "text/html; charset=UTF-8",
                url: '/fintech-appbiz/api/APPBizRest/verifyInsuranceInfo/v1/',
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
                            getForm(data[x].field);
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
            if (l > 0 && gearVal!='NaN') {
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
                    itemStr += "<div class='tooth' website="+item[i].website+">" + item[i].name + "</div>";
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
            } else if(gearVal!='NaN') {
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
            $('#demo2').html(provinceText).attr('website',area_province.childNodes[provinceVal].attributes['website'].value);
            $('.select_box,.btn_sure').removeClass('hidden');
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