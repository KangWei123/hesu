<template>
  <div class="dmp_table_wrapper">
    <table class="dmp_table has_checkbox ov_table">
      <thead>
        <tr class="dmp_table_th ov_sort_th">
          <th>选择</th>
          <th>名称</th>
          <th style="text-align: right; text-overflow: clip" id="sort_0">
            人群规模
            <span v-if="data.length > 1" @click="sort('totalCount', 0)"> </span>
          </th>
        </tr>
      </thead>

      <tbody>
        <tr v-if="!data.length" class="dmp_table_nothing" data-tip="没有查询到数据！"></tr>
        <tr v-for="(item, index) in data" class="cur-pointer" :key="index">
          <td>
            <el-checkbox
              :checked="true"
              :disabled="enabledData.length === 1 && item.fenabled === true"
              @change="changeItem(item, index)"
            >
            </el-checkbox>
          </td>
          <td class="color-black-2" :title="item.name">{{ item.name }}</td>
          <td class="color-black-2 ts2" style="text-align: right">{{ formatNum(item.totalCount) }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
  import stringUtil from '@/dss-common/utils/string';

  export default {
    props: {
      data: {
        type: Array,
      },
    },
    data() {
      return {
        isUnique: false,
        descOrder: { 0: true, 1: true, 2: true }, // 默认降序排序
      };
    },
    computed: {
      enabledData() {
        return this.data.filter(obj => {
          return obj.fenabled;
        });
      },
    },
    methods: {
      // 对数组进行升序、降序的排序
      sort(key, index) {
        if (this.data.length > 1) {
          this.iconStyle(index); // 图标处理

          this.descOrder[index] = !this.descOrder[index]; // 变换排序规则

          const result = { ...this.data };

          return result.sort(this.by(key, this.descOrder[index]));
        }
      },
      formatNum(value) {
        return stringUtil.addCommasForNumber(value) || 0;
      },
      by(key, descOrder) {
        return function (a, b) {
          const val1 = a[key];
          const val2 = b[key];

          if (descOrder === true) {
            // 从小到大排序

            return val1 - val2;
          } else {
            // 从大到小排序
            return val2 - val1;
          }
        };
      },
      changeItem(item, index) {
        // item.fenabled = !item.fenabled;
        this.$emit('conditon-data-change', item, index, !item.fenabled);
      },
    },
    watch: {
      data: {
        deep: true,
        handler() {},
      },
    },
  };
</script>
<style lang="less">
  .dmp_table_wrapper .dmp_table thead tr.dmp_table_th,
  .dmp_table_wrapper .dmp_dataInfo_table thead tr.dmp_table_th {
    height: 30px !important;
    line-height: 30px !important;
    box-sizing: border-box;
  }
</style>
