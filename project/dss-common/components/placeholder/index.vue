<template>
  <div class="placeholder" :style="{minHeight: minHeight + 'px', height: height + 'px', justifyContent: justifyContent}">
    <i class="key-icon key-icon-none"></i>
    <slot>{{ text }}</slot>
  </div>
</template>

<script>
  import './style.less';
  import '@/dss-common/style/base.less';

  const textMap = {
    noData: '暂无数据'
  };

  export default {
    props: {
      height: {
        type: Number,
        default: 200
      },
      minHeight: {
        type: Number,
        default: 200
      },
      type: {
        type: String,
        default: 'noData',
        validator(val) {
          return ~Object.keys(textMap).indexOf(val);
        }
      },
      justifyContent: {
        type: String,
        default: 'center'
      },
      tip: {
        type: String,
        default: null
      }
    },
    computed: {
      text() {
        return this.tip || textMap[this.type];
      }
    }
  };
</script>
