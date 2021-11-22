<template>
  <div class="inventory inventory-query">
    <div class="wkt-opt-label-container" style="padding: 16px 20px;">
      <el-form class="inventory-filter" inline label-position="right" label-width="97px">
        <el-form-item label-width="80px" label="商品名称:">
          <el-input
            type="input"
            v-model.trim="itemName"
            style="width: 200px;"
            placeholder="搜索商品名称"
            @change="reSearch"
            prefix-icon="el-icon-search"
            @keyup.enter.native="reSearch" />
        </el-form-item>

        <el-form-item label-width="80px" label="条形码:">
          <el-input v-model.trim="barcode"
                    style="width: 200px;"
                    @change="reSearch"
                    prefix-icon="el-icon-search"
                    @keyup.enter.native="reSearch"
                    placeholder="商品条形码"/>
        </el-form-item>

        <el-form-item label-width="80px" label="商品分类:">
          <goods-category-cascader
            v-model="categoryId"
            :withAll="true"
            :activeGoodsType="goodsTypeEnum.product"
            :resetSelecte="resetSelecte"
            @changeRestStatus="changeRestStatus" />
        </el-form-item>

        <el-form-item label-width="80px" label="仓库:">
          <el-select style="width: 200px;" v-model="warehouseId" filterable placeholder="请选择仓库" @change="reSearch">
            <i slot="prefix" class="el-input__icon el-icon-search"></i>
            <el-option class="dss-query-select-dropdown__item" :key="-1" label="全部仓库" :value="undefined"></el-option>

            <el-option
              class="dss-query-select-dropdown__item"
              v-for="(item, index) in warehouseList"
              :key="index"
              :label="item.name"
              :value="item.id"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label-width="80px" label="下单时间:">
          <el-date-picker v-model="date"
                          style="width:300px"
                          type="daterange"
                          :picker-options="pickerOptions"
                          @change="reSearch"
                          range-separator="至"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          align="left" />
        </el-form-item>

        <el-button style="margin-left: 18px;" plain @click="handleReset">重置</el-button>
      </el-form>   
    </div>
    
    <div class="wkt-card inventory-content inventory-content-query wkb-table-border" v-loading="loading" element-loading-spinner="el-icon-loading">
      <div class="export-box">
        <el-button class="rect-btn" :disabled="!isSure" @click="patchDerived">
          一键导出
        </el-button>
      </div>
      <el-row>
        <el-table :data="list" class="wkt-table">
          <el-table-column label="商品名称" min-width="300" fixed="left">
            <template slot-scope="scope">
              <div class="goods-desc-box">
                <div class="goods-img">
                  <i v-if="!scope.row.thumbnail" class="el-icon-question avatar-size" />
                  <img v-else :src="scope.row.thumbnail" />
                </div>
                <div class="goods-desc">
                  <div class="goods-name" :title="scope.row.itemAttribute">
                    {{ scope.row.itemName }}
                    <span class="">{{ !!scope.row.itemAttribute ? '（' + scope.row.itemAttribute + '）' : '' }}</span>
                  </div>
                  <div class="">{{ scope.row.barcode }}</div>
                </div>
              </div>
            </template>
          </el-table-column>
          <el-table-column label="单位" width="100" prop="itemUnit"> </el-table-column>
          <el-table-column label="实物库存" width="140" sortable prop="stock"> </el-table-column>
          <el-table-column label="占用库存" width="140" sortable prop="withholdStock"> </el-table-column>
          <el-table-column label="可用库存" width="140" sortable prop="usableStock"> </el-table-column>

          <el-table-column label="冻结库存" width="140" sortable prop="lockStock"> </el-table-column>

          <el-table-column label="所在仓库" width="150" sortable prop="warehouseName"> </el-table-column>

          <el-table-column label="批次" width="120" sortable prop="batchNo">
            <template slot-scope="scope">
              {{ scope.row.batchNo && scope.row.batchNo != -1000 ? scope.row.batchNo : 'N/A' }}
            </template>
          </el-table-column>

          <el-table-column label="质保期" width="120" sortable prop="expirationDate">
            <template slot-scope="scope">
              {{ scope.row.expirationDate | time('YYYY-MM-DD') }}
            </template>
          </el-table-column>

          <el-table-column label="操作" fixed="right" width="110">
            <template slot-scope="scope">
              <a class="dss-link" href="javascript:;" @click="toStockDetail(scope.row)">出入库明细</a>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <div class="block">
          <!-- <el-pagination
            layout="prev, pager, next, jumper, sizes, total"
            :total="totalCount"
            :page-size="pageParams.pageSize"
            :current-page="pageParams.pageNo"
            :page-sizes="[5, 10, 20, 30, 40, 50]"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            class="wkt-pagination"
          >
          </el-pagination> -->

          <el-pagination
            v-if="totalCount"
            :hide-on-single-page="true"
            @size-change="onSizeChange"
            @current-change="onPageChange"
            :page-size="pageParams.pageSize"
            layout="sizes, prev, pager, next"
            :total="totalCount">
          </el-pagination> 
        </div>
      </el-row>
    </div>

    <el-dialog title="温馨提示" :visible.sync="showTipDialog" width="500px">
      <span style="font-size:14px;">订单正在导出，请等候...</span>
    </el-dialog>


    <!-- 删除操作提示对话框 -->
    <dialog-tip 
      :dialogVisible="dialogVisible" 
      :tipTitle="tipTitle" 
      :tipContent="tipContent" 
      :iconClass="iconClass" 
      :iconColor="iconColor" />
  </div>
</template>

<script>
import wxItemApi from '@/dss-wechat3rd/src/api/wx-item.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
import GoodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
import './index.less';
import { mapState } from 'vuex';
import exportExcel from '@/dss-common/utils/exportExcel';
import inventoryMgrAPI from '@/dss-wechat3rd/src/api/retail/goodsMgr/inventoryMgrAPI.js';
import utils from '@/dss-common/utils/index.js';

import dialogTip from '@/dss-common/components/Dialog/index.vue';

export default {
  name: 'inventory-query',
  components: { GoodsCategoryCascader, dialogTip },
  data() {
    return {
      goodsTypeEnum,
      loading: false,
      isSure: true,
      showTipDialog: false,
      categoryId: '',
      itemName: '',
      barcode: '',
      warehouseId: null,
      list: [],
      totalCount: 0,
      pageParams: {
        pageSize: 10,
        pageNo: 1
      },
      date: null,
      pickerOptions: {
        shortcuts: [
          {
            text: '最近一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '最近三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      // 删除提示对话框
      dialogVisible: false,
      tipTitle: '',
      tipContent: '',
      iconClass: '',
      iconColor: '',
      keyWord: '',
      row: '',

      // 重置
      resetSelecte: false
    };
  },

  computed: {
    ...mapState({
      warehouseList: state => {
        return state.warehouseList;
      }
    })
  },

  watch: {
    categoryId(newVal) {
      this.reSearch();
      console.log('categoryId', newVal);
    }
  },

  mounted() {
    this.doSearch();
  },

  methods: {
    // 重置按钮
    handleReset() {
      this.categoryId = '';
      this.itemName = '';
      this.barcode = '';
      this.warehouseId = null;
      this.resetSelecte = true;
      this.date = [];
      this.reSearch();
    },
    changeRestStatus() {
      this.resetSelecte = false;
    },
    // 删除对话框确认操作
    // DialogSure() {
    //   this.dialogVisible = false;
    //   if (this.keyWord === 'export') {
    //     this.exportSure();
    //   }
    // },

    // // 删除对话框取消操作
    // DialogCancel() {
    //   this.dialogVisible = false;
    // },

    //跳出入库明细
    toStockDetail(item) {
      let param = {
        path: '/warehouse/inventory-mgr/iobound-detail',
        query: {
          barcode: item.barcode,
          itemNo: item.itemNo
        }
      };
      if (item.skuId) {
        param.query.skuId = item.skuId;
      }
      this.$router.push(param);
    },

    gatDay(params) {
      let startTime = new Date(params.startTime);
      let endTime = new Date(params.endTime);
      let time = endTime.getTime() - startTime.getTime();
      let day = parseInt(time / (1000 * 60 * 60 * 24));
      return day;
    },

    // 一键导出
    // patchDerived() {
    //   this.tipTitle = '一键导出';
    //   this.tipContent = '确定一键导出过滤后的数据吗？';
    //   this.iconClass = 'el-icon-warning';
    //   this.dialogVisible = true;
    //   this.iconColor = '#1890FF';
    //   this.keyWord = 'export';
    // },

    // exportSure() {
    //   let params = {
    //     type: goodsTypeEnum.product.value,
    //     categoryId: this.categoryId,
    //     itemName: this.itemName,
    //     barcode: this.barcode,
    //     warehouseId: this.warehouseId,
    //     startTime: this.date ? utils.timeFormat(this.date[0], 'YYYY-MM-DD') : null,
    //     endTime: this.date ? utils.timeFormat(this.date[1], 'YYYY-MM-DD') : null
    //   };
    //   let day = this.gatDay(params);
    //   if (!params.startTime || !params.endTime || day > 30) {
    //     return this.$message({
    //       message: '时间跨度不得超过31天',
    //       type: 'error'
    //     });
    //   }
    //   //post下载
    //   this.isSure = false;
    //   this.showTipDialog = true;
    //   exportExcel
    //     .getDownload(inventoryMgrAPI.stockExport, params)
    //     .then(res => {})
    //     .always(() => {
    //       this.isSure = true;
    //       this.showTipDialog = false;
    //     });
    // },

    // 一键导出
    patchDerived() {
      this.$confirm('确定一键导出过滤后的数据吗？ ', '一键导出', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          let params = {
            type: goodsTypeEnum.product.value,
            categoryId: this.categoryId,
            itemName: this.itemName,
            barcode: this.barcode,
            warehouseId: this.warehouseId,
            startTime: this.date ? utils.timeFormat(this.date[0], 'YYYY-MM-DD') : null,
            endTime: this.date ? utils.timeFormat(this.date[1], 'YYYY-MM-DD') : null
          };
          let day = this.gatDay(params);
          if (!params.startTime || !params.endTime || day > 30) {
            return this.$message({
              message: '时间跨度不得超过31天',
              type: 'error'
            });
          }
          //post下载
          this.isSure = false;
          this.showTipDialog = true;
          exportExcel
            .getDownload(inventoryMgrAPI.stockExport, params)
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

    // 每页条数变化
    onSizeChange(size) {
      this.pageParams.pageSize = size;
      this.pageParams.pageNo = 1;
      this.doSearch(this.keyword);
    },

    // 翻页
    onPageChange(page) {
      this.pageParams.pageNo = page;
      this.doSearch(this.keyword);
    },

    reSearch() {
      this.pageParams.pageNo = 1;
      this.doSearch();
    },

    doSearch: function() {
      const param = {
        pageNo: this.pageParams.pageNo,
        pageSize: this.pageParams.pageSize,
        type: goodsTypeEnum.product.value,
        warehouseId: this.warehouseId,
        barcode: this.barcode,
        startTime: this.date ? utils.timeFormat(this.date[0], 'YYYY-MM-DD') : null,
        endTime: this.date ? utils.timeFormat(this.date[1], 'YYYY-MM-DD') : null
      };
      this.itemName && (param.itemName = this.itemName);
      this.categoryId && (param.categoryId = this.categoryId);

      this.loading = true;
      wxItemApi
        .stockList(param)
        .then(rs => {
          this.list = rs.data || [];
          this.totalCount = rs.totalCount;
        })
        .always(() => {
          this.loading = false;
        });
    }
  }
};
</script>
