<template>
  <div class="other-inbound-container"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/outbound' }">商品出库</el-breadcrumb-item>
      <el-breadcrumb-item>批量多仓出库</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="inBoundForm"
             ref="inBoundForm"
             :rules="inBoundRules"
             class="other-inbound-content"
             label-width="80px">
      <!--入库类型-->
      <el-form-item label="出库类型"
                    prop="type">
        <el-select v-model="inBoundForm.type"
                   filterable
                   class="warehouseSelect"
                   placeholder="请选择">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="(item,index) in outboundTypeList"
                     :key="index"
                     v-if="item.value !== 21 && item.value !== 24&& item.value !== 20"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <!-- <el-form-item label="备注">
        <el-input type="textarea"
                  :rows="3"
                  size="mini"
                  maxlength="256"
                  style="width: 300px;"
                  v-model="inBoundForm.remark"></el-input>
      </el-form-item> -->

      <!--公用操作-->
      <el-form-item>
        <el-button type="primary"
                   @click="openVipUpload('inBoundForm')">批量导入
        </el-button>
      </el-form-item>
    </el-form>

    <!--批量导入-->
    <upload :visible.sync="dialog.upload"
            :title="'批量导入'"
            :limit="1"
            @upload-success="onUploadSuccess"
            :templateDownUrl="templateDownUrl"
            :uploadServerUrl="uploadServerUrl"
            :params='uploadParams'
            class="inbound-upload"
            :templateDesc="'您可以下载我们提供的模板，批量导入商品信息。'">
    </upload>

  </div>
</template>

<script>
import { mapState } from 'vuex';
import inventoryMgrApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum';
import IoBoundProductTable from '../../IoBoundProductTable';
import Upload from '@/dss-common/components/upload/index.vue';
export default {
  name: 'OtherInbound',

  components: {
    IoBoundProductTable,
    Upload
  },

  data() {
    return {
      loading: false,
      dialog: {
        upload: null
      },
      goodsType: goodsTypeEnum.product,
      inBoundForm: {
        type: null,
        remark: ''
      },
      uploadParams: {},
      templateDownUrl: 'https://tempate-1259575047.cos.ap-guangzhou.myqcloud.com/DSSOutboundBatchTemplate.xlsx',
      uploadServerUrl: '/wp/outbound/batch_add_with_address',
      inBoundRules: {
        type: [{ required: true, message: '请选择出库类型', trigger: 'blur' }]
      },
      outboundTypeList: Object.keys(ioboundEnum.outboundType).map(key => {
        return ioboundEnum.outboundType[key];
      })
    };
  },
  computed: {
    ...mapState({
      warehouseList: 'warehouseList'
    }),
    queryParams() {
      return this.filterRequestParams();
    }
  },

  mounted() {},

  methods: {
    openVipUpload(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.uploadParams = {
            type: this.inBoundForm.type,
            remark: this.inBoundForm.remark
          };
          this.dialog.upload = true;
        }
      });
    },

    onUploadSuccess(message) {
      if (message) {
        this.$message.error(message);
        return;
      }
      this.$router.push('/warehouse/inventory-mgr/outbound');
    }
  }
};
</script>

<style lang="less">
.other-inbound-container {
  .other-inbound-content {
    padding: 20px;
  }
}
.warehouseSelect {
  .el-input__inner {
    padding-left: 30px !important;
  }
}
</style>

