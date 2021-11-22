<template>
<div class="key-no-data" :style="{ color: color, height: height }">
    <slot>暂无数据</slot>
</div>
</template>

<script>
import './style.less';

export default {
    name: 'NoData',
    props: {
        color: {
            type: String,
            default: '#000'
        },
        height: {
            type: String,
            default: '300px'
        }
    }
}
</script>
