<template>
  <div class="category-container"
       v-loading="loading">
    <div class="category-head">
      <div class="category-item">
        <div class="left">分类导航模式：</div>
        <div class="right">
          <el-radio v-model="categoryType"
                    label="1">一级分类模式</el-radio>
          <el-radio v-model="categoryType"
                    label="2">多级分类模式</el-radio>
          <div class="notice" v-if="categoryType === '1'">*此模式适合品类不超过50款的商家，推荐使用</div>
        </div>
      </div>
      <div v-if="categoryType === '2'" class="category-item">
        <div class="left">子分类模式：</div>
        <div class="right">
          <el-radio v-model="columnNum"
                    label="2">一行两个</el-radio>
          <el-radio v-model="columnNum"
                    label="3">一行三个</el-radio>
        </div>
      </div>
    </div>
    <!-- 一级分类 -->
    <category-first v-if="categoryType === '1'"
                    @updataCategoryType='changeCategoryType1'></category-first>
    <!-- 二级分类 -->
    <category-second v-if="categoryType === '2'"
                     :columnNum="columnNum"
                     @updataCategoryType='changeCategoryType1'></category-second>
  </div>
</template>

<script>
import service from '@/dss-wechat3rd/src/api/wx_store_item.js';
import categoryFirst from './category-first.vue';
import categorySecond from './category-second.vue';
import './index.less';
import '../screen-phone-style.less';

export default {
  components: {
    categoryFirst,
    categorySecond
  },
  data() {
    return {
      loading: false,
      categoryType: '1',
      columnNum: '2'
    };
  },

  mounted() {
    //查询店铺使用类目级别配置
    this.queryUseCategory();
  },

  methods: {
    //查询店铺使用类目级别配置
    queryUseCategory() {
      this.loading = true;
      const params = {};
      service
        .queryUseCategoryV2(params)
        .done(res => {
          const data = res.data
            ? JSON.parse(res.data)
            : {
                categoryLevel: '1',
                columnNum: '2'
              };
          this.categoryType = String(data.categoryLevel);
          this.columnNum = String(data.columnNum);
        })
        .always(() => {
          this.loading = false;
        });
    },

    //修改店铺使用类目级别配置
    changeCategoryType(obj) {
      // 保存类型
      const params = {
        level: this.categoryType
      };
      service
        .updateUseCategory(params)
        .done(res => {
          this.$message.success('保存成功！');
        })
        .always(() => {});
    },

    //修改店铺使用类目级别配置
    changeCategoryType1(obj) {
      let x = [];
      obj.forEach(element => {
        x.push(this.saveData(element));
      });

      Promise.all(x).then(res => {
        console.log('Promise.all ---->   ', res);
        // 保存类型
        const params = {
          level: this.categoryType,
          columnNum: this.categoryType === '1' ? null : this.columnNum
        };
        service
          .updateUseCategory(params)
          .done(res1 => {
            this.$message.success('保存成功！');
          })
          .always(() => {});
      });
    },

    saveData(editCategory) {
      const params = {
        id: editCategory.id,
        name: editCategory.category,
        imgUrl: editCategory.imgUrl,
        imgUrlValue: editCategory.imgUrlValue
      };
      return service.saveCategory(params);
    }
  }
};
</script>


<style lang="less" scoped>
.category-head {
  /deep/ .el-radio__input {
    display: none;
  }

  /deep/ .el-radio {
    padding: 12px 0;
    border: 1px solid #e4e7ed;
    border-radius: 2px;
  }

  /deep/ .el-radio__label {
    padding: 0;
  }

  /deep/ .el-radio.is-checked {
    border: 1px solid #fa7516;
  }

  /deep/ .el-radio__input.is-checked+.el-radio__label {
    color: #fa7516 !important;
  }
}


</style>
