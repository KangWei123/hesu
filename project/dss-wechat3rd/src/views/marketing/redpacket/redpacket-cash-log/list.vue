<template>
  <div class="redpacket-cash-log-list">
    <el-table
      :data="tableData"
      ref="multipleTable"
      style="width: 100%"
      class="wkt-table"
      v-loading="listLoading"
    >
      <el-table-column prop="serialNumber" label="流水号" />
      <el-table-column label="会员名称">
        <template slot-scope="scope">
          <!-- <img src="https://cdn.wakecloud.com/resources/dss-web-portal/img/redpacket-bg9425cdb.png" alt="face" class="redpacket-face"> -->
          {{ scope.row.memberName }}
        </template>
      </el-table-column>
      <el-table-column prop="phone" label="电话" />
      <el-table-column prop="createTime" label="提现时间" />
      <el-table-column label="提现金额">
        <template slot-scope="scope">
          {{ scope.row.cashAmount | price }}
        </template>
      </el-table-column>
      <el-table-column prop="executeStatus" label="提现状态" />
    </el-table>
    <!-- <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    ></el-pagination> -->

    <el-pagination
      v-if="totalCount"
      :hide-on-single-page="true"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      :page-size="page.pageSize"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      layout="sizes, prev, pager, next"
      :total="totalCount">
    </el-pagination>
  </div>
</template>

<script>
import './record-list.less';
import redpacketApi from '@/dss-wechat3rd/src/api/redpacketApi.js';
import utilData from '@/dss-common/utils/date.js';

const options = {
  0: '提现中',
  1: '提现成功',
  2: '提现失败'
};
export default {
  props: {
    params: {
      type: Object
    }
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNo: 1
      },
      tableData: [], // 列表
      totalCount: 0,
      listLoading: false
    };
  },
  filters: {},
  watch: {
    params: {
      deep: true,
      handler(newVal, oldVal) {
        this.page.pageNo = 1;
        this.doSearch();
      }
    }
  },
  mounted() {
    this.doSearch();
  },

  methods: {
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.doSearch();
    },

    onPageChange(page) {
      this.page.pageNo = page;
      this.doSearch();
    },

    doSearch() {
      this.listLoading = true;
      const params = { ...this.page, ...this.params };

      params.executeStatusList.forEach((element, i) => {
        params[`executeStatusList[${i}]`] = element;
      });
      delete params.executeStatusList;

      redpacketApi
        .cashStatementList({ ...params })
        .then(rs => {
          // 根据userid从users中获取发起人信息，时间转换
          this.tableData = (rs.data || []).map(info => {
            if (info.createTime) {
              info.createTime = utilData.format(new Date(info.createTime));
            }
            info.executeStatus = options[info.executeStatus];
            return info;
          });
          this.totalCount = rs.totalCount;
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.listLoading = false;
        });
    }
  }
};
</script>

<style lang="less">
.redpacket-cash-log-list {
  /* padding: 20px 0; */
  background: white;
  .table-mixin;
  /* border-radius: 4px; */
}
.redpacket-face {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  vertical-align: middle;
  margin-right: 5px;
}
</style>
