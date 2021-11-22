<template>
  <table class="timeline">
    <tr class="timeline__item" v-for="(item, idx) of list" :key="idx">
      <td>
        <slot v-if="idx % 2 === 1" :item="item"></slot>
      </td>
      <td>
        <slot v-if="idx % 2 === 0" :item="item"></slot>
      </td>
    </tr>
  </table>
</template>

<script>
  export default {
    name: 'SimpleTimeline',
    props: {
      list: {
        type: Array,
        default: () => [],
      },
    },
  };
</script>

<style scoped lang="less">
  .timeline {
    position: relative;
    display: inline-block;

    &__item {
      position: relative;

      & > td {
        padding-bottom: 10px;
      }

      & > td:nth-child(1) {
        position: relative;
        padding-right: 10px;

        &::after {
          content: '';
          position: absolute;
          display: block;
          right: 0;
          top: 0;
          width: 1px;
          height: 100%;
          border-right: 1px dashed #cad1d8;
        }

        // dot
        &::before {
          content: '';
          position: absolute;
          top: 0;
          right: -4px;
          width: 10px;
          height: 10px;
          border-radius: 10px;
          background: #ff6a1e;
          z-index: 1;
        }
      }

      & > td:nth-child(2) {
        padding-left: 10px;
      }
    }
  }
</style>
