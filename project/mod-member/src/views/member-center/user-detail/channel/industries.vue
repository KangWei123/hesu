<template>
  <div class="industries">
    <div class="title">业态信息</div>
    <div class="list">
      <card v-for="i of 3" :key="i" class="card"
        ><template #title>
          <img
            class="industry-icon"
            src="https://ss1.bdstatic.com/70cFuXSh_Q1YnxGkpoWK1HF6hhy/it/u=3714008985,2103761124&fm=26&gp=0.jpg"
          />
          商业中心
        </template>
        TODO:
      </card>
    </div>
  </div>
</template>

<script>
  import Card from '../card';
  /**
   * TODO: 暴露接口到外部，由具体业态来渲染对应业态的用户信息
   */
  export default {
    name: 'Industries',
    components: {
      Card,
    },
  };
</script>

<style lang="less" scoped>
  .industries {
    margin-top: 50px;
    padding: 16px;

    .title {
      background: #f5f7fa;
      height: 48px;
      line-height: 48px;
      font-size: 18px;
      color: #303133;
      text-align: center;
      font-weight: 600;
      margin-top: 22px;
      border-radius: 5px;
    }

    .card {
      margin-top: 16px;
    }
  }
  .list /deep/ .industry-icon {
    width: 32px;
    height: 32px;
    object-fit: cover;
    margin-right: 8px;
  }
</style>
