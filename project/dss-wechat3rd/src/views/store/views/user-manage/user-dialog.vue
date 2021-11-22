<template>
  <el-dialog
    title="用户详情"
    class="user-editor-dialog"
    v-if="showMemberEditor"
    :visible.sync="showMemberEditor"
    width="480px"
    append-to-body
    :before-close="closeHandler"
  >
    <div class="user-from">
      <div class="head">
        <img class="user-img" :src="'data:image/jpeg;base64,' + userData.image" />
        <div class="user-box">
          <div class="user-item">
            <span>用户ID：</span>{{ userData.customerId }} <span style="margin-left: 50px">姓名：</span
            >{{ userData.name }}
          </div>
          <div class="user-item">
            <span>性别：</span>{{ userData.sex }} <span style="margin-left: 84px">年龄：</span>{{ userData.age }}
          </div>
          <div class="user-item">
            <span>手机：</span>{{ userData.phone || '无' }} <span style="margin-left: 96px">到店次数：</span
            >{{ totalCount || userData.enterCount }}
          </div>
          <!-- <div class="user-item"><span>是否会员：</span>{{userData.memberType === 1? '是': '否'}}
            <a class="dss-link"
               @click="gotoMember"
               href="javascript:;"
               v-if="userData.memberType === 1 && userData.memberId">查看更多</a></div> -->
          <div class="user-item">
            <span>用户类型：</span>{{ curUserType }}
            <a
              class="dss-link"
              @click="gotoMember"
              href="javascript:;"
              v-if="userData.memberType === 1 && userData.memberId"
              >查看更多</a
            >
          </div>
        </div>
      </div>
      <div class="user-foot">
        <div class="user-item">
          <span>备注：{{ userData.remark }}</span>
        </div>
        <!-- <div class="user-item"><span>到店次数：{{totalCount||userData.enterCount}}</span></div> -->
        <div class="store-table-title">区域记录</div>
        <div class="store-table">
          <div class="store">
            <div class="store-order">抓拍时间</div>
            <div class="store-time">门店</div>
            <div class="store-device">区域</div>
          </div>
          <template>
            <template v-if="recordList && recordList.length">
              <div class="store" v-for="(item, index) in recordList" :key="index">
                <div class="store-order">{{ formatDate(item.enterTime) }}</div>
                <div class="store-time">{{ item.storeName }}</div>
                <div class="store-device">{{ item.areaName || '-' }}</div>
              </div>
            </template>
            <div v-else class="store-table-title" style="padding: 4px 0">暂无数据</div>
          </template>
        </div>

        <el-pagination
          layout="sizes, prev, pager, next, total"
          :total="totalCount"
          :page-size="pageParams.pageSize"
          :current-page="pageParams.pageNo"
          :page-sizes="[5, 10, 20, 30, 40, 50]"
          @size-change="onSizeChange"
          @current-change="onPageChange"
          style="text-align: right"
        >
        </el-pagination>
      </div>
    </div>
  </el-dialog>
</template>
<script>
  import cameraFlowApi from '@/dss-common/api/camera-flow.js';
  import utils from '@/dss-common/utils/date.js';
  import newCameraFlowApi from '../../api/camera-flow.js';
  export default {
    name: 'userDialog',
    components: {},
    props: {
      //是否弹窗
      showMemberEditor: {
        type: Boolean,
        default: false,
      },
      //用户数据
      userData: {
        type: Object,
        default: function () {
          return {};
        },
      },
      //关闭弹窗函数
      closeHandler: {
        type: Function,
      },
    },
    watch: {
      userData: {
        deep: true,
        handler() {},
      },
    },
    data() {
      return {
        recordList: [],
        totalCount: 0,
        userid: null,
        pageParams: {
          pageNo: 1,
          pageSize: 10,
        },
      };
    },
    computed: {
      curUserType() {
        const userType = ['普通用户', '会员', '店员', '黑名单'];
        return userType[this.userData.memberType || 0];
      },
    },
    mounted() {
      this.getRecord();
    },
    methods: {
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        this.getRecord();
      },

      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        this.getRecord();
      },

      gotoMember() {
        window.location.href = '/dmp.html#/vip/members/list/detail?id=' + this.userData.memberId;
      },

      formatDate(strDate) {
        if (!strDate) {
          return '';
        }
        return utils.format(new Date(strDate), 'MM/DD HH:mm:ss', 8);
      },

      //获取会员id
      getQueryMember() {
        cameraFlowApi
          .getQueryMember({ phone: this.userData.phone })
          .then(result => {
            this.userid = result.data;
          })
          .always(() => {
            this.loading = false;
          });
      },

      //获取到店记录
      getRecord() {
        let params = { ...this.pageParams, customerId: this.userData.customerId };
        // memberApi
        // .getStoreLog(params)
        newCameraFlowApi
          .getUserTrack(params)
          .then(result => {
            this.recordList = result.data || [];
            this.totalCount = result.totalCount;
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .user-from {
    // padding: 0 20px 20px 20px;
    padding-bottom: 20px;
    color: #333333;
    font-size: 12px;

    .head {
      overflow: hidden;
      .user-img {
        width: 120px;
        height: 120px;
        border-radius: 4px;
        float: left;
      }
      .user-box {
        float: left;
        margin-left: 20px;
        .user-item {
          margin-bottom: 15px;
        }
        .user-item:last-child {
          margin-bottom: 0px;
        }
      }
    }
    .user-foot {
      margin-top: 20px;
      .user-item {
        margin: 5px 0;
      }
      .store-table-title {
        text-align: center;
      }
      .store-table {
        margin-top: 10px;
        border: 1px solid rgba(228, 231, 237, 0.5);
        overflow: hidden;
      }
      .store:last-child {
        border: none;
      }
      .store {
        padding: 5px 0;
        border-bottom: 1px solid rgba(228, 231, 237, 0.5);
        .store-order {
          display: inline-block;
          width: 33%;
          text-align: center;
        }
        .store-time {
          display: inline-block;
          width: 33%;
          text-align: center;
        }

        .store-device {
          display: inline-block;
          width: 30%;
          text-align: center;
        }
      }
    }
    a.dss-link {
      color: #2e8dff;
      font-size: 12px;
      height: 16px;
      line-height: 16px;
      margin-left: 10px;
    }
  }
</style>
