<template>
  <div v-loading="loading" class="inventory iobound-detail">
    <io-bound-filter
      bound-type="io"
      :default-item-name="defaultItemName"
      class="wkt-opt-label-container"
      @filter="handleFilter"
    />

    <div class="wkt-card inventory-content">
      <div class="export-box">
        <el-button class="rect-btn" :disabled="!isSure" @click="patchDerived"> 一键导出 </el-button>
      </div>
      <el-row>
        <el-table :data="ioboundList" class="wkt-table">
          <el-table-column label="商品名称" min-width="300px" fixed="left">
            <template slot-scope="scope">
              <div class="goods-info">
                <img :src="scope.row.thumbnail" />
                <div style="display: inline-block; vertical-align: middle">
                  <div class="goods-desc">
                    {{ scope.row.itemName }}
                    <span v-if="scope.row.itemAttribute">({{ scope.row.itemAttribute }})</span>
                  </div>
                  <div class="goods-desc">{{ scope.row.barcode }}</div>
                </div>
              </div>
            </template>
          </el-table-column>

          <el-table-column label="单位" prop="itemUnit" width="80"> </el-table-column>

          <el-table-column label="仓库" width="160" prop="warehouseName"> </el-table-column>

          <el-table-column label="出入库类型" width="120" prop="typeDesc"> </el-table-column>

          <el-table-column label="创建时间" width="130" prop="createTime">
            <template slot-scope="scope">
              {{ scope.row.createTime | time }}
            </template>
          </el-table-column>

          <el-table-column label="数量" width="100" prop="actualCount">
            <span slot-scope="scope" :class="scope.row.type >= 20 ? 'out-span' : 'in-span'">
              {{ scope.row.type >= 20 ? '-' : '+' }}{{ scope.row.actualCount }}
            </span>
          </el-table-column>

          <el-table-column label="单号" width="205" prop="orderNo"> </el-table-column>

          <el-table-column label="关联单号" width="205" prop="relocateNo">
            <template slot-scope="scope">
              <span> {{ scope.row.relocateNo === 'null' ? '' : scope.row.relocateNo }}</span>
            </template>
          </el-table-column>

          <el-table-column label="经办人" width="150">
            <template slot-scope="scope">
              <div>{{ scope.row.contact ? scope.row.contact : '' }}</div>
              <div>{{ scope.row.phone ? scope.row.phone : '' }}</div>
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-row>
        <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                       :total="totalCount"
                       :page-size="pageParams.pageSize"
                       :current-page="pageParams.pageNo"
                       :page-sizes="[5, 10, 20, 30, 40, 50]"
                       @size-change="onSizeChange"
                       @current-change="onPageChange"
                       class="wkt-pagination">
        </el-pagination> -->

        <el-pagination
          v-if="totalCount"
          :hide-on-single-page="true"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          :page-size="pageParams.pageSize"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          layout="sizes, prev, pager, next"
          :total="totalCount"
        >
        </el-pagination>
      </el-row>
    </div>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size: 14px">订单正在导出，请等候...</span>
    </el-dialog>
  </div>
</template>

<script>
  import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
  import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
  import utils from '@/dss-common/utils/index.js';
  import IoBoundFilter from '../IoBoundFilter.vue';
  import exportExcel from '@/dss-common/utils/exportExcel';
  /* 出入库明细 */
  export default {
    name: 'InOutboundDetail',
    components: {
      IoBoundFilter,
    },
    data() {
      return {
        loading: false,
        ioboundList: [],
        totalCount: 0,
        pageParams: {
          pageSize: 10,
          pageNo: 1,
        },
        isSure: true,
        showTipDialog: false,
        defaultItemName: null,
        defaultSkuInfo: null,
        filterParams: {},
      };
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.handleListIoboundList(); // 获取出入库明细
      });
    },

    mounted() {
      const barcode = this.$route.query.barcode;
      const itemNo = this.$route.query.itemNo;
      this.defaultItemName = barcode;
      if (barcode) {
        Object.assign(this.filterParams, { barcode: barcode });
      }

      const skuId = this.$route.query.skuId;
      if (skuId) {
        Object.assign(this.filterParams, { skuId });
      }

      this.handleListIoboundList();
    },

    methods: {
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.handleListIoboundList(this.keyword);
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.handleListIoboundList(this.keyword);
      },
      handleFilter(filterParams) {
        this.filterParams = { ...this.filterParams, ...filterParams };
        this.pageParams.pageNo = 1;
        this.handleListIoboundList();
      },

      gatDay(params) {
        const startTime = new Date(params.startTime);
        const endTime = new Date(params.endTime);
        const time = endTime.getTime() - startTime.getTime();
        const day = parseInt(time / (1000 * 60 * 60 * 24));
        return day;
      },

      patchDerived() {
        this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            const params = this.filterParams;
            const day = this.gatDay(params);
            if (!params.startTime || !params.endTime || day > 30) {
              return this.$message({
                message: '时间跨度不得超过31天',
                type: 'error',
              });
            }

            // post下载
            this.isSure = false;
            this.showTipDialog = true;
            exportExcel
              .getDownload(inventoryMgrAPI.itemExport, params)
              .then(res => {})
              .always(() => {
                this.isSure = true;
                this.showTipDialog = false;
              });
          })
          .catch(() => {
            console.log('取消一键导出');
          });
      },

      handleListIoboundList() {
        this.loading = true;
        const params = {
          pageNo: this.pageParams.pageNo,
          pageSize: this.pageParams.pageSize,
          ...this.filterParams,
        };
        inventoryMgrAPI
          .ioboundDetail(params)
          .then(rs => {
            this.ioboundList = rs.data || [];
            this.totalCount = rs.totalCount;
          })
          .always(() => {
            this.loading = false;
          });
      },
      parseIoboundList() {
        this.ioboundList.forEach(iobound => {
          const inboundTypeKeys = Object.keys(ioboundEnum.inboundType);
          const outboundTypeKeys = Object.keys(ioboundEnum.outboundType);
          const ioTypeKeys = [...inboundTypeKeys, ...outboundTypeKeys];
          const len = ioTypeKeys.length;
          for (let index = 0; index < len; index++) {
            const key = ioTypeKeys[index];
            if (ioboundEnum.inboundType[key].value === iobound.type) {
              iobound.typeDesc = ioboundEnum.inboundType[key].label;
              break;
            } else if (ioboundEnum.outboundType[key].value === iobound.type) {
              iobound.typeDesc = ioboundEnum.inboundType[key].label;
            }
          }
          iobound.createTime = utils.timeFormat(new Date(iobound.createTime), 'YYYY-MM-DD HH:mm:ss');
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .iobound-detail {
    .inventory-content {
      padding: 20px 0 20px;
      margin-top: 16px;
    }

    .export-box {
      margin-left: 20px;
      margin-bottom: 16px;
      // margin-top: 20px;
    }

    .el-table {
      padding-top: 0;
    }

    .goods-info {
      display: inline-block;

      img {
        width: 65px;
        height: 65px;
        display: inline-block;
        vertical-align: middle;
        margin-right: 12px;
      }
    }
  }

  .wkt-opt-label-container {
    padding-top: 16px;
  }

  .in-span {
    color: rgba(0, 153, 0, 0.8);
  }

  .out-span {
    color: rgba(255, 0, 0, 0.8);
  }

  .gray {
    color: @light-black-color;
  }
</style>
