<template>
  <div class="goods-combined-edit" v-loading="loading">
    <el-breadcrumb separator="/" class="wkt-breadcrumb-container">
      <el-breadcrumb-item :to="{ path: '/retail/goods-mgr/goods-combined/' + route }" replace
        >{{ isDiscard ? '废弃' : '商品' }}列表</el-breadcrumb-item
      >
      <el-breadcrumb-item>{{ pageStatus }}</el-breadcrumb-item>
    </el-breadcrumb>

    <div class="goods-edit-container">
      <el-form
        class="goods-form"
        :model="form"
        ref="form"
        :rules="rules"
        label-width="120px"
        :disabled="abandonGoods || isDisabledForm"
        v-if="showForm"
      >
        <!-- 第一部分选择分类及标签区域 -->
        <div class="tab-box">
          <!-- <span class="tab-icon">1</span> -->
          <h3 class="goods-title tab-title">01.选择商品分类</h3>
        </div>
        <!-- 商品类型 -->
        <!-- <el-form-item label="商品类型:" class="goods-label goods-first-part" prop="itemDetailDTO.wxItem.mode">
          <el-select
            style="width: 220px"
            clearable
            :disabled="isDisabledEdit"
            v-model="form.itemDetailDTO.wxItem.mode"
            placeholder="请选择商品类型"
          >
            <el-option label="线上普通商品" :value="0"></el-option>
            <el-option label="积分商品" :value="1"></el-option>
          </el-select>
        </el-form-item> -->
        <!-- 分类 -->
        <el-form-item label="商品分类:" class="goods-label goods-first-part" prop="itemDetailDTO.wxItem.categoryId">
          <goods-category-cascader
            :active-goods-type="goodsTypeEnum.product"
            class="goods-w177 primary-inputHeight"
            ref="goodsCategoryCascader"
            :selected-category="form.itemDetailDTO.wxItem.categoryDTO"
            v-model="form.itemDetailDTO.wxItem.categoryId"
          />
          <el-button type="text" round @click="addClassfiy()" v-if="allowCreateClass" class="combined-add-button"
            >快速增加分类</el-button
          >
        </el-form-item>

        <!-- 标签 -->
        <el-form-item label="商品标签:" class="goods-label goods-first-part">
          <goods-label-select
            class="goods-w177 primary-inputHeight"
            :label-type="labelType"
            :select-label-id="form.itemDetailDTO.wxItem.labelIds"
            ref="labelCascader"
            multiple
            @selectedLabelId="selectedLabelId"
          />
          <el-button type="text" round @click="addLabelPopup()" class="combined-add-button">快速增加标签</el-button>
        </el-form-item>
        <!-- <hr class="goods-hr" /> -->

        <!-- 第二部分填写商品基本信息部分 -->
        <div class="tab-box">
          <!-- <span class="tab-icon">2</span> -->
          <h3 class="goods-title tab-title">02.商品基本信息</h3>
        </div>

        <!-- 标题 -->
        <el-form-item label="组合商品标题:" class="goods-label" prop="itemDetailDTO.wxItem.name">
          <el-input
            placeholder="请输入组合商品标题"
            class="goods-w366 primary-inputHeight"
            v-model="form.itemDetailDTO.wxItem.name"
          ></el-input>
        </el-form-item>

        <!-- 副标题 -->
        <el-form-item label="组合商品副标题:" class="goods-label" prop="itemDetailDTO.wxItem.subName">
          <el-input
            placeholder="请输入组合商品副标题"
            class="goods-w366 primary-inputHeight"
            v-model="form.itemDetailDTO.wxItem.subName"
          ></el-input>
        </el-form-item>

        <!-- 条形码 -->
        <el-form-item label="组合商品条形码:" class="goods-label" prop="itemDetailDTO.wxItem.barcode">
          <span>
            <el-input
              placeholder="支持14位内的数字+英文组合"
              class="goods-w366 primary-inputHeight"
              :disabled="isEdit"
              v-model="form.itemDetailDTO.wxItem.barcode"
            ></el-input>
            <div class="notes">*自定义条形码提交后不可修改，请谨慎填写（注:该项不填写时，系统会自动生成）</div>
          </span>
        </el-form-item>

        <!-- 虚拟销量 -->
        <el-form-item label="虚拟销量:" class="goods-label" prop="itemDetailDTO.wxItem.virtualSalesVolume">
          <span>
            <el-input-number
              :controls="false"
              placeholder="请输入虚拟销量"
              class="goods-w366 primary-inputHeight"
              v-model="form.itemDetailDTO.wxItem.virtualSalesVolume"
            ></el-input-number>
            <div class="notes">前端展示的销量=实际销量+虚拟销量</div>
          </span>
        </el-form-item>

        <!-- 售价 -->
        <template v-if="!form.itemDetailDTO.wxItem.mode">
          <el-form-item label="售价:" class="goods-label" prop="itemDetailDTO.wxItem.salePrice">
            <el-input
              placeholder="请输入价格"
              class="goods-price primary-inputHeight"
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.salePrice"
            ></el-input>
            <span class="goods-unit">元</span>
          </el-form-item>
        </template>

        <!-- 积分售价 -->
        <template v-else>
          <el-form-item label="售价:" class="goods-label" prop="itemDetailDTO.wxItem.integralPrice">
            <el-input
              placeholder="不填或填'0',无需现金"
              class="goods-price primary-inputHeight"
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.salePrice"
            ></el-input>
            <span class="goods-unit">元+</span>
            <el-input
              placeholder="不填或填'0',无需现金"
              class="goods-price primary-inputHeight"
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.integralPrice"
            ></el-input>
            <span class="goods-unit">积分</span>
            <div class="notes">现金和积分相加不可为0,或空</div>
          </el-form-item>
        </template>

        <!-- 成本价 -->
        <el-form-item label="成本价:" class="goods-label" prop="itemDetailDTO.wxItem.costPrice">
          <el-input
            placeholder="请输入价格"
            class="goods-price primary-inputHeight"
            :disabled="isDisabledEdit"
            v-model="form.itemDetailDTO.wxItem.costPrice"
          ></el-input>
          <span class="goods-unit">元</span>
        </el-form-item>

        <!--标价-->
        <el-form-item label="原价标签:" class="goods-label" prop="itemDetailDTO.wxItem.labelPrice">
          <el-input
            placeholder="请输入标价"
            class="goods-price primary-inputHeight"
            :disabled="isDisabledEdit"
            v-model="form.itemDetailDTO.wxItem.labelPrice"
          ></el-input>
          <span class="goods-unit">元</span>
        </el-form-item>

        <el-form-item
          label="每人限购数量:"
          class="goods-label"
          :rules="rules.itemDetailDTO.wxItem.peopleLimitAmount"
          prop="itemDetailDTO.wxItem.peopleLimitAmount"
        >
          <div>
            <el-date-picker
              v-model="form.itemDetailDTO.wxItem.peopleLimitRange"
              :disabled="isEdit && activityList"
              type="daterange"
              range-separator="至"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
            >
            </el-date-picker>
            <span class="goods-unit" style="margin-right: 10px">限购</span>
            <el-input
              placeholder="请输入限购数量"
              :disabled="isEdit && activityList"
              class="goods-price primary-inputHeight"
              v-model.number="form.itemDetailDTO.wxItem.peopleLimitAmount"
            />
            <span class="goods-unit">件</span>
          </div>
          <div class="notes">0为不限购，当商品参加营销活动时，不受此限购数量限制</div>
        </el-form-item>

        <!-- 组合商品 -->
        <el-form-item
          label="组合商品:"
          class="goods-label"
          prop="itemDetailDTO.wxItem.combinationDTOS"
          :rules="[{ validator: reg.checkCombinationCount }]"
        >
          <el-table
            class="wkt-table"
            style="margin: 0 0 20px; width: 800px"
            :data="form.itemDetailDTO.wxItem.combinationDTOS"
            v-if="form.itemDetailDTO.wxItem.combinationDTOS && form.itemDetailDTO.wxItem.combinationDTOS.length > 0"
          >
            <el-table-column label="子商品名称">
              <template slot-scope="scope">
                <div class="goods-desc-box">
                  <img class="goods-img" :src="scope.row.combinationThumbnail" />
                  <div class="goods-desc">
                    <div class="limit-line">
                      {{ scope.row.combinationItemName
                      }}{{ scope.row.combinationItemAttr ? ' (' + scope.row.combinationItemAttr + ')' : '' }}
                    </div>
                    <span class="price">￥{{ scope.row.combinationSalePrice | price }}</span>
                  </div>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="商品数量" width="120" align="center" prop="combinationCount">
              <template slot-scope="scope">
                <el-input v-model="scope.row.combinationCount" :disabled="isDisabledEdit" class="middle-width" />
              </template>
            </el-table-column>
            <el-table-column label="单位" width="120" align="center" prop="combinationUnit"> </el-table-column>
            <el-table-column label="条形码" width="200" prop="combinationBarcode"> </el-table-column>
            <el-table-column label="操作" width="100" align="center" v-if="!abandonGoods && !isDisabledEdit">
              <template slot-scope="scope">
                <a class="table-delete" href="javascript:;" @click="deleteCombinedGoods(scope.row.combinationBarcode)"
                  >删除</a
                >
              </template>
            </el-table-column>
          </el-table>

          <el-button @click="onShowGoods" v-if="!abandonGoods && !isDisabledEdit">选择商品</el-button>
        </el-form-item>

        <!--运费-->
        <el-form-item label="运费设置:" class="goods-label" prop="itemDetailDTO.wxItem.freightTemplateId">
          <div>请设置固定运费或者选择一个运费模板</div>

          <div>
            <span class="freight-label">固定运费: </span>
            <el-input
              placeholder="请输入运费"
              class="goods-price primary-inputHeight"
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.freight"
              @change="onFreightChange"
            ></el-input>
            <span class="goods-unit">元</span>
          </div>

          <div style="margin-top: 10px">
            <span class="freight-label">运费模板: </span>
            <el-select
              style="width: 220px"
              clearable
              :disabled="isDisabledEdit"
              v-model="form.itemDetailDTO.wxItem.freightTemplateId"
              placeholder="请选择运费模板"
            >
              <el-option v-for="tpl in freightTplList" :key="tpl.id" :label="tpl.name" :value="tpl.id"></el-option>
            </el-select>
            <!-- 运费模板展示 -->
            <tpl-area-table :tpl="freightTpl"></tpl-area-table>
          </div>
        </el-form-item>

        <!-- 发票模板 -->
        <el-form-item label="发票模板:" class="goods-label" prop="itemDetailDTO.wxItem.invoiceTemplateId">
          <div class="goods-w366">
            <el-select
              style="width: 100%"
              clearable
              v-model="form.itemDetailDTO.wxItem.invoiceTemplateId"
              placeholder="请选择发票模板"
            >
              <el-option v-for="tpl in invoiceTplList" :key="tpl.id" :label="tpl.name" :value="tpl.id"> </el-option>
            </el-select>
          </div>
        </el-form-item>

        <!--图片-->
        <el-form-item
          label="商品图片:"
          class="goods-label"
          prop="itemDetailDTO.materialsId"
          :style="abandonGoods ? 'pointer-events: none;' : ''"
        >
          <choose-images
            v-model="form.itemDetailDTO.materialsId[index]"
            :is-disabled-edit="isDisabledEdit"
            :height="176"
            style="margin-right: 10px"
            @input="onImageAdd(index)"
            @delete="onDeleteImg(index)"
            :multiple="form.itemDetailDTO.materialsId[index].id === 0"
            v-for="(item, index) in form.itemDetailDTO.materialsId"
            :key="index"
            :limit="limit"
            :disable="goodsImgCountLimit(index)"
          />
          <div style="color: #858c99; font-size: 12px; font-weight: 400; line-height: 15px">
            建议尺寸750*750，建议图片小于2M
          </div>
        </el-form-item>

        <!-- 商品描述 -->
        <el-form-item label="商品描述:" class="goods-label" v-if="form.itemDetailDTO.wxItem">
          <w-editor :data-source="form.itemDetailDTO.wxItem" :image-limit="30"></w-editor>
        </el-form-item>

        <!-- 保存按钮 -->
        <div class="bottom-button">
          <el-button type="primary" class="goods-save" @click="onSubmit('form')">保存</el-button>
        </div>
      </el-form>

      <!-- 快速增加分类 -->
      <goods-classfiy-dialog
        v-if="showGoodsClassfiyDialog"
        :visible.sync="showGoodsClassfiyDialog"
        @onChoiceClassfiy="onChoiceClassfiy"
      ></goods-classfiy-dialog>

      <!-- 增加或修改标签的对话弹框 -->
      <goods-label-dialog
        v-if="showEditLabelPopup"
        :visible.sync="showEditLabelPopup"
        :edit-title="editTitle"
        :label-edit-obj="labelEditObj"
        @refresh-data="refreshData"
      ></goods-label-dialog>

      <!-- 选择商品弹框 -->
      <goods-select-dialog v-model="showGoodsDialog" choose-sku enable-multiple @selected="onSelectGoods" />
    </div>
  </div>
</template>
<script>
  import './edit.less';
  import { mapState } from 'vuex';
  import goodsTypeEnum from '@/dss-wechat3rd/src/constants/goodsTypeEnum.js';

  import services from '@/dss-common/utils/services';
  import constants from '@/dss-wechat3rd/src/constants/index';
  import utils from '@/dss-common/utils/index.js';
  import moneyUtil from '@/dss-common/utils/money';
  import regex from '@/dss-wechat3rd/src/constants/regex';

  import goodsCategoryCascader from '@/dss-wechat3rd/src/bz_components/goods-category-cascader/index.vue';
  import goodsClassfiyDialog from '@/dss-wechat3rd/src/bz_components/goods-classfiy-dialog/index.vue';

  import GoodsLabelSelect from '@/dss-wechat3rd/src/bz_components/goods-label-select/index.vue';
  import goodsLabelDialog from '@/dss-wechat3rd/src/bz_components/goods-label-dialog/index.vue';

  import wxFreightTplApi from '@/dss-wechat3rd/src/api/wx-freight-tpl-api.js';
  import tplAreaTable from '@/dss-wechat3rd/src/views-retail/warehouse/freight-tpl/tpl-area-table.vue';

  import wxInvoiceTplApi from '@/dss-setting/src/api/wx-invoice-tpl-api';

  import goodsSelectDialog from '@/dss-wechat3rd/src/bz_components/goods-select-dialog/index.vue';

  import chooseImages from '@/dss-wechat3rd/src/components/SingleChooseImage/index.vue';

  import WEditor from '@/dss-wechat3rd/src/components/wEditor/index.vue';

  import appFeaturesMixin from '@/dss-common/mixins/app-features-mixin';

  export default {
    mixins: [appFeaturesMixin],
    components: {
      goodsCategoryCascader, // 分类级联选择
      chooseImages, // 选择图片
      WEditor, // 富文本编辑
      GoodsLabelSelect, // 标签下拉选择
      goodsClassfiyDialog, // 快速增加分类对话弹框
      goodsLabelDialog, // 快速增加标签对话弹框
      goodsSelectDialog, // 商品选择对话弹框
      tplAreaTable, // 运费模板选择
    },

    data() {
      const positiveInteger = /^([0-9]*)$/; // 正整数

      // 虚拟销量校验规则
      const checkVolume = (rule, value, callback) => {
        const callbackMsg =
          rule.field === 'itemDetailDTO.wxItem.virtualSalesVolume'
            ? '虚拟销量必须是在0到999999之间的正整数'
            : '限购件数必须是在0到999999之间的正整数';
        if (!positiveInteger.test(value) || value > 999999) {
          return callback(callbackMsg);
        }
        callback();
      };

      // 组合商品数量校验规则
      const checkCombinationCount = (rule, value, callback) => {
        if (!value || value.length < 1) {
          return callback(new Error('请选择组合商品'));
        } else {
          value.forEach(v => {
            if (!v.combinationCount) {
              return callback(new Error('请输入组合商品数量'));
            } else if (!positiveInteger.test(v.combinationCount) || v.combinationCount < 1) {
              return callback(new Error('组合商品数量为大于0的正整数'));
            }
          });
        }
        return callback();
      };

      // 运费模板校验规则
      const freightValidator = (rule, value, callback) => {
        const wxItem = this.form.itemDetailDTO.wxItem;
        if (wxItem.freight && !regex.price.reg.test(wxItem.freight)) {
          callback(Error(regex.price.msg));
        } else {
          callback();
        }
      };

      return {
        loading: false,

        isDiscard: this.$route.path.indexOf('discard-list') > 0, // 是否为废弃商品
        route: this.$route.path.indexOf('discard-list') > 0 ? 'discard-list' : 'goods-list', // 面包屑路由
        isEdit: !!this.$route.query.itemNo, // 是否为编辑

        showForm: false, // 是否显示from表单，为了获取到具体参数之后才渲染子组件

        goodsTypeEnum, // 商品类型

        showGoodsClassfiyDialog: false, // 是否快速增加分类弹框

        showEditLabelPopup: false, // 是否显示编辑标签弹框
        editTitle: '', // 编辑标签弹框标题
        labelEditObj: {
          labelType: 2,
        }, // 用于传给子组件的新增的标签对象
        // 用于传给子组件的选中的标签对象
        labelSelectedObj: {
          labelType: 2, // 默认为组合商品标签
        },
        labelType: 2,

        freightTplList: [], // 运费模板数组
        freightTpl: null, // 选中的运费模板
        invoiceTplList: [], // 发票模板数组

        showGoodsDialog: false, // 是否显示选择商品弹框

        limit: 5, // 商品图片

        form: {
          itemDetailDTO: {
            wxItem: {
              type: goodsTypeEnum.combinationItem.value, // 商品类型为组合商品类型
              categoryId: '', // 分类id
              labelId: '', // 标签id
              labelIds: [],
              name: '', // 商品标题
              subName: '', // 商品副标题
              barcode: '', // 条形码
              virtualSalesVolume: 0, // 虚拟销量
              salePrice: '', // 售价
              costPrice: '', // 成本价
              labelPrice: '', // 标价
              freight: '', // 运费
              combinationDTOS: [], // 组合商品列表
              freightTemplateId: null, // 运费模板id
              invoiceTemplateId: '', // 发票模板id
              describe: '', // 商品描述
              peopleLimitAmount: 0, // 每人限购数量
              peopleLimitRange: '', // 限购时间
              mode: 0,
            },
            materialsId: [], // 商品图片id
            materialUrls: [], // 商品图片链接
          },
        },

        // form表单校验规则
        rules: {
          itemDetailDTO: {
            wxItem: {
              integralPrice: [{ required: true, message: '积分不可为0，或空' }],
              mode: [{ required: true, message: '请选择商品类型', trigger: 'change' }],
              categoryId: [{ required: true, message: '请选择商品分类', trigger: 'change' }],
              name: [
                { required: true, message: '请输入商品名称', trigger: 'blur' },
                {
                  min: 1,
                  max: 80,
                  message: '长度在 1 到 80 个字符',
                  trigger: 'blur',
                },
              ],
              subName: [
                {
                  min: 1,
                  max: 80,
                  message: '长度在 1 到 80 个字符',
                  trigger: 'blur',
                },
              ],
              virtualSalesVolume: [
                {
                  validator: checkVolume.bind(this),
                  trigger: 'blur',
                },
              ],
              peopleLimitAmount: [
                {
                  validator: checkVolume.bind(this),
                  trigger: 'blur',
                },
              ],
              salePrice: [
                {
                  required: true,
                  validator: regex.goods.checkSalePrice,
                  trigger: 'blur',
                },
              ],
              costPrice: [
                {
                  required: false,
                  validator: regex.goods.checkCostPrice,
                  trigger: 'blur',
                },
              ],
              labelPrice: [
                {
                  required: true,
                  validator: regex.goods.checkLabelPrice,
                  trigger: 'blur',
                },
              ],
              freightTemplateId: [
                {
                  validator: freightValidator.bind(this),
                  trigger: 'change',
                },
              ],
            },
            materialsId: [
              {
                required: true,
                validator: regex.goods.checkGoodsMaterialsId,
                trigger: 'change',
              },
            ],
          },
        },
        // 行内表单验证规则
        reg: {
          checkCombinationCount, // 组合商品数量校验规则
        },
      };
    },

    computed: {
      ...mapState({
        env: 'env',
        roleList: 'roleList',
      }),
      // 当前页面状态
      pageStatus: function () {
        if (this.isDiscard) {
          return '详情';
        } else if (this.$route.query.itemNo) {
          return '编辑';
        }
        return '添加';
      },

      // 是否废弃商品
      abandonGoods() {
        if (this.$route.query.status == 0) {
          return true;
        }
        return false;
      },
      // 是否允许快速创建分类
      allowCreateClass() {
        if (this.roleList === 'common_role_admin' || this.roleList === 'common_role_enterprise') {
          return true;
        } else {
          return false;
        }
      },
      // 是否不允许编辑敏感信息
      isDisabledEdit() {
        if (this.$route.query.isDisabledEdit && this.$route.query.isDisabledEdit != 0) {
          return true;
        }
        return false;
      },
      // 是否不允许编辑整个商品
      isDisabledForm() {
        if (this.$route.query.isDisabledForm && this.$route.query.isDisabledForm != false) {
          return true;
        }
        return false;
      },

      // 图片选择最大限制
      maxLength() {
        if (this.isXiCha) {
          this.limit = 15;
          return 15;
        } else {
          this.limit = 5;
          return 5;
        }
      },

      // 商品图索引最大限制
      goodsImgCountLimit() {
        return function (index) {
          if (this.isXiCha) {
            return index < 15;
          } else {
            return index < 5;
          }
        };
      },
      activityList() {
        const item = this.form.itemDetailDTO.wxItem;
        const preSell = item.preSell;
        const group = item.pt;
        const cutPrice = item.bargain;
        const seckill = item.seckill;
        const integralItem = item.integralItem;

        if (preSell || group || cutPrice || seckill || integralItem) {
          return true;
        }
        return false;
      },
    },
    watch: {
      // 监听运费模板
      'form.itemDetailDTO.wxItem.freightTemplateId': {
        handler(newVal, oldVal) {
          if (newVal) {
            this.freightTpl = this.freightTplList.find(tpl => {
              return tpl.id === newVal;
            });
          } else {
            this.freightTpl = null;
          }
        },
      },
      freightTplList: {
        handler(newVal, oldVal) {
          this.freightTpl = this.freightTplList.find(tpl => {
            return tpl.id === this.form.itemDetailDTO.wxItem.freightTemplateId;
          });
        },
      },
    },

    mounted() {
      if (this.$route.query.itemNo) {
        this.getGoodsDetail(); // 查询商品详情
      } else {
        this.initGoodsMaterials(); // 初始化商品图片素材
        this.showForm = true; // 显示from表单
      }
      this.getFreightTplList(); // 获取运费模板列表
      this.getInvoiceTplList(); // 获取发票模板列表
    },
    methods: {
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
        // salePrice:售价 , freight: 运费
        if (itemDetailDTO.wxItem) {
          itemDetailDTO.wxItem.salePrice = convert(itemDetailDTO.wxItem.salePrice);
          itemDetailDTO.wxItem.labelPrice = convert(itemDetailDTO.wxItem.labelPrice);
          if (itemDetailDTO.wxItem.costPrice) {
            itemDetailDTO.wxItem.costPrice = convert(itemDetailDTO.wxItem.costPrice);
          }
          itemDetailDTO.wxItem.freight = convert(itemDetailDTO.wxItem.freight);
          itemDetailDTO.wxItem.weight = itemDetailDTO.wxItem.weight || 0;
        }
        // sku 对应规格价格
        if (itemDetailDTO.skuInfoList) {
          itemDetailDTO.skuInfoList.forEach(item => {
            item.labelPrice = convert(item.labelPrice);
            item.salePrice = convert(item.salePrice);
          });
        }
      },

      /**
       * 获取商品详情
       */
      getGoodsDetail() {
        const params = {
          itemNo: this.$route.query.itemNo,
          status: this.$route.query.status,
        };
        services
          .get(constants.Api.goods.detail, {
            params,
            action: '商品详情',
          })
          .done(res => {
            this.showForm = true; // 显示from表单

            this.convertMoneyUnit(res.data, true); // 钱的单位转换

            if (res.data.wxItem.labelIds) {
              res.data.wxItem.labelIds = res.data.wxItem.labelIds.split(',').map(id => {
                return parseInt(id);
              });
            } else if (res.data.wxItem.labelId) {
              res.data.wxItem.labelIds = [res.data.wxItem.labelId];
            } else {
              res.data.wxItem.labelIds = [];
            }

            this.form.itemDetailDTO = { ...this.form.itemDetailDTO, ...res.data };

            // 将获取到的选中的标签对象赋值
            const { peopleLimitRange } = this.form.itemDetailDTO.wxItem;

            if (peopleLimitRange) {
              this.form.itemDetailDTO.wxItem.peopleLimitRange = peopleLimitRange.split(',');
            }

            this.initGoodsMaterials(); // 初始化商品图片素材
          });
      },

      /**
       * 添加分类
       */
      addClassfiy() {
        this.showGoodsClassfiyDialog = true;
      },
      /**
       * 选择分类关闭弹窗后执行的函数
       */
      onChoiceClassfiy(categoryDTO) {
        if (categoryDTO && categoryDTO.id) {
          this.form.itemDetailDTO.wxItem.categoryId = categoryDTO.id;
        }
        // 触发分类列表子组件的获取分类列表刷新函数
        this.$refs.goodsCategoryCascader.listCategories(list => {
          this.$set(this.form.itemDetailDTO.wxItem, 'categoryDTO', categoryDTO);
        });
      },

      /**
       * 选中的标签
       */
      selectedLabelId(labelIds) {
        this.form.itemDetailDTO.wxItem.labelIds = labelIds;
      },
      /**
       * 打开快速增加标签弹窗
       */
      addLabelPopup() {
        this.showEditLabelPopup = true;
        this.editTitle = '快速增加标签';
      },
      /**
       * 监控子组件发射回来的方法，以便于新增标签之后刷新数据
       */
      refreshData(data) {
        // 将获取到的选中的标签对象赋值
        this.form.itemDetailDTO.wxItem.labelIds.push(data.labelId);
        this.$refs.labelCascader.labelList(); // 父组件通知标签列表组件刷新数据
      },

      /**
       * 显示商品选择弹框
       */
      onShowGoods() {
        this.showGoodsDialog = true;
      },
      /**
       * 完成商品选择，添加分销商品
       */
      onSelectGoods(itemList = []) {
        // 给每个商品添加一个数量的参数
        itemList.forEach(item => {
          item.combinationCount = null;
        });

        // 组合商品参数赋值
        if (itemList && itemList.length > 0) {
          const selectedCombinationDTOS = this.$plain(this.form.itemDetailDTO.wxItem.combinationDTOS);
          itemList.forEach((item, index) => {
            const combinationItem = {
              combinationBarcode: item.barcode, // 组合商品的商品条形码
              combinationCount: item.combinationCount, // 组合商品数量
              combinationSalePrice: item.salePrice, // 组合商品售价
              combinationItemName: item.name, // 组合商品名称
              combinationItemNo: item.itemNo, // 组合商品的商品itemNo
              combinationSkuId: item.skuId, // 组合商品的商品skuId
              combinationItemAttr: item.itemAttrAsStr, // 组合商品的规格属性值
              combinationStock: item.itemStock, // 组合商品的库存
              combinationThumbnail: item.thumbnail, // 组合商品缩略图
              combinationUnit: item.unit, // 组合商品单位
            };
            selectedCombinationDTOS.push(combinationItem);
          });

          // 将重复选中的商品去重
          const combinationDTOS = []; // 去重后赋值的数组
          let isRepetition = false; // 是否重复
          selectedCombinationDTOS.forEach(item => {
            isRepetition = combinationDTOS.find(dto => {
              return dto.combinationBarcode === item.combinationBarcode;
            });
            // 判断不是重复的，则添加进新的数组当中
            if (!isRepetition) {
              combinationDTOS.push(item);
            }
          });
          this.form.itemDetailDTO.wxItem.combinationDTOS = combinationDTOS;
        }
      },
      /**
       * 删除组合商品
       */
      deleteCombinedGoods(combinationBarcode) {
        this.form.itemDetailDTO.wxItem.combinationDTOS.forEach((item, index) => {
          if (item.combinationBarcode === combinationBarcode) {
            this.form.itemDetailDTO.wxItem.combinationDTOS.splice(index, 1);
          }
        });
      },

      /**
       * 初始化商品图片素材
       */
      initGoodsMaterials() {
        const materialsId = this.form.itemDetailDTO.materialsId ? this.form.itemDetailDTO.materialsId : [];
        const newUrls = [];
        let materialUrls = this.form.itemDetailDTO.materialUrls;

        if (materialUrls && materialUrls.length) {
          materialUrls.forEach((imgUrl, index) => {
            if (imgUrl) {
              materialsId[index] = {
                id: materialsId[index],
                imgUrl: imgUrl,
              };
              newUrls.push(imgUrl);
            }
          });
          materialUrls = newUrls;
        }

        this.addWaitUploadImage(materialsId, materialUrls);
        this.getLimit();
        this.form.itemDetailDTO.materialsId = materialsId;
        this.form.itemDetailDTO.materialUrls = materialUrls;
      },
      /**
       * 获取商品图片的数量
       */
      getLimit() {
        this.limit = this.maxLength - this.form.itemDetailDTO.materialsId.length + 1;
      },
      /**
       * 添加商品图片
       */
      onImageAdd(index) {
        // 多选返回的是图片数组，遍历数组
        if (index === this.form.itemDetailDTO.materialsId.length - 1) {
          const deletedUrl = this.form.itemDetailDTO.materialsId.splice(index, 1);
          deletedUrl[0].forEach(item => {
            if (this.form.itemDetailDTO.materialsId.length < 5) {
              this.form.itemDetailDTO.materialsId.push(item);
            }
          });
          index = this.form.itemDetailDTO.materialsId.length - 1;
        } else {
          this.form.itemDetailDTO.materialUrls[index] = this.form.itemDetailDTO.materialsId[index].imgUrl;
        }
        this.addWaitUploadImage(this.form.itemDetailDTO.materialsId, this.form.itemDetailDTO.materialUrls, index);
        this.getLimit();
      },
      /**
       * 更新图片列表
       */
      addWaitUploadImage(materialsId, materialUrls, index) {
        if (utils.isUndefined(index) || index === materialsId.length - 1) {
          materialUrls.push('');
          materialsId.push({
            id: 0,
            imgUrl: '',
          });
        }
      },
      /**
       * 删除图片
       */
      onDeleteImg(index) {
        this.form.itemDetailDTO.materialsId.splice(index, 1);
        this.form.itemDetailDTO.materialUrls.splice(index, 1);
        this.getLimit();
      },

      /**
       * 获取运费模板列表
       */
      getFreightTplList() {
        this.loading = true;
        const params = {
          pageNo: 1,
          pageSize: 1000,
        };
        wxFreightTplApi
          .getTplList(params)
          .done(res => {
            this.freightTplList = res.data || [];
          })
          .always(() => {
            this.loading = false;
          });
      },
      /**
       * 变更运费模板，手动触发验证
       */
      onFreightChange() {
        this.$refs.form.validateField('itemDetailDTO.wxItem.freightTemplateId');
      },

      /**
       * 获取发票模板列表
       */
      getInvoiceTplList() {
        const params = {
          pageNo: 1,
          pageSize: 1000,
        };
        wxInvoiceTplApi
          .getInvoice(params)
          .then(res => {
            this.invoiceTplList = res.data || [];
            // 默认选中默认模板
            this.form.itemDetailDTO.wxItem.invoiceTemplateId = res.data[0].id || '';
          })
          .always(() => {
            this.loading = false;
          });
      },

      /**
       * 保存商品
       */
      onSubmit(formName) {
        this.$refs[formName].validate(valid => {
          if (valid) {
            const params = this.$plain(this.form.itemDetailDTO);
            const materialsId = params.materialsId.slice();
            params.materialsId = [];
            // params.materialUrls = [];

            // materialsId 使用 id填充 && materialUrls 去空
            materialsId.forEach(item => {
              if (item && item.id && params.materialUrls.indexOf(item.imgUrl) === -1) {
                // params.materialsId.push(item.id);
                params.materialUrls.push(item.imgUrl);
              }
            });
            params.materialUrls = params.materialUrls.filter(url => {
              return !!url;
            });

            this.convertMoneyUnit(params, false); // 钱的单位转换

            // 组合商品数量参数类型转化为数字
            params.wxItem.combinationDTOS.forEach(item => {
              item.combinationCount = Number(item.combinationCount);
            });

            if (params.wxItem.peopleLimitRange) {
              params.wxItem.peopleLimitRange = params.wxItem.peopleLimitRange.join(',');
            } else {
              params.wxItem.peopleLimitRange = 0;
            }

            // 标签id
            if (params.wxItem.labelIds && params.wxItem.labelIds.length) {
              params.wxItem.labelIds = params.wxItem.labelIds.join(',');
            } else {
              params.wxItem.labelIds = '';
            }

            const url = this.$route.query.itemNo ? constants.Api.goods.update : constants.Api.goods.add;

            this.loading = true;
            services
              .post(url, params, {
                headers: {
                  'Content-Type': 'application/json',
                },
                transformRequest: function (data, config, test) {
                  return JSON.stringify(data);
                },
                action: '添加商品',
              })
              .done(res => {
                this.$router.back();
              })
              .always(() => {
                this.loading = false;
              });
          } else {
            return false;
          }
        });
      },
    },
  };
</script>
