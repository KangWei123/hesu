<template>
  <div v-loading="loading.update" class="pintuan-container marketing-page" :element-loading-text="msg.upadte">
    <div class="Add-Manage-Button" v-if="!deleteShow">
      <el-button v-if="!deleteShow" @click="onAdd" style="margin-left:auto" type="primary">创建活动</el-button>
    </div>
    <div class="filter-box">
      <!-- <el-select placeholder="活动类型" v-if="isAreaManger||isEnterManger" v-model="type" clearable @change="onChangeType">
        <el-option v-for="item in typeList" :key="item.value" :label="item.type" :value="item.value"></el-option>
      </el-select> -->
      <div class="search-box">
        <div class="filter-field">
          <span>活动名称：</span>
          <el-input v-model="name" placeholder="输入活动名称" @keypress.native.enter="onSearch" />
        </div>

        <div class="filter-field" v-if="!singleStore">
          <span>活动门店：</span>
          <store-select :select-stores.sync="selectStores" :show-dept="isEnterManger" :show-store="!isEnterManger" class="store-select" />
        </div>
      </div>

      <div v-if="!deleteShow" class="marketing-tips">
        注意：创建活动后，请到
        <a class="table-href" @click="toMiniIndex" href="javascript:void(0)">页面装修</a>
        配置活动
      </div>
    </div>
    
    <div class="activity-list" v-loading="loading.update">
      <el-table :data="tableData" style="width: 100%;" v-loading="loading.list" class="wkt-table">
        <el-table-column prop="name" label="活动名称" min-width="180" class-name="stress-font"></el-table-column>

        <el-table-column prop="thumbnail" label="拼团封面" min-width="180">
          <img class="activity-list-img" slot-scope="scope" :src="scope.row.backgroundUrl || scope.row.thumbnail" />
        </el-table-column>

        <el-table-column prop="priceRange" label="团购价" class-name="range-price" width="140">
          <span slot-scope="scope">{{ formatRange(scope.row.priceRange) }}</span>
        </el-table-column>

        <el-table-column v-if="!deleteShow" min-width="120" prop="status" label="状态" align="center">
          <template slot-scope="scope">
            <div class="goods-shlef" :class="scope.row.status === status.SHELF ? 'status-shelf' : 'status-unshelf'">
             {{ groupActivityStatusDesc(scope.row.status) }}
            </div>
          </template>
        </el-table-column>

        <el-table-column prop="people" min-width="120" label="拼团人数">
          <span slot-scope="scope">{{ scope.row.people }}人</span>
        </el-table-column>

        <el-table-column prop="actualCount" min-width="120" label="真实销量" align="center"></el-table-column>

        <el-table-column prop="storeCount" min-width="200" label="活动门店" :show-overflow-tooltip="true" align="center">
          <template slot-scope="scope">
            <span v-if="scope.row.storeCount == '所有'">全部门店</span>
            <span v-else class="unit-tags">{{ scope.row.partIn }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="storeCount" min-width="180" label="创建人">
          <template slot-scope="scope">
            {{ scope.row.employeeName }}({{ scope.row.roleName }})
          </template>
        </el-table-column>

        <!-- <el-table-column prop="activityLevel" width="100" label="活动类型">
          <template slot-scope="scope">
            <span v-if="scope.row.activityLevel == 1">品牌活动</span>
            <span v-if="scope.row.activityLevel == 10">门店活动</span>
          </template>
        </el-table-column> -->

        <el-table-column prop="updateName" label="删除人" v-if="deleteShow" min-width="140">
          <template slot-scope="scope">
            {{ scope.row.updateName || '- -' }}
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="220" align="center" fixed="right">
          <span slot-scope="scope">
            <a
              href="javascript:void(0);"
              class="table-href market-shelf"
              @click="setActivityStatus(scope.row)"
              v-if="scope.row.status === status.SHELF && scope.row.isModifyPermitted"
              >结束</a
            >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="scope.row.status === status.SHELF"
              content="当前角色无法结束活动"
            >
              <a href="javascript:;" slot="reference" class="popover-a">结束</a>
            </el-popover>
            <a
              type="text"
              v-if="scope.row.status === status.INIT && scope.row.isModifyPermitted"
              @click="onAlter(scope.row)"
              >编辑</a
            >
            <el-popover
              v-else-if="scope.row.status === status.INIT"
              placement="top-start"
              width="200"
              trigger="hover"
              content="当前角色无法进行编辑"
            >
              <a href="javascript:;" slot="reference" class="popover-a">编辑</a>
            </el-popover>

            <a @click="onAlter(scope.row, 1)">详情</a>

            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-if="!scope.row.isModifyPermitted && scope.row.status !== -2"
              content="当前角色无法进行删除"
            >
              <a class="popover-a" href="javascript:;" slot="reference">删除</a>
            </el-popover>

            <a
              href="javascript:;"
              class="table-delete"
              v-else-if="!deleteShow && scope.row.status !== status.SHELF && scope.row.status !== -2"
              @click="onDelete(scope.row)"
              >删除</a
            >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="!deleteShow && scope.row.status === status.SHELF"
              content="正在进行中的活动无法删除"
            >
              <a class="popover-a" href="javascript:;" slot="reference">删除</a>
            </el-popover>
          </span>
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
        class="wkt-pagination"
      ></el-pagination> -->
      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import groupApi from '@/dss-wechat3rd/src/api/group.js';
import { mapState } from 'vuex';
import { groupActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import filters from '@/dss-common/utils/filters.js';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

export default {
  components: {
    StoreSelect
  },

  props: {
    //查看已删除的拼团
    deleteShow: {
      type: Boolean,
      default() {
        return false;
      }
    }
  },

  data() {
    return {
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 20
      },
      type: '',
      totalCount: 0,
      status: groupActivityStatus,
      loading: {
        update: false,
        list: false
      },
      typeList: [
        { value: 1, type: '品牌活动' },
        { value: 10, type: '门店活动' }
      ],
      msg: {
        update: ''
      },

      userId: '',
      name: '',
      selectStores: []
    };
  },

  watch: {
    selectStores() {
      this.onSearch();
    }
  },

  computed: {
    // 拼团活动状态描述计算属性
    groupActivityStatusDesc() {
      return status => {
        if (status === groupActivityStatus.INIT) {
          return '未开始';
        } else if (status === groupActivityStatus.SHELF) {
          return '进行中';
        } else {
          return '已结束';
        }
      };
    },
    ...mapState({
      roleList: 'roleList',
      userInfo: 'userInfo',
      epStoreList: 'storeList'
    }),

    singleStore() {
      return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
    },

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    //key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  },

  mounted() {
    this.userId = this.userInfo.userId || null;
    this.getActivityList(); // 获取拼团活动列表
  },

  methods: {
    onSearch() {
      this.page.pageNo = 1;
      this.getActivityList();
    },

    // 每页条数变化
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getActivityList();
    },
    // 翻页
    onPageChange(page) {
      this.page.pageNo = page;
      this.getActivityList();
    },
    /**
     * 获取拼团活动列表
     */
    getActivityList() {
      let params = {
        ...this.page,
        activityLevel: this.type,
        storeIds: this.selectStores.toString(),
        name: this.name
      };

      //加入状态，查询已删除的拼团列表
      if (!!this.deleteShow) {
        params.status = -2;
      }
      this.loading.list = true;
      groupApi
        .queryActivityV2(params)
        .then(res => {
          this.tableData = res.data || [];
          this.tableData.forEach(item => {
            let arr = (item.storeBriefVOS || []).map(node => {
              return node.name;
            });
            item.partIn = arr.join(',');
          });
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.loading.list = false;
        });
    },
    //活动筛选
    onChangeType() {
      this.page.pageNo = 1;
      this.getActivityList();
    },
    /**
     * 团购价参数封装转化
     */
    formatRange(range) {
      const price = range.split('-');
      if (price.length >= 2) {
        return `${filters.price(price[0], 1)}~${filters.price(price[1], 1)}`;
      } else if (price.length === 1) {
        return filters.price(price[0], 1);
      }
      return range;
    },

    /**
     * 创建活动
     */
    onAdd() {
      this.$router.push('/marketing/pintuan/activity/edit');
    },

    /**
     * 编辑及详情跳转
     */
    onAlter(row, disabled = 0) {
      let path = '/marketing/pintuan/activity/edit';
      if (!!this.deleteShow) {
        path = '/marketing/pintuan/delete-list/delete-detail';
      }

      this.$router.push({
        path: path,
        query: {
          disabled,
          activityId: row.id,
          deleteShow: this.deleteShow
        }
      });
    },

    /**
     * 删除活动
     */
    onDelete(row) {
      this.$confirm('删除后团购中的订单都会失败并且退款回客户', '删除活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.updateStatus(row.id, groupActivityStatus.DELETED, '删除成功', '请稍候，正在删除中...');
        })
        .catch(() => {
          console.log('取消删除');
        });
    },

    /**
     * 查看活动详情
     */
    onGotoDetail(row) {
      this.$router.push(`/marketing/pintuan/management?activityId=${row.id}`);
    },

    /**
     * 跳转页面装修
     */
    toMiniIndex() {
      this.$router.switchPage('/setting/homedecorate');
    },

    /**
     * 设置活动开始结束状态
     */
    setActivityStatus(row) {
      let title = '开始提醒';
      let msg = '此活动一旦开始，<span style="color:red">则不可以再修改活动内容，</span>你还要继续吗？';
      let successMsg = '活动开始成功';
      let status = groupActivityStatus.SHELF;
      let loadingMsg = '请稍候，正在开始中...';
      if (row.status === groupActivityStatus.SHELF) {
        title = '结束提醒';
        msg =
          '结束此活动，客户不可以再发起新的拼团，<span style="color:red">已发起的拼团继续有效，</span>你还要继续吗？';
        successMsg = '活动结束成功';
        status = groupActivityStatus.NOT_SHELF;
        loadingMsg = '请稍候，正在结束中...';
      }
      this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.updateStatus(row.id, status, successMsg, loadingMsg);
        })
        .catch(() => {
          console.log('取消');
        });
    },

    /**
     * 改变活动开始结束状态
     */
    updateStatus(id, status, successMsg, loadingMsg) {
      this.msg.update = loadingMsg;
      this.loading.update = true;
      groupApi
        .updateActivityStatus({
          activityId: id,
          status
        })
        .done(res => {
          this.$message({
            message: successMsg,
            type: 'success'
          });
          this.page.pageNo = 1;
          this.getActivityList();
        })
        .always(() => {
          this.loading.update = false;
        });
    },
    onCopy(row) {
      this.$router.push({
        path: '/marketing/pintuan/activity/edit',
        query: { copy: true, activityId: row.id }
      });
    }
  }
};
</script>

<style lang="less">
.pintuan-container {
  .filter-box {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.06);
    padding: 6px 20px 16px;
    border-radius: 0px 0px 4px 4px;
  }

  .search-box {
    display: flex;
    margin-bottom: 9px;
  }
}
.unit-tags {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

.pt-top-container {
  display: flex;
  margin-top: 10px;
}

.activity-list {
  .bg-mixin;
  border-radius: 4px;
  padding-bottom: 20px;

  .table-mixin;
  a {
    padding: 0px 10px 0px 0px !important;
  }
  a:last-child {
    padding-right: 0px !important;
  }
  .wkt-table {
    border-radius: 4px 4px 0px 0px;
    .popover-a {
      color: #B1B5BD;
      padding-right: 10px !important;
    }
  }
}
.activity-list-img {
  width: 80px;
  height: 60px;
}

.range-price {
  color: #ff562d;
}
.el-tooltip__popper {
  width: 200px;
}

.filter-field {
  & > span {
    color: #717378;
    font-size: 14px;
    margin-right: 8px;
    word-break: keep-all;
  }

  margin-right: 24px;
  color: #333;
  display: flex;
  line-height: 30px;
}
</style>
