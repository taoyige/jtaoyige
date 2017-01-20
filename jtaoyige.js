/*
jtaoyige 最终框架
 */

/* 立即执行 + 闭包 避免污染全局变量 */
(function (window) {
	
	/* 入口函数 $$ 其他方法全部基于该方法实现 */
	function $$(selector) {
		return taoyige.$all(selector);
	}

	
	/**
	 * 封装ajax
     * data = {
     *   'method': 'GET',
     *   'asyn': 'true',
     *   'url': url,
     *   'params': params,
     *   'dataType': 'json',
     *   'success': function(){},
     *   'error': function(){},
     * 
     * } 
	 */
    $$.ajax = function (data) {
            console.log(data);
            var method = data.method ? data.method : 'GET';
            var asyn = data.asyn ? data.asyn : true;
            var url = data.url;
            var param = data.params ? paramsAdapter(data.params) : '';
            var dataType = data.dataType ? data.dataType : '';
            var success = data.success ? data.success : function () {};
            var error = data.error ? data.error : function () {};
  
            var xhr = null;
  
            try{
              xhr = new XMLHttpRequest();
            }catch(e){
              xhr = new ActiveXObject('Microsoft.XMLHTTP');
            }
  
            if(method.toUpperCase() == "GET"){
              url += '?' + param;
              xhr.open('GET', url, asyn);
              xhr.send(null);
            }else {
              xhr.open('POST', url, asyn);
              xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              xhr.send(param);
            }
  
            xhr.onreadystatechange = function(){
              if(this.readyState == 4){
                if(this.status == 200){
                  var txt = this.responseText;
                  console.log(txt);
                  if(dataType.toUpperCase() === 'JSON'){
                    success(toJson(txt));
                  }else {
                    success(txt);
                  }
                }else {
                  error(this.responseText);
                }
              }
            };
  
  
            /** 转换参数适配器 */
            function paramsAdapter(params) {
              var param = '';
              for(var k in params){
                param += k + '=' + params[k] + '&';
              }
              param += '_t' + '=' + +new Date();
              return param;
            }
  
            /** json适配器 */
            function toJson(str) {
              return JSON.parse(str);
            }
    }


	/* 实现类 Taoyige 底层操作类 */
	function Taoyige() {

		/* 版本号 */
		var version = '1.0.1';


		/* DOM元素数组 */
		this.elements = [];


		/* this.elements 数组的长度 */
		this.length = 0;

	}


	/* 实现类原型 */
	Taoyige.prototype = {

		/* 拷贝对象属性方法 */
		extend: function (source) {
			for(var key in source){
				this[key] = source[key];
			}
			return this;
		},

	}


	/* 实现类实例 */
	var taoyige = new Taoyige();


	/* 选择器框架 */
	taoyige.extend({

		/* 基础选择方法 */
		$all: function (selector, context) {

			var dom = context || document;
			this.elements = dom.querySelectorAll(selector);
			this.length = this.elements.length;
			return this;

		},

	});


	/* 事件框架 */
	taoyige.extend({

		/* 添加事件方法 */
		on: function (type, fn) {
			
			for(var i=0; i<this.length; i++){
				var item = this.elements[i];
				// 判断浏览器支持类型
				if(item.addEventListener){
					item.addEventListener(type, fn, false);
				}else if(item.attachEvent){
					// IE6 添加事件方式
					item.attachEvent('on' + type, fn);
				}
			}


			return this;

		},


		/* 移除事件方法 */
		un: function (type, fn) {
			
			for(var i=0; i<this.length; i++){
				var item = this.elements[i];
				// 判断浏览器支持类型
				if(item.removeEventListener){
					item.removeEventListener(type, fn, false);
					console.log(333);
				}else if(item.detachEvent){
					// IE6 添加事件方式
					item.detachEvent('on' + type, fn);
				}
			}

			return this;

		},


		/* 事件委托 */
	    delegate: function (selector, eventType, fn) {
	    	var that = this;
        	function handle(e){
	            var target = that.getTarget(e);
	            if(target.nodeName.toLowerCase() === selector || target.id === selector || target.className.indexOf(selector) != -1){
	                // 在事件冒泡的时候，会以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
	                // 为什么使用call，因为call可以改变this指向
	                // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
	                fn.call(target);
	            }
	        }
	        //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
	        //这里是给元素对象绑定一个事件
	        // parent[eventType]=handle;
	        this.on(eventType, handle);
	        return this;
	    },


		/* 点击事件 */
		click: function (fn) {
			this.on('click', fn);
			return this;
		},


		/* 鼠标移入 */
		mouseenter: function (fn) {
			this.on('mouseenter', fn);
			return this;
		},


		/* 鼠标移动 */
		mousemove: function (fn) {
			this.on('mousemove', fn);
			return this;
		},


		/* 鼠标移出 */
		mouseleave: function (fn) {
			this.on('mouseleave', fn);
			return this;
		},


		/* hover(鼠标移入移出)*/
		hover: function (inFn, outFn) {

			// 鼠标进入事件
			if(inFn){
				this.on('mouseenter', inFn);
			}
			// 鼠标离开事件
			if(outFn){
				this.on('mouseleave', outFn);
			}
			
			return this;

		},


		/* 获取事件event对象 */
		getEvent: function (e) {
			return e ? e : window.event;
			// return window.event || e;
		},


		/* 获取事件event对象的target属性 */
		getTarget: function (e) {
			var e = this.getEvent(e);
			return e.target || window.srcElement;
		},


		/* 阻止默认行为 */
		preventDefault: function (e) {
			var event = this.getEvent(e);
			if(event.preventDefault){
				event.preventDefault();
			}else {
				// IE 低版本
				event.returnValue = false;
			}
		},


		/* 阻止冒泡 */
		stopPropagation: function (e) {
			var event = this.getEvent(e);
			if(event.stopPropagation){
				event.stopPropagation();
			}else {
				// IE 低版本
				event.cancelBubble = true;
			}
		},

	});


	/* 字符串框架 */
	taoyige.extend({


		/* 去除字符串两边空格 */
		trim: function (str) {
				var s = str.replace(/(^\s*)|(\s*$)/g, '');
				return s;
		},


		/*
	    根据window.location.search获取的字符串，类似?name=taoyige&age=22
	    以键值对的形式解析为json对象
	     */
	    searchToJson: function (str) {
	    	if(!str){
	    		return;
	    	}
	    	var json = {};
	    	var arr = str.substring(1).split('&');
	    	for(var i=0; i<arr.length; i++){
	    		var key = arr[i].split('=')[0];
	    		var value = arr[i].split('=')[1];
	    		json[key] = value;
	    	}
	    	return json;
	    },


	    /*
		格式字符串，根据@(xxx)格式替换值
		 */
		formateString: function (str, data) {
			return str.replace(/@\((\w+)\)/g, function (word, key) {
				//console.log(arguments);
				return data[key];
			});
		},
	});



	/* 日期相关操作框架 */
	taoyige.extend({
	});



	/* 数字相关操作 */
	taoyige.extend({


		/*
		获取指定范围内的随机数
		 */
		myRandom: function (start, end) {
			return Math.floor(Math.random()*(end-start) + start);
		},	
	});



	/* DOM操作 */
	taoyige.extend({


		/* 修改属性方法 */
		attr: function (attr, value) {
			var ele = this.elements[0];
			if(value){
				if(attr == 'className'){
					dom[attr] = value;
					return;
				}
				ele.setAttribute(attr, value);
			}else {
				return ele.getAttribute(attr);
			}
			return this;
		},
	});



	/* css框架 */
	taoyige.extend({


		/* css设置样式方法 */
	    css: function (key, value) {
	    	var doms = this.elements;
	    	if(doms.length){
	    		if(value){
	    			for(var i=0, len1=doms.length; i<len1; i++){
	    				setStyle(doms[i], key, value);
	    			}
	    		}else {
	    			return getStyle(doms[0], key);
	    		}
	    	}

	    	return this;

	    	/* 设置样式 */
			function setStyle(dom, key, value) {
				dom.style[key] = value;
			}

			/* 获取样式 */
			function getStyle(dom, key){
	            if(dom.currentStyle){
	                return dom.currentStyle[key];
	            }else{
	                return getComputedStyle(dom,null)[key];
	            }
	        }
	    },


	    /* 显示元素 */
		show: function () {
			var doms = this.elements;
			this.css('display', 'block');
			return this;
		},


		/* 隐藏元素 */
		hide: function () {
			var doms = this.elements;
			this.css('display', 'none');
			return this;
		},
	});



	/* 属性框架 */
	taoyige.extend({
		

		/* 添加class */
		addClass: function (value) {
			var doms = this.elements;
			if(doms.length){
				for(var i=0, len=doms.length; i<len; i++){
					if(!this.hasClass(value)){
						doms[i].className += ' ' + value;
						doms[i].className = this.trim(doms[i].className);
					}
				}
			}
			return this;
		},


		/* 移除class */
		removeClass: function (value) {
			var doms = this.elements;

			var reg = new RegExp('^('+value+'\\s+)|(\\s+'+value+'\\s+)|(\\s+'+value+')$', 'g');
			if(doms.length){
				for(var i=0, len=doms.length; i<len; i++){
					doms[i].className = doms[i].className.replace(reg, ' ');
					doms[i].className = this.trim(doms[i].className);
				}
			}
			return this;
		},


		/* 判断是否存在class */
		hasClass: function (value) {
			var doms = this.elements;

			// 类存在三种情况：
			// 1, ' ' + classname 		必须在字符串结尾
			// 2, classname + ' '		必须在字符串中间
			// 3, ' ' + classname+' ' 	必须在字符串开始
			var reg = new RegExp('^('+value+'\\s+)|(\\s+'+value+'\\s+)|(\\s+'+value+')$', 'g');
			console.log(reg);
			if(doms.length){
				return doms[0].className.match(reg) ? true : false;
			}
		},


		/* 切换class */
		toggleClass: function (value) {
			var doms = this.elements;

			if(doms.length){
				for(var i=0, len=doms.length; i<len; i++){
					if(this.hasClass(value)){
						this.removeClass(value);
					}else {
						this.addClass(value);
					}
				}
			}
			return this;
		},
	});



	/* 内容框架 */
	taoyige.extend({


		/* 设置内容方法 */
		html: function (html) {
			var doms = this.elements;

			if(doms.length){
				if(html || html === ''){
					for(var i=0, len=doms.length; i<len; i++){
	    				doms[i].innerHTML = html;
	    			}
				}else {
					return doms[0].innerHTML;
				}
			}
			return this;
		},


		/* 设置内容方法 */
		text: function (text) {
			var doms = this.elements;

			if(doms.length){
				if(text){
					for(var i=0, len=doms.length; i<len; i++){
	    				doms[i].innerText = text;
	    			}
				}else {
					return doms[0].innerText;
				}
			}
			return this;
		},


		/* value方法 */
		val: function (value) {
			var doms = this.elements;

			if(doms.length){
				if(value || value === ''){
					doms[0].value = value;
				}else {
					return doms[0].value;
				}
			}
			return this;
		},
	});



	/* 动画框架 */
	taoyige.extend({
		/* 动画方法 */
		animate: function (json, duration, time) {
			var that = this;
			// 使用适配器转化为需要的数据格式
			var styles = dataAdapter(json);

			// 1. 先得到运动开始时间(毫秒)
			var sTime = +new Date();
			// 设置定时器
			var timer = null;
			timer = setInterval(move, duration ? duration : 30);
			
			// 每次循环执行
			function move() {
				// 2. 得到已经过去的时间
				var nTime = +new Date();
				var pTime = nTime - sTime;

				// 3. 计算过去时间与总时长比值
				var tween = getTween(pTime, time ? time : 1000);

				if(tween > 1){
					stop();
					return ;
				}

				// 4. 移动物体
				for(var i=0, len=styles.length; i<len; i++){
					change(styles[i], tween);
				}
			}

			return this;

			// 计算tween方法
			function getTween(pTime, time) {
				return pTime / time;
			}

			// 停止interval方法
			function stop() {
				clearInterval(timer);
			}

			// 改变物体一个属性
			function change(item, tween) {
				if(item.name === 'opacity'){
					that.css(item.name, item.start + (item.distance - item.start) * tween);
				}else {
					that.css(item.name, item.start + (item.distance - item.start) * tween + 'px');
				}
			}

			// 数据适配器
			function dataAdapter(json) {
				var styles = [];
				for(var k in json){
					var obj = {};
					obj.name = k;
					obj.start = parseFloat(that.css(k));
					obj.distance = parseFloat(json[k]);
					styles.push(obj);
				}
				return styles;
			}
		}
	});






	/* 把入口函数赋值给window */
	window.$$ = $$;

})(window)