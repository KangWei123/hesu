<template>
  <div class="score-edit-wrap">
    <score-edit-from :score-type="ScoreType.Consume" title="积分消耗动作设置" />
  </div>
</template>

<script>
  import ScoreEditFrom from '../components/score-edit-form.vue';
  import { ScoreType } from '@/mod-member/src/enum/index';

  export default {
    components: { ScoreEditFrom },
    data() {
      return {
        ScoreType,
      };
    },
  };
</script>
