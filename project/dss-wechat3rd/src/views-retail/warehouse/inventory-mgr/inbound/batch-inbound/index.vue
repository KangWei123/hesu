<template>
  <div class="other-inbound-container"
       v-loading="loading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/inbound' }">商品入库</el-breadcrumb-item>
      <el-breadcrumb-item>批量多仓入库</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form :model="inBoundForm"
             ref="inBoundForm"
             :rules="inBoundRules"
             class="other-inbound-content"
             label-width="80px">
      <!--入库类型-->
      <el-form-item label="入库类型"
                    prop="inboundType">
        <el-select v-model="inBoundForm.inboundType"
                   filterable
                   size="mini"
                   class="warehouseSelect"
                   placeholder="请选择">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="(item,index) in inboundTypeList"
                     :key="index"
                     v-if="item.value===10||item.value===13"
                     :label="item.label"
                     :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="备注">
        <el-input type="textarea"
                  :rows="3"
                  size="mini"
                  maxlength="256"
                  style="width: 300px;"
                  v-model="inBoundForm.remark"></el-input>
      </el-form-item>

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
      templateDownUrl: '/wp/materials/template/download?fileName=multiWarehouseInboundTemplate',
      uploadServerUrl: '/wp/inbound/multi_warehouse_batch_add',
      inBoundRules: {
        inboundType: [{ required: true, message: '请选择入库类型', trigger: 'blur' }]
      },
      inboundTypeList: Object.keys(ioboundEnum.inboundType).map(key => {
        return ioboundEnum.inboundType[key];
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
            inboundType: this.inBoundForm.inboundType,
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
      this.$router.push('/warehouse/inventory-mgr/inbound');
    }
  }
};
</script>

<style lang="less">

.other-inbound-container {
  min-height: calc(100vh - 161px);
  background: #fff;
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

