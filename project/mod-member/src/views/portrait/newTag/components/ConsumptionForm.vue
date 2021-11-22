<template>
  <el-form
    :disabled="!canEdit"
    :model="consumptionForm"
    :rules="consumptionFormRules"
    label-width="150px"
    ref="consumptionForm"
  >
    <!-- 计算时间 -->
    <el-form-item label="选择计算时间：" prop="calcTime">
      <span>在最近的</span>
      <!-- <el-input-number :min="0" v-model="consumptionForm.calcTime"></el-input-number> -->
      <el-input style="width: 60px" v-model.number="consumptionForm.calcTime"></el-input>
      <span>天内</span>
      <p class="tip-text">*计算时间非必填：若不设置时间，则默认以商家成立以来的时间计算，以下同理</p>
    </el-form-item>
    <!-- 消费商品 -->
    <el-form-item label="选择消费商品：" prop="production">
      <el-radio-group v-model="consumptionForm.production">
        <el-radio label="all">全部商品</el-radio>
        <el-radio @click.native="canEdit && (showSelectProductDialog = true)" label="specific_goods">指定商品</el-radio>
        <el-radio @click.native="canEdit && (showSelectCategoryDialog = true)" label="specific_category"
          >指定分类</el-radio
        >
        <el-radio @click.native="canEdit && (showSelectProductLabelDialog = true)" label="goods_tag">商品标签</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 指定消费商品 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.consumptionForm.targetList.length &&
        formData.conditionForm.consumptionForm.production === 'specific_goods'
      "
    >
      <el-table :data="formData.conditionForm.consumptionForm.targetList" style="width: 500px">
        <el-table-column label="商品名" prop="name"></el-table-column>
        <el-table-column label="价格" :formatter="priceFormatter" prop="price"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 指定商品分类 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.consumptionForm.targetList.length &&
        formData.conditionForm.consumptionForm.production === 'specific_category'
      "
    >
      <el-table :data="formData.conditionForm.consumptionForm.targetList" style="width: 500px">
        <el-table-column label="分类" prop="name"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 指定商品标签 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.consumptionForm.targetList.length &&
        formData.conditionForm.consumptionForm.production === 'goods_tag'
      "
    >
      <el-table :data="formData.conditionForm.consumptionForm.targetList" style="width: 500px">
        <el-table-column label="商品标签" prop="name"></el-table-column>
        <el-table-column label="覆盖商品数" prop="coverNumber"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 可选项目 -->
    <el-form-item prop="productionOptions">
      <el-checkbox-group v-model="consumptionForm.productionOptions">
        <div>
          <el-checkbox label="累计消费金额"></el-checkbox>
          <!-- 累计消费金额表单 -->
          <el-form
            :disabled="!consumptionForm.productionOptions.includes('累计消费金额') || !canEdit"
            :inline="true"
            :model="consumptionForm.feeOptionForm"
            :rules="feeOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="feeOptionForm"
          >
            <el-form-item prop="low">
              <el-input
                placeholder="最低值"
                style="width: 80px"
                v-model.number="consumptionForm.feeOptionForm.low"
              ></el-input>
              <span>元~</span>
            </el-form-item>
            <el-form-item prop="high">
              <el-input
                placeholder="最高值"
                style="width: 80px"
                v-model.number="consumptionForm.feeOptionForm.high"
              ></el-input>
              <span>元</span>
            </el-form-item>
            <el-form-item>
              <span class="tip-text">*最高值可不填，不填默认值为∞（无穷大），以下 “最高值” 同理</span>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-checkbox label="累计消费次数"></el-checkbox>
          <!-- 累计消费次数表单 -->
          <el-form
            :disabled="!consumptionForm.productionOptions.includes('累计消费次数') || !canEdit"
            :inline="true"
            :model="consumptionForm.countOptionForm"
            :rules="countOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="countOptionForm"
          >
            <el-form-item prop="low">
              <el-input
                placeholder="最低值"
                style="width: 80px"
                v-model.number="consumptionForm.countOptionForm.low"
              ></el-input>
              <span>次~</span>
            </el-form-item>
            <el-form-item prop="high">
              <el-input
                placeholder="最高值"
                style="width: 80px"
                v-model.number="consumptionForm.countOptionForm.high"
              ></el-input>
              <span>次</span>
            </el-form-item>
          </el-form>
        </div>

        <div>
          <el-checkbox label="上次消费距今"></el-checkbox>
          <!-- 上次消费距今表单 -->
          <el-form
            :disabled="!consumptionForm.productionOptions.includes('上次消费距今') || !canEdit"
            :inline="true"
            :model="consumptionForm.lastOptionForm"
            :rules="lastOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="lastOptionForm"
          >
            <el-form-item prop="condition">
              <el-select style="width: 160px" v-model="consumptionForm.lastOptionForm.condition">
                <el-option
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  v-for="item in [
                    { label: '超过', value: 'gt' },
                    { label: '不超过（含等于）', value: 'lt' },
                  ]"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="day">
              <el-input style="width: 80px" v-model.number="consumptionForm.lastOptionForm.day"></el-input>天
            </el-form-item>
          </el-form>
        </div>
      </el-checkbox-group>
    </el-form-item>

    <!-- 指定商品对话框 -->
    <GoodsSelectDialog
      :active-tabs="activeTabs"
      :selected-list="goods"
      @selected="onProductChoosed"
      enable-multiple
      v-model="showSelectProductDialog"
    ></GoodsSelectDialog>

    <!-- 指定分类对话框 -->
    <ClassifySelectDialog
      :active-tabs="activeTabs"
      :selected-categories="categories"
      @choose="onCategoryChoosed"
      v-model="showSelectCategoryDialog"
    ></ClassifySelectDialog>

    <!-- 商品标签对话框 -->
    <ConditionTagDialog @change="onChangeProductLabel" v-model="showSelectProductLabelDialog"></ConditionTagDialog>
  </el-form>
</template>

<script>
  import { mapState } from 'vuex';
  import { validator as elValidator } from '@/dss-common/utils';
  import ConditionTagDialog from './ConditionTagDialog';
  import { ClassifySelectDialog, GoodsSelectDialog, goodsTypeEnum } from '@/register/wechat3rd';

  export default {
    name: 'ConsumptionForm',
    components: { ConditionTagDialog, GoodsSelectDialog, ClassifySelectDialog },
    inject: ['canEdit', 'formData'],
    watch: {
      'consumptionForm.production': {
        handler(newVal, oldVal) {
          // 避免选择打标条件选择商品 展示表格重复渲染同样数据
          if (newVal !== oldVal) this.formData.conditionForm.consumptionForm.targetList = [];
        },
      },
      consumptionForm: {
        deep: true,
        handler(val) {
          if (!this.consumptionForm.productionOptions.includes('累计消费金额')) this.$refs.feeOptionForm.resetFields();
          if (!this.consumptionForm.productionOptions.includes('累计消费次数'))
            this.$refs.countOptionForm.resetFields();
          if (!this.consumptionForm.productionOptions.includes('上次消费距今')) this.$refs.lastOptionForm.resetFields();
        },
      },
    },
    data() {
      return {
        // 消费打标条件指定商品
        goods: [],
        goodsTypeEnum,
        showSelectProductDialog: false,
        // 消费打标条件指定分类
        categories: [],
        showSelectCategoryDialog: false,
        // 消费打标条件指定商品标签
        goodTags: [],
        showSelectProductLabelDialog: false,

        consumptionForm: this.formData.conditionForm.consumptionForm,

        // 消费选项 消费选项标签规则
        consumptionFormRules: {
          calcTime: [{ validator: elValidator.numOrEmptyStr, trigger: 'blur' }],
          productionOptions: [{ required: true, message: '请选择消费打标条件', trigger: 'blur' }],
          production: [
            {
              validator: (rule, val, cb) => {
                if (
                  this.formData.conditionForm.consumptionForm.production !== 'all' &&
                  this.formData.conditionForm.consumptionForm.targetList.length === 0
                ) {
                  cb(new Error('请选择至少一个消费商品'));
                } else cb();
              },
              trigger: 'blur',
            },
          ],
        },
        // 消费选项 累计消费金额规则
        feeOptionFormRules: {
          low: [
            {
              type: 'number',
              message: '请输入正确的数值',
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val < this.consumptionForm.feeOptionForm.high || this.consumptionForm.feeOptionForm.high === '') {
                    this.$refs.feeOptionForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('最低值需要小于最高值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: elValidator.numOrEmptyStr,
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (val > this.consumptionForm.feeOptionForm.low || this.consumptionForm.feeOptionForm.high === '') {
                    this.$refs.feeOptionForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('最高值需要大于最低值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
        // 消费选项 累计消费次数规则
        countOptionFormRules: {
          low: [
            {
              type: 'number',
              message: '请输入正确的数值',
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (
                    val < this.consumptionForm.countOptionForm.high ||
                    this.consumptionForm.countOptionForm.high === ''
                  ) {
                    this.$refs.countOptionForm.clearValidate('low');
                    cb();
                  } else {
                    cb(new Error('最低值需要小于最高值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
          high: [
            {
              validator: elValidator.numOrEmptyStr,
              trigger: 'blur',
            },
            {
              validator: (rule, val, cb) => {
                if (val < 0) {
                  cb(new Error('请输入大于零的正整数'));
                } else {
                  if (
                    val > this.consumptionForm.countOptionForm.low ||
                    this.consumptionForm.countOptionForm.high === ''
                  ) {
                    this.$refs.countOptionForm.clearValidate('high');
                    cb();
                  } else {
                    cb(new Error('最高值需要大于最低值'));
                  }
                }
              },
              trigger: 'blur',
            },
          ],
        },
        // 消费选项 上次消费距今规则
        lastOptionFormRules: {
          day: [
            {
              type: 'number',
              message: '请输入正确的数值，数值需要为正数',
              min: 0,
              trigger: 'blur',
            },
          ],
        },
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      activeTabs() {
        console.log([goodsTypeEnum.server, goodsTypeEnum.product], '000');
        return this.env.BEAUTIFUL ? [goodsTypeEnum.server, goodsTypeEnum.product] : [goodsTypeEnum.product];
      },
    },
    methods: {
      onChangeProductLabel(selectedTags) {
        console.log('已选商品', selectedTags);
        this.goodTags = selectedTags;
        const selectedItems = this.goodTags.map(item => ({
          id: item.id,
          name: item.label,
          coverNumber: item.coverNumber,
        }));
        this.formData.conditionForm.consumptionForm.targetList = selectedItems;
      },
      // 选择商品
      onProductChoosed(selectedProducts) {
        console.log('已选商品', selectedProducts);
        this.goods = selectedProducts;
        const selectedItems = this.goods.map(item => ({
          id: item.id,
          name: item.name,
          price: item.salePrice,
        }));
        this.formData.conditionForm.consumptionForm.targetList = selectedItems;
      },
      // 选择分类
      onCategoryChoosed(selectedCategories) {
        console.log('已选分类', selectedCategories);
        this.categories = selectedCategories;
        const selectedItems = this.categories.map(item => ({
          id: item.id,
          name: item.category,
        }));
        this.formData.conditionForm.consumptionForm.targetList = selectedItems;
        console.log(selectedItems);
      },
      // formatter
      priceFormatter(row, col, cellVal, index) {
        return cellVal ? (cellVal / 100).toFixed(2) : '';
      },
    },
  };
</script>
