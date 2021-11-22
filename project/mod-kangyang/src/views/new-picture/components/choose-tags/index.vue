<template>
  <div class="choose-tags">
    <el-select
      v-model="checkedList"
      multiple
      :placeholder="placeholder"
      :style="{ width: selectWidth }"
      @visible-change="visibleChange"
      :popper-append-to-body="false"
      ref="selectDom"
    >
      <el-option v-for="item in tagList" :key="item.id" :label="item.tagValue" :value="item.id"> </el-option>
    </el-select>
    <div
      :id="uniqueId"
      class="tags-popup"
      :style="{ width: popupWidth, top: popupTop + 'px' }"
      @mousedown.stop="stop"
      v-show="showPopup"
    >
      <el-scrollbar class="scrollbar" :wrap-style="`max-height: ${popupHeight};`">
        <div class="filter-box" v-if="tagList.length">
          <el-input
            placeholder="关键字搜索"
            prefix-icon="el-icon-search"
            v-model="keyword"
            clearable
            @blur="getTagList"
            style="width: 100%"
            @clear="getTagList"
            @keyup.enter.native="getTagList"
          >
          </el-input>
        </div>
        <div class="empty-tips" v-else>暂无标签</div>

        <div class="tag-box" v-if="historyList.length">
          <div class="group-name">最近使用</div>
          <ul class="tag-list">
            <li v-for="item in historyList" :key="item.id">
              <div
                class="tag"
                :class="{ 'el-icon-check': checkedList.includes(item.id) }"
                @click="handleChooseTag(item)"
              >
                {{ item.tagValue }}
              </div>
            </li>
          </ul>
        </div>

        <div v-for="item in groupList" :key="item.id">
          <div class="tag-box" v-if="item.materialTagList.length">
            <div class="group-name">{{ item.groupName }}（{{ item.materialTagList.length }}）</div>
            <ul class="tag-list">
              <li v-for="tag in item.materialTagList" :key="tag.id">
                <div
                  class="tag"
                  :class="{ 'el-icon-check': checkedList.includes(tag.id) }"
                  @click="handleChooseTag(tag)"
                >
                  {{ tag.tagValue }}
                </div>
              </li>
            </ul>
          </div>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script>
  import { elderSpaceApi } from '@/mod-kangyang/src/api';

  export default {
    name: 'ChooseTags',
    inject: { moduleType: { default: undefined }, isElderSpace: { default: false } },
    props: {
      tagIds: {
        type: Array,
        default() {
          return [];
        },
      },

      selectWidth: {
        type: String,
        default: '248px',
      },

      placeholder: {
        type: String,
        default: '全部标签',
      },

      popupWidth: {
        type: String,
        default: '320px',
      },

      popupHeight: {
        type: String,
        default: '248px',
      },
      /**
       * 多选限制个数
       */
      multipleLimit: {
        type: Number,
        default: Infinity,
      },
    },
    data() {
      return {
        keyword: '',
        showPopup: false,
        tagList: [],
        groupList: [],
        historyList: [],
        checkedList: [],
        popupTop: 48,
        uniqueId: '',
      };
    },
    mounted() {
      if (!this.isElderSpace) {
        this.getHistoryList();
      }
      this.getTagList(this.tagIds);
    },
    watch: {
      checkedList(val) {
        this.$emit('update:tagIds', val);

        this.$nextTick(() => {
          /**
           * 在nextTick中也无法及时获取select的高度，这里暂加定时器
           * 后续可参考element ui源码修改
           */
          setTimeout(() => {
            const selectHeight = Number(this.$refs.selectDom.$el.offsetHeight) + 8;
            this.popupTop = selectHeight;
          }, 15);
        });
      },
    },
    methods: {
      // 获取列表数据
      async getTagList(tagIds) {
        try {
          const { data } = await elderSpaceApi.getTagListV2({
            keyword: this.keyword,
            moduleType: this.moduleType,
          });
          const noGroupList = data ? data.noGroupList || [] : [];
          const groupList = data ? data.groupList || [] : [];

          groupList.unshift({
            id: 0,
            groupName: '未分组标签',
            materialTagList: noGroupList,
          });

          this.groupList = groupList;

          if (!this.tagList.length) {
            let tagList = [];

            groupList.forEach(item => {
              tagList = tagList.concat(item.materialTagList);
            });

            this.tagList = tagList;
          }

          if (tagIds) {
            this.checkedList = this.tagIds || [];
          }
        } catch (e) {}
      },

      async getHistoryList() {
        try {
          const { data } = await elderSpaceApi.getHistoryList();

          this.historyList = data || [];
        } catch (e) {}
      },

      visibleChange(val) {
        this.showPopup = val;
      },

      stop() {},

      // 选择标签
      handleChooseTag(item) {
        const { checkedList, multipleLimit } = this;

        if (!this.tagList.find(tag => tag.id === item.id)) {
          this.tagList.push(item);
        }

        if (checkedList.includes(item.id)) {
          checkedList.splice(checkedList.indexOf(item.id), 1);
        } else if (checkedList.length >= multipleLimit) {
          return false;
        } else {
          checkedList.push(item.id);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .choose-tags {
    position: relative;

    /deep/ .el-input__inner {
      height: 36px;
      line-height: 36px;
      border: 1px solid #dce1e6;
    }

    .filter-box {
      /deep/ .el-input__inner {
        width: 100% !important;
      }
    }

    .tags-popup {
      position: absolute;
      left: 0;
      top: 0;
      z-index: 10;
      border-radius: 4px;
      background: #fff;
      box-shadow: 0 6px 8px 0 rgba(0, 0, 0, 0.05);

      .tag-list {
        display: flex;
        flex-wrap: wrap;

        > li {
          line-height: normal;
        }
      }

      .tag-box {
        border-bottom: 1px solid #ebeef5;
      }

      .group-name {
        line-height: 22px;
        margin: 16px 0;
        font-size: 16px;
      }

      .tag {
        position: relative;
        padding: 0 13px;
        margin: 0 16px 16px 0;
        line-height: 26px;
        background: #fff;
        border: 1px solid #ebeef5;
        border-radius: 4px;
        cursor: pointer;
        color: #717378;
      }

      /deep/ .el-icon-check {
        padding: 0 6px 0 20px;
        color: #fff;
        background: #1890ff;
        border-color: #1890ff;

        &::before {
          position: absolute;
          left: 3px;
          top: 8px;
          line-height: normal;
        }
      }
    }

    /deep/ .el-select-dropdown {
      display: none !important;
    }
  }

  .scrollbar {
    height: 100%;

    /deep/ .el-scrollbar__wrap {
      margin-bottom: 0 !important;
      max-height: 364px;
      padding: 16px;
      overflow-x: hidden;
      box-sizing: border-box;
    }
  }

  .empty-tips {
    line-height: normal;
  }
</style>
