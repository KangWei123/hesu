<template>
  <div class="card-add">
    <el-form :model="cardForm"
             ref="cardForm"
             :rules="rules"
             :disabled="disableEdit == 1"
             v-loading="loading"
             class="card-form"
             label-width="95px">
      <goods-select-dialog v-model="showAddServiceDialog"
                           enable-multiple
                           :selected-list="cardForm.itemCardServerList"
                           :active-tabs="[goodsTypeEnum.server]"
                           @selected="onChooseService" />

      <el-form-item label="选择卡项类别："
                    v-if="showAddCharge"
                    prop="cardType"
                    class="card-type-label">
        <el-radio-group v-model="cardForm.type"
                        @change="handleChangeCardType">
          <el-radio :label="cardEnum.cardType.timesCard"
                    :disabled="disableCardType && cardForm.type !== cardEnum.cardType.timesCard">次卡</el-radio>
          <img class="img-radio"
               src="../../images/goods/time-card-radio.png" />
          <el-radio :label="cardEnum.cardType.chargeCard"
                    :disabled="disableCardType && cardForm.type !== cardEnum.cardType.chargeCard">充值卡</el-radio>
          <img class="img-radio"
               src="../../images/goods/charge-card-radio.png" />
        </el-radio-group>
      </el-form-item>
      <!--公用字段-->
      <el-form-item label="卡项名称："
                    prop="name"
                    class="card-label">
        <el-input placeholder="请输入卡项名称"
                  v-model="cardForm.name"
                  class="card-w366 primary-inputHeight"></el-input>
      </el-form-item>

      <!--次数卡字段-->
      <el-form-item label="售价："
                    prop="salePrice"
                    v-if="cardForm.type === cardEnum.cardType.timesCard"
                    class="card-label">
        <el-input placeholder="请输入价格"
                  v-model="cardForm.salePrice"
                  class="card-w157 primary-inputHeight"></el-input>
        <span class="card-unit">元</span>
      </el-form-item>

      <!--次数卡字段-->
      <el-form-item label="内容："
                    v-if="cardForm.type === cardEnum.cardType.timesCard"
                    prop="itemCardServerList"
                    class="card-label">
        <el-button @click="handleAddService">添加服务</el-button>
        <div class="notes">设置次卡支持的服务项目和可用次数</div>
        <div class="card-service-box">
          <el-table :data="cardForm.itemCardServerList"
                    v-if="cardForm.itemCardServerList && cardForm.itemCardServerList.length">
            <el-table-column label="服务名称">
              <span slot-scope="scope"
                    class="ellipsis"
                    :title="scope.row.name || scope.row.serverItemName">
                {{ scope.row.name || scope.row.serverItemName }}
              </span>
            </el-table-column>
            <el-table-column width="200"
                             label="次数">
              <template slot-scope="scope">
                <el-input-number :min="0"
                                 :max="99999"
                                 :controls="false"
                                 style="width: 80px;"
                                 v-model="scope.row.serverCount">
                </el-input-number>
                <span>次</span>
              </template>
            </el-table-column>

            <el-table-column label="操作"
                             width="120">
              <template slot-scope="scope">
                <el-button class="table-btn"
                           @click="handleRemove(scope.row.index)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form-item>

      <!--充值卡字段-->
      <el-form-item label="充值金额："
                    prop="chargeAmount"
                    v-if="cardForm.type === cardEnum.cardType.chargeCard"
                    class="card-label">
        <el-input-number placeholder="请输入金额"
                         :controls="false"
                         :precision="2"
                         v-model="cardForm.chargeAmount"
                         class="card-w157 primary-inputHeight"></el-input-number>
        <span class="card-unit">元</span>
      </el-form-item>
      <!--充值卡字段-->
      <el-form-item label="赠送金额："
                    prop="giftAmount"
                    :min="0"
                    :max="9999999"
                    v-if="cardForm.type === cardEnum.cardType.chargeCard"
                    class="card-label">
        <el-input-number placeholder="请输入赠送金额"
                         :precision="2"
                         :controls="false"
                         :min="0"
                         :max="9999999"
                         v-model="cardForm.giftAmount"
                         class="card-w157 primary-inputHeight"></el-input-number>
        <span class="card-unit">元</span>
      </el-form-item>

      <!--公用字段-->
      <el-form-item label="有效期："
                    v-if="cardForm.type == cardEnum.cardType.timesCard"
                    class="card-label"
                    prop="validity">
        <el-radio-group v-model="cardForm.validityType"
                        @change="onValidityChang">
          <el-radio :label="cardEnum.validityType.permanent">永久有效</el-radio>
          <el-radio :label="cardEnum.validityType.custom">
            <el-input-number v-model="cardForm.validity"
                             :controls="false"
                             class="card-day primary-inputHeight"
                             :disabled="cardForm.validityType===cardEnum.validityType.permanent">
            </el-input-number>
            <span class="card-unit">天</span>
          </el-radio>
        </el-radio-group>
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
      <hr class="card-hr" />
      <el-form-item label="卡项样式："
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
            <image-selector v-model="cardForm.styleUrl"
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
                  <div class="validity"
                       v-if="cardForm.type === cardEnum.cardType.timesCard">
                    有效期: {{cardForm.validityType === cardEnum.validityType.permanent ? '永久有效' : (cardForm.validity || '-') + '天'}}
                  </div>
                  <div class="validity"
                       v-else>
                    赠送￥: {{cardForm.giftAmount || '-'}}
                  </div>
                  <div class="card-type">
                    {{cardForm.type === cardEnum.cardType.timesCard ? '次数卡' : '充值卡'}}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <!--公用操作-->
      <el-form-item>
        <el-button type="primary"
                   @click="onSubmit('cardForm')">保存</el-button>
      </el-form-item>
    </el-form>

  </div>
</template>

<script>
import moneyUtil from '@/dss-common/utils/money';
import './css/CardAddForm.less';
import cardEnum from '@/dss-wechat3rd/src/constants/cardEnum';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import constants from '@/dss-wechat3rd/src/constants';
import regex from '@/dss-wechat3rd/src/constants/regex';
import services from '@/dss-common/utils/services';

import timeCardBg from '@/dss-wechat3rd/src/images/goods/time-card-bg.png';
import chargeCardBg from '@/dss-wechat3rd/src/images/goods/charge-card-bg.png';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

export default {
  name: 'CardAddForm',
  components: {
    GoodsSelectDialog,
    ImageSelector
  },
  props: {
    showAddCharge: {
      type: Boolean,
      default: true
    },
    disableEdit: {
      type: String,
      default: '0'
    }
  },
  data() {
    let checkValidity = (rule, v, callback) => {
      let { validity, type, validityType } = this.cardForm;
      console.log(validity, validityType, cardEnum.validityType.custom, type, cardEnum.cardType.timesCard);

      if (validityType === cardEnum.validityType.custom && type === cardEnum.cardType.timesCard) {
        if (!/^[+]{0,1}(\d+)$/.test(validity)) {
          return callback(new Error('请输入正整数'));
        }
        if (validity > 999999) {
          return callback(new Error('有效期天数必须是在0到999999之间的正整数'));
        }
        if (validity == 0) {
          return callback(new Error('有效期天数必须大于0'));
        }
      }
      callback();
    };
    return {
      cardEnum,
      goodsTypeEnum,
      disableCardType: false,
      loading: false,
      allServiceList: null,
      showAddServiceDialog: false,
      cardForm: {
        validityType: cardEnum.validityType.permanent,
        type: cardEnum.cardType.timesCard,
        itemCardServerList: []
      },
      rules: {
        name: [
          { required: true, message: '请输入卡项名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        salePrice: [
          {
            required: true,
            validator: regex.goods.checkSalePrice,
            trigger: 'blur'
          }
        ],
        chargeAmount: [
          {
            required: true,
            validator: regex.goods.checkChargeAmount,
            trigger: 'blur'
          }
        ],
        giftAmount: [
          {
            required: false,
            validator: regex.goods.checkGiftAmount,
            trigger: 'blur'
          }
        ],
        itemCardServerList: [
          {
            required: true,
            validator: regex.goods.itemCardServerList,
            trigger: 'blur'
          }
        ],
        validity: [{ validator: checkValidity, trigger: 'change' }]
      }
    };
  },

  computed: {
    computeCardBg() {
      if (this.cardForm.style === cardEnum.cardStyle.default) {
        if (this.cardForm.type === cardEnum.cardType.timesCard) {
          return timeCardBg;
        } else {
          return chargeCardBg;
        }
      } else {
        if (this.cardForm.type === cardEnum.cardType.timesCard) {
          return this.cardForm.styleUrl ? this.cardForm.styleUrl.imgUrl : timeCardBg;
        } else {
          return this.cardForm.styleUrl ? this.cardForm.styleUrl.imgUrl : chargeCardBg;
        }
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
            validityType: cardEnum.validityType.permanent,
            validity: '',
            cardExplain: '',
            style: cardEnum.cardStyle.default,
            styleUrl: null,
            itemCardServerList: []
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
          const itemCardServerList = this.cardForm.itemCardServerList;
          if (itemCardServerList) {
            itemCardServerList.forEach(server => {
              server.itemNo = server.serverItemNo;
            });
          }
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
      //salePrice：售价 , chargeAmount: 充值金额 giftAmount: 赠送金额
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
            .post(url, params, {
              headers: {
                'Content-Type': 'application/json'
              },
              transformRequest: function(data, config, test) {
                return JSON.stringify(data);
              },
              action: '添加卡项'
            })
            .done(res => {
              // 跳转到列表页面
              this.$router.push({ path: '/beauty/goods-mgr/goods/card' });
            })
            .always(() => {
              this.loading = false;
            });
        } else {
          return false;
        }
      });
    },

    handleChangeCardType() {
      this.initCardForm();
    },

    handleRemove(index) {
      this.cardForm.itemCardServerList.splice(index, 1);
    },

    handleAddService() {
      this.showAddServiceDialog = true;
      /*
      if (!this.allServiceList) {
        this.loading = true;
        const params = {
          type: goodsTypeEnum.server.value
        };
        services.get(constants.Api.goods.list, {
          params,
          action: '服务列表'
        }).done(res => {
          if (res.data && res.data.length) {
            this.allServiceList = res.data;
            this.showAddServiceDialog = true;
          } else {
            this.$message('无可添加的服务项目');
          }
        }).always(() => {
          this.loading = false;
        });
      } else {
        this.showAddServiceDialog = true;
      }
      */
    },

    onChooseService(selectedServiceList) {
      this.cardForm.itemCardServerList = selectedServiceList;
    },

    goToIndex() {
      this.$router.push({ path: '/goods-manage/list/card' });
    },

    onDeleteImg() {
      this.cardForm.styleUrl = null;
    },
    onValidityChang(e) {
      this.$refs.cardForm.validateField('validity');
    }
  },

  mounted() {
    this.initCardForm();
    if (this.$route.query.itemNo) {
      this.disableCardType = true;
      this.getCardDetail();
    }
  }
};
</script>

<style scoped>
</style>
