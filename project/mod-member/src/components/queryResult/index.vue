<template>
  <div class="query-result-total">
    <div class="query_result">
      <div class="query-result-text">
        <!--<span class="query_result_title">分析结果：</span>-->
        <span class="query_result_content">
          已选择
          <span class="color-blue">{{ count }}</span> 个条件，覆盖目标人数为
          <em class="color-red" v-if="total && total > -1">{{ splitTotal }}</em>
          <em class="color-red" v-else>0</em>人
        </span>
        <slot name="tips"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  import stringUtil from '@/dss-common/utils/string';

  export default {
    props: {
      total: {
        default: 0,
      },
      count: {
        default: 0,
      },
      rate: {
        default: 0,
      },
      exactRate: {
        default: false,
      },
    },
    computed: {
      splitTotal() {
        return stringUtil.addCommasForNumber(this.total);
        // return utils.string.addCommasForNumber(this.total)
      },
    },
  };
</script>

<style lang="less">
  // 查询结果 sql、总数、耗时
  .query-result-total {
    display: inline-flex;
    width: 50%;
    margin: 28px 0 47px 0;
  }

  .query_result {
    padding-left: 20px;

    .query-result-text {
      color: #333333;
      font-size: 18px;
      font-family: PingFangSC-Regular;
      font-weight: 600;
      line-height: 16px;
    }

    .query_result_content {
      .color-blue {
        color: #256eff;
      }

      .color-red {
        color: #ff6f25;
        font-size: 24px;
        font-family: DINPro-Medium;
        font-weight: 500;
      }
    }

    .tips {
      top: 5px;
      font-size: 20px;
      margin-left: 10px;
      color: #337ab7;
      border-radius: 20px;
      transition: all 0.2s;

      &:hover {
        box-shadow: 0 0 10px 3px #ddd;
        color: #4fc2f7;
      }
    }
  }
</style>
