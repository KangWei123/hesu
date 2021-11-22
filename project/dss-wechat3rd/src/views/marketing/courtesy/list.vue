<template>
  <div class="courtesy-ordergift-list"
       :element-loading-text="msg.update">
    <div class=" Add-Manage-Button">
      <el-button  @click="onAdd"
                  icon="el-icon-plus"
                  type="primary">新建下单有礼</el-button>
    </div>

    <div class="courtesy-filter">
      <el-form :model="keyword"
               ref="keyword"
               @submit.native.prevent
               inline
               class="wkt-opt-label-container">
        <el-form-item label="活动名称：" prop="name">
          <el-input placeholder="搜索活动名称"
                    v-model.trim="keyword.name"
                    @input="handleSearch"
                    clearable></el-input>
        </el-form-item>

        <el-form-item label="参与门店：" prop="shop">
          <el-select clearable
                     v-model="keyword.shop"
                     placeholder="选择参与门店"
                     :loading="loading.shop"
                     @change="handleStore">
            <el-option :key="'all'"
                       label="全部门店"
                       :value="null" />
            <el-option v-for="item in shopOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
            <!-- <el-option key="load-more" label="加载更多" :value="keyword.shop" @click="loadMore"> -->
            <div class="load"
                 v-if="shopOptions.length < storeInfo.totalCount">
              <a @click="loadMore">加载更多</a>
            </div>
            <!-- </el-option> -->
          </el-select>
        </el-form-item>
        <el-form-item label="活动状态：" prop="status">
          <el-select clearable
                     v-model="keyword.status"
                     placeholder="选择活动状态"
                     @change="handleStatus">
            <el-option v-for="item in options"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="onReset">重置</el-button>
        </el-form-item>
      </el-form>
      
    </div>
    <div class="courtesy-list" v-loading="isLoading">
      <el-table :data="tableData"
                style="width: 100%"
                class="wkt-table"
                v-loading="listLoading">
        <el-table-column align="center"
                         prop="activityName"
                         label="活动名称"
                         :show-overflow-tooltip="true" />
        <el-table-column align="center"
                         label="付款场景">
          <template slot-scope="scope">
            <span v-if="scope.row.paymentChannelIds.includes(1)">扫码购</span>
            <span v-if="scope.row.paymentChannelIds.includes(2)">自提</span>
            <span v-if="scope.row.paymentChannelIds.includes(3)">送货</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="activityStores"
                         label="参与门店" />
        <el-table-column align="center"
                         label="生效时间">
          <template slot-scope="scope">
            <span>{{scope.row.beginTime|fitTime}}</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.activityStatus===0">未开始</span>
            <span v-if="scope.row.activityStatus===1">进行中</span>
            <span v-if="scope.row.activityStatus===2">已结束</span>
            <span v-if="scope.row.activityStatus===3">已删除</span>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="methods"
                         label="操作"
                         :width="150">
          <div slot-scope="scope">
            <a @click="onDetail(scope.row)">详情</a>
            <a v-if="scope.row.activityStatus === 0||scope.row.activityStatus===1"
               type="text"
               @click="onEnd(scope.row)">结束活动</a>
            <a v-if="scope.row.activityStatus===2"
               class="table-delete"
               @click="onDelete(scope.row)">删除</a>
          </div>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"></el-pagination> -->
      
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
import courtesyApi from '@/dss-wechat3rd/src/api/courtesy';
import utils from '@/dss-common/utils/index';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      keyword: {
        status: null,
        name: null,
        shop: null
      },
      msg: {
        update: ''
      },
      options: [
        {
          value: null,
          label: '所有状态'
        },
        {
          value: 0,
          label: '未开始'
        },
        {
          value: 1,
          label: '进行中'
        },
        {
          value: 2,
          label: '已结束'
        },
        {
          value: 3,
          label: '已删除'
        }
      ],
      shopOptions: [],
      hashMapShopOptions: {},
      stores: [],
      typeName: '下单有礼',
      tableData: [],
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      storeType: 1,
      isLoading: false,
      loading: {
        shop: false
      },
      listLoading: false,
      status: 0,
      findStoreRow: '',
      delItem: {},
      activityStoreList: '',
      selectedStoreList: [],
      storeInfo: {
        pageSize: 10,
        pageNo: 1,
        totalCount: 0
        // per_chooseEpId: null,
        // per_chooseAppId: null
      }
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    }
  },

  mounted() {
    this.getStores().then(() => {
      this.getList();
    });
  },
  methods: {
    getList() {
      this.listLoading = true;
      return courtesyApi
        .list({
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          activityName: this.keyword.name,
          // activityStoresSelectType: this.storeType === 1 ? null : this.storeType,
          activityStoresIds: this.storeType === 1 ? null : this.keyword.shop,
          activityStatus: this.keyword.status
        })
        .then(res => {
          this.tableData = res.data || [];
          //键值对形式存储门店列表id与value
          this.shopOptions.forEach(item => {
            this.hashMapShopOptions[item.value] = item.label;
          });
          this.hashMapShopOptions = new Object(this.hashMapShopOptions);
          //console.log('hashMapShopOptions----->',this.hashMapShopOptions);
          if (this.tableData && this.tableData.length) {
            this.tableData.map(item => {
              item.activityStores = ''; //赋空字符串值，避免门店出现undefined
              let storeIdList = item.activityStoresIds.split(',');
              storeIdList = storeIdList.filter(id => {
                return !!id;
              });
              if (item.activityStoresSelectType === 1) {
                item.activityStores = '全部门店';
              } else {
                storeIdList.forEach((id, index = 0) => {
                  let storeId = parseInt(id);
                  let findStore = this.hashMapShopOptions[storeId];
                  if (!!findStore) {
                    item.activityStores += ' ' + findStore;
                    index++;
                  }
                  //部分门店全选的情况，需要转成全部门店
                  if (index === this.shopOptions.length - 1) {
                    item.activityStores = '全部门店';
                  }
                });
                console.log('shop hash', this.shopOptions.length - 1);
              }
            });
            this.totalCount = res.totalCount;
          } else {
            this.totalCount = 0;
          }
          console.log('活动列表', this.tableData);
        })
        .catch(err => {
          console.error('活动列表err', err);
        })
        .always(() => {
          this.listLoading = false;
        });
    },

    loadMore() {
      if (this.shopOptions.length >= this.storeInfo.totalCount) return;

      this.storeInfo.pageNo = this.storeInfo.pageNo + 1;
      return this.getStores();
    },

    getStores() {
      // this.storeInfo.per_chooseAppId = this.userInfo.appInfo.id;
      // this.storeInfo.per_chooseEpId = this.userInfo.appInfo.epId;
      const params = {
        ...this.storeInfo
      };
      this.loading.shop = true;
      return courtesyApi
        .queryList(params)
        .then(res => {
          const { data, totalCount, pageNo } = res;
          this.stores = data;
          this.storeInfo.totalCount = totalCount;
          this.storeInfo.pageNo = pageNo;

          this.stores.forEach(e => {
            this.shopOptions.push({
              value: e.id,
              label: e.name
            });
          });
        })
        .catch(err => {
          console.error('获取店铺err', err);
        })
        .always(() => {
          this.loading.shop = false;
        });
    },

    handleSearch() {
      this.getList();
    },

    updateStatus(item) {
      let params = {
        activityId: item.id,
        activityStatus: item.activityStatus,
        per_chooseAppId: this.userInfo.appInfo.id,
        per_userId: this.userInfo.userId
      };
      //console.log('jsonParams', params);
      courtesyApi
        .update(params)
        .then(res => {
          //console.log('update--------->', res);
          this.$message({
            type: 'success',
            message: '操作成功'
          });
          //改变状态成功重新调下单有礼列表接口
          this.getList();
        })
        .catch(err => {
          console.error('更新状态失败', err);
        });
    },
    handleStore(e) {
      console.log('activityStoresIds---->', e);
      if (e === null) {
        this.storeType = 1; //全部门店
      } else {
        this.storeType = 2; //选定门店
      }
      this.getList();
    },
    handleStatus(e) {
      this.getList();
    },
    onAdd() {
      this.$router.push('/marketing/courtesy/add');
    },
    onEnd(item) {
      this.delItem = item;
      this.$confirm('活动结束后不可重启，你还要继续吗?', '确定结束活动?', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.msg.update = '请稍候，结束活动中...';
          //调用更改状态接口
          this.updateStatus(this.delItem);
        })
        .catch(err => {
          console.log('取消结束', err);
        });
    },
    onDetail(row) {
      this.$router.push({
        path: '/marketing/courtesy/add',
        query: {
          id: row.id
        }
      });
    },
    onDelete(item) {
      this.delItem = item;
      console.log('delItem-------->', this.delItem);
      this.$confirm('活动删除后不可恢复，所有活动相关数据都将被删除，你还要继续吗？', '确定删除该活动吗', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          this.msg.update = '请稍候，删除中...';
          this.loading = true;
          this.updateStatus(this.delItem);
        })
        .catch(err => {
          console.log('取消删除', err);
        })
        .finally(() => {
          this.loading = false;
        });
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
    onReset() {
      this.$refs.keyword.resetFields();
      this.page.pageNo = 1;
      this.getList();
    }
  }
};
</script>

<style lang="less">
.load {
  padding: 8px;
  text-align: center;
}

.courtesy-ordergift-list {
  padding: 0px;
 
  .title {
    height: 50px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }

  .courtesy-list {
    // padding: 20px 0;
    background: white;
    // border-radius: 4px;
    .table-mixin;
  }

  .courtesy-filter {
    padding: 16px 20px;

    .wkt-opt-label-container {
      .serach-mixin;
    }
    // .search-btn {
    //   margin-left: -25px;
    // }

    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
  .el-table .cell {
    text-align: left;
  }
  .el-table .disabled-qrcode {
    color: #ccc;
    cursor: no-drop;
  }

  .el-table .disabled-qrcode:hover {
    color: #ccc;
    cursor: no-drop;
  }
}
</style>
