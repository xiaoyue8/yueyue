define(["jquery","domain"],function(e,r){var s={ajax:function(n){var a=s.ajaxRequest,c={version:"3.0",type:"post",async:!0,validateTip:!1,success:!1,channel:"m"},l=n.other;l&&e.each(l,function(e){var r=e,s=l[e];c[r]=s});var u=s.getParam(n.param);c.formalParam=s.initDefaultParam(c.formalParam,{params:JSON.parse(u)}),e.ajax({url:r+a.url(a.request[n.api]||n.api,c.version,c.channel),type:c.type,async:c.async,dataType:"json",data:{params:u,from:"M",imei:"imei",appKey:"88888888"},beforeSend:function(){c.beforeSend&&c.beforeSend()},success:function(e){if("2.0"==c.version)if(e.success||c.success)s.runCallFnArray(e,n.callbackArray,c.formalParam);else{if(c.validateTip)return e.err;alert(e.err||e.resMsg)}else if(e.resCode==a.resCode.success||c.success)s.runCallFnArray(e,n.callbackArray,c.formalParam);else if("E0000001"===e.resCode)alert("请填写完全后再提交!");else if("E0000002"===e.resCode)alert("您已经退出,请重新登录!");else{if(c.validateTip)return e.resMsg;alert(e.resMsg)}},complete:function(e){c.complete&&c.complete(e)}})},getParam:function(r){var s={nameValue:[],keyValue:{},path:""};e.each(r,function(e){var n=e,a=r[e];s[n]=a});var n=s.nameValue,a=s.keyValue,c=c||"",l={};return e(n).each(function(){c&&"#"==this.substr(0,1)&&(c=""),l[this]=e.trim(e(c+"[name="+this+"]").val())||""}),a&&e.each(a,function(e){var r=e,s=a[e];l[r]=s}),JSON.stringify(l)},runCall:function(e,r){var n=s.ajaxRequest;e.resCode==n.resCode.success?s.runCallFnArray(e,r,formalParam):alert(e.resMsg)},runCallFnArray:function(e,r,s){for(var n=0,a=r?r.length:0;n<a&&!1!==r[n](e,s);n++);},initDefaultParam:function(e,r){e=e||{};for(var s in r){var n=s,a=r[s];e[n]=a}return e},ajaxRequest:{request:{},url:function(e,r,s){switch(r){case"2.0":return"/api/2.0/"+s+"/"+e;case"3.0":return"/api/3.0/"+s+"/"+e;case"dky/3.0":return"/api/dky/3.0/personalFinance/"+s+"/"+e;case"dky/3.0/old":return"/api/dky/3.0/"+s+"/"+e}},resCode:{success:"0000",paramsMissing:"E0000001",tokenIllegal:"E0000002",lackBalance:"E0000003",noProject:"E0000004",noUser:"E0000005",notOpenAccount:"E0000006",noResult:"E0000007",itemNoEmpty:"E0000008",noPermission:"E0000009",noCard:"E0000010",newUser:"E0000011"}}};return s});