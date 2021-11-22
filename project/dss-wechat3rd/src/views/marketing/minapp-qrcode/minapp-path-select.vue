<template>
  <div>
    <template>
      <div class="custom-link" v-if="model && model.length && model[0] === 'other' && model[1] === 'custom' && model[2] && model[2].index">
        <div class="page-name">{{ model[2]['name'] || '自定义页' }}</div>
        <div class="delete" @click="handelDelete"></div>
      </div>

      <el-cascader
        v-else
        :loading="!status"
        :options="options"
        :size="size"
        v-model="model"
        @change="handlePageChange"
        expand-trigger="hover"
        style="width:155px"
        ref="linkElCascader"
        :show-all-levels="showAllLevels"
      ></el-cascader>
    </template>
    <div class="nav-row" v-if="lastSelectedItem && lastSelectedItem.linkType && lastSelectedItem.linkId">
      <div class="nav-column">
        <div v-if="!!lastSelectedItem.detailUrl">
          <div
            class="detail-image"
            :style="{ background: 'transparent url(' + lastSelectedItem.detailUrl + ') no-repeat center / cover' }"
          >
            <i class="el-icon-circle-close-outline delete" @click="deleteDetail(value[value.length - 1])"></i>
          </div>
        </div>
        <div v-else-if="!!lastSelectedItem.detailText">
          <div class="detail-image detail-text">
            {{ lastSelectedItem.detailText }}
            <i class="el-icon-circle-close-outline delete" @click="deleteDetail(value[value.length - 1])"></i>
          </div>
        </div>
        <div class="dss-link1" v-else @click="chooseDetail(lastSelectedItem.linkId)">
          + 选择{{ lastSelectedItem.name }}
        </div>
      </div>
    </div>

    <select-dialog
      v-model="detailDialog"
      @choosed="onChooseGoods"
      :enableMultiple="false"
      :goods-type="
        lastSelectedItem && lastSelectedItem.linkType ? goodsTypeEnum[lastSelectedItem.linkId] : goodsTypeEnum.product
      "
    ></select-dialog>

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
import mixins from '@/dss-wechat3rd/src/bz_components/tabbarLinkSelect/index.js';
import industryHelperMixin from '@/dss-wechat3rd/src/mixins/industry-helper-mixin.js';
import api from '@/dss-wechat3rd/src/api';
import tabbarPathConfig from './minapp-tabbar-config';
import wxLinkPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import navParamsAssember from '@/dss-wechat3rd/src/decorate_components/utils/nav-params-assember.js';
import selectDialog from '@/dss-wechat3rd/src/bz_components/selectDialog/index.vue';

export default {
  components: {
    selectDialog
  },
  name: 'tabbarLinkSelect',
  mixins: [industryHelperMixin],
  props: {
    value: {
      type: Array,
      default() {
        return [];
      }
    },
    size: {
      type: String,
      default: 'medium'
    },
    // selectedOptions: {
    //   type: Array,
    //   default: function() {
    //     return [];
    //   }
    // },
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
    // 最后一级选中的小程序链接
    lastSelectedItem() {
      return this.value[this.value.length - 1];
    },
    model: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('input', val);
      }
    },
    customPageList() {
      return (this.customPages || []).map(item => ({
        ...item,
        value: {
          index: item.index,
          name: item.name
        }
      }));
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
      goodsTypeEnum,
      showAllLevels: false,
      status: false,
      tabBarConfig: null,
      options: [],
      detailDialog: false,
      pageList: [],
      keyword: null,
      show: false,
      checkedList: []
    };
  },

  mounted() {
    this.assemblyData();
  },

  methods: {
    // 组装数据
    async assemblyData() {
      const librayList = this.mGetTabbarLinkList();
      const diableCustomPage = this.usedPages.custom;
      const diableDefaultPage = this.usedPages.default;
      // 不存在主页导航的数据
      if (!this.tabBarConfig) {
        await this.fetchTabBarConfig();
      }
      mixins.getCustomPage(this.customPages, diableCustomPage || [], () => {
        mixins.getDefaultPage(librayList, diableDefaultPage, () => {
          const industry = this.mGetIndustryKey();
          const formTool = wxLinkPages[industry].globalLink.filter(item => item.value === 'form-tool')[0];
          this.status2 = true;
          this.options = [
            {
              value: 'tabbar',
              label: '主页',
              children: (this.tabBarConfig.list || []).map(item => ({
                ...item,
                label: item.text || item.name,
                value: {
                  index: item.realPath.replace(/pages\/custom\/index/, item.pagePath),
                  name: item.text || item.name
                }
              }))
            },
            {
              value: 'other',
              label: '非主页',
              children: [
                {
                  value: 'custom',
                  label: '自定义页'
                  // children: mixins.customPages.map(item => ({
                  //   ...item,
                  //   value: JSON.parse(item.value)
                  // }))
                },
                {
                  value: 'default',
                  label: '系统默认页',
                  children: (mixins.defaultPages || [])
                    .map(item => ({
                      ...item,
                      value: JSON.parse(item.value)
                    }))
                    .map(item => ({
                      ...item,
                      value: {
                        ...item.value,
                        index: tabbarPathConfig.tabbarMap[item.value.index]
                      }
                    }))
                    .filter(item => item.value.index)
                },
                // 表单特殊处理
                {
                  value: {
                    index: formTool.index,
                    name: formTool.label,
                    linkType: formTool.linkType, // 1：选择具体项
                    linkId: formTool.linkId
                  },
                  label: '表单'
                }
              ]
            },
            {
              value: 'manualEntry',
              label: '人工录入',
            }
          ];
          this.status = true;
        });
      });
    },

    async fetchTabBarConfig() {
      const { data } = await api.getUserTemplate();
      if (typeof data.tabBarConfig === 'string') {
        this.tabBarConfig = JSON.parse(data.tabBarConfig);
      }
    },

    change(val) {
      this.$emit('change', val);
    },

    //点击选择图片对应的详情
    chooseDetail(id) {
      this.detailType = goodsTypeEnum[id];
      this.detailDialog = true;
    },

    // 选择对应的详情
    onChooseGoods(val) {
      navParamsAssember.getNavLinkParams.bind(this)(this.value[this.value.length - 1], val);
    },

    //删除图片对应的详情
    deleteDetail(item) {
      item.detailId = '';
      item.detailUrl = '';
      item.detailText = '';
      this.detailDialog = false;
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

    handlePageChange(e) {
      if (e && e[0] === 'other' && e[1] === 'custom') {
        this.show = true;
        this.checkedList = ['other', 'custom'];
      } else {
        this.checkedList = e;
        this.model = e;
        this.$emit('change', e);
      }
    },

    confirm(item) {
      const val = ['other', 'custom', item.value];
      this.checkedList = val;
      this.$set(this.model, 2, item.value);
      this.$emit('change', val);
      this.show = false;
    },

    handleClose() {
      this.keyword = null;
      if (
        this.checkedList &&
        this.checkedList.length &&
        this.checkedList[1] === 'custom' &&
        this.checkedList.length < 3
      ) {
        let obj = {};
        obj.stopPropagation = () => {};
        this.$refs.linkElCascader.clearValue(obj);
        this.model = [];
      }
    }
  }
};
</script>

<style lang="less" scoped>
.dss-link1 {
  color: #256eff;
  cursor: pointer;
}
.nav-column {
  padding: 10px 0;
}
.detail-image {
  width: 50px;
  height: 50px;
  display: inline-block;
  vertical-align: top;
  position: relative;
  cursor: pointer;
  .delete {
    font-size: 15px;
    position: absolute;
    top: 3px;
    right: -20px;
    display: inline-block;
  }
  &.detail-text {
    width: auto;
    height: auto;
  }
}
</style>

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
    background: transparent url('../../../images/close.png') no-repeat 0 0;
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
