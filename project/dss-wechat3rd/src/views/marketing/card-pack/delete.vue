<template>
  <div class="courtesy marketing-page marketing-page-delete">
    <div class="courtesy-filter">
      <el-form @submit.native.prevent inline :model="keyword" ref="keyword">
        <el-form-item label="卡包名称：" prop="name">
          <el-input
            style="width:220px"
            placeholder="请输入卡包名称"
            v-model.trim="keyword.name"
            @change="handleSearch"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="卡包渠道：" prop="channel">
          <el-select clearable v-model="keyword.channel" placeholder="全部渠道" @change="handleSearch">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动门店">
          <store-select ref="stroeSelect" :select-stores.sync="selectStores" :show-dept="isEnterpriseManager" :show-store="!isEnterpriseManager" class="store-select" @change="handleSearch" />
        </el-form-item>
        <el-button plain style="margin-top: 2px;" @click="handleReset">重置</el-button>
      </el-form>
    </div>

    <div class="courtesy-list element-tags">
      <el-table :data="tableData" style="width: 100%" class="wkt-table" v-loading="loading">
        <el-table-column align="center" prop="name" label="卡包名称" :show-overflow-tooltip="true" />

        <el-table-column align="center" label="卡包渠道">
          <template slot-scope="scope">
            {{scope.row.channel === CHANNEL.PROMOTION.value?  CHANNEL.PROMOTION.label : CHANNEL.REGION.label}}
          </template>
        </el-table-column>

        <el-table-column align="center" label="售价">
          <template slot-scope="scope">
            ￥{{ scope.row.salePrice | price }}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="`${label}总库存`">
          <template slot-scope="scope">
            {{ scope.row.provNum || '不限购' }}
          </template>
        </el-table-column>

        <el-table-column align="center" :label="`${label}已售出`">
          <template slot-scope="scope">
            {{ scope.row.cardSalesVolume || 0 }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="创建人" prop="createUserName">
        </el-table-column>

        <el-table-column align="center" label="删除人" prop="updateName" />

        <el-table-column align="center" show-overflow-tooltip label="活动门店">
          <template slot-scope="scope">
            {{ scope.row.storeNames | storeNames }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="90px">
          <template>
            <div class="goods-shlef">
              <span class="table-delete">已删除</span>
            </div>
          </template>
        </el-table-column>
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
  </div>
</template>

<script>
import { mapState } from 'vuex';
import cardPackApi from '@/dss-wechat3rd/src/api/cardPack';
import { CHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

export default {
  components: { StoreSelect },
  data() {
    return {
      keyword: {
        name: '',
        channel: null
      },
      channelOptions: [
        {
          value: null,
          label: '全部渠道'
        },
        ...Object.values(CHANNEL)
      ],
      tableData: [],
      CHANNEL,
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      loading: false,
      selectStores: []
    };
  },

  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  mounted() {
    this.getList();
  },

  filters: {
    storeNames(val) {
      if (!val || !val.length) {
        return '全部门店';
      }
      return val
        .map(v => {
          return v.name;
        })
        .join(' ');
    }
  },

  computed: {
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    },

    label() {
      return this.isEnterpriseManager ? '' : '门店';
    }
  },

  methods: {
    getList() {
      if (this.loading) {
        return false;
      }

      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        name: this.keyword.name,
        channel: this.keyword.channel,
        'statusList[0]': 4,
        storeIds: (this.selectStores || []).join()
      };

      this.loading = true;
      return cardPackApi
        .list(params)
        .then(res => {
          this.tableData = res.data || [];
          this.totalCount = res.totalCount || 0;
        })
        .always(() => {
          this.loading = false;
        });
    },

    reLoad() {
      this.page.pageNo = 1;
      this.getList();
    },

    handleSearch() {
      this.reLoad();
    },

    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getList();
    },

    onPageChange(page) {
      this.page.pageNo = page;
      this.getList();
    },
    handleReset() {
      this.$refs.keyword.resetFields();
      this.selectStores = [];
      this.page.pageNo = 1;
      this.$refs.stroeSelect.handleClear();
      this.handleSearch();
    }
  }
};
</script>

<style lang="less">
.marketing-page-delete {
  padding: 0px;
  .courtesy-filter {
    .bg-mixin;
    padding: 6px 20px 0px;
    border-radius: 0px 0px 4px 4px;
    .wkt-opt-label-container {
      .serach-mixin;
    }
  }
  .courtesy-list {
    padding-bottom: 20px;
    margin-top: 16px;
    border-radius: 4px;
    .el-table {
      padding-top: 0px;
      border-radius: 4px 4px 0px 0px;
    }
    .status-unshelf {
      color: @ui-font-color-darkGrey;
      background: #fff;
      border: none;
      padding: 0px;
    }
  }
}
</style>