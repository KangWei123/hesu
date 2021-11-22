<template>
  <div class="article-card" style="display:inline-block">
    <el-card class="article-item" :class="{ 'active-article': isActive || false }" :style="{ width: cardWidth }">
      <p class="article-item-title">{{ articleItem.title || '暂无标题' }}</p>
      <p class="article-item-img" :style="{ backgroundImage: 'url(' + articleItem.coverUrl + ')' }"></p>
      <p class="article-item-remark">{{ articleItem.digest || '暂无摘要' }}</p>
      <p class="article-item-author">{{ articleItem.author || '暂无作者信息' }}</p>
    </el-card>
  </div>
</template>

<script>
export default {
  props: {
    articleItem: {
      type: Object,
      default: () => {
        return {};
      }
    },
    cardWidth: {
      type: String,
      default: '165px'
    },
    isActive: false
  }
};
</script>

<style lang="less">
.article-item {
  display: inline-block;
  box-sizing: border-box;
  .el-card__body {
    display: block !important;
    line-height: 35px;
    padding: 5%;
    border: 1px solid transparent;
  }
  .article-item-remark,
  .article-item-author,
  .article-item-title {
    color: #777;
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    height: 35px;
  }
  .article-item-img {
    width: 100%;
    height: 100px;
    display: inline-block;
    background-size: cover;
    background-position: center;
  }
  .article-item-title {
    font-size: 14px;
    color: #303133;
  }
}
.active-article {
  .el-card__body {
    border: 1px solid #4379ed;
    border-radius: 5px;
  }
}
.article-item-more {
  .article-item-more-top {
    display: block !important;
    position: relative;
    .article-item-title {
      width: 100%;
      box-sizing: border-box;
      font-weight: bold;
    }
  }
  .article-item-more-list {
    width: 100%;
    height: 30px;
    padding-bottom: 5px;
    .article-item-img {
      width: 30px;
      height: 30px;
      vertical-align: middle;
      float: right;
    }
    .article-item-title {
      width: 100px;
      display: inline-block;
      line-height: 30px;
      font-size: 12px;
    }
  }
  .el-scrollbar__wrap {
    overflow: hidden;
    overflow-y: scroll;
  }
}
</style>
