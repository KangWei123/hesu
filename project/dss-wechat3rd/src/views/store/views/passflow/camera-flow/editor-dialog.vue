<template>
  <el-dialog title="编辑信息"
             class="editor-dialog"
             v-if="showMemberEditor"
             :visible.sync="showMemberEditor"
             width="600px"
             append-to-body
             :before-close="closeHandler">
    <div class="face-box">
      <div class="search">
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
          <div class="img-title"
               v-if="!facebind">主图底库图片</div>
          <div class="user-info"
               v-else>
            <div class="user-item">
              <div class="user-label">用户ID号：</div>
              <div class="user-text">{{userData.id}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">用户名称：</div>
              <div class="user-text">{{userData.name}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">手机号码：</div>
              <div class="user-text">{{userData.phone}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">会员卡号：</div>
              <div class="user-text">{{userData.userNum}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">是否会员：</div>
              <div class="user-text">{{userData.memberType? '是': '否'}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">备注信息：</div>
              <div class="user-text">{{userData.remark}}</div>
            </div>
          </div>
          <div class="bottom-box"
               v-if="facebind">
            <img :src="icon"
                 class="bottom-icon" />
          </div>
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
              <div class="user-text">{{searchData.id}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">用户名称：</div>
              <div class="user-text">{{searchData.name}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">手机号码：</div>
              <div class="user-text">{{searchData.phone}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">会员卡号：</div>
              <div class="user-text">{{searchData.userNum}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">是否会员：</div>
              <div class="user-text">{{searchData.memberType? '是': '否'}}</div>
            </div>
            <div class="user-item">
              <div class="user-label">备注信息：</div>
              <div class="user-text">{{searchData.remark}}</div>
            </div>
          </div>

          <div class="bottom-box">
            <img :src="icon"
                 class="bottom-icon" />
          </div>
        </div>
        <div class="tips"
             v-if="facebind">请选定其中一组完成并联</div>
        <div class="tips1"
             v-if="facebind">并联后,未选定用户历史数据依然存在列表,但不可再绑定他人,也不可被绑定</div>

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
             label-position="left"
             label-width="85px">

      <div class="form-item">
        <el-form-item label="用户名称："
                      prop="name">
          <el-input v-model="memberForm.name"
                    clearable
                    maxlength="7"
                    size="mini"
                    style="width:185px;"></el-input>
        </el-form-item>

        <el-form-item label="手机号码："
                      prop="phone">
          <el-input v-model="memberForm.phone"
                    clearable
                    :disabled="userData.memberType"
                    maxlength="11"
                    size="mini"
                    style="width:185px;"></el-input>
        </el-form-item>
      </div>

      <el-form-item label="会员卡号："
                    prop="userNum">
        <el-input v-model.trim="memberForm.userNum"
                  clearable
                  size="mini"
                  maxlength="20"></el-input>
      </el-form-item>

      <el-form-item label="标记为会员："
                    prop="memberType"
                    class="memberType">
        <el-select v-model="memberForm.memberType"
                   size="mini"
                   @change="rulesChange">
          <el-option label="是"
                     :value="1">
          </el-option>
          <el-option label="否"
                     :value="0">
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="列入白名单不再显示："
                    prop="employee"
                    class="employeeType"
                    label-width="140px">
        <el-select v-model="memberForm.employeeType"
                   size="mini">
          <el-option label="是"
                     :value="1">
          </el-option>
          <el-option label="否"
                     :value="0">
          </el-option>
        </el-select>
        <!-- <div class="waring">（注：列入后无法找回需谨慎使用）</div> -->
      </el-form-item>

      <el-form-item prop="remark"
                    class="remark">
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
import regexps from '@/dss-common/utils/regexps';
import icon from '../../../asserts/images/icon-select.png';
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
        employeeType: 0,
        name: '',
        userNum: '',
        phone: '',
        remark: ''
      },
      rules: {
        phone: [{ pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }]
      }
    };
  },
  mounted() {
    this.getFrom();
    this.getRules();
  },
  methods: {
    getFrom() {
      this.memberForm.memberType = this.userData.memberType || 0;
      this.memberForm.employeeType = this.userData.employee ? 1 : 0;
      this.memberForm.name = this.userData.name;
      this.memberForm.userNum = this.userData.userNum;
      this.memberForm.phone = this.userData.phone;
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
      if (this.memberForm.memberType === 1) {
        this.rules = {
          phone: [
            { required: true, message: '会员的手机号码不能为空', trigger: 'blur' },
            { pattern: regexps.phone.reg, message: regexps.phone.msg, trigger: 'blur' }
          ],
          name: [{ required: true, message: '会员的用户姓名不能为空', trigger: 'blur' }]
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
          cameraFlowApi
            .updateTagFlag({ ...this.memberForm })
            .then(rs => {
              this.closeHandler();
            })
            .catch(err => {
              console.error(err);
            });
        })
        .catch(res => {
          return false;
        });
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

