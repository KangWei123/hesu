<template>
  <el-dialog title="下载二维码" :visible.sync="dialogShow" class="download-qrCode">
    <el-table :data="downloadList" style="width: 100%" v-loading="loading" align="center">
      <el-table-column prop="width" label="二维码边长(cm)" align="center"></el-table-column>
      <el-table-column label="下载" align="center">
        <template slot-scope="scope">
          <a :href="scope.row.qrCodeUrl" :download="scope.row.qrName">
            <img src="./images/download.png" class="download-logo" />
          </a>
        </template>
      </el-table-column>
    </el-table>
  </el-dialog>
</template>

<script>
export default {
  props: {
    downloadList: {
      type: Array,
      default() {
        return []; // [{width: 8,  qrCodeUrl: '', qrName: ''}],
      }
    }
  },
  data() {
    return {
      loading: false,
      dialogShow: false
    };
  },
  methods: {
    show(data) {
      this.dialogShow = true;
      console.log(this.downloadList);
    }
  }
};
</script>

<style lang="less" scoped>
.download-qrCode {
  /deep/.el-dialog {
    .el-dialog__body {
      padding: 0 30px 40px;
    }
  }
  /deep/.el-table {
    .cell {
      padding: 10px;
      font-size: 14px;
    }
  }

  .download-logo {
    width: 20px;
    height: 20px;
    vertical-align: top;
  }
}
</style>
