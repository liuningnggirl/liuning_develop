//aes加密
function encrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("0123456789123456"); //16位  0123456789123456
    var iv = CryptoJS.enc.Utf8.parse("2015030120123456");

    var encrypted = CryptoJS.AES.encrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    return encrypted.toString();
}

// aes解密
function decrypt(word) {
    var key = CryptoJS.enc.Utf8.parse("0123456789123456"); //  UATH5@!#2017caln
    var iv = CryptoJS.enc.Utf8.parse("2015030120123456");
    var decrypt = CryptoJS.AES.decrypt(word, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
    });
    var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
    return decryptedStr.toString();
}

// 验证手机号是否正确
function isPhoneNum(phoneNum) {
    var reg = /^1(([3|8|7|5][0-9])|(5[^4|\D]))\d{8}$/;
    return reg.test(phoneNum);
}

// 验证内容中是否包括特殊字符
function isIncludeSpecalStr(str) {
    var reg = /[`~!@#$%^&*()_+<>?:"{},.\/;'[\]]/;
    return reg.test(str);
}
// 验证文本内容是否为空
function isValContent(str) {
    if($.trim(str) == ''){
        return true;
    }else{
        return false;
    }
}
//验证内容是否位数字
function isValNum(str) {
    var reg = /^[0-9]*[1-9][0-9]*$/;
    return reg.test(str);
}

//必须为字母加数字且长度不小于8位
function CheckPassWord(password) {
    var str = password;
    if (str == null || str.length <6 || str.length >20) {
        return false;
    }
    var reg1 = new RegExp(/^[0-9A-Za-z]+$/);
    if (!reg1.test(str)) {
        return false;
    }
    var reg = new RegExp(/[A-Za-z].*[0-9]|[0-9].*[A-Za-z]/);
    if (reg.test(str)) {
        return true;
    } else {
        return false;
    }
}