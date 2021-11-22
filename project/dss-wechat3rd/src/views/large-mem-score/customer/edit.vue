<template>
  <form-page-layout
    :model="inputForm"
    :rules="rules"
    label-width="126px"
    :title-visible="false"
    :submit-handler="handleSubmit"
    class="form-container"
    label-suffix=":"
  >
    <form-group>
      <template #title>积分录入</template>
      <div class="filter-box">
        <div class="integralDetail">
          <el-form-item label="手机号" prop="phone">
            <el-input
              placeholder="请输入手机号"
              v-model.trim="inputForm.phone"
              autocomplete="off"
              type="number"
              oninput="if(value.length>11)value=value.slice(0,11)"
              @input="searchMember"
            ></el-input>
          </el-form-item>
          <el-form-item label="消费时间" prop="consumeTime">
            <el-date-picker
              v-model="inputForm.consumeTime"
              :picker-options="pickerOptions"
              type="datetime"
              placeholder="请选择日期"
              value-format="yyyy-MM-dd HH:mm:ss"
            >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="消费金额" prop="consumeAmount">
            <el-input
              v-enter-money
              type="text"
              placeholder="请输入消费金额"
              v-model="inputForm.consumeAmount"
              autocomplete="off"
              :min="0"
              @input="handleAmountLimit"
              @change="computedTheproportion"
            ></el-input>
          </el-form-item>

          <el-form-item label="商户" prop="subStoreId">
            <el-select
              v-model="inputForm.subStoreId"
              placeholder="请输入商户"
              filterable
              @change="computedTheproportion"
            >
              <el-option v-for="item in storeOptions" :key="item.id" :label="item.name" :value="item.id"> </el-option>
            </el-select>
            <div class="proportion" v-if="theproportion">消费积分比例: {{ theproportion }}:1</div>
            <div class="proportion" v-else>暂无商户消费积分比例</div>
          </el-form-item>

          <el-form-item label="本次积分" prop="availableScore">
            <el-input v-model="inputForm.availableScore" disabled />
            <div class="proportion">根据金额，按商户的积分比例自动计算</div>
          </el-form-item>

          <el-form-item label="交易流水号" prop="orderNum">
            <el-input
              type="text"
              placeholder="请输入交易流水号"
              v-model.trim="inputForm.orderNum"
              autocomplete="off"
            ></el-input>
          </el-form-item>
          <el-form-item label="备注" prop="remark">
            <el-input
              type="textarea"
              placeholder="请输入备注"
              v-model="inputForm.remark"
              style="height: 90px"
              autocomplete="off"
            ></el-input>
          </el-form-item>
        </div>
        <div style="margin: 0 20px">
          <el-button type="text" @click="handleShowCreate">+快速新增会员</el-button>
        </div>
        <div class="integralDetail detail-panel">
          <div v-show="!!detail.uniqueAccountId">
            <div class="item">用户名: {{ detail.nickName || '未知' }}</div>
            <div class="item">性别: {{ genderType[detail.gender] || '未知' }}</div>
            <div class="item">会员等级: {{ detail.memberLevelName || '无' }}</div>
            <div class="item">手机号码: {{ detail.phone || '未知' }}</div>
            <div class="item">当前积分: {{ detail.score || 0 }}</div>
            <div class="item">上次消费时间: {{ detail.lastConsumeTime || '无' }}</div>
            <div class="item">上次消费商户: {{ detail.lastSubStoreName || '无' }}</div>
            <div class="item">上次消费金额: {{ (detail.lastAmount || 0) | price }}元</div>
          </div>
        </div>
      </div>
      <create-member-dialog ref="createDialog" />
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
  </form-page-layout>
</template>
<script>
  import Vue from 'vue';
  import debounce from 'lodash/debounce';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import { dateTimeFormat } from '@/business-common/filters/date-format-filters';
  import regexps from '@/dss-common/utils/regexps';
  import api from '../../../api/large-mem-score';
  import CreateMemberDialog from './create-member-dialog.vue';

  Vue.directive('enterMoney', {
    inserted: function (el) {
      el.addEventListener('keypress', function (e) {
        e = e || window.event;
        const charcode = typeof e.charCode === 'number' ? e.charCode : e.keyCode;
        const re = /\d/;
        if (charcode === 46) {
          // el.children[0].value是配合了el-input输入框使用的，使用input输入框时直接用el.value
          // 只能输入一个小数点，超过一个则禁止输入
          if (el.children[0].value.includes('.')) {
            e.preventDefault();
          }
        } else if (!re.test(String.fromCharCode(charcode)) && charcode > 9 && !e.ctrlKey) {
          if (e.preventDefault) {
            e.preventDefault();
          } else {
            e.returnValue = false;
          }
        }
      });
    },
  });

  const genderType = ['未知', '男', '女'];

  export default {
    name: 'Edit',
    components: { FormPageLayout, FormGroup, FormButton, CreateMemberDialog },
    data() {
      return {
        genderType,
        loading: false,
        visible: false,
        pickerOptions: {
          disabledDate: time => {
            return time.getTime() > Date.now();
          },
        },
        theproportion: '',
        storeOptions: [],
        value: '',
        detail: {},
        inputForm: {
          scoreType: 0,
          phone: '',
          consumeTime: dateTimeFormat(new Date(), 'YYYY-MM-DD HH:mm:ss'),
          consumeAmount: '',
          availableScore: 0,
          subStoreId: '',
          uniqueAccountId: null,
          orderNum: '',
          remark: '',
        },
        rules: {
          phone: [
            { required: true, message: '请输入您的手机号', trigger: 'blur' },
            {
              pattern: regexps.phone.reg,
              message: regexps.phone.msg,
              trigger: 'blur',
            },
          ],
          consumeTime: [{ required: true, message: '请选择消费时间', trigger: 'blur' }],
          consumeAmount: [
            { required: true, message: '请输入金额', trigger: 'blur' },
            { pattern: regexps.money.reg, message: '请输入正确的金额', trigger: 'blur' },
          ],
          subStoreId: [{ required: true, message: '请选择商户' }],
          orderNum: [
            { required: true, message: '请输入正确的交易流水号', pattern: regexps.charAndNum.reg, trigger: 'change' },
          ],
        },
      };
    },

    beforeMount() {
      this.getStoreList();
    },

    methods: {
      // 计算商户积分比例及有效积分
      async computedTheproportion() {
        if (!this.inputForm.subStoreId || !this.inputForm.consumeAmount) return;
        const params = {
          subStoreId: this.inputForm.subStoreId,
          consumeAmount: Number(this.inputForm.consumeAmount),
        };
        const { data } = await api.customer.queryCalculation(params);
        this.theproportion = data.consume;
        this.inputForm.availableScore = data.availableScore;
      },

      open() {
        this.$confirm('此次录入金额过大，超过10000元。请再次确认！', '提醒！', {
          confirmButtonText: '确定录入',
          cancelButtonText: '取消',
          center: true,
          closeOnClickModal: false,
        })
          .then(() => {
            this.computedTheproportion();
          })
          .catch(() => {
            this.$message({
              type: 'info',
              message: '已取消录入',
            });
            this.inputForm.consumeAmount = null;
          });
      },

      // 处理金额
      handleAmountLimit: debounce(function () {
        if (this.inputForm.consumeAmount > 10000) {
          this.open();
        } else {
          this.computedTheproportion();
        }
      }, 500),

      handleShowCreate() {
        this.$refs.createDialog.show();
      },

      // 手机号查询
      searchMember: debounce(async function () {
        const phone = this.inputForm.phone;
        if (!phone || !regexps.phone.reg.test(phone)) return;
        this.loading = true;

        try {
          const res = await api.customer.getMemberByPhone({ phone });
          if (!res.data) {
            this.detail = {};
            this.$message.info('您还不是会员哦,请输入会员账号');
          } else {
            const { uniqueAccountId, ...other } = res.data;
            this.detail = { uniqueAccountId, ...other };
          }
        } catch (error) {
        } finally {
          this.loading = false;
        }
      }, 1000),

      handleCancel() {
        this.$refs.inputForm.resetFields();
        this.visible = false;
      },

      async handleSubmit() {
        return await new Promise((res, rej) => {
          if (!this.detail.uniqueAccountId) {
            this.$message.info('您还不是会员哦,请输入会员账号');
            rej();
            return;
          }
          this.inputForm.uniqueAccountId = this.detail.uniqueAccountId;
          api.customer
            .judge(this.inputForm)
            .then(({ data }) => {
              if (data) {
                this.handleAddCustomer().then(res);
              } else {
                this.$confirm('该交易可能存在无感积分重复录入风险，请确认是否录入', '警告', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning',
                  closeOnClickModal: false,
                })
                  .then(() => {
                    this.handleAddCustomer().then(res);
                  })
                  .catch(rej);
              }
            })
            .catch(rej);
        });
      },

      async handleAddCustomer() {
        this.loading = true;
        await api.customer.add(this.inputForm);
        this.loading = false;
      },

      // 获取商户列表
      async getStoreList() {
        const { data } = await api.customer.queryBusinessList({
          pageNo: 1,
          pageSize: 100,
        });
        this.storeOptions = data.filter(i => !!i.active);
      },
    },
  };
</script>
<style lang="less" scoped>
  .filter-box {
    height: 500px;
    display: flex;

    /deep/.el-input,
    /deep/.el-select {
      width: 100%;
    }

    /deep/.el-textarea__inner {
      height: 100%;
    }

    /deep/.el-button--text {
      color: #1890ff;
    }

    .integralDetail {
      width: 400px;

      .item {
        margin: 16px 0;
      }

      &.detail-panel {
        margin: 0 10px;
        background: #f3fbfe;
        color: #717378;
        padding: 42px;
        box-sizing: border-box;
      }
    }

    .el-form-item {
      margin-bottom: 20px !important;
    }
  }

  .proportion {
    font-size: 12px;
    height: 20px;
    line-height: 20px;
    font-weight: 400;
    color: #a1a4ab;
  }
</style>
