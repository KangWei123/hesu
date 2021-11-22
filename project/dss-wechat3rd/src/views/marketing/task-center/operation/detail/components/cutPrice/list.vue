<template>
  <div class="cutprice-list wkt-card task-container" v-loading='isLoading'>
    <div class="wkb-group-table" v-if="tableData && tableData.length">
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

      <div v-for="(item,index) in tableData"
           :key="index"
           class="table-row">
        <el-row class="td-header">
          <el-col :span="8">
            发起时间：{{item.displayTime}}
          </el-col>
          <el-col :span="16">
            发起人：<img :src="item.initiateUserAvatar"
                 class="leader-avatar" />{{item.initiateUserNickname || '******'}}
            <span style="margin-left: 10px;">手机号：{{item.initiateUserPhone || '--'}}</span>
          </el-col>
        </el-row>
        <el-row class="td-body">
          <el-col :span="12">
            <div class="img-info">
              <div class="img-box">
                <img :src='item.thumbnail'
                     alt="" />
              </div>
              <div class="info-box">
                <div class="name">活动名称：{{item.activityName}}</div>
                <div class="goods-name">商品名称：{{item.itemName}}</div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div>售价：<span>{{item.salePrice |price}}</span></div>
            <div>最低价：{{item.lowestPrice |price}}</div>
            <div>当前价：{{item.salePrice - item.totalBargainPrice |price}}</div>
          </el-col>
          <el-col :span="6">
            <div style="margin-bottom:10px">砍价状态：<span :class="groupStatusClass(item.initiateStatus)">{{item.initiateStatusDesc}}</span></div>
            <div>
              <a style="margin-top:10px"
                 class="table-href"
                 @click="onGotoDetail(item)">详情</a>
            </div>
          </el-col>
        </el-row>
      </div>
      <el-pagination layout="prev, pager, next, jumper, sizes, total"
        :total="totalCount"
        :page-size="page.pageSize"
        :current-page="page.pageNo"
        :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
        @size-change="onSizeChange"
        @current-change="onPageChange"
        class="wkt-pagination">
      </el-pagination>
    </div>
    <place-holder v-else />
  </div>
</template>

<script>
import './list.less';
import api from '@/dss-wechat3rd/src/api/task-center.js';
import { cutpriceStatus } from '../../../../constants/enum';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
import utilData from '@/dss-common/utils/date.js';

export default {
  components: {
    PlaceHolder
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNo: 1
      },
      tableData: [],
      totalCount: 0,
      isLoading: false,
      recordList: [],
      orderNo: ''
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
    },
    async fetchData() {
      try {
        this.isLoading = true;
        let params = {
          pageNo: this.page.pageNo,
          pageSize: this.page.pageSize,
          shareId: this.$route.query.id
        };
        let res = await api.getTaskRecord(params);
        if (res && res.data) {
          const params = {
            ...this.page,
            ids: res.data.join()
          };
          this.isLoading = true;
          api
            .getTaskBargainList(params)
            .done(res => {
              this.tableData = (res.data || []).map(groupInfo => {
                if (groupInfo.startTime) {
                  groupInfo.displayTime = utilData.format(new Date(groupInfo.initiateTime));
                }
                return groupInfo;
              });
              this.orderNo = this.tableData.orderNo;
              this.totalCount = res.totalCount;
            })
            .always(res => {
              this.isLoading = false;
            });
        } else {
          this.isLoading = false;
        }
      } finally {
      }
    },
    onGotoDetail(item) {
      this.$router.push(
        `/marketing/task-center/operation/cutPrice/detail?bargainId=${item.id}&bargainInitiateId=${item.bargainInitiateId}`
      );
    }
  }
};
</script>

<style lang="less">
</style>
