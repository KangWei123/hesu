<template>
  <div class="mini-index">
    <div class="home-decorate-tips">
      <span>1、推荐使用默认模板</span>
      <span>2、可自由选择不同自定义页设为主页</span>
      <span>3、实现线上推广转化，提升网店的传播量</span>
      <span v-if="isAreaManager">4、当品牌模板和门店模板同时存在时，优先展示门店模板</span>
    </div>
    <template>
      <div class="home-decorate-container" v-if="!isAreaManager" v-loading="loadingHome">
        <div class="custom-page-block" v-for="(item, index) in dataSource" :key="index" :style="imgUrl(item)">
          <div class="current-home-box">
            <div v-if="item.homeType == 3" class="current-home">当前主页</div>
          </div>
          <div
            class="name"
            :class="
              item.index !== 'pages/home/index' && item.index !== 'wxat-common/pages/home/index' ? 'custom-name' : ''
            "
          >
            {{ item.name }}
          </div>
          <div class="mask">
            <!-- <div @click="preview(currentTemplate.id)"
                class="oper-item"
                v-if="item.homeType === 3 && !!currentTemplate.id">预览</div> -->
            <div @click="reviewPage(item)" class="oper-item">自定义</div>
            <div
              class="oper-item"
              v-if="
                item.index !== 'pages/home/index' &&
                  item.index !== 'wxat-common/pages/home/index' &&
                  item.homeType !== 3
              "
              @click="removeHomePage(item)"
            >
              删除
            </div>
            <div
              v-if="item.index !== 'pages/home/index' && item.index !== 'wxat-common/pages/home/index'"
              @click="clickReplace(item)"
              class="oper-item"
            >
              替换
            </div>
            <div class="oper-item" v-if="item.homeType != 3" @click="setHomePage(item)">设置为主页</div>
          </div>
        </div>

        <div class="custom-page-block" @click="clickAddCustomPageButton" v-if="dataSource.length === 1">
          <div class="preview add">
            <i class="el-icon-plus"></i>
          </div>
          <div class="name custom-name">自定义主页</div>
        </div>
      </div>
      <!-- 门店管理员 -->
      <div class="home-decorate-container" v-else v-loading="loadingHome">
        <div class="custom-page-block" v-for="(item, index) in dataSource" :key="index" :style="imgUrl(item)">
          <div class="current-home-box">
            <!-- <div v-if="item.homeType == 3" class="current-home">当前主页</div> -->
            <div v-if="item.homeType == 3 && dataSource.length < 2" class="current-home" style="width: 85px;">
              当前品牌主页
            </div>
            <div v-if="item.homeType == 3 && index > 0" class="current-home" style="width: 85px;">当前门店主页</div>
          </div>
          <div
            class="name"
            :class="
              item.index !== 'pages/home/index' && item.index !== 'wxat-common/pages/home/index' ? 'custom-name' : ''
            "
          >
            <template v-if="index < 1"
              >品牌模板</template
            >
            <template v-else
              >门店模板</template
            >
            <!-- {{ item.name }} -->
          </div>
          <div class="mask">
            <template>
              <div @click="reviewPage(item, 'brand')" class="oper-item" v-if="index < 1 || item.storeId === 0">
                查看
              </div>
              <div @click="reviewPage(item, 'store')" class="oper-item" v-else-if="index > 0 && item.storeId > 0">
                自定义
              </div>
            </template>

            <div class="oper-item" v-if="index > 0" @click="removeHomePage(item)">
              取消
            </div>
            <div v-if="index > 0" @click="clickReplace(item)" class="oper-item">替换</div>
            <template>
              <!-- <div class="oper-item" v-if="index < 1 && dataSource.length > 1" @click="setStoreHomePage(item, 'brand')">
                设置为主页
              </div> -->
              <div class="oper-item" v-if="item.homeType != 3 && index > 0" @click="setStoreHomePage(item, 'store')">
                设置为主页
              </div>
              <div class="oper-item" style="width: 120px;" v-if="item.homeType == 3 && index > 0" @click="batchSetStroeHomePage(item)">
                同步到其他门店
              </div>
            </template>
            <!-- <div class="oper-item"
                v-if="item.homeType != 3"
                @click="setStoreHomePage(item)">设置为主页</div> -->
          </div>
        </div>

        <div class="custom-page-block" @click="clickAddCustomPageButton" v-if="dataSource.length === 1">
          <div class="preview add">
            <i class="el-icon-plus"></i>
          </div>
          <div class="name custom-name">门店模板</div>
        </div>
      </div>
    </template>
    <!-- 模板 -->
    <div class="optional-template" v-if="!isAreaManager">
      <p class="top">可选模板</p>
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
              <i class="el-icon-plus"></i>
            </div>
          </div>
          <div class="text" style="color:rgba(46,141,255,1);cursor: pointer;" @click="preview('custom')">
            {{ custom.id ? '重新定义' : '自定义' }}
          </div>
        </div>
      </div>

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
          <div class="price">
            ￥88
          </div>
          <div class="bottom">
            <div class="cart" :style="'background:' + currentTemplate.navColor + ';opacity:0.7'"></div>
            <div class="buy" :style="'background:' + currentTemplate.navColor + ''"></div>
          </div>
        </div>
        <!-- 第三个 -->
        <div class="act-page" v-if="currentTemplate.id === 'custom'" style="margin-left:20px">
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
    </div>

    <el-dialog :visible.sync="dialogVisible" size="large" :modal-append-to-body="false">
      <div slot="title">
        <div class="library-tab">
          <el-button
            class="library-tab-item"
            :class="{ active: curLibrary === 'brand' }"
            round
            @click="handleChangeLibrary('brand')"
            >品牌库</el-button
          >
          <el-button
            v-if="isAreaManager"
            class="library-tab-item"
            :class="{ active: curLibrary === 'store' }"
            round
            @click="handleChangeLibrary('store')"
            >门店库</el-button
          >
        </div>
      </div>
      <div class="mini-index-dialog" v-loading="loadingCustomPages">
        <template v-if="curLibrary === 'brand'">
          <div
            class="custom-page-block"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
            v-for="(item, index) in customPageList"
            :key="index"
          >
            <template v-if="item.homeType !== 3">
              <div class="preview"></div>
              <div class="name custom-name">{{ item.name }}</div>
              <div class="mask">
                <div @click="reviewPage(item)" class="oper-item">查看</div>
                <template>
                  <div class="oper-item" v-if="!isAreaManager" @click="setHomePage(item)">设置为主页</div>
                  <div class="oper-item" v-else @click="setStoreHomePage(item, 'store')">设置为主页</div>
                </template>
              </div>
            </template>
          </div>
        </template>
        <template v-else-if="curLibrary === 'store' && isAreaManager">
          <div
            class="custom-page-block"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
            v-for="(item, index) in customPageList"
            :key="index"
          >
            <template v-if="item.homeType !== 3">
              <div class="preview"></div>
              <div class="name custom-name">{{ item.name }}</div>
              <div class="mask">
                <div @click="reviewPage(item)" class="oper-item">查看</div>
                <template>
                  <div class="oper-item" v-if="!isAreaManager" @click="setHomePage(item)">设置为主页</div>
                  <div class="oper-item" v-else @click="setStoreHomePage(item, 'store')">设置为主页</div>
                </template>
              </div>
            </template>
          </div>
        </template>
      </div>
    </el-dialog>

    <batch-store-operating v-if="isAreaManager" :visible.sync="batchDialogVisible" :page="currentStoreHomePage"></batch-store-operating>
  </div>
</template>

<script>
// import { mapState } from 'vuex';
import service from '@/dss-wechat3rd/src/api/index';
import '../custom-page-block.less';
import './index.less';
import store from '@/business-common/store.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import BatchStoreOperating from './batch-store-operating';
export default {
  mixins: [industryHelperMixin],
  components: { BatchStoreOperating },
  data: function() {
    return {
      enterTime: +new Date(),
      curTemplateId: null,
      dataSource: [],
      dialogVisible: false,
      customPageList: [],
      tabBarConfig: null,
      sourcePage: null, //点击替换的自定义页
      custom: {}, //自定义模板
      optionalTemplate: null,
      currentTemplate: {
        id: null,
        url: null,
        name: null
      },
      templateConfig: null,
      // isAreaManager: true, //区域管理员
      curLibrary: 'brand',
      loadingHome: false,
      loadingCustomPages: false,
      batchDialogVisible: false,
      currentStoreHomePage: {}
    };
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
        //如果有自定义配置
        if (this.templateConfig.theme.template) {
          this.custom = this.templateConfig.theme.template || {};
        }
        //判断若是从预览页新建模板后返回的，执行更新模板配置信息接口
        if (this.$route.params.createTemplate) {
          this.updateTemplateConfig('custom', this.$route.params.createTemplate);
          this.templateConfig.theme.template = this.$route.params.createTemplate;
        }
        if (this.templateConfig.theme.value === 'custom') {
          this.currentTemplate = this.templateConfig.theme.template || { id: 'custom' };
        }
        //获取模板配置信息
        this.optionalTemplate.forEach(item => {
          if (!!this.templateConfig.theme && item.id === this.templateConfig.theme.value) {
            this.currentTemplate = item;
          }
        });
      }
    });
  },

  computed: {
    /* ...mapState({
      curTemplateId: 'sellerTemplateId'
    }), */

    //获取当前主页模板图片
    imgUrl() {
      return item => {
        const imgUrl = item.imgUrl || this.currentTemplate.url;
        /*if (item.homeType === 3 && this.currentTemplate.id) {
          imgUrl = this.currentTemplate.url || item.imgUrl;
        } else if (item.imgUrl) {
          imgUrl = item.imgUrl;
        }*/
        return imgUrl
          ? 'background: transparent url(' + imgUrl + '?t=' + this.enterTime + ') no-repeat 0 0;background-size: cover;'
          : null;
      };
    },
    // 区域管理员(并设置了支持多门店装修)
    isAreaManager() {
      return (
        (!!~this.roleList.split(',').indexOf('common_role_area_manager') ||
          !!~this.roleList.split(',').indexOf('common_role_dealer_manager')) &&
        !!this.curApp.canCustomDecorate
      );
      // return true;
    }
  },

  watch: {
    '$store.state.templateId'(newVal) {
      if (newVal) {
        this.getHomePages();
      }
    }
  },

  methods: {
    // 获取所有首页
    getHomePages() {
      this.loadingHome = true;
      service
        .getHomePages({
          sellerTemplateId: this.curTemplateId,
          storeId: this.isAreaManager ? this.curStore.id : 0
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
        query: { pageIndex: val.index, library: library ? library : this.curLibrary, pageId: val.id }
      });
    },

    // 点击添加
    clickAddCustomPageButton() {
      this.loadingCustomPages = true;
      // 获取自定义页
      service
        .getCustomPagesV2({
          sellerTemplateId: this.curTemplateId,
          storeId: this.curLibrary === 'brand' ? 0 : this.curStore.id
        })
        .then(response => {
          if (response.data.length) {
            this.customPageList = response.data;
            this.dialogVisible = true;
          } else {
            this.$router.push({
              path: '/setting/homedecorate/custom-page/decorate',
              query: { library: this.isAreaManager ? 'store' : 'brand' }
            });
          }
        })
        .always(() => {
          this.loadingCustomPages = false;
        });
    },

    setHomePage(val) {
      this.dialogVisible = false;
      if (this.sourcePage && (val.index !== 'pages/home/index' && val.index !== 'wxat-common/pages/home/index')) {
        // 自定义页替换自定义页
        this.replaceCustomHomePage(val);
      } else {
        if (val.index === 'pages/home/index' || val.index === 'wxat-common/pages/home/index') {
          // 设置默认首页为首页
          this.setDefaultToHomePage(val);
        } else {
          // 设置自定义为首页
          this.setCustomToHomePage(val);
        }
      }
    },

    // 区域管理员设置门店首页
    setStoreHomePage(val, type) {
      if (type === 'brand') {
        this.setCustomToHomePage(val);
      } else {
        // 自定义页替换自定义页
        if (this.dataSource.length < 2) {
          this.setCustomToHomePage(val);
          return;
        }
        this.replaceCustomHomePage(val);
      }
    },
    // 批量设置多门店首页
    batchSetStroeHomePage(item) {
      this.currentStoreHomePage = item;
      this.batchDialogVisible = true;
    },

    clickReplace(val) {
      this.sourcePage = val;
      this.clickAddCustomPageButton();
    },

    // 设置首页
    setDefaultToHomePage(val) {
      service
        .setDefaultToHomePage({
          // index: val.index,
          pageId: val.id,
          sellerTemplateId: this.curTemplateId,
          storeId: this.isAreaManager ? this.curStore.id : 0
        })
        .then(response => {
          this.dialogVisible = false;
          this.getHomePages();
        });
    },

    setCustomToHomePage(val) {
      service
        .setCustomToHomePage({
          // index: val.index,
          pageId: val.id,
          sellerTemplateId: this.curTemplateId,
          storeId: this.isAreaManager ? this.curStore.id : 0
        })
        .then(response => {
          this.dialogVisible = false;
          this.getHomePages();
        });
    },

    replaceCustomHomePage(val) {
      service
        .replaceCustomHomePage({
          // preIndex: this.sourcePage.index,
          // currentIndex: val.index,
          pageId: val.id,
          sellerTemplateId: this.curTemplateId,
          storeId: this.isAreaManager ? this.curStore.id : 0
        })
        .then(response => {
          this.dialogVisible = false;
          this.getHomePages();
        });
      this.sourcePage = null;
    },

    // 移除自定义首页
    removeHomePage(val) {
      service
        .deleteCustomHomePage({
          index: val.index,
          pageId: val.id,
          sellerTemplateId: this.curTemplateId,
          storeId: this.isAreaManager ? this.curStore.id : 0
        })
        .then(response => {
          this.getHomePages();
        });
    },

    // 模板预览
    preview(id) {
      let template = JSON.stringify(this.templateConfig.theme.template);
      this.$router.push({
        path: '/setting/homedecorate/mini-index/preview',
        query: { templateId: id, template: template }
      });
    },

    // 选择模板
    choiceTemplate(id) {
      this.$confirm('此操作将更换您的整个小程序主题?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
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
      //一直保存自定义模板
      template = template || this.templateConfig.theme.template;
      const config = {
        theme: {
          sync: true,
          value: id,
          template: template
        },
        mineConfig: this.templateConfig.mineConfig
      };
      const params = {
        config: JSON.stringify(config),
        sellerTemplateId: this.curTemplateId
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
            navColor: template.navColor
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
          //更新各个tabBar页面的导航颜色和字体颜色
          tabBars.forEach(tabBar => {
            tabBar.navBackgroundColor = this.currentTemplate.navColor || '#ffffff';
            tabBar.navFrontColor = this.currentTemplate.navColor ? '#ffffff' : '#000000';
          });
          const strTabBarConfig = JSON.stringify(this.tabBarConfig);
          const params = {
            tabBarConfig: strTabBarConfig,
            id: this.curTemplateId
          };
          service.updateTemplate(params);
        }
      }
    },
    handleChangeLibrary(name) {
      this.curLibrary = name || 'brand';
      this.clickAddCustomPageButton();
    }
  }
};
</script>
