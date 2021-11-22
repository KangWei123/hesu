<template>
  <el-button class="form-button" v-bind="buttonProps" @click="handleClick"
    ><slot>{{ defaultText }}</slot></el-button
  >
</template>

<script>
  import { Button } from 'element-ui';
  /**
   * 表单按钮
   */
  export default {
    name: 'FormButton',
    inject: ['elForm'],
    props: {
      ...Button.props,
      /**
       * 按钮动作
       */
      action: {
        /**
         * @type 'submit' | 'reset' | 'cancel' | 'back'
         */
        type: String,
        default: 'submit',
      },
    },
    computed: {
      buttonProps() {
        const { action, ...props } = this.$props;
        if (action === 'submit') {
          props.nativeType = 'submit';
          props.type = 'primary';
        }

        return props;
      },
      defaultText() {
        return { submit: '保存', reset: '重置', cancel: '取消', back: '返回' }[this.action];
      },
    },
    methods: {
      handleClick() {
        if (this.action === 'cancel' || this.action === 'back') {
          // 回退
          this.$router.go(-1);
        } else if (this.action === 'reset') {
          // 重置表单
          this.elForm.resetFields();
        }
      },
    },
  };
</script>

<style></style>
