<template>
  <switch-store-tip>
    <div class="mini-index" style="padding: 24px; background: #fff">
      <div class="home-decorate-tips">
        <span class="tips-item"> 1.门店首页装修：企业设置的默认模板为默认首页 </span>
        <span class="tips-item"> 2.区域管理员或店长可选择模板(支持编辑)，设为门店首页 </span>
        <span class="tips-item"> 3.区管可创建首页，一键同步至辖区内门店 </span>
        <span class="tips-item"> 4.门店仅支持装修本门店首页。 </span>
      </div>
      <!-- 默认主页及备用列表 -->
      <div class="template-decorate-container" v-loading="loading">
        <div class="custom-page-wrapper" v-for="(item, index) in templateList" :key="index">
          <div class="bg-content" :style="getItemImgUrl(item)">
            <div class="current-home-box" v-if="item.homeType == 3">当前主页</div>
            <div class="mask">
              <div
                :class="[
                  'btn-box',
                  { 'btn-box-center': !canCustomDecorate || (!isStoreKeeper && !isMultiStoreManager) },
                ]"
              >
                <template v-if="canCustomDecorate && (isStoreKeeper || isMultiStoreManager)">
                  <div class="btn" @click="reviewPage(item)">编辑</div>
                  <div class="btn" @click="deletePage(item)" v-if="item.homeType != 3">删除</div>
                  <div class="btn" @click="replacePage(item)" v-if="item.homeType != 3">替换</div>
                  <div class="btn" v-if="item.homeType != 3" @click="setHomePage(item)">设为主页</div>
                  <div class="btn" v-if="item.originStoreId === 0 && item.homeType === 3">
                    <el-checkbox :value="!!item.synBrandTemplate" @change="handleSync(item, $event)">
                      <span style="color: #2e8dff">同步总部更新</span>
                    </el-checkbox>
                  </div>
                </template>
                <!-- 查看 -->
                <template v-else>
                  <div class="btn" style="margin: 0" @click="reviewPage(item, true)">查看</div>
                </template>
              </div>
            </div>
          </div>
          <div class="name">{{ item.name }}</div>
        </div>

        <div
          class="custom-page-wrapper"
          @click="clickAddCustomPageButton"
          v-if="canCustomDecorate && (isStoreKeeper || isMultiStoreManager) && templateList.length < 2"
        >
          <div class="bg-content">
            <div class="preview add">
              <i class="el-icon-plus"></i>
              选择模板
            </div>
          </div>
          <div class="name"></div>
        </div>
      </div>

      <!-- 选择自定义页弹窗 -->
      <select-custom-page-dialog-new
        :visible.sync="visibleSelectPage"
        :cur-template-id="curTemplateId"
        :current-home-page="currentHomePage"
        :cur-store="curStore"
        :is-manager="isMultiStoreManager"
        @set-home-page="handleReplacePage"
      ></select-custom-page-dialog-new>

      <select-store-dialog @succeed="fetchTemplateList" :page="currentItem" :visible.sync="visibleSelectStore" />
    </div>
  </switch-store-tip>
</template>

<script>
  import { mapState } from 'vuex';
  import './index.less';
  import service from '@/dss-wechat3rd/src/api/index';
  import store from '@/business-common/store.js';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  // import SelectCustomPageDialog from './select-custom-page-dialog.vue';
  import SelectCustomPageDialogNew from './select-custom-page-dialog-new.vue';
  import SelectStoreDialog from './batch-store-operating.vue';
  import SwitchStoreTip from '@/business-common/components/switch-store-tip/index.vue';

  const TABS = [
    {
      label: '装修模板',
      value: 'brand',
    },
    {
      label: '自定义页',
      value: 'store',
    },
  ];

  export default {
    name: 'StoreDecoration',
    mixins: [industryHelperMixin],
    components: { SelectStoreDialog, SwitchStoreTip, SelectCustomPageDialogNew },

    data() {
      return {
        timestamp: Date.now(),
        curTemplateId: null,
        templateList: [],
        loading: false,
        visibleSelectPage: false,
        visibleSelectStore: false,
        tabs: TABS,
        currentItem: null,
        // 当前的 门店主页
        currentIndex: null,
      };
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        storeList: 'storeList',
        roleList: 'roleList',
        curApp: 'curApp',
      }),

      // 经销商 或 区管
      isMultiStoreManager() {
        const isAreaManager = !!~this.roleList.split(',').indexOf('common_role_area_manager');
        const isDealer = !!~this.roleList.split(',').indexOf('common_role_dealer_manager');

        return (isAreaManager || isDealer) && this.canCustomDecorate;
      },

      // 店长
      isStoreKeeper() {
        return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
      },

      // 是否支持门店装修
      canCustomDecorate() {
        return !!this.curApp.canCustomDecorate;
      },

      currentHomePage() {
        return (this.templateList || []).find(page => page.homeType === 3);
      },
    },

    mounted() {
      service.getUserTemplate().then(response => {
        if (response.data && response.data.templateId) {
          this.curTemplateId = response.data.id;
          store.commit('set_sellerTemplateId', this.curTemplateId);
          this.fetchTemplateList();
        }
      });
    },

    methods: {
      // 获取默认主页及备用列表
      async fetchTemplateList() {
        if (!this.curTemplateId) return;
        this.loading = true;
        try {
          if (this.canCustomDecorate) {
            const { data } = await service.fetchStoreIndexList({
              sellerTemplateId: this.curTemplateId,
              storeId: this.curStore.id,
            });
            this.templateList = data || [];
            this.currentIndex = this.templateList.find(page => page.homeType === 3);
          } else {
            // 不支持门店装修则展示当前生效的品牌模板
            const { data } = await service.fetchDecorationTemplateList({
              sellerTemplateId: this.curTemplateId,
            });
            this.templateList = (data || []).filter(item => item.homeType === 3);
          }
        } finally {
          this.loading = false;
        }
      },

      // 编辑 (查看)
      async reviewPage(item, notAllowedEdit = false) {
        // 编辑品牌模板先调复制品牌页接口
        if (item.storeId === 0 && !notAllowedEdit) {
          this.loading = true;
          try {
            const { data } = await service.copyBrandPage({
              sellerTemplateId: this.curTemplateId,
              pageId: item.id,
            });
            const res = await service.fetchStoreIndexList({
              sellerTemplateId: this.curTemplateId,
              storeId: this.curStore.id,
            });
            const templateList = res.data || [];
            if (!!data && templateList.length) {
              const copyPage = templateList.find(_item => _item.id === data);
              this.$router.push({
                path: '/setting/homedecorate/custom-page/decorate',
                query: {
                  pageIndex: copyPage.index,
                  pageId: copyPage.id,
                  library: 'store',
                  notAllowedEdit,
                },
              });
            }
          } finally {
            this.loading = false;
          }
          return;
        }
        this.$router.push({
          path: '/setting/homedecorate/custom-page/decorate',
          query: {
            pageIndex: item.index,
            pageId: item.id,
            library: item.storeId ? 'store' : 'brand',
            notAllowedEdit,
          },
        });
      },

      // 设置为主页
      async setHomePage(item) {
        try {
          this.currentItem = item;
          if (this.isMultiStoreManager) {
            this.visibleSelectStore = true;
          } else {
            // 店长
            this.loading = true;
            await service.setCustomToHomePageV3({
              sellerTemplateId: this.curTemplateId,
              pageId: item.id,
            });
            await this.fetchTemplateList();
          }
        } finally {
          this.loading = false;
        }
      },

      clickAddCustomPageButton() {
        this.visibleSelectPage = true;
      },

      getItemImgUrl(item) {
        if (item) {
          return `background: url(${item.imgUrl}) 0px 0px / cover no-repeat transparent;`;
        }
        return null;
      },

      replacePage(item) {
        this.currentItem = item;
        this.visibleSelectPage = true;
      },

      async deletePage(item) {
        this.currentItem = item;
        try {
          this.loading = true;
          await service.deleteHomePage({ pageId: item.id, sellerTemplateId: this.curTemplateId });
          await this.fetchTemplateList();
        } finally {
          this.loading = false;
        }
      },

      async handleReplacePage(page) {
        try {
          this.loading = true;
          await service.setCustomToHomePageV3({ pageId: page.id, sellerTemplateId: page.sellerTemplateId });
          await this.fetchTemplateList();
        } finally {
          this.loading = false;
        }
      },

      async handleSync(item, $event) {
        if ($event) {
          try {
            await this.$confirm(
              '勾选同步总部更新后，一旦总部更新模板，无论您是否编辑过，总部模板将会覆盖当前首页。',
              '温馨提示',
              { showCancelButton: false, confirmButtonText: '知道了' }
            );
          } finally {
            // ignore
          }
        }
        await service.syncHomePage({ sellerTemplateId: this.curTemplateId, synBrandTemplate: $event ? 1 : 0 });
        item.synBrandTemplate = $event;
      },
    },
  };
</script>

<style lang="less" scoped>
  .home-decorate-tips {
    .tips-item {
      padding: 0;
    }
  }

  .choose-store {
    margin-top: 20px;
  }
</style>
