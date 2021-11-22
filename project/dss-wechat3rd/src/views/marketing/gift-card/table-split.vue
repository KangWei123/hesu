<template>
  <div>
    <table
      class="wkb-table-split"
      cellpadding="0"
      cellspacing="0"
    >
      <colgroup>
        <col
          :name="'table-split-' + talbe_unique_id + '_' + index"
          v-for="(col, index) in __cols"
          :key="index"
          :width="col.width + ''"
        />
      </colgroup>
      <thead>
        <slot name="thead"></slot>
      </thead>
    </table>
    <table
      class="wkb-table-split-body"
      border="0"
      cellpadding="0"
      cellspacing="0"
    >
      <colgroup>
        <col
          :name="'table-split-' + talbe_unique_id + '_' + index"
          v-for="(col, index) in __cols"
          :key="index"
          :width="col.width + ''"
        />
      </colgroup>
      <tbody>
        <slot></slot>
      </tbody>

    </table>
  </div>
</template>

<script>
let uniqueId = 1;
export default {
  data() {
    return {
      talbe_unique_id: uniqueId++,
      cols: []
    };
  },
  computed: {
    __cols() {
      return (this.$slots.thead || [])
        .filter(th => th.componentOptions && th.componentOptions.tag === 'table-split-col')
        .map(th => {
          let width = '';
          if (th.componentOptions && th.componentOptions.propsData) {
            width = th.componentOptions.propsData.width || '';
          }
          return {
            width
          };
        });
    }
  }
};
</script>

<style scoped lang="less">
.wkb-table-split,
.wkb-table-split-body {
  width: 100%;
  table-layout: fixed;
  border-collapse: collapse;
  border-spacing: 0;

  td,
  th {
    border: 1px solid #ebeef5;
    padding: 15px 10px;
    background: white;
  }
}

.wkb-table-split-body {
  margin-top: 15px;
}
</style>
