<template>
  <div>
    <!-- <page-header>直播设置</page-header> -->
    <div class="container">
      <el-breadcrumb class="breadcrumb">
        <el-breadcrumb-item to="/marketing/live/list">直播方案</el-breadcrumb-item>
        <el-breadcrumb-item>直播详情</el-breadcrumb-item>
      </el-breadcrumb>

      <el-form :model="form" ref="form" size="mini" label-width="135px" v-loading="loading" class="integar-form">
        <div class="form-group-title">直播基本信息</div>
        <el-form-item label="直播名称：" prop="name">
          {{ form.name }}
        </el-form-item>

        <el-form-item label="直播状态：" prop="status">
          {{ (statusOptions.find(i => i.value === form.liveStatus) || {}).label || '--' }}
        </el-form-item>

        <el-form-item label="开始时间：" prop="beginTime">
          {{ form.startTime*1000 | formatDate }}
        </el-form-item>

        <el-form-item label="结束时间：" prop="endTime">
          {{ form.endTime*1000 | formatDate }}
        </el-form-item>

        <el-form-item label="分享图片：" prop="shareImg">
          <img class="live-cover" :src="form.shareImg" referrerpolicy="no-referrer" />
        </el-form-item>

        <el-form-item label="主播昵称：" prop="anchorName">
          {{ form.anchorName }}
        </el-form-item>

        <div class="form-group-title">活动介绍配置</div>

        <el-form-item label="活动正文：" prop="activityContext">
          <!-- w-editor 不会响应 文本内容的变化，w-editor 输入内容获取并不及时 -->
          <w-editor
            :key="!loading"
            :data-source="form"
            :is-show-video="false"
            :is-show-minapp="false"
            param-name="activityContext"
          ></w-editor>
        </el-form-item>

        <el-form-item>
          <el-button type="primary" size="small" @click="onSave">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import PageHeader from '@/dss-wechat3rd/src/components/page-header';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
import date from '@/dss-common/utils/date';

const statusOptions = [
  {
    value: null,
    label: '全部直播'
  },
  {
    value: 0,
    label: '直播预告'
  },
  {
    value: 101,
    label: '正在直播'
  },
  {
    value: 102,
    label: '未开始'
  },
  {
    value: 103,
    label: '直播结束'
  },
  {
    value: 104,
    label: '禁播'
  },
  {
    value: 105,
    label: '暂停'
  },
  {
    value: 106,
    label: '异常'
  },
  {
    value: 107,
    label: '已过期'
  }
];

export default {
  name: 'live-detail',
  components: { PageHeader, WEditor },
  data() {
    return {
      loading: false,
      statusOptions,
      form: {
        name: '',
        status: null,
        beginTime: null,
        endTime: null,
        poster: null,
        activityContext: null
      }
    };
  },

  filters: {
    formatDate(val) {
      if (!val) return '';
      return date.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
    }
  },

  mounted() {
    const roomId = this.$route.query.roomId || '';
    this.fetchDetailData(roomId);
  },

  methods: {
    fetchDetailData(id) {
      if (!id) return;
      this.loading = true;
      const params = { roomId: id };
      const url = constants.Api.live.detail;
      services
        .get(url, {
          params,
          action: '直播详情'
        })
        .then(res => {
          this.form = res.data || {};
        })
        .finally(() => {
          this.loading = false;
        });
    },
    async onSave() {
      const roomId = this.$route.query.roomId || '';
      if (!roomId) {
        this.$message({ type: 'error', message: '无效的 room id' });
        return;
      }
      try {
        this.loading = true;
        const res = await services.post(
          constants.Api.live.update,
          { roomId, activityContext: this.form.activityContext },
          { action: '更新直播间信息' }
        );
        this.$router.back();
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  padding: 10px 20px;
  background: #ffffff;

  // .breadcrumb {
  //   margin-bottom: 20px;
  // }

  .tip-msg {
    color: #999;
    font-size: 12px;
  }
  .ml5 {
    margin-left: 5px;
  }
  .ml10 {
    margin-left: 10px;
  }

  .form-group-title {
    color: #333333;
    font-weight: 700;
    font-size: 14px;
    border-bottom: 1px solid #dcdee0;
    margin: 20px 0;
    padding: 10px 0;
  }

  .live-cover {
    width: 120px;
    height: 120px;
    display: inline-block;
    vertical-align: bottom;
  }
}
</style>
