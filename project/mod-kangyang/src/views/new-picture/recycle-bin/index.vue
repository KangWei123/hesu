<template>
  <div class="flex-box">
    <left-layout ref="layout"></left-layout>
    <picture-content :is-recycle="true" @getIds="getIds" @Refresh="refresh"></picture-content>
    <picture-detail :id-list="idList"></picture-detail>
  </div>
</template>

<script>
  import leftLayout from '../components/left-layout/index.vue';
  import pictureContent from '../components/picture-content/index.vue';
  import pictureDetail from '../components/picture-detail/index.vue';

  export default {
    components: { pictureContent, pictureDetail, leftLayout },
    data() {
      return {
        idList: [],
      };
    },
    methods: {
      getIds(idList) {
        this.idList = idList;
      },
      // 刷新树状列表
      refresh() {
        this.$refs.layout.refresh();
      },
    },
  };
</script>
<style lang="less" scoped>
  .flex-box {
    flex-direction: row;
    display: flex;
    min-height: 0;
    flex: 1 1 auto;
  }
</style>
