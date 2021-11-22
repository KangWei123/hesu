<template>
  <el-dialog title="从素材中心新增" :visible.sync="show" width="480px" class="graph-add-dialog">
    <el-form label-width="92px" :model="form" :rules="rules" ref="form">
      <el-form-item prop="categoryId" v-model="form.categoryId" label="选择分类：" style="margin-left: 40px;">
        <el-select
          clearable
          v-model="form.categoryId"
          placeholder="选择分类"
          :loading="loading.category"
          style="width: 240px"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="maArticleId" label="选择文章：" style="margin-left: 40px;">
        <el-cascader
          style="width: 240px; margin-left: -50px;"
          v-loading="loading.material"
          :options="cascaderOptions"
          v-model="form.maArticleId"
          @active-item-change="handleCascaderChange"
        />
        <!-- <el-select
          v-model="form.maArticleId"
          filterable
          clearable
          remote
          reserve-keyword
          placeholder="选择文章"
          :remote-method="searchTitle"
          :loading="loading.article"
          style="width: 195px"
        >
          <el-option
            v-for="item in materialArticleList"
            :key="item.id"
            :label="item.title"
            :value="item.id"
          ></el-option>
        </el-select>-->
      </el-form-item>

      <el-form-item prop="categoryOrder" v-model="form.categoryOrder" label="图文排序：" style="margin-left: 40px;">
        <el-input
          v-model.number="form.categoryOrder"
          :min="1"
          :max="99999999999"
          style="width: 240px"
          type="number"
        />
        <p class="tip">决定小程序的展示顺序，数字大的排序靠前，数字重复则新增图文靠前</p>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="show=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading.submit">确认</el-button>
    </template>
  </el-dialog>
</template>
<script>
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
import materialArticleApi from '@/dss-wechat3rd/src/api/material-article';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      timer: null,
      // 营销图文相关
      categoryList: [],
      articleList: [],
      // 素材图文相关
      materialArticleList: [],
      materialGroupList: [],
      keyword: '',
      form: {
        // 营销图文分类id
        categoryId: null,
        // 素材图文分组id
        groupId: null,
        maArticleId: null,
        categoryOrder: 1
      },
      rules: {
        categoryId: [{ required: true, message: '请选择图文分类' }],
        maArticleId: [{ required: true, message: '请选择图文' }],
        categoryOrder: [{ required: true, message: '排序不能为空' }]
      },

      page: {
        pageNo: 1,
        pageSize: 10000
      },

      loading: {
        category: false,
        article: false,
        submit: false,
        material: false
      },
      cascaderProps: { multiple: true, lazy: true, lazyLoad: this.handleLazyLoad }
    };
  },

  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    },
    cascaderOptions() {
      // 两级
      return this.materialGroupList.map(gitem => {
        return {
          label: gitem.groupName,
          value: gitem.id,
          leaf: false,
          children: this.materialArticleList
            .filter(aitem => {
              return aitem.groupId === gitem.id;
            })
            .map(aitem => ({
              // label: aitem.title.slice(0, 6) + (aitem.title.length > 6 ? '...' : ''),
              label: aitem.title,
              value: aitem.id,
              leaf: true
            }))
        };
      });
    }
  },

  watch: {
    // ['form.categoryId'](val) {
    //   this.articleList = [];
    //   this.form.maArticleId = null;
    //   this.fetchArticleList();
    // }
  },

  methods: {
    handleCascaderChange(val) {
      this.form.groupId = val[0];
      const currentChildren = this.cascaderOptions.find(i => i.value === val[0]).children;
      // 存在数据不做重复的请求
      if (currentChildren && currentChildren.length) {
        return;
      }

      this.fetchMaterialArticleList();
    },
    handleLazyLoad(node, resolve) {
      const { level, value } = node;
      this.loading.material = true;

      materialArticleApi
        .getMaterialArticleList({
          ...this.page,
          groupId: value
        })
        .then(res => {
          this.materialArticleList = res.data;
        })
        .always(() => {
          this.loading.material = false;
          resolve(this.cascaderOptions);
        });
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        // @TODO
        this.loading.submit = true;
        marketArticleApi
          .addNew({
            ...this.form,
            maArticleId: this.form.maArticleId[1]
          })
          .then(() => {
            this.$emit('on-success');
            this.show = false;
          })
          .always(() => {
            this.loading.submit = false;
          });
      });
    },

    // 获得营销图文分类
    fetchCategoryList() {
      this.loading.category = true;
      this.articleList = [];
      marketArticleApi
        .categoryList({ ...this.page, deleteFlag: 'N' })
        .then(res => {
          this.categoryList = res.data;
          if (this.form.categoryId === null && this.categoryList.length) {
            this.form.categoryId = this.categoryList[0].id;
          }
        })
        .always(() => {
          this.loading.category = false;
        });
    },

    // 获得素材图文
    fetchMaterialArticleList() {
      this.loading.material = true;
      if (this.materialArticleList.findIndex(item => item.groupId === this.form.groupId) < 0) {
        materialArticleApi
          .getMaterialArticleList({
            ...this.page,
            groupId: this.form.groupId
          })
          .then(res => {
            this.materialArticleList.push(...res.data);
          })
          .always(() => {
            this.loading.material = false;
          });
      }
    },

    // 获得素材图文分组
    fetchMaterialGroupList() {
      this.materialArticleList = [];
      this.form.maArticleId = null;
      this.loading.material = true;
      materialArticleApi
        .getGraphicGroupList({ ...this.page })
        .then(res => {
          this.materialGroupList = res.data || [];
          if (this.materialGroupList.length) {
            this.form.groupId = this.materialGroupList[0].id;
            this.fetchMaterialArticleList();
          }
        })
        .always(() => {
          this.loading.material = false;
        });
    },

    searchTitle(key) {
      this.keyword = key;
      this.fetchMaterialArticleList();
    }
  },

  mounted() {
    this.fetchCategoryList();
    this.fetchMaterialGroupList();
  }
};
</script>

<style lang="less" scoped>
.el-form-item__content {
  .el-select,.el-input {
    margin-left: -50px;
  }
}
.el-dialog__body {
  .el-form-item__label {
    margin-left: 40px;
  }
}

.tip {
  color:#A1A4AB;
  text-align: left;
  margin-left: 8px;
  line-height: 20px;
  margin-top: 8px;
}
</style>


<style lang="less">
.el-cascader-menu {
  .el-cascader-menu__item {
    max-width: 200px;
  }
}
.graph-add-dialog {
  .el-dialog__body {
    padding-bottom: 10px !important;
  }
}

</style>
