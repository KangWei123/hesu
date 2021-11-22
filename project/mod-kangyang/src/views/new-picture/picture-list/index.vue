<template>
  <div class="flex-box">
    <left-layout @nodeClick="handleNodeClick" ref="layout" :default-key="groupId"></left-layout>

    <picture-content
      :group-id="groupId"
      @getIds="getIds"
      @Refresh="refresh"
      @handleGroup="handleGroup"
      @item-click="handleItemClick"
      @click="handleClick"
    ></picture-content>

    <picture-detail :data="detail"></picture-detail>
  </div>
</template>

<script>
  import leftLayout from '../components/left-layout/index.vue';
  import pictureContent from '../components/picture-content/index.vue';
  import pictureDetail from '../components/picture-detail/index.vue';
  import { elderSpaceApi } from '@/mod-kangyang/src/api';

  export default {
    name: 'PictureList',
    components: { pictureContent, pictureDetail, leftLayout },

    data() {
      return {
        groupId: 0,
        detail: null,
        idList: [],
      };
    },
    created() {
      // 从别的页面跳转过来带参数
      if (this.$route.query.id) {
        this.groupId = Number(this.$route.query.id);
      }
    },
    methods: {
      handleNodeClick(node) {
        this.groupId = node.id;
      },
      handleClick(item) {
        this.getDetail(item.id);
      },
      handleItemClick(item) {
        console.log(item);
        this.getDetail(item.id);
      },
      getIds(idList) {
        this.idList = idList;
      },
      handleGroup(data) {
        this.groupId = data.id;
      },
      refresh() {
        this.$refs.layout.refresh();
      },
      async getDetail(id) {
        const { data } = await elderSpaceApi.getDetail({
          id: id,
        });
        this.detail = data;
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
