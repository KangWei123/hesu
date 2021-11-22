<template>
  <div class="channel-detail-box">
    <div class="box-header">
      <span class="box-header-title">{{ channelInfo.title }}</span>
      <slot></slot>
    </div>
    <div v-if="channelInfo.list">
      <div
        class="box-content"
        :class="item.type === 'avatar' ? 'avatar-line' : ''"
        v-for="item in channelInfo.list"
        :key="item.label"
      >
        <span class="box-content-label">{{ item.label }}</span>
        <span v-if="item.type === 'avatar'" style="vertical-align: middle">
          <img v-if="item.value" class="box-content-value smaller-avatar" :src="item.value" />
          <img v-else class="box-content-value smaller-avatar" :src="avatar" />
        </span>
        <span class="box-content-value" v-else>{{ item.value }}</span>
      </div>
    </div>
    <div v-else>
      <div class="no-data">暂无渠道信息</div>
    </div>
  </div>
</template>

<script>
  import avatar from '@/dss-common/img/default-avatar.png';
  export default {
    name: 'ChannelInfo',
    data() {
      return {
        avatar,
      };
    },
    props: {
      channelInfo: {
        type: Object,
        default() {
          return null;
        },
      },
    },
  };
</script>

<style lang="less"></style>
