<template>
  <div>
    <el-form inline label-position="right" label-width="80px">
      <el-form-item label="号码搜索:">
        <el-input prefix-icon="el-icon-search"
                  class="verification-search"
                  v-model.trim="operator"
                  @blur="onSearch"
                  placeholder="经办人手机号码"></el-input>
      </el-form-item>

      <el-form-item label="单号搜索:">
        <el-input prefix-icon="el-icon-search"
                  class="verification-search"
                  v-model.trim="verificationNo"
                  @blur="onSearch"
                  placeholder="制单号"></el-input>
      </el-form-item>

      <span style="display: block;">
        <el-form-item label="仓库:">
          <el-select  v-model="warehouseId"
                      class="verification-search"
                      placeholder="请选择仓库"
                      filterable
                      @change="onSearch">
            <i slot="prefix"
              class="el-input__icon el-icon-search"></i>
            <el-option class="dss-query-select-dropdown__item"
                      :key="-1"
                      label="全部仓库"
                      :value="undefined"></el-option>

            <el-option class="dss-query-select-dropdown__item"
                      v-for="(item, index) in warehouseList"
                      :key="index"
                      :label="item.name"
                      :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="制单时间:">
          <el-date-picker class="dss-filter-input"
                          v-model="dateRange"
                          type="daterange"
                          range-separator="至"
                          @change="onQueryTimeChange"
                          start-placeholder="开始日期"
                          end-placeholder="结束日期"
                          :picker-options="pickerOptions">
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button class="search-btn"
                    type="primary"
                    @click="onSearch">搜索
          </el-button>
          <el-button style="margin-left: 17px" plain @click="handleReset">重置</el-button>
        </el-form-item>

        
      </span>
    </el-form>
  </div>
</template>

<script>
import utils from '@/dss-common/utils';
import { mapState } from 'vuex';

export default {
  name: 'verificationFilter',

  data() {
    return {
      dateRange: null,
      operator: null,
      verificationNo: null,
      warehouseId: undefined,
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              picker.$emit('pick', [start, end]);
            }
          },
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
          }
        ]
      }
    };
  },

  watch: {
    verificationNo(newVal, oldVal) {
      // this.onFilter();
    },

    operator(newVal, oldVal) {
      // this.onFilter();
    }
  },

  computed: {
    ...mapState({
      warehouseList: state => {
        return state.warehouseList;
      }
    })
  },

  methods: {
    onQueryTimeChange(date) {
      this.dateRange = date;
      this.onFilter();
    },

    onSearch() {
      this.onFilter();
    },

    onFilter() {
      let filterParams = {};
      if (this.dateRange) {
        filterParams.startTime = utils.timeFormat(this.dateRange[0], 'YYYY-MM-DD');
        filterParams.endTime = utils.timeFormat(this.dateRange[1], 'YYYY-MM-DD');
      }
      if (this.verificationNo) {
        filterParams.invoiceNo = this.verificationNo;
      }
      if (this.operator) {
        filterParams.operator = this.operator;
      }
      filterParams.warehouseId = this.warehouseId;
      this.$emit('filter', filterParams);
    },
    handleReset() {
      this.dateRange = [];
      this.operator = null;
      this.verificationNo = null;
      this.warehouseId = null;
      this.onFilter();
    }
  }
};
</script>

<style lang="less" scoped>
.verification-search {
  width: 200px;
}
</style>
