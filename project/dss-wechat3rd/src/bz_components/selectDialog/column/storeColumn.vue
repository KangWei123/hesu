<template>
  <div class="goods-info-column">
    <el-tooltip popper-class="pop" placement="top-start">
      <div slot="content">
        <p>{{ row[col.prop] | storeData(row) }}</p>
      </div>
      <span class="unit-tags">{{ row[col.prop] | storeData(row) }}</span>
    </el-tooltip>
  </div>
</template>

<script>
export default {
  name: 'storeColumn',
  props: ['row', 'col'],
  filters: {
    storeData(val, row) {
      if (row.suitStoreType == '0' || (row.storeCount && row.storeCount == '所有')) {
        return '全部门店';
      }
      if (val) {
        let arr = val.map(item => {
          return item.name;
        });
        return arr.join(',');
      }
    }
  }
};
</script>

<style lang="less">
.unit-tags {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
}
.pop {
  width: 150px;
  word-wrap: break-word;
}
</style>
