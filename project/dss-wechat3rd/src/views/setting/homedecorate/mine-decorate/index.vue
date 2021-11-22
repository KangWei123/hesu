<template>
  <div class="mine-produce-container" v-loading="loading">
    <!-- 组件库 -->
    <div class="components components-area">
      <div v-for="(list, index) in dataSource" :key="index">
        <div class="ca-title">
          <span>{{ list.type }}</span>
        </div>
        <Container
          behaviour="copy"
          :group-name="'1'"
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
        <template v-if="!!screenSource[0]">
          <div v-if="screenSource[0].id === 'kangyangMineInfoModule'">
            <kangyangMineInfoModule :data-source.sync="screenSource[0].config"></kangyangMineInfoModule>
          </div>
          <div v-else class="header">
            <mineInfoModule :data-source.sync="screenSource[0].config"></mineInfoModule>
          </div>
        </template>
        <div class="screen">
          <Container
            :group-name="'1'"
            :get-child-payload="getChildPayload2"
            @drop="onDrop('screenSource', $event)"
            drag-class="drag"
            class="screen-container"
            :style="{ 'background-color': screenSource[0] ? screenSource[0].config.bgColor : '#FFFFFF' }"
          >
            <Draggable v-for="(item, index) in screenSource" :key="index">
              <div class="screen-x" v-if="!['mineInfoModule', 'kangyangMineInfoModule'].includes(item.id)">
                <div class="field" :is="item.id" :data-source.sync="item.config"></div>
                <div class="cover" @click="clickScreenComponents(item, $event)" :class="{ select: item === editItem }">
                  <i class="com-close" @click="deleteScreenComponents(index)"></i>
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
        <div :is="editItem.id + 'Edit'" :data-source="editItem.config" @change="handleChangeConfig"></div>
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
    },
    data: function () {
      return {
        loading: false,
        dataSource: null,
        images: null,
        templateConfig: null,
        screenSource: [],
        editIndex: -1,
      };
    },

    computed: {
      editItem() {
        return this.editIndex !== -1 ? this.screenSource[this.editIndex] : null;
      },
      ...mapState({
        curTemplateId: 'sellerTemplateId',
        customPages: 'customPages',
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
    },

    mounted() {
      this.handleIndustry();
      this.loading = true;
      if (this.isAreaManager && this.editLibraryType === 'store') {
        this.handleStoreTemplate();
        return;
      }
      service
        .getUserTemplate()
        .then(response => {
          if (response.data && response.data.templateId) {
            store.commit('set_sellerTemplateId', response.data.id);
            const configStr = response.data.config;
            let mineConfig = null;
            if (configStr) {
              try {
                const configObj = JSON.parse(configStr);
                this.templateConfig = configObj;
                if (configObj.mineConfig) {
                  mineConfig = configObj.mineConfig.value;
                }
              } catch (e) {
                console.log('mine decorate parse error', e);
              }
            }
            this.getCustomPages();
            this.handleLogic(mineConfig);
          }
        })
        .always(() => {
          this.loading = false;
        });
    },

    methods: {
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
      // 处理产业不同的逻辑
      handleIndustry() {
        const list = this.mGetMineDecorateComponents();
        this.dataSource = list;
        this.images = getImagesData(list);
      },
      /**
       * 更新模板config配置信息
       */
      updateTemplateConfig(img) {
        const config = {
          theme: this.templateConfig.theme,
          mineConfig: { sync: true, value: this.screenSource },
        };
        const params = {
          config: JSON.stringify(config),
          sellerTemplateId: this.curTemplateId,
        };
        if (img) params.imgUrl = img;
        this.loading = true;
        service
          .updateTemplateConfig(params)
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

      /**
       * 更新模板config配置信息
       */
      updateStoreTemplateConfig(img) {
        const config = {
          theme: this.templateConfig.theme,
          mineConfig: { sync: true, value: this.screenSource },
        };
        const params = {
          config: JSON.stringify(config),
          sellerTemplateId: this.curTemplateId,
          storeId: this.curStore.id,
          id: this.curTemplateId,
        };
        if (img) params.imgUrl = img;
        this.loading = true;
        service
          .updateStorePersonalCenter(params)
          .then(res => {
            this.$message({
              type: 'success',
              message: '保存成功',
            });
            this.$router.back();
          })
          .always(() => {
            this.loading = false;
          });
      },

      // 组件库往屏幕的拖组件 返回具体组件
      getChildPayload: function (x, index) {
        return this.dataSource[index].components[x];
      },

      // 屏幕内组件库  内部的拖动
      onDrop: function (collection, dropResult) {
        const { removedIndex, addedIndex, payload } = dropResult;
        let temp = null;
        if (removedIndex === null) {
          temp = this.clone(payload);
          if (temp.id === 'mineNavigationModule') {
            temp.config.list = this.$plain(this.mGetMineDecorateNavLinks());
          }
        } else {
          temp = payload;
          this[collection].splice(removedIndex, 1);
        }
        this[collection].splice(addedIndex, 0, temp);
        this.editIndex = addedIndex;
      },

      // 屏幕内组件库内部的拖动 返回具体组件
      getChildPayload2: function (index) {
        return this.screenSource[index];
      },

      // 点击屏幕中的组件，主要返回一个编辑index
      clickScreenComponents(val, event) {
        this.editIndex = this.screenSource.indexOf(val);
      },

      save() {
        // this.updateTemplateConfig();
        this.saveBase64Image(dataURL => {
          if (!this.isAreaManager) {
            this.updateTemplateConfig(dataURL);
            return;
          }
          this.updateStoreTemplateConfig(dataURL);
        });
        // if (!this.isAreaManager) {
        //   this.updateTemplateConfig();
        //   return;
        // }
        // this.updateStoreTemplateConfig();
      },

      clone(obj) {
        return JSON.parse(JSON.stringify(obj));
      },

      deleteScreenComponents(index) {
        this.screenSource.splice(index, 1);
      },
      handleLogic(screenSource) {
        if (screenSource) {
          this.screenSource = screenSource;
        } else {
          this.screenSource = this.mGetMineDecorateConfig();
        }
        this.editIndex = 0;
      },
      // 自定义门店个人中心
      handleStoreTemplate() {
        const params = {
          storeId: this.curStore.id,
        };
        service.getUserTemplate().then(brandRes => {
          service
            .getPersonalCenterConfig(params)
            .then(storeRes => {
              if (brandRes.data && brandRes.data.templateId) {
                const tempBrandConfig = this.$plain(brandRes.data);
                const storeTemplate = storeRes.data;
                const brandTemplate = brandRes.data;
                for (const key in storeTemplate) {
                  brandTemplate[key] = storeTemplate[key];
                }
                store.commit('set_sellerTemplateId', brandTemplate.id);
                const configStr = brandTemplate.config;
                let mineConfig = null;
                if (configStr) {
                  try {
                    const configObj = JSON.parse(configStr);
                    this.templateConfig = configObj;
                    // 确保主题配置与品牌模板一致
                    this.templateConfig.theme = JSON.parse(tempBrandConfig.config).theme;
                    if (configObj.mineConfig) {
                      mineConfig = configObj.mineConfig.value;
                    }
                  } catch (e) {
                    console.log('mine decorate parse error', e);
                  }
                }
                this.getCustomPages();
                this.handleLogic(mineConfig);
              }
            })
            .always(() => {
              this.loading = false;
            });
        });
      },
      // 截图生成图片
      saveBase64Image(callback) {
        this.editIndex = -1;
        html2canvas(this.$refs.screenArea, {
          width: 375,
          height: 667,
          useCORS: true,
        }).then(canvas => {
          callback(canvas.toDataURL('image/jpeg', 1.0));
        });
      },
      handleChangeConfig(val) {
        this.screenSource[this.editIndex] = val;
      },
    },
  };
</script>
