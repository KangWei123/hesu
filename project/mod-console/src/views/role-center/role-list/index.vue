<template>
  <div class="role" v-loading="loading">
    <div class="content">
      <div class="left">
        <div class="title">
          <div class="title-text">角色管理</div>
          <el-dialog
            :title="`${this.role_label}角色`"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="27%"
            :before-close="handleClose"
            style="padding: 0"
            v-if="add"
          >
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              style="width: 90%"
            >
              <el-form-item label="角色名称" prop="name">
                <el-input v-model.trim="ruleForm.name" maxlength="16"></el-input>
              </el-form-item>
              <el-form-item label="角色级别" prop="level">
                <el-select v-model="ruleForm.level" placeholder="请选择">
                  <el-option v-for="item in roleLevelList" :key="item.level" :label="item.name" :value="item.level">
                  </el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="角色描述" prop="desc">
                <el-input
                  type="textarea"
                  v-model.trim="ruleForm.desc"
                  rows="8"
                  maxlength="120"
                  resize="none"
                  style="width: 99%"
                ></el-input>
              </el-form-item>
            </el-form>
            <div slot="footer">
              <el-button type="primary" @click="dialogVisible = false">取消</el-button>
              <el-button type="primary" @click="save('ruleForm')">确认</el-button>
            </div>
          </el-dialog>
          <el-dialog
            title="删除角色"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="27%"
            :before-close="handleClose"
            style="padding: 0"
            v-if="del"
          >
            <el-form
              :model="delForm"
              :rules="delrules"
              ref="delForm"
              label-width="100px"
              class="demo-ruleForm"
              style="width: 90%"
            >
              <el-form-item style="text-align: left; margin-bottom: 10px" label-width="0"
                >该角色下有{{ staffNum }}名员工，请给员工指定新角色后完成删除</el-form-item
              >
              <el-form-item prop="newId" style="width: 100%; margin-bottom: 10px" label-width="0">
                <el-select
                  style="width: 60%"
                  v-model="delForm.newId"
                  placeholder="请选择角色"
                  :popper-append-to-body="false"
                >
                  <el-option
                    v-for="item in optionUllist"
                    :key="item.name"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>

              <div class="del_button">
                <div slot="footer" class="button_in">
                  <el-button type="text" @click="dialogVisible = false">取消</el-button>
                  <el-button type="primary" @click="del_role_comfire('delForm')">确认</el-button>
                </div>
                <!-- <button class="button cancel" @click="dialogVisible = false">取消</button>
                <button
                  class="button confirm"
                  type="primary"
                  @click="del_role_comfire(ruleForm.id)"
                >确认</button>-->
              </div>
            </el-form>
          </el-dialog>
          <el-dialog title="删除角色" :visible.sync="delShow" width="20%" center>
            <span>此操作将删除该角色，是否确认删除?</span>
            <span slot="footer" class="dialog-footer">
              <el-button @click="delShow = false">取 消</el-button>
              <el-button type="primary" @click="onDel(ruleForm.id)">确 定</el-button>
            </span>
          </el-dialog>
          <div>
            <!-- <i class="title-i icon el-icon-circle-plus-outline" @click="add_role"></i> -->
          </div>
        </div>

        <div class="rolelist">
          <div class="role_title">系统角色</div>
          <ul>
            <li
              v-for="item in mangelist"
              :key="item.id"
              :class="selectedRole && selectedRole.id === item.id ? 'active' : 'role_label'"
              @click="handleClickRoleItem(item)"
            >
              {{ item.name }}
            </li>
          </ul>
          <div class="role_title" v-if="ullist && ullist.length">非系统角色</div>
          <ul>
            <li
              v-for="item in ullist"
              :key="item.id"
              :class="selectedRole && selectedRole.id === item.id ? 'active' : 'role_label'"
              @click="handleClickRoleItem(item)"
              style="display: flex"
            >
              <span style="flex: 1">{{ item.name }}</span>
              <span
                v-for="item1 in item.icon"
                :key="item1.icon"
                style="flex: 0 0 15px; position: relative; margin: 0 5px 0 5px"
              >
                <dl
                  v-if="selectedRole && selectedRole.id === item.id"
                  v-html="item1.icon"
                  :class="item1.iconClass"
                  @click="iconClick(item1.iconClick, item.name, item.desc, item.id)"
                ></dl>
              </span>
            </li>
          </ul>
        </div>
      </div>
      <div class="right">
        <div class="title right-til">
          <div style="padding-left: 10px">权限配置</div>
        </div>
        <div class="tree-til">功能权限</div>
        <div class="permission-tree">
          <TreePermission
            v-if="selectedRole"
            :save_state="save_state"
            :is-mange="isSystemRole"
            :role-id-list="selectedRole && selectedRole.id"
            @passChecked="passChecked"
          ></TreePermission>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import * as roleApi from '@/mod-console/src/api/roleApi';
  import * as staffApi from '@/mod-console/src/api/staffApi';
  import TreePermission from '@/mod-console/src/components/PermissionTree/permission-tree';
  import roleEnum from '@/mod-console/src/constants/roleEnum';
  const icon = [
    {
      icon: '<i class="el-icon-edit"></i>',
      iconClass: 'iconclass',
      iconClick: 'editpermis',
    },
    {
      icon: '<i class="el-icon-delete"></i>',
      iconClass: 'iconclass2',
      iconClick: 'del_role',
    },
  ];
  export default {
    name: 'Index',
    components: {
      TreePermission,
    },
    data() {
      return {
        loading: false,
        ullist: [],
        mangelist: [],
        roleLevelList: [],
        ruleForm: {
          id: '',
          name: '',
          level: '',
          desc: '',
        },
        delForm: {
          newId: null,
        },
        rules: {
          name: [
            { required: true, message: '请输入角色名称', trigger: 'blur' },
            // { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          level: [{ required: true, message: '请选择角色级别', trigger: 'change' }],
        },
        delrules: {
          newId: { required: true, message: '请选择角色', trigger: 'blur' },
        },
        selectedRole: null,
        isClick: false,
        dialogVisible: false,
        add: true,
        del: false,
        delShow: false,
        edit: false,
        name: '',
        save_state: true,
        optionUllist: [],
        allRoleList: [],
        mangeCkecked: true,
        staffNum: 0,
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
      }),
      role_label() {
        return this.edit ? '编辑' : '添加';
      },
      isSystemRole() {
        return this.selectedRole && this.selectedRole.type === roleEnum.roleType.system;
      },
    },
    mounted() {
      this.fetchRoleLevel();
      this.fetchRoleList();
    },

    methods: {
      fetchRoleLevel() {
        roleApi.getRoleLevel().then(res => {
          this.roleLevelList = res.data || [];
        });
      },
      fetchRoleList() {
        staffApi
          .getPositionList()
          .then(res => {
            this.mangelist = [];
            this.ullist = [];
            this.allRoleList = res.data;
            res.data.forEach(item => {
              if (item.type === roleEnum.roleType.system) {
                this.mangelist.push(item);
              } else {
                item.icon = icon;
                this.ullist.push(item);
              }
            });
            if (!this.selectedRole) {
              this.selectedRole = this.mangelist[0];
              this.ruleForm.level = this.selectedRole.level;
            }
          })
          .catch(error => {
            console.error('err', error);
          })
          .always(res => {
            this.loading = false;
          });
      },
      add_role() {
        this.edit = false;
        this.del = false;
        if (!this.add) {
          this.add = !this.add;
        }
        const elForm = this.$refs.ruleForm;
        if (elForm && elForm.resetFields) {
          elForm.resetFields();
        }
        this.dialogVisible = true;
      },
      iconClick(iconClick, name, desc, id) {
        this[iconClick](name, desc, id);
      },
      del_role(name, desc, id) {
        this.ruleForm.id = id;
        this.delForm.newId = null;
        const params = {
          roleId: id,
        };
        roleApi
          .getRoleStaffNum(params)
          .then(res => {
            this.staffNum = res.data ? res.data : 0;
            if (this.staffNum == 0) {
              this.delShow = true;
            } else {
              this.add = false;
              if (!this.del) {
                this.del = !this.del;
              }
              const clearPermis = [];
              this.allRoleList.forEach(item => {
                if (item.name !== name) {
                  clearPermis.push(item);
                }
              });
              // clearPermis.push({ name: '清空该角色下员工权限', id: -1 })
              this.optionUllist = clearPermis;
              this.dialogVisible = true;
            }
          })
          .catch(error => {
            console.log(error);
          })
          .always(() => {
            this.loading = false;
          });
      },
      editpermis(name, desc, id) {
        this.edit = true;
        this.del = false;
        if (!this.add) {
          this.add = !this.add;
        }
        this.$nextTick(() => {
          this.ruleForm.name = name;
          this.ruleForm.desc = desc;
          this.ruleForm.id = id;
        });
        this.dialogVisible = true;
      },
      set_permis(name, id) {
        this.mangeCkecked = false;
        this.name = name;
        this.id = id;
        this.isClick = true;
      },
      save(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            roleApi
              .addOrUpdateRole(this.ruleForm, this.edit)
              .then(res => {
                this.fetchRoleList();
              })
              .catch(error => {
                console.error('err', error);
              })
              .always(res => {
                this.loading = false;
                this.dialogVisible = false;
              });
          } else {
            return false;
          }
        });
      },
      del_role_comfire(delForm) {
        this.$refs[delForm].validate(valid => {
          if (valid) {
            const params = {
              id: this.ruleForm.id,
              newId: this.delForm.newId,
            };
            roleApi
              .delRole(params)
              .then(res => {
                this.selectedRole = null;
                this.ullist.splice(this.ullist.map(item => item.id).indexOf(this.ruleForm.id), 1);
                this.dialogVisible = false;
                this.fetchRoleList();
              })
              .catch(error => {
                console.log(error);
              })
              .always(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      },
      onDel(id) {
        const params = {
          id: id,
        };
        roleApi
          .delRole(params)
          .then(res => {
            this.selectedRole = null;
            this.ullist.splice(this.ullist.map(item => item.id).indexOf(id), 1);
            this.delShow = false;
            this.fetchRoleList();
          })
          .catch(error => {
            console.log(error);
          })
          .always(() => {
            this.loading = false;
          });
      },
      handleClickRoleItem(roleItem) {
        this.selectedRole = roleItem;
        this.ruleForm.level = this.selectedRole.level;
      },

      // 从权限树获取到的权限做绑定
      passChecked(checkedKeys) {
        this.loading = true;
        const params = {
          id: this.selectedRole.id,
          menuIdList: checkedKeys,
        };
        roleApi
          .bindRoleMenu(params)
          .then(res => {
            this.$message({
              message: '角色权限绑定成功',
              type: 'success',
            });
          })
          .catch(error => {})
          .always(() => {
            this.loading = false;
          });
      },
      handleClose(done) {
        this.dialogVisible = false;
      },
    },
  };
</script>

<style lang="less">
  .role {
    padding: 20px;
    box-sizing: border-box;
    background: white;

    /*fixme 这里覆盖系统默认设置，采用主体色*/
    .el-checkbox__inner:hover {
      border-color: @ui-theme-color-orange;
    }

    .el-checkbox__input.is-checked,
    .el-checkbox__input.is-indeterminate {
      .el-checkbox__inner {
        background-color: @ui-theme-color-orange;
        border-color: @ui-theme-color-orange;
      }
    }

    .el-checkbox__input.is-focus {
      .el-checkbox__inner {
        border-color: @ui-theme-color-orange;
      }
    }
    .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner,
    .el-checkbox__input.is-disabled.is-indeterminate .el-checkbox__inner {
      background-color: #f2f6fc;
      border-color: #dcdfe6;
    }

    .content {
      width: 100%;
      display: inline-flex;
      justify-content: flex-start;
      // min-height: 550px;
      .left {
        width: 260px;
        margin-right: 5px;
        border: 1px solid #ccc;
        min-height: 400px;
      }
      .right {
        width: 800px;
        height: auto;
        border: 1px solid #ccc;
      }
    }
    .title {
      display: inline-flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 10px;
      padding: 15px 0px;
      font-size: 12px;
      border-bottom: 1px solid #ccc;
    }
    .icon {
      font-weight: 600;
    }
    .title-text {
      width: 65px;
      padding: 10px;
    }
    .title-i {
      cursor: pointer;
      width: 20px;
      padding: 10px;
      font-size: 17px;
    }
    .tree-til {
      padding: 15px;
    }
    .role_title {
      margin: 15px;
      font-size: 15px;
      font-weight: 700;
    }
    .role_label,
    .active {
      padding-left: 40px;
      margin-bottom: 10px;
      position: relative;
      cursor: pointer;
    }
    .iconclass,
    .iconclass2 {
      position: absolute;
      left: 0px;
      top: 0px;
      cursor: pointer;
      margin: 0;
    }
    .active {
      background-color: rgb(194, 204, 214);
    }
    .iconclass2 {
      left: 0px;
    }

    .card_title {
      width: 100%;
      border-bottom: 1px solid #ccc;
      text-align: center;
      margin-bottom: 10px;
    }
    .del_button {
      position: relative;
      height: 30px;
      margin: 30px 0px 10px;
    }
    .button_in {
      position: absolute;
      right: 15px;
      width: 160px;
    }
    .button {
      position: absolute;
      width: 70px;
      text-align: center;
      border-radius: 5%;
    }
    .confirm {
      right: 100px;
    }
    .cancel {
      right: 10px;
    }
  }
</style>
