<template>
<el-popover :title="title" trigger="hover" :placement="placement" v-if="customerIndicator || tip">
  <i class="key-icon icon-tip" slot="reference"></i>
  <div class="tip-icon-content">
    <template v-if="!tip && customerIndicator">
      <p>
        <span class="title">{{ customerIndicator.title }}：</span>
        <span class="content">{{ customerIndicator.text }}</span>
      </p>
    </template>
    <template v-if="tip">
      <p v-for="(item, index) in tip.content" :key="index">
        <span class="title">{{ item.title }}：</span>
        <span class="content">{{ item.text }}</span>
      </p>
    </template>
  </div>
</el-popover>
</template>

<script>
import './style.less'
import utils from '@/dss-common/utils'
export default {
  props: {
    title: {
      type: String,
      default: '指标说明'
    },
    // 指标说明
    name: {
      type: String
    },
    // 指标位置
    placement: {
      type: String,
      default: 'right-start'
    },
    customerIndicator: {
      type: Object,
      default: function () {
        return null;
      }
    }
  },
  computed: {
    tip() {
      if (!this.name) {
        return
      }
      if (!this.$store.state.tips) {
        return
      }

      if (this.name === 'customerUVAnalyse') {
        const values = this.$store.state.tips.filter(item => item.name === this.name || item.name === 'customerUV');
        let value = values.find(item => item.name === this.name);
        if (!value) {
          return;
        }
        let tip = utils.plain(value);
        tip.content = JSON.parse(value.content)
        const customer = values.find(item => item.name === 'customerUV');
        if (customer) {
          tip.content = JSON.parse(customer.content).concat(tip.content);
        }
        return tip;
      }
      let value = this.$store.state.tips.find(item => item.name === this.name);


      if (!value) {
        return;
      }

      let tip = utils.plain(value);
      tip.content = JSON.parse(value.content);

      return tip;
    }
  }
}
</script>
