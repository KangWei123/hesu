<template>
<div class="time-control">
    <span>周期</span>
    <div class="cycle">
        <div class="cycle-value">{{ label }}</div>
        <div class="cycle-calculate">
            <div class="calculate add" @click="add">+</div>
            <div class="calculate decrease" @click="decrease">-</div>
        </div>
    </div>
</div>

</template>

<script>
import './style.less';

const type = [{
    value: 'day',
    label: '天'
    },
    {
    value: 'week',
    label: '周'
    },
    {
    value: 'month',
    label: '月'
    }];
export default {
    props: ['timeUnitCount'], // 提供可选择的时间单位个数，0 代表只有天，1 代表 天、周 的选择方式
    data () {
        return {
            value: 0,
            label: '天'
        }
    },
    watch: {
        value () {
            this.label = type[this.value].label;
            this.$emit('change', type[this.value].value);
        }
    },
    methods: {
        add () {
            this.value = this.value + 1;
            if (this.value > (this.timeUnitCount || 2)) {
                this.value = 0;
            }
        },
        decrease () {
            this.value = this.value - 1;
            if (this.value < 0) {
                this.value = (this.timeUnitCount || 2);
            }
        }
    }
}
</script>