# jtaoyige
仿jquery基本功能框架，包括选择器，css，html，event，animate等，支持链式操作

## 入口函数 $$(selector)

## Ajax
```js
    /**
     * method: 请求方式，默认post
     * asyn: 是否异步，默认true
     * url: 请求地址
     * params: json格式的参数
     * dataType: 如果为json将返回一个json对象，否则返回字符串
     * success: 成功回调
     * error: 错误回调
     */
    data = {
        'method': 'GET',
        'asyn': 'true',
        'url': url,
        'params': params,
        'dataType': 'json',
        'success': function(){},
        'error': function(){},
    }
    $$.ajax(data);
```