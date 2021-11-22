<template>
  <el-dialog :visible.sync="show" class="store-dialog" v-loading="isLoading">
    <div class="store-dialog-title">选择门店</div>
    <div style="margin-bottom: 80px;">
      <el-table :data="data" ref="storeTable" class="wkt-table" @selection-change="onSelectionChange">
        <el-table-column type="selection" width="55">
        </el-table-column>
        <el-table-column prop="name" label="门店" width="180">
        </el-table-column>
        <el-table-column prop="address" label="地址">
        </el-table-column>
      </el-table>
    </div>

    <div class="store-dialog-footer">
      <el-button @click="show = false" size="mini">取消</el-button>
      <el-button @click="onSure" size="mini" type="primary">确定</el-button>
    </div>
  </el-dialog>

</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false
    },
    selected: {
      type: Array,
      default: []
    },
    data: {
      type: Array,
      default: []
    },
    isLoading: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      selection: []
    };
  },
  computed: {
    show: {
      get() {
        return this.visible;
      },
      set(val) {
        this.$emit('update:visible', val);
      }
    }
  },
  watch: {
    visible(val) {
      if (val) {
        setTimeout(() => {
          this.selectRows();
        }, 50);
      }
    },
    data() {
      this.selectRows();
    }
  },

  mounted() {
    this.selectRows();
  },
  methods: {
    selectRows() {
      const table = this.$refs.storeTable;
      if (table && table.clearSelection) {
        table.clearSelection();
        if (this.selected.length) {
          this.selected.forEach(row => {
            table.toggleRowSelection(row);
          });
        }
      }
    },
    onSelectionChange(val) {
      this.selection = val;
    },
    onSure() {
      this.show = false;
      this.$emit('change', this.selection);
    }
  }
};
</script>

<style lang="less">
.store-dialog {
  .store-dialog-title {
    padding: 11px 0;
    border-bottom: 2px solid #BAC6D3;
  }

  .el-dialog {
    width: 100%;
    max-width: 770px;
    min-height: 515px;

    .el-dialog__body {
      margin: -20px 25px 30px;
      padding: 0 0 30px;
    }

    .el-dialog__headerbtn  {
      z-index: 11;
    }
  }

  .store-dialog-footer {
    bottom: 0;
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    padding-bottom: 40px;
    box-sizing: border-box;
    text-align: center;

    .el-button {
      width: 106px;
    }
  }

  .wkt-table .el-table__header-wrapper .el-checkbox {
    display: inline-block;
  }
}
</style>
