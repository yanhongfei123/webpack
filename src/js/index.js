import "@/css/reset.css";
import "@/css/idangerous.swiper.css";
// 以上引入的css会被打包到公用的文件dll
import "@/css/index.scss";
import "@/js/libs/rem.js";
import $ from "@/js/libs/jquery203.js";
// jquery203.js会被打包到公用的文件dll

const welcomeMessage = 'ES6 is awesome';
const content = `hello, ${welcomeMessage}`;
let container = $('#container');
container.html(content);
var tpl = require('../handlebars/demo.handlebars');
var tplData = {
    datas: [{
            imgUrl: require('../imgs/729.gif'),
        },
        {
            imgUrl: require('../imgs/729.gif'),
            title: '这个图片的地址通过模版插入222'
        }
    ]
};
container.append(tpl(tplData));