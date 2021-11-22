<template>
  <div class="page-bg">
    <div class="base-header">
      人群管理
      <TipIcon :content="tip" title></TipIcon>
    </div>
    <div class="page-content">
      <group-list></group-list>
    </div>
  </div>
</template>

<script>
  import GroupList from './GroupList';
  import TipIcon from '@/mod-member/src/components/TipIcon';

  export default {
    components: {
      GroupList,
      TipIcon,
    },
    data() {
      return {
        tip: [
          { title: '新建人群', text: '在标签管理中选择标签-设置计算逻辑-圈选保存人群' },
          {
            title: '人群更新机制',
            text: 'T+1机制在每日凌晨对人群进行更新，不更新机制则不对人群进行更新',
          },
          { title: '覆盖人数', text: '计算该人群包覆盖的人群数量，随更新机制更新覆盖人数' },
        ],
      };
    },
  };
</script>
<style scoped lang="less">
  .title {
    font-size: 18px;
    font-weight: 600;
    color: #333;
    margin-bottom: 15px;
  }
</style>
