<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: vue结合three.js载入多个obj模型交互场景
 * @Date: 2021-12-03 14:41:50
 * @LastEditTime: 2022-04-26 13:32:19
-->
# vue结合three.js载入多个obj模型交互场景

**应用场景是实现多个三维obj模型导入，进行拼凑，去实现模型的交互，点击，运动等，如果只是简单的建议使用vue-3d-model插件**

**2022.04.26新增补充踩坑点：**

1.解析的时候可能出现源代码报错说什么Handlers.get()没有了，要替代，只需将three-obj-mtl-loader文件下的index.js545行“var loader = THREE.Loader.Handlers.get( url );”注释掉，然后换成“var loader = manager.getHandler(url);”，这个加上的要放在manager定义的下面，网上很多都没去说。

2.在载入obj模型时，如果3dmax导出的mtl材质文件是带图片的，一定要处理好路径，这里建议全部换成线上地址，这里如果出现内部的跨域，在解析之前mtl前加上“mtlLoader.setCrossOrigin("Anonymous");”另外mtl材质里的图片如果是tga格式图片，可以换成png或者jpg的，tga没反应。

3.这里还有一个坑，对一个模型修改颜色，旁边的模型可能也会变色。因为：“threejs中的网格物体对材质的是引用传递，不是值传递，如果material1被mesh1和mesh2用到了，改变mesh1.material.color，则mesh2的材质颜色也改了，在递归渲染的下一次就都生效了”建议单独给每个模型修改颜色直接修改材质,如下所示。

```
let material = new THREE.MeshBasicMaterial({
  color: 0x000000,
  // 前面FrontSide  背面：BackSide 双面：DoubleSide
  // side: THREE.DoubleSide,
});
obj.children[0].material = material;
```

* 安装依赖

```
npm i three three-css2drender three-obj-mtl-loader three-orbit-controls -S
```

* demo

```
<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: 三维模型
 * @Date: 2021-12-02 13:07:09
 * @LastEditTime: 2021-12-03 14:59:10
-->
<template>
  <div class="obj" @click="mouseClick"></div>
</template>
<script>
import * as THREE from "three";
import { OBJLoader, MTLLoader } from "three-obj-mtl-loader";
// import { CSS2DRenderer, CSS2DObject } from "three-css2drender";

const OrbitControls = require("three-orbit-controls")(THREE);
export default {
  name: "obj",

  data() {
    return {
      scene: "",
      light: "",
      camera: "",
      controls: "",
      renderer: "",
      allObj: [
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/tj.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/tj.obj",
          typeName: "tj",
        },
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/dl.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/dl.obj",
          typeName: "dl",
        },
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/pz.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/pz.obj",
          typeName: "pz",
        },
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/wc.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/wc.obj",
          typeName: "wc",
        },
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/xb.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/xb.obj",
          typeName: "xb",
        },
        {
          mtl: "http://lvhua.cosys.com.cn/uploads/xz.mtl",
          object: "http://lvhua.cosys.com.cn/uploads/xz.obj",
          typeName: "xz",
        },
      ],
    };
  },
  methods: {
    //初始化three.js相关内容
    init() {
      this.scene = new THREE.Scene();
      // this.scene.background = new THREE.Color(0xf0f0f0);
      this.scene.add(new THREE.AmbientLight(0xffffff)); // 环境光3dmax默认白色
      this.light = new THREE.DirectionalLight(0x1e90ff, 1); // 从正上方（不是位置）照射过来的平行光，0.45的强度
      this.light.position.set(100, 200, 100);
      this.light.position.multiplyScalar(0.3);
      this.scene.add(this.light);
      // 利用一个轴对象以可视化的3轴以简单的方式。X轴是红色的。Y轴是绿色的。Z轴是蓝色的。这有助于理解在空间的所有三个轴的方向。
      let axisHelper = new THREE.AxisHelper(20); // 参数是坐标轴的长度
      this.scene.add(axisHelper);
      // 初始化相机
      this.camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        1,
        1000
      );
      this.camera.position.set(0, 0, 20);
      this.camera.lookAt(this.scene.position);
      // 初始化控制器
      this.controls = new OrbitControls(this.camera);
      this.controls.target.set(0, 0, 10);
      this.controls.minDistance = 80;
      this.controls.maxDistance = 400;
      this.controls.maxPolarAngle = Math.PI / 3;
      this.controls.update();
      // 渲染
      this.renderer = new THREE.WebGLRenderer({
        alpha: true,
      });
      let pointLight = new THREE.PointLight();
      pointLight.color.set(0xffffff);
      pointLight.intensity = 1;
      this.camera.add(pointLight);
      this.scene.add(this.camera);
      // this.renderer.setClearColor(0x000000);
      this.renderer.setPixelRatio(window.devicePixelRatio); // 为了兼容高清屏幕
      this.renderer.setSize(window.innerWidth, window.innerHeight);

      this.$el.appendChild(this.renderer.domElement);
      window.addEventListener("resize", this.onWindowResize, false); // 添加窗口监听事件（resize-onresize即窗口或框架被重新调整大小）
    },
    // 窗口监听函数
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },
    animate() {
      this.controls.update();
      requestAnimationFrame(this.animate);
      this.render();
    },
    render() {
      this.renderer.render(this.scene, this.camera);
    },
    // 外部模型加载函数
    loadObj({ mtl, object, typeName }) {
      let objLoader = new OBJLoader();
      let mtlLoader = new MTLLoader();
      // let _this = this;
      // 包含材质
      // mtlLoader.setPath("/static/models/")
      mtlLoader.setCrossOrigin("Anonymous");
      mtlLoader.load(mtl, (materials) => {
        // console.log("acm", acm);
        materials.preload();
        objLoader.setMaterials(materials);
        objLoader.load(object, (obj) => {
          // console.log(obj);
          // obj.position.set(0, 0, 0); // 模型摆放的位置
          // if (typeName === "wc") {
          //   obj.rotation.set(0, Math.PI / 2, 0);
          //   obj.position.set(-4.5, 0, 10);
          // }
          // if (typeName === "xz") {
          //   // obj.rotation.set(0, Math.PI / 2, 0);
          //   obj.position.set(-9, 0, -3);
          // }
          // if (typeName === "xb") {
          //   obj.position.set(0, 5, 5);
          // }
          obj.typeName = typeName;
          obj.scale.set(0.0008, 0.0008, 0.0008); // 模型放大或缩小，有的时候看不到模型，考虑是不是模型太小或太大。
          this.scene.add(obj);
        });
      });
    },
    /**
     * 点击事件
     */
    mouseClick(event) {
      this.scene.children.forEach((item) => {
        if (item.typeName === "xb") {
          let ljaxis = new THREE.Vector3(1, 0, 0); // 向量axis
          item.rotateOnAxis(ljaxis, Math.PI / 8); // 绕axis轴旋转π/8
        }
      });
      // 获取 raycaster 和所有模型相交的数组，其中的元素按照距离排序，越近的越靠前
      let intersects = this.getIntersects(event);
      if (intersects.length) {
        // intersects[0].object.position.x += 200;
        // intersects.forEach((item) => {
        //   item.object.position.x += 200;
        // });
      }

      // console.log(intersects);
      // console.log(this.scene);
      // 获取选中最近的 Mesh 对象
    },
    /**
     * 将屏幕坐标转换为3d 坐标
     */
    getIntersects(event) {
      let mainCanvas = event.path[0];
      event.preventDefault();
      let raycaster = new THREE.Raycaster();
      let mouse = new THREE.Vector2();
      // mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      // mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      mouse.x =
        ((event.clientX - mainCanvas.getBoundingClientRect().left) /
          mainCanvas.offsetWidth) *
          2 -
        1;
      mouse.y =
        -(
          (event.clientY - mainCanvas.getBoundingClientRect().top) /
          mainCanvas.offsetHeight
        ) *
          2 +
        1;
      raycaster.setFromCamera(mouse, this.camera);
      let intersects = raycaster.intersectObjects(this.scene.children, true);
      return intersects;
    },
  },
  mounted() {
    this.init();
    this.allObj.forEach((item) => {
      this.loadObj(item);
    });
    this.animate();
    // traverse()为three.js提供的递归遍历模型对象方法，getObjectById()、getObjectByName()也可用来查找对象
    this.scene.traverse((obj) => {
      if (obj.typeName === "wc") {
        obj.rotation.set(0, Math.PI / 2, 0);
        obj.position.set(-4.5, 0, 10);
      }
      if (obj.typeName === "xz") {
        // obj.rotation.set(0, Math.PI / 2, 0);
        obj.position.set(-9, 0, -3);
      }
      if (obj.typeName === "xb") {
        obj.position.set(0, 5, 5);
      }
      // 打印id属性
      console.log(obj.id);
      // 打印该对象的父对象
      console.log(obj.parent);
      // 打印该对象的子对象
      console.log(obj.children);
    });
  },
};
</script>
 
<style scoped>
.obj {
  width: 100%;
  height: 100%;
}
</style>
```

* 效果图

<img src="../img/3d-model.jpg" alt="obj模型效果图"></img>