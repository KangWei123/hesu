<template>
  <el-dialog
    title="设置门店上级"
    :visible.sync="dialogFormStoreVisible"
    v-loading="loading"
    :close-on-click-modal="false"
    :before-close="beforeClose"
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
        <ul class="list">
          <li class="item" v-for="item in chooseData" :key="item.id">
            <div class="content">
              <img src="../images/folder.png" alt="" />
              <span>{{ item.label }}</span>
            </div>
            <i class="el-icon-close icon" @click="deleteChoose(item.id)"></i>
          </li>
        </ul>
      </div>
    </div>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="confirm" round>确 定</el-button>
      <el-button @click="cancel" round>取 消</el-button>
    </div>
  </el-dialog>
</template>

<script>
  import * as orApi from '@/mod-org/src/api/organizationFramework';

  export default {
    name: 'Setting',
    props: {
      deptTree: {
        type: Array,
        default: function () {
          return [];
        },
      },
      multipleSelection: {
        type: Array,
        default: function () {
          return [];
        },
      },
      storeId: {
        type: String,
        default: null,
      },
      api: {
        type: Function,
        default: function () {
          return null;
        },
      },
    },
    watch: {
      deptTree: {
        handler(newVal, oldVal) {
          this.data = newVal;
        },
      },
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
        data: [],
        departmentId: '',
        expandedKeys: [],
        chooseData: [],
        defaultProps: {
          children: 'children',
          label: 'label',
        },
        filterText: '',
        loading: false,
        dialogFormStoreVisible: false,
      };
    },

    methods: {
      open() {
        this.dialogFormStoreVisible = true;
        this.data = this.isStore(this.data);
      },
      addDisabled(data, flag) {
        return data.map(item => {
          const menu = item;
          menu.disabled = flag;
          if (item.children) {
            this.addDisabled(item.children, flag);
          }
          return menu;
        });
      },
      // 将部门类型的复选框置灰
      isStore(data) {
        return data.map(item => {
          const menu = item;
          if (item.storeId) {
            menu.disabled = true;
          }
          if (item.children) {
            this.isStore(item.children);
          }
          return menu;
        });
      },
      /* setDepartmentSuperior() {
        this.laoding = true
        let employeeIds = []
        employeeIds = this.multipleSelection.map((item) =>{
           return item.employeeId
        })
        employeeIds = employeeIds.toString();
        orApi
          .setDepartmentSuperior({
            deptId: this.departmentId,
            employeeIds
          })
          .then((res) =>{
           if (res.success){
             this.$message({
               type: 'success',
               message: '设置部门上级成功'
             })
           }else{
             this.$message({
               type: 'error',
               message: '设置部门上级失败'
             })
           }
          })
          .finally(() =>{
            this.laoding = false
            this.setStoreSuperior()
          })
      }, */
      setStoreSuperiorDepartment() {
        this.loading = true;
        orApi
          .setStoreSuperiorDepartment({
            storeId: this.storeId,
            parentId: this.departmentId,
          })
          .then(res => {
            if (res.success) {
              this.$message({
                type: 'success',
                message: '关联成功',
              });
              this.close();
              this.api();
            } else {
              this.$message({
                type: 'error',
                message: '关联失败',
              });
            }
          })
          .finally(() => {
            this.loading = false;
          });
      },
      beforeClose() {
        this.close();
      },
      confirm() {
        this.setStoreSuperiorDepartment();
      },
      cancel() {
        this.close();
      },
      close() {
        this.dialogFormStoreVisible = false;
        this.chooseData = [];
        this.data = this.addDisabled(this.data, false);
        this.$refs.rootTree.filter(null);
      },
      check(obj) {
        if (!this.chooseData.includes(obj)) {
          this.chooseData.push(obj);
        }
        this.departmentId = obj.id;
        this.data = this.addDisabled(this.data, true);
      },
      deleteChoose(key) {
        this.chooseData.splice(0, 1);
        this.$refs.rootTree.setChecked(key, false);
        this.data = this.addDisabled(this.data, false);
      },
      filterNode(value, data) {
        if (!value) return true;
        return data.label.indexOf(value) !== -1;
      },
      search() {
        this.$refs.rootTree.filter(this.filterText);
      },
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
        position: relative;
        margin-top: 20px;

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
        margin: 10px 0 0 19px;
      }

      .list {
        margin-top: 20px;

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
