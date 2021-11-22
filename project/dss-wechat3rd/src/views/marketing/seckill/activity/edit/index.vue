<template>
  <div class="seckill-edit"
       v-loading="isLoading">
    <el-breadcrumb separator="/"
                   class="wkt-breadcrumb-container">
      <template v-if="!!deleteShow">
        <el-breadcrumb-item :to="{ path: '/marketing/seckill/delete-list' }">删除的活动</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="{ path: '/marketing/seckill/activity/list' }">活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ isEdit ? '修改' : '创建' }}活动</el-breadcrumb-item>
      </template>
    </el-breadcrumb>

    <el-form :model="form"
             :disabled="curStatus !== seckillActivityStatus.NOT_STARTED"
             :rules="rules"
             label-width="150px"
             ref="elForm"
             class="seckill-edit-form">
      <el-form-item label="活动名称："
                    prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item label="活动时间："
                    prop="activityTime">
        <el-date-picker v-model="form.activityTime"
                        type="datetimerange"
                        :picker-options="options"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"></el-date-picker>
      </el-form-item>

      <el-form-item label="周期设置："
                    prop="periodType"
                    class="period-box">
        <el-switch v-model="form.isOpenPeriod"
                   :active-value="1"
                   :inactive-value="0"
                   active-text="开启"
                   inactive-text="禁止"
                   active-color="#52C41A"
                   inactive-color="#ff4949"></el-switch>

        <el-radio-group v-model="form.periodType"
                        v-if="form.isOpenPeriod">
          <el-radio :label="1">
            <span>每天</span>
            <work-hour-picker :initValue="{
                startTime: form.periodParams.periodStartHourOfDay,
                endTime: form.periodParams.periodEndHourOfDay
              }"
                              :ableSupportRest="false"
                              :is-division-region="false"
                              number-or-string="string"
                              @change="onHourOfDayChange"></work-hour-picker>
          </el-radio>

          <el-radio :label="2">
            <span>每周</span>
            <el-select v-model="form.periodParams.periodDayOfWeek"
                       multiple
                       placeholder="请选择"
                       @change="handleDayOfWeekSelect"
                       class="day-of-week-select"
                       :class="[isDayOfWeekAll ? 'hideTag' : '', isErrorOfWeek ? 'is-error' : '']">
              <el-option v-for="(item, index) in dayOfWeekOptions"
                         :key="index"
                         :label="item.label"
                         :value="item.value">
              </el-option>
            </el-select>
            <work-hour-picker :initValue="{
                startTime: form.periodParams.periodStartHourOfWeek,
                endTime: form.periodParams.periodEndHourOfWeek
              }"
                              :ableSupportRest="false"
                              :is-division-region="false"
                              number-or-string="string"
                              @change="onHourOfWeekChange"></work-hour-picker>
          </el-radio>

          <el-radio :label="3">
            <span>每月</span>
            <work-day-picker style="margin-right: 10px;"
                             :initValue="{
                startDay: form.periodParams.periodMonthStartDay,
                endDay: form.periodParams.periodMonthEndDay
              }"
                             is-division-region
                             @change="onWorkDayChange"></work-day-picker>
            <work-hour-picker :initValue="{
                startTime: form.periodParams.periodStartHourOfMonth,
                endTime: form.periodParams.periodEndHourOfMonth
              }"
                              :ableSupportRest="false"
                              :is-division-region="false"
                              number-or-string="string"
                              @change="onHourOfMonthChange"></work-hour-picker>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="选择商品："
                    prop="goods">
        <el-button size="mini" v-if="(!isEdit || copy) && !form.goods" @click="onShowGoods">选择商品</el-button>
        <div v-else-if="!!form.goods"
             class="form-goods"
             @click="onShowGoods"
             :style="{ cursor: isEdit ? 'default' : 'pointer' }">
          <div class="goods-name">{{ form.goods.name }}</div>
          <el-button class="btn-close"
                     v-if="!this.isEdit"
                     icon="el-icon-close"
                     @click.stop="onRemoveGoods"
                     circle></el-button>
        </div>
      </el-form-item>

      <div v-for="(item, index) in form.itemList"
           :key="index">
        <div class="ladder-container">
          <!-- 多规格商品 -->
          <el-form-item label="秒杀价格："
                        v-if="skuCols.length > 0"
                        :prop="'itemList.' + index + '.skuList'"
                        :rules="[{ validator: reg.checkPrice }, { validator: reg.checkTotalLimitAmount }]">
            <div class="sku-div">
              <el-table :data="item.skuList"
                        size="mini"
                        class="sku-table">
                <el-table-column v-for="col in skuCols"
                                 :key="col.skuId"
                                 :prop="col.prop"
                                 :label="col.label"
                                 width="120">
                  <template slot-scope="scope">
                    <el-input v-if="col.type === 'input'"
                              v-model="scope.row[col.prop]"
                              @blur="onBlurInput(index)" />
                    <span v-else-if="col.type === 'money'">{{ scope.row[col.prop] | price }}</span>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <!-- 普通商品 -->
          <template v-else
                    v-for="(sku, skuIndex) in item.skuList">
            <el-form-item label="单买价格（原价）："
                          prop="labelPrice"
                          :key="'labelPrice' + skuIndex">
              <div class="div-input">{{ sku.labelPrice | price }}</div>
              元
            </el-form-item>

            <el-form-item label="企业售价："
                          :key="'salePrice' + skuIndex">
              <div class="div-input">{{ sku.salePrice | price }}</div>
              元
            </el-form-item>

            <el-form-item label="秒杀价："
                          :prop="'itemList.' + index + '.skuList.' + skuIndex + '.seckillPrice'"
                          :key="'seckillPrice' + skuIndex"
                          :rules="[{ required: true, message: '请输入秒杀价' }, { required: true, validator: reg.checkPrice }]">
              <el-input v-model="sku.seckillPrice" class="middle-width" />
              元
              <div class="tip-msg"></div>
            </el-form-item>

            <el-form-item label="参与秒杀数量："
                          :prop="'itemList.' + index + '.skuList.' + skuIndex + '.totalLimitAmount'"
                          :key="'totalLimitAmount' + skuIndex"
                          :rules="[
                { required: true, message: '请输入参与秒杀数量' },
                { required: true, validator: reg.checkTotalLimitAmount }
              ]">
              <el-input v-model="sku.totalLimitAmount"
                        class="middle-width" />
              <div class="tip-msg"></div>
            </el-form-item>
          </template>
        </div>
      </div>

      <el-form-item label="限购："
                    prop="peopleLimitAmount">
        <div style="display:flex;">
          <el-select v-model="form.peopleLimitType"
                     style="width:140px;margin-right:10px;"
                     placeholder="选择时间限制">
            <el-option label="本活动周期"
                       :value="0"></el-option>
            <el-option label="每天"
                       :value="1"></el-option>
          </el-select>
          <div class="input-box">
            每人可购买
            <el-input class="middle-width"
                      v-model="form.peopleLimitAmount" />
            件
          </div>
        </div>
        <div class="tip-msg">注：填写为“0”时不限购</div>
      </el-form-item>

      <el-form-item prop="orderRestrict"
                    class="coupon-label dss-star"
                    label="下单限制：">
        <el-radio-group v-model="form.orderRestrict">
          <el-radio :label="limitEnum.all">不限制</el-radio>
          <el-radio :label="limitEnum.skill">只允许秒杀下单</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="suitStoreType"
        class="coupon-label dss-star"
        v-if="form.goods"
        label="活动门店："
        :disabled="isDisabled"
      >
        <el-radio-group
          :disabled="curStatus !== seckillActivityStatus.NOT_STARTED && curStatus !== seckillActivityStatus.ON_GOING"
          v-model="form.suitStoreType"
        >
          <el-radio :label="suitStoreTypeEnum.all" v-if="isEnterpriseManager || (isDisabled && form.suitStoreType === suitStoreTypeEnum.all)">全部门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part" v-if="singleStore && (selectedStoresList && selectedStoresList.length <= 1)">本门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part" v-else>选定门店
            <el-button size="mini" v-if="form.suitStoreType === suitStoreTypeEnum.part" @click="handleSelectStore()">
              选择门店
            </el-button>
            
            <el-button size="mini" class="btn-rules left10"
              v-if="form.suitStoreType === suitStoreTypeEnum.part && curApp.industryKey !== 'home'"
              :disabled="curStatus !== seckillActivityStatus.NOT_STARTED && curStatus !== seckillActivityStatus.ON_GOING"
              @click="handleImportStore()"
            >
              导入门店
            </el-button>

          </el-radio>
        </el-radio-group>
      </el-form-item>

      <div class="store-list-box"
          v-if="
            form.goods &&
            selectedStoresList &&
            selectedStoresList.length &&
            form.suitStoreType === suitStoreTypeEnum.part &&
            (!singleStore || selectedStoresList.length > 1)
          "
      >
        <div class="store-label">已选门店</div>
        <div class="store-item-box"
             :style="
            curStatus !== seckillActivityStatus.NOT_STARTED && curStatus !== seckillActivityStatus.ON_GOING
              ? 'pointer-events: none;'
              : ''
          ">
          <el-tag v-for="(store, storeIndex) in selectedStoresList"
                  :key="store.id"
                  :type="errorStoreListIds.includes(store.id)? 'danger': ''"
                  @close="handleDelStoreItem(storeIndex)"
                  :closable="curStatus === seckillActivityStatus.NOT_STARTED">{{ store.name }}</el-tag>
        </div>
      </div>

      <div class="store-list-box" v-if="form.suitStoreType === suitStoreTypeEnum.all && errorStoreList.length">
        <el-tag type="danger" v-for="(store) in errorStoreList" :key="store.id">{{ store.name }}</el-tag>
      </div>

      <el-form-item label="设置门店配额："
                    prop="periodType"
                    class="period-box"
                    v-if="form.goods">
        <el-switch v-model="form.useQuotaLimit"
                   style="margin:0;margin-top:-3px;"
                   :active-value="true"
                   :inactive-value="false"
                   active-text="开启"
                   inactive-text="关闭"
                   active-color="#256EFF"
                   inactive-color="#ff4949"></el-switch>
        <el-button class="synchronization"
                   :disabled="false"
                   v-if="form.useQuotaLimit"
                   @click="settingQuota">设置配额</el-button>
      </el-form-item>
    </el-form>

    <div class="bottom-button">
      <el-button
        v-if="curStatus === seckillActivityStatus.NOT_STARTED"
        type="primary"
        :disabled="isDisabled"
        @click="onSave"
      >
        保存
      </el-button>
      <el-button @click="onCancle">{{ curStatus === seckillActivityStatus.NOT_STARTED ? '取消' : '关闭' }}</el-button>
    </div>

    <local-resolve-xls @resolve="onResolveImportStore"
                       :visible.sync="resolveXlsDialogVisible"
                       title="导入门店" />

    <!-- 选择商品弹框 -->
    <goods-select-dialog v-model="showGoodsDialog"
                         filter-offline
                         show-goods-type-tab
                         :enable-handler="enableHandler"
                         @single-choosed="onSelectSeckillGoods" />

    <!-- 选择门店弹框 -->
    <store-select-dialog :selected-stores="selectedStoresList"
                         enable-multiple
                         api-url="/wp/store/queryByItemDept"
                         :query-params="queryStoreListParams"
                         :is-all="true"
                         v-model="showStoreDialog"
                         title="门店状态"
                         :is-show-area="!!isEnterpriseManager"
                         :is-show-dealer="!!isEnterpriseManager"
                         @choosed="onStoreChoosed"></store-select-dialog>

    <seckill-quota-dialog :storeIdList="selectedStoresList"
                          :query-params="queryStoreListParams"
                          :quotaList="storeQuotaList"
                          @done="getList"
                          v-model="settingDialogShow" />
  </div>
</template>

<script>
import './index.less';
import { mapState } from 'vuex';
import regexps from '@/dss-common/utils/regexps.js';
import { seckillActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import utilDate from '@/dss-common/utils/date.js';
import api from '@/dss-wechat3rd/src/constants/index.js';
import seckillApi from '@/dss-wechat3rd/src/api/seckill.js';
import commonApi from '@/dss-wechat3rd/src/api';
import WorkHourPicker from '@/dss-wechat3rd/src/components/WorkHourPicker/index.vue';
import WorkDayPicker from '@/dss-wechat3rd/src/components/WorkDayPicker/index.vue';
import SeckillQuotaDialog from './seckill-quota-dialog.vue';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';

const limitEnum = { all: 0, skill: 1 };

const selectAllDayOfWeekNum = 7; // 每周全选中，一共为7天

// 将form对象中的商品价格(元)进行价格换算，转换成发送后端价格参数(分)，以及将商品信息参数封装在itemList中进行接口请求
const convert = {
  labelPrice: v => v * 100,
  salePrice: v => v * 100,
  seckillPrice: v => v * 100,
  totalLimitAmount: v => parseInt(v),
  itemList(v, form) {
    if (!v || v.length === 0) {
      return '';
    }
    let list = [];
    v.forEach(item => {
      list = list.concat(
        item.skuList.map(sku => {
          const skuParam = {
            itemNo: sku.itemNo,
            thumbnail: item.thumbnail,
            labelPrice: sku.labelPrice,
            salePrice: sku.salePrice,
            seckillPrice: Math.round(sku.seckillPrice * 100),
            totalLimitAmount: parseInt(sku.totalLimitAmount)
          };
          if (sku.skuId) {
            skuParam.skuId = sku.skuId;
          }
          return skuParam;
        })
      );
    });
    return list;
  },
  goods: v => null
};

export default {
  components: {
    GoodsSelectDialog,
    StoreSelectDialog,
    WorkHourPicker,
    WorkDayPicker,
    SeckillQuotaDialog,
    LocalResolveXls
  },

  data() {
    // 正则常量中的规则
    const { money, positiveInteger } = regexps;

    const validate = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback('请输入活动名称');
      }
      return callback();
    };

    // 周期设置校验规则
    const checkPeriodType = (rule, value, callback) => {
      const periodDayOfWeek = this.form.periodParams.periodDayOfWeek || []; // 每周选中的天数
      if (
        this.form.isOpenPeriod && // 已开启周期设置
        value === 2 && // 周期设置类型为2：每周
        periodDayOfWeek.length < 1 // 每周选中的天数为0
      ) {
        this.isErrorOfWeek = true; // 周期设置中的每周类型是否显示错误
        return callback('请选择每周参与的天数');
      }
      this.isErrorOfWeek = false; // 周期设置中的每周类型是否显示错误
      return callback();
    };

    // 价格校验规则
    const checkPrice = (rule, value, callback) => {
      // 判断是否为有sku的商品，有sku的则需要循环判断
      if (typeof value === 'string' || typeof value === 'number') {
        // 普通商品的售价，因为普通商品没有多种规格售价，只有一种售价，而且不能更改，所以只需要选择第一个的售价来判断
        const salePrice = this.form.itemList[0].skuList[0].salePrice;
        if (!value) {
          return callback('请输入秒杀价');
        } else if (!money.reg.test(value)) {
          return callback(money.msg);
        }
        //fixme 秒杀不再校验秒杀价与售价的大小关系
        /*else if (value >= salePrice / 100) {
          return callback('秒杀价必须小于售价');
        }*/
      } else {
        value.forEach(v => {
          if (!v.seckillPrice) {
            return callback('请输入秒杀价');
          } else if (!money.reg.test(v.seckillPrice)) {
            return callback(money.msg);
          }
          //fixme 秒杀不再校验秒杀价与售价的大小关系
          /* else if (v.seckillPrice >= v.salePrice / 100) {
            return callback('秒杀价必须小于售价');
          }*/
        });
      }
      return callback();
    };

    // 参与秒杀数量校验规则
    const checkTotalLimitAmount = (rule, value, callback) => {
      // 判断是否为有sku的商品，有sku的则需要循环判断
      if (typeof value === 'string' || typeof value === 'number') {
        if (!value) {
          return callback('请输入参与秒杀数量');
        } else if (!positiveInteger.reg.test(value)) {
          return callback('秒杀数量为大于0的正整数');
        }
      } else {
        value.forEach(v => {
          if (!v.totalLimitAmount) {
            return callback('请输入参与秒杀数量');
          } else if (!positiveInteger.reg.test(v.totalLimitAmount)) {
            return callback('秒杀数量为大于0的正整数');
          }
        });
      }
      return callback();
    };

    const storeValidator = async (rule, value, callback) => {
      this.errorStoreList = [];

      const { all, list: unavaliableStoreList } = (await this.queryUnavaliableStoreList()) || [];

      const unavaliableStoreListIds = unavaliableStoreList.map(i => i.id);

      if (this.form.suitStoreType === suitStoreTypeEnum.all) {
        if (all) {
          return callback('该商品在全部门店已有秒杀活动');
        }
        if (unavaliableStoreList.length) {
          this.errorStoreList = unavaliableStoreList;
          return callback('该商品在以下门店已有秒杀活动，请重新选择指定门店');
        }
        return callback();
      } else if (this.singleStore) {
        // 本门店
        if (all || unavaliableStoreListIds.includes(this.epStoreList[0].id)) {
          return callback('该商品在门店已有秒杀活动');
        }

        if (!this.form.goods || !this.form.goods.itemNo) return callback();

        // 查询上架门店
        const { data } = await commonApi.queryItemStore({ itemNo: this.form.goods.itemNo });
        if (!data || !data.map(i => i.id).includes(this.epStoreList[0].id)) {
          return callback('该商品在门店未上架');
        }
      } else {
        if (this.selectedStoresList && this.selectedStoresList.length) {
          this.errorStoreList = this.selectedStoresList.filter(i => unavaliableStoreListIds.includes(i.id));
          if (this.errorStoreList.length) {
            return callback('该商品在以下门店已有秒杀活动，请重新选择指定门店');
          }
          return callback();
        } else {
          return callback('请选择门店');
        }
      }
    };

    return {
      resolveXlsDialogVisible: false,
      //禁止商品选择的回调钩子，定金商品不允许选择
      enableHandler: function(row) {
        return !row.frontMoneyItem;
      },
      isLoading: false,
      limitEnum, //下单限制
      activityId: null, // 活动ID
      deleteShow: false, // 是否为删除列表页面进入
      isDisabled: false, // 是否允许编辑，0是允许，1是不允许
      storeQuotaList: null,
      suitStoreTypeEnum, // 使用门店类型常量
      settingList: [],
      form: {
        name: '', // 活动名称
        activityTime: [], // 活动时间（"startTime": "2019-08-30 00:00:00",  "endTime": "2019-09-30 00:00:00",）
        useQuotaLimit: false,
        isOpenPeriod: 0, // 是否开启周期设置，0：不开启，1：开启
        periodType: 1, // 周期设置类型，1：每天，2：每周，3：每月
        // 周期设置参数对象
        periodParams: {
          periodStartHourOfDay: '00:00', // 每天开始时间
          periodEndHourOfDay: '00:30', // 每天结束时间
          periodDayOfWeek: [], // 每周选中的天数
          periodStartHourOfWeek: '00:00', // 每周的每天开始时间
          periodEndHourOfWeek: '00:30', // 每周的每天结束时间
          periodMonthStartDay: 1, // 每月开始日期
          periodMonthEndDay: 2, // 每月结束日期
          periodStartHourOfMonth: '00:00', // 每月的每天开始时间
          periodEndHourOfMonth: '00:30' // 每月的每天结束时间
        },

        goods: null, // 选中的商品
        itemList: [], // 商品规格
        peopleLimitAmount: 0, // 秒杀件数限制
        peopleLimitType: 0, //秒杀限制类型 0：活动周期；1：每天
        suitStoreType: suitStoreTypeEnum.all, // 参与活动的门店
        orderRestrict: 0 //下单限制
      },
      // 日期时间选择选项
      options: {
        shortcuts: [
          {
            text: '未来一周',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来一个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit('pick', [start, end]);
            }
          },
          {
            text: '未来三个月',
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
              picker.$emit('pick', [start, end]);
            }
          }
        ]
      },
      // 每周天数选择项
      dayOfWeekOptions: [
        { label: '全选', value: 7 },
        { label: '周日', value: 0 },
        { label: '周一', value: 1 },
        { label: '周二', value: 2 },
        { label: '周三', value: 3 },
        { label: '周四', value: 4 },
        { label: '周五', value: 5 },
        { label: '周六', value: 6 }
      ],
      isDayOfWeekAll: false, // 每周天数是否为全选状态
      isErrorOfWeek: false, // 周期设置中的每周类型是否显示错误

      showGoodsDialog: false, // 是否显示选择商品弹框
      skuCols: [], // 规格动态列表
      hasSku: false, // 是否有规格，卡项无规格

      showStoreDialog: false, // 是否显示选择门店弹框
      queryStoreListParams: null, // 查询门店列表参数
      selectedStoresList: [], // 选中的门店列表
      originStoreList: [], // 原来的门店
      errorStoreList: [],
      storeIds: '',
      seckillActivityStatus, // 秒杀活动状态常量
      curStatus: seckillActivityStatus.NOT_STARTED, // 当前的活动状态
      settingDialogShow: false,
      rules: {
        // 活动名称
        name: [
          { required: true, message: '请输入活动名称' },
          {
            max: 80,
            message: '最大长度80个字符'
          },
          {
            validator: validate,
            trigger: 'blur'
          }
        ],
        // 活动时间
        activityTime: {
          type: 'array',
          required: true,
          message: '请选择活动时间'
        },
        // 周期设置类型
        periodType: [
          {
            validator: checkPeriodType.bind(this),
            trigger: 'blur'
          }
        ],
        // 秒杀商品
        goods: {
          required: true,
          message: '请选择商品'
        },
        // 限购数量
        peopleLimitAmount: [
          {
            required: true,
            message: '请输入限购'
          },
          {
            pattern: /(^[1-9]\d{0,5}$)|(^0$)/,
            message: '请输入0~999999之间的数字，并且大于零的正整数开头不能为零'
          }
        ],
        // 参与活动的门店
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }]
      },
      // 元素行内验证规则
      reg: {
        money,
        checkPrice,
        checkTotalLimitAmount
      },
      copy: false, // 是否复制的活动
      validateLoading: false
    };
  },

  computed: {
    ...mapState({
      env: 'env',
      curApp: 'curApp',
      roleList: 'roleList',
      userInfo: 'userInfo',
      epStoreList: 'storeList'
    }),

    // 企业管理员
    isEnterpriseManager() {
      return !!~this.roleList.split(',').indexOf('common_role_enterprise');
    },

    // 判断当前操作为编辑
    isEdit() {
      return !!this.activityId && !this.copy;
    },

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    singleStore() {
      return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
    },

    errorStoreListIds() {
      return this.errorStoreList.map(i => i.id);
    }
  },

  watch: {
    // 监听表单中的商品选择，进行实时验证
    'form.goods'(newVal, oldVal) {
      const form = this.$refs.elForm;
      //切换商品秒杀配额清空
      if (oldVal) {
        this.storeQuotaList = [];
      }
      form.validateField('goods');
      form.clearValidate('suitStoreType');
    },
    'form.suitStoreType'() {
      const form = this.$refs.elForm;
      form.validateField('suitStoreType');
    },
    // 监听表单中的周期设置是否开启，进行实时验证周期设置规则
    'form.isOpenPeriod'() {
      const form = this.$refs.elForm;
      form.validateField('periodType');
    },
    // 监听表单中的周期设置类型，进行实时验证周期设置规则
    'form.periodType'() {
      const form = this.$refs.elForm;
      form.validateField('periodType');
    },
    // 监听表单中的周期设置中每周选中的天数，进行实时验证周期设置规则
    'form.periodParams.periodDayOfWeek'() {
      const form = this.$refs.elForm;
      form.validateField('periodType');
    }
  },

  mounted() {
    this.activityId = this.$route.query.activityId || null;
    this.activityStatus = this.$route.query.activityStatus || 0;
    this.deleteShow = this.$route.query.deleteShow ? !!+this.$route.query.deleteShow : false;
    this.isDisabled = this.$route.query.isDisabled ? !!+this.$route.query.isDisabled : false;
    this.copy = this.$route.query.copy || false;
    if (!this.isEnterpriseManager && !this.activityId) {
      this.form.suitStoreType = suitStoreTypeEnum.part;
    }
    this.getSeckillDetail(); // 查询该秒杀活动详情
  },

  methods: {
    getSeckillDetail() {
      // 查询该秒杀活动详情
      if (!!this.activityId) {
        const params = {
          activityId: this.activityId,
          status: this.activityStatus
        };

        seckillApi.seckillDetail(params).then(
          res => {
            if (!res.data) {
              // 请求后端成功，但返回data为空（data为空，activityId有可能是乱填的），把activityId置为null
              this.activityId = null;
              this.$router.push('/marketing/seckill/activity/edit');
              return;
            }
            this.setFormData(res.data);
          },
          () => {
            // 异常，路径去掉activityId进入新建态
            this.activityId = null;
            this.$router.push('/marketing/seckill/activity/edit');
          }
        );
      }
    },

    /**
     * 填充表单数据
     */
    setFormData(data) {
      // 活动名称
      this.form.name = data.name;

      // 活动时间
      if (data.startTime && data.endTime) {
        this.form.activityTime = [new Date(data.startTime), new Date(data.endTime)];
      }

      // 周期设置是否开启，周期类型为-1则表示不开启周期设置
      this.form.isOpenPeriod = !data.periodType || data.periodType === -1 ? 0 : 1;

      // 是否开启限额
      this.form.useQuotaLimit = data.useQuotaLimit;

      // 周期设置类型periodType，1：每天，2：每周，3：每月
      this.form.periodType = !data.periodType || data.periodType === -1 ? 1 : data.periodType;
      // 设置每周的天数
      this.form.periodParams.periodDayOfWeek = [];
      if (data.weekRange) {
        let weekRange = data.weekRange.split(',');
        // 判断接口返回的每周选中天数是否为全选，是则在数组第一位添加全选的状态标识
        if (weekRange.length === selectAllDayOfWeekNum) {
          weekRange.unshift(selectAllDayOfWeekNum);
          this.isDayOfWeekAll = true;
        }
        weekRange.forEach(item => {
          this.form.periodParams.periodDayOfWeek.push(Number(item));
        });
      }
      // 设置每月的天数
      if (data.monthRange) {
        this.form.periodParams.periodMonthStartDay = Number(data.monthRange.split(',')[0]);
        this.form.periodParams.periodMonthEndDay = Number(data.monthRange.split(',')[1]);
      }
      // 设置对应的时间点数
      if (data.dayRange) {
        if (data.periodType === 1) {
          this.form.periodParams.periodStartHourOfDay = data.dayRange.split(',')[0];
          this.form.periodParams.periodEndHourOfDay = data.dayRange.split(',')[1];
        } else if (data.periodType === 2) {
          this.form.periodParams.periodStartHourOfWeek = data.dayRange.split(',')[0];
          this.form.periodParams.periodEndHourOfWeek = data.dayRange.split(',')[1];
        } else if (data.periodType === 3) {
          this.form.periodParams.periodStartHourOfMonth = data.dayRange.split(',')[0];
          this.form.periodParams.periodEndHourOfMonth = data.dayRange.split(',')[1];
        }
      }

      // 根据选中的商品itemNo查询商品详情接口，设置skuList
      if (!this.copy || this.activityStatus === seckillActivityStatus.ENDED) {
        this.setSkuList(data);
      }

      // 秒杀件数限制
      this.form.suitStoreType = data.suitStoreType;

      this.form.peopleLimitAmount = data.peopleLimitAmount;
      this.form.peopleLimitType = data.peopleLimitType;
      this.form.orderRestrict = data.orderRestrict;
      this.storeQuotaList = data.storeQuotaList;

      this.storeIds = data.storeIds;

      // 参与活动的门店
      if (data.storeBriefVOS && data.storeBriefVOS.length > 0) {
        this.selectedStoresList.push(...data.storeBriefVOS);
        this.originStoreList = this.selectedStoresList.slice();
      }

      // 当前活动状态
      this.curStatus = data.status;

      if (this.copy) {
        this.curStatus = seckillActivityStatus.NOT_STARTED;
        this.form.name = data.name + '-复制';
        this.form.useQuotaLimit = false;
      }

      // 查询门店列表的参数
      this.queryStoreListParams = {
        itemNo: data.itemNo
      };
    },

    getList(storeQuotaList) {
      this.storeQuotaList = storeQuotaList;
    },

    /**
     * 根据选中的商品itemNo查询商品详情接口，设置skuList
     */
    setSkuList(data) {
      //请求完商品信息后，请求商品详情信息，获取sku信息，指定不同的秒杀价格
      api.goods
        .detail(data.itemNo)
        .done(res => {
          const wxItem = res.data.wxItem;

          // 查询门店列表的参数
          this.queryStoreListParams = {
            itemNo: wxItem.itemNo
          };

          const productInfo = {
            name: wxItem.name,
            itemNo: wxItem.itemNo,
            salePrice: wxItem.salePrice,
            labelPrice: wxItem.labelPrice
          };

          const skuCols = [];
          const skuInfoList = res.data.skuInfoList || [];
          // 判断当前商品是否有sku
          if (skuInfoList && skuInfoList.length) {
            const list = [];
            this.$plain(skuInfoList).forEach((sku, index) => {
              let obj = {};
              // 过滤禁用sku
              if (!sku.notOptional) {
                obj = {
                  skuId: sku.skuId,
                  itemNo: sku.itemNo,
                  labelPrice: sku.labelPrice,
                  salePrice: sku.salePrice,
                  notOptional: sku.notOptional
                };

                // 判断是否为编辑活动，以便添加秒杀价及秒杀参与数量渲染页面
                if (this.isEdit || this.activityStatus === seckillActivityStatus.ENDED) {
                  obj.seckillPrice = data.itemList[index].seckillPrice /= 100;
                  obj.totalLimitAmount = data.itemList[index].totalLimitAmount;
                }

                list.push(obj);
              }

              sku.skuInfoNames.forEach((item, itemIndex) => {
                const key = `dy_prop_${itemIndex}`;
                obj[key] = item.valName;
                if (index === 0) {
                  skuCols.push({
                    // label: item.keyName,
                    label: item.ancestryKeyName || item.keyName, // 兼容多级规格展示表头
                    prop: key
                  });
                }
              });
            });

            productInfo.skuInfoList = list;
          } else {
            productInfo.skuInfoList = [
              {
                skuId: null,
                itemNo: data.itemNo,
                labelPrice: data.labelPrice,
                salePrice: data.salePrice
              }
            ];

            // 判断是否为编辑活动，以便添加秒杀价及秒杀参与数量渲染页面
            if (this.isEdit || this.activityStatus === seckillActivityStatus.ENDED) {
              productInfo.skuInfoList[0].seckillPrice = data.itemList[0].seckillPrice /= 100;
              productInfo.skuInfoList[0].totalLimitAmount = data.itemList[0].totalLimitAmount;
            }
          }
          this.form.goods = productInfo;

          // 规格表头赋值
          if (skuCols.length > 0) {
            skuCols.push(
              {
                label: '原价',
                prop: 'labelPrice',
                type: 'money'
              },
              {
                label: '企业售价',
                prop: 'salePrice',
                type: 'money'
              },
              {
                label: '秒杀价',
                prop: 'seckillPrice',
                type: 'input'
              },
              {
                label: '参与秒杀数量',
                prop: 'totalLimitAmount',
                type: 'input'
              }
            );
          }
          this.skuCols = skuCols;

          // 规格处理
          const skuList = productInfo.skuInfoList.map(sku => {
            const seckillSku = {};
            for (const key in sku) {
              seckillSku[key] = sku[key];
            }
            return seckillSku;
          });
          this.form.itemList = [{ skuList: skuList }];
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    /**
     * 接收每天开始结束时间变化
     */
    onHourOfDayChange(opt) {
      this.form.periodParams.periodStartHourOfDay = opt.startTime;
      this.form.periodParams.periodEndHourOfDay = opt.endTime;
    },

    settingQuota() {
      if (this.form.suitStoreType === suitStoreTypeEnum.all) {
        this.selectedStoresList = [];
      } else {
        this.skuList = 0;
      }
      this.settingDialogShow = true;
    },

    /**
     * 每周选中的天数
     */
    handleDayOfWeekSelect(value) {
      let allDays = [];

      if (this.isDayOfWeekAll) {
        // 取消全选
        if (!value.includes(selectAllDayOfWeekNum) && this.dayOfWeekOptions.length - 1 === value.length) {
          this.form.periodParams.periodDayOfWeek = [];
          this.isDayOfWeekAll = false;
        }
        // 任意选择取消全选
        if (value.includes(selectAllDayOfWeekNum) && this.dayOfWeekOptions.length - 1 === value.length) {
          value.shift();
          this.form.periodParams.periodDayOfWeek = value;
          this.isDayOfWeekAll = false;
        }
      } else {
        // 选择全选
        if (value.includes(selectAllDayOfWeekNum)) {
          this.dayOfWeekOptions.forEach(item => {
            allDays.push(item.value);
          });
          this.form.periodParams.periodDayOfWeek = allDays;
          this.isDayOfWeekAll = true;
        }
        // 全部勾选的时候，默认全选
        if (!value.includes(selectAllDayOfWeekNum) && value.length === this.dayOfWeekOptions.length - 1) {
          value.unshift(selectAllDayOfWeekNum);
          this.form.periodParams.periodDayOfWeek = value;
          this.isDayOfWeekAll = true;
        }
      }
    },

    /**
     * 接收每周的每天开始结束时间变化
     */
    onHourOfWeekChange(opt) {
      this.form.periodParams.periodStartHourOfWeek = opt.startTime;
      this.form.periodParams.periodEndHourOfWeek = opt.endTime;
    },

    /**
     * 接收每月开始结束日期的变化
     */
    onWorkDayChange(opt) {
      this.form.periodParams.periodMonthStartDay = opt.startDay;
      this.form.periodParams.periodMonthEndDay = opt.endDay;
    },

    /**
     * 接收每月的每天开始结束时间变化
     */
    onHourOfMonthChange(opt) {
      this.form.periodParams.periodStartHourOfMonth = opt.startTime;
      this.form.periodParams.periodEndHourOfMonth = opt.endTime;
    },

    /**
     * 显示商品选择弹框
     */
    onShowGoods() {
      if (this.isEdit) {
        return;
      }
      this.showGoodsDialog = true;
    },

    /**
     * 删除商品
     */
    onRemoveGoods() {
      this.form.goods = null;
      this.form.itemList = [];
    },

    /**
     * 完成商品选择
     */
    onSelectSeckillGoods(row) {
      this.selectedStoresList = [];
      this.errorStoreList = [];

      this.isLoading = true;
      this.activityStatus = seckillActivityStatus.NOT_STARTED;
      this.setSkuList(row); // 根据选中的商品itemNo查询商品详情接口，设置skuList
    },

    /**
     * 商品规格秒杀价格或参与秒杀数量输入验证
     */
    onBlurInput(index) {
      const form = this.$refs.elForm;
      form.validateField(`itemList.${index}.skuList`);
    },

    /**
     * 显示门店选择弹框
     */
    handleSelectStore() {
      this.showStoreDialog = true;
    },

    /**
     * 完成门店选择
     */
    onStoreChoosed(storeList) {
      this.selectedStoresList = storeList;
      this.$refs.elForm.validateField('suitStoreType');
    },

    handleImportStore() {
      this.resolveXlsDialogVisible = true;
    },

    onResolveImportStore(list) {
      this.selectedStoresList = list;
      this.$refs.elForm.validateField('suitStoreType');
    },

    /**
     * 删除选择的门店
     */
    handleDelStoreItem(storeIndex) {
      this.selectedStoresList.splice(storeIndex, 1);
      this.$refs.elForm.validateField('suitStoreType');
    },

    /**
     * 保存秒杀活动
     */
    onSave() {
      if (this.validateLoading) return;

      this.validateLoading = true;

      this.$refs.elForm.validate(valid => {
        this.validateLoading = false;
        if (!valid) {
          return;
        }
        const itemList = this.form.itemList;
        if (!itemList || !itemList.length) {
          return;
        }

        // 将form对象转成发送后端参数
        const params = this.toParam();

        // 判断是否开启了周期设置，是则显示二次确认弹框
        if (params.periodType !== -1) {
          this.$confirm('请确保秒杀设置周期时间在整体活动时间范围内，否则活动将不会开启', '确定开启', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            customClass: 'wkt-warning'
          })
            .then(() => {
              this.serverSave(params); // 执行秒杀活动创建或修改保存接口
            })
            .catch(() => {
              console.log('取消开启周期设置');
              return;
            });
        } else {
          this.serverSave(params); // 执行秒杀活动创建或修改保存接口
        }
      });
    },

    /**
     * 执行秒杀活动创建或修改保存接口
     */
    serverSave(params) {
      let methodProp = 'createSeckill';
      if (this.isEdit) {
        params.id = this.activityId;
        methodProp = 'updateSeckill';
      }
      this.isLoading = true;

      seckillApi[methodProp](params)
        .done(res => {
          this.$message.success(this.isEdit ? '修改成功' : '创建成功');
          this.$router.push('/marketing/seckill/activity/list');
        })
        .always(() => {
          this.isLoading = false;
        });
    },

    /**
     * 将form对象转成发送后端参数
     */
    toParam() {
      const params = {};
      for (const key in this.form) {
        if (convert[key]) {
          const value = convert[key](this.form[key], this.form);
          if (value !== null) {
            params[key] = value;
          }
          continue;
        }
        params[key] = this.form[key];
      }

      // 本门店
      if (this.form.suitStoreType === suitStoreTypeEnum.part && this.singleStore) {
        params.storeIds = (this.epStoreList || []).slice(0, 1).map(s => s.id);
      } else if (this.form.suitStoreType === suitStoreTypeEnum.part) {
        params.storeIds = [];
        this.selectedStoresList.forEach((store, index) => {
          params.storeIds.push(store.id);
        });
      }

      if (this.storeQuotaList && this.storeQuotaList.length) {
        params.storeQuotaList = this.storeQuotaList;
      }
      params.itemNo = this.form.goods.itemNo || null;

      // 服务端接受时间格式为年月日时分秒
      const timemat = 'YYYY-MM-DD HH:mm:ss';
      // 活动时间
      params.startTime = utilDate.format(this.form.activityTime[0], timemat);
      params.endTime = utilDate.format(this.form.activityTime[1], timemat);
      delete params.activityTime;

      // 判断是否有开启周期设置，不开启则设置周期类型为-1
      if (!params.isOpenPeriod) {
        params.periodType = -1;
      }
      delete params.isOpenPeriod;

      // 周期设置类型periodType，1：每天，2：每周，3：每月
      if (params.periodType === 1) {
        params.dayRange = params.periodParams.periodStartHourOfDay + ',' + params.periodParams.periodEndHourOfDay;
      } else if (params.periodType === 2) {
        let weekRange = [];
        const periodDayOfWeek = params.periodParams.periodDayOfWeek || [];
        // 去除数组中全选的状态标识
        periodDayOfWeek.forEach(item => {
          if (item < selectAllDayOfWeekNum) {
            weekRange.push(item);
          }
        });
        // 对每周选中的日期数组进行从小到大排序
        weekRange = weekRange.sort();
        // 将每周选中的天数组成字符串进行接口请求
        params.weekRange = weekRange.toString();
        params.dayRange = params.periodParams.periodStartHourOfWeek + ',' + params.periodParams.periodEndHourOfWeek;
      } else if (params.periodType === 3) {
        params.monthRange = params.periodParams.periodMonthStartDay + ',' + params.periodParams.periodMonthEndDay;
        params.dayRange = params.periodParams.periodStartHourOfMonth + ',' + params.periodParams.periodEndHourOfMonth;
      }
      delete params.periodParams; // 删除请求参数中的周期设置参数对象

      return params;
    },

    /**
     * 取消或关闭秒杀活动的创建或修改
     */
    onCancle() {
      this.$router.push('/marketing/seckill/activity/list');
    },

    /**
     * 查询已存在秒杀的门店
     */
    async queryUnavaliableStoreList() {
      const itemNo = this.form.goods && this.form.goods.itemNo;
      if (!itemNo) return { all: false, list: [] };

      let { data } = await seckillApi.queryUnavaliableStore({ itemNo });

      // 全部门店不可用
      const all = (data || []).some(i => i.id === -1);
      if (all) {
        data = [...this.selectedStoresList];
      }

      const originStoreIds = this.originStoreList.map(i => i.id);
      return { all, list: (data || []).filter(({ id }) => !originStoreIds.includes(id)) };
    }
  }
};
</script>
