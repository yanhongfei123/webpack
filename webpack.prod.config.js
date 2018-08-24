var path = require('path');
const webpack = require("webpack");
const config = require("./webpack.base.config");
const commonConfig = require("./webpack.com.config.js");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
var ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
var HappyPack = require('happypack');

// 对js里面 import进来的css单独打包（css文件一般作为第三方css）
const extractCSS = new ExtractTextPlugin({
  // disable: true,
  filename: "css/[name][contenthash:8].css",
  allChunks: true
});

// 对import 引入sass（如自己写的sass）的提取
const sassExtractor = new ExtractTextPlugin({
  // 开发环境下不需要提取，禁用
  // disable: true,
  filename: "css/[name][contenthash:8].css",
  allChunks: true
});


config.output = {
  // 输出所在目录
  path: path.resolve(__dirname, './build'),
  publicPath: '../',
  filename: "js/[name]_[chunkhash:8].js",
  // 异步加载模块名js/[name].min.js?v=[chunkhash]
  chunkFilename: "js/[name].js?v=[chunkhash:8]"
};

config.module.loaders.push({
    // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
    // 如下配置，将小于8192byte的图片转成base64码
    test: /\.(png|jpg|svg|gif)$/,
    use: [
      'url-loader?limit=8192&name=images/[name].[hash:8].[ext]',
      'image-webpack-loader'
    ],
    include: path.resolve(__dirname, "./src/imgs"),
  }, {
    test: /\.css$/,
    use: extractCSS.extract({
      fallback: 'style-loader',
      use: ['happypack/loader?id=cssHappy']
    })
  }, {
    test: /\.scss$/,
    // 编译Sass文件 提取CSS文件
    use: sassExtractor.extract({
      fallback: 'style-loader',
      use: ['happypack/loader?id=sassHappy']
    })
  }

)

//console.log(config.module.loaders)

config.plugins.push(
  new HappyPack({
    id: 'cssHappy',
    loaders: [
       // "style-loader",
        {
          loader: "css-loader",
          options: {
            minimize: true
          }
        },
        // {
        //   loader: "postcss-loader",
        //   options: {
        //     plugins: [require("autoprefixer")]
        //   }
        // }     
    ]
  }),
  new HappyPack({
    id: 'sassHappy',
    loaders: [
      "css-loader",
      // {
      //   loader: "postcss-loader",
      //   options: {
      //     plugins: [require("autoprefixer")]
      //   }
      // },
      {
        loader: "sass-loader",
        options: {
          // sourceMap: true,
          // 开发环境不需要压缩
          outputStyle: "compressed"
        }
      }
    ]
  }),
  extractCSS,
  sassExtractor,
  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(commonConfig.build.env.NODE_ENV)
    }
  }),
  new webpack.BannerPlugin("生产环境代码全部压缩," + new Date()),

  new CleanWebpackPlugin(["./build"], {
    root: "",
    verbose: true,
    dry: false
  }),
  new webpack.optimize.OccurrenceOrderPlugin(),
  new ParallelUglifyPlugin({
    cacheDir: './src',
    uglifyJS: {
      output: {
        comments: false
      },
      compress: {
        warnings: false
      }
    }
  }),

 // 由于 Scope Hoisting 需要分析出模块之间的依赖关系，因此源码必须采用 ES6 模块化语句，不然它将无法生效。
//原因和4-10 使用 TreeShaking 中介绍的类似。
// 还需要配置 mainFields。
// 消除无用的代码，按需引入 
// 开启 Scope Hoisting ,webpaack2 使用tree shaking

  new webpack.optimize.ModuleConcatenationPlugin()

)

module.exports = config;