<template>
  <div>
    <!-- <el-cascader
      v-if="options"
      placeholder="请选择页面"
      style="width: 100%"
      expand-trigger="hover"
      :value="value"
      :options="options"
      @change="handleChange"
    /> -->
    <div class="custom-link" v-if="model && model.length && model[0] === 'custom' && model[1]">
      <div class="page-name">{{model[1] | customPageFormat}}</div>
      <div class="delete" @click="handelDelete"></div>
    </div>
    <div v-else class="link-page">
      <el-cascader
        placeholder="请选择链接位置"
        :options="linkPagesWithoutCustom"
        v-if="options"
        :value="model"
        @change="handlePageChange"
        expand-trigger="hover"
        style="width:100%"
        ref="linkElCascader"></el-cascader>
    </div>

    <el-dialog
      :visible.sync="show"
      size="large"
      width="52.5%"
      :modal-append-to-body="false"
      custom-class="template-page-dialog"
      @closed="handleClose">
      <div slot="title" class="template-page-header">
        <el-input class="template-page-header-input" v-model="keyword" placeholder="请输入自定义页名称" @keyup.enter.native="searchCustomPages"></el-input>
        <el-button class="template-page-header-btn" type="primary" @click="searchCustomPages">搜索</el-button>
      </div>

      <div class="template-page-dialo-container">
        <template v-if="pageList && pageList.length">
          <div
            class="template-page-item"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
            v-for="(item, index) in pageList"
            :key="index">
              <div class="preview"></div>
              <div class="name custom-name">{{ item.name || item.label }}</div>
              <div class="mask" :class="{'disabled': item.disabled}">
                <div @click="confirm(item)" v-if="!item.disabled" class="oper-item primary">确定</div>
              </div>
          </div>
        </template>

      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import linkSelectJs from '@/dss-wechat3rd/src/bz_components/linkSelect/index.js';
import articleApi from '@/dss-wechat3rd/src/api/market-article';

// 减少不必要的请求
let data$ = null;

export default {
  mixins: [appFeaturesMixin, industryHelperMixin],
  props: {
    value: { type: Array, default: () => [] },
    selectFn: { type: Function, default: null }
  },
  computed: {
    ...mapState({ curApp: 'curApp' }),
    ...mapState({ env: 'env' }),
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    linkPagesWithoutCustom() {
      return (this.options || []).map(item => {
        if (item.value === 'custom') {
          return {
            label: '自定义页',
            value: 'custom'
          };
        } else {
          return item;
        }
      });
    },
    customPageList() {
      const pages = (this.options || []).find(item => item.value === 'custom');
      return (pages && pages.children) || [];
    }
  },
  data() {
    return {
      options: null,
      linkMixins: linkSelectJs,
      page: {
        pageNo: 1,
        pageSize: 1000
      },
      pageList: [],
      keyword: null,
      show: false,
      checkedList: []
    };
  },

  filters: {
    customPageFormat(val) {
      const name = JSON.parse(val || '{}').name || '';
      return `自定义页 / ${name}`;
    }
  },

  watch: {
    customPageList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.searchCustomPages();
      }
    }
  },

  async mounted() {
    if (data$) {
      this.options = await data$;
      return;
    }
    data$ = (async () => {
      const batchRequest = this.mGetLinkSelectBatchRequest(linkSelectJs);
      await Promise.all(batchRequest);
      let _options = this.mGetLinkSelectOptions(linkSelectJs).slice(0, 3);

      if (!!this.curApp.multiSkuApp) {
        // 晒单
        const sellerShowChildren = [
          { label: '所有商品晒单', value: JSON.stringify({ id: 'all', name: '所有商品晒单' }) },
          { label: '按商品标签选', value: JSON.stringify({ id: 'label', name: '按商品标签选' }) }
        ];
        const sellerShowOption = {
          label: '晒单',
          value: 'unbox',
          children: sellerShowChildren
        };
        const articlesOption = await this.apiArticles();
        _options.push(articlesOption, sellerShowOption);
      }

      return _options;
    })();
    this.options = await data$;
  },
  methods: {
    async apiArticles() {
      let groups;
      // 营销图文分类
      const { data: postGroups, totalCount } = await articleApi.categoryList({
        pageNo: 1,
        pageSize: 100
      });
      // 加载全部的图文分类
      if (!!postGroups && totalCount > postGroups.length) {
        const { data: postAllGroups } = await articleApi.categoryList({
          pageNo: 1,
          pageSize: totalCount
        });
        groups = postAllGroups;
      } else {
        groups = postGroups;
      }
      return {
        children: groups.map(g => ({
          label: g.categoryName,
          value: JSON.stringify({ id: g.id, name: g.categoryName })
        })),
        label: '营销图文分类',
        value: 'article'
      };
    },
    handleChange(val) {
      this.$emit('change', val);
    },
    searchCustomPages() {
      if (!this.keyword) return (this.pageList = this.customPageList);
      const pages = [];
      this.customPageList.forEach(item => {
        if ((item.name || item.label).includes(this.keyword)) pages.push(item);
      });
      this.pageList = pages;
    },
    confirm(item) {
      const val = ['custom', item.value];
      this.checkedList = val;
      this.$set(this.model, 1, item.value);
      this.$emit('change', val);
      this.show = false;
    },
    handlePageChange(e) {
      if (e && e[0] === 'custom') {
        this.show = true;
        this.checkedList = ['custom'];
      } else {
        this.checkedList = e;
        this.model = e;
        this.$emit('change', e);
      }
    },
    handleClose() {
      this.keyword = null;
      if (
        this.checkedList &&
        this.checkedList.length &&
        this.checkedList[0] === 'custom' &&
        this.checkedList.length < 2
      ) {
        let obj = {};
        obj.stopPropagation = () => {};
        this.$refs.linkElCascader.clearValue(obj);
      }
    },
    handelDelete() {
      this.model = [];
      this.$emit('change', []);
    }
  }
};
</script>

<style lang="less" scoped>
.custom-link {
  color: #606266;
  padding: 0 10px;
  box-sizing: border-box;
  overflow: hidden;
  display: flex;

  .page-name {
    max-width: 194px;
    overflow: hidden;
  }

  .delete {
    width: 15px;
    height: 15px;
    background: transparent url(../../images/close.png) no-repeat 0 0;
    background-size: cover;
    margin-left: 4px;
    display: inline-block;
    cursor: pointer;
  }
}

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

        &.disabled {
          cursor: not-allowed;
        }

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
