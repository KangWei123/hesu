<template>
  <el-dialog :visible.sync="show"
             fullscreen
             class="agreement-dialog"
             :show-close="false">
    <w-k-b-product-protocol v-if="protocol === 'wkb-product'" />
    <s-m-s-protocol v-else-if="protocol === 'sms'" />
    <p-a-y-protocol :payContent="payContent" v-else-if="protocol === 'pay'"/>
    <div class="footer">
      <el-button type="primary"
                 @click="onClose"
                 class="circle-btn">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import WKBProductProtocol from './wkb-product-protocol.vue';
import SMSProtocol from './sms-protocol.vue';
import PAYProtocol from './pay-protocol.vue';

export default {
  components: {
    WKBProductProtocol,
    SMSProtocol,
    PAYProtocol
  },

  props: {
    visible: {
      type: Boolean,
      default: false
    },

    protocol: {
      type: String,
      default: 'wkb-product'
    },

    payContent: {
      type: String
    }
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        console.log(val);
        this.$emit('update:visible', val);
      }
    }
  },
  methods: {
    onClose() {
      this.show = false;
    }
  }
};
</script>

<style lang="less" scoped>
.agreement-dialog {
  .el-dialog {
    background-color: #f0f2f7;
  }
}

.footer {
  padding: 30px 0 0px;
  text-align: center;
}

.circle-btn {
  width: 120px;
}
</style>


