<template>
  <div class="score-edit-wrap">
    <score-edit-from :score-type="ScoreType.Give" title="积分发放动作设置" />
  </div>
</template>

<script>
  import ScoreEditFrom from '../components/score-edit-form.vue';
  import { ScoreType } from '@/mod-member/src/enum';

  export default {
    components: { ScoreEditFrom },
    data() {
      return {
        ScoreType,
      };
    },
  };
</script>
