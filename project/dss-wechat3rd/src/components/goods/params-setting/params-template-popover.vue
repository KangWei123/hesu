<template>
  <div class="params-template-popover">
    <el-popover
      placement="bottom-start"
      ref="popover"
      width="400"
      popper-class="params-popover"
      trigger="click">
      <div class="content">
        <div class="category-container" v-loading="loading.cate">
          <template v-if="categoryList.length">
            <div class="category-item" :class="{'active': category.id === curCategoryId}" v-for="category in categoryList" :key="category.id" @click="fetchParamsList(category.id)">
              {{category.category}}
            </div>
          </template>
          <div class="no-data" v-else>暂无数据</div>
        </div>
        <div class="params-container" v-loading="loading.list">
          <template v-if="paramsList.length">
            <div class="params-item" v-for="params in paramsList" :key="params.id" @click="selectTemplate(params)">
              {{params.templateName}}
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
  name: 'params-template-popover',
  data() {
    return {
      categoryList: [],
      paramsList: [],
      curCategoryId: null,
      loading: {
        list: false,
        cate: false
      }
    };
  },
  mounted() {
    this.fetchCategoryList().then(() => {
      if (this.categoryList.length) {
        this.curCategoryId = this.categoryList[0].id;
        this.fetchParamsList(this.curCategoryId);
      }
    });
  },
  methods: {
    fetchCategoryList() {
      this.loading.cate = true;
      let params = {
        type: 1
      };
      return api
        .queryCategoryList(params)
        .then(res => {
          this.categoryList = res.data || [];
        })
        .always(_ => {
          this.loading.cate = false;
        });
    },
    fetchParamsList(id) {
      this.curCategoryId = id;
      this.paramsList = [];
      this.loading.list = true;
      api
        .getParameterList({
          categoryId: id,
          pageNo: 0,
          pageSize: 0
        })
        .then(res => {
          let data = res.data || [];
          this.paramsList = data;
        })
        .always(_ => {
          this.loading.list = false;
        });
    },
    selectTemplate(params) {
      const list = params.paramList || [];
      this.$emit('select', list);
      this.$refs.popover.doClose();
    }
  }
};
</script>

<style lang="less">
.params-popover.el-popover {
  .content {
    display: flex;

    .category-container, .params-container {
      flex: 1;
      height: 200px;
      overflow-x: hidden;
      overflow-y: auto;
      padding: 0;

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

    .category-item, .params-item {
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
