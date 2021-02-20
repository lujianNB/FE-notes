/*
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 代理模式实现缓存
 * @Date: 2021-02-19 14:08:48
 * @LastEditTime: 2021-02-19 17:20:34
 */
class ProxyCache { // 代理缓存类
    constructor(fn) {
        this.fn = fn
        this.result = {}
    }

    proxy() {
        let key = Array.from(arguments).join(',')
        if (this.result.hasOwnProperty(key)) {
            console.log(this.result[key])
        } else {
            let res = this.fn.apply(this, arguments)
            this.result[key] = res
            console.log(res)
        }
    }
}

const add = function () {
    let res = null
    Array.from(arguments).forEach(element => {
        if (typeof element === "number") {
            res += element
        }
    });
    return res
}

let obj = new ProxyCache(add)
console.log(obj)
obj.proxy(1, 2)
console.log(obj)
obj.proxy(1, 2, 3)
console.log(obj)