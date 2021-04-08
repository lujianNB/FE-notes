<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: vue路由实现原理
 * @Date: 2021-02-03 09:56:10
 * @LastEditTime: 2021-02-03 14:35:19
-->
# vue路由实现原理

结果：通过更改url地址来更新视图，但是不重新请求页面。

实现：浏览器环境两种（hash和history），node环境一种（abstract）。

* hash

    hash("#") 的作用是加载 URL 中指示网页中的位置。# 本身以及它后面的字符称为 hash，可通过 window.location.hash 获取。hash不会在http请求中，对服务端无用，只是用来指导浏览器动作的。所以改变hash不会重新加载页面。而且hash的改变可以通过hashchange事件进行监听。HashHistory 拥有两个方法，一个是 push（将新路由放到浏览历史栈顶）， 一个是 replace（新路由替代当前路由）

```
$router.push() //调用方法
HashHistory.push() //根据hash模式调用,设置hash并添加到浏览器历史记录（添加到栈顶）（window.location.hash= XXX）
History.transitionTo() //监测更新，更新则调用History.updateRoute()
History.updateRoute() //更新路由
{app._route= route} //替换当前app路由
vm.render() //更新视图
```

* history

    从HTML5开始，History interface 提供了2个新的方法：pushState()、replaceState()使得我们可以对浏览器历史记录栈进行修改，通过back()、forward()、go()等方法，我们可以读取浏览器历史记录栈的信息，进行各种跳转操作。stateObject：当浏览器跳转到新的状态时，将触发 Popstate 事件，该事件将携带这个 stateObject 参数的副本title：所添加记录的标题。url：所添加记录的url。这2个方法有个共同的特点：当调用他们修改浏览器历史栈后，虽然当u前url改变了，但浏览器不会立即发送请求该url，这就为单页应用前端路由，更新视图但不重新请求页面提供了基础。

```
window.history.pushState(stateObject,title,url)
window.history.replaceState(stateObject,title,url)
```

与hash模式做比较：

1.push

    只是将window.hash改为history.pushState

2.replace

    只是将window.replace改为history.replaceState

3.监听地址变化

    在HTML5History的构造函数中监听popState（window.onpopstate）