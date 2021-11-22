<template>
  <!-- 典型例子见 商品列表 -->
  <div class="list-page">
    <!-- 页面操作 -->
    <div v-if="$slots['main-actions']" class="list-page__main-actions">
      <slot name="main-actions"></slot>
    </div>
    <div>
      <!-- 请求条件 -->
      <header v-if="$slots.filters" class="list-page__filter clearfix">
        <slot name="filters"></slot>
      </header>

      <main class="list-page__body">
        <!-- 页面子操作 -->
        <div v-if="$slots['sub-actions']" class="list-page__sub-actions clearfix">
          <slot name="sub-actions"></slot>
        </div>
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script>
  /**
   * 通用的列表型页面布局
   * @slot main-actions 页面操作，位于右上角
   * @slot filters 搜索条件
   * @slot sub-actions 表格操作，位于表格上方
   * @slot default 页面内容
   */
  export default {
    name: 'ListPageLayout',
  };
</script>

<style lang="less" scoped>
  .list-page__main-actions {
    position: absolute;
    top: 11px;
    right: 24px;
  }

  .list-page__filter {
    padding: 20px 16px 0;
    background-color: white;
    background: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.06);
    margin-bottom: 16px;

    /deep/ .el-form--inline .el-form-item {
      margin-right: 24px;
    }
  }

  .list-page__sub-actions {
    padding-top: 16px;
    padding-left: 20px;
    padding-bottom: 16px;
  }

  .list-page__body {
    display: flow-root;
    background: #fff;
    border-radius: 4px;
    padding: 0 0 20px;

    & > .fat-table {
      width: 100%;
    }

    & > .fat-table .el-table th > .cell {
      white-space: nowrap;
    }
  }

  /* 表格带border样式 */
  // 只有包含 subactions 时才显示边框

  .list-page__sub-actions + .fat-table {
    & th.is-leaf {
      border-top: 1px solid #eff4fa;
    }
  }
</style>
