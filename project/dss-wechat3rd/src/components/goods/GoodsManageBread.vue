<template>
  <el-breadcrumb separator="/" v-if="activeGoodsType" class="wkt-breadcrumb-container">
    <el-breadcrumb-item v-if="firstLabel" :to="{ path: pathPrefix + goodsTypeEnum.server.type}"
                        replace>
      {{firstLabel}}
    </el-breadcrumb-item>
    <el-breadcrumb-item v-if="secondLabel" :to="{ path: pathPrefix + activeGoodsType.type}"
                        replace>
      {{secondLabel}}
    </el-breadcrumb-item>
    <el-breadcrumb-item v-if="finalLabel">
      {{finalLabel}}
    </el-breadcrumb-item>
  </el-breadcrumb>
</template>

<script>
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  export default {
    name: 'GoodManageBread',
    props: {
      firstLabel: {
        type: String,
        default: '第一个节点'
      },
      secondLabel: {
        type: String,
        default: '第二个节点'
      },
      finalLabel: {
        type: String,
        default: '最后一个节点'
      },
      pathPrefix: {
        type: String,
        default: '/goods-manage/list/'
      },
      activeGoodsType: {
        type: Object,
        default: function() {
          return null;
        }
      }
    },
    data() {
      return {
        goodsTypeEnum
      };
    }
  };
</script>

<style lang="less">
</style>
