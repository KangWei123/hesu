<template>
  <el-dialog
    class="dss-dialog dss-upload dss--resolve-xls"
    :title="title"
    :append-to-body="innerDialog"
    width="400px"
    :visible.sync="show"
  >
    <a style="margin-bottom: 10px;" href="javascript:void(0)" @click="routeToStoreFileDownload">门店列表，"批量导出"</a>
    <el-upload
      ref="$upload"
      class="upload-demo"
      :accept="SheetJSFT"
      action="https://jsonplaceholder.typicode.com/posts/"
      :limit="1"
      :file-list="fileList"
      :on-change="onFileChange"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>

    <div class="dialog-footer" />
  </el-dialog>
</template>

<script>
import xlsUtil from './xls-util';
import { resolveType, resolveKey } from './constants';

export default {
  props: {
    innerDialog: {
      type: Boolean,
      default: false
    },
    //是否可见
    visible: {
      type: Boolean,
      default: false
    },
    //任务标题
    title: {
      type: String,
      default: '导入'
    },
    resolveType: {
      type: String,
      default: resolveType.STORE
    }
  },

  data() {
    return {
      fileList: [],
      SheetJSFT: ['xlsx', 'xls']
        .map(function(x) {
          return '.' + x;
        })
        .join(',')
    };
  },

  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },

  methods: {
    routeToStoreFileDownload() {
      const storeListUrl = location.protocol + '//' + location.host + '/console.html#/companyManage/printer/store';
      window.open(storeListUrl);
    },
    onFileChange(evt) {
      xlsUtil.readFile(evt.raw).then(this.onResolve.bind(this));
      this.$refs.$upload.clearFiles();
    },
    onResolve(list) {
      const finalList = [];
      const keys = resolveKey[this.resolveType];
      list.forEach(item => {
        let finalItem = null;
        for (let key in item) {
          if (keys.hasOwnProperty(key)) {
            if (!finalItem) finalItem = {};
            finalItem[keys[key]] = item[key];
          }
        }
        if (!!finalItem) finalList.push(finalItem);
      });
      if (!finalList.length) {
        this.$message({
          message: '上传文件内容格式不正确，请联系我方运营人员',
          type: 'warning'
        });
      } else {
        this.$emit('resolve', finalList);
        this.show = false;
      }
    }
  }
};
</script>

<style rel="stylesheet/less" lang="less">
.dss-upload .dss--resolve-xls {
  width: 600px;
}

.dss--resolve-xls .dialog-footer {
  text-align: center;
}

.dss--resolve-xls {
  .upload-item {
    background: #ffffff;
    border: dashed 1px #3499fe;
    border-radius: 5px;
    padding: 10px 15px;
    margin-bottom: 198px;
  }

  .el-upload {
    display: block;
    height: 29px;
    line-height: 29px;
  }

  .upload-tip {
    font-size: 12px;
    color: rgba(1, 35, 52, 0.5);
    letter-spacing: 0;
    float: left;
  }

  .upload-btn {
    float: right;
    border: 1px solid #3499fe;
    border-radius: 2px;
    font-size: 11px;
    color: #3499fe;
    letter-spacing: 0;
    width: 102px;
    height: 29px;
    line-height: 29px;
    display: inline-block;

    .el-icon-upload {
      font-size: 11px;
      color: #3499fe;
      margin-right: 7px;
    }
  }
}
</style>
