<template>
  <div class="courtesy marketing-page">
    <div class="Add-Manage-Button">
        <el-button icon="el-icon-plus" @click="onAdd" type="primary" :disabled="!hasPermission()">新增卡包</el-button>
      </div>
    <div class="courtesy-filter">
      <el-form @submit.native.prevent inline :model="keyword" ref="keyword">
        <el-form-item label="卡包名称：" prop="name">
          <el-input
            style="width:250px"
            placeholder="请输入卡包名称"
            v-model.trim="keyword.name"
            @change="handleSearch"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="状态：" prop="status">
          <el-select clearable v-model="keyword.status" placeholder="所有状态" @change="handleSearch">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="卡包渠道：" prop="channel">
          <el-select clearable v-model="keyword.channel" placeholder="全部渠道" @change="handleSearch">
            <el-option v-for="item in channelOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>

        <el-form-item label="活动门店">
          <store-select ref="stroeSelect" :select-stores.sync="selectStores" :show-dept="isEnterpriseManager" :show-store="!isEnterpriseManager" class="store-select" @change="handleSearch" />
        </el-form-item>

        <el-form-item>
          <el-button class="search-btn"
                     @click="handleReset">重置</el-button>
        </el-form-item>
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

        <el-table-column align="center" label="创建人" :show-overflow-tooltip="true">
          <template slot-scope="scope" v-if="scope.row.createUserName">
            {{ `${scope.row.createUserName}(${scope.row.createUserRoleName})` }}
          </template>
        </el-table-column>

        <el-table-column align="center" show-overflow-tooltip label="活动门店">
          <template slot-scope="scope">
            {{ scope.row.storeNames | storeNames }}
          </template>
        </el-table-column>

        <el-table-column align="center" label="状态" width="120">
          <template slot-scope="scope">
            <div class="goods-shlef" :class="scope.row.pocketStatus === STATUS.ONGOING.value ? 'status-shelf' : 'status-unshelf'">
              {{statusLabel[scope.row.pocketStatus]}}
            </div>
          </template>
        </el-table-column>

        <el-table-column align="center" prop="methods" label="操作" min-width="120" fixed="right">
          <div slot-scope="scope">
            <template v-if="scope.row.pocketStatus === STATUS.ONGOING.value">
              <a v-if="scope.row.isModifyPermitted" class="market-shelf" @click="onEnd(scope.row)">结束</a>
              <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-else
                  content="当前角色无法结束活动"
                >
                  <a href="javascript:;" slot="reference" class="popover-a">结束</a>
              </el-popover>
            </template>
            <a @click="onEdit(scope.row)">{{scope.row.pocketStatus != STATUS.FINISHED.value ? (scope.row.isModifyPermitted ? '修改' : '查看') : '查看'}}</a>
            <template v-if="scope.row.pocketStatus === STATUS.FINISHED.value">
              <a class="table-delete" @click="onDelete(scope.row)" v-if="scope.row.isModifyPermitted">删除</a>
              <el-popover
                  placement="top-start"
                  width="200"
                  trigger="hover"
                  v-else
                  content="当前角色无法删除活动"
                >
                  <a class="table-delete" href="javascript:;" slot="reference">删除</a>
              </el-popover>
            </template>
          </div>
        </el-table-column>
      </el-table>

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
import { STATUS, CHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

const { INITIAL, ONGOING, SELL_OUT, FINISHED, DELETED } = STATUS;

export default {
  components: { StoreSelect },
  data() {
    return {
      keyword: {
        status: null,
        name: '',
        channel: null
      },
      options: [
        {
          value: null,
          label: '所有状态'
        },
        { ...INITIAL },
        { ...ONGOING },
        { ...SELL_OUT },
        { ...FINISHED }
      ],
      channelOptions: [
        {
          value: null,
          label: '全部渠道'
        },
        ...Object.values(CHANNEL)
      ],
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      loading: false,
      STATUS,
      CHANNEL,
      statusLabel: [INITIAL.label, ONGOING.label, SELL_OUT.label, FINISHED.label, DELETED.label],
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

    /**
     * 是否区域管理员
     */
    isAreaManager() {
      return (
        !!this.roleList &&
        (this.roleList.indexOf('common_role_area_manager') !== -1 ||
          this.roleList.indexOf('common_role_dealer_manager') !== -1)
      );
    },

    hasPermission() {
      return createUserRoleName => {
        if (createUserRoleName === undefined) {
          return true;
        }
        let isEnterpriseActivity = !createUserRoleName || createUserRoleName === '企业管理员';

        if (isEnterpriseActivity && this.isEnterpriseManager) {
          return true;
        } else if (!isEnterpriseActivity && this.isAreaManager) {
          return true;
        }
        return false;
      };
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
          storeIds: (this.selectStores || []).join()
        },
        status = this.keyword.status,
        arrStatus;

      arrStatus = status !== null ? [status] : [INITIAL.value, ONGOING.value, SELL_OUT.value, FINISHED.value];
      arrStatus.forEach((item, index) => {
        params[`statusList[${index}]`] = item;
      });

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

    reLoad(pageNo = 1, back) {
      if (back && this.tableData.length === 1 && this.page.pageNo !== 1) {
        this.page.pageNo--;
      } else {
        this.page.pageNo = pageNo;
      }
      this.getList();
    },

    handleSearch() {
      this.reLoad();
    },

    onAdd() {
      this.$router.push('/marketing/card-pack/list/add');
    },

    onEdit(row) {
      this.$router.push({
        path: '/marketing/card-pack/list/add',
        query: {
          id: row.id,
          isView: row.pocketStatus === STATUS.FINISHED.value ? 1 : row.isModifyPermitted ? 0 : 1
        }
      });
    },

    onDelete(row) {
      this.$confirm('确定删除该卡包吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        cardPackApi
          .del({ pocketId: row.id })
          .then(res => {
            this.$message({
              type: 'success',
              message: '删除成功'
            });
            this.loading = false;
            this.reLoad(this.page.pageNo, 1);
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    onEnd(row) {
      this.$confirm('确定结束该卡包吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.loading = true;
        cardPackApi
          .shelf({ pocketId: row.id, shelf: 0 })
          .then(res => {
            this.loading = false;
            this.$message({
              type: 'success',
              message: '结束成功'
            });
            this.reLoad(this.page.pageNo);
          })
          .always(() => {
            this.loading = false;
          });
      });
    },

    onSizeChange(size) {
      this.page.pageSize = size;
      this.reLoad(1);
    },

    onPageChange(page) {
      this.reLoad(page);
    },
    handleReset() {
      this.$refs.keyword.resetFields();
      this.page.pageNo = 1;
      this.selectStores = [];
      this.$refs.stroeSelect.handleClear();
      this.getList();
    }
  }
};
</script>

<style lang="less" scoped>
.marketing-page {
  padding: 0px;
  .courtesy-filter {
    padding: 6px 20px 0px;
    border-radius: 0px 0px 4px 4px;
    .wkt-opt-label-container {
      .serach-mixin;
    }
  }
  .courtesy-list {
    margin-top: 16px;
    padding-bottom: 20px;
    border-radius: 4px;
    .bg-mixin;
    .status-unshelf, .status-shelf {
      padding: 0px;
    }
  }
}
</style>
<style lang="less">
.marketing-page {
  .courtesy-list {
    .table-mixin;
  }
}
</style>
