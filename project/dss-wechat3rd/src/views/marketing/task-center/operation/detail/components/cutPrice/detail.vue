<template>
  <div>
    <PageHeader><router-link style="color:#333" to><span @click="$router.back()">砍价列表</span></router-link>/砍价详情</PageHeader>
    <div class="cutprice-detail wkt-card" v-loading='isLoading'>
      <div class="wkb-group-table">
        <el-row class="table-header">
          <el-col :span="12">
            活动名称
          </el-col>
          <el-col :span="6">
            状态
          </el-col>
          <el-col :span="6">
            操作
          </el-col>
        </el-row>

        <div class="table-row">
          <el-row class="td-header">
            <el-col :span="8">
              发起时间：{{activity && activity.displayTime}}
            </el-col>
            <el-col :span="16">
              发起人：<img :src="activity && activity.initiateUserAvatar"
                   class="leader-avatar" />{{(activity && activity.initiateUserNickname) || '******'}}
            </el-col>
          </el-row>
          <el-row class="td-body">
            <el-col :span="12">
              <div class="img-info">
                <div class="img-box">
                  <img :src='activity && activity.thumbnail'
                       alt="" />
                </div>
                <div class="info-box">
                  <div class="name">活动名称：{{activity.activityName}}</div>
                  <div class="goods-name">商品名称：{{activity.itemName}}</div>
                </div>
              </div>
            </el-col>
            <el-col :span="6">
              <div>售价：{{activity.salePrice |price}}</div>
              <div>最低价：{{activity.lowestPrice |price}}</div>
              <div>当前价：{{(activity.salePrice - activity.totalBargainPrice) |price}}</div>
            </el-col>
            <el-col :span="6">
              <div>砍价状态：<span :class="groupStatusClass(activity.initiateStatus)">{{activity.initiateStatusDesc}}</span></div>
            </el-col>

            <el-col :span="24">
              <div class="split-line">砍价详情({{activity.bargainAssistDTOS &&activity.bargainAssistDTOS.length}})</div>
            </el-col>
            <el-col :span="24"
                    class="user-list">
              <div v-for="(user,index) in activity.bargainAssistDTOS"
                   :key="index"
                   class="user-item">
                <img :src="user.userAvatar"
                     class="user-avatar" />

                <div class="user-name">
                  {{user.userNickname || '******'}}
                </div>
                <div class="price">
                  ￥{{user.bargainPrice|price}}
                </div>
              </div>
            </el-col>
          </el-row>
        </div>
      </div>
      <div style="text-align:center;">
        <el-button size="mini"
          type="primary"
          style="width:120px;margin: 10px 0px;"
          @click="$router.back()">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script>
import './list.less';
import api from '@/dss-wechat3rd/src/api/task-center.js';
import { cutpriceStatus } from '../../../../constants/enum';
import utilData from '@/dss-common/utils/date.js';
import PageHeader from '../../../../components/page-header-tab/page-header';

export default {
  components: {
    PageHeader
  },
  data() {
    return {
      isLoading: false,
      page: {
        pageSize: 10,
        pageNo: 1
      },
      bargainId: '',
      bargainInitiateId: '',
      activity: {}
    };
  },
  filters: {
    price(value, scale = 100) {
      return value ? (value / scale).toFixed(2) : '0.00';
    }
  },
  computed: {
    groupStatusClass() {
      return function(status) {
        if (cutpriceStatus.isSuccess(status)) {
          return 'success';
        }
        switch (status) {
          case cutpriceStatus.ON_GOING:
            return 'onProgress';
          default:
            return 'failed';
        }
      };
    }
  },
  mounted() {
    const { bargainId, bargainInitiateId } = this.$route.query;
    this.bargainId = bargainId;
    this.bargainInitiateId = bargainInitiateId;
    this.fetchData();
  },
  methods: {
    fetchData() {
      const { bargainId, bargainInitiateId } = this;
      const params = {
        bargainId,
        bargainInitiateId
      };
      this.isLoading = true;
      api
        .initiateDetail(params)
        .done(res => {
          this.activity = res.data || {};
          this.activity.displayTime = utilData.format(new Date(this.activity.initiateTime));
        })
        .always(res => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style lang="less">
.cutprice-detail {
  .user-list {
    padding: 0 0 15px 15px !important;

    .user-item {
      display: inline-block;
      margin-right: 20px;

      .user-avatar {
        width: 80px;
        height: 80px;
        border-radius: 50%;
      }

      .user-name {
        text-align: center;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 80px;
        overflow: hidden;
      }

      .price {
        color: #ff562d;
        text-align: center;
      }
    }
  }
  .info-box {
    color: #31343b;
    font-weight: bold;
    margin-left: 5px;
    .name {
      display: block;
      margin-left: 0;
    }
    .goods-name {
      display: block;
    }
  }
  .split-line {
    border-bottom: 1px solid rgb(228, 231, 237);
    margin: 0px 15px 10px 15px;
    font-weight: bold;
    padding-left: 0 !important;
    box-sizing: border-box;
  }
}
</style>
