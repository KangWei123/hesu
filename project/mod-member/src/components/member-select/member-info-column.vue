<template>
  <user-info-field
    :avatar="row.avatarImgUrl"
    :name="row.realname || row.nickname || row.wxNickname"
    :phone="row.phone"
  />
</template>

<script>
  import UserInfoField from '@/business-common/components/user-info-field/index.vue';

  export default {
    props: ['row', 'col'],
    components: {
      UserInfoField,
    },
  };
</script>
