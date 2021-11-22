<template>
  <div class="mini-index">
    <div class="home-decorate-head">
      <div v-if="!env.KANGYANG" class="home-decorate-tips">
        <span class="tips-item">1.装修模版：企业管理可创建5个首页装修模板，赋能门店首页装修</span>
        <span class="tips-item">2.企业设置的默认模板将会成为所有未装修首页门店的默认首页</span>
        <span class="tips-item"
          >3.经销商或门店可选择总部模板，进行适当修改以完成首页装修，也可自行新增自定义页面进行装修</span
        >
      </div>

      <!-- 默认主页及备用列表 -->
      <div class="template-decorate-container" v-loading="loadingHome">
        <div class="custom-page-wrapper" v-for="(item, index) in dataSource" :key="index">
          <div class="bg-content" :style="imgUrl(item)">
            <div class="current-home-box" v-if="item.homeType == 3">默认模板</div>
            <div class="mask">
              <div class="btn-box" :class="isManager ? '' : 'btn-box-center'">
                <template v-if="isManager">
                  <div class="btn" @click="reviewPage(item)">编辑</div>
                  <div class="btn" v-if="item.homeType != 3" @click="setHomePage(item)">设为默认</div>
                  <div class="btn" v-if="dataSource.length < 5" @click="copyTemplatePage(item)">复制</div>
                  <div class="btn" v-if="item.homeType != 3 && item.pageType !== 0" @click="handleDel(item)">删除</div>
                </template>
                <!-- 非企业管理员仅可查看 -->
                <template v-else>
                  <div class="btn" style="margin-left: 0" @click="reviewPage(item)">查看</div>
                </template>
              </div>
            </div>
          </div>
          <div class="name">
            <div class="edit-name-box" v-if="item._isEdit">
              <el-input maxlength="15" class="edit-name-input" v-model="curTemplateName"></el-input>
              <span class="btn" @click="confirmEditName(item, index)">确定</span>
              <span class="btn" @click="cancelEditName(item, index)">取消</span>
            </div>
            <div class="name-text-box" v-else>
              <span class="name-text">{{ item.name }}</span>
              <span class="edit-icon el-icon-edit" v-if="isManager" @click="editTemplateName(item, index)"></span>
            </div>
          </div>
        </div>

        <div class="custom-page-wrapper" @click="clickAddCustomPageButton" v-if="isManager && dataSource.length < 5">
          <div class="bg-content">
            <div class="preview add">
              <i class="el-icon-plus"></i>
              最多添加5个模板
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 小程序主题 -->
    <div class="optional-template" v-if="isManager">
      <p class="top">主题颜色</p>

      <div class="theme-content">
        <!-- 实例展示 -->
        <div class="page-box">
          <div class="home-page">
            <div class="top" :style="'background:' + currentTemplate.navColor + ''"></div>
            <div class="poster"></div>
            <div class="goods">
              <div class="img"></div>
              <div class="info-box">
                <div class="name"></div>
                <div class="info"></div>
                <div class="info"></div>
              </div>
              <div class="btn" :style="'background:' + currentTemplate.navColor + ''"></div>
            </div>
            <div class="goods-box">
              <div class="box">
                <div class="img"></div>
                <div class="info"></div>
                <div class="info"></div>
                <div class="cart" :style="'background:' + currentTemplate.navColor + ''"></div>
              </div>
              <div class="box">
                <div class="img"></div>
                <div class="info"></div>
                <div class="info"></div>
                <div class="cart" :style="'background:' + currentTemplate.navColor + ''"></div>
              </div>
            </div>

            <div class="bottom">
              <div class="tabbar" :style="'background:' + currentTemplate.navColor + ''"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
              <div class="tabbar"></div>
            </div>
          </div>
          <!-- 第二个 -->
          <div class="goods-page">
            <div class="top"></div>
            <div class="poster"></div>
            <div class="info1"></div>
            <div class="info2"></div>
            <div class="price">￥88</div>
            <div class="bottom">
              <div class="cart" :style="'background:' + currentTemplate.navColor + ';opacity:0.7'"></div>
              <div class="buy" :style="'background:' + currentTemplate.navColor + ''"></div>
            </div>
          </div>
          <!-- 第三个 -->
          <div class="act-page" v-if="currentTemplate.id === 'custom'" style="margin-left: 20px">
            <div class="top"></div>
            <div class="poster"></div>
            <div
              class="price"
              :style="
                'background:linear-gradient(90deg,' +
                currentTemplate.bgGradualChange1 +
                ' 0%,' +
                currentTemplate.bgGradualChange2 +
                ' 100%)'
              "
            >
              ￥88
            </div>
            <div class="info1"></div>
            <div class="info2"></div>
            <div class="tag"></div>
            <div class="tag1"></div>
            <div class="bottom">
              <div
                class="buy"
                :style="
                  'background:linear-gradient(90deg,' +
                  currentTemplate.bgGradualChange1 +
                  ' 0%,' +
                  currentTemplate.bgGradualChange2 +
                  ' 100%)'
                "
              ></div>
            </div>
          </div>
        </div>

        <div class="content">
          <!-- 已有模板 -->
          <div class="template-box" v-for="(item, index) in optionalTemplate" :key="index">
            <div class="tab" :class="item.id === currentTemplate.id ? 'check' : ''">
              <div class="box" :style="'background:' + item.navColor + ''" @click="choiceTemplate(item.id)"></div>
            </div>
            <div class="text">{{ item.name }}</div>
          </div>

          <!-- 自定义模板 -->
          <div class="template-box">
            <div class="tab" :class="'custom' === currentTemplate.id ? 'check' : ''">
              <div
                class="box"
                v-if="custom.id"
                :style="'background:' + custom.navColor + ''"
                @click="choiceTemplate(custom.id)"
              ></div>
              <div class="box custom-tab" v-else @click="preview('custom')">
                <i style="color: #717378; font-size: 15px" class="el-icon-plus"></i>
              </div>
            </div>
            <div class="text" style="color: rgba(46, 141, 255, 1); cursor: pointer" @click="preview('custom')">
              {{ custom.id ? '重新定义' : '自定义' }}
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 选择自定义页弹窗 -->
    <select-template-page-dialog
      :visible.sync="dialogVisible"
      set-button-text="设置为模板"
      :tabs="tabs"
      :template-list="dataSource"
      :cur-template-id="curTemplateId"
      :cur-store="curStore"
      :is-manager="isManager"
      @set-home-page="setCustomPageToTemplate"
    ></select-template-page-dialog>
  </div>
</template>

<script>
  import './index.less';
  import service from '@/dss-wechat3rd/src/api/index';
  import store from '@/business-common/store.js';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import SelectTemplatePageDialog from './select-template-page-dialog.vue';
  import { mapState } from 'vuex';

  const TABS = [
    {
      label: '自定义页',
      value: 'brand',
    },
  ];

  export default {
    name: 'Decoration',
    mixins: [industryHelperMixin],
    components: { SelectTemplatePageDialog },
    data() {
      return {
        enterTime: +new Date(),
        curTemplateId: null,
        dataSource: [],
        tabBarConfig: null,
        custom: {}, // 自定义模板
        optionalTemplate: null,
        currentTemplate: {
          id: null,
          url: null,
          name: null,
        },
        templateConfig: null,
        loadingHome: false,
        curLibrary: 'brand',
        curTemplateName: '', // 当前编辑模版名称(暂存)
        dialogVisible: false,
        tabs: TABS,
      };
    },
    computed: {
      ...mapState({
        curStore: 'curStore',
        roleList: 'roleList',
        env: 'env',
      }),
      // 获取当前主页模板图片
      imgUrl() {
        return item => {
          const imgUrl = item.imgUrl || this.currentTemplate.url;
          return imgUrl
            ? 'background: transparent url(' + imgUrl + '?t=' + this.enterTime + ') 0px 0px / cover no-repeat;'
            : null;
        };
      },
      // 管理员
      isManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },
    },
    mounted() {
      this.optionalTemplate = this.mGetThemeTemplateOptions();
      service.getUserTemplate().then(response => {
        if (response.data && response.data.templateId) {
          this.curTemplateId = response.data.id;
          store.commit('set_sellerTemplateId', this.curTemplateId);
          this.getHomePages();
          this.tabBarConfig = JSON.parse(response.data.tabBarConfig);
          this.templateConfig = JSON.parse(response.data.config);
          // 如果有自定义配置
          if (this.templateConfig.theme.template) {
            this.custom = this.templateConfig.theme.template || {};
          }
          // 判断若是从预览页新建模板后返回的，执行更新模板配置信息接口
          if (this.$route.params.createTemplate) {
            this.updateTemplateConfig('custom', this.$route.params.createTemplate);
            this.templateConfig.theme.template = this.$route.params.createTemplate;
          }
          if (this.templateConfig.theme.value === 'custom') {
            this.currentTemplate = this.templateConfig.theme.template || { id: 'custom' };
          }
          // 获取模板配置信息
          this.optionalTemplate.forEach(item => {
            if (!!this.templateConfig.theme && item.id === this.templateConfig.theme.value) {
              this.currentTemplate = item;
            }
          });
        }
      });
    },

    watch: {
      '$store.state.templateId'(newVal) {
        if (newVal) {
          this.getHomePages();
        }
      },
    },

    methods: {
      // 获取默认主页及备用列表
      getHomePages() {
        this.loadingHome = true;
        service
          .fetchDecorationTemplateList({
            sellerTemplateId: this.curTemplateId,
          })
          .then(response => {
            this.dataSource = response.data;
          })
          .always(() => {
            this.loadingHome = false;
          });
      },

      // 查看页面
      reviewPage(val, library) {
        this.$router.push({
          path: '/setting/homedecorate/custom-page/decorate',
          query: { pageIndex: val.index, library: library || this.curLibrary, pageId: val.id },
        });
      },

      editTemplateName(item, index) {
        this.curTemplateName = item.name || '';
        this.$set(this.dataSource[index], '_isEdit', true);
      },

      // 确定修改模板名称
      confirmEditName(item, index) {
        const name = this.curTemplateName;
        if (!name) return;
        // const config = JSON.parse(item.config || '[]');
        // config.forEach(_item => {
        //   if (_item.id === 'pageInfoModule') _item.name = name;
        // });
        this.loadingHome = true;
        service
          .updatePage({
            name,
            // config: JSON.stringify(config),
            config: item.config,
            index: item.index,
            sellerTemplateId: this.curTemplateId,
            storeId: 0,
            pageId: item.id,
          })
          .then(response => {
            this.curTemplateName = '';
            this.getHomePages();
            this.$set(this.dataSource[index], '_isEdit', false);
          })
          .finally(() => {
            this.loadingHome = false;
          });
      },

      // 取消修改模板名称
      cancelEditName(item, index) {
        this.curTemplateName = '';
        this.$set(this.dataSource[index], '_isEdit', false);
      },

      // 添加模版-选择自定义页弹窗
      clickAddCustomPageButton() {
        this.dialogVisible = true;
      },

      // 添加模板页
      setCustomPageToTemplate(item) {
        if (!item || !item.id) return;
        service
          .setCustomPageToTemplate({
            sellerTemplateId: this.curTemplateId,
            pageId: item.id,
          })
          .then(res => {
            if (!res.data) return;
            this.$message.success('设置成功');
            this.getHomePages();
          })
          .always(() => {});
      },

      // 复制模板页
      copyTemplatePage(item) {
        service
          .copyTemplatePage({
            sellerTemplateId: this.curTemplateId,
            pageId: item.id,
          })
          .then(res => {
            if (!res.data) return;
            this.$message.success('复制成功');
            this.getHomePages();
          })
          .always(() => {});
      },

      // 删除模板页
      handleDel(item) {
        service
          .delTemplatePage({
            sellerTemplateId: this.curTemplateId,
            pageId: item.id,
          })
          .then(res => {
            if (!res.data) return;
            this.$message.success('删除成功');
            this.getHomePages();
          })
          .always(() => {});
      },

      // 设置默认模板
      setHomePage(item) {
        const type =
          item.index === 'wxat-common/pages/home/index' ? 'setDefaultTemplatePage' : 'setCustomToDefaultTemplatePage';
        service[type]({
          sellerTemplateId: this.curTemplateId,
          pageId: item.id,
        })
          .then(res => {
            if (!res.data) return;
            this.$message.success('设置成功');
            this.getHomePages();
          })
          .always(() => {});
      },

      // 模板预览
      preview(id) {
        const template = JSON.stringify(this.templateConfig.theme.template);
        this.$router.push({
          path: '/setting/homedecorate/mini-index/preview',
          query: { templateId: id, template: template },
        });
      },

      // 选择模板
      choiceTemplate(id) {
        this.$confirm('此操作将更换您的整个小程序主题?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
          customClass: 'wkt-warning',
        })
          .then(() => {
            this.updateTemplateConfig(id);
          })
          .catch(() => {
            console.log('取消更换');
          });
      },

      /**
       * 更新模板config配置信息
       */
      updateTemplateConfig(id, template) {
        // 一直保存自定义模板
        template = template || this.templateConfig.theme.template;
        const config = {
          theme: {
            sync: true,
            value: id,
            template: template,
          },
          mineConfig: this.templateConfig.mineConfig,
        };
        const params = {
          config: JSON.stringify(config),
          sellerTemplateId: this.curTemplateId,
        };

        service.updateTemplateConfig(params).then(res => {
          this.optionalTemplate.forEach(item => {
            if (item.id === id) {
              this.currentTemplate = item;
            }
          });
          if (id === 'custom') {
            this.currentTemplate = {
              id: 'custom',
              name: '自定义',
              navColor: template.navColor,
            };
            this.custom = this.templateConfig.theme.template || {};
          }
          this.updateTabBar();
        });
      },

      updateTabBar() {
        if (this.tabBarConfig) {
          const tabBars = this.tabBarConfig.list;
          if (tabBars && tabBars.length) {
            // 更新各个tabBar页面的导航颜色和字体颜色
            tabBars.forEach(tabBar => {
              tabBar.navBackgroundColor = this.currentTemplate.navColor || '#ffffff';
              tabBar.navFrontColor = this.currentTemplate.navColor ? '#ffffff' : '#000000';
            });
            const strTabBarConfig = JSON.stringify(this.tabBarConfig);
            const params = {
              tabBarConfig: strTabBarConfig,
              id: this.curTemplateId,
            };
            service.updateTemplate(params);
          }
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .home-decorate-tips {
    .tips-item {
      line-height: 22px;
      padding: 0;
    }
  }
</style>
