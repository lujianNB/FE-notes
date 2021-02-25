<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: vue与elementui实现递归组件菜单
 * @Date: 2021-02-25 10:04:52
 * @LastEditTime: 2021-02-25 10:24:48
-->
# vue与elementui实现递归组件菜单

主要讲如何使用vue实现一个递归组件，一般这种组件，多用于项目中的导航菜单。递归的主要思想就是自己调用自己，然后有结束条件。递归组件也是一样，在组建内使用自己（需要注意的是一个name属性，这个属性相当于组件的标识，自己调用自己就用的这个，其实keep-alive用到的exclude等也是这个属性而不是路由里面的name。），下面是我写的一个递归的导航菜单，毕竟看代码实例来的更清晰点。

* 主菜单

```
<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 菜单
 * @Date: 2020-11-23 16:40:33
 * @LastEditTime: 2021-02-25 10:20:29
-->
<template>
  <div class="lj-left-menu">
    <el-menu
      :default-active="activeIndex"
      class="el-menu-vertical-demo"
      background-color="#242F4B"
      text-color="#D2D5DE"
      active-text-color="#468FFE"
      ref="activeIndex"
    >
      <menu-item :menuData="menuData"></menu-item>
    </el-menu>
  </div>
</template>

<script>
import menuItem from "./menuItem";
export default {
  name: "leftMenu",

  components: {
    menuItem,
  },

  data() {
    return {
      activeIndex: null, // 当前展开菜单
      menuData: [
        {
          id: "0",
          title: "首页",
          router: "/home",
          icon: "el-icon-s-home",
          children: [],
        },
        {
          id: "1",
          title: "巡检",
          icon: "el-icon-place",
          router: "/home",
          children: [
            {
              id: "1-0",
              title: "智能巡检设置",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "1-1",
              title: "巡检记录",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "1-2",
              title: "人工巡检任务",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "1-3",
              title: "故障维修",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "1-4",
              title: "保养维护任务",
              icon: "",
              router: "/home",
              children: [],
            },
          ],
        },
        {
          id: "2",
          title: "设备管理",
          icon: "el-icon-s-management",
          router: "",
          children: [
            {
              id: "2-0",
              title: "设备管理",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "2-1",
              title: "设备生命周期管理",
              icon: "",
              router: "/home",
              children: [],
            },
          ],
        },
        {
          id: "3",
          title: "告警管理",
          icon: "el-icon-sunrise",
          router: "/home",
          children: [
            {
              id: "3-0",
              title: "巡检告警",
              icon: "",
              router: "/home",
              children: [],
            },
          ],
        },
        {
          id: "4",
          title: "消息中心",
          icon: "el-icon-chat-dot-square",
          router: "/home",
          children: [
            {
              id: "4-0",
              title: "消息列表",
              icon: "",
              router: "/home",
              children: [],
            },
          ],
        },
        {
          id: "5",
          title: "系统管理",
          icon: "el-icon-setting",
          router: "/home",
          children: [
            {
              id: "5-0",
              title: "用户管理",
              icon: "",
              router: "/home",
              children: [
                {
                  id: "5-0-1",
                  title: "权限管理",
                  icon: "",
                  router: "/home",
                  children: [],
                },
              ],
            },
            {
              id: "5-1",
              title: "角色管理",
              icon: "",
              router: "/home",
              children: [],
            },
            {
              id: "5-2",
              title: "权限管理",
              icon: "",
              router: "/home",
              children: [],
            },
          ],
        },
      ],
    };
  },

  computed: {},

  mounted() {},

  methods: {},

  watch: {
    $route: { // 监听路由，确保刷新后当前页面与导航状态一致。
      handler(val) {
        this.activeIndex = val.meta.id;
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>

<style lang='scss' scoped>
.lj-left-menu {
  width: 100%;
  height: 100%;
  overflow: auto;
}
</style>
```

* 递归组件

```
<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 递归菜单
 * @Date: 2021-02-24 16:58:17
 * @LastEditTime: 2021-02-24 17:16:13
-->
<template>
  <div class="lj-menu-item">
    <template v-for="item in menuData">
      <template v-if="item.children.length">
        <el-submenu :index="item.id" :key="item.id">
          <template slot="title">
            <template v-if="item.icon">
              <i :class="item.icon"></i>
              <span>{{ item.title }}</span>
            </template>
            <template v-else>
              <div class="radius"></div>
              <div>{{ item.title }}</div>
            </template>
          </template>
          <menu-item :menuData="item.children"></menu-item>
        </el-submenu>
      </template>
      <template v-else>
        <el-menu-item
          :index="item.id"
          :key="item.id"
          @click="goRouter(item.router)"
        >
          <template v-if="item.icon">
            <i :class="item.icon"></i>
            <span>{{ item.title }}</span>
          </template>
          <template v-else>
            <div class="radius"></div>
            <div>{{ item.title }}</div>
          </template>
        </el-menu-item>
      </template>
    </template>
  </div>
</template>

<script>
export default {
  name: "menuItem",

  data() {
    return {
      nowRouter: null,
    };
  },

  props: {
    menuData: {
      type: Array,
      default: () => {},
    },
  },

  computed: {},

  mounted() {
    this.nowRouter = this.$route.path;
  },

  methods: {
    // 路由跳转
    goRouter(data) {
      if (this.nowRouter === data) {
        return;
      } else {
        this.nowRouter = data;
        this.$router.push(data);
      }
    },
  },
};
</script>

<style lang="scss">
.el-menu-item.is-active {
  background: linear-gradient(90deg, #2b579c 0%, rgba(52, 89, 150, 0) 100%);
  border-left: 2px solid #0086ff;
}
.el-menu-item:focus,
.el-menu-item:hover {
  background: linear-gradient(90deg, #2b579c 0%, rgba(52, 89, 150, 0) 100%);
  border-left: 2px solid #0086ff;
}
.el-submenu__title {
  i {
    color: #00d7ff !important;
  }
}
.el-menu-item,
.el-submenu__title {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .radius {
    width: 8px;
    height: 8px;
    background: #468ffe;
    opacity: 0.6;
    border-radius: 50%;
    margin-right: 10px;
  }
  i {
    color: #00d7ff !important;
  }
}
</style>
```