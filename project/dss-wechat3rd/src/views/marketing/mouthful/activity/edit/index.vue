<template>
  <div class="discount-edit" v-loading="isLoading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container" style="border-bottom: 1px solid #dcdee0;">
      <template v-if="!!deleteShow">
        <el-breadcrumb-item :to="{ path: '/marketing/mouthful/discard' }">删除的活动</el-breadcrumb-item>
        <el-breadcrumb-item>详情</el-breadcrumb-item>
      </template>
      <template v-else>
        <el-breadcrumb-item :to="{ path: '/marketing/mouthful/activity/list' }">活动管理</el-breadcrumb-item>
        <el-breadcrumb-item>{{ isEdit ? '修改' : '创建' }}活动</el-breadcrumb-item>
      </template>
    </el-breadcrumb>

    <el-form :model="form" :rules="rules" label-width="120px" ref="elForm" size="mini" class="discount-edit-form"  :disabled="!!isDisabled">
      <el-form-item label="活动名称：" prop="name">
        <el-input v-model="form.name"  placeholder="请输入活动名称"></el-input><span class="tip-msg" style="margin-left:20px">2-15中文字符</span>
      </el-form-item>

      <el-form-item label="活动时间：" prop="activityTime">
        <el-date-picker
          v-model="form.activityTime"
          type="datetimerange"
          :picker-options="options"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
          align="right"
        ></el-date-picker>
      </el-form-item>

      <!--选择商品-->
      <el-form-item label="选择商品："
                    prop="goodsType">
        <el-radio-group v-model="form.goodsType">
          <div class="radio-box">
            <el-radio :label="distcountEnum.type.goods">指定商品</el-radio>
            <el-button plain href="javascript:;" v-if="form.goodsType===distcountEnum.type.goods"  @click="onShowGoods()">选择商品</el-button>
          </div>
          <div class="radio-box">
            <el-radio :label="distcountEnum.type.category">指定分类</el-radio>
            <el-button plain href="javascript:;"  v-if="form.goodsType===distcountEnum.type.category"   @click="onShowCategory()">选择分类</el-button>
          </div>
          <!-- <div class="radio-box">
            <el-radio :label="distcountEnum.type.all">全部商品</el-radio>
          </div> -->
        </el-radio-group>
      </el-form-item>
      <!-- <div class="tip-msg" style="margin-left:30px">提示：单个商品只能参加一个活动</div> -->


      <div >
        <el-table class="wkt-table goods-table"
                      max-height="333"
                      :data="goodsList"
                      v-if="form.goodsType===distcountEnum.type.goods">
              <el-table-column label="名称">
                <template slot-scope="scope">
                  {{ scope.row.name }}
                </template>
              </el-table-column>
              <el-table-column label="售价(￥)"
                              prop="salePrice">
                <span slot-scope="scope">{{scope.row.salePrice | price}}</span>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <a class="table-delete"
                    href="javascript:;"
                    @click="handleDelProductItem( scope.$index)">删除</a>
                </template>
              </el-table-column>
            </el-table>
            <div class="category-box"
                v-if="form.goodsType===distcountEnum.type.category">
              <div class="category-label">分类名称</div>
              <div class="category-content">
                <div class="category-item-box" v-for="(category, index) in categoryList" :key="index">
                  <el-tag @close="handleDelCategoryItem(index)"
                          closable>{{category.category||category.name}}
                  </el-tag>
                </div>
              </div>
          </div>
      </div>

      <el-form-item label="优惠设置："
                    prop="sameItemSwitch">
        <el-radio-group v-model="form.sameItemSwitch">
          <div class="radio-box">
            <el-radio :label="distcountEnum.sameItemSwitchStatus.YES">不限同款</el-radio>
            <div class="tip" >购买不同的商品，价格低的享受此优惠，例：100元3件任选指定商品</div>
          </div>
          <div class="radio-box">
            <el-radio :label="distcountEnum.sameItemSwitchStatus.NO">限同款</el-radio>
            <div class="tip" >购买同款商品，享受此优惠，例：100元3件同款商品。</div>
          </div>
        </el-radio-group>
      </el-form-item>


     <el-form-item label="优惠内容："
                    prop="activityContent">
            <el-input style="width:112px;margin-right: 10px;"  v-model="form.ladder.price"/><span>元</span>
            <el-input style="width:112px;margin:0 10px;"  v-model="form.ladder.count"/><span>件</span>
            <div class="tip" >如：100元（不含运费）任选3件。</div>
      </el-form-item>

      <el-form-item label="购买限制：" prop="buyLimit">
          每人可购买 <el-input
              style="width:112px"
              v-model="form.buyLimit"/> 件
              <span class="tip-msg" style="margin-left:10px">填写为“0”时不限购，限购数量不能小于优惠条件的件数</span>
      </el-form-item>


      <el-form-item label="优惠叠加："
                    prop="withOthersPreferential">
        <el-radio-group v-model="form.withOthersPreferential">
          <div class="radio-box">
            <el-radio :label="distcountEnum.withOthersPreferentialStatus.NO">不可叠加</el-radio>
          </div>
          <div class="radio-box">
            <el-radio :label="distcountEnum.withOthersPreferentialStatus.YES">可叠加</el-radio>
            <div class="tip" style="width:350px">可以与其他促销活动（优惠券，礼品卡，红包，会员折扣）叠加使用</div>
          </div>
        </el-radio-group>
      </el-form-item>

      <el-form-item
        prop="suitStoreType"
        class="coupon-label dss-star"
        label="参与活动的门店："
        :disabled="!!isDisabled"
      >
        <el-radio-group
          v-if="isEnterpriseManager"
          v-model="form.suitStoreType"
        >
        <div class="radio-box">
          <el-radio :label="suitStoreTypeEnum.all">全部门店</el-radio>
        </div>
        <div class="radio-box">
          <el-radio :label="suitStoreTypeEnum.part"
              >选定门店
              <el-button
                v-if="form.suitStoreType === suitStoreTypeEnum.part"
                @click="handleSelectStore()"
                >选择门店
              </el-button>
            </el-radio>
        </div>
        </el-radio-group>
        <el-button v-else-if="!isEnterpriseManager"  @click="handleSelectStore()"
          >选择门店</el-button
        >
      </el-form-item>

      <div
        class="store-list-box"
        v-if="selectedStoresList &&
            selectedStoresList.length &&
            form.suitStoreType === suitStoreTypeEnum.part">
        <div class="store-label">已选门店</div>
        <div
          class="store-item-box">
          <el-tag
            v-for="(store, storeIndex) in selectedStoresList"
            :key="store.id"
            @close="handleDelStoreItem(storeIndex)"
            closable
            >{{ store.name }}</el-tag>
        </div>
      </div>


      <div class="bottom-button" v-if="!isDisabled">
        <el-button @click="onCancle">{{ isDisabled ? '取消' : '关闭' }}</el-button>
        <el-button
          type="primary"
          @click="onSave"
          >保存</el-button
        >
      </div>
    </el-form>

    <div class="bottom-button" v-if="!!isDisabled">
      <el-button @click="onCancle">{{ isDisabled ? '取消' : '关闭' }}</el-button>
    </div>

    <!-- 选择商品弹框 -->
    <goods-select-dialog
      enable-multiple
      v-model="showGoodsDialog"
      :enable-handler="enableHandler"
      :selected-list="goodsList"
      :extParams="{'tagNoEqualsList[0]':1<<17}"
      disabled-tip="定金类商品不允许参与活动"
      @selected="onSelectGoods"
    />

    <!-- 选择分类弹框 -->
    <category-select-dialog v-model="showSelectCategoryDialog"
                              @choosed="onCategoryChoosed"
                              :selected-categories="categoryList">
    </category-select-dialog>

    <!-- 选择门店弹框 -->
    <store-select-dialog
      :selected-stores="selectedStoresList"
      enable-multiple
      api-url="/wp/store/query/dept"
      :is-all="true"
      v-model="showStoreDialog"
      @choosed="onStoreChoosed"
    ></store-select-dialog>

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
import distcountEnum from '@/dss-wechat3rd/src/constants/distcountEnum.js';
import utilDate from '@/dss-common/utils/date.js';
import api from '@/dss-wechat3rd/src/constants/index.js';
import discountApi from '@/dss-wechat3rd/src/api/discount.js';
import LocalResolveXls from '@/dss-wechat3rd/src/bz_components/local-resolve-xls';
import CategorySelectDialog from '@/dss-wechat3rd/src/bz_components/category-select-dialog/index.vue';

// 将form对象中的商品价格(元)进行价格换算，转换成发送后端价格参数(分)，以及将商品信息参数封装在itemList中进行接口请求
const convert = {
  labelPrice: v => v * 100,
  salePrice: v => v * 100,
  seckillPrice: v => v * 100,
  buyLimit: v => parseInt(v)
};

export default {
  components: {
    GoodsSelectDialog,
    StoreSelectDialog,
    LocalResolveXls,
    CategorySelectDialog
  },

  data() {
    // 正则常量中的规则
    const { money, positiveInteger, positiveNumber } = regexps;

    // 选择门店校验规则
    const storeValidator = (rule, value, callback) => {
      if (this.isEnterpriseManager) {
        if (this.form.suitStoreType === suitStoreTypeEnum.all) {
          return callback();
        } else {
          if (this.selectedStoresList && this.selectedStoresList.length) {
            return callback();
          } else {
            return callback('请选择门店');
          }
        }
      } else {
        if (
          (this.selectedStoresList && this.selectedStoresList.length) ||
          this.form.suitStoreType == suitStoreTypeEnum.all
        ) {
          return callback();
        } else {
          return callback('请选择门店');
        }
      }
    };

    // 优惠校验规则
    const activityValidator = (rule, value, callback) => {
      if (!positiveInteger.reg.test(this.form.ladder.count)) {
        return callback(positiveInteger.msg);
      }
      if (!money.reg.test(this.form.ladder.price)) {
        return callback(money.msg);
      }
      return callback();
    };

    const goodsValidator = (rule, value, callback) => {
      if (this.form.goodsType === distcountEnum.type.goods) {
        if (!this.goodsList || !this.goodsList.length) {
          return callback('请选择商品');
        }
      } else if (this.form.goodsType === distcountEnum.type.category) {
        if (!this.categoryList || !this.categoryList.length) {
          return callback('请选择分类');
        }
      }
      return callback();
    };

    const timeValidator = (rule, value, callback) => {
      // bugfix: 解决已删除活动中提示校验
      if (this.deleteShow) {
        return callback();
      }
      let now = new Date();
      if (this.form.activityTime && this.form.activityTime[1] < now) {
        return callback('活动结束时间不能早于当前时间');
      }
      return callback();
    };

    return {
      resolveXlsDialogVisible: false,
      //禁止商品选择的回调钩子，定金商品不允许选择
      enableHandler: function(row) {
        return !row.frontMoneyItem;
      },
      goodsList: [],
      categoryList: [],
      isLoading: false,
      copy: 0, //复制
      activityId: null, // 活动ID
      deleteShow: false, // 是否为删除列表页面进入
      isDisabled: 0, // 是否允许编辑，0是允许，1是不允许
      suitStoreTypeEnum, // 使用门店类型常量
      distcountEnum, //常量
      form: {
        name: '', // 活动名称
        activityTime: [], // 活动时间（"startTime": "2019-08-30 00:00:00",  "endTime": "2019-09-30 00:00:00",）
        goodsType: distcountEnum.type.goods,
        buyLimit: 0, // 购买限制
        suitStoreType: suitStoreTypeEnum.all, // 参与活动的门店
        withOthersPreferential: distcountEnum.sameItemSwitchStatus.YES,
        sameItemSwitch: distcountEnum.sameItemSwitchStatus.NO,
        activityContent: distcountEnum.activityContentEnum.halfFare.value,
        ladder: {
          count: null,
          price: null
        }
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

      showGoodsDialog: false, // 是否显示选择商品弹框
      showStoreDialog: false, // 是否显示选择门店弹框
      showSelectCategoryDialog: false, // 是否显示选择分类弹框
      queryStoreListParams: null, // 查询门店列表参数
      selectedStoresList: [], // 选中的门店列表
      storeIds: '',
      seckillActivityStatus, // 活动状态常量
      rules: {
        // 活动名称
        name: [
          { required: true, message: '请输入活动名称' },
          {
            min: 2,
            max: 15,
            message: '请输入2到15字符'
          }
        ],
        // 活动时间
        activityTime: [
          {
            type: 'array',
            required: true,
            message: '请选择活动时间'
          },
          {
            validator: timeValidator,
            trigger: 'change'
          }
        ],
        goodsType: [{ required: true, validator: goodsValidator, trigger: 'change' }],
        // 优惠设置
        sameItemSwitch: {
          required: true,
          message: '请选择优惠设置'
        },

        // 优惠内容
        activityContent: [
          {
            required: true,
            message: '请选择优惠内容'
          },
          { validator: activityValidator, trigger: 'change' }
        ],
        withOthersPreferential: {
          required: true,
          message: '请选择优惠叠加'
        },
        // 限购数量
        buyLimit: [
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
        money
      }
    };
  },

  computed: {
    ...mapState({
      env: 'env',
      roleList: 'roleList'
    }),
    //企业管理员
    isEnterpriseManager() {
      // return !!~this.roleList.split(',').indexOf('common_role_enterprise');
      return true;
    },

    //判断当前操作为编辑
    isEdit() {
      return !!this.activityId && !this.copy;
    }
  },

  mounted() {
    this.activityId = this.$route.query.id || null;
    this.isDisabled = this.$route.query.isDisabled || 0;
    this.deleteShow = this.$route.query.deleteShow ? Number(this.$route.query.deleteShow) : 0;
    this.copy = this.$route.query.copy || 0;
    this.getDetail(); // 查询该活动详情
  },
  methods: {
    getDetail() {
      // 查询该活动详情
      if (!!this.activityId) {
        const params = {
          id: this.activityId
        };

        discountApi.query(params).then(res => {
          if (res.data) {
            this.setFormData(res.data);
          }
        });
      }
    },

    /**
     * 显示商品选择弹框
     */
    onShowGoods() {
      if (this.isDisabled) {
        return;
      }
      this.showGoodsDialog = true;
    },

    onShowCategory() {
      if (this.isDisabled) {
        return;
      }
      this.showSelectCategoryDialog = true;
    },

    /**
     * 删除商品
     */
    onRemoveGoods() {
      this.form.goods = null;
      this.form.itemList = [];
    },

    handleDelProductItem(index) {
      this.goodsList.splice(index, 1);
    },

    handleDelCategoryItem(index) {
      this.categoryList.splice(index, 1);
    },

    /**
     * 完成商品选择
     */
    onSelectGoods(row) {
      this.goodsList = row;
      this.$refs.elForm.validateField('goodsType');
    },

    /**
     * 完成分类选择
     */
    onCategoryChoosed(row) {
      this.categoryList = row;
      this.$refs.elForm.validateField('goodsType');
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
     * 填充表单数据
     */
    setFormData(data) {
      // 活动名称
      this.form.name = data.name;
      // 活动时间
      if (data.startTime && data.endTime) {
        this.form.activityTime = [new Date(data.startTime), new Date(data.endTime)];
      }
      //是否可用和其他营销共用
      this.form.withOthersPreferential = data.withOthersPreferential;
      ///是否允许跨商品
      this.form.sameItemSwitch = data.sameItemSwitch;
      ///购买数量限制
      this.form.buyLimit = data.buyLimit;
      //门店,有数据就是部分门店，无时所有
      if (data.storeBriefs) {
        this.form.suitStoreType = suitStoreTypeEnum.part;
        this.selectedStoresList = data.storeBriefs;
      } else {
        this.form.suitStoreType = suitStoreTypeEnum.all;
      }
      ///商品分类数据
      if (!!data.itemBriefs) {
        this.form.goodsType = distcountEnum.type.goods;
        this.goodsList = data.itemBriefs;
      } else if (!!data.categoryBriefs) {
        this.form.goodsType = distcountEnum.type.category;
        this.categoryList = data.categoryBriefs;
      } else {
        this.form.goodsType = distcountEnum.type.all;
      }
      //优惠内容
      this.form.activityContent = data.activityContent;
      //自定义优惠
      if (data.ladderDTOList) {
        this.form.ladder.count = data.ladderDTOList[0].threshold;
        this.form.ladder.price = data.ladderDTOList[0].discount / 100; // 优惠金额/折扣/固定金额
      }
    },

    //获取商品数据
    getMap() {
      let staticRuleMap = {};
      let staticRuleList = [];
      if (this.form.goodsType == distcountEnum.type.all) {
        return null;
      }
      if (this.form.goodsType == distcountEnum.type.goods) {
        staticRuleList = this.goodsList || [];
        staticRuleMap[this.form.goodsType] = staticRuleList.map(staticRule => {
          return {
            isExclusion: 0, //是否为排除类型 0非排除 1是排除
            restrictType: this.form.goodsType,
            restrictId: staticRule.itemNo
          };
        });
      } else {
        staticRuleList = this.categoryList || [];
        staticRuleMap[this.form.goodsType] = staticRuleList.map(staticRule => {
          return {
            isExclusion: 0, //是否为排除类型 0非排除 1是排除
            restrictType: this.form.goodsType,
            restrictId: staticRule.id
          };
        });
      }
      return staticRuleMap;
    },

    /**
     * 保存活动
     */
    onSave() {
      this.$refs.elForm.validate(valid => {
        if (!valid) {
          return;
        }
        const params = { ...this.form };
        // 服务端接受时间格式为年月日时分秒
        const timemat = 'YYYY-MM-DD HH:mm:ss';
        // 活动时间
        params.startTime = utilDate.format(this.form.activityTime[0], timemat);
        params.endTime = utilDate.format(this.form.activityTime[1], timemat);
        params.staticRuleMap = this.getMap();
        delete params.activityTime;
        delete params.goodsType;
        if (this.form.suitStoreType === suitStoreTypeEnum.part) {
          params.storeIds = [];
          this.selectedStoresList.forEach((store, index) => {
            params.storeIds.push(store.id);
          });
        }

        //优惠内容计算
        let ladderDTOList = [];
        let ladderDTO = {};
        //一口价
        ladderDTO.discountByTotalSwitch = 1; //是否按总价金额计算 0单件价格为基础计算 1总价为基础计算
        ladderDTO.thresholdType = 1; //门槛类型 0几件 1 多少钱
        ladderDTO.discountType = distcountEnum.discountTypeEnum.price; //优惠类型 为0时 DISCOUNT是折扣 为1 时候 DISCOUNT为扣减金额  2固定金额
        ladderDTO.threshold = this.form.ladder.count; //门槛,满多少件或者满多少钱
        ladderDTO.discount = this.form.ladder.price * 100; // 优惠金额/折扣/固定金额
        ladderDTOList.push(ladderDTO);
        params.ladderDTOList = ladderDTOList;
        params.ruleName = this.form.ladder.price + '元' + this.form.ladder.count + '件';
        //一口价
        params.activityType = distcountEnum.activityTypeEnum.FIXED_PRICE.value;

        let key = 'create';
        if (this.isEdit) {
          params.id = this.activityId;
          key = 'update';
        }
        discountApi[key](params).then(res => {
          if (res.data) {
            this.$message({
              type: 'success',
              message: '操作成功!'
            });
            this.$router.push('/marketing/mouthful/activity/list');
            return;
          }
        });
      });
    },

    /**
     * 取消或关闭活动的创建或修改
     */
    onCancle() {
      this.$router.push('/marketing/mouthful/activity/list');
    }
  }
};
</script>
