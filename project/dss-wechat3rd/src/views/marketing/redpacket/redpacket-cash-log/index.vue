<template>
  <div class="redpacke-list" v-loading="isLoading">
    <div class="wkt-opt-label-container">
      <el-form inline :model="form" ref="form">
        <el-form-item label="会员名字：" prop="memberName">
          <el-input
            @input="onFilter"
            class="order-search"
            style="width: 200px;"
            v-model.trim="form.memberName"
            placeholder="请输入会员名字"
          ></el-input>
        </el-form-item>

         <el-form-item label="提现状态：" prop="executeStatusList">
          <el-select @change="onFilter" collapse-tags v-model="form.executeStatusList" multiple placeholder="请选择提现状态">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"> </el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="提现时间：" prop="dateRange">
          <el-date-picker
            class="dss-filter-input"
            v-model="form.dateRange"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :picker-options="pickerOptions"
            @change="onFilter"
          >
          </el-date-picker>
        </el-form-item>

          <el-button class="search-btn" @click="handleReset">重置</el-button>
      </el-form>
    </div>
    <div class="redpacke-list-card">
      <list :params="queryParam" />
    </div>
  </div>
</template>

<script>
import list from './list.vue';
import utils from '@/dss-common/utils';
export default {
  name: 'redpacketplan',
  components: { list },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: '今天',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              //start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
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
      },
      itemName: null,
      isLoading: false,
      form: {
        dateRange: null,
        channel: 1,
        executeStatusList: [],
        memberName: null
      },
      options: [
        {
          value: 0,
          label: '提现中'
        },
        {
          value: 1,
          label: '提现成功'
        },
        {
          value: 2,
          label: '提现失败'
        }
      ],

      queryParam: {
        executeStatusList: []
      }
    };
  },
  methods: {
    onFilter() {
      let filterParams = { executeStatusList: [] };
      // 下单时间
      if (this.form.dateRange) {
        filterParams.startTime = utils.timeFormat(this.form.dateRange[0], 'YYYY-MM-DD');
        filterParams.endTime = utils.timeFormat(this.form.dateRange[1], 'YYYY-MM-DD');
      }
      // 会员名称
      if (this.form.memberName) {
        filterParams.memberName = this.form.memberName;
      }
      // 提现状态
      if (this.form.executeStatusList) {
        this.form.executeStatusList.forEach((item, index) => {
          filterParams.executeStatusList.push(item);
        });
      }
      this.queryParam = filterParams;
      console.log('this.queryParam', this.queryParam);
    },
    handleReset() {
      this.$refs.form.resetFields();
      this.onFilter();
    }
  }
};
</script>
<style lang="less" scoped>
.redpacke-list {
  .wkt-opt-label-container {
    padding-left: 20px;
  }
  .redpacke-list-card {
    margin-top: 16px;
    .redpacket-cash-log-list {
      padding: 0px;
    }
  }
}
</style>
