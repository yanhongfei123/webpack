// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path');

module.exports = {
    build: {
        env: {
            NODE_ENV: "production"
        },
      //  title:'我是生产环境为index.html配置的title',
        //index: path.resolve(__dirname, './public/index.html'),
        // 文件输入的路劲 ，静态文件默认输出到 项目根目录下的public文件夹
        assetsRoot: path.resolve(__dirname, './build'),
        assetsPublicPath: './',
        productionSourceMap: true,
        // Surge or Netlify already gzip all static assets for you.
        // Before setting to `true`, make sure to:
        // npm install --save-dev compression-webpack-plugin
        productionGzip: false,
        productionGzipExtensions: ['js', 'css']
    },
    dev: {
        env: {
            NODE_ENV: "development"
        },
        port: 9999,
        title:'我是本地环境为index.html配置的title',
        assetsRoot: path.resolve(__dirname, './dev'),
        assetsPublicPath: './',
        context: [ //代理路径
            '/shopping',
            '/ugc',
            '/v1',
            '/v2',
            '/v3',
            '/v4',
            '/bos',
            '/member',
            '/promotion',
            '/eus',
            '/payapi',
            '/m.ele.me@json',
        ],
        proxypath: 'https://mainsite-restapi.ele.me',
        // CSS Sourcemaps off by default because relative paths are "buggy"
        // with this option, according to the CSS-Loader README
        // (https://github.com/webpack/css-loader#sourcemaps)
        // In our experience, they generally work as expected,
        // just be aware of this issue when enabling this option.
        cssSourceMap: false
    }
}