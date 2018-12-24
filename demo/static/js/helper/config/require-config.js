/**
 * Created by lipeng on 17/2/16.
 */
require.config({
    baseUrl: '/static/js/',
    shim: {
        // 一.类库依赖关系
        // 1.代码库
        // 2.工具类

        // 二.插件依赖关系

        // 三.页面依赖关系
    },
    paths: {
        // 一.类库
        // 1.框架
        // js代码库
        jquery:'vendor/jquery/jquery-1.12.4.min',
        // canvas高清画图工具
        canvasHidpi:'vendor/canvas/hidpi-canvas.min',
        // 2.工具类(第三方)

        // 二.自定义
        // 1.工具类
        // 域名配置插件
        domain:'helper/config/domain',
        // api请求插件
        request:'helper/util/request',
        // 2.组件
        // 渲染数据插件
        renderData:'helper/component/plugin/renderData',
        // 3.页面片段

        // 三.页面
        // 样例/demo
        // 样例页
        yueDemo:'pages/yue/yueDemo',

        // 四.插入公共页面

    },
    urlArgs:"v=201812210750",
    waitSeconds: 10,
});
