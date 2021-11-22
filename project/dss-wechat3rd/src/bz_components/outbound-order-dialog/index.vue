<template>

  <table-select-dialog v-model="isShowDialog"
                       :enable-multiple="enableMultiple"
                       :columns="columns"
                       :api-url="apiUrl"
                       :query-params="queryParams"
                       @choose="onOutboundOrderChoosed"
                       :columns-handler="columnsHandler">

    <el-row slot="filter"
            class="outbound-order-filter">
      <el-col :span="4"
              class="filter-col">
        <span class="title">选择调拨出货单</span>
      </el-col>

      <el-col :span="9">
        <span>出库仓库：</span>
        <el-select v-model="queryParams.warehouseId"
                   filterable
                   size="mini"
                   class="warehouseSelect"
                   placeholder="请选择"
                   @change="onFilter">
          <i slot="prefix"
             class="el-input__icon el-icon-search"></i>
          <el-option v-for="item in allWarehouseList"
                     :value="item.id"
                     :key="item.id"
                     :label="item.name">
          </el-option>
        </el-select>
      </el-col>

      <el-col :span="9"
              class="order">
        <span>出库单号：</span>
        <el-input placeholder="搜索出库单号"
                  class="input-outbound"
                  v-model="queryParams.inOutboundNo"
                  @change="onFilter">
          <i class="el-icon-search el-input__icon"
             slot="suffix"
             @click="onFilter"
             style="cursor: pointer"></i>
        </el-input>
      </el-col>
    </el-row>

  </table-select-dialog>

</template>

<script>
import { mapState } from 'vuex';
import TableSelectDialog from '@/dss-wechat3rd/src/components/table-select-dialog/index.vue';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
import Handler from '@/dss-wechat3rd/src/components/table-select-dialog/handler.js';
import ChooseBtn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/chooseBtn.vue';
import TimeColumn from '@/dss-wechat3rd/src/components/table-select-dialog/common-component/timeColumn.vue';
import './index.less';

/**
 * 出库单选择组件
 * example:
 * <outbound-order-dialog :show-dialog="showProductDialog"
 *                        :outbound-type="21"//出库单类型,参考project/dss-wechat3rd/src/constants/ioboundEnum.js
 *                        @choosed="onOutboundOrderSelected"//选中后的回调
 >
 </outbound-order-dialog>
 */
const columns = [
  {
    width: 20,
    propsHandler: Handler.propsHandler
  },

  {
    label: '出库单号',
    prop: 'outboundNo',
    width: '205',
    propsHandler: Handler.propsHandler
  },

  {
    label: '出库仓库',
    prop: 'warehouseName',
    align: 'center',
    propsHandler: Handler.propsHandler
  },

  {
    label: '入库仓库',
    prop: 'toWarehouseName',
    propsHandler: Handler.propsHandler
  },

  {
    label: '出库时间',
    width: '200',
    prop: 'outboundTime',
    component: TimeColumn
  },

  {
    width: 40,
    propsHandler: Handler.propsHandler
  }
];

export default {
  name: 'OutboundOrderDiolog',

  components: {
    TableSelectDialog
  },

  model: {
    prop: 'showDialog'
  },

  props: {
    showDialog: {
      type: Boolean,
      default: false
    },

    enableMultiple: {
      type: Boolean,
      default: false
    },

    outboundType: {
      type: Number,
      default: ioboundEnum.outboundType.RELOCATE_OUT.value
    }
  },

  data() {
    return {
      allWarehouseList: null,
      apiUrl: '/wp/outbound/list',
      queryParams: {
        //搜索出库单，过滤，只显示入库到当前门店的出库单
        queryForInbound: 1,
        warehouseId: null,
        orderNo: null,
        type: this.outboundType,
        status: 3 //状态 1为有效的出库单
      },
      columns
    };
  },

  computed: {
    ...mapState({
      warehouseList: 'warehouseList'
    }),

    isShowDialog: {
      get() {
        return this.showDialog;
      },

      set(val) {
        this.$emit('update:showDialog', val);
      }
    }
  },

  mounted() {
    this.allWarehouseList = [{ id: null, name: '全部出库仓库' }, ...this.warehouseList];
  },

  methods: {
    columnsHandler(cols) {
      if (this.enableMultiple) {
        return null;
      } else {
        let _this = this;
        return cols.concat({
          label: '操作',
          align: 'left',
          width: '108px',
          component: ChooseBtn,
          listeners: {
            'choose-item'(row) {
              _this.isShowDialog = false;
              _this.$emit('single-choosed', row);
            }
          }
        });
      }
    },

    onFilter(filter) {
      this.queryParams = {
        ...this.queryParams
      };
    },

    onOutboundOrderChoosed(selectedRows) {
      this.$emit('selected', selectedRows);
    }
  }
};
</script>
<style lang="less" scoped>
.warehouseSelect {
  .el-input__inner {
    padding-left: 30px !important;
  }
}
</style>

