<template>
  <div class="user-info">
    <img class="user-info__avatar" :src="avatar || defaultAvatar" />
    <div class="user-info__body">
      <div class="user-info__name">{{ name }}</div>
      <div class="user-info__contact">{{ phone }}</div>
      <div class="user-info__status">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import cdnResConfig from '@/business-common/utils/cdnResConfig';

  /**
   * 会员信息展示，用于表单字段
   */
  export default {
    name: 'UserInfoField',
    props: {
      avatar: {
        type: String,
        default: cdnResConfig.mine.defaultAvatar,
      },
      name: {
        type: String,
        default: '',
      },
      phone: {
        type: String,
        default: '',
      },
    },
    data() {
      return {
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
      };
    },
  };
</script>

<style scoped lang="less">
  .user-info {
    display: flex;
    align-items: center;

    &__body {
      flex: 1;
      margin-left: 8px;
      line-height: 1.8;
      text-align: left;
    }

    &__avatar {
      @width: 48px;

      width: @width;
      height: @width;
      border-radius: @width;
      background-color: gray;
    }

    &__name {
      font-weight: 600;
    }

    &__status {
      color: #717378;
    }
  }
</style>
