<template>
  <el-dialog class="books-dialog" title="从素材中心新增" :visible.sync="show" width="400px">
    <el-form label-width="80px" :model="form" :rules="rules" ref="form">
      <el-form-item prop="categoryId" v-model="form.categoryId" label="选择分类">
        <el-select
          clearable
          v-model="form.categoryId"
          placeholder="选择分类"
          :loading="loading.category"
          style="width: 200px; margin-left: -40px;"
        >
          <el-option
            v-for="item in categoryList"
            :key="item.id"
            :label="item.categoryName"
            :value="item.id"
          ></el-option>
        </el-select>
      </el-form-item>

      <el-form-item prop="albumId" label="选择画册">
        <el-cascader style="width: 200px; margin-left: -40px"
          v-loading="loading.material"
          :options="cascaderOptions"
          v-model="form.albumId"
          @active-item-change="handleCascaderChange"
        />
      </el-form-item>

      <el-form-item prop="categoryOrder" v-model="form.categoryOrder" label="画册排序">
        <el-input
          v-model.number="form.categoryOrder"
          :min="1"
          :max="99999999999"
          style="width: 200px; margin-left: -40px;"
          type="number"
        />
        <p class="tip">决定小程序的展示顺序，数字大的排序靠前，数字重复则新增画册靠前</p>
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="show=false">取消</el-button>
      <el-button type="primary" @click="handleSubmit" :loading="loading.submit">确定</el-button>
    </template>
  </el-dialog>
</template>
<script>
import marketArticleApi from '@/dss-wechat3rd/src/api/market-article';
import materialArticleApi from '@/dss-wechat3rd/src/api/material-article';
import api from '@/dss-wechat3rd/src/api/material-pdf';

export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      categoryList: [],
      //画册分组
      materialGroupList: [],
      //画册列表
      materialAlbumList: [],
      keyword: '',
      form: {
        categoryId: null, // 分类id
        groupId: null, // 分组id
        albumId: null, //画册id
        categoryOrder: 1 //排序
      },
      rules: {
        categoryId: [{ required: true, message: '请选择画册分类' }],
        albumId: [{ required: true, message: '请选择画册' }],
        categoryOrder: [
          { required: true, message: '排序不能为空' },
          {
            pattern: /^[1-9]+\d*$/,
            message: '排序请输入正整数',
            trigger: 'change'
          }
        ]
      },

      page: {
        pageNo: 1,
        pageSize: 10000
      },

      loading: {
        category: false,
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
    //级联数据
    cascaderOptions() {
      let data = this.materialGroupList.map(item => {
        return {
          label: item.groupName,
          value: item.id,
          leaf: false,
          children: this.materialAlbumList
            .filter(node => {
              return node.groupId === item.id;
            })
            .map(node => ({
              label: node.materialName,
              value: node.id,
              leaf: true
            }))
        };
      });
      return data;
    }
  },

  methods: {
    handleCascaderChange(val) {
      this.form.groupId = val[0];
      const currentChildren = this.cascaderOptions.find(i => i.value === val[0]).children;
      // 存在数据不做重复的请求
      if (currentChildren && currentChildren.length) {
        return;
      }
      this.fetchMaterialalbumList();
    },

    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (!valid) return;
        this.loading.submit = true;
        let params = {
          categoryId: this.form.categoryId,
          relatedMaterialId: this.form.albumId[1],
          categoryOrder: this.form.categoryOrder
        };
        api
          .addEbooks(params)
          .then(() => {
            this.$emit('on-success');
            this.show = false;
          })
          .always(() => {
            this.loading.submit = false;
          });
      });
    },

    // 获得画册分类
    getCategoryList() {
      this.loading.category = true;
      api
        .getEbooksGroupList({ ...this.page })
        .then(res => {
          this.categoryList = res.data;
        })
        .always(() => {
          this.loading.category = false;
        });
    },

    // 获得素材分组
    fetchMaterialGroupList() {
      this.materialAlbumList = [];
      this.form.albumId = null;
      this.loading.material = true;
      api
        .getPictureGroupList({ ...this.page, materialType: 5 })
        .then(res => {
          this.materialGroupList = res.data || [];
          if (this.materialGroupList.length) {
            this.form.groupId = this.materialGroupList[0].id;
            this.fetchMaterialalbumList();
          }
        })
        .always(() => {
          this.loading.material = false;
        });
    },
    // 获得对应分组下的画册
    fetchMaterialalbumList() {
      this.loading.material = true;
      if (this.materialAlbumList.findIndex(item => item.groupId === this.form.groupId) < 0) {
        api
          .getMaterialList({
            ...this.page,
            groupId: this.form.groupId,
            materialType: 5
          })
          .then(res => {
            this.materialAlbumList.push(...res.data);
          })
          .always(() => {
            this.loading.material = false;
          });
      }
    },
    handleLazyLoad(node, resolve) {
      const { level, value } = node;
      this.loading.material = true;
      api
        .getMaterialList({
          ...this.page,
          groupId: value,
          materialType: 5
        })
        .then(res => {
          this.materialArticleList = res.data;
        })
        .always(() => {
          this.loading.material = false;
          resolve(this.cascaderOptions);
        });
    }
  },

  mounted() {
    this.getCategoryList();
    this.fetchMaterialGroupList();
  }
};
</script>

<style lang="less" scoped>
.tip {
  color: #999;
}
</style>


<style lang="less" >
.el-cascader-menu {
  .el-cascader-menu__item {
    max-width: 200px;
  }
}

.books-dialog {
  .tip {
    text-align: left;
    line-height: 22px;
    margin-top: 5px;
    padding-left: 17px;
  }
}
</style>
