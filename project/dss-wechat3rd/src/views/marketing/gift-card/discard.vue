<template>
  <div class="gift-card-management marketing-page">
    <div class="gift-card-management-filter">
      <el-form inline
               class="wkt-opt-label-container"
               @submit.native.prevent>
        <el-form-item label="名称搜索：">
          <el-input @input="onSearch"
                    clearable
                    v-model="keyword"
                    placeholder="请输入礼品卡信息"></el-input>
        </el-form-item>
      </el-form>
    </div>
    <div :element-loading-text="msg.update" v-loading="loading.update" class="gift-card-discard">
      <el-table :data="tableData"
                style="width: 100%"
                v-loading="loading.list"
                class="wkt-table">
        <el-table-column prop="name"
                         label="名称"
                         class-name="stress-font">
        </el-table-column>
        <el-table-column prop="salePrice"
                         label="售价"
                         >
          <span slot-scope="scope">{{scope.row.salePrice|price}}</span>
        </el-table-column>
        <el-table-column prop="usableAmount"
                         label="面额"
                         >
          <span slot-scope="scope">{{scope.row.usableAmount|price}}</span>
        </el-table-column>
        <el-table-column prop="validityType"
                         label="有效期"
                         >
          <span slot-scope="scope">{{scope.row.validityType === 0 ? '永久有效' : scope.row.validity + '天'}}</span>
        </el-table-column>
        <el-table-column prop="buyLimit"
                         label="数量">
          <div slot-scope="scope">
            <div>总<span style="display:inline-block;width:14px;"></span>数：{{scope.row.buyLimit || '无限制'}}</div>
            <div>已销售：{{scope.row.buyCount || 0}}</div>
          </div>
        </el-table-column>
        <el-table-column prop="id"
                         label="操作"
                         :width="100">
          <span slot-scope="scope">
            <a class="table-href"
               @click="onGotoSellingDetail(scope.row)">售卖详情</a>
          </span>
        </el-table-column>
      </el-table>
      <!-- <el-pagination layout="prev, pager, next, jumper, sizes, total"
                     :total="totalCount"
                     :page-size="page.pageSize"
                     :current-page="page.pageNo"
                     :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
                     @size-change="onSizeChange"
                     @current-change="onPageChange"
                     class="wkt-pagination">
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
        type: cardEnum.cardType.giftCard,
        status: 0
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
      vm.fetchData(); // 获取废弃礼品卡列表
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
      this.$router.push(`/marketing/gift-card/mgr/selling-details?itemNo=${row.itemNo}&isDiscard=1`);
    },
    onGotoEdit(row) {
      this.$router.push(`/marketing/gift-card/mgr/edit?itemNo=${row.itemNo}`);
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
    }
  }
};
</script>

<style scoped lang="less">
@import '../marketing.less';
.gift-card-tips {
  text-align: right;
  height: 17px;
  font-size: 12px;
  font-family: PingFangSC-Regular;
  font-weight: 400;
  color: rgba(153, 153, 153, 1);
  line-height: 17px;

  .gift-card-tips-link {
    color: #2e8dff;
  }
}

.gift-card-management {
  .gift-card-management-filter {
    position: relative;
    .filter-box {
      position: absolute;
      right: 20px;
      top: 30px;
    }
    .wkt-opt-label-container {
      .serach-mixin;
    }
  }
  .gift-card-discard {
    .table-mixin;
    background: #fff;
    border-radius: 4px;
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
