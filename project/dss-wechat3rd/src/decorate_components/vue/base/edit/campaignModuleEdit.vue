<template>
  <div class="ky-activity-module-edit">
    <edit-header :data-source="dataSource" name="活动"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">显示导航</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showNav">
            <el-radio :label="true" border>是</el-radio>
            <el-radio :label="false" border>否</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div class="com-row">
        <span class="com-column">显示方式</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showType" class="decorate-radio">
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.vertical" border>列表</el-radio>
            <el-radio :label="decorateStyleEnum.SHOW_TYPE.horizon" border>滑动</el-radio>
          </el-radio-group>
        </span>
      </div>

      <div v-if="dataSource.showNav">
        <div class="com-row">
          <span class="com-column">主标题</span>
          <span class="nav-column">
            <el-input
              v-model="dataSource.textNavSource.title"
              class="com-input"
              :maxlength="20"
              placeholder=""
            ></el-input>
          </span>
        </div>

        <div class="com-row">
          <span class="com-column">副标题</span>
          <span class="nav-column">
            <el-input
              v-model="dataSource.textNavSource.subTitle"
              class="com-input"
              :maxlength="20"
              placeholder=""
            ></el-input>
          </span>
        </div>

        <div class="com-row">
          <span class="com-column">导航链接</span>
          <span class="link-page">
            <div class="link-name">{{ dataSource.textNavSource.linkName }}</div>
          </span>
        </div>
      </div>
      <div class="com-row picker">
        <div class="picker__add" @click="$refs.picker.show()">+新增活动</div>
        <div v-for="(item, index) of list" :key="item.id" class="picker__item">
          <div class="picker__avatar">
            <img :src="item.imgUrl" />
          </div>
          <div class="picker__content">
            <div class="picker__name">{{ item.activityTitle }}</div>
            <div class="picker__status">{{ item.applyStatusStr }}</div>
          </div>
          <div class="picker__close" @click="handleRemove(index)">
            <i class="el-icon-close" />
          </div>
        </div>
      </div>
    </div>
    <activity-picker ref="picker" v-model="dataSource.list"></activity-picker>
  </div>
</template>

<script>
  import './css/common.less';
  import EditHeader from './edit-header.vue';
  import Size from './size.vue';
  import ActivityPicker from '@/dss-wechat3rd/src/components/active-picker/index';
  import api from '@/dss-wechat3rd/src/api/campaign';
  import decorateStyleEnum from '@/dss-wechat3rd/src/constants/decorateStyleEnum.js';
  export default {
    name: 'CampaignModuleEdit',
    components: {
      EditHeader,
      Size,
      ActivityPicker,
    },
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        decorateStyleEnum,
        list: [],
      };
    },
    // 详情获取
    watch: {
      'dataSource.list': {
        immediate: true,
        async handler(value) {
          if (value && value.length) {
            const detail = await api.activity.getActivitiesByIds(value);
            this.list = detail;
            console.log(this.list);
            // 部分数据可能被移除
            if (detail.length !== value.length) {
              this.dataSource.list = detail.map(i => i.id);
            }
          } else {
            this.list = [];
          }
        },
      },
    },
    created() {
      if (!this.dataSource.showType && this.dataSource.showType !== 0) {
        this.$set(this.dataSource, 'showType', 1);
      }
    },
    methods: {
      handleRemove(index) {
        this.dataSource.list.splice(index, 1);
      },
    },
  };
</script>

<style scoped>
  .ky-activity-module-edit {
  }

  .picker {
    width: 90%;
  }

  .picker__add {
    width: 100%;
    height: 30px;
    background: #e9ecf1;
    color: #256eff;
    text-align: center;
    line-height: 30px;
    cursor: pointer;
  }

  .picker__item {
    display: flex;
    margin: 20px 0;
    background-color: #f5f7fa;
    padding: 15px 10px;
    position: relative;
    border: 1px solid #dcdfe6;
  }

  .picker__avatar {
    width: 88px;
    height: 72px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .picker__avatar > img {
    max-width: 100%;
    max-height: 100%;
  }

  .picker__content {
    font-size: 12px;
    margin-left: 8px;
    padding: 9px 0;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  .picker__close {
    position: absolute;
    right: 0;
    top: 0;
    padding: 0 3px;
    border-bottom: 1px solid #dcdfe6;
    border-left: 1px solid #dcdfe6;
    cursor: pointer;
  }
</style>
