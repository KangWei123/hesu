/*
 * @Author: Neexz
 * @Date: 2018-11-05 16:02:26
 * @Last Modified by: Neexz
 * @Last Modified time: 2018-12-11 09:38:25
 */

<template>
  <div class='verification-add-container'>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/warehouse/inventory-mgr/verification' }">库存盘点</el-breadcrumb-item>
      <el-breadcrumb-item>{{update ? '继续盘点' : '新增盘点'}}</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="verification-add-content">
      <div class='warn'>
        <!-- <img class="warn-img"
             src='../../../../../images/person.png' /> -->

        <span class="warn-desc">
          提示：为避免出现库存差异，请尽量在非营业时间进行盘点。
        </span>
      </div>

      

      <div class="store">
        <span class="label spanLabel">仓库: </span>
        <el-select v-model="warehouseId"
                   size="mini"
                   placeholder="请选择仓库"
                   filterable
                   @change="onFilter">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="(item, index) in warehouseList"
                     :key="index"
                     :label="item.name"
                     :value="item.id"></el-option>
        </el-select>
      </div>

      <div class="remark">
        <span class="label spanLabel">备注: </span>
        <el-input type="textarea"
                  maxlength="256"
                  style="width: 400px"
                  :autosize="{ minRows: 3, maxRows: 6}"
                  placeholder="请输入备注"
                  v-model="remark">
        </el-input>
      </div>

      <div class="choose">
        <span class="spanLabel">选择商品: </span>
        <el-button type="primary"
                   plain
                   icon="el-icon-plus"
                   @click="chooseProduct">
          添加商品
        </el-button>

        <el-button icon="el-icon-download"
                   v-if="!verificationId"
                   class="add-member"
                   type="primary"
                   plain
                   @click="openVipUpload">批量导入
        </el-button>
      </div>

      <el-form :model="verificationForm"
               :rules="validateRules"
               ref="ruleForm">
        <el-form-item prop="goodsList">
          <goods-table :goods-list="verificationForm.goodsList"
                       class="goods-table"
                       v-loading="isLoading">
          </goods-table>
        </el-form-item>
      </el-form>

      
      <stock-dialog :showDialog.sync="showSelectProductDialog"
                    :params="params"
                    :selected-list="verificationForm.goodsList"
                    @selected="onChooseProduct">
      </stock-dialog>
    </div>

    <div class="bottom-button">
      <div class="button">
        <el-button @click="cancel">
          取消
        </el-button>

        <el-button @click="addOrUpdateVerification(1)" type="primary">
          保存草稿
        </el-button>

        <el-button @click="addOrUpdateVerification(2)"
                    type="primary">
          完成盘点
        </el-button>
      </div>
      
    </div>

    <!--批量导入-->
    <upload :visible.sync="dialog.upload"
            :title="'批量导入'"
            :limit="1"
            @upload-success="onUploadSuccess"
            :templateDownUrl="templateDownUrl"
            :uploadServerUrl="uploadServerUrl"
            :params='uploadParams'
            class="inbound-upload"
            :templateDesc="'您可以下载我们提供的模板，批量导入盘点信息。'">
    </upload>

  </div>
</template>

<script>
import GoodsTable from './goodsTable.vue';
// import mockGoodsListData from '../mock/goodsListData.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import stockDialog from '@/dss-wechat3rd/src/bz_components/stock-dialog/index.vue';
import GoodsNameColumn from './goodsNameColumn.vue';
import GoodsListFilter from '@/dss-wechat3rd/src/components/goods/GoodsListFilter';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import Upload from '@/dss-common/components/upload/index.vue';
import { mapState } from 'vuex';

const columns = [
  {
    label: '名称',
    prop: 'itemName',
    width: 250,
    component: GoodsNameColumn
  },

  {
    label: '单位',
    prop: 'itemUnit',
    propsHandler: Handler.propsHandler
  },

  {
    label: '批次',
    prop: 'batchNo',
    propsHandler: Handler.propsHandler,
    align: 'center'
  },

  {
    label: '实物库存',
    prop: 'stock',
    propsHandler: Handler.propsHandler,
    align: 'center'
  },

  {
    label: '可用库存',
    prop: 'usableStock',
    propsHandler: Handler.propsHandler,
    align: 'center'
  }
];

export default {
  components: {
    GoodsTable,
    stockDialog,
    GoodsNameColumn,
    GoodsListFilter,
    Upload
  },

  data() {
    const productValidator = (rule, value, callback) => {
      let msg = null;
      value.forEach(v => {
        if (!v.reviewNum && v.reviewNum !== 0) {
          msg = '请输入盘点数量';
          v.hasError = true;
        } else if (!/^[0-9]\d{0,4}$/.test(v.reviewNum)) {
          v.hasError = true;
          msg = '请输入0~99999之间的整数';
        } else {
          v.hasError = false;
        }
      });
      if (msg) {
        return callback(new Error(msg));
      }
      return callback();
    };

    return {
      dialog: {
        upload: null
      },
      uploadParams: {},
      templateDownUrl:
        'https://online-material-1259575047.cos.ap-guangzhou.myqcloud.com/template/warehouseReviewImportTemplate.xlsx', //模板路径
      uploadServerUrl: '/wp/warehouse/review/multi_review_batch_add', //上传路径
      isLoading: false,
      remark: '',
      verificationId: 0,
      update: false,
      // goodsList: [],
      showSelectProductDialog: false,
      goodsTypeEnum,
      columns,
      apiUrl: '/wp/warehouse/stock/list',
      queryParams: {
        status: 1,
        type: 1
      },
      warehouseId: null,
      params: {},
      verificationForm: {
        goodsList: []
      },

      validateRules: {
        goodsList: [
          // { type: 'array', required: true, message: '请输入盘点数量', trigger: 'change' },
          { validator: productValidator, trigger: 'change' }
        ]
      }
    };
  },

  computed: {
    ...mapState({
      warehouseList: state => {
        return state.warehouseList;
      }
    })
  },

  mounted() {
    // 获取盘点的商品列表
    if (this.$route.query.id) {
      this.update = true;
      this.getVerificationDetail(this.$route.query.id);
    } else {
      // mock data
      // this.goodsList = this.handleResponseData(mockGoodsListData.data);
      // console.log('goodsList --> ', JSON.stringify(this.goodsList));
    }
  },

  methods: {
    getVerificationDetail(verificationId) {
      this.isLoading = true;
      let params = {
        reviewId: verificationId
      };
      inventoryMgrAPI
        .getVerificationDetail(params)
        .then(res => {
          this.warehouseId = res.data.warehouseId;
          this.onFilter();
          this.verificationForm.goodsList = this.handleResponseData(res.data.itemList);
          this.remark = res.data.remark;
          this.verificationId = res.data.id;
        })
        .catch(err => {
          console.error('getVerificationDetail error', err);
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    cancel() {
      this.$router.push('/warehouse/inventory-mgr/verification');
    },

    openVipUpload() {
      if (!this.warehouseId) {
        this.$message.warning('请先选择仓库');
        return;
      }
      let obj = this.warehouseList.find(item => {
        return item.id === this.warehouseId;
      });

      this.uploadParams = {
        remark: this.remark,
        status: 2,
        warehouseId: this.warehouseId,
        warehouseName: obj.name
      };
      this.dialog.upload = true;
    },

    //上传成功后的回调
    onUploadSuccess(message) {
      if (message) {
        this.$message.error(message);
        return;
      }
      this.$router.push('/warehouse/inventory-mgr/verification');
    },

    // status: 1 -->草稿  2-->完成
    addOrUpdateVerification(status) {
      this.$refs.ruleForm.validate(valid => {
        if (!valid) {
          this.$message.error('盘点数量输入不正确，请输入正确的数字');
          return false;
        }
        if (!this.warehouseId) {
          this.$message.warning('请先选择仓库');
          return;
        }
        let obj = this.warehouseList.find(item => {
          return item.id === this.warehouseId;
        });

        let params = {
          remark: this.remark,
          status: status,
          itemList: this.verificationForm.goodsList,
          id: this.verificationId ? this.verificationId : null,
          warehouseId: this.warehouseId,
          warehouseName: obj.name
        };

        this.isLoading = true;

        if (this.update) {
          inventoryMgrAPI
            .updateVerification(params)
            .then(res => {
              console.log('addVerification', JSON.stringify(res.data));
              this.$router.push('/warehouse/inventory-mgr/verification');
            })
            .catch(err => {
              console.error('addVerification error ', err);
            })
            .always(() => {
              this.isLoading = false;
            });
        } else {
          inventoryMgrAPI
            .addVerification(params)
            .then(res => {
              console.log('addVerification', JSON.stringify(res.data));
              this.$router.push('/warehouse/inventory-mgr/verification');
            })
            .catch(err => {
              console.error('addVerification error ', err);
            })
            .always(() => {
              this.isLoading = false;
            });
        }
      });
    },

    onFilter() {
      this.params = {
        warehouseId: this.warehouseId
      };
    },

    handleResponseData(resData) {
      if (resData == null) {
        return null;
      }
      let goodsList = [];
      resData.forEach(item => {
        let goods = {};
        goods.__uuid = item.__uuid;
        goods.itemName = item.itemName;
        goods.itemAttribute = item.itemAttribute;
        goods.imgUrl = item.thumbnail || item.imgUrl;
        goods.itemNo = item.itemNo && item.itemNo !== 'null' ? item.itemNo : undefined;
        goods.barcode = item.barcode;
        goods.unit = item.itemUnit || item.unit;
        goods.stock = item.stock;
        goods.usableStock = item.usableStock;
        goods.reviewNum = item.reviewNum || 0;
        goods.skuBarcode = item.barcode || item.skuBarcode;
        goods.skuId = item.skuId && item.skuId !== 'null' ? item.skuId : undefined;
        goods.expirationDate = item.expirationDate;
        goods.batchNo = item.batchNo;

        goodsList.push(goods);
      });
      console.log(goodsList);
      return goodsList;
    },

    chooseProduct() {
      if (!this.warehouseId) {
        this.$message.warning('请先选择仓库');
        return;
      }
      this.showSelectProductDialog = true;
    },

    onChooseProduct(selectedRows) {
      this.verificationForm.goodsList = this.handleResponseData(selectedRows);
    }
  }
};
</script>

<style lang="less">
 @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度
.verification-add-container:after {
  content: '';
  height: 60px;
  display: block;
}
.verification-add-container {
  background: #fff;
  min-height: calc(100vh - @header - @footerHeight - @titleHeight - 50px);
  .verification-add-content {
    padding: 20px;
  }
  .el-textarea__inner {
    min-width: 460px;
    min-height: 180px !important;
  }

  .warn {
    // background-color: rgba(242, 242, 242, 1);
    background-color: #fff5f2;
    padding: 10px 10px;
    width: 99%;
    margin-bottom: 24px;
    height: 40px;
    line-height: 40px;
    .warn-img {
      vertical-align: middle;
    }

    .warn-desc {
      color: @ui-font-color-black;
      margin-left: 10px;
      vertical-align: middle;
    }
  }

  .remark {
    margin: 20px 0;
    overflow: hidden;
    display: block;
    margin-left: 28px;
    .label {
      vertical-align: top;
    }
  }

  .store {
    margin-left: 28px;
    .label {
      vertical-align: center;
    }
  }
  .spanLabel {
    margin-right: 8px;
    color: @ui-font-color-darkGrey;
  }

  .choose {
    margin: 20px 0 0;
  }

  .op-block {
    margin-top: 20px;
  }

  .goods-table {
  }

  .list-filter {
    margin-left: 32px;
  }

  // 底层按钮
  .button {
    width: 470px;
    margin-left: 30%;
    button {
      // margin-left: -22px;
      margin-right: 0px;
    }
  }
}
</style>

