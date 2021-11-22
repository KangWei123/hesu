<template>
  <div class="cutprice-list wkt-card">
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

      <div v-for="(item,index) in tableData" :key="index" class="table-row">
        <el-row class="td-header">
          <el-col :span="8">
            发起时间：{{item.displayTime}}
          </el-col>
          <el-col :span="16">
            发起人：<img :src="item.initiateUserAvatar" class="leader-avatar" />{{item.initiateUserNickname || '******'}}
          </el-col>
        </el-row>
        <el-row class="td-body">
          <el-col :span="12">
            <div class="img-info">
              <div class="img-box">
                <img :src='item.thumbnail' alt="" />
              </div>
              <div class="name">活动名称：{{item.activityName}}</div>
            </div>
          </el-col>
          <el-col :span="6">
            <div>售价：<span>{{item.salePrice|price}}</span></div>
            <div>最低价：{{item.lowestPrice|price}}</div>
            <div>当前价：{{(item.salePrice - item.totalBargainPrice)|price}}</div>
          </el-col>
          <el-col :span="6">
            <div>砍价状态：<span :class="groupStatusClass(item.initiateStatus)">{{item.initiateStatusDesc}}</span></div>
            <div>
              <el-button type="primary" size="mini" style="width:125px;margin-top:10px" @click="onGotoDetail(item)">详情</el-button>
            </div>
          </el-col>
        </el-row>
      </div>

      <el-pagination layout="prev, pager, next, jumper, sizes, total" :total="totalCount" :page-size="page.pageSize" :current-page="page.pageNo" :page-sizes="[5, 10, 20, 30, 40, 50, 100]" @size-change="onSizeChange" @current-change="onPageChange" class="wkt-pagination">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import './list.less';
import api from '@/dss-wechat3rd/src/api/cutprice.js';
import { cutpriceStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import utilData from '@/dss-common/utils/date.js';

const bargainApi = api.bargain;

export default {
  props: {
    status: {
      type: Array,
      default() {
        return [];
      }
    },
    activityName: {
      type: String,
      default: ''
    },
    activityId: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNo: 1,
        itemName: ''
      },
      tableData: [], // 拼团列表
      totalCount: 0,
      isLoading: false,
      keyword: ''
    };
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
  watch: {
    activityName() {
      this.page.pageNo = 1;
      this.fetchData();
    },
    activityId(val) {
      if (val) {
        this.page.pageNo = 1;
        this.fetchData();
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  methods: {
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.fetchData();
    },
    onPageChange(page) {
      this.page.pageNo = page;
      this.fetchData();
    },
    fetchData() {
      const { page, activityName, activityId } = this;

      const params = {
        ...page,
        initiateStatus: this.status
      };
      if (activityName) {
        params.activityName = activityName;
      }
      if (activityId) {
        params.bargainId = activityId;
      }
      this.isLoading = true;
      bargainApi
        .initiateList(params)
        .done(res => {
          this.tableData = (res.data || []).map(groupInfo => {
            if (groupInfo.startTime) {
              groupInfo.displayTime = utilData.format(new Date(groupInfo.initiateTime));
            }
            return groupInfo;
          });
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.isLoading = false;
        });
    },
    onGotoDetail(item) {
      this.$router.push(
        `/marketing/cutprice/management/detail?bargainId=${item.id}&bargainInitiateId=${item.bargainInitiateId}`
      );
    }
  }
};
</script>

<style lang="less">
</style>
