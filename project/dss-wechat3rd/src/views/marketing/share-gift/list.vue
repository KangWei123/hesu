<template>
  <div class="courtesy">
    <div class="Add-Manage-Button">
      <el-button @click="onAdd"
                 icon="el-icon-plus"
                type="primary">新建分享有礼</el-button>
    </div>
    <div class="courtesy-filter">
      <el-form inline class="wkt-opt-label-container" :model="keyword" ref="keyword">
        <el-form-item label="活动名称：" prop="name">
          <el-input placeholder="搜索活动名称"
                    @input="handleSearch"
                    v-model.trim="keyword.name"
                    clearable></el-input>
        </el-form-item>
        <el-form-item label="门店：" prop="shop">
          <el-select clearable
                     v-model="keyword.shop"
                     placeholder="选择参与门店"
                     @change="handleStore">
            <el-option v-for="item in shopOptions"
                       :key="item.value"
                       :label="item.label"
                       :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态：" prop="status">
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
          <el-button class="search-btn"
                     @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
      
    </div>
    <div class="courtesy-list" v-loading="loading">
      <el-table :data="tableData"
                style="width: 100%"
                class="wkt-table"
                v-loading="listLoading">
        <el-table-column align="center"
                         prop="activityName"
                         label="活动名称"
                         :show-overflow-tooltip="true" />
        <el-table-column align="center"
                         label="活动时间">
          <template slot-scope="scope">
            <p>{{scope.row.beginTime ? scope.row.beginTime:'-'}}</p>
            <p>{{scope.row.beginTime ? '至' : ''}}</p>
            <p>{{scope.row.endTime ? scope.row.endTime: ''}}</p>
          </template>
        </el-table-column>
        <el-table-column align="center"
                         prop="activityStores"
                         label="参与门店" />
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
                         :width="200">
          <div slot-scope="scope">
            <a @click="onDetail(scope.row)">详情</a>
            <a v-if="scope.row.activityStatus !==0"
               @click="toRecord(scope.row)">活动记录</a>
            <a v-if="scope.row.activityStatus===0||scope.row.activityStatus===1"
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
import shareApi from '@/dss-wechat3rd/src/api/share-gift';
import courtesyApi from '@/dss-wechat3rd/src/api/courtesy';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      keyword: {
        status: null,
        name: null,
        shop: null
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
      tableData: [],
      loading: false,
      listLoading: false,
      storeType: 1,
      page: {
        pageSize: 10,
        pageNo: 1
      },
      totalCount: 0,
      storeInfo: {
        per_chooseAppId: null,
        per_chooseEpId: null
      },
      handleItem: {}
    };
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo
    })
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.getList(); // 获取列表
    });
  },

  methods: {
    handleSearch() {
      this.page.pageNo = 1;
      this.getList();
    },
    getAllStores() {
      this.loading = true;
      this.storeInfo.per_chooseAppId = this.userInfo.appInfo.id;
      this.storeInfo.per_chooseEpId = this.userInfo.appInfo.epId;
      const params = {
        ...this.storeInfo
      };
      courtesyApi
        .queryList(params)
        .then(res => {
          this.stores = res.data;
          this.stores.forEach(e => {
            this.shopOptions.push({
              value: e.id,
              label: e.name
            });
          });
          this.shopOptions.unshift({
            value: null,
            label: '全部门店'
          });
          //避免在mounted里调用getList()，因为需要先得到门店列表才可以获得表格的参与门店
          this.getList();
        })
        .catch(err => {
          console.error('获取店铺err', err);
        })
        .always(_ => {
          this.loading = false;
        });
    },
    handleStore(e) {
      this.page.pageNo = 1;
      if (e === null) {
        this.storeType = 1; //全部门店
      } else {
        this.storeType = 2; //选定门店
      }
      this.getList();
    },
    handleStatus() {
      this.page.pageNo = 1;
      this.getList();
    },
    onAdd() {
      this.$router.push('/marketing/share-gift/add');
    },
    onDetail(row) {
      console.log('id----->', row.id);
      this.$router.push({
        path: '/marketing/share-gift/add',
        query: {
          sharePresentInfoId: row.id
        }
      });
    },
    updateStatus(row) {
      let params = {
        activityId: row.id,
        activityStatus: row.activityStatus
      };
      shareApi
        .update(params)
        .then(res => {
          console.log('更新res', res);
          this.$message({
            icon: 'success',
            message: '更新状态成功',
            duration: 3000
          });
          this.getList();
        })
        .catch(err => {
          console.error('更新状态err', err);
        });
    },
    onEnd(row) {
      this.handleItem = row;
      console.log('end', this.handleItem);
      this.$confirm('活动结束后不可重启，你还要继续吗？', '确定结束该活动吗？', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //调用更改状态接口
          this.updateStatus(this.handleItem);
          this.getList();
        })
        .catch(() => {
          console.log('取消结束');
        });
    },
    onDelete(row) {
      this.handleItem = row;
      console.log('del', this.handleItem);
      this.$confirm('活动删除后不可恢复，所有活动相关数据都将被删除，你还要继续吗？', '确定删除该活动吗？', {
        confirmButtonText: '继续',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          //调用更改状态接口
          this.updateStatus(this.handleItem);
        })
        .catch(() => {
          console.log('取消删除');
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
    toRecord(row) {
      this.$router.push({
        path: '/marketing/share-gift/record',
        query: {
          sharePresentRecordId: row.sharePresentBindItemDTO.sharePresentRecordId
        }
      });
    },
    //调取分享有礼列表
    getList() {
      this.listLoading = true;
      let params = {
        pageNo: this.page.pageNo,
        pageSize: this.page.pageSize,
        activityName: this.keyword.name,
        // activityStoresSelectType: this.storeType === 1 ? null : this.storeType,
        activityStoresIds: this.storeType === 1 ? null : this.keyword.shop,
        activityStatus: this.keyword.status
      };
      shareApi
        .list(params)
        .then(res => {
          this.tableData = res.data || [];
          //键值对形式存储门店列表id与value
          this.shopOptions.forEach(item => {
            this.hashMapShopOptions[item.value] = item.label;
          });
          this.hashMapShopOptions = new Object(this.hashMapShopOptions);
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
              }
            });
            //console.log('list------>', this.tableData);
            this.totalCount = res.totalCount;
          } else {
            this.totalCount = 0;
          }
          //console.log('分享有礼tableData---->', this.tableData, 'res', res);
        })
        .catch(err => {
          console.error('获取分享有礼err', err);
        })
        .always(_ => {
          this.listLoading = false;
        });
    },
    handleReset() {
      this.$refs.keyword.resetFields();
      this.handleSearch();
    }
  },
  mounted() {
    this.getAllStores();
  }
};
</script>
<style lang="less">
.courtesy {
  // padding: 0 20px;
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
    .table-mixin;
    // border-radius: 4px;
  }

  .courtesy-filter {
    // position: relative;

    .wkt-opt-label-container {
      .serach-mixin;
    }

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

.courtesy-list-tooltip-img {
  width: 150px;
}
</style>
