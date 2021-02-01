<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: cookie与storage的区别与用法
 * @Date: 2021-02-01 14:10:06
 * @LastEditTime: 2021-02-01 14:54:41
-->
# cookie与storage的区别与用法

* cookie

cookie非常小，它的大小限制为4KB左右。它的主要用途有保存登录信息，比如你登录某个网站市场可以看到“记住密码”，这通常就是通过在 Cookie 中存入一段辨别用户身份的数据来实现的。

* localStorage

 localStorage的生命周期是永久性的。假若使用localStorage存储数据，即使关闭浏览器，也不会让数据消失，除非主动的去删除数据，localStorage有length属性，可以查看其有多少条记录的数据。

 * sessionStorage

 sessionStorage 的生命周期是在浏览器关闭前。也就是说，在整个浏览器未关闭前，其数据一直都是存在的。sessionStorage也有length属性，其基本的判断和使用方法和localStorage的使用是一致的。

 * 三者的异同

 特性|cookie|localStorage|sessionStorage
 :---:|:---:|:---:|:---:
 数据的生命期|一般由服务器生成，可设置失效时间。如果在浏览器端生成Cookie，默认是关闭浏览器后失效|除非被清除，否则永久保存|仅在当前会话下有效，关闭页面或浏览器后被清除
 存放数据大小|4K左右|一般为5MB|一般为5MB
 与服务器端通信|每次都会携带在HTTP头中，如果使用cookie保存过多数据会带来性能问题|仅在客户端（即浏览器）中保存，不参与和服务器的通信|仅在客户端（即浏览器）中保存，不参与和服务器的通信
 易用性|需要程序员自己封装，源生的Cookie接口不友好|源生接口可以接受，亦可再次封装来对Object和Array有更好的支持|源生接口可以接受，亦可再次封装来对Object和Array有更好的支持

 * cookie的封装

 ```

const cookie = {
    get: function(key) {
        if (document.cookie) { //判断是否有cookie
            var arr = document.cookie.split('; '); //拆分cookie
            for (var i = 0; i < arr.length; i++) {
                var item = arr[i].split('='); //将key和value进行拆分
                if (item[0] === key) { //如果 key === 用户传入的key  则返回对应的value
                    return item[1];
                }
            }
            return ''; //遍历结束没有找到  则返回空字符串
        }
    },
    set: function(key, value, day) {
        if (day) {
            var d = new Date();
            d.setDate(d.getDate() + day);
            document.cookie = `${key}=${value};expires=${d};path=/`;
        } else {
            document.cookie = `${key}=${value};path=/`;
        }
    },
    remove: function(key) {
        this.set(key, "", -1);
    }
}

 ```

 * vue中使用vue-cookies插件对cookie进行封装

 ```

// 运行npm i vue-cookies -S安装插件
import vueCookie from 'vue-cookies'

vueCookie.config(60 * 60 * 24 * 3)
// 设置cookie
const CK = {
    // 设置key
    set: (keyName, value, expireTimes) => {
        return vueCookie.set(keyName, value, expireTimes) // this
    },
    // 获取key
    get: (keyName) => {
        return vueCookie.get(keyName) // value
    },
    // 删除key
    remove: (keyName) => {
        return vueCookie.remove(keyName) // true、false
    },
    // 是否存在key
    isKey: (keyName) => {
        return vueCookie.isKey(keyName) // true、false
    },
    // 获取所有key
    keys: () => {
        return vueCookie.keys() // array
    }
}

 ```

 * localStorage的封装

 ```

class Storage {
    constructor(props) {
        this.props = props || {}
        this.source = this.props.source || window.localStorage
        this.initRun()
    }
    initRun() {
        const reg = new RegExp('__expires__')
        let data = this.source
        let list = Object.keys(data)
        if (list.length > 0) {
            list.map((key, v) => {
                if (!reg.test(key)) {
                    let now = Date.now()
                    let expires = data[`${key}__expires__`] || Date.now + 1
                    if (now >= expires) {
                        this.remove(key)
                    }
                }
                return key
            })
        }
    }
    /**
     * @description 获取方法
     * @param {String} key 键
     * @returns value
     * @memberof Storage
     */
    get(key) {
        const source = this.source
        const expired = source[`${key}__expires__`] || Date.now + 1
        const now = Date.now()

        if (now >= expired) {
            this.remove(key)
            return
        }
        let value = source[key]
        if (/^\{.*\}$/.test(value) || /^\[.*\]$/.test(value)) value = JSON.parse(value)
        return value
    }
    /**
     * @description 存储方法
     * @param {String} key 键
     * @param {String} value 值
     * @param {Number} expired 过期时间，单位分钟，非必填
     * @returns value
     * @memberof Storage
     */
    set(key, value, expired) {
        if (typeof value === typeof {}) value = JSON.stringify(value)
        let source = this.source
        source[key] = value
        if (expired) {
            source[`${key}__expires__`] = Date.now() + 1000 * 60 * expired
        }
        return value
    }
    /**
     * @description 删除方法
     * @param {String} key 键
     * @returns value
     * @memberof Storage
     */
    remove(key) {
        const data = this.source
        const value = data[key]
        delete data[key]
        delete data[`${key}__expires__`]
        return value
    }
}

 ```