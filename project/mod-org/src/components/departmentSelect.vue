<template>
  <el-dialog
    title="选择范围"
    :visible.sync="dialogFormVisible"
    v-if="dialogFormVisible"
    :close-on-click-modal="false"
    :destroy-on-close="true"
    width="540px"
  >
    <div class="wrap">
      <div class="left">
        <div class="button">
          <el-input placeholder="请输入关键字搜索" style="width: 170px" v-model="filterText"></el-input>
          <el-button style="border-radius: 0; margin-right: 19px" type="primary" @click="search">搜索</el-button>
        </div>
        <div class="tree-selector">
          <el-scrollbar style="height: 350px" class="scrollbar">
            <el-tree
              :data="data"
              show-checkbox
              :indent="5"
              :filter-node-method="filterNode"
              ref="rootTree"
              node-key="id"
              :disabled="true"
              :check-strictly="true"
              :expand-on-click-node="false"
              @check="check"
              :props="defaultProps"
            >
              <span class="custom-tree-node" slot-scope="{ node }">
                <span>{{ node.label }}</span>
                <!-- <img src="../../../../images/tPot.png" style="width: 20px;height: 20px" alt="" @click="show">-->
              </span>
            </el-tree>
          </el-scrollbar>
        </div>
      </div>
      <div class="right">
        <p class="title">已选择的成员</p>
        <el-scrollbar style="height: 350px" class="scrollbar">
          <ul class="list">
            <li class="item" v-for="item in chooseData" :key="item.id">
              <div class="content">
                <img src="../images/folder.png" alt="" />
                <span>{{ item.label }}</span>
              </div>
              <i class="el-icon-close icon" @click="deleteChoose(item.id)"></i>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" round>确 定</el-button>
      <el-button @click="cancel" round>取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  export default {
    name: 'Setting',
    props: {
      departmentSelect: Function,
      data: Array,
    },
    methods: {
      open() {
        this.dialogFormVisible = true;
      },
      close() {
        this.dialogFormVisible = false;
        this.$refs.rootTree.filter(null);
      },
      confirm() {
        const id = this.chooseId();
        this.$emit('getDeptId', id);
        this.close();
      },
      cancel() {
        this.close();
      },
      check(obj, data) {
        const chooseData = data.checkedNodes;
        if (!this.chooseData.includes(obj)) {
          this.chooseData.push(obj);
        } else {
          this.chooseData.forEach((item, index) => {
            if (item.id === obj.id) {
              this.chooseData.splice(index, 1);
            }
          });
        }
        this.chooseData = [...chooseData];
        this.departmentId.push(obj);
      },
      chooseId() {
        const ids = [];
        this.departmentId.forEach(item => {
          ids.push(item.id);
        });
        return ids;
      },
      deleteChoose(key) {
        this.departmentId = this.deleteDepartmentId(key);
        this.chooseData = this.deleteChooseData(key);
        this.$refs.rootTree.setChecked(key, false);
      },
      // 点击删除对应的部门Id
      deleteDepartmentId(id) {
        const ids = [];
        this.departmentId.forEach(item => {
          if (item.id !== id) {
            ids.push(item);
          }
        });
        return ids;
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      search() {
        this.$refs.rootTree.filter(this.filterText);
      },
      deleteChooseData(id) {
        return this.chooseData.filter(item => item.id !== id);
      },
    },
    watch: {
      filterText: {
        handler(newVal, oldVal) {
          if (newVal === '') {
            this.$refs.rootTree.filter(this.filterText);
          }
        },
      },
    },
    data() {
      return {
        dialogFormVisible: false,
        expandedKeys: [],
        chooseData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        filterText: '',
        departmentId: [],
      };
    },
  };
</script>

<style scoped lang="less">
  /deep/ .el-dialog__header {
    background: #f4f4f4;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    height: 61px;
    padding: 20px 0 0 20px;
  }

  .scrollbar /deep/ .el-scrollbar__wrap {
    overflow-x: hidden;
  }

  .wrap {
    display: flex;

    .left {
      width: 50%;
      border-right: 1px solid #d7dae0;
      position: relative;

      .button {
        display: flex;
        align-items: center;
      }

      .tree-selector {
        font-size: 14px;
        margin-top: 20px;
        position: relative;

        .custom-tree-node {
          flex: 1;
          display: flex;
          align-items: center;

          span {
            display: inline-block;
            width: 100px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          &::before {
            content: '';
            width: 20px;
            height: 20px;
            background: url('../images/folder.png') 0 0 no-repeat;
            background-size: cover;
            display: inline-block;
            margin-right: 7px;
          }

          /deep/ .el-dropdown {
            position: absolute;
            right: 5px;
          }
        }

        /deep/ .el-tree-node__content {
          height: 40px;
          line-height: 40px;
          width: 100%;

          /deep/ .el-checkbox {
            position: absolute;
            right: 22px;
            margin-right: 0;
          }
        }
      }
    }

    .right {
      width: 100%;

      .title {
        color: #999;
        font-size: 12px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        margin: 0 0 0 19px;
      }

      .list {
        .item {
          height: 36px;
          line-height: 36px;
          display: flex;
          align-items: center;
          justify-content: space-between;

          .content {
            display: inline-flex;
            align-items: center;
            margin-left: 19px;

            img {
              width: 20px;
              height: 20px;
              margin-right: 4px;
            }
          }

          .icon {
            cursor: pointer;
          }
        }
      }
    }
  }

  .dialog-footer {
    text-align: center;
  }
</style>
