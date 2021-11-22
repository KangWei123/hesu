<template>
  <WkbPageNav
    :page-name="pageName"
    hide-nav
    custom-content
    class="general-setting-content"
    :show-page-name="!!pageName"
    v-loading="loading"
  >
    <el-form class="general-setting-form" label-width="200px" ref="form" :model="form" :rules="rules">
      <!-- 订单设置 -->
      <div class="general-tab">
        <div class="type-title">订单设置：</div>

        <el-form-item label="待付款订单取消时间设置：" prop="orderSettingObj.notPayCancelTime">
          <div class="tab">
            <span>拍下付款订单</span>
            <el-input class="general-setting-input" v-model="form.orderSettingObj.notPayCancelTime"></el-input>
            <span>分钟内未付款，自动取消订单</span>
          </div>
          <div class="tab tip">时间设置为 0 分钟，则表示不允许自动取消订单</div>
        </el-form-item>

        <el-form-item label="自动同意退款申请：" prop="orderSettingObj.refundAutoAgreeTime">
          <div class="tab">
            <span>付款</span>
            <el-input class="general-setting-input" v-model="form.orderSettingObj.refundAutoAgreeTime"></el-input>
            <span>分钟，自动同意退款</span>
          </div>
          <div class="tab tip">时间设置为 0 分钟，则表示不允许自动同意退款</div>
        </el-form-item>

        <el-form-item
          label="处方订单审核设置："
          v-if="this.env.MEDICINE"
          prop="orderSettingObj.prescriptionOrderReview"
        >
          <el-switch
            v-model="form.orderSettingObj.prescriptionOrderReview"
            :active-value="1"
            :inactive-value="0"
            active-text="允许"
            inactive-text="禁止"
            active-color="#13ce66"
            inactive-color="#ff4949"
          ></el-switch>
          <span>开启后，处方订单需门店审核后才能发货</span>
        </el-form-item>
      </div>

      <!-- 退款设置 -->
      <div class="general-tab">
        <div class="type-title">退款设置：</div>

        <!-- 旅游行业因为小程序没有加入购物车功能，暂时屏蔽该功能开关 -->
        <el-form-item
          label="允许整单商品中单商品退款："
          prop="refundSettingObj.partialRefund"
          v-if="env && !env.TOURISM"
        >
          <div class="tab">
            <el-switch
              v-model="form.refundSettingObj.partialRefund"
              :active-value="1"
              :inactive-value="0"
              active-text="允许"
              inactive-text="禁止"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </div>
          <div class="tab tip">如一个订单中包含多种商品，支持对其中部分商品退款</div>
        </el-form-item>

        <el-form-item label="商品支持退款时间设置：" prop="refundSettingObj.refundableTime">
          <div class="tab">
            <span>商品确认收货</span>
            <el-input class="general-setting-input" v-model="form.refundSettingObj.refundableTime"></el-input>
            <span>天后，不支持退款</span>
          </div>
          <div class="tab tip">注：退款时间设置暂时只支持商品订单</div>
        </el-form-item>

        <!-- 只有旅游行业才开放该功能 -->
        <el-form-item label="客房退款时间设置：" prop="refundSettingObj.hotelRefundableTime" v-if="env && env.TOURISM">
          <div class="tab">
            <span>当天入住时间超过</span>
            <el-time-picker
              style="width: 120px"
              placeholder="退款时间"
              format="HH:mm"
              v-model="form.refundSettingObj.hotelRefundableTime"
            ></el-time-picker>
            <span>点后，当天房费不支持退款</span>
          </div>
        </el-form-item>

        <el-form-item label="自提超时设置：" prop="refundSettingObj.notPickUpAutoRefundDay">
          <div class="tab">
            <span>自提订单</span>
            <el-input class="general-setting-input" v-model="form.refundSettingObj.notPickUpAutoRefundDay"></el-input>
            <span>天后未自提，自动退款</span>
          </div>
          <div class="tab tip">注：填写“0”时不限制自提时间</div>
        </el-form-item>
      </div>

      <!-- 充值卡设置 -->
      <div class="general-tab">
        <div class="type-title">充值卡设置：</div>

        <el-form-item label="允许自定义金额充值：" prop="chargeCardSetting.forbidRecharge">
          <div class="tab">
            <el-switch
              v-model="form.chargeCardSetting.forbidRecharge"
              :active-value="0"
              :inactive-value="1"
              active-text="允许"
              inactive-text="禁止"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </div>
        </el-form-item>
      </div>

      <!-- 积分审核设置 -->
      <div class="general-tab" v-if="userInfo.appInfo.supportMangeOperationScore">
        <div class="type-title">积分审核设置：</div>

        <el-form-item label="开启积分审核设置：" prop="auditSetting.operationScoreNeedAudit">
          <div class="tab">
            <el-switch
              v-model="form.auditSetting.operationScoreNeedAudit"
              :active-value="1"
              :inactive-value="0"
              active-text="允许"
              inactive-text="禁止"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch>
          </div>
          <div class="tab tip">注：超级管理员、区管和店长可以对会员积分进行增减操作</div>
        </el-form-item>
      </div>

      <!-- 门店设置 -->
      <div class="general-tab">
        <div class="type-title">门店设置：</div>

        <!-- <el-form-item label="门店展示范围设置：" prop="storeSetting.rangeValue">
          <div class="tab">
            <el-switch
              v-model="form.storeSetting.openRange"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              active-color="#13ce66"
              inactive-color="#ff4949"
            >
            </el-switch>
            <el-input
              class="general-setting-input"
              :disabled="form.storeSetting.openRange == 0"
              v-model="form.storeSetting.rangeValue"
            ></el-input>
            <span>km内的门店</span>
          </div>
        </el-form-item>-->

        <el-form-item label="门店展示范围设置：">
          <div class="range">
            <el-switch
              v-model="form.storeSetting.openRange"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch
            >展示
            <el-input-number
              style="margin: 0 10px"
              :disabled="!form.storeSetting.openRange"
              v-model="form.storeSetting.rangeValue"
              :min="0"
              controls-position="right"
              size="small"
            ></el-input-number
            >km内的门店
          </div>
          <div style="margin-top: 20px">
            <el-switch
              v-model="form.storeSetting.openRegion"
              :active-value="1"
              :inactive-value="0"
              active-text="开启"
              inactive-text="关闭"
              active-color="#13ce66"
              inactive-color="#ff4949"
            ></el-switch
            >展示
            <el-select
              style="width: 130px; margin: 0 10px"
              v-model="form.storeSetting.regionValue"
              :disabled="!form.storeSetting.openRegion"
              placeholder="请选择"
            >
              <el-option label="同省" :value="1" />
              <el-option label="同市" :value="2" />
              <el-option label="同区域" :value="3" /> </el-select
            >内的门店
            <el-popover
              placement="top-start"
              width="400"
              trigger="hover"
              title="温馨提示："
              content="区域范围的门店设置优先级高"
            >
              <i class="icon-tip" slot="reference"></i>
            </el-popover>
          </div>
        </el-form-item>

        <el-form-item>
          <div slot="label" style="margin-top: 7px">
            <span>门店管理设置：</span>
          </div>
          <div class="tab" style="margin-top: 7px">
            <el-checkbox :true-label="1" :false-label="0" v-model="form.storeSetting.canModifyItem">
              支持多门店多价格
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                title="温馨提示："
                content="开关开启时，允许门店自行修改所在门店商品价格，新创建的门店默认继承品牌设定的商品价格，允许编辑；开关关闭后，品牌修改商品价格将同步至所有门店，如品牌未进行修改价格操作，则不会对之前门店的商品价格产品产生影响。"
              >
                <i class="icon-tip" slot="reference"></i>
              </el-popover>
            </el-checkbox>

            <el-checkbox :true-label="1" :false-label="0" v-model="form.storeSetting.canCustomDecorate">
              支持门店自主装修
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                title="温馨提示："
                content="开启后，高级管理员拥有对自己门店的装修权限，实现门店装修差异化管理"
              >
                <i class="icon-tip" slot="reference"></i>
              </el-popover>
            </el-checkbox>

            <el-checkbox :true-label="1" :false-label="0" v-model="form.storeSetting.canCustomItem">
              支持门店自主管理商品
              <el-popover
                placement="top-start"
                width="400"
                trigger="hover"
                title="温馨提示："
                content="开启后，高级管理员拥有对自己门店的商品管理权限，支持创建商品至总部"
              >
                <i class="icon-tip" slot="reference"></i>
              </el-popover>
            </el-checkbox>
          </div>

          <div class="tab" v-if="form.storeSetting.canModifyItem">
            <span>可修改范围：</span>
            <el-checkbox :true-label="0" :false-label="1" v-model="form.storeSetting.forbidModifySalesPrice">
              售价
            </el-checkbox>
            <el-checkbox :true-label="0" :false-label="1" v-model="form.storeSetting.forbidModifyLabelPrice">
              标价
            </el-checkbox>
          </div>
        </el-form-item>
        <el-form-item label="分享店铺设置：">
          <div>
            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="form.storeSetting.useShareUserLocation"
              style="display: block"
            >
              微信用户分享门店
              <span style="margin-left: 10px; color: #999"
                >打开分享链接时，门店将定位到分享者分享时定位的门店，但允许客户切换门店</span
              >
            </el-checkbox>

            <el-checkbox
              :true-label="1"
              :false-label="0"
              v-model="form.storeSetting.forbidChangeStoreForGuideShare"
              style="display: block"
            >
              企微导购分享门店
              <span style="margin-left: 10px; color: #999"
                >勾选后，若客户从导购企微分享链接进入，则限制客户只能在导购归属门店浏览，下单，提货，不可切换门店</span
              >
            </el-checkbox>
          </div>
        </el-form-item>
      </div>

      <el-form-item>
        <el-button @click="updateGeneralSetting('form')">保存</el-button>
      </el-form-item>
    </el-form>
  </WkbPageNav>
</template>
<script>
  import { mapState } from 'vuex';
  import WkbPageNav from '@/business-common/components/wkb-page-nav/index.vue';
  import api from '@/dss-setting/src/api/index.js';
  import store from '@/business-common/store.js';
  import utilsDate from '@/dss-common/utils/date.js';

  export default {
    components: { WkbPageNav },
    data() {
      // 订单设置时间校验规则
      const checkTime = (rule, value, callback) => {
        const positiveInteger = /^([0-9]*)$/; // 大于0的整数
        if (!positiveInteger.test(value) || value > 300) {
          return callback(new Error('时间设置必须是在0到300之间的正整数'));
        }
        callback();
      };
      // 退款日期校验规则
      const checkRefundDay = (rule, value, callback) => {
        const positiveInteger = /^[1-9]+\d*$/; // 正整数
        if (!positiveInteger.test(value) || value > 30) {
          return callback(new Error('时间设置必须是在1到30之间的正整数'));
        }
        callback();
      };
      // 自提超时设置校验规则
      const checkOvertime = (rule, value, callback) => {
        const positiveInteger = /^([0-9]*)$/; // 大于0的整数
        if (!positiveInteger.test(value) || value > 90) {
          return callback(new Error('时间设置必须是在0到90之间的正整数'));
        }
        callback();
      };
      // 门店设置-范围设置
      const checkStoreRange = (rule, value, callback) => {
        const enable = this.form.storeSetting.openRange === 1;
        const positiveInteger = /^([0-9]*)$/; // 大于0的整数
        if (enable && (!positiveInteger.test(value) || value === 0 || value > 10000)) {
          return callback(new Error('门店范围必须必须是在1到10000之间的正整数'));
        }
        callback();
      };
      // 门店设置-区域设置
      /* const checkStoreArea = (rule, value, callback) => {
      callback();
    }; */

      return {
        loading: false,

        form: {
          // 订单设置
          orderSettingObj: {
            notPayCancelTime: 0, // 下单多长时间未付款自动取消
            refundAutoAgreeTime: 0, // 下单多长时间内退款自动同意
            prescriptionOrderReview: 0, // 处方订单审核设置
          },

          // 退款设置
          refundSettingObj: {
            partialRefund: 1, // 是否允许整单商品中单商品退款，0：不允许，1：允许（旅游行业因为小程序没有加入购物车功能，暂时屏蔽该功能开关）
            refundableTime: 7, // 商品确认收货多少天后，不支持退款
            hotelRefundableTime: null, // 客房入住超过多少点后，不支持退款
            notPickUpAutoRefundDay: 0, // 自提超时设置
          },

          // 充值卡设置
          chargeCardSetting: {
            forbidRecharge: 1, // 是否允许自定义金额充值，0：允许，1：不允许
          },

          // 积分审核设置
          auditSetting: {
            operationScoreNeedAudit: 0, // 是否允许自定义金额充值，1：允许，0：不允许
          },

          storeSetting: {
            openRange: 0, // 0：关闭 ，1: 开启
            rangeValue: -1,
            regionValue: 1,
            canModifyItem: 0, // 不同门店不同价格支持
            forbidModifyLabelPrice: 0, // 是否允许改标签价，canModifyItem值为1，此值才有意义  默认0: 允许 1: 禁止
            forbidModifySalesPrice: 0, // 是否允许改售价，canModifyItem值为1，此值才有意义  默认0: 允许 1: 禁止
            canCustomDecorate: 0, // 不同门店不同装扮支持
            useShareUserLocation: 0, // 0 定位附近门店，1 分享者分享时的门店
            forbidChangeStoreForGuideShare: 0, // 1 导购分享禁止切换门店，0 允许切换门店
            // ,
            // openArea: 0, //0：关闭 ，1: 开启
            // areaValue: -1
            canCustomItem: 0, // 是否支持门店自主管理商品，0：不支持，1：支持
            // openArea: 0, // 是否开启门店展示区域设置，0：关闭 ，1: 开启
            // areaValue: -1 // 门店展示区域设置距离
          },
        },
        // 1-省份 2-城市 3-区域
        storeSelectArea: [
          {
            value: -1,
            label: '全部',
          },
          {
            value: 1,
            label: '同省',
          },
          {
            value: 2,
            label: '同城',
          },
          {
            value: 3,
            label: '同区',
          },
        ],

        rules: {
          // 订单设置
          orderSettingObj: {
            notPayCancelTime: [
              { required: true, message: '请输入待付款订单取消时间', trigger: 'blur' },
              {
                validator: checkTime.bind(this),
                trigger: ['blur', 'change'],
              },
            ],
            refundAutoAgreeTime: [
              { required: true, message: '请输入自动同意退款申请时间', trigger: 'blur' },
              {
                validator: checkTime.bind(this),
                trigger: ['blur', 'change'],
              },
            ],
          },

          // 退款设置
          refundSettingObj: {
            refundableTime: [
              { required: true, message: '请输入商品支持退款时间', trigger: 'blur' },
              {
                validator: checkRefundDay.bind(this),
                trigger: ['blur', 'change'],
              },
            ],
            // 客房入住超过多少点后，不支持退款
            hotelRefundableTime: [{ required: true, message: '请选择客房退款时间', trigger: ['blur', 'change'] }],
            // 自提超时设置
            notPickUpAutoRefundDay: [
              { required: true, message: '请输入自提超时时间', trigger: 'blur' },
              {
                validator: checkOvertime.bind(this),
                trigger: ['blur', 'change'],
              },
            ],
          },

          // 门店设置
          storeSetting: {
            rangeValue: [
              {
                validator: checkStoreRange.bind(this),
                trigger: ['blur', 'change'],
              },
            ],
            /* // 自提超时设置
          areaValue: [
            {
              validator: checkStoreArea.bind(this),
              trigger: ['blur', 'change']
            }
          ] */
          },
        },
      };
    },

    computed: {
      ...mapState({
        env: 'env',
        curApp: 'curApp',
        roleList: 'roleList',
        userInfo: 'userInfo',
      }),

      // 当前页面名称
      pageName() {
        let pageName = null;
        switch (this.$route.path) {
          case '/general-setting':
            pageName = '通用设置';
            break;
        }
        return pageName;
      },

      /**
       * 是否企业管理员
       */
      isEnterpriseManager() {
        return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
      },
    },

    mounted() {
      // 格式化客房退款时间(获取默认时间)
      this.form.refundSettingObj.hotelRefundableTime = this.hotelRefundableTimeFormat();

      this.getOrderSetting(); // 获取订单设置、退款设置
      this.getCurAppTag(); // 获取品牌配置项
    },

    methods: {
      /**
       * 格式化客房退款时间
       */
      hotelRefundableTimeFormat(time) {
        time = time || '18:00';

        const date = new Date();
        const year = date.getFullYear(); // 获取完整的年份(4位)
        const month = date.getMonth() + 1; // 获取当前月份(0-11,0代表1月)
        const day = date.getDate(); // 获取当前日(1-31)
        const timeArr = time.split(':');
        const hours = timeArr[0]; // 获取当前小时数(0-23)
        const minutes = timeArr[1]; // 获取当前分钟数(0-59)
        const refundableTime = new Date(year, month, day, hours, minutes);
        return refundableTime;
      },

      /**
       * 获取订单设置、退款设置
       */
      getOrderSetting() {
        this.loading = true;

        const params = {};
        api
          .queryOrderSetting(params)
          .then(res => {
            if (res.data) {
              const { customizedDistanceShop, customizedRegionShop } = res.data;
              // 订单设置
              this.form.orderSettingObj = {
                notPayCancelTime: res.data.notPayCancelTime || 0, // 下单多长时间未付款自动取消
                refundAutoAgreeTime: res.data.refundAutoAgreeTime || 0, // 下单多长时间内退款自动同意
                prescriptionOrderReview: res.data.prescriptionOrderReview || 0, //  开启后，处方订单需门店审核后才能发货
              };
              // 退款设置
              this.form.refundSettingObj = {
                partialRefund: res.data.partialRefund === 0 ? 0 : 1, // 是否允许整单商品中单商品退款，0：不允许，1：允许
                refundableTime: res.data.refundableTime || 7, // 商品确认收货多少天后，不支持退款
                hotelRefundableTime: this.hotelRefundableTimeFormat(res.data.hotelRefundableTime || null), // 客房入住超过多少点后，不支持退款
                notPickUpAutoRefundDay: res.data.notPickUpAutoRefundDay || 0, // 自提超时设置
              };

              /* this.form.storeSetting = {
              openRange: customizedDistanceShop > 0 ? 1 : 0,
              rangeValue: customizedDistanceShop > 0 ? parseInt(customizedDistanceShop) : 0,
              //openArea: customizedRegionShop > 0 ? 1 : 0,
              //areaValue: customizedRegionShop > 0 ? parseInt(customizedRegionShop) : -1
            }; */

              this.form.storeSetting.openRange = customizedDistanceShop > 0 ? 1 : 0;
              this.form.storeSetting.rangeValue = customizedDistanceShop > 0 ? parseInt(customizedDistanceShop) : 0;
              this.form.storeSetting.regionValue = customizedRegionShop > 0 ? customizedRegionShop : 1;
              this.form.storeSetting.openRegion = customizedRegionShop > 0 ? 1 : 0;
              this.form.hotelRefundableTime = this.hotelRefundableTimeFormat(res.data.hotelRefundableTime || null); // 客房入住超过多少点后，不支持退款
            }
          })
          .catch(error => {
            this.$message.error('获取订单设置失败，请重试');
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 获取当前品牌配置项
       */
      getCurAppTag() {
        // 品牌配置项赋值
        if (this.curApp) {
          // this.form.itemSetting.canModifyItem = this.curApp.canModifyStore === 1 ? 1 : 0; // 是否允许门店修改该门店商品价格，0：不允许，1：允许
          this.form.chargeCardSetting.forbidRecharge = this.curApp.forbidRecharge === 0 ? 0 : 1; // 是否允许手动充值，0：允许，1：不允许
          this.form.storeSetting.canModifyItem = this.curApp.canModifyStore === 1 ? 1 : 0;
          this.form.storeSetting.canCustomDecorate = this.curApp.canCustomDecorate === 1 ? 1 : 0;
          this.form.storeSetting.useShareUserLocation = this.curApp.useShareUserLocation;
          this.form.storeSetting.forbidChangeStoreForGuideShare = this.curApp.forbidChangeStoreForGuideShare;
          this.form.storeSetting.canCustomItem = this.curApp.canCustomItem === 1 ? 1 : 0; // 是否支持门店自主管理商品，0：不支持，1：支持
          this.form.auditSetting.operationScoreNeedAudit = this.curApp.operationScoreNeedAudit === 1 ? 1 : 0; // 是否开启积分审核配置，0：不支持，1：支持
          this.form.storeSetting.forbidModifyLabelPrice = this.curApp.forbidModifyLabelPrice === 1 ? 1 : 0; // // 是否允许改标签价，0: 允许 1： 禁止
          this.form.storeSetting.forbidModifySalesPrice = this.curApp.forbidModifySalesPrice === 1 ? 1 : 0; // // 是否允许改售价，0: 允许 1： 禁止
        }
      },

      /**
       * 修改通用设置
       * @param formName 表单对象名称
       */
      updateGeneralSetting(formName) {
        this.$refs[formName].validate(valid => {
          if (!valid) {
            return false;
          }

          this.updateOrderSetting(); // 修改订单设置、退款设置
          this.updateCurAppTag(); // 修改当前品牌配置项
        });
      },

      /**
       * 修改订单设置、退款设置
       */
      updateOrderSetting() {
        const enableStoreDistanceRange = this.form.storeSetting.openRange === 1;
        // const enableStoreAreaRange = this.form.storeSetting.openArea === 1;
        this.loading = true;
        const params = {
          customizedDistanceShop: enableStoreDistanceRange ? this.form.storeSetting.rangeValue : 0, // 门店距离展示设置
          customizedRegionShop: this.form.storeSetting.openRegion ? this.form.storeSetting.regionValue : -1,
          notPayCancelTime: this.form.orderSettingObj.notPayCancelTime, // 下单多长时间未付款自动取消
          refundAutoAgreeTime: this.form.orderSettingObj.refundAutoAgreeTime, // 下单多长时间内退款自动同意
          prescriptionOrderReview: this.form.orderSettingObj.prescriptionOrderReview, // 处方订单审核设置
          partialRefund: this.form.refundSettingObj.partialRefund, // 是否允许整单商品中单商品退款，0：不允许，1：允许
          refundableTime: this.form.refundSettingObj.refundableTime, // 商品确认收货多少天后，不支持退款
          notPickUpAutoRefundDay: this.form.refundSettingObj.notPickUpAutoRefundDay, // 自提超时设置
          hotelRefundableTime: utilsDate.format(this.form.refundSettingObj.hotelRefundableTime, 'HH:mm'), // 客房入住超过多少点后，不支持退款
        };

        api
          .updateOrderSetting(params)
          .then(res => {
            this.$message.success('订单设置修改成功！');
          })
          .catch(() => {
            this.$message.error('订单设置修改失败，请重试');
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 修改当前品牌配置项
       *  @param {String} tag {商品设置、充值卡设置}
       */
      updateCurAppTag() {
        this.loading = true;

        const tag = {
          // canModifyItem: this.form.itemSetting.canModifyItem, // 是否允许门店修改该门店商品价格，0：不允许，1：允许
          forbidRecharge: this.form.chargeCardSetting.forbidRecharge, // 是否允许手动充值，0：允许，1：不允许
          canCustomDecorate: this.form.storeSetting.canCustomDecorate, // 不同门店不同装扮支持，0：允许，1：不允许
          canModifyItem: this.form.storeSetting.canModifyItem, // 开启不同门店不同价格支持，0：不允许，1：允许
          useShareUserLocation: this.form.storeSetting.useShareUserLocation,
          forbidChangeStoreForGuideShare: this.form.storeSetting.forbidChangeStoreForGuideShare,

          canCustomItem: this.form.storeSetting.canCustomItem, // 是否支持门店自主管理商品，0：不支持，1：支持
          operationScoreNeedAudit: this.form.auditSetting.operationScoreNeedAudit, // 是否开启积分审核，0：不支持，1：支持
          forbidModifyLabelPrice: this.form.storeSetting.forbidModifyLabelPrice, // 是否允许改标签价，0：允许，1：禁止
          forbidModifySalesPrice: this.form.storeSetting.forbidModifySalesPrice, // 是否允许改售价，0：允许，1：禁止
        };
        const params = {
          tag: JSON.stringify(tag),
        };

        api
          .updateAppTag(params)
          .then(res => {
            // 更新品牌配置项的全局状态
            const tagStatus = {
              forbidRecharge: tag.forbidRecharge,
              canModifyStore: tag.canModifyItem,
              canCustomDecorate: tag.canCustomDecorate,
              canCustomItem: tag.canCustomItem,
              operationScoreNeedAudit: tag.operationScoreNeedAudit,
              forbidModifyLabelPrice: tag.forbidModifyLabelPrice,
              forbidModifySalesPrice: tag.forbidModifySalesPrice,
            };
            store.commit('setCurAppTag', tagStatus);

            this.$message.success('品牌配置项修改成功！');
          })
          .catch(() => {
            this.$message.error('品牌配置项修改失败，请重试');
          })
          .always(() => {
            this.loading = false;
          });
      },
    },
  };
</script>

<style lang="less">
  .general-setting-content {
    &.wkt-sub-nav-container .sub-nav-content-container .sub-nav-content .content-title {
      border-bottom: 1px solid @border-color;
    }
    .general-setting-form {
      padding: 20px;

      .type-title {
        margin: 20px 0px;
        font-size: 16px;
      }

      .type-title:first-child {
        margin-top: 0px;
      }

      .el-form-item {
        margin-left: 30px;
      }

      .el-form-item:last-child {
        margin-bottom: 0px;
      }

      .tip {
        color: #d3d3d3;
      }

      .pre-label {
        display: inline-block;
        width: 100px;
      }
      .general-setting-input {
        width: 80px;
      }
      .general-setting-select {
        width: 80px;
      }
    }

    .general-tab {
      margin-bottom: 20px;
      .icon-tip {
        display: inline-block;
        width: 18px;
        height: 18px;
        background-image: url('../../images/icon-query.png');
        cursor: pointer;
        margin-bottom: 0;
      }
    }

    .el-form-item__error {
      margin-left: 0px !important;
    }
  }

  .general-setting-content .range .el-input-number .el-input__inner {
    // 全局样式污染了
    height: 30px;
  }
</style>
