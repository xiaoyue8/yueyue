/**
 * Created by lipeng on 17/4/17.
 */

define(['jquery','domain'],function ($,domain) {
    var view = {
        // Ⅰ.main
        // 1.请求
        /**
         *
         * @param
         * api:'getInviteList'
         *
         * @param param
         * 1.nameValue
         * 根据name属性获取到对应input的值
         * 2.keyValue
         * 自定义键值对
         * 3.path
         * 路径
         * 例如：
         * param:{
         *   nameValue:['loginName','mobile','password'],
         *   keyValue:{
         *      emailType:9,
         *      userName:'张三'
         *   },
         *   path:'#step1'
         * }
         *
         * @param callbackArray
         * 例如：
         * callbackArray:[
         *  function(data){
         *      console.log(data)
         *  }
         * ]
         *
         * @param other
         * {
         *      // 1.接口号
         *      version:3.0,
         *      // 2.请求类型
         *      type:'post'
         *      // 3.异步
         *      async: true
         * }
         *
         */
        ajax:function (param) {
            var ar = view.ajaxRequest,

                // 初始化补充参数
                orgin = {version:'3.0',type:'post', async: true,validateTip:false,success:false,channel:'m'},
                other = param.other;
            if(other){
                $.each(other,function(i){
                    var key = i,
                        value = other[i];
                    orgin[key] = value;
                });
            }

            // 在回调中获取请求传参
            var params = view.getParam(param.param);
            orgin.formalParam = view.initDefaultParam(orgin.formalParam,{params:JSON.parse(params)});

            $.ajax({
                url: domain + ar.url(ar.request[param.api] || param.api,orgin.version,orgin.channel),
                type: orgin.type,
                async: orgin.async,
                dataType: 'json',
                data: {
                    params: params,
                    from: 'M',
                    imei: 'imei',
                    appKey:'88888888'
                },
                beforeSend:function () {
                    if(orgin.beforeSend){
                        orgin.beforeSend();
                    }
                },
                success: function (data) {
                    if(orgin.version == '2.0'){
                        // 2.0接口回调
                        if(data.success || orgin.success){
                            view.runCallFnArray(data,param.callbackArray,orgin.formalParam);
                        }else{
                            if(orgin.validateTip){
                                return data.err;
                            }else{
                                alert(data.err || data.resMsg);
                            }
                        }
                    }else{
                        // 3.0接口回调
                        if(data.resCode == ar.resCode.success || orgin.success){
                            view.runCallFnArray(data,param.callbackArray,orgin.formalParam)
                        }else{
                            if(data.resCode === 'E0000001'){
                                alert('请填写完全后再提交!');
                            }else if(data.resCode === 'E0000002'){
                                alert('您已经退出,请重新登录!');
                            }else if(orgin.validateTip){
                                return data.resMsg;
                            }else{
                                alert(data.resMsg);
                            }
                        }
                    }
                },
                complete:function (XMLHttpRequest) {
                    if(orgin.complete){
                        orgin.complete(XMLHttpRequest);
                    }
                }
            })
        },

        // Ⅱ.general
        // 1.参数获取

        /**
         *
         * @param paramArray
         *
         */
        getParam:function (paramJson) {
            // 3.获取接口参数
            // 初始化补充参数
            var orgin = {nameValue:[],keyValue:{}, path: ''};
            $.each(paramJson,function(i){
                var key = i;
                var value = paramJson[i];
                orgin[key] = value;
            });

            var pageKeys = orgin.nameValue,
                addKeys = orgin.keyValue,
                path = path || '',

                params={};
            // (1)页面参数
            $(pageKeys).each(function () {
                if(path && this.substr(0,1) == '#'){
                    path = '';
                }
                params[this] = $.trim($(path+'[name='+this+']').val()) || '';
            });
            // (2)添加参数
            addKeys &&
            $.each(addKeys,function(i){
                var key = i;
                var value = addKeys[i];
                params[key] = value;
            });
            return JSON.stringify(params);
        },
        // 2.执行请求回调
        // 2.1 执行请求回调
        runCall:function (data,callFnArray) {
            var ar = view.ajaxRequest;

            if(data.resCode == ar.resCode.success){
                view.runCallFnArray(data,callFnArray,formalParam)
            }else{
                alert(data.resMsg);
            }
        },
        // 2.2 回调函数
        runCallFnArray:function (data,callFnArray,formalParam) {
            var i=0,
                j=callFnArray ? callFnArray.length : 0;

            for(;i<j; i++) if(callFnArray[i](data,formalParam) === false) break;
        },
        // 3.初始化默认数据
        initDefaultParam:function (orgin,other) {
            var orgin = orgin || {};
            for(var item in other){
                var key = item,
                    value = other[item];
                orgin[key] = value;
            }
            return orgin;
        },



        // Ⅳ.general
        // 1.
        ajaxRequest:{
            request: {
                
            },
            url: function (r, v, c) {
                switch(v){
                    case '2.0':
                        return '/api/2.0/'+c+'/' + r;
                    case '3.0':
                        return '/api/3.0/'+c+'/' + r;
                    case 'dky/3.0':
                        return '/api/dky/3.0/personalFinance/'+c+'/' + r;

                    case 'dky/3.0/old':
                        return '/api/dky/3.0/'+c+'/' + r;
                }
            },
            resCode: {
                'success': '0000',
                'paramsMissing': 'E0000001',
                'tokenIllegal': 'E0000002',
                'lackBalance': 'E0000003',
                'noProject': 'E0000004',
                'noUser': 'E0000005',
                'notOpenAccount': 'E0000006',
                'noResult': 'E0000007',
                'itemNoEmpty': 'E0000008',
                'noPermission': 'E0000009',
                'noCard': 'E0000010',
                'newUser': 'E0000011'
            }
        }
    }

    return view;

})