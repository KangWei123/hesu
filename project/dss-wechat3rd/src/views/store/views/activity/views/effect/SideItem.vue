<template>
  <div class="effect-chart-side">
    <div class="item" v-for="item in data" :key="item.label">
      <p class="item-title">{{ item.label }}</p>
      <div>
        <em class="item-value">{{ item.value | number}}</em>
        <div class="rate-container">
          <arrow-rate rate-label="环比" :rate="item.rate"></arrow-rate>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import ArrowRate from '../../components/ArrowRate';
  export default {
    components: {
      ArrowRate
    },

    props: {
      /** e.g. [{ label: String, value: String, rate }, ...] */
      data: Array
    }
  };
</script>

<style lang="less" scoped>
  .effect-chart-side {
    margin-left: 40px;
    min-width: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    .small {
      font-size: 12px;
      color: rgba(1, 35, 52, 0.6);
    }

    .item {
      margin-bottom: 40px;

      .item-title {
        margin-bottom: 14px;
        font-size: 13px;
        font-weight: 600;
        color: rgba(2, 19, 52, 0.4);
      }

      .item-value {
        font-size: 24px;
        color: rgba(1, 35, 52, 0.7);
      }

      .rate-container {
        display: inline-block;
        margin-left: 10px
      }
    }
  }

</style>
