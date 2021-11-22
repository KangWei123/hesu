<template>
  <el-form class="iobound-filter" inline label-position="right" label-width="97px">
    <span style="display: block;">
      <el-form-item label-width="90px" label="商品名称:">
        <el-input class="input" prefix-icon="el-icon-search" @blur="onFilter" v-model.trim="itemName" placeholder="商品名称"></el-input>
      </el-form-item>

      <el-form-item label-width="90px" label="经办人:">
        <el-input class="input" prefix-icon="el-icon-search" @blur="onFilter" v-model.trim="contactOrPhone" placeholder="手机号码或姓名"></el-input>
      </el-form-item>
      

      <el-form-item label-width="90px" label="条形码:">
        <el-input class="input" prefix-icon="el-icon-search" @blur="onFilter" v-model.trim="barcode" placeholder="商品条形码"></el-input>
      </el-form-item>

      <el-form-item label-width="90px" label="关联订单号:" v-if="boundType === boundEnum.OUT">
        <el-input
          class="input"
          @blur="onFilter"
          prefix-icon="el-icon-search"
          v-model.trim="orderNo"
          placeholder="关联订单号"
        ></el-input>
      </el-form-item>

      <el-form-item label-width="90px" label="出库单号:" v-if="boundType === boundEnum.OUT">
          <el-input
            class="input"
            @blur="onFilter"
            prefix-icon="el-icon-search"
            v-model.trim="inOutboundNo"
            placeholder="出库单号"
          ></el-input>
      </el-form-item>
    </span>
    

    <span style="display: block;">
      <!--仓库-->
      <el-form-item label-width="90px" label="仓库:">
        <el-select class="input" v-model="currentWarehouseId" filterable  placeholder="请选择" @change="onFilter">
          <i slot="prefix" class="el-input__icon el-icon-search"></i>
          <el-option class="dss-query-select-dropdown__item" :key="-1" label="全部仓库" :value="undefined"></el-option>
          <el-option v-for="item in warehouseList" :key="item.id" :label="item.name" :value="item.id"> </el-option>
        </el-select>
      </el-form-item>
      <!--出入库类型-->
      <el-form-item label-width="90px" :label="boundLabel + ':'" v-if="isInbound || isOutbound || isIObound">
        <el-select class="input" v-model="currentBoundType" @change="onFilter" >
          <el-option
            v-for="item in boundTypeList"
            :disabled="item.disabled"
            :value="item.value"
            :label="item.label"
            :key="item.value"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </span>

    <el-form-item label-width="90px" :label="timeTpye + ':'">
      <el-date-picker
        v-model="date"
        style="width:300px"
        type="daterange"
        :picker-options="pickerOptions"
        range-separator="至"
        start-placeholder="开始日期"
        end-placeholder="结束日期"
        @change="onFilter"
        align="left"
      >
      </el-date-picker>
      
    </el-form-item>
    <span class="filter-botton">
      <el-button type="primary" class="search-btn" @click="onFilter">搜索</el-button>
      <el-button plain class="reset-btn" @click="handleReset">重置</el-button>
    </span>
    
  </el-form>
</template>

<script>
import { mapState } from 'vuex';
import ioboundEnum from '@/dss-wechat3rd/src/constants/ioboundEnum.js';
import utils from '@/dss-common/utils/index.js';
import regexps from '@/dss-common/utils/regexps.js';

const boundEnum = {
  IN: 'in',
  OUT: 'out',
  IO: 'io'
};
export default {
  name: 'IoBoundFilter',
  props: {
    boundType: {
      type: String,
      default: 'in'
    },
    defaultItemName: {
      type: String,
      default: null
    }
  },
  data() {
    return {
      boundEnum,
      currentWarehouseId: null,
      currentBoundType: null,
      contactOrPhone: null,
      itemName: null,
      disableItemName: false,
      date: null,
      orderNo: null,
      inOutboundNo: null,
      barcode: null,
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
      }
    };
  },
  watch: {
    defaultItemName(newVal, oldVal) {
      this.barcode = newVal;
      this.disableItemName = !!newVal;
    }
  },
  computed: {
    ...mapState({
      warehouseList: 'warehouseList'
    }),
    timeTpye() {
      switch (this.boundType) {
        case boundEnum.IN:
          return '入库时间';
        case boundEnum.OUT:
          return '出库时间';
        default:
          return '出入库时间';
      }
    },
    /*不是入库都默认为出库*/
    isInbound() {
      return this.boundType === boundEnum.IN;
    },
    isOutbound() {
      return this.boundType === boundEnum.OUT;
    },
    isIObound() {
      return this.boundType === boundEnum.IO;
    },
    boundLabel() {
      switch (this.boundType) {
        case boundEnum.IN:
          return '入库类型';
        case boundEnum.OUT:
          return '出库类型';
        case boundEnum.IO:
          return '出入库类型';
        default:
          return '';
      }
    },
    boundTypeList() {
      const inboundTypeList = Object.keys(ioboundEnum.inboundType).map(key => {
        return ioboundEnum.inboundType[key];
      });
      const outboundTypeList = Object.keys(ioboundEnum.outboundType).map(key => {
        return ioboundEnum.outboundType[key];
      });
      const allItem = { value: null, label: '全部' };
      const inboundItem = { value: 'all-in', label: '入库', disabled: true };
      const outboundItem = { value: 'all-out', label: '出库', disabled: true };
      switch (this.boundType) {
        case boundEnum.IN:
          inboundTypeList.unshift(allItem);
          return inboundTypeList;
        case boundEnum.OUT:
          outboundTypeList.unshift(allItem);
          return outboundTypeList;
        case boundEnum.IO:
          return [allItem, inboundItem, ...inboundTypeList, outboundItem, ...outboundTypeList];
        default:
          return [];
      }
    }
  },
  methods: {
    onFilter() {
      const phoneReg = regexps.phone.reg;
      this.$emit('filter', {
        warehouseId: this.currentWarehouseId,
        type: this.currentBoundType,
        contact: phoneReg.test(this.contactOrPhone) ? null : this.contactOrPhone,
        phone: phoneReg.test(this.contactOrPhone) ? this.contactOrPhone : null,
        itemName: this.itemName ? this.itemName : null,
        startTime: this.date ? utils.timeFormat(this.date[0], 'YYYY-MM-DD') : null,
        endTime: this.date ? utils.timeFormat(this.date[1], 'YYYY-MM-DD') : null,
        barcode: this.barcode ? this.barcode : null,
        inOutboundNo: this.inOutboundNo ? this.inOutboundNo : null,
        orderNo: this.orderNo ? this.orderNo : null
      });
    },
    // 重置
    handleReset() {
      this.itemName = null;
      this.contactOrPhone = null;
      this.barcode = null;
      this.currentWarehouseId = null;
      this.currentBoundType = null;
      this.inOutboundNo = null;
      this.orderNo = null;
      this.date = [];
      this.onFilter();
    }
  }
};
</script>

<style lang="less">
.iobound-detail {
  .filter-botton {
    display: inline-block;
    position: relative;
    top: -4px;
  }
}

.warehouseSelect {
  .el-input__inner {
    padding-left: 30px !important;
  }
}

.iobound-filter {
  .input {
    width: 200px;
  }
}
</style>
