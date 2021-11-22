<template>
  <div class="redpacket-add wkb-market-setting">
    <el-form :model="redpacketForm"
             ref="redpacketForm"
             :rules="rules"
             :disabled="disabled"
             v-loading="loading"
             class="redpacket-form"
             label-width="140px">
      <el-form-item label="活动名称："
                    class="redpacket-label"
                    prop="name">
        <el-input placeholder="请输入活动名称"
                  v-model="redpacketForm.name"
                  class="redpacket-w376 primary-inputHeight"></el-input>
      </el-form-item>

      <el-form-item label="活动时间"
                    class="redpacket-label"
                    prop="dateRange">
        <el-date-picker v-model="redpacketForm.dateRange"
                        type="datetimerange"
                        :picker-options="options"
                        value-format="yyyy-MM-dd HH:mm"
                        format="yyyy-MM-dd HH:mm"
                        range-separator="至"
                        start-placeholder="开始日期"
                        end-placeholder="结束日期"
                        align="right"
                        class="redpacket-w376 primary-inputHeight">
        </el-date-picker>
      </el-form-item>

      <el-form-item label="红包分配方式："
                    class="coupon-label"
                    prop="couponType">
        <el-radio-group v-model="redpacketForm.type">
          <el-radio :label="redpacketEnum.type.AVERAGE">平均 </el-radio>
          <el-radio :label="redpacketEnum.type.RANDOM">随机 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="红包使用方式："
                    class="coupon-label"
                    prop="couponType">
        <el-radio-group v-model="redpacketForm.cashWithdrawalType">
          <el-radio :label="redpacketEnum.cashWithdrawalType.UN_ABLE">线上支付 </el-radio>
          <el-radio :label="redpacketEnum.cashWithdrawalType.ABLE">提现 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="红包人数："
                    prop="quantity"
                    class="redpacket-label">
        <el-input placeholder="请输入红包人数"
                  maxlength="4"
                  v-model.number="redpacketForm.quantity"
                  class="redpacket-w376 primary-inputHeight"></el-input>
        <div class="notes">规定时间内达到这个人数后，红包成功拆分，最少2人。</div>
      </el-form-item>

      <el-form-item label="红包金额："
                    prop="totalFee"
                    class="redpacket-label">
        <el-input placeholder="请输入红包金额"
                  v-model="redpacketForm.totalFee"
                  class="redpacket-w376 primary-inputHeight"></el-input>
        <span class="redpacket-unit">元</span>
        <div class="notes">红包赠送的代金券总金额，最低=红包人数*0.01元。</div>
      </el-form-item>

      <el-form-item label="红包门槛："
                    prop="thresholdFee"
                    v-if="!isABLE"
                    class="redpacket-label">
        <el-input placeholder="请输入红包门槛"
                  v-model="redpacketForm.thresholdFee"
                  class="redpacket-w376 primary-inputHeight"></el-input>
        <span class="redpacket-unit">元</span>
        <div class="notes">代金券使用的门槛，建议设为无门槛0元。</div>
      </el-form-item>

      <el-form-item label="发放总数："
                    prop="planQuantity"
                    class="redpacket-label">
        <el-input placeholder="请输入发放总数"
                  maxlength="5"
                  v-model.number="redpacketForm.planQuantity"
                  class="redpacket-w376 primary-inputHeight"></el-input>
        <div class="notes">达到发放总数活动自动结束，填写0为无限制</div>
      </el-form-item>

      <el-form-item label="发起次数："
                    prop="launchTimesLimit"
                    class="redpacket-label">
        <el-select v-model="redpacketForm.launchTimesType"
                   style="width:140px"
                   placeholder="选择时间限制">
          <el-option label="本活动周期"
                     :value="0"></el-option>
          <el-option label="每天"
                     :value="1"></el-option>
        </el-select>
        <el-input placeholder="请输入发起次数"
                  maxlength="5"
                  v-model.number="redpacketForm.launchTimesLimit"
                  class="redpacket-w234 primary-inputHeight"></el-input>
        <div class="notes">每个会员可以发起的次数限制，默认0为无限制。</div>
      </el-form-item>

      <el-form-item label="帮拆次数："
                    prop="assistTimesLimit"
                    class="redpacket-label">
        <el-select v-model="redpacketForm.assistTimesType"
                   style="width:140px"
                   placeholder="选择时间限制">
          <el-option label="本活动周期"
                     :value="0"></el-option>
          <el-option label="每天"
                     :value="1"></el-option>
        </el-select>
        <el-input placeholder="请输入发起次数"
                  maxlength="5"
                  v-model.number="redpacketForm.assistTimesLimit"
                  class="redpacket-w234 primary-inputHeight"></el-input>
        <div class="notes">本次活动中会员可参与的帮拆红包限制，默认0为无限制。</div>
      </el-form-item>

      <el-form-item label="自动提现："
                    v-if="isABLE">
        <el-radio-group v-model="redpacketForm.autoCashingSwitch">
          <el-radio :label="0">关闭 </el-radio>
          <el-radio :label="1">打开 </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item :label="cashCouponExpireTypeLabel"
                    class="redpacket-label rebpack-time"
                    v-if="!isABLE"
                    prop="cashCouponExpireType">
        <el-radio-group v-model="redpacketForm.cashCouponExpireType">
          <el-radio :label="redpacketEnum.expireType.DATERANGE">
            <el-date-picker class="redpacket-w376 primary-inputHeight"
                            v-model="redpacketForm.cashCouponDateRange"
                            type="datetimerange"
                            :picker-options="options"
                            value-format="yyyy-MM-dd HH:mm"
                            format="yyyy-MM-dd HH:mm"
                            range-separator="至"
                            start-placeholder="开始日期"
                            end-placeholder="结束日期"
                            @change="onBlurInput"
                            align="right">
            </el-date-picker>
          </el-radio>
          <el-radio :label="redpacketEnum.expireType.DAY"
                    style="width:280px;">
            <div class="input-box">
              成功拆包当日起
              <el-input style="width:80px;"
                        class="middle-width"
                        maxlength="5"
                        :disabled="
                  redpacketForm.cashCouponExpireType === redpacketEnum.expireType.DATERANGE ||
                    redpacketForm.cashCouponExpireType === redpacketEnum.expireType.NEXTDAY
                "
                        @blur="onBlurInput"
                        v-model.number="redpacketForm.cashCouponFixedTerm_day" />
              天内可{{ isABLE ? '提现' : '用' }}
            </div>
          </el-radio>
          <el-radio :label="redpacketEnum.expireType.NEXTDAY"
                    style="width:280px;">
            <div class="input-box">
              成功拆包次日起
              <el-input style="width:80px;"
                        class="middle-width"
                        maxlength="5"
                        :disabled="
                  redpacketForm.cashCouponExpireType === redpacketEnum.expireType.DATERANGE ||
                    redpacketForm.cashCouponExpireType === redpacketEnum.expireType.DAY
                "
                        @blur="onBlurInput"
                        v-model.number="redpacketForm.cashCouponFixedTerm_nextday" />
              天内可{{ isABLE ? '提现' : '用' }}
            </div>
          </el-radio>
        </el-radio-group>
        <div class="notes"
             v-if="!isABLE">代金券有效时间，从发放时间算起，默认30天。</div>
      </el-form-item>

      <el-form-item label="拆红包有效时间："
                    prop="luckyMoneyFixedTerm"
                    class="redpacket-label">
        <el-input placeholder="请输入拆红包有效时间"
                  maxlength="5"
                  v-model="redpacketForm.luckyMoneyFixedTerm"
                  class="redpacket-w376 primary-inputHeight"></el-input>
        <span class="redpacket-unit">小时</span>
        <div class="notes">有效时间内用户可以邀请好友一起拆红包，过期则此红包作废，建议填24小时。</div>
      </el-form-item>

      <el-form-item label="活动规则："
                    prop="rules"
                    class="redpacket-label">
        <el-input placeholder="请输入活动规则"
                  type="textarea"
                  v-model="redpacketForm.rules"
                  maxlength="140"
                  :autosize="{ minRows: 8, maxRows: 8 }"
                  class="redpacket-describe"></el-input>
      </el-form-item>

      <el-form-item prop="suitStoreType"
                    class="coupon-label dss-star"
                    label="参与活动的门店">
        <el-radio-group v-model="redpacketForm.suitStoreType">
          <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part">选定门店</el-radio>
          <el-button size="mini"
                     type="primary"
                     v-if="redpacketForm.suitStoreType === suitStoreTypeEnum.part && !disabled"
                     @click="handleSelectStore()">选择门店
          </el-button>
          <el-button size="mini"
                     type="primary"
                     v-if="redpacketForm.suitStoreType === suitStoreTypeEnum.part && !disabled"
                     @click="handleImportStore()">导入门店
          </el-button>
        </el-radio-group>
      </el-form-item>

      <div class="store-list-box"
           v-if="storeList && storeList.length && redpacketForm.suitStoreType === suitStoreTypeEnum.part">
        <div class="store-label">已选门店</div>
        <div class="store-content">
          <div class="store-item-box"
               v-for="(storeList, groupIndex) in groupStoreList"
               :key="groupIndex">
            <el-tag v-for="(store, storeIndex) in storeList"
                    :key="store.id"
                    @close="handleDelStoreItem(groupIndex, storeIndex)"
                    :closable="!disabled">
              {{ store.name }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-form-item label="背景样式："
                    prop="styleUrl">
        <div class="redpacket-radio">
          <el-radio-group v-model="redpacketForm.luckyMoneyBackgroundType">
            <el-radio :label="redpacketEnum.redpacketStyle.default">默认背景图</el-radio>
            <el-radio :label="redpacketEnum.redpacketStyle.custom">自定义图片</el-radio>
          </el-radio-group>
        </div>
        <div class="bag-box">
          <div v-if="!redpacketForm.luckyMoneyBackgroundUrl"
               class="redpacket-image-choose-container"
               :class="redpacketForm.luckyMoneyBackgroundType === redpacketEnum.redpacketStyle.default ? 'disable' : ''">
            <image-selector :canReset="false"
                            v-model="redpacketForm.styleUrl"
                            @delete="onDeleteImg" />
            <div class="img-notes">建议尺寸：750x750，图片不大于1M</div>
          </div>
          <div class="redpacket-default-img-container">
            <img class="redpacket-default-img"
                 :src="computeCardBg" />
          </div>
        </div>
      </el-form-item>

      <div class="title">
        <div>海报设置</div>
        <div class="poster-preview-box">
          <div class="poster-preview"
               style="width: 295px">
            <div class="phone-head"></div>
            <img class="poster-img"
                 style="width: 295px; height: 430px"
                 src="../../../../images/marketing/bg-red-packet-share.png" />
            <div class="nick-header-box"
                 v-if="redpacketForm.posterType === posterTypeEnum.classify.value">
              <div class="nick-header">
                <img class="nick-img"
                     src="../../../../../../dss-common/img/avatar-default.jpg" />
                <div class="nick-name">白天不懂夜的黑</div>
                <div class="poster-content">{{ redpacketForm.posterContent || '一起来拆红包呀' }}</div>
              </div>
            </div>
            <img class="customer-header"
                 style="width: 240px; left: 17.5px"
                 v-if="redpacketForm.posterLogo && redpacketForm.posterType === posterTypeEnum.custom.value"
                 :src="redpacketForm.posterLogo.imgUrl" />
            <div class="poster-name ellipsis">{{ redpacketForm.name }}</div>
            <div class="poster-money">{{ redpacketForm.totalFee ? redpacketForm.totalFee + '元' : '' }}</div>
            <div class="poster-date">
              {{ redpacketForm.dateRange && redpacketForm.dateRange.length === 2 ? redpacketForm.dateRange[1] : '' }}
            </div>
          </div>
        </div>
      </div>
      <el-form-item label="样式设置："
                    class="redpacket-label"
                    prop="posterContent">
        <el-radio v-model="redpacketForm.posterType"
                  style="display: block;margin-top: 6px;margin-bottom: 10px;"
                  :label="posterTypeEnum.classify.value">{{ posterTypeEnum.classify.label }}</el-radio>
        <el-input v-model="redpacketForm.posterContent"
                  placeholder="请输入文案内容"
                  maxlength="10"
                  class="redpacket-w376 primary-inputHeight"
                  @blur="removeSpace('posterContent')"></el-input>
        <div class="img-notes">默认文案：一起来拆红包呀(最长10个字符)</div>
      </el-form-item>
      <el-form-item prop="posterLogo">
        <el-radio v-model="redpacketForm.posterType"
                  style="display: block;margin-bottom: 10px;"
                  :label="posterTypeEnum.custom.value">{{ posterTypeEnum.custom.label }}</el-radio>
        <image-selector :canReset="false"
                        :isDisabledEdit="disabled"
                        v-model="redpacketForm.posterLogo"
                        @delete="onDelPosterImg" />
        <div class="img-notes">建议尺寸：480x90，图片不大于1M</div>
      </el-form-item>

      <div class="title">
        <div>弹窗样式</div>
      </div>
      <!--图片-->
      <el-form-item label="样式设置:"
                    class="popup-label"
                    prop="popupMaterialUrl">
        <div class="redpacket-radio">
          <el-radio-group v-model="popupMaterialUrlType">
            <el-radio :label="0">默认背景图</el-radio>
            <el-radio :label="1">自定义图片</el-radio>
          </el-radio-group>
        </div>
        <div class="popup-block">
          <div class="popup-column"
               v-if="popupMaterialUrlType === 1">
            <div @click="onUsePopupBg('update')">
              <el-badge>
                <choose-images v-model="tmpPopupMaterialUrl"
                               :isDisabledEdit="disabled"
                               @delete="onDeletePopupMaterialImg" />
              </el-badge>
            </div>
            <div class="img-notes">建议尺寸：550x650，图片不大于1M</div>
          </div>

          <div class="popup-column-default"
               v-else>
            <el-badge>
              <a>
                <img class="popup-default"
                     :src="defaultPopupImgV2" />
              </a>
            </el-badge>
          </div>
          <!-- <div class="popup-column-default">
            <el-badge :value="usePopupKey==='v1'?'选中':''">
              <img class="popup-default"
                   :src="defaultPopupImgV1"
                   @click="onUsePopupBg('v1')"/>
            </el-badge>
          </div> -->
        </div>
      </el-form-item>

    </el-form>
    <div class="bottom-button" v-if="!disabled">
      <el-button @click="onCancel"
                   class="redpacket-cancel">取消 </el-button>
        <el-button type="primary"
                   @click="onSubmit('redpacketForm')">保存 </el-button>
    </div>

    <local-resolve-xls @resolve="onResolveImportStore"
                       :visible.sync="resolveXlsDialogVisible"
                       title="导入门店" />

    <store-select-dialog api-url="/wp/store/query/dept"
                         :is-all="true"
                         :selected-stores="storeList"
                         enable-multiple
                         v-model="showStoreDialog"
                         @choosed="onStoreChoosed">
    </store-select-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import './redpacket-form.less';
import redpacketEnum from '@/dss-wechat3rd/src/constants/redpacketEnum.js';
import redpacketApi from '@/dss-wechat3rd/src/api/redpacketApi.js';
import moneyUtil from '@/dss-common/utils/money';
import regex from '@/dss-wechat3rd/src/constants/regex';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import redpackBg from '@/dss-wechat3rd/src/images/goods/redpacket-bg.png';
import posterTypeEnum from '@/dss-wechat3rd/src/constants/poster-type-enum.js';
import '../../marketing.less';
import defaultPopupImgV2 from './bg-of-redpack-popup-v2.png';
import defaultPopupImgV1 from './bg-of-redpack-popup-v2.png';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
const storeGroupCount = 6;

export default {
  name: 'redpacket-form',
  components: {
    LocalResolveXls,
    StoreSelectDialog,
    ImageSelector,
    ChooseImages
  },
  data() {
    const validate = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback('请输入活动名称');
      }
      return callback();
    };
    const storeValidator = (rule, value, callback) => {
      if (this.redpacketForm.suitStoreType === suitStoreTypeEnum.all) {
        return callback();
      } else {
        if (this.storeList && this.storeList.length) {
          return callback();
        } else {
          return callback('请选择门店');
        }
      }
    };
    const expireTypeValidator = (rule, value, callback) => {
      // 处理红包有效时间
      if (value === redpacketEnum.expireType.DATERANGE) {
        if (!this.redpacketForm.cashCouponDateRange || this.redpacketForm.cashCouponDateRange.length === 0) {
          return callback('请输入红包可用时间');
        }
      } else if (value === redpacketEnum.expireType.DAY) {
        if (!regex.integral.reg.test(this.redpacketForm.cashCouponFixedTerm_day)) {
          return callback(regex.integral.msg);
        }
      } else {
        if (!regex.integral.reg.test(this.redpacketForm.cashCouponFixedTerm_nextday)) {
          return callback(regex.integral.msg);
        }
      }

      return callback();
    };
    // 自定义背景图片校验
    const checkStyleUrl = (rule, value, callback) => {
      if (
        this.redpacketForm.luckyMoneyBackgroundType === redpacketEnum.redpacketStyle.custom &&
        (!value || !value.imgUrl)
      ) {
        return callback('请选择自定义图片');
      }
      return callback();
    };
    // 自定义海报校验
    const checkPosterLogo = (rule, value, callback) => {
      if (this.redpacketForm.posterType === posterTypeEnum.custom.value && (!value || !value.imgUrl)) {
        return callback('请选择自定义海报图片');
      }
      return callback();
    };

    // 弹窗图片校验
    const checkPopupMaterialUrl = (rule, value, callback) => {
      if (this.popupMaterialUrlType === 1 && !this.tmpPopupMaterialUrl.imgUrl) {
        return callback('请上传弹窗图片');
      }
      return callback();
    };

    return {
      resolveXlsDialogVisible: false,
      posterTypeEnum,
      redpacketApi,
      redpacketEnum,
      suitStoreTypeEnum,
      defaultPopupImgV2,
      defaultPopupImgV1,
      showSkuDialog: false,
      showStoreDialog: false,
      storeList: [],
      groupStoreList: [],
      tmpPopupMaterialUrl: {
        id: '',
        imgUrl: ''
      },
      usePopupKey: '',
      redpacketForm: {
        name: '', // 活动名称
        dateRange: [], // 活动时间（"startTime": "2018-11-05T02:38:19.082Z",  "endTime": "2018-11-05T02:38:19.082Z",）
        cashCouponDateRange: [],
        type: redpacketEnum.type.AVERAGE,
        cashCouponFixedTerm_day: 30,
        cashCouponFixedTerm_nextday: 30,
        suitStoreType: suitStoreTypeEnum.all,
        planQuantity: '', // 发放总数
        launchTimesType: 0, // 发起次数时间限制 0：本周期；1：每天
        assistTimesType: 0, // 帮拆次数时间限制 0：本周期；1：每天
        cashCouponExpireType: 0,
        luckyMoneyBackgroundType: 0, // 背景样式
        cashWithdrawalType: 0, //  0, "不可提现"  1, "开放提现"
        popupMaterialUrl: '',
        styleUrl: {
          // 自定义背景图片
          id: '',
          imgUrl: ''
        },
        posterType: posterTypeEnum.classify.value,
        posterContent: '',
        posterLogo: {
          id: '',
          imgUrl: ''
        },
        autoCashingSwitch: 0
      },
      skuInfo: {},
      loading: false,
      disabled: false,
      popupMaterialUrlType: 0,

      rules: {
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
        dateRange: {
          type: 'array',
          required: true,
          message: '请选择活动时间'
        },
        cashCouponExpireType: [
          {
            validator: expireTypeValidator,
            trigger: '[blur,change]'
          }
        ],
        quantity: [
          { required: true, message: '请输入红包人数', trigger: 'blur' },
          {
            pattern: /^([2-9]|[1-9][0-9]\d{0,1})$/,
            message: '请输入2到999的正整数',
            trigger: 'blur'
          }
        ],
        planQuantity: [
          { required: true, message: '请输入发放总数', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          }
        ],
        totalFee: [
          { required: true, message: '请输入红包金额', trigger: 'blur' },

          {
            pattern: regex.price.reg,
            message: regex.price.msg,
            trigger: 'blur'
          }
        ],
        thresholdFee: [
          { required: true, message: '请输入红包门槛', trigger: 'blur' },
          {
            pattern: regex.price.reg,
            message: regex.price.msg,
            trigger: 'blur'
          }
        ],
        luckyMoneyFixedTerm: [
          { required: true, message: '请输入拆红包有效时间', trigger: 'blur' },
          {
            pattern: regex.integral.reg,
            message: regex.integral.msg,
            trigger: 'blur'
          }
        ],
        launchTimesLimit: [
          { required: true, message: '请输入发起次数', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          }
        ],
        assistTimesLimit: [
          { required: true, message: '请输入帮拆次数', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          }
        ],
        rules: [{ required: true, message: '请输入活动规则', trigger: 'blur' }],
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        styleUrl: [
          {
            validator: checkStyleUrl.bind(this),
            trigger: ['blur', 'change']
          }
        ],
        posterLogo: [
          {
            validator: checkPosterLogo.bind(this),
            trigger: ['blur', 'change']
          }
        ],
        popupMaterialUrl: [{ validator: checkPopupMaterialUrl.bind(this), trigger: 'change' }]
      },
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
      }
    };
  },
  computed: {
    ...mapState({
      allStoreList: 'storeList'
    }),
    computeCardBg() {
      if (this.redpacketForm.luckyMoneyBackgroundType === redpacketEnum.redpacketStyle.default) {
        return redpackBg;
      } else if (this.$route.query.planId && this.redpacketForm.luckyMoneyBackgroundUrl) {
        return this.redpacketForm.luckyMoneyBackgroundUrl;
      } else {
        return this.redpacketForm.styleUrl ? this.redpacketForm.styleUrl.imgUrl : redpackBg;
      }
    },
    cashCouponExpireTypeLabel() {
      // if (this.disabled) {
      //   return '';
      // }
      return this.redpacketForm.cashWithdrawalType === redpacketEnum.cashWithdrawalType.ABLE
        ? '红包提现时间：'
        : '红包可用时间：';
    },
    isABLE() {
      return this.redpacketForm.cashWithdrawalType === redpacketEnum.cashWithdrawalType.ABLE;
    }
    //cashCouponExpireTypeLabel:'红包可用时间：',
  },
  watch: {
    // 监听景样式设置类型变更
    'redpacketForm.luckyMoneyBackgroundType'(newVal, oldVal) {
      // 手动触发自定义背景图片验证
      this.$refs.redpacketForm.validateField('styleUrl');
    },
    // 监听自定义背景图片链接变更
    'redpacketForm.styleUrl': {
      deep: true,
      handler(newVal, oldVal) {
        // 手动触发自定义背景图片验证
        this.$refs.redpacketForm.validateField('styleUrl');
      }
    },
    // 监听海报样式设置类型变更
    'redpacketForm.posterType'(newVal, oldVal) {
      // 手动触发自定义海报验证
      this.$refs.redpacketForm.validateField('posterLogo');
    },
    // 监听自定义海报链接变更
    'redpacketForm.posterLogo': {
      deep: true,
      handler(newVal, oldVal) {
        // 手动触发自定义海报验证
        this.$refs.redpacketForm.validateField('posterLogo');
      }
    },
    // 监听自定义海报链接变更
    tmpPopupMaterialUrl: {
      deep: true,
      handler(newVal) {
        if (newVal && newVal.imgUrl) {
          this.redpacketForm.popupMaterialUrl = newVal.imgUrl;
          this.usePopupKey = 'update';
          console.log('tmpPopupMaterialUrl.deep.watch', newVal.imgUrl);
        } else {
          this.redpacketForm.popupMaterialUrl = '';
          this.usePopupKey = '';
        }
      }
    },
    popupMaterialUrlType() {
      if (this.popupMaterialUrlType === 1) {
        this.redpacketForm.popupMaterialUrl = '';
      }
    }
  },

  mounted() {
    if (this.$route.query.planId) {
      this.disabled = true;
      this.doSearch();
    }
  },
  methods: {
    onDeleteImg() {
      this.redpacketForm.styleUrl = {
        id: '',
        imgUrl: ''
      };
    },
    onDelPosterImg() {
      this.redpacketForm.posterLogo = {
        id: '',
        imgUrl: ''
      };
    },
    onDeletePopupMaterialImg() {
      this.redpacketForm.tmpPopupMaterialUrl = {};
    },
    onUsePopupBg(key) {
      if (this.disabled) return;
      if (key === 'update') {
        if (!this.tmpPopupMaterialUrl || !this.tmpPopupMaterialUrl.imgUrl) return;
        this.redpacketForm.popupMaterialUrl = this.tmpPopupMaterialUrl.imgUrl;
      } else {
        this.redpacketForm.popupMaterialUrl = key === 'v2' ? defaultPopupImgV2 : defaultPopupImgV1;
      }
      this.usePopupKey = key;
    },
    onCancel() {
      this.$router.push({
        path: '/marketing/redpacket/redpacket-mgr'
      });
    },

    /**
     * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
     * @param itemDetailDTO
     * @param isFromServer 是否转换服务端返回的数据，否则转换页面提交服务的数据
     */
    convertMoneyUnit(itemDetailDTO, isFromServer) {
      if (!itemDetailDTO) {
        return;
      }
      //转换函数
      let convert = isFromServer
        ? v => {
            return moneyUtil.convertHundredMoneyUnit(v, true);
          }
        : v => {
            return moneyUtil.convertHundredMoneyUnit(v, false);
          };
      //thresholdFee , discountFee: 红包门槛
      if (!!itemDetailDTO) {
        itemDetailDTO.thresholdFee = convert(itemDetailDTO.thresholdFee);
        itemDetailDTO.totalFee = convert(itemDetailDTO.totalFee);
      }
    },

    handleSelectStore() {
      this.showStoreDialog = true;
    },

    onStoreChoosed(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.redpacketForm.validateField('suitStoreType');
    },

    handleImportStore() {
      this.resolveXlsDialogVisible = true;
    },

    onResolveImportStore(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.redpacketForm.validateField('suitStoreType');
    },

    handleDelStoreItem(groupIndex, storeIndex) {
      this.storeList.splice(groupIndex * storeGroupCount + storeIndex, 1);
      this.assembleGroupStoreList();
      this.$refs.redpacketForm.validateField('suitStoreType');
    },
    assembleGroupStoreList() {
      this.groupStoreList = [];
      let start = 0;
      while (start < this.storeList.length) {
        //每6个分成一组展示
        this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
        start += storeGroupCount;
      }
    },

    onSubmit(refName) {
      this.$refs[refName]
        .validate()
        .then(valid => {
          if (!valid) {
            return;
          }
          const params = {
            ...this.redpacketForm
          };
          this.convertMoneyUnit(params, false);

          // 处理活动时间
          params.startTime = params.dateRange[0];
          params.endTime = params.dateRange[1];
          delete params.dateRange;

          // 处理红包有效时间
          if (params.cashCouponExpireType === redpacketEnum.expireType.DATERANGE) {
            params.cashCouponStartTime = params.cashCouponDateRange[0];
            params.cashCouponEndTime = params.cashCouponDateRange[1];
          } else if (params.cashCouponExpireType === redpacketEnum.expireType.DAY) {
            params.cashCouponFixedTerm = params.cashCouponFixedTerm_day;
          } else {
            params.cashCouponFixedTerm = params.cashCouponFixedTerm_nextday;
          }

          delete params.cashCouponDateRange;
          delete params.cashCouponFixedTerm_day;
          delete params.cashCouponFixedTerm_nextday;

          if (params.suitStoreType === suitStoreTypeEnum.part) {
            params.storeIds = '';
            const len = this.storeList.length;
            this.storeList.forEach((store, index) => {
              params.storeIds += store.id;
              if (index < len - 1) {
                params.storeIds += ',';
              }
            });
          }
          if (params.luckyMoneyBackgroundType === redpacketEnum.redpacketStyle.custom) {
            params.luckyMoneyBackgroundUrl = params.styleUrl.imgUrl;
            delete params.styleUrl;
          }
          if (this.redpacketForm.posterLogo) {
            const posterLogo = this.redpacketForm.posterLogo.imgUrl;
            delete params.posterLogo;
            params.posterLogo = posterLogo;
          }
          if (this.popupMaterialUrlType === 0) {
            params.popupMaterialUrl = defaultPopupImgV2;
          }
          // 自动提现没有提现时间，默认365天
          if (this.isABLE) {
            params.cashCouponExpireType = 1;
            params.cashCouponFixedTerm = 365;
          }

          this.loading = true;
          redpacketApi
            .addPlan(params)
            .done(res => {
              this.$router.push({
                path: '/marketing/redpacket/redpacket-mgr'
              });
            })
            .always(() => {
              this.loading = false;
            });
        })
        .catch(res => {
          return false;
        });
    },

    /**
     * 获取红包详情
     */
    doSearch: function() {
      this.loading = true;
      redpacketApi
        .planList({ planId: this.$route.query.planId })
        .then(rs => {
          if (rs.data) {
            rs.data.totalFee = (rs.data.totalFee / 100).toFixed(2);
            rs.data.thresholdFee = (rs.data.thresholdFee / 100).toFixed(2);
            this.redpacketForm = rs.data || {};
            if (rs.data.startTime && rs.data.endTime) {
              this.redpacketForm.dateRange = [rs.data.startTime, rs.data.endTime];
            }
            if (rs.data.cashCouponStartTime && rs.data.cashCouponEndTime) {
              this.redpacketForm.cashCouponDateRange = [rs.data.cashCouponStartTime, rs.data.cashCouponEndTime];
            }

            if (rs.data.cashCouponExpireType === redpacketEnum.expireType.DAY) {
              this.redpacketForm.cashCouponFixedTerm_day = rs.data.cashCouponFixedTerm;
            } else {
              this.redpacketForm.cashCouponFixedTerm_nextday = rs.data.cashCouponFixedTerm;
            }

            this.redpacketForm.posterType = rs.data.posterType || posterTypeEnum.classify.value;
            this.redpacketForm.posterContent = rs.data.posterContent;
            this.redpacketForm.posterLogo = {
              id: '',
              imgUrl: rs.data.posterLogo
            };

            let popupMaterialUrl = rs.data.popupMaterialUrl || '';

            if (popupMaterialUrl.indexOf('bg-of-redpack-popup') !== -1) {
              this.popupMaterialUrlType = 0;
            } else {
              this.tmpPopupMaterialUrl = {
                id: '',
                imgUrl: popupMaterialUrl
              };
              this.redpacketForm.popupMaterialUrl = popupMaterialUrl;
            }

            if (rs.data.storeIds) {
              let storeIdList = rs.data.storeIds.split(',');
              storeIdList = storeIdList.filter(storeId => {
                return !!storeId;
              });
              storeIdList.forEach(storeId => {
                this.storeList.push(
                  this.allStoreList.find(store => {
                    return store.id === parseInt(storeId);
                  })
                );
              });
              this.assembleGroupStoreList();
            }
          }
        })
        .catch(err => {
          console.error(err);
        })
        .always(() => {
          this.loading = false;
        });
    },

    onBlurInput() {
      this.$refs.redpacketForm.validateField('cashCouponExpireType');
    },
    //去除等级名称输入框的前后空格
    removeSpace(key) {
      this.redpacketForm[key] = !!this.redpacketForm[key] ? this.redpacketForm[key].replace(/(^\s*)|(\s*$)/g, '') : '';
    }
  }
};
</script>

<style lang="less">
.redpacket-add {
  .store-list-box {
    margin-bottom: 20px;
    width: 800px;

    .store-label {
      height: 30px;
      line-height: 30px;
      background: rgba(245, 245, 245, 1);
      padding-left: 23px;
      font-size: 14px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(51, 51, 51, 1);
    }

    .store-content {
      max-height: 303px;
      border: 1px solid rgba(235, 235, 235, 1);
      padding: 14px 23px;
      overflow: auto;

      .store-item-box {
        display: inline-block;
        vertical-align: top;
        margin-right: 50px;
      }

      .el-tag + .el-tag {
        margin-top: 15px;
      }
    }
  }

  .poster-name {
    width: 220px;
    text-align: center;
    position: absolute;
    left: 38px;
    top: 88px;
    height: 21px;
    font-size: 15px;
    font-family: PingFangSC-Medium, PingFang SC;
    font-weight: 500;
    color: #df9958;
    line-height: 21px;
  }

  .poster-money {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 110px;
    height: 37px;
    font-size: 29px;
    font-family: DINPro-Medium, DINPro;
    font-weight: 500;
    color: rgba(229, 50, 50, 1);
    line-height: 37.5px;
  }

  .poster-date {
    width: 100%;
    text-align: center;
    position: absolute;
    top: 270px;
    font-size: 14px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(255, 255, 255, 1);
    line-height: 20px;
  }
}
</style>
