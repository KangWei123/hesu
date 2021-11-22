<template>
  <list-page-layout>
    <template #filters>
      <el-form ref="query" inline :model="query" @submit.prevent.native="handleSearch">
        <el-form-item label="手机号" prop="mobile">
          <el-input v-model="query.mobile" placeholder="请输入" clearable />
        </el-form-item>

        <el-form-item label="客户来源" prop="sourceType">
          <el-select v-model="query.sourceType" clearable>
            <el-option label="全部" value=""></el-option>
            <el-option
              v-for="item of sources"
              :key="item.sourceType"
              :label="item.sourceTypeName"
              :value="item.sourceType"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="注册时间">
          <el-date-picker
            v-model="query.dateRange"
            type="daterange"
            value-format="yyyy-MM-dd HH:mm:ss"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            :default-time="['00:00:00', '23:59:59']"
          >
          </el-date-picker>
        </el-form-item>

        <el-form-item>
          <el-button @click="reset()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <fat-table ref="table" :state.sync="query" :fetch-handler="fetchHandler">
      <el-table-column align="center" prop="idx" label="序号" width="100"></el-table-column>
      <el-table-column align="left" prop="phone" label="客户信息" v-slot="scope">
        <div class="user-info__header">
          <div class="user-info__avatar">
            <img :src="scope.row.avatarUrl" />
          </div>
          <div class="user-info__base">
            <div class="user-info__name">{{ scope.row.realName }}</div>
            <div class="user-info__phone">{{ scope.row.mobile }}</div>
          </div>
        </div>
      </el-table-column>

      <el-table-column align="center" prop="nickName" label="微信昵称" v-slot="scope"
        >{{ scope.row.nickName ? scope.row.nickName : '-' }}
      </el-table-column>
      <el-table-column label="客户来源" prop="sourceTypeName"></el-table-column>
      <el-table-column label="注册时间" prop="createTime"></el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import { FatTable, ListPageLayout } from '@/dss-common/components/list-page/index';
  import { elderApi, customerApi } from '@/mod-kangyang/src/api';
  import { addIdxToListItem } from '@/mod-kangyang/src/utils';

  export default {
    name: 'Customers',
    components: {
      FatTable,
      ListPageLayout,
    },
    data() {
      return {
        query: {
          mobile: undefined,
          sourceType: undefined,
          startTime: undefined,
          endTime: undefined,
          dateRange: [],
        },
        sources: [],
      };
    },
    watch: {
      'query.dateRange': function (range) {
        if (!range) {
          this.query.startTime = null;
          this.query.endTime = null;
          return;
        }
        const [startTime, endTime] = range;
        if (startTime) {
          this.query.startTime = startTime;
        }
        if (endTime) {
          this.query.endTime = endTime;
        }
      },
    },
    mounted() {
      this.getSources();
    },
    methods: {
      handleSearch() {
        this.$refs.table.search();
      },
      reset() {
        this.$refs.query.resetFields();
        this.query.dateRange = '';
      },
      async fetchHandler(params) {
        const { currentPage: pageNo, pageSize } = params.pagination;
        const { sourceType, dateRange, ...rest } = this.query;
        const payload = {
          ...rest,
          pageNo,
          pageSize,
        };

        if (sourceType) {
          payload.sourceType = sourceType;
        }

        const { data, totalCount } = await customerApi.getList(payload);

        return {
          list: addIdxToListItem(data, pageNo, pageSize),
          total: totalCount,
        };
      },
      async getSources() {
        const { data } = await elderApi.getSources();
        this.sources = data;
      },
    },
  };
</script>

<style lang="less" scoped>
  .user-info {
    &__header {
      display: flex;
      justify-content: flex-start;
      align-items: center;
    }

    &__base {
      text-align: left;
    }

    &__avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      overflow: hidden;
      margin: 0 1em;

      img {
        width: 100%;
        object-fit: contain;
      }
    }
  }
</style>
