<template>
  <div class="store-module-edit" v-if="dataSource">
    <edit-header :data-source="dataSource" name="商圈"></edit-header>

    <div class="com-body">
      <size :data-source="dataSource" hidden-radius />
    </div>
  </div>
</template>
<script>
  import './css/common.less';
  import size from './size.vue';
  import EditHeader from './edit-header.vue';

  export default {
    name: 'ShoppingModuleEdit',
    props: {
      dataSource: {
        type: Object,
        default: null,
      },
    },
    components: {
      size,
      EditHeader,
    },
  };
</script>
