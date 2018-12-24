/**
 * Create by lipeng on 2017-04-20
 */

define(function(){
	var hostname = location.hostname;
	if (hostname.indexOf('staging') == 0){
		hostname = 'staging';
	}else if(hostname.indexOf('xiaoyoujinfu') >= 0
		||	hostname == 'wap.daokoudai.com'){
		hostname = 'prod';
	}

	// 准测试环境
	else if(hostname == 'prewap.daokoudai.com'){
		hostname = 'pre'
	}
	// 上行测试环境
	else if(hostname == 'shwap.daokoudai.com'){
		hostname = 'sh'
	}
	// 微信测试环境
	else if(hostname == 'wap2.daokoujihua.com'){
		hostname = 'wechat'
	}
	// 懒猫灰度环境演练
	else if(hostname == 'wap.daokouyun.com'){
		hostname = 'lmApi'
	}

	switch(hostname){
		case 'staging':
		case 'prod':
			return '//www.daokoudai.com';

		case 'pre':
			return '//preapi.daokoudai.com';
		case 'sh':
			return '//shapi.daokoudai.com';
		case 'wechat':
			return '//api.daokoujihua.com';
		case 'lmApi':
			return '//web.daokouyun.com';

		default :
			return '';
	}
})