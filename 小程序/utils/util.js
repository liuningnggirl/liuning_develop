function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime
}
module.exports = {
  getFinalRequestObject: getFinalRequestObject
}






//获取最终的请求参数
function getFinalRequestObject(appParams) {
  //系统参数
  var finalParams = new Object();
  finalParams.app_id = 'h5gzh';
  finalParams.nonce = Math.ceil(Math.random() * 1000000);
  finalParams.timestamp = Date.parse(new Date());
  finalParams.version = '3.0';
  finalParams.build = '2';
  finalParams.udid = 'h5';
  finalParams.devicemodel = getDeviceModel();
  finalParams.sysname = getSysName();
  finalParams.sysversion = getSysVersion();

  //放入应用参数
  if (appParams != null && appParams != undefined) {
    //自动添加一个请求参数accessToken
    if (strIsEmpty(appParams.accessToken)) {
      console.log(getAccessToken());
      appParams.accessToken = getAccessToken();
      
    }
    for (var prop in appParams) {
      //只保留不为空的参数
      if (appParams[prop] != null && appParams[prop] != undefined
        && appParams[prop].length != 0) {
        finalParams[prop] = appParams[prop];
      }
    }

  }
  //生成sign
  finalParams.sign = getSign(finalParams);
  return finalParams;
}

//获取设备类型
function getDeviceModel(){
  var model = '';
  wx.getSystemInfo({
    success: function (res) {
      model = res.model
    }
  })
  return model;
}

function getSysName() {
  var system = '';
  wx.getSystemInfo({
    success: function (res) {
      system = res.system
    }
  })
  return system;
}

function getSysVersion() {
  return "";
}
//根据请求数据中的系统参数和应用参数，生成sign
function getSign(requestObject) {
  var appsecret = '123456';
  var signArray = new Array();
  for (var prop in requestObject) {
    signArray.push(prop + '');
    //signArray.push(prop + '=' + requestObject[prop]);
  }
  var originstr = getSignKeyValueStr(requestObject, signArray, appsecret);
  return md5(originstr);
}

//生成key=value类型字符串
function getSignKeyValueStr(requestObject, signArray, appsecret) {
  var resultArray = quickSort(signArray);
  var str = '';
  for (var i = 0; i < resultArray.length; i++) {
    str += (resultArray[i] + '=' + requestObject[resultArray[i]]);
    str += '&';
  }
  return str + appsecret;
}

//对请求参数进行快速排序
function quickSort(arr) {
  if (arr.length <= 1) {
    return arr;
  }
  var pivotIndex = Math.floor(arr.length / 2);
  var pivot = arr.splice(pivotIndex, 1)[0];
  var left = [];
  var right = [];
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] < pivot) {
      left.push(arr[i]);
    } else {
      right.push(arr[i]);
    }
  }
  return quickSort(left).concat([pivot], quickSort(right));
}


// 从地址栏中获取参数
function getParam(name) {
  var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    return decodeURI(r[2]);
  return '';
}

//从地址栏中获取参数(因为2.2之前的ios跳转到webview获取的url地址没有组装上=后的参数，所以导致页面获取不到参数，这里把reg中的=换成了%3d)
function getParamHack(name) {
  var reg = new RegExp("(^|&)" + name + "_3d([^&]*)(&|$)");
  var r = window.location.search.substr(1).match(reg);
  if (r != null)
    var val = decodeURI(r[2]);
  //微信分享后会给这里添加等号
  if (val.indexOf('=') == (val.length - 1)) {
    val = val.substring(0, val.length - 1);
  }
  return val;
  return '';
}

// 判断字符串是否为空
function strIsEmpty(str) {
  if (str == undefined || str == null || $.trim(str).length == 0) {
    return true;
  }
  return false;
}

// 从地址栏和本地存储中获取accessToken，地址栏参数优先
function getAccessToken() {
  var accessToken = '';
  var appAccessToken = wx.getStorageSync('accessToken');
  // var queryAccessToken = getParam("accessToken");
  // if (!strIsEmpty(appAccessToken) || !strIsEmpty(queryAccessToken)) {
  //   accessToken = !strIsEmpty(queryAccessToken) ? queryAccessToken : appAccessToken;
  // }


  // storage中始终存储最新的accessToken
  wx.setStorageSync('accessToken', accessToken);
  return accessToken;
}
//设置accessToken
function setAccessToken(accessToken) {
  wx.getStorageSync('accessToken') = accessToken;
}


// 验证手机号是否正确
function isPhoneNum(phoneNum) {
  var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
  return reg.test(phoneNum);
}

//当前页面是否在微信内
// function isInWeixin() {
//   var ua = navigator.userAgent.toLowerCase();
//   if (ua.match(/MicroMessenger/i) == "micromessenger") {
//     return true;
//   } else {
//     return false;
//   }
// }

//微信浏览器版本是否小于5.0
// function isWeixinLessThan5() {
//   var wechatInfo = navigator.userAgent.match(/MicroMessenger\/([\d\.]+)/i);
//   return wechatInfo[1] < "5.0";
// }

//回退到上一个页面
// function goBack() {
//   if ((navigator.userAgent.indexOf('MSIE') >= 0) && (navigator.userAgent.indexOf('Opera') < 0)) { // IE
//     if (history.length > 0) {
//       window.history.go(-1);
//     }
//   } else { //非IE浏览器
//     if (navigator.userAgent.indexOf('Firefox') >= 0 ||
//       navigator.userAgent.indexOf('Opera') >= 0 ||
//       navigator.userAgent.indexOf('Safari') >= 0 ||
//       navigator.userAgent.indexOf('Chrome') >= 0 ||
//       navigator.userAgent.indexOf('WebKit') >= 0) {

//       if (window.history.length > 1) {
//         window.history.go(-1);
//       }
//       ;
//     } else { //未知的浏览器
//       window.history.go(-1);
//     }
//   }
// }

//1,如果accessToken无效,则执行errorfun函数
//2,如果accessToken有效,则执行successfun函数
function checkAccessToken(successfun, errorfun) {
  if (strIsEmpty(getAccessToken())) {
    if (typeof (errorfun) == 'function') {
      errorfun();
    }
    else {
      location.href = 'login_new.html?v=<%= VERSION %>';
    }
  };

  var data = getFinalRequestObject({
    accessToken: getAccessToken()
  });

  $.ajax({
    type: 'GET',
    url: 'https://testugc.nggirl.com.cn/nggirl/app/cli/checkAccessToken',
    data: data,
    dataType: 'json',
    success: function (result) {
      //授权令牌无效
      if (result.code != 0) {
        if (typeof (errorfun) == 'function') {
          errorfun();
        }
        else {
          location.href = 'login_new.html';
        }
      }
      //授权令牌有效
      else {
        if (typeof (successfun) == 'function') {
          successfun();
        } else {
          //goBack();
        }
      }
    }
  });
}


//1,如果accessToken无效,则进入登录页面
//1.1,登录成功后跳转到redirectUrlAfterLogin页面
//1.2,如果没有设置redirectUrlAfterLogin,则会退到上一个页面
//2,如果accessToken有效,则执行successfun函数
function checkAccessTokenLogin(successfun, redirectUrlAfterLogin) {

  if (strIsEmpty(getAccessToken())) {
    if (!strIsEmpty(redirectUrlAfterLogin)) {
      setRedirectUrlAfterLogin(redirectUrlAfterLogin);
    } else {
      setRedirectUrlAfterLogin('');
    }
    location.href = 'login_new.html?v=<%= VERSION %>';
  };

  var data = getFinalRequestObject({
    accessToken: getAccessToken()
  });

  $.ajax({
    type: 'GET',
    url: 'https://testugc.nggirl.com.cn/nggirl/app/cli/checkAccessToken',
    data: data,
    dataType: 'json',
    success: function (result) {
      //授权令牌无效,就登录
      if (result.code != 0) {
        if (!strIsEmpty(redirectUrlAfterLogin)) {
          setRedirectUrlAfterLogin(redirectUrlAfterLogin);
        } else {
          setRedirectUrlAfterLogin('');
        }
        location.href = 'login_new.html';
      }
      //授权令牌有效
      else {
        if (typeof (successfun) == 'function') {
          successfun();
        } else {
          //goBack();
        }
      }
    }
  });
}

//获取登录后的重定向地址
function getRedirectUrlAfterLogin() {
  return storage.redirectUrlAfterLogin;
}

//设置登录后的重定向地址
function setRedirectUrlAfterLogin(redirectUrlAfterLogin) {
  storage.redirectUrlAfterLogin = redirectUrlAfterLogin;
}

function toString(obj) {
  if (obj == null || obj == undefined) {
    return '';
  }
  return '' + obj;
}

//设置服务号的appid
function getFwhAppId() {
  /*var code=getRedirectUrlAfterLogin();
  return code;*/
  return '<%= FWH_APPID %>';
}

//判断页面是否在app中打开
// function isInApp() {
//   return /nggirl/gi.test(navigator.userAgent);
// }

// wx.setStorage({
//   key: 'storage',
//   data: '我是storeage异步存储的信息',
//   success: function (res) {
//     console.log(res)
//   }
// })


// wx.getStorage({
//   //获取数据的key
//   key: 'storage',
//   success: function (res) {
//     console.log(res)
//     that.setData({
//       //
//       storageContent: res.data
//     })
//   }
// })
wx.setStorageSync('key', 'kkkkkkk');
console.log(wx.getStorageSync('key'));

// console.log(wx.getSystemInfo({
//   success: function(res) {
//     res.model
//   },
// }));








////////////   md5
var rotateLeft = function (lValue, iShiftBits) {
  return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
}

var addUnsigned = function (lX, lY) {
  var lX4, lY4, lX8, lY8, lResult;
  lX8 = (lX & 0x80000000);
  lY8 = (lY & 0x80000000);
  lX4 = (lX & 0x40000000);
  lY4 = (lY & 0x40000000);
  lResult = (lX & 0x3FFFFFFF) + (lY & 0x3FFFFFFF);
  if (lX4 & lY4)
    return (lResult ^ 0x80000000 ^ lX8 ^ lY8);
  if (lX4 | lY4) {
    if (lResult & 0x40000000)
      return (lResult ^ 0xC0000000 ^ lX8 ^ lY8);
    else
      return (lResult ^ 0x40000000 ^ lX8 ^ lY8);
  } else {
    return (lResult ^ lX8 ^ lY8);
  }
}

var md5F = function (x, y, z) {
  return (x & y) | ((~x) & z);
}

var G = function (x, y, z) {
  return (x & z) | (y & (~z));
}

var md5H = function (x, y, z) {
  return (x ^ y ^ z);
}

var I = function (x, y, z) {
  return (y ^ (x | (~z)));
}

var FF = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(md5F(b, c, d), x), ac));
  return addUnsigned(rotateLeft(a, s), b);
};

var GG = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(G(b, c, d), x), ac));
  return addUnsigned(rotateLeft(a, s), b);
};

var HH = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(md5H(b, c, d), x), ac));
  return addUnsigned(rotateLeft(a, s), b);
};

var II = function (a, b, c, d, x, s, ac) {
  a = addUnsigned(a, addUnsigned(addUnsigned(I(b, c, d), x), ac));
  return addUnsigned(rotateLeft(a, s), b);
};

var convertToWordArray = function (string) {
  var lWordCount;
  var lMessageLength = string.length;
  var lNumberOfWordsTempOne = lMessageLength + 8;
  var lNumberOfWordsTempTwo = (lNumberOfWordsTempOne - (lNumberOfWordsTempOne % 64)) / 64;
  var lNumberOfWords = (lNumberOfWordsTempTwo + 1) * 16;
  var lWordArray = Array(lNumberOfWords - 1);
  var lBytePosition = 0;
  var lByteCount = 0;
  while (lByteCount < lMessageLength) {
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = (lWordArray[lWordCount] | (string
      .charCodeAt(lByteCount) << lBytePosition));
    lByteCount++;
  }
  lWordCount = (lByteCount - (lByteCount % 4)) / 4;
  lBytePosition = (lByteCount % 4) * 8;
  lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
  lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
  lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
  return lWordArray;
};

var wordToHex = function (lValue) {
  var WordToHexValue = "", WordToHexValueTemp = "", lByte, lCount;
  for (lCount = 0; lCount <= 3; lCount++) {
    lByte = (lValue >>> (lCount * 8)) & 255;
    WordToHexValueTemp = "0" + lByte.toString(16);
    WordToHexValue = WordToHexValue
      + WordToHexValueTemp.substr(WordToHexValueTemp.length - 2, 2);
  }
  return WordToHexValue;
};

var uTF8Encode = function (string) {
  string = string.replace(/\x0d\x0a/g, "\x0a");
  var output = "";
  for (var n = 0; n < string.length; n++) {
    var c = string.charCodeAt(n);
    if (c < 128) {
      output += String.fromCharCode(c);
    } else if ((c > 127) && (c < 2048)) {
      output += String.fromCharCode((c >> 6) | 192);
      output += String.fromCharCode((c & 63) | 128);
    } else {
      output += String.fromCharCode((c >> 12) | 224);
      output += String.fromCharCode(((c >> 6) & 63) | 128);
      output += String.fromCharCode((c & 63) | 128);
    }
  }
  return output;
};

function md5(string) {
  var x = Array();
  var k, AA, BB, CC, DD, a, b, c, d;
  var S11 = 7, S12 = 12, S13 = 17, S14 = 22;
  var S21 = 5, S22 = 9, S23 = 14, S24 = 20;
  var S31 = 4, S32 = 11, S33 = 16, S34 = 23;
  var S41 = 6, S42 = 10, S43 = 15, S44 = 21;
  string = uTF8Encode(string);
  x = convertToWordArray(string);
  a = 0x67452301;
  b = 0xEFCDAB89;
  c = 0x98BADCFE;
  d = 0x10325476;
  for (k = 0; k < x.length; k += 16) {
    AA = a;
    BB = b;
    CC = c;
    DD = d;
    a = FF(a, b, c, d, x[k + 0], S11, 0xD76AA478);
    d = FF(d, a, b, c, x[k + 1], S12, 0xE8C7B756);
    c = FF(c, d, a, b, x[k + 2], S13, 0x242070DB);
    b = FF(b, c, d, a, x[k + 3], S14, 0xC1BDCEEE);
    a = FF(a, b, c, d, x[k + 4], S11, 0xF57C0FAF);
    d = FF(d, a, b, c, x[k + 5], S12, 0x4787C62A);
    c = FF(c, d, a, b, x[k + 6], S13, 0xA8304613);
    b = FF(b, c, d, a, x[k + 7], S14, 0xFD469501);
    a = FF(a, b, c, d, x[k + 8], S11, 0x698098D8);
    d = FF(d, a, b, c, x[k + 9], S12, 0x8B44F7AF);
    c = FF(c, d, a, b, x[k + 10], S13, 0xFFFF5BB1);
    b = FF(b, c, d, a, x[k + 11], S14, 0x895CD7BE);
    a = FF(a, b, c, d, x[k + 12], S11, 0x6B901122);
    d = FF(d, a, b, c, x[k + 13], S12, 0xFD987193);
    c = FF(c, d, a, b, x[k + 14], S13, 0xA679438E);
    b = FF(b, c, d, a, x[k + 15], S14, 0x49B40821);
    a = GG(a, b, c, d, x[k + 1], S21, 0xF61E2562);
    d = GG(d, a, b, c, x[k + 6], S22, 0xC040B340);
    c = GG(c, d, a, b, x[k + 11], S23, 0x265E5A51);
    b = GG(b, c, d, a, x[k + 0], S24, 0xE9B6C7AA);
    a = GG(a, b, c, d, x[k + 5], S21, 0xD62F105D);
    d = GG(d, a, b, c, x[k + 10], S22, 0x2441453);
    c = GG(c, d, a, b, x[k + 15], S23, 0xD8A1E681);
    b = GG(b, c, d, a, x[k + 4], S24, 0xE7D3FBC8);
    a = GG(a, b, c, d, x[k + 9], S21, 0x21E1CDE6);
    d = GG(d, a, b, c, x[k + 14], S22, 0xC33707D6);
    c = GG(c, d, a, b, x[k + 3], S23, 0xF4D50D87);
    b = GG(b, c, d, a, x[k + 8], S24, 0x455A14ED);
    a = GG(a, b, c, d, x[k + 13], S21, 0xA9E3E905);
    d = GG(d, a, b, c, x[k + 2], S22, 0xFCEFA3F8);
    c = GG(c, d, a, b, x[k + 7], S23, 0x676F02D9);
    b = GG(b, c, d, a, x[k + 12], S24, 0x8D2A4C8A);
    a = HH(a, b, c, d, x[k + 5], S31, 0xFFFA3942);
    d = HH(d, a, b, c, x[k + 8], S32, 0x8771F681);
    c = HH(c, d, a, b, x[k + 11], S33, 0x6D9D6122);
    b = HH(b, c, d, a, x[k + 14], S34, 0xFDE5380C);
    a = HH(a, b, c, d, x[k + 1], S31, 0xA4BEEA44);
    d = HH(d, a, b, c, x[k + 4], S32, 0x4BDECFA9);
    c = HH(c, d, a, b, x[k + 7], S33, 0xF6BB4B60);
    b = HH(b, c, d, a, x[k + 10], S34, 0xBEBFBC70);
    a = HH(a, b, c, d, x[k + 13], S31, 0x289B7EC6);
    d = HH(d, a, b, c, x[k + 0], S32, 0xEAA127FA);
    c = HH(c, d, a, b, x[k + 3], S33, 0xD4EF3085);
    b = HH(b, c, d, a, x[k + 6], S34, 0x4881D05);
    a = HH(a, b, c, d, x[k + 9], S31, 0xD9D4D039);
    d = HH(d, a, b, c, x[k + 12], S32, 0xE6DB99E5);
    c = HH(c, d, a, b, x[k + 15], S33, 0x1FA27CF8);
    b = HH(b, c, d, a, x[k + 2], S34, 0xC4AC5665);
    a = II(a, b, c, d, x[k + 0], S41, 0xF4292244);
    d = II(d, a, b, c, x[k + 7], S42, 0x432AFF97);
    c = II(c, d, a, b, x[k + 14], S43, 0xAB9423A7);
    b = II(b, c, d, a, x[k + 5], S44, 0xFC93A039);
    a = II(a, b, c, d, x[k + 12], S41, 0x655B59C3);
    d = II(d, a, b, c, x[k + 3], S42, 0x8F0CCC92);
    c = II(c, d, a, b, x[k + 10], S43, 0xFFEFF47D);
    b = II(b, c, d, a, x[k + 1], S44, 0x85845DD1);
    a = II(a, b, c, d, x[k + 8], S41, 0x6FA87E4F);
    d = II(d, a, b, c, x[k + 15], S42, 0xFE2CE6E0);
    c = II(c, d, a, b, x[k + 6], S43, 0xA3014314);
    b = II(b, c, d, a, x[k + 13], S44, 0x4E0811A1);
    a = II(a, b, c, d, x[k + 4], S41, 0xF7537E82);
    d = II(d, a, b, c, x[k + 11], S42, 0xBD3AF235);
    c = II(c, d, a, b, x[k + 2], S43, 0x2AD7D2BB);
    b = II(b, c, d, a, x[k + 9], S44, 0xEB86D391);
    a = addUnsigned(a, AA);
    b = addUnsigned(b, BB);
    c = addUnsigned(c, CC);
    d = addUnsigned(d, DD);
  }
  var tempValue = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  return tempValue.toLowerCase();
}