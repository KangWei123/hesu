<template>
  <div class="mk-group-list">
    <div v-if="tableData && tableData.length" class="wkb-group-table">
      <div v-for="(item, index) in tableData" :key="index" class="table-row">
        <el-row class="td-header">
          <el-col :span="8"> 发起时间：{{ item.displayTime }} </el-col>
          <el-col :span="16">
            发起人：<img :src="item.leaderAvatar" class="leader-avatar" />{{ item.leaderNickName || '******' }}
            <span style="margin-left: 100px;">手机号：{{ item.leaderPhone || '' }}</span>
          </el-col>
        </el-row>
        <el-row class="td-body">
          <el-col :span="12">
            <div class="img-info">
              <div class="activity-name">
                <el-tooltip placement="bottom">
                  <div slot="content">{{item.activityName}}</div>
                  <div class="name">{{item.activityName}}</div>
                </el-tooltip>
              </div>
              <div class="img-box">
                <img :src="item.thumbnail" alt="" />
              </div>
              <div class="info">
                <!-- <div class="name">活动名称：{{ item.activityName }}</div> -->
                <div class="goods-name">商品名称：{{ item.itemName }}</div>
                <div class="discount">
                  团长优惠：<span class="price">￥{{ (item.leaderProm || 0) | price }}</span>
                </div>
              </div>
            </div>
          </el-col>
          <el-col :span="6">
            <div>
              拼团状态：<span :class="groupStatusClass(item.status)">{{ getStatus(item.status) }}</span>
            </div>
            <div>人数要求：{{ item.requirePeople }}</div>
            <div>当前人数：{{ item.userCount }}人 {{ item.robotCount > 0 ? '+' + item.robotCount + '虚拟' : '' }}</div>
          </el-col>
          <el-col :span="6">
            <a href="javascript:;" class="table-href" @click="onGotoDetail(item.groupNo)">团购详情</a>
          </el-col>
        </el-row>
      </div>
    </div>
    <place-holder v-else></place-holder>
    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
      hide-on-single-page
      :total="totalCount"
      v-if="totalCount"
      :page-size="page.pageSize"
      :current-page="page.pageNo"
      :page-sizes="[5, 10, 20, 30, 40, 50, 100]"
      @size-change="onSizeChange"
      @current-change="onPageChange"
      class="wkt-pagination"
    >
    </el-pagination>
  </div>
</template>

<script>
import './List.less';
import groupApi from '@/dss-wechat3rd/src/api/group';
import { groupStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import utilData from '@/dss-common/utils/date.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';

export default {
  components: {
    PlaceHolder
  },
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
    },
    storeIds: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      page: {
        pageSize: 10,
        pageNo: 1
      },
      tableData: [], // 拼团列表
      totalCount: 0,
      isLoading: false
    };
  },
  computed: {
    groupStatusClass() {
      return function(status) {
        switch (status) {
          case groupStatus.SUCCESS:
            return 'success';
          case groupStatus.ON_PROGRESS:
            return 'onProgress';
          default:
            return 'failed';
        }
      };
    }
  },
  watch: {
    storeIds() {
      this.page.pageNo = 1;
      this.fetchData();
    },
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
      const { page, activityName, activityId, storeIds } = this;

      const params = {
        ...page,
        statusList: this.status
      };
      if (activityName) {
        params.activityName = activityName;
      }
      if (activityId) {
        params.activityId = activityId;
      }
      if (storeIds) {
        params.storeIds = storeIds;
      }

      this.isLoading = true;
      groupApi
        .groupQuery(params)
        .done(res => {
          this.tableData = (res.data || []).map(groupInfo => {
            if (groupInfo.startTime) {
              groupInfo.displayTime = utilData.format(new Date(groupInfo.startTime));
            }
            return groupInfo;
          });
          this.totalCount = res.totalCount;
        })
        .always(res => {
          this.isLoading = false;
        });
    },
    getStatus(status) {
      switch (status) {
        case groupStatus.SUCCESS:
          return '拼团成功';
        case groupStatus.ON_PROGRESS:
          return '拼团中';
        default:
          return '拼团失败';
      }
    },
    onGotoDetail(groupNo) {
      this.$router.push(`/marketing/pintuan/management/detail?group=${groupNo}&activityId=${this.activityId}`);
    }
  }
};
</script>

<style>
</style>
