<template>
  <el-button v-bind="$props" @click="handleClick" :loading="loading"
    ><slot></slot>
    <el-dialog
      class="dss-dialog"
      :visible.sync="confirmVisible"
      append-to-body
      width="480px"
      destory-on-close
      :title="title"
      :close-on-click-modal="false"
    >
      <div class="export-confirm">
        <el-radio-group v-model="scope">
          <el-radio label="selected">导出选中({{ selected.length }})</el-radio>
          <el-radio label="all">导出全部</el-radio>
        </el-radio-group>
      </div>
      <template #footer>
        <el-button @click="confirmVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleConfirm">确 认</el-button>
      </template>
    </el-dialog>
  </el-button>
</template>

<script>
  import omit from 'lodash/omit';
  import { Button } from 'element-ui';
  import { exporter } from './exporter';
  import { execute } from '@/dss-common/utils/promise';

  /**
   * 通用的导出按钮
   */
  export default {
    name: 'ExportButton',
    props: {
      ...omit(Button.props, ['loading']),
      /**
       * 确认信息
       */
      text: {
        type: String,
        default: '确认一键导出吗?',
      },
      /**
       * 提示选项
       * 详见 ElMessageBoxOptions
       */
      confirmOptions: {
        type: Object,
        default: () => ({}),
      },
      /**
       * 标题
       */
      title: {
        type: String,
        default: '一键导出',
      },
      params: {
        /**
         * axios 请求配置
         * 可以是一个函数，函数将接收一个对象 {scope: 'all'|'selected', selected?: any[]}
         * @type {{
         *  url: string,
         *  method?: string,  // 默认是 POST
         *  data: any,
         *  headers?: object
         *  text?: String // 提示语
         * }}
         */
        type: [Object, Function],
        required: true,
      },
      /**
       * 已选中, 用于区分选择导出还是导出全部
       */
      selected: {
        type: Array,
        default: () => [],
      },
    },
    data() {
      return {
        loading: false,
        confirmVisible: false,
        scope: 'all',
      };
    },
    methods: {
      async handleClick() {
        if (this.loading) {
          return;
        }

        if (this.selected && this.selected.length) {
          // 弹窗确定是一键导出还是导出选中
          this.scope = 'selected';
          this.confirmVisible = true;
        } else {
          this.scope = 'all';
          // 导出全部
          this.handleExport();
        }
      },
      handleConfirm() {
        this.confirmVisible = false;
        this.handleExport();
      },
      async handleExport() {
        if (this.loading) {
          return;
        }

        try {
          this.loading = true;
          const params = await execute(this.params, { scope: this.scope, selected: this.selected });
          try {
            await this.$confirm(params.text || this.text, this.title, this.confirmOptions);
          } catch {
            return;
          }
          await exporter({ ...params, action: this.title });
          this.$emit('clearSelected');
          this.$message.success('已导出');
        } catch (err) {
          this.$message.error(`导出失败: ${err.message}`);
        } finally {
          this.loading = false;
        }
      },
    },
  };
</script>

<style scoped>
  .export-confirm {
    padding: 15px 0;
  }
</style>
