<template>
  <el-dialog :visible.sync="show" size="large" top="10vh" width="52.5%" class="select-custom-page-dialog" :modal-append-to-body="false">
    <!-- (品牌)装修模板 -->
    <div class="brand-container">
      <div class="library-title">装修模板</div>
      <div class="dialog-content" v-loading="loadingTemplatePages" style="margin-bottom: 10px;">
        <div
          class="custom-page-item"
          :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
          v-for="(item, index) in templatePage"
          :key="index"
        >
          <div class="preview"></div>
          <div class="name custom-name">{{ item.name }}</div>
          <div class="mask">
            <div @click="reviewPage(item, 'brand')" class="oper-item primary">{{ viewButtonText }}</div>
            <div class="oper-item" @click="copyToCustomPage(item)">
              添加到自定义页
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="store-container">
      <div class="library-title">门店自定义页</div>
      <div class="dialog-content" v-loading="loadingCustomPages">
        <div
          class="custom-page-item"
          :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
          v-for="(item, index) in customPageList"
          :key="index"
        >
          <div class="preview"></div>
          <div class="name custom-name">{{ item.name }}</div>
          <div class="mask">
            <div @click="reviewPage(item, 'store')" class="oper-item primary">{{ viewButtonText }}</div>
            <div class="oper-item" @click="setHomePage(item)" v-if="!currentHomePage || currentHomePage.id !== item.id">
              {{ setButtonText }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index';
export default {
  name: 'select-custom-page-dialog-new',
  props: {
    visible: {
      type: Boolean,
      default: false
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
      customPageList: [],
      templatePage: [],
      loadingTemplatePages: false
    };
  },
  watch: {
    show() {
      if (this.show) this.fetchCustomPages();
    }
  },
  mounted() {},
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
    fetchCustomPages() {
      this.fetchTemplateList();
      this.getCustomPages();
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
      this.loadingTemplatePages = true;
      service
        .fetchDecorationTemplateList({
          sellerTemplateId: this.curTemplateId
        })
        .then(response => {
          this.templatePage = response.data || [];
        })
        .always(() => {
          this.loadingTemplatePages = false;
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
    },
    async copyToCustomPage(item) {
      this.loadingTemplatePages = true;
      try {
        const { data } = await service.copyBrandPageToStore({
          sellerTemplateId: this.curTemplateId,
          pageId: item.id
        });
        if (data) {
          this.$message.success('添加成功');
          this.getCustomPages();
        }
      } finally {
        this.loadingTemplatePages = false;
      }
    }
  }
};
</script>

<style lang="less">
.select-custom-page-dialog {
  .el-dialog__header {
    padding: 0;
  }

  .library-title {
    height: 20px;
    font-size: 14px;
    color: #333333;
    line-height: 20px;
    margin: 10px 0;
  }

  .dialog-content {
    height: 300px;
    overflow-y: auto;
    overflow-y: auto;
    display: flex;
    justify-content: flex-start;
    flex-wrap: wrap;
    margin-right: -20px;

    .custom-page-item {
      width: 225px;
      height: 290px;
      border: 1px solid #DCDEE0;
      border-radius: 2px;
      position: relative;
      margin: 0 20px 20px 0;
      background-size: cover !important;

      .name.custom-name {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 40px;
        line-height: 40px;
        text-align: center;
        background: #f6f6f6;
        font-size: 16px;
        color: #333333;
      }

      .mask {
        display: none;
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(255, 255, 255, .8);

        .oper-item {
          width: 100px;
          height: 30px;
          line-height: 30px;
          text-align: center;
          background: rgba(56, 121, 251, .06);
          border: 1px solid #3879fb;
          border-radius: 15px;
          color: #3879fb;
          font-size: 12px;
          cursor: pointer;

          &.primary {
            border-width: 0;
            background: #3879fb;
            color: #ffffff;
            margin-bottom: 16px;
          }
        }
      }

      &:hover {
        .mask {
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>