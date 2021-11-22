<template>
  <el-form :disabled="!canEdit" :model="sceanForm" :rules="sceanFormRules" label-width="150px" ref="sceanForm">
    <!-- 计算时间 -->
    <el-form-item label="选择计算时间：" prop="calcTime">
      <span>在最近的</span>
      <!-- <el-input-number :min="0" v-model="sceanForm.calcTime"></el-input-number> -->
      <el-input style="width: 60px" v-model.number="sceanForm.calcTime"></el-input>
      <span>天内</span>
    </el-form-item>
    <!-- 浏览商品 -->
    <el-form-item label="选择浏览商品：" prop="production">
      <el-radio-group v-model="sceanForm.production">
        <el-radio label="all">全部商品</el-radio>
        <el-radio @click.native="canEdit && (showSelectProductDialog = true)" label="specific_goods">指定商品</el-radio>
        <el-radio @click.native="canEdit && (showSelectCategoryDialog = true)" label="specific_category"
          >指定分类</el-radio
        >
        <el-radio @click.native="ifConditionTagDialogVisible = true" label="goods_tag">商品标签</el-radio>
      </el-radio-group>
    </el-form-item>

    <!-- 指定消费商品 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.sceanForm.targetList.length &&
        formData.conditionForm.sceanForm.production === 'specific_goods'
      "
    >
      <el-table :data="formData.conditionForm.sceanForm.targetList" style="width: 500px">
        <el-table-column label="商品名" prop="name"></el-table-column>
        <el-table-column label="价格" :formatter="priceFormatter" prop="price"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 指定商品分类 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.sceanForm.targetList.length &&
        formData.conditionForm.sceanForm.production === 'specific_category'
      "
    >
      <el-table :data="formData.conditionForm.sceanForm.targetList" style="width: 500px">
        <el-table-column label="分类" prop="name"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 指定商品分类 表格 -->
    <el-form-item
      v-if="
        formData.conditionForm.sceanForm.targetList.length &&
        formData.conditionForm.sceanForm.production === 'goods_tag'
      "
    >
      <el-table :data="formData.conditionForm.sceanForm.targetList" style="width: 500px">
        <el-table-column label="商品标签" prop="name"></el-table-column>
        <el-table-column label="覆盖商品数" prop="coverNumber"></el-table-column>
      </el-table>
    </el-form-item>

    <!-- 可选项目 -->
    <el-form-item prop="sceanOptions">
      <el-checkbox-group v-model="sceanForm.sceanOptions">
        <div>
          <el-checkbox label="累计浏览次数"></el-checkbox>
          <!-- 累计浏览次数表单 -->
          <el-form
            :disabled="!sceanForm.sceanOptions.includes('累计浏览次数') || !canEdit"
            :inline="true"
            :model="sceanForm.countOptionForm"
            :rules="countOptionFormRules"
            class="inline-form"
            label-width="150px"
            ref="countOptionForm"
          >
            <el-form-item prop="low">
              <el-input
                placeholder="最低值"
                style="width: 80px"
                v-model.number="sceanForm.countOptionForm.low"
              ></el-input>
              <span>次~</span>
            </el-form-item>
            <el-form-item prop="high">
              <el-input
                placeholder="最高值"
                style="width: 80px"
                v-model.number="sceanForm.countOptionForm.high"
              ></el-input>
              <span>次</span>
            </el-form-item>
          </el-form>
        </div>
      </el-checkbox-group>
      <p class="tip-text">*累计浏览次数为所有选中的商品浏览次数之和</p>
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
    <ConditionTagDialog @change="onChangeProductLabel" v-model="ifConditionTagDialogVisible"></ConditionTagDialog>
  </el-form>
</template>

<script>
  import { mapState } from 'vuex';
  import { validator as elValidator } from '@/dss-common/utils';
  import ConditionTagDialog from './ConditionTagDialog';
  import { ClassifySelectDialog, GoodsSelectDialog, goodsTypeEnum } from '@/register/wechat3rd';

  export default {
    name: 'SceanForm',
    components: { ConditionTagDialog, GoodsSelectDialog, ClassifySelectDialog },
    inject: ['canEdit', 'formData'],
    watch: {
      'sceanForm.production': {
        handler(newVal, oldVal) {
          // 避免选择打标条件选择商品 展示表格重复渲染同样数据
          if (newVal !== oldVal) this.formData.conditionForm.sceanForm.targetList = [];
        },
      },
      sceanForm: {
        deep: true,
        handler() {
          if (!this.sceanForm.sceanOptions.includes('累计浏览次数')) this.$refs.countOptionForm.resetFields();
        },
      },
    },
    data() {
      return {
        // 浏览打标条件指定商品
        goods: [],
        goodsTypeEnum,
        showSelectProductDialog: false,
        // 消费打标条件指定分类
        categories: [],
        showSelectCategoryDialog: false,

        sceanForm: this.formData.conditionForm.sceanForm,
        ifConditionTagDialogVisible: false,

        // 验证规则
        sceanFormRules: {
          calcTime: [{ validator: elValidator.numOrEmptyStr, trigger: 'blur' }],
          sceanOptions: [{ required: true, message: '请选择浏览打标条件', trigger: 'change' }],
          production: [
            {
              validator: (rule, val, cb) => {
                if (
                  this.formData.conditionForm.sceanForm.production !== 'all' &&
                  this.formData.conditionForm.sceanForm.targetList.length === 0
                ) {
                  cb(new Error('请选择至少一个消费商品'));
                } else cb();
              },
              trigger: 'blur',
            },
          ],
        },
        // 浏览选项 累计浏览次数规则
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
                  if (val < this.sceanForm.countOptionForm.high || this.sceanForm.countOptionForm.high === '') {
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
                  if (val > this.sceanForm.countOptionForm.low || this.sceanForm.countOptionForm.high === '') {
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
      };
    },
    computed: {
      ...mapState({
        env: 'env',
      }),
      activeTabs() {
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
        this.formData.conditionForm.sceanForm.targetList = selectedItems;
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
        this.formData.conditionForm.sceanForm.targetList = selectedItems;
      },
      // 选择分类
      onCategoryChoosed(selectedCategories) {
        console.log('已选分类', selectedCategories);
        this.categories = selectedCategories;
        const selectedItems = this.categories.map(item => ({
          id: item.id,
          name: item.category,
        }));
        this.formData.conditionForm.sceanForm.targetList = selectedItems;
        console.log(selectedItems);
      },
      // formatter
      priceFormatter(row, col, cellVal, index) {
        return cellVal ? (cellVal / 100).toFixed(2) : '';
      },
    },
  };
</script>
