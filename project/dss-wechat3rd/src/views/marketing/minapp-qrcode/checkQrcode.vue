<template>
  <el-dialog title="查看二维码" :visible.sync="dialogShow" class="edit-qrCode" @close="close" width="400px">
    <div class="img-wrapper">
      <img class="img" :src="qrcodeData.curDetailPath" />
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dowload" :loading="loading">下 载</el-button>
    </div>
  </el-dialog>
</template>

<script>
import qrCodeApi from '@/dss-wechat3rd/src/api/qrCode.js';
import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

export default {
  mixins: [AdapterIfr.AdapterMixins],
  data() {
    return {
      loading: false,
      qrcodeData: {
        id: null,
        curDetailPath: null
      },
      dialogShow: false,
    };
  },
  methods: {
    dowload() {
      this.$emit('dowload', this.qrcodeData)
      this.dialogShow = false
    },
    show(data) {
      this.dialogShow = true;
      this.qrcodeData = {...data}
    },
    close() {
      this.dialogShow = false;
      this.adapterIfmMask(false);
    }
  }
};
</script>

<style lang="less">
.img-wrapper {
  width: 250px;
  height: 250px;
  margin: 20px auto;

  .img {
    width: 100%;
    height: 100%;
  }
}
</style>
