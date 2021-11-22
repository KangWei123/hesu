<template>
  <div>
    <el-tooltip effect="dark" :disabled="!disable" :content="col.disabledTip || defaultDisabledTip" placement="top">
      <span>
        <el-button :disabled="disable" @click="choose" type="primary">选择</el-button>
      </span>
    </el-tooltip>
  </div>
</template>

<script>
  export default {
    props: ['row', 'col'],
    data: function () {
      return {
        visible: false,
        defaultDisabledTip: '无法选择',
      };
    },
    methods: {
      choose() {
        this.$emit('choose-item', this.row);
      },
    },
    computed: {
      disable() {
        if (typeof this.col.canAbled === 'function') {
          return !this.col.canAbled(this.row);
        }
        return !this.row[this.col.abledProp];
      },
    },
  };
</script>
