<template>
  <div class="ky-project-module-edit">
    <edit-header :data-source="dataSource" name="项目"></edit-header>
    <div class="com-body">
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">显示导航</span>
        <span class="com-column">
          <el-radio-group v-model="dataSource.showNav">
            <el-radio :label="true">是</el-radio>
            <el-radio :label="false">否</el-radio>
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
        <div class="com-row picker">
          <div v-for="(item, index) of list" :key="item.id" class="picker__item">
            <div class="picker__avatar">
              <img :src="item.bannerUrl" />
            </div>
            <div class="picker__content">
              <div class="picker__name">{{ item.prjName }}</div>
            </div>
            <div class="picker__close" @click="handleRemove(index)">
              <i class="el-icon-close" />
            </div>
          </div>
          <div class="picker__add" @click="$refs.picker.show()">+新增卡片</div>
        </div>
      </div>
    </div>
    <project-picker ref="picker" v-model="dataSource.list"></project-picker>
  </div>
</template>

<script>
  import './css/common.less';
  import { projectApi } from '@/register/kangyang';
  import EditHeader from './edit-header.vue';
  import Size from './size.vue';
  import ProjectPicker from '@/dss-wechat3rd/src/components/ky-project-picker';

  /**
   * 项目编辑
   */
  export default {
    name: 'KangyangProjectModuleEdit',
    components: {
      EditHeader,
      Size,
      ProjectPicker,
    },
    props: {
      dataSource: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        list: [],
      };
    },
    // 详情获取
    watch: {
      'dataSource.list': {
        immediate: true,
        async handler(value) {
          console.log(value, '===');
          if (value && value.length) {
            const { data } = await projectApi.getIdsList(value);
            this.list = data;
          } else {
            this.list = [];
          }
        },
      },
    },
    methods: {
      handleRemove(index) {
        this.dataSource.list.splice(index, 1);
      },
    },
  };
</script>

<style scoped>
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
    margin-bottom: 20px;
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
