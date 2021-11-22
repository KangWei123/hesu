<template>
  <div class="coupon-add">
    <el-form
      :model="couponForm"
      ref="couponForm"
      v-loading="loading"
      class="coupon-form"
      label-width="126px"
      label-suffix="："
    >
      <div class="content-label">
        <span class="index">1</span>
        <span class="label-name">券面设置</span>
      </div>

      <el-form-item label="优惠券类型" class="coupon-label">
        <span>{{ couponTypeMap[couponForm.couponCategory] }}</span>
      </el-form-item>
      <el-form-item label="优惠券名称" class="coupon-label">
        <span>{{ couponForm.name }}</span>
      </el-form-item>

      <el-form-item
        v-if="
          couponForm.couponCategory !== CouponType.GIFT_COUPON &&
          couponForm.couponCategory !== CouponType.PARKING_DURATION_COUPON &&
          couponForm.couponCategory !== CouponType.PARKING_AMOUNT_COUPON
        "
        label="消费门槛"
        class="coupon-label"
      >
        <span v-if="couponForm.minimumFee != 0">￥{{ couponForm.minimumFee | price }}</span>
        <span v-else>无门槛</span>
      </el-form-item>

      <el-form-item v-if="couponForm.couponCategory === CouponType.GIFT_COUPON" label="参考价值" prop="referenceValue">
        <span>￥{{ couponForm.referenceValue | price }}</span>
      </el-form-item>

      <el-form-item label="优惠方式" class="coupon-label">
        <span v-if="couponForm.couponCategory === CouponType.DISCOUNT_COUPON" class="orange">
          {{ couponForm.discountFee | discount }}折
        </span>
        <span
          v-else-if="
            couponForm.couponCategory === CouponType.PARKING_DURATION_COUPON ||
            couponForm.couponCategory === CouponType.PARKING_AMOUNT_COUPON
          "
          class="orange"
        >
          <template v-if="!couponForm.discountFee"> 免停车费 </template>
          <template v-else-if="couponForm.couponCategory === CouponType.PARKING_DURATION_COUPON">
            {{ (couponForm.discountFee * 60) | time2String }}
          </template>
          <template v-else> ￥{{ couponForm.discountFee | price }} </template>
        </span>
        <span
          v-else-if="couponForm.couponCategory === CouponType.LOGISTICS_COUPON && couponForm.discountFee === 0"
          class="orange"
        >
          免运费
        </span>
        <span v-else-if="couponForm.couponCategory === CouponType.GIFT_COUPON" class="orange">实物</span>
        <span v-else class="orange">￥{{ couponForm.discountFee | price }}</span>
      </el-form-item>

      <el-form-item label="优惠券有效期" class="coupon-label" prop="couponType">
        <span v-if="couponForm.couponType === 0">领取后{{ couponForm.fixedTerm }}天内有效</span>
        <span v-else>
          {{ couponForm.beginTime | time('YYYY-MM-DD') }} 至 {{ couponForm.endTime | time('YYYY-MM-DD') }} 有效
        </span>
      </el-form-item>

      <el-form-item label="使用须知" prop="rules">
        <el-input
          placeholder="请输入使用须知"
          type="textarea"
          v-model="couponForm.rules"
          maxlength="140"
          :autosize="{ minRows: 8, maxRows: 8 }"
          class="coupon-describe"
        />
      </el-form-item>

      <el-form-item label="礼品描述" prop="description" v-if="couponForm.couponCategory === CouponType.GIFT_COUPON">
        <w-editor :data-source="couponForm" param-name="description" :image-limit="30" />
      </el-form-item>

      <div class="content-label">
        <span class="index">2</span>
        <span class="label-name">领券设置</span>
      </div>

      <el-form-item label="发放渠道" class="coupon-label" prop="couponCentreStatus">
        <span>{{ provideChannelMap[couponForm.couponCentreStatus] }}</span>
      </el-form-item>

      <el-form-item
        label="支持扫码领券"
        class="coupon-label"
        prop="qrcodeCollectSwitch"
        v-if="couponForm.couponCentreStatus === ProvideChannel.MARKETING_CENTER"
      >
        <span>{{ !!couponForm.qrcodeCollectSwitch ? '支持' : '不支持' }}</span>
      </el-form-item>

      <el-form-item label="领取条件" class="coupon-label" prop="memberRestrictType">
        <span v-if="couponForm.memberRestrictType !== 1">{{ level }}</span>
        <div v-else>
          <span v-for="item in level" :key="item.id">{{ item.name }} </span>
        </div>
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponCentreStatus === ProvideChannel.COUPON_CENTER"
        label="总发放量"
        prop="quantity"
        class="coupon-label"
      >
        <el-input placeholder="请输入总发放量" v-model="couponForm.quantity" class="coupon-w157 primary-inputHeight" />
      </el-form-item>

      <el-form-item label="每人限领次数" prop="claimNumber" class="coupon-label">
        <span>{{ !couponForm.claimNumber ? '无限制' : couponForm.claimNumber }}</span>
      </el-form-item>

      <template v-if="env.MEDICINE">
        <el-form-item label="第三方券策略ID" prop="thirdCouponId" class="coupon-label">
          <span>{{ couponForm.thirdCouponId || '-' }}</span>
        </el-form-item>
      </template>

      <el-form-item label="使用场景" class="coupon-label" prop="useScopeType">
        <span>{{ couponUseScopeTypeMap[couponForm.useScopeType] }}</span>
      </el-form-item>

      <el-form-item label="领取方式" class="coupon-label" prop="integral">
        <span>{{ couponForm.receiveMethod === 0 ? '免费' : (couponForm.integral || '0') + '积分' }}</span>
      </el-form-item>

      <el-form-item label="可用商品" class="coupon-label" prop="items">
        <span v-if="couponForm.suitItemType === SuitItemType.ALL">所有商品</span>
        <div style="width: 450px">
          <el-table
            :data="itemGoodsList"
            v-if="couponForm.suitItemType === SuitItemType.CUSTOM && itemGoodsList && itemGoodsList.length"
          >
            <el-table-column label="商品名称">
              <span slot-scope="scope" class="ellipsis" :title="scope.row.name || scope.row.serverItemName">
                {{ scope.row.name || scope.row.serverItemName }}
              </span>
            </el-table-column>
            <el-table-column width="200" label="售价">
              <template slot-scope="scope">
                <span v-if="!scope.row.salesType"> ￥{{ scope.row.salePrice | price }} </span>
                <span v-else>
                  {{ scope.row.displayPrice || '到店咨询' }}
                </span>
              </template>
            </el-table-column>
          </el-table>
          <el-table
            :data="itemCategoryList"
            v-if="couponForm.suitItemType === SuitItemType.CATEGORY && itemCategoryList && itemCategoryList.length"
          >
            <el-table-column label="分类名称">
              <span slot-scope="scope" class="ellipsis" :title="scope.row.name">
                {{ scope.row.name }}
              </span>
            </el-table-column>
          </el-table>
          <el-pagination
            v-if="totalGoodsCount"
            layout="prev, pager, next, jumper, sizes, total"
            :total="totalGoodsCount"
            :page-size="pageParams.pageSize"
            :current-page="pageParams.pageNo"
            @size-change="onSizeChange"
            :page-sizes="[5, 10, 20, 30, 40, 50]"
            @current-change="onPageChange"
          >
          </el-pagination>
        </div>
      </el-form-item>

      <el-form-item label="适用范围" class="coupon-label">
        <span v-if="couponForm.suitStoreType === 0">所有门店</span>
        <div style="width: 500px" v-if="itemstoreList && itemstoreList.length && couponForm.suitStoreType === 1">
          <div class="store-content">
            <div
              v-for="store in couponForm.storeList"
              :key="store.storeId"
              class="item"
              :class="store.suitSubStoreType ? 'item-block' : ''"
            >
              <div class="sub-store">
                <div class="left">{{ store.storeName }}</div>
                <div
                  v-if="store.subStoreList && store.subStoreList.length && store.suitSubStoreType === 1"
                  class="right"
                >
                  <el-tag v-for="sub in store.subStoreList" :key="sub.subStoreId" effect="dark">
                    {{ sub.subStoreName }}
                  </el-tag>
                </div>
                <div v-else class="right">所有</div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <div class="content-label">
        <span class="index">3</span>
        <span class="label-name">券面样式</span>
      </div>

      <el-form-item label="优惠券样式" class="coupon-label">
        <div class="coupon-default-img-container" :style="{ 'background-image': `url(${computeCardBg})` }">
          <div class="coupon-content">{{ couponTypeMap[couponForm.couponCategory] }}</div>
          <div v-if="couponForm.couponCategory === CouponType.DISCOUNT_COUPON" class="coupon-name">
            {{ couponForm.discountFee | discount }}<span class="unit">折</span>
          </div>
          <div
            v-else-if="
              couponForm.couponCategory === CouponType.PARKING_DURATION_COUPON ||
              couponForm.couponCategory === CouponType.PARKING_AMOUNT_COUPON
            "
            class="coupon-name"
          >
            <template v-if="!couponForm.discountFee"> 免停车费 </template>
            <template v-else-if="couponForm.couponCategory === CouponType.PARKING_DURATION_COUPON">
              {{ (couponForm.discountFee * 60) | time2String }}
            </template>
            <template v-else> <span class="unit">￥</span>{{ couponForm.discountFee | price }} </template>
          </div>
          <div v-else-if="couponForm.couponCategory === CouponType.GIFT_COUPON" class="coupon-name">
            {{ couponForm.name }}
          </div>
          <div
            v-else-if="couponForm.couponCategory === CouponType.LOGISTICS_COUPON && couponForm.discountFee == 0"
            class="coupon-name"
          >
            免运费
          </div>
          <div v-else class="coupon-name"><span class="unit">￥</span>{{ couponForm.discountFee | price }}</div>

          <div class="coupon-content" v-if="couponForm.minimumFee">满{{ couponForm.minimumFee | price }}元可用</div>
          <div class="coupon-content" v-else>无门槛</div>
        </div>
      </el-form-item>

      <div class="bottom-button">
        <el-button @click="handleClose" class="coupon-cancel">取消</el-button>
        <el-button type="primary coupon-save" @click="onSubmit">保存</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import moneyUtil from '@/dss-common/utils/money';
  import {
    CouponStatus,
    CouponType,
    couponTypeMap,
    couponUseScopeTypeMap,
    ProvideChannel,
    provideChannelMap,
    ReceiveType,
    receiveTypeMap,
    SuitItemType,
  } from '@/dss-wechat3rd/src/constants/coupon';
  import couponBg from '@/dss-wechat3rd/src/images/goods/coupon-bg.png';
  import memberApi from '@/dss-wechat3rd/src/api/memberAPI';
  import classfiyApi from '@/dss-wechat3rd/src/api/retail/goodsMgr/classfiyApi';
  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index';

  export default {
    name: 'CouponForm',
    components: { WEditor },
    data() {
      return {
        CouponStatus,
        CouponType,
        couponTypeMap,
        couponUseScopeTypeMap,
        ProvideChannel,
        provideChannelMap,
        SuitItemType,
        couponBg,
        itemGoodsList: [],
        itemCategoryList: [],
        itemstoreList: [],
        couponForm: {},
        loading: false,
        totalGoodsCount: 0,
        allMemberList: [],
        pageParams: {
          pageSize: 5,
          pageNo: 1,
        },
        rules: {
          status: [
            {
              validator: (rule, value, callback) => {
                if (
                  this.couponForm.status !== CouponStatus.VALID &&
                  this.couponForm.status !== CouponStatus.AUDIT_FAIL
                ) {
                  return callback(new Error('请选择审核结果'));
                }
                return callback();
              },
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      ...mapState({
        storeList: 'storeList',
        env: 'env',
      }),
      level() {
        if (this.couponForm.memberRestrictType === ReceiveType.LEVEL) {
          if (this.couponForm.memberLevelList) {
            return this.couponForm.memberLevelList.map(item => {
              return this.allMemberList.find(list => list.id === item);
            });
          }
          return [];
        }
        return receiveTypeMap[this.couponForm.memberRestrictType];
      },
      computeCardBg() {
        return this.couponForm.couponBackgroundStyle ? this.couponForm.couponBackgroundUrl : couponBg;
      },
    },
    mounted() {
      this.getDeatil();
      this.fetchMemberLevelList();
    },
    methods: {
      getItemsList() {
        const params = {
          ...this.pageParams,
          couponInfoId: this.$route.query.couponNo,
        };
        couponApi.itemsList(params).done(res => {
          this.itemGoodsList = res.data;
          this.totalGoodsCount = res.totalCount;
        });
      },
      getCategorysList() {
        const params = {
          ...this.pageParams,
          couponInfoId: this.$route.query.couponNo,
        };
        classfiyApi.queryCategoryList(params).done(res => {
          this.itemCategoryList = res.data;
          this.totalGoodsCount = res.totalCount;
        });
      },
      getDeatil() {
        couponApi.detail({ couponInfoId: this.$route.query.couponNo }).done(res => {
          this.couponForm = res.data;

          if (this.couponForm.stores && this.couponForm.stores.length) {
            this.couponForm.stores.forEach(storeId => {
              const store = this.storeList.find(item => {
                return item.id === storeId;
              });
              store && this.itemstoreList.push(store);
            });
          }

          if (this.couponForm.suitItemType === 1) {
            this.getItemsList();
          }
          if (this.couponForm.suitItemType === 2) {
            this.getCategorysList();
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
        // 转换函数
        const convert = isFromServer
          ? v => {
              return moneyUtil.convertHundredMoneyUnit(v, true);
            }
          : v => {
              return moneyUtil.convertHundredMoneyUnit(v, false);
            };
        // minimumFee：售价 , discountFee: 优惠金额
        if (itemDetailDTO) {
          itemDetailDTO.minimumFee = convert(itemDetailDTO.minimumFee);
          itemDetailDTO.discountFee = convert(itemDetailDTO.discountFee);
        }
      },
      // 每页条数变化
      onSizeChange(size) {
        this.pageParams.pageSize = size;
        this.pageParams.pageNo = 1;
        if (this.couponForm.suitItemType === 1) {
          this.getItemsList();
        }
        if (this.couponForm.suitItemType === 2) {
          this.getCategorysList();
        }
      },
      // 翻页
      onPageChange(page) {
        this.pageParams.pageNo = page;
        if (this.couponForm.suitItemType === 1) {
          this.getItemsList();
        }
        if (this.couponForm.suitItemType === 2) {
          this.getCategorysList();
        }
      },
      handleClose() {
        this.$router.back();
      },
      onSubmit() {
        if (this.loading) {
          return;
        }
        this.$refs.couponForm.validate().then(valid => {
          if (!valid) {
            return;
          }
          const { couponCentreStatus, quantity, rules, description } = this.couponForm;
          const params = { couponInfoId: this.$route.query.couponNo };

          // 是否营销专用券，营销专用券不限制数量
          params.quantity = couponCentreStatus === ProvideChannel.MARKETING_CENTER ? 0 : quantity;
          params.rules = rules;
          params.description = description;

          this.loading = true;
          const keyMethod = 'updateCoupon';
          couponApi[keyMethod](params)
            .done(res => {
              this.$router.back();
            })
            .always(() => {
              this.loading = false;
            });
        });
      },
      fetchMemberLevelList() {
        memberApi.getLevelSimplyList().then(res => {
          if (res.data && res.data.length) {
            this.allMemberList = res.data.map(item => {
              return { id: item.id, name: item.levelName };
            });
          } else {
            this.allMemberList = [];
          }
        });
      },
    },
  };
</script>

<style lang="less" scoped>
  .coupon-describe {
    width: 366px;

    .el-textarea__inner {
      resize: none;
    }
  }

  .content-label {
    color: #333;
    font-weight: bold;
    padding: 5px 0 20px;

    .index {
      font-size: 22px;
      margin-right: 10px;
    }

    .index::after {
      content: '';
      height: 26px;
      display: inline-block;
      border-left: 1px solid #333;
      transform: rotate(25deg);
      margin: 0 0 -7px 2px;
    }

    .label-name {
      font-size: 20px;
    }
  }

  .store-content {
    max-height: 303px;
    overflow: auto;

    .store-item-box {
      display: inline-block;
      vertical-align: top;
    }

    .el-tag {
      margin-right: 6px;
    }

    .item {
      display: inline-block;
      margin-right: 16px;
      margin-top: 16px;
    }

    .item-block {
      display: flex;
    }
  }

  .sub-store {
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 16px 0;
    background: #f5f7fa;
    border-radius: 2px;

    .left {
      position: relative;
      color: #333;
      padding: 0 8px;
      margin-right: 16px;
      line-height: 20px;
      border-right: 1px solid #e2e4e7;
      box-sizing: border-box;
    }

    .right {
      flex: 1;
      margin-right: 26px;
    }

    .el-tag--dark {
      background-color: #fff;
      border-color: #fff;
      color: #8d939d;
    }
  }
</style>
