<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 虚拟dom和diff算法
 * @Date: 2021-02-05 09:19:12
 * @LastEditTime: 2021-04-08 12:23:23
-->
# 虚拟dom和diff算法

## 什么是虚拟dom？

所谓虚拟dom就是用一个js对象来描述一个dom节点

```
<div class="a" id="b">我是内容</div>

{
  tag:'div',        // 元素标签
  attrs:{           // 属性
    class:'a',
    id:'b'
  },
  text:'我是内容',  // 文本内容
  children:[]       // 子元素
}
```

## 为什么要有虚拟dom？

因为浏览器把真实dom设计的很复杂，即使是一个空的div也有很多东西，这也导致了操作dom非常的消耗性能，使用虚拟dom的目的就是优化性能（用js的计算性能换取操作dom的性能），尽可能的避免dom操作。通过diff算法对比前后虚拟dom，把需要改变的地方改变。

```
// vue的源码中有一个VNode类用来实例化各种虚拟dom
// 源码位置：src/core/vdom/vnode.js

export default class VNode {
  constructor (
    tag?: string,
    data?: VNodeData,
    children?: ?Array<VNode>,
    text?: string,
    elm?: Node,
    context?: Component,
    componentOptions?: VNodeComponentOptions,
    asyncFactory?: Function
  ) {
    this.tag = tag                                /*当前节点的标签名*/
    this.data = data        /*当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息*/
    this.children = children  /*当前节点的子节点，是一个数组*/
    this.text = text     /*当前节点的文本*/
    this.elm = elm       /*当前虚拟节点对应的真实dom节点*/
    this.ns = undefined            /*当前节点的名字空间*/
    this.context = context          /*当前组件节点对应的Vue实例*/
    this.fnContext = undefined       /*函数式组件对应的Vue实例*/
    this.fnOptions = undefined
    this.fnScopeId = undefined
    this.key = data && data.key           /*节点的key属性，被当作节点的标志，用以优化*/
    this.componentOptions = componentOptions   /*组件的option选项*/
    this.componentInstance = undefined       /*当前节点对应的组件的实例*/
    this.parent = undefined           /*当前节点的父节点*/
    this.raw = false         /*简而言之就是是否为原生HTML或只是普通文本，innerHTML的时候为true，textContent的时候为false*/
    this.isStatic = false         /*静态节点标志*/
    this.isRootInsert = true      /*是否作为跟节点插入*/
    this.isComment = false             /*是否为注释节点*/
    this.isCloned = false           /*是否为克隆节点*/
    this.isOnce = false                /*是否有v-once指令*/
    this.asyncFactory = asyncFactory
    this.asyncMeta = undefined
    this.isAsyncPlaceholder = false
  }

  get child (): Component | void {
    return this.componentInstance
  }
}
```

通过源代码可以清晰的看出，VNode可以有多种类型：

1.注释节点

2.文本节点

3.元素节点

4.组件节点

5.函数式组件节点

6.克隆节点

**在视图渲染之前，把写好的template模板先编译成VNode并缓存下来，等到数据发生变化页面需要重新渲染的时候，我们把数据发生变化后生成的VNode与前一次缓存下来的VNode进行对比，找出差异，然后有差异的VNode对应的真实DOM节点就是需要重新渲染的节点，最后根据有差异的VNode创建出真实的DOM节点再插入到视图中，最终完成一次视图更新。**

## diff算法

打patch补丁，以新的VNode为基准，改造旧的oldVNode使之成为跟新的VNode一样，这就是patch过程要干的事。通俗的来说就是之前的视图有一个虚拟dom，当数据改变会生成新的虚拟dom，新的虚拟dom会与之前的作比较，然后根据比较的结果做增删改，也就是在原来的基础上做改变。（*优化主要体现在子节点上，包括到vue3.0的改变也主要是体现在子节点上*）

流程图如下：

<img src="../img/diff.png" alt="diff算法流程图"></img>