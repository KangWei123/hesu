<template>
  <div class="seckill-container marketing-page">
    <div class="Add-Manage-Button" v-if="!deleteShow">
      <el-button icon="el-icon-plus" type="primary" @click="onAdd">创建活动</el-button>
    </div>

    <div class="filter-box">
      <div class="search-box">
        <div class="filter-field">
          <span>活动名称：</span>
          <el-input
            placeholder="请输入活动名称"
            v-model="filterName"
            maxlength="80"
            @keyup.enter.native="onSearch"
            @input="onSearch"
          />
        </div>
        <div class="filter-field" v-if="!singleStore">
          <span>活动门店：</span>
          <store-select
            @change="onSearch"
            :select-stores.sync="selectStores"
            :show-dept="isEnterManger"
            :show-store="!isEnterManger"
            class="store-select"
          />
        </div>
      </div>

      <div v-if="!deleteShow" class="marketing-tips">
        注意：创建活动后，请到
        <a class="table-href" @click="toMiniIndex" href="javascript:void(0)">页面装修</a>
        配置活动
      </div>
    </div>

    <div class="seckill-list" v-loading="loading.update">
      <el-table :data="tableData" style="width: 100%" class="wkt-table" v-loading="loading.list">
        <el-table-column prop="name" label="活动名称" min-width="180" fixed="left"></el-table-column>

        <el-table-column prop="thumbnail" label="商品图片" width="150" align="center">
          <template slot-scope="scope">
            <img class="activity-list-img" :src="scope.row.thumbnail" />
          </template>
        </el-table-column>

        <el-table-column prop="priceRange" label="秒杀价" min-width="100" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.priceRange }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="peopleLimitAmount" label="限购数量" min-width="140" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.peopleLimitAmount || '不限购' }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="periodStartTime" label="开始时间" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{ timeFormatter(scope.row.periodStartTime || scope.row.startTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="periodEndTime" label="结束时间" min-width="200" align="center">
          <template slot-scope="scope">
            <span>{{ timeFormatter(scope.row.periodEndTime || scope.row.endTime) }}</span>
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" min-width="140" align="center" v-if="!deleteShow">
          <template slot-scope="scope">
            <div class="goods-shlef" :class="scope.row.status === status.ON_GOING ? 'status-shelf' : 'status-unshelf'">
              {{ groupSeckillStatusDesc(scope.row.status) }}
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="storeCount" min-width="120" label="活动门店" :show-overflow-tooltip="true">
          <template slot-scope="scope">
            <span v-if="scope.row.suitStoreType == '0'">全部门店</span>
            <span v-else class="unit-tags">{{ scope.row.partIn }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建组织" min-width="150">
          <template slot-scope="scope"> {{ scope.row.employeeName }}({{ scope.row.roleName }}) </template>
        </el-table-column>

        <el-table-column label="删除人" v-if="deleteShow" min-width="150" prop="updatePersonName" />

        <el-table-column prop="action" label="操作" :width="220" fixed="right" align="center">
          <div slot-scope="scope" class="action-column">
            <a
              href="javascript:void(0);"
              v-if="scope.row.status === status.ON_GOING && scope.row.isModifyPermitted"
              @click="setActivityEndStatus(scope.row, seckillActivityStatus.ENDED)"
              >结束</a
            >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="scope.row.status === status.ON_GOING && !scope.row.isModifyPermitted"
              content="当前角色无法结束活动"
            >
              <a href="javascript:;" slot="reference" class="popover-a">结束</a>
            </el-popover>

            <!-- 非周期性秒杀可以立即开始 -->
            <a
              href="javascript:void(0);"
              v-else-if="
                scope.row.status === status.NOT_STARTED &&
                scope.row.periodType === periodTypeEnum.BAND &&
                scope.row.isModifyPermitted
              "
              @click="setActivityEndStatus(scope.row, seckillActivityStatus.ON_GOING)"
              >开始</a
            >
            <el-popover
              placement="top-start"
              width="200"
              trigger="hover"
              v-else-if="
                scope.row.status === status.NOT_STARTED &&
                scope.row.periodType === periodTypeEnum.BAND &&
                !scope.row.isModifyPermitted
              "
              content="当前角色无法立即开始活动"
            >
              <a href="javascript:;" slot="reference" class="popover-a">开始</a>
            </el-popover>
            <el-popover
              placement="top"
              :title="seckillActivityInfo.name"
              width="200"
              :content="seckillActivityInfo.path"
              trigger="click"
            >
              <a href="javascript:;" slot="reference" @click="checkMinApp(scope.row)">链接</a>
            </el-popover>

            <template v-if="!deleteShow">
              <a
                type="text"
                v-if="scope.row.status === status.NOT_STARTED && !!scope.row.isModifyPermitted"
                @click="onAlter(scope.row, 0)"
              >
                编辑
              </a>
              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else-if="scope.row.status === status.NOT_STARTED && !scope.row.isModifyPermitted"
                content="当前角色无法进行编辑"
              >
                <a href="javascript:;" slot="reference" class="popover-a">编辑</a>
              </el-popover>
            </template>

            <a @click="onAlter(scope.row, 1)">详情</a>

            <a type="text" @click="onCopy(scope.row, 0)"> 复制</a>

            <template v-if="!deleteShow">
              <a
                class="table-delete"
                v-if="scope.row.status !== status.ON_GOING && !!scope.row.isModifyPermitted"
                @click="onDelete(scope.row)"
              >
                删除
              </a>

              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else-if="!scope.row.isModifyPermitted"
                content="当前角色无法进行删除"
              >
                <a href="javascript:;" slot="reference" class="table-delete popover-a">删除</a>
              </el-popover>

              <el-popover
                placement="top-start"
                width="200"
                trigger="hover"
                v-else-if="scope.row.status === status.ON_GOING"
                content="正在进行中的活动无法删除!"
              >
                <a class="table-delete" href="javascript:;" slot="reference">删除</a>
              </el-popover>
            </template>
          </div>
        </el-table-column>
      </el-table>

      <!-- <el-pagination
        layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="pageParams.pageSize"
        :current-page="pageParams.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination"
      ></el-pagination> -->

      <el-pagination
        v-if="totalCount"
        :hide-on-single-page="true"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        :page-size="pageParams.pageSize"
        layout="sizes, prev, pager, next"
        :total="totalCount"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import utils from '@/dss-common/utils/index';
  import seckillApi from '@/dss-wechat3rd/src/api/seckill.js';
  import { seckillActivityStatus, periodTypeEnum } from '@/dss-wechat3rd/src/constants/enum.js';
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import StoreSelect from '@/dss-wechat3rd/src/bz_components/store-select-dialog/simple-cascader';

  export default {
    props: {
      // 查看已删除的秒杀
      deleteShow: {
        type: Boolean,
        default: false,
      },
    },

    components: { StoreSelect },

    data() {
      return {
        seckillActivityInfo: {
          path: '',
          name: '',
        },
        seckillActivityStatus,
        periodTypeEnum,
        loading: {
          update: false,
          list: false,
        },
        tableData: [],
        pageParams: {
          pageNo: 1,
          pageSize: 10,
        },
        totalCount: 0,
        status: seckillActivityStatus,
        filterName: null,
        selectStores: [],
      };
    },

    computed: {
      ...mapState({
        roleList: 'roleList',
        userInfo: 'userInfo',
        epStoreList: 'storeList',
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
      },

      // 秒杀活动状态描述计算属性
      groupSeckillStatusDesc() {
        return status => {
          if (status === seckillActivityStatus.NOT_STARTED) {
            return '未开始';
          } else if (status === seckillActivityStatus.ON_GOING) {
            return '进行中';
          } else {
            return '已结束';
          }
        };
      },
    },
    // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
    beforeRouteEnter(to, from, next) {
      next(vm => {
        vm.getSeckillList(); // 获取秒杀活动列表
      });
    },

    mounted() {
      this.getSeckillList();
    },

    methods: {
      /**
       * 获取链接
       */
      checkMinApp(row) {
        this.seckillActivityInfo.path = `sub-packages/marketing-package/pages/seckill/detail/index?itemNo=${row.itemNo}&activityId=${row.id}&seckillStatus=${row.status}`;
        this.seckillActivityInfo.name = row.itemName;
      },
      /**
       * 格式化时间
       */
      timeFormatter(cellValue) {
        return utils.timeFormat(cellValue);
      },

      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getSeckillList(); // 获取秒杀活动列表
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getSeckillList(); // 获取秒杀活动列表
      },
      /**
       * 搜索查询
       */
      onSearch() {
        this.pageParams.pageNo = 1;
        this.getSeckillList(); // 获取秒杀活动列表
      },

      /**
       * 获取秒杀活动列表
       */
      getSeckillList() {
        const params = { ...this.pageParams, storeIds: (this.selectStores || []).join(',') };
        // 过滤搜索条件
        if (this.filterName || this.filterName === 0) {
          params.name = this.filterName;
        }
        // 加入状态，查询已删除的秒杀活动列表
        if (this.deleteShow) {
          params.status = seckillActivityStatus.DELETED;
        }

        this.loading.list = true;

        seckillApi
          .seckillList(params)
          .done(res => {
            this.tableData = res.data || [];
            this.tableData.forEach(item => {
              const arr = (item.storeBriefVOS || []).map(node => {
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
        this.$router.push('/marketing/seckill/activity/edit');
      },

      /**
       * 跳转页面装修
       */
      toMiniIndex() {
        this.$router.switchPage('/setting/homedecorate');
      },

      /**
       * 编辑及详情跳转
       */
      onAlter(row, isDisabled) {
        let path = '/marketing/seckill/activity/edit';
        let deleteShow = 0;
        if (this.deleteShow) {
          path = '/marketing/seckill/delete-list/delete-detail';
          deleteShow = 1;
        }

        this.$router.push({
          path: path,
          query: {
            activityId: row.id,
            activityStatus: row.status,
            deleteShow: deleteShow,
            isDisabled: isDisabled,
          },
        });
      },

      /**
       * 删除活动
       */
      onDelete(row) {
        if (row.status === seckillActivityStatus.ON_GOING) {
          this.$message.error('正在进行中的活动无法删除');
          return;
        }

        this.$confirm('活动删除后，<span style="color:red">则不可以撤销，</span>是否确认删除', '删除活动', {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.updateSeckillStatus(row.id, seckillActivityStatus.DELETED, '删除成功'); // 秒杀活动删除
          })
          .catch(() => {
            console.log('取消删除');
          });
      },

      /**
       * 设置活动结束或者开始状态
       */
      setActivityEndStatus(row, status) {
        let title, msg, successMsg;
        if (status === seckillActivityStatus.ENDED) {
          title = '结束提醒';
          msg = '活动结束后，<span style="color:red">则不可以重新发起秒杀，</span>是否确认结束';
          successMsg = '活动结束成功';
        } else {
          title = '立即开始';
          msg = '是否立即开始秒杀活动';
          successMsg = '立即开始成功';
        }

        this.$confirm(msg, title, {
          dangerouslyUseHTMLString: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.updateSeckillStatus(row.id, status, successMsg); // 秒杀活动结束
          })
          .catch(() => {
            console.log('取消');
          });
      },

      onCopy(row) {
        this.$router.push({
          path: '/marketing/seckill/activity/edit',
          query: { copy: true, activityId: row.id, activityStatus: row.status },
        });
      },

      /**
       * 秒杀活动结束或者删除
       */
      updateSeckillStatus(id, status, successMsg) {
        this.loading.update = true;

        seckillApi
          .updateSeckillStatus({
            activityId: id,
            status,
          })
          .done(res => {
            this.$message.success(successMsg);
            // this.pageParams.pageNo = 1;
            this.getSeckillList(); // 获取秒杀活动列表
          })
          .always(() => {
            this.loading.update = false;
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .filter-field {
    display: flex;
  }

  .filter-box {
    display: flex;
    flex-direction: column;
    background: #fff;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.06);
    padding: 6px 20px 16px;
    border-radius: 0 0 4px 4px;
  }

  .search-box {
    display: flex;
    margin-bottom: 9px;
  }

  .unit-tags {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: block;
  }

  .popover-a {
    color: #b1b5bd;
  }

  .action-column {
    a {
      word-break: keep-all;
    }
  }
</style>
