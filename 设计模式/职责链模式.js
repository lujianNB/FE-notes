/*
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 职责链模式
 * @Date: 2021-02-04 14:05:05
 * @LastEditTime: 2021-02-04 16:29:21
 */
// 假设我们负责一个售卖手机的电商网站，经过分别交纳500元定金和200元定金的两轮
// 预定后（订单已在此时生成），现在已经到了正式购买的阶段。
// 公司针对支付过定金的用户有一定的优惠政策。在正式购买后，已经支付过500元定
// 金的用户会收到100元的商城优惠券，200元定金的用户可以收到50元的优惠券，而之前
// 没有支付定金的用户只能进入普通购买模式，也就是没有优惠券，且在库存有限的情况
// 下不一定保证能买到。
// orderType：表示订单类型（定金用户或者普通购买用户），
// code的值为1的时候是500元定金用户，为2的时候是200元定金用户，为3的时候是普通购买用户。
// pay：表示用户是否已经支付定金，值为true或者false，
// 虽然用户已经下过500元定金的订单，但如果他一直没有支付定金，
// 现在只能降级进入普通购买模式。
// stock：表示当前用于普通购买的手机库存数量，已经支付过500元或者200元定金的用户不受此限制。

let order500 = function (code, pay, stock) {
    if (code === 1 && pay) {
        console.log('收到100优惠卷')
    } else {
        return 'next'
    }
}

let order200 = function (code, pay, stock) {
    if (code === 2 && pay) {
        console.log('收到50优惠卷')
    } else {
        return 'next'
    }
}

let orderNormal = function (code, pay, stock) {
    if (code === 3 || !pay) {
        stock ? console.log('没有优惠卷哦') : console.log('没货了')
    }
}

// 节点类
class Node {
    constructor(fn) {
        this.fn = fn // 当前节点做的事
        this.nextNode = null //下一个节点类
    }

    toNextNode(nextNode) {
        this.nextNode = nextNode // 指定当前节点的下一个节点类
    }

    getResult() {
        let res = this.fn.apply(this, arguments)
        res === 'next' && (this.nextNode && this.nextNode.getResult.apply(this.nextNode, arguments))
        return res
    }
}

// 设置三个节点
let node500 = new Node(order500)
let node200 = new Node(order200)
let nodeNormal = new Node(orderNormal)

// 设置节点指向（职责链）
node500.toNextNode(node200)
node200.toNextNode(nodeNormal)

node500.getResult(1, true, 2)
node500.getResult(2, true, 2)
node500.getResult(2, false, 2)
node500.getResult(3, true, 2)
node500.getResult(3, true, 0)