
<template>
  <div class="wd-image-editor" v-if="dataSource">
    <div class="com-header">
      <span class="com-header-title">{{name}}</span>
    </div>
    <div class="com-body">
      <div class="lock-tips">该组件已被总部锁定，不可编辑与删除</div>
    </div>
  </div>
</template>

<script>
import './css/common.less';

export default {
  name: 'posterModuleEdit',
  props: {
    dataSource: {
      type: Object,
      default: null
    },
    name: {
      type: String,
      default: ''
    }
  },
  components: {},

  data() {
    return {};
  },

  mounted() {},

  methods: {}
};
</script>

<style lang="less" scoped>
.lock-tips {
  padding-top: 40px;
  text-align: center;
  color: rgba(32, 37, 44, 1);
  font-family: PingFangSC-Regular;
  font-weight: 400;
  font-size: 14px;
}
</style>
