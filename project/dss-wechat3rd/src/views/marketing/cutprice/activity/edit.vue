<template>
  <div v-loading="isLoading" class="cut-price-edit">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/marketing/cutprice/activity/list' }">活动管理</el-breadcrumb-item>
      <el-breadcrumb-item>{{ isEdit ? '修改' : '创建' }}活动</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="wkt-card">
      <el-form :model="form" :rules="rules" label-width="150px" ref="elForm" size="mini" class="activity-form" :disabled="curStatus === cutpriceActivityStatus.DELETED || disabled">
        <el-form-item label="活动名称：" prop="activityName">
          <el-input :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED" v-model="form.activityName"></el-input>
        </el-form-item>
        <el-form-item label="选择商品：" prop="itemNo">
          <el-button
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-if="!isEdit && !form.itemNo"
            @click="onShowGoods"
            >选择商品
          </el-button>
          <div
            v-else-if="!!form.itemNo"
            class="form-goods"
            @click="onShowGoods"
            :style="{ cursor: isEdit ? 'default' : 'pointer' }"
          >
            <div class="goods-name">{{ form.itemName }}</div>
            <div>
              企业售价：
              <span class="goods-price">{{ form.salePrice | price }}</span>
              元
            </div>
            <el-button
              class="btn-close"
              v-if="!this.isEdit"
              icon="el-icon-close"
              @click.stop="onRemoveGoods"
              circle
            ></el-button>
          </div>
        </el-form-item>

        <el-form-item label="企业售价：" prop="salePrice">
          <div class="div-input">{{ form.salePrice | price }}</div>
          元
        </el-form-item>
        <el-form-item label="是否最低价购买">
          <el-radio-group :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED" v-model="form.lowestPriceBuy">
            <el-radio :label="1">必须最低价购买</el-radio>
            <el-radio :label="0">任意价格均可购买</el-radio>
          </el-radio-group>
          <div class="tip-msg">会员可以在砍到任意价格时购买，或者必须最低价购买。</div>
        </el-form-item>
        <el-form-item label="砍价最低价" prop="lowestPrice">
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.lowestPrice"
            class="middle-width"
          />
          元
          <div class="tip-msg">支持0元，砍价活动到达此价格即算砍价结束。</div>
        </el-form-item>
        <el-form-item label="活动时间" prop="dateRange">
          <el-date-picker
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.dateRange"
            type="datetimerange"
            :picker-options="options"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            align="right"
          >
          </el-date-picker>
          <div class="tip-msg">砍价活动起止时间，到时间则活动结束</div>
        </el-form-item>
        <el-form-item label="砍价时间：" prop="bargainDuration">
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.bargainDuration"
            class="middle-width"
          />
          小时
          <div class="tip-msg">若到时间没有购买，则视为砍价失败</div>
        </el-form-item>
        <el-form-item label="砍价达成人数：" prop="bargainPeople">
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.bargainPeople"
            class="middle-width"
          ></el-input>
          人
          <div class="tip-msg">
            建议10人以内，比较容易达成。
            <br />
            若想控制成本，可以选择“任意价格均可购买”，然后设置更多的参与人数。
          </div>
        </el-form-item>

        <el-form-item label="虚拟参与人数：" prop="virtualPeople">
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model.number="form.virtualPeople"
            class="middle-width"
          ></el-input>
          人
          <div class="tip-msg">手机端显示某活动的总人数，建议合理设置。</div>
        </el-form-item>

        <el-form-item label="发起砍价次数：" prop="maxBargainCount">
          <el-select
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.bargainLimitType"
            style="width:140px"
            placeholder="选择时间限制"
          >
            <el-option label="本活动周期" :value="0"></el-option>
            <el-option label="每天" :value="1"></el-option>
          </el-select>
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model.number="form.maxBargainCount"
            maxlength="10"
            class="middle-width"
          ></el-input>
          次/人
          <div class="tip-msg">本次活动中会员可发起的次数限制，默认0为无限制，如砍价失败，不记做发起次数</div>
        </el-form-item>

        <el-form-item label="帮砍次数：" prop="maxAssistCount">
          <el-select
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model="form.assistLimitType"
            style="width:140px"
            placeholder="选择时间限制"
          >
            <el-option label="本活动周期" :value="0"></el-option>
            <el-option label="每天" :value="1"></el-option>
          </el-select>
          <el-input
            :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED"
            v-model.number="form.maxAssistCount"
            maxlength="10"
            class="middle-width"
          ></el-input>
          次/人
          <div class="tip-msg">本次活动中会员可参与的帮砍价次数限制，默认0为无限制</div>
        </el-form-item>

        <el-form-item prop="suitStoreType" class="coupon-label dss-star" v-if="form.itemNo" label="活动门店">
          <el-radio-group
            :disabled="
              curStatus !== cutpriceActivityStatus.NOT_STARTED && curStatus !== cutpriceActivityStatus.ON_GOING
            "
            v-model="form.suitStoreType"
            @change="errorStoreList = []"
          >
            <el-radio v-if="isEnterpriseManager || (form.suitStoreType === suitStoreTypeEnum.all && disabled)" :label="suitStoreTypeEnum.all">全部门店</el-radio>
            <el-radio :label="suitStoreTypeEnum.part">
              {{ singleStore && 1 >= storeList.length ? '本门店': '指定门店' }}
              <el-button
                :disabled="curStatus !== cutpriceActivityStatus.NOT_STARTED && curStatus !== cutpriceActivityStatus.ON_GOING"
                v-if="form.suitStoreType === suitStoreTypeEnum.part && !singleStore"
                @click="handleSelectStore()">
                选择门店
              </el-button>
              <el-button
                :disabled="
                  curStatus !== cutpriceActivityStatus.NOT_STARTED && curStatus !== cutpriceActivityStatus.ON_GOING && !singleStore
                "
                class="btn-rules left10"
                v-if="form.suitStoreType === suitStoreTypeEnum.part && curApp.industryKey !== 'home'"
                @click="handleImportStore()"
                >导入门店
              </el-button>
            </el-radio>
          </el-radio-group>
        </el-form-item>
        
        <div
          class="store-list-box"
          v-if="form.itemNo && storeList && storeList.length && form.suitStoreType == suitStoreTypeEnum.part && (!singleStore || storeList.length > 1)"
        >
          <div class="store-label">已选门店</div>
          <div
            class="store-content"
            :style="
              curStatus !== cutpriceActivityStatus.NOT_STARTED && curStatus !== cutpriceActivityStatus.ON_GOING
                ? 'pointer-events: none;'
                : ''
            "
          >
            <div class="store-item-box" v-for="(storeList, groupIndex) in groupStoreList" :key="storeList.id">
              <el-tag
                v-for="(store, storeIndex) in storeList"
                :key="store.id"
                :type="errorStoreListIds.includes(store.id)? 'danger': ''"
                @close="handleDelStoreItem(groupIndex, storeIndex)"
                :closable="!disabled"
              >
                {{ store.name }}
              </el-tag>
            </div>
          </div>
        </div>

        <div class="store-list-box"  v-if="form.suitStoreType == suitStoreTypeEnum.all && errorStoreList.length">
          <el-tag
            v-for="(store) in errorStoreList"
            :key="store.id"
            type="danger"
          >
            {{ store.name }}
          </el-tag>
        </div>
      </el-form>
    </div>

      <div class="bottom-button">
        <el-button @click="onCancle">
          {{ curStatus === cutpriceActivityStatus.NOT_STARTED ? '取消' : '关闭' }}
        </el-button>
        <el-button
          type="primary"
          v-if="curStatus === cutpriceActivityStatus.NOT_STARTED"
          :disabled="disabled"
          @click="onSave"
          >保存
        </el-button>
    </div>

    <local-resolve-xls @resolve="onResolveImportStore" :visible.sync="resolveXlsDialogVisible" title="导入门店" />

    <goods-select-dialog
      filter-offline
      v-model="dialog.goods"
      choose-sku
      show-goods-type-tab
      :enable-handler="enableHandler"
      @single-choosed="onGoodsChange"
    />
    <store-select-dialog
      :selected-stores="storeList"
      enable-multiple
      :api-url="queryParams && queryParams.itemNo? '/wp/store/queryByItemDept': 'wp/store/query/dept'"
      :query-params="queryParams"
      :is-all="true"
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
      :is-show-area="!!isEnterpriseManager"
      :is-show-dealer="!!isEnterpriseManager"
    >
    </store-select-dialog>
  </div>
</template>

<script>
import { mapState } from 'vuex';
import api from '@/dss-wechat3rd/src/api/cutprice.js';
import commonApi from '@/dss-wechat3rd/src/api';
import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum';
import GoodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';
import regexps from '@/dss-common/utils/regexps.js';
import utilDate from '@/dss-common/utils/date.js';
import StoreSelectDialog from '@/dss-wechat3rd/src/bz_components/store-select-dialog/index.vue';
import suitStoreTypeEnum from '@/dss-wechat3rd/src/constants/suitStoreTypeEnum.js';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
import { cutpriceActivityStatus } from '@/dss-wechat3rd/src/constants/enum.js';

const storeGroupCount = 6;

const bargainApi = api.bargain;

export default {
  components: {
    LocalResolveXls,
    GoodsSelectDialog,
    StoreSelectDialog
  },

  data() {
    const { money, name, positiveInt, intWithZero } = regexps;

    const validate = (rule, value, callback) => {
      if (value.trim() === '') {
        return callback('请输入活动名称');
      }
      return callback();
    };

    const storeValidator = async (rule, value, callback) => {
      const { all, list: errorStoreList } = await this.queryUnavaliableStoreList();
      const errorStoreIds = errorStoreList.map(i => i.id);

      const { data } = await commonApi.queryItemStore({ itemNo: this.form.itemNo });

      if (this.form.suitStoreType === suitStoreTypeEnum.all) {
        if (all) {
          return callback('该商品在全部门店已有砍价活动');
        }
        if (errorStoreIds.length) {
          this.errorStoreList = errorStoreList;
          return callback('该商品在以下门店已有砍价活动，请重新选择指定门店');
        }
        return callback();
      } else if (this.singleStore) {
        const curStore = this.allStoreList[0];
        if (all || errorStoreIds.includes(curStore.id)) {
          return callback('该商品在门店已有砍价活动');
        }

        if (!data || !data.map(i => i.id).includes(curStore.id)) {
          return callback('该商品在门店未上架');
        }

        return callback();
      } else {
        if (this.storeList && this.storeList.length) {
          this.errorStoreList = this.storeList.filter(i => errorStoreIds.includes(i.id));

          if (this.errorStoreList.length) {
            return callback('该商品在以下门店已有砍价活动，请重新选择指定门店');
          }

          return callback();
        } else {
          return callback('请选择门店');
        }
      }
    };

    const checkBargainPeople = (rule, value, callback) => {
      if (value < 2 || !/(^[1-9]\d{0,6}$)|(^0$)/.test(value)) {
        return callback(new Error('达成人数必须为2~9999999之间的正整数，并且开头不能为零'));
      } else {
        return callback();
      }
    };

    const checkPositiveIntVaildator = (rule, value, callback) => {
      // 不能为空格和数字校验
      if (!intWithZero.reg.test(value)) {
        return callback(new Error(intWithZero.msg));
      } else {
        return callback();
      }
    };

    return {
      resolveXlsDialogVisible: false,
      //禁止商品选择的回调钩子，定金商品不允许选择
      enableHandler: function(row) {
        return !row.frontMoneyItem;
      },
      suitStoreTypeEnum,
      showStoreDialog: false,
      id: null,
      queryParams: null,
      storeList: [],
      originStoreList: [],
      errorStoreList: [],
      groupStoreList: [],
      canModify: true,
      form: {
        activityName: '', // 活动名称
        itemName: '', // 商品名称
        itemNo: '', // 商品编号
        skuId: '', // 商品规格id
        thumbnail: '', // 对应规格商品图片
        salePrice: '', // 商品原价，应该是取规格价格
        lowestPriceBuy: 1, // 是否最低价购买，
        lowestPrice: '', // 砍价最低价
        dateRange: [], // 活动时间（"startTime": "2018-11-05T02:38:19.082Z",  "endTime": "2018-11-05T02:38:19.082Z",）
        bargainDuration: '', // 砍价时间
        bargainPeople: '', // 砍价达成人数
        virtualPeople: '', // 虚拟参与人数
        bargainTimes: '', // 砍价活动次数限制
        suitStoreType: suitStoreTypeEnum.all,
        maxBargainCount: '', // 发起砍价次数
        maxAssistCount: '',
        bargainLimitType: 0, // 发起砍价时间限制 0：本周期；1：每天
        assistLimitType: 0 // 帮砍时间限制 0：本周期；1：每天
      },
      rules: {
        activityName: [
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
        itemNo: {
          required: true,
          message: '请选择商品'
        },
        lowestPrice: [
          {
            required: true,
            message: '请输入砍价最低价'
          },
          {
            pattern: money.reg,
            message: money.msg
          }
        ],
        dateRange: {
          type: 'array',
          required: true,
          message: '请选择活动时间'
        },
        bargainDuration: [
          {
            required: true,
            message: '请输入砍价时间'
          },
          {
            pattern: positiveInt.reg,
            message: positiveInt.msg
          }
        ],
        bargainPeople: [
          {
            required: true,
            message: '请输入砍价达成人数'
          },
          {
            validator: checkBargainPeople,
            trigger: 'blur'
          }
        ],
        suitStoreType: [{ required: true, validator: storeValidator, trigger: 'change' }],
        maxBargainCount: [
          { required: true, message: '请输入发起砍价次数' },
          {
            validator: checkPositiveIntVaildator,
            trigger: 'blur'
          }
        ],
        maxAssistCount: [
          { required: true, message: '请输入帮砍价次数' },
          {
            validator: checkPositiveIntVaildator,
            trigger: 'blur'
          }
        ]
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
      },
      dialog: {
        goods: false
      },
      isLoading: false,
      validateLoading: false,
      cutpriceActivityStatus, // 砍价活动状态常量
      curStatus: cutpriceActivityStatus.NOT_STARTED, // 当前的活动状态
      storeIds: '',
      createStoreId: null,
      disabled: false
    };
  },

  computed: {
    errorStoreListIds() {
      return this.errorStoreList.map(i => i.id);
    },
    isEdit() {
      return !!this.id && !this.copy;
    },
    ...mapState({
      curApp: 'curApp',
      allStoreList: 'storeList',
      env: 'env',
      roleList: 'roleList',
      curStore: 'curStore'
    }),

    // 店长角色
    isStoreKeeper() {
      return !!~this.roleList.split(',').indexOf('common_role_storeKeeper');
    },

    // 企业管理员
    isEnterpriseManager() {
      return !!~this.roleList.split(',').indexOf('common_role_enterprise');
    },

    singleStore() {
      return this.allStoreList && this.allStoreList.length === 1 && this.isStoreKeeper;
    }
  },

  watch: {
    'form.itemNo'() {
      const form = this.$refs.elForm;
      form.validateField('itemNo');
    }
  },

  mounted() {
    const id = this.$route.query.id;
    this.copy = this.$route.query.copy || false;
    this.disabled = this.$route.query.disabled ? !!+this.$route.query.disabled : false;

    if (!this.isEnterpriseManager) {
      this.form.suitStoreType = suitStoreTypeEnum.part;
    }

    if (!id) {
      return;
    }

    this.id = id;
    bargainApi.detail(id).then(
      res => {
        if (!res.data) {
          // 请求后端成功，但返回data为空（data为空，id有可能是乱填的），把id置为null
          this.id = null;
          this.$router.push('/marketing/cutprice/activity/edit');
          return;
        }

        this.setFormData(res.data || {});
      },
      () => {
        // 异常，路径去掉id进入新建态
        this.id = null;
        this.$router.push('/marketing/cutprice/activity/edit');
      }
    );
  },

  methods: {
    onShowGoods() {
      if (this.isEdit) {
        return;
      }
      this.dialog.goods = true;
    },
    onRemoveGoods() {
      this.storeList = [];
      this.assembleGroupStoreList();

      this.setGoods({});
    },
    onGoodsChange(info) {
      this.storeList = [];
      this.assembleGroupStoreList();

      this.setGoods(info);
    },
    setGoods(info) {
      this.form.itemName = info.itemName || '';
      this.form.itemNo = info.itemNo || '';
      this.form.skuId = info.skuId || '';
      this.form.thumbnail = info.thumbnail || '';
      this.form.salePrice = info.salePrice || '';
      this.queryParams = {
        itemNo: info.itemNo
      };
    },

    handleSelectStore() {
      this.showStoreDialog = true;
    },
    handleImportStore() {
      this.resolveXlsDialogVisible = true;
    },

    onResolveImportStore(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.elForm.validateField('suitStoreType');
    },
    onStoreChoosed(storeList) {
      this.storeList = storeList;
      this.assembleGroupStoreList();
      this.$refs.elForm.validateField('suitStoreType');
    },
    handleDelStoreItem(groupIndex, storeIndex) {
      this.storeList.splice(groupIndex * storeGroupCount + storeIndex, 1);
      this.assembleGroupStoreList();
      this.$refs.elForm.validateField('suitStoreType');
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
    /**
     * 填充表单数据
     */
    setFormData(data) {
      for (const key in this.form) {
        if (key === 'dateRange') {
          if (data.startTime && data.endTime) {
            this.form.dateRange = [new Date(data.startTime), new Date(data.endTime)];
          }
          continue;
        } else if (key === 'lowestPrice') {
          this.form.lowestPrice = data.lowestPrice / 100;
          continue;
        }
        this.form[key] = data[key];
      }
      if (data.storeBriefVOS) {
        this.storeList = data.storeBriefVOS;
        this.originStoreList = [...(this.storeList || [])];
        this.assembleGroupStoreList();
      } else if (data.storeIds) {
        this.form.suitStoreType = suitStoreTypeEnum.part;
        let storeIdList = data.storeIds.split(',');
        storeIdList = storeIdList.filter(storeId => {
          return !!storeId;
        });
        storeIdList.forEach(storeId => {
          const findStore = this.allStoreList.find(store => {
            return store.id === parseInt(storeId);
          });
          if (findStore) {
            this.storeList.push(findStore);
          }
        });
        this.originStoreList = [...(this.storeList || [])];
        this.assembleGroupStoreList();
      } else {
        this.form.suitStoreType = suitStoreTypeEnum.all;
      }
      this.queryParams = {
        itemNo: this.form.itemNo
      };
      this.canModify = data.canModify;
      // 当前的活动状态
      this.curStatus = data.activityStatus;
      this.storeIds = data.storeIds || '';
      this.createStoreId = data.createStoreId;

      if (this.copy) {
        this.curStatus = cutpriceActivityStatus.NOT_STARTED;
        this.form.activityName = data.activityName + '-复制';
      }

      if (this.copy && data.activityStatus !== cutpriceActivityStatus.ENDED) {
        this.setGoods({});
      }

      if (!this.isEnterpriseManager && !this.disabled) {
        this.form.suitStoreType = suitStoreTypeEnum.part;
      }
    },
    onSave() {
      if (this.validateLoading) return;

      this.validateLoading = true;
      this.$refs.elForm.validate(valid => {
        this.validateLoading = false;

        if (!valid) {
          return;
        }
        this.save();
      });
    },
    save() {
      const params = { ...this.form };
      // 服务端接受时间格式必须带T和Z
      const timemat = 'YYYY-MM-DD HH:mm:ss';
      params.startTime = utilDate.format(this.form.dateRange[0], timemat);
      params.endTime = utilDate.format(this.form.dateRange[1], timemat);
      params.lowestPrice = parseInt(params.lowestPrice * 100);
      delete params.dateRange;

      let methodProp = 'create';
      if (this.isEdit) {
        params.id = this.id;
        methodProp = 'update';
      }
      if (this.form.suitStoreType === suitStoreTypeEnum.part) {
        params.storeIds = '';
        const len = this.storeList.length;
        if (this.singleStore) {
          params.storeIds = this.allStoreList[0].id;
        } else {
          this.storeList.forEach((store, index) => {
            params.storeIds += store.id;
            if (index < len - 1) {
              params.storeIds += ',';
            }
          });
        }
      }
      this.isLoading = true;

      bargainApi[methodProp](params)
        .done(res => {
          this.$message({
            message: this.isEdit ? '修改成功' : '创建成功。',
            type: 'success'
          });
          this.$router.push('/marketing/cutprice/activity/list');
        })
        .always(() => {
          this.isLoading = false;
        });
    },
    onCancle() {
      if (this.curStatus === cutpriceActivityStatus.DELETED) {
        this.$router.push('/marketing/cutprice/delete');
      } else {
        this.$router.push('/marketing/cutprice/activity/list');
      }
    },
    async queryUnavaliableStoreList() {
      if (this.form.itemNo) {
        let { data } = await bargainApi.queryUnavaliableStore({
          itemNo: this.form.itemNo,
          skuId: this.form.skuId,
          activityId: this.id
        });
        // 全部门店不可用
        const all = (data || []).some(i => i.id === -1);
        if (all) {
          data = [...this.storeList];
        }

        // 排除原先门店
        const originStoreIds = this.originStoreList.map(i => i.id);
        return { all, list: (data || []).filter(i => !originStoreIds.includes(i.id)) };
      }
      return { all: false, list: [] };
    }
  }
};
</script>

<style lang="less">
@import './edit.less';
</style>

<style lang="less" scoped>
.store-list-box {
  /deep/ .el-tag {
    margin-right: 10px;
  }
  margin-left: 150px;
}
</style>
