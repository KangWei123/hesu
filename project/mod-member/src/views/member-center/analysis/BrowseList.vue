<template>
  <div>
    <el-table :data="browseList" class="wkt-table">
      <el-table-column label="浏览时间">
        <template slot-scope="scope">
          {{ scope.row.browseTime | formatDate }}
        </template>
      </el-table-column>
      <el-table-column label="浏览商品" min-width="180">
        <template slot-scope="scope">
          <div class="browse-box">
            <div class="browse-img">
              <img :src="scope.row.thumbnail" />
            </div>
            <div class="browse-desc">
              {{ scope.row.itemName }}
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="浏览来源">
        <template slot-scope="scope">
          {{ scope.row.source }}
        </template>
      </el-table-column>
      <el-table-column label="金额">
        <template slot-scope="scope">
          {{ scope.row.amount | price }}
        </template>
      </el-table-column>
      <el-table-column label="浏览次数">
        <template slot-scope="scope">
          {{ scope.row.browseCount }}
        </template>
      </el-table-column>
      <el-table-column label="加购次数">
        <template slot-scope="scope">
          {{ scope.row.addCartCount }}
        </template>
      </el-table-column>
      <el-table-column label="下单次数">
        <template slot-scope="scope">
          {{ scope.row.uniferOrderCount }}
        </template>
      </el-table-column>
      <el-table-column label="支付次数">
        <template slot-scope="scope">
          {{ scope.row.payResultCount }}
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      :total="totalCount"
      v-if="totalCount"
      :page-size="pageParams.pageSize"
      :current-page="pageParams.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
    >
    </el-pagination>
  </div>
</template>

<script>
  import memberApi from '@/mod-member/src/api/memberAPI.js';
  import datetime from '@/dss-common/utils/date.js';
  export default {
    components: {},
    name: 'BrowseList',
    data() {
      return {
        browseList: [],
        totalCount: 0,
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
      };
    },

    props: {
      // 会员id
      userId: {
        type: Number,
        default: null,
      },
    },
    mounted() {
      if (this.userId) {
        this.doSearch();
      }
    },
    filters: {
      formatDate(time) {
        const date = new Date(time);
        return datetime.format(date, 'YYYY-MM-DD');
      },
      toPageUnit(val) {
        const money = val;
        return money ? '￥' + money / 100 : '免费';
      },
    },
    methods: {
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.doSearch();
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.doSearch();
      },

      // 获取列表
      doSearch() {
        memberApi
          .getBrowseLog({
            pageNo: this.pageParams.pageNo,
            pageSize: this.pageParams.pageSize,
            memberId: this.userId,
          })
          .then(rs => {
            this.browseList = rs.data || [];
            this.totalCount = rs.totalCount;
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {});
      },
    },
  };
</script>

<style lang="less" scoped>
  .browse-box {
    display: inline-block;

    .browse-img {
      display: inline-block;

      img {
        width: 40px;
        height: 40px;
        vertical-align: middle;
      }
    }

    .browse-desc {
      display: inline-block;
      vertical-align: middle;
      margin-left: 20px;
    }
  }
</style>
