<template>
  <div v-loading="loading.update" class="cut-price-container marketing-page" :element-loading-text="msg.upadte">
    <div class="Add-Manage-Button">
      <el-button @click="onAdd" class="filter-right" type="primary">创建活动</el-button>
    </div>

    <div class="filter-box">
      <div class="search-box">
        <div class="filter-field">
          <span>活动名称：</span>
          <el-input v-model="searchName" style="width: 200px" placeholder="活动名称" @keypress.native.enter="onSearch" />
        </div>

        <div v-if="!singleStore" class="filter-field">
          <span>活动门店：</span>
          <store-select :select-stores.sync="selectStores" :show-dept="isEnterManger" :show-store="!isEnterManger" class="store-select" @change="onSearch" />
        </div>
      </div>
      <div class="marketing-tips">
        注意：创建活动后，请到
        <a @click="toMiniIndex" class="table-href">页面装修</a>
        配置活动
      </div>
    </div>

    <div class="activity-list">
      
      <el-table :data="tableData" style="width: 100%" v-loading="loading.list" class="wkt-table">
        <el-table-column prop="activityName" label="活动名称" class-name="stress-font" min-width="180"></el-table-column>
        <el-table-column prop="thumbnail" label="商品图片" width="180">
          <img class="activity-list-img" slot-scope="scope" :src="scope.row.thumbnail" />
        </el-table-column>
        <el-table-column prop="priceRange" label="售价" width="100">
          <span slot-scope="scope">{{ scope.row.salePrice | price }}</span>
        </el-table-column>
        <el-table-column prop="priceRange" label="可砍最低价" min-width="120">
          <span slot-scope="scope">{{ scope.row.lowestPrice | price }}</span>
        </el-table-column>
        
        <el-table-column prop="priceRange" label="发起砍价的次数" align="center" width="160">
          <span slot-scope="scope">{{ scope.row.bargainTimes }}</span>
        </el-table-column>

        <el-table-column prop="storeCount" label="活动门店" :show-overflow-tooltip="true" min-width="150">
          <template slot-scope="scope">
            <span v-if="scope.row.suitStoreType == 0">全部门店</span>
            <span v-else class="unit-tags">{{ scope.row.partIn }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="storeCount" width="180" label="创建人">
          <template slot-scope="scope">
            {{ scope.row.employeeName }}({{ scope.row.roleName }})
          </template>
        </el-table-column>

        <el-table-column prop="shlefStatus" label="状态" align="center" width="200">
          <template slot-scope="scope">
            <div class="goods-shlef" :class="scope.row.activityStatus === cutpriceActivityStatus.ON_GOING ? 'status-shelf' : 'status-unshelf'">
              {{ cutpriceActivityStatusDesc(scope.row.activityStatus) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="address" label="操作" min-width="260" align="center" fixed="right">
          <span slot-scope="scope">
            <template v-if="scope.row.activityStatus === cutpriceActivityStatus.ON_GOING">
              <a
                v-if="scope.row.isModifyPermitted"
                class="market-shelf"
                @click="activityOver(scope.row)"
                >结束
              </a>
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
            <a @click="onAlter(scope.row, scope.row.isModifyPermitted && scope.row.activityStatus === cutpriceActivityStatus.NOT_STARTED ? 0 : 1)">详情</a>
            <a @click="onGotoDetail(scope.row)">查看活动</a>
            <a type="text"
               @click="onCopy(scope.row, 0)">
              复制</a>
            <a
              class="range-price"
              href="javascript:;"
              v-if="scope.row.activityStatus !== cutpriceActivityStatus.ON_GOING && scope.row.isModifyPermitted"
              @click="onDelete(scope.row)"
              >删除</a
            >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="scope.row.activityStatus === cutpriceActivityStatus.ON_GOING"
              content="正在进行中的活动无法删除"
            >
              <a href="javascript:;" slot="reference" class="popover-a">删除</a>
            </el-popover>

            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="!scope.row.isModifyPermitted"
              content="当前角色无法进行删除"
            >
              <a href="javascript:;" slot="reference" class="popover-a">删除</a>
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
      >
      </el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="page.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/cutprice.js';
import { cutpriceActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';
import { mapState } from 'vuex';

const bargainApi = api.bargain;

export default {
  components: { StoreSelect },

  data() {
    return {
      selectStores: [],
      searchName: '',
      tableData: [],
      userId: '',
      page: {
        pageNo: 1,
        pageSize: 20
      },
      totalCount: 0,
      loading: {
        update: false,
        list: false
      },
      msg: {
        update: ''
      },
      cutpriceActivityStatus // 砍价活动状态
    };
  },

  computed: {
    // 砍价活动状态描述计算属性
    cutpriceActivityStatusDesc() {
      return status => {
        if (status === cutpriceActivityStatus.NOT_STARTED) {
          return '未开始';
        } else if (status === cutpriceActivityStatus.ON_GOING) {
          return '进行中';
        } else {
          return '已结束';
        }
      };
    },
    ...mapState({
      userInfo: 'userInfo',
      roleList: 'roleList',
      curStore: 'curStore',
      epStoreList: 'storeList'
    }),

    singleStore() {
      return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
    },

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    // key管/企业管理员享有相同权限
    isEnterManger() {
      return (
        !!~this.roleList.split(',').indexOf('common_role_enterprise') ||
        !!~this.roleList.split(',').indexOf('common_role_admin')
      );
    }
  },

  mounted() {
    this.userId = this.userInfo.userId || null;
    this.getActivityList(); //获取砍价活动列表
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
    formatRange(range) {
      return range;
    },

    /**
     * 获取砍价活动列表
     */
    getActivityList() {
      const params = {
        ...this.page,
        storeIds: (this.selectStores || []).join(','),
        activityName: this.searchName
      };
      this.loading.list = true;
      bargainApi
        .list(params)
        .done(res => {
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

    /**
     * 创建活动
     */
    onAdd() {
      this.$router.push('/marketing/cutprice/activity/edit');
    },

    /**
     * 编辑及详情跳转
     */
    onAlter(row, disabled = 0) {
      this.$router.push(`/marketing/cutprice/activity/edit?id=${row.id}&disabled=${disabled}`);
    },

    /**
     * 删除活动
     */
    onDelete(row) {
      this.$confirm('确定删除此活动吗？删除后客户不可再发起砍价，但砍价中的活动可以正常进行。', '删除活动', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.msg.update = '请稍候，正在删除中...';
          this.loading.update = true;
          bargainApi
            .delete(row.id)
            .done(res => {
              this.$message({
                message: '删除成功',
                type: 'success'
              });
              this.page.pageNo = 1;
              this.getActivityList();
            })
            .always(res => {
              this.loading.update = false;
            });
        })
        .catch(() => {
          console.log('取消删除');
        });
    },

    /**
     * 查看活动详情
     */
    onGotoDetail(row) {
      this.$router.push(`/marketing/cutprice/management/list?activityId=${row.id}`);
    },

    /**
     * 跳转页面装修
     */
    toMiniIndex() {
      this.$router.switchPage('/setting/homedecorate');
    },

    /**
     * 结束砍价活动
     */
    activityOver(row) {
      const title = '结束提醒';
      const msg =
        '结束此活动，客户不可再发起新的砍价，<span style="color:red">已发起的砍价继续有效，</span>你还要继续吗？';

      this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.msg.update = '请稍候，正在结束活动中...';
          this.loading.update = true;

          bargainApi
            .activityOver({ bargainId: row.id })
            .done(res => {
              this.$message({
                message: '活动结束成功',
                type: 'success'
              });
              this.getActivityList(); // 重新获取砍价活动列表
            })
            .always(res => {
              this.loading.update = false;
            });
        })
        .catch(() => {
          console.log('取消');
        });
    },
    onCopy(row) {
      this.$router.push({
        path: '/marketing/cutprice/activity/edit',
        query: { copy: true, id: row.id }
      });
    }
  }
};
</script>

<style lang="less">
@import '../../marketing.less';
.cut-price-container {
  .filter-box {
    display: flex;
    flex-direction: column;
    background: #ffffff;
    box-shadow: 0px 2px 6px -2px rgba(0, 0, 0, 0.06);
    padding: 6px 20px 16px;
    border-radius: 0px 0px 4px 4px;
    margin-bottom: 16px;
  }

  .filter-field {
    span {
      color: #717378;
      font-size: 14px;
    }
  }

  .search-box {
    display: flex;
    margin-bottom: 9px;
  }

  .activity-list {
    background: white;
    border-radius: 4px;
    margin-top: 0px;
  }

  .activity-list-img {
    width: 80px;
    height: 60px;
  }

  .range-price {
    color: #ff562d;
  }

  .popover-a {
    color: #B1B5BD;
  }
}
</style>
