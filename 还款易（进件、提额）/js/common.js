var typeStr = '';//定义全局变量用来判断是ios还是android
var endMobile = '';
var endCustName = '';
var endConsultId = '';
var endCardNo = '';
//页面加载判断是and还是ios
function isInAppIosOrAnd(type){
    typeStr = type;
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

function IdCodeValid(code){
    //身份证号合法性验证
    //支持15位和18位身份证号
    //支持地址编码、出生日期、校验位验证
    var city={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江 ",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北 ",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏 ",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外 "};
    var row={
        'pass':true,
        'msg':'验证成功'
    };
    if(!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[012])(0[1-9]|[12]\d|3[01])\d{3}(\d|[xX])$/.test(code)){
        row={
            'pass':false,
            'msg':'身份证号格式错误'
        };
    }else if(!city[code.substr(0,2)]){
        row={
            'pass':false,
            'msg':'身份证号地址编码错误'
        };
    }else{
        //18位身份证需要验证最后一位校验位
        if(code.length == 18){
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [ 7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2 ];
            //校验位
            var parity = [ 1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2 ];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++)
            {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            if(parity[sum % 11] != code[17].toUpperCase()){
                row={
                    'pass':false,
                    'msg':'身份证号校验位错误'
                };
            }
        }
    }
    return row;
}