<template>
  <div class="record">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/share-gift' }">分享有礼</el-breadcrumb-item>
      <el-breadcrumb-item>活动记录</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="record-filter">
      <el-form inline class="wkt-opt-label-container" :model="keyword" ref="keyword">
        <el-form-item label="手机号：" prop="tel">
          <el-input
            placeholder="搜索手机号"
            @input="handleSearch"
            v-model.trim="keyword.tel"
            clearable
          ></el-input>
        </el-form-item>

        <el-form-item label="奖励：" prop="award">
          <el-select clearable v-model="keyword.award" placeholder="选择分享奖励" @change="handleReward">
            <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button class="search-btn" @click="handleReset">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="record-list">
      <el-table :data="recordData" class="wkt-table">
        <el-table-column align="center" prop="" label="参与者">
          <template slot-scope="scope">
            <div class="user-info" v-if="scope.row.userNickname">
              <img class="user-avatar" :src="scope.row.userAvatar" alt="" />
              <span>{{ scope.row.userNickname }}</span>
            </div>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="phoneNumber" label="手机号" />
        <el-table-column align="center" label="奖励时间">
          <template slot-scope="scope">
            <span>{{ scope.row.rewardTime | fitTime }}</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="shareReward" :formatter="rewardFormatter" label="分享奖励" />
        <el-table-column align="center" label="奖励详情">
          <template slot-scope="scope">
            <span>{{ scope.row | rewardDetails }}</span>
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
import shareApi from '@/dss-wechat3rd/src/api/share-gift';
import utils from '@/dss-common/utils/index';
import { mapState } from 'vuex';
export default {
  data() {
    return {
      keyword: {
        tel: '',
        award: ''
      },
      options: [
        {
          value: 1,
          label: '积分'
        },
        {
          value: 2,
          label: '优惠券'
        }
      ],
      recordData: [],
      page: {
        pageSize: 10,
        pageCount: 1
      },
      totalCount: 0,
      sharePresentRecordId: null
    };
  },
  filters: {
    fitTime(value) {
      return utils.timeFormat(value, 'YYYY-MM-DD HH:mm:ss');
    },
    rewardDetails(row) {
      if (row.shareReward == 1) {
        return row.rewardDetails + '积分';
      }
      let fp = function(mony) {
        return parseFloat((mony / 100).toFixed(2));
      };
      let rewardDetails = JSON.parse(row.rewardDetails);
      // console.log(row);
      return (
        rewardDetails.name + '(' + '满' + fp(rewardDetails.minimumFee) + '减' + fp(rewardDetails.discountFee) + ')'
      );
    }
  },
  computed: {
    ...mapState({
      userInfo: state => state.userInfo,
      allStoreList: 'storeList'
    })
  },
  methods: {
    handleSearch() {
      this.getRecord();
    },
    rewardFormatter(row, column, cellValue, index) {
      return cellValue == '1' ? '积分' : '优惠券';
    },
    handleReward() {
      this.getRecord();
    },
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.getRecord();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.getRecord();
    },
    //调取活动记录
    getRecord() {
      let params = {
        sharePresentRecordId: this.sharePresentRecordId,
        phoneNumber: this.keyword.tel ? this.keyword.tel : '',
        shareReward: this.keyword.award ? this.keyword.award : '',
        ...this.page
      };
      shareApi.queryRecordById(params).then(res => {
        const { data, totalCount } = res;
        this.recordData = data || [];
        this.totalCount = totalCount;
      });
    },
    handleReset() {
      this.$refs.keyword.resetFields();
      this.handleSearch();
    }
  },
  mounted() {
    this.sharePresentRecordId = this.$route.query.sharePresentRecordId;
    if (this.sharePresentRecordId) {
      console.log('sharePresentRecordId->', this.sharePresentRecordId);
      this.getRecord();
    } else {
      return;
    }
  }
};
</script>
<style lang="less">
.record {
  .title {
    height: 50px;
    font-size: 20px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: #333333;
    line-height: 50px;
  }
  .record-list {
    // padding: 20px 0;
    // margin: 0 20px;
    background: white;
    .table-mixin;
    // border-radius: 4px;
  }
  .user-info {
    display: flex;
    align-items: center;
  }
  .user-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    margin-right: 13px;
  }
  .record-filter {
    position: relative;
    .wkt-opt-label-container {
      .serach-mixin;
    }
    .el-input__inner {
      border-radius: 4px 0 0 4px;
    }
  }
}
</style>
