<template>
  <el-dialog class="um-goods-detail" title="链接商品详情" :visible.sync="dialogVisible">
    <div class="message-item">
      <span class="message-item__label">商品名称:</span>
      <span class="message-item__content">{{goodsData.name}}</span>
    </div>
    <div class="message-item">
      <span class="message-item__label">商品图片:</span>
      <img :src="goodsData.thumbnail" class="message-item__img" alt />
      <el-button class="message-item__btn" @click="cancelLink">取 消 链 接</el-button>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dialogVisible = false">关闭</el-button>
    </div>
  </el-dialog>
</template>

<script>
import services from '@/dss-common/utils/services';
import constants from '@/dss-wechat3rd/src/constants/index';
export default {
  props: {
    value: {
      type: Boolean,
      default: false
    },
    goodsId: {
      type: String
    }
  },
  data() {
    return {
      dialogVisible: false,
      goodsData: {},
      loading: false
    };
  },
  watch: {
    value(val) {
      if (val !== this.show) {
        this.dialogVisible = val;
      }
    },
    dialogVisible(val) {
      if (val !== this.value) {
        this.$emit('input', val);
      }
    },
    goodsId(val) {
      this.getGoodsDetail(val);
    }
  },
  methods: {
    getGoodsDetail(itemNo) {
      // this.loading = true;
      const params = {
        itemNo: itemNo
      };
      services
        .get(constants.Api.goods.detail, {
          params,
          action: '商品详情'
        })
        .done(res => {
          this.goodsData = res.data.wxItem || {};
        })
        .always(() => {
          // this.loading = false;
        });
    },
    cancelLink() {
      this.dialogVisible = false;
      this.$emit('cancelLink');
    }
  }
};
</script>

<style lang="less">
.um-goods-detail {
  .message-item {
    display: flex;
    align-items: center;
    &__label {
      margin-right: 10px;
    }
    &__img {
      width: 200px;
      height: 200px;
      object-fit: cover;
      margin-right: 10px;
    }
    &__btn {
      align-self: flex-end;
    }
  }
}
</style>