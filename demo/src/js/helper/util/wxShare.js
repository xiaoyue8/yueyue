/**
 * Created by gemini on 2017/1/3.
 */
define(['wxConfig','jquery'], function(wx,$){
    var wxShareModel = {
        args:{
            "appId":"wxb6e23db4b284e226",
            "timestamp":"1545990133",
            "noncestr":"uXfbB5",
            "signature":"ee76eef5a1813cdfb2b59e47cdc2de19ce9119ac"
        },
        // getShareConfig:function () {
        //     $.ajax({
        //         url : "/redEnvelope/getWechatConfig",
        //         type : "post",
        //         dataType : "json",
        //         data : {
        //             url : window.location.href
        //         },
        //         success : function(data) {
        //             if (data.errorCode != undefined) {
        //             } else if (data.result) {
        //             } else {
        //                 wxShareModel.args = data;
        //             }
        //         },
        //         error : function() {

        //         }
        //     });
        //     return this
        // },
        setShareConfig:function (wxConfig) {
            wx.config({
                debug : wxConfig.debug || false, // 本地微信开发者工具debug调试
                appId : wxShareModel.args.appId,
                timestamp : wxShareModel.args.timestamp,
                nonceStr : wxShareModel.args.noncestr,
                signature : wxShareModel.args.signature,
                jsApiList : [ "checkJsApi",
                    "onMenuShareTimeline",
                    "onMenuShareAppMessage",
                    "onMenuShareQQ",
                    "onMenuShareWeibo",
                    "onMenuShareQZone" ]
            });
            wx.ready(function(){
                wx.checkJsApi({
                    jsApiList: [
                        "onMenuShareTimeline",
                        "onMenuShareAppMessage",
                        "onMenuShareQQ",
                        "onMenuShareWeibo",
                        "onMenuShareQZone"
                    ],
                    success: function (res) {
                        console.log(JSON.stringify(res));
                    }
                });
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title : wxConfig.title,
                    desc : wxConfig.desc,
                    link : wxConfig.timeline,
                    imgUrl : wxConfig.imgUrl
                });
                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title : wxConfig.title,
                    desc : wxConfig.desc,
                    link : wxConfig.appMessage,
                    imgUrl : wxConfig.imgUrl
                });
                // 分享到QQ
                wx.onMenuShareQQ({
                    title : wxConfig.title,
                    desc : wxConfig.desc,
                    link : wxConfig.qqLine,
                    imgUrl : wxConfig.imgUrl
                });
                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title : wxConfig.title,
                    desc : wxConfig.desc,
                    link : wxConfig.weibo,
                    imgUrl : wxConfig.imgUrl
                });
                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title : wxConfig.title,
                    desc : wxConfig.desc,
                    link : wxConfig.qZone,
                    imgUrl : wxConfig.imgUrl
                });
                wx.error(function(res) {
                    console.log(res);
                });
            });
        }
    };
    return wxShareModel.setShareConfig;
});