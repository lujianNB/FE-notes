# 表达式

* !, !=, <, <=, ==, >, >=（高频率使用）

```
// 语法
["!", boolean]: boolean
["!=", value, value]: boolean
["<", value, value]: boolean
["<=", value, value]: boolean
["==", value, value]: boolean
[">", value, value]: boolean
[">=", value, value]: boolean
```

* all 逻辑与（高频率使用）

```
// 语法
["all", boolean, boolean]: boolean

// 常用于图层过滤
'filter': [
	'all',
	['==', 'extrude', 'true'],
	['<=', 'height', 3]
] // 筛选出图层里数据extrude为true5且height<=3的元素
```

* any 逻辑或

```
// 语法
["any", boolean, boolean]: boolean
```

* case 条件 （高频率使用）

```
// 语法
["case",
    condition: boolean, output: OutputType,
    condition: boolean, output: OutputType,
    ...,
    fallback: OutputType
]: OutputType

'paint': {
	'fill-opacity': [
		'case',
		['boolean', ['feature-state', 'hover'], false],
		1,
		0.5
	]
} // 图层透明度默认为0.5，悬停状态为1
```

* match （高频率使用）

```
// 语法
["match",
    input: InputType (number or string),
    label: InputType | [InputType, InputType, ...], output: OutputType,
    label: InputType | [InputType, InputType, ...], output: OutputType,
    ...,
    fallback: OutputType
]: OutputType

// 单个字符串
'paint': {
	'color': ['match', ['get', 'name'],
            'line-1', '#f61c13',
            'line-2', '#efa573',
            'line-3', '#f9a81a',
            'blue'
          ]
}
```

* interpolate（高频率使用）

**常见的应用场景为热力图、轨迹图、模型网格渲染等，热力图中为heatmap-density表达式，轨迹线中为line-progress表达式**

```
// 语法
["interpolate",
    interpolation: ["linear"] | ["exponential", base] | ["cubic-bezier", x1, y1, x2, y2],
    input: number,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType (number, array<number>, or Color)

// ["linear"]: 在略小于或大于输入的两个端点之间进行线性内插。
// ["exponential", base]: 在两个端点之间进行指数插值，略大于或小于输入值。base控制输出增加的速率:值越高，输出越接近范围的高端。当值接近1时，输出线性增加。
// ["cubic-bezier", x1, y1, x2, y2]: 使用由给定控制点定义的三次贝塞尔曲线进行插值。
'heatmap-color': [//热力图颜色
    'interpolate',
    ['linear'],
    ['heatmap-density'],
    0,'rgba(255,255,255,0)',
    0.2,'rgb(0,0,255)',
    0.4, 'rgb(117,211,248)',
    0.6, 'rgb(0, 255, 0)',
    0.8, 'rgb(255, 234, 0)',
    1, 'rgb(255,0,0)',
] // 密度为0或小于0，输出颜色'rgba(255,255,255,0)'，密度为0-0.2，输出颜色在'rgba(255,255,255,0)'和'rgb(0,0,255)'之间，密度为0.2，输出颜色'rgb(0,0,255)'
```

* step（高频率使用）

**通过计算由输入和输出值(“停止”)对定义的分段常数函数，产生离散的、阶梯式的结果。输入可以是任何数字表达式(例如，["get"， "population"])。停止输入必须是严格升序的数字文字。返回仅小于输入的stop的输出值，如果输入小于第一个stop，则返回第一个输出值。**

```
// 语法
["step",
    input: number,
    stop_output_0: OutputType,
    stop_input_1: number, stop_output_1: OutputType,
    stop_input_n: number, stop_output_n: OutputType, ...
]: OutputType

paint: {
	// 小于100时，circles的颜色为Blue, 大小为20px 
	// 大于等于100且小于750之间时，circles的颜色为Yellow, 大小为30px（左闭右开区间）
	// 大于等于750时，circles的颜色为Pink, 大小为40px 
	'circle-color': [
		'step',
		['get', 'point_count'],
		'#51bbd6',
		100,
		'#f1f075',
		750,
		'#f28cb1'
	],
	'circle-radius': [
		'step',
		['get', 'point_count'],
		20,
		100,
		30,
		750,
		40
	]
}
```

* concat，downcase，upcase（字符串操作，实际应用中很少用，处理数据源头就行）