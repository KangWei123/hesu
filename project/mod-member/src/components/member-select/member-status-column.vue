<template>
  <span :style="{ color: MemberStatusColor[row.status] }">{{ MemberStatusName[row.status] }}</span>
</template>

<script>
  import { MemberStatusName, MemberStatusColor } from '@/mod-member/src/enum';

  export default {
    props: ['row', 'col'],
    data() {
      return {
        MemberStatusName,
        MemberStatusColor,
      };
    },
  };
</script>
