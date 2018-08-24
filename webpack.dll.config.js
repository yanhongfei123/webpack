var path = require("path");
var webpack = require("webpack");
const CleanWebpackPlugin = require("clean-webpack-plugin");

 // 生成文件名，配合HtmlWebpackPlugin增加打包后dll的缓存
var AssetsPlugin = require('assets-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin'); // 提取css
module.exports = {
  // 你想要打包的模块的数组 
  entry: {
   // vendor: ['vue', 'lodash', 'vuex', 'axios', 'vue-router', 'element-ui'], 
   vendor: [
    path.resolve(__dirname, "./src/js/libs/jquery203.js"), 
    path.resolve(__dirname, "./src/js/libs/idangerous.swiper.min.js"),
    path.resolve(__dirname, "./src/js/libs/fastclick.js"),
    path.resolve(__dirname, "./src/js/libs/touch.min.js"),

    path.resolve(__dirname, "./src/css/reset.css"),
    path.resolve(__dirname, "./src/css/idangerous.swiper.css")
  ]

  },
  output: {
    path: path.join(__dirname, './dll'), // 打包后文件输出的位置
   // filename: '[name].dll.js',
    filename: '[name].[chunkhash:7].dll.js',
    library: '[name]_library' 
    // vendor.dll.js中暴露出的全局变量名。
    // 主要是给DllPlugin中的name使用，
    // 故这里需要和webpack.DllPlugin中的`name: '[name]_library',`保持一致。
  },
  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, '.', '[name]-manifest.json'),
      name: '[name]_library', 
      context: __dirname
    }),
    new ExtractTextPlugin('[name].[contenthash:7].css'),
    // 压缩打包的文件，与该文章主线无关
    new webpack.optimize.UglifyJsPlugin({ 
      compress: {
        warnings: false
      }
    }),
    new CleanWebpackPlugin(["./dll","./bundle-config.json","./vendor-manifest.json"], {
      root: "",
      verbose: true,
      dry: false
    }),
    new AssetsPlugin({
      filename: 'bundle-config.json',
      path: path.join(__dirname, './'), // 打包后文件输出的位置

    }),
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: "style-loader",
          use: [
            {
              loader: "css-loader",
              options: {
                minimize: true 
              }
            }           
          ]
        })
      },
      {
        // 图片加载器，雷同file-loader，更适合图片，可以将较小的图片转成base64，减少http请求
        // 如下配置，将小于8192byte的图片转成base64码
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        use: ["url-loader?limit=8192&name=images/[name].[hash:8].[ext]"],
        include: path.resolve(__dirname, "./src/imgs"),
      },
      {
        // 专供iconfont方案使用的，后面会带一串时间戳，需要特别匹配到
        test: /\.(woff|woff2|eot|ttf)\??.*$/,
        include: path.resolve(__dirname, "./src/fonts"),
        loader: "file-loader",
        options: {
          name: "./fonts/[name].[hash:8].[ext]"
        }
      },
    ]
  }
};