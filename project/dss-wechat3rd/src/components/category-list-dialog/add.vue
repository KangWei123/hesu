<template>
  <div class="categoryListAdd">
    <el-dialog
      :title="dialog.title"
      :visible.sync="showCategoryListAdd"
      width="20%"
      :before-close="closedialog"
      :close-on-click-modal="false"
    >
      <el-form :model="categoryListAdd" ref="categoryListAdd" label-width="94px" class="demo-ruleForm" :rules="rules">
        <el-form-item label="经营类目" prop="categoryName">
          <el-input
            type="text"
            maxlength="8"
            placeholder="请输入经营类目"
            v-model.trim="categoryListAdd.categoryName"
          ></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="closedialog">取 消</el-button>
        <el-button type="primary" @click="updataClassifyName()">保存</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
  import api from '@/dss-wechat3rd/src/api/category';

  export default {
    name: 'CategoryListAdd',
    props: {
      // eslint-disable-next-line vue/require-prop-types
      showCategoryListAdd: {
        typeof: Boolean,
        default: false,
      },
      // eslint-disable-next-line vue/require-prop-types
      dialog: {
        typeof: Object,
        default: function () {
          return {
            title: '',
            value: '',
            id: '',
          };
        },
      },
    },
    data() {
      return {
        categoryListAdd: {
          // 经营分类图地址
          categoryImgurl: null,
          // 经营类目输入框
          categoryName: '',
          // 经营类目id
          id: '',
        },
        rules: {
          categoryName: [
            {
              required: true,
              message: '请输入经营类目名称',
              trigger: 'blur',
            },
          ],
        },
      };
    },
    methods: {
      // 根据dialog.value是否为空，判断是编辑还是新增
      async updataClassifyName() {
        if (!(await this.$refs.categoryListAdd.validate())) {
          return;
        }
        let fn = null;
        if (this.dialog.value === '') {
          fn = api.category.add;
        } else {
          fn = api.category.updata;
        }
        if ((await fn(this.categoryListAdd)).success) {
          // 关闭弹窗
          this.closedialog();
        }
      },
      // 通知父组件将弹窗关闭
      closedialog() {
        this.$emit('closedialog');
      },
    },
    mounted() {
      this.categoryListAdd.categoryName = this.dialog.value;
      this.categoryListAdd.id = this.dialog.id;
    },
  };
</script>
<style lang="less" scope>
  .categoryListAdd {
    .el-dialog__wrapper {
      .el-dialog {
        min-width: 400px;
        min-height: 250px;
      }
    }
  }
</style>
