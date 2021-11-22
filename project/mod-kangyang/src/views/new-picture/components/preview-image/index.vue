<template>
  <el-dialog title="预览大图" :visible.sync="showPopup" append-to-body class="common-dialog" width="900px">
    <img :src="data.fileUrl || data.coverUrl" />
  </el-dialog>
</template>

<script>
  import chooseTags from '../choose-tags/index.vue';

  export default {
    components: {
      chooseTags,
    },
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      data: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    computed: {
      showPopup: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
    },
    mounted() {},
    methods: {},
  };
</script>

<style lang="less" scoped>
  @import '../../css/common.less';

  .common-dialog {
    /deep/ .el-dialog__body {
      display: flex;
      justify-content: center;
      align-items: center;
      height: 600px;
    }

    img {
      max-width: 100%;
      max-height: 100%;
    }
  }
</style>
