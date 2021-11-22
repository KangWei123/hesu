<template>
  <list-page-layout>
    <template #main-actions>
      <el-button type="primary" @click="$router.push({ path: '/feedback/feedbackSet' })">配置快捷回复</el-button>
    </template>
    <template #filters>
      <el-form
        ref="query"
        @submit.prevent.native="$refs.query.search()"
        :model="form"
        inline
        label-width="80px"
        label-suffix=":"
      >
        <el-form-item label="反馈时间" prop="time">
          <date-range-picker v-model="form.time" type="daterange"></date-range-picker>
        </el-form-item>
        <br />
        <el-form-item label="手机号" prop="phone">
          <el-input class="w220" placeholder="请输入手机号" v-model.trim="form.phone" :maxlength="32" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select class="w220" placeholder="请选择状态" v-model="form.status" clearable>
            <el-option v-for="item of STATUS_OPTIONS" :key="item.key" :label="item.label" :value="item.key" />
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button plain @click="$refs.query.resetFields()">重置</el-button>
        </el-form-item>
      </el-form>
    </template>
    <fat-table class="table-main" ref="table" :fetch-handler="handleFetch" :state.sync="form" row-key="id">
      <el-table-column label="用户" label-class-name="member-cell" width="300">
        <template slot-scope="scope">
          <div class="member-info">
            <img class="avatar" :src="scope.row.memberAvatarImg || defaultAvatar" />
            <div class="member-desc">
              <div class="user-name">
                {{ scope.row.memberNickName || '-' }}
              </div>
              <span>{{ scope.row.phone }}</span>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="反馈内容" width="700">
        <template slot-scope="scope">
          <div class="feedback-main">
            <div class="content">
              <div class="contentStyle">{{ scope.row.feedBackContent }}</div>
              <div class="time-scope">{{ scope.row.feedBackTime }}</div>
              <div class="img-box" v-if="scope.row.feedBackImage">
                <div class="userImg" v-for="(item, index) in toArray(scope.row.feedBackImage)" :key="index">
                  <el-image
                    style="width: 48px; height: 48px"
                    :src="item"
                    :preview-src-list="toArray(scope.row.feedBackImage)"
                  >
                  </el-image>
                </div>
              </div>
            </div>

            <div class="content" style="margin-top: 18px" v-if="scope.row.status === STATUS.REPLIED">
              <div class="desc">{{ scope.row.storeName }}&nbsp;:&nbsp;{{ scope.row.replyContent }}</div>
              <div class="time-scope">{{ scope.row.replyTime }}</div>
              <div class="img-box" v-if="scope.row.replyImage">
                <div class="userImg" v-for="(item, subIndex) in toArray(scope.row.replyImage)" :key="subIndex">
                  <el-image
                    style="width: 48px; height: 48px"
                    :src="item"
                    :preview-src-list="toArray(scope.row.replyImage)"
                  >
                  </el-image>
                </div>
              </div>
            </div>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="操作" fixed="right" align="left" v-slot="scope" min-width="300px">
        <table-actions :max="5" :options="tableActions(scope.row)" />
      </el-table-column>
    </fat-table>
    <reply-dialog ref="reply" @update="$refs.table.refresh()" />
  </list-page-layout>
</template>

<script>
  import { ListPageLayout, FatTable, TableActions } from '@/dss-common/components/list-page/index';
  import DateRangePicker from '@/dss-common/components/date-range-picker';
  import feedBackApi from '@/dss-wechat3rd/src/api/feedback';
  import ReplyDialog from './reply-dialog.vue';
  import cdnResConfig from '@/business-common/utils/cdnResConfig';
  import { STATUS_OPTIONS, STATUS } from './statusEnum';

  export default {
    components: {
      ListPageLayout,
      FatTable,
      TableActions,
      DateRangePicker,
      ReplyDialog,
    },
    data() {
      return {
        form: {
          phone: null,
          status: this.$route.query.status ? +this.$route.query.status : null,
          time: [],
        },
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        STATUS_OPTIONS,
        STATUS,
      };
    },
    computed: {
      toArray() {
        return img => {
          return img && img.split(',');
        };
      },
    },
    methods: {
      tableActions(row) {
        return [
          row.status !== this.STATUS.REPLIED && {
            name: '回复',
            onClick: () => {
              this.$refs.reply.show(row);
            },
          },
          // {
          //   name: '删除',
          //   onClick: () => {
          //     this.$refs.table.remove(row.id);
          //   },
          // },
        ].filter(Boolean);
      },
      async handleFetch(params) {
        // 分页信息
        const { pagination } = params;
        const { time, status, ...other } = this.form;

        // 请求参数
        const payload = {
          ...other,
          status: status || null,
          pageNo: pagination.currentPage,
          pageSize: pagination.pageSize,
        };

        if (time && time.length) {
          const [startTime, endTime] = time;
          payload.startTime = startTime;
          payload.endTime = endTime;
        }
        const { data, totalCount } = await feedBackApi.getFeedBackList(payload);
        return {
          list: data,
          total: totalCount,
        };
      },
    },
  };
</script>

<style lang="less" scoped>
  .table-main {
    .member-info {
      display: flex;
      flex-direction: row;
      align-items: center;

      .avatar {
        width: 32px;
        height: 32px;
        border-radius: 50%;
      }

      .member-desc {
        display: flex;
        flex-direction: column;
        margin-left: 6px;
      }
    }

    .feedback-main {
      .content {
        display: flex;
        flex-direction: column;
      }

      .time-scope {
        margin: 5px 0;
        font-size: 12px;
        color: #a1a4ab;
        font-family: PingFangSC, PingFangSC-Regular;
      }

      .img-box {
        display: flex;
        flex-direction: row;
      }

      .userImg {
        margin-right: 8px;
      }

      .desc {
        font-size: 13px;
        color: #fa7516;
        font-family: PingFangSC, PingFangSC-Regular;
      }
    }
  }
</style>
