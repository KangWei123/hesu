<!-- 已选指标模块 -->
<template>
  <span class="total-tag">
    <el-tooltip v-for="(item, index) in rechooseTags" :key="index" effect="dark" :content="item.name" placement="right">
      <span class="condition_item_tag" :class="{ false: 'gray-item', true: 'gray-item' }[hideSidebar]">
        {{ item.name }}
        <el-button
          type="danger"
          v-show="showDelIcon"
          @click="removeSelectedTag(item)"
          class="btn-delete"
          title="移除分析指标"
          icon="el-icon-close"
          circle
        ></el-button>
      </span>
    </el-tooltip>
  </span>
</template>

<script>
  export default {
    props: {
      hideSidebar: {
        type: Boolean,
        default: false,
      },
      selectedTags: {
        type: Array,
        default() {
          return [];
        },
      },
      showDelIcon: {
        type: Boolean,
        default: true,
      },
    },
    data() {
      return {};
    },
    methods: {
      // 分析查询
      submit() {
        this.$emit('query_by_detail');
      },
      removeSelectedTag(tag) {
        this.$emit('remove', tag);
      },
    },
    computed: {
      rechooseTags() {
        console.log('rechoosed--------', this.selectedTags);
        return this.selectedTags;
      },
    },
  };
</script>

<style lang="less">
  .total-tag {
    padding-left: 10px;
  }

  .indicator_condition {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    align-items: center;
    flex: 1 1 auto;
    color: #999999;
    font-size: 14px;
    width: 100%;
    margin: 15px 0;
    overflow-y: auto;

    .no-index {
      width: 100%;
      display: inline-flex;
      justify-content: center;
    }

    .indicator-dec {
      white-space: nowrap;
      color: #333333;
      font-size: 14px;
      padding-left: 20px;
    }

    .condition_item_tag {
      display: inline-block;
      width: auto;
      font-size: 12px;
      position: relative;
      margin-right: 8px;
      margin-bottom: 5px;
      padding: 0 16px;
      border-radius: 14px;
      height: 28px;
      line-height: 27px;
      background: none;
      max-width: 120px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;

      &:hover {
        .btn-delete {
          display: block;
        }
      }
    }

    .gray-item {
      margin: 5px;
      box-sizing: border-box;
      padding: 2px 10px;
      background: #3d7dfa;
      border: 0 none;
      color: #ffffff;
      font-size: 14px;
      border-radius: 10px;
      position: relative;
    }

    .btn-delete {
      padding: 2px;
      display: none;

      .el-icon-close {
        position: absolute;
        right: 0;
        font-size: 16px;
        z-index: 99;
        top: 0;
        background: #f0f2f5;
        color: #333;
      }
    }
  }
</style>
