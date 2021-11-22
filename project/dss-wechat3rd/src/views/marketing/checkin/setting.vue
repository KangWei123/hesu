<template>
  <div class="checkin-add" v-loading="loading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/checkin' }">签到有礼</el-breadcrumb-item>
      <el-breadcrumb-item>签到设置</el-breadcrumb-item>
    </el-breadcrumb>
    <div>
      <el-form
        @submit.native.prevent
        :model="form"
        ref="form"
        :rules="rules"
        class="checkin-add-form"
        label-width="121px"
      >
        <h4>基础奖励</h4>

        <el-form-item label="日签奖励:" prop="dailyAwardPoints">
          <el-input
            class="shot-input"
            placeholder="请输入"
            v-model.number="form.dailyAwardPoints"
            :disabled="disableUpdate"
          ></el-input
          ><span style="margin-left: 5px">积分</span>
        </el-form-item>

        <h4>额外奖励</h4>

        <!-- 签到周期(0:week|1:month)-->

        <el-form-item label=" 签到周期:" prop="signedCycle" class="checkin-signedCycle">
          <el-radio-group v-model="form.signedCycle" :disabled="disableUpdate">
            <el-radio @click.native.prevent="onCycleChange(0)" :label="0">自然周(即周一到周日)</el-radio>
            <el-radio @click.native.prevent="onCycleChange(1)" :label="1" style="display: block"
              >自然月(每个月为一个周期)</el-radio
            >
          </el-radio-group>
          <p class="checkin-tips">
            单个周期内，每个连签奖励只能领取一次；若需更改周期，需先关闭此次活动后再编辑重启活动
          </p>
        </el-form-item>

        <div v-if="form.signedCycle !== -1">
          <el-form-item label="连签额外奖励:" prop="giftsList">
            <el-button @click="onAddContinuousCheckIn" class="giftsList-button">添加连签奖励</el-button>
            <p class="checkin-tips">若更改连签奖励，即时生效，以最新的连签奖励进行发放</p>
          </el-form-item>

          <el-form-item v-if="form.giftsList.length > 0" class="checkin-gift-list">
            <gift-list
              :in-list="this.form.giftsList"
              :canedit="true"
              @giftlistrowEdit="onEditContinuousCheckIn"
              @giftlistrowRemove="ongiftlistrowRemove"
              class="checkin-gift-table"
            ></gift-list>
          </el-form-item>

          <el-form-item label="开启补签:" prop="openComplementSigned">
            <el-switch
              :width="53"
              active-color="#52C41A"
              inactive-color="#B1B5BD"
              :disabled="disableUpdate"
              v-model="form.openComplementSigned"
            ></el-switch>
            <span class="statusTip Show" v-if="form.openComplementSigned">开启</span>
            <span class="statusTip hidden" v-else>关闭</span>

            <!-- <el-switch v-model="form.openComplementSigned"
                       :disabled="disableUpdate"></el-switch> -->
            <p class="checkin-tips">设置连签额外奖励后才可开启补签</p>
          </el-form-item>

          <el-form-item class="is-error-1" label="周期内补签上限:" prop="complementUpperLimit">
            <el-input
              class="shot-input"
              v-model="form.complementUpperLimit"
              :disabled="disableUpdate || !form.openComplementSigned"
            ></el-input
            ><span style="margin-left: 5px">次</span>
          </el-form-item>

          <el-form-item label="补签条件:" prop="complementExpend">
            <el-input
              class="shot-input"
              v-model="form.complementExpend"
              :disabled="disableUpdate || !form.openComplementSigned"
            ></el-input
            ><span style="margin-left: 5px">积分/次</span>
            <p class="checkin-tips">若设置补签使用积分，则用户每次补签将扣减对应积分，若设置为0，则允许无条件补签。</p>
          </el-form-item>
        </div>

        <h4>规则设置</h4>
        <el-form-item label="使用默认规则：" prop="popupReminder">
          <el-checkbox v-model="form.useDefaultRule"></el-checkbox>
          <p class="popupReminderText">自动生成默认规则</p>
        </el-form-item>
        <el-form-item label="签到规则:" prop="signedRule" class="checkin-signedRule">
          <el-input
            type="textarea"
            placeholder="请输入"
            class="long-input"
            v-model="form.signedRule"
            max-length="200"
            :autosize="{ minRows: 10, maxRows: 10 }"
            style="line-height: 1.3"
          ></el-input>
          <!--     该注释不能删除 @important     -->
          <span class="signedRule-length" style="display: none">{{ xDefaultRule }}</span>
          <span class="signedRule-length" :style="ifOverlength(form.signedRule.length, 300) && 'color: red;'"
            >{{ form.signedRule.length }}/300</span
          >
        </el-form-item>

        <el-form-item label="首页签到弹窗:" prop="popupReminder">
          <el-checkbox v-model="form.popupReminder" :disabled="disableUpdate"></el-checkbox>
          <p class="popupReminderText">未签到用户每日第一次访问店铺首页时弹出签到弹窗</p>
        </el-form-item>
      </el-form>
    </div>

    <div class="bottom-button">
      <el-button size="small" @click="onCancel">取消</el-button>
      <el-button
        size="small"
        class="checkin-eidtor-save"
        type="primary"
        @click="onSubmit('form')"
        :disabled="disableSave"
        >保存</el-button
      >
    </div>

    <continuous-checkindialog
      v-if="showLianqiandialog"
      :gift-lists="form.giftsList"
      :signed-cycle="form.signedCycle"
      :lianqian-form="lianqianForm"
      :edit-index="editIndex"
      @close="onlianqianClose"
    />
    <ruleChangeDialog @onOk="onEditSave" :visible.sync="visibleRuleChangeDialog" v-model="rulesChangeTip" />
  </div>
</template>

<script>
  import './setting.less';
  import continuousCheckindialog from '@/dss-wechat3rd/src/views/marketing/checkin/continuousCheckindialog';
  import giftList from './giftlist';
  import checkinApi from '@/dss-wechat3rd/src/api/checkin';
  import regexps from '@/dss-common/utils/regexps.js';
  import ruleChangeDialog from './ruleChangeDialog';

  export default {
    components: { continuousCheckindialog, giftList, ruleChangeDialog },
    name: 'CheckinSetting',
    data() {
      const { positiveInt, intWithZero, money } = regexps;

      return {
        disableUpdate: false,
        isEnable: false, // 是否开启活动
        showGiftlist: false,
        signedDetailId: 0,
        showLianqiandialog: false,
        usedPages: { custom: [], default: [] },
        editIndex: -1,
        oldGiftsListJSON: '',
        visibleRuleChangeDialog: false,
        rulesChangeTip: {
          modifyRuleDesc: '',
          overlayDisplayNotify: true,
        },
        form: {
          // 日签奖励
          dailyAwardPoints: '',
          // 额外奖励
          signedCycle: -1,
          // 开启补签
          // 是否开启补签(0:False|1:True)
          openComplementSigned: false,
          // 补签上限次数
          complementUpperLimit: '',
          // 首页签到弹窗
          popupReminder: false,
          //  签到规则
          signedRule: '',
          //     * 补签条件类型(0:Points)
          complementExpend: '',
          // 奖品列表
          giftsList: [],
          // 使用默认规则
          useDefaultRule: true,
        },

        sourceGiftsList: [],

        lianqianForm: {
          // 优惠券id
          couponId: 0,
          // 优惠券名
          couponName: '',
          // 连续签到
          continueSignedDay: '',
          //  奖励类型
          giftsType: '',
          // 积分
          points: '',
        },
        loading: false,
        oldRule: '',
        // isEdit: false,
        rules: {
          giftsList: [
            {
              required: () => this.form.signedCycle !== -1,
              message: '请添加额外奖励礼品',
              trigger: 'change',
            },
          ],
          signedRule: [
            {
              required: true,
              trigger: 'change',
              message: '规则不能为空',
            },
          ],
          dailyAwardPoints: [
            { required: true, message: '请填写日签奖励积分数', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                console.log('dailyAwardPoints');
                if (!positiveInt.reg.test(value)) {
                  callback(new Error(positiveInt.msg));
                } else {
                  callback();
                }
              },
              trigger: 'change',
            },
          ],
          // 周期补签上线
          complementUpperLimit: [
            {
              validator: (rule, value, callback) => {
                const maxDay = this.form.signedCycle === 0 ? 7 : this.form.signedCycle === 1 ? 31 : 0;
                if (!this.form.openComplementSigned) {
                  return callback();
                }
                if (value === '') {
                  callback(new Error('请输入周期内补签上限次数'));
                } else if (!positiveInt.reg.test(value)) {
                  callback(new Error(positiveInt.msg));
                } else if (value > maxDay) {
                  callback(new Error('补签上限不可以大于签到周期内的最大天数'));
                } else {
                  callback();
                }
              },
              trigger: ['change', 'blur'],
            },
          ],
          // 补签条件
          complementExpend: [
            {
              validator: (rule, value, callback) => {
                console.log('complementExpend');
                if (!this.form.openComplementSigned) {
                  return callback();
                }
                if (value === '') {
                  callback(new Error('请输入补签条件积分次数'));
                } else if (!money.reg.test(value)) {
                  callback(new Error('请输入0~9999999之前的数字'));
                } else {
                  callback();
                }
              },
              trigger: 'change',
            },
          ],
          openComplementSigned: [
            {
              validator: (rule, value, callback) => {
                console.log('openComplementSigned', value);
                if (value && this.form.giftsList.length === 0) {
                  callback(new Error('设置连签额外奖励后才可开启补签'));
                } else {
                  callback();
                }
              },
              trigger: 'change',
            },
          ],
        },
      };
    },
    mounted() {
      const { signedDetailId, isEnable } = this.$route.query;
      this.isEnable = isEnable === 'true';
      if (signedDetailId !== 'null') {
        this.getInformMessage();
        this.loading = true;
        checkinApi
          .query()
          .then(res => {
            if (res.success) {
              const indata = res.data;
              indata.openComplementSigned === 1
                ? (indata.openComplementSigned = true)
                : (indata.openComplementSigned = false);
              indata.popupReminder = !!indata.popupReminder;
              indata.useDefaultRule = !!indata.useDefaultRule;
              this.form = indata;
              this.oldGiftsListJSON = JSON.stringify(indata.giftsList);
              this.oldRule = indata.signedRule;
              this.signedRule = res.data.signedRule;
            }
          })
          .always(_ => {
            this.loading = false;
          });
      }
      this.signedDetailId = parseInt(signedDetailId);
      // 活动处于开启状态，并且活动已创建
      this.disableUpdate = this.isEnable && !!signedDetailId;
    },
    computed: {
      xDefaultRule() {
        const { dailyAwardPoints, signedCycle, openComplementSigned, giftsList } = this.form;
        // this.form.signedRule = this.defaultRule();
        console.log('xDefaultRule', dailyAwardPoints, signedCycle, openComplementSigned, giftsList);
        return this.defaultRule();
      },
      contentChange() {
        console.log(JSON.stringify(this.form.giftsList || []) === this.oldGiftsListJSON);
        console.log(this.form.signedRule === this.oldRule);
        return (
          JSON.stringify(this.form.giftsList || []) === this.oldGiftsListJSON && this.form.signedRule === this.oldRule
        );
      },
      disableSave() {
        return this.isEnable && this.contentChange;
      },
    },
    watch: {
      xDefaultRule(val) {
        if (this.form.useDefaultRule) {
          this.form.signedRule = this.defaultRule();
        }
      },
      'form.useDefaultRule'(val) {
        if (val) {
          this.form.signedRule = this.defaultRule();
        }
      },
    },
    methods: {
      // 签到周期取消选中
      onCycleChange(e) {
        if (!this.disableUpdate) {
          const old = this.form.signedCycle;
          if (this.form.giftsList.length === 0) {
            this.form.signedCycle = old === e ? -1 : e;
            if (!~this.form.signedCycle) this.form.openComplementSigned = false;
            return false;
          }
          this.$confirm('若更改签到周期，已添加的连签奖励将会清空，你还要继续吗？', '确定更改签到周期吗？', {
            confirmButtonText: '继续',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning',
          })
            .then(() => {
              this.form.signedCycle = old === e ? -1 : e;
              if (!~this.form.signedCycle) this.form.openComplementSigned = false;
              this.form.giftsList = [];
            })
            .catch(() => {
              console.log('取消更改');
            });
        }
      },
      // 获取提示给商家的信息，如优惠券过期等
      getInformMessage() {
        checkinApi.getInformMessage().done(res => {
          console.log(res);
          if (res.data) {
            this.$notify({
              title: '提示',
              message: res.data,
              duration: 3000,
            });
          }
        });
      },
      ifOverlength(length, limit) {
        return length > limit;
      },
      onEditContinuousCheckIn(index) {
        this.editIndex = index;
        this.lianqianForm = this.form.giftsList[index];
        this.showLianqiandialog = true;
      },
      onAddContinuousCheckIn() {
        this.editIndex = -1;
        this.lianqianForm = {};
        this.showLianqiandialog = true;
      },
      ongiftlistrowRemove(index) {
        console.log('ongiftlistrowRemove', index);
        this.form.giftsList.splice(index, 1);
      },
      onlianqianClose(e) {
        this.showLianqiandialog = false;
      },
      onDefaultrule() {
        this.form.signedRule = this.defaultRule();
      },

      defaultRule() {
        const { openComplementSigned, giftsList, dailyAwardPoints } = this.form;
        const html = [];
        giftsList.forEach((item, index) => {
          if (item.giftsType === 0) {
            html.push('\t签到周期内连签' + item.continueSignedDay + '天获得额外奖励' + item.points + '积分;\n');
          } else if (item.giftsType === 1) {
            html.push('\t签到周期内连签' + item.continueSignedDay + '天获得额外奖励优惠券: ' + item.couponName + ';\n');
          }
        });
        let i = 1;
        const id = function () {
          return i++;
        };
        return (
          id() +
          '.每日签到领取' +
          dailyAwardPoints +
          '积分；\n' +
          (giftsList.length > 0
            ? id() +
              '.每' +
              (this.form.signedCycle !== -1 && this.form.signedCycle === 0 ? '周' : '月') +
              '为一个签到周期：\n' +
              html.join('') +
              id() +
              '.一旦断签重新计算连签天数；\n'
            : '') +
          (openComplementSigned ? id() + '.补签规则：补签达到连签，可发放当前达标的连签奖励。\n' : '') +
          id() +
          '.奖励积分可在积分明细中查询，优惠券可在个人中心查看。\n'
        );
      },
      // 取消按钮点击处理
      onCancel() {
        this.$router.push('/marketing/checkin');
      },
      // 保存按钮点击处理
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            if (this.signedDetailId) {
              if (this.isEnable) {
                this.visibleRuleChangeDialog = true;
              } else {
                this.onEditSave();
              }
            } else {
              this.onAddSave();
            }
          } else {
            return false;
          }
        });
      },
      verification() {
        const params = { ...this.form };
        params.signedRule === '' ? (params.signedRule = this.defaultRule) : '';
        params.openComplementSigned ? (params.openComplementSigned = 1) : (params.openComplementSigned = 0);
        params.popupReminder ? (params.popupReminder = 1) : (params.popupReminder = 0);
        params.useDefaultRule = +params.useDefaultRule;
        // 补签消耗的积分数
        params.complementExpend = parseInt(params.complementExpend);
        // 补签上限
        params.complementUpperLimit = parseInt(params.complementUpperLimit);
        params.dailyAwardPoints = parseInt(params.dailyAwardPoints);
        // 补签条件
        params.complementCondition = 0;
        //  如果签到周期没有选中则不传数据给后端
        if (params.signedCycle === -1) {
          delete params.signedCycle;
        }
        if (!params.openComplementSigned) {
          params.complementUpperLimit = 0;
          params.complementExpend = 0;
        }
        return params;
      },
      onAddSave() {
        const params = this.verification();
        checkinApi.add(params).then(res => {
          if (res.success) {
            console.log('addcheckinOK');
            this.$message({
              type: 'success',
              message: '创建签到有礼活动成功',
            });
            this.$router.push('/marketing/checkin');
          } else {
            console.log('新增签到有礼失败！');
          }
        });
      },
      onEditSave() {
        const rulesChangeTip = this.isEnable ? this.rulesChangeTip : {};
        const params = {
          ...this.verification(),
          ...{
            overlayDisplayNotify: +rulesChangeTip.overlayDisplayNotify,
            modifyRuleDesc: rulesChangeTip.modifyRuleDesc,
          },
        };
        checkinApi.update({ ...params, id: this.signedDetailId }).then(res => {
          if (res.success) {
            console.log('updateok');
            this.$message({
              type: 'success',
              message: '修改签到有礼活动成功',
            });
            this.$router.push('/marketing/checkin');
          } else {
            console.log('修改签到有礼失败！');
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .checkin-tips {
    color: #999999;
    font-size: 12px;
  }

  .popupReminderText {
    display: inline;
    // margin-left: -10px;
    // padding-left: 15px;
  }
</style>
