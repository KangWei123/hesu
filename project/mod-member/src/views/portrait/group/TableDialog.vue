<template>
  <el-dialog :show-close="false" :title="title" :visible.sync="show" class="dmp-dialog chart-data-dialog">
    <div slot="title">
      <span class="modal-title">指标数据详情 - {{ title }}</span>
    </div>
    <div class="portrait_modal_body view_detail_info_modal">
      <div class="dmp_table_wrapper">
        <table class="dmp_table">
          <thead>
            <tr class="dmp_table_th">
              <th>序列</th>
              <th>名称</th>
              <th>覆盖率</th>
            </tr>
          </thead>
          <tbody>
            <tr class="dmp_table_nothing" data-tip="没有查询到数据！" v-if="!list.length"></tr>
            <tr :key="index" v-for="(item, index) in list">
              <td>{{ index + 1 }}</td>
              <td>{{ item.name }}</td>
              <td class="tac">{{ item.rate }} %</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <span class="dialog-footer" slot="footer">
      <el-button @click="show = false" class="btn-cancle">关闭</el-button>
    </span>
  </el-dialog>
</template>

<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false,
      },
      tableData: {
        type: Object,
        default() {
          return {};
        },
      },
    },
    data() {
      return {};
    },
    computed: {
      show: {
        get() {
          return this.visible;
        },
        set(val) {
          this.$emit('update:visible', val);
        },
      },
      title() {
        return (this.tableData && this.tableData.name) || '';
      },
      list() {
        if (this.tableData && this.tableData.data) {
          return this.tableData.data || [];
        }
        return [];
      },
    },
    watch: {
      visible(val) {},
    },
    mounted() {},
    methods: {},
  };
</script>

<style lang="less">
  .chart-data-dialog .el-dialog {
    max-width: 788px !important;
  }
</style>
