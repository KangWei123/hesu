<template>
  <div v-loading="isLoading" class="activity-edit">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <template v-if="!!deleteShow">
        <el-breadcrumb-item :to="{ path: '/marketing/pintuan/delete-list' }">删除的活动</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="{ path: '/marketing/pintuan/activity' }">活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ isEdit ? '修改' : '创建' }}活动</el-breadcrumb-item>
      </template>
    </el-breadcrumb>

    <el-form
      :disabled="disabled"
      :model="form"
      :rules="rules"
      label-width="150px"
      ref="elForm"
      class="pintuan-activity-form"
    >
      <el-form-item label="活动名称：" prop="name">
        <el-input v-model="form.name"></el-input>
      </el-form-item>

      <el-form-item prop="groupType" class="coupon-label dss-star" label="拼团类型：">
        <el-radio-group v-model="form.enableOldWithNew">
          <el-radio :label="0">普通拼团</el-radio>
          <el-radio :label="1">
            老带新拼团
            <el-tooltip class="item" effect="dark" content="所有用户可发起拼团，只有新用户能参团" placement="right">
              <i class="icon-tip"></i>
            </el-tooltip>
          </el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item label="活动时间：" prop="activityTime">
        <el-date-picker
          v-model="form.activityTime"
          @change="checkTime('activityTime')"
          type="datetimerange"
          :picker-options="options"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>

      <el-form-item label="核销时间：" prop="verificationTime" v-if="isShowVerificationTime">
        <el-date-picker
          v-model="form.verificationTime"
          @change="checkTime('verificationTime')"
          type="datetimerange"
          :picker-options="options"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
        <div class="tip-msg">核销时间仅适用门店自提，超过核销时间自动退款，无法取货，如不设置，默认可任何时间取货</div>
      </el-form-item>

      <el-form-item label="选择商品：" prop="goods">
        <el-button v-if="!isEdit && !form.goods" @click="onShowGoods" size="mini">选择商品</el-button>
        <div
          v-else-if="!!form.goods"
          class="form-goods"
          @click="onShowGoods"
          :style="{ cursor: isEdit ? 'default' : 'pointer' }"
        >
          <div class="goods-name">{{ form.goods.name }}</div>
          <el-button
            class="btn-close"
            v-if="!isEdit"
            icon="el-icon-close"
            @click.stop="onRemoveGoods"
            circle
          ></el-button>
        </div>
      </el-form-item>

      <div v-for="(item, index) in form.itemList" :key="index">
        <div class="ladder-container">
          <el-form-item
            label="拼团人数："
            :prop="'itemList.' + index + '.minPeople'"
            :rules="[
              { required: true, message: '请输入拼团人数' },
              { validator: reg.checkCount },
              { pattern: reg.intWithTwo.reg, message: reg.intWithTwo.msg },
            ]"
          >
            <el-input v-model.number="item.minPeople" style="width: 300px" />
          </el-form-item>

          <!-- 多规格商品 -->
          <el-form-item
            label="规格及价格："
            v-if="skuCols.length > 0"
            :prop="'itemList.' + index + '.skuList'"
            :rules="[{ validator: reg.checkPrice }]"
          >
            <div class="sku-div">
              <el-table :data="item.skuList" size="mini" class="sku-table">
                <el-table-column
                  v-for="col in skuCols"
                  :key="col.skuId"
                  :prop="col.prop"
                  :label="col.label"
                  width="104"
                >
                  <template slot-scope="scope">
                    <el-input v-if="col.type === 'input'" v-model="scope.row[col.prop]" @blur="onPriceBlur(index)" />
                    <span v-else-if="col.type === 'money'">{{ scope.row[col.prop] | price }}</span>
                    <span v-else-if="col.type === 'sellPrice'">{{ scope.row.sellPrice | price }}</span>
                    <span v-else>{{ scope.row[col.prop] }}</span>
                  </template>
                </el-table-column>
              </el-table>
            </div>
          </el-form-item>

          <!-- 普通商品 -->
          <template v-else v-for="(sku, skuIndex) in item.skuList">
            <el-form-item label="单买价格（原价）：" prop="labelPrice" :key="'labelPrice' + skuIndex">
              <div class="div-input">{{ sku.labelPrice | price }}</div>
              元
            </el-form-item>

            <el-form-item label="企业售价：" :key="'sellPrice' + skuIndex">
              <div class="div-input">{{ sku.sellPrice | price }}</div>
              元
            </el-form-item>

            <el-form-item
              label="团购价："
              :prop="'itemList.' + index + '.skuList.' + skuIndex + '.salePrice'"
              :key="'salePrice' + skuIndex"
              :rules="[
                { required: true, message: '请输入团购价' },
                { required: true, validator: reg.checkPrice },
              ]"
            >
              <el-input v-model="sku.salePrice" class="middle-width" />
              元
              <div class="tip-msg"></div>
            </el-form-item>
          </template>

          <el-button
            class="btn-delete"
            type="text"
            v-if="index !== 0"
            icon="el-icon-delete"
            @click="onRemoveSku(index)"
          ></el-button>
        </div>
      </div>

      <div v-if="form.goods">
        <el-button @click="onCopySku" style="margin: 0 0 20px 150px">添加阶梯</el-button>
      </div>

      <el-form-item label="拼团封面：" class="goods-label" prop="CoverUrl">
        <div
          class="classfiy-image-choose-container"
          :style="curStatus !== groupActivityStatus.INIT ? 'pointer-events: none;' : ''"
        >
          <image-selector style="margin-top: 10px" v-model="form.CoverUrl" @delete="onDeleteImg" />
          <div class="tip-msg">请根据展示样式上传图片尺寸，上图下文推荐尺寸为750：338，左图右文推荐尺寸为1：1</div>
        </div>
      </el-form-item>

      <el-form-item label="团长优惠：" prop="leaderProm">
        <el-input v-model="form.leaderProm" class="middle-width" />
        元
      </el-form-item>

      <el-form-item label="拼团时长：" prop="duration">
        <el-input v-model="form.duration" class="middle-width" />
        小时
        <div class="tip-msg">开团后，多少小时达不到拼团人数将会拼团失败。</div>
      </el-form-item>

      <el-form-item label="虚拟销量：" prop="virCount">
        <el-input v-model="form.virCount"></el-input>
      </el-form-item>

      <el-form-item label="拼团次数限制：" prop="limitTimes">
        <el-input v-model="form.limitTimes" />
        <div class="tip-msg">个人开团的次数限制，默认是0，没有次数限</div>
      </el-form-item>

      <el-form-item label="单次购买数量限制：" prop="limitItemCount">
        <el-input v-model="form.limitItemCount" />
      </el-form-item>

      <el-form-item label="机器人拼团：">
        <el-checkbox :true-label="1" :false-label="0" v-model="form.enableRobot"> 开启机器人拼团 </el-checkbox>
        <div class="tip-msg">该团有效期结束时，人数未满的团，系统将会填充机器人以“虚拟名称”凑满人数，使该团成团。</div>
      </el-form-item>

      <el-form-item prop="suitStoreType" class="coupon-label dss-star" v-show="form.goods" label="活动门店：">
        <el-radio-group
          v-if="isEnterpriseManager || identity"
          v-model="form.suitStoreType"
          @change="errorStoreList = []"
        >
          <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part">
            指定门店
            <el-button size="mini" v-if="form.suitStoreType === suitStoreTypeEnum.part" @click="handleSelectStore()">
              选择门店
            </el-button>

            <el-button
              size="mini"
              class="btn-rules left10"
              v-if="form.suitStoreType === suitStoreTypeEnum.part && curApp.industryKey !== 'home'"
              @click="handleImportStore()"
            >
              导入门店
            </el-button>
          </el-radio>
        </el-radio-group>

        <el-radio-group v-else-if="!isEnterpriseManager" v-model="form.suitStoreType">
          <el-radio :label="suitStoreTypeEnum.part" v-if="singleStore && storeList.length <= 1">本门店</el-radio>
          <el-radio :label="suitStoreTypeEnum.part" v-else>
            指定门店
            <el-button size="mini" class="btn-rules left10" @click="handleSelectStore()">选择门店</el-button>
          </el-radio>
        </el-radio-group>

        <el-button v-else size="mini" @click="handleSelectStore()">选择门店</el-button>
      </el-form-item>

      <div
        class="store-list-box"
        v-if="
          form.goods &&
          storeList &&
          storeList.length &&
          form.suitStoreType === suitStoreTypeEnum.part &&
          (!singleStore || storeList.length > 1)
        "
      >
        <div class="store-label">已选门店</div>
        <div class="store-content">
          <div class="store-item-box" v-for="(storeList, groupIndex) in groupStoreList" :key="groupIndex">
            <el-tag
              v-for="(store, storeIndex) in storeList"
              :key="store.id"
              :type="errorStoreListIds.includes(store.id) ? 'danger' : ''"
              @close="handleDelStoreItem(groupIndex, storeIndex)"
              :closable="!disabled"
            >
              {{ store.name }}
            </el-tag>
          </div>
        </div>
      </div>

      <div
        class="store-list-error-box"
        v-else-if="form.suitStoreType === suitStoreTypeEnum.all && errorStoreList.length"
      >
        <el-tag v-for="store in errorStoreList" :key="store.id" type="danger">
          {{ store.name }}
        </el-tag>
      </div>
    </el-form>

    <local-resolve-xls @resolve="onResolveImportStore" :visible.sync="resolveXlsDialogVisible" title="导入门店" />

    <!-- 选择商品弹框 -->
    <goods-select-dialog
      filter-offline
      v-model="showGoodsDialog"
      show-goods-type-tab
      :enable-handler="enableHandler"
      @single-choosed="onSelectGroupGoods"
      :ext-params="{ mode: 0 }"
    />

    <!-- 选择门店弹框 -->
    <store-select-dialog
      :selected-stores="storeList"
      enable-multiple
      :api-url="queryParams && queryParams.itemNo ? '/wp/store/queryByItemDept' : 'wp/store/query/dept'"
      :is-all="true"
      :query-params="queryParams"
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
      :is-show-area="!!isEnterpriseManager"
      :is-show-dealer="!!isEnterpriseManager"
    ></store-select-dialog>

    <div class="bottom-button">
      <el-button @click="onCancle">{{ curStatus === groupActivityStatus.INIT ? '取消' : '关闭' }}</el-button>
      <el-button
        :disabled="disabled"
        v-if="curStatus === groupActivityStatus.INIT || curStatus === groupActivityStatus.SHELF"
        type="primary"
        @click="onSave"
        >保存</el-button
      >
    </div>
  </div>
</template>

<script>
  import './index.less';
  import { mapState } from 'vuex';
  import api from '@/dss-wechat3rd/src/constants/index';
  import groupApi from '@/dss-wechat3rd/src/api/group';
  import commonApi from '@/dss-wechat3rd/src/api';
  import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
  import regexps from '@/dss-common/utils/regexps.js';
  import { groupActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';
  import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
  import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
  import ImageSelector from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';
  import utilDate from '@/dss-common/utils/date.js';
  import floatNum from '@/dss-common/utils/float-num.js';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';
  import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';

  const storeGroupCount = 6;
  const convert = {
    leaderProm: v => floatNum.floatMul(v, 100),
    salePrice: v => floatNum.floatMul(v, 100),
    sellPrice: v => floatNum.floatMul(v, 100),
    labelPrice: v => floatNum.floatMul(v, 100),
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
              peopleCount: item.minPeople,
              salePrice: Math.round(sku.salePrice * 100),
              sellPrice: sku.sellPrice,
              labelPrice: sku.labelPrice,
              thumbnail: item.thumbnail,
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
    goods: v => null,
  };

  export default {
    components: {
      GoodsSelectDialog,
      StoreSelectDialog,
      ImageSelector,
      LocalResolveXls,
    },

    data() {
      const { money, positiveInt, intWithZero, intWithTwo } = regexps;

      // 活动名称校验规则
      const validate = (rule, value, callback) => {
        if (value.trim() === '') {
          return callback(new Error('请输入活动名称'));
        }
        return callback();
      };

      // 拼团人数校验规则
      const checkCount = (rule, value, callback) => {
        const curIndex = parseInt(rule.fullField.split('.')[1]);
        const finded = this.form.itemList.find((item, index) => item.minPeople === value && index !== curIndex);
        if (!finded) {
          return callback();
        }
        callback(new Error(`已经存在拼团人数${value}`));
      };

      // 团购价校验规则
      const checkPrice = (rule, value, callback) => {
        // 判断是否为有sku的商品，有sku的则需要循环判断
        if (typeof value === 'string' || typeof value === 'number') {
          // 普通商品的售价，因为普通商品没有多种规格售价，只有一种售价，而且不能更改，所以只需要选择第一个的售价来判断
          const sellPrice = this.form.itemList[0].skuList[0].sellPrice;
          if (!value) {
            return callback(new Error('请输入团购价'));
          } else if (!money.reg.test(value)) {
            return callback(money.msg);
          } else if (value >= sellPrice / 100) {
            return callback(new Error('团购价必须小于售价'));
          }
        } else {
          value.forEach(v => {
            if (!v.salePrice) {
              return callback(new Error('请输入团购价'));
            } else if (!money.reg.test(v.salePrice + '')) {
              return callback(money.msg);
            } else if (v.salePrice >= v.sellPrice / 100) {
              return callback(new Error('团购价必须小于售价'));
            }
          });
        }
        return callback();
      };

      // 活动门店校验规则
      const storeValidator = async (rule, value, callback) => {
        this.errorStoreList = [];

        const { all, list: unavaliableStoreList } = (await this.queryUnavaliableStoreList()) || [];
        const unavaliableStoreListIds = unavaliableStoreList.map(i => i.id);
        if (this.form.suitStoreType === suitStoreTypeEnum.all) {
          if (all) {
            return callback(new Error('该商品在全部门店已有拼团活动'));
          }
          if (unavaliableStoreList.length) {
            this.errorStoreList = unavaliableStoreList;
            return callback(new Error('该商品在以下门店已有拼团活动，请重新选择指定门店'));
          }

          return callback();
        } else if (this.singleStore) {
          // 本门店
          if (all || unavaliableStoreListIds.includes(this.epStoreList[0].id)) {
            return callback(new Error('该商品在门店已有拼团活动'));
          }

          if (!this.form.goods || !this.form.goods.itemNo) return callback();

          // 查询上架门店
          const { data } = await commonApi.queryItemStore({ itemNo: this.form.goods.itemNo });
          if (!data || !data.map(i => i.id).includes(this.epStoreList[0].id)) {
            return callback(new Error('该商品在门店未上架'));
          }
        } else {
          if (this.storeList && this.storeList.length) {
            this.errorStoreList = this.storeList.filter(i => unavaliableStoreListIds.includes(i.id));
            if (this.errorStoreList.length) {
              return callback(new Error('该商品在以下门店已有拼团活动，请重新选择指定门店'));
            }
            return callback();
          } else {
            return callback(new Error('请选择门店'));
          }
        }
      };

      return {
        resolveXlsDialogVisible: false,
        // 禁止商品选择的回调钩子，定金商品不允许选择
        enableHandler: function (row) {
          return !row.frontMoneyItem;
        },
        isLoading: false,

        activityId: null, // 活动ID
        deleteShow: false, // 是否为删除列表页面进入
        disabled: false,

        goodsTypeEnum, // 商品类型常量，用户判断是否显示核销时间（类型为产品的才有核销时间）

        suitStoreTypeEnum, // 使用门店类型常量

        form: {
          name: '', // 活动名称
          enableOldWithNew: 0, // 是否为老带新拼团，默认为0：普通拼团、1：老带新拼团
          activityTime: [], // 活动时间（"activityStartTime": "2019-08-30 00:00:00",  "activityEndTime": "2019-09-30 00:00:00",）
          verificationTime: [], // 核销时间（"verificationStartTime": "2019-08-30 00:00:00",  "verificationEndTime": "2019-10-30 00:00:00",）
          goods: null, // 选中的商品
          itemList: [], // 商品规格
          CoverUrl: null, // 拼团封面
          leaderProm: null, // 团长优惠
          duration: null, // 拼团时长
          virCount: null, // 虚拟销量
          limitTimes: 0, // 拼团次数限制
          limitItemCount: null, // 单次购买数量限制
          enableRobot: 0, // 是否开启机器人拼团
          suitStoreType: suitStoreTypeEnum.all, // 参与活动的门店
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
              },
            },
            {
              text: '未来一个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 30);
                picker.$emit('pick', [start, end]);
              },
            },
            {
              text: '未来三个月',
              onClick(picker) {
                const end = new Date();
                const start = new Date();
                end.setTime(end.getTime() + 3600 * 1000 * 24 * 90);
                picker.$emit('pick', [start, end]);
              },
            },
          ],
        },
        storeIds: '', // 非超管状态是否选择全部门店
        identity: '', // 当前活动创建者身份
        showGoodsDialog: false, // 是否显示选择商品弹框
        skuCols: [], // 规格动态列表
        hasSku: false, // 是否有规格，卡项无规格

        showStoreDialog: false, // 是否展示选择门店对话弹框
        queryParams: null, // 查询门店列表参数
        storeList: [], // 选中的门店列表
        originStoreList: [],
        errorStoreList: [],
        groupStoreList: [], // 选中的门店列表

        groupActivityStatus, // 拼团活动状态常量
        curStatus: groupActivityStatus.INIT, // 当前的活动状态
        rules: {
          name: [
            { required: true, message: '请输入活动名称' },
            {
              max: 80,
              message: '最大长度80个字符',
            },
            {
              validator: validate,
              trigger: 'blur',
            },
          ],
          enableOldWithNew: [{ required: true, message: '请选择拼团类型' }],
          activityTime: {
            type: 'array',
            required: true,
            message: '请选择活动时间',
          },
          goods: {
            required: true,
            message: '请选择商品',
          },
          CoverUrl: [
            {
              required: true,
              message: '请选择拼团封面',
            },
          ],
          leaderProm: [
            {
              required: true,
              message: '请输入团长优惠',
            },
            {
              pattern: money.reg,
              message: money.msg,
            },
          ],
          duration: [
            {
              required: true,
              message: '请输入拼团时长',
            },
            {
              pattern: positiveInt.reg,
              message: positiveInt.msg,
            },
          ],
          virCount: [
            {
              pattern: intWithZero.reg,
              message: intWithZero.msg,
            },
          ],
          limitTimes: [
            {
              required: true,
              message: '请输入拼团次数限制',
            },
            {
              pattern: intWithZero.reg,
              message: intWithZero.msg,
            },
          ],
          limitItemCount: [
            {
              required: true,
              message: '请输入单次购买数量限制',
            },
            {
              pattern: positiveInt.reg,
              message: positiveInt.msg,
            },
          ],
          suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        },
        // 元素行内验证规则
        reg: {
          positiveInt,
          money,
          checkCount,
          checkPrice,
          intWithTwo,
        },
        copy: false, // 是否复制的活动
        validateLoading: false,
      };
    },

    computed: {
      ...mapState({
        curApp: 'curApp',
        env: 'env',
        roleList: 'roleList',
        epStoreList: 'storeList',
      }),

      errorStoreListIds() {
        return this.errorStoreList.map(i => i.id);
      },

      // 是否企业管理员
      isEnterpriseManager() {
        return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      },

      // 店长角色
      isStoreKeeper() {
        return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
      },

      // 是否为编辑状态
      isEdit() {
        return !!this.activityId && !this.copy;
      },

      // 是否显示核销时间
      isShowVerificationTime() {
        if (
          !!this.form.goods &&
          !!this.form.goods.type &&
          (this.form.goods.type === this.goodsTypeEnum.rooms.value ||
            this.form.goods.type === this.goodsTypeEnum.ticket.value)
        ) {
          return false;
        }
        return true;
      },

      singleStore() {
        return this.epStoreList && this.epStoreList.length === 1 && this.isStoreKeeper;
      },
    },

    watch: {
      // 监听表单中的商品选择，进行实时验证
      'form.goods'() {
        const form = this.$refs.elForm;
        form.validateField('goods');
      },
      'form.suitStoreType'() {
        const form = this.$refs.elForm;
        form.validateField('suitStoreType');
      },
    },

    mounted() {
      this.activityId = this.$route.query.activityId || null;
      this.deleteShow = this.$route.query.deleteShow ? Number(this.$route.query.deleteShow) : 0;
      this.disabled = this.$route.query.disabled ? !!+this.$route.query.disabled : false;
      this.copy = this.$route.query.copy || false;

      this.getActivityDetail(); // 查询该拼团活动详情
      if (!this.isEnterpriseManager) {
        this.form.suitStoreType = suitStoreTypeEnum.part;
      }
    },

    methods: {
      /**
       * 查询该拼团活动详情
       */
      getActivityDetail() {
        if (this.activityId) {
          const params = {
            activityId: this.activityId,
          };

          groupApi.getActivityDetail(params).then(
            res => {
              if (!res.data) {
                // 请求后端成功，但返回data为空（data为空，activityId有可能是乱填的），把activityId置为null
                this.activityId = null;
                this.$router.push('/marketing/pintuan/activity/edit');
                return;
              }
              this.setFormData(res.data);
            },
            () => {
              // 异常，路径去掉activityId进入新建态
              this.activityId = null;
              this.$router.push('/marketing/pintuan/activity/edit');
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

        // 是否为老带新拼团
        this.form.enableOldWithNew = data.enableOldWithNew || 0;

        // 活动时间
        if (data.activityStartTime && data.activityEndTime) {
          this.form.activityTime = [new Date(data.activityStartTime), new Date(data.activityEndTime)];
        }

        // 核销时间
        if (data.verificationStartTime && data.verificationEndTime) {
          this.form.verificationTime = [new Date(data.verificationStartTime), new Date(data.verificationEndTime)];
        }

        // 根据选中的商品itemNo查询商品详情接口，设置skuList
        if (!this.copy || data.status === groupActivityStatus.NOT_SHELF) {
          this.form.goods = {
            itemNo: data.itemNo,
            price: data.salePrice,
            name: data.itemName,
            type: data.itemType,
          };
          this.setSkuList(data);
        }

        // 团长优惠
        this.form.leaderProm = data.leaderProm / 100;

        // 拼团时长
        this.form.duration = data.duration;

        // 虚拟销量
        this.form.virCount = data.virCount;

        // 拼团次数限制
        this.form.limitTimes = data.limitTimes;

        // 单次购买数量限制
        this.form.limitItemCount = data.limitItemCount;

        // 是否开启机器人拼团
        this.form.enableRobot = data.enableRobot;

        // 活动创建者身份true->超管
        this.identity = data.activityLevel == '1';
        this.storeIds = data.storeIds;
        if (data.storeBriefVOS && data.storeBriefVOS.length > 0) {
          // 数据填充表单
          this.form.suitStoreType = suitStoreTypeEnum.part; // 勾选部分门店
          this.storeList.push(...data.storeBriefVOS);
          this.originStoreList = data.storeBriefVOS;
          this.assembleGroupStoreList(); // 调配拼团门店列表数组
        } else if (this.identity && !data.storeBriefVOS) {
          // 品牌活动才能选择全部门店
          this.form.suitStoreType = suitStoreTypeEnum.all;
        }

        // 当前的活动状态
        this.curStatus = data.status;

        if (this.copy) {
          this.curStatus = groupActivityStatus.INIT;
          this.form.name = data.name + '-复制';
        }

        // 查询门店列表的参数
        this.queryParams = {
          itemNo: this.form.goods.itemNo,
        };
      },

      /**
       * 根据选中的商品itemNo查询商品详情接口，设置skuList
       */
      setSkuList(data) {
        // 请求完商品信息后，请求商品详情信息，获取sku信息，指定不同的拼团价格
        api.goods
          .detail(data.itemNo)
          .done(res => {
            const wxItem = res.data.wxItem;

            // 查询门店列表的参数
            this.queryParams = {
              itemNo: wxItem.itemNo,
            };

            // 拼团封面
            this.form.CoverUrl = { imgUrl: data.backgroundUrl || wxItem.thumbnail };

            // 商品详细信息
            const productInfo = {
              name: wxItem.name,
              itemNo: wxItem.itemNo,
              price: wxItem.salePrice,
              labelPrice: wxItem.labelPrice,
              type: wxItem.type,
            };

            const skuCols = []; // sku规格表头信息
            const skuInfoList = res.data.skuInfoList || [];
            // 判断当前商品是否有sku，设置拼团人数及商品sku表格信息，如果是编辑活动的，拼团人数及商品信息则会被下面的活动详情中的信息覆盖
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
                    sellPrice: sku.salePrice,
                    skuBarcode: sku.skuBarcode,
                    thumbnail: sku.skuImg || wxItem.thumbnail,
                    notOptional: sku.notOptional,
                  };

                  list.push(obj);
                }

                // 设置sku规格表头信息
                sku.skuInfoNames.forEach((item, itemIndex) => {
                  const key = `dy_prop_${itemIndex}`;
                  obj[key] = item.valName;
                  if (index === 0) {
                    skuCols.push({
                      // label: item.keyName,
                      label: item.ancestryKeyName || item.keyName, // 兼容多级规格展示表头
                      prop: key,
                    });
                  }
                });

                productInfo.skuInfoList = list;
              });
            } else {
              // 设置拼团人数及商品信息，如果是编辑活动的，拼团人数及商品信息则会被下面的活动详情中的信息覆盖
              productInfo.skuInfoList = [
                {
                  skuId: null,
                  itemNo: wxItem.itemNo,
                  labelPrice: wxItem.labelPrice,
                  sellPrice: wxItem.salePrice,
                  skuBarcode: null,
                },
              ];
            }
            this.form.goods = productInfo;

            // 规格表头赋值
            if (skuCols.length > 0) {
              skuCols.push(
                {
                  label: '原价',
                  prop: 'labelPrice',
                  type: 'money',
                },
                {
                  label: '企业售价',
                  prop: 'sellPrice',
                  type: 'sellPrice',
                },
                {
                  label: '团购价',
                  prop: 'salePrice',
                  type: 'input',
                }
              );
            }
            this.skuCols = skuCols;

            // 规格处理
            // 判断是否为编辑活动，以便获取活动详情渲染页面
            if (!this.isEdit && data.status !== groupActivityStatus.NOT_SHELF) {
              // 设置拼团人数及商品信息，进行页面渲染
              const skuList = productInfo.skuInfoList.map(sku => {
                const ptSku = {};
                for (const key in sku) {
                  ptSku[key] = sku[key];
                }
                return ptSku;
              });
              this.form.itemList = [
                {
                  minPeople: 2,
                  skuList: skuList,
                },
              ];
            } else {
              // 获取活动详情，设置拼团人数及商品信息，进行页面渲染
              const list = [];
              data.itemList.forEach(item => {
                const pCount = item.peopleCount + '';
                if (list[pCount]) {
                  list[pCount].push(item);
                } else {
                  list[pCount] = [];
                  list[pCount].push(item);
                }
              });

              // 在商品列表中添加对应的参数
              list.forEach((item, index) => {
                item.forEach((skuItem, idx) => {
                  // 商品的团购价
                  skuItem.salePrice = skuItem.salePrice /= 100;
                  skuItem.sellPrice = wxItem.salePrice;
                  // 判断当前商品是否有sku
                  if (skuInfoList && skuInfoList.length) {
                    skuInfoList.forEach((sku, skuIndex) => {
                      if (Number(skuItem.skuId) === sku.skuId) {
                        // 商品售价，标价，以从商品那获取规格的价格为准，拼团那里的获取的价格为次
                        skuItem.sellPrice = sku.salePrice;
                        skuItem.labelPrice = sku.labelPrice;

                        // 设置列表中sku对应的key值
                        sku.skuInfoNames.forEach((skuInfoName, skuInfoNameIndex) => {
                          const k = `dy_prop_${skuInfoNameIndex}`;
                          skuItem[k] = skuInfoName.valName;
                        });
                      }
                    });
                  }
                });

                // 将每个阶梯的拼团人数抽出来
                const listObj = {
                  minPeople: item[0].peopleCount,
                  skuList: item,
                };
                this.form.itemList.push(listObj);
              });
            }
          })
          .always(() => {
            this.isLoading = false;
          });
      },

      /**
       * 删除商品封面图片
       */
      onDeleteImg() {
        this.form.CoverUrl = null;
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

        this.storeList = [];
        this.assembleGroupStoreList();

        if (!this.isEnterpriseManager) {
          this.form.suitStoreType = suitStoreTypeEnum.part;
        } else {
          this.form.suitStoreType = suitStoreTypeEnum.all;
        }
        this.$refs.elForm.validateField('suitStoreType');
      },

      /**
       * 完成商品选择
       */
      onSelectGroupGoods(row) {
        this.isLoading = true;

        this.storeList = [];
        this.assembleGroupStoreList();

        this.setSkuList(row); // 根据选中的商品itemNo查询商品详情接口，设置skuList
      },

      /**
       * 商品规格价格输入验证
       */
      onPriceBlur(index) {
        const form = this.$refs.elForm;
        form.validateField(`itemList.${index}.skuList`);
      },

      /**
       * 添加sku规格阶梯
       */
      onCopySku() {
        const itemList = this.form.itemList;
        if (!itemList || !itemList.length) {
          return;
        }
        // 计算拼团人数
        let max = 1;
        itemList.forEach(item => {
          if (item.minPeople > max) {
            max = item.minPeople;
          }
        });

        // 清空新增阶梯中的团购价，让用户重新填写
        const skuList = this.$plain(itemList[0].skuList);
        skuList.forEach(item => {
          item.salePrice = null;
        });

        itemList.push({
          minPeople: max + 1,
          skuList: skuList,
        });
      },

      /**
       * 删除添加的sku规格阶梯
       */
      onRemoveSku(index) {
        this.form.itemList.splice(index, 1);
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
        this.storeList = storeList;
        this.assembleGroupStoreList(); // 调配拼团门店列表数组
        this.$refs.elForm.validateField('suitStoreType');
      },
      handleImportStore() {
        this.resolveXlsDialogVisible = true;
      },

      onResolveImportStore(storeList) {
        this.storeList = storeList;
        this.assembleGroupStoreList(); // 调配拼团门店列表数组
        this.$refs.elForm.validateField('suitStoreType');
      },

      /**
       * 删除选择的门店
       */
      handleDelStoreItem(groupIndex, storeIndex) {
        this.storeList.splice(groupIndex * storeGroupCount + storeIndex, 1);
        this.assembleGroupStoreList(); // 调配拼团门店列表数组
        this.$refs.elForm.validateField('suitStoreType');
      },

      /**
       * 调配拼团门店列表数组
       */
      assembleGroupStoreList() {
        this.groupStoreList = [];
        let start = 0;
        while (start < this.storeList.length) {
          // 每6个分成一组展示
          this.groupStoreList.push(this.storeList.slice(start, start + storeGroupCount));
          start += storeGroupCount;
        }
      },

      /**
       * 判断核销结束时间是否早于活动结束时间
       */
      checkTime(timeType) {
        const activityTime = this.form.activityTime;
        const verificationTime = this.form.verificationTime;
        if (
          activityTime &&
          activityTime.length > 0 &&
          verificationTime &&
          verificationTime.length > 0 &&
          activityTime[1] > verificationTime[1]
        ) {
          this.$message.error('核销结束时间不可早于活动结束时间');
          this.form[timeType] = []; // 清空当前选择的时间
        }
      },

      /**
       * 保存拼团活动
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
          const keyObject = {};
          for (const item of itemList) {
            const key = `key_${item.minPeople}`;
            if (keyObject[key]) {
              return this.$message.warning('拼团人数不能重复。');
            }
            keyObject[key] = true;
          }
          this.save();
        });
      },

      /**
       * 执行拼团活动创建或修改保存接口
       */
      save() {
        const params = this.toParam();
        let methodProp = 'createActivity';
        if (this.isEdit) {
          params.id = this.activityId;
          methodProp = 'updateActivity';
        }
        this.isLoading = true;

        groupApi[methodProp](params)
          .done(res => {
            this.$message({
              message: this.isEdit ? '修改成功' : '创建成功。',
              type: 'success',
            });
            this.$router.push('/marketing/pintuan/activity');
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
        if (this.form.suitStoreType === suitStoreTypeEnum.part || !this.isEnterpriseManager) {
          params.storeIds = '';
          const len = this.storeList.length;
          this.storeList.forEach((store, index) => {
            params.storeIds += store.id;
            if (index < len - 1) {
              params.storeIds += ',';
            }
          });
          // 本门店
          if (!this.storeList.length && this.singleStore) {
            params.storeIds = this.epStoreList[0].id + '';
          }
        }
        if (!this.isEnterpriseManager) {
          params.suitStoreType = suitStoreTypeEnum.part;
        }

        // 服务端接受时间格式为年月日时分秒
        const timemat = 'YYYY-MM-DD HH:mm:ss';
        // 活动时间
        params.activityStartTime = utilDate.format(this.form.activityTime[0], timemat);
        params.activityEndTime = utilDate.format(this.form.activityTime[1], timemat);
        delete params.activityTime;

        // 核销时间
        if (this.form.verificationTime && this.form.verificationTime.length > 0) {
          // 判断商品类型不等于门票及客房类型，则允许添加核销开始与结束时间请求参数
          if (
            this.form.goods.type !== this.goodsTypeEnum.rooms.value &&
            this.form.goods.type !== this.goodsTypeEnum.ticket.value
          ) {
            params.verificationStartTime = utilDate.format(this.form.verificationTime[0], timemat);
            params.verificationEndTime = utilDate.format(this.form.verificationTime[1], timemat);
          }
          delete params.verificationTime;
        }

        if (this.form.CoverUrl) {
          params.backgroundUrl = this.form.CoverUrl.imgUrl;
        } else {
          params.backgroundUrl = '';
        }
        return params;
      },

      /**
       * 取消或关闭拼团活动的创建或修改
       */
      onCancle() {
        if (this.curStatus === groupActivityStatus.DELETED) {
          this.$router.push('/marketing/pintuan/delete-list');
        } else {
          this.$router.push('/marketing/pintuan/activity');
        }
      },

      async queryUnavaliableStoreList() {
        if (this.form.goods && this.form.goods.itemNo) {
          let { data } = await groupApi.queryUnavaliableStore({
            itemNo: this.form.goods.itemNo,
            activityId: this.activityId,
          });

          // 全部门店不可用
          const all = (data || []).some(i => i.id === -1);
          if (all) {
            data = [...this.storeList];
          }

          // 排除 原先 门店
          const originStoreIds = this.originStoreList.map(i => i.id);
          return { all, list: (data || []).filter(({ id }) => !originStoreIds.includes(id)) };
        }
        return { all: false, list: [] };
      },
    },
  };
</script>

<style lang="less" scoped>
  .footer {
    margin: 0 0 30px 150px;
  }
</style>
