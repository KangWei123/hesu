<template>
  <el-dialog class="group-dialog"
             :title="'选择' + label"
             :visible.sync="dialogVisible"
             @open="handleInitGroupData">
    <div class="content-container">
      <el-checkbox class="wkt-checked"
                   :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox>
      <div class="group-container">
        <div class="group"
             v-for="(group, index) in groupData"
             :key="index">
          <div class="item"
               v-for="item in group"
               :key="item.id">
            <el-checkbox v-model="item.selected"
                         @change="handleCheckedChange">{{item.name}}</el-checkbox>
          </div>
        </div>
      </div>
      <!-- <el-checkbox class="wkt-checked"
                   :indeterminate="isIndeterminate"
                   v-model="checkAll"
                   @change="handleCheckAllChange">全选</el-checkbox> -->
    </div>
    <div slot="footer">
      <el-button type="primary"
                 @click="handleSelectGroups">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  name: 'group-select-dialog',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: '仓库'
    },
    allGroup: {
      type: Array,
      default: null
    },
    selectedGroup: {
      type: Array,
      default: null
    }
  },
  data() {
    return {
      dialogVisible: false,
      checkAll: false,
      isIndeterminate: true,
      groupData: []
    };
  },
  watch: {
    value(newVal, oldVal) {
      this.dialogVisible = newVal;
    },
    dialogVisible(newVal, oldVal) {
      this.$emit('input', newVal);
    }
  },

  methods: {
    handleInitGroupData() {
      this.groupData = [];
      if (this.allGroup) {
        const tmpGroup = this.$plain(this.allGroup);
        //初始化被选中的项
        if (this.selectedGroup) {
          tmpGroup.forEach(item => {
            item.selected = false;
            this.selectedGroup.forEach(selected => {
              if (item.id === selected.id) {
                item.selected = true;
              }
            });
          });
        }
        //每7个分成一组展示
        while (tmpGroup.length) {
          this.groupData.push(tmpGroup.splice(0, 7));
        }

        this.resetAllCheckStatus();
      }
    },
    handleCheckAllChange(selectAll) {
      this.groupData.forEach(group => {
        group.forEach(item => {
          item.selected = selectAll;
        });
      });
      this.groupData = this.$plain(this.groupData);
      this.isIndeterminate = false;
    },

    handleCheckedChange() {
      this.resetAllCheckStatus();
    },
    resetAllCheckStatus() {
      let selectedCount = 0;
      this.groupData.forEach(group => {
        group.forEach(item => {
          if (item.selected) {
            selectedCount++;
          }
        });
      });
      //最后一组可能不满7个
      const totalCount = (this.groupData.length - 1) * 7 + this.groupData[this.groupData.length - 1].length;
      this.checkAll = selectedCount === totalCount;
      this.isIndeterminate = selectedCount > 0 && selectedCount < totalCount;
    },
    handleSelectGroups() {
      const finalSelectedGroups = [];
      this.groupData.forEach(group => {
        group.forEach(item => {
          if (item.selected) {
            finalSelectedGroups.push(item);
          }
        });
      });
      this.$emit('select', this.$plain(finalSelectedGroups));
      this.dialogVisible = false;
    }
  }
};
</script>

<style lang="less">
.group-dialog {
  text-align: center;
  padding-top: 140px;
  .el-dialog__header {
    text-align: start;
    padding: 25px 25px 10px;
    .el-dialog__title {
      font-size: 14px;
      font-family: PingFangSC-Semibold;
      font-weight: 600;
      color: rgba(52, 52, 52, 1);
      line-height: 20px;
    }
    .el-dialog__headerbtn {
      top: 27px;
      right: 25px;
    }
  }
  .el-dialog {
    display: inline-block;
    width: auto;
    min-width: 240px;
  }
  .el-dialog__body {
    padding: 0 25px 30px;
  }
  .content-container {
    font-size: 14px;
    text-align: start;
    font-family: PingFangSC-Regular;
    font-weight: 400;
    color: rgba(52, 52, 52, 1);
    line-height: 20px;

    .group-container {
      border-top: 2px solid rgba(235, 235, 235, 1);
      border-bottom: 2px solid rgba(235, 235, 235, 1);
      padding-top: 10px;
      padding-bottom: 10px;
      max-width: 960px;
    }
    .group {
      display: inline-block;
      vertical-align: top;
      margin-right: 40px;
      margin-left: 0px;
      width: 200px;
      padding: 5px 0px;
      .item {
        padding: 2px 0px;
        .el-checkbox:last-of-type {
          display: flex;
          justify-content: flex-start;
        }
      }
      .el-checkbox__label {
          max-width: 200px;
          line-height: 14px;
          overflow: hidden;
          white-space: normal;
          word-break: break-all;
      }
    }

    

    // .group + .group {
    //   margin-left: 40px;
    // }


    .select-all {
      margin-top: 10px;
    }

    .confirm-btn-box {
      margin-top: 20px;
      text-align: center;
    }
  }
}
</style>
