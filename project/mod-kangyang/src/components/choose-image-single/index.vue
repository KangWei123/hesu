<template>
  <single-choose-image
    v-bind="$props"
    :value="dataSource"
    :limit="1"
    :is-disabled-edit="disabled"
    @delete="handleDelete"
    @input="handleInput"
  ></single-choose-image>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter';
  import omit from 'lodash/omit';
  import { ChooseImages as SingleChooseImage } from '@/register/wechat3rd';

  export default {
    name: 'ChooseImageSingle',
    components: {
      SingleChooseImage,
    },
    mixins: [emitter],
    props: {
      ...omit(SingleChooseImage.props, ['value', 'isDisabledEdit', 'disable', 'multiple', 'limit']),
      value: {
        type: String,
        default: '',
      },
      disabled: Boolean,
    },
    computed: {
      dataSource() {
        return this.value ? { imgUrl: this.value } : undefined;
      },
    },
    methods: {
      handleInput(evt) {
        const value = evt ? evt.imgUrl : undefined;
        this.$emit('input', value);
        // 触发表单验证
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
      handleDelete() {
        const value = undefined;
        this.$emit('input', value);
        // 触发表单验证
        this.dispatch('ElFormItem', 'el.form.change', [value]);
      },
    },
  };
</script>
