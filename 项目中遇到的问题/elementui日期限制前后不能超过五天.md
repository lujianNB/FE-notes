<!--
 * @Autor: 卢建
 * @LastEditors: 卢建
 * @Description: elementui日期限制前后不能超过五天
 * @Date: 2022-03-28 16:17:21
 * @LastEditTime: 2022-03-28 16:45:51
-->
# elementui日期限制前后不能超过五天

## template模块

```
<el-date-picker
    v-model="dcTime"
    type="daterange"
    range-separator="至"
    start-placeholder="开始日期"
    end-placeholder="结束日期"
    format="yyyy 年 MM 月 dd 日"
    value-format="yyyy-MM-dd"
    :picker-options="pickerOptions"
>
</el-date-picker>
```

## js模块

```
data(){
    return {
        dcTime: [],
        // 日期选择器可选择范围
        choiceDate: null,
        pickerOptions: {
        onPick: ({
                maxDate,
                minDate
            }) => {
                // 把选择的第一个日期赋值给一个变量。
                this.choiceDate = minDate.getTime();
                // 如何你选择了两个日期了，就把那个变量置空
                if (maxDate) this.choiceDate = "";
            },
            disabledDate: time => {
                // 如何选择了一个日期
                if (this.choiceDate) {
                    // 5天的时间戳
                    const one = 5 * 24 * 3600 * 1000;
                    // 当前日期 - one = 5天之前
                    const minTime = this.choiceDate - one;
                    // 当前日期 + one = 5天之后
                    const maxTime = this.choiceDate + one;
                    return (
                        time.getTime() < minTime ||
                        time.getTime() > maxTime ||
                        // 限制不能选择今天及以后，不能今天用time.getTime() + 1 * 24 * 3600 * 1000 > Date.now()
                        time.getTime() > Date.now()
                    );
                } else {
                    // 如果没有选择日期，就要限制不能选择今天及以后                        
                    return time.getTime() > Date.now()
                }
            }
        }
    }
}
```