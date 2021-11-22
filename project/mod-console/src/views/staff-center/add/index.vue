<template>
  <form-page-layout
    :model="form"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
  >
    <form-group>
      <template #title>编辑员工</template>
      <div class="edit-employee">
        <el-form-item label="选择角色" :prop="isEnterprise ? '' : 'position'">
          <div class="select-box">
            <div>
              <el-select
                v-model="form.position.role"
                @change="changeRole"
                filterable
                :disabled="disabled"
                placeholder="请选择角色"
              >
                <el-option
                  v-for="(item, index) in positionList"
                  :label="item.name"
                  :value="item.id"
                  :key="index"
                ></el-option>
              </el-select>
              <br />
              <a
                href="javascript:;"
                v-if="(env.RETAIL || env.HOME) && form.position.role"
                @click="checkPermission(form.position.role)"
                >查看权限</a
              >
            </div>
            <div v-show="!isEnterprise">
              <div v-if="!operator && !isAreaManagerTag">
                <!--店长和区域管理员-->
                <el-select
                  v-model="form.position.group"
                  :placeholder="positionLabel"
                  filterable
                  v-if="selectUpdate"
                  :class="isMultiple ? '' : 'notMultiple'"
                  :disabled="disabled"
                  :multiple="isMultiple"
                >
                  <el-option
                    v-for="(item, index) in groupList"
                    :label="item.name"
                    :value="item.id"
                    :key="index"
                  ></el-option>
                </el-select>
              </div>
              <div v-if="operator || isAreaManagerTag">
                <!-- 运营可以选择组织节点或者门店 -->
                <el-cascader
                  v-model="form.position.group"
                  v-if="operator"
                  :options="treeData"
                  :props="{ value: 'deptId', label: 'name' }"
                  placeholder="选择组织"
                  change-on-select
                  filterable
                  @change="handleTreeDataChange"
                ></el-cascader>
                <!-- 区域管理员只能选择组织节点 -->
                <el-cascader
                  v-model="form.position.group"
                  v-if="isAreaManagerTag"
                  :options="deptTreeData"
                  :props="{ value: 'deptId', label: 'name' }"
                  placeholder="选择组织"
                  change-on-select
                  filterable
                  @change="handleTreeDataChange"
                ></el-cascader>
              </div>
            </div>
          </div>
        </el-form-item>

        <el-form-item label="账号" prop="phone">
          <input type="text" style="display: none" />
          <el-input
            v-model="form.phone"
            placeholder="请输入11位手机号作为账号"
            @change="getUserInfoByPhone"
            :disabled="isEdit"
            autocomplete="off"
          ></el-input>
          <p style="color: red">{{ employeeMessage }}</p>
          <div class="staffBox" v-show="isBindWxworkUser">
            <p>关联企微成员</p>
            <div v-if="appType && form.phone">
              <div class="staff" v-show="staff.mobile">
                <img :src="staff.avatar" />
                <div class="content">
                  <p>{{ staff.name }}</p>
                  <p>{{ staff.mobile }}</p>
                </div>
              </div>
              <div class="staff" v-show="!staff.mobile && !isManage">
                <div style="color: green; text-indent: 2rem">
                  未查询到该手机号的企微成员，将以该手机号为员工创建企微成员
                </div>
              </div>
              <!-- 企业管理员 -->
              <div v-show="!staff.mobile && isManage">
                <div style="color: #999; text-indent: 2rem">未查询到该手机号的企微成员</div>
                <div><el-checkbox v-model="form.createWxworkUser">以该手机号为员工创建企微成员</el-checkbox></div>
              </div>
            </div>
            <!-- 未授权企微 -->
            <div class="staff" v-if="!appType">
              <div style="color: red">企业未授权企微，请授权企微后，再添加导购角色</div>
            </div>
          </div>
        </el-form-item>
        <el-form-item label="登录PC权限:" v-show="isGuide" prop="phone">
          <el-radio-group v-model="form.isLogin">
            <el-radio :label="1">允许登录</el-radio>
            <el-radio :label="0">不允许登录</el-radio>
          </el-radio-group>
        </el-form-item>

        <div v-show="form.isLogin == 1">
          <el-form-item label="密码" :prop="form.isLogin == 1 ? 'password' : 'noPassword'" v-if="isAdd">
            <!--            &lt;!&ndash; 防止firfox,uc浏览器填充 &ndash;&gt;-->
            <!--            <input type="password"-->
            <!--                   style='display:none' />-->

            <el-input
              v-model="form.password"
              placeholder="请输入密码"
              autocomplete="off"
              onfocus="this.type='password'"
            ></el-input>
          </el-form-item>
          <el-form-item label="密码:" v-else>
            <!-- 防止firfox,uc浏览器填充 -->
            <!--            <input type="password"-->
            <!--                   style='display:none' />-->

            <el-input
              v-model="form.password"
              placeholder="*****"
              autocomplete="off"
              onfocus="this.type='password'"
            ></el-input>
          </el-form-item>

          <el-form-item
            label="确认密码"
            :prop="form.isLogin == 1 ? 'confirmCode' : 'noConfirmCode'"
            v-if="form.password"
          >
            <el-input type="password" v-model="form.confirmCode" placeholder="请再次确认密码"></el-input>
          </el-form-item>
        </div>
        <el-form-item label="姓名" prop="name">
          <el-input type="input" v-model="form.name" placeholder="请输入姓名"></el-input>
        </el-form-item>

        <el-form-item label="性别" prop="sex">
          <el-radio-group v-model="form.sex" :disabled="isEdit">
            <el-radio :label="2">男</el-radio>
            <el-radio :label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item label="备注" prop="desc">
          <el-input
            type="textarea"
            :rows="3"
            v-model="form.desc"
            placeholder="请输入备注"
            :disabled="isEdit"
          ></el-input>
        </el-form-item>

        <el-form-item>
          <form-button :disabled="!appTypeLoaded" :loading="submitting">{{ isAdd ? '添加' : '保存' }}</form-button>
        </el-form-item>
      </div>
    </form-group>
    <div class="edit-employee">
      <div class="tree-container">
        <div class="permission-tree" v-if="roleIdList && roleIdList.length">
          <div class="permis-show" style="padding: 10px; border-bottom: 1px solid #aaa">权限明细 ({{ roleName }})</div>
          <TreePermission :is-mange="isMange" :role-id-list="roleIdList"></TreePermission>
        </div>
      </div>
    </div>
  </form-page-layout>
</template>

<script>
  import TreePermission from '@/mod-console/src/components/PermissionTree/permission-tree';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import regexps from '@/dss-common/utils/regexps';
  import { mapState } from 'vuex';
  import * as staffApi from '@/mod-console/src/api/staffApi';
  import * as dealerApi from '@/mod-console/src/api/dealerApi';

  const identifier = {
    enterprise: 'common_role_enterprise',
    areaManager: 'common_role_area_manager',
    dealerManager: 'common_role_dealer_manager',
    storeKeeper: 'common_role_storeKeeper',
    guide: 'common_role_sales',
    operator: 'common_role_operator',
  };

  export default {
    props: {},

    components: {
      TreePermission,
      FormPageLayout,
      FormGroup,
      FormButton,
    },

    computed: {
      ...mapState({
        curStore: 'curStore',
        curApp: 'curApp',
        storeList: 'storeList',
        roleList: 'roleList',
        env: 'env',
      }),
      storeLabel() {
        return this.env.ESTATE ? '区域' : '门店';
      },
      isEdit() {
        return false;
      },
      // 是否创建企微
      isBindWxworkUser() {
        const list = new Set([
          'common_role_sales',
          'common_role_enterprise',
          'common_role_area_manager',
          'common_role_dealer_manager',
          'common_role_storeKeeper',
          'common_role_operator',
        ]);
        return list.has(this.roleTag);
      },
      // 是否区域管理员
      isAreaManagerTag() {
        return identifier.areaManager == this.roleTag;
      },
      // 是否店长 / 区域管理员
      isStoreKeeper() {
        return identifier.storeKeeper == this.roleTag || identifier.areaManager == this.roleTag;
      },
      // 是否导购
      isGuide() {
        return identifier.guide == this.roleTag;
      },
      // 是否企业管理员
      isEnterprise() {
        return identifier.enterprise == this.roleTag;
      },
      // 是否运营
      operator() {
        return identifier.operator == this.roleTag;
      },
      // 是否管理员
      isManage() {
        const roleList = new Set([
          identifier.dealerManager,
          identifier.enterprise,
          identifier.areaManager,
          identifier.storeKeeper,
          identifier.operator,
        ]);
        return roleList.has(this.roleTag);
      },
      // 支持多选 区管 or 店长
      isMultiple() {
        const role = this.form.position.role;
        const storeKeeper = this.positionList.find(item => item.id === role);

        return !!storeKeeper && [identifier.areaManager, identifier.storeKeeper].includes(storeKeeper.identifier);
      },
      // 经销商
      isDealerManager() {
        const role = this.form.position.role;
        const dealer = this.positionList.find(item => item.id === role);

        return !!dealer && dealer.identifier === identifier.dealerManager;
      },
      positionLabel() {
        return this.form.position.role
          ? this.isDealerManager
            ? '请选择经销商'
            : `请选择${this.storeLabel}`
          : '请选择门店';
      },
      // 是否企业管理员
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.split(',').indexOf(identifier.enterprise) !== -1;
      },
      // 是否区域管理员
      isAreaManager() {
        return !!this.roleList && this.roleList.split(',').indexOf(identifier.areaManager) !== -1;
      },
    },
    data() {
      const validatePass2 = (rule, value, callback) => {
        if (value === '') {
          callback(new Error('请再次确认密码'));
        } else if (value !== this.form.password) {
          callback(new Error('两次输入密码不一致!'));
        } else {
          callback();
        }
      };

      const validatePosition = (rule, value, callback) => {
        if (!value.role) {
          callback(new Error('请选择角色'));
        } else if (!value.group || (Array.isArray(value.group) && !value.group.length)) {
          callback(
            new Error(`请选择${this.isDealerManager ? '经销商' : this.isAreaManagerTag ? '组织节点' : this.storeLabel}`)
          );
        } else {
          callback();
        }
      };

      return {
        // 角色
        roleTag: null,
        // 员工 info
        staff: {},
        // 是否关联企微
        appType: false,
        appTypeLoaded: false,
        // 是否显示员工box
        showStaff: false,
        roleIdList: [],
        roleIdListTwo: [],
        roleName: '',
        save_state: false,
        isMange: true,
        newGroupName: '',
        employeeStoreRoleList: [],
        loading: false,
        submitting: false,
        groupSubmitting: false,

        isAdd: true,
        employeeId: -1,
        nickName: '',
        dealerList: [],
        groupList: [],
        selectUpdate: true,
        rules: {
          name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
          phone: [
            {
              required: true,
              message: '请输入11位手机号作为账号',
              trigger: 'blur',
            },
            { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' },
          ],
          password: [
            {
              required: true,
              message: '请输入密码',
              trigger: 'blur',
            },
          ],
          noPassword: [
            {
              message: '请输入密码',
              trigger: 'blur',
            },
          ],
          confirmCode: [
            {
              required: true,
              validator: validatePass2,
              trigger: 'blur',
            },
          ],
          noConfirmCode: [
            {
              validator: validatePass2,
              trigger: 'blur',
            },
          ],
          position: [
            {
              required: true,
              validator: validatePosition,
              trigger: 'change',
            },
          ],
        },

        // 门店id
        storeId: '',
        form: {
          position: {
            role: null,
            group: null,
            operator: [],
          },
          employeeGroupId: undefined,
          status: 1,
          phone: '',
          name: '',
          desc: '',
          sex: 2,
          userId: undefined,
          password: '',
          isLogin: 1,
          createWxworkUser: false,
        },
        positionList: [],
        disabled: false,
        treeData: [],
        currentOrganization: {},
        employeeMessage: '',
        selectedOptions: [],
        deptTreeData: [],
      };
    },
    async mounted() {
      this.loading = true;
      const isEdit = !!this.$route.query.id;
      await this.getDeptTree();
      await this.getDeptTree_node();
      if (isEdit) this.isAdd = false;
      // 获取角色列表
      staffApi
        .getPositionList()
        .then(rspPosi => {
          this.positionList = rspPosi.data;
          if (isEdit) this.apiList();
          else this.loading = false;
        })
        .catch(() => {
          this.loading = false;
        });

      this.getDealers();
      this.getUserInfoAuth();
    },
    methods: {
      // 获取已选的组织数据
      ifArrVal(arr, target, current = 'deptId') {
        for (let i = 0; i < arr.length; i++) {
          if (arr[i][current] === target) {
            return arr[i];
          }
          if (Array.isArray(arr[i].children)) {
            const result = this.ifArrVal(arr[i].children, target);
            if (result) {
              return result;
            }
          }
        }
      },
      // 查找所有上级/当前item
      findParents(arr, target) {
        let res;
        let parent;

        const dfs = (arr, target, path) => {
          for (let i = 0; i < arr.length; i++) {
            if (res) break;
            if (arr[i].deptId === target) {
              res = arr[i];
              parent = path.concat(target);
              return;
            }
            if (Array.isArray(arr[i].children)) {
              dfs(arr[i].children, target, path.concat(arr[i].deptId));
            }
          }
        };
        dfs(arr, target, []);
        return { res, parent };
      },
      handleTreeDataChange(value) {
        const parentId = value[value.length - 1];
        // 获取当前选中组织树信息
        this.currentOrganization = this.ifArrVal(this.treeData, parentId);
      },
      // 获取企业应用的授权信息 appType = 1
      getUserInfoAuth() {
        const data = {
          appType: 1,
        };
        staffApi
          .getUserInfoAuth(data)
          .then(res => {
            // data 有返回值代表有授权
            this.appType = !!res.data.appType;
          })
          .always(() => {
            this.appTypeLoaded = true;
          });
      },
      // 获取员工信息
      async getUserInfoByPhone() {
        this.staff = {};
        // if (!this.isBindWxworkUser) return false;
        if (!regexps.phone.reg.test(this.form.phone)) return false;
        const data = {
          phone: this.form.phone,
        };
        // 校验手机号是否存在企业
        if (this.isAdd) {
          await staffApi
            .checkEmployeePhone(data)
            .then(res => {
              this.employeeMessage = res.data;
            })
            .finally(() => {
              staffApi.getUserInfoByPhone(data).then(res => {
                this.staff = res.data || {};
              });
            });
        } else {
          staffApi.getUserInfoByPhone(data).then(res => {
            this.staff = res.data || {};
          });
        }
      },

      // 获取经销商列表
      getDealers() {
        dealerApi
          .queryList({
            pageNo: 1,
            pageSize: 999,
          })
          .then(res => {
            const { data, totalCount } = res;
            this.dealerList = (data || []).map(item => {
              return {
                ...item,
                ...{
                  name: item.dealerName,
                },
              };
            });
          });
      },

      changeRole(val, group) {
        const position = val ? this.positionList.find(item => item.id === val) : {};
        this.roleTag = position.identifier;
        this.form.positionId = position.identifier;
        this.form.positionName = position.name;

        const role = this.form.position.role;
        if (this.operator || this.isAreaManagerTag) {
          this.form.position.group = group || [];
        } else {
          this.form.position.group = group || (this.isMultiple ? [] : null);
        }
        this.resetSelect();
        if (!role) {
          this.groupList = [];
        } else if (this.isDealerManager) {
          this.groupList = this.dealerList;
        } else {
          this.groupList = this.storeList.filter(item => item.id);
        }
        // 重置权限明细
        if (role && this.roleIdList.length) {
          this.roleIdList = [role];
          this.roleName = this.positionList.find(item => item.id === role).name;
        }
      },

      resetSelect() {
        this.selectUpdate = false;
        setTimeout(() => {
          this.selectUpdate = true;
        });
      },

      checkPermission(id) {
        this.roleIdList = [id];
        this.roleName = this.positionList.find(item => item.id === id).name;
      },

      formatData(arr) {
        const dfs = arr => {
          for (let i = 0; i < arr.length; i++) {
            arr[i].disabled = false;
            if (arr[i].type != 3) {
              arr[i].disabled = true;
            }
            if (Array.isArray(arr[i].children)) {
              dfs(arr[i].children);
            }
          }
        };
        dfs(arr);
        return arr;
      },

      // 获取组织树
      getDeptTree() {
        const data = {
          queryStore: true,
        };
        staffApi.getOrganizationTree(data).then(res => {
          this.treeData = res.data || [];
        });
      },

      // 获取组织树节点
      getDeptTree_node() {
        const data = {
          queryStore: false,
        };
        staffApi.getOrganizationTree(data).then(res => {
          this.deptTreeData = res.data || [];
        });
      },

      // 查询员工列表
      apiList() {
        this.loading = true;
        staffApi
          .getEmployeeListV3({
            pageNo: this.pageNo,
            pageSize: this.pageSize,
            positionId: this.positionId ? this.positionId : undefined,
            keyword: this.keyword ? this.keyword : undefined,
            status: 1,
            id: this.$route.query.id,
          })
          .then(res => {
            const employee = res.data && res.data[0];

            if (employee) {
              this.employeeId = employee.id;

              for (const key in this.form) {
                if (key == 'sex') {
                  this.form[key] = employee[key] - 0;
                } else if (key !== 'position') {
                  this.form[key] = employee[key];
                }
              }
              this.form.isLogin = employee.canLoginPc === false ? 0 : 1;
              const objStoreIds = {};
              this.storeList.forEach(item => {
                objStoreIds[item.id] = true;
              });

              const employeeStoreRoleList = employee.employeeStoreRoleList;
              if (employeeStoreRoleList) {
                const position = {
                  role: null,
                  group: [],
                };

                for (let index = 0; index < employeeStoreRoleList.length; index++) {
                  const item = employeeStoreRoleList[index];
                  this.roleTag = item.identifier;
                  /* 1.超管只能创建直营门店员工 or 经销商，这里允许编辑经销商员工非角色以外的信息，后续迭代支持超管创建经销商员工
                   *  2.区管编辑其他门店店长、员工，这里暂不允许修改角色
                   */
                  if (item.storeId && !objStoreIds[item.storeId]) {
                    this.storeList.push({
                      id: item.storeId,
                      name: item.storeName,
                    });

                    if (this.isEnterpriseManager || this.isAreaManager) {
                      this.disabled = true;
                    }
                  }
                  // 是否运营/区域管理员
                  if (this.operator || this.isAreaManagerTag) {
                    position.role = item.roleId;
                    if (item.dealerId) {
                      this.currentOrganization.type = 2;
                      this.currentOrganization.dealerId = item.dealerId;
                    } else {
                      this.currentOrganization.storeId = item.storeId;
                    }
                    this.currentOrganization.deptId = item.deptId;
                    // 获取上级
                    const treeData = this.operator ? this.treeData : this.deptTreeData;
                    const { parent } = this.findParents(treeData, item.deptId);
                    position.group = parent;
                  } else {
                    if ([identifier.areaManager, identifier.storeKeeper].includes(item.identifier)) {
                      position.role = item.roleId;
                      position.group.push(item.storeId);
                    } else {
                      if (position.group.length) {
                        break;
                      }
                      // 非区管、店长身份的多门店多角色(旧数据)，将只保留第一级身份
                      position.role = item.roleId;
                      position.group = item.storeId || item.dealerId;
                      break;
                    }
                  }
                }
                this.form.position = position;
                this.changeRole(position.role, position.group);
                this.getUserInfoByPhone();
              }
            }
          })
          .always(() => {
            this.loading = false;
          });
      },
      async handleSubmit() {
        if (this.isGuide && !this.staff.mobile) {
          this.form.createWxworkUser = true;
        }
        if (!this.isBindWxworkUser) {
          this.form.createWxworkUser = false;
        }
        if (this.isAreaManagerTag) {
          if (!this.currentOrganization.deptId) {
            return this.$message.error('请选择组织节点');
          }
          if (this.currentOrganization.deptId == this.treeData[0].deptId) {
            return this.$message.error('区域管理员不能挂靠在根节点下');
          }
        }
        if (this.form.isLogin && this.isAdd) {
          if (!this.form.password) {
            return this.$message.error('请输入密码');
          }
        } else if (this.form.isLogin == 0) {
          this.form.password = '';
        }
        const params = {
          createWxworkUser: this.form.createWxworkUser,
          positionId: this.form.positionId,
          positionName: this.form.positionName,
          status: this.form.status,
          phone: this.form.phone,
          name: this.form.name,
          desc: this.form.desc,
          sex: this.form.sex,
          password: this.form.password,
          confirmCode: this.form.confirmCode,
          employeeStoreRoleList: [],
        };
        const roleId = this.form.position.role;
        let storeIds = this.form.position.group;
        const role = {
          identifier: this.form.positionId,
          roleId,
          roleName: this.positionList.find(item => item.id === roleId).name,
        };
        // 是否企业管理员，是企业管理员不需要加 storeId
        if (!this.isEnterprise) {
          if (this.operator) {
            // 选择的组织是经销商就展示经销商 id，是门店就展示门店 id
            if (this.currentOrganization.type == 2) {
              params.employeeStoreRoleList.push({
                ...role,
                deptId: this.currentOrganization.deptId,
                dealerId: this.currentOrganization.dealerId,
              });
            } else {
              params.employeeStoreRoleList.push({
                ...role,
                deptId: this.currentOrganization.deptId,
                storeId: this.currentOrganization.storeId,
              });
            }
          } else if (this.isDealerManager) {
            params.employeeStoreRoleList.push({
              ...role,
              deptId: this.dealerList.find(item2 => item2.id === storeIds).deptId,
              dealerId: storeIds,
            });
          } else if (this.isAreaManagerTag) {
            params.employeeStoreRoleList.push({
              ...role,
              deptId: this.currentOrganization.deptId,
            });
          } else {
            storeIds = Array.isArray(storeIds) ? storeIds : [storeIds];
            storeIds.forEach(item => {
              const { deptId, name } = this.groupList.find(item2 => item2.id === item);
              params.employeeStoreRoleList.push({
                ...role,
                storeId: item,
                deptId: deptId,
                storeName: name,
              });
            });
          }
        } else {
          params.employeeStoreRoleList.push({
            roleId,
            identifier: this.form.positionId,
            roleName: this.form.positionName,
          });
        }
        if (this.isGuide) {
          params.canLoginPc = this.form.isLogin == 1;
        }
        this.submitting = true;
        if (this.isAdd) {
          this.apiAdd(params);
        } else {
          params.id = this.employeeId;
          this.apiUpdate(params);
        }
      },

      apiAdd(params) {
        staffApi
          .insertEmployeed(params)
          .then(() => {
            this.$message({ message: '添加成功', type: 'success' });
            this.$nextTick(() => {
              this.$emit('back');
              this.$router.push('/companyManage/staff-center/list');
            });
          })
          .always(() => {
            this.submitting = false;
          });
      },
      apiUpdate(params) {
        staffApi
          .changeEmployee(params)
          .then(() => {
            this.$message({ message: '修改成功', type: 'success' });
            this.$nextTick(() => {
              this.$emit('back');
              this.$router.push('/companyManage/staff-center/list');
            });
          })
          .always(() => {
            this.submitting = false;
          });
      },
    },
  };
</script>
<style lang="less" scoped>
  .edit-employee {
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    overflow: auto;
    padding: 20px;

    .tree-container {
      width: 1000px;
    }

    .permission-tree {
      margin-left: 20px;
      border: 1px solid #aaa;
      width: 460px;
      height: 600px;
      overflow-y: auto;
      display: inline-block;
    }

    .edit-employee-form {
      width: 470px;
      display: inline-block;
      vertical-align: top;
    }
    .el-input,
    .el-input__inner {
      max-width: 366px;
    }

    .el-textarea,
    .el-textarea__inner {
      max-width: 366px;
    }

    .group-list {
      .dss-btn-middle {
        width: 78px;
      }

      .group-item {
        margin-bottom: 10px;
      }

      .group-add {
        margin-bottom: 15px;
        padding-bottom: 15px;
        border-bottom: 1px dashed rgba(215, 224, 234, 1);
      }

      .el-input,
      .el-input__inner {
        width: 309px;
        height: 28px;
      }
    }
    .select-box {
      width: 380px;
      display: flex;
      justify-content: space-between;
      a {
        font-size: 12px;
        color: #256eff;
      }
    }
    .staffBox {
      margin: 10px 0;
      position: relative;
      box-sizing: border-box;
      padding: 14px;
      border: 1px dashed #ccc;
      border-radius: 4px;

      .staff {
        display: flex;
        align-items: center;
        justify-content: center;
        padding-left: 20px;
        img {
          flex: 0 0 50px;
          width: 50px;
          height: 50px;
          border-radius: 50%;
        }
        .content {
          padding-left: 14px;
          flex: 1;
          color: #333;
        }
      }
    }
    /deep/.el-select__tags-text {
      display: inline-block;
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    /deep/.el-select .el-tag__close.el-icon-close {
      top: -5px;
    }
  }
</style>
