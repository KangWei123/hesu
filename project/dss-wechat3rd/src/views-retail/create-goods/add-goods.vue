<template>
  <div>
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/product/'+route}"
                          replace>{{isDiscard?'废弃':'商品'}}列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{state}}</el-breadcrumb-item>
    </el-breadcrumb>
    <good-add-form :goods-type="goodsType"
                   :disabled-form="disabledForm"
                   :is-disabled-edit="isDisabledEdit" />
  </div>
</template>

<script>
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodAddForm from '@/dss-wechat3rd/src/components/goods/GoodEditForm';

export default {
  name: 'index',
  components: {
    GoodAddForm
  },
  data() {
    return {
      goodsType: goodsTypeEnum.product,
      isDiscard: this.$route.path.indexOf('discard') > 0,
      route: this.$route.path.indexOf('discard') > 0 ? 'discard' : 'list'
    };
  },
  computed: {
    state: function() {
      if (this.$route.query.itemNo) {
        return '编辑';
      }
      return '添加';
    },

    // 是否不允许整个商品
    disabledForm() {
      if (this.$route.query.disabledForm && this.$route.query.disabledForm != 'false') {
        return true;
      }
      return false;
    },

    // 是否不允许编辑敏感信息
    isDisabledEdit() {
      if (this.$route.query.isDisabledEdit && this.$route.query.isDisabledEdit != 0) {
        return true;
      }
      return false;
    }
  }
};
</script>
