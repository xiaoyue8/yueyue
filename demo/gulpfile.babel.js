// 引入插件
import gulp from 'gulp'
// 模板编译
import pug from 'gulp-pug'
import compass from 'gulp-compass'
import minJs  from 'gulp-terser'
// 例外處理，避免例外導致 gulp watch 失效中斷
// https://kejyuntw.gitbooks.io/gulp-learning-notes/content/plguins/Tool/Plugins-Tool-gulp-plumber.html
import plumber from 'gulp-plumber'
import notify from 'gulp-notify'

// 资源路径配置
const path = {
    pug:{
        // 编译（部分文件）
        src:'src/pug/**/[^_]*.pug',
        // 生成（编译文件）
        // static:'static/pages',
        static:'templates',
        // *监控（全部文件）
        watch:'src/pug/**/*.pug',
    },

    cssPages:{
        src:'src/sass/pages/**/*.sass',
        static:'static/css',
        watch:'src/sass/**/*.sass'
    },
    cssVendor:{
        src:'src/sass/vendor/**/*.sass',
        static:'static/css',
    },


    jsPages:{
        src:'src/js/pages/**/*.js',
        static:'static/js/pages',
    },
    jsHelper:{
        src:'src/js/helper/**/*.js',
        static:'static/js/helper'
    },
    jsVendor:{
        src:'src/js/vendor/**/*.js',
        static:'static/js/vendor'
    },

    img:{
        src:'src/img/**/*',
        static:'static/img'
    }
};

// 启动任务
// 1.开发环境
gulp.task('dev',['cssPages','cssVendor','jsPagesDevelop','jsHelperDevelop','jsVendorDevelop','pug','imgCopy'],function () {
    return gulp.start(['watch']);
});
// 2.构建生产环境
gulp.task('build',['cssPages','cssVendor','jsPages','jsHelper','jsVendorDevelop','pug','imgCopy']);

// 调用方法
gulp.task('watch',function () {
    gulp.watch(path.pug.watch,['pug']);

    gulp.watch(path.cssPages.watch,['cssPages']);
    gulp.watch(path.cssVendor.src,['cssVendor']);

    // gulp.watch(path.jsPages.src,['jsPagesDevelop']);
    // 开发环境只编当前译修改文件配置
    // *** 待优化：编译后处于编辑打开状态下，不可被覆盖
    gulp.watch(path.jsPages.src,function (event) {
        console.time("take");
        var path = event.path,
            directory = path.slice(path.lastIndexOf("src")+4,path.lastIndexOf("/")+1);
        gulp.src(path)
            .pipe(plumber({errorHandler: notify.onError('Error: <%= error %>')}))
            .pipe(gulp.dest('static/' +directory))
        console.timeEnd("take");
    });
    gulp.watch(path.jsHelper.src,['jsHelperDevelop']);
    gulp.watch(path.jsVendor.src,['jsVendorDevelop']);

    // 图片拷贝
    gulp.watch(path.img.src,['imgCopy']);
});


gulp.task('pug',()=>{
    return gulp.src(path.pug.src)
        .pipe(pug({pretty:false}))
        .pipe(gulp.dest(path.pug.static));
});

gulp.task('cssPages',()=> {
    return gulp.src(path.cssPages.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(compass({
            config_file: './config.rb', //配置中文编码支持
            css:path.cssPages.static,
            sass:'src/sass',
            style:'compressed',
            sourcemap:false,
            comments:false,
        })
    )
});
gulp.task('cssVendor',()=> {
    return gulp.src(path.cssVendor.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(compass({
            config_file: './config.rb',
            css:path.cssVendor.static,
            sass:'src/sass',
            style:'compressed',
            sourcemap:false,
            comments:false,
        }))
});

gulp.task('jsHelper',()=>{
    return gulp.src(path.jsHelper.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(minJs())
        .pipe(gulp.dest(path.jsHelper.static));
});
gulp.task('jsPages',()=>{
    return gulp.src(path.jsPages.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(minJs())
        .pipe(gulp.dest(path.jsPages.static));
});
gulp.task('jsVendor',()=>{
    return gulp.src(path.jsVendor.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(minJs())
        .pipe(gulp.dest(path.jsVendor.static));
});
// 图片资源开发与生产环境分离
gulp.task('imgCopy',()=>{
    return gulp.src(path.img.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(path.img.static));
});

// 开发环境编译
gulp.task('jsHelperDevelop',()=>{
    return gulp.src(path.jsHelper.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(path.jsHelper.static));
});
gulp.task('jsPagesDevelop',()=>{ 
    return gulp.src(path.jsPages.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(path.jsPages.static));
});
gulp.task('jsVendorDevelop',()=>{
    return gulp.src(path.jsVendor.src)
        .pipe(plumber({errorHandler: notify.onError('Error: <%= error.message %>')}))
        .pipe(gulp.dest(path.jsVendor.static));
});

gulp.task('default',["dev"]); //定义默认任务