<template>
  <div class="permis_tree" v-loading="loading">
    <el-tree
      ref="tree"
      :data="data"
      show-checkbox
      node-key="id"
      default-expand-all
      :expand-on-click-node="false"
      :render-content="renderContent"
      @check-change="handleCheckChange"
    ></el-tree>
    <el-button type="primary" v-if="save_state" class="save_permis" @click="save">保存</el-button>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as role from '@/mod-console/src/api/roleApi';

  export default {
    props: {
      edit: {
        type: Boolean,
        default: false,
      },
      isMange: {
        type: Boolean,
        default: false,
      },
      roleIdList: {
        type: Array,
        default: function () {
          return [];
        },
      },
    },
    data() {
      return {
        loading: false,
        data: [],
        checkedKeys: [],
        permis: [],
        defaultCkecked: [],
        save_state: true,
        isChanged: false,
      };
    },
    watch: {
      permis: {
        immediate: true,
        handler(newVal, oldVal) {
          this.$nextTick(() => {
            this.$refs.tree.setCheckedKeys(this.permis);
          });
        },
      },
      roleIdList: {
        handler(newVal, oldVal) {
          if (!newVal) {
            this.data = [];
          }
          if (this.roleIdList) {
            this.getTabTree();
          }
        },
      },
      isMange: {
        immediate: true,
        handler(newVal, oldVal) {
          if (this.isMange || this.edit) {
            this.save_state = false;
          } else {
            this.save_state = true;
          }
        },
      },
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
    },
    mounted() {
      if (this.roleIdList) {
        this.getTabTree();
      }
    },
    methods: {
      // 递归对数据添加children属性,并将选中的子节点记录
      recursion(data, permisId) {
        data.forEach((item, index) => {
          if (!item.childMenu || (item.childMenu.length === 0 && item.isHasPermission)) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].childMenu) {
                data[index].childMenu = true;
              }
            }
            item.children = item.childMenu;
            if (this.edit) {
              item.disabled = true;
            }
            if (this.isMange) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
            if (item.status) {
              permisId.push(item.id);
            }
          } else {
            if (this.edit || this.isMange) {
              item.disabled = true;
            } else {
              item.disabled = false;
            }
            item.children = item.childMenu;
            return this.recursion(item.childMenu, permisId);
          }
        });
        return permisId;
      },
      // 当前id节点是否被选中
      assignment(CheckedKeys, id) {
        let status = false;
        CheckedKeys.map((val, index) => {
          if (val === id) {
            status = true;
          }
        });
        return status;
      },
      getTabTree() {
        this.loading = true;
        const params = {
          roleIdList: this.roleIdList,
          checkBlackList: true,
        };
        role
          .getRoleMenu(params)
          .then(res => {
            this.data = res.data;
            if (this.data) {
              this.permis = this.recursion(this.data, []);
              this.$nextTick(() => {
                this.changeTreeClass();
              });
            }
          })
          .catch(error => {
            console.error('err', error);
          })
          .always(res => {
            this.loading = false;
          });
      },
      handleCheckChange() {
        console.log('handleCheckChange');
      },
      save() {
        const getCheckedKeys = this.$refs.tree.getCheckedKeys();
        const getHalfCheckedKeys = this.$refs.tree.getHalfCheckedKeys();
        this.CheckedKeys = getCheckedKeys.concat(getHalfCheckedKeys);
        this.$emit('pass-checked', this.CheckedKeys);
      },
      renderContent(h, { node, data }) {
        // perms这个是后台数据区分普通tree节点和横向tree节点的标志  各位要根据实际情况做相对应的修改
        let className = '';
        if (!data.childMenu && data.parentId) {
          className = 'especially';
        }
        // 在需要做横向排列的模块做标记
        return <div class={className}> {data.name} </div>;
      }, // 改变tree节点样式
      changeTreeClass() {
        // 找到之前做标记的class
        const classDomList = document.getElementsByClassName('especially');
        // 改变这几个样式
        for (let i = 0; i < classDomList.length; i++) {
          classDomList[i].parentNode.style.cssText = 'float: left';
          classDomList[i].parentNode.className = 'el-tree-node__content option-wrapper';
          classDomList[i].parentNode.parentNode.parentNode.style.marginLeft = '70px';
        }
      },
    },
  };
</script>

<style scoped>
  .custom-tree-node {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    padding-right: 8px;
  }

  .permis_tree {
    position: relative;
  }

  .save_permis {
    position: absolute;
    right: 10px;
    top: -88px;
    cursor: pointer;
  }
</style>
