<template>
  <el-input-number v-bind="$props" v-on="$listeners"> </el-input-number>
</template>

<script>
  import { InputNumber } from 'element-ui';
  import { overideProps } from '@/dss-common/utils/vue';

  export default {
    name: 'IntegerInput',
    props: overideProps(InputNumber, {
      defaultProps: {
        controls: false,
        precision: 0,
        max: Number.MAX_SAFE_INTEGER,
      },
    }),
  };
</script>

<style></style>
