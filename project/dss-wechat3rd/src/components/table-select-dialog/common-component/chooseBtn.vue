<template>
  <div>
    <el-button v-if="!col.disabledTip" @click="choose" type="primary">选择</el-button>
    <el-tooltip
      v-else
      effect="dark"
      :disabled="!disable"
      :content="col.disabledTip"
      placement="top"
    >
      <!-- 多包一层 span 用来触发 tooltip 的显示，文档 https://element.eleme.cn/#/zh-CN/component/tooltip#attributes -->
      <span>
        <el-button :disabled="disable" @click="choose" type="primary">选择</el-button>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  props: ['row', 'col'],
  data: {
    visible: false
  },
  methods: {
    choose() {
      this.$emit('choose-item', this.row);
    }
  },
  computed: {
    disable() {
      if (typeof this.col.canAbled === 'function') {
        return !this.col.canAbled(this.row);
      }
      return !this.row[this.col.abledProp];
    }
  }
};
</script>

