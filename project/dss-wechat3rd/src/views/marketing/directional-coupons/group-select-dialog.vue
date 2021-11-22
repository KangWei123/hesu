<template>
  <el-dialog
    class="group-dialog"
    :title="'选择' + label"
    :visible.sync="dialogVisible"
    :append-to-body="innerDialog"
    @open="handleInitGroupData"
  >
    <div class="content-container">
      <div class="group-container">
        <div class="group" v-for="(group, index) in groupData" :key="index">
          <div class="item" v-for="item in group" :key="item.id">
            <el-checkbox class="wkt-checked" v-model="item.selected" @change="handleCheckedChange"
              >{{ item.name }}
            </el-checkbox>
          </div>
        </div>
      </div>
      <el-checkbox
        class="wkt-checked select-all"
        :indeterminate="isIndeterminate"
        v-model="checkAll"
        @change="handleCheckAllChange"
        >全选
      </el-checkbox>
    </div>
    <div slot="footer" style="text-align: center">
      <el-button class="confirm-btn" size="mini" type="primary" @click="handleSelectGroups">确定</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import AdapterIfr from '@/dss-wechat3rd/src/adapter-iframe/index';

  export default {
    name: 'GroupSelectDialog',
    mixins: [AdapterIfr.AdapterMixins],
    props: {
      value: {
        type: Boolean,
        default: false,
      },
      innerDialog: {
        type: Boolean,
        default: false,
      },
      label: {
        type: String,
        default: '选择投放人群',
      },
      allGroup: {
        type: Array,
        default: null,
      },
      selectedGroup: {
        type: Array,
        default: null,
      },
    },
    data() {
      return {
        dialogVisible: false,
        checkAll: false,
        isIndeterminate: true,
        groupData: [],
      };
    },
    watch: {
      value(newVal, oldVal) {
        this.dialogVisible = newVal;
        this.adapterIfmMask(newVal);
      },
      dialogVisible(newVal, oldVal) {
        this.$emit('input', newVal);
        this.adapterIfmMask(newVal);
      },
    },
    methods: {
      handleInitGroupData() {
        console.warn(this.selectedGroup, '已选择的等级数组');
        this.groupData = [];
        if (this.allGroup) {
          const tmpGroup = this.$plain(this.allGroup);
          // 初始化被选中的项
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
          // 每6个分成一组展示
          while (tmpGroup.length) {
            this.groupData.push(tmpGroup.splice(0, 6));
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
        // 最后一组可能不满6个
        const totalCount = (this.groupData.length - 1) * 6 + this.groupData[this.groupData.length - 1].length;
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
        this.adapterIfmMask(false);
      },
    },
  };
</script>

<style lang="less">
  .wkt-checked {
    span {
      display: inline-block !important;
    }
  }
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
      }

      .group {
        display: inline-block;
        vertical-align: top;
      }

      .item {
      }

      .group + .group {
        margin-left: 40px;
      }

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
