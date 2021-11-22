<template>
  <div class="produce-container">
    <header-controller @onSave="save" :can-save="canSave" :loading="loading" />
    <div class="produce-container-flex" :style="{ 'justify-content': !canSave ? 'center' : '' }">
      <!-- 组件库 -->
      <div v-show="canSave" class="components components-area">
        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item :title="list.type" v-for="(list, index) in dataSource" :key="index" :name="list.type">
            <Container
              behaviour="copy"
              :group-name="DROP_GROUP"
              drag-class="drag-class"
              :get-child-payload="x => getComponentPayload(x, index)"
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
          </el-collapse-item>
        </el-collapse>
      </div>

      <div>
        <!-- 屏幕 -->
        <div class="screen-contanier-area">
          <div class="screen-head"></div>
          <div class="screen-area" ref="screenArea">
            <!-- 页面信息组件  -->
            <div v-if="!!screenSource[0]" @click="handleFocusComponent(screenSource[0])" class="header">
              <pageInfoModule :data-source.sync="screenSource[0].config"></pageInfoModule>
            </div>
            <div class="screen">
              <Container
                id="decoration-canvas"
                :group-name="DROP_GROUP"
                :get-child-payload="getHomeChildPayload"
                @drop="handleDrop"
                drag-class="drag"
                class="screen-container"
                :style="{ 'background-color': screenSource[0] ? screenSource[0].config.bgColor : '#FFFFFF' }"
              >
                <Draggable v-for="(item, index) in screenSource" :key="item.id + '_' + index">
                  <div class="screen-x" v-if="item.id !== 'pageInfoModule'" @click="handleFocusComponent(item)">
                    <component class="field" :is="item.id" :data-source.sync="item.config"></component>
                    <div class="cover" :class="{ select: isEditing(item) }">
                      <i
                        v-show="canSave"
                        class="com-close"
                        v-if="canEdit(item)"
                        @click.stop="deleteScreenComponents(index)"
                      ></i>
                    </div>
                  </div>
                </Draggable>
              </Container>
            </div>
          </div>
        </div>
        <div class="custom-decorate-tips" v-if="this.curApp && this.curApp.canCustomDecorate">
          温馨提示：品牌连锁店需装修店铺信息组件哦~
        </div>
      </div>

      <!-- 编辑界面 -->
      <div v-show="canSave" class="editor-area-wrapper">
        <disable-edit-module
          :is="'disableEditModule'"
          v-if="editItem && editItem.config && editItem.config.isLock && !isManager"
          :data-source="editItem.config"
          :name="editItem.name"
        />
        <div class="editor editor-area" v-else-if="editItem && !editItem.edit">
          <div :is="editItem.id + 'Edit'" :key="editItem.id" :data-source="editItem.config"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Container, Draggable } from 'vue-smooth-dnd';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import { mapState } from 'vuex';
  import './index.less';
  import '../screen-phone-style.less';
  import service from '@/dss-wechat3rd/src/api/index.js';
  import html2canvas from 'html2canvas';
  import store from '@/business-common/store.js';
  import Vue from 'vue';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import { DROP_GROUP } from '@/dss-wechat3rd/src/decorate_components/constants';
  import { handleDrop } from '@/dss-wechat3rd/src/decorate_components/utils/drop-handle';
  import HeaderController from './HeaderController.vue';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';

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
    name: 'Decorations',
    components: {
      Container,
      Draggable,
      HeaderController,
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
        dataSource: null,
        images: null,
        screenSource: [],
        pageIndex: 0,
        page: null,
        loading: false,
        editItem: null,
        activeNames: [],
      };
    },

    computed: {
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        linkedPages: 'linkedPages',
        customPages: 'customPages',
        env: 'env',
      }),
      // 修改自定义页所属库(品牌库brand 门店库store)
      editLibraryType() {
        return this.$route.query.library || 'brand';
      },
      // 是否允许门店自定义页编辑(店长/区管/经销商)
      isAllowManager() {
        return (
          !!~this.roleList.split(',').indexOf('common_role_area_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_dealer_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_storeKeeper')
        );
      },
      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
      canSave() {
        const canCustomDecorate = !!this.curApp.canCustomDecorate;
        if (this.notAllowedEdit) return false;
        if (this.isManager && this.editLibraryType === 'brand') return true;
        if (this.isAllowManager && canCustomDecorate && this.editLibraryType === 'store') return true;
        return false;
      },
      notAllowedEdit() {
        if (typeof this.$route.query.notAllowedEdit === 'string') {
          return !(this.$route.query.notAllowedEdit === 'false');
        }
        return this.$route.query.notAllowedEdit || false;
      },
    },

    mounted() {
      this.setLinkedPages();
      this.handleInitialComponents();

      if (!this.curTemplateId) {
        service.getUserTemplate().then(response => {
          if (response.data && response.data.templateId) {
            store.commit('set_sellerTemplateId', response.data.id);
            this.handleInitialSource();
          }
        });
      } else {
        this.handleInitialSource();
      }

      this.expandDefault();
    },

    methods: {
      setLinkedPages() {
        const industry = this.mGetIndustryKey();
        if (!this.linkedPages) {
          store.commit('set_linkedPages', linkedPages[industry].globalLink);
        }
      },

      isEditing(item) {
        return item === this.editItem;
      },
      canEdit(item) {
        return (item.config && !item.config.isLock && !this.isManager) || this.isManager;
      },
      // 营销组件图标默认全部展开
      expandDefault() {
        this.dataSource.forEach(item => {
          this.activeNames.push(item.type);
        });
      },
      /**
       * 组件库
       */
      handleInitialComponents() {
        const list = this.mGetIndustryDecorateComponents();
        this.dataSource = list;
        this.images = getImagesData(list);
      },

      /**
       * 组件库往屏幕的拖组件 返回具体组件
       */
      getComponentPayload: function (x, index) {
        // 需要拷贝一个新的副本
        return JSON.parse(JSON.stringify(this.dataSource[index].components[x]));
      },

      // 屏幕内组件库  内部的拖动
      handleDrop(dropResult) {
        console.log('drop root', dropResult);
        this.editItem = handleDrop(dropResult, this.screenSource);

        // const { removedIndex, addedIndex, payload } = dropResult;
        // // 如果screenSource有pageInfoModule组件则不往里添加
        // if (payload.id === 'pageInfoModule') {
        //   this.editIndex = 0;
        //   return;
        // }
        // let temp = null;
        // if (removedIndex === null) {
        //   temp = this.clone(payload);
        // } else {
        //   temp = payload;
        //   this[collection].splice(removedIndex, 1);
        // }
        // this[collection].splice(addedIndex, 0, temp);
        // this.editIndex = addedIndex;
      },

      // 屏幕内组件库内部的拖动 返回具体组件
      getHomeChildPayload: function (index) {
        return this.screenSource[index];
      },

      // 点击屏幕中的组件，主要返回一个编辑index
      handleFocusComponent(val) {
        console.log('focus', val);
        this.editItem = val;
      },

      save() {
        this.loading = true;
        this.saveBase64Image(dataURL => {
          const pageInfo = this.screenSource[0].config;
          const pageId = this.$route.query.pageId;
          if (this.pageIndex) {
            service
              .updatePage({
                // name: pageInfo.name,
                name: this.page.name || pageInfo.name || '自定义页面',
                config: JSON.stringify(this.screenSource),
                index: this.page.index,
                sellerTemplateId: this.curTemplateId,
                imgData: dataURL,
                storeId: this.editLibraryType === 'brand' ? 0 : this.curStore.id,
                pageId,
              })
              .then(response => {
                this.$router.back();
              })
              .finally(() => {
                this.loading = false;
              });
          } else {
            service
              .addCustomPage({
                name: pageInfo.name,
                config: JSON.stringify(this.screenSource),
                index: 'pages/custom/index',
                sellerTemplateId: this.curTemplateId,
                imgData: dataURL,
                storeId: this.editLibraryType === 'brand' ? 0 : this.curStore.id,
              })
              .then(response => {
                this.$router.back();
              });
          }
        });
      },

      // 截图生成图片
      saveBase64Image(callback) {
        this.editItem = null;

        /**
         * 克隆一份副本绘制截屏页面
         * 修复截图不全偏移的问题
         */
        const targetDom = document.querySelector('.screen-area'); // 获取要截图的元素
        const copyDom = targetDom.cloneNode(true); // 克隆副本
        copyDom.style.width = targetDom.scrollWidth + 'px';
        copyDom.style.height = targetDom.scrollHeight + 24 + 'px';
        document.body.appendChild(copyDom); // 截图元素必须呈现在dom中

        // 隐藏克隆的副本
        copyDom.style.cssText = 'position: fixed; z-index: -9999; top:-24px; left:0;';

        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop; // 获取滚动轴滚动的长度

        Vue.nextTick(() => {
          html2canvas(copyDom, {
            width: targetDom.scrollWidth,
            height: targetDom.scrollHeight,
            scrollY: -scrollTop,
            useCORS: true,
          }).then(canvas => {
            document.body.removeChild(copyDom); // 执行完销毁
            callback(canvas.toDataURL('image/jpeg', 1.0));
          });
        });
      },

      deleteScreenComponents(index) {
        const item = this.screenSource.splice(index, 1);
        if (item && item.length && item[0] === this.editItem) {
          console.log('remove', item);
          this.editItem = null;
        }
      },
      handleInitialSource() {
        // if (!this.customPages) {
        //   this.getCustomPages();
        // }
        this.getCustomPages();
        this.pageIndex = this.$route.query.pageIndex;
        const pageId = this.$route.query.pageId;
        store.commit('set_currentEditPageIndex', this.pageIndex);
        if (this.pageIndex) {
          service
            .getPageConfig({
              sellerTemplateId: this.curTemplateId,
              index: this.pageIndex,
              pageId,
            })
            .then(response => {
              this.page = response.data;
              if (this.page) {
                const source = JSON.parse(this.page.config);
                this.screenSource = source;
                // 默认选中第一个
                if (source && source.length) {
                  this.editItem = source[0];
                }
              }
            });
        } else {
          // 新建的  自动加上 pageInfoModule组件
          const pageInfo = {
            id: 'pageInfoModule',
            name: '页面信息',
            config: {
              bgColor: '#F1F4F6',
              bgMode: 'default', // 背景颜色的选择方式
              name: '自定义页面',
              description: '',
              linkUrl: null,
              isLock: false, // 是否锁定组件
            },
          };
          this.screenSource.push(pageInfo);
          this.editItem = pageInfo;
        }
      },

      // 获取所有的自定义页
      getCustomPages() {
        service
          .getCustomPagesV3({
            sellerTemplateId: this.curTemplateId,
            storeId: this.isManager ? 0 : this.curStore.id,
          })
          .then(response => {
            if (response.success === true) {
              store.commit('set_customPages', response.data);
            }
          });
      },

      handleChange(val) {
        // console.log(val);
      },
    },
  };
</script>
