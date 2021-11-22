<template>
  <div class="store-module-edit"
       v-if="dataSource">
    <edit-header :data-source="dataSource" name="店铺"></edit-header>

    <div class="com-body">
      <size :dataSource="dataSource"></size>
    </div>
  </div>
</template>
<script>
import './css/common.less';
import size from './size.vue';
import EditHeader from './edit-header.vue';

export default {
  name: 'storeModuleEdit',
  props: {
    dataSource: {
      type: Object,
      default: null
    }
  },
  components: {
    size,
    EditHeader
  }
};
</script>
