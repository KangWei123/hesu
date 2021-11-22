<template>
  <div class="base-info">
    <div class="base-info__title">基础档案</div>
    <div class="base-info__content">
      <div class="base-info__avatar">
        <img :src="info.avatar || info.avatarImgUrl || defaultAvatar" />
      </div>
      <fields
        class="base-info__column"
        :options="[
          {
            k: '姓名',
            v: info.realname || info.nickname || info.wxNickname,
          },
          {
            k: '手机号码',
            v: info.phone,
          },
          {
            k: '来源渠道',
            v: info.channelName,
          },
        ]"
      ></fields>
      <fields
        class="base-info__column"
        :options="[
          {
            k: '一账通ID',
            v: info.uniqueAccountId,
          },
          {
            k: '地区',
            v: [info.country, info.province, info.city, info.district].filter(Boolean).join(' '),
          },
          {
            k: '注册时间',
            v: info.registerTime || info.createTime,
          },
        ]"
      ></fields>
      <fields
        class="base-info__column"
        :options="[
          {
            k: '性别',
            v: SEX_NAME[info.gender],
          },
          {
            k: '邮箱',
            v: info.email,
          },
          {
            k: '身份证号',
            v: info.idCard,
          },
        ]"
      ></fields>
      <fields
        class="base-info__column"
        :options="[
          {
            k: '生日',
            v: info.birthday,
          },
          {
            k: '来源应用',
            v: info.appName,
          },
          {
            k: '车牌号码',
            v: info.carNo,
          },
        ]"
      ></fields>
    </div>
  </div>
</template>

<script>
  import Fields from './fields';
  import cdnResConfig from '@/business-common/utils/cdnResConfig';
  import { commonEnum } from '@/business-common/constants';

  export default {
    name: 'BaseInfo',
    components: {
      Fields,
    },
    props: {
      info: {
        type: Object,
        default: () => ({}),
      },
    },
    data() {
      return {
        defaultAvatar: cdnResConfig.mine.defaultAvatar,
        SEX_NAME: commonEnum.SEX_NAME,
      };
    },
  };
</script>

<style lang="less" scoped>
  .base-info {
    &__title {
      font-size: 16px;
      font-weight: 600;
      margin-bottom: 32px;
    }

    &__content {
      display: flex;
    }

    &__avatar {
      @width: 100px;

      width: @width;
      height: @width;
      border-radius: @width;
      box-shadow: 0 4px 6px 0 rgba(0, 0, 0, 0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 30px;
    }

    &__avatar > img {
      width: 90px;
      height: 90px;
      border-radius: 90px;
    }

    &__column {
      flex: 1;
    }
  }
</style>
