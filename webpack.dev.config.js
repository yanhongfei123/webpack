const path = require("path");
const webpack = require("webpack");
const config = require("./webpack.base.config");
const BundleAnalyzerPlugin = require("webpack-bundle-analyzer")
  .BundleAnalyzerPlugin;
const commonConfig = require("./webpack.com.config.js");

// config.externals = {
//   'jquery': "jQuery",
// },

config.output = {
  path: path.resolve(__dirname, "./build"),
  filename: "js/[name].js",
  publicPath: '/',
  // libraryTarget: "umd"
  //chunkFilename: 'js/[chunkhash:8].chunk.js'
};

// 配置 eslint

// config.module.loaders.push({
//   test: /\.js$/,
//   use: {
//     loader: 'eslint-loader',
//     options: {
//       formatter: require('eslint-friendly-formatter') // 默认的错误提示方式
//     }
//   },
//   enforce: 'pre', // 编译前检查
//   exclude: /node_modules/, // 不检测的文件
//   include: [__dirname + '/src'], // 要检查的目录
// })


config.module.loaders.push({
  // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
  // 如下配置，将小于8192byte的图片转成base64码
  test: /\.(png|jpg|svg|gif)$/,
  use: ["url-loader?limit=8192&name=images/[name].[hash:8].[ext]"],
  include: path.resolve(__dirname, "./src/imgs"),

  // loader: "url-loader",
  // options: {
  //   limit: 10000, //10000
  //   name: "images/[name].[hash:8].[ext]"
  // }
}, {
  test: /\.css$/,
  use: [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        plugins: [require("autoprefixer")]
      }
    }
  ]
}, {
  test: /\.scss$/,
  use: [
    "style-loader",
    "css-loader",
    {
      loader: "postcss-loader",
      options: {
        plugins: [require("autoprefixer")]
      }
    },
    "sass-loader"
  ]
});

//console.log(config.module.loaders);

config.devServer = {
  contentBase: "./build",
  host: "localhost",
  port: 9001,
  stats: {
    chunks: false,
    colors: true
  },
  inline: true, // 可以监控js变化
  hot: true, // 热启动
  compress: true,
  watchContentBase: false,
  proxy: {
    context: ['/api'],
    target: "http://www.proxy.com",
    pathRewrite: {"^/api" : ""}
  },
  // 设置 https
 //  https: true,

  // proxy: {
  //  '/test/*': {
  //    target: 'http://localhost',
  //    changeOrigin: true,
  //    secure: false
  //  }
  // }
};

config.plugins.push(
  new BundleAnalyzerPlugin(),

  new webpack.DefinePlugin({
    "process.env": {
      NODE_ENV: JSON.stringify(commonConfig.dev.env.NODE_ENV)
    }
  }),
  new webpack.HotModuleReplacementPlugin() //热加载插件
);

config.devtool = "source-map";
// config.plugins.push(
//   new webpack.SourceMapDevToolPlugin({
//     filename: '[file].map',
//     exclude: ['vendor.js'] // vendor 通常不需要 sourcemap
//   })
// );

module.exports = config;