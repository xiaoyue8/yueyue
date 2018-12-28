/**
 * Created by lipeng on 18/7/26.
 * 渲染数据
 */
define(['jquery','request'],function($,request){
    var view = {
        /**
         * 1.生成数组遍历转制的元素
         * 容器
         * 为空时，则直接返回元素字符串
         * @param container
         * 需要遍历的数组
         * @param array
         * 生成拼接条目的方法
         * @param stractItem
         * 添加类型
         * 直接覆盖&&append
         * @param addType
         */
        createArrayToElement:function (param) {
            var container = param.container || (param.selector && $(param.selector)),
                list = param.array || [],
                stractItem = param.stractItem,
                addType = param.addType,

                modelItem = list.reduce(function (previousValue,currentValue,currentIndex) {
                    return previousValue + stractItem(currentValue,currentIndex,list.length);
                },'');

            if(container){
                if(addType == 'append'){
                    container.append(modelItem);
                }else{
                    container.html(modelItem);
                }
            }else{
                return modelItem;
            }
        },
        /**
         * 2.输出文本
         * @param keyValue
         * 渲染键值对
         * @param path
         * 相对路径
         */
        outputText:function (param) {
            var obj=param.keyValue,
                path = param.path ? (param.path +' ') :'';

            for(var item in obj){
                $(path+'.'+item).html(obj[item]);
            }
        },


        /**
         * 3.分页加载元素
         * 容器
         * @param container
         * 接口
         * @param api
         * 参数
         * @param param
         * 回调方法数组
         * @param callbackArray
         * 其他补充参数
         * @param other
         */
        paginationLoadMore:function (param) {
            let {
                    container,
                    api,
                    param:keyValue,
                    callbackArray,
                    other = {},
                } = param,
                formalParam= {
                    param:{
                        keyValue
                    },
                    callee: arguments.callee, // es6箭头函数和严格模式不支持，待优化
                };

            // 给other赋值
            Object.assign(
                other,
                {formalParam}
            );

            // 加载更多按钮绑定回调事件
            callbackArray = callbackArray.concat(function (data) {
                var totalPages = data.page.totalPages,
                    currentPage = data.page.currentPage;
                if(totalPages == 1 || totalPages == 0){
                    return;
                }

                if(currentPage == 1){
                    container.after('<a class="paginationLoadMoreBtn">点击显示更多</a>')
                }

                if(totalPages > currentPage){
                    container.next('.paginationLoadMoreBtn').on('click',function () {
                        $(this).off('click');
                        // 分页+1
                        param.param.page = currentPage+1;
                        // console.log(param);
                        formalParam.callee(param);
                    })

                }else if(totalPages == currentPage){
                    container.next('.paginationLoadMoreBtn').off('click').text('没有更多数据啦')
                }
            });


            request.ajax({
                api,
                param:{
                    keyValue
                },
                callbackArray,
                other
            });
        },
        /**
         * 4.加载元素
         *
         * 容器
         * @param container
         * 接口
         * @param api
         * 参数
         * @param param
         * 回调方法数组
         * @param callbackObject
         * array // 渲染数组
         * itemStrcat // 遍历条目方法
         * itemStrcatNull // 条目为空时，生成元素
         * itemClick // 条目点击回调（非必传）
         * callbackArray // 回调方法数组（非必传）
         * 其他补充参数
         * @param other
         */
        loadMore:function (param) {
            let {
                    container,
                    api,
                    param:keyValue,
                    callbackObject,
                    other = {},
                } = param,
                formalParam = {
                    param:{
                        keyValue
                    },
                    callee: arguments.callee, // es6箭头函数和严格模式不支持，待优化
                },
                callbackArray = [function (data) {
                    var array = callbackObject.getArray(data);
                    // 条目为空时
                    if(array.length == 0){
                        container.html(callbackObject.itemStrcatNull());
                    }
                    // 条目有点击事件时
                    else if(callbackObject.itemClick){
                        array.forEach(function (v,i,a) {
                            let item = $(
                                callbackObject.itemStrcat(v)
                            );
                            callbackObject.itemClick(item,data,i,a);
                            container.append(item);
                        })
                    }
                    // 直接追加
                    else{
                        view.createArrayToElement({
                            container,
                            array,
                            stractItem:callbackObject.itemStrcat,
                            addType:'append'
                        });
                    }
                }]
            ;

            // 给other赋值
            Object.assign(
                other,
                {formalParam}
            );

            // 加载更多按钮绑定回调事件
            callbackArray = callbackArray.concat(function (data) {
                var totalPages = data.page.totalPages,
                    currentPage = data.page.currentPage;
                if(totalPages == 1 || totalPages == 0){
                    return;
                }

                if(currentPage == 1){
                    container.after('<a class="paginationLoadMoreBtn">点击显示更多</a>')
                }

                if(totalPages > currentPage){
                    container.next('.paginationLoadMoreBtn').on('click',function () {
                        $(this).off('click');
                        // 分页+1
                        param.param.page = currentPage+1;
                        // console.log(param);
                        formalParam.callee(param);
                    })

                }else if(totalPages == currentPage){
                    container.next('.paginationLoadMoreBtn').off('click').text('没有更多数据啦')
                }
            });

            // 补充回调方法数组
            if(callbackObject.callbackArray){
                callbackArray = callbackArray.concat(callbackObject.callbackArray);
            }


            request.ajax({
                api,
                param:{
                    keyValue
                },
                callbackArray,
                other
            });
        },

        /**
         * 5.展开收起功能
         */
        spreadShrink:function (param) {
            let {
                container,
                number = 3,
            }=param,
            styleSheetsRule = `.hide-third-more>*${'+*'.repeat(number)}`;

            // 初始化查看更多功能
            if(container.children().length > number){
                document.styleSheets[0].addRule(styleSheetsRule,'display:none;');
                container
                    .addClass('hide-third-more')
                    .after('<p class="showMoreParagraph active"><i></i>查看更多</p>')
                    .next().on('click',function () {
                    var self = $(this);
                    if(self.hasClass('active')){
                        self
                        // 1.自身改变
                            .removeClass('active')
                            .html('<i></i>收起')
                            // 2.对应容器改变
                            .prev().removeClass('hide-third-more')
                    }else{
                        self
                        // 1.自身改变
                            .addClass('active')
                            .html('<i></i>查看更多')
                            // 2.对应容器改变
                            .prev().addClass('hide-third-more')
                    }
                })
            }
        },
        /**
         * 5.1 展开收起功能表格
         */
        spreadShrinkTable:function (param) {
            let {
                    selector,
                    number = 10,
                }=param,
                container = $(`${selector}>tbody`),
                controlClass = `hide-${number}-more`,
                styleSheetsRule = `${selector}.${controlClass}>tbody>*${'+*'.repeat(number)}`;

            // 初始化查看更多功能
            if(container.children().length > number){
                document.styleSheets[0].addRule(styleSheetsRule,'display:none;');
                container
                    .parent()
                    .addClass(controlClass)
                    .after('<p class="showMoreTableTr active"><i></i>查看更多</p>')
                    .next().on('click',function () {
                        var self = $(this);
                        if(self.hasClass('active')){

                            self
                            // 1.自身改变
                                .removeClass('active')
                                .html('<i></i>收起')
                                // 2.对应容器改变
                                .prev().removeClass(controlClass)
                        }else{
                            self
                            // 1.自身改变
                                .addClass('active')
                                .html('<i></i>查看更多')
                                // 2.对应容器改变
                                .prev().addClass(controlClass)
                        }
                    })
            }
        },
        /**
         * 6.展开行
         */
        spreadLine:function (param) {
            let {
                container,
                number = 4,
            }=param,
            styleSheetsRule = `.hide-${number}-line-more`,
            lineHeight = container.css('line-height') == 'normal' ? container.css('font-size')*1.4 : parseFloat(container.css('line-height')),
            lineNum = Math.ceil(container.height()/lineHeight); // 文案行数

            // 初始化查看更多功能
            if(lineNum > number){
                document.styleSheets[0].addRule(styleSheetsRule,
                    `-webkit-line-clamp:${number};display:-webkit-box;overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical;`
                    
                );// 注：动态添加时属性-webkit-box-orient:vertical不可少
                container
                    .addClass(styleSheetsRule.slice(1))
                    .after('<p class="showMoreParagraph active"><i></i>查看更多</p>')
                    .next().on('click',function () {
                        var self = $(this);
	                    // 1.自身改变
                        if(self.hasClass('active')){
                            self.html('<i></i>收起')
                        }else{
                            self.html('<i></i>查看更多')
                        }
	                    // 2.对应容器改变
	                    self.toggleClass('active')
	                        .prev().toggleClass(styleSheetsRule.slice(1))
                    })
            }
        },
	
	    /**
	     * 7.设置title值
	     */
	    setDocumentTitle:function (text) {
		    setTimeout(function(){
			    //利用iframe的onload事件刷新页面
			    document.title = text;
			    var iframe = document.createElement('iframe');
			    iframe.style.visibility = 'hidden';
			    iframe.style.width = '1px';
			    iframe.style.height = '1px';
			    iframe.onload = function () {
				    setTimeout(function () {
					    document.body.removeChild(iframe);
				    }, 0);
			    };
			    document.body.appendChild(iframe);
		    },0);
	    },
    }

    return view;
});
// demo
//
// 3.分页加载元素（出借记录页）
// let param = {
//     container:$('.projectInvestList'),
//     api:'getProjectInvestList',
//     param:{
//         page:'1',
//         size:'10',
//         projectNo:getUrlParam.getParam('projectNo')
//     },
//     callbackArray:[function (data) {
//         console.log(param.container);
//         // 1.文本数据
//         // 平均出借金额
//         var totalAmtAverage = data.totalNum
//             ?  (data.totalAmt/data.totalNum).toFixed(2)
//             :   data.totalAmt
//         ;
//         $('.totalNum').text(data.totalNum);
//         $('.totalAmtAverage').text(totalAmtAverage);
//
//         // 2.表格数据
//         let list = data.investList || [],
//             container = param.container;
//         if(list.length == 0){
//             container.children('tbody').append(
//                 '<tr>'+
//                 '<td colspan="3" style="text-align: center">暂无出借记录</td>'+
//                 '</tr>'
//             );
//         }else{
//             (data.investList).forEach(function (v,i,a) {
//                 let {
//                         investUser,
//                         investAmt,
//                         investTime:{time:investTime}
//                     } = v,
//                     investTimeDate =  timeFormat.date(investTime),
//                     investTimeTime =  timeFormat.time(investTime),
//
//                     titleItem = `<tr>
//                     <td>${investUser}</td>
//                     <td>${investAmt}</td>
//                     <td>${investTimeDate}<br>${investTimeTime}</td>
//                 </tr>`;
//
//                 // 添加元素
//                 $('.projectInvestList').children('tbody').append(titleItem);
//             })
//         }
//     }],
//     other:{
//         version:'2.0'
//     },
// }
// renderData.paginationLoadMore(param);
//
// 4.加载元素（出借记录页）
// let param = {
//     // 容器
//     container:$('.projectInvestList tbody'),
//     // 接口
//     api:'getProjectInvestList',
//     // 参数
//     param:{
//         page:'1',
//         size:'10',
//         projectNo:getUrlParam.getParam('projectNo')
//     },
//     // 回调方法
//     callbackObject:{
//         // 获取要遍历的数组
//         getArray(data){
//             return data.investList;
//         },
//         // 条目遍历，生成元素
//         itemStrcat(value,index,array){
//             let {
//                     investUser,
//                     investAmt,
//                     investTime:{time:investTime}
//                 } = value,
//                 investTimeDate =  timeFormat.date(investTime),
//                 investTimeTime =  timeFormat.time(investTime);
//
//             return `<tr>
//                 <td>${investUser}</td>
//                 <td>${investAmt}</td>
//                 <td>${investTimeDate}<br>${investTimeTime}</td>
//             </tr>`;
//         },
//         // 条目为空时，生成元素
//         itemStrcatNull(){
//             return `<tr>
//                 <td colspan="3" style="text-align: center">暂无出借记录</td>
//             </tr>`;
//         },
//         // 条目点击(非必传)
//         itemClick(item){
//             item.on('click',function () {
//                 console.log($(this).html());
//             });
//         },
//         // 回调方法数组(非必传)
//         callbackArray:[function (data) {
//             // 1.文本数据
//             // 平均出借金额
//             var totalAmtAverage = data.totalNum
//                 ?  (data.totalAmt/data.totalNum).toFixed(2)
//                 :   data.totalAmt
//             ;
//             $('.totalNum').text(data.totalNum);
//             $('.totalAmtAverage').text(totalAmtAverage);
//         }],
//     },
//     other:{
//         version:'2.0'
//     },
// }
// renderData.loadMore(param);