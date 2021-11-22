<template>
  <el-dialog title="编辑信息"
             class="user-editor-dialog"
             v-if="showMemberEditor"
             :visible.sync="showMemberEditor"
             width="520px"
             append-to-body
             :before-close="closeHandler">
    <div class="face-box" v-if="facebind">
      <div class="search">
        关联用户：
        <el-input placeholder="请输入并联用户ID"
                  v-model="keyword"
                  @keyup.enter.native="onFliter"
                  style="width:200px;"
                  size="mini">
          <i class="el-icon-search el-input__icon"
             slot="suffix"
             @click="onFliter"
             style="cursor: pointer">
          </i>
        </el-input>
      </div>
      <div class="head-box">
        <div class="left-box "
             :class="[facebind?'border':'',mainCustomerId === userData.id ? 'selected': '']"
             @click="itemClick(userData.id,searchData.id)">
          <img class="head-img"
               :src="'data:image/jpeg;base64,' + userData.image" />
          <!-- <div class="img-title"
               v-if="!facebind">主图底库图片</div> -->
          <div class="user-info">
            <div class="user-item">
              <div class="user-label">用户ID号：</div>
              <div class="user-text" :title="userData.id">{{userData.id}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">用户名称：</div>
              <div class="user-text" :title="userData.name">{{userData.name}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">手机号码：</div>
              <div class="user-text" :title="userData.phone">{{userData.phone}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">会员卡号：</div>
              <div class="user-text" :title="userData.userNum">{{userData.userNum}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">是否会员：</div>
              <div class="user-text" :title="userData.memberType === 1? '是': '否'">{{userData.memberType === 1? '是': '否'}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">备注信息：</div>
              <div class="user-text" :title="userData.remark">{{userData.remark}}</div>
            </div>
          </div>
          <!-- <div class="bottom-box"
               v-if="facebind">
            <img :src="icon"
                 class="bottom-icon" />
          </div> -->
        </div>
        <div class="right-box border"
             :class="[mainCustomerId === searchData.id ? 'selected': '']"
             @click="itemClick(searchData.id,userData.id)"
             v-if="facebind">
          <img class="head-img"
               :src="'data:image/jpeg;base64,' + searchData.image" />
          <div class="user-info">
            <div class="user-item">
              <div class="user-label">用户ID号：</div>
              <div class="user-text" :title="searchData.id">{{searchData.id}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">用户名称：</div>
              <div class="user-text" :title="searchData.name">{{searchData.name}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">手机号码：</div>
              <div class="user-text" :title="searchData.phone">{{searchData.phone}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">会员卡号：</div>
              <div class="user-text" :title="searchData.userNum">{{searchData.userNum}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">是否会员：</div>
              <div class="user-text" :title="searchData.memberType === 1? '是': '否'">{{searchData.memberType === 1? '是': '否'}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">备注信息：</div>
              <div class="user-text" :title="searchData.remark">{{searchData.remark}}</div>
            </div>
          </div>

          <!-- <div class="bottom-box">
            <img :src="icon"
                 class="bottom-icon" />
          </div> -->
        </div>
        <!-- <div class="tips"
             v-if="facebind">请选定其中一组完成并联</div>
        <div class="tips1"
             v-if="facebind">并联后,未选定用户历史数据依然存在列表,但不可再绑定他人,也不可被绑定</div> -->

        <div class="btn-box"
             v-if="facebind">
          <el-button class="dss-btn-primary"
                     style="background:rgba(56,121,251,1);"
                     type="primary"
                     size="mini"
                     @click="faceBindMain()">确认
          </el-button>
          <el-button class="dss-btn-primary"
                     size="mini"
                     @click="cancel()">取消
          </el-button>
        </div>
      </div>

    </div>

    <el-form class="dss-form member-form"
             :model="memberForm"
             :rules="rules"
             ref="memberForm"
             v-if="!facebind"
             label-position="right"
             label-width="85px">
      <el-form-item class="avatar-item" label="人脸头像：">
        <img class="avatar" :src="'data:image/jpeg;base64,' + userData.image" />
      </el-form-item>
      <el-form-item label="关联用户：" v-if="memberForm.memberType === 0 || memberForm.memberType === 3">
        <el-input
          placeholder="请输入并联用户ID"
          v-model="keyword"
          @keyup.enter.native="onFliter"
          size="mini">
          <i class="el-icon-search el-input__icon"
             slot="suffix"
             @click="onFliter"
             style="cursor: pointer">
          </i>
        </el-input>
      </el-form-item>
      <el-form-item label="用户类型：">
        <el-select v-model="memberForm.memberType" @change="rulesChange" style="width: 100%;" size="mini">
          <el-option
            v-for="item in userTypeOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="姓名："
                    prop="name">
        <el-input v-model="memberForm.name"
                  clearable
                  maxlength="7"
                  size="mini"
                  style="width: 100%;"></el-input>
      </el-form-item>
      <el-form-item label="电话："
                    prop="phone">
        <el-input v-model="memberForm.phone"
                  class="phone"
                  clearable
                  maxlength="11"
                  size="mini"
                  style="width: 100%;"
                  @change="clearPhoneExisted">
          <div slot="append" class="phone-existed" v-if="phoneExisted">
            <i class="el-icon-warning"></i>
              该手机号已被使用
          </div>
        </el-input>
      </el-form-item>
      <el-form-item label="性别："
                    prop="sex">
        <el-radio v-model="memberForm.sex" :label="1">男</el-radio>
        <el-radio v-model="memberForm.sex" :label="0">女</el-radio>
      </el-form-item>
      <el-form-item label="备注："
                    prop="remark">
        <el-input placeholder="添加更多信息"
                  type="textarea"
                  v-model="memberForm.remark"
                  maxlength="140"
                  :autosize="{ minRows: 7, maxRows: 7}"></el-input>
      </el-form-item>

      <el-form-item class="dss-btn-middle">
        <el-button class="dss-btn-primary"
                   type="primary"
                   @click="updateTag('memberForm')"
                   size="mini">确认
        </el-button>
      </el-form-item>
    </el-form>

  </el-dialog>
</template>
<script>
import './editor-dialog.less';
import cameraFlowApi from '@/dss-common/api/camera-flow.js';
import newCameraFlowApi from '../../api/camera-flow.js';
import regexps from '@/dss-common/utils/regexps';
import icon from '../../asserts/images/icon-select.png';
export default {
  name: 'EditorDialog',
  components: {},
  props: {
    //是否弹窗
    showMemberEditor: {
      type: Boolean,
      default: false
    },
    //用户数据
    userData: {
      type: Object,
      default: function() {
        return {};
      }
    },
    //关闭弹窗函数
    closeHandler: {
      type: Function
    }
  },
  watch: {
    userData: {
      deep: true,
      handler() {
        this.getFrom();
        this.getRules();
      }
    }
  },
  data() {
    return {
      icon,
      searchData: {},
      keyword: '',
      mainCustomerId: null,
      subCustomerId: null,
      facebind: false,
      selected: null,
      memberForm: {
        memberType: 0,
        // employeeType: 0,
        name: '',
        userNum: '',
        phone: '',
        sex: '',
        remark: ''
      },
      rules: {
        phone: [{ pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }]
      },
      userTypeOptions: [
        {
          label: '普通用户',
          value: 0
        },
        {
          label: '会员',
          value: 1
        },
        {
          label: '店员',
          value: 2
        },
        {
          label: '黑名单',
          value: 3
        }
      ],
      phoneExisted: false // 手机号占用
    };
  },
  mounted() {
    this.getFrom();
    this.getRules();
  },
  methods: {
    getFrom() {
      this.memberForm.memberType = this.userData.memberType || 0;
      // this.memberForm.employeeType = this.userData.employee ? 1 : 0;
      this.memberForm.name = this.userData.name;
      this.memberForm.userNum = this.userData.userNum;
      this.memberForm.phone = this.userData.phone;
      // this.memberForm.sex = this.userData.sex;
      const sex = ['女性', '男性'].indexOf(this.userData.sex);
      this.memberForm.sex = sex > -1 ? sex : '';
      this.memberForm.remark = this.userData.remark;
      this.memberForm.identifier = this.userData.identifier;
      this.memberForm.unionId = this.userData.unionId;
      this.memberForm.id = this.userData.id;
    },

    onFliter() {
      if (this.keyword === '') {
        return;
      }
      let reg = /^[0-9]\d*$/;
      if (!new RegExp(reg).test(this.keyword)) {
        return this.$message('请输入数字');
      }
      if (this.keyword === this.userData.id) {
        return this.$message('不可以绑定相同的账号');
      }
      cameraFlowApi
        .getQueryCustomer({ customerId: this.keyword })
        .then(rs => {
          if (rs.data) {
            this.searchData = rs.data || {};
            this.facebind = true;
          } else {
            this.$message('找不到该用户');
          }
        })
        .catch(err => {
          console.error(err);
        });
    },

    rulesChange() {
      this.$refs.memberForm.clearValidate();
      this.getRules();
    },

    itemClick(id, subid) {
      this.mainCustomerId = id;
      this.subCustomerId = subid;
    },

    //faceid绑定
    faceBindMain() {
      if (!this.mainCustomerId) {
        return this.$message('请先选择主图');
      }
      this.$confirm('绑定之后不可解绑，确定该操作吗?', '人脸绑定', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
        customClass: 'wkt-warning'
      }).then(() => {
        cameraFlowApi
          .getBindface({ mainCustomerId: this.mainCustomerId, subCustomerId: this.subCustomerId })
          .then(rs => {
            this.facebind = false;
            this.keyword = '';
            this.userData = rs.data;

            this.$message({
              message: '绑定成功',
              type: 'success'
            });
          })
          .catch(err => {
            console.error(err);
            this.facebind = false;
          });
      });
    },

    cancel() {
      this.facebind = false;
    },

    getRules() {
      if (this.memberForm.memberType === 1 || this.memberForm.memberType === 2) {
        this.rules = {
          phone: [
            {
              required: true,
              message: `${this.memberForm.memberType === 1 ? '会员' : '店员'}的手机号码不能为空`,
              trigger: 'blur'
            },
            { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }
          ],
          name: [
            {
              required: true,
              message: `${this.memberForm.memberType === 1 ? '会员' : '店员'}的姓名不能为空`,
              trigger: 'blur'
            }
          ]
        };
      } else {
        this.rules = {
          phone: [{ pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }]
        };
      }
    },

    updateTag(data) {
      this.$refs[data]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }
          // cameraFlowApi
          newCameraFlowApi
            .updateTagFlag({ ...this.memberForm })
            .then(rs => {
              this.closeHandler();
            })
            .catch(err => {
              console.error(err);
              if (err.code === 130003) {
                this.phoneExisted = true;
              }
            });
        })
        .catch(res => {
          return false;
        });
    },
    // 去掉号码已存在提示
    clearPhoneExisted() {
      this.phoneExisted = false;
    }
  }
};
</script>
<style lang="less" scoped>
input[type='number'] {
  -moz-appearance: textfield;
}
input[type='number']::-webkit-inner-spin-button,
input[type='number']::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
</style>
