<template>
  <div class="integar-edit">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/card-pack/list' }">卡包列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ isView? '查看' : isEdit ? '编辑' : '新增' }}卡包</el-breadcrumb-item>
    </el-breadcrumb>

    <el-form
      :model="form"
      :rules="rules"
      label-width="135px"
      ref="form"
      v-loading="loading"
      class="integar-form el-form-w350"
    >
      <el-form-item label="卡包名称：" prop="name">
        <el-input v-model.trim="form.name" maxlength="15" :disabled="isView" />
      </el-form-item>

      <el-form-item label="卡包渠道：">
        <el-radio-group v-model="form.channel" :disabled="isDisabled">
          <el-radio :label="CHANNEL.REGION.value">{{ CHANNEL.REGION.label }}</el-radio>
          <el-radio :label="CHANNEL.PROMOTION.value">{{ CHANNEL.PROMOTION.label }}</el-radio>
        </el-radio-group>

        <div class="tip-msg" v-if="form.channel === CHANNEL.REGION.value">本卡包仅支持被装修组件或卡包专区引用</div>
        <div class="tip-msg" v-else>本卡包仅支持被推广大使活动关联引用</div>
      </el-form-item>

      <el-form-item label="卡包副标题：" prop="subtitle">
        <el-input v-model.trim="form.subtitle" maxlength="80" :disabled="isView" />
      </el-form-item>

      <el-form-item label="活动时间：" prop="dateRange">
        <el-date-picker
          style="width: 420px"
          v-model="form.dateRange"
          type="datetimerange"
          :picker-options="pickerStart"
          :default-time="defaultTime"
          value-format="yyyy-MM-dd HH:mm:ss"
          format="yyyy-MM-dd HH:mm:ss"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          :disabled="isDisabled"
        >
        </el-date-picker>
      </el-form-item>

      <el-form-item label="内置优惠券：" prop="couponTableData">
        <el-button class="choose-coupon-btn" v-if="!isDisabled" @click="onChoose">
          选择优惠券
        </el-button>

        <span class="tip-msg ml5">券规则中的适用门店，库存数量，每人可购数量将以代金卡包中的设置项为准</span>
        <div v-if="showCouponEmpty && isDisabled">优惠券已被删除~</div>
        <el-form-item v-if="form.couponTableData && form.couponTableData.length" style="margin:0;">
          <div class="table">
            <coupon-table v-model="form.couponTableData" :disabled="isDisabled" :coupons="form.couponTableData" @reCouponVerify="reCouponVerify"/>
          </div>
        </el-form-item>
      </el-form-item>

      <el-form-item label="售价：" prop="salePrice">
        <el-input v-model.trim="form.salePrice" :disabled="isDisabled" maxlength="10" />
        <span class="ml10">元</span>
      </el-form-item>

      <el-form-item label="每门店库存数量：" prop="provNum">
        <el-input v-model.trim.number="form.provNum" maxlength="10" :disabled="isView"/>
        <div class="tip-msg">填写0为不限制，每个参与活动的门店独立计算库存</div>
      </el-form-item>

      <el-form-item label="每人可购买数量：" prop="buyLimit">
        <el-input v-model.trim.number="form.buyLimit" :disabled="isDisabled" maxlength="10" />
        <div class="tip-msg">填写0为不限制</div>
      </el-form-item>

      <el-form-item prop="suitStoreType" class="coupon-label dss-star" label="活动门店：">
        <template v-if="!isView">
        <el-radio-group v-if="isEnterpriseManager" v-model="form.suitStoreType" :disabled="isDisabled">
          <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part">指定门店</el-radio>
          <el-button
            size="mini"
            type="primary"
            v-if="form.suitStoreType === suitStoreTypeEnum.part && !isDisabled"
            @click="handleSelectStore()"
            >选择门店
          </el-button>
          <el-button
            size="mini"
            type="primary"
            v-if="form.suitStoreType === suitStoreTypeEnum.part && !isDisabled && isEnterpriseManager && curApp.industryKey !== 'home'"
            @click="handleImportStore()"
            >导入门店
          </el-button>
        </el-radio-group>

        <el-radio-group v-model="form.suitStoreType" v-else-if="!isEnterpriseManager">
          <el-radio :label="suitStoreTypeEnum.part" v-if="epStoreList && epStoreList.length && epStoreList.length < 2 && isStoreKeeper">本门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part" v-else>
            指定门店
            <el-button class="btn-rules left10" @click="handleSelectStore()"
              >选择门店</el-button
            >
          </el-radio>
        </el-radio-group>
        </template>

        <template v-else>
          <el-radio-group v-model="form.suitStoreType" :disabled="isDisabled">
            <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
            <el-radio :label="suitStoreTypeEnum.part">指定门店</el-radio>
          </el-radio-group>
        </template>

        <div class="tip-msg">注：优惠券添加后将默认适用于卡包活动的参与门店</div>
      </el-form-item>

      <div class="store-list-box" v-if="storeList && storeList.length && form.suitStoreType === suitStoreTypeEnum.part">
        <div class="store-label">已选门店</div>
        <div class="store-content">
          <div class="store-item-box" v-for="(storeList, groupIndex) in groupStoreList" :key="groupIndex">
            <el-tag
              v-for="(store, storeIndex) in storeList"
              :key="store.id"
              @close="handleDelStoreItem(groupIndex, storeIndex)"
              :closable="!isDisabled"
            >
              {{ store.name }}
            </el-tag>
          </div>
        </div>
      </div>

      <el-form-item label="卡包主图：" prop="materialsId">
        <div class="cp-radio">
          <el-radio-group v-model="form.phoType" :disabled="isView">
            <el-radio :label="0">默认主图</el-radio>
            <el-radio :label="1">自定义图片</el-radio>
          </el-radio-group>
        </div>

        <template v-if="form.phoType === 0">
          <img class="cp-img-default" :src="defaultImg" />
        </template>
        <template v-else>
          <choose-images
            v-model="form.materialsId[index]"
            :height="176"
            style="margin-right: 10px;"
            @input="onImageAdd(index)"
            @delete="onDeleteImg(index)"
            :multiple="form.materialsId[index].id === 0"
            v-for="(item, index) in form.materialsId"
            :key="index"
            :limit="limit"
            :disable="goodsImgCountLimit(index)"
          />
          <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
            建议尺寸750*750，建议图片小于2M
          </div>
        </template>
      </el-form-item>

      <el-form-item label="卡包描述：">
        <template v-if="loaded">
          <w-editor :data-source="form.cardExplain"></w-editor>
        </template>
      </el-form-item>
      <div class="bottom-button" v-if="!isView">
          <el-button @click="onCancle">
            取消
          </el-button>
          <el-button type="primary" @click="onSave">
            保存
          </el-button>
      </div>
    </el-form>

    
    <coupon-select-dialog
      v-model="showSelectCouponDialog"
      :selected-coupons="form.couponTableData"
      @selected="onCouponItemsSelected"
      type="card-pack"
      :ext-params="extParams"
    >
    </coupon-select-dialog>

    <store-select-dialog
      api-url="/wp/store/query/dept"
      :is-all="true"
      :selected-stores="storeList"
      enable-multiple
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
      title="门店状态"
      :is-show-area="isEnterpriseManager ? true : false"
      :is-show-dealer="isEnterpriseManager ? true : false"
    >
    </store-select-dialog>

    <local-resolve-xls @resolve="onResolveImportStore" :visible.sync="resolveXlsDialogVisible" title="导入门店" />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import CouponTable from './components/coupon-table.vue';
import CouponSelectDialog from '@/dss-wechat3rd/src/bz_components/coupon-select-dialog/index.vue';
import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
import defaultImg from './images/default.png';
import ChooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
import utils from '@/dss-common/utils/index.js';
import regex from '@/dss-wechat3rd/src/constants/regex';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
import cardPackApi from '@/dss-wechat3rd/src/api/cardPack';
import { STATUS, CHANNEL } from '@/dss-wechat3rd/src/constants/cardPackEnum.js';
import moneyUtil from '@/dss-common/utils/money';

const storeGroupCount = 6;

export default {
  components: {
    CouponTable,
    CouponSelectDialog,
    WEditor,
    ChooseImages,
    StoreSelectDialog,
    LocalResolveXls
  },
  data() {
    const checkNum = (rule, value, callback) => {
      if (!value || !value.length) {
        return callback('请选择优惠券');
      }
      value.forEach(v => {
        if (!v.quantitys) {
          return callback('请输入优惠券数量');
        } else if (isNaN(v.quantitys) || v.quantitys > 100) {
          return callback('请输入1-100之间的正整数');
        }
      });
      return callback();
    };

    const checkTime = (rule, value, callback) => {
      this.form.couponTableData.forEach(v => {
        if (
          v.endTime &&
          this.form.dateRange[0] &&
          (new Date(this.form.dateRange[0]) < v.beginTime || new Date(this.form.dateRange[1]) > v.endTime)
        ) {
          return callback('活动时间需在优惠券时间范围内');
        }
      });
      return callback();
    };

    const checkBuyLimit = (rule, value, callback) => {
      if (this.form.provNum && (value > this.form.provNum || value === 0)) {
        return callback('每人可购买数不可超过总数');
      }
      return callback();
    };

    const storeValidator = (rule, value, callback) => {
      if (this.form.suitStoreType === suitStoreTypeEnum.all) {
        return callback();
      } else {
        if (this.storeList && this.storeList.length) {
          return callback();
        } else if (this.epStoreList && this.epStoreList.length < 2 && this.isStoreKeeper && this.curStore) {
          return callback();
        } else {
          return callback('请选择参与门店');
        }
      }
    };

    const checkGoodsMaterialsId = (rule, value, callback) => {
      if (!value || (value.length === 1 && !value[0].id && this.form.phoType === 1)) {
        return callback('请至少添加一张卡包主图');
      }
      return callback();
    };
    return {
      id: undefined,
      itemNo: undefined,
      showSelectCouponDialog: false,
      defaultImg,
      extParams: null,
      limit: 5,
      isLoading: false,
      suitStoreTypeEnum,
      isEdit: false,
      isView: false,
      pocketStatus: STATUS.INITIAL.value,
      storeList: [],
      groupStoreList: [],
      showStoreDialog: false,
      resolveXlsDialogVisible: false,
      loading: false,
      loaded: false,
      showCouponEmpty: false,
      CHANNEL,

      form: {
        name: '',
        channel: CHANNEL.REGION.value,
        subtitle: '',
        dateRange: [],
        salePrice: '',
        provNum: '',
        buyLimit: '',
        phoType: 0,
        cardExplain: {
          describe: ''
        },
        materialsId: [],
        materialUrls: [],
        couponTableData: [],
        suitStoreType: suitStoreTypeEnum.all
      },
      rules: {
        name: [
          { required: true, message: '请输入卡包名称', trigger: 'blur' },
          { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' }
        ],
        subtitle: [
          {
            min: 1,
            max: 80,
            message: '长度在 1 到 80 个字符',
            trigger: 'blur'
          }
        ],
        dateRange: [
          {
            type: 'array',
            required: true,
            message: '请选择活动时间'
          },
          {
            validator: checkTime,
            trigger: 'change'
          }
        ],
        salePrice: [
          { required: true, message: '请输入售价', trigger: 'blur' },
          {
            pattern: regex.couponPrice.reg,
            message: regex.couponPrice.msg,
            trigger: 'blur'
          }
        ],
        provNum: [
          { required: true, message: '请输入库存数量', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          }
        ],
        buyLimit: [
          { required: true, message: '请输入每人可购买数量', trigger: 'blur' },
          {
            pattern: regex.quantity.reg,
            message: regex.quantity.msg,
            trigger: 'blur'
          },
          {
            validator: checkBuyLimit,
            trigger: 'blur'
          }
        ],
        couponTableData: [{ required: true, validator: checkNum, trigger: 'change' }],
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        materialsId: [
          {
            required: true,
            validator: checkGoodsMaterialsId,
            trigger: 'change'
          }
        ]
      }
    };
  },
  mounted() {
    const id = this.$route.query.id;
    const isView = this.$route.query.isView;

    if (id) {
      this.id = id;
      this.isEdit = true;
      this.loading = true;
      this.isView = !!Number(isView);
      this.getDetails();
    } else {
      this.loaded = true;
      this.initGoodsMaterials();

      if (!this.isEnterpriseManager) {
        this.form.suitStoreType = this.suitStoreTypeEnum.part;
      }
    }
  },
  computed: {
    ...mapState({
      roleList: 'roleList',
      epStoreList: 'storeList',
      curApp: 'curApp',
      curStore: 'curStore'
    }),
    /**
     * 是否企业管理员
     */
    isEnterpriseManager() {
      return !!this.roleList && this.roleList.indexOf('common_role_enterprise') !== -1;
    },
    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },
    goodsImgCountLimit() {
      return function(index) {
        return index < 5;
      };
    },
    maxLength() {
      this.limit = 5;
      return 5;
    },
    pickerStart() {
      return {
        disabledDate: time => time.getTime() < Date.now() - 24 * 60 * 60 * 1000 // 只能选择今天以后的日期
      };
    },
    defaultTime() {
      const nowDate = new Date();
      const hour = nowDate.getHours() + parseInt((nowDate.getMinutes() + 1) / 60);
      // 默认加 1 分钟
      const min = (nowDate.getMinutes() + 1) % 60;
      const seconds = nowDate.getSeconds();
      return [`${hour}:${min}:${seconds}`];
    },
    isDisabled() {
      return [STATUS.ONGOING.value, STATUS.SELL_OUT.value].includes(this.pocketStatus) || this.isView;
    }
  },
  watch: {
    'form.provNum'() {
      if (this.form.buyLimit && !this.isEdit) {
        this.$refs.form.validateField('buyLimit');
      }
    },
    'form.couponTableData'() {
      this.$refs.form.validateField('couponTableData');
      if (this.form.dateRange.length) this.$refs.form.validateField('dateRange');
    }
  },
  methods: {
    onSave() {
      this.$refs.form.validate(valid => {
        if (!valid) {
          return;
        }
        this.loading = true;

        let { name, salePrice, provNum, buyLimit, suitStoreType, subtitle, dateRange, cardExplain, channel } = {
          ...this.form
        };

        salePrice = moneyUtil.convertHundredMoneyUnit(salePrice, false);
        const params = { name, salePrice, provNum, buyLimit, subtitle };

        params.id = this.id;
        params.itemNo = this.itemNo;
        params.action = `${this.id ? '修改' : '新增'}卡包`;
        params.cardExplain = cardExplain.describe;
        params.itemImageUrls = [];
        params.couponInfos = [];
        params.suitStore = suitStoreTypeEnum.part;
        params.startTime = dateRange[0];
        params.endTime = dateRange[1];
        params.channel = channel;

        if (suitStoreType === suitStoreTypeEnum.part) {
          params.storeNames = [];
          this.storeList.forEach((store, index) => {
            params.storeNames.push({ id: store.id });
          });
        } else {
          params.suitStore = suitStoreTypeEnum.all;
        }

        // 非多门店店长，固定本门店
        if (
          this.isStoreKeeper &&
          this.epStoreList &&
          this.epStoreList.length &&
          this.epStoreList.length < 2 &&
          this.curStore
        ) {
          params.storeNames = [{ id: this.curStore.id }];
        }

        if (this.form.phoType === 0) {
          const src = defaultImg.includes('http') ? defaultImg : process.env.VUE_APP_CDN_URL  + defaultImg;

          params.itemImageUrls.push(src);
        } else {
          this.form.materialsId.forEach(v => {
            if (v.imgUrl) params.itemImageUrls.push(v.imgUrl);
          });
        }
        this.form.couponTableData.forEach(v => {
          params.couponInfos.push({ couponId: v.id, couponNum: v.quantitys });
        });

        cardPackApi[this.id ? 'update' : 'insert'](params)
          .then(
            res => {
              this.$router.push({
                path: '/marketing/card-pack/list'
              });
            },
            error => {}
          )
          .always(() => {
            this.loading = false;
          });
      });
    },

    getDetails() {
      cardPackApi
        .detial({ pocketId: this.id })
        .then(res => {
          if (!res.data) return;
          const detials = res.data;
            const {
              name,
              subtitle,
              salePrice,
              provNum,
              buyLimit,
              suitStore,
              storeNames,
              couponInfos,
              itemImageUrls,
              cardExplain,
              itemNo,
              pocketStatus,
              startTime,
              endTime,
              channel
            } = detials;

          this.form.name = name;
          this.form.subtitle = subtitle;
          this.itemNo = itemNo;
          this.form.salePrice = moneyUtil.convertHundredMoneyUnit(salePrice, true);
          this.form.provNum = provNum;
          this.form.buyLimit = buyLimit;
          this.form.cardExplain.describe = cardExplain;
          this.form.suitStoreType = suitStore;
          this.form.channel = channel;
          this.form.couponTableData = (couponInfos || []).map(item => {
            item.quantitys = item.couponNum;
            return item;
          });

          if (suitStore === suitStoreTypeEnum.part) {
            this.storeList = storeNames;
            this.groupStoreList.push(storeNames);
          }
          if (itemImageUrls && !itemImageUrls[0].includes('dss-web-portal')) {
            this.form.phoType = 1;
            this.form.materialUrls = itemImageUrls;
          }
          if (!this.form.couponTableData.length) {
            this.showCouponEmpty = true;
          }
          this.form.dateRange = [startTime, endTime];
          this.pocketStatus = pocketStatus;
          this.loaded = true;
          this.initGoodsMaterials();
        })
        .always(() => {
          this.loading = false;
        });
    },

    getLimit() {
      this.limit = this.maxLength - this.form.materialsId.length + 1;
    },

    // 添加商品图片
    onImageAdd(index) {
      // 多选返回的是图片数组，遍历数组
      if (index === this.form.materialsId.length - 1) {
        const deletedUrl = this.form.materialsId.splice(index, 1);
        deletedUrl[0].forEach(item => {
          if (this.form.materialsId.length < 5) {
            this.form.materialsId.push(item);
          }
        });
        index = this.form.materialsId.length - 1;
      } else {
        this.form.materialUrls[index] = this.form.materialsId[index].imgUrl;
      }
      this.addWaitUploadImage(this.form.materialsId, this.form.materialUrls, index);
      this.getLimit();
    },

    // 更新图片列表
    addWaitUploadImage(materialsId, materialUrls, index) {
      if (utils.isUndefined(index) || index === materialsId.length - 1) {
        materialUrls.push('');
        materialsId.push({
          id: 0,
          imgUrl: ''
        });
      }
    },

    // 删除图片
    onDeleteImg(index) {
      this.form.materialsId.splice(index, 1);
      this.form.materialUrls.splice(index, 1);
      this.getLimit();
    },

    // 初始化 商品图片素材
    initGoodsMaterials() {
      const materialsId = this.form.materialsId ? this.form.materialsId : [];
      const newUrls = [];
      let materialUrls = this.form.materialUrls;

      if (materialUrls && materialUrls.length) {
        materialUrls.forEach((imgUrl, index) => {
          if (imgUrl) {
            materialsId[index] = {
              id: materialsId[index],
              imgUrl: imgUrl
            };
            newUrls.push(imgUrl);
          }
        });
        materialUrls = newUrls;
      }

      this.addWaitUploadImage(materialsId, materialUrls);
      this.getLimit();
      this.form.materialsId = materialsId;
      this.form.materialUrls = materialUrls;
    },

    onCouponItemsSelected(coupons) {
      this.form.couponTableData = coupons;
    },

    onChoose() {
      this.extParams = {
        // suitStoreType: 0
      };
      this.showSelectCouponDialog = true;
    },

    onCancle() {
      this.$router.push('/marketing/card-pack/list');
    },

    reCouponVerify() {
      this.$refs.form.validateField('couponTableData');
    },

    // 导入门店
    handleSelectStore() {
      this.showStoreDialog = true;
    },

    onStoreChoosed(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    },

    handleImportStore() {
      this.resolveXlsDialogVisible = true;
    },

    onResolveImportStore(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    },

    handleDelStoreItem(groupIndex, storeIndex) {
      this.storeList.splice(groupIndex * storeGroupCount + storeIndex, 1);
      this.assembleGroupStoreList();
      this.$refs.form.validateField('suitStoreType');
    },
    assembleGroupStoreList() {
      this.groupStoreList = [];
      let start = 0;
      while (start < this.storeList.length) {
        // 每6个分成一组展示
        this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
        start += storeGroupCount;
      }
    }
  }
};
</script>

<style lang="less" scoped>
.ml5{
   margin-left: 5px;
}
.tip-msg {
  color: #999;
  font-size: 12px;
}
.cp-radio {
  overflow: hidden;
  width: 150px;
  .el-radio + .el-radio {
    margin-left: 0px;
  }
  .el-radio {
    line-height: 40px;
  }
}
.cp-img-default {
  width: 176px;
  height: 176px;
}
.ml10 {
  margin-left: 10px;
}

.el-form-w350{
  /deep/ .el-input,.el-input__inner{
    // 修复  珠海TAPD记录的bug，bugID：1001597，如需要修改请另起类名
    // width: 380px;
    // max-width: 380px !important;
  }
  /deep/ .el-tag {
    margin-right: 10px;
  }
}
</style>
