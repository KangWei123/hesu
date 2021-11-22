<template>
  <div class="permis_tree" v-loading="loading">
    <div v-if="newData && newData.length > 0">
      <el-tree
        ref="tree"
        :data="newData"
        show-checkbox
        node-key="selfId"
        :expand-on-click-node="false"
        :render-content="renderContent"
        :props="defaultProps"
        :check-strictly="true"
        @check="clickDeal"
        default-expand-all
      ></el-tree>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as role from '@/mod-org/src/api/roleApi';

  export default {
    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
    },
    components: {},
    props: {
      edit: {
        type: Boolean,
        default: false,
      },
      isMange: {
        type: Boolean,
        default: false,
      },
      roleId: {
        type: Number,
        default: null,
      },
    },
    data() {
      return {
        loading: false,
        data: [],
        permis: [], // 所有菜单列表
        otherpermis: [], // 所有变量列表
        paramList: [],
        defaultProps: {
          children: 'childMenu',
          label: 'name',
        },
        allId: new Set(),
        selectList: [],
        newData: [],
      };
    },
    mounted() {
      if (this.roleId) {
        this.getSelect();
        this.initData();
      }
    },
    methods: {
      async getSelect() {
        const { data } = await role.hideTypeList();
        this.selectList = data;
      },
      async initData() {
        this.loading = true;
        const params = {
          roleIdList: this.roleId,
          checkBlackList: true,
        };
        const { data } = await role.getRoleMenu(params);
        this.data = this.$plain(data);
        if (this.data) {
          this.permis = this.recursion(this.data, []);
        }
        this.hasParames();
      },
      /**
       * 初始化菜单变量数据
       */
      async hasParames() {
        try {
          let newPerims = [];
          if (this.isMange) {
            this.otherpermis = [];
          } else {
            const params = {
              roleId: this.roleId,
              menuIds: Array.from(this.allId),
            };
            const { data } = await role.paramList(params);
            const selfData = data.map(o => ({ ...o, selfId: `${o.id}_${o.menuId}` }));
            this.paramList = selfData;
            this.otherpermis = selfData.filter(o => o.hideType).map(r => r.selfId);
          }
          await this.recurNew(this.data);
          this.data = this.removeIdDeep(this.data); // 添加操作权限以及变量筛选
          newPerims = this.recursion(this.data, []); // 带有操作权限的勾选
          this.newData = this.data;

          this.$nextTick(() => {
            this.$refs.tree && this.$refs.tree.setCheckedKeys(newPerims.concat(this.otherpermis));
            this.changeTreeClass();
          });
        } finally {
          this.loading = false;
        }
      },
      recurNew(data) {
        const test = [];
        this.paramList.forEach(item => {
          if (test[item.menuId]) {
            test[item.menuId].push(item);
          } else test[item.menuId] = [item];
        });
        data?.forEach(o => {
          test.forEach((p, k) => {
            if (o.selfId === k) {
              o.hasParam = true;
              o.paramList = p;
            }
          });
          if (o.childMenu?.length) return this.recurNew(o.childMenu);
        });
      },
      changeData(data, row) {
        data.hideType = row;
        this.paramList.forEach(item => {
          if (item.selfId === data.selfId) item.hideType = row;
        });
      },
      /**
       * 递归修改属性，并将选中的子节点记录
       */
      recursion(data, permisId) {
        data?.forEach((item, index) => {
          if (item.isParam) {
            item.selfId = `${item.id}_${item.menuId}`;
          } else if (!item.isHideParams && !item.isOperation) {
            item.selfId = item.id;
          }
          this.allId.add(item.selfId);
          if (!item.childMenu || (item.childMenu.length === 0 && item.isHasPermission)) {
            item.disabled = !!this.isMange;
            if (!this.edit) item.disabled = true;
            if (item.status) permisId.push(item.selfId);
          } else {
            item.disabled = !!(!this.edit || this.isMange);
            if (item.status) permisId.push(item.selfId);
            return this.recursion(item.childMenu, permisId);
          }
        });
        return permisId;
      },
      clickDeal(cur, treeStatus) {
        const selected = treeStatus.checkedKeys.indexOf(cur.selfId);
        const cur2 = this.$refs.tree.getNode(cur);
        const child = cur2.parent.childNodes;
        if (cur.isParam || (typeof cur2.key === 'string' && cur2.key.indexOf('bm_') !== -1)) {
          if (selected !== -1) {
            this.selectedParentSecond(cur, true);
            this.uniteOther(cur, true);
          } else {
            this.uniteOther(cur, false);
            const childCheck = child.filter(o => !o.checked);
            if (childCheck.length === child.length) {
              this.selectedParentSecond(cur, false);
            }
          }
        } else {
          if (selected !== -1) {
            this.selectedParent(cur, true);
            this.uniteChildSame(cur, true);
          } else {
            if (cur?.childMenu?.length !== 0) {
              this.uniteChildSame(cur, false);
            }
            const childCheck = child.filter(o => !o.checked);
            if (childCheck.length === child.length) {
              this.selectedParent(cur2, false);
            }
          }
        }
      },
      uniteOther(curobj, status) {
        this.$refs.tree.setChecked(curobj.selfId, status);
        curobj.childMenu?.forEach(o => {
          this.uniteChildSame(o, status);
        });
        this.discriminate(status, curobj);
      },
      /**
       * 统一处理子节点为相同的勾选状态
       */
      uniteChildSame(curobj, status) {
        if (!curobj.isHideParam) {
          this.$refs.tree.setChecked(curobj.selfId, status);
          curobj.childMenu?.forEach(o => {
            this.uniteChildSame(o, status);
          });
        }
        this.discriminate(status, curobj);
      },
      /**
       * 统一处理变量的父节点选择
       */
      selectedParentSecond(curobj, status) {
        const cur = this.$refs.tree.getNode(curobj);
        if (curobj.isParam && cur.parent.key) {
          this.$refs.tree.setChecked(cur.parent, status);
          this.selectedParentSecond(cur.parent, status);
        }
        this.discriminate(status, curobj);
      },
      /**
       * 区分菜单勾选和变量勾选
       */
      discriminate() {
        const allselect = this.$refs.tree.getCheckedNodes();
        this.permis = allselect
          .filter(o => {
            return !o.isOperation && !o.isParam && !o.isHideParam;
          })
          .map(o => o.selfId);
        this.otherpermis = allselect.filter(o => o.isParam).map(o => o.selfId);
      },
      /**
       * 统一处理父节点为选中
       */
      selectedParent(curobj, status) {
        if (!curobj.isHideParam && !curobj.isParam) {
          const cur = this.$refs.tree.getNode(curobj);
          if (cur.parent) {
            const child = cur.parent.childNodes;
            const noSelect = child.filter(o => !o.checked);
            if ((cur.parent.key && status) || (!status && noSelect.length === child.length)) {
              this.$refs.tree.setChecked(cur.parent, status);
              this.selectedParent(cur.parent, status);
            }
          }
        }
        this.discriminate(status, curobj);
      },
      async save() {
        this.loading = true;
        try {
          await this.saveVariable();
          await this.saveMenu();
        } finally {
          this.loading = false;
        }
      },
      /**
       * 绑定菜单
       */
      async saveMenu() {
        const params = {
          id: this.roleId,
          menuIdList: this.permis,
        };
        await role.bindRoleMenu(params);
        // this.$message({
        //   message: '角色权限绑定成功',
        //   type: 'success',
        // });
      },
      /**
       * 绑定变量
       */
      async saveVariable() {
        let includeField = this.paramList
          .filter(o => this.otherpermis.includes(o.selfId))
          .map(o => ({
            ...o,
            appId: this.curApp.id,
            roleId: this.roleId,
            fieldId: o.id,
          }));
        const hideType = includeField.filter(o => o.hideType);
        if (includeField.length && hideType.length !== includeField.length)
          return this.$message.error('请选择变量的隐藏策略');
        if (!this.otherpermis.length) includeField = [{ roleId: this.roleId }];

        await role.addFieldRal(includeField);
        this.$message.success('批量关联字段成功');
        setTimeout(() => {
          this.$router.go(-1);
        }, 300);
      },
      renderContent(h, { node, data }) {
        let className = '';
        if (!data.childMenu && !data.isMenu) {
          className = 'especially';
        }
        if (data.isHideParam || data.isOperation) {
          className = `paramdoc ${className}`;
        }
        if (data.isParam) {
          return (
            <div class={className}>
              <span> {data.name} </span>
              <el-select
                disabled={data.disabled}
                value={data.hideType || ''}
                placeholder="请选择隐藏策略"
                onchange={e => {
                  this.changeData(data, e);
                }}
              >
                {this.selectList.map(item => {
                  return (
                    <el-option label={item.desc} key={item.value} value={item.value}>
                      {item.desc}
                    </el-option>
                  );
                })}
              </el-select>
            </div>
          );
        } else {
          return <div class={className}> {data.name} </div>;
        }
      },
      changeTreeClass() {
        const classDomList = document.getElementsByClassName('especially');
        for (let i = 0; i < classDomList.length; i++) {
          classDomList[i].parentNode.style.cssText = 'float: left';
          classDomList[i].parentNode.className = 'el-tree-node__content option-wrapper';
          classDomList[i].parentNode.parentNode.style.marginLeft = '110px';
        }
      },
      removeIdDeep(data) {
        return data.map(o => {
          const res = o.childMenu?.filter(e => e.isMenu === 0).length || 0;
          const params = [];
          if (res) {
            params.push({
              id: `op_${o.id}`,
              selfId: `op_${o.id}`,
              name: '操作权限：',
              disabled: o.disabled,
              childMenu: o.childMenu,
              isOperation: true,
              status: o.status,
            });
          }
          if (o.hasParam) {
            params.push({
              id: `bm_${o.id}`,
              selfId: `bm_${o.id}`,
              name: '保密字段：',
              disabled: o.disabled,
              childMenu: o.paramList.map(i => ({
                ...i,
                type: '',
                disabled: o.disabled,
                name: i.fieldName,
                isParam: true,
                selfId: `${o.id}_${o.menuId}`,
              })),
              isHideParam: true,
              status: o.paramList.filter(r => r.hideType).length ? 1 : 0,
            });
          }
          if (!o.childMenu?.length && !params.length) return o;
          return {
            ...o,
            childMenu: res || params.length ? params : this.removeIdDeep(o.childMenu),
          };
        });
      },
    },
  };
</script>

<style scoped lang="less">
  .permis_tree {
    height: 600px;
    overflow-x: hidden;

    &::-webkit-scrollbar {
      width: 10px;
      height: 10px;
      background-color: #f5f5f5;
    }

    &::-webkit-scrollbar-thumb {
      border-radius: 100px;
      background-color: #d4deee;
    }

    &::-webkit-scrollbar-track {
      border-radius: 0;
      background-color: #eff4fc;
      border: 0;
    }
  }

  ::v-deep .el-tree-node__content {
    height: 30px;
  }

  ::v-deep .el-select,
  .el-input {
    width: 160px;
    height: 24px;
    line-height: 24px;
    margin-left: 10px;

    .el-input__inner {
      height: 24px;
      color: rgb(113, 115, 120);
    }

    .el-input__icon {
      line-height: 24px;
    }
  }

  ::v-deep .is-disabled {
    .el-input__inner {
      background-color: #edf2fc;
      border-color: #dcdfe6;
    }
  }

  ::v-deep .paramdoc {
    // font-weight: bold;
    color: #a5a6a7;
  }
</style>
