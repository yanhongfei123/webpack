const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
//const ExtractTextPlugin = require("extract-text-webpack-plugin");
//const autoprefixer = require("autoprefixer");
const CopyWebpackPlugin = require("copy-webpack-plugin");


var HappyPack = require('happypack');
var os = require('os');
var happyThreadPool = HappyPack.ThreadPool({
  size: os.cpus().length
});

var bundleConfig = require("./bundle-config.json");

// 源代码的根目录（本地物理文件路径）
const SRC_PATH = path.resolve(__dirname, "./src");
// 打包后的资源根目录（本地物理文件路径）
const BUILD_PATH = path.resolve(__dirname, "./build");
// 资源根目录（可以是 CDN 上的绝对路径，或相对路径）


var plugins = [];
var entrys = getEntry();
//获取项目入口js文件
function getEntry() {
  var jsPath = path.resolve(__dirname, "src/js");
  var dirs = fs.readdirSync(jsPath);
  var matchs = [],
    files = {};
  dirs.forEach(function (item) {
    matchs = item.match(/(.+)\.js$/);
    if (matchs) {
      var entryFileName = matchs[1];
      files[entryFileName] = path.resolve("src", "js", item);
      /*** 根据目录获取 Html 入口*/
      plugins.push(
        new HtmlWebpackPlugin({
          favicon: 'favicon.ico',
          filename: BUILD_PATH + "/page/" + entryFileName + ".html",
          template: SRC_PATH + "/page/" + entryFileName + ".html",
          chunks: [entryFileName],
          //  excludeChunks: [],
          inject: true,
          minify: {
            //压缩HTML文件
            removeComments: true, //移除HTML中的注释
            collapseWhitespace: true //删除空白符与换行符
          },
          libJsName: bundleConfig.vendor.js,
          libCssName: bundleConfig.vendor.css
        }),
        new CopyWebpackPlugin([{
          from: `./src/fonts`,
          to: `fonts`
        }]),
        new CopyWebpackPlugin([{
          from: './dll',
          to: 'dll'
        }])
      );
    }
  });

  return files

}

// entrys["vendor"] = vendor;

plugins.push(

 // 那就是找到一种和顺序无关的模块ID命名方式。最容易想到的就是基于文件名或者文件内容的哈希值这两种方案了。其实也就是今天//要说的NamedModulesPlugin与HashedModuleIdsPlugin的功能。

 // new webpack.NamedModulesPlugin(),

  new webpack.HashedModuleIdsPlugin(),

  new webpack.DllReferencePlugin({
    context: __dirname,
    manifest: require('./vendor-manifest.json')
  }),

  // new webpack.optimize.CommonsChunkPlugin({
  //   name: ["vendor", "runtime"],
  //   minChunks: Infinity
  // //  filename: "js/commons.[hash:4].js",
  // }),

  new HappyPack({
    id: 'happybabel',
    loaders: [{
      loader: 'babel-loader',
      query: {
        presets: ["es2015"],
        plugins: [
          ["transform-object-rest-spread"],
          ["transform-runtime"]
        ]
      }
    }],
    threadPool: happyThreadPool,
     //cache: true,
     //verbose: true
  })

)

module.exports = {
  entry: entrys,
  module: {
    loaders: [{
        test: /\.js[x]?$/,
        // 减少 babel 编译范围，
        include: path.resolve(__dirname, 'src'),
       // exclude: /node_modules/,
        loader: 'happypack/loader?id=happybabel'
      },

      // {
      //   test: /\.js$/,
      //   exclude: /node_modules/,
      //   loader: "babel-loader",
      //   query: {
      //     presets: ["es2015"],
      //     plugins: [["transform-object-rest-spread"], ["transform-runtime"]]
      //   }
      // },

      // {
      //   // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
      //   test: /\.(woff|woff2|eot|ttf)\??.*$/,
      //   include: path.resolve(__dirname, "./src/fonts"),
      //   // exclude: /glyphicons/,
      //   //   loader: 'file-loader?name=static/fonts/[name].[ext]',
      //   loader: "file-loader",
      //   options: {
      //     name: "./fonts/[name].[hash:8].[ext]"
      //   }
      // },
      {
        test: /\.handlebars$/,
        include: path.resolve(__dirname, "./src/handlebars"),
        loader: "handlebars-loader"
      }
    ]
  },
  resolve: {
    // 针对 Npm 中的第三方模块优先采用 jsnext:main 中指向的 ES6 模块化语法的文件
    // Scope Hoisting 配置, webpaack2 使用tree shaking
    mainFields: ['jsnext:main', 'browser', 'main'],
    extensions: [".js", ".scss", ".ts"],
    modules: ["node_modules"],
    alias: {
      "@": path.resolve(__dirname, "./src"),
      jquery: path.resolve(__dirname, "./src/js/libs/jquery203.js"),
      methods: path.resolve(__dirname, "./src/js/libs/methods.js"),
      fastclick: path.resolve(__dirname, "./src/js/libs/fastclick.js"),
      vconsole: path.resolve(__dirname, "./src/js/libs/vconsole.js")
    }
  },
  plugins: plugins


};