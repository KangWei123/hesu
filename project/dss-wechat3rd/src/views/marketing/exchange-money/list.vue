<template>
  <list-page-layout class="app-list-container">
    <template #main-actions>
      <el-button type="primary" @click="handleAdd">+新建规则</el-button>
    </template>

    <template #filters>
      <el-form ref="query" class="nav-form" @submit.prevent.native="$refs.table.search()" :model="form" inline>
        <el-form-item label="核销项目" prop="storeIdList">
          <el-select v-model="form.storeIdList" class="w250" filterable multiple>
            <el-option v-for="(item, index) in storeList" :key="index" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item prop="status" label="状态搜索">
          <el-select v-model="form.status" class="w250" placeholder="全部">
            <el-option label="全部" :value="null"></el-option>
            <el-option
              v-for="(item, index) in statusList"
              :key="index"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </el-form-item>

        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>

    <fat-table ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="参与项目" prop="storeName">
        <template slot-scope="scope">
          <div>{{ scope.row.storeName || '--' }}</div>
        </template>
      </el-table-column>
      <el-table-column label="比例（积分:金额）">
        <template slot-scope="scope">
          <div>{{ scope.row.proportion }}:1</div>
        </template>
      </el-table-column>
      <el-table-column label="最低兑换积分" prop="miniScore"></el-table-column>
      <el-table-column label="状态" prop="unboundTime">
        <template slot-scope="scope">
          <el-switch
            v-model="scope.row.status"
            active-color="#4379ed"
            inactive-color="rgba(0, 0, 0, 0.25)"
            :active-value="1"
            :inactive-value="0"
            @change="onStatusChange($event, scope.row)"
          >
          </el-switch>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" v-slot="scope">
        <table-actions
          :options="[
            { name: '编辑', onClick: () => handleEdit(scope.row) },
            { name: '兑钱记录', onClick: () => handleRecord(scope.row) },
          ]"
        />
      </el-table-column>
    </fat-table>
  </list-page-layout>
</template>

<script>
  import exchangeApi from '@/dss-wechat3rd/src/api/exchange-money.js';
  import { FatTable, ListPageLayout, TableActions } from '@/dss-common/components/list-page/index';
  import { mapState } from 'vuex';

  export default {
    name: 'ExchangeMoney',
    components: { FatTable, ListPageLayout, TableActions },
    data() {
      return {
        orderStatusList: [],
        form: {
          storeIdList: [],
          status: null,
        },
        statusList: [
          {
            label: '关闭',
            value: 0,
          },
          {
            label: '开启',
            value: 1,
          },
        ],
      };
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        storeList: state => state.storeList.filter(i => !!i.id),
      }),
    },

    mounted() {},

    methods: {
      handleAdd() {
        this.$router.push({ path: '/marketing/exchange-money/detail' });
      },

      onStatusChange(v, row) {
        const params = {
          id: row.id,
          status: v,
        };
        exchangeApi
          .update(params)
          .then(res => {
            this.$message.success('操作成功');
          })
          .catch(err => {
            console.error(err);
            this.$refs.table.search();
          });
      },

      async handleFetch(data) {
        const { pagination } = data;
        const params = {
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
          ...this.form,
        };
        const { data: list, totalCount: total } = await exchangeApi.queryList(params);
        return { list: list || [], total };
      },

      handleEdit(row) {
        this.$router.push({ path: '/marketing/exchange-money/detail', query: { id: row.id } });
      },

      handleRecord(row) {
        this.$router.push({ path: '/marketing/exchange-money/record', query: { storeId: row.storeId } });
      },
    },
  };
</script>

<style lang="less" scoped>
  .export-btn {
    margin: 20px 20px 0 20px;
  }

  .w250 {
    width: 250px;

    /deep/.el-select__input {
      margin-left: 11px;
    }
  }

  .default {
    display: inline-block;
    border: 1px solid #fa7516;
    color: #fa7516;
    width: 40px;
    text-align: center;
    line-height: 22px;
    border-radius: 4px;
    margin-right: 5px;
  }
</style>
