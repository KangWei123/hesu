<template>
  <div class="redpacket-log">
    <div class="wkb-group-table" v-if="tableData && tableData.length">
      <el-row class="table-header">
        <el-col :span="4" style="padding-left: 20px">
          参与者
        </el-col>
        <el-col :span="4">
          发起时间
        </el-col>
        <el-col :span="3">
          发起人
        </el-col>
        <el-col :span="3">
          获得红包
        </el-col>
        <el-col :span="2">
          状态
        </el-col>
        <el-col :span="5">
          参与时间
        </el-col>
        <el-col :span="3">
          红包状态
        </el-col>
      </el-row>

      <div v-for="(item, index) in tableData" :key="index" class="table-row">
        <el-row class="td-header">
          <el-col :span="4"> 总额：{{ item.totalFee | price }}元 </el-col>
          <el-col :span="4">
            {{ item.displayTime }}
          </el-col>
          <el-col :span="3">
            <img :src="item.leaderAvatar" class="leader-avatar" />{{ item.leaderNickName || '******' }}
          </el-col>
          <el-col :span="3"> 所需人数：{{ item.quantity }}人 </el-col>
          <el-col :span="3">
            <span v-if="item.status === redpacketEnum.status.UNDERWAY">进行中</span>
            <span v-if="item.status === redpacketEnum.status.SUCCESS">已完成</span>
            <span v-if="item.status === redpacketEnum.status.FAILED">失败</span>
            <span v-if="item.status === redpacketEnum.status.END">已结束</span>
          </el-col>
        </el-row>
        <el-row v-for="(user, index) in item.users" :key="index" class="td-body">
          <el-col :span="11">
            <img :src="user.avatarImgUrl" class="leader-avatar" />{{ user.nickname || '******' }}
          </el-col>
          <el-col :span="5"> ￥{{ user.luckyMoneyFee | price }} </el-col>
          <el-col :span="5">
            {{ user.displayTime }}
          </el-col>
          <el-col :span="3" v-if="user.cashWithdrawalType === 1">
            {{ user.cashWithdrawalStatus | fCashStatus }}
          </el-col>
          <el-col :span="3" v-if="user.cashWithdrawalType !== 1">
            {{ user.useStatus | fUseStatus }}
          </el-col>
        </el-row>
      </div>
    </div>

    <place-holder v-else></place-holder>

    <el-pagination
      layout="prev, pager, next, jumper, sizes, total"
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
import './record-list.less';
import redpacketApi from '@/dss-wechat3rd/src/api/redpacketApi.js';
import redpacketEnum from '@/dss-wechat3rd/src/constants/redpacketEnum.js';
import utilData from '@/dss-common/utils/date.js';
import PlaceHolder from '@/dss-common/components/placeholder/index.vue';
const UseStates = {
  0: '不可用',
  1: '可用',
  2: '已过期',
  3: '已使用',
  4: '已删除'
};
const CashStatus = {
  1: '提现状态',
  0: '未提现',
  1: '提现中',
  2: '已提现'
};
export default {
  components: {
    PlaceHolder
  },
  props: {
    nickname: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      redpacketEnum,
      page: {
        pageSize: 10,
        pageNo: 1
      },
      tableData: [], // 列表
      totalCount: 0,
      isLoading: false
    };
  },
  filters: {
    fUseStatus(value) {
      return UseStates[value];
    },
    fCashStatus(value) {
      return CashStatus[value];
    }
  },
  watch: {
    nickname() {
      this.page.pageNo = 1;
      this.doSearch();
    }
  },

  mounted() {
    this.doSearch();
  },

  methods: {
    onSizeChange(size) {
      this.page.pageSize = size;
      this.page.pageNo = 1;
      this.doSearch();
    },

    onPageChange(page) {
      this.page.pageNo = page;
      this.doSearch();
    },

    doSearch() {
      this.isLoading = true;
      let params = Object.assign({}, this.page);
      console.log(params);
      if (this.nickname) {
        params.nickname = this.nickname;
      }
      redpacketApi
        .records({ ...params })
        .then(rs => {
          //根据userid从users中获取发起人信息，时间转换
          this.tableData = (rs.data || []).map(info => {
            if (info.createTime) {
              info.displayTime = utilData.format(new Date(info.createTime));
            }
            let users = info.users || [];

            users.forEach(item => {
              if (item.createTime) {
                item.displayTime = utilData.format(new Date(item.createTime));
              }
              if (item.userId === info.userId) {
                info.leaderAvatar = item.avatarImgUrl;
                info.leaderNickName = item.nickname;
              }
            });
            console.log(info);
            return info;
          });
          this.totalCount = rs.totalCount;
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.isLoading = false;
        });
    }
  }
};
</script>

<style></style>
