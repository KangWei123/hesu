<template>
  <el-dialog :visible.sync="show" size="large" :modal-append-to-body="false">
    <div slot="title">
      <div class="library-tab">
        <el-button
          v-for="(item, i) in tabs"
          :key="i"
          class="library-tab-item"
          :class="{ active: curLibrary === item.value }"
          round
          @click="handleChangeLibrary(item.value)"
          >{{ item.label }}</el-button
        >
      </div>
    </div>

    <div class="mini-index-dialog" v-loading="loadingCustomPages">
      <div
        class="custom-page-block"
        :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
        v-for="(item, index) in customPageList"
        :key="index"
      >
        <div class="preview"></div>
        <div class="name custom-name">{{ item.name }}</div>
        <div class="mask">
          <div @click="reviewPage(item)" class="oper-item">{{ viewButtonText }}</div>
          <div class="oper-item" @click="setHomePage(item)" v-if="!currentHomePage || currentHomePage.id !== item.id">
            {{ setButtonText }}
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index';
export default {
  name: 'select-custom-page-dialog',
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    tabs: {
      type: Array,
      default: []
    },
    curTemplateId: {
      type: [String, Number],
      default: null
    },
    curStore: {
      type: Object,
      default: () => {}
    },
    isManager: {
      type: Boolean,
      default: false
    },
    viewButtonText: {
      type: String,
      default: '查看'
    },
    setButtonText: {
      type: String,
      default: '设置为主页'
    },
    currentHomePage: {
      type: Object
    }
  },
  data() {
    return {
      curLibrary: null,
      loadingCustomPages: false,
      customPageList: []
    };
  },
  watch: {
    show() {
      if (this.show) this.fetchCustomPages();
    }
  },
  mounted() {
    if (this.tabs.length) this.curLibrary = this.tabs[0].value;
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    // 切换tabs
    handleChangeLibrary(val) {
      this.curLibrary = val;
      this.fetchCustomPages();
    },

    fetchCustomPages() {
      if (this.curLibrary === 'brand') this.fetchTemplateList();
      else this.getCustomPages();
    },
    /**
     * 获取所有自定义页
     * @param sellerTemplateId
     * @param storeId 品牌库：0 门店库：id
     */
    getCustomPages() {
      this.loadingCustomPages = true;
      // 获取自定义页
      service
        .getCustomPagesV3({
          sellerTemplateId: this.curTemplateId,
          storeId: this.curStore.id
        })
        .then(response => {
          this.customPageList = response.data || [];
        })
        .always(() => {
          this.loadingCustomPages = false;
        });
    },
    fetchTemplateList() {
      this.loadingCustomPages = true;
      service
        .fetchDecorationTemplateList({
          sellerTemplateId: this.curTemplateId
        })
        .then(response => {
          this.customPageList = response.data || [];
        })
        .always(() => {
          this.loadingCustomPages = false;
        });
    },
    // 查看自定义页详情
    reviewPage(val, library) {
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { pageIndex: val.index, library: library ? library : this.curLibrary, pageId: val.id }
      });
    },
    setHomePage(item) {
      this.$emit('set-home-page', item);
      this.show = false;
    }
  }
};
</script>