
<style lang="less">
.store-link {
  padding: 22px 40px;
  & > .Tips {
    display: flex;
    flex-direction: column;
    font-size: 12px;
    font-family: MicrosoftYaHei;
    color: rgba(86, 105, 128, 1);
    & > span {
      padding: 8px 0px;
    }
  }

  & > .container {
    margin-top: 10px;

    & > .list {
      display: flex;
      & > .item {
        width: 100px;
        height: 100px;
        background-color: yellow;
        overflow: hidden;
        margin: 10px;
      }
    }
  }
}
</style>
<template>
  <div class="store-link">
    <div class="Tips">
      <span>1、提供网店的小程序路径以及H5页面链接。</span>
      <span>2、用于配置公众号菜单，在推文中插入小程序卡片，引导顾客进网店浏览。</span>
    </div>
    <div class="container">
      <div class="list">
        <div v-for="(item,index) in dataSource" :key="index" class="item">
          <div>{{item.index}}</div>
        </div>
      </div>
    </div>
  </div>
</template>
 
 
<script>
import service from '../../../../api/index.js';
export default {
  data: function() {
    return {
      dataSource: []
    };
  },

  mounted() {
    this.getAllPages();
  },

  methods: {
    getAllPages() {
      service
        .getUserPages({
          sellerTemplateId: this.$store.state.templateId
        })
        .then(response => {
          this.dataSource = response.data;
        });
    }
  }
};
</script>



