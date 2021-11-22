
<style lang="less">
.user-template {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > .my-template {
    display: flex;
    align-items: center;

    & > div {
      margin: 10px 20px;
    }

    & > .edit {
      cursor: pointer;
      padding: 10px 20px;
      border-radius: 4px;
      background-color: red;
      color: white;
    }
  }

  & > .choose {
    cursor: pointer;
    padding: 10px 20px;
    border-radius: 4px;
    background-color: red;
    color: white;
  }
}
</style>

<template>
  <div class="user-template">
    <div class="my-template">
      <div>我的模板</div>
      <div></div>
      <div class="edit"
           @click="clickEdit">编辑</div>
    </div>
    <div @click="chooseTemplate"
         class="choose">
      选择模板库
    </div>
  </div>
</template>

<script>
import service from '../../../api/index.js';
export default {
  data: function() {
    return {
      dataSource: []
    };
  },

  mounted() {
    service
      .getUserTemplate({
        sellerId: 123,
        appId: 12,
        maAppID: 'wxb05c5a6d2a05343d',
        sellerTemplateId: 38
      })
      .then(response => {
        this.dataSource = response.data;
      });
  },

  methods: {
    clickEdit(val) {
      this.$router.push({
        path: '/setting/homedecorate',
        query: { templateConfig: val.config, templateId: val.templateId }
      });
    },

    chooseTemplate() {
      this.$router.push({
        path: '/storemgr/template-list'
      });
    }
  }
};
</script>



