<template>
  <div class="inventory iobound-detail-container" v-if="boundDetail" v-loading="loading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item
        :to="{ path: computeIsOutbound ? '/warehouse/inventory-mgr/outbound' : '/warehouse/inventory-mgr/inbound' }"
        >{{ computeIsOutbound ? '商品出库' : '商品入库' }}</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ computeIsOutbound ? '出库详情' : '入库详情' }}</el-breadcrumb-item>
    </el-breadcrumb>
    <el-row class="detail-row">
      <el-col :span="6">
        <span>{{
          computeIsOutbound ? '出库单号: ' + boundDetail.outboundNo : '入库单号: ' + boundDetail.inboundNo
        }}</span>
      </el-col>
      <el-col :span="6">
        <span>仓库: {{ boundDetail.warehouseName }}</span>
      </el-col>
      <el-col :span="6">
        <span>经办人: {{ boundDetail.contact || boundDetail.phone }}</span>
      </el-col>
    </el-row>
    <el-row class="detail-row">
      <el-col :span="6">
        <span>{{ computeIsOutbound ? '出库类型:' + ioboundType : '入库类型:' + ioboundType }}</span>
      </el-col>
      <el-col :span="6">
        <span v-if="computeIsOutbound">出库时间: {{ boundDetail.outboundTime | time }}</span>
        <span v-else>入库时间: {{ boundDetail.inboundTime | time }}</span>
      </el-col>
      <el-col :span="6">
        <span v-if="ioboundType === '销售出库'">关联订单号: {{ boundDetail.orderNo }}</span>
        <span v-else>关联单号: {{ boundDetail.relocateNo }}</span>
      </el-col>
    </el-row>
    <el-row class="detail-row">
      <el-col :span="6">
        <span>供应商: {{ boundDetail.supplierName }}</span>
      </el-col>
      <el-col :span="6">
        状态:
        <!-- 待审批 1-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.PENDING.value">{{
          ioboundEnum.boundStatus.PENDING.label
        }}</span>
        <!-- 部分入库 4-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.PART.value">{{
          ioboundEnum.boundStatus.PART.label
        }}</span>
        <!-- 审核通过 20-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.THROUGH.value">{{
          ioboundEnum.boundStatus.THROUGH.label
        }}</span>
        <!-- 拒绝 21-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.REFUSE.value">{{
          ioboundEnum.boundStatus.REFUSE.label
        }}</span>
        <!-- 审核失败 22-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.FAILURE.value">{{
          ioboundEnum.boundStatus.FAILURE.label
        }}</span>
        <!-- 出入库完成 3-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.FINISHED.value">{{
          ioboundEnum.boundStatus.FINISHED.label
        }}</span>
        <!-- 用户申请取消 5-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.CANCEL.value">{{
          ioboundEnum.boundStatus.CANCEL.label
        }}</span>
        <!-- 全部退款 7-->
        <span v-if="boundDetail.status === ioboundEnum.boundStatus.REFUND_ALL.value">{{
          ioboundEnum.boundStatus.REFUND_ALL.label
        }}</span>
      </el-col>
      <el-col :span="6">
        <span>{{ computeIsOutbound ? '入库仓库' : '出库仓库' }}: {{ boundDetail.toWarehouseName }}</span>
      </el-col>
    </el-row>

    <el-row class="detail-row" v-if="boundDetail.receiverPhone">
      <el-col :span="6">
        <span>收货人：{{ boundDetail.receiverName }}</span>
      </el-col>
      <el-col :span="6">
        <span>联系电话: {{ boundDetail.receiverPhone }}</span>
      </el-col>
      <el-col :span="6">
        <span
          >收货地址: {{ boundDetail.province }}{{ boundDetail.city }}{{ boundDetail.district }}
          {{ boundDetail.address }}
        </span>
      </el-col>
    </el-row>

    <el-row class="detail-row">
      <span>备注: {{ boundDetail.remark }}</span>
    </el-row>
    <div class="io-bound-detail-table">
      <el-table
        :data="boundDetail.itemList"
        v-if="boundDetail.itemList && boundDetail.itemList.length"
        class="wkt-table"
      >
        <el-table-column label="商品名称" min-width="300">
          <template slot-scope="scope">
            <div class="goods-info">
              <img :src="scope.row.thumbnail" />
              <div style="display: inline-block;vertical-align: middle">
                <div class="goods-desc">
                  {{ scope.row.itemName + (scope.row.itemAttribute ? '(' + scope.row.itemAttribute + ')' : '') }}
                </div>
                <div class="goods-desc">{{ scope.row.barcode }}</div>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="单位" prop="itemUnit" width="180"> </el-table-column>
        <el-table-column
          :label="computeIsOutbound ? '应出库数量' : '应入库数量'"
          prop="count"
          align="center"
          width="180"
        >
        </el-table-column>

        <el-table-column
          :label="computeIsOutbound ? '实际出库数量' : '实际入库数量'"
          v-if="!confirm"
          prop="actualCount"
          align="center"
          width="180"
        >
        </el-table-column>
        <el-table-column :label="computeIsOutbound ? '实际出库数量' : '实际入库数量'" width="130" v-if="confirm">
          <template slot-scope="scope">
            <el-input v-model="scope.row.actualCount" size="mini"></el-input>
          </template>
        </el-table-column>
        <el-table-column label="批次" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ !!scope.row.batchNo && scope.row.batchNo !== '-1000' ? scope.row.batchNo : 'N/A' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="质保期" align="center" width="180">
          <template slot-scope="scope">
            <span>{{ scope.row.expirationDate | time('YYYY-MM-DD') }}</span>
          </template>
        </el-table-column>
      </el-table>

      <div class="bottom-button">
        <el-button
          @click="update_status(boundDetail, ioboundEnum.boundStatus.REFUSE.value)"
          v-if="boundDetail.status === ioboundEnum.boundStatus.PENDING.value"
          >拒绝</el-button
        >
        <el-button
          type="primary"
          @click="update_status(boundDetail, ioboundEnum.boundStatus.THROUGH.value)"
          v-if="boundDetail.status === ioboundEnum.boundStatus.PENDING.value"
          >通过</el-button
        >
        <!-- 确认出入库 如果第三方仓库系统隐藏确认出入库-->
        <el-button
          type="primary"
          @click="confirmBound(boundDetail)"
          v-if="
            boundDetail.status === ioboundEnum.boundStatus.THROUGH.value &&
              boundDetail.type !== ioboundEnum.outboundType.SALE.value &&
              !confirm &&
              !boundDetail.useThirdWMS
          "
        >
          {{ computeIsOutbound ? '确认出库' : '确认入库' }}
        </el-button>
        <!-- 差异出入库 -->
        <el-button
          type="primary"
          v-if="boundDetail.status === ioboundEnum.boundStatus.THROUGH.value && confirm"
          @click="handlebound()"
          class="info-item"
          >{{ computeIsOutbound ? '确认出库' : '确认入库' }}</el-button
        >
      </div>
    </div>
  </div>
</template>

<script>
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
import regexps from '@/dss-common/utils/regexps.js';
import { mapState } from 'vuex';
export default {
  name: 'IOBoundDetail',
  props: {
    /*类型：是出库还是入库*/
    boundType: {
      type: String,
      default: 'in'
    },
    /*出入库单号*/
    boundNo: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      loading: false,
      boundDetail: null,
      ioboundEnum
    };
  },
  computed: {
    /*只要不是in都默认是out*/
    computeIsOutbound() {
      return this.isOutbound();
    },
    confirm() {
      return this.$route.query.confirm;
    },

    ...mapState({
      curApp: 'curApp'
    }),

    ioboundType() {
      const boundType = this.isOutbound() ? ioboundEnum.outboundType : ioboundEnum.inboundType;
      const boundTypeKeys = Object.keys(boundType);
      const len = boundTypeKeys.length;
      let key = null;
      for (let i = 0; i < len; i++) {
        if (this.boundDetail.type === boundType[boundTypeKeys[i]].value) {
          key = boundTypeKeys[i];
          break;
        }
      }
      return boundType[key] ? boundType[key].label : '';
    }
  },
  mounted() {
    this.getBoundDetail();
  },
  methods: {
    handlebound() {
      let regexp = false;
      this.boundDetail.itemList.forEach(item => {
        if (!regexps.positiveInteger.reg.test(item.actualCount)) {
          regexp = true;
        }
        item.actualCount = Number(item.actualCount);
        if (item.skuId === 'null') {
          item.skuId = null;
        }
        if (item.warehouseItemNo === 'null') {
          item.warehouseItemNo = null;
        }
      });
      if (regexp) {
        return this.$message.error(regexps.positiveInteger.msg);
      }
      let request = this.computeIsOutbound
        ? inventoryMgrAPI.confirmOutbound(this.boundDetail)
        : inventoryMgrAPI.confirmInbound(this.boundDetail);
      request
        .then(result => {
          let bound = this.computeIsOutbound ? 'outbound' : 'inbound';
          this.$router.push({
            path: '/warehouse/inventory-mgr/' + bound
          });
        })
        .always(() => {
          this.loading = false;
        });
    },

    isOutbound() {
      return this.boundType !== 'in';
    },

    update_status(row, status) {
      let text = status === 20 ? '审核' : '拒绝审核';
      this.$confirm('确定该操作吗?', text, {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.loading = true;

          let request = this.computeIsOutbound
            ? inventoryMgrAPI.update_Outstatus({ outboundNo: row.outboundNo, status: status })
            : inventoryMgrAPI.update_status({ inboundNo: row.inboundNo, status: status });
          request
            .then(result => {
              this.getBoundDetail();
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(() => {});
    },

    confirmBound(row, status) {
      let boundText = this.computeIsOutbound ? '出库' : '入库';
      this.$confirm('确认所有商品都正常' + boundText + '？', '确认' + boundText, {
        confirmButtonText: '确定',
        cancelButtonText: '差异' + boundText,
        distinguishCancelAndClose: true,
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.loading = true;
          let request = this.computeIsOutbound
            ? inventoryMgrAPI.confirmOutbound({ outboundNo: row.outboundNo })
            : inventoryMgrAPI.confirmInbound({ inboundNo: row.inboundNo });
          request
            .then(result => {
              this.getBoundDetail();
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(action => {
          if (action === 'cancel') {
            let path = {
              path: '/warehouse/inventory-mgr/inbound/inbound-detail',
              query: { inboundNo: row.inboundNo, confirm: true }
            };
            if (this.computeIsOutbound) {
              path = {
                path: '/warehouse/inventory-mgr/outbound/outbound-detail',
                query: { outboundNo: row.outboundNo, confirm: true }
              };
            }
            this.$router.push(path);
          }
        });
    },

    getBoundDetail() {
      const params = {};
      this.isOutbound() ? (params.outboundNo = this.boundNo) : (params.inboundNo = this.boundNo);
      const request = this.isOutbound()
        ? inventoryMgrAPI.outboundDetail(params)
        : inventoryMgrAPI.inboundDetail(params);
      this.loading = true;
      request
        .then(result => {
          this.boundDetail = result.data || {};
          if (this.boundDetail.itemList && this.confirm) {
            this.boundDetail.itemList.forEach(item => {
              item.actualCount = Number(item.actualCount || item.count);
            });
          }
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>

<style lang="less">
  @header: 48px; //头部高度
  @scroll: 17px; //滚动条高度
  @footerHeight: 44px; //footer高度
  @titleHeight: 58px; //标题高度
.iobound-detail-container {
  background: #fff;
  min-height: calc(100vh - @header - @footerHeight - 69px);
  .detail-row {
    padding: 20px 20px 0;
  }

  .io-bound-detail-table {
    padding: 0 20px 20px;
  }
}
</style>
