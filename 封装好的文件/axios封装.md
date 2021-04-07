<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 基于vue对axios封装
 * @Date: 2021-02-02 09:40:16
 * @LastEditTime: 2021-02-02 13:48:48
-->
# 基于vue对axios封装

像vue中进行请求数据的一般有两种，axios和fetch

* fetch

fetch不是ajax的进一步封装，而是原生js，没有使用XMLHttpRequest对象。用起来也不是很舒服，

1）fetch只对网络请求报错，对400，500都当做成功的请求，服务器返回 400，500 错误码时并不会 reject，只有网络错误这些导致请求不能完成时，fetch 才会被 reject。

2）fetch默认不会带cookie，需要添加配置项： fetch(url, {credentials: 'include'})

3）fetch不支持abort，不支持超时控制，使用setTimeout及Promise.reject的实现的超时控制并不能阻止请求过程继续在后台运行，造成了流量的浪费。

4）fetch没有办法原生监测请求的进度，而XHR可以。

* axios

axios 是一个基于Promise 用于浏览器和 nodejs 的 HTTP 客户端，本质上也是对原生XHR的封装，只不过它是Promise的实现版本，符合最新的ES规范。相较而言，axios既提供了并发的封装，也没有fetch的各种问题，而且体积也较小。

## axios封装代码

```
import axios from 'axios'
import { Message } from 'element-ui' // 消息组建

let _Message = function (params = {}) {
    let _duration = params.duration || 2000
    params.duration = _duration
    Message(params)
}

// 创建axios实例
const http = axios.create({
    baseURL: '', // api的base_url
    /* baseURL: "proxy", */
    // `method` 是创建请求时使用的方法
    method: 'post', // 默认是 post
    headers: {
        'Content-Type': 'application/json;charset=UTF-8'
    }
})
// 添加请求拦截器
http.interceptors.request.use(
    config => {
        // 在发送请求之前做些什么

        const defaultParams = {
            web_access: 'webqSoiKwpWVge4TkaryH6MKvOdceGt7ZMaF20g8H0cnXIweb',
            token: 'kj6tFXDccchnhEqjjQRyyJwVBjXyNgG2GpMVEqYkSeM9E56NbvpG',
        }
        config.data = Object.assign({}, defaultParams, config.data)

        // 接口报错不要axios直接message提示，而自己catch处理的时候
        if (config.data && config.data.noErrorMessage) {
            config.noErrorMessage = true
        }
        return config // 此处切记记得将请求参数return出去
    },
    error => {
        // 对请求错误做些什么

        console.log(error) // for debug
        Promise.reject(error)
    }
)

// 添加响应拦截器
http.interceptors.response.use(
    response => {
        if (response) {
            let { data, config } = response
            // 判断是否需要显示错误message提示
            const noErrorMessage = config.noErrorMessage

            const { code, msg } = data
            if (code !== 0) {
                noErrorMessage || _Message({
                    message: msg,
                    type: 'warning'
                })
                return Promise.reject(data)
            }

            return data
        } else {
            return {}
        }
    },
    err => {
        // 对响应错误做点什么
        if (err && err.response) {
            switch (err.response.status) {
                case 400:
                    err.message = '请求错误'
                    break
                case 401:
                    err.message = '未授权，请登录'
                    break
                case 403:
                    err.message = '拒绝访问'
                    break
                case 404:
                    err.message = `请求地址出错: ${err.response.config.url}`
                    break
                case 408:
                    err.message = '请求超时'
                    break
                case 500:
                    err.message = '服务器内部错误'
                    break
                case 501:
                    err.message = '服务未实现'
                    break
                case 502:
                    err.message = '网关错误'
                    break
                case 503:
                    err.message = '服务不可用'
                    break
                case 504:
                    err.message = '网关超时'
                    break
                case 505:
                    err.message = 'HTTP版本不受支持'
                    break
                default:
            }
            // 判断是否需要显示错误message提示
            const noErrorMessage = err.config.noErrorMessage;
            noErrorMessage || _Message({
                message: err.message,
                type: 'error'
            })
        }
        return Promise.reject(err)
    }
)

export default function (config) {
    return http(config)
}
```