<template>
  <el-dialog :visible.sync="show" size="large" width="52.5%" :modal-append-to-body="false" custom-class="template-page-dialog">
    <div slot="title" class="template-page-header">
      <el-input class="template-page-header-input" v-model="keyword" placeholder="请输入自定义页名称" @keyup.enter.native="searchCustomPages"></el-input>
      <el-button class="template-page-header-btn" type="primary" @click="searchCustomPages">搜索</el-button>
    </div>

    <div class="template-page-dialo-container" v-loading="loadingCustomPages">
      <div
        class="template-page-item"
        :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
        v-for="(item, index) in pageList"
        :key="index"
      >
          <div class="preview"></div>
          <div class="name custom-name">{{ item.name }}</div>
          <div class="mask">
            <div @click="reviewPage(item)" class="oper-item primary">{{viewButtonText}}</div>
            <template v-if="!item.__has">
              <div class="oper-item" @click="setHomePage(item)">{{setButtonText}}</div>
            </template>
          </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/index';
export default {
  name: 'select-template-page-dialog',
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
    // 当前已设置的模板列表
    templateList: {
      type: Array,
      default: () => []
    },
    viewButtonText: {
      type: String,
      default: '查看'
    },
    setButtonText: {
      type: String,
      default: '设置为主页'
    }
  },
  data() {
    return {
      loadingCustomPages: false,
      customPageList: [],
      keyword: null,
      pageList: []
    };
  },
  watch: {
    show() {
      if (!this.customPageList.length) this.fetchCustomPages();
    }
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
    searchCustomPages() {
      if (!this.keyword) return (this.pageList = this.customPageList);
      const pages = [];
      this.customPageList.forEach(item => {
        if (item.name.includes(this.keyword)) pages.push(item);
      });
      this.pageList = pages;
    },

    /**
     * 获取所有自定义页
     * @param sellerTemplateId
     * @param storeId 品牌库：0 门店库：id
     */
    fetchCustomPages() {
      this.loadingCustomPages = true;
      this.keyword = null;
      // 获取自定义页
      service
        .getCustomPagesV3({
          sellerTemplateId: this.curTemplateId,
          storeId: 0
          // name: this.keyword
        })
        .then(response => {
          if (response.data.length) {
            const list = response.data || [];
            // 已存在模板列表不展示'设置主页'按钮
            (this.templateList || []).forEach(template => {
              list.forEach(item => {
                if (template.id === item.id) item.__has = true;
              });
            });
            this.pageList = this.customPageList = list;
          } else {
            this.$router.push({
              path: '/setting/homedecorate/custom-page/decorate',
              query: { library: this.isManager ? 'brand' : 'store' }
            });
          }
        })
        .always(() => {
          this.loadingCustomPages = false;
        });
    },
    // 查看自定义页详情
    reviewPage(val) {
      this.$router.push({
        path: '/setting/homedecorate/custom-page/decorate',
        query: { pageIndex: val.index, library: 'brand', pageId: val.id }
      });
    },
    setHomePage(item) {
      this.$emit('set-home-page', item);
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.template-page-dialog {
  .template-page-header {
    display: flex;

    .template-page-header-input {
      width: 246px;
    }

    .template-page-header-btn {
      border-radius: 0;
    }
  }

  .template-page-dialo-container {
    height: 438px;
    overflow-y: auto;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-right: -20px;

    .template-page-item {
      width: 225px;
      height: 290px;
      border: 1px solid #DCDEE0;
      border-radius: 2px;
      position: relative;
      // float: left;
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