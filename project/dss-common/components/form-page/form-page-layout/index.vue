<template>
  <el-form ref="form" class="form-page" :label-suffix="labelText" v-bind="$props" @submit.native.prevent="handleSumbit">
    <div class="form-page__body">
      <div class="form-page__title" v-if="(titleVisible && title) || $slots.title">
        <slot name="title">{{ title }}</slot>
      </div>
      <slot></slot>
    </div>
    <div v-if="$slots.footer || $scopedSlots.footer" class="form-page__footer">
      <slot name="footer" :saving="state.saving" />
    </div>
  </el-form>
</template>

<script>
  import { Form } from 'element-ui';

  /**
   * 统一的表单页布局
   * @slot title 标题，默认从路由对象中获取标题
   * @slot footer 底部提交栏
   * @slot default 表单内容
   */
  export default {
    name: 'FormPageLayout',
    props: {
      ...Form.props,
      /**
       * 是否显示标题，标题将从 route 配置中获取
       */
      titleVisible: {
        type: Boolean,
        default: true,
      },
      /**
       * submit or submitHander方式二选一
       * submit原生提交方式
       * sumbitHander自动校验方式
       * 处理数据提交
       * 返回一个 Promise，表示成功或者失败
       */
      submitHandler: {
        type: Function,
        required: false,
      },

      /**
       * 保存成功文案
       */
      submitSucessText: {
        type: String,
        default: '保存成功',
      },
      /**
       * 是否在保存成功后回退
       */
      backOnSubmitSucess: {
        type: Boolean,
        default: true,
      },

      /**
       *  表单域标签后缀支持自定义
       */
      labelText: {
        type: String,
        default: '：',
      },
    },
    data() {
      return {
        state: {
          saving: false,
        },
      };
    },
    computed: {
      title() {
        return this.$route && this.$route.meta && this.$route.meta.title;
      },
    },
    methods: {
      getForm() {
        return this.$refs.form;
      },

      // 和 el-form 兼容的方法
      ...Object.keys(Form.methods)
        .map(name => {
          return {
            [name]: function (...args) {
              return this.$refs.form[name](...args);
            },
          };
        })
        .reduce((prev, cur) => {
          return { ...prev, ...cur };
        }, {}),

      handleSumbit(e) {
        if (this.$listeners.submit) {
          this.$emit('submit', e);
        } else {
          this.autoHandleSumbit(e);
        }
      },

      async autoHandleSumbit(e) {
        if (!(await this.validate())) {
          return; // 验证失败
        }

        try {
          this.state.saving = true;
          await this.submitHandler();
        } catch (err) {
          console.error('提交报错:', err.message);
          // this.$message.error(err.message);
          return;
        } finally {
          this.state.saving = false;
        }

        if (this.backOnSubmitSucess) {
          this.$router.go(-1);
        }

        if (this.submitSucessText) {
          this.$message.success(this.submitSucessText);
        }
      },
    },
  };
</script>

<style lang="less" scoped>
  .form-page {
    @footer-height: 60px;

    background: #fff;
    padding: 20px 32px;
    background: #fff;
    border-radius: 0 0 4px 4px;
    box-shadow: 0 2px 6px -2px rgba(0, 0, 0, 0.06);
    margin-bottom: @footer-height;

    &__title {
      font-size: 16px;
      color: #303133;
      font-weight: 600;
      line-height: 1.5;
      margin: 20px 0;
    }

    &__footer {
      position: fixed;
      left: @sidebar-width;
      right: 0;
      bottom: 0;
      height: @footer-height;
      background-color: white;
      box-shadow: 0 -1px 9px #e8e8e8;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1001;

      & /deep/ .form-button {
        width: 120px;
      }
    }
  }

  .hideSidebar .form-page__footer {
    left: @hide-sidebar-width;
  }
</style>
