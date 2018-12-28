/**
 * Created by lipeng on 18/11/27.
 */
define(['wxShare'],function(wxShare){
    var view = {
        // 一、main
        init:function () {
        	/*Hover Status Compatible with IOS */
			document.body.addEventListener('touchstart', function(events){}, false);
			
        },

        // 二、logic
        
        // 三、individual
        // 4.微信分享配置
        wxShareConfig:function () {
            var ua = navigator.userAgent.toLowerCase();//获取判断用的对象
            if (ua.match(/MicroMessenger/i) == "micromessenger") {
                var link = window.location.href;
                var wxConfig = {
                    // debug:true,
                    title:'《梅和小猫巴士》',
                    desc:' ',
                    imgUrl:'http://wap.daokoudai.com/resources/images/wxShare/DKD-logo.jpg',
                    timeline: link+'&_ch=x.m.pyq_brand',
                    appMessage: link+'&_ch=x.m.py_brand',
                    qqLine: link+'&_ch=x.m.qq_brand',
                    weibo: link+'&_ch=x.m.wb_brand',
                    qZone: link+'&_ch=x.m.qqkj_brand'
                };

                wxShare(wxConfig);
            }
        },

        // 四、general
        
    };
    view.init();
});