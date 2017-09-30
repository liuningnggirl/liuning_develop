loader.init();
var mv = new mValidate();
var ERR_OK = 200;
var ERR_ERROR = 201;
var mobileList = null;//手机详单回执
var eBusiness = null;//电商回执
var isBeijing = false;
var timeOut = 120000;
var beijingCode = false;//默认北京电话不需要短信验证码

(function () {//更新状态
	var types = ['03', '06', '07'];
	var _obj = {};
	_obj.mobile = '18401592726';
	_obj.custName = '代用名';
	_obj.cardNo = '430512198908131367';
	_obj.grantType = '03,06,07'; //授权类型 01 :实名认证 02：活体认证 03：手机详单；04：社保 05 ：公积金06：电商 07：征信: 08：商业保险
	var __obj = JSON.stringify(_obj,'utf-8');
    $.ajax({
    	type: 'POST',
    	contentType : "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/appAuthorizeQuery/v1/',
        data: __obj,
        dataType: 'json',
        timeout: 120000,
        beforeSend: function () {
        	loader.showL();
        },
        success: function (data) {
        	//data = {
        		//    "errorDesc": null,
        		  //  "responseBody": {
        		    //    "dataList": [{"grantResult": "0001", "grantType": "03"},
        		      //      {"grantResult": "0001","grantType": "06"}
        		        //]
        		    //},
        		    //"retCode": "200"
        		//};
        	if(data.retCode == ERR_OK){
        		var dataList = data.responseBody.dataList;
        		var _index = 0;
        		for(var i=0; i<dataList.length; i++){
        			if(dataList[i].grantResult == '0001'){
        				var _obj = $('#type'+dataList[i].grantType);
        				if(_obj.length > 0){
            				$('#type'+dataList[i].grantType).addClass('lock');
            				_index = i;
        				}
        			}
        		}
        		_index = _index > $('.swiper-slide').length ? $('.swiper-slide').length - 1 : _index;
        		$('#type' + types[_index]).addClass('lock');
        		if(_index != 0) showMsg($('.error-msg'), '检测到您认证到此步，请继续认证');
        		swiper.slideTo(_index, 100, false);
        	}
        	if(data.retCode == ERR_ERROR){
        		showMsg($('.error-msg'), data.errorDesc);
        	}
        	loader.hideL();
        },
        error: function (e) {
        	if(e.statusText == 'timeout'){
            	showMsg($('.error-msg'), '网络请求超时');
        	}
        	loader.hideL();
        }
    });
    
})();


var swiper = new Swiper('.swiper-container', {
    pagination: '.swiper-pagination',
    paginationClickable: false,
    nextButton: '.next',
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 0,
    noSwiping : true,
    noSwipingClass: 'stop-swiping',
    onTouchEnd: function () {
        loader.showMask();
        setTimeout(function () {
            loader.hideMask();
        }, 300);
    },
    onSlideChangeStar: function () {
        if ($(".swiper-slide").eq(swiper.activeIndex).hasClass('lock')) {
            swiper.lockSwipeToPrev();
        } else {
            swiper.unlockSwipeToPrev();
        }
    },
    onSlideChangeEnd: function () {
        if ($(".swiper-slide").eq(swiper.activeIndex).hasClass('lock')) {
            swiper.lockSwipeToPrev();
        } else {
            swiper.unlockSwipeToPrev();
        }
    }
});

var oSelect = $('.select');
var oText = oSelect.siblings('.select-text');
oSelect.on('change', function () {
    oText.html($(this).find("option:selected").text());
});

//下一步操作
var nextSteps = {
    oNextStep: null,
    oSwiperItem: null,
    oNextText: null,
    nextText: ['下一步', '下一步', '下一步', '提交'],
    htmlTitle: [],
    init: function () {
        var This = this;
        This.oNextStep = $('.next-step-hock');
        This.oSwiperItem = $('.ticket-list li');
        This.oNextStep.find('text');
        for (var i = 0; i < This.oSwiperItem.length; i++) {
            var text = This.oSwiperItem[i].getElementsByTagName('h2')[0].innerHTML;
            This.htmlTitle.push(text);
        }
        window.document.title = This.htmlTitle[swiper.activeIndex];
        This.events();
        this.lockToPrevByIndex();
    },
    events: function () {
        var This = this;
        this.oNextStep.on('click', function () {
            This.nextStep(This);
        });
    },
    lockToPrevByIndex: function () {
        var This = this;
        if ($(This.oSwiperItem[swiper.activeIndex]).hasClass('lock')) {
            swiper.lockSwipeToPrev();
        } else {
            swiper.unlockSwipeToPrev();
        }
    },
    nextStep: function (This) {
        This.methods.unlockStep();
        var validateType = $(This.oSwiperItem[swiper.activeIndex]).data('stype');
        This.oNextStep.html(This.nextText[swiper.activeIndex+1]);
        // console.log(validateType);
        
        var lockCount = $('.ticket-list li.lock').length;
        lockCount = lockCount == 1 ? 0 : lockCount;
        swiper.slideTo(lockCount, 100, false);
        validateType = This.oSwiperItem.eq(lockCount).data('stype');
        
        if (validateType == '03') {//运营商授权
            if (validate03()) {//验证信息
                save03();
            }
        }
        if (validateType == '06') {//电商授权
            if (validate06()) {//验证信息
                save06();
            }
        }
        if (validateType == '07') {//征信授权
            if (true) {//验证信息
                save07();
            }
        }
        //swiper.slideNext();
        This.methods.lockStep();
        window.document.title = This.htmlTitle[swiper.activeIndex];
    },
    methods: {
        lockStep: function () {
            //loader.hideL();
            //swiper.lockSwipes();
        },
        unlockStep: function () {
            //loader.showL();
            //swiper.unlockSwipes();
        }
    }
};
nextSteps.init();

//忘记密码
var forgetPwd = {
    forgetPwd: null,
    operatorForgetpwd: null,
    close: null,
    init: function () {
        this.forgetPwd = $('.forget-pwd');
        this.operatorForgetpwd = $('.operator-forgetpwd');
        this.close = $('.operator-forgetpwd .close');
        this.events();
    },
    events: function () {
        var This = this;
        This.forgetPwd.on('click', function () {
            This.operatorForgetpwd.addClass('active');
        });
        this.close.on('click', function () {
            This.operatorForgetpwd.removeClass('active');
        });
    }
};
forgetPwd.init();
var $phoneAccount = $('#phoneAccount'),$phonePwd = $('#phonePwd'),$operatorCode = $('#operatorCode'),$phoneQueryPwd = $('#phoneQueryPwd'),$selectRetail = $('#selectRetail'),$retailAccount = $('#retailAccount'),
$retailPwd = $('#retailPwd'),$retailCode = $('#retailCode'),$bankAccount = $('#bankAccount'),$bankPwd = $('#bankPwd'),$bankCode = $('#bankCode');
//获取手机详单回执
$phoneAccount.on('input',function(){
	if (mv.mobile($phoneAccount.val())){
		getMobileList($phoneAccount.val());
	}
});
function save03(callback) {//运营商授权
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.account = $phoneAccount.val();
	obj.password = $phonePwd.val();

	//obj.captcha = mobileList.datasource.category;//网站短信验证码
	//obj.queryPwd = $phonePwd.val();//网站查询密码
	obj.token = mobileList.token;//token
	obj.website = mobileList.datasource.website;//网站英文名称
	obj.category = mobileList.datasource.category;//网站分类英文名称
	
	//if(!mobileList) getMobileList($phoneAccount.val());
	
	if(isBeijing){
		obj.queryPwd = $phoneQueryPwd.val();//网站查询密码
		obj.type = 3;//mobileList.category;//业务操作类型
	}else{
		obj.type = 1;//mobileList.category;//业务操作类型
		obj.captcha = $operatorCode.val();//网站短信验证码
	}
	if(beijingCode){
		obj.type = 1;//mobileList.category;//业务操作类型
		obj.captcha = $operatorCode.val();//网站短信验证码
	}
	
	//obj.name = mobileList.datasource.name;//北京移动·中国联通
	//if(obj.name == '北京移动'){//北京移动 需要服务密码
	//	$phonePwd.parent().slideDown();
	//	$operatorCode.parent().slideUp();
	//}else{//其他类型 需要验证码
	//	$phonePwd.parent().slideUp();
	//	$operatorCode.parent().slideDown();
	//}

	var _obj = JSON.stringify(obj,'utf-8');
	saveForm('/fintech-appbiz/api/APPBizRest/submitMobileList/v1/', _obj, '03');
	
}
function save06() {//电商授权
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.type = $selectRetail.val();
	obj.account = $retailAccount.val();
	obj.password = $retailPwd.val();
	var _obj = JSON.stringify(obj,'utf-8');
	saveForm('/fintech-appbiz/api/APPBizRest/submitMobileList/v1/', _obj, '06');
}
function save07() {//人行征信授权
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.account = $bankAccount.val();
	obj.password = $bankPwd.val();
	obj.captcha = $bankCode.val();//央行征信 验证码
	var _obj = JSON.stringify(obj,'utf-8');
	saveForm('/fintech-appbiz/api/APPBizRest/submitBankCredit/v1/', _obj, '07');
}

// 验证方法
function validate03(){//var $phoneAccount = $('#phoneAccount'),$phonePwd = $('#phonePwd');
	if (!mv.mobile($phoneAccount.val(), function(){
		showMsg($('.error-msg'), '请输入正确的手机号码');
	})) {
        return false;
    }
	if (!mv.isEmpty($phonePwd.val(), function(){
		showMsg($('.error-msg'), '服务密码不能为空');
	})) {
        return false;
    }
	if(isBeijing){
		if (!mv.isEmpty($phoneQueryPwd.val(), function(){
			showMsg($('.error-msg'), '查询密码不能为空');
		})) {
	        return false;
	    }
	}else{
		if (!mv.isEmpty($operatorCode.val(), function(){
			showMsg($('.error-msg'), '验证码不能为空');
		})) {
	        return false;
	    }
		if(beijingCode){
			if (!mv.isEmpty($phoneQueryPwd.val(), function(){
				showMsg($('.error-msg'), '查询密码不能为空');
			})) {
		        return false;
		    }
		}
	}
	return true;
}
function validate06(){ //电商
	if (!mv.isEmpty($retailAccount.val(), function(){
		showMsg($('.error-msg'), '账号不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($retailPwd.val(), function(){
		showMsg($('.error-msg'), '密码不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($retailCode.val(), function(){
		showMsg($('.error-msg'), '验证码不能为空');
	})) {
        return false;
    }
	return true;
}
function validate07(){
	if (!mv.isEmpty($bankAccount.val(), function(){
		showMsg($('.error-msg'), '征信账号不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($bankPwd.val(), function(){
		showMsg($('.error-msg'), '征信中心密码不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($bankCode.val(), function(){
		showMsg($('.error-msg'), '征信中心验证码不能为空');
	})) {
        return false;
    }
	return true;
}

function saveForm(postUrl, obj, type) {
	$.ajax({
        type: 'POST',
    	contentType : "text/html; charset=UTF-8",
        url: postUrl,
        data: obj,
        dataType: 'json',
        timeout: 120000,
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
        	//测试数据
        	//data = {retCode:200,responseBody:{status:'0001'}};
        	
            if (data.retCode == ERR_OK) {
                var dataList = data.responseBody;
                if(dataList.status == '0001'){
                	loader.showMask(); //防止误碰 加蒙板
                	$('#type' + type).addClass('lock');
                	showMsg($('.error-msg'), '认证成功');
                	setTimeout(function(){
                		swiper.slideNext();
                		//锁定当前和下一个模块
                		$(".swiper-slide").eq(swiper.activeIndex).addClass('lock');
                    	loader.hideMask();
                	},1500);
                	if(type == '06'){
                		window.loaction.href = '/fintech-appbiz/repayH5/perfectData.html';
                	}
                }
                if(dataList.status == '0002'){
                	showMsg($('.error-msg'), dataList.errorDesc);
                }
                if(dataList.status == '0003'){
                	showMsg($('.error-msg'), '认证超时，请重试');
                }
                if(dataList.status == '0004'){
                	showMsg($('.error-msg'), '认证中');
                }
            }
            if (data.retCode == ERR_ERROR) {
                showMsg($('.error-msg'), data.errorDesc);
            }
            beijingCode = false;//重置为不需要短信验证码
            if (data.errorDesc == '输入动态密码'){//还需要再输入短信验证码
            	beijingCode = true;
        		$operatorCode.parent().slideDown();
            }
            loader.hideL();
        },
        error: function (e) {
        	if(e.statusText == 'timeout'){
            	showMsg($('.error-msg'), '网络请求超时');
        	}
            loader.hideL();
        }
    });
}

//getMobileList();
//获取手机详单回执
function getMobileList(mobile) {
	var _urlParse = urlParse();
	var obj = {};
	obj.account = mobile;//运营商登录手机号

	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.account = $phoneAccount.val();//
	var _obj = JSON.stringify(obj,'utf-8');
	
    $.ajax({
        type: 'POST',
    	contentType : "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/receiptMobileList/v1/',
        data: _obj,
        dataType: 'json',
        timeout: 120000,
        beforeSend: function () {
            loader.showL();
        }, 
        success: function (data) {
            if (data.retCode == ERR_OK) {
            	mobileList = data.responseBody;
            	var name = data.responseBody.datasource.name;//北京移动·中国联通
            	if(name == '北京移动'){//北京移动 需要服务密码
            		isBeijing = true;
            		$phoneQueryPwd.parent().slideDown();
            		$operatorCode.parent().slideUp();
            	}else{//其他类型 需要验证码
            		isBeijing = false;
            		$phoneQueryPwd.parent().slideUp();
            		$operatorCode.parent().slideDown();
            	}
            }
            if (data.retCode == ERR_ERROR) {
                showMsg($('.error-msg'), data.errorDesc);
            }
            loader.hideL();
        },
        error: function (e) {
        	if(e.statusText == 'timeout'){
            	showMsg($('.error-msg'), '网络请求超时');
        	}
            loader.hideL();
        }
    });
}

//getEBusiness();
//获取电商回执
function getEBusiness() {
	
	//if(!validate06()) return false;
	
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.website = 'jingdong';//咨询单号
	obj.category = 'e_business';//咨询单号
	obj.account = $retailAccount.val();
	var _obj = JSON.stringify(obj,'utf-8');
	
  $.ajax({
      type: 'POST',
  	  contentType : "text/html; charset=UTF-8",
      url: '/fintech-appbiz/api/APPBizRest/receiptOnlineRetailer/v1/',
      data: _obj,
      dataType: 'json',
      timeout: 120000,
      async: false,
      beforeSend: function () {
          loader.showL();
      }, 
      success: function (data) {
          if (data.retCode == ERR_OK) {
        	  eBusiness = data.responseBody;	
          }
          if (data.retCode == ERR_ERROR) {
              showMsg($('.error-msg'), data.errorDesc);
          }
          loader.hideL();
      },
      error: function (e) {
      	if(e.statusText == 'timeout'){
        	showMsg($('.error-msg'), '网络请求超时');
    	}
          loader.hideL();
      }
  });
}

//发送短信验证码
var getMobileCode = function () {
};
getMobileCode.prototype = {
    oBtn: null,
    url: "",
    obj: null,
    timeOut: Number,
    temp: Number,
    init: function (oBtn, timeOut, url, obj, fn) {// @oBtn倒计时点击按钮 @timeOut倒计时时间/秒 @url异步获取验证码地址
        this.oBtn = oBtn;
        this.url = url;
        this.obj = obj;
        this._obj = null,
        this.timeOut = timeOut;
        this.fn = fn;
        this.events();
    },
    events: function () {
        var This = this;
        This.oBtn.on('click', function () {
        	if(This.fn && This.fn()){
            	This.send();
        	}
        });
    },
    send: function () {
        var This = this;
        This.temp = This.timeOut;
        This._obj = This.obj && This.obj();
    	var _obj = JSON.stringify(This._obj,'utf-8');
        $.ajax({
        	type: 'POST',
        	contentType : "text/html; charset=UTF-8",
            url: This.url,
            data: _obj,
            dataType: 'json',
            timeout: 120000,
            beforeSend: function () {
                loader.showL();
            },
            success: function (d) {
                loader.hideL();
                if (d.retCode == ERR_OK) {
                    
                }
                
              //This.oBtn.html((This.timeOut-1) + 's').addClass('active');
	        	This.oBtn.addClass('active');
	            This.oBtn.off('click');
	            clearInterval(This.oBtn.timer);
	            This.oBtn.timer = setInterval(function () {
	                This.oBtn.html((This.temp-1) + 's');
	                if (This.temp <= 0) {
	                    This.oBtn.on('click', function () {
	                        This.send();
	                    });
	                    This.oBtn.removeClass('active').html('获取');
	                    clearInterval(This.oBtn.timer);
	                }
	                This.temp--;
                }, 1000);
                
                if (d.retCode == ERR_ERROR) {
                    showMsg($('.error-msg'), d.errorDesc);
                }
            },
            error: function (e) {
            	if(e.statusText == 'timeout'){
                	showMsg($('.error-msg'), '网络请求超时');
            	}
                loader.hideL();
            }
        });
    }
}

var sendCode = new getMobileCode();
sendCode.init($('.mobile-code'), 10, '/fintech-appbiz/api/APPBizRest/submitMobileList/v1/',function(){
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.account = $phoneAccount.val();
	obj.password = $phonePwd.val();

	obj.type = 1;//mobileList.category;//业务操作类型
	//obj.captcha = mobileList.datasource.category;//网站短信验证码
	obj.queryPwd = $phonePwd.val();//网站查询密码
	obj.token = mobileList.token;//token
	obj.website = mobileList.datasource.website;//网站英文名称
	obj.category = mobileList.datasource.category;//网站分类英文名称
	return obj;
},function(){
	if (!mv.mobile($phoneAccount.val(), function(){
		showMsg($('.error-msg'), '请输入正确的手机号码');
	})) {
        return false;
    }
	if (!mv.isEmpty($phonePwd.val(), function(){
		showMsg($('.error-msg'), '服务密码不能为空');
	})) {
        return false;
    }
	return true;
});

var sendRetailCode = new getMobileCode();
sendRetailCode.init($('.retail-code'), 10, '/fintech-appbiz/api/APPBizRest/submitOnlineRetailer/v1/',function(){
	getEBusiness();
	
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	obj.type = $selectRetail.val();
	obj.account = $retailAccount.val();
	obj.password = $retailPwd.val();
	
	obj.token = eBusiness.token;//token
	obj.website = 'jingdong';//网站英文名称
	obj.category = 'e_business';//网站分类英文名称
	
	return obj;
}, function(){
	if (!mv.isEmpty($retailAccount.val(), function(){
		showMsg($('.error-msg'), '账号不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($retailPwd.val(), function(){
		showMsg($('.error-msg'), '密码不能为空');
	})) {
        return false;
    }
	return true;
});
$('.ticket-list').on('click',function(e){
	if( e.target.className.indexOf('ipt')<0 ){
		$('input').blur();
	}
});
