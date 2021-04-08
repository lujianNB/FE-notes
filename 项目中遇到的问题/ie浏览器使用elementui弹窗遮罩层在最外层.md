<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: ie浏览器使用elementui弹窗遮罩层在最外层
 * @Date: 2021-03-01 15:03:06
 * @LastEditTime: 2021-03-01 15:03:06
-->
# ie浏览器使用elementui弹窗遮罩层在最外层

elementui的dialog组件在ie浏览器中会出现遮罩出现在最外层，原因是使用了vue的transform动画切换，如何解决这个问题呢？需要在组件中添加append-to-body属性为true.