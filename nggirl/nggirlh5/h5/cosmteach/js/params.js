		//获取最终的请求参数
		function getFinalRequestObject(appParams){
			//系统参数
			var finalParams = new Object();
			finalParams.app_id = 'h5gzh';
			finalParams.nonce = Math.ceil(Math.random() * 1000000);
			finalParams.timestamp = Date.parse(new Date());
		    finalParams.version = '<%= PARAM_VERSION %>';
		    finalParams.build = '<%= PARAM_BUILD %>';

			//放入应用参数
			if(appParams != null && appParams != undefined){
				for(var prop in appParams){
					//只保留不为空的参数
					if(appParams[prop] != null && appParams[prop] != undefined 
						&& $.trim(appParams[prop]).length != 0){
						finalParams[prop] = appParams[prop];
					}
				}
			}
			//生成sign
			finalParams.sign = getSign(finalParams);
			return finalParams;
		}
		var ua = navigator.userAgent.toLowerCase();	
		//根据请求数据中的系统参数和应用参数，生成sign
		function getSign(requestObject){
			var appsecret = '123456';
			var signArray = new Array();
			for(var prop in requestObject){
				signArray.push(prop + '');
				//signArray.push(prop + '=' + requestObject[prop]);
			}
			var originstr = getSignKeyValueStr(requestObject,signArray,appsecret);
			return md5(originstr);
		}

		//生成key=value类型字符串
		function getSignKeyValueStr(requestObject,signArray,appsecret){
			var resultArray = quickSort(signArray);
			var str = '';
			for(var i=0;i<resultArray.length;i++){
				str += (resultArray[i] + '=' + requestObject[resultArray[i]]);
				str += '&';
			}
			return str + appsecret;
		}
		
		//对请求参数进行快速排序
		function quickSort(arr) {
		if (arr.length <= 1) { return arr; }
		var pivotIndex = Math.floor(arr.length / 2);
		var pivot = arr.splice(pivotIndex, 1)[0];
		var left = [];
		var right = [];
		for (var i = 0; i < arr.length; i++){
		if (arr[i] < pivot) {
		    left.push(arr[i]);
		} else {
		right.push(arr[i]);
		  }
    }
		  return quickSort(left).concat([pivot], quickSort(right));
		}