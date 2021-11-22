<template>
  <form-page-layout :model="form" :rules="rules" :title-visible="false" :submit-handler="onSubmit">
    <div class="tips-text" style="margin-bottom: 20px">
      缴费优惠仅可配置相同类型优惠，如会员权益、积分抵扣都是同时优惠时长或同时优惠金额
    </div>

    <form-group>
      <template #title>会员权益</template>
      <div class="switch-box">
        是否启用：<el-switch
          class="wkt-switch"
          v-model="form.memberBenefitsSwitch"
          :width="30"
          :active-value="1"
          :inactive-value="0"
          inactive-text="关闭"
          active-text="开启"
          active-color="#3879FB"
          inactive-color="#DCDDE0"
        >
        </el-switch>
        <div class="tips-text">开启后，会员可享受已设置的会员权益</div>
      </div>
      <el-form-item prop="parkingPayMemBenefits">
        <div class="vip-box">
          <div class="vip-item" v-for="(item, index) in form.parkingPayMemBenefits" :key="index">
            <div class="vip-title">{{ item.levelName }}</div>
            <div class="vip-content">
              <el-radio-group v-model="item.discountRadio">
                <el-radio :label="ENUM.DISCOUNTRADIOENUM.MONEY"
                  >现金补贴<el-input style="width: 100px" v-model.trim="item.discountFee"></el-input> 元</el-radio
                >
                <el-radio :label="ENUM.DISCOUNTRADIOENUM.TIME"
                  >免费停车时长<el-input style="width: 100px" v-model.trim="item.discountDur"></el-input> 分钟</el-radio
                >
              </el-radio-group>
            </div>
          </div>
        </div>
      </el-form-item>
    </form-group>
    <form-group>
      <template #title>停车券</template>
      <div class="switch-box">
        是否启用：<el-switch
          class="wkt-switch"
          v-model="form.parkingCouponSwitch"
          :width="30"
          :active-value="1"
          :inactive-value="0"
          inactive-text="关闭"
          active-text="开启"
          active-color="#3879FB"
          inactive-color="#DCDDE0"
        >
        </el-switch>
        <div class="tips-text">开启后，会员可享受停车券优惠</div>
      </div>
      <div class="park-coupon">
        <el-form-item prop="parkingCouponLimitNum">
          <el-radio-group v-model="isLimitNum">
            <el-radio :label="0">不限使用</el-radio>
            <el-radio :label="1"
              >每日最多使用<el-input
                style="width: 100px"
                :disabled="!isLimitNum"
                v-model.trim="form.parkingCouponLimitNum"
              ></el-input>
              张停车券</el-radio
            >
          </el-radio-group>
        </el-form-item>
      </div>
    </form-group>

    <form-group>
      <template #title>积分抵扣 <span class="add-rule" @click="addRules">新增规则</span></template>

      <div class="park-list">
        <el-table :data="form.parkingBonusDeductions" stripe class="wkt-table" ref="memberTable">
          <el-table-column label="规则时段" prop="timeRuleRadio">
            <template slot-scope="scope">
              <div v-if="scope.row.timeRuleRadio === 1">全部时段</div>
              <div v-if="scope.row.timeRuleRadio === 2">周末</div>
              <div v-if="scope.row.timeRuleRadio === 3">工作日</div>
            </template>
          </el-table-column>
          <el-table-column label="积分抵扣类型" prop="discountRadio">
            <template slot-scope="scope">
              <div v-if="scope.row.discountRadio === ENUM.DISCOUNTRADIOENUM.MONEY">金额</div>
              <div v-if="scope.row.discountRadio === ENUM.DISCOUNTRADIOENUM.TIME">时长</div>
            </template>
          </el-table-column>
          <el-table-column label="积分使用规则" prop="discountRadio">
            <template slot-scope="scope">
              <div v-if="scope.row.discountRadio === ENUM.DISCOUNTRADIOENUM.MONEY">
                {{ scope.row.discountScore }}积分 = {{ scope.row.discountValue | price }}元
              </div>
              <div v-if="scope.row.discountRadio === ENUM.DISCOUNTRADIOENUM.TIME">
                {{ scope.row.discountScore }}积分 = {{ scope.row.discountValue }}分钟
              </div>
            </template>
          </el-table-column>
          <el-table-column label="状态" prop="status">
            <template slot-scope="scope">
              <el-switch
                class="wkt-switch"
                v-model="scope.row.status"
                :width="30"
                :active-value="1"
                :inactive-value="0"
                inactive-text="关闭"
                active-text="开启"
                active-color="#3879FB"
                inactive-color="#DCDDE0"
              >
              </el-switch>
            </template>
          </el-table-column>
          <el-table-column label="操作" prop="phone">
            <template slot-scope="scope">
              <a @click="handleEdit(scope.row, scope.$index)">编辑</a>
              <a @click="handleDelete(scope.$index)">删除</a>
            </template>
          </el-table-column>
        </el-table>
      </div>
    </form-group>

    <form-group>
      <template #title>特殊规则</template>
      <div class="switch-box">
        <span class="label">会员权益和停车券可同时使用：</span>
        <el-switch
          class="wkt-switch"
          v-model="form.couponMemMeanwhile"
          :width="30"
          :active-value="1"
          :inactive-value="0"
          inactive-text="关闭"
          active-text="开启"
          active-color="#3879FB"
          inactive-color="#DCDDE0"
        >
        </el-switch>
        <div class="tips-text remark">关闭之后用户只能在会员权益和停车券之间选择一个</div>
      </div>
      <div class="switch-box">
        <span class="label">仅注册会员缴费：</span>
        <el-switch
          class="wkt-switch"
          v-model="form.mustRegister"
          :width="30"
          :active-value="1"
          :inactive-value="0"
          inactive-text="关闭"
          active-text="开启"
          active-color="#3879FB"
          inactive-color="#DCDDE0"
        >
        </el-switch>
        <div class="tips-text remark">关闭之后非注册用户也可以使用缴费功能</div>
      </div>
    </form-group>

    <template #footer>
      <form-button action="cancel" />
      <form-button />
    </template>
    <AddRule v-model="isShowAdd" v-if="isShowAdd" :is-edit="isEdit" :edit-obj="editObj" @saveSuccess="freshData" />
  </form-page-layout>
</template>

<script>
  import './index.less';
  import parkApi from '@/dss-wechat3rd/src/api/park';
  import AddRule from './add.vue';
  import { FormPageLayout, FormGroup, FormButton } from '@/dss-common/components/form-page';
  import ENUM from '../enum.js';
  import regexps from '@/dss-common/utils/regexps';

  export default {
    name: 'ParkForm',
    components: { AddRule, FormPageLayout, FormGroup, FormButton },
    data() {
      return {
        loading: false,
        form: {
          parkingCouponSwitch: 0,
          memberBenefitsSwitch: 0,
          mustRegister: 0,
          couponMemMeanwhile: 1,
          parkingCouponLimitNum: null,
          parkingPayMemBenefits: [],
          parkingBonusDeductions: [],
        },
        isLimitNum: 0,
        isEdit: false,
        isShowAdd: false,
        editObj: {},
        selectIndex: null,
        rules: {
          parkingCouponLimitNum: [
            {
              pattern: regexps.littleeIntZeroNum.reg,
              message: regexps.littleeIntZeroNum.msg,
              trigger: 'blur',
            },
          ],
          parkingPayMemBenefits: [
            {
              validator: (rule, value, callback) => {
                value.forEach(item => {
                  if (item.discountDur && !regexps.littleeIntZeroNum.reg.test(item.discountDur)) {
                    callback(new Error(regexps.littleeIntZeroNum.msg));
                  }
                  if (item.discountFee && !regexps.littleeIntZeroNum.reg.test(item.discountFee)) {
                    callback(new Error(regexps.littleeIntZeroNum.msg));
                  }
                });
                callback();
              },
              trigger: 'blur',
            },
          ],
        },
        ENUM,
      };
    },

    mounted() {
      if (this.$route.query.id) {
        this.getDetail();
      }
    },

    methods: {
      getDetail() {
        const params = { parkingLotId: Number(this.$route.query.id) };
        this.loading = true;
        parkApi
          .getConfig(params)
          .then(res => {
            this.form = res.data || {};
            if (this.form.parkingCouponLimitNum) {
              this.isLimitNum = 1;
            }
            this.form.parkingPayMemBenefits.forEach(item => {
              // 金额分转元，设置默认值为0
              item.discountFee = item.discountFee ? item.discountFee / 100 : 0;
              item.discountDur = item.discountDur || 0;
              item.discountRadio = item.discountRadio ? item.discountRadio : ENUM.DISCOUNTRADIOENUM.MONEY;
            });
          })
          .catch(err => {
            console.error(err);
          })
          .always(() => {
            this.loading = false;
          });
      },

      async onSubmit() {
        this.loading = true;

        const params = this.$plain({
          ...this.form,
          parkingLotId: Number(this.$route.query.id),
        });

        if (!this.isLimitNum) {
          params.parkingCouponLimitNum = 0;
        }
        // 金额转分
        params.parkingPayMemBenefits.forEach(item => {
          // 不填设置默认值为0
          item.discountFee = item.discountFee ? item.discountFee * 100 : 0;
          item.discountDur = item.discountDur || 0;
        });
        await parkApi.updateConfig(params);
      },

      onDeleteImg() {
        this.form.styleUrl = null;
      },

      addRules() {
        this.isShowAdd = true;
        this.isEdit = false;
      },

      freshData(row) {
        if (this.isEdit) {
          this.$set(this.form.parkingBonusDeductions, this.selectIndex, row);
        } else {
          this.form.parkingBonusDeductions = this.form.parkingBonusDeductions.concat(row);
        }
      },

      handleDelete(index) {
        this.$confirm('确认删除积分抵扣规则吗?', '删除规则', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          closeOnClickModal: false,
        }).then(() => {
          this.form.parkingBonusDeductions.splice(index, 1);
        });
      },

      handleEdit(row, index) {
        this.isShowAdd = true;
        this.selectIndex = index;
        this.editObj = row;
        this.isEdit = true;
      },
    },
  };
</script>
