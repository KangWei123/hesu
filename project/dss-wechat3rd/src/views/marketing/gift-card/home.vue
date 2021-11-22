<template>
  <div class="gift-card-management marketing-page">
    <div class="Add-Manage-Button">
        <el-button @click="onAdd"
                   icon="el-icon-plus"
                   type="primary">添加礼品卡
        </el-button>
      </div>
    <div class="gift-card-management-filter">
      <el-form inline
               class="wkt-opt-label-container"
               @submit.native.prevent>
        <el-form-item label="礼品卡名称：">
          <el-input v-model="keyword"
                    @input="onSearch"
                    clearable
                    maxlength="16"
                    placeholder="请输入礼品卡信息"></el-input>
        </el-form-item>
      </el-form>
      <div class="gift-card-tips">注意：添加礼品卡后，请到
        <a @click="toGiftCard"
           class="gift-card-tips-link">页面装修</a>将礼品卡配置
      </div>
    </div>
    <div v-loading="loading.update" :element-loading-text="msg.update" class="gift-card-table">    
      <el-table :data="tableData"
                style="width: 100%"
                v-loading="loading.list"
                class="wkt-table">
        <el-table-column prop="name"
                         label="名称"
                         class-name="stress-font">
        </el-table-column>
        <el-table-column prop="salePrice"
                         label="售价">
          <span slot-scope="scope">{{scope.row.salePrice|price}}</span>
        </el-table-column>
        <el-table-column prop="usableAmount"
                         label="面额">
          <span slot-scope="scope">{{scope.row.usableAmount|price}}</span>
        </el-table-column>
        <el-table-column prop="validityType"
                         label="有效期">
          <span slot-scope="scope">{{scope.row.validityType === 0 ? '永久有效' : scope.row.validity + '天'}}</span>
        </el-table-column>
        <el-table-column prop="buyLimit"
                         label="数量">
          <div slot-scope="scope">
            <div>总
              <span style="display:inline-block;width:14px;"></span>数：{{scope.row.buyLimit || '无限制'}}</div>
            <div>已销售：{{scope.row.buyCount || 0}}</div>
          </div>
        </el-table-column>
        <el-table-column prop="status"
                         label="状态"
                         width="180">
          <template slot-scope="scope">
            <div class="goods-shlef">
              <el-switch
                style="display: block;cursor: pointer;"
                v-model="!!scope.row.isShelf"
                active-color="#52C41A"
                inactive-color="#B1B5BD"
                :active-value="true"
                :inactive-value="false"
                @change="setShelf(scope.row)"
                active-text="上架"
                inactive-text="下架">
              </el-switch>
<!-- 
              <el-button :class="scope.row.isShelf === 1 ? 'status-shelf' : 'status-unshelf' ">
                已{{scope.row.isShelf === 1 ? '上架': '下架'}}
              </el-button>
              <span class="divider"></span>
              <a class="market-shelf"
                 @click="setShelf(scope.row)">
                {{scope.row.isShelf === 1 ? '下架' : '上架' }}
              </a> -->
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="id"
                         label="操作"
                         :width="150">
          <span slot-scope="scope">
            <a class="table-href"
               @click="onGotoSellingDetail(scope.row)">售卖详情</a>
            <a class="table-href"
               v-if="false"
               @click="onGotoSellingDetail(scope.row)">编辑</a>
            <a class="table-delete"
               v-if="scope.row.isShelf !== 1"
               @click="onGotoDel(scope.row)">删除</a>
          </span>
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
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
      </el-pagination> -->
      
    </div>
  </div>
</template>

<script>
import itemCardApi from '@/dss-wechat3rd/src/api/wx-item-card.js';
import { groupActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum.js';

export default {
  data() {
    return {
      tableData: [],
      page: {
        pageNo: 1,
        pageSize: 20,
        itemName: '',
        type: cardEnum.cardType.giftCard
      },
      totalCount: 0,
      status: groupActivityStatus,
      loading: {
        update: false,
        list: false
      },
      msg: {
        update: ''
      },
      keyword: ''
    };
  },
  // 钩子函数执行列表查询接口，为了保持搜索条件记录，同时避免新增及编辑时不刷新数据
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fetchData(); // 获取礼品卡列表
    });
  },

  mounted() {},
  methods: {
    onAdd() {
      this.$router.push('/marketing/gift-card/mgr/edit');
    },
    onGotoDetail(row) {
      this.$router.push(`/marketing/cutprice/management?activityId=${row.id}`);
    },
    onGotoSellingDetail(row) {
      this.$router.push(`/marketing/gift-card/mgr/selling-details?itemNo=${row.itemNo}`);
    },
    onGotoEdit(row) {
      this.$router.push(`/marketing/gift-card/mgr/edit?itemNo=${row.itemNo}`);
    },
    onGotoDel(row) {
      this.$confirm('礼品卡删除后不可撤销，已购买的礼品卡可继续使用，是否确认删除? ', '删除礼品卡', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          itemCardApi.delete({ itemNo: row.itemNo }).done(res => {
            this.$message({
              message: '删除成功',
              type: 'success'
            });
            this.fetchData();
          });
        })
        .catch(() => {
          console.log('取消删除礼品卡');
        });
    },
    setShelf(row) {
      let title = '上架提醒';
      let msg = '此礼品卡一旦上架，<span style="color:red">即使下架，也不可以再修改内容，</span>你还要继续吗？';
      let successMsg = '上架成功';
      let loadingMsg = '请稍候，正在上架中...';
      let shelf = 1;
      if (row.isShelf === 1) {
        title = '下架提醒';
        msg = '确定要下架吗？';
        successMsg = '下架成功';
        loadingMsg = '请稍候，正在下架中...';
        shelf = 0;
      }

      this.$confirm(msg, title, {
        dangerouslyUseHTMLString: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      })
        .then(() => {
          this.msg.update = loadingMsg;
          this.loading.update = true;
          itemCardApi
            .shelf({ itemNo: row.itemNo, shelf })
            .done(res => {
              this.$message({
                message: successMsg,
                type: 'success'
              });
              this.fetchData();
            })
            .always(res => {
              this.loading.update = false;
            });
        })
        .catch(() => {
          console.log('取消');
        });
    },
    fetchData() {
      const params = {
        ...this.page
      };
      this.loading.list = true;
      itemCardApi
        .query_list(params)
        .done(res => {
          this.tableData = res.data;
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.loading.list = false;
        });
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchData();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },
    onSearch() {
      this.page.itemName = this.keyword;
      this.page.pageNo = 1;
      this.fetchData();
    },
    toGiftCard() {
      this.$router.switchPage('/setting/homedecorate');
    }
  }
};
</script>

<style scoped lang="less">
@import '../marketing.less';
.gift-card-tips {
  text-align: left;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: #A1A4AB;
  line-height: 17px;
  padding-left: 20px;
  padding-bottom: 16px;

  .gift-card-tips-link {
    color: #2e8dff;
  }
}

.gift-card-management {
  .gift-card-management-filter {
    background: #fff;
    .wkt-opt-label-container {
      .serach-mixin;
      padding-bottom: 0px;
    }
  }
  .gift-card-table {
    background: #fff;
    .table-mixin;
    /deep/ .el-switch.is-disabled .el-switch__core,
    .el-switch.is-disabled .el-switch__label {
    cursor: pointer;
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
</style>
