<template>
  <single-choose-image
    v-bind="$props"
    :value="dataSource"
    :limit="1"
    :is-disabled-edit="disabled"
    @input="handleInput"
  ></single-choose-image>
</template>

<script>
  import emitter from 'element-ui/lib/mixins/emitter';
  import omit from 'lodash/omit';
  import { ChooseImages as SingleChooseImage } from '@/mod-material/ref/components';

  export default {
    name: 'SingleImagePicker',
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
    },
  };
</script>

<style></style>
