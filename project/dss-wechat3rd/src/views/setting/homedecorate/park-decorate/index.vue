<template>
  <div class="park-produce-container" v-loading="loading">
    <!-- 组件库 -->
    <div class="components components-area">
      <div v-for="(list, index) in dataSource" :key="index">
        <div class="ca-title">
          <span>{{ list.type }}</span>
        </div>
        <Container
          behaviour="copy"
          :group-name="DROP_GROUP"
          drag-class="drag-class"
          :get-child-payload="x => getChildPayload(x, index)"
          class="components-container"
        >
          <Draggable v-for="item in list.components" :key="item.id" class="x">
            <div class="item">
              <div class="img">
                <img :src="images[item.id].src" :class="images[item.id].icon" />
              </div>
              <div class="name">{{ item.name }}</div>
              <div class="item-cover"></div>
            </div>
          </Draggable>
        </Container>
      </div>
    </div>
    <!-- 屏幕 -->
    <div class="screen-contanier-area">
      <div class="screen-head"></div>
      <div class="screen-area" ref="screenArea">
        <!-- 页面信息组件 -->
        <div v-if="!!screenSource[0]" class="header" @click="handleFocusComponent(screenSource[0])">
          <pageInfoModule :data-source.sync="screenSource[0].config"></pageInfoModule>
        </div>
        <div class="screen">
          <Container
            :group-name="DROP_GROUP"
            :get-child-payload="getHomeChildPayload"
            @drop="handleDrop"
            drag-class="drag"
            class="screen-container"
            :style="{ 'background-color': screenSource[0] ? screenSource[0].config.bgColor : '#f5f7fa' }"
          >
            <park-module></park-module>
            <Draggable v-for="(item, index) in screenSource" :key="index">
              <div class="screen-x" v-if="item.id !== 'pageInfoModule'">
                <div class="field" :is="item.id" :data-source.sync="item.config"></div>
                <div class="cover" @click="handleFocusComponent(item)" :class="{ select: isEditing(item) }">
                  <i class="com-close" @click.stop="deleteScreenComponents(index)"></i>
                </div>
              </div>
            </Draggable>
          </Container>
        </div>
      </div>
    </div>

    <!-- 编辑界面 -->
    <div class="editor-area-wrapper">
      <div class="editor editor-area" v-if="editItem && !editItem.edit">
        <div :is="editItem.id + 'Edit'" :key="editItem.id" :data-source="editItem.config"></div>
      </div>
    </div>

    <div class="bottom-button" v-if="(isAreaManager && editLibraryType === 'store') || !isAreaManager">
      <el-button type="primary" style="margin-top: 20px" @click="save">保存</el-button>
    </div>
  </div>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import { mapState } from 'vuex';
  import './index.less';
  import '../screen-phone-style.less';
  import service from '@/dss-wechat3rd/src/api/index';
  import store from '@/business-common/store';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin';
  import html2canvas from 'html2canvas';
  import { handleDrop } from '@/dss-wechat3rd/src/decorate_components/utils/drop-handle';
  import { DROP_GROUP } from '@/dss-wechat3rd/src/decorate_components/constants';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
  import ParkModule from './park-module';

  function getImagesData(list) {
    const x = [];
    list.forEach(group => {
      group.components.forEach(item => {
        x[item.id] = {
          // eslint-disable-next-line import/no-dynamic-require
          src: require(`@/dss-wechat3rd/src/images/decorate/${item.id}.png`),
          icon: 'icon-' + item.id,
        };
      });
    });
    return x;
  }

  export default {
    mixins: [appFeaturesMixin, industryHelperMixin],
    components: {
      Container,
      Draggable,
      ParkModule,
    },
    provide() {
      return {
        isEditing: this.isEditing,
        canEdit: this.canEdit,
        canSave: () => this.canSave,
        setEditing: val => this.handleFocusComponent(val),
      };
    },
    data: function () {
      return {
        DROP_GROUP,
        loading: false,
        dataSource: null,
        images: null,
        templateConfig: null,
        screenSource: [],
        editItem: null,
        pageId: null,
      };
    },

    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        customPages: 'customPages',
        linkedPages: 'linkedPages',
        env: 'env',
      }),

      // 区域管理员
      isAreaManager() {
        return (
          (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
            !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
          !!this.curApp.canCustomDecorate
        );
      },
      // 自定义个人中心(品牌brand 门店store)
      editLibraryType() {
        return this.$route.query.editLibraryType || 'brand';
      },

      canSave() {
        const canCustomDecorate = !!this.curApp.canCustomDecorate;
        if (this.editLibraryType === 'brand') return true;
        if (canCustomDecorate && this.editLibraryType === 'store') return true;
        return false;
      },
    },

    mounted() {
      this.loading = false;
      this.handleIndustry();
      this.setLinkedPages();
      this.handleTemplate();
    },

    methods: {
      canEdit(item) {
        return item.config && !item.config.isLock;
      },

      isEditing(item) {
        console.log(item === this.editItem);
        return item === this.editItem;
      },

      // 获取链接
      setLinkedPages() {
        const industry = this.mGetIndustryKey();
        if (!this.linkedPages) {
          store.commit('set_linkedPages', linkedPages[industry].globalLink);
        }
      },

      // 获取所有的自定义页
      getCustomPages() {
        if (!this.customPages) {
          service
            .getCustomPages({
              sellerTemplateId: this.curTemplateId,
            })
            .then(response => {
              if (response.success === true) {
                store.commit('set_customPages', response.data);
              }
            });
        }
      },

      // 获取组件库
      handleIndustry() {
        const list = this.mGetParkDecorateComponents();
        this.dataSource = list;
        this.images = getImagesData(list);
      },
      /**
       * 更新模板config配置信息
       */
      updateTemplateConfig() {
        const params = {
          config: JSON.stringify(this.screenSource),
          sellerTemplateId: this.curTemplateId,
          index: 'pages/parking/index',
          pageId: this.pageId,
        };
        this.loading = true;
        service
          .updatePage(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 组件库往屏幕的拖组件 返回具体组件
      getChildPayload: function (x, index) {
        return JSON.parse(JSON.stringify(this.dataSource[index].components[x]));
      },

      // 屏幕内组件库  内部的拖动
      handleDrop(dropResult) {
        this.editItem = handleDrop(dropResult, this.screenSource);
      },

      // 屏幕内组件库内部的拖动 返回具体组件
      getHomeChildPayload: function (index) {
        return this.screenSource[index];
      },

      // 点击屏幕中的组件，主要返回一个编辑index
      handleFocusComponent(val) {
        this.editItem = val;
      },

      save() {
        this.updateTemplateConfig();
      },

      clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      },

      deleteScreenComponents(index) {
        const item = this.screenSource.splice(index, 1);
        if (item && item.length && item[0] === this.editItem) {
          console.log('remove', item);
          this.editItem = null;
        }
      },

      handleLogic(screenSource) {
        if (screenSource) {
          this.screenSource = screenSource;
        } else {
          this.screenSource = this.mGetMineDecorateConfig();
        }
        this.editItem = this.screenSource[0];
      },

      // 获取装修数据
      handleTemplate() {
        this.getCustomPages();
        service
          .getPageConfig({
            sellerTemplateId: this.curTemplateId,
            index: 'pages/parking/index',
          })
          .then(response => {
            this.pageId = response.data.id;
            this.page = response.data || {};
            if (this.page) {
              const source = JSON.parse(this.page.config);
              this.screenSource = source || [];
              // 默认选中第一个
              if (source && source.length) {
                this.editIndex = source[0];
              }
            }
          })
          .always(() => {
            if (!this.screenSource.length) {
              // 新建的  自动加上 pageInfoModule组件
              const pageInfo = {
                id: 'pageInfoModule',
                name: '页面信息',
                config: {
                  bgColor: '#f5f7fa',
                  bgMode: 'custom', // 背景颜色的选择方式
                  name: '停车缴费',
                  description: '',
                  linkUrl: null,
                  isLock: false, // 是否锁定组件
                },
              };
              this.screenSource.push(pageInfo);
              this.editItem = this.screenSource[0];
            }
          });
      },

      handleChangeConfig(val) {
        this.screenSource[this.editIndex] = val;
      },
    },
  };
</script>
