<template>
  <div class="article-module-edit">
    <edit-header :data-source="dataSource" name="营销图文"></edit-header>

    <div class="com-body">
      <!-- 图文分类 -->
      <div class="com-row">
        <span class="com-column">图文分类</span>
        <span class="com-column">
          <el-select
            v-model="dataSource.textNavSource.categroy"
            placeholder="请选择分类"
            class="article-selector"
            @change="changeCategroy"
          >
            <el-option
              v-for="item in totalCategory"
              :key="item.id"
              :label="item.categoryName"
              :value="item.id"
              :disabled="item.disabled"
            ></el-option>
          </el-select>
        </span>
      </div>
      <size :data-source="dataSource"></size>
      <div class="com-row">
        <span class="com-column">列表样式</span>
        <span class="com-column">
          <el-radio-group v-model="graphicStyle">
            <el-radio :label="'title'" border>突出标题</el-radio>
            <el-radio :label="'image'" border>突出图片</el-radio>
          </el-radio-group>
        </span>
      </div>
      <commonEdit
        :data-source="dataSource"
        :type="type"
        :enable-edit-nav="false"
        nav-text="更多图文"
        :nav-page="linkedPages.page.ARTICLE_PAGE"
        :limit-params="limitParams"
        :filter-list="filterList"
        @chooseList="onChooseGoods"
      ></commonEdit>
      <!--已存在图片的预览-->
      <div class="preview-container">
        <!-- <span class="tips">默认显示前三条图文</span> -->
        <div class="article-preview" v-for="(item, index) in dataSource.data" :key="index">
          <span class="article-preview-title">{{ item.title }}</span>
          <!-- <div class="img" :style="{'background-image': 'url(' + item.coverUrl + ')'}"></div> -->
          <i class="com-close" @click="deteleImage(item)"></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import './css/common.less';
  import linkedPages from '@/dss-wechat3rd/src/constants/wxLinkPages.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import commonEdit from './commonEdit.vue';
  import utils from '@/dss-wechat3rd/src/decorate_components/utils/index.js';
  import fields from '@/dss-wechat3rd/src/decorate_components/utils/fields.js';
  import size from './size.vue';
  import services from '@/dss-common/utils/services';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'ArticleModuleEdit',
    components: {
      commonEdit,
      size,
      EditHeader,
    },
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    data() {
      return {
        linkedPages,
        type: goodsTypeEnum.article,
        totalCategory: [],
        filterList: [
          {
            type: 'input',
            paramName: 'title',
            label: '文章标题',
          },
        ],
      };
    },
    watch: {
      dataSource: {
        deep: true,
        handler(val) {
          if (!val && this.totalCategory[0]) {
            this.dataSource.textNavSource.categroy = this.totalCategory[0].id;
          }
        },
      },
      totalCategory: {
        deep: true,
        handler(val) {
          if (!val && this.totalCategory[0]) {
            this.dataSource.textNavSource.categroy = this.totalCategory[0].id;
          }
        },
      },
    },
    computed: {
      computeDataList() {
        return this.dataSource.data && this.dataSource.data.length ? this.dataSource.data : this.dataSource.exampleData;
      },
      limitParams() {
        const target = this.totalCategory.filter(item => item.id == this.dataSource.textNavSource.categroy)[0];
        return [
          {
            label: '图文分类',
            name: target && target.categoryName,
            requestName: 'categoryId', // 请求参数名
            requestValue: this.dataSource.textNavSource.categroy, // 请求参数值
          },
        ];
      },
      graphicStyle: {
        get() {
          return this.dataSource.graphicStyle || 'title';
        },
        set(val) {
          this.$set(this.dataSource, 'graphicStyle', val);
          // this.dataSource.graphicStyle = val;
        },
      },
    },
    methods: {
      onChooseGoods(choosedGoodsList) {
        // 删除不需要的字段
        this.dataSource.data = utils.saveAvailableFields(choosedGoodsList, fields.article);
      },

      deteleImage(item) {
        utils.deteleItem(this.dataSource.data, item);
      },

      getArticleCategroy() {
        services
          .get('/wp/article_category/query/list', {
            action: '获取图文分类',
            params: {
              pageNo: 1,
              pageSize: 100,
              deleteFlag: 'N',
            },
          })
          .then(res => {
            this.totalCategory = res.data;
          });
      },

      changeCategroy(val) {
        this.dataSource.data = [];
      },
    },
    mounted() {
      this.getArticleCategroy();
    },
  };
</script>
<style lang="less" scoped>
  .preview-container {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    width: 320px;
    margin: 0 auto;

    .tips {
      color: #999;
      margin: 5px;
      font-size: 14px;
    }

    .article-preview {
      width: 100%;
      // height: 90px;
      position: relative;
      margin-top: 20px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid #dcdfe6;
      padding: 10px;
      box-sizing: border-box;
      background: #f5f7fa;

      .article-preview-title {
        max-width: 200px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: #303133;
      }

      .img {
        width: 90px;
        height: 60px !important;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
      }

      .com-close {
        position: absolute;
        right: -1px;
        top: -1px;
      }
    }
  }

  .article-selector {
    width: 228px;
  }
</style>
