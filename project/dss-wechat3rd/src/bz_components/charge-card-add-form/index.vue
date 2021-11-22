<template>
  <div class="charge-card-add">
    <el-form :model="cardForm"
             ref="cardForm"
             :rules="rules"
             v-loading="loading"
             class="card-form"
             :disabled="isEdit"
             label-width="105px">

      <el-form-item label="充值卡类型："
                    class="card-label">
        <div class="chargeCard-radio">
          <el-radio-group v-model="cardForm.special">
            <el-radio :label="cardEnum.chargeCardType.ordinary">普通充值卡</el-radio>
            <el-radio :label="cardEnum.chargeCardType.newUser">新用户充值卡</el-radio>
          </el-radio-group>
        </div>
      </el-form-item>

      <!--公用字段-->
      <el-form-item label="卡项名称："
                    prop="name"
                    class="card-label">
        <el-input placeholder="请输入卡项名称"
                  v-model="cardForm.name"
                  class="card-w366 primary-inputHeight"></el-input>
      </el-form-item>

      <!--充值卡字段-->
      <el-form-item label="充值金额："
                    prop="chargeAmount"
                    v-if="cardForm.type === cardEnum.cardType.chargeCard"
                    class="card-label">
        <el-input placeholder="请输入金额"
                  v-model="cardForm.chargeAmount"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>
      <!--充值卡字段-->
      <el-form-item label="赠送金额："
                    prop="giftAmount"
                    class="card-label">
        <el-input placeholder="请输入赠送金额"
                  v-model="cardForm.giftAmount"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>

      <!--公用字段-->
      <el-form-item label="卡项描述："
                    prop="explain"
                    class="card-label">
        <el-input type="textarea"
                  v-model="cardForm.cardExplain"
                  :autosize="{ minRows: 8, maxRows: 8}"
                  placeholder=""
                  class="card-describe"></el-input>
      </el-form-item>
      <!-- <hr class="card-hr" /> -->

      <!-- 暂时不显示背景图功能 - 小程序无样式 -->
      <!-- <el-form-item label="卡项样式："
                    class="card-label">
        <div class="card-radio">
          <el-radio-group v-model="cardForm.style">
            <el-radio :label="cardEnum.cardStyle.default">默认背景图</el-radio>
            <el-radio :label="cardEnum.cardStyle.custom">自定义图片</el-radio>
          </el-radio-group>
        </div>
        <div class="card-box">
          <div class="card-image-choose-container"
               v-if="cardForm.style === cardEnum.cardStyle.custom">
            <image-selector style="margin-top: 10px; "
                            :canReset="false"
                            v-model="cardForm.styleUrl"
                            @delete="onDeleteImg" />
            <div class="img-notes">建议尺寸：690x390，图片不大于1M</div>
          </div>
          <div class="card-default-img-container">
            <img class="card-default-img"
                 :src="computeCardBg" />
            <div class="card-desc">
              <div class="card-name">{{cardForm.name || '卡项名称'}}</div>
              <div class="card-content">
                <div class="card-content-inner">
                  <div class="validity">
                    赠送￥: {{cardForm.giftAmount || '-'}}
                  </div>
                  <div class="card-type">
                    充值卡
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item> -->

      <!--公用操作-->
      <div class="bottom-button">
        <!-- <el-button @click="onGiveUp">取消</el-button> -->
        <el-button type="primary" @click="onSubmit('cardForm')">保存</el-button>
      </div>
    </el-form>

    

  </div>
</template>

<script>
import moneyUtil from '@/dss-common/utils/money';
import './index.less';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import constants from '@/dss-wechat3rd/src/constants';
import regex from '@/dss-wechat3rd/src/constants/regex';
import services from '@/dss-common/utils/services';

import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  name: 'ChargeCardAddForm',
  components: {
    ImageSelector
  },
  data() {
    return {
      cardEnum,
      goodsTypeEnum,
      loading: false,
      isEdit: !!this.$route.query.itemNo,
      cardForm: {
        type: cardEnum.cardType.chargeCard,
        validityType: cardEnum.validityType.permanent,
        special: cardEnum.chargeCardType.ordinary
      },
      rules: {
        name: [
          { required: true, message: '请输入卡项名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        chargeAmount: [
          { required: true, message: '请输入充值金额', trigger: 'blur' },
          {
            pattern: regex.chargePrice.reg,
            message: regex.chargePrice.msg,
            trigger: 'blur'
          }
        ],
        giftAmount: [
          { required: true, message: '请输入赠送金额', trigger: 'blur' },
          {
            pattern: regex.chargePrice.reg,
            message: regex.chargePrice.msg,
            trigger: 'blur'
          }
        ]
      }
    };
  },

  computed: {
    computeCardBg() {
      if (this.cardForm.style === cardEnum.cardStyle.default) {
        return chargeCardBg;
      } else {
        return this.cardForm.styleUrl ? this.cardForm.styleUrl.imgUrl : chargeCardBg;
      }
    }
  },
  methods: {
    initCardForm(cardDetail = null) {
      if (cardDetail) {
        this.cardForm = cardDetail;
      } else {
        this.cardForm = {
          ...this.cardForm,
          ...{
            name: '',
            salePrice: '',
            chargeAmount: '',
            giftAmount: '',
            cardExplain: '',
            style: cardEnum.cardStyle.default,
            styleUrl: null
          }
        };
      }
    },

    getCardDetail() {
      const params = {
        itemNo: this.$route.query.itemNo
      };
      services
        .get(constants.Api.card.detail, {
          params,
          action: '卡项详情'
        })
        .done(res => {
          this.convertMoneyUnit(res.data, true);
          this.cardForm = res.data;
          if (this.cardForm.styleUrl) {
            this.cardForm.styleUrl = {
              imgUrl: this.cardForm.styleUrl
            };
          }
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
      //chargeAmount: 充值金额 giftAmount: 赠送金额
      if (!!itemDetailDTO) {
        itemDetailDTO.salePrice = convert(itemDetailDTO.salePrice);
        itemDetailDTO.chargeAmount = convert(itemDetailDTO.chargeAmount);
        itemDetailDTO.giftAmount = convert(itemDetailDTO.giftAmount);
      }
    },

    onSubmit(refName) {
      this.$refs[refName].validate(valid => {
        if (valid) {
          this.loading = true;
          const params = this.$plain(this.cardForm);
          if (params.styleUrl) {
            params.styleUrl = params.styleUrl.imgUrl;
          }
          if (params.itemCardServerList) {
            params.itemCardServerList = params.itemCardServerList.map(serverItem => {
              return {
                serverItemNo: serverItem.itemNo || serverItem.serverItemNo,
                serverCount: serverItem.serverCount
              };
            });
          }
          if (params.type === cardEnum.cardType.chargeCard) {
            params.salePrice = params.chargeAmount;
          }

          const url = this.$route.query.itemNo ? constants.Api.card.update : constants.Api.card.add;
          this.convertMoneyUnit(params, false);
          services
            .json(url, params, {
              action: '添加充值卡'
            })
            .done(res => {
              this.$emit('done');
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    onDeleteImg() {
      this.cardForm.styleUrl = null;
    },
    //取消时返回上一页
    onGiveUp() {
      this.$router.back();
    }
  },

  mounted() {
    this.initCardForm();
    if (this.$route.query.itemNo) {
      this.getCardDetail();
    }
  }
};
</script>

<style scoped>
</style>
