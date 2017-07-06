
	/**
	 * 定义页面相关信息对象
	 */
	function PageInfo(name, url, params){
		this._name = name;
		this._url = url;
		this._params = params;
		this._sessionId = '';
	}
	
	/**
	*借助localStorage做存储介质的栈存储器，用于在大页面中包含很多返回/完成时向上一个页面回返，但浏览器的返回又不能包含所有情况的场景。
	*使用时，在用户登录页面可以调用clear方法，清空之前的数据，
	*如果不清空历史数据的话，一般情况也不会有问题，因为后续进栈的数据一般来说第一个页面是没有返回按钮的。
	*实例化时可以指定maxSize，如果指定那么栈中将仅存储指定数量的item，如果不指定，那么会使用默认值1000作为最大存储数量。
	*
	*使用方法：
	*1.实例化
	*	var ldq=new LocalStorageDeque('pageRestoreStack');
	*2.跳转到下一个包含回返按钮的页面前，记录当前页面
	*	var pageInfo = new PageInfo('page-list'+count++,'page-list/page.html',{});
	*	ldq.push(pageInfo);
	*3.获取上一个应当回返的页面
	*	var previousPage = ldq.pop();
	*/
	function LocalStorageDeque(name, maxSize){
		this._name = name;
		this._items = [];
		this._maxSize = maxSize||1000;
		
		var localItems = localStorage.getItem(this._name);
		if(localItems != null && localItems != ''){
			var oldItems = JSON.parse(localItems);
			if(oldItems.length > 0){
				this._items = oldItems;
				return;
			}
		}

		//没有存储数据，那么将一个空数组放入到存储中
		localStorage.setItem(this._name, JSON.stringify(this._items));
	};
	/**
	*添加数据项到栈顶
	*/
	LocalStorageDeque.prototype.push = function (item) {  
		//如果存储的值过多，那么清楚栈底的溢出元素
		cleanOverFlowItem(this._items, this._maxSize);


        this._items.push(item); 
        localStorage.removeItem(this._name);      
        localStorage.setItem(this._name, JSON.stringify(this._items));
    };
    /**
    *读取栈顶数据，同时从栈中移除数据
    */
    LocalStorageDeque.prototype.pop = function () { 
    	var  ret = this._items.pop();        
        localStorage.removeItem(this._name);
        localStorage.setItem(this._name, JSON.stringify(this._items));
        return ret;
    };
    /**
    *清空栈中的数据
    */
    LocalStorageDeque.prototype.clear = function () { 
    	this._items.clear();        
        localStorage.removeItem(this._name);
    };
    /**
    *清除数组总前length - maxSize个元素
    */
    function cleanOverFlowItem(itemArray, maxSize){
    	var len = itemArray.length;
    	if(len > maxSize){
    		itemArray.splice(0, len - maxSize);
    	}
    }

 