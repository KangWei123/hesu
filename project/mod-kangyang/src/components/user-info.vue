<template>
  <div class="user-info">
    <header class="user-info__header">
      <div class="user-info__avatar">
        <img :src="avatar" />
      </div>
      <div class="user-info__base">
        <div class="user-info__name"><slot name="name" /></div>
        <div class="user-info__baselist"><slot name="baseInfo" /></div>
      </div>
    </header>
    <main class="user-info__body">
      <div class="user-info__column"><slot name="column-1" /></div>
      <div class="user-info__column"><slot name="column-2" /></div>
      <div class="user-info__column"><slot name="column-3" /></div>
    </main>
  </div>
</template>

<script>
  /**
   * 客户详情，用户信息展示
   */
  export default {
    name: 'UserInfo',
    props: {
      avatar: {
        type: String,
        require: true,
      },
    },
  };
</script>

<style lang="less" scoped>
  .user-info {
    display: inline-block;
  }

  .user-info__header {
    display: flex;
  }

  .user-info__avatar {
    width: 88px;
    height: 88px;
    border-radius: 100%;
    overflow: hidden;
  }

  .user-info__avatar > img {
    width: 100%;
    object-fit: cover;
  }

  .user-info__base {
    margin-left: 10px;
  }

  .user-info__name {
    font-size: 16px;
    line-height: 22px;
  }

  .user-info__baselist {
    margin-top: 10px;
  }

  .user-info__body {
    display: flex;
    margin-top: 24px;
  }

  .user-info__column {
    flex: 1;
  }

  .user-info__baselist > .user-info-item {
    padding: 3px 0;
  }

  .user-info__column > .user-info-item {
    padding: 7px 0;
  }
</style>
