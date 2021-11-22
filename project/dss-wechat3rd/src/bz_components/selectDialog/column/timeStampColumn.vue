<template>
  <div class="goods-info-column">
    {{ row[col.prop] | timeDate }}
  </div>
</template>

<script>
import dateUtil from '@/dss-common/utils/date';
export default {
  name: 'timeStampColumn',
  props: ['row', 'col'],
  filters: {
    // 将时间戳转化为日期格式
    timeDate(val) {
      if (val) {
        return dateUtil.format(new Date(val), 'YYYY-MM-DD HH:mm:ss');
      }
    }
  }
};
</script>

<style lang="less" scoped>
</style>
