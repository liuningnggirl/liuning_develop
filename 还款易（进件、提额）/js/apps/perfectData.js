loader.init();
var mv = new mValidate();
var ERR_OK = 200;
var ERR_ERROR = 201;

var $nextFinal = $('.next-final');

(function(){
	initData();
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
swiper.lockSwipeToPrev();
var selectDate = new MobileSelectDate();
selectDate.init({trigger: '#jEnterT', min: '1999/01/01', position: "bottom"});

var oSelect = $('.select');
oSelect.on('change', function () {
    var oText = $(this).siblings('.select-text');
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
    },
    events: function () {
        var This = this;
        this.oNextStep.on('click', function () {
            This.nextStep(This);
        });
    },
    nextStep: function (This) {
        var validateType = $(This.oSwiperItem[swiper.activeIndex]).data('stype');
        This.oNextStep.html(This.nextText[swiper.activeIndex+1]);
        
        
        
        var lockCount = $('.ticket-list li.lock-hock').length;
        lockCount = lockCount == 1 ? 0 : lockCount;
        validateType = $(This.oSwiperItem[lockCount+1]).data('stype');
        swiper.slideTo(lockCount+1, 100, false);
        
        if (validateType == 'lbTIntoInfoCustomer') {//个人信息
            if (validateCustomer()) {//验证信息
                saveCustomer();
                if($('.lock-hock').length == 4){//完成三项认证 下一步操作
                	window.location.href = '/fintech-appbiz/repayH5/auzInfo.html';
                }
            }
        }
        if (validateType == 'lbTIntoInfoContact') {//联系人信息
            if (validateContact()) {//验证信息
                saveContact();
                if($('.lock-hock').length == 4){//完成三项认证 下一步操作
                	window.location.href = '/fintech-appbiz/repayH5/auzInfo.html';
                }
            }
        }
        if (validateType == 'lbTIntoInfoBankCard') {//银行卡信息
        	if(!$lbTIntoInfoBankCard.hasClass('lock-hock')){//银行卡信息 不能重复提交

                if (validateBankCard()) {//验证信息
                    saveBankCard();
                    if($('.lock-hock').length == 4){//完成三项认证 下一步操作
                    	window.location.href = '/fintech-appbiz/repayH5/auzInfo.html';
                    }
                }
        	}else{
        		if($('.lock-hock').length == 4){//完成三项认证 下一步操作
        			window.location.href = '/fintech-appbiz/repayH5/auzInfo.html';
                }
        	}
        }
        if (validateType == '07') {//人行征信
            if (validate07(true)) {//验证信息
            	save07();
                if($('.lock-hock').length == 4){//完成三项认证 下一步操作
                	window.location.href = '/fintech-appbiz/repayH5/auzInfo.html';
                }
            }
        }
        //swiper.slideNext();
        window.document.title = This.htmlTitle[swiper.activeIndex];
    }
};
nextSteps.init();

initYear()
//来本市年限
function initYear() {
    var star = 1970, end = new Date().getFullYear();
    var count = (end - star) + 1;
    var selectYear = $('#selectYear');
    var ops = [], i = 0;
    while (i < count) {
        ops.push('<option value="' + (end - i) + '">' + (end - i) + '年</option>');
        i++;
    }
    selectYear.append(ops.join(''));
}


var $lbTIntoInfoCustomer = $('#lbTIntoInfoCustomer'), $lbTIntoInfoContact = $('#lbTIntoInfoContact'), $lbTIntoInfoBankCard = $('#lbTIntoInfoBankCard');
//个人信息
var $selectYear = $('#selectYear'), $jName = $('#jName'), $jEnterT = $('#jEnterT'), $hDegree = $('#hDegree');
//联系人
var $conRelation = $('.conRelation'), $conNam = $('.conNam'), $conPhone = $('.conPhone');
//银行卡信息
$accountName = $('#accountName'), $bankCardAccount = $('#bankCardAccount'), $bankReservedPhone = $('#bankReservedPhone');
//人行征信
$bankAccount = $('#bankAccount'),$bankPwd = $('#bankPwd'),$bankCode = $('#bankCode');

var bandInfo = {
  setData: function (data) {
      var This = this;
      var responseBody = data.responseBody;
      var index = 0;
      if (responseBody.lbTIntoInfoCustomer != null && responseBody.lbTIntoInfoCustomer.length > 0) {//个人信息
    	  index = 1;
          $lbTIntoInfoCustomer.addClass('lock lock-hock');
          //回填信息
          var d = responseBody.lbTIntoInfoCustomer;
          This.band_lbTIntoInfoCustomer(d);
      }
      if (responseBody.lbTIntoInfoContact != null && responseBody.lbTIntoInfoContact.length > 0) {//联系人信息
    	  index = 2;
          $lbTIntoInfoContact.addClass('lock lock-hock');
          //回填信息
          var d = responseBody.lbTIntoInfoContact;
          This.band_lbTIntoInfoContact(d);
      }
      if (responseBody.lbTIntoInfoBankCard != null && responseBody.lbTIntoInfoBankCard.length > 0) {//银行卡信息
    	  index = 3;
          $lbTIntoInfoBankCard.addClass('lock disabled lock-hock');
          //回填信息
          var d = responseBody.lbTIntoInfoBankCard;
          This.band_lbTIntoInfoBankCard(d);
      }
      if(index != 0) showMsg($('.error-msg'), '检测到您认证到此步，请继续认证');
      swiper.slideTo(index, 100, false);
  },
  band_lbTIntoInfoCustomer: function (d) {//绑定个人信息
      var This = this;
      var d = d[0];
      $selectYear.val(d.inCityYear);
      $($selectYear).siblings('.select-text').html(d.inCityYear + '年');
      $jName.val(d.jName);
      $jEnterT.val(d.jEnterT);
      $hDegree.val(d.hDegree);
      $($hDegree).siblings('.select-text').html(This.getJEnterT(d.hDegree));
  },
  band_lbTIntoInfoContact: function (d) {//绑定联系人信息
	  var This = this;
      for (var i = 0; i < d.length; i++) {
          var contact = d[i].conRelation;
          var name = d[i].conName;
          var phone = d[i].conPhone;
          $conRelation.eq(i).val(contact);
          $conRelation.eq(i).siblings('.select-text').html(This.getContact(contact));
          $conNam.eq(i).val(name);
          //$conPhone.eq(i).val('*******' + phone.substr(phone.length - 4));
          $conPhone.eq(i).val(phone);
      }
  },
  band_lbTIntoInfoBankCard: function (d) {//绑定银行卡信息
	  var This = this;
      var d = d[0];
      $accountName.val(d.accountName);
      $bankCardAccount.val(d.bankCardAccount);
      $bankReservedPhone.val(d.bankReservedPhone);
  },
  getJEnterT: function (n) {
      var ret = '';
      switch (n) {
          case 0:
              ret = '硕士及以上';
              break;
          case 1:
              ret = '本科';
              break;
          case 2:
              ret = '专科';
              break;
          case 3:
              ret = '高中';
              break;
          case 5:
              ret = '初中及以下';
              break;
          default:
              ret = n;
      }
      return ret;
  },
  getContact: function (n) {
	  n = parseInt(n);
      var ret = '';
      switch (n) {
          case 0:
              ret = '本人';
              break;
          case 1:
              ret = '同事';
              break;
          case 2:
              ret = '配偶';
              break;
          case 3:
              ret = '父亲';
              break;
          case 4:
              ret = '母亲';
              break;
          case 5:
              ret = '其他亲属';
              break;
          case 6:
              ret = '朋友';
              break;
          case 7:
              ret = '同学';
              break;
          case 8:
              ret = '其他';
              break;
          case 9:
              ret = '子女';
              break;
          default:
              ret = n;
      }
      return ret;
  }
}



function initData(){
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	
	var _obj = JSON.stringify(obj,'utf-8');
    $.ajax({
    	type: 'POST',
    	contentType : "text/html; charset=UTF-8",
        url: '/fintech-appbiz/api/APPBizRest/queryApplyInfo/v1/',
        data: _obj,
        dataType: 'json',
        beforeSend: function () {
        	loader.showL();
        },
        success: function (data) {
        	if(data.retCode == ERR_OK){
        		//console.log(data);
        		bandInfo.setData(data);//回填数据
        	}
        	if(data.retCode == ERR_ERROR){
        		showMsg($('.error-msg'), data.errorDesc);
        	}
        	loader.hideL();
        },
        error: function () {
        	loader.hideL();
        }
    });
	
}



function validateCustomer(){//验证个人信息
	if (!mv.isEmpty($selectYear.val(), function(){
		showMsg($('.error-msg'), '请选择来本市年份');
	})) {
        return false;
    }
	if (!mv.isEmpty($jName.val(), function(){
		showMsg($('.error-msg'), '单位名称不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($jEnterT.val(), function(){
		showMsg($('.error-msg'), '请选择进入单位时间');
	})) {
        return false;
    }
	if (!mv.isEmpty($hDegree.val(), function(){
		showMsg($('.error-msg'), '请选择最高学历');
	})) {
        return false;
    }
	return true;
}
function validateContact(){//验证联系人信息
	if (!mv.isEmpty($conRelation.eq(0).val(), function(){
		showMsg($('.error-msg'), '请选择联系人与本人关系');
	})) {
        return false;
    }
	if (!mv.isEmpty($conNam.eq(0).val(), function(){
		showMsg($('.error-msg'), '请输入联系人姓名');
	})) {
        return false;
    }
	if (!mv.isEmpty($conPhone.eq(0).val(), function(){
		showMsg($('.error-msg'), '请输对应联系人手机号');
	})) {
        return false;
    }
	if (!mv.isEmpty($conRelation.eq(1).val(), function(){
		showMsg($('.error-msg'), '请选择联系人与本人关系');
	})) {
        return false;
    }
	if (!mv.isEmpty($conNam.eq(1).val(), function(){
		showMsg($('.error-msg'), '请输入联系人姓名');
	})) {
        return false;
    }
	if (!mv.isEmpty($conPhone.eq(1).val(), function(){
		showMsg($('.error-msg'), '请输对应联系人手机号');
	})) {
        return false;
    }
	return true;
}
function validateBankCard(){//验证银行卡信息
	if (!mv.isEmpty($accountName.val(), function(){
		showMsg($('.error-msg'), '请输入持卡人');
	})) {
        return false;
    }
	if (!mv.isEmpty($accountName.val(), function(){
		showMsg($('.error-msg'), '请输入卡号');
	})) {
        return false;
    }
	if (!mv.mobile($bankReservedPhone.val(), function(){
		showMsg($('.error-msg'), '请输入正确的预留手机号');
	})) {
        return false;
    }
	return true;
}
function validate07(flg){
	if (!mv.isEmpty($bankAccount.val(), function(){
		if(flg) showMsg($('.error-msg'), '征信账号不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($bankPwd.val(), function(){
		if(flg) showMsg($('.error-msg'), '征信中心密码不能为空');
	})) {
        return false;
    }
	if (!mv.isEmpty($bankCode.val(), function(){
		if(flg) showMsg($('.error-msg'), '征信中心验证码不能为空');
	})) {
        return false;
    }
	return true;
}

function saveCustomer() {//提交个人信息
    var _urlParse = urlParse();
    var obj = {};
    obj.mobile = _urlParse.mobile;//登录手机号
    obj.custName = _urlParse.custName;//姓名
    obj.cardNo = _urlParse.cardNo;//身份证号
    obj.consultId = _urlParse.consultId;//咨询单号
	obj.intoDetailType = 1;//进件明细类型
	obj.position = _urlParse.position;//位置
	obj.custmerManger = _urlParse.custmerManger;//门店经理
	
	obj.appAmount = _urlParse.appAmount;//申请金额
	obj.appPeriod = _urlParse.appPeriod;//申请期限

    obj.lbTIntoInfoCustomer = [];
    obj.lbTIntoInfoCustomer.push({
        inCityYear: $selectYear.val(),//来本市年份
        jName: $jName.val(),//单位名称
        jEnterT: $jEnterT.val(),//进入单位时间
        hDegree: $hDegree.val()//最高学历
    });
    
    var _obj = JSON.stringify(obj, 'utf-8');
    saveForm('/fintech-appbiz/api/APPBizRest/perfectApplyInfo/v1/', _obj, 'lbTIntoInfoCustomer');
}
function saveContact(){//提交联系人信息
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	obj.intoDetailType = 2;//进件明细类型
	obj.position = _urlParse.position;//位置
	obj.custmerManger = _urlParse.custmerManger;//门店经理
	
	obj.lbTIntoInfoContact = [];
	obj.lbTIntoInfoContact.push({
		contactType: 3,//联系类型
		conRelation: $conRelation.eq(0).val(),//和本人关系
		conName: $conNam.eq(0).val(),//姓名 
		conPhone: $conPhone.eq(0).val()//conPhone
	},{
		contactType: 3,//联系类型
		conRelation: $conRelation.eq(1).val(),//和本人关系
		conName: $conNam.eq(1).val(),//姓名 
		conPhone: $conPhone.eq(1).val()//conPhone
	});
	
	var _obj = JSON.stringify(obj,'utf-8');
	saveForm('/fintech-appbiz/api/APPBizRest/perfectApplyInfo/v1/', _obj, 'lbTIntoInfoContact');
}
function saveBankCard(){//提交银行卡信息
	var _urlParse = urlParse();
	var obj = {};
	obj.mobile = _urlParse.mobile;//登录手机号
	obj.custName = _urlParse.custName;//姓名
	obj.cardNo = _urlParse.cardNo;//身份证号
	obj.consultId = _urlParse.consultId;//咨询单号
	obj.intoDetailType = 3;//进件明细类型
	obj.position = _urlParse.position;//位置
	obj.custmerManger = _urlParse.custmerManger;//门店经理
	
	obj.lbTIntoInfoBankCard = [];
	obj.lbTIntoInfoBankCard.push({
		accountName: $bankCardAccount.val(),//卡号
		bankCardAccount: $bankCardAccount.val(),//卡号
		bankReservedPhone: $bankReservedPhone.val()//预留手机号
	});
	
	var _obj = JSON.stringify(obj,'utf-8');
	saveForm('/fintech-appbiz/api/APPBizRest/perfectApplyInfo/v1/', _obj, 'lbTIntoInfoBankCard');
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
/*
 * @obj: json格式字符串参数 JSON.stringfy({a:1,b:2},'utf-8')
 * @type：lbTIntoInfoCustomer[个人信息] lbTIntoInfoContact[联系人信息] lbTIntoInfoBankCard[银行卡信息] 07[人行征信]
 * */
function saveForm(url, obj, type) {
	$.ajax({
        type: 'POST',
    	contentType : "text/html; charset=UTF-8",
        url: url,
        data: obj,
        dataType: 'json',
        beforeSend: function () {
            loader.showL();
        },
        success: function (data) {
            if (data.retCode == ERR_OK) {
            	showMsg($('.error-msg'), '认证成功');
            	
            	if(type === 'lbTIntoInfoBankCard'){//TODO 最后一步 显示双按钮
            		$('.next-step-hock').hide();
                	$nextFinal.show();
                }
            	
            }
            if (data.retCode == ERR_ERROR) {
                showMsg($('.error-msg'), data.errorDesc);
            }
            loader.hideL();
        },
        error: function () {
            loader.hideL();
        }
    });
}

//点击获取手机号码
function getAppMobile(type, mobile) {
    $('#' + type).val(mobile);
}

$('.ticket-list').on('click',function(e){
	if( e.target.className.indexOf('ipt')<0 ){
		$('input').blur();
	}
});

//按钮逻辑
var changeSaveBtn = {
	aBtn: $('.next-final a:nth-of-type(2)'),
	bankAccount: $('#bankAccount'),
	bankPwd: $('#bankPwd'),
	bankCode: $('#bankCode'),
	init: function(){
		this.events();
	},
	events: function(){
		var This = this;
		This.bankAccount.on('input', function(){This.change(This)});
		This.bankPwd.on('input', function(){This.change(This)});
		This.bankCode.on('input', function(){This.change(This)});
	},
	change: function(This){
		if(validate07(false)){
			This.aBtn.addClass('active');
			This.aBtn.off('click').on('click', save07);
		}else{
			This.aBtn.removeClass('active');
			This.aBtn.off('click');
		}
	}
};
changeSaveBtn.init();

