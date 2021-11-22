<template>
  <div class="link-select">
    <div class="custom-link link-page" v-if="navigationType === 'custom' && model[1]">
      <span v-if="showLabel" class="link-title">链接：</span>
      <div class="page-name">{{ model[1] | customPageFormat }}</div>
      <div class="delete" @click="handelDelete"></div>
    </div>
    <div class="link-page" v-else-if="showH5Url(navigationType)">
      <span v-if="showLabel" class="link-title" style="padding: 0 4px">H5 链接：</span>
      <link-input v-model="model[1]" />
      <div class="delete" @click="handelDelete"></div>
    </div>
    <div class="link-page" v-else-if="navigationType === 'miniProgram'">
      <span v-if="showLabel" class="link-title" style="padding: 0 4px">小程序链接：</span>
      <link-app-input v-model="model[1]" />
      <div class="delete" @click="handelDelete"></div>
    </div>
    <div v-else-if="navigationType === 'scoreActivity'" class="choose-box">
      <span v-if="showLabel" class="link-title">链接：</span>
      <span v-if="!!model[1]" class="link-page">
        <span class="text">{{ JSON.parse(model[1]).name }}</span>
        <span class="delete" @click="handelDelete"></span>
      </span>
      <div v-else class="dss-link1">
        <a @click="chooseDetail(navigationType)">选择活动</a>
      </div>
    </div>

    <div
      v-else-if="navigationType === 'merchant' && model[1] && JSON.parse(model[1]).linkType !== 'merchant-list'"
      class="choose-box"
    >
      <span v-if="showLabel" class="link-title">链接：</span>
      <span v-if="!!model[2]" class="link-page">
        <span class="text">{{ JSON.parse(model[2]).name }}</span>
        <span class="delete" @click="handelDelete" />
      </span>
      <div class="dss-link1" v-else>
        <a @click="chooseDetail(JSON.parse(model[1]).linkType)">选择{{ JSON.parse(model[1]).name }}</a>
        <span class="delete" @click="handelDelete" />
      </div>
    </div>

    <div v-else class="link-page">
      <span v-if="showLabel" class="link-title">链接：</span>
      <el-cascader
        placeholder="请选择链接位置"
        class="input"
        :options="linkPagesWithoutCustom"
        :size="size"
        v-model="model"
        @change="handlePageChange"
        expand-trigger="click"
        ref="linkElCascader"
        filterable
      ></el-cascader>
    </div>

    <!-- <el-cascader placeholder="请输入内容"
                 :options="linkPagesWithoutCustom"
                 :size="size"
                 v-model="model"
                 @change="handlePageChange"
                 expand-trigger="hover"
                 style="width:100%"
                ref="linkElCascader"
                 filterable></el-cascader> -->
    <div class="link-page__tip" v-if="showH5Url(navigationType)">
      H5的域名需配置到微信公众平台，否则有可能在小程序无法正常打开，若需配置域名，请联系惟客工作人员
    </div>

    <el-dialog
      :visible.sync="show"
      size="large"
      width="52.5%"
      :modal-append-to-body="false"
      custom-class="template-page-dialog"
      @closed="handleClose"
    >
      <div slot="title" class="template-page-header">
        <el-input
          class="template-page-header-input"
          v-model="keyword"
          placeholder="请输入自定义页名称"
          @keyup.enter.native="searchCustomPages"
        ></el-input>
        <el-button class="template-page-header-btn" type="primary" @click="searchCustomPages">搜索</el-button>
      </div>

      <div class="template-page-dialo-container">
        <template v-if="pageList && pageList.length">
          <div
            class="template-page-item"
            :style="'background: transparent url(' + item.imgUrl + ') no-repeat 0 0;background-size: cover;'"
            v-for="(item, index) in pageList"
            :key="index"
          >
            <div class="preview"></div>
            <div class="name custom-name">{{ item.name || item.label }}</div>
            <div class="mask">
              <div @click="confirm(item)" class="oper-item primary">确定</div>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>

    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
      :enable-multiple="false"
      :goods-type="goodsType"
      :show-label="false"
      :title="'选择' + goodsType.label"
      :filter-list="filterList"
      :inner-dialog="true"
      :close-on-click-modal="false"
    ></select-dialog>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';
  import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
  import LinkInput from './link-input';
  import LinkAppInput from './link-app-input';
  import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import FilterDataMixin from '@/dss-wechat3rd/src/decorate_components/mixins/filter-data-mixin';

  export default {
    name: 'LinkSelect',
    mixins: [appFeaturesMixin, industryHelperMixin, FilterDataMixin],
    components: { LinkInput, LinkAppInput, selectDialog },
    props: {
      showLabel: {
        type: Boolean,
        default: true,
      },
      size: {
        type: String,
        default: '',
      },
      length: {
        type: Number,
        default: null,
      },
      linkMixins: {
        type: Object,
        default: function () {
          return {};
        },
      },
      selectedOptions: {
        type: Array,
        default: function () {
          return [];
        },
      },
      filterLinkOptions: {
        type: Function,
        default: i => i,
      },
    },

    computed: {
      ...mapState({
        env: 'env',
      }),
      navigationType() {
        return this.model && this.model.length && this.model[0];
      },
      model: {
        get() {
          return this.selectedOptions;
        },
        set(val) {
          this.$nextTick(() => {
            this.$emit('input', val);
          });
        },
      },
      linkPagesWithoutCustom() {
        return (this.linkOptions || []).map(item => {
          if (item.value === 'custom') {
            return {
              label: '自定义页',
              value: 'custom',
            };
          } else {
            return item;
          }
        });
      },
      customPageList() {
        const pages = (this.linkOptions || []).find(item => item.value === 'custom');
        return (pages && pages.children) || [];
      },

      // 计算属性判断是否展示h5链接
      showH5Url() {
        return navigationType => {
          return navigationType === 'url' || navigationType === 'coral-url' || navigationType === '24haowan-url';
        };
      },

      filterList() {
        let list = [];

        try {
          const type = this.model && JSON.parse(this.model[1]).linkType;

          switch (type) {
            case 'merchant':
              list = [
                {
                  type: 'input',
                  paramName: 'nameOrCode',
                  label: '关键字',
                  showFormLabel: true,
                },
                {
                  type: 'select',
                  paramName: 'merchantStoreId',
                  label: '项目：',
                  showFormLabel: true,
                  selectOptions: this.storeOptions,
                },
                {
                  type: 'select',
                  paramName: 'tenantCategoryId',
                  label: '经营类目',
                  showFormLabel: true,
                  selectOptions: this.categoryOptions,
                },
              ];
              break;
          }

          return list;
        } catch {
          return list;
        }
      },
    },

    data() {
      return {
        linkOptions: [],
        pageList: [],
        keyword: null,
        show: false,
        checkedList: [],
        detailDialog: false,
        goodsType: goodsTypeEnum.scoreActivity,
        linkId: '',
      };
    },

    watch: {
      customPageList: {
        deep: true,
        immediate: true,
        handler(val) {
          this.searchCustomPages();
        },
      },
    },

    filters: {
      customPageFormat(val) {
        const name = JSON.parse(val || '{}').name || '';
        return `自定义页 / ${name}`;
      },
    },

    mounted() {
      this.linkOptions.push(...this.mGetLinkSelectOptions(this.linkMixins));
      if (this.length) {
        this.linkOptions = this.linkOptions.slice(0, this.length);
      }
      this.linkOptions = this.filterLinkOptions(this.linkOptions);
    },

    methods: {
      change(val) {
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
        const type = e && e[0];
        if (type === 'custom') {
          this.show = true;
          this.checkedList = ['custom'];
        } else if (type === 'url') {
          const value = ['url', ''];
          this.model = value;
          this.$nextTick(() => {
            this.$emit('change', value);
          });
        } else {
          this.checkedList = e;
          this.model = e;
          if (e[1]) {
            this.linkId = JSON.parse(e[1]).linkType;
          }
          this.$nextTick(() => {
            this.$emit('change', e);
          });
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
          const obj = {};
          obj.stopPropagation = () => {};
          this.$refs.linkElCascader.clearValue(obj);
        }
      },
      handelDelete() {
        this.linkId = '';
        this.model = [];
      },

      chooseDetail(type) {
        this.goodsType = goodsTypeEnum[type];
        this.detailDialog = true;
      },

      onChooseGoods(val) {
        if (val) {
          this.model[1] = this.model[2] = JSON.stringify({
            id: val.link || val.id,
            name: val.title || val.categoryName || val.name,
            storeId: val.storeId,
            linkId: this.linkId,
          });
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .link-select {
    flex: 1;
  }

  .link-page__tip {
    color: gray;
    font-size: 12px;
    margin-top: 5px;
  }

  .link-title {
    display: inline-block;
    text-align: center;
    white-space: nowrap;
    padding: 0 13px;
    color: #303133;
    font-size: 12px;
  }

  .link-page {
    display: inline-flex;
    align-items: center;
    flex: 1;

    .input {
      flex: 1;
    }
  }

  .delete {
    width: 15px;
    height: 15px;
    background: transparent url(../../images/close.png) no-repeat 0 0;
    background-size: cover;
    margin-left: 4px;
    display: inline-block;
    cursor: pointer !important;
    flex-shrink: 0;
  }

  .custom-link {
    color: #606266;
    // padding: 0 10px;
    box-sizing: border-box;
    overflow: hidden;
    display: flex;

    .page-name {
      max-width: 154px;
      overflow: hidden;
      margin-left: 6px;
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
        border: 1px solid #dcdee0;
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
          color: #333;
        }

        .mask {
          display: none;
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(255, 255, 255, 0.8);

          .oper-item {
            width: 100px;
            height: 30px;
            line-height: 30px;
            text-align: center;
            background: rgba(56, 121, 251, 0.06);
            border: 1px solid #3879fb;
            border-radius: 15px;
            color: #3879fb;
            font-size: 12px;
            cursor: pointer;

            &.primary {
              border-width: 0;
              background: #3879fb;
              color: #fff;
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

  .cascader-visible {
    display: block;
  }

  .cascader-hide {
    display: none;
  }

  .choose-box {
    line-height: 28px;
    display: flex;

    .text {
      display: inline-block;
      max-width: 150px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
  }

  .dss-link1 {
    display: inline-flex;
    align-items: center;
  }
</style>
