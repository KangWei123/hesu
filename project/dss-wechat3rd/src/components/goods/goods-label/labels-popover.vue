<template>
  <div class="labels-popover">
    <el-popover
      placement="bottom"
      ref="popover"
      width="400"
      popper-class="goods-labels-popover"
      trigger="click">
      <div class="content">
        <div class="category-container" v-loading="loading.cate">
          <template v-if="categoryList.length">
            <div class="category-item" :class="{'active': category.id === curCategoryId}" v-for="category in categoryList" :key="category.id" @click="fetchQuestionList(category.id)">
              {{category.categoryName}}
            </div>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
        <div class="question-container" v-loading="loading.list">
          <template v-if="questionList.length">
            <div class="question-item" v-for="item in questionList" :key="item.id" @click="selectTemplate(item)">
              {{item.templateName}}
            </div>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
      </div>
      <el-button type="text" slot="reference"><i class="el-icon-sort" style="transform: rotate(90deg);margin-right: 4px;"></i>切换模板</el-button>
    </el-popover>
  </div>
</template>

<script>
import api from '@/dss-wechat3rd/src/api/template.js';

export default {
  name: 'labels-popover',
  data() {
    return {
      categoryList: [],
      questionList: [],
      curCategoryId: null,
      loading: {
        list: false,
        cate: false
      }
    };
  },
  mounted() {
    this.fetchCategoryList().then(() => {
      // if (this.categoryList.length) {
      //   this.curCategoryId = this.categoryList[0].id;
      //   this.fetchQuestionList(this.curCategoryId);
      // }
    });
  },
  methods: {
    fetchCategoryList() {
      this.loading.cate = true;
      let params = {
        pageNo: 0,
        pageSize: 0
      };
      return api
        .queryTemCategoryList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .always(_ => {
          this.loading.cate = false;
        });
    },
    fetchQuestionList(id) {
      this.curCategoryId = id;
      this.questionList = [];
      this.loading.list = true;
      api
        .getAskTemplateList({
          categoryId: id,
          pageNo: 0,
          pageSize: 0
        })
        .then(res => {
          let data = res.data || [];
          this.questionList = data;
        })
        .always(_ => {
          this.loading.list = false;
        });
    },
    selectTemplate(item) {
      const list = item.qaContentList || [];
      this.$emit('select', list);
      this.$refs.popover.doClose();
    }
  }
};
</script>

<style lang="less">
.goods-labels-popover.el-popover {
  .content {
    display: flex;

    .category-container, .question-container {
      flex: 1;
      height: 200px;
      overflow-x: hidden;
      overflow-y: auto;

      .no-data {
        width: 100%;
        height: 100%;
        line-height: 200px;
        text-align: center;
      }
    }

    .category-container {
      border-right: 1px solid #DCDEE0;
    }

    .category-item, .question-item {
      padding: 4px 6px;
      height: 20px;
      line-height: 20px;
      cursor: pointer;

      &:hover {
        background-color: #f5f7fa;
      }

      &.active {
        color: #409eff;
      }
    }
  }
}
</style>
