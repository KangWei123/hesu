<template>
  <div v-if="status">
    <div class="custom-link" v-if="model && model.length && model[0] === 'custom' && model[1] && JSON.parse(model[1]).index">
      <div class="page-name">{{model[1] | customPageFormat}}</div>
      <div class="delete" @click="handelDelete"></div>
    </div>
    <template v-else>
      <el-cascader
        :options="linkPagesWithoutCustom"
        :size="size"
        v-model="model"
        @change="handlePageChange"
        expand-trigger="hover"
        style="width:155px"
        :show-all-levels="showAllLevels"
        ref="linkElCascader"
        filterable
      ></el-cascader>
    </template>

    <el-dialog
      :visible.sync="show"
      size="large"
      width="52.5%"
      :modal-append-to-body="true"
      :append-to-body="true"
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
              <div class="mask" :style="{cursor: item.disabled ? 'not-allowed' : ''}">
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
import mixins from './index.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
export default {
  name: 'tabbarLinkSelect',
  mixins: [industryHelperMixin],
  props: {
    size: {
      type: String,
      default: 'medium'
    },
    selectedOptions: {
      type: Array,
      default: function() {
        return [];
      }
    },
    usedPages: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },

  computed: {
    ...mapState({
      customPages: 'customPages',
      env: 'env'
    }),

    model: {
      get() {
        return this.selectedOptions;
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

  watch: {
    usedPages(newVal, oldVal) {
      if (newVal !== oldVal) {
        this.assemblyData();
      }
    },
    customPageList: {
      deep: true,
      immediate: true,
      handler(val) {
        this.searchCustomPages();
      }
    }
  },

  data() {
    return {
      showAllLevels: false,
      status: false,
      options: [],
      pageList: [],
      keyword: null,
      show: false,
      checkedList: []
    };
  },

  filters: {
    customPageFormat(val) {
      const name = JSON.parse(val || '{}').name || '';
      return name;
    }
  },

  mounted() {
    this.assemblyData();
  },

  methods: {
    // 组装数据
    assemblyData() {
      const librayList = this.mGetTabbarLinkList();
      const diableCustomPage = this.usedPages.custom;
      const diableDefaultPage = this.usedPages.default;
      mixins.getCustomPage(this.customPages, diableCustomPage || [], () => {
        mixins.getDefaultPage(librayList, diableDefaultPage, () => {
          this.status2 = true;
          this.options = [
            {
              value: 'custom',
              label: '自定义页',
              children: mixins.customPages
            },
            {
              value: 'default',
              label: '系统默认页',
              children: mixins.defaultPages
            }
          ];

          this.status = true;
        });
      });
    },

    change(val) {
      this.$emit('change', val);
    },

    handelDelete() {
      this.model = [];
      this.$emit('change', []);
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
  display: flex !important;

  .page-name {
    max-width: 194px;
    overflow: hidden;
  }

  .delete {
    width: 15px;
    height: 15px;
    background: transparent url(../../images/close.png) no-repeat 0 0;
    background-size: 15px;
    margin-left: 6px;
    display: inline-block !important;
    cursor: pointer;
  }
}

.template-page-dialog {
  .template-page-header {
    display: flex !important;

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
    display: flex !important;
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
        display: none !important;
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
          display: flex !important;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }
      }
    }
  }
}
</style>
