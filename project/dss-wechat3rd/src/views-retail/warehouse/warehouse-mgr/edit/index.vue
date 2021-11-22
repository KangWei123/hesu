<template>
  <div class="warehouse-container">
    <el-breadcrumb class="wkt-breadcrumb-container" separator="/">
      <el-breadcrumb-item :to="{ path: '/warehouse/stock-mgr/list' }"
                          replace>
        仓库管理
      </el-breadcrumb-item>
      <el-breadcrumb-item>
        {{state}}仓库
      </el-breadcrumb-item>
    </el-breadcrumb>
    <div class="warehouse">
      <edit-area :type='type'></edit-area>

    </div>
  </div>
</template>
<script>
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import editArea from './editArea.vue';

export default {
  name: 'index',
  components: { ImageSelector, editArea },
  data() {
    return {
      loading: false,
      type: Number(this.$route.query.type) || null
    };
  },
  computed: {
    state: function() {
      if (this.$route.query.id) {
        return '编辑';
      }
      return '新增';
    }
  },
  mounted() {}
};
</script>
<style lang="less">
  .warehouse-container {
    background: #fff;
    margin-bottom: 30px;
    .warehouse {
      padding: 20px;
      .warehouse-input {
        width: 366px;
      }
    }
  }
</style>
