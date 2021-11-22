<template>
  <div class="coupon-add">
    <div class="head-tip-box">
      <div class="head-tip">* 商家请注意：一旦保存，该券只可以增加数量，其它内容不可修改。</div>
    </div>

    <el-form
      :model="couponForm"
      ref="couponForm"
      :rules="rules"
      v-loading="loading"
      class="coupon-add-form"
      label-width="126px"
      label-suffix="："
    >
      <div class="head-title">券面设置</div>

      <el-form-item label="类型" prop="integral" key="couponCategory">
        <el-radio-group v-model="couponForm.couponCategory" @change="onCategoryChange">
          <el-radio v-for="item in couponTypeList" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="优惠券名称" prop="name" key="name">
        <el-input placeholder="请输入优惠券名称" v-model="couponForm.name" class="long-input"></el-input>
      </el-form-item>

      <el-form-item
        v-if="
          couponForm.couponCategory !== CouponType.GIFT_COUPON &&
          couponForm.couponCategory !== CouponType.PARKING_COUPON
        "
        label="消费门槛"
        prop="minimumFee"
        key="minimumFee"
      >
        <el-input placeholder="请输入最低消费金额" v-model="couponForm.minimumFee" class="long-input" />
        <div class="desc-tip">购物金额（不含运费）达到最低消费金额才可使用优惠券，无门槛优惠券请填0</div>
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponCategory === CouponType.GIFT_COUPON"
        label="参考价值"
        prop="referenceValue"
        key="referenceValue"
      >
        <el-input placeholder="请输入参考价值" v-model="couponForm.referenceValue" class="shot-input" maxlength="9" />
        元
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponCategory === CouponType.PARKING_COUPON"
        label="优惠方式"
        prop="couponCategoryParking"
        key="couponCategoryParking"
      >
        <el-radio-group v-model="couponForm.couponCategoryParking">
          <el-radio :label="CouponType.PARKING_AMOUNT_COUPON">
            优惠金额
            <el-input
              placeholder="0"
              v-model="couponForm.parkingAmount"
              :disabled="couponForm.couponCategoryParking === CouponType.PARKING_DURATION_COUPON"
              class="shot-input"
              maxlength="9"
            />
            元
          </el-radio>
          <el-radio :label="CouponType.PARKING_DURATION_COUPON">
            优惠时长
            <el-input
              placeholder="0"
              v-model="couponForm.parkingTime"
              :disabled="couponForm.couponCategoryParking === CouponType.PARKING_AMOUNT_COUPON"
              class="shot-input"
              maxlength="4"
            />
            分钟
          </el-radio>
        </el-radio-group>
        <div class="desc-tip">默认为0，可减免全部停车费。</div>
      </el-form-item>

      <el-form-item
        v-else-if="
          couponForm.couponCategory === CouponType.DEFAULT ||
          couponForm.couponCategory === CouponType.LOGISTICS_COUPON ||
          couponForm.couponCategory === CouponType.DISCOUNT_COUPON
        "
        :label="couponForm.couponCategory == CouponType.DISCOUNT_COUPON ? '折扣额度' : '优惠金额'"
        prop="discountFee"
        key="discountFee"
      >
        <el-input
          :placeholder="couponForm.couponCategory == CouponType.DISCOUNT_COUPON ? '请输入折扣额度' : '请输入优惠金额'"
          v-model="couponForm.discountFee"
          class="long-input"
        />
        <div class="desc-tip" v-if="couponForm.couponCategory === CouponType.DEFAULT">
          优惠券只能抵消商品金额，不能抵消运费。
        </div>
        <div class="desc-tip" v-if="couponForm.couponCategory === CouponType.LOGISTICS_COUPON">
          默认为0，可减免全部运费。
        </div>
        <div class="desc-tip" v-if="couponForm.couponCategory === CouponType.DISCOUNT_COUPON">
          请输入0.1-9.9之间的数字，精确到小数点后1位
        </div>
      </el-form-item>
      <el-form-item v-else-if="couponForm.couponCategory === CouponType.GIFT_COUPON" label="优惠方式">
        实物
      </el-form-item>

      <el-form-item label="优惠券有效期" prop="couponType" key="couponType">
        <el-radio-group v-model="couponForm.couponType">
          <el-radio v-for="item in couponValidDateList" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponType === CouponValidDate.DEFAULT"
        label="有效天数"
        prop="fixedTerm"
        key="fixedTerm"
      >
        <el-input placeholder="请输入有效天数" v-model="couponForm.fixedTerm" class="long-input"></el-input>
      </el-form-item>
      <template v-else>
        <el-form-item label="有效期范围" prop="beginTime">
          <el-date-picker
            v-model="couponForm.beginTime"
            :picker-options="pickerBeginDateBefore"
            type="datetime"
            class="coupon-w157 primary-inputHeight"
            placeholder="开始时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item prop="endTime">
          <el-date-picker
            v-model="couponForm.endTime"
            type="datetime"
            :picker-options="pickerBeginDateAfter"
            class="coupon-w157 primary-inputHeight coupon-picker"
            placeholder="结束时间"
            value-format="yyyy-MM-dd HH:mm"
            format="yyyy-MM-dd HH:mm"
          >
          </el-date-picker>
        </el-form-item>
      </template>

      <el-form-item label="使用须知" prop="rules" key="rules">
        <el-input
          placeholder="请输入使用须知"
          type="textarea"
          v-model="couponForm.rules"
          maxlength="500"
          :autosize="{ minRows: 8, maxRows: 8 }"
          class="coupon-describe"
        />
      </el-form-item>
      <el-form-item
        v-if="couponForm.couponCategory === CouponType.GIFT_COUPON"
        label="礼品描述"
        prop="description"
        key="description"
      >
        <w-editor :data-source="couponForm" param-name="description" :image-limit="30" />
      </el-form-item>

      <div class="head-title">领券设置</div>
      <el-form-item label="发放渠道" prop="couponCentreStatus" key="couponCentreStatus" required>
        <el-radio-group v-model="couponForm.couponCentreStatus">
          <el-radio v-for="item in provideChannelList" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        label="扫码领券"
        prop="qrcodeCollectSwitch"
        key="qrcodeCollectSwitch"
        v-if="couponForm.couponCentreStatus === ProvideChannel.MARKETING_CENTER"
        required
      >
        <el-radio-group v-model="couponForm.qrcodeCollectSwitch">
          <el-radio :label="1">支持</el-radio>
          <el-radio :label="0">不支持</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        v-if="couponForm.couponCentreStatus === ProvideChannel.COUPON_CENTER"
        label="领取条件"
        prop="memberRestrictType"
        key="memberRestrictType"
        required
      >
        <el-radio-group v-model="couponForm.memberRestrictType">
          <el-radio v-for="item in receiveTypeList" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
          <el-button
            size="mini"
            v-if="couponForm.memberRestrictType === ReceiveType.LEVEL"
            @click="handleSelect('selectLevel')"
          >
            选择等级
          </el-button>
        </el-radio-group>
        <div class="desc-tip">提示：高等级会员默认可领取低等级优惠券</div>
      </el-form-item>
      <!--已选会员等级展示区域-->
      <el-form-item v-if="couponForm.memberRestrictType === ReceiveType.LEVEL && selectedLevelList.length">
        <div class="store-label">已选会员等级</div>
        <div>
          <el-tag v-for="(item, index) in selectedLevelList" :key="item.id" closable @close="handleDellevelItem(index)">
            {{ item.name }}
          </el-tag>
        </div>
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponCentreStatus === ProvideChannel.COUPON_CENTER"
        label="总发放量"
        prop="quantity"
        key="quantity"
      >
        <el-input placeholder="请输入总发放量" v-model="couponForm.quantity" class="shot-input" />
        <div class="desc-tip">不限制发放量请填0</div>
      </el-form-item>
      <el-form-item label="每人限领次数" prop="claimNumber" key="claimNumber">
        <el-input placeholder="请输入每人限领次数" v-model="couponForm.claimNumber" class="shot-input" />
        <div class="desc-tip">不限制领取次数请填0</div>
      </el-form-item>

      <el-form-item
        v-if="couponForm.couponCategory !== CouponType.LOGISTICS_COUPON"
        label="使用场景"
        prop="useScopeType"
        key="useScopeType"
      >
        <el-radio-group
          v-model="couponForm.useScopeType"
          :disabled="
            couponForm.couponCategory === CouponType.GIFT_COUPON ||
            couponForm.couponCategory === CouponType.PARKING_COUPON
          "
        >
          <el-radio v-for="item in couponUseScopeTypeList" :key="item.value" :label="item.value">
            {{ item.label }}
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="
          env.MEDICINE && (couponForm.useScopeType === UseScope.COMMON || couponForm.useScopeType === UseScope.OFFLINE)
        "
        label="第三方券策略ID："
        prop="thirdCouponId"
        key="thirdCouponId"
      >
        <el-input placeholder="请输入第三方券策略ID" v-model="couponForm.thirdCouponId" class="shot-input"></el-input>
      </el-form-item>

      <el-form-item label="领取方式" prop="integral" key="integral">
        <el-radio-group v-model="couponForm.receiveMethod">
          <el-radio :label="0">免费</el-radio>
          <el-radio :label="1" :disabled="couponForm.couponCentreStatus !== ProvideChannel.COUPON_CENTER">
            <el-input
              v-model="couponForm.integral"
              :controls="false"
              class="shot-input"
              :disabled="couponForm.receiveMethod === 0"
            >
            </el-input>
            <span class="coupon-unit">积分</span>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        v-if="
          couponForm.couponCategory !== CouponType.GIFT_COUPON &&
          couponForm.couponCategory !== CouponType.PARKING_COUPON
        "
        label="可用商品"
        prop="suitItemType"
        key="suitItemType"
      >
        <span v-if="couponForm.couponCategory === CouponType.LOGISTICS_COUPON">所有商品</span>
        <el-radio-group v-else v-model="couponForm.suitItemType">
          <template v-for="item in computeItemTypeList">
            <el-radio
              :label="item.value"
              :key="item.value"
              v-if="item.value !== SuitItemType.STORE || (!isStore && isEnterManger)"
            >
              {{ item.label }}
              <el-button
                class="btn-rules left10"
                v-if="item.value === couponForm.suitItemType && computeItemTypeButtonMap[couponForm.suitItemType]"
                @click="handleSelect(couponForm.suitItemType)"
              >
                {{ computeItemTypeButtonMap[couponForm.suitItemType] }}
              </el-button>
            </el-radio>
          </template>
        </el-radio-group>
        <div>
          <!-- 选择指定商品 -->
          <el-table
            :data="itemGoodsList"
            style="width: 500px"
            class="coupon-goods-box"
            v-if="itemGoodsList && itemGoodsList.length && couponForm.suitItemType === SuitItemType.CUSTOM"
          >
            <el-table-column label="商品名称" v-slot="{ row }">
              <span class="ellipsis" :title="row.name || row.serverItemName">
                {{ row.name || row.serverItemName }}
              </span>
            </el-table-column>

            <el-table-column width="200" label="售价" v-slot="{ row }">
              <span v-if="!row.salesType"> ￥{{ row.salePrice | price }} </span>
              <span v-else>
                {{ row.displayPrice || '到店咨询' }}
              </span>
            </el-table-column>

            <el-table-column label="操作" width="93" v-slot="scope">
              <a href="javascript:;" @click="handleRemove(scope.$index, 'itemGoodsList')"> 删除 </a>
            </el-table-column>
          </el-table>
          <!-- 选择指定分类 -->
          <div
            class="store-list-box"
            v-if="categoryIds && categoryIds.length && couponForm.suitItemType === SuitItemType.CATEGORY"
          >
            <div class="store-label">已选分类</div>
            <div class="store-content">
              <el-tag
                v-for="(item, index) in categoryIds"
                :key="item.id"
                @close="handleRemove(index, 'categoryIds')"
                closable
              >
                {{ item.category }}
              </el-tag>
            </div>
          </div>
        </div>
      </el-form-item>

      <el-form-item prop="suitStoreType" label="适用范围">
        <el-radio-group v-if="isEnterManger" v-model="couponForm.suitStoreType">
          <el-radio :label="0">全部项目</el-radio>
          <el-radio :label="1">
            指定项目
            <el-button class="btn-rules left10" v-if="couponForm.suitStoreType === 1" @click="$refs.select.show()">
              选择项目
            </el-button>
            <el-button
              class="btn-rules left10"
              v-if="couponForm.suitStoreType === 1 && curApp.industryKey !== 'home'"
              @click="handleSelect('importStore')"
            >
              导入项目
            </el-button>
          </el-radio>
        </el-radio-group>

        <el-radio-group v-model="couponForm.suitStoreType" v-else-if="!isEnterManger">
          <el-radio :label="0" v-if="epStoreList && epStoreList.length && epStoreList.length < 2 && isStoreKeeper">
            本项目
          </el-radio>
          <el-radio :label="0" v-else>
            指定项目
            <el-button class="btn-rules left10" @click="handleSelect('selectStore')">选择项目</el-button>
          </el-radio>
        </el-radio-group>
        <div
          class="store-list-box"
          v-if="storeList && storeList.length && couponForm.suitStoreType === 1 && isEnterManger"
        >
          <div class="store-label">
            <span>已选择</span>
            <span @click="onDelAll">清空</span>
          </div>
          <div class="store-content">
            <div
              v-for="(store, storeIndex) in storeList"
              :key="store.storeId"
              class="item"
              :class="store.suitSubStoreType ? 'item-block' : ''"
            >
              <div v-if="couponForm.couponCategory === CouponType.PARKING_COUPON">
                <el-tag closable type="info" effect="plain" @close="handleDelStoreItem(storeIndex)">
                  {{ store.storeName }}
                </el-tag>
              </div>
              <div v-else class="sub-store">
                <div class="left">{{ store.storeName }}</div>
                <div
                  v-if="store.subStoreList && store.subStoreList.length && store.suitSubStoreType === 1"
                  class="right"
                >
                  <el-tag
                    v-for="(sub, subIndex) in store.subStoreList"
                    :key="sub.subStoreId"
                    closable
                    effect="dark"
                    @close="handleDelSubStoreItem(storeIndex, subIndex)"
                  >
                    {{ sub.name }}
                  </el-tag>
                </div>
                <div v-else class="right">所有</div>
                <div class="close">
                  <i class="el-icon-error" @click="handleDelStoreItem(storeIndex)"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </el-form-item>

      <div class="head-title">券面样式</div>
      <el-form-item label="优惠券样式">
        <div class="coupon-radio">
          <el-radio-group v-model="couponForm.couponBackgroundStyle">
            <el-radio :label="0">默认背景图</el-radio>
            <el-radio :label="1">自定义图片</el-radio>
          </el-radio-group>
        </div>
        <div class="bag-box">
          <div class="coupon-image-choose-container" :class="couponForm.couponBackgroundStyle === 0 ? 'disable' : ''">
            <image-selector :can-reset="false" v-model="couponForm.styleUrl" @delete="onDeleteImg" />
            <div class="img-notes">建议尺寸：690x390，图片不大于1M</div>
          </div>
          <div class="coupon-default-img-container" :style="{ 'background-image': `url(${computeCardBg})` }">
            <div class="coupon-content">{{ couponTypeMap[couponForm.couponCategory] }}</div>
            <div v-if="couponForm.couponCategory === CouponType.DISCOUNT_COUPON" class="coupon-name">
              {{ couponForm.discountFee || '0' }}<span>折</span>
            </div>
            <div v-else-if="couponForm.couponCategory === CouponType.PARKING_COUPON" class="coupon-name">
              <template v-if="couponForm.couponCategoryParking === CouponType.PARKING_AMOUNT_COUPON">
                <template v-if="couponForm.parkingAmount == 0"> 免停车费 </template>
                <template v-else> <span class="unit">￥</span>{{ couponForm.parkingAmount }} </template>
              </template>
              <template v-else>
                <template v-if="couponForm.parkingTime == 0"> 免停车费 </template>
                <template v-else> {{ (couponForm.parkingTime * 60) | time2String }} </template>
              </template>
            </div>
            <div v-else-if="couponForm.couponCategory === CouponType.GIFT_COUPON" class="coupon-name">
              {{ couponForm.name || '券名称' }}
            </div>
            <div
              v-else-if="couponForm.couponCategory === CouponType.LOGISTICS_COUPON && couponForm.discountFee == 0"
              class="coupon-name"
            >
              免运费
            </div>
            <div v-else class="coupon-name"><span class="unit">￥</span>{{ couponForm.discountFee || '0' }}</div>

            <div class="coupon-content" v-if="couponForm.minimumFee != 0">满{{ couponForm.minimumFee }}元可用</div>
            <div class="coupon-content" v-else>无门槛</div>
          </div>
        </div>
      </el-form-item>
    </el-form>

    <div class="bottom-button">
      <div class="button-center">
        <el-button :disabled="loading" @click="onCancel" class="coupon-cancel">取 消</el-button>
        <el-button :disabled="loading" type="primary coupon-save" @click="onSubmit">保 存</el-button>
      </div>
    </div>

    <local-resolve-xls
      @resolve="v => onChoose(v, 'storeList')"
      :visible.sync="resolveXlsDialogVisible"
      title="导入项目"
    />

    <group-select-dialog
      v-model="showGroupDialog"
      label="会员等级"
      :all-group="currentGroup"
      :selected-group="selectedGroup"
      @select="onGroupItemsSelected"
    />

    <goods-select-dialog
      v-model="showAddGoodsDialog"
      enable-multiple
      show-goods-type-tab
      :selected-list="itemGoodsList"
      @selected="v => onChoose(v, 'itemGoodsList')"
    />

    <classify-select-dialog
      v-model="showAddCategoryDialog"
      :active-tabs="computeActiveTabs"
      :selected-list="categoryIds"
      @choosed="v => onChoose(v, 'categoryIds')"
    />

    <store-select-dialog
      api-url="/wp/store/query/dept"
      :is-all="true"
      :selected-stores="storeList"
      enable-multiple
      v-model="showStoreDialog"
      @choosed="v => onChoose(v, 'storeList')"
      :is-show-area="isEnterManger ? true : false"
      :is-show-dealer="isEnterManger ? true : false"
    />

    <merchant-select-dialog
      ref="select"
      @select="v => onChoose(v, 'storeList')"
      :parent="storeList"
      :is-visible-merchant="couponForm.couponCategory !== CouponType.PARKING_COUPON"
    />
  </div>
</template>

<script>
  import { mapState } from 'vuex';
  import regex from '@/dss-wechat3rd/src/constants/regex';
  import couponApi from '@/dss-wechat3rd/src/api/couponApi';
  import memberApi from '@/dss-wechat3rd/src/api/memberAPI';
  import moneyUtil from '@/dss-common/utils/money';
  import GroupSelectDialog from '@/dss-wechat3rd/src/bz_components/group-select-dialog/index.vue';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
  import couponBg from '@/dss-wechat3rd/src/images/goods/coupon-bg.png';
  import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';
  import {
    CouponType,
    couponTypeMap,
    couponTypeList,
    CouponValidDate,
    couponValidDateList,
    ProvideChannel,
    provideChannelList,
    ReceiveType,
    receiveTypeList,
    UseScope,
    couponUseScopeTypeList,
    SuitItemType,
    suitItemTypeButtonMap,
    suitItemTypeButtonMapByShort,
    suitItemTypeList,
    suitItemTypeListByShort,
  } from '@/dss-wechat3rd/src/constants/coupon';
  import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  import ClassifySelectDialog from '@/dss-wechat3rd/src/bz_components/classify-select-dialog/index.vue';
  import MerchantSelectDialog from '@/business-common/components/merchant-select-dialog/index.vue';
  import { businessApi } from '@/business-common/api';

  const vaild = (reg, data, msg, callback) => {
    if (!reg.test(data)) {
      return callback(msg);
    } else {
      return callback();
    }
  };
  export default {
    name: 'CouponForm',
    components: {
      LocalResolveXls,
      GoodsSelectDialog,
      StoreSelectDialog,
      ClassifySelectDialog,
      ImageSelector,
      GroupSelectDialog,
      WEditor,
      MerchantSelectDialog,
    },
    data() {
      return {
        CouponType,
        couponTypeMap,
        couponTypeList,
        CouponValidDate,
        couponValidDateList,
        provideChannelList,
        ReceiveType,
        receiveTypeList,
        UseScope,
        couponUseScopeTypeList,
        SuitItemType,
        ProvideChannel,
        goodsSelectDialogTabs: [goodsTypeEnum.product],
        resolveXlsDialogVisible: false,
        itemGoodsList: [],
        showGroupDialog: false,
        showAddGoodsDialog: false,
        showAddCategoryDialog: false,
        showStoreDialog: false,
        categoryIds: [],
        storeList: [],
        merchantList: [],
        allMemberList: [],
        selectedLevelList: [],
        couponForm: {
          couponCategory: CouponType.DEFAULT,
          couponCategoryParking: CouponType.PARKING_AMOUNT_COUPON,
          name: '',
          couponBackgroundStyle: 0,
          minimumFee: '',
          referenceValue: '',
          parkingAmount: '0',
          parkingTime: '0',
          discountFee: '',
          couponType: CouponValidDate.DEFAULT, // 优惠券有效时限类型
          fixedTerm: '',
          rules: '',
          description: '',
          couponCentreStatus: ProvideChannel.COUPON_CENTER,
          suitItemType: SuitItemType.ALL, // 指定范围
          suitStoreType: 0, // 指定店铺 0全部  1部分 ， 当前bbc无使用该字段
          claimNumber: '',
          receiveMethod: 0,
          useScopeType: UseScope.COMMON,
          items: [],
          categoryIds: '',
          memberRestrictType: 2,
          qrcodeCollectSwitch: 1,
          quantity: 0, // 不限制
          integral: '',
        },
        loading: false,
        pickerBeginDateBefore: {
          disabledDate: time => {
            const beginDateVal = this.couponForm.endTime;
            if (beginDateVal) {
              return new Date(time) > new Date(beginDateVal);
            }
          },
        },
        pickerBeginDateAfter: {
          disabledDate: time => false,
        },
        rules: {
          name: [
            { required: true, message: '请输入优惠券名称', trigger: 'blur' },
            { min: 1, max: 25, message: '长度在 1 到 25 个字符', trigger: 'blur' },
          ],
          couponCategoryParking: [
            { required: true, message: '请选择优惠方式', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const couponPrice = regex.couponPrice;
                if (value === CouponType.PARKING_AMOUNT_COUPON) {
                  vaild(couponPrice.reg, this.couponForm.parkingAmount, couponPrice.msg, callback);
                } else {
                  vaild(couponPrice.reg, this.couponForm.parkingTime, couponPrice.msg, callback);
                }
              },
              trigger: 'blur',
            },
          ],
          minimumFee: [
            { required: true, message: '请输入消费门槛', trigger: 'blur' },
            {
              pattern: regex.couponPrice.reg,
              message: regex.couponPrice.msg,
              trigger: 'blur',
            },
          ],
          discountFee: [
            { required: true, message: '请输入优惠金额', trigger: 'blur' },
            {
              validator: (rule, value, callback) => {
                const couponPrice = regex.couponPrice;
                const discountPrice = regex.discountPrice;
                if (this.couponForm.couponCategory === CouponType.DEFAULT) {
                  vaild(couponPrice.reg, value, couponPrice.msg, callback);
                } else if (this.couponForm.couponCategory === CouponType.LOGISTICS_COUPON) {
                  vaild(couponPrice.reg, value, couponPrice.msg, callback);
                } else if (this.couponForm.couponCategory === CouponType.DISCOUNT_COUPON) {
                  if (value === 0) {
                    return callback(discountPrice.msg);
                  }
                  vaild(discountPrice.reg, value, discountPrice.msg, callback);
                } else {
                  return callback();
                }
              },
              trigger: 'blur',
            },
          ],
          couponType: [{ required: true, message: '请选择有效时间', trigger: 'blur' }],
          beginTime: [{ required: true, message: '请选择开始时间', trigger: 'blur' }],
          endTime: [{ required: true, message: '请选择结束时间', trigger: 'blur' }],
          quantity: [
            { required: true, message: '请填写总发放量', trigger: 'blur' },
            {
              pattern: regex.quantity.reg,
              message: regex.quantity.msg,
              trigger: 'blur',
            },
          ],
          fixedTerm: [
            { required: true, message: '请输入天数', trigger: 'blur' },
            {
              pattern: regex.littleIntNum.reg,
              message: regex.littleIntNum.msg,
              trigger: 'blur',
            },
          ],
          claimNumber: [
            { required: true, message: '请输入每人可领取次数', trigger: 'blur' },
            {
              pattern: regex.quantity.reg,
              message: regex.quantity.msg,
              trigger: 'blur',
            },
          ],
          description: [
            {
              validator: (rule, value, callback) => {
                if (value.length > 410) {
                  return callback(new Error('请输入长度小于或等于400'));
                }
                return callback();
              },
              trigger: 'change',
            },
          ],
          integral: [
            {
              validator: (rule, value, callback) => {
                if (this.couponForm.receiveMethod) {
                  if (value === '' || value == null) {
                    return callback(new Error('请输入积分'));
                  } else {
                    if (regex.integral.reg.test(value)) {
                      return callback();
                    } else {
                      return callback(new Error('请输入1到99999之间的正整数'));
                    }
                  }
                }
                return callback();
              },
              trigger: 'change',
            },
          ],
          thirdCouponId: [
            {
              validator: (rule, value, callback) => {
                if (
                  this.couponForm.useScopeType === UseScope.COMMON ||
                  this.couponForm.useScopeType === UseScope.OFFLINE
                ) {
                  if (value === '' || value == null) {
                    return callback();
                  } else if (!regex.quantity.reg.test(value)) {
                    return callback(new Error('请输入请输入0到99999的正整数'));
                  } else {
                    return callback();
                  }
                } else {
                  return callback();
                }
              },
              trigger: 'change',
            },
          ],
          suitItemType: [
            {
              validator: (rule, value, callback) => {
                if (this.couponForm.suitItemType === SuitItemType.CUSTOM) {
                  if (!this.itemGoodsList || !this.itemGoodsList.length) {
                    return callback(new Error('请选择商品'));
                  }
                } else if (this.couponForm.suitItemType === SuitItemType.CATEGORY) {
                  if (!this.categoryIds || !this.categoryIds.length) {
                    return callback(new Error('请选择分类'));
                  }
                }
                return callback();
              },
              trigger: 'change',
            },
          ],
          suitStoreType: [
            {
              required: true,
              validator: (rule, value, callback) => {
                if (
                  this.couponForm.suitStoreType === 0 ||
                  (this.storeList && this.storeList.length) ||
                  (this.epStoreList && this.epStoreList.length < 2 && this.isStoreKeeper && this.curStore)
                ) {
                  return callback();
                }
                return callback(new Error('请选择项目'));
              },
              trigger: 'change',
            },
          ],
          memberRestrictType: [
            {
              // 选定会员等级至少选一个
              validator: (rule, value, callback) => {
                // 全部会员返回
                if (value !== ReceiveType.LEVEL) {
                  callback();
                }
                // 选定会员等级已选择返回
                else if (this.selectedLevelList && this.selectedLevelList.length > 0) {
                  callback();
                }
                // 选定会员等级未选择时抛错
                else {
                  callback(new Error('请至少选择一个会员等级'));
                }
              },
              trigger: 'change',
            },
          ],
        },
      };
    },
    watch: {
      'couponForm.couponType': {
        handler(newVal, oldVal) {
          this.couponForm.fixedTerm = '';
        },
      },
      'couponForm.receiveMethod': {
        handler(newVal, oldVal) {
          if (!newVal) {
            this.couponForm.integral = '';
          }
        },
      },
      'couponForm.couponCentreStatus': {
        handler(newVal, oldVal) {
          this.couponForm.receiveMethod = 0;
        },
      },
    },
    computed: {
      ...mapState({
        curApp: 'curApp',
        env: 'env',
        roleList: 'roleList',
        epStoreList: 'storeList',
        curStore: 'curStore',
      }),
      isStore() {
        return this.curStore.id;
      },
      // 是否企业管理员
      isEnterManger() {
        return (
          !!~this.roleList.indexOf('common_role_enterprise') ||
          !!~this.roleList.indexOf('common_role_admin') ||
          !!~this.roleList.indexOf('common_role_platform_manage')
        );
      },
      // 店长角色
      isStoreKeeper() {
        return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
      },
      computeActiveTabs() {
        return this.env.BEAUTIFUL ? [goodsTypeEnum.server, goodsTypeEnum.product] : [goodsTypeEnum.product];
      },
      computeCardBg() {
        if (!this.couponForm.couponBackgroundStyle) {
          return couponBg;
        } else {
          return this.couponForm.styleUrl ? this.couponForm.styleUrl.imgUrl : couponBg;
        }
      },
      selectedGroup() {
        return this.selectedLevelList;
      },
      currentGroup() {
        if (this.couponForm.memberRestrictType === ReceiveType.LEVEL) {
          return this.allMemberList;
        }
        return null;
      },
      computeItemTypeList() {
        if (
          this.couponForm.couponCategory === CouponType.GIFT_COUPON ||
          this.couponForm.couponCategory === CouponType.PARKING_COUPON
        ) {
          return suitItemTypeListByShort;
        }
        return suitItemTypeList;
      },
      computeItemTypeButtonMap() {
        if (
          this.couponForm.couponCategory === CouponType.GIFT_COUPON ||
          this.couponForm.couponCategory === CouponType.PARKING_COUPON
        ) {
          return suitItemTypeButtonMapByShort;
        }
        return suitItemTypeButtonMap;
      },
    },
    mounted() {
      this.fetchMemberLevelList();
      this.fetchMerchants();
    },
    methods: {
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

      async fetchMerchants() {
        // 查询所有门店信息
        const { data } = await businessApi.business.query({ queryAll: true, pageSize: 5000 });

        this.merchantList = data;
      },

      onCategoryChange() {
        this.$refs.couponForm.resetFields();
        this.$refs.couponForm.clearValidate();
        // 无法重置被隐藏的输入框，需手动置空
        this.couponForm.minimumFee = '';
        this.couponForm.referenceValue = '';
        this.couponForm.discountFee = '';
        if (this.couponForm.couponCategory === CouponType.LOGISTICS_COUPON) {
          this.couponForm.suitItemType = SuitItemType.ALL;
          this.couponForm.useScopeType = UseScope.COMMON;
        } else if (this.couponForm.couponCategory === CouponType.GIFT_COUPON) {
          this.couponForm.suitItemType = SuitItemType.ALL;
          this.couponForm.useScopeType = UseScope.OFFLINE;
        } else if (this.couponForm.couponCategory === CouponType.PARKING_COUPON) {
          this.couponForm.couponCategoryParking = CouponType.PARKING_AMOUNT_COUPON;
          this.couponForm.suitItemType = SuitItemType.ALL;
          this.couponForm.useScopeType = UseScope.ONLINE;
        }
      },

      onDeleteImg() {
        this.couponForm.styleUrl = null;
      },

      /**
       * 钱的单位转换 ,服务端返回的为分， 交互展示的为元
       * @param itemDetailDTO
       */
      convertMoneyUnit(itemDetailDTO) {
        if (!itemDetailDTO) {
          return;
        }

        // minimumFee：售价 , discountFee: 优惠金额
        if (itemDetailDTO) {
          itemDetailDTO.minimumFee = moneyUtil.convertHundredMoneyUnit(itemDetailDTO.minimumFee);
          itemDetailDTO.referenceValue = moneyUtil.convertHundredMoneyUnit(itemDetailDTO.referenceValue);
          // 停车券类型
          if (itemDetailDTO.couponCategory === CouponType.PARKING_COUPON) {
            if (itemDetailDTO.couponCategoryParking === CouponType.PARKING_AMOUNT_COUPON) {
              itemDetailDTO.discountFee = moneyUtil.convertHundredMoneyUnit(itemDetailDTO.parkingAmount); // 优惠金额
              itemDetailDTO.couponCategory = CouponType.PARKING_AMOUNT_COUPON;
            } else {
              itemDetailDTO.discountFee = itemDetailDTO.parkingTime; // 优惠时长
              itemDetailDTO.couponCategory = CouponType.PARKING_DURATION_COUPON;
            }
          } else if (itemDetailDTO.couponCategory === CouponType.DISCOUNT_COUPON) {
            itemDetailDTO.discountFee = itemDetailDTO.discountFee * 10;
          } else {
            itemDetailDTO.discountFee = moneyUtil.convertHundredMoneyUnit(itemDetailDTO.discountFee);
          }
        }
      },

      handleSelect(type) {
        switch (type) {
          case SuitItemType.CUSTOM:
            this.showAddGoodsDialog = true;
            break;
          case SuitItemType.CATEGORY:
            this.showAddCategoryDialog = true;
            break;
          case 'selectStore':
            this.showStoreDialog = true;
            break;
          case 'importStore':
            this.resolveXlsDialogVisible = true;
            break;
          case 'selectLevel':
            this.showGroupDialog = true;
            break;
        }
      },

      handleRemove(index, key) {
        this[key].splice(index, 1);
      },

      onChoose(data, key) {
        this.onChooseHandler()[key].call(this, data);
      },

      onChooseHandler() {
        return {
          // 处理门店回显
          storeList(data) {
            const { storeList: storeData } = data;
            const epStoreList = this.epStoreList;
            const merchantList = this.merchantList;

            const storeList = storeData.map(x => {
              const o = epStoreList.find(idx => idx.id === x.storeId);
              const { subStoreList: subData } = x;
              const subStoreList =
                subData &&
                subData.map(sub => {
                  const subo = merchantList.find(idx => idx.subStoreId === sub.subStoreId);
                  return {
                    subStoreId: sub.subStoreId,
                    name: subo && subo.name,
                  };
                });

              return {
                storeId: x.storeId,
                storeName: o && o.name,
                subStoreList: subStoreList,
                suitSubStoreType: x.suitSubStoreType,
              };
            });

            // 无商户的排前面
            storeList.sort((a, b) => {
              if (a.suitSubStoreType !== b.suitSubStoreType) {
                return a.suitSubStoreType < b.suitSubStoreType ? -1 : 1;
              } else if (a.subStoreList.length !== b.subStoreList.length) {
                return a.subStoreList.length < b.subStoreList.length ? -1 : 1;
              } else {
                return 0;
              }
            });

            this.storeList = storeList;
            this.$refs.couponForm.validateField('suitStoreType');
          },
          // 处理商品回显
          itemGoodsList(data) {
            this.itemGoodsList = data;
            this.$refs.couponForm.validateField('suitItemType');
          },
          // 处理分类回显
          categoryIds(data) {
            this.categoryIds = data;
            this.$refs.couponForm.validateField('suitItemType');
          },
        };
      },

      onDelAll() {
        this.storeList = [];
      },

      handleDelStoreItem(storeIndex) {
        this.storeList.splice(storeIndex, 1);
      },

      handleDelSubStoreItem(storeIndex, subIndex) {
        this.storeList[storeIndex].subStoreList.splice(subIndex, 1);
        if (!this.storeList[storeIndex].subStoreList.length) {
          this.handleDelStoreItem(storeIndex);
        }
      },

      onGroupItemsSelected(groups) {
        this.selectedLevelList = groups;
        // 主动除非表单进行验证
        this.$refs.couponForm.validateField('memberRestrictType');
      },
      handleDellevelItem(index) {
        this.selectedLevelList.splice(index, 1);
      },

      getData() {
        switch (this.couponForm.suitItemType) {
          case SuitItemType.CUSTOM: {
            this.couponForm.items = this.itemGoodsList.map(i => i.itemNo);
            // 选择指定商品需要将商品对应的店铺id存储
            const s = new Set();
            for (const i of this.itemGoodsList) {
              if (i.storeId && !s.has(i.storeId)) {
                s.add(i.storeId);
              }
            }
            this.couponForm.stores = Array.from(s.values());
            break;
          }
          case SuitItemType.CATEGORY: {
            this.couponForm.categoryIds = this.categoryIds.map(i => i.id).join(',');
            break;
          }
          case SuitItemType.STORE: {
            this.couponForm.stores = this.storeList.map(i => i.id);
            break;
          }
        }
      },

      onCancel() {
        this.$router.push('/marketing/coupon/coupon-list');
      },

      onSubmit() {
        if (this.loading) {
          return;
        }
        this.getData();
        this.$refs.couponForm
          .validate()
          .then(valid => {
            if (!valid) {
              return;
            }
            const { styleUrl, ...params } = this.couponForm;
            if (params.suitStoreType === 1 || !this.isEnterManger) {
              params.stores = this.storeList.map(store => {
                return store.storeId;
              });
              params.suitStoreType = 1;
              params.storeList = this.storeList;
            }
            // 非多项目店长，固定本项目
            if (
              this.isStoreKeeper &&
              this.epStoreList &&
              this.epStoreList.length &&
              this.epStoreList.length < 2 &&
              this.curStore
            ) {
              params.stores = this.curStore.id;
            }

            if (params.couponBackgroundStyle) {
              params.couponBackgroundUrl = styleUrl.imgUrl;
            }

            // 选择会员等级时进行转化
            if (params.memberRestrictType === ReceiveType.LEVEL) {
              params.memberLevelList = this.selectedLevelList.map(e => e.id);
            }

            this.loading = true;
            this.convertMoneyUnit(params);

            couponApi
              .addCoupon(params)
              .then(() => {
                this.$router.push({ path: '/marketing/coupon/coupon-list' });
              })
              .always(() => {
                this.loading = false;
              });
          })
          .catch(res => {
            return false;
          });
      },
    },
  };
</script>

<style lang="less" scoped>
  .head-tip-box {
    height: 52px;
    line-height: 52px;
    background: #f5f7fa;
    margin: 24px 24px 16px 24px;

    .head-tip {
      color: #909399;
      margin-left: 24px;
    }
  }

  .head-title {
    height: 22px;
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    color: #333;
    line-height: 22px;
    margin-left: 5px;
  }

  .coupon-radio {
    width: 220px;

    .el-radio {
      line-height: 40px;
    }
  }

  .bag-box {
    display: flex;
    align-items: center;

    .disable {
      display: none;
    }
  }

  .coupon-describe {
    width: 366px;

    .el-textarea__inner {
      resize: none;
    }
  }
</style>
