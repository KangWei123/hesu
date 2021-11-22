<template>
  <div>
    <el-cascader
      ref="linkElCascader"
      expand-trigger="click"
      :options="linkPagesWithoutCustom"
      @change="handlePageChange"
    ></el-cascader>

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
              <div @click="confirm(item)" class="oper-item primary">{{ viewButtonText }}</div>
            </div>
          </div>
        </template>
      </div>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: 'SelectLink',
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      viewButtonText: {
        type: String,
        default: '确定',
      },
      linkPages: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        pageList: [],
        keyword: null,
        show: false,
        checkedList: [],
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
    computed: {
      linkPagesWithoutCustom() {
        return (this.linkPages || []).map(item => {
          if (item.value === 'custom-page') {
            return {
              label: '自定义页',
              value: 'custom-page',
            };
          } else {
            return item;
          }
        });
      },
      customPageList() {
        const pages = (this.linkPages || []).find(item => item.value === 'custom-page');
        return (pages && pages.children) || [];
      },
    },
    methods: {
      searchCustomPages() {
        if (!this.keyword) return (this.pageList = this.customPageList);
        const pages = [];
        this.customPageList.forEach(item => {
          if ((item.name || item.label).includes(this.keyword)) pages.push(item);
        });
        this.pageList = pages;
      },
      confirm(item) {
        const val = ['custom-page', item.value];
        this.checkedList = val;
        this.$emit('confirm', val);
        this.show = false;
      },
      handlePageChange(e) {
        if (e && e[0] === 'custom-page') {
          this.show = true;
          this.checkedList = ['custom-page'];
        } else {
          this.checkedList = e;
          this.$nextTick(() => {
            this.$emit('confirm', e);
          });
        }
        console.log(this.$refs.linkElCascader);
      },
      handleClose() {
        this.keyword = null;
        if (
          this.checkedList &&
          this.checkedList.length &&
          this.checkedList[0] === 'custom-page' &&
          this.checkedList.length < 2
        ) {
          const obj = {};
          obj.stopPropagation = () => {};
          this.$refs.linkElCascader.clearValue(obj);
        }
      },
    },
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
          color: #333333;
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
